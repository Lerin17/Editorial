import { useLoader } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

export type FoilExtrudeSettings = {
  depth?: number;
  bevelEnabled?: boolean;
  bevelThickness?: number;
  bevelSize?: number;
  bevelSegments?: number;
  curveSegments?: number;
};

export type FoilGeometryMesh = {
  geometry: THREE.ExtrudeGeometry;
  fill: string | null;
  key: string;
};

export type FoilGeometryData = {
  meshes: FoilGeometryMesh[];
  offset: [number, number, number];
  scale: [number, number, number];
};

type UseFoilGeometryParams = {
  svgPath: string;
  size?: number;
  extrude?: FoilExtrudeSettings;
};

export function useFoilGeometry({
  svgPath,
  size = 1,
  extrude,
}: UseFoilGeometryParams): FoilGeometryData {
  const svgData = useLoader(SVGLoader, svgPath);

  const geometryData = useMemo(() => {
    const meshes: FoilGeometryMesh[] = [];
    const bounds = new THREE.Box3();
    let hasBounds = false;

    const extrudeOptions: THREE.ExtrudeGeometryOptions = {
      depth: 0.02,
      bevelEnabled: true,
      bevelThickness: 0.003,
      bevelSize: 0.003,
      bevelSegments: 6,
      curveSegments: 16,
    };

    svgData.paths.forEach((path, pathIndex) => {
      const shapes = path.toShapes();

      shapes.forEach((shape, shapeIndex) => {
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
        geometry.computeVertexNormals();
        geometry.computeBoundingBox();

        if (geometry.boundingBox) {
          bounds.union(geometry.boundingBox);
          hasBounds = true;
        }

        meshes.push({
          geometry,
          fill:
            (path.userData?.style as Record<string, string> | undefined)
              ?.fill ?? null,
          key: `${pathIndex}-${shapeIndex}`,
        });
      });
    });

    if (!hasBounds) {
      return {
        meshes,
        offset: [0, 0, 0] as [number, number, number],
        scale: [1, -1, 1] as [number, number, number],
      };
    }

    const center = new THREE.Vector3();
    const sizeVector = new THREE.Vector3();
    bounds.getCenter(center);
    bounds.getSize(sizeVector);

    const maxDimension = Math.max(sizeVector.x, sizeVector.y, 1e-6);
    const scaleFactor = size / maxDimension;

    return {
      meshes,
      offset: [
        -center.x * scaleFactor,
        center.y * scaleFactor,
        -center.z * scaleFactor,
      ] as [number, number, number],
      scale: [scaleFactor, -scaleFactor, scaleFactor] as [
        number,
        number,
        number,
      ],
    };
  }, [extrude, size, svgData]);

  useEffect(() => {
    return () => {
      geometryData.meshes.forEach((mesh) => mesh.geometry.dispose());
    };
  }, [geometryData]);

  return geometryData;
}
