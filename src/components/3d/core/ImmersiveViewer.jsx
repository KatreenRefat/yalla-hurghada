import { Suspense, useRef, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

import { useARStore } from "../../store/arStore";
import DivingScene from "../scenes/DivingScene";
import SafariScene from "../scenes/SafariScene";
import YachtScene  from "../scenes/YachtScene";
import gsap from "gsap";

// ── Scene registry ─────────────────────────────────────────────
const SCENES = { diving: DivingScene, safari: SafariScene, yacht: YachtScene };

const CAMERA_PRESETS = {
  diving: { pos: [0,    1,    9],  fov: 65 },
  safari: { pos: [4,    3,    8],  fov: 60 },
  yacht:  { pos: [5,    3.5,  9],  fov: 58 },
};

const SHADOW_Y = { diving: -4.18, safari: -0.08, yacht: 0.0 };

// ── Camera controller ─────────────────────────────────────────
function CameraRig({ sceneType }) {
  const { camera }  = useThree();
  const { autoRotate } = useARStore();
  const didAnimate  = useRef(false);
  const prevScene   = useRef(null);

  // Animate camera only when scene changes, not every frame
  useEffect(() => {
    if (prevScene.current === sceneType && didAnimate.current) return;
    prevScene.current  = sceneType;
    didAnimate.current = true;
    const preset = CAMERA_PRESETS[sceneType] || CAMERA_PRESETS.diving;
    gsap.to(camera.position, {
      x: preset.pos[0],
      y: preset.pos[1],
      z: preset.pos[2],
      duration: 1.8,
      ease: "power3.inOut",
      overwrite: "auto",
    });
  }, [sceneType, camera]);

  return (
    <OrbitControls
      enablePan={false}
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.55}
      zoomSpeed={0.8}
      minDistance={3}
      maxDistance={22}
      maxPolarAngle={Math.PI / 1.95}
      autoRotate={autoRotate}
      autoRotateSpeed={0.35}
    />
  );
}

// ── FPS monitor ───────────────────────────────────────────────
function PerfMonitor() {
  const { setFPS, setQuality, quality } = useARStore();
  const fc = useRef(0);
  const lt = useRef(performance.now());

  useFrame(() => {
    fc.current++;
    const now = performance.now();
    if (now - lt.current >= 2000) {
      const fps = Math.round(fc.current * 1000 / (now - lt.current));
      setFPS(fps);
      if (fps < 28 && quality !== "low")    setQuality("low");
      else if (fps > 52 && quality === "low") setQuality("medium");
      fc.current = 0;
      lt.current = now;
    }
  });
  return null;
}

// ── Loading fallback ──────────────────────────────────────────
function SceneLoader() {
  const mesh = useRef();
  useFrame((s) => {
    if (mesh.current) {
      mesh.current.rotation.y = s.clock.elapsedTime;
      mesh.current.rotation.x = s.clock.elapsedTime * 0.5;
    }
  });
  return (
    <mesh ref={mesh}>
      <octahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#0096c7" wireframe />
    </mesh>
  );
}

// ── Ambient light for all scenes ──────────────────────────────
function BaseEnvironment() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <hemisphereLight skyColor="#aaccff" groundColor="#332200" intensity={0.4} />
    </>
  );
}

// ── 3D Hotspot markers ────────────────────────────────────────
const HOTSPOT_DATA = {
  diving: [
    { id:"d1", position:[-3.5,-2.5,-2], label:"Coral Garden",  data:{ desc:"Vibrant coral formations with 200+ marine species.", features:["200+ Species","Photography","Guided Dive"] }},
    { id:"d2", position:[2.5, -1.5,-3], label:"Fish School",   data:{ desc:"Massive schools of tropical fish in their natural habitat.", features:["Tropical Fish","Snorkeling","Video Record"] }},
    { id:"d3", position:[0,  -2,   3],  label:"Reef Wall",     data:{ desc:"Dramatic underwater cliff dropping 40m into the blue.", features:["40m Drop","Cave Diving","Expert Guide"] }},
  ],
  safari: [
    { id:"s1", position:[-4, 0.5, 2],  label:"Bedouin Camp",  data:{ desc:"Authentic Bedouin settlement with traditional tea.", features:["Cultural Tour","Tea Ceremony","Local Guide"] }},
    { id:"s2", position:[0,  1.2, 0],  label:"Safari Jeep",   data:{ desc:"Your adventure starts in our premium 4x4 safari jeep.", features:["4x4 Jeep","Air Conditioned","GPS Guided"] }},
    { id:"s3", position:[5,  2,  -4],  label:"Dune Peak",     data:{ desc:"Panoramic view of the Sinai Desert at golden hour.", features:["Panoramic View","Photography","Sunset Watch"] }},
  ],
  yacht: [
    { id:"y1", position:[0,  1.8, 0],  label:"Sun Deck",      data:{ desc:"Panoramic upper deck with 360° sea views and open bar.", features:["Open Bar","Sunbeds","360° Views"] }},
    { id:"y2", position:[-3, 0.5, 0],  label:"Bow",           data:{ desc:"Stand at the bow and feel the ocean breeze as we cruise.", features:["Ocean Breeze","Photo Spot","VIP Access"] }},
    { id:"y3", position:[3,  0.2, 0],  label:"Stern Deck",    data:{ desc:"Swimming platform and snorkel launch point.", features:["Snorkel Launch","Swimming","Equipment"] }},
  ],
};

function Hotspot3D({ hotspot, onClick }) {
  const mesh = useRef();
  const ring = useRef();
  const { selectedHotspot } = useARStore();
  const isSelected = selectedHotspot?.id === hotspot.id;
  const baseY = hotspot.position[1];

  useFrame((s) => {
    if (!mesh.current || !ring.current) return;
    const t = s.clock.elapsedTime;
    mesh.current.position.y = baseY + Math.sin(t * 1.2 + hotspot.position[0]) * 0.08;
    ring.current.rotation.y += 0.018;
    ring.current.rotation.x += 0.006;
    const pulse = 1 + Math.sin(t * 2.5) * 0.1;
    ring.current.scale.setScalar(pulse);
  });

  return (
    <group
      position={[hotspot.position[0], 0, hotspot.position[2]]}
      onClick={(e) => { e.stopPropagation(); onClick(hotspot); }}
    >
      <mesh ref={mesh} position={[0, baseY, 0]}>
        <sphereGeometry args={[0.15, 14, 14]} />
        <meshStandardMaterial
          color={isSelected ? "#ffffff" : "#00c4e0"}
          emissive={isSelected ? "#aaffee" : "#006688"}
          emissiveIntensity={isSelected ? 0.9 : 0.45}
          roughness={0.1}
          metalness={0.7}
        />
      </mesh>
      <mesh ref={ring} position={[0, baseY, 0]}>
        <torusGeometry args={[0.3, 0.022, 6, 22]} />
        <meshBasicMaterial
          color={isSelected ? "#ffffff" : "#00c4e0"}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </mesh>
      <pointLight
        position={[0, baseY, 0]}
        intensity={isSelected ? 2 : 0.8}
        color="#00aaff"
        distance={isSelected ? 3 : 1.8}
      />
    </group>
  );
}

// ── Main exported component ───────────────────────────────────
export default function ImmersiveViewer({ sceneType = "diving" }) {
  const { selectHotspot, setAutoRotate, setSceneReady, quality } = useARStore();
  const ActiveScene = SCENES[sceneType] || DivingScene;
  const hotspots    = HOTSPOT_DATA[sceneType] || [];
  const shadowY     = SHADOW_Y[sceneType] ?? -0.1;

  const dpr = quality === "low"    ? 0.75
            : quality === "medium" ? 1
            : Math.min(window.devicePixelRatio ?? 1, 2);

  const handleHotspot = useCallback((h) => {
    selectHotspot(h);
    setAutoRotate(false);
  }, [selectHotspot, setAutoRotate]);

  return (
    <Canvas
      dpr={dpr}
      shadows                            /* ← R3F enables shadow map automatically */
      gl={{
        antialias: quality !== "low",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
        outputColorSpace: THREE.SRGBColorSpace,
        /* Do NOT pass shadowMap here — R3F handles it via `shadows` prop */
      }}
      onCreated={() => {
        /* Only call setSceneReady — do NOT touch gl.shadowMap */
        setSceneReady(true);
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          useARStore.getState().closeHotspot();
        }
      }}
    >
      <PerspectiveCamera makeDefault fov={62} near={0.1} far={100} />
      <CameraRig sceneType={sceneType} />
      <PerfMonitor />
      <BaseEnvironment />

      <Suspense fallback={<SceneLoader />}>
        <ActiveScene />
        <ContactShadows
          position={[0, shadowY, 0]}
          opacity={0.35}
          scale={14}
          blur={2.5}
          far={6}
          color="#000033"
        />
      </Suspense>

      {hotspots.map(h => (
        <Hotspot3D key={h.id} hotspot={h} onClick={handleHotspot} />
      ))}
    </Canvas>
  );
}
