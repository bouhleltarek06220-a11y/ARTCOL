import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Vision from "@/components/Vision";
import Technologies from "@/components/Technologies";
import Founder from "@/components/Founder";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <ContactModal />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Vision />
        <Technologies />
        <Founder />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
