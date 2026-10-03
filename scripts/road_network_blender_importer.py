"""
Blender Road Network Importer
-----------------------------
Imports road_network.json produced by the image-analysis stage and creates:

ROAD_NETWORK
├── CENTERLINES
│   ├── SMALL
│   ├── MEDIUM
│   └── LARGE
└── ROAD_MESHES
    ├── SMALL
    ├── MEDIUM
    └── LARGE

The JSON remains the source of truth. This script does NOT use Three.js.

The first geometry pass creates:
- editable Blender Curve objects for the skeleton/centerlines
- planar ribbon Mesh objects for each road segment

The mesh objects can later be replaced/improved with Geometry Nodes,
Boolean/voxel cleanup, intersection processing, etc.
"""

import bpy
import json
import math
from pathlib import Path
from mathutils import Vector


# ============================================================
# CONFIGURATION
# ============================================================

# Easiest workflow:
# Put road_network.json next to the .blend file and leave this as:
JSON_PATH = "D:\\CODE\\Editorial_2\\Editorial\\road_network.json"

# The current road_network.json was generated from the 1241 x 864 image.
# Change these if your exported JSON comes from a different image size.
IMAGE_WIDTH_PX = 1241
IMAGE_HEIGHT_PX = 864

# Blender units represented by one source pixel.
# Keep at 1.0 initially so the geometry corresponds directly to image pixels.
# Change this later when you know the real-world site scale.
PIXEL_TO_BLENDER = 1.0

# Use the procedurally derived cluster centres from the JSON as the initial
# geometry widths. You can override them manually below.
USE_CLUSTER_CENTERS_FOR_WIDTH = True

# Manual fallback / override widths in Blender units.
# These are only used when USE_CLUSTER_CENTERS_FOR_WIDTH = False.
ROAD_WIDTHS = {
    "SMALL": 4.0,
    "MEDIUM": 8.0,
    "LARGE": 17.0,
}

# Global multiplier applied after determining the class width.
ROAD_WIDTH_MULTIPLIER = 1.0

# Skeleton simplification:
# 0 = keep every exported skeleton point.
# A small value such as 0.5-1.5 can be useful later, but start at 0.
SIMPLIFY_POINTS = 0.0

# Remove consecutive points closer than this many source pixels.
MIN_POINT_DISTANCE_PX = 0.05

# Create editable centerline Curve objects.
CREATE_CENTERLINES = True

# Create planar road meshes.
CREATE_ROAD_MESHES = True

# Add Solidify modifier to give road meshes a tiny thickness.
SOLIDIFY_ENABLED = True
SOLIDIFY_THICKNESS = 0.05

# Optional bevel on the resulting road mesh.
# Keep disabled initially; intersections and sharp turns can need more
# deliberate treatment later.
BEVEL_ENABLED = False
BEVEL_AMOUNT = 0.05
BEVEL_SEGMENTS = 2

# Debug materials make the three road classes easy to distinguish.
DEBUG_MATERIALS = True

# Whether to print progress information to Blender's console.
VERBOSE = True


# ============================================================
# HELPERS
# ============================================================

CLASS_NAMES = ("SMALL", "MEDIUM", "LARGE")


def log(message: str) -> None:
    if VERBOSE:
        print(f"[RoadImporter] {message}")


def resolve_json_path() -> Path:
    path = Path(bpy.path.abspath(JSON_PATH)).resolve()
    if not path.exists():
        raise FileNotFoundError(
            f"Could not find road network JSON:\n{path}\n\n"
            "Set JSON_PATH at the top of this script to the correct file."
        )
    return path


def load_network(path: Path) -> dict:
    log(f"Loading JSON: {path}")
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    if "nodes" not in data or "segments" not in data:
        raise ValueError(
            "JSON must contain top-level 'nodes' and 'segments' arrays."
        )

    if "classification" not in data:
        raise ValueError("JSON is missing the 'classification' object.")

    return data


def remove_collection_tree(collection: bpy.types.Collection) -> None:
    """Delete a Blender collection and everything recursively inside it."""
    for child in list(collection.children):
        remove_collection_tree(child)

    for obj in list(collection.objects):
        bpy.data.objects.remove(obj, do_unlink=True)

    bpy.data.collections.remove(collection)


def reset_import_collection(name: str = "ROAD_NETWORK"):
    existing = bpy.data.collections.get(name)
    if existing is not None:
        log("Removing previous ROAD_NETWORK import.")
        remove_collection_tree(existing)

    collection = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(collection)
    return collection


def create_child_collection(parent, name: str):
    collection = bpy.data.collections.new(name)
    parent.children.link(collection)
    return collection


def create_class_collections(root):
    centerlines_root = create_child_collection(root, "CENTERLINES")
    meshes_root = create_child_collection(root, "ROAD_MESHES")

    centerline_collections = {}
    mesh_collections = {}

    for class_name in CLASS_NAMES:
        centerline_collections[class_name] = create_child_collection(
            centerlines_root, class_name
        )
        mesh_collections[class_name] = create_child_collection(
            meshes_root, class_name
        )

    return centerline_collections, mesh_collections


def get_class_widths(data: dict) -> dict:
    classification = data.get("classification", {})
    cluster_centers = classification.get("cluster_centers_px", {})

    if USE_CLUSTER_CENTERS_FOR_WIDTH:
        missing = [c for c in CLASS_NAMES if c not in cluster_centers]
        if missing:
            raise ValueError(
                "JSON does not contain cluster centres for: "
                + ", ".join(missing)
            )

        widths = {
            c: float(cluster_centers[c]) * PIXEL_TO_BLENDER
            for c in CLASS_NAMES
        }
    else:
        widths = {
            c: float(ROAD_WIDTHS[c])
            for c in CLASS_NAMES
        }

    return {
        c: widths[c] * ROAD_WIDTH_MULTIPLIER
        for c in CLASS_NAMES
    }


def image_to_blender(x: float, y: float) -> Vector:
    """
    Convert image coordinates (origin top-left, Y down)
    to Blender XY coordinates (origin image centre, Y up).

    This convention makes the result naturally line up with a
    Blender Image Empty centred at the origin when the same scale
    is used.
    """
    bx = (x - IMAGE_WIDTH_PX / 2.0) * PIXEL_TO_BLENDER
    by = (IMAGE_HEIGHT_PX / 2.0 - y) * PIXEL_TO_BLENDER
    return Vector((bx, by, 0.0))


def clean_points(raw_points):
    """
    Remove consecutive duplicates / near-duplicates.
    Keeps source ordering intact.
    """
    cleaned = []

    min_dist_sq = MIN_POINT_DISTANCE_PX ** 2

    for raw in raw_points:
        if len(raw) < 2:
            continue

        p = Vector((float(raw[0]), float(raw[1])))

        if not cleaned:
            cleaned.append(p)
            continue

        delta = p - cleaned[-1]
        if delta.length_squared >= min_dist_sq:
            cleaned.append(p)

    return cleaned


def perpendicular_normal(tangent: Vector) -> Vector:
    """2D left-hand normal."""
    return Vector((-tangent.y, tangent.x, 0.0))


def compute_tangent(points, index: int) -> Vector:
    n = len(points)

    if n < 2:
        return Vector((1.0, 0.0, 0.0))

    if index == 0:
        tangent = points[1] - points[0]
    elif index == n - 1:
        tangent = points[-1] - points[-2]
    else:
        tangent = points[index + 1] - points[index - 1]

    tangent.z = 0.0

    if tangent.length < 1e-8:
        # Fall back to a nearby usable segment.
        for j in range(1, n):
            test = points[min(index + j, n - 1)] - points[max(index - j, 0)]
            test.z = 0.0
            if test.length >= 1e-8:
                tangent = test
                break

    if tangent.length < 1e-8:
        return Vector((1.0, 0.0, 0.0))

    return tangent.normalized()


def build_ribbon_mesh(points, width: float):
    """
    Build a flat road strip from a centerline.

    This deliberately creates a simple, robust ribbon first.
    It is NOT intended to solve road intersections yet.
    """
    if len(points) < 2:
        return [], []

    half_width = width / 2.0

    left = []
    right = []

    for i, p in enumerate(points):
        tangent = compute_tangent(points, i)
        normal = perpendicular_normal(tangent)

        left.append(p + normal * half_width)
        right.append(p - normal * half_width)

    vertices = []

    for l, r in zip(left, right):
        vertices.append((l.x, l.y, l.z))
        vertices.append((r.x, r.y, r.z))

    faces = []

    # Quads along the road.
    for i in range(len(points) - 1):
        a = i * 2
        b = a + 1
        c = a + 3
        d = a + 2

        faces.append((a, b, c, d))

    return vertices, faces


def create_mesh_object(name, vertices, faces, collection):
    mesh = bpy.data.meshes.new(f"{name}_MeshData")
    mesh.from_pydata(vertices, [], faces)
    mesh.update()

    obj = bpy.data.objects.new(name, mesh)
    collection.objects.link(obj)

    return obj


def create_centerline_curve(name, points, collection):
    curve_data = bpy.data.curves.new(f"{name}_CurveData", type="CURVE")
    curve_data.dimensions = "3D"
    curve_data.resolution_u = 1

    # Small display thickness so the skeleton is visible in the viewport.
    curve_data.bevel_depth = max(0.01, PIXEL_TO_BLENDER * 0.25)
    curve_data.bevel_resolution = 1

    spline = curve_data.splines.new("POLY")
    spline.points.add(len(points) - 1)

    for i, point in enumerate(points):
        spline.points[i].co = (point.x, point.y, point.z, 1.0)

    obj = bpy.data.objects.new(name, curve_data)
    collection.objects.link(obj)

    return obj


def create_materials():
    """
    Simple debug colours.
    These are viewport/debug materials, not final road materials.
    """
    colors = {
        "SMALL": (0.15, 0.55, 0.95, 1.0),
        "MEDIUM": (0.95, 0.55, 0.15, 1.0),
        "LARGE": (0.75, 0.20, 0.20, 1.0),
    }

    materials = {}

    for class_name, rgba in colors.items():
        material_name = f"RoadDebug_{class_name}"
        material = bpy.data.materials.get(material_name)

        if material is None:
            material = bpy.data.materials.new(material_name)
            material.diffuse_color = rgba

            if material.use_nodes:
                principled = material.node_tree.nodes.get("Principled BSDF")
                if principled:
                    principled.inputs["Base Color"].default_value = rgba
                    principled.inputs["Roughness"].default_value = 0.85

        materials[class_name] = material

    return materials


def add_modifiers(obj):
    if SOLIDIFY_ENABLED:
        modifier = obj.modifiers.new("Road Thickness", "SOLIDIFY")
        modifier.thickness = SOLIDIFY_THICKNESS
        modifier.offset = -1.0
        modifier.use_rim = True

    if BEVEL_ENABLED:
        modifier = obj.modifiers.new("Road Edge Bevel", "BEVEL")
        modifier.width = BEVEL_AMOUNT
        modifier.segments = BEVEL_SEGMENTS
        modifier.limit_method = "ANGLE"


def attach_metadata(obj, segment: dict):
    segment_id = segment.get("id")
    road_class = segment.get("class", "UNKNOWN")
    width = segment.get("width", {})

    obj["segment_id"] = int(segment_id) if segment_id is not None else -1
    obj["road_class"] = road_class
    obj["median_width_px"] = float(width.get("median_px", 0.0))
    obj["mean_width_px"] = float(width.get("mean_px", 0.0))
    obj["min_width_px"] = float(width.get("min_px", 0.0))
    obj["max_width_px"] = float(width.get("max_px", 0.0))
    obj["start_node"] = int(segment.get("start_node", -1))
    obj["end_node"] = int(segment.get("end_node", -1))


def create_scene_metadata(root, class_widths):
    root["source_format"] = "road_network.json"
    root["coordinate_space"] = "image_pixels"
    root["image_width_px"] = IMAGE_WIDTH_PX
    root["image_height_px"] = IMAGE_HEIGHT_PX
    root["pixel_to_blender"] = PIXEL_TO_BLENDER

    for class_name, width in class_widths.items():
        root[f"{class_name}_geometry_width"] = width


# ============================================================
# OPTIONAL POINT SIMPLIFICATION
# ============================================================

def rdp(points, epsilon):
    """
    Ramer-Douglas-Peucker simplification in 2D.
    epsilon is in source pixel units.

    Not used when SIMPLIFY_POINTS <= 0.
    """
    if len(points) < 3 or epsilon <= 0:
        return points

    def point_line_distance(point, start, end):
        line = end - start
        if line.length_squared < 1e-12:
            return (point - start).length

        t = (point - start).dot(line) / line.length_squared
        t = max(0.0, min(1.0, t))
        projection = start + t * line
        return (point - projection).length

    start = points[0]
    end = points[-1]

    max_distance = 0.0
    max_index = 0

    for i in range(1, len(points) - 1):
        distance = point_line_distance(points[i], start, end)
        if distance > max_distance:
            max_distance = distance
            max_index = i

    if max_distance > epsilon:
        left = rdp(points[: max_index + 1], epsilon)
        right = rdp(points[max_index:], epsilon)
        return left[:-1] + right

    return [start, end]


# ============================================================
# MAIN
# ============================================================

def main():
    json_path = resolve_json_path()
    data = load_network(json_path)

    class_widths = get_class_widths(data)

    log("Class widths:")
    for class_name in CLASS_NAMES:
        log(f"  {class_name}: {class_widths[class_name]:.4f} Blender units")

    root = reset_import_collection()
    centerline_collections, mesh_collections = create_class_collections(root)

    if DEBUG_MATERIALS:
        materials = create_materials()
    else:
        materials = {}

    create_scene_metadata(root, class_widths)

    segments = data.get("segments", [])

    processed = 0
    skipped = 0

    for segment in segments:
        segment_id = segment.get("id")
        road_class = segment.get("class")

        if road_class not in CLASS_NAMES:
            log(f"Skipping segment {segment_id}: invalid class '{road_class}'")
            skipped += 1
            continue

        raw_points = segment.get("points", [])
        points_px = clean_points(raw_points)

        if SIMPLIFY_POINTS > 0:
            points_px = rdp(points_px, SIMPLIFY_POINTS)

        if len(points_px) < 2:
            log(f"Skipping segment {segment_id}: fewer than 2 usable points.")
            skipped += 1
            continue

        points_blender = [image_to_blender(p.x, p.y) for p in points_px]

        width = class_widths[road_class]

        base_name = f"Road_{int(segment_id):04d}_{road_class}"

        # ----------------------------------------------------
        # CENTERLINE
        # ----------------------------------------------------
        if CREATE_CENTERLINES:
            curve_obj = create_centerline_curve(
                f"{base_name}_CENTERLINE",
                points_blender,
                centerline_collections[road_class],
            )
            attach_metadata(curve_obj, segment)

        # ----------------------------------------------------
        # ROAD MESH
        # ----------------------------------------------------
        if CREATE_ROAD_MESHES:
            vertices, faces = build_ribbon_mesh(points_blender, width)

            if vertices and faces:
                mesh_obj = create_mesh_object(
                    f"{base_name}_MESH",
                    vertices,
                    faces,
                    mesh_collections[road_class],
                )

                attach_metadata(mesh_obj, segment)

                if DEBUG_MATERIALS:
                    mesh_obj.data.materials.append(materials[road_class])

                add_modifiers(mesh_obj)

        processed += 1

        if processed % 100 == 0:
            log(f"Processed {processed}/{len(segments)} segments...")

    log("--------------------------------------------")
    log(f"Processed segments: {processed}")
    log(f"Skipped segments:   {skipped}")
    log(f"JSON:               {json_path}")
    log("--------------------------------------------")

    # Select the root collection's first generated object if possible.
    bpy.ops.object.select_all(action="DESELECT")

    return root


if __name__ == "__main__":
    main()
