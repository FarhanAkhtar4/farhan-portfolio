'use client';

import React, { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import DossierSidebar from './DossierSidebar';
import IdentificationSection from './sections/IdentificationSection';
import SeismicSection from './sections/SeismicSection';
import AgenticSection from './sections/AgenticSection';
import DeepLearningSection from './sections/DeepLearningSection';
import ProjectVaultSection from './sections/ProjectVaultSection';
import CareerTimelineSection from './sections/CareerTimelineSection';
import TechStackSection from './sections/TechStackSection';
import CertificationsSection from './sections/CertificationsSection';
import RecruiterHubSection from './sections/RecruiterHubSection';
import ContactSection from './sections/ContactSection';

const SECTION_IDS = [
  'identification',
  'seismic',
  'agentic',
  'deep-learning',
  'vault',
  'career-timeline',
  'tech-stack',
  'certifications',
  'recruiter-hub',
  'contact',
];

export default function DossierLayout() {
  const [activeSection, setActiveSection] = useState('identification');
  const isDesktop = useSyncExternalStore(
    (cb) => {
      window.addEventListener('resize', cb);
      return () => window.removeEventListener('resize', cb);
    },
    () => window.innerWidth >= 1024,
    () => false
  );
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);

  /* --- IntersectionObserver to track active section --- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0.1,
      }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  /* --- Smooth scroll to section --- */
  const handleSectionClick = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    /* Close sidebar on mobile after click */
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#c8d6d0] relative">
      {/* Scanline overlay */}
      <div
        className="scanline-overlay"
        aria-hidden="true"
      />

      {/* TOP SECRET watermark */}
      <div
        className="dossier-watermark"
        aria-hidden="true"
      >
        TOP SECRET // AI RESEARCH
      </div>

      {/* Sidebar */}
      <DossierSidebar
        activeSection={activeSection}
        onSectionClick={handleSectionClick}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <main
        className="transition-all duration-300"
        style={{ marginLeft: isDesktop ? '16rem' : '0' }}
      >
        <IdentificationSection />
        <SeismicSection />
        <AgenticSection />
        <DeepLearningSection />
        <ProjectVaultSection />
        <CareerTimelineSection />
        <TechStackSection />
        <CertificationsSection />
        <RecruiterHubSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <footer
        className="py-8 px-4 md:px-8 border-t border-cyan-400/10"
        style={{ marginLeft: isDesktop ? '16rem' : '0' }}
      >
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <p className="text-[10px] font-mono tracking-[0.3em] text-slate-600 uppercase">
            The Neural Dossier // Classification Level: Restricted
          </p>
          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-slate-700/40 to-transparent" />
          <p className="text-[8px] font-mono tracking-[0.2em] text-slate-700 uppercase">
            &copy; {new Date().getFullYear()} Farhan Akhtar Makandar — All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
