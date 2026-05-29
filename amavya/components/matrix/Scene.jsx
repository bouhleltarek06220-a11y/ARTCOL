"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import CodeRain from "./CodeRain";
import { CAM } from "./data";

const damp = THREE.MathUtils.damp;
const smoothstep = (t) => t * t * (3 - 2 * t);

/* ===== Tunnel synthwave doré (anneaux + nervures) ===== */
function Tunnel({ progressRef }) {
  const groupRef = useRef();
  const rings = useMemo(() => Array.from({ length: 16 }, (_, i) => -i * 2.2), []);
  const walls = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      arr.push({ x: Math.cos(a) * 3, y: Math.sin(a) * 3 });
    }
    return arr;
  }, []);

  useFrame(() => {
    const p = Math.max(0, Math.min(1, progressRef.current));
    // Visible à partir de p≈0.4, plein opaque à 0.55
    const o = Math.max(0, Math.min(1, (p - 0.4) / 0.15));
    if (groupRef.current) {
      groupRef.current.traverse((child) => {
        if (child.material && child.material.transparent) {
          child.material.opacity = o * 0.85;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {rings.map((z, i) => (
        <mesh key={`r${i}`} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3, 0.035, 8, 56]} />
          <meshBasicMaterial color="#f0d27a" transparent opacity={0} toneMapped={false} />
        </mesh>
      ))}
      {walls.map((w, i) => (
        <mesh key={`w${i}`} position={[w.x, w.y, -16]}>
          <boxGeometry args={[0.04, 0.04, 32]} />
          <meshBasicMaterial color="#f0d27a" transparent opacity={0} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ===== Cœur AMAVYA — sphère lumineuse pulsante + halos ===== */
function Core({ progressRef }) {
  const groupRef = useRef();
  const innerRef = useRef();
  const innerMat = useRef();
  const halo1Mat = useRef();
  const halo2Mat = useRef();

  useFrame((s, dt) => {
    const t = s.clock.elapsedTime;
    const p = Math.max(0, Math.min(1, progressRef.current));

    if (innerRef.current) {
      innerRef.current.rotation.y += dt * 0.35;
      innerRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
      const sc = 1 + Math.sin(t * 1.6) * 0.07;
      innerRef.current.scale.setScalar(sc);
    }

    // Visible à partir de p≈0.65, plein à 0.85
    const o = Math.max(0, Math.min(1, (p - 0.65) / 0.20));
    if (innerMat.current) innerMat.current.opacity = o;
    if (halo1Mat.current) halo1Mat.current.opacity = o * 0.28;
    if (halo2Mat.current) halo2Mat.current.opacity = o * 0.12;
  });

  return (
    <group ref={groupRef} position={[0, 0, -15]}>
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial
          ref={innerMat}
          color="#f5d27a"
          emissive="#f0c052"
          emissiveIntensity={3.2}
          roughness={0.3}
          metalness={0.6}
          transparent
          opacity={0}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.4, 32, 32]} />
        <meshBasicMaterial
          ref={halo1Mat}
          color="#f0d27a"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[3.4, 32, 32]} />
        <meshBasicMaterial
          ref={halo2Mat}
          color="#a87f2e"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/* ===== Caméra cinématique pilotée par le scroll ===== */
function CameraRig({ progressRef, mouseRef }) {
  const { camera } = useThree();
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0, -1), []);

  useFrame((s, dt) => {
    const t = s.clock.elapsedTime;
    const p = Math.max(0, Math.min(1, progressRef.current));
    const N = CAM.length;
    const cont = p * (N - 1);
    const i0 = Math.floor(cont);
    const i1 = Math.min(N - 1, i0 + 1);
    const f = smoothstep(cont - i0);
    const a = CAM[i0].pos, b = CAM[i1].pos;
    const la = CAM[i0].look, lb = CAM[i1].look;

    const tx = a[0] + (b[0] - a[0]) * f + Math.sin(t * 0.3) * 0.05 + (mouseRef.current.x || 0) * 0.3;
    const ty = a[1] + (b[1] - a[1]) * f + Math.cos(t * 0.25) * 0.04 + (mouseRef.current.y || 0) * 0.2;
    const tz = a[2] + (b[2] - a[2]) * f;

    camera.position.x = damp(camera.position.x, tx, 3, dt);
    camera.position.y = damp(camera.position.y, ty, 3, dt);
    camera.position.z = damp(camera.position.z, tz, 3, dt);

    lookTarget.set(
      la[0] + (lb[0] - la[0]) * f,
      la[1] + (lb[1] - la[1]) * f,
      la[2] + (lb[2] - la[2]) * f,
    );
    camera.lookAt(lookTarget);
  });

  return null;
}

/* ===== Scène ===== */
export default function Scene({ progressRef, mouseRef, mobile }) {
  return (
    <Canvas
      dpr={mobile ? [1, 1.4] : [1, 2]}
      camera={{ position: [0, 0, 6], fov: 60, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      className="absolute inset-0"
    >
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 14, 28]} />

      <ambientLight intensity={0.4} color="#bbcaff" />
      <directionalLight position={[6, 4, 6]} intensity={1.2} color="#fff1d2" />
      <pointLight position={[0, 0, -15]} intensity={3.5} color="#f0d27a" distance={12} decay={1.4} />

      <Stars radius={50} depth={40} count={mobile ? 800 : 2200} factor={3} fade speed={0.3} />

      <CodeRain progressRef={progressRef} />
      <Tunnel progressRef={progressRef} />
      <Core progressRef={progressRef} />

      <CameraRig progressRef={progressRef} mouseRef={mouseRef} />

      <EffectComposer multisampling={0}>
        <Bloom intensity={mobile ? 0.9 : 1.4} luminanceThreshold={0.3} luminanceSmoothing={0.85} mipmapBlur />
        <ChromaticAberration offset={[0.0008, 0.0012]} blendFunction={BlendFunction.NORMAL} />
        <Vignette eskil={false} offset={0.2} darkness={0.7} />
      </EffectComposer>
    </Canvas>
  );
}
