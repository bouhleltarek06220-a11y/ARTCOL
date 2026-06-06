"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Sun from "./Sun";
import MilkyWay from "./MilkyWay";
import RealisticPlanet from "./RealisticPlanet";
import { CATEGORY_TO_TYPE } from "./proceduralPlanet";

/* Anneau d'orbite (trace fine dorée) */
function OrbitTrail({ radius }) {
  const points = useMemo(() => {
    const arr = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      arr.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return arr;
  }, [radius]);

  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line geometry={geo}>
      <lineBasicMaterial color="#f0d27a" transparent opacity={0.15} />
    </line>
  );
}

/* Une planète placée sur son orbite, qui tourne autour du Soleil. */
function OrbitingPlanet({ article, index, onHover, onLeave, onClick, hovered }) {
  const groupRef = useRef();
  // Chaque planète a sa propre vitesse orbitale et son angle de départ.
  const { orbitRadius, orbitSpeed, startAngle, tilt, planetType, atmosphere } =
    useMemo(() => {
      const seed = article.slug
        .split("")
        .reduce((a, c) => a + c.charCodeAt(0), 0);
      const radius = 5 + index * 2.4;
      const speed = 0.18 / Math.sqrt(1 + index * 0.4); // les planètes lointaines vont plus lentement
      const start = (seed * 0.137) % (Math.PI * 2);
      const tlt = ((seed % 7) - 3) * 0.05;
      const type =
        article.planet?.type ||
        CATEGORY_TO_TYPE[article.category] ||
        "earth";
      const atmoMap = {
        earth: "#7dd3fc",
        mars: "#ff7e5a",
        jupiter: "#e6c690",
        saturn: "#f0d27a",
        ice: "#bde0fe",
        exotic: "#c8aaff",
      };
      return {
        orbitRadius: radius,
        orbitSpeed: speed,
        startAngle: start,
        tilt: tlt,
        planetType: type,
        atmosphere: atmoMap[type] || "#f0d27a",
      };
    }, [article, index]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const angle = startAngle + t * orbitSpeed;
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angle) * orbitRadius;
      groupRef.current.position.z = Math.sin(angle) * orbitRadius;
      groupRef.current.position.y = Math.sin(angle * 0.5) * 0.6; // léger flottement vertical
    }
  });

  const size = (article.planet?.size || 1) * 0.6;

  return (
    <>
      <OrbitTrail radius={orbitRadius} />
      <group
        ref={groupRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          onHover(article, groupRef.current?.position);
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
        <RealisticPlanet
          type={planetType}
          size={size}
          seed={index + 1}
          atmosphere={atmosphere}
          rotationSpeed={0.25 + index * 0.03}
          tilt={tilt}
        />
        {/* Volume cliquable plus large que la planète (UX mobile) */}
        <mesh visible={false}>
          <sphereGeometry args={[size * 1.8, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>
    </>
  );
}

function HoverCard({ data }) {
  if (!data) return null;
  const { article, position } = data;
  if (!position) return null;
  return (
    <Html
      position={[position.x, position.y + 2.2, position.z]}
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
          {article.readingTime} min ·{" "}
          {new Date(article.date).toLocaleDateString()}
        </div>
      </div>
    </Html>
  );
}

export default function SolarSystem({ articles, onSelect }) {
  const [hovered, setHovered] = useState(null);
  return (
    <>
      <ambientLight intensity={0.18} />
      <MilkyWay />
      <Sun size={1.8} />
      {articles.map((a, i) => (
        <OrbitingPlanet
          key={a.slug}
          index={i}
          article={a}
          onHover={(article, position) => setHovered({ article, position })}
          onLeave={() => setHovered(null)}
          onClick={onSelect}
          hovered={hovered?.article?.slug === a.slug}
        />
      ))}
      <HoverCard data={hovered} />
      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={8}
        maxDistance={55}
        autoRotate
        autoRotateSpeed={0.18}
        target={[0, 0, 0]}
      />
    </>
  );
}
