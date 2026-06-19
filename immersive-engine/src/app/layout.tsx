import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "AMAVYA — La Galerie Orbitale",
  description:
    "Une galerie 3D immersive : avancez dans une galaxie cyberpunk et explorez mes créations, exposées comme des œuvres.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${cormorant.variable} h-full antialiased`}>
      <body>{children}</body>
    </html>
  );
}
