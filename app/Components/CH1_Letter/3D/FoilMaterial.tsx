import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type FoilMaterialProps = {
  side?: THREE.Side;
};

const vertexShader = `
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vWorldPos;

void main() {
  vUv = uv;
vNormalW = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPos.xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec2 uMouse;

varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vWorldPos;

void main(){
  vec3 N = normalize(vNormalW);

  vec3 V = normalize(cameraPosition - vWorldPos);
vec2 mouse01 = uMouse * 0.5 + 0.5;

// Mouse controls a POINT LIGHT in world space
vec3 lightPos = vec3(
    mix(-3.0, 3.0, mouse01.x),
    mix(-2.0, 2.0, mouse01.y),
    3.0
);

// Per-pixel light direction
vec3 L = normalize(lightPos - vWorldPos);
  float ndl = max(dot(N, L), 0.0);

  vec3 H = normalize(L + V);
  float spec = pow(max(dot(N, H), 0.0), 32.0);

  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);

  vec3 baseMetal = vec3(0.45, 0.47, 0.50);
  vec3 coolTint = vec3(0.72, 0.78, 0.88);
  vec3 warmTint = vec3(0.95, 0.92, 0.82);

  float sweep = 0.5 + 0.5 * sin(uTime * 0.35 + vUv.y * 7.0);
  vec3 reflectedTint = mix(coolTint, warmTint, sweep);

  vec3 color = baseMetal;
  color += reflectedTint * ndl * 0.35;
  color += vec3(1.0) * spec * 1.15;
  color += reflectedTint * fresnel * 0.45;

  gl_FragColor = vec4(color, 1.0);
}
`;

export default function FoilMaterial({
  side = THREE.DoubleSide,
}: FoilMaterialProps) {
  const ref = useRef<THREE.ShaderMaterial>(null);

  // const uniforms = useMemo(
  //   () => ({
  //     uTime: { value: 0 },
  //     uMouse: { value: new THREE.Vector2() },
  //   }),
  //   [],
  // );

  // useFrame(({ clock, pointer }) => {
  //   if (!ref.current) return;

  //   ref.current.uniforms.uTime.value = clock.elapsedTime;

  //   ref.current.uniforms.uMouse.value.set(pointer.x, pointer.y);
  // });

  // return (
  //   <shaderMaterial
  //     ref={ref}
  //     vertexShader={vertexShader}
  //     fragmentShader={fragmentShader}
  //     uniforms={uniforms}
  //     side={side}
  //   />
  // );

  return <div>ex</div>;
}
