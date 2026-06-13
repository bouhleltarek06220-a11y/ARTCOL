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
import MusicToggle from "@/components/MusicToggle";
import BackToTop from "@/components/BackToTop";

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <ContactModal />
      <MusicToggle />
      <BackToTop />
      <Navbar />
      <main id="main">
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
