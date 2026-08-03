// components/FoilText.tsx

import { Text } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

type FoilTextProps = {
  text: string;
  font?: string;
  size?: number;
  color?: string;
  position?: [number, number, number];
};

export default function FoilText({
  text,
  font = "/fonts/Archivo/Archivo-Bold.ttf",
  size = 1,
  color = "#ffffff",
  position = [0, 0, 0],
  
}: FoilTextProps) {
  const ref = useRef<THREE.Mesh>(null);

  return (
    <Text
      ref={ref}
      font={font}
      fontSize={size}
      color={color}
      anchorX="center"
      anchorY="middle"
      position={position}
    >
      {text}
    </Text>
  );
}
