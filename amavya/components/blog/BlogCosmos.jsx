"use client";

import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls, Html } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useRouter } from "next/navigation";
import { placeInCosmos } from "@/lib/blog-cosmos";

function Planet({ article, onHover, onLeave, onClick, hovered }) {
  const ref = useRef();
  const haloRef = useRef();
  // Chaque planète a son propre rythme de rotation et flottement
  const seed = useMemo(
    () => article.slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0),
    [article.slug],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = t * 0.15 + seed * 0.001;
      ref.current.position.y =
        article.position[1] + Math.sin(t * 0.5 + seed) * 0.25;
    }
    if (haloRef.current) {
      const pulse = 1 + Math.sin(t * 1.2 + seed) * 0.06;
      haloRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  const color = article.planet.color;
  const radius = article.planet.size;

  return (
    <group position={article.position}>
      <mesh
        ref={ref}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          onHover(article);
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
          onLeave();
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick(article);
        }}
      >
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.2 : 0.5}
          roughness={0.35}
          metalness={0.85}
        />
      </mesh>
      {/* Halo doré */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[radius * 1.55, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.18 : 0.08}
          depthWrite={false}
        />
      </mesh>
      {/* Anneau d'orbite stylisé */}
      <mesh rotation={[Math.PI / 2.2, 0, seed * 0.01]}>
        <ringGeometry args={[radius * 1.9, radius * 1.95, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.55 : 0.25}
          side={2}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function HoverCard({ article }) {
  if (!article) return null;
  return (
    <Html
      position={[
        article.position[0],
        article.position[1] + article.planet.size + 1.3,
        article.position[2],
      ]}
      center
      distanceFactor={12}
      occlude={false}
      zIndexRange={[100, 0]}
      pointerEvents="none"
    >
      <div className="pointer-events-none w-64 rounded-2xl border border-gold/40 bg-black/85 px-4 py-3 text-center text-paper shadow-[0_12px_40px_-10px_rgba(240,210,122,0.7)] backdrop-blur-xl">
        <div className="text-[10px] uppercase tracking-[0.22em] text-gold-bright">
          {article.category.replace("-", " ")}
        </div>
        <div className="mt-1 text-sm font-semibold leading-snug">
          {article.title}
        </div>
        <div className="mt-1 text-[11px] text-muted">
          {article.readingTime} min · {new Date(article.date).toLocaleDateString()}
        </div>
      </div>
    </Html>
  );
}

function FloatingDust() {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 80;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    return arr;
  }, []);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.01;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2000}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#f0d27a"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Scene({ articles, onSelect }) {
  const [hovered, setHovered] = useState(null);
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 8, 8]} intensity={1.2} color="#f0d27a" />
      <pointLight position={[-10, -5, -10]} intensity={0.4} color="#9b9bb0" />
      <Stars radius={120} depth={50} count={3500} factor={4} fade speed={0.4} />
      <FloatingDust />
      {articles.map((a) => (
        <Planet
          key={a.slug}
          article={a}
          onHover={setHovered}
          onLeave={() => setHovered(null)}
          onClick={onSelect}
          hovered={hovered?.slug === a.slug}
        />
      ))}
      <HoverCard article={hovered} />
      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={6}
        maxDistance={45}
        autoRotate
        autoRotateSpeed={0.25}
        target={[0, 0, 0]}
      />
      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.2} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      </EffectComposer>
    </>
  );
}

export default function BlogCosmos({ articles, hint }) {
  const router = useRouter();
  const placed = useMemo(() => placeInCosmos(articles), [articles]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const select = (article) => router.push(`/blog/${article.slug}`);

  return (
    <div className="relative h-[78vh] w-full overflow-hidden rounded-3xl border border-gold/15 bg-black">
      {/* Voile pour fondu top et bottom */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-black to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-black to-transparent" />

      {/* Indication d'usage */}
      <div className="pointer-events-none absolute left-1/2 top-5 z-20 -translate-x-1/2 rounded-full border border-gold/30 bg-black/60 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-gold-bright backdrop-blur">
        {hint}
      </div>

      {ready && (
        <Canvas
          camera={{ position: [0, 4, 22], fov: 55 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false }}
        >
          <color attach="background" args={["#050505"]} />
          <fog attach="fog" args={["#050505", 25, 80]} />
          <Suspense fallback={null}>
            <Scene articles={placed} onSelect={select} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
