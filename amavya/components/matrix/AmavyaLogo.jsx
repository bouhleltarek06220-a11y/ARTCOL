"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * Logo AMAVYA en 3D : médaillon tournant portant la poignée de main
 * humain/robot (logo-mark.png), bordé d'un anneau doré en relief, avec
 * halo lumineux. Remplace l'ancienne "boule dorée". Se révèle pendant le
 * voyage (le tapis de code mène jusqu'à lui).
 */
const R = 1.5;

export default function AmavyaLogo({ progressRef }) {
  const tex = useTexture("/logo-mark.png");
  tex.colorSpace = THREE.SRGBColorSpace;

  const group = useRef();
  const faceFront = useRef();
  const faceBack = useRef();
  const ringMat = useRef();
  const haloMat = useRef();
  const halo2Mat = useRef();
  const light = useRef();

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const p = Math.max(0, Math.min(1, progressRef.current));
    // Révélation : le logo apparaît à mesure qu'on avance vers lui
    const reveal = THREE.MathUtils.clamp((p - 0.2) / 0.4, 0, 1);

    if (group.current) {
      group.current.rotation.y += dt * 0.5;
      const pulse = 1 + Math.sin(t * 1.6) * 0.05;
      group.current.scale.setScalar(reveal * pulse);
      group.current.visible = reveal > 0.01;
    }
    if (faceFront.current) faceFront.current.opacity = reveal;
    if (faceBack.current) faceBack.current.opacity = reveal;
    if (ringMat.current) ringMat.current.opacity = reveal;
    if (haloMat.current) haloMat.current.opacity = reveal * 0.32 * (1 + Math.sin(t * 1.6) * 0.12);
    if (halo2Mat.current) halo2Mat.current.opacity = reveal * 0.14;
    if (light.current) light.current.intensity = reveal * 5;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.5}>
      <group ref={group} scale={0}>
        <pointLight ref={light} color="#f0d27a" intensity={0} distance={18} decay={1.4} />

        {/* Face avant (poignée de main) */}
        <mesh position={[0, 0, 0.09]}>
          <circleGeometry args={[R, 72]} />
          <meshStandardMaterial
            ref={faceFront}
            map={tex}
            emissiveMap={tex}
            emissive="#ffffff"
            emissiveIntensity={0.45}
            metalness={0.35}
            roughness={0.45}
            transparent
            opacity={0}
            side={THREE.FrontSide}
            toneMapped={false}
          />
        </mesh>

        {/* Face arrière */}
        <mesh position={[0, 0, -0.09]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[R, 72]} />
          <meshStandardMaterial
            ref={faceBack}
            map={tex}
            emissiveMap={tex}
            emissive="#ffffff"
            emissiveIntensity={0.45}
            metalness={0.35}
            roughness={0.45}
            transparent
            opacity={0}
            side={THREE.FrontSide}
            toneMapped={false}
          />
        </mesh>

        {/* Tranche / rim doré (épaisseur du médaillon) */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[R, R, 0.18, 72, 1, true]} />
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.25} side={THREE.DoubleSide} />
        </mesh>

        {/* Anneau doré en relief autour du médaillon */}
        <mesh>
          <torusGeometry args={[R + 0.12, 0.05, 16, 80]} />
          <meshStandardMaterial
            ref={ringMat}
            color="#f0d27a"
            emissive="#f0c052"
            emissiveIntensity={2}
            metalness={1}
            roughness={0.2}
            transparent
            opacity={0}
            toneMapped={false}
          />
        </mesh>

        {/* Halos lumineux */}
        <mesh>
          <sphereGeometry args={[R + 0.9, 32, 32]} />
          <meshBasicMaterial ref={haloMat} color="#f0d27a" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh>
          <sphereGeometry args={[R + 2.2, 32, 32]} />
          <meshBasicMaterial ref={halo2Mat} color="#a87f2e" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
    </Float>
  );
}
