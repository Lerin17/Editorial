import { ReactNode } from "react";
import * as THREE from "three";
import { FoilGeometryData, FoilGeometryMesh } from "./useFoilGeometry";

type FoilTitleProps = {
  geometry: FoilGeometryData;
  position?: [number, number, number];
  material?: THREE.Material | ReactNode;
  renderMaterial?: (mesh: FoilGeometryMesh, index: number) => ReactNode;
};

export default function FoilTitle({
  geometry,
  position = [0, 0, 0],
  material,
  renderMaterial,
}: FoilTitleProps) {
  const meshMaterial =
    material instanceof THREE.Material ? material : undefined;
  const materialNode =
    material instanceof THREE.Material ? undefined : material;

  return (
    <group
      position={[
        position[0] + geometry.offset[0],
        position[1] + geometry.offset[1],
        position[2] + geometry.offset[2],
      ]}
      scale={geometry.scale}
    >
      {geometry.meshes.map((pathMesh, index) => (
        <mesh
          key={pathMesh.key}
          geometry={pathMesh.geometry}
          material={meshMaterial}
        >
          {renderMaterial
            ? renderMaterial(pathMesh, index)
            : meshMaterial
              ? null
              : (materialNode ?? (
                  <meshStandardMaterial
                    color="#ffffff"
                    side={THREE.DoubleSide}
                  />
                ))}
        </mesh>
      ))}
    </group>
  );
}
