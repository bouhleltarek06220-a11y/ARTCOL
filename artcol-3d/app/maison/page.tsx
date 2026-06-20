import { HouseScene } from "@/components/3d/HouseScene";

export const metadata = {
  title: "ARTCOL · Villa 3D",
  description:
    "Villa moderne 3D interactive présentée de nuit — éclairage chaud, piscine et sol réfléchissant.",
};

export default function MaisonPage() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        <HouseScene />
      </div>
    </main>
  );
}
