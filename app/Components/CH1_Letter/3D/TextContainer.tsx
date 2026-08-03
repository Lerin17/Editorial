import { Canvas } from "@react-three/fiber";
import FoilMaterial from "./FoilMaterial";
import FoilTitle from "./FoilTitle";
import { useFoilGeometry } from "./useFoilGeometry";

export default function Hero() {
  const foilGeometry = useFoilGeometry({
    svgPath: "/svg/the-vale-wumba.svg",
    size: 8,
    extrude: {
      depth: 0.08,
      bevelEnabled: false,
      bevelThickness: 0.02,
      bevelSize: 0.01,
      bevelSegments: 2,
    },
  });

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 35, rotation: [0, 0, 0] }}
      //   style={{ height: "100vh", width: "100vw" }}
    >
      <ambientLight intensity={1} />
      <directionalLight position={[2, 3, 4]} intensity={0.5} />

      <FoilTitle
        geometry={foilGeometry}
        renderMaterial={() => <FoilMaterial />}
      />
    </Canvas>
  );
}
