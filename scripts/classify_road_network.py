from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from math import hypot, isfinite
from pathlib import Path
from typing import Literal

import cv2
import numpy as np
from sklearn.cluster import KMeans
from skimage.morphology import skeletonize

RoadClass = Literal["SMALL", "MEDIUM", "LARGE"]
Coordinate = tuple[int, int]
NodeType = Literal["endpoint", "intersection", "loop"]
CLASS_ORDER: tuple[RoadClass, ...] = ("SMALL", "MEDIUM", "LARGE")
MIN_WIDTH_SAMPLES = 5
PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_IMAGE = PROJECT_ROOT / "public/img/texture/area_tex_3_road_mask.jpg"
DEFAULT_OUTPUT = PROJECT_ROOT / "road_network.json"
DEFAULT_SIMPLIFY_TOLERANCE_PX = 3.0


@dataclass
class SegmentMeasurement:
    segment_id: int
    start_node: int
    end_node: int
    median_width_px: float
    mean_width_px: float
    min_width_px: float
    max_width_px: float
    road_class: RoadClass | None
    width_sample_count: int
    centerline: list[Coordinate]


@dataclass
class RoadNode:
    node_id: int
    coordinate: Coordinate
    node_type: NodeType


@dataclass
class ClassificationResult:
    image_shape: tuple[int, int]
    cluster_centers_px: dict[RoadClass, float]
    class_boundaries_px: dict[str, float]
    nodes: list[RoadNode]
    segments: list[SegmentMeasurement]


def load_road_mask(
    image_path: Path,
    threshold: int | None = None,
    invert: bool = False,
) -> tuple[np.ndarray, np.ndarray, int]:
    grayscale = cv2.imread(str(image_path), cv2.IMREAD_GRAYSCALE)
    if grayscale is None:
        raise FileNotFoundError(f"Could not load road-mask image: {image_path}")

    threshold_mode = cv2.THRESH_BINARY | cv2.THRESH_OTSU
    threshold_value = 0 if threshold is None else threshold
    if threshold is not None:
        threshold_mode = cv2.THRESH_BINARY

    actual_threshold, binary = cv2.threshold(
        grayscale,
        threshold_value,
        255,
        threshold_mode,
    )
    if invert:
        binary = cv2.bitwise_not(binary)

    road_mask = binary > 0
    if not np.any(road_mask):
        raise ValueError("Thresholding produced an empty road mask.")
    if np.all(road_mask):
        raise ValueError("Thresholding marked the entire image as road.")

    return grayscale, road_mask, int(actual_threshold)


def clean_mask_for_skeleton(
    road_mask: np.ndarray,
    closing_iterations: int = 0,
) -> np.ndarray:
    if closing_iterations < 0 or closing_iterations > 1:
        raise ValueError("closing_iterations must be 0 or 1 to preserve topology.")
    if closing_iterations == 0:
        return road_mask.copy()

    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    cleaned = cv2.morphologyEx(
        road_mask.astype(np.uint8) * 255,
        cv2.MORPH_CLOSE,
        kernel,
        iterations=closing_iterations,
    )
    return cleaned > 0


def build_skeleton_graph(skeleton: np.ndarray) -> dict[Coordinate, list[Coordinate]]:
    pixels = {tuple(map(int, point)) for point in np.argwhere(skeleton)}
    graph: dict[Coordinate, list[Coordinate]] = {}

    for row, column in pixels:
        neighbors: list[Coordinate] = []
        for row_delta in (-1, 0, 1):
            for column_delta in (-1, 0, 1):
                if row_delta == 0 and column_delta == 0:
                    continue
                neighbor = (row + row_delta, column + column_delta)
                if neighbor not in pixels:
                    continue
                if row_delta != 0 and column_delta != 0:
                    # Avoid diagonal shortcuts beside already-connected orthogonal pixels.
                    if (
                        (row + row_delta, column) in pixels
                        or (row, column + column_delta) in pixels
                    ):
                        continue
                neighbors.append(neighbor)
        graph[(row, column)] = sorted(neighbors)

    return graph


def group_graph_nodes(
    graph: dict[Coordinate, list[Coordinate]],
) -> tuple[dict[Coordinate, int], set[Coordinate]]:
    node_pixels = {point for point, neighbors in graph.items() if len(neighbors) != 2}
    unassigned = set(node_pixels)
    node_group_by_pixel: dict[Coordinate, int] = {}
    junction_pixels = {
        point for point, neighbors in graph.items() if len(neighbors) >= 3
    }
    group_id = 0

    while unassigned:
        seed = min(unassigned)
        unassigned.remove(seed)
        stack = [seed]
        while stack:
            point = stack.pop()
            node_group_by_pixel[point] = group_id
            for neighbor in graph[point]:
                if neighbor in unassigned:
                    unassigned.remove(neighbor)
                    stack.append(neighbor)
        group_id += 1

    return node_group_by_pixel, junction_pixels


def _edge_key(first: Coordinate, second: Coordinate) -> tuple[Coordinate, Coordinate]:
    return (first, second) if first < second else (second, first)


def simplify_polyline(
    points: list[Coordinate],
    tolerance_px: float,
) -> list[Coordinate]:
    if len(points) <= 2:
        return points.copy()

    keep = bytearray(len(points))
    keep[0] = keep[-1] = 1
    pending = [(0, len(points) - 1)]

    while pending:
        start, end = pending.pop()
        first_row, first_column = points[start]
        last_row, last_column = points[end]
        delta_row = last_row - first_row
        delta_column = last_column - first_column
        length_squared = delta_row**2 + delta_column**2
        maximum_distance = -1.0
        split_index: int | None = None

        for index in range(start + 1, end):
            row, column = points[index]
            if length_squared == 0:
                distance = hypot(row - first_row, column - first_column)
            else:
                projection = (
                    (row - first_row) * delta_row
                    + (column - first_column) * delta_column
                ) / length_squared
                projection = min(1.0, max(0.0, projection))
                closest_row = first_row + projection * delta_row
                closest_column = first_column + projection * delta_column
                distance = hypot(row - closest_row, column - closest_column)

            if distance > maximum_distance:
                maximum_distance = distance
                split_index = index

        if split_index is not None and maximum_distance > tolerance_px:
            keep[split_index] = 1
            pending.append((start, split_index))
            pending.append((split_index, end))

    return [point for index, point in enumerate(points) if keep[index]]


def build_graph_nodes(
    graph: dict[Coordinate, list[Coordinate]],
    node_group_by_pixel: dict[Coordinate, int],
) -> list[RoadNode]:
    pixels_by_group: dict[int, list[Coordinate]] = {}
    for point, group_id in node_group_by_pixel.items():
        pixels_by_group.setdefault(group_id, []).append(point)

    nodes: list[RoadNode] = []
    for group_id in sorted(pixels_by_group):
        pixels = sorted(pixels_by_group[group_id])
        group_pixels = set(pixels)
        external_degree = sum(
            neighbor not in group_pixels
            for point in pixels
            for neighbor in graph[point]
        )
        center_row = sum(point[0] for point in pixels) / len(pixels)
        center_column = sum(point[1] for point in pixels) / len(pixels)
        representative = min(
            pixels,
            key=lambda point: (
                (point[0] - center_row) ** 2 + (point[1] - center_column) ** 2,
                point,
            ),
        )
        nodes.append(
            RoadNode(
                node_id=group_id + 1,
                coordinate=representative,
                node_type="endpoint" if external_degree <= 1 else "intersection",
            )
        )

    return nodes


def trace_skeleton_segments(
    graph: dict[Coordinate, list[Coordinate]],
    node_group_by_pixel: dict[Coordinate, int],
) -> list[tuple[list[Coordinate], int | None, int | None]]:
    visited_edges: set[tuple[Coordinate, Coordinate]] = set()
    segments: list[tuple[list[Coordinate], int | None, int | None]] = []

    for point, neighbors in graph.items():
        point_group = node_group_by_pixel.get(point)
        for neighbor in neighbors:
            neighbor_group = node_group_by_pixel.get(neighbor)
            if point_group is not None and point_group == neighbor_group:
                visited_edges.add(_edge_key(point, neighbor))

    def trace(start: Coordinate, first: Coordinate) -> list[Coordinate]:
        path = [start]
        previous = start
        current = first
        visited_edges.add(_edge_key(previous, current))
        path.append(current)

        for _ in range(len(graph)):
            if current in node_group_by_pixel:
                break
            candidates = [
                neighbor
                for neighbor in graph[current]
                if neighbor != previous
                and _edge_key(current, neighbor) not in visited_edges
            ]
            if not candidates:
                break
            following = min(candidates)
            visited_edges.add(_edge_key(current, following))
            previous, current = current, following
            path.append(current)

        return path

    for point in sorted(node_group_by_pixel):
        point_group = node_group_by_pixel[point]
        for neighbor in graph[point]:
            if node_group_by_pixel.get(neighbor) == point_group:
                continue
            if _edge_key(point, neighbor) in visited_edges:
                continue
            path = trace(point, neighbor)
            if len(path) > 1:
                segments.append(
                    (path, point_group, node_group_by_pixel.get(path[-1]))
                )

    # Any remaining edges belong to closed loops with no endpoints or junctions.
    for point in sorted(graph):
        for neighbor in graph[point]:
            if _edge_key(point, neighbor) in visited_edges:
                continue
            path = trace(point, neighbor)
            if len(path) > 1:
                segments.append((path, None, None))

    return segments


def measure_segments(
    paths: list[tuple[list[Coordinate], int, int]],
    road_mask: np.ndarray,
    distance_transform: np.ndarray,
    junction_pixels: set[Coordinate],
) -> list[SegmentMeasurement]:
    measurements: list[SegmentMeasurement] = []
    for segment_id, (path, start_node, end_node) in enumerate(paths, start=1):
        path_distances = [0.0]
        for first, second in zip(path, path[1:]):
            row_delta = second[0] - first[0]
            column_delta = second[1] - first[1]
            path_distances.append(
                path_distances[-1] + float(np.hypot(row_delta, column_delta))
            )

        junction_clearances = {
            0: float(distance_transform[path[0]])
            if path and path[0] in junction_pixels
            else -1.0,
            len(path) - 1: float(distance_transform[path[-1]])
            if path and path[-1] in junction_pixels
            else -1.0,
        }
        widths = [
            float(distance_transform[row, column] * 2.0)
            for index, (row, column) in enumerate(path)
            if (row, column) not in junction_pixels
            and road_mask[row, column]
            and path_distances[index] > junction_clearances[0]
            and path_distances[-1] - path_distances[index]
            > junction_clearances[len(path) - 1]
        ]
        if len(widths) < MIN_WIDTH_SAMPLES:
            widths = [
                float(distance_transform[row, column] * 2.0)
                for row, column in path
                if road_mask[row, column]
            ]
        if not widths:
            raise ValueError(
                f"Segment {segment_id} has no road-mask pixels for width measurement."
            )

        measurements.append(
            SegmentMeasurement(
                segment_id=segment_id,
                start_node=start_node,
                end_node=end_node,
                median_width_px=float(np.median(widths)),
                mean_width_px=float(np.mean(widths)),
                min_width_px=float(np.min(widths)),
                max_width_px=float(np.max(widths)),
                road_class=None,
                width_sample_count=len(widths),
                centerline=path,
            )
        )
    return measurements


def classify_segment_widths(
    segments: list[SegmentMeasurement],
) -> tuple[dict[RoadClass, float], dict[str, float]]:
    measurable = [segment for segment in segments if segment.median_width_px is not None]
    if len(measurable) < 3:
        raise ValueError(
            f"Need at least 3 measurable road segments for three classes; found {len(measurable)}."
        )

    widths = np.asarray(
        [segment.median_width_px for segment in measurable],
        dtype=np.float64,
    ).reshape(-1, 1)
    if np.unique(widths).size < 3:
        raise ValueError(
            "The measured segment widths contain fewer than 3 distinct values; "
            "three data-derived classes cannot be separated."
        )

    model = KMeans(n_clusters=3, random_state=0, n_init=20)
    model.fit(widths)
    ordered_centers = np.sort(model.cluster_centers_.ravel())
    if np.any(np.diff(ordered_centers) <= 1e-6):
        raise ValueError(
            "K-means produced duplicate class centers; inspect the mask or segment measurements."
        )

    centers: dict[RoadClass, float] = {
        road_class: float(center)
        for road_class, center in zip(CLASS_ORDER, ordered_centers, strict=True)
    }
    boundaries = {
        "small_max": (centers["SMALL"] + centers["MEDIUM"]) / 2.0,
        "medium_max": (centers["MEDIUM"] + centers["LARGE"]) / 2.0,
    }

    for segment in measurable:
        assert segment.median_width_px is not None
        nearest_center = min(
            CLASS_ORDER,
            key=lambda road_class: abs(
                segment.median_width_px - centers[road_class]
            ),
        )
        segment.road_class = nearest_center

    return centers, boundaries


def write_outputs(
    result: ClassificationResult,
    output_path: Path,
) -> None:
    segment_records: list[dict[str, object]] = []
    for segment in result.segments:
        if segment.road_class is None:
            raise ValueError(f"Segment {segment.segment_id} was not classified.")
        segment_records.append(
            {
                "id": segment.segment_id,
                "start_node": segment.start_node,
                "end_node": segment.end_node,
                "class": segment.road_class,
                "width": {
                    "median_px": segment.median_width_px,
                    "mean_px": segment.mean_width_px,
                    "min_px": segment.min_width_px,
                    "max_px": segment.max_width_px,
                },
                "points": [
                    [column, row] for row, column in segment.centerline
                ],
            }
        )

    road_network = {
        "version": 1,
        "source": {
            "image_width_px": result.image_shape[1],
            "image_height_px": result.image_shape[0],
        },
        "classification": {
            "classes": list(CLASS_ORDER),
            "cluster_centers_px": result.cluster_centers_px,
            "boundaries_px": result.class_boundaries_px,
        },
        "nodes": [
            {
                "id": node.node_id,
                "x": node.coordinate[1],
                "y": node.coordinate[0],
                "type": node.node_type,
            }
            for node in result.nodes
        ],
        "segments": segment_records,
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        json.dumps(road_network, indent=2, sort_keys=True, allow_nan=False) + "\n",
        encoding="utf-8",
    )


def nonnegative_float(value: str) -> float:
    number = float(value)
    if not isfinite(number) or number < 0:
        raise argparse.ArgumentTypeError(
            "simplification tolerance must be finite and non-negative"
        )
    return number


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Infer three road-width classes from a binary road-mask image."
    )
    parser.add_argument("--image", type=Path, default=DEFAULT_IMAGE)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument(
        "--threshold",
        type=int,
        help="Optional grayscale threshold (default: infer with Otsu).",
    )
    parser.add_argument(
        "--invert-mask",
        action="store_true",
        help="Use for images where roads are dark and the background is light.",
    )
    parser.add_argument(
        "--closing-iterations",
        type=int,
        choices=(0, 1),
        default=0,
        help="Optional single 3x3 closing before skeletonization; default preserves topology.",
    )
    parser.add_argument(
        "--simplify-tolerance-px",
        type=nonnegative_float,
        default=DEFAULT_SIMPLIFY_TOLERANCE_PX,
        help="RDP centerline simplification tolerance in image pixels (default: 3).",
    )
    return parser.parse_args()


def run_pipeline(args: argparse.Namespace) -> ClassificationResult:
    grayscale, road_mask, _threshold = load_road_mask(
        args.image,
        threshold=args.threshold,
        invert=args.invert_mask,
    )
    skeleton_mask = clean_mask_for_skeleton(
        road_mask,
        closing_iterations=args.closing_iterations,
    )
    skeleton = skeletonize(skeleton_mask)

    # Widths intentionally use the unclosed thresholded mask, not the cleaned skeleton input.
    distance_transform = cv2.distanceTransform(
        road_mask.astype(np.uint8),
        cv2.DIST_L2,
        cv2.DIST_MASK_PRECISE,
    )
    graph = build_skeleton_graph(skeleton)
    node_groups, junction_pixels = group_graph_nodes(graph)
    nodes = build_graph_nodes(graph, node_groups)
    traced_paths = trace_skeleton_segments(graph, node_groups)
    paths: list[tuple[list[Coordinate], int, int]] = []
    next_node_id = len(nodes) + 1
    for path, start_group, end_group in traced_paths:
        if start_group is None and end_group is None:
            loop_node_id = next_node_id
            next_node_id += 1
            nodes.append(
                RoadNode(
                    node_id=loop_node_id,
                    coordinate=path[0],
                    node_type="loop",
                )
            )
            paths.append((path, loop_node_id, loop_node_id))
            continue
        if start_group is None or end_group is None:
            raise ValueError("A traced segment is missing one of its graph nodes.")
        paths.append((path, start_group + 1, end_group + 1))

    segments = measure_segments(
        paths,
        road_mask,
        distance_transform,
        junction_pixels,
    )
    for segment in segments:
        segment.centerline = simplify_polyline(
            segment.centerline,
            args.simplify_tolerance_px,
        )

    centers, boundaries = classify_segment_widths(segments)
    return ClassificationResult(
        image_shape=grayscale.shape,
        cluster_centers_px=centers,
        class_boundaries_px=boundaries,
        nodes=nodes,
        segments=segments,
    )


def main() -> int:
    args = parse_args()
    try:
        result = run_pipeline(args)
        write_outputs(result, args.output)
    except (FileNotFoundError, ValueError, OSError) as error:
        raise SystemExit(f"Road-network classification failed: {error}") from error

    print(f"Road network JSON: {args.output.resolve()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
