"use client";

import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { getPlanetTexture, hasRings } from "./proceduralPlanet";

export default function RealisticPlanet({
  type = "earth",
  size = 1,
  seed = 1,
  atmosphere = "#7dd3fc",
  rotationSpeed = 0.15,
  tilt = 0.15,
}) {
  const planetRef = useRef();
  const cloudsRef = useRef();
  const haloRef = useRef();

  const dataUrl = useMemo(() => getPlanetTexture(type, seed), [type, seed]);
  const texture = useLoader(THREE.TextureLoader, dataUrl);

  useMemo(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
    }
  }, [texture]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (planetRef.current) {
      planetRef.current.rotation.y = t * rotationSpeed + seed * 0.001;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = t * (rotationSpeed * 1.4);
    }
    if (haloRef.current) {
      const p = 1 + Math.sin(t * 0.8 + seed) * 0.02;
      haloRef.current.scale.set(p, p, p);
    }
  });

  const hasRing = hasRings(type);

  return (
    <group rotation={[tilt, 0, 0]}>
      {/* Surface texturée */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={type === "earth" ? 0.6 : type === "mars" ? 0.85 : 0.4}
          metalness={type === "earth" || type === "mars" ? 0.05 : 0.15}
        />
      </mesh>

      {/* Couche nuages pour la Terre */}
      {type === "earth" && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[size * 1.012, 64, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.18}
            roughness={1}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Atmosphère / halo doré ou coloré */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[size * 1.18, 32, 32]} />
        <meshBasicMaterial
          color={atmosphere}
          transparent
          opacity={0.14}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Anneaux pour Saturne */}
      {hasRing && (
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <ringGeometry args={[size * 1.6, size * 2.4, 96]} />
          <meshBasicMaterial
            color="#e0c188"
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
