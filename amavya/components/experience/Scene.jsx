"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { CAM, MODULES, STOP_TO_MODULE, STOPS } from "./data";

const damp = THREE.MathUtils.damp;
const smoothstep = (t) => t * t * (3 - 2 * t);

/* ===== Noyau IA central : sphère émissive + carcasse + anneaux orbitaux ===== */
function AiCore() {
  const inner = useRef();
  const wire = useRef();
  const ringA = useRef();
  const ringB = useRef();

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (inner.current) {
      inner.current.rotation.y += dt * 0.25;
      inner.current.rotation.x = Math.sin(t * 0.4) * 0.15;
      const s = 1 + Math.sin(t * 1.8) * 0.05;
      inner.current.scale.setScalar(s);
    }
    if (wire.current) {
      wire.current.rotation.y -= dt * 0.35;
      wire.current.rotation.z += dt * 0.1;
    }
    if (ringA.current) ringA.current.rotation.z += dt * 0.4;
    if (ringB.current) ringB.current.rotation.x += dt * 0.3;
  });

  return (
    <group>
      {/* Noyau intérieur émissif */}
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.72, 1]} />
        <meshStandardMaterial
          color="#f5d27a"
          emissive="#f0c052"
          emissiveIntensity={2.2}
          roughness={0.25}
          metalness={0.6}
        />
      </mesh>

      {/* Carcasse en fil de fer */}
      <mesh ref={wire}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshBasicMaterial color="#f0d27a" wireframe transparent opacity={0.35} />
      </mesh>

      {/* Halo additif */}
      <mesh>
        <sphereGeometry args={[1.25, 32, 32]} />
        <meshBasicMaterial
          color="#f0d27a"
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.65, 32, 32]} />
        <meshBasicMaterial
          color="#a87f2e"
          transparent
          opacity={0.05}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Anneaux orbitaux */}
      <mesh ref={ringA} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.012, 8, 128]} />
        <meshBasicMaterial color="#f0d27a" transparent opacity={0.45} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
        <torusGeometry args={[2.1, 0.008, 8, 128]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

/* ===== Un orbiteur : ligne neuronale + nœud (icosa) + halo, avec scale "actif" ===== */
function Orbiter({ index, config, activeRef }) {
  const groupRef = useRef();
  const haloRef = useRef();
  const matRef = useRef();
  const lineRef = useRef();
  const lineMatRef = useRef();
  const scaleRef = useRef(1);

  const posArray = useMemo(() => new Float32Array(6), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const angle = t * config.sp + config.ph;

    // Position sur un plan incliné
    let x = Math.cos(angle) * config.r;
    let y = 0;
    let z = Math.sin(angle) * config.r;
    const cx = Math.cos(config.tx), sx = Math.sin(config.tx);
    const y1 = y * cx - z * sx;
    const z1 = y * sx + z * cx;
    y = y1; z = z1;
    const cz = Math.cos(config.tz), sz = Math.sin(config.tz);
    const x2 = x * cz - y * sz;
    const y2 = x * sz + y * cz;
    x = x2; y = y2;

    if (groupRef.current) {
      groupRef.current.position.set(x, y, z);
      groupRef.current.rotation.y += dt * 1.1;
    }

    // Scale "actif"
    const isActive = activeRef.current === index;
    const target = isActive ? 1.55 : 1;
    scaleRef.current = damp(scaleRef.current, target, 6, dt);
    if (groupRef.current) groupRef.current.scale.setScalar(scaleRef.current);
    if (matRef.current) matRef.current.emissiveIntensity = isActive ? 3.2 : 1.6;

    // Halo qui pulse
    if (haloRef.current) {
      const p = 1 + Math.sin(t * 2 + config.ph) * 0.1;
      haloRef.current.scale.setScalar(p * (isActive ? 1.4 : 1));
    }

    // Ligne neuronale 0,0,0 -> position monde
    if (lineRef.current) {
      const arr = lineRef.current.geometry.attributes.position.array;
      arr[0] = 0; arr[1] = 0; arr[2] = 0;
      arr[3] = x; arr[4] = y; arr[5] = z;
      lineRef.current.geometry.attributes.position.needsUpdate = true;
    }
    if (lineMatRef.current) {
      const base = isActive ? 0.85 : 0.35;
      lineMatRef.current.opacity = base + Math.sin(t * 3 + config.ph * 1.7) * 0.18;
    }
  });

  return (
    <>
      {/* Ligne neuronale */}
      <line ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={posArray} count={2} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial ref={lineMatRef} color={config.color} transparent opacity={0.4} />
      </line>

      {/* Nœud orbital */}
      <group ref={groupRef}>
        <mesh>
          <icosahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial
            ref={matRef}
            color={config.color}
            emissive={config.color}
            emissiveIntensity={1.6}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
        {/* Carcasse */}
        <mesh>
          <icosahedronGeometry args={[0.24, 0]} />
          <meshBasicMaterial color={config.color} wireframe transparent opacity={0.45} />
        </mesh>
        {/* Halo */}
        <mesh ref={haloRef}>
          <sphereGeometry args={[0.5, 24, 24]} />
          <meshBasicMaterial
            color={config.color}
            transparent
            opacity={0.18}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </>
  );
}

/* ===== Nuage de particules (espace intérieur) ===== */
function Particles({ count }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribution sphérique en couronne ~3..12
      const r = 3 + Math.pow(Math.random(), 0.7) * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.02;
      ref.current.rotation.x += dt * 0.008;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#cbd5ff"
        transparent
        opacity={0.65}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ===== Caméra : scroll + parallaxe souris + breathing ===== */
function CameraRig({ progressRef, mouseRef }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 2, 9.5), []);
  const lookAt = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const p = Math.max(0, Math.min(1, progressRef.current));
    const cont = p * (STOPS - 1);
    const i0 = Math.floor(cont);
    const i1 = Math.min(STOPS - 1, i0 + 1);
    const f = smoothstep(cont - i0);
    const a = CAM[i0].pos, b = CAM[i1].pos;
    target.set(
      a[0] + (b[0] - a[0]) * f,
      a[1] + (b[1] - a[1]) * f,
      a[2] + (b[2] - a[2]) * f,
    );

    // breathing + parallaxe souris
    target.x += Math.sin(t * 0.3) * 0.15 + (mouseRef.current.x || 0) * 0.6;
    target.y += Math.cos(t * 0.25) * 0.1 + (mouseRef.current.y || 0) * 0.4;

    camera.position.x = damp(camera.position.x, target.x, 3.5, dt);
    camera.position.y = damp(camera.position.y, target.y, 3.5, dt);
    camera.position.z = damp(camera.position.z, target.z, 3.5, dt);
    camera.lookAt(lookAt);
  });

  return null;
}

/* ===== Scène : exporte le composant Canvas ===== */
export default function Scene({ progressRef, mouseRef, activeRef, mobile }) {
  // index actif dérivé en continu pour les orbiteurs
  useEffect(() => {
    const id = setInterval(() => {
      const p = Math.max(0, Math.min(1, progressRef.current));
      const stop = Math.max(0, Math.min(STOPS - 1, Math.round(p * (STOPS - 1))));
      const mod = STOP_TO_MODULE[stop];
      activeRef.current = mod == null ? -1 : mod;
    }, 80);
    return () => clearInterval(id);
  }, [progressRef, activeRef]);

  const particleCount = mobile ? 700 : 1900;

  return (
    <Canvas
      dpr={mobile ? [1, 1.4] : [1, 2]}
      camera={{ position: [0, 2, 9.5], fov: 48, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="absolute inset-0"
    >
      <color attach="background" args={["#03050a"]} />
      <fog attach="fog" args={["#03050a", 14, 28]} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 6, 5]} intensity={0.6} color="#cbd5ff" />
      <pointLight position={[0, 0, 0]} intensity={2.6} color="#f0d27a" distance={9} decay={1.6} />

      <Stars radius={45} depth={40} count={mobile ? 800 : 2400} factor={3.5} fade speed={0.4} />
      <Particles count={particleCount} />

      <AiCore />
      {MODULES.map((cfg, i) => (
        <Orbiter key={cfg.key} index={i} config={cfg} activeRef={activeRef} />
      ))}

      <CameraRig progressRef={progressRef} mouseRef={mouseRef} />
    </Canvas>
  );
}
