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
    () => new MeshStandardMaterial({ color: "#171715", roughness: 0.5, metalness: 0.3 }),
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
      {/* Cadre 3D en relief */}
      <mesh material={frameMat} castShadow>
        <boxGeometry args={[w + 0.2, h + 0.2, 0.12]} />
      </mesh>
      {/* Toile : vraie image si disponible, sinon aplat de couleur « musée ».
          `key` force le remount du matériau quand la texture arrive : sinon le
          shader, compilé sans `map`, ne l'échantillonne jamais (cadre blanc). */}
      <mesh position={[0, 0, 0.08]}>
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
      {/* Cartel d'exposition */}
      <mesh position={[-(w / 2) + 0.3, -(h / 2) - 0.35, 0.08]}>
        <planeGeometry args={[0.5, 0.22]} />
        <meshStandardMaterial color="#f4f1ea" roughness={0.8} emissive="#f4f1ea" emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}
