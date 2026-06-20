"use client";

import { useMemo } from "react";
import { MeshStandardMaterial, DoubleSide } from "three";
import { getVillaTextures } from "@/components/villa/textures";

/**
 * Pièces attenantes ajoutées à l'architecture de la villa (Bloc 3) :
 *  - CUISINE à l'ouest (porte dans le mur gauche du hall, z ≈ -1.5)
 *  - BIBLIOTHÈQUE à l'est (porte dans le mur droit, accès salon, z ≈ -1)
 *  - BUREAU contre le mur du fond, entre deux œuvres (x ≈ -3.4)
 */
const BOOK_COLORS = ["#7b2d3a", "#1f3a5f", "#2f5d4a", "#6a4a86", "#b5762a", "#39383f", "#8a4a26", "#2a5a58"];

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
  const wood = useMemo(() => {
    const t = getVillaTextures();
    const m = new MeshStandardMaterial({ color: "#4a3322", roughness: 0.6 });
    if (t) {
      const map = t.wood.clone();
      map.needsUpdate = true;
      map.repeat.set(5, 4);
      m.map = map;
    }
    return m;
  }, []);
  const cabinet = useMemo(() => new MeshStandardMaterial({ color: "#20232a", roughness: 0.5, metalness: 0.3 }), []);
  const shelfWood = useMemo(() => new MeshStandardMaterial({ color: "#3a281b", roughness: 0.55 }), []);
  const metal = useMemo(() => new MeshStandardMaterial({ color: "#1b1c1e", roughness: 0.35, metalness: 0.85 }), []);
  const leather = useMemo(() => new MeshStandardMaterial({ color: "#6b4632", roughness: 0.6 }), []);
  const glass = useMemo(
    () => new MeshStandardMaterial({ color: "#9fc4d6", roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.22, side: DoubleSide }),
    [],
  );
  const wineGlow = useMemo(
    () => new MeshStandardMaterial({ color: "#1a0a06", emissive: "#ff7a3a", emissiveIntensity: 1.6, toneMapped: false }),
    [],
  );
  const bookMats = useMemo(
    () => BOOK_COLORS.map((c) => new MeshStandardMaterial({ color: c, roughness: 0.7 })),
    [],
  );

  const CXk = -14.4; // centre x cuisine
  const CXl = 14.4; // centre x bibliothèque
  const CZ = -2.5;

  return (
    <group>
      {/* ===================================================================== */}
      {/* ============================== CUISINE ============================== */}
      {/* ===================================================================== */}
      <mesh material={marble} position={[CXk, 0.03, CZ]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.8, 6.4]} />
      </mesh>
      <mesh material={concrete} position={[CXk, 3.4, CZ]}>
        <boxGeometry args={[6.9, 0.2, 6.6]} />
      </mesh>
      <mesh material={concrete} position={[CXk, 3.55, CZ]} castShadow>
        <boxGeometry args={[7.2, 0.2, 6.9]} />
      </mesh>
      <mesh material={concrete} position={[CXk, 1.7, -5.7]} castShadow receiveShadow>
        <boxGeometry args={[6.8, 3.4, 0.3]} />
      </mesh>
      <mesh material={concrete} position={[CXk, 1.7, 0.7]} castShadow receiveShadow>
        <boxGeometry args={[6.8, 3.4, 0.3]} />
      </mesh>
      {/* mur ouest + fenêtre */}
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
      <mesh material={glass} position={[-17.78, 1.8, -2.0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[3, 1.6]} />
      </mesh>
      {/* encadrement porte cuisine (x=-11, z=-1.5) */}
      <mesh material={metal} position={[-11, 1.3, -2.3]}><boxGeometry args={[0.16, 2.6, 0.1]} /></mesh>
      <mesh material={metal} position={[-11, 1.3, -0.7]}><boxGeometry args={[0.16, 2.6, 0.1]} /></mesh>
      <mesh material={metal} position={[-11, 2.6, -1.5]}><boxGeometry args={[0.16, 0.1, 1.7]} /></mesh>
      {/* mobilier cuisine */}
      <mesh material={cabinet} position={[CXk, 0.45, -2.4]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.9, 1.2]} />
      </mesh>
      <mesh material={marble} position={[CXk, 0.93, -2.4]} castShadow>
        <boxGeometry args={[3.3, 0.08, 1.45]} />
      </mesh>
      {[-3.4, -2.4, -1.4].map((z) => (
        <group key={z} position={[CXk + 1.95, 0, z]}>
          <mesh material={metal} position={[0, 0.31, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.62, 10]} />
          </mesh>
          <mesh material={cabinet} position={[0, 0.64, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.06, 18]} />
          </mesh>
        </group>
      ))}
      {[-0.7, 0.7].map((dx) => (
        <mesh key={dx} position={[CXk + dx, 2.4, -2.4]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#241708" emissive="#ffcf8f" emissiveIntensity={3} toneMapped={false} />
        </mesh>
      ))}
      <mesh material={cabinet} position={[CXk, 0.45, -5.35]} castShadow receiveShadow>
        <boxGeometry args={[5.4, 0.9, 0.55]} />
      </mesh>
      <mesh material={marble} position={[CXk, 0.92, -5.35]}>
        <boxGeometry args={[5.6, 0.06, 0.6]} />
      </mesh>
      <mesh material={cabinet} position={[CXk, 2.5, -5.45]} castShadow>
        <boxGeometry args={[5.4, 0.7, 0.4]} />
      </mesh>
      <group position={[-15.5, 0, 0.45]}>
        <mesh material={cabinet} position={[0, 1.3, 0]} castShadow>
          <boxGeometry args={[1.3, 2.6, 0.5]} />
        </mesh>
        <mesh material={wineGlow} position={[0, 1.3, -0.18]}>
          <planeGeometry args={[1, 2.3]} />
        </mesh>
        <pointLight position={[0, 1.3, -0.5]} intensity={2.5} distance={3.5} decay={2} color="#ff8a4a" />
      </group>
      <pointLight position={[CXk, 3.05, -2.4]} intensity={14} distance={9} decay={2} color="#ffdca6" />
      <pointLight position={[CXk, 2.6, -5]} intensity={6} distance={6} decay={2} color="#ffe2ba" />

      {/* ===================================================================== */}
      {/* ============================ BIBLIOTHÈQUE =========================== */}
      {/* ===================================================================== */}
      <mesh material={wood} position={[CXl, 0.03, CZ]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.8, 6.4]} />
      </mesh>
      <mesh material={concrete} position={[CXl, 3.4, CZ]}>
        <boxGeometry args={[6.9, 0.2, 6.6]} />
      </mesh>
      <mesh material={concrete} position={[CXl, 3.55, CZ]} castShadow>
        <boxGeometry args={[7.2, 0.2, 6.9]} />
      </mesh>
      <mesh material={concrete} position={[CXl, 1.7, -5.7]} castShadow receiveShadow>
        <boxGeometry args={[6.8, 3.4, 0.3]} />
      </mesh>
      <mesh material={concrete} position={[CXl, 1.7, 0.7]} castShadow receiveShadow>
        <boxGeometry args={[6.8, 3.4, 0.3]} />
      </mesh>
      {/* mur est + fenêtre */}
      <mesh material={concrete} position={[17.8, 0.5, CZ]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 1.0, 6.4]} />
      </mesh>
      <mesh material={concrete} position={[17.8, 3.0, CZ]} castShadow>
        <boxGeometry args={[0.3, 0.8, 6.4]} />
      </mesh>
      <mesh material={concrete} position={[17.8, 1.8, -4.6]} castShadow>
        <boxGeometry args={[0.3, 1.6, 2.2]} />
      </mesh>
      <mesh material={concrete} position={[17.8, 1.8, 0.1]} castShadow>
        <boxGeometry args={[0.3, 1.6, 1.2]} />
      </mesh>
      <mesh material={glass} position={[17.78, 1.8, -2.0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[3, 1.6]} />
      </mesh>
      {/* encadrement porte bibliothèque (x=11, z=-1) */}
      <mesh material={metal} position={[11, 1.3, -1.8]}><boxGeometry args={[0.16, 2.6, 0.1]} /></mesh>
      <mesh material={metal} position={[11, 1.3, -0.2]}><boxGeometry args={[0.16, 2.6, 0.1]} /></mesh>
      <mesh material={metal} position={[11, 2.6, -1]}><boxGeometry args={[0.16, 0.1, 1.7]} /></mesh>
      {/* rayonnages (murs nord & sud) */}
      <Bookshelf position={[CXl, 0, -5.5]} width={5.8} frame={shelfWood} bookMats={bookMats} />
      <Bookshelf position={[CXl, 0, 0.5]} rotation={Math.PI} width={5.8} frame={shelfWood} bookMats={bookMats} />
      {/* fauteuils club + table + tapis */}
      <mesh material={leather} position={[CXl - 0.1, 0.04, CZ]} receiveShadow>
        <boxGeometry args={[3.4, 0.04, 2.4]} />
      </mesh>
      <ClubChair position={[CXl - 1, 0, CZ]} rotation={Math.PI / 2} leather={leather} metal={metal} />
      <ClubChair position={[CXl + 0.8, 0, CZ]} rotation={-Math.PI / 2} leather={leather} metal={metal} />
      <mesh material={shelfWood} position={[CXl - 0.1, 0.3, CZ]} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.45, 24]} />
      </mesh>
      {/* échelle coulissante (appuyée au rayonnage nord) */}
      <group position={[CXl - 1.6, 0, -5.0]} rotation={[0.18, 0, 0]}>
        {[-0.25, 0.25].map((x) => (
          <mesh key={x} material={metal} position={[x, 1.35, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 2.8, 10]} />
          </mesh>
        ))}
        {[0.4, 0.9, 1.4, 1.9, 2.4].map((y) => (
          <mesh key={y} material={metal} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
          </mesh>
        ))}
      </group>
      {/* éclairage bibliothèque (chaud, feutré) */}
      <pointLight position={[CXl, 3.0, CZ]} intensity={11} distance={9} decay={2} color="#ffcf9a" />
      <pointLight position={[CXl, 1.4, -1.5]} intensity={5} distance={6} decay={2} color="#ffdcae" />

      {/* ===================================================================== */}
      {/* =============================== BUREAU ============================== */}
      {/* (contre le mur du fond, entre les œuvres x=-6 et x=0 → x ≈ -3.4) ===== */}
      {/* ===================================================================== */}
      <group position={[-3.4, 0, -7.4]}>
        {/* tapis */}
        <mesh material={leather} position={[0, 0.04, 0.4]} receiveShadow>
          <boxGeometry args={[3.2, 0.04, 2.4]} />
        </mesh>
        {/* bureau */}
        <mesh material={metal} position={[0, 0.36, 0]} castShadow>
          <boxGeometry args={[1.9, 0.7, 0.85]} />
        </mesh>
        <mesh material={wood} position={[0, 0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.1, 0.07, 1]} />
        </mesh>
        {/* écran + accessoires */}
        <mesh material={metal} position={[0, 1.1, -0.25]} castShadow>
          <boxGeometry args={[0.9, 0.55, 0.05]} />
        </mesh>
        <mesh material={metal} position={[0, 0.85, -0.25]}>
          <boxGeometry args={[0.1, 0.2, 0.1]} />
        </mesh>
        {/* fauteuil de bureau */}
        <group position={[0, 0, 0.7]} rotation={[0, Math.PI, 0]}>
          <mesh material={leather} position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[0.6, 0.12, 0.55]} />
          </mesh>
          <mesh material={leather} position={[0, 0.85, -0.27]} castShadow>
            <boxGeometry args={[0.6, 0.6, 0.1]} />
          </mesh>
          <mesh material={metal} position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.44, 10]} />
          </mesh>
          <mesh material={metal} position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
          </mesh>
        </group>
        {/* crédence basse + livres (contre le mur du fond) */}
        <mesh material={shelfWood} position={[0, 0.4, -1.0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.8, 0.4]} />
        </mesh>
        {Array.from({ length: 10 }).map((_, b) => (
          <mesh
            key={b}
            material={bookMats[(b * 3) % bookMats.length]}
            position={[-1.0 + b * 0.2, 0.95, -1.0]}
            castShadow
          >
            <boxGeometry args={[0.14, 0.28 + ((b * 5) % 4) * 0.03, 0.28]} />
          </mesh>
        ))}
        {/* lampe de bureau (lumière chaude) */}
        <mesh material={metal} position={[0.7, 0.95, -0.1]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        </mesh>
        <pointLight position={[0.7, 1.15, 0]} intensity={4} distance={4} decay={2} color="#ffd9a0" />
      </group>
    </group>
  );
}

/* ---------- Rayonnage rempli de livres ---------- */
function Bookshelf({
  position,
  rotation = 0,
  width,
  frame,
  bookMats,
}: {
  position: [number, number, number];
  rotation?: number;
  width: number;
  frame: MeshStandardMaterial;
  bookMats: MeshStandardMaterial[];
}) {
  const H = 2.8;
  const D = 0.42;
  const SH = 4;
  const inner = width - 0.18;
  const perShelf = Math.max(6, Math.floor(inner / 0.17));
  const spacing = inner / perShelf;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh material={frame} position={[0, H / 2, -D / 2 + 0.03]}><boxGeometry args={[width, H, 0.06]} /></mesh>
      <mesh material={frame} position={[-width / 2, H / 2, 0]}><boxGeometry args={[0.08, H, D]} /></mesh>
      <mesh material={frame} position={[width / 2, H / 2, 0]}><boxGeometry args={[0.08, H, D]} /></mesh>
      <mesh material={frame} position={[0, H - 0.02, 0]}><boxGeometry args={[width, 0.06, D]} /></mesh>
      <mesh material={frame} position={[0, 0.04, 0]}><boxGeometry args={[width, 0.08, D]} /></mesh>
      {Array.from({ length: SH }).map((_, s) => {
        const base = 0.1 + (s * (H - 0.2)) / SH;
        const top = 0.1 + ((s + 1) * (H - 0.2)) / SH;
        return (
          <group key={s}>
            <mesh material={frame} position={[0, top, 0]}><boxGeometry args={[inner, 0.04, D - 0.06]} /></mesh>
            {Array.from({ length: perShelf }).map((_, b) => {
              const bh = 0.3 + ((b * 5 + s * 3) % 5) * 0.035;
              const bw = spacing * (0.6 + ((b * 7 + s) % 3) * 0.12);
              return (
                <mesh
                  key={b}
                  material={bookMats[(b * 3 + s * 5) % bookMats.length]}
                  position={[-inner / 2 + (b + 0.5) * spacing, base + bh / 2 + 0.03, 0]}
                  castShadow
                >
                  <boxGeometry args={[bw, bh, D - 0.12]} />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
}

/* ---------- Fauteuil club ---------- */
function ClubChair({
  position,
  rotation = 0,
  leather,
  metal,
}: {
  position: [number, number, number];
  rotation?: number;
  leather: MeshStandardMaterial;
  metal: MeshStandardMaterial;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh material={leather} position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[0.95, 0.32, 0.9]} />
      </mesh>
      <mesh material={leather} position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.82, 0.2, 0.78]} />
      </mesh>
      <mesh material={leather} position={[0, 0.72, -0.36]} castShadow>
        <boxGeometry args={[0.82, 0.62, 0.18]} />
      </mesh>
      <mesh material={leather} position={[-0.43, 0.55, 0]} castShadow>
        <boxGeometry args={[0.16, 0.42, 0.82]} />
      </mesh>
      <mesh material={leather} position={[0.43, 0.55, 0]} castShadow>
        <boxGeometry args={[0.16, 0.42, 0.82]} />
      </mesh>
      <mesh material={metal} position={[0, 0.08, 0]}>
        <boxGeometry args={[0.85, 0.08, 0.8]} />
      </mesh>
    </group>
  );
}
