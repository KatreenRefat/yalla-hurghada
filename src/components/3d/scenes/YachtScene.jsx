import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── Ocean water surface ────────────────────────────────────────────────────────
function Ocean() {
  const ref = useRef();
  const geo = useMemo(() => new THREE.PlaneGeometry(60, 60, 100, 100), []);

  useFrame((s) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    const t = s.clock.elapsedTime;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      pos.setZ(i,
        Math.sin(x*0.25 + t*0.8)*0.22 +
        Math.sin(z*0.2  + t*0.65)*0.18 +
        Math.sin((x+z)*0.15 + t*1.1)*0.1  +
        Math.sin(x*0.5 + z*0.3  + t*1.4)*0.05
      );
    }
    pos.needsUpdate = true;
    ref.current.geometry.computeVertexNormals();
  });

  return (
    <mesh ref={ref} geometry={geo} rotation={[-Math.PI/2, 0, 0]} position={[0, 0, 0]}
          receiveShadow>
      <meshStandardMaterial color="#006994" roughness={0.02} metalness={0.95}
        envMapIntensity={2.5} transparent opacity={0.88} />
    </mesh>
  );
}

// ── Ocean foam strips ──────────────────────────────────────────────────────────
function OceanFoam() {
  const ref = useRef();
  const geo = useMemo(() => new THREE.PlaneGeometry(60, 60, 30, 30), []);

  useFrame((s) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    const t = s.clock.elapsedTime;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      pos.setZ(i,
        Math.sin(x*0.25 + t*0.8)*0.22 +
        Math.sin(z*0.2  + t*0.65)*0.18 + 0.04
      );
    }
    pos.needsUpdate = true;
    ref.current.material.opacity =
      0.08 + Math.abs(Math.sin(s.clock.elapsedTime * 0.3)) * 0.06;
  });

  return (
    <mesh ref={ref} geometry={geo} rotation={[-Math.PI/2, 0, 0]} position={[0, 0.01, 0]}>
      <meshBasicMaterial color="#eef8ff" transparent opacity={0.1}
        depthWrite={false} />
    </mesh>
  );
}

// ── Water spray particles ──────────────────────────────────────────────────────
function WaterSpray({ count = 60 }) {
  const ref = useRef();
  const { positions, velocities, origins } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const v = new Float32Array(count * 3);
    const o = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const ox = (Math.random()-0.5)*4 - 1.5;
      const oz = -2.5 + (Math.random()-0.5)*1.5;
      o[i*3] = ox; o[i*3+1] = 0.3; o[i*3+2] = oz;
      p[i*3] = ox; p[i*3+1] = 0.3; p[i*3+2] = oz;
      v[i*3]   = (Math.random()-0.5)*0.04;
      v[i*3+1] = 0.02 + Math.random()*0.04;
      v[i*3+2] = 0.01 + Math.random()*0.02;
    }
    return { positions: p, velocities: v, origins: o };
  }, [count]);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      pos.array[i*3]   += velocities[i*3];
      pos.array[i*3+1] += velocities[i*3+1];
      pos.array[i*3+1] -= 0.003; // gravity
      pos.array[i*3+2] += velocities[i*3+2];
      if (pos.array[i*3+1] < 0) {
        pos.array[i*3]   = origins[i*3];
        pos.array[i*3+1] = origins[i*3+1];
        pos.array[i*3+2] = origins[i*3+2];
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
      <pointsMaterial color="#cceeff" size={0.05} transparent opacity={0.65}
        sizeAttenuation depthWrite={false} />
    </points>
  );
}

// ── Luxury yacht (full procedural) ────────────────────────────────────────────
function LuxuryYacht({ position = [0, 0, 0] }) {
  const yachtRef = useRef();

  useFrame((s) => {
    if (!yachtRef.current) return;
    const t = s.clock.elapsedTime;
    yachtRef.current.position.y = position[1] +
      Math.sin(t*0.5)*0.08 + Math.sin(t*0.3)*0.04;
    yachtRef.current.rotation.z = Math.sin(t*0.4)*0.012;
    yachtRef.current.rotation.x = Math.sin(t*0.35)*0.008;
  });

  return (
    <group ref={yachtRef} position={position}>
      {/* Hull — main body */}
      <mesh position={[0, -0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[7, 0.7, 2.2]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.15} metalness={0.5} />
      </mesh>
      {/* Hull bottom — dark keel */}
      <mesh position={[0, -0.6, 0]} castShadow>
        <boxGeometry args={[7, 0.3, 2.0]} />
        <meshStandardMaterial color="#1a1a2a" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Bow (pointed front) */}
      <mesh position={[-3.2, -0.15, 0]} rotation={[0, -Math.PI/2, 0]} castShadow>
        <coneGeometry args={[1.1, 1.2, 4, 1]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.15} metalness={0.5} />
      </mesh>

      {/* Main deck */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[6.5, 0.12, 2.1]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Superstructure — main cabin */}
      <mesh position={[0.5, 0.75, 0]} castShadow>
        <boxGeometry args={[3.5, 0.9, 1.8]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.12} metalness={0.55} />
      </mesh>
      {/* Upper bridge */}
      <mesh position={[0.8, 1.42, 0]} castShadow>
        <boxGeometry args={[2.2, 0.55, 1.6]} />
        <meshStandardMaterial color="#eeeeee" roughness={0.1} metalness={0.6} />
      </mesh>

      {/* Windows — main cabin */}
      {[-1.2, -0.4, 0.4, 1.2].map((x, i) => (
        <mesh key={i} position={[x, 0.75, 0.91]} castShadow>
          <planeGeometry args={[0.55, 0.4]} />
          <meshStandardMaterial color="#88aadd" roughness={0.05} metalness={0.9}
            transparent opacity={0.75} />
        </mesh>
      ))}
      {/* Windows — bridge */}
      {[-0.6, 0, 0.6].map((x, i) => (
        <mesh key={i} position={[x + 0.8, 1.42, 0.81]} castShadow>
          <planeGeometry args={[0.45, 0.35]} />
          <meshStandardMaterial color="#aaccee" roughness={0.05} metalness={0.9}
            transparent opacity={0.75} />
        </mesh>
      ))}

      {/* Mast */}
      <mesh position={[-0.5, 2.3, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.05, 2.8, 8]} />
        <meshStandardMaterial color="#cccccc" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Radar / antenna */}
      <mesh position={[-0.5, 3.8, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#888888" roughness={0.4} metalness={0.7} />
      </mesh>
      {/* Antenna rod */}
      <mesh position={[-0.5, 4.15, 0]}>
        <cylinderGeometry args={[0.01, 0.015, 0.7, 4]} />
        <meshStandardMaterial color="#999999" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Railing posts */}
      {[-3, -2.2, -1.4, -0.6, 0.2, 1, 1.8, 2.6].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0.5, 1.05]}>
            <cylinderGeometry args={[0.015, 0.015, 0.55, 4]} />
            <meshStandardMaterial color="#cccccc" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[x, 0.5, -1.05]}>
            <cylinderGeometry args={[0.015, 0.015, 0.55, 4]} />
            <meshStandardMaterial color="#cccccc" roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
      ))}
      {/* Railing rails */}
      <mesh position={[0, 0.73, 1.05]}>
        <cylinderGeometry args={[0.01, 0.01, 6.5, 4]} rotation={[0, 0, Math.PI/2]} />
        <meshStandardMaterial color="#bbbbbb" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.73, -1.05]}>
        <cylinderGeometry args={[0.01, 0.01, 6.5, 4]} rotation={[0, 0, Math.PI/2]} />
        <meshStandardMaterial color="#bbbbbb" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Sun deck chairs */}
      {[-1, 0, 1].map((z, i) => (
        <group key={i} position={[-2.2, 0.3, z * 0.65]}>
          <mesh>
            <boxGeometry args={[0.8, 0.06, 0.4]} />
            <meshStandardMaterial color="#e8d5a0" roughness={0.8} metalness={0.1} />
          </mesh>
          <mesh position={[-0.28, 0.2, 0]} rotation={[Math.PI/6, 0, 0]}>
            <boxGeometry args={[0.25, 0.5, 0.38]} />
            <meshStandardMaterial color="#e8d5a0" roughness={0.8} metalness={0.1} />
          </mesh>
        </group>
      ))}

      {/* Life rings */}
      {[2.5, -2.5].map((x, i) => (
        <mesh key={i} position={[x, 0.65, 1.12]} rotation={[0, 0, Math.PI/2]}>
          <torusGeometry args={[0.18, 0.045, 8, 16]} />
          <meshStandardMaterial color={i%2 ? "#ee4444" : "#ffffff"} roughness={0.6} metalness={0.1} />
        </mesh>
      ))}

      {/* Bow wake effect */}
      <WaterSpray count={55} />
    </group>
  );
}

// ── Horizon sky ────────────────────────────────────────────────────────────────
function HorizonSky() {
  return (
    <>
      {/* Sky dome */}
      <mesh position={[0, 5, 0]}>
        <sphereGeometry args={[40, 24, 16]} />
        <meshBasicMaterial color="#1a6699" side={THREE.BackSide} />
      </mesh>
      {/* Horizon glow */}
      <mesh position={[0, -1, -15]} rotation={[Math.PI/2, 0, 0]}>
        <planeGeometry args={[60, 8]} />
        <meshBasicMaterial color="#ffaa44" transparent opacity={0.25}
          side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </>
  );
}

// ── Seagull (simple procedural) ────────────────────────────────────────────────
function Seagull({ index }) {
  const ref = useRef();
  const phase  = useMemo(() => (index / 5) * Math.PI * 2, [index]);
  const radius = useMemo(() => 8 + index * 2, [index]);
  const height = useMemo(() => 4 + index * 0.8, [index]);

  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime * 0.2 + phase;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.y = height + Math.sin(t * 1.5) * 0.4;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.rotation.y = t + Math.PI;

    // Wing flap
    const wingPhase = s.clock.elapsedTime * 3;
    ref.current.children[0].rotation.z =  Math.sin(wingPhase) * 0.3;
    ref.current.children[1].rotation.z = -Math.sin(wingPhase) * 0.3;
  });

  return (
    <group ref={ref}>
      {/* Left wing */}
      <mesh position={[-0.3, 0, 0]}>
        <boxGeometry args={[0.5, 0.03, 0.12]} />
        <meshStandardMaterial color="#dddddd" roughness={0.8} metalness={0.1} />
      </mesh>
      {/* Right wing */}
      <mesh position={[0.3, 0, 0]}>
        <boxGeometry args={[0.5, 0.03, 0.12]} />
        <meshStandardMaterial color="#dddddd" roughness={0.8} metalness={0.1} />
      </mesh>
      {/* Body */}
      <mesh>
        <sphereGeometry args={[0.08, 6, 6]} />
        <meshStandardMaterial color="#eeeeee" roughness={0.8} />
      </mesh>
    </group>
  );
}

// ── Main Yacht Scene ───────────────────────────────────────────────────────────
export default function YachtScene() {
  return (
    <group>
      <fog attach="fog" args={["#4488aa", 25, 55]} />

      {/* Cinematic ocean lighting */}
      <ambientLight intensity={0.5} color="#aaccee" />
      <directionalLight position={[10, 15, 5]} intensity={2.0} color="#fff8ee"
        castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-far={35} shadow-camera-near={0.1}
        shadow-camera-left={-12} shadow-camera-right={12}
        shadow-camera-top={12} shadow-camera-bottom={-12} />
      <pointLight position={[-8, 3, 0]} intensity={0.7} color="#4488bb" distance={20} />
      <pointLight position={[0, 2, 8]}  intensity={0.6} color="#3377aa" distance={15} />
      {/* Sunset rim light */}
      <directionalLight position={[-12, 2, -8]} intensity={0.8} color="#ff8844" />

      <HorizonSky />
      <Ocean />
      <OceanFoam />

      {/* Main yacht */}
      <LuxuryYacht position={[0, 0.15, 0]} />

      {/* Seagulls */}
      {Array.from({length: 5}, (_, i) => <Seagull key={i} index={i} />)}

      {/* Distant islands / silhouettes */}
      {[[-22, -1, -18], [18, -1, -22], [-18, -1, 10]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <coneGeometry args={[2 + i, 3 + i * 0.8, 6, 1]} />
          <meshStandardMaterial color="#334422" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}
