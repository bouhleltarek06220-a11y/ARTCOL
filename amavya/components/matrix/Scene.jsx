"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Lightformer, Sparkles, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import CodeWorld from "./CodeWorld";
import CodeCarpet from "./CodeCarpet";
import Message3D from "./Message3D";
import { lerpColor } from "./data";

/* ===== Pilote l'ambiance (fog + sparkles color) selon le voyage ===== */
function Ambience({ progressRef }) {
  const fog = useRef();
  useFrame(({ scene }) => {
    const p = Math.max(0, Math.min(1, progressRef.current));
    const c = lerpColor(p);
    if (scene.fog) scene.fog.color.setRGB((c.r / 255) * 0.12, (c.g / 255) * 0.12, (c.b / 255) * 0.12);
  });
  return null;
}

export default function Scene({ progressRef, mobile, lang = "fr", onReady }) {
  return (
    <Canvas
      dpr={mobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 1.4, 9], fov: 62, near: 0.1, far: 120 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={() => onReady?.()}
      className="absolute inset-0"
    >
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000308", 16, 46]} />

      <ambientLight intensity={0.35} color="#9fb4ff" />
      <directionalLight position={[5, 6, 4]} intensity={1.1} color="#fff3da" />
      <directionalLight position={[-6, -2, -4]} intensity={0.5} color="#3a7bff" />

      <Suspense fallback={null}>
        {/* Reflets métal sans réseau : env map générée via Lightformers */}
        <Environment resolution={256} frames={1}>
          <color attach="background" args={["#000000"]} />
          <Lightformer intensity={2.4} color="#f0d27a" position={[0, 4, -6]} scale={[8, 8, 1]} />
          <Lightformer intensity={1.2} color="#8fd0ff" position={[-6, 0, 2]} scale={[4, 8, 1]} />
          <Lightformer intensity={1.0} color="#ffffff" position={[6, -2, 2]} scale={[4, 6, 1]} />
        </Environment>

        <Stars radius={60} depth={50} count={mobile ? 700 : 2000} factor={3} fade speed={0.25} />
        <Sparkles count={mobile ? 40 : 90} scale={[20, 16, 20]} size={2.2} speed={0.3} color="#f0d27a" opacity={0.5} />

        <Ambience progressRef={progressRef} />
        <CodeWorld progressRef={progressRef} />
        <CodeCarpet />
        <Message3D progressRef={progressRef} lang={lang} />
      </Suspense>

      {/* L'humanoïde Spline (calque au-dessus) capte la souris : on laisse
          juste le fond tourner en automatique. */}
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
        autoRotate
        autoRotateSpeed={0.4}
        target={[0, 0, 0]}
      />

      <EffectComposer multisampling={mobile ? 0 : 2}>
        <Bloom intensity={mobile ? 1.0 : 1.5} luminanceThreshold={0.25} luminanceSmoothing={0.9} mipmapBlur />
        <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0007, 0.0011]} />
        <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.045} />
        <Vignette eskil={false} offset={0.2} darkness={0.78} />
      </EffectComposer>
    </Canvas>
  );
}
