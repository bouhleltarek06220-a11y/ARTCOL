import VisionClient from "@/components/vision/VisionClient";

export const metadata = {
  title: "AMAVYA — Vision 2035",
  description:
    "Un voyage cinématique de 60 secondes dans le futur que construit AMAVYA.",
  alternates: { canonical: "/vision" },
  robots: { index: false, follow: false },
};

export default function VisionPage() {
  return <VisionClient />;
}
