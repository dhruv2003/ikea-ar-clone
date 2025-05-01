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
  rotation = 0,
}: {
  url: string;
  position: THREE.Vector3;
  scale: number;
  rotation?: number;
}) {
  const { scene } = useGLTF(url);
  return (
    <group position={position} scale={[scale, scale, scale]} rotation={[0, rotation, 0]}>
      <primitive object={scene} />
    </group>
  );
}

interface PlacedItem {
  position: THREE.Vector3;
  scale: number;
  rotation: number;
  id: string;
}

interface TouchGestureState {
  lastPinchDistance: number | null;
  lastAngle: number | null;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [scale] = useState(0.5);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [showControls, setShowControls] = useState(false);
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

  useEffect(() => {
    if (!containerRef.current || !cameraStarted) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        setSelectedItemIndex(null);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (selectedItemIndex !== null && e.touches.length === 1) {
        e.preventDefault();
      }
    };

    const handlePinchGesture = (e: TouchEvent) => {
      if (e.touches.length === 2 && selectedItemIndex !== null) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const gestureState = containerRef.current as HTMLDivElement & TouchGestureState;
        gestureState.lastPinchDistance = gestureState.lastPinchDistance || distance;

        const scaleChange = distance / (gestureState.lastPinchDistance || distance);

        if (scaleChange !== 1 && !isNaN(scaleChange)) {
          setPlacedItems(items =>
            items.map((item, idx) => {
              if (idx === selectedItemIndex) {
                const newScale = Math.max(0.1, Math.min(2.0, item.scale * scaleChange));
                return { ...item, scale: newScale };
              }
              return item;
            })
          );
        }

        gestureState.lastPinchDistance = distance;
      }
    };

    const handleRotateGesture = (e: TouchEvent) => {
      if (e.touches.length === 2 && selectedItemIndex !== null) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        const angle = Math.atan2(
          touch2.clientY - touch1.clientY,
          touch2.clientX - touch1.clientX
        );

        const gestureState = containerRef.current as HTMLDivElement & TouchGestureState;
        gestureState.lastAngle = gestureState.lastAngle || angle;

        const rotationChange = angle - (gestureState.lastAngle || angle);

        if (!isNaN(rotationChange)) {
          setPlacedItems(items =>
            items.map((item, idx) => {
              if (idx === selectedItemIndex) {
                return { ...item, rotation: item.rotation + rotationChange };
              }
              return item;
            })
          );
        }

        gestureState.lastAngle = angle;
      }
    };

    const handleTouchEnd = () => {
      const gestureState = containerRef.current as HTMLDivElement & TouchGestureState;
      gestureState.lastPinchDistance = null;
      gestureState.lastAngle = null;
    };

    const container = containerRef.current;
    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchmove", handleTouchMove);
    container.addEventListener("touchmove", handlePinchGesture);
    container.addEventListener("touchmove", handleRotateGesture);
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchmove", handlePinchGesture);
      container.removeEventListener("touchmove", handleRotateGesture);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [cameraStarted, selectedItemIndex]);

  const handleCanvasClick = () => {
    if (!cameraRef.current) return;

    if (selectedItemIndex !== null) {
      setSelectedItemIndex(null);
      return;
    }

    const direction = new THREE.Vector3();
    cameraRef.current.getWorldDirection(direction);
    const newPosition = cameraRef.current.position.clone().add(direction.multiplyScalar(2)).setY(0);

    const newItem = {
      position: newPosition,
      scale,
      rotation: 0,
      id: `item-${Date.now()}`,
    };

    setPlacedItems([...placedItems, newItem]);

    setSelectedItemIndex(placedItems.length);
    setShowControls(true);
  };

  const handleDeleteItem = () => {
    if (selectedItemIndex !== null) {
      setPlacedItems(items => items.filter((_, idx) => idx !== selectedItemIndex));
      setSelectedItemIndex(null);
      setShowControls(false);
    }
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
          ref={containerRef}
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
              {placedItems.map((item) => (
                <PlacedModel
                  key={item.id}
                  url={modelUrl}
                  position={item.position}
                  scale={item.scale}
                  rotation={item.rotation}
                />
              ))}
              <OrbitControls enableZoom={true} enablePan={false} />
            </Suspense>
          </Canvas>

          {showControls && selectedItemIndex !== null && (
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "rgba(255,255,255,0.8)",
                borderRadius: "20px",
                padding: "10px",
                display: "flex",
                gap: "10px",
                zIndex: 10,
                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              }}
            >
              <button
                onClick={() => handleDeleteItem()}
                style={{
                  background: "red",
                  border: "none",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                }}
                aria-label="Delete item"
              >
                🗑️
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span>Scale:</span>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={placedItems[selectedItemIndex]?.scale || scale}
                  onChange={e => {
                    const newScale = parseFloat(e.target.value);
                    setPlacedItems(items =>
                      items.map((item, idx) => {
                        if (idx === selectedItemIndex) {
                          return { ...item, scale: newScale };
                        }
                        return item;
                      })
                    );
                  }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span>Rotate:</span>
                <input
                  type="range"
                  min="0"
                  max={Math.PI * 2}
                  step="0.1"
                  value={placedItems[selectedItemIndex]?.rotation || 0}
                  onChange={e => {
                    const newRotation = parseFloat(e.target.value);
                    setPlacedItems(items =>
                      items.map((item, idx) => {
                        if (idx === selectedItemIndex) {
                          return { ...item, rotation: newRotation };
                        }
                        return item;
                      })
                    );
                  }}
                />
              </div>
            </div>
          )}

          {placedItems.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "rgba(0,0,0,0.7)",
                color: "white",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "14px",
                pointerEvents: "none",
                opacity: 0.8,
              }}
            >
              Pinch to resize • Use two fingers to rotate
            </div>
          )}
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
