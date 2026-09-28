"use client";

import React, { Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree,    } from "@react-three/fiber";
import { OrbitControls, useGLTF, useProgress, Clone, useTexture } from "@react-three/drei";
import { MeshoptDecoder } from "meshoptimizer";
import { DRACOLoader, OrbitControls as OrbitControlsImpl } from "three-stdlib";
import tex1 from '../../../../public/img/texture/tex3.png'

type FrameData = {
  center: THREE.Vector3;
  size: THREE.Vector3;
};

type ExtractedMeshPart = {
  name: string;
  geometry: THREE.BufferGeometry;
  material: THREE.Material | THREE.Material[];
  position: [number, number, number];
  quaternion: [number, number, number, number];
  scale: [number, number, number];
};

type CameraPreset = {
  cameraPosition: [number, number, number];
  target: [number, number, number];
};

type CameraPresetRequest = {
  preset: CameraPreset;
  id: number;
};

type CameraCaptureRequest = {
  key: string;
  id: number;
};

type RaycastPoint = {
  x: number;
  y: number;
  z: number;
};

// Percentage of the full rotation/zoom range still available while the view is locked.
const LOCK_RANGE_PERCENT = 10;

// localStorage key used to persist user-updated camera presets across server restarts.
const CAMERA_PRESETS_STORAGE_KEY = "ch3-camera-presets";

// Camera presets captured via the "Log Current Orbit" baseline snapshots.
const DEFAULT_CAMERA_PRESETS: Record<string, CameraPreset> = {
  baseline: {
    cameraPosition: [-319.34499229501216, 520.9012709882702, -470.3039450012078],
    target: [-17.966529305915227, 38.21091832964148, -55.86106658759387],
  },
  closeUp: {
    cameraPosition: [-158.40236126238742, 135.10254589388433, -265.2150312801351],
    target: [9.381741139870838, -33.28108291773195, -67.82144883200402],
  },
  ultraClose: {
    cameraPosition: [112.28650058160514, 995.8812915993773, -24.937419498699683],
    target: [112.28649687984269, 38.21088723342231, -24.93837716194966],
  },
};

function loadStoredCameraPresets(): Record<string, CameraPreset> {
  if (typeof window === "undefined") {
    return DEFAULT_CAMERA_PRESETS;
  }

  try {
    const raw = window.localStorage.getItem(CAMERA_PRESETS_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_CAMERA_PRESETS;
    }
    return { ...DEFAULT_CAMERA_PRESETS, ...JSON.parse(raw) };
  } catch (error) {
    console.error("[Activity] failed to read stored camera presets", error);
    return DEFAULT_CAMERA_PRESETS;
  }
}

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

function ThreeStateLogger() {
  const state = useThree();

  // Log the full r3f/three.js state on every frame update.
  // useFrame(() => {
  //   console.log("[Activity] three.js state", state);
  // });

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

// USE ANY FOR TYPING - FIX LATER
const HouseModel = ({positions}: { positions: any }) => {
const { scene } = useGLTF("/models/Genesis6.glb", true, true, extendWithDraco);

  React.useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    console.log("[Activity] HouseModel bounding box", {
      center: center.toArray(),
      size: size.toArray(),
    });

  }, [scene]);
  return (

        <Clone  object={scene} position={positions} />
   
  );
}

type MeshBounds = {
  name: string;
  box: THREE.Box3;
};

// function inspectSceneHierarchy(scene: THREE.Object3D): MeshBounds[] {
//   const meshBounds: MeshBounds[] = [];
//   const lines: string[] = [];

//   scene.updateMatrixWorld(true);

//   const visit = (object: THREE.Object3D, depth: number) => {
//     const isMesh = object instanceof THREE.Mesh;
//     const label = object.name || object.type;
//     const prefix = "  ".repeat(depth);

//     if (isMesh) {
//       const box = new THREE.Box3().setFromObject(object);
//       meshBounds.push({ name: label, box });

//       console.log(`${prefix}- ${label} [Mesh]`, {
//         min: box.min.toArray(),
//         max: box.max.toArray(),
//       });
//       lines.push(
//         `${prefix}- ${label} [Mesh] min: ${box.min.toArray().join(", ")} max: ${box.max.toArray().join(", ")}`,
//       );
//     } else {
//       console.log(`${prefix}- ${label} [${object.type}]`);
//       lines.push(`${prefix}- ${label} [${object.type}]`);
//     }

//     object.children.forEach((child) => visit(child, depth + 1));
//   };

//   console.groupCollapsed(`[Activity] ${scene.name || scene.type} hierarchy`);
//   visit(scene, 0);
//   console.groupEnd();

//   void fetch("/api/scene-log", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       content: `${scene.name || scene.type} hierarchy\n${lines.join("\n")}`,
//     }),
//   });

//   return meshBounds;
// }

  // const { scene, nodes, materials } = useGLTF("/models/Exodus.glb", true, true, extendWithDraco);

const BUILDING_NODE_NAMES = {
  cube: "Cube",
  grass: "Floor_Floors_<428885_Grass<",
  road: "Floor_Floors_<434200_Road<",
  plane: "Plane",
  scene: "Scene",
  toposolid: "Toposolid_Toposolid_<392970_Generic_-_1000mm<",
  root: "rootNode",
};

function addPlanarUVs(geometry: THREE.BufferGeometry) {
  if (geometry.getAttribute("uv")) {
    return geometry;
  }

  const mappedGeometry = geometry.clone();
  const positions = mappedGeometry.getAttribute("position");
  mappedGeometry.computeBoundingBox();
  const bounds = mappedGeometry.boundingBox;
  if (!bounds) {
    return mappedGeometry;
  }
  const size = bounds.getSize(new THREE.Vector3());
  const width = Math.max(size.x, Number.EPSILON);
  const height = Math.max(size.y, Number.EPSILON);
  const uvs = new Float32Array(positions.count * 2);

  for (let index = 0; index < positions.count; index += 1) {
    uvs[index * 2] = (positions.getX(index) - bounds.min.x) / width;
    uvs[index * 2 + 1] = (positions.getY(index) - bounds.min.y) / height;
  }

  mappedGeometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  return mappedGeometry;
}

  function MyObject() {
  const mesh = React.useRef<THREE.Mesh>(null);

  React.useEffect(() => {
    if (mesh.current) {
      mesh.current.rotation.y = 1;
    }
  }, []);

  return (
    <mesh ref={mesh}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}

function ExodusParts({
  onFrameData,
  position,
}: {
  onFrameData: (frameData: FrameData) => void;
  position: [number, number, number];
}) {
  const { scene, nodes } = useGLTF(
    "/models/Exodus.glb",
    true,
    true,
    extendWithDraco,
  );

  const grassTexture = useTexture(tex1.src, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(32, 68);
  });

  const textures = [

  ]

  console.log(nodes, 'nodes')
  const [parts, setParts] = React.useState<ExtractedMeshPart[]>([]);

  React.useEffect(() => {
    // The GLTF scene is not rendered, so update its world matrices before extracting transforms.
    scene.updateMatrixWorld(true);

    const extractedParts: ExtractedMeshPart[] = Object.entries(
      BUILDING_NODE_NAMES,
    ).flatMap(([key, nodeName]) => {
      const node = nodes[nodeName];
      if (!(node instanceof THREE.Mesh)) {
        console.warn(`[Activity] ${key} (${nodeName}) is not a mesh node`, node);
        return [];
      }

      const worldPosition = new THREE.Vector3();
      const worldQuaternion = new THREE.Quaternion();
      const worldScale = new THREE.Vector3();
      node.matrixWorld.decompose(worldPosition, worldQuaternion, worldScale);

      return [{
        name: key,
        geometry: key === "grass" ? addPlanarUVs(node.geometry) : node.geometry,
        material: node.material,
        position: [worldPosition.x, worldPosition.y, worldPosition.z],
        quaternion: [
          worldQuaternion.x,
          worldQuaternion.y,
          worldQuaternion.z,
          worldQuaternion.w,
        ],
        scale: [worldScale.x, worldScale.y, worldScale.z],
      }];
    });

    // Store the extracted GLTF parts for rendering as separate meshes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParts(extractedParts);

    const box = new THREE.Box3().setFromObject(scene);
    onFrameData({
      center: box.getCenter(new THREE.Vector3()),
      size: box.getSize(new THREE.Vector3()),
    });
  }, [nodes, onFrameData, scene]);

  const partFilter = parts.filter(item => item.name !== 'grass')

  const grassMesh = parts.filter(item => item.name == 'grass')

  return (
    <group position={position}>
      {partFilter.map((part) => (
        <mesh
          key={part.name}
          geometry={part.geometry}
          material={part.material}
          position={part.position}
          quaternion={part.quaternion}
          scale={part.scale}
        />
      ))}

    {
      grassMesh.map((part) => (
         <mesh
          key={part.name}
          geometry={part.geometry}
          material={part.material}
          position={part.position}
          quaternion={part.quaternion}
          scale={part.scale}
          
      > <meshStandardMaterial  map={grassTexture}/> </mesh>
      ))
    }
     
    </group>
  );
}

/*
function Building({
  onFrameData,
  position
}: {
  onFrameData: (frameData: FrameData) => void;
  position: [number, number, number];
}) {
  const { scene, nodes, materials } = useGLTF("/models/Exodus.glb", true, true, extendWithDraco);
  React.useEffect(() => {
    const helpers = [
      [10, 0, 20],
      [30, 0, 40],
      [55.6, 0, -223.62],
      [56.16, 0, -25.93],
      [0, 0, 0],
    ].map(([x, y, z]) => {
      const helper = new THREE.AxesHelper(400);
      helper.position.set(x, y, z);
      scene.add(helper);
      return helper;
    });

    return () => {
      helpers.forEach((helper) => scene.remove(helper));
    };
  }, [scene]);

  React.useEffect(() => {
    console.log(nodes, materials, "nodes and materials");
  }, [scene]);

  React.useEffect(() => {
    const isolatedGeometries = Object.fromEntries(
      Object.entries(BUILDING_NODE_NAMES).flatMap(([key, nodeName]) => {
        const node = nodes[nodeName];
        if (!(node instanceof THREE.Mesh)) {
          console.warn(`[Activity] ${key} (${nodeName}) is not a mesh node`, node);
          return [];
        }

        return [[key, node.geometry]];
      }),
    );

    console.log("[Activity] isolated node geometries", isolatedGeometries);
  }, [nodes]);

  React.useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    onFrameData({
      center: box.getCenter(new THREE.Vector3()),
      size: box.getSize(new THREE.Vector3()),
    });
  }, [scene, onFrameData]);

  return <Clone object={scene} position={position} />;
}
*/


function FrameCamera({
  frameData,
  initialPreset,
  locked,
  lockRangePercent,
  logRequestId,
  presetRequest,
  captureRequest,
  raycastMode,
  onCapture,
}: {
  frameData: FrameData | null;
  initialPreset: CameraPreset;
  locked: boolean;
  lockRangePercent: number;
  logRequestId: number;
  presetRequest: CameraPresetRequest | null;
  captureRequest: CameraCaptureRequest | null;
  raycastMode: boolean;
  onCapture: (key: string, preset: CameraPreset) => void;
}) {
  const { camera } = useThree();
  const controls = React.useRef<OrbitControlsImpl | null>(null);
  const lastLoggedRequestId = React.useRef(0);
  const lastPresetRequestId = React.useRef(0);
  const lastCaptureRequestId = React.useRef(0);

  // Apply a camera preset whenever a new preset request comes in.
  React.useEffect(() => {
    if (!presetRequest || presetRequest.id === lastPresetRequestId.current) {
      return;
    }
    lastPresetRequestId.current = presetRequest.id;

    const orbitControls = controls.current;
    const { cameraPosition, target } = presetRequest.preset;

    camera.position.set(...cameraPosition);
    if (orbitControls) {
      orbitControls.target.set(...target);
      orbitControls.update();
    }
  }, [presetRequest, camera]);

  // Capture the current camera/orbit state and hand it back whenever an "update" button is clicked.
  React.useEffect(() => {
    if (!captureRequest || captureRequest.id === lastCaptureRequestId.current) {
      return;
    }
    lastCaptureRequestId.current = captureRequest.id;

    const orbitControls = controls.current;
    if (!orbitControls) {
      return;
    }

    onCapture(captureRequest.key, {
      cameraPosition: camera.position.toArray() as [number, number, number],
      target: orbitControls.target.toArray() as [number, number, number],
    });
  }, [captureRequest, camera, onCapture]);

  // eslint-disable-next-line react-hooks/immutability -- three.js cameras are mutated in-place by design.
  React.useEffect(() => {
    if (!frameData) {
      return;
    }

    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    const { center, size } = frameData;
    const maxDimension = Math.max(size.x, size.y, size.z);
    // const verticalFov = THREE.MathUtils.degToRad(perspectiveCamera);
    // const fitHeightDistance = maxDimension / (2 * Math.tan(verticalFov / 2));
    const fitDistance = maxDimension * 1.4;

    console.info("[Activity] framing camera for model", {
      cameraPosition: camera.position.toArray(),
      target: center.toArray(),
      size: size.toArray(),
      maxDimension,
      // fitHeightDistance,
      fitDistance,
    });

    camera.position.set(...initialPreset.cameraPosition);
    perspectiveCamera.near = Math.max(fitDistance / 100, 0.1);
    perspectiveCamera.far = fitDistance * 100;
    perspectiveCamera.updateProjectionMatrix();

    if (controls.current) {
      controls.current.target.set(...initialPreset.target);
      controls.current.update();
    }
  }, [camera, frameData, initialPreset]);

  // Cap orbit rotation to a percentage of the full range around whatever orbit the user has
  // dialed in at the moment the lock is engaged (not the initial framed position).
  React.useEffect(() => {
    const orbitControls = controls.current;
    if (!orbitControls) {
      return;
    }

    if (locked) {
      const spherical = new THREE.Spherical().setFromVector3(
        camera.position.clone().sub(orbitControls.target),
      );
      const azimuthHalfRange = Math.PI * (lockRangePercent / 100);
      const polarHalfRange = (Math.PI / 2) * (lockRangePercent / 100);
      const distanceRange = spherical.radius * (lockRangePercent / 100);

      orbitControls.minAzimuthAngle = spherical.theta - azimuthHalfRange;
      orbitControls.maxAzimuthAngle = spherical.theta + azimuthHalfRange;
      orbitControls.minPolarAngle = Math.max(0, spherical.phi - polarHalfRange);
      orbitControls.maxPolarAngle = Math.min(
        Math.PI,
        spherical.phi + polarHalfRange,
      );
      orbitControls.minDistance = Math.max(0, spherical.radius - distanceRange);
      orbitControls.maxDistance = spherical.radius + distanceRange;
    } else {
      orbitControls.minAzimuthAngle = -Infinity;
      orbitControls.maxAzimuthAngle = Infinity;
      orbitControls.minPolarAngle = 0;
      orbitControls.maxPolarAngle = Math.PI;
      orbitControls.minDistance = 0;
      orbitControls.maxDistance = Infinity;
    }

    orbitControls.update();
  }, [locked, lockRangePercent, camera]);

  // Snapshot the current orbit whenever the "Log Current Orbit" button is clicked.
  React.useEffect(() => {
    if (logRequestId === lastLoggedRequestId.current) {
      return;
    }
    lastLoggedRequestId.current = logRequestId;

    const orbitControls = controls.current;
    if (!orbitControls) {
      return;
    }

    const spherical = new THREE.Spherical().setFromVector3(
      camera.position.clone().sub(orbitControls.target),
    );

    console.log("[Activity] current orbit baseline", {
      cameraPosition: camera.position.toArray(),
      target: orbitControls.target.toArray(),
      azimuthDeg: THREE.MathUtils.radToDeg(spherical.theta),
      polarDeg: THREE.MathUtils.radToDeg(spherical.phi),
      distance: spherical.radius,
    });
  }, [logRequestId, camera]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      enabled={!raycastMode}
    />
  );
}

function RaycastSurface({
  active,
  onMove,
  onSelect,
}: {
  active: boolean;
  onMove: (point: RaycastPoint | null) => void;
  onSelect: (point: RaycastPoint) => void;
}) {
  if (!active) {
    return null;
  }

  const readPoint = (point: THREE.Vector3): RaycastPoint => ({
    x: point.x,
    y: point.y,
    z: point.z,
  });

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      onPointerMove={(event) => onMove(readPoint(event.point))}
      onPointerOut={() => onMove(null)}
      onPointerDown={(event) => {
        event.stopPropagation();
        onSelect(readPoint(event.point));
      }}
    >
      <planeGeometry args={[10000, 10000]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

function formatRaycastPoint(point: RaycastPoint | null) {
  if (!point) {
    return "Move over the canvas";
  }

  return `X ${point.x.toFixed(2)}   Y ${point.y.toFixed(2)}   Z ${point.z.toFixed(2)}`;
}

console.info("[Activity] preloading /models/Dun7.glb");
// useGLTF.preload("/models/Dun7.glb", true, true, extendWithDraco);

export default function Viewer() {
  const [frameData, setFrameData] = React.useState<FrameData | null>(null);
  const [locked, setLocked] = React.useState(false);
  const [raycastMode, setRaycastMode] = React.useState(false);
  const [raycastPoint, setRaycastPoint] = React.useState<RaycastPoint | null>(
    null,
  );
  const [selectedRaycastPoint, setSelectedRaycastPoint] =
    React.useState<RaycastPoint | null>(null);
  const [logRequestId, setLogRequestId] = React.useState(0);
  const [presets, setPresets] =
    React.useState<Record<string, CameraPreset>>(loadStoredCameraPresets);
  const [presetRequest, setPresetRequest] =
    React.useState<CameraPresetRequest | null>(null);
  const [captureRequest, setCaptureRequest] =
    React.useState<CameraCaptureRequest | null>(null);
  const presetRequestId = React.useRef(0);
  const captureRequestId = React.useRef(0);

  const applyPreset = (preset: CameraPreset) => {
    presetRequestId.current += 1;
    setPresetRequest({ preset, id: presetRequestId.current });
  };

  const requestCapture = (key: string) => {
    captureRequestId.current += 1;
    setCaptureRequest({ key, id: captureRequestId.current });
  };

  const toggleRaycastMode = () => {
    setRaycastMode((active) => {
      if (active) {
        setRaycastPoint(null);
      }
      return !active;
    });
  };

  const handleCapture = React.useCallback(
    (key: string, preset: CameraPreset) => {
      setPresets((prev) => {
        const next = { ...prev, [key]: preset };
        try {
          window.localStorage.setItem(
            CAMERA_PRESETS_STORAGE_KEY,
            JSON.stringify(next),
          );
        } catch (error) {
          console.error(
            "[Activity] failed to persist camera presets",
            error,
          );
        }
        return next;
      });
    },
    [],
  );

  const positions1: Array<[number, number, number]> = [
    // Row 1

    // [-20, 40, 0],
    // [100, 0, 0],
  
   [-143.3, -0.00, -14.2],
     [-158.3, -0.00, -14.2],
    // [100, 0, 0],
    // [120, 0, 0],
    // [140, 0, 0],
    // [160, 0, 0],
    // [180, 0, 0],

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

  const positions: Array<[number, number, number]> = [
    // Row 1
    [0, 0, 0],
    // [20, 0, 0],
    // [40, 0, 0],
    // [60, 0, 0],
    // [80, 0, 0],
    // [100, 0, 0],
    // [120, 0, 0],
    // [140, 0, 0],
    // [160, 0, 0],
    // [180, 0, 0],

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

    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        cursor: raycastMode ? "crosshair" : "default",
      }}
    >
      <button
        type="button"
        onClick={toggleRaycastMode}
        aria-pressed={raycastMode}
        style={{
          position: "absolute",
          top: 68,
          right: 16,
          zIndex: 10,
          padding: "8px 14px",
          borderRadius: 9999,
          border: "1px solid rgba(255,255,255,0.4)",
          background: raycastMode ? "#ffed4a" : "rgba(0,0,0,0.4)",
          color: raycastMode ? "#0c0b0b" : "#ffffff",
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: "0.05em",
          cursor: "pointer",
        }}
      >
        {raycastMode ? "Exit Raycast" : "Raycast Point"}
      </button>
      <div
        role="status"
        aria-live="polite"
        style={{
          position: "absolute",
          top: 112,
          right: 16,
          zIndex: 10,
          minWidth: 210,
          padding: "10px 12px",
          border: "1px solid rgba(255,255,255,0.3)",
          background: "rgba(0,0,0,0.55)",
          color: "#ffffff",
          fontFamily: "monospace",
          fontSize: 11,
          lineHeight: 1.5,
          pointerEvents: "auto",
        }}
      >
        <div style={{ opacity: 0.65, marginBottom: 4 }}>
          {raycastMode ? "LIVE RAYCAST" : "LAST SELECTED POINT"}
        </div>
        <div>
          {formatRaycastPoint(
            raycastMode ? raycastPoint : selectedRaycastPoint,
          )}
        </div>
        {selectedRaycastPoint && (
          <div style={{ marginTop: 4, color: "#ffed4a" }}>
            Selected: {formatRaycastPoint(selectedRaycastPoint)}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => setLocked((prev) => !prev)}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 10,
          padding: "8px 14px",
          borderRadius: 9999,
          border: "1px solid rgba(255,255,255,0.4)",
          background: locked ? "#ffffff" : "rgba(0,0,0,0.4)",
          color: locked ? "#0c0b0b" : "#ffffff",
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: "0.05em",
          cursor: "pointer",
        }}
      >
        {locked ? `Orbit locked (±${LOCK_RANGE_PERCENT}%)` : "Lock Orbit"}
      </button>
      <button
        type="button"
        onClick={() => setLogRequestId((prev) => prev + 1)}
        style={{
          position: "absolute",
          top: 16,
          right: 160,
          zIndex: 10,
          padding: "8px 14px",
          borderRadius: 9999,
          border: "1px solid rgba(255,255,255,0.4)",
          background: "rgba(0,0,0,0.4)",
          color: "#ffffff",
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: "0.05em",
          cursor: "pointer",
        }}
      >
        Log Current Orbit
      </button>
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 10,
          display: "flex",
          gap: 8,
        }}
      >
        {(
          [
            { key: "baseline", label: "Baseline" },
            { key: "closeUp", label: "Close Up" },
            { key: "ultraClose", label: "Ultra Close" },
          ] as const
        ).map(({ key, label }) => (
          <div
            key={key}
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            <button
              type="button"
              onClick={() => applyPreset(presets[key])}
              style={{
                padding: "8px 14px",
                borderRadius: 9999,
                border: "1px solid rgba(255,255,255,0.4)",
                background: "rgba(0,0,0,0.4)",
                color: "#ffffff",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.05em",
                cursor: "pointer",
              }}
            >
              {label}
            </button>
            <button
              type="button"
              onClick={() => requestCapture(key)}
              style={{
                padding: "8px 14px",
                borderRadius: 9999,
                border: "1px solid rgba(255,255,255,0.4)",
                background: "rgba(255,255,255,0.15)",
                color: "#ffffff",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.05em",
                cursor: "pointer",
              }}
            >
              Update
            </button>
          </div>
        ))}
      </div>
      <Canvas
        camera={{ position: [6, 10, 6], fov: 35 }}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          backgroundColor: "white",
        }}
      >
        <LoaderDiagnostics />
        <ThreeStateLogger />
        <ambientLight intensity={1.4} />
        <directionalLight position={[3, 5, 4]} intensity={2} />

        <RaycastSurface
          active={raycastMode}
          onMove={setRaycastPoint}
          onSelect={setSelectedRaycastPoint}
        />

        <ModelErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>

          {/* <mesh
          geometry={new THREE.BoxGeometry(100, 100, 100)}
            geometry={nodes.Dun7.geometry}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.01, 0]}
          receiveShadow
          />
           */}
         {positions1.map((position: any, i) => (
              <HouseModel
                // onFrameData={setFrameData}
                key={i}
                positions={position}
              />
            ))}

            <ExodusParts
              onFrameData={setFrameData}
              position={[0, 0, 0]}
            />
            {/* Legacy whole-model rendering is disabled while splitting the GLTF meshes.
            {positions.map((position: any, i) => (
              <Building onFrameData={setFrameData} key={i} position={position} />
            ))}
            */}
          </Suspense>
        </ModelErrorBoundary>

{/* LOAD THE CAMERA BEFORE THE SCENE */}
        <FrameCamera
          frameData={frameData}
          initialPreset={presets.baseline}
          locked={locked}
          lockRangePercent={LOCK_RANGE_PERCENT}
          logRequestId={logRequestId}
          presetRequest={presetRequest}
          captureRequest={captureRequest}
          raycastMode={raycastMode}
          onCapture={handleCapture}
        />

        {/* LOAD THE CAMERA BEFORE THE SCENE */}
      </Canvas>
    </div>
  );
}
