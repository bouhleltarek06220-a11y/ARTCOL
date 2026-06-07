import MainframeHero from "@/components/labs/MainframeHero";

export const metadata = {
  title: "AMAVYA Labs",
  description:
    "Tell us about your project. We come back with a concrete plan.",
  alternates: { canonical: "/labs" },
  robots: { index: false, follow: false },
};

export default function LabsPage() {
  return <MainframeHero />;
}
