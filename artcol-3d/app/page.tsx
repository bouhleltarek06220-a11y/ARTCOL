export const metadata = {
  title: "AMAVYA · Villa Galerie",
  description:
    "Villa d'architecte transformée en galerie d'art contemporain — visite immersive 3D, coucher de soleil, œuvres, sculptures et supercars.",
};

export default function Home() {
  return (
    <iframe
      src="/villa.html"
      title="AMAVYA — Villa Galerie"
      className="fixed inset-0 h-full w-full border-0"
      allow="pointer-lock; fullscreen; gyroscope; accelerometer"
    />
  );
}
