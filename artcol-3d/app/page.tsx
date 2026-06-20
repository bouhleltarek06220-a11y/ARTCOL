import { VillaExperience } from "@/components/villa/VillaExperience";

export const metadata = {
  title: "AMAVYA · Villa Galerie",
  description:
    "Villa d'architecte transformée en galerie d'art contemporain — visite immersive 3D temps réel.",
};

export default function Home() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#0a0e14]">
      <VillaExperience />
    </main>
  );
}
