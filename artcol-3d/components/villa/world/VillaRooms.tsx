"use client";

import { useMemo } from "react";
import { MeshStandardMaterial, DoubleSide } from "three";
import { getVillaTextures } from "@/components/villa/textures";

/**
 * Pièces attenantes ajoutées à l'architecture de la villa. Bloc 3 (refonte) :
 * la CUISINE est une vraie pièce à l'ouest (à gauche de la salle à manger),
 * avec murs, fenêtre, plafond, et accès par une porte percée dans le mur
 * gauche du hall (z ≈ -1.5). Bibliothèque (droite) et bureau viendront ensuite.
 *
 * Repère cuisine : intérieur x ∈ [-17.8, -11], z ∈ [-5.7, 0.7], hauteur 3.4.
 */
export function VillaRooms() {
  const concrete = useMemo(() => {
    const t = getVillaTextures();
    const m = new MeshStandardMaterial({ color: "#b3a896", roughness: 0.92, side: DoubleSide });
    if (t) {
      const map = t.concrete.clone();
      map.needsUpdate = true;
      map.repeat.set(2, 1);
      m.map = map;
    }
    return m;
  }, []);
  const marble = useMemo(() => {
    const t = getVillaTextures();
    const m = new MeshStandardMaterial({ color: "#d7d1c6", roughness: 0.2, metalness: 0.1, envMapIntensity: 1.1 });
    if (t) {
      const map = t.marble.clone();
      map.needsUpdate = true;
      map.repeat.set(2, 2);
      m.map = map;
    }
    return m;
  }, []);
  const cabinet = useMemo(() => new MeshStandardMaterial({ color: "#20232a", roughness: 0.5, metalness: 0.3 }), []);
  const metal = useMemo(() => new MeshStandardMaterial({ color: "#1b1c1e", roughness: 0.35, metalness: 0.85 }), []);
  const glass = useMemo(
    () => new MeshStandardMaterial({ color: "#9fc4d6", roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.22, side: DoubleSide }),
    [],
  );
  const wineGlow = useMemo(
    () => new MeshStandardMaterial({ color: "#1a0a06", emissive: "#ff7a3a", emissiveIntensity: 1.6, toneMapped: false }),
    [],
  );

  const CX = -14.4; // centre x cuisine
  const CZ = -2.5; // centre z cuisine

  return (
    <group>
      {/* ============ COQUE DE LA CUISINE ============ */}
      {/* Sol marbre */}
      <mesh material={marble} position={[CX, 0.03, CZ]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.8, 6.4]} />
      </mesh>
      {/* Plafond + toit plat */}
      <mesh material={concrete} position={[CX, 3.4, CZ]}>
        <boxGeometry args={[6.9, 0.2, 6.6]} />
      </mesh>
      <mesh material={concrete} position={[CX, 3.55, CZ]} castShadow>
        <boxGeometry args={[7.2, 0.2, 6.9]} />
      </mesh>
      {/* Mur nord (z = -5.7) */}
      <mesh material={concrete} position={[CX, 1.7, -5.7]} castShadow receiveShadow>
        <boxGeometry args={[6.8, 3.4, 0.3]} />
      </mesh>
      {/* Mur sud (z = 0.7) */}
      <mesh material={concrete} position={[CX, 1.7, 0.7]} castShadow receiveShadow>
        <boxGeometry args={[6.8, 3.4, 0.3]} />
      </mesh>
      {/* Mur ouest (x = -17.8) avec FENÊTRE */}
      <mesh material={concrete} position={[-17.8, 0.5, CZ]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 1.0, 6.4]} />
      </mesh>
      <mesh material={concrete} position={[-17.8, 3.0, CZ]} castShadow>
        <boxGeometry args={[0.3, 0.8, 6.4]} />
      </mesh>
      <mesh material={concrete} position={[-17.8, 1.8, -4.6]} castShadow>
        <boxGeometry args={[0.3, 1.6, 2.2]} />
      </mesh>
      <mesh material={concrete} position={[-17.8, 1.8, 0.1]} castShadow>
        <boxGeometry args={[0.3, 1.6, 1.2]} />
      </mesh>
      {/* Vitre de la fenêtre */}
      <mesh material={glass} position={[-17.78, 1.8, -2.0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[3, 1.6]} />
      </mesh>
      {/* Encadrement de la fenêtre (métal) */}
      {[
        [1.8, -3.5, 0.06, 1.7, 0.06],
        [1.8, -0.5, 0.06, 1.7, 0.06],
        [2.6, -2.0, 0.06, 0.06, 3.0],
        [1.0, -2.0, 0.06, 0.06, 3.0],
      ].map(([y, z, sx, sy, sz], i) => (
        <mesh key={i} material={metal} position={[-17.78, y, z]}>
          <boxGeometry args={[sx, sy, sz]} />
        </mesh>
      ))}
      {/* Encadrement de la PORTE (vers le hall, x = -11, z = -1.5) */}
      <mesh material={metal} position={[-11, 1.3, -2.3]}>
        <boxGeometry args={[0.16, 2.6, 0.1]} />
      </mesh>
      <mesh material={metal} position={[-11, 1.3, -0.7]}>
        <boxGeometry args={[0.16, 2.6, 0.1]} />
      </mesh>
      <mesh material={metal} position={[-11, 2.6, -1.5]}>
        <boxGeometry args={[0.16, 0.1, 1.7]} />
      </mesh>

      {/* ============ MOBILIER DE CUISINE ============ */}
      {/* Îlot central */}
      <mesh material={cabinet} position={[CX, 0.45, -2.4]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.9, 1.2]} />
      </mesh>
      <mesh material={marble} position={[CX, 0.93, -2.4]} castShadow>
        <boxGeometry args={[3.3, 0.08, 1.45]} />
      </mesh>
      {/* Tabourets (côté est de l'îlot) */}
      {[-3.4, -2.4, -1.4].map((z) => (
        <group key={z} position={[CX + 1.95, 0, z]}>
          <mesh material={metal} position={[0, 0.31, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.62, 10]} />
          </mesh>
          <mesh material={cabinet} position={[0, 0.64, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.06, 18]} />
          </mesh>
        </group>
      ))}
      {/* Suspensions au-dessus de l'îlot */}
      {[-0.7, 0.7].map((dx) => (
        <mesh key={dx} position={[CX + dx, 2.4, -2.4]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#241708" emissive="#ffcf8f" emissiveIntensity={3} toneMapped={false} />
        </mesh>
      ))}
      {/* Crédence + meubles hauts (mur nord) */}
      <mesh material={cabinet} position={[CX, 0.45, -5.35]} castShadow receiveShadow>
        <boxGeometry args={[5.4, 0.9, 0.55]} />
      </mesh>
      <mesh material={marble} position={[CX, 0.92, -5.35]}>
        <boxGeometry args={[5.6, 0.06, 0.6]} />
      </mesh>
      <mesh material={cabinet} position={[CX, 2.5, -5.45]} castShadow>
        <boxGeometry args={[5.4, 0.7, 0.4]} />
      </mesh>
      {/* Cave à vin vitrée (mur sud) */}
      <group position={[-15.5, 0, 0.45]}>
        <mesh material={cabinet} position={[0, 1.3, 0]} castShadow>
          <boxGeometry args={[1.3, 2.6, 0.5]} />
        </mesh>
        <mesh material={wineGlow} position={[0, 1.3, -0.18]}>
          <planeGeometry args={[1, 2.3]} />
        </mesh>
        <pointLight position={[0, 1.3, -0.5]} intensity={2.5} distance={3.5} decay={2} color="#ff8a4a" />
      </group>

      {/* Éclairage intérieur de la cuisine (pièce fermée) */}
      <pointLight position={[CX, 3.05, -2.4]} intensity={14} distance={9} decay={2} color="#ffdca6" />
      <pointLight position={[CX, 2.6, -5]} intensity={6} distance={6} decay={2} color="#ffe2ba" />
    </group>
  );
}
