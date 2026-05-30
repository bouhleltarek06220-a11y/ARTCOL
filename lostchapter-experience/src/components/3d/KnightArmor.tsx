import * as THREE from 'three';

// Armure de chevalier de garde, sur poteau en bois — décor procédural détaillé.
// Casque à plumet + visière + plastron + brassards + cuissards + bouclier devant.
export function KnightArmor({
  position,
  rotationY = 0,
  plumeColor = '#7a1a1a',
}: {
  position: [number, number, number];
  rotationY?: number;
  plumeColor?: string;
}) {
  const steel = { color: '#7c8088', metalness: 0.85, roughness: 0.32 } as const;
  const darkSteel = { color: '#3a3e44', metalness: 0.8, roughness: 0.4 } as const;
  const wood = { color: '#2a1709', roughness: 0.85, metalness: 0.05 } as const;
  const leather = { color: '#3a1a0a', roughness: 0.75, metalness: 0.05 } as const;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Socle en bois (poteau support) */}
      <mesh position={[0, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.36, 0.12, 16]} />
        <meshStandardMaterial {...wood} color="#1c100a" />
      </mesh>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 1.0, 8]} />
        <meshStandardMaterial {...wood} />
      </mesh>

      {/* ─── PLASTRON / TORSE ─────────────────────── */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <boxGeometry args={[0.55, 0.55, 0.32]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      {/* Plaque ventrale (cotte de mailles plus sombre) */}
      <mesh position={[0, 0.98, 0.001]} castShadow>
        <boxGeometry args={[0.5, 0.32, 0.3]} />
        <meshStandardMaterial color="#48484e" metalness={0.6} roughness={0.55} />
      </mesh>
      {/* Épaulières arrondies */}
      <mesh position={[-0.34, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.16, 14, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      <mesh position={[0.34, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.16, 14, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial {...steel} />
      </mesh>

      {/* ─── BRAS (gauche/droit) ──────────────────── */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.36, 1.15, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.07, 0.06, 0.45, 10]} />
            <meshStandardMaterial {...steel} />
          </mesh>
          <mesh position={[0, -0.42, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.05, 0.45, 10]} />
            <meshStandardMaterial {...darkSteel} />
          </mesh>
          {/* Gantelet */}
          <mesh position={[0, -0.68, 0]} castShadow>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshStandardMaterial {...steel} />
          </mesh>
        </group>
      ))}

      {/* ─── JAMBES (cuissards + jambières) ─────── */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.13, 0.78, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.07, 0.4, 10]} />
            <meshStandardMaterial {...steel} />
          </mesh>
          <mesh position={[0, -0.4, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.06, 0.42, 10]} />
            <meshStandardMaterial {...darkSteel} />
          </mesh>
          {/* Botte */}
          <mesh position={[0, -0.66, 0.04]} castShadow>
            <boxGeometry args={[0.13, 0.1, 0.22]} />
            <meshStandardMaterial {...leather} />
          </mesh>
        </group>
      ))}

      {/* ─── COL / GORGERIN ───────────────────────── */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.18, 0.12, 14]} />
        <meshStandardMaterial {...darkSteel} />
      </mesh>

      {/* ─── HEAUME (casque) ──────────────────────── */}
      <group position={[0, 1.92, 0]}>
        {/* Crâne */}
        <mesh castShadow>
          <sphereGeometry args={[0.18, 16, 14]} />
          <meshStandardMaterial {...steel} />
        </mesh>
        {/* Visière (bandeau noir devant) */}
        <mesh position={[0, 0.02, 0.14]} castShadow>
          <boxGeometry args={[0.32, 0.08, 0.1]} />
          <meshStandardMaterial color="#0a0805" metalness={0.4} roughness={0.6} />
        </mesh>
        {/* Fente horizontale claire (les yeux) */}
        <mesh position={[0, 0.02, 0.198]}>
          <boxGeometry args={[0.18, 0.012, 0.005]} />
          <meshBasicMaterial color="#ffae5c" />
        </mesh>
        {/* Mentonnière */}
        <mesh position={[0, -0.1, 0.08]} castShadow>
          <boxGeometry args={[0.24, 0.12, 0.18]} />
          <meshStandardMaterial {...darkSteel} />
        </mesh>
        {/* Pommeau au sommet */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <sphereGeometry args={[0.04, 10, 10]} />
          <meshStandardMaterial color="#c99b5c" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Plumet (cône de plumes) */}
        <mesh position={[0, 0.36, -0.02]} rotation={[Math.PI / 9, 0, 0]} castShadow>
          <coneGeometry args={[0.06, 0.32, 10]} />
          <meshStandardMaterial color={plumeColor} roughness={0.8} metalness={0.05} emissive={plumeColor} emissiveIntensity={0.08} />
        </mesh>
      </group>

      {/* ─── BOUCLIER tenu devant ─────────────────── */}
      <group position={[0.42, 1.1, 0.22]} rotation={[0, -0.25, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.34, 0.34, 0.05, 22]} />
          <meshStandardMaterial color="#5a1a1a" roughness={0.75} metalness={0.1} />
        </mesh>
        {/* Bordure dorée */}
        <mesh position={[0, 0, 0.03]}>
          <torusGeometry args={[0.33, 0.018, 8, 30]} />
          <meshStandardMaterial color="#c99b5c" metalness={0.9} roughness={0.35} />
        </mesh>
        {/* Emblème (croix) */}
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[0.06, 0.4, 0.005]} />
          <meshStandardMaterial color="#e5c788" metalness={0.85} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[0.4, 0.06, 0.005]} />
          <meshStandardMaterial color="#e5c788" metalness={0.85} roughness={0.35} />
        </mesh>
        {/* Boss central */}
        <mesh position={[0, 0, 0.06]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#c99b5c" metalness={0.95} roughness={0.25} />
        </mesh>
      </group>

      {/* ─── ÉPÉE plantée devant le socle ─────────── */}
      <group position={[-0.32, 0, 0.25]} rotation={[0, 0, 0.15]}>
        {/* Lame */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <boxGeometry args={[0.05, 1.0, 0.01]} />
          <meshStandardMaterial color="#bcc0c8" metalness={0.95} roughness={0.18} />
        </mesh>
        {/* Garde */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[0.24, 0.04, 0.04]} />
          <meshStandardMaterial color="#c99b5c" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Poignée */}
        <mesh position={[0, 1.32, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.18, 8]} />
          <meshStandardMaterial color="#2a1709" roughness={0.85} metalness={0.1} />
        </mesh>
        {/* Pommeau */}
        <mesh position={[0, 1.44, 0]} castShadow>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial color="#c99b5c" metalness={0.95} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}
