'use client';

import React from 'react';
import {
  User,
  Activity,
  Bot,
  Brain,
  FolderKanban,
  Clock,
  Layers,
  Award,
  FileUser,
  Send,
  Menu,
  X,
} from 'lucide-react';

export interface SidebarSection {
  id: string;
  label: string;
  icon: React.ElementType;
}

export const sidebarSections: SidebarSection[] = [
  { id: 'identification', label: 'IDENTIFICATION', icon: User },
  { id: 'seismic', label: 'SEISMIC RESEARCH', icon: Activity },
  { id: 'agentic', label: 'AGENTIC SYSTEMS', icon: Bot },
  { id: 'deep-learning', label: 'DEEP LEARNING', icon: Brain },
  { id: 'vault', label: 'PROJECT VAULT', icon: FolderKanban },
  { id: 'career-timeline', label: 'CAREER TIMELINE', icon: Clock },
  { id: 'tech-stack', label: 'TECH STACK', icon: Layers },
  { id: 'certifications', label: 'CERTIFICATIONS', icon: Award },
  { id: 'recruiter-hub', label: 'RECRUITER HUB', icon: FileUser },
  { id: 'contact', label: 'CONTACT', icon: Send },
];

interface DossierSidebarProps {
  activeSection: string;
  onSectionClick: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function DossierSidebar({
  activeSection,
  onSectionClick,
  isOpen,
  onToggle,
}: DossierSidebarProps) {
  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-[9999] flex items-center justify-center w-10 h-10 rounded bg-[rgba(10,10,10,0.9)] border border-[rgba(0,240,255,0.2)] text-[#00F0FF] md:hidden"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[9996] md:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-[9997]
          bg-[rgba(8,8,8,0.95)] backdrop-blur-xl
          border-r border-[rgba(0,240,255,0.1)]
          flex flex-col
          transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        role="navigation"
        aria-label="Dossier navigation"
      >
        {/* Header */}
        <div className="pt-16 pb-4 px-4 md:pt-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
            <span className="text-xs text-[rgba(0,240,255,0.5)] uppercase tracking-[0.2em]">
              Classified
            </span>
          </div>
          <h2
            className="text-[#00F0FF] text-sm font-bold uppercase tracking-[0.25em]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Dossier Index
          </h2>
          <div className="mt-2 h-px bg-gradient-to-r from-[rgba(0,240,255,0.3)] to-transparent" />
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-2 py-2">
          <ul className="space-y-0.5">
            {sidebarSections.map((section) => {
              const isActive = activeSection === section.id;
              const Icon = section.icon;
              return (
                <li key={section.id}>
                  <button
                    onClick={() => {
                      onSectionClick(section.id);
                      if (window.innerWidth < 768) {
                        onToggle();
                      }
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-sm
                      text-left transition-all duration-200
                      ${
                        isActive
                          ? 'bg-[rgba(0,240,255,0.08)] border-l-2 border-[#00F0FF] text-[#00F0FF]'
                          : 'border-l-2 border-transparent text-[#4a6b7c] hover:bg-[rgba(0,240,255,0.04)] hover:text-[rgba(0,240,255,0.6)]'
                      }
                    `}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <Icon
                      size={16}
                      className={`flex-shrink-0 ${
                        isActive
                          ? 'text-[#00F0FF]'
                          : 'text-[#4a6b7c]'
                      }`}
                    />
                    <span
                      className="text-[10px] uppercase tracking-[0.15em] font-medium"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {section.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[rgba(0,240,255,0.06)]">
          <p
            className="text-[9px] text-[#2a3a44] uppercase tracking-[0.2em]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Clearance Level: Top Secret
          </p>
        </div>
      </aside>
    </>
  );
}
