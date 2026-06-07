"use client";

import { Suspense, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import BlurFade from "@/components/showreel/ui/BlurFade";

/* Particules dorées qui convergent doucement vers le centre. */
function ConvergingDust({ count = 1500 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 18 + Math.random() * 28;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = t * 0.04;
      const s = Math.max(0.35, 1 - t * 0.08);
      ref.current.scale.set(s, s, s);
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#f0d27a"
        transparent
        opacity={0.95}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* Noyau lumineux pulsant qui grandit. */
function GlowingCore() {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      const s = 0.4 + Math.min(1.6, t * 0.32);
      ref.current.scale.set(s, s, s);
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="#f8e8b8" transparent opacity={0.85} />
    </mesh>
  );
}

export default function Scene2Arrival({ t }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <Canvas camera={{ position: [0, 0, 14], fov: 60 }} dpr={[1, 1.5]}>
        <color attach="background" args={["#020208"]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 0, 0]} intensity={3} color="#f0d27a" />
        <Suspense fallback={null}>
          <Stars radius={120} depth={60} count={6000} factor={5} fade speed={0.4} />
          <ConvergingDust />
          <GlowingCore />
        </Suspense>
        <EffectComposer>
          <Bloom intensity={1.4} luminanceThreshold={0.2} mipmapBlur />
        </EffectComposer>
      </Canvas>

      {/* Halo doré central pulsant (HTML, plus net) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "65vmin",
          height: "65vmin",
          background:
            "radial-gradient(circle, rgba(240,210,122,0.45), transparent 65%)",
          filter: "blur(40px)",
        }}
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: [0.3, 1.05, 1], opacity: [0, 0.95, 0.7] }}
        transition={{ duration: 4.5, times: [0, 0.55, 1], ease: [0.85, 0, 0.15, 1] }}
      />

      {/* Logo AMAVYA officiel qui émerge */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
        initial={{ opacity: 0, scale: 0.6, filter: "blur(24px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.6, delay: 2.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="AMAVYA"
          className="h-auto w-[36vmin] max-w-[420px]"
          style={{
            filter:
              "drop-shadow(0 18px 60px rgba(240,210,122,0.6)) drop-shadow(0 0 30px rgba(240,210,122,0.4))",
          }}
        />
      </motion.div>

      {/* Eyebrow et titre en bas */}
      <BlurFade delay={5} duration={0.9} yOffset={20}>
        <div className="absolute inset-x-0 bottom-[12%] z-10 px-6 text-center">
          <div className="text-[10px] uppercase tracking-[0.45em] text-gold-bright">
            {t.s2.eyebrow}
          </div>
          <h2
            className="mt-3 text-balance text-2xl font-semibold leading-tight text-paper sm:text-3xl lg:text-[3.4vw]"
            style={{
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.85))",
            }}
          >
            <div>{t.s2.title}</div>
            <div>{t.s2.title2}</div>
          </h2>
        </div>
      </BlurFade>
    </div>
  );
}
