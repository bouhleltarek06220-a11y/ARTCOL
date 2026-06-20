import { HouseScene } from "@/components/3d/HouseScene";

export const metadata = {
  title: "ARTCOL · Maison 3D",
  description:
    "Maison 3D interactive — galerie immersive éclairée par HDRI, ombres dynamiques et post-processing.",
};

export default function Home() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-black">
      {/* Scène 3D plein écran, sans aucun habillage textuel. */}
      <div className="absolute inset-0">
        <HouseScene />
      </div>
    </main>
  );
}
