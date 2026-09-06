"use client";

import React, { Suspense } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, useProgress, Clone } from "@react-three/drei";
import { MeshoptDecoder } from "meshoptimizer";
import { DRACOLoader, OrbitControls as OrbitControlsImpl } from "three-stdlib";

type FrameData = {
  center: THREE.Vector3;
  size: THREE.Vector3;
};

const dracoDecoderPath =
  "https://www.gstatic.com/draco/versioned/decoders/1.5.5/";

class ModelErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    console.error("[Activity] GLTF loader crashed", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

function LoadingFallback() {
  React.useEffect(() => {
    console.info(
      "[Activity] GLTF fallback mounted: waiting for /models/Dun5.glb",
    );
  }, []);

  return null;
}

function LoaderDiagnostics() {
  const { active, errors, item, loaded, progress, total } = useProgress();

  React.useEffect(() => {
    console.info("[Activity] loader progress update", {
      active,
      errors,
      item,
      loaded,
      progress,
      total,
    });
  }, [active, errors, item, loaded, progress, total]);

  React.useEffect(() => {
    const handleWindowError = (event: ErrorEvent) => {
      console.error("[Activity] window error while loading model", {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("[Activity] unhandled rejection while loading model", {
        reason: event.reason,
      });
    };

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  return null;
}

function extendWithDraco(loader: {
  setDRACOLoader: (dracoLoader: DRACOLoader) => void;
  setMeshoptDecoder: (meshoptDecoder: typeof MeshoptDecoder) => void;
}) {
  console.info("[Activity] configuring Draco + Meshopt decoders", {
    dracoDecoderPath,
  });
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(dracoDecoderPath);
  loader.setDRACOLoader(dracoLoader);
  loader.setMeshoptDecoder(MeshoptDecoder);
}

function Building({
  onFrameData,
  position,
}: {
  onFrameData: (frameData: FrameData) => void;
  position: [number, number, number];
}) {
  const { scene } = useGLTF("/models/low_poly_tree.glb", true, true, extendWithDraco);

  React.useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    onFrameData({ center, size });
  }, [scene, onFrameData]);

  return <Clone object={scene} position={position} />;
}
function FrameCamera({ frameData }: { frameData: FrameData | null }) {
  const { camera } = useThree();
  const controls = React.useRef<OrbitControlsImpl | null>(null);

  // eslint-disable-next-line react-hooks/immutability -- three.js cameras are mutated in-place by design.
  React.useEffect(() => {
    if (!frameData) {
      return;
    }

    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    const { center, size } = frameData;
    const maxDimension = Math.max(size.x, size.y, size.z);
    const verticalFov = THREE.MathUtils.degToRad(perspectiveCamera.fov);
    const fitHeightDistance = maxDimension / (2 * Math.tan(verticalFov / 2));
    const fitDistance = fitHeightDistance * 1.4;

    const cameraOffset = new THREE.Vector3(
      fitDistance,
      fitDistance * 10,
      fitDistance,
    );

    console.info("[Activity] framing camera for model", {
      cameraPosition: camera.position.toArray(),
      target: center.toArray(),
      size: size.toArray(),
      maxDimension,
      fitHeightDistance,
      fitDistance,
    });

    camera.position.copy(center).add(cameraOffset);
    perspectiveCamera.near = Math.max(fitDistance / 100, 0.1);
    perspectiveCamera.far = fitDistance * 100;
    perspectiveCamera.updateProjectionMatrix();

    if (controls.current) {
      controls.current.target.copy(center);
      controls.current.update();
    }
  }, [camera, frameData]);

  return <OrbitControls ref={controls} makeDefault enableDamping />;
}

console.info("[Activity] preloading /models/Dun7.glb");
useGLTF.preload("/models/Dun7.glb", true, true, extendWithDraco);

export default function Viewer() {
  const [frameData, setFrameData] = React.useState<FrameData | null>(null);

  const positions: Array<[number, number, number]> = [
    // Row 1
    [0, 0, 0],
    [20, 0, 0],
    [40, 0, 0],
    [60, 0, 0],
    [80, 0, 0],
    [100, 0, 0],
    [120, 0, 0],
    [140, 0, 0],
    [160, 0, 0],
    [180, 0, 0],

    // // Row 2
    // [0, 0, 20],
    // [20, 0, 20],
    // [40, 0, 20],
    // [60, 0, 20],
    // [80, 0, 20],
    // [100, 0, 20],
    // [120, 0, 20],
    // [140, 0, 20],
    // [160, 0, 20],
    // [180, 0, 20],

    // // Row 3
    // [0, 0, 40],
    // [20, 0, 40],
    // [40, 0, 40],
    // [60, 0, 40],
    // [80, 0, 40],
    // [100, 0, 40],
    // [120, 0, 40],
    // [140, 0, 40],
    // [160, 0, 40],
    // [180, 0, 40],

    // Row 4
    // [0, 0, 60],
    // [20, 0, 60],
    // [40, 0, 60],
    // [60, 0, 60],
    // [80, 0, 60],
    // [100, 0, 60],
    // [120, 0, 60],
    // [140, 0, 60],
    // [160, 0, 60],
    // [180, 0, 60],

    // // Row 5
    // [0, 0, 80],
    // [20, 0, 80],
    // [40, 0, 80],
    // [60, 0, 80],
    // [80, 0, 80],
    // [100, 0, 80],
    // [120, 0, 80],
    // [140, 0, 80],
    // [160, 0, 80],
    // [180, 0, 80],
  ];

  return (
  
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [180, 100, 80], fov: 35 }}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          backgroundColor: "white",
        }}
      >
        <LoaderDiagnostics />
        <ambientLight intensity={1.4} />
        <directionalLight position={[3, 5, 4]} intensity={2} />

        <ModelErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            {positions.map((position: any, i) => (
              <Building
                onFrameData={setFrameData}
                key={i}
                position={position}
              />
            ))}
            {/* <Building onFrameData={setFrameData} /> */}
            {/* <Building onFrameData={setFrameData} /> */}
          </Suspense>
        </ModelErrorBoundary>

        <FrameCamera frameData={frameData} />
      </Canvas>
    </div>
  );
}
