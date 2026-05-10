'use client';

import React, { Component, type ReactNode } from 'react';
import Navigation from "@/components/portfolio/Navigation";
import HeroSection from "@/components/portfolio/HeroSection";
import AboutSection from "@/components/portfolio/AboutSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import CertificationsSection from "@/components/portfolio/CertificationsSection";
import ContactSection from "@/components/portfolio/ContactSection";
import Footer from "@/components/portfolio/Footer";
import ParticleField from "@/components/portfolio/ParticleField";

class ThreeErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* 3D Particle Background - fixed behind all content */}
      <ThreeErrorBoundary>
        <ParticleField />
      </ThreeErrorBoundary>

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
