"use client";

import { Canvas } from "@react-three/fiber";
import { useParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";
import { OrbitControls, useGLTF, DragControls } from "@react-three/drei";
import * as THREE from "three";

const models: { [key: string]: string } = {
  "chair-1": "/chair_model.glb",
  "table-1": "/table_model.glb",
  "sofa-1": "/sofa_model.glb",
};

function FurnitureModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const sceneRef = useRef<THREE.Object3D>(scene);

  return <primitive ref={sceneRef} object={scene} scale={0.5} />;
}

export default function ARViewPage() {
  const params = useParams();
  const id = params?.id as string;
  const modelUrl = models[id];

  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStarted, setCameraStarted] = useState(false);

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraStarted(true);
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    } else {
      alert("Camera not supported on this device/browser.");
    }
  };

  if (!modelUrl) {
    return <div>Product not found</div>;
  }

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      {/* Camera background */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1,
          backgroundColor: "#000", // fallback black background if no camera
        }}
      />

      {/* Transparent Canvas */}
      {cameraStarted && (
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 2 }}>
          <Canvas>
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Suspense fallback={null}>
              {/* Make draggable */}
              <DragControls>
                <FurnitureModel url={modelUrl} />
              </DragControls>
              <OrbitControls enableZoom={true} enablePan={false} />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Start Camera Button */}
      {!cameraStarted && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 3 }}>
          <button
            onClick={startCamera}
            style={{
              padding: "1rem 2rem",
              fontSize: "1.5rem",
              borderRadius: "8px",
              backgroundColor: "#0070f3",
              color: "#fff",
              border: "none",
            }}
          >
            Start Camera
          </button>
        </div>
      )}
    </div>
  );
}