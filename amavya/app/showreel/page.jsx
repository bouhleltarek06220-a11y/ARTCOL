import ShowreelClient from "@/components/showreel/ShowreelClient";

export const metadata = {
  title: "AMAVYA — Showreel 60s",
  description:
    "Un voyage cinématique de 60 secondes dans l'intelligence artificielle AMAVYA.",
  alternates: { canonical: "/showreel" },
  robots: { index: false, follow: false },
};

export default function ShowreelPage() {
  return <ShowreelClient />;
}
