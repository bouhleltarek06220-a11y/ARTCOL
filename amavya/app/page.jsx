import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Probleme from "@/components/sections/Probleme";
import Solution from "@/components/sections/Solution";
import Offre from "@/components/sections/Offre";
import Vision from "@/components/Vision";
import Founder from "@/components/Founder";
import Technologies from "@/components/Technologies";
import OtherExpertises from "@/components/sections/OtherExpertises";
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
        <Probleme />
        <Solution />
        <Offre />
        <Vision />
        <Founder />
        <Technologies />
        <OtherExpertises />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
