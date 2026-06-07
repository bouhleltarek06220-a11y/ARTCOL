"use client";

import { useRouter } from "next/navigation";
import AmavyaShowreelVideo from "@/components/AmavyaShowreelVideo";

/**
 * Player de la page /showreel : lit la vidéo officielle AMAVYA.
 * Quand l'utilisateur ferme ou passe, on revient à la home.
 *
 * Note : l'ancien client narratif en 7 actes (ShowreelClient.jsx) reste
 * dans le repo en tant que réserve mais n'est plus la cible par défaut.
 */
export default function ShowreelPlayer() {
  const router = useRouter();
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <AmavyaShowreelVideo onClose={() => router.push("/")} />
    </div>
  );
}
