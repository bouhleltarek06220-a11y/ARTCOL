import ShowreelPlayer from "@/components/showreel/ShowreelPlayer";

export const metadata = {
  title: "AMAVYA — Showreel",
  description: "Découvrez AMAVYA en quelques secondes.",
  alternates: { canonical: "/showreel" },
  robots: { index: false, follow: false },
};

export default function ShowreelPage() {
  return <ShowreelPlayer />;
}
