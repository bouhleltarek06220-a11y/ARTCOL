"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { CAM, STOPS } from "./data";

const damp = THREE.MathUtils.damp;
const smoothstep = (t) => t * t * (3 - 2 * t);

/* Bruit FBM léger (sin/cos), assez pour donner une carte de biomes organique */
function noise3(x, y, z) {
  let n = 0, amp = 1, freq = 1, norm = 0;
  for (let i = 0; i < 4; i++) {
    n += amp * (Math.sin(x * freq * 1.7 + 1.3) * Math.cos(y * freq * 2.1 + 0.7) + Math.sin(z * freq * 1.3 - 0.4));
    norm += amp * 2;
    amp *= 0.5;
    freq *= 1.95;
  }
  return n / norm;
}

function biomeColor(n) {
  if (n < -0.18) return [0.04, 0.16, 0.40];
  if (n < -0.05) return [0.07, 0.26, 0.46];
  if (n < 0.08)  return [0.08, 0.36, 0.22];
  if (n < 0.22)  return [0.20, 0.44, 0.20];
  if (n < 0.36)  return [0.50, 0.38, 0.16];
  return [0.96, 0.78, 0.32];
}

/* ===== Planète : icosaèdre LP + couleurs vertex + petit relief + veines (points additifs) ===== */
function Planet() {
  const ref = useRef();
  const { geo, veinPos } = useMemo(() => {
    const radius = 3;
    const g = new THREE.IcosahedronGeometry(radius, 5);
    const pos = g.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const veins = [];
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i), py = pos.getY(i), pz = pos.getZ(i);
      const nx = px / radius, ny = py / radius, nz = pz / radius;
      const n = noise3(nx * 1.8, ny * 1.8, nz * 1.8);
      const [r, gC, b] = biomeColor(n);
      colors[i * 3] = r; colors[i * 3 + 1] = gC; colors[i * 3 + 2] = b;
      const disp = Math.max(0, n) * 0.16 * radius;
      pos.setXYZ(i, px + nx * disp, py + ny * disp, pz + nz * disp);
      if (n > 0.36) veins.push(px + nx * disp, py + ny * disp, pz + nz * disp);
    }
    pos.needsUpdate = true;
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return { geo: g, veinPos: new Float32Array(veins) };
  }, []);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.045;
  });

  return (
    <group ref={ref}>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial vertexColors flatShading metalness={0.18} roughness={0.85} emissive="#160d05" emissiveIntensity={0.18} />
      </mesh>

      {/* Veines dorées (rivières neuronales) */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={veinPos} count={veinPos.length / 3} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.055} color="#f6d27a" transparent opacity={0.95} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

/* ===== Atmosphère : sphère backside, shader Fresnel additif ===== */
function Atmosphere({ radius = 3.45, color = "#67aeff", power = 2.6, alpha = 0.9 }) {
  const mat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(color) }, uPower: { value: power }, uAlpha: { value: alpha } },
      vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform vec3 uColor; uniform float uPower; uniform float uAlpha; varying vec3 vNormal;
        void main() { float rim = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), uPower); gl_FragColor = vec4(uColor * rim, rim * uAlpha); }`,
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [color, power, alpha]);

  return (
    <mesh>
      <sphereGeometry args={[radius, 64, 64]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

/* ===== Forêts émissives : InstancedMesh, placées sur les biomes forêt/highland ===== */
function Trees({ count = 320, radius = 3 }) {
  const ref = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useEffect(() => {
    if (!ref.current) return;
    let placed = 0;
    let attempts = 0;
    const max = count * 6;
    while (placed < count && attempts < max) {
      attempts++;
      const u = Math.random(), v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const nx = Math.sin(phi) * Math.cos(theta);
      const ny = Math.cos(phi);
      const nz = Math.sin(phi) * Math.sin(theta);
      const n = noise3(nx * 1.8, ny * 1.8, nz * 1.8);
      if (n < -0.05 || n > 0.22) continue; // forêt/highland uniquement
      const disp = Math.max(0, n) * 0.16 * radius;
      const r = radius + disp + 0.04;
      const x = nx * r, y = ny * r, z = nz * r;
      dummy.position.set(x, y, z);
      const normal = new THREE.Vector3(nx, ny, nz);
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      dummy.quaternion.copy(q);
      const sc = 0.06 + Math.random() * 0.06;
      dummy.scale.set(sc * 0.7, sc, sc * 0.7);
      dummy.updateMatrix();
      ref.current.setMatrixAt(placed, dummy.matrix);
      placed++;
    }
    ref.current.count = placed;
    ref.current.instanceMatrix.needsUpdate = true;
  }, [count, radius, dummy]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <coneGeometry args={[0.5, 1.4, 5]} />
      <meshStandardMaterial color="#26b56e" emissive="#3ce2a0" emissiveIntensity={0.7} roughness={0.6} />
    </instancedMesh>
  );
}

/* ===== Îles flottantes (orbite lente, légère oscillation) ===== */
function Islands({ count = 7, base = 4.3 }) {
  const refs = useRef([]);
  const conf = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        r: base + Math.random() * 1.2,
        speed: 0.04 + Math.random() * 0.08,
        phase: Math.random() * Math.PI * 2,
        tilt: (Math.random() - 0.5) * 0.8,
        size: 0.22 + Math.random() * 0.22,
        color: ["#67e8f9", "#a78bfa", "#fb7185", "#34d399", "#f0d27a", "#93c5fd", "#f59e0b"][i % 7],
      })),
    [count, base],
  );
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const c = conf[i];
      const a = t * c.speed + c.phase;
      const x = Math.cos(a) * c.r, z = Math.sin(a) * c.r;
      const y = Math.sin(a * 0.9 + c.phase * 0.7) * 0.9 + c.tilt * 1.4;
      const g = refs.current[i];
      if (g) {
        g.position.set(x, y, z);
        g.rotation.y = t * 0.45 + c.phase;
      }
    }
  });
  return conf.map((c, i) => (
    <group key={i} ref={(el) => (refs.current[i] = el)}>
      {/* plateau */}
      <mesh>
        <cylinderGeometry args={[c.size, c.size * 0.55, 0.06, 18]} />
        <meshStandardMaterial color="#13172a" emissive={c.color} emissiveIntensity={0.55} roughness={0.7} />
      </mesh>
      {/* arbre lumineux dessus */}
      <mesh position={[0, 0.14, 0]}>
        <coneGeometry args={[0.05, 0.18, 5]} />
        <meshStandardMaterial color={c.color} emissive={c.color} emissiveIntensity={1.4} />
      </mesh>
      {/* lueur dessous */}
      <mesh position={[0, -0.06, 0]}>
        <sphereGeometry args={[c.size * 0.7, 16, 16]} />
        <meshBasicMaterial color={c.color} transparent opacity={0.25} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  ));
}

/* ===== Drones autonomes : octahédres lumineux sur orbites inclinées ===== */
function Drones({ count = 14, base = 4.0 }) {
  const refs = useRef([]);
  const conf = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        r: base + Math.random() * 1.6,
        sp: 0.22 + Math.random() * 0.35,
        ph: Math.random() * Math.PI * 2,
        incl: (Math.random() - 0.5) * 1.3,
        color: ["#cbd5ff", "#67e8f9", "#f0d27a", "#a78bfa", "#34d399"][i % 5],
      })),
    [count, base],
  );
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const c = conf[i];
      const a = t * c.sp + c.ph;
      let x = Math.cos(a) * c.r, y = 0, z = Math.sin(a) * c.r;
      const ci = Math.cos(c.incl), si = Math.sin(c.incl);
      const y1 = y * ci - z * si, z1 = y * si + z * ci;
      y = y1; z = z1;
      const g = refs.current[i];
      if (g) {
        g.position.set(x, y, z);
        g.rotation.y = a + Math.PI / 2;
        g.rotation.z = c.incl;
      }
    }
  });
  return conf.map((c, i) => (
    <group key={i} ref={(el) => (refs.current[i] = el)}>
      <mesh>
        <octahedronGeometry args={[0.06, 0]} />
        <meshStandardMaterial color={c.color} emissive={c.color} emissiveIntensity={2.2} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshBasicMaterial color={c.color} transparent opacity={0.32} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  ));
}

/* ===== Poussière cosmique ===== */
function CosmicDust({ count = 1100 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 15;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(p) * Math.cos(t);
      arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      arr[i * 3 + 2] = r * Math.cos(p);
    }
    return arr;
  }, [count]);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.012;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#cbd5ff" transparent opacity={0.45} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/* ===== Caméra cinématique ===== */
function CameraRig({ progressRef, mouseRef }) {
  const { camera } = useThree();
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
    const tx = a[0] + (b[0] - a[0]) * f + Math.sin(t * 0.15) * 0.15 + (mouseRef.current.x || 0) * 0.5;
    const ty = a[1] + (b[1] - a[1]) * f + Math.cos(t * 0.13) * 0.10 + (mouseRef.current.y || 0) * 0.35;
    const tz = a[2] + (b[2] - a[2]) * f + Math.sin(t * 0.10) * 0.10;
    camera.position.x = damp(camera.position.x, tx, 2.4, dt);
    camera.position.y = damp(camera.position.y, ty, 2.4, dt);
    camera.position.z = damp(camera.position.z, tz, 2.4, dt);
    camera.lookAt(
      la[0] + (lb[0] - la[0]) * f,
      la[1] + (lb[1] - la[1]) * f,
      la[2] + (lb[2] - la[2]) * f,
    );
  });
  return null;
}

/* ===== Scène ===== */
export default function Scene({ progressRef, mouseRef, mobile }) {
  return (
    <Canvas
      dpr={mobile ? [1, 1.4] : [1, 2]}
      camera={{ position: [0, 2, 18], fov: 50, near: 0.1, far: 120 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", logarithmicDepthBuffer: false }}
      className="absolute inset-0"
    >
      <color attach="background" args={["#020308"]} />
      <fog attach="fog" args={["#020308", 20, 38]} />

      <ambientLight intensity={0.28} color="#9fb5ff" />
      <directionalLight position={[10, 7, 6]} intensity={1.8} color="#fff1d2" />
      <pointLight position={[0, 0, 0]} intensity={2.2} color="#f0d27a" distance={5.5} decay={1.6} />

      <Stars radius={70} depth={50} count={mobile ? 1200 : 3500} factor={4} fade speed={0.5} />
      <CosmicDust count={mobile ? 500 : 1100} />

      <Planet />
      <Atmosphere radius={3.45} color="#67aeff" power={2.6} alpha={0.95} />
      <Atmosphere radius={3.6} color="#a78bfa" power={3.2} alpha={0.6} />
      {!mobile && <Trees count={260} radius={3} />}
      <Islands count={mobile ? 4 : 7} base={4.3} />
      <Drones count={mobile ? 8 : 14} base={4.0} />

      <CameraRig progressRef={progressRef} mouseRef={mouseRef} />

      <EffectComposer multisampling={0}>
        <Bloom intensity={mobile ? 0.85 : 1.25} luminanceThreshold={0.35} luminanceSmoothing={0.85} mipmapBlur />
        <Vignette eskil={false} offset={0.18} darkness={0.62} />
      </EffectComposer>
    </Canvas>
  );
}
