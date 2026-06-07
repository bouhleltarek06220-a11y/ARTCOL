"use client";

import { Suspense, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import BlurFade from "@/components/showreel/ui/BlurFade";

const CONTINENTS = [
  { name: "Europe", lat: 50, lng: 10 },
  { name: "Amérique du Nord", lat: 40, lng: -100 },
  { name: "Amérique du Sud", lat: -15, lng: -55 },
  { name: "Asie", lat: 35, lng: 105 },
  { name: "Afrique", lat: 0, lng: 20 },
  { name: "Océanie", lat: -25, lng: 135 },
  { name: "Moyen-Orient", lat: 25, lng: 45 },
];

function latLngToVec(lat, lng, r = 1) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

/* Sphère filaire en doré qui représente la Terre. */
function WireGlobe() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.08;
  });
  return (
    <group ref={ref}>
      {/* Sphère pleine sombre */}
      <mesh>
        <sphereGeometry args={[2.2, 48, 48]} />
        <meshBasicMaterial color="#070815" />
      </mesh>
      {/* Filaire doré */}
      <mesh>
        <sphereGeometry args={[2.22, 24, 24]} />
        <meshBasicMaterial color="#f0d27a" wireframe transparent opacity={0.32} />
      </mesh>
      {/* Atmosphère */}
      <mesh>
        <sphereGeometry args={[2.45, 32, 32]} />
        <meshBasicMaterial
          color="#f0d27a"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Points lumineux par continent */}
      {CONTINENTS.map((c, i) => {
        const p = latLngToVec(c.lat, c.lng, 2.22);
        return (
          <group key={c.name} position={[p.x, p.y, p.z]}>
            <mesh>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshBasicMaterial color="#7dd3fc" />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.16, 12, 12]} />
              <meshBasicMaterial color="#7dd3fc" transparent opacity={0.3} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* Arcs animés entre continents pour figurer le réseau. */
function NetworkArcs() {
  const arcsData = useMemo(() => {
    const arcs = [];
    for (let i = 0; i < CONTINENTS.length; i++) {
      for (let j = i + 1; j < CONTINENTS.length; j++) {
        const a = latLngToVec(CONTINENTS[i].lat, CONTINENTS[i].lng, 2.22);
        const b = latLngToVec(CONTINENTS[j].lat, CONTINENTS[j].lng, 2.22);
        // Point de contrôle au milieu, soulevé pour faire un arc
        const mid = new THREE.Vector3()
          .addVectors(a, b)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(2.9);
        const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
        arcs.push({
          points: curve.getPoints(40),
          delay: (i + j) * 0.18,
        });
      }
    }
    return arcs;
  }, []);

  return (
    <group>
      {arcsData.map((arc, i) => {
        const positions = new Float32Array(arc.points.length * 3);
        arc.points.forEach((p, k) => {
          positions[k * 3] = p.x;
          positions[k * 3 + 1] = p.y;
          positions[k * 3 + 2] = p.z;
        });
        return (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={arc.points.length}
                array={positions}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color="#f0d27a"
              transparent
              opacity={0.35}
            />
          </line>
        );
      })}
    </group>
  );
}

export default function Scene6GlobalFuture({ t }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#02030a]">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 1.5]}>
        <color attach="background" args={["#02030a"]} />
        <ambientLight intensity={0.45} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#f0d27a" />
        <Suspense fallback={null}>
          <Stars radius={120} depth={50} count={4500} factor={5} fade speed={0.3} />
          <WireGlobe />
          <NetworkArcs />
        </Suspense>
        <EffectComposer>
          <Bloom intensity={1.2} luminanceThreshold={0.25} mipmapBlur />
        </EffectComposer>
      </Canvas>

      <BlurFade delay={0.5} duration={0.7}>
        <div className="absolute left-1/2 top-[10%] -translate-x-1/2 text-center text-[10px] uppercase tracking-[0.45em] text-gold-bright">
          {t.s6.eyebrow}
        </div>
      </BlurFade>

      <BlurFade delay={3.4} duration={0.9} yOffset={20}>
        <div className="absolute inset-x-0 bottom-[10%] z-30 px-6 text-center">
          <h2
            className="text-balance text-3xl font-semibold leading-tight text-paper sm:text-4xl lg:text-[3.6vw]"
            style={{
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.85))",
            }}
          >
            <span className="bg-[linear-gradient(110deg,#a87f2e,#f0d27a_50%,#d4af37)] bg-clip-text text-transparent">
              {t.s6.title}
            </span>
          </h2>
          <p className="mt-3 text-sm uppercase tracking-[0.3em] text-paper/70 sm:text-base">
            {t.s6.sub}
          </p>
        </div>
      </BlurFade>
    </div>
  );
}
