"use client";

import { useMemo } from "react";
import { DoubleSide, MeshStandardMaterial } from "three";

/**
 * POOL HOUSE — pavillon de jardin de luxe à l'ouest de la grande piscine.
 *
 * Emprise (m, Y up) : x ∈ [-24, -14], z ∈ [6, 13] -> footprint 10x7.
 * Le pavillon s'ouvre vers l'EST (+x), face à la piscine (centrée x=3, z=12).
 * Sol du jardin à y=0. Mur arrière plein à l'ouest (x=-24), façade est ouverte.
 *
 * Aménagement : toit plat débordant sur poteaux, mur pierre arrière, murs
 * latéraux partiels, bar en L + tabourets, kitchenette sombre, douche
 * extérieure, 2 transats + parasol sur la terrasse, suspension chaude.
 * Primitives uniquement (box/plane/cylinder).
 */

// Repères de l'emprise.
const WEST = -24; // mur arrière (ouest)
const EAST = -14; // façade ouverte (est, vers la piscine)
const ZN = 6; // mur latéral nord (z min)
const ZS = 13; // mur latéral sud (z max)
const CX = (WEST + EAST) / 2; // centre x = -19
const CZ = (ZN + ZS) / 2; // centre z = 9.5
const SPAN_X = EAST - WEST; // 10
const SPAN_Z = ZS - ZN; // 7
const ROOF_Y = 3.2; // hauteur du toit plat

type Vec3 = [number, number, number];

export function PoolHouse() {
  // ---- Matériaux (créés une seule fois, partagés) -------------------------
  const stone = useMemo(
    () => new MeshStandardMaterial({ color: "#cdbb9c", roughness: 0.85 }),
    [],
  );
  const stoneLight = useMemo(
    () => new MeshStandardMaterial({ color: "#d8d2c6", roughness: 0.8 }),
    [],
  );
  const concrete = useMemo(
    () => new MeshStandardMaterial({ color: "#b3a896", roughness: 0.7 }),
    [],
  );
  const wood = useMemo(
    () => new MeshStandardMaterial({ color: "#5b3f27", roughness: 0.6 }),
    [],
  );
  const woodDark = useMemo(
    () => new MeshStandardMaterial({ color: "#3a2a1c", roughness: 0.6 }),
    [],
  );
  const metal = useMemo(
    () => new MeshStandardMaterial({ color: "#1b1c1e", roughness: 0.4, metalness: 0.8 }),
    [],
  );
  const linen = useMemo(
    () => new MeshStandardMaterial({ color: "#d9d3c8", roughness: 0.85 }),
    [],
  );
  // Bandeau verre (paroi de la douche) — palette imposée.
  const glass = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#9fc4d6",
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.25,
        side: DoubleSide,
      }),
    [],
  );
  const lampShade = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#ffdca6",
        roughness: 0.5,
        emissive: "#ffdca6",
        emissiveIntensity: 0.9,
      }),
    [],
  );

  // ---- Sous-composants internes -------------------------------------------

  /** Tabouret de bar : assise bois + pied métal. */
  function Stool({ position }: { position: Vec3 }) {
    const [x, y, z] = position;
    return (
      <group position={[x, y, z]}>
        <mesh material={wood} position={[0, 0.78, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.06, 16]} />
        </mesh>
        <mesh material={metal} position={[0, 0.39, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.78, 10]} />
        </mesh>
        <mesh material={metal} position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.03, 16]} />
        </mesh>
      </group>
    );
  }

  /**
   * Transat (chaise longue) : châssis bois + matelas lin, orienté vers la
   * piscine. rot = rotation Y du groupe.
   */
  function Lounger({ position, rot = 0 }: { position: Vec3; rot?: number }) {
    const [x, y, z] = position;
    return (
      <group position={[x, y, z]} rotation={[0, rot, 0]}>
        {/* châssis */}
        <mesh material={wood} position={[0, 0.28, 0]} castShadow>
          <boxGeometry args={[1.9, 0.1, 0.7]} />
        </mesh>
        {/* matelas plat */}
        <mesh material={linen} position={[0.12, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.12, 0.62]} />
        </mesh>
        {/* dossier incliné (côté ouest) */}
        <mesh
          material={linen}
          position={[-0.78, 0.55, 0]}
          rotation={[0, 0, Math.PI / 3.2]}
          castShadow
        >
          <boxGeometry args={[0.7, 0.12, 0.62]} />
        </mesh>
        {/* pieds */}
        {([-0.85, 0.85] as const).map((dx) => (
          <mesh key={dx} material={woodDark} position={[dx, 0.13, 0]}>
            <boxGeometry args={[0.06, 0.26, 0.62]} />
          </mesh>
        ))}
      </group>
    );
  }

  // Position des poteaux porteurs (côté ouverture est).
  const postPositions: Vec3[] = [
    [EAST - 0.3, ROOF_Y / 2, ZN + 0.6],
    [EAST - 0.3, ROOF_Y / 2, CZ],
    [EAST - 0.3, ROOF_Y / 2, ZS - 0.6],
  ];

  return (
    <group>
      {/* ===================== DALLE / SOL DU PAVILLON ===================== */}
      <mesh material={stoneLight} position={[CX, 0.06, CZ]} receiveShadow>
        <boxGeometry args={[SPAN_X, 0.12, SPAN_Z]} />
      </mesh>

      {/* ===================== TOIT PLAT DÉBORDANT ======================== */}
      {/* dalle béton débordant ~0.6 m de chaque côté */}
      <mesh material={concrete} position={[CX, ROOF_Y, CZ]} castShadow receiveShadow>
        <boxGeometry args={[SPAN_X + 1.2, 0.22, SPAN_Z + 1.2]} />
      </mesh>

      {/* ===================== STRUCTURE / MURS =========================== */}
      {/* Mur arrière (ouest) plein en pierre */}
      <mesh material={stone} position={[WEST + 0.1, ROOF_Y / 2, CZ]} castShadow receiveShadow>
        <boxGeometry args={[0.2, ROOF_Y, SPAN_Z]} />
      </mesh>

      {/* Murs latéraux partiels (nord z=6 et sud z=13), demi-profondeur côté ouest */}
      {([ZN, ZS] as const).map((z) => (
        <mesh
          key={`side${z}`}
          material={stone}
          position={[WEST + SPAN_X * 0.28, ROOF_Y / 2, z]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[SPAN_X * 0.56, ROOF_Y, 0.2]} />
        </mesh>
      ))}

      {/* Poteaux fins porteurs côté façade est (façade ouverte) */}
      {postPositions.map((p, i) => (
        <mesh key={`post${i}`} material={metal} position={p} castShadow>
          <cylinderGeometry args={[0.08, 0.08, ROOF_Y, 12]} />
        </mesh>
      ))}

      {/* ===================== BAR EN L ================================== */}
      {/* Adossé au mur ouest : comptoir en L (segment long le long de z +
          retour le long de x), plateau pierre claire sur caisson bois. */}
      <group>
        {/* segment long (le long de z) */}
        <mesh material={wood} position={[WEST + 1.2, 0.5, CZ - 0.4]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.9, 3.2]} />
        </mesh>
        <mesh material={stoneLight} position={[WEST + 1.2, 0.97, CZ - 0.4]} castShadow>
          <boxGeometry args={[1.0, 0.06, 3.3]} />
        </mesh>
        {/* retour (le long de x) */}
        <mesh material={wood} position={[WEST + 2.4, 0.5, ZS - 1.6]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.9, 0.9]} />
        </mesh>
        <mesh material={stoneLight} position={[WEST + 2.4, 0.97, ZS - 1.6]} castShadow>
          <boxGeometry args={[2.5, 0.06, 1.0]} />
        </mesh>
        {/* tabourets côté ouverture (face est au comptoir long) */}
        <Stool position={[WEST + 2.2, 0, CZ - 1.4]} />
        <Stool position={[WEST + 2.2, 0, CZ - 0.4]} />
        <Stool position={[WEST + 2.2, 0, CZ + 0.6]} />
      </group>

      {/* ===================== KITCHENETTE / RANGEMENT =================== */}
      {/* caisson sombre adossé au mur ouest, côté nord */}
      <group>
        <mesh material={woodDark} position={[WEST + 1.0, 0.55, ZN + 1.2]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 1.1, 1.8]} />
        </mesh>
        {/* plan de travail pierre */}
        <mesh material={stoneLight} position={[WEST + 1.0, 1.13, ZN + 1.2]} castShadow>
          <boxGeometry args={[1.7, 0.06, 1.9]} />
        </mesh>
        {/* étagère murale */}
        <mesh material={wood} position={[WEST + 0.55, 1.9, ZN + 1.2]} castShadow>
          <boxGeometry args={[0.4, 0.05, 1.6]} />
        </mesh>
      </group>

      {/* ===================== DOUCHE EXTÉRIEURE ========================= */}
      {/* côté sud-est de la dalle : poteau métal + bras + pommeau + paroi verre */}
      <group position={[EAST - 1.2, 0, ZS - 0.6]}>
        {/* socle pierre */}
        <mesh material={stoneLight} position={[0, 0.07, 0]} receiveShadow>
          <boxGeometry args={[0.7, 0.14, 0.7]} />
        </mesh>
        {/* paroi de verre (intimité) */}
        <mesh material={glass} position={[0.2, 1.1, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.7, 2.0]} />
        </mesh>
        {/* mât */}
        <mesh material={metal} position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 2.4, 12]} />
        </mesh>
        {/* bras horizontal */}
        <mesh material={metal} position={[-0.22, 2.35, 0]} castShadow>
          <boxGeometry args={[0.44, 0.05, 0.05]} />
        </mesh>
        {/* pommeau */}
        <mesh material={metal} position={[-0.44, 2.28, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.13, 0.05, 16]} />
        </mesh>
      </group>

      {/* ===================== TERRASSE EST (vers la piscine) ============ */}
      {/* 2 transats + 1 parasol devant la façade ouverte (x environ -15). */}
      <Lounger position={[-15.3, 0, 9.0]} rot={Math.PI / 2} />
      <Lounger position={[-15.3, 0, 11.0]} rot={Math.PI / 2} />

      {/* Parasol entre les deux transats */}
      <group position={[-15.3, 0, 10.0]}>
        {/* socle */}
        <mesh material={metal} position={[0, 0.06, 0]} receiveShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.12, 16]} />
        </mesh>
        {/* mât */}
        <mesh material={metal} position={[0, 1.3, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 2.5, 12]} />
        </mesh>
        {/* toile (cône large) */}
        <mesh material={linen} position={[0, 2.55, 0]} castShadow>
          <cylinderGeometry args={[0.02, 1.5, 0.5, 20]} />
        </mesh>
      </group>

      {/* ===================== SUSPENSION / LAMPE CHAUDE ================= */}
      {/* abat-jour émissif sous le toit + point light chaude */}
      <group position={[CX + 0.5, ROOF_Y - 0.6, CZ]}>
        {/* câble */}
        <mesh material={metal} position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.6, 6]} />
        </mesh>
        {/* abat-jour */}
        <mesh material={lampShade} castShadow>
          <cylinderGeometry args={[0.18, 0.28, 0.3, 18]} />
        </mesh>
        <pointLight
          color="#ffdca6"
          intensity={6}
          distance={9}
          decay={2}
          position={[0, -0.2, 0]}
          castShadow
        />
      </group>
    </group>
  );
}
