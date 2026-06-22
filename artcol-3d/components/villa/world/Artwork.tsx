"use client";

import { useEffect, useMemo, useState } from "react";
import { MeshStandardMaterial, SRGBColorSpace, Texture, TextureLoader } from "three";
import type { ArtworkMeta } from "./artworks";

/**
 * Une œuvre encadrée + cartel, posée sur un mur. Réutilisable dans toutes les
 * pièces (hall, bureau, bibliothèque, étage…).
 *
 * - `userData.interactive = "artwork"` + `meta` sont lus par le raycast du
 *   <Player/> (visée au centre de l'écran) → zoom cinématique + cartel.
 * - L'image (`meta.image`) est chargée à la volée ; repli silencieux sur la
 *   couleur si le fichier est absent (aucune erreur, aucun crash de Suspense).
 * - Cadres en PAYSAGE par défaut (ratio ~1.45) pour épouser les miniatures de
 *   sites ; `size` permet d'imposer une taille sur un mur étroit.
 */
export function Artwork({
  position,
  rotation = [0, 0, 0],
  color = "#3a2f25",
  meta,
  wide = false,
  size,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  meta: ArtworkMeta;
  wide?: boolean;
  size?: [number, number];
}) {
  const [w, h] = size ?? (wide ? [4.2, 2.9] : [2.9, 2.0]);

  const frameMat = useMemo(
    () => new MeshStandardMaterial({ color: "#181613", roughness: 0.42, metalness: 0.35 }),
    [],
  );
  const matMat = useMemo(
    () => new MeshStandardMaterial({ color: "#ece7db", roughness: 0.92, metalness: 0 }),
    [],
  );
  const brassMat = useMemo(
    () => new MeshStandardMaterial({ color: "#b9883f", roughness: 0.3, metalness: 1 }),
    [],
  );
  const lampMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#3a2e16",
        emissive: "#ffdca0",
        emissiveIntensity: 2.2,
        toneMapped: false,
        roughness: 0.5,
      }),
    [],
  );

  const [tex, setTex] = useState<Texture | null>(null);
  useEffect(() => {
    if (!meta.image) return;
    let alive = true;
    new TextureLoader().load(
      meta.image,
      (t) => {
        if (!alive) {
          t.dispose();
          return;
        }
        t.colorSpace = SRGBColorSpace;
        t.anisotropy = 8;
        setTex(t);
      },
      undefined,
      () => {
        /* image absente → on garde la couleur d'origine */
      },
    );
    return () => {
      alive = false;
    };
  }, [meta.image]);

  return (
    <group
      position={position}
      rotation={rotation}
      userData={{ interactive: "artwork", meta, halfWidth: w / 2 }}
    >
      {/* Cadre profond (corps sombre, profil mat) */}
      <mesh material={frameMat} castShadow receiveShadow>
        <boxGeometry args={[w + 0.36, h + 0.36, 0.15]} />
      </mesh>
      {/* Passe-partout crème (mat board) en léger retrait */}
      <mesh material={matMat} position={[0, 0, 0.066]}>
        <boxGeometry args={[w + 0.16, h + 0.16, 0.03]} />
      </mesh>
      {/* Filet laiton autour de la toile (liseré premium) */}
      <mesh material={brassMat} position={[0, 0, 0.084]}>
        <boxGeometry args={[w + 0.06, h + 0.06, 0.02]} />
      </mesh>
      {/* Toile : vraie image si disponible, sinon aplat de couleur « musée ».
          `key` force le remount du matériau quand la texture arrive : sinon le
          shader, compilé sans `map`, ne l'échantillonne jamais (cadre blanc). */}
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          key={tex ? "img" : "plain"}
          map={tex ?? undefined}
          color={tex ? "#ffffff" : color}
          roughness={0.5}
          metalness={0}
          emissive={tex ? "#000000" : color}
          emissiveIntensity={tex ? 0 : 0.4}
        />
      </mesh>
      {/* Réglette lumineuse de musée (bras + barre chaude au-dessus du cadre) */}
      <mesh material={frameMat} position={[0, h / 2 + 0.34, 0.16]} castShadow>
        <boxGeometry args={[0.05, 0.05, 0.3]} />
      </mesh>
      <mesh material={lampMat} position={[0, h / 2 + 0.36, 0.3]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[Math.min(w, 1.6), 0.05, 0.08]} />
      </mesh>
      {/* Cartel d'exposition */}
      <mesh position={[-(w / 2) + 0.3, -(h / 2) - 0.35, 0.08]}>
        <planeGeometry args={[0.5, 0.22]} />
        <meshStandardMaterial color="#f4f1ea" roughness={0.8} emissive="#f4f1ea" emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}
