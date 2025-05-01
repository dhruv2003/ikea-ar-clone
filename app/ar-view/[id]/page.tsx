"use client";

import { Canvas } from "@react-three/fiber";
import { useParams } from "next/navigation";
import { Suspense, useRef, useState, useEffect } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const models: { [key: string]: string } = {
  "chair-1": "/chair_model.glb",
  "table-1": "/table_model.glb",
  "sofa-1": "/sofa_model.glb",
};

function PlacedModel({
  url,
  position,
  scale,
}: {
  url: string;
  position: THREE.Vector3;
  scale: number;
}) {
  const { scene } = useGLTF(url);
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <primitive object={scene} />
    </group>
  );
}

export default function ARViewPage() {
  const params = useParams();
  const [id, setId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      setId(params.id as string);
      setLoading(false);
    } else {
      setId(null);
      setLoading(false);
    }
  }, [params]);

  const modelUrl = id ? models[id] : null;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [placedItems, setPlacedItems] = useState<{ position: THREE.Vector3; scale: number }[]>([]);
  const [scale] = useState(0.5);

  const cameraRef = useRef<THREE.Camera | null>(null);

  const startCamera = async () => {
    console.log("📷 Attempting to start camera");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert("Camera not supported on this device/browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      console.log("✅ Camera stream received");

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStarted(true);
      }
    } catch (err) {
      console.error("❌ Camera error:", err);
      alert("Failed to access camera.");
    }
  };

  const handleCanvasClick = () => {
    if (!cameraRef.current) return;
    const direction = new THREE.Vector3();
    cameraRef.current.getWorldDirection(direction);
    const newPosition = cameraRef.current.position.clone().add(direction.multiplyScalar(2)).setY(0);
    setPlacedItems([...placedItems, { position: newPosition, scale }]);
  };

  if (loading) return <div>Loading...</div>;
  if (!id || !modelUrl) return <div>Product not found</div>;

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
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
          backgroundColor: "#000",
        }}
      />
      {cameraStarted && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 2,
          }}
        >
          <Canvas
            shadows
            onCreated={({ camera }) => {
              cameraRef.current = camera;
            }}
            onClick={handleCanvasClick}
          >
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Suspense fallback={null}>
              {placedItems.map((item, index) => (
                <PlacedModel
                  key={index}
                  url={modelUrl}
                  position={item.position}
                  scale={item.scale}
                />
              ))}
              <OrbitControls enableZoom={true} enablePan={false} />
            </Suspense>
          </Canvas>
        </div>
      )}
      {!cameraStarted && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 3,
          }}
        >
          <button className="primary" onClick={startCamera}>
            Start Camera
          </button>
        </div>
      )}
    </div>
  );
}
