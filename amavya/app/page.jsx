import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Vision } from "@/components/Vision";
import { Technologies } from "@/components/Technologies";
import { Founder } from "@/components/Founder";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <Navbar />
      <main className="relative">
        <Hero />
        <Services />
        <Vision />
        <Technologies />
        <Founder />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
