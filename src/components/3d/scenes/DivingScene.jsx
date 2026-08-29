import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── Procedural coral branch ───────────────────────────────────────────────────
function CoralBranch({ position = [0,0,0], color, scale = 1, rotOffset = 0 }) {
  const mesh = useRef();
  const speed = useMemo(() => 0.3 + Math.random() * 0.4, []);
  const phase = useMemo(() => rotOffset + Math.random() * Math.PI * 2, [rotOffset]);

  const geo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.025 * scale, 0.055 * scale, 0.55 * scale, 6, 4);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const norm = (y + 0.275 * scale) / (0.55 * scale);
      if (norm > 0.5) {
        const taper = 1 - (norm - 0.5) * 1.5;
        pos.setX(i, pos.getX(i) * Math.max(taper, 0.1));
        pos.setZ(i, pos.getZ(i) * Math.max(taper, 0.1));
      }
      // add organic noise
      pos.setX(i, pos.getX(i) + (Math.random() - 0.5) * 0.01 * scale);
      pos.setZ(i, pos.getZ(i) + (Math.random() - 0.5) * 0.01 * scale);
    }
    pos.needsUpdate = true;
    g.computeVertexNormals();
    return g;
  }, [scale]);

  useFrame((s) => {
    if (mesh.current) {
      mesh.current.rotation.z = Math.sin(s.clock.elapsedTime * speed + phase) * 0.07;
      mesh.current.rotation.x = Math.sin(s.clock.elapsedTime * speed * 0.7 + phase) * 0.03;
    }
  });

  return (
    <mesh ref={mesh} position={position} geometry={geo} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.65} metalness={0.1}
        emissive={color} emissiveIntensity={0.07} />
    </mesh>
  );
}

function CoralCluster({ position = [0, 0, 0] }) {
  const colors = ["#ff4477", "#ff7733", "#cc2288", "#ff5599", "#aa44cc",
                  "#ff8844", "#ee3366", "#ff6622"];
  const branches = useMemo(() =>
    Array.from({ length: 9 }, (_, i) => ({
      pos: [(Math.random()-0.5)*0.7, 0, (Math.random()-0.5)*0.7],
      color: colors[i % colors.length],
      scale: 0.6 + Math.random() * 1.1,
      rot: [0, Math.random()*Math.PI*2, (Math.random()-0.5)*0.35],
    })), []); // eslint-disable-line

  return (
    <group position={position}>
      {branches.map((b, i) => (
        <group key={i} position={b.pos} rotation={b.rot}>
          <CoralBranch color={b.color} scale={b.scale} rotOffset={i} />
          {[0.14, 0.24].map((h, j) => (
            <group key={j} position={[0, h * b.scale, 0]}
                   rotation={[0, j * Math.PI + i, 0.45]}>
              <CoralBranch color={b.color} scale={b.scale * 0.48} rotOffset={i + j} />
            </group>
          ))}
        </group>
      ))}
      <mesh position={[0, -0.07, 0]} receiveShadow>
        <cylinderGeometry args={[0.42, 0.52, 0.14, 8]} />
        <meshStandardMaterial color="#3a3a5a" roughness={0.92} metalness={0.05} />
      </mesh>
    </group>
  );
}

// ── Procedural fish ────────────────────────────────────────────────────────────
function Fish({ index, total, color, schoolRadius, yOffset }) {
  const mesh = useRef();
  const phase   = useMemo(() => (index / total) * Math.PI * 2, [index, total]);
  const speed   = useMemo(() => 0.17 + (index % 6) * 0.03, [index]);
  const yWobble = useMemo(() => Math.random() * 0.8 - 0.4, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const v = new Float32Array([
      // body
       0,     0,    0.22,   -0.07, 0.04, -0.1,  0.07, 0.04, -0.1,
       0,     0,    0.22,    0.07, 0.04, -0.1,  0.07,-0.04, -0.1,
       0,     0,    0.22,    0.07,-0.04, -0.1, -0.07,-0.04, -0.1,
       0,     0,    0.22,   -0.07,-0.04, -0.1, -0.07, 0.04, -0.1,
      // tail fin
      -0.14,  0,  -0.13,   0,     0,   -0.09,  0.14,  0,  -0.13,
      // dorsal fin
       0,     0.09,-0.05,  0,     0,   -0.02,  0,     0,    0.1,
    ]);
    g.setAttribute("position", new THREE.BufferAttribute(v, 3));
    g.computeVertexNormals();
    return g;
  }, []);

  useFrame((s) => {
    if (!mesh.current) return;
    const t = s.clock.elapsedTime * speed + phase;
    mesh.current.position.x = Math.cos(t) * schoolRadius;
    mesh.current.position.z = Math.sin(t) * schoolRadius;
    mesh.current.position.y = yOffset + yWobble + Math.sin(t * 1.4) * 0.12;
    mesh.current.rotation.y = Math.atan2(
      -Math.sin(t) * schoolRadius, -Math.cos(t) * schoolRadius
    ) + Math.PI;
    mesh.current.rotation.z = Math.sin(s.clock.elapsedTime * 7 + phase) * 0.06;
  });

  return (
    <mesh ref={mesh} geometry={geo} scale={0.18} castShadow>
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.4}
        emissive={color} emissiveIntensity={0.08} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ── Bubble particle system ─────────────────────────────────────────────────────
function Bubbles({ count = 90 }) {
  const ref = useRef();
  const { positions, speeds } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const sp = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      p[i*3]   = (Math.random()-0.5)*16;
      p[i*3+1] = Math.random()*-8 - 1;
      p[i*3+2] = (Math.random()-0.5)*16;
      sp[i]    = 0.006 + Math.random() * 0.014;
    }
    return { positions: p, speeds: sp };
  }, [count]);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      pos.array[i*3+1] += speeds[i];
      if (pos.array[i*3+1] > 4.5) {
        pos.array[i*3+1] = -8;
        pos.array[i*3]   = (Math.random()-0.5)*16;
        pos.array[i*3+2] = (Math.random()-0.5)*16;
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
      <pointsMaterial color="#aaddff" size={0.06} transparent opacity={0.55}
        sizeAttenuation depthWrite={false} />
    </points>
  );
}

// ── Caustic light rays ─────────────────────────────────────────────────────────
function LightRays() {
  const group = useRef();
  useFrame((s) => {
    if (!group.current) return;
    group.current.children.forEach((ray, i) => {
      if (ray.material) {
        ray.material.opacity =
          0.025 + Math.abs(Math.sin(s.clock.elapsedTime * 0.25 + i * 0.8)) * 0.065;
      }
    });
  });

  return (
    <group ref={group} position={[0, 4.2, 0]}>
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const r = 0.3 + (i % 3) * 0.3;
        return (
          <mesh key={i} position={[Math.cos(a)*r, -4, Math.sin(a)*r]}
                rotation={[0, a, 0.12 + (i%3)*0.06]}>
            <coneGeometry args={[0.55 + (i%3)*0.2, 9, 4, 1, true]} />
            <meshBasicMaterial color="#88ccff" transparent opacity={0.04}
              side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
}

// ── Animated water surface ─────────────────────────────────────────────────────
function WaterSurface() {
  const ref = useRef();
  const geo = useMemo(() => new THREE.PlaneGeometry(30, 30, 80, 80), []);

  useFrame((s) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    const t = s.clock.elapsedTime;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      pos.setZ(i,
        Math.sin(x*0.5 + t*0.9)*0.09 +
        Math.sin(z*0.4 + t*0.65)*0.07 +
        Math.sin((x+z)*0.28 + t*1.1)*0.04
      );
    }
    pos.needsUpdate = true;
    ref.current.geometry.computeVertexNormals();
  });

  return (
    <mesh ref={ref} geometry={geo} rotation={[-Math.PI/2, 0, 0]} position={[0, 4.2, 0]}>
      <meshStandardMaterial color="#001a33" transparent opacity={0.6}
        roughness={0.03} metalness={0.92} envMapIntensity={2}
        side={THREE.FrontSide} />
    </mesh>
  );
}

// ── Seafloor ───────────────────────────────────────────────────────────────────
function SeaFloor() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(30, 30, 40, 40);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.setZ(i, (Math.random()-0.5)*0.4);
    }
    pos.needsUpdate = true;
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh geometry={geo} rotation={[-Math.PI/2, 0, 0]} position={[0, -4.2, 0]} receiveShadow>
      <meshStandardMaterial color="#b89850" roughness={0.98} metalness={0} />
    </mesh>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export default function DivingScene() {
  const coralPos = useMemo(() => [
    [-3.5,-4,-2], [2.5,-4,-3.5], [-1,-4,3], [4,-4,1],
    [-4.5,-4,2.5], [0,-4,-4.5], [3.5,-4,3.5], [-2,-4,-1],
    [1.5,-4,1.5], [-3,-4,0.5], [0.5,-4,2.8], [3,-4,-1.5],
  ], []);

  return (
    <group>
      <fog attach="fog" args={["#002244", 10, 30]} />
      <ambientLight intensity={0.35} color="#003366" />
      <directionalLight position={[0, 8, 2]} intensity={1.4} color="#77bbff"
        castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}
        shadow-camera-far={22} shadow-camera-near={0.1} />
      <pointLight position={[-4, 0, -4]} intensity={0.7} color="#0055aa" distance={12} />
      <pointLight position={[4,  1,  4]} intensity={0.6} color="#003388" distance={12} />
      <pointLight position={[0,  2,  0]} intensity={0.8} color="#0077cc" distance={10} />

      <SeaFloor />
      <WaterSurface />
      <LightRays />
      <Bubbles count={100} />

      {coralPos.map((p, i) => <CoralCluster key={i} position={p} />)}

      {/* Rock formations */}
      {[[-2.5,-3.7,-2],[3.2,-3.5,2.2],[-4,-3.8,1.2],[1,-3.6,-2.8]].map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <dodecahedronGeometry args={[0.45 + (i%3)*0.2, 0]} />
          <meshStandardMaterial color="#252535" roughness={0.94} metalness={0.06} />
        </mesh>
      ))}

      {/* Fish schools */}
      <group>
        {Array.from({length: 20}, (_,i) => (
          <Fish key={i} index={i} total={20} color="#ff8800"
                schoolRadius={2.8} yOffset={-0.5} />
        ))}
      </group>
      <group>
        {Array.from({length: 14}, (_,i) => (
          <Fish key={i} index={i} total={14} color="#00aaff"
                schoolRadius={3.5} yOffset={-1.5} />
        ))}
      </group>
      <group>
        {Array.from({length: 10}, (_,i) => (
          <Fish key={i} index={i} total={10} color="#ffcc00"
                schoolRadius={2.1} yOffset={0.5} />
        ))}
      </group>

      {/* Central highlight structure */}
      <group position={[0, -2, 0]}>
        <mesh castShadow>
          <torusGeometry args={[1.4, 0.18, 10, 32]} />
          <meshStandardMaterial color="#cc3388" roughness={0.55} metalness={0.2}
            emissive="#881144" emissiveIntensity={0.12} />
        </mesh>
        {[0, Math.PI/3, Math.PI*2/3].map((a, i) => (
          <mesh key={i} position={[Math.cos(a)*1.4, 0.2, Math.sin(a)*1.4]} castShadow>
            <sphereGeometry args={[0.12, 10, 10]} />
            <meshStandardMaterial color="#ff6644" roughness={0.4} metalness={0.3}
              emissive="#cc3300" emissiveIntensity={0.2} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
