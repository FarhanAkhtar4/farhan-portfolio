import Navigation from "@/components/portfolio/Navigation";
import HeroSection from "@/components/portfolio/HeroSection";
import AboutSection from "@/components/portfolio/AboutSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import CertificationsSection from "@/components/portfolio/CertificationsSection";
import ContactSection from "@/components/portfolio/ContactSection";
import Footer from "@/components/portfolio/Footer";
import SceneWrapper from "@/components/portfolio/SceneWrapper";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* 3D Particle Background - fixed behind all content */}
      <SceneWrapper />

      {/* Scrollable content layer */}
      <div className="relative z-10 noise-overlay">
        <Navigation />
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <CertificationsSection />
        <ContactSection />
        <Footer />
      </div>
    </main>
  );
}
