"use client";

import { Canvas } from "@react-three/fiber";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";

const models: { [key: string]: string } = {
  "chair-1": "/chair_model.glb",
  "table-1": "/table_model.glb",
  "sofa-1": "/sofa_model.glb",
};

function FurnitureModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={0.5} />;
}

export default function ARViewPage() {
  const params = useParams();
  const id = params?.id as string;
  const modelUrl = models[id];

  if (!modelUrl) {
    return <div>Product not found</div>;
  }

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Canvas>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <FurnitureModel url={modelUrl} />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}