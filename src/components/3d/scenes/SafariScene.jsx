import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── Desert dune ────────────────────────────────────────────────────────────────
function Dune({ position = [0,0,0], width = 6, height = 1.8, depth = 5 }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(width, depth, 48, 48);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getY(i);
      const dist = Math.sqrt((x/width*2)**2 + (z/depth*2)**2);
      const h = Math.max(0, height * (1 - dist * 0.7) * (1 + Math.sin(x*0.8)*0.15 + Math.cos(z*0.5)*0.1));
      pos.setZ(i, h + (Math.random()-0.5)*0.06);
    }
    pos.needsUpdate = true;
    g.computeVertexNormals();
    return g;
  }, [width, depth, height]);

  return (
    <mesh geometry={geo} position={position} rotation={[-Math.PI/2, 0, 0]}
          receiveShadow castShadow>
      <meshStandardMaterial color="#c8a05a" roughness={0.96} metalness={0.01} />
    </mesh>
  );
}

// ── Sandy ground ───────────────────────────────────────────────────────────────
function DesertFloor() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(40, 40, 60, 60);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getY(i);
      pos.setZ(i,
        Math.sin(x*0.2)*0.15 + Math.cos(z*0.15)*0.12 +
        Math.sin((x+z)*0.1)*0.08 + (Math.random()-0.5)*0.04
      );
    }
    pos.needsUpdate = true;
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh geometry={geo} rotation={[-Math.PI/2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
      <meshStandardMaterial color="#d4a85a" roughness={0.98} metalness={0.01} />
    </mesh>
  );
}

// ── Sand particle system ───────────────────────────────────────────────────────
function SandParticles({ count = 120 }) {
  const ref = useRef();
  const { positions, velocities } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const v = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i*3]   = (Math.random()-0.5)*20;
      p[i*3+1] = Math.random()*4;
      p[i*3+2] = (Math.random()-0.5)*20;
      v[i*3]   = 0.02 + Math.random()*0.03;
      v[i*3+1] = -0.003 + Math.random()*0.004;
      v[i*3+2] = (Math.random()-0.5)*0.01;
    }
    return { positions: p, velocities: v };
  }, [count]);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      pos.array[i*3]   += velocities[i*3];
      pos.array[i*3+1] += velocities[i*3+1];
      pos.array[i*3+2] += velocities[i*3+2];
      if (pos.array[i*3] > 10 || pos.array[i*3+1] < 0) {
        pos.array[i*3]   = -10;
        pos.array[i*3+1] = Math.random()*3;
        pos.array[i*3+2] = (Math.random()-0.5)*20;
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position"
          args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#e8c870" size={0.04} transparent opacity={0.5}
        sizeAttenuation depthWrite={false} />
    </points>
  );
}

// ── Palm tree ──────────────────────────────────────────────────────────────────
function PalmTree({ position = [0,0,0], height = 3, lean = 0 }) {
  const trunkRef = useRef();
  useFrame((s) => {
    if (trunkRef.current) {
      trunkRef.current.rotation.z = lean + Math.sin(s.clock.elapsedTime * 0.4) * 0.02;
    }
  });

  const segments = 8;
  return (
    <group position={position}>
      {/* Trunk */}
      <group ref={trunkRef}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.14, height, 8, segments]} />
          <meshStandardMaterial color="#8B5E3C" roughness={0.95} metalness={0.02} />
        </mesh>
        {/* Fronds */}
        {Array.from({length: 7}, (_, i) => {
          const a = (i/7)*Math.PI*2;
          return (
            <group key={i} position={[0, height/2, 0]}
                   rotation={[0.7, a, 0]}>
              <mesh castShadow>
                <coneGeometry args={[0.04, 2.2, 4, 1]} />
                <meshStandardMaterial color="#2d8a40" roughness={0.7} metalness={0.05}
                  side={THREE.DoubleSide} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}

// ── Rock formation ─────────────────────────────────────────────────────────────
function RockFormation({ position = [0,0,0] }) {
  const rocks = useMemo(() =>
    Array.from({length: 4}, (_, i) => ({
      pos: [(Math.random()-0.5)*1.2, Math.random()*0.3, (Math.random()-0.5)*1.2],
      scale: [
        0.3 + Math.random()*0.7,
        0.2 + Math.random()*0.5,
        0.3 + Math.random()*0.7,
      ],
      rot: [Math.random()*0.5, Math.random()*Math.PI, Math.random()*0.5],
    })), []);

  return (
    <group position={position}>
      {rocks.map((r, i) => (
        <mesh key={i} position={r.pos} scale={r.scale} rotation={r.rot} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.6, 1]} />
          <meshStandardMaterial color={i%2 ? "#7a6a52" : "#8a7a60"}
            roughness={0.92} metalness={0.04} />
        </mesh>
      ))}
    </group>
  );
}

// ── Jeep / vehicle (procedural) ────────────────────────────────────────────────
function SafariJeep({ position = [0, 0, 0] }) {
  return (
    <group position={position} scale={0.8}>
      {/* Body */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[2.2, 0.7, 1.1]} />
        <meshStandardMaterial color="#6b7c3a" roughness={0.7} metalness={0.3} />
      </mesh>
      {/* Cab */}
      <mesh position={[0.1, 1.05, 0]} castShadow>
        <boxGeometry args={[1.1, 0.65, 1.0]} />
        <meshStandardMaterial color="#5a6830" roughness={0.6} metalness={0.35} />
      </mesh>
      {/* Windows */}
      <mesh position={[0.1, 1.05, 0.51]} castShadow>
        <planeGeometry args={[0.9, 0.45]} />
        <meshStandardMaterial color="#88aacc" roughness={0.05} metalness={0.8}
          transparent opacity={0.7} />
      </mesh>
      {/* Wheels */}
      {[[-0.8, 0.28, 0.55], [0.8, 0.28, 0.55], [-0.8, 0.28, -0.55], [0.8, 0.28, -0.55]].map((wp, i) => (
        <group key={i} position={wp} rotation={[Math.PI/2, 0, 0]}>
          <mesh castShadow>
            <torusGeometry args={[0.28, 0.12, 8, 16]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.1} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.16, 0.16, 0.06, 12]} />
            <meshStandardMaterial color="#555555" roughness={0.5} metalness={0.7} />
          </mesh>
        </group>
      ))}
      {/* Roof rack */}
      <mesh position={[0.1, 1.4, 0]} castShadow>
        <boxGeometry args={[1.05, 0.05, 0.95]} />
        <meshStandardMaterial color="#4a5228" roughness={0.8} metalness={0.4} />
      </mesh>
      {/* Bull bar */}
      <mesh position={[-1.12, 0.55, 0]} castShadow>
        <boxGeometry args={[0.05, 0.5, 1.0]} />
        <meshStandardMaterial color="#888" roughness={0.4} metalness={0.8} />
      </mesh>
      {/* Headlights */}
      {[-0.35, 0.35].map((z, i) => (
        <mesh key={i} position={[-1.13, 0.55, z]}>
          <circleGeometry args={[0.1, 12]} />
          <meshStandardMaterial color="#ffffcc" emissive="#ffee88" emissiveIntensity={1}
            roughness={0.1} metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// ── Hot sun ────────────────────────────────────────────────────────────────────
function DesertSun() {
  const sunRef = useRef();
  useFrame((s) => {
    if (sunRef.current) {
      const t = s.clock.elapsedTime * 0.05;
      sunRef.current.position.set(Math.cos(t)*15, 14 + Math.sin(t)*2, -10);
    }
  });

  return (
    <group ref={sunRef} position={[10, 14, -10]}>
      <mesh>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial color="#fff4aa" />
      </mesh>
      <pointLight intensity={3} color="#ffeeaa" distance={60} decay={1.2} castShadow />
    </group>
  );
}

// ── Haze / heat shimmer ────────────────────────────────────────────────────────
function HeatHaze() {
  const geo = useMemo(() => new THREE.PlaneGeometry(40, 5, 30, 10), []);
  const ref = useRef();

  useFrame((s) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    const t = s.clock.elapsedTime;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      pos.setZ(i, Math.sin(x*0.5 + t*2)*0.05 + Math.sin(x*0.9 + t*1.3)*0.03);
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={ref} geometry={geo} rotation={[-Math.PI/2, 0, 0]} position={[0, 0.02, 5]}>
      <meshBasicMaterial color="#e8d5a0" transparent opacity={0.08}
        depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ── Sky gradient ───────────────────────────────────────────────────────────────
function DesertSky() {
  return (
    <mesh position={[0, 0, -15]}>
      <planeGeometry args={[60, 30]} />
      <meshBasicMaterial color="#e8a030" side={THREE.BackSide} />
    </mesh>
  );
}

// ── Main Safari Scene ──────────────────────────────────────────────────────────
export default function SafariScene() {
  return (
    <group>
      <fog attach="fog" args={["#e8c070", 18, 45]} />

      {/* Lighting — hot desert sun */}
      <ambientLight intensity={0.6} color="#ffcc80" />
      <directionalLight position={[8, 12, -5]} intensity={2.5} color="#fff4aa"
        castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}
        shadow-camera-far={30} shadow-camera-near={0.1}
        shadow-camera-left={-12} shadow-camera-right={12}
        shadow-camera-top={12} shadow-camera-bottom={-12} />
      <pointLight position={[-5, 3, 5]} intensity={0.5} color="#ffaa44" distance={20} />

      <DesertSky />
      <DesertFloor />
      <DesertSun />
      <SandParticles count={130} />
      <HeatHaze />

      {/* Dune formations */}
      <Dune position={[-6, 0, -4]} width={8} height={2.2} depth={6} />
      <Dune position={[6,  0, -5]} width={7} height={1.8} depth={5.5} />
      <Dune position={[-2, 0, -8]} width={10} height={3} depth={7} />
      <Dune position={[3,  0, 5]}  width={6} height={1.5} depth={5} />
      <Dune position={[-8, 0, 3]}  width={5} height={1.3} depth={4} />

      {/* Palm trees */}
      <PalmTree position={[-4, 0, 2]}  height={3.5} lean={0.08} />
      <PalmTree position={[-3.5, 0, 3]} height={2.8} lean={-0.05} />
      <PalmTree position={[4,   0, 1]}  height={3.2} lean={0.06} />
      <PalmTree position={[0,   0, -6]} height={4}   lean={0.04} />

      {/* Rock formations */}
      <RockFormation position={[-5, 0.1, -2]} />
      <RockFormation position={[5,  0.1, -3]} />
      <RockFormation position={[2,  0.1, 4]} />
      <RockFormation position={[-7, 0.1, 4]} />

      {/* Safari jeep */}
      <SafariJeep position={[0, 0.05, 0]} />
    </group>
  );
}
