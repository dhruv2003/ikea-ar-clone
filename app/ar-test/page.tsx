"use client";

import { Canvas } from "@react-three/fiber";

export default function ARTestPage() {
  return (
    <div style={{ height: "100vh" }}>
      <Canvas>
        <mesh>
          <boxGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
        <ambientLight />
      </Canvas>
    </div>
  );
}