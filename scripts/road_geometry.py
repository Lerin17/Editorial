from __future__ import annotations

import json
from collections.abc import Iterable, Mapping, Sequence
from dataclasses import dataclass
from math import isfinite
from pathlib import Path
from typing import Literal

import cv2
import numpy as np
from shapely.geometry import GeometryCollection, LineString, Polygon, mapping
from shapely.geometry.base import BaseGeometry
from shapely.ops import unary_union

RoadClass = Literal["SMALL", "MEDIUM", "LARGE"]
Coordinate = tuple[int, int]
CLASS_ORDER: tuple[RoadClass, ...] = ("SMALL", "MEDIUM", "LARGE")

# These are output geometry widths in image-coordinate units, independent of raster measurements.
SMALL_ROAD_WIDTH = 8.0
MEDIUM_ROAD_WIDTH = 16.0
LARGE_ROAD_WIDTH = 32.0
DEFAULT_GEOMETRY_WIDTHS: dict[RoadClass, float] = {
    "SMALL": SMALL_ROAD_WIDTH,
    "MEDIUM": MEDIUM_ROAD_WIDTH,
    "LARGE": LARGE_ROAD_WIDTH,
}
CLASS_COLORS: dict[RoadClass, tuple[int, int, int]] = {
    "SMALL": (70, 220, 90),
    "MEDIUM": (40, 180, 255),
    "LARGE": (255, 110, 60),
}


@dataclass
class RoadGeometry:
    segment_id: int
    road_class: RoadClass
    geometry_width_px: float
    median_raster_width_px: float | None
    centerline: list[Coordinate]
    geometry: BaseGeometry


def build_segment_geometries(
    segments: Iterable[
        tuple[int, RoadClass | None, Sequence[Coordinate], float | None]
    ],
    geometry_widths: Mapping[RoadClass, float],
) -> tuple[list[RoadGeometry], list[int]]:
    for road_class in CLASS_ORDER:
        width = geometry_widths.get(road_class)
        if width is None or not isfinite(width) or width <= 0:
            raise ValueError(f"Geometry width for {road_class} must be finite and positive.")

    geometries: list[RoadGeometry] = []
    omitted_segment_ids: list[int] = []
    for segment_id, road_class, centerline, median_raster_width in segments:
        if road_class is None:
            omitted_segment_ids.append(segment_id)
            continue

        coordinates: list[tuple[float, float]] = []
        previous: Coordinate | None = None
        for row, column in centerline:
            point = (row, column)
            if point == previous:
                continue
            coordinates.append((float(column), float(row)))
            previous = point
        if len(coordinates) < 2:
            omitted_segment_ids.append(segment_id)
            continue

        line = LineString(coordinates)
        geometry_width = float(geometry_widths[road_class])
        polygon = line.buffer(
            geometry_width / 2.0,
            quad_segs=8,
            cap_style="round",
            join_style="round",
        )
        if polygon.is_empty:
            omitted_segment_ids.append(segment_id)
            continue

        geometries.append(
            RoadGeometry(
                segment_id=segment_id,
                road_class=road_class,
                geometry_width_px=geometry_width,
                median_raster_width_px=median_raster_width,
                centerline=list(centerline),
                geometry=polygon,
            )
        )

    return geometries, omitted_segment_ids


def dissolve_geometries_by_class(
    geometries: Sequence[RoadGeometry],
) -> dict[RoadClass, BaseGeometry]:
    dissolved: dict[RoadClass, BaseGeometry] = {}
    for road_class in CLASS_ORDER:
        class_geometries = [
            feature.geometry
            for feature in geometries
            if feature.road_class == road_class
        ]
        if class_geometries:
            dissolved[road_class] = unary_union(class_geometries)
    return dissolved


def _feature(
    geometry: BaseGeometry,
    properties: dict[str, object],
) -> dict[str, object]:
    return {"type": "Feature", "geometry": mapping(geometry), "properties": properties}


def write_geometry_outputs(
    geometries: Sequence[RoadGeometry],
    omitted_segment_ids: Sequence[int],
    output_dir: Path,
) -> dict[RoadClass, BaseGeometry]:
    output_dir.mkdir(parents=True, exist_ok=True)
    segment_features = [
        _feature(
            road.geometry,
            {
                "segment_id": road.segment_id,
                "road_class": road.road_class,
                "geometry_width_px": road.geometry_width_px,
                "median_raster_width_px": road.median_raster_width_px,
            },
        )
        for road in geometries
    ]
    segment_collection = {
        "type": "FeatureCollection",
        "coordinate_space": "image_pixels",
        "axis_order": "x=column,y=row",
        "omitted_segment_ids": list(omitted_segment_ids),
        "features": segment_features,
    }
    (output_dir / "road_segments.geojson").write_text(
        json.dumps(segment_collection),
        encoding="utf-8",
    )

    dissolved = dissolve_geometries_by_class(geometries)
    class_features = [
        _feature(
            dissolved[road_class],
            {
                "road_class": road_class,
                "geometry_width_px": next(
                    road.geometry_width_px
                    for road in geometries
                    if road.road_class == road_class
                ),
                "segment_ids": [
                    road.segment_id
                    for road in geometries
                    if road.road_class == road_class
                ],
            },
        )
        for road_class in CLASS_ORDER
        if road_class in dissolved
    ]
    class_collection = {
        "type": "FeatureCollection",
        "coordinate_space": "image_pixels",
        "axis_order": "x=column,y=row",
        "features": class_features,
    }
    (output_dir / "road_network_by_class.geojson").write_text(
        json.dumps(class_collection),
        encoding="utf-8",
    )
    return dissolved


def _polygon_parts(geometry: BaseGeometry) -> Iterable[Polygon]:
    if isinstance(geometry, Polygon):
        yield geometry
    elif isinstance(geometry, GeometryCollection):
        for part in geometry.geoms:
            yield from _polygon_parts(part)
    elif hasattr(geometry, "geoms"):
        for part in geometry.geoms:
            yield from _polygon_parts(part)


def _pixel_ring(coordinates: Iterable[tuple[float, float]]) -> np.ndarray:
    return np.asarray(
        [(round(x), round(y)) for x, y in coordinates],
        dtype=np.int32,
    )


def render_geometry_overlay(
    road_mask: np.ndarray,
    class_geometries: Mapping[RoadClass, BaseGeometry],
    geometry_widths: Mapping[RoadClass, float],
    output_path: Path,
) -> None:
    height, width = road_mask.shape
    base = np.repeat((road_mask.astype(np.uint8) * 255)[:, :, None], 3, axis=2)
    color_layer = np.zeros_like(base)
    coverage = np.zeros((height, width), dtype=bool)

    for road_class in CLASS_ORDER:
        geometry = class_geometries.get(road_class)
        if geometry is None:
            continue
        class_layer = np.zeros((height, width), dtype=np.uint8)
        for polygon in _polygon_parts(geometry):
            polygon_layer = np.zeros((height, width), dtype=np.uint8)
            cv2.fillPoly(polygon_layer, [_pixel_ring(polygon.exterior.coords)], 255)
            for interior in polygon.interiors:
                cv2.fillPoly(polygon_layer, [_pixel_ring(interior.coords)], 0)
            class_layer = np.maximum(class_layer, polygon_layer)

        class_pixels = class_layer > 0
        color_layer[class_pixels] = CLASS_COLORS[road_class]
        coverage |= class_pixels

    blended = cv2.addWeighted(base, 0.4, color_layer, 0.6, 0)
    diagnostic = base
    diagnostic[coverage] = blended[coverage]

    legend_y = 18
    for road_class in CLASS_ORDER:
        cv2.line(
            diagnostic,
            (8, legend_y - 4),
            (24, legend_y - 4),
            CLASS_COLORS[road_class],
            3,
        )
        cv2.putText(
            diagnostic,
            f"{road_class} {geometry_widths[road_class]:g}px",
            (30, legend_y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.42,
            (255, 255, 255),
            1,
            cv2.LINE_AA,
        )
        legend_y += 18

    output_path.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(output_path), diagnostic):
        raise OSError(f"Could not write geometry overlay: {output_path}")