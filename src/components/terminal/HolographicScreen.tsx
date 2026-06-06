'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTerminalStore, SECTION_DISPLAY_NAMES, type SectionId } from '@/store/terminal-store';
import {
  siteConfig,
  education,
  heroTaglines,
  experience,
  projects,
  skillCategories,
  certifications,
} from '@/lib/data';
import { resumeDownloads, profileLinks } from '@/lib/resume-data';
import GlitchTransition from './GlitchTransition';

/* ============================================================
   Section Content Renderers
   ============================================================ */

function IdentificationSection() {
  return (
    <div className="holo-panel">
      <div className="section-title">◆ IDENTIFICATION PROTOCOL</div>
      <div className="section-subtitle">SUBJECT VERIFICATION IN PROGRESS...</div>

      <div className="data-row">
        <span className="data-label">SUBJECT NAME</span>
        <span className="data-value accent">{siteConfig.name}</span>
      </div>
      <div className="data-row">
        <span className="data-label">DESIGNATION</span>
        <span className="data-value">{siteConfig.role}</span>
      </div>
      <div className="data-row">
        <span className="data-label">SPECIALIZATION</span>
        <span className="data-value violet">{siteConfig.roleShort}</span>
      </div>
      <div className="data-row">
        <span className="data-label">LOCATION</span>
        <span className="data-value">{siteConfig.location}</span>
      </div>
      <div className="data-row">
        <span className="data-label">EMAIL</span>
        <span className="data-value">{siteConfig.email}</span>
      </div>

      <div className="separator" />

      <div className="data-row">
        <span className="data-label">EDUCATION</span>
        <span className="data-value">{education[0].degree}</span>
      </div>
      <div className="data-row">
        <span className="data-label">INSTITUTION</span>
        <span className="data-value">{education[0].institution}</span>
      </div>
      <div className="data-row">
        <span className="data-label">GRADUATION</span>
        <span className="data-value accent">{education[0].period}</span>
      </div>

      <div className="separator" />

      <div className="data-row">
        <span className="data-label">STATUS</span>
        <span className="data-value accent">● ACTIVE — ACCEPTING OPPORTUNITIES</span>
      </div>

      <div className="separator" />

      <div style={{ marginTop: 8 }}>
        <div className="data-label" style={{ marginBottom: 8 }}>MISSION STATEMENTS</div>
        {heroTaglines.map((line, i) => (
          <div key={i} style={{ color: '#7a9aaa', fontSize: 11, marginBottom: 4, paddingLeft: 12 }}>
            <span style={{ color: '#00f0ff' }}>&gt;</span> {line}
          </div>
        ))}
      </div>
    </div>
  );
}

function SeismicSection() {
  const seismicProject = projects.find(p => p.id === 'seismic-response-prediction');
  if (!seismicProject) return null;

  return (
    <div className="holo-panel">
      <div className="section-title">◈ SEISMIC RESPONSE PREDICTION</div>
      <div className="section-subtitle">FLAGSHIP RESEARCH — TEMPORAL FUSION TRANSFORMER</div>

      <div className="card">
        <div className="card-title">{seismicProject.title}</div>
        <div className="card-desc">{seismicProject.description}</div>
        <div className="card-meta">
          {seismicProject.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>

      {seismicProject.metrics && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {seismicProject.metrics.map(m => (
            <div key={m.label} className="metric-box">
              <div className={`metric-value ${m.accent ? 'accent' : ''}`}>{m.value}</div>
              <div className="metric-label">{m.label}</div>
            </div>
          ))}
        </div>
      )}

      {seismicProject.highlights && (
        <>
          <div className="data-label" style={{ marginBottom: 8 }}>KEY FINDINGS</div>
          <ul className="highlight-list">
            {seismicProject.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </>
      )}

      {seismicProject.architecture && (
        <>
          <div className="separator" />
          <div className="data-label" style={{ marginBottom: 8 }}>{seismicProject.architecture.title}</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {seismicProject.architecture.layers.map((layer, i) => (
              <div key={i} className="metric-box" style={{ minWidth: 70 }}>
                <div className="metric-value" style={{ fontSize: 12 }}>{layer.label}</div>
                <div className="metric-label">{layer.sublabel}</div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="separator" />
      <div className="data-label" style={{ marginBottom: 8 }}>DEPLOYED</div>
      <div className="card-meta">
        {seismicProject.github && (
          <a href={seismicProject.github} target="_blank" rel="noopener" className="link-btn">⌘ GITHUB</a>
        )}
        {seismicProject.huggingface && (
          <a href={seismicProject.huggingface} target="_blank" rel="noopener" className="link-btn violet">⬡ HUGGINGFACE</a>
        )}
      </div>
    </div>
  );
}

function AgentsSection() {
  const agentProjects = projects.filter(p => p.category === 'Agentic AI');

  return (
    <div className="holo-panel">
      <div className="section-title">⬡ AGENTIC AI SYSTEMS</div>
      <div className="section-subtitle">MULTI-AGENT ORCHESTRATION & RAG PIPELINES</div>

      {agentProjects.map(project => (
        <div key={project.id} className="card">
          <div className="card-title">{project.title}</div>
          <div className="card-desc">{project.description}</div>
          <div className="card-meta">
            {project.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
          {project.isFlagship && (
            <div style={{ marginTop: 8 }}>
              <span className="tag violet" style={{ borderColor: 'rgba(168,85,247,0.3)', background: 'rgba(168,85,247,0.12)' }}>
                ★ FLAGSHIP
              </span>
            </div>
          )}
          <div className="card-meta" style={{ marginTop: 8 }}>
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener" className="link-btn" style={{ fontSize: 10, padding: '4px 10px' }}>GITHUB</a>
            )}
            {project.deployedUrl && (
              <a href={project.deployedUrl} target="_blank" rel="noopener" className="link-btn" style={{ fontSize: 10, padding: '4px 10px' }}>LIVE</a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function DeepLearningSection() {
  const dlProjects = projects.filter(p => p.category === 'Deep Learning');

  return (
    <div className="holo-panel">
      <div className="section-title">⬢ DEEP LEARNING MODELS</div>
      <div className="section-subtitle">TRANSFORMERS, ATTENTION & NEURAL ARCHITECTURES</div>

      {dlProjects.map(project => (
        <div key={project.id} className="card">
          <div className="card-title">{project.title}</div>
          <div className="card-desc">{project.oneLiner}</div>
          <div className="card-meta">
            {project.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
          {project.highlights && (
            <ul className="highlight-list" style={{ marginTop: 8 }}>
              {project.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

function ProjectsSection() {
  const flagshipProjects = projects.filter(p => p.isFlagship);
  const otherProjects = projects.filter(p => !p.isFlagship);

  return (
    <div className="holo-panel">
      <div className="section-title">▣ PROJECT ARCHIVE</div>
      <div className="section-subtitle">{projects.length} PROJECTS IN DATABASE</div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <div className="metric-box">
          <div className="metric-value">{projects.length}</div>
          <div className="metric-label">TOTAL</div>
        </div>
        <div className="metric-box">
          <div className="metric-value">{flagshipProjects.length}</div>
          <div className="metric-label">FLAGSHIP</div>
        </div>
        <div className="metric-box">
          <div className="metric-value">{new Set(projects.map(p => p.category)).size}</div>
          <div className="metric-label">CATEGORIES</div>
        </div>
      </div>

      {/* Flagship */}
      <div className="data-label" style={{ marginBottom: 8, color: '#00f0ff' }}>★ FLAGSHIP PROJECTS</div>
      {flagshipProjects.map(project => (
        <div key={project.id} className="card">
          <div className="card-title">{project.title}</div>
          <div className="card-desc">{project.oneLiner}</div>
          <div className="card-meta">
            {project.tags.slice(0, 3).map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
            <span className="tag violet">{project.category}</span>
          </div>
          {project.metrics && (
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              {project.metrics.slice(0, 2).map(m => (
                <div key={m.label} className="metric-box" style={{ minWidth: 60, padding: '6px 8px' }}>
                  <div className="metric-value" style={{ fontSize: 14 }}>{m.value}</div>
                  <div className="metric-label">{m.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Other */}
      <div className="separator" />
      <div className="data-label" style={{ marginBottom: 8 }}>OTHER PROJECTS</div>
      {otherProjects.map(project => (
        <div key={project.id} className="card" style={{ padding: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="card-title" style={{ fontSize: 12, marginBottom: 0 }}>{project.title}</span>
            <span className="tag" style={{ fontSize: 9, padding: '1px 6px' }}>{project.category}</span>
          </div>
          <div className="card-desc" style={{ margin: '4px 0 0' }}>{project.oneLiner}</div>
        </div>
      ))}
    </div>
  );
}

function CareerSection() {
  return (
    <div className="holo-panel">
      <div className="section-title">▤ CAREER LOG</div>
      <div className="section-subtitle">PROFESSIONAL EXPERIENCE & EDUCATION</div>

      {/* Experience */}
      <div className="data-label" style={{ marginBottom: 8, color: '#00f0ff' }}>EXPERIENCE</div>
      {experience.map(exp => (
        <div key={exp.id} className="card">
          <div className="card-title">{exp.role}</div>
          <div className="data-row" style={{ marginBottom: 0 }}>
            <span className="data-value" style={{ color: '#a855f7' }}>{exp.company}</span>
            <span className="data-value" style={{ fontSize: 11 }}>{exp.period}</span>
          </div>
          <ul className="highlight-list" style={{ marginTop: 8 }}>
            {exp.responsibilities.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      ))}

      {/* Education */}
      <div className="separator" />
      <div className="data-label" style={{ marginBottom: 8, color: '#00f0ff' }}>EDUCATION</div>
      {education.map((edu, i) => (
        <div key={i} className="card">
          <div className="card-title">{edu.degree}</div>
          <div className="data-row" style={{ marginBottom: 0 }}>
            <span className="data-value" style={{ fontSize: 11 }}>{edu.institution}</span>
            <span className="data-value" style={{ fontSize: 11, color: '#00f0ff' }}>{edu.period}</span>
          </div>
          {edu.details && (
            <div className="card-desc" style={{ marginTop: 6 }}>{edu.details}</div>
          )}
        </div>
      ))}

      {/* Resume Downloads */}
      <div className="separator" />
      <div className="data-label" style={{ marginBottom: 8, color: '#00f0ff' }}>RESUME DOWNLOADS</div>
      <div className="card-meta">
        {resumeDownloads.map(r => (
          <a
            key={r.label}
            href={r.href}
            className="link-btn"
            style={{ fontSize: 10, padding: '4px 10px' }}
            download
          >
            ↓ {r.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function StackSection() {
  const totalSkills = skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0);

  return (
    <div className="holo-panel">
      <div className="section-title">▥ TECH STACK</div>
      <div className="section-subtitle">{skillCategories.length} CATEGORIES • {totalSkills} SKILLS</div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <div className="metric-box">
          <div className="metric-value">{totalSkills}</div>
          <div className="metric-label">TOTAL SKILLS</div>
        </div>
        <div className="metric-box">
          <div className="metric-value">{skillCategories.length}</div>
          <div className="metric-label">CATEGORIES</div>
        </div>
      </div>

      {skillCategories.map(cat => (
        <div key={cat.name} style={{ marginBottom: 12 }}>
          <div className="data-label" style={{ marginBottom: 6, color: cat.highlight ? '#a855f7' : '#4a6b7c' }}>
            {cat.highlight ? '★ ' : '▸ '}{cat.name}
          </div>
          <div className="card-meta">
            {cat.skills.map(skill => (
              <span
                key={skill}
                className={`tag ${cat.highlight ? 'violet' : ''}`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CertsSection() {
  const catGroups: Record<string, typeof certifications> = {};
  certifications.forEach(cert => {
    const cat = cert.category;
    if (!catGroups[cat]) catGroups[cat] = [];
    catGroups[cat].push(cert);
  });

  return (
    <div className="holo-panel">
      <div className="section-title">◆ CERT DATABASE</div>
      <div className="section-subtitle">{certifications.length} CERTIFICATIONS VERIFIED</div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <div className="metric-box">
          <div className="metric-value">{certifications.length}</div>
          <div className="metric-label">TOTAL CERTS</div>
        </div>
        <div className="metric-box">
          <div className="metric-value">{Object.keys(catGroups).length}</div>
          <div className="metric-label">CATEGORIES</div>
        </div>
      </div>

      {Object.entries(catGroups).map(([cat, certs]) => (
        <div key={cat} style={{ marginBottom: 12 }}>
          <div className="data-label" style={{ marginBottom: 6, color: '#00f0ff' }}>
            ▸ {cat}
          </div>
          {certs.map(cert => (
            <div key={cert.title} className="card" style={{ padding: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span className="card-title" style={{ fontSize: 11, marginBottom: 0 }}>{cert.title}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="data-value" style={{ fontSize: 10, color: '#4a6b7c' }}>{cert.issuer}</span>
                <div className="card-meta">
                  {cert.verifyUrl && (
                    <a href={cert.verifyUrl} target="_blank" rel="noopener" className="link-btn" style={{ fontSize: 9, padding: '2px 8px' }}>
                      VERIFY
                    </a>
                  )}
                  {cert.certFile && (
                    <a href={cert.certFile} target="_blank" rel="noopener" className="link-btn" style={{ fontSize: 9, padding: '2px 8px' }}>
                      VIEW
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function RecruiterSection() {
  return (
    <div className="holo-panel">
      <div className="section-title">⬟ RECRUITER ACCESS</div>
      <div className="section-subtitle">AUTHORIZED PERSONNEL ONLY</div>

      <div className="data-row">
        <span className="data-label">CLEARANCE</span>
        <span className="data-value accent">LEVEL 3 — OPEN ACCESS</span>
      </div>

      <div className="separator" />

      <div className="data-label" style={{ marginBottom: 8 }}>PROFILE LINKS</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
        {profileLinks.map(link => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="link-btn"
          >
            ◈ {link.label} — {link.description}
          </a>
        ))}
      </div>

      <div className="separator" />

      <div className="data-label" style={{ marginBottom: 8 }}>RESUME VARIANTS</div>
      <div className="card-meta" style={{ flexWrap: 'wrap' }}>
        {resumeDownloads.map(r => (
          <a
            key={r.label}
            href={r.href}
            className="link-btn"
            style={{ fontSize: 10, padding: '4px 10px' }}
            download
          >
            ↓ {r.label}
          </a>
        ))}
      </div>

      <div className="separator" />

      <div className="data-label" style={{ marginBottom: 8 }}>QUICK SUMMARY</div>
      <div className="card">
        <div style={{ color: '#7a9aaa', fontSize: 11, lineHeight: 1.6 }}>
          ML Systems Engineer with expertise in Agentic AI, Deep Learning, and Transformer architectures.
          Published research at NIT Calicut. {projects.length} production projects spanning RAG pipelines,
          multi-agent systems, temporal prediction, and full-stack SaaS.
        </div>
      </div>
    </div>
  );
}

function ContactSection() {
  return (
    <div className="holo-panel">
      <div className="section-title">✦ COMM CHANNEL</div>
      <div className="section-subtitle">ESTABLISH SECURE CONNECTION</div>

      <div className="data-row">
        <span className="data-label">EMAIL</span>
        <span className="data-value accent">{siteConfig.email}</span>
      </div>
      <div className="data-row">
        <span className="data-label">PHONE</span>
        <span className="data-value">{siteConfig.phone}</span>
      </div>
      <div className="data-row">
        <span className="data-label">LOCATION</span>
        <span className="data-value">{siteConfig.location}</span>
      </div>

      <div className="separator" />

      <div className="data-label" style={{ marginBottom: 8 }}>PROFILES</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
        {profileLinks.map(link => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="link-btn"
          >
            ◈ {link.label}
          </a>
        ))}
      </div>

      <div className="separator" />

      <div className="data-label" style={{ marginBottom: 8 }}>RESUME DOWNLOADS</div>
      <div className="card-meta" style={{ flexWrap: 'wrap' }}>
        {resumeDownloads.slice(0, 3).map(r => (
          <a
            key={r.label}
            href={r.href}
            className="link-btn"
            style={{ fontSize: 10, padding: '4px 10px' }}
            download
          >
            ↓ {r.label}
          </a>
        ))}
      </div>

      <div className="separator" />

      <div style={{ color: '#4a6b7c', fontSize: 10, textAlign: 'center', letterSpacing: 1 }}>
        ENCRYPTED CHANNEL ACTIVE — TRANSMISSION SECURE
      </div>
    </div>
  );
}

/* ============================================================
   Section Component Map
   ============================================================ */

const SECTION_COMPONENTS: Record<SectionId, () => React.ReactNode> = {
  identification: IdentificationSection,
  seismic: SeismicSection,
  agents: AgentsSection,
  deep: DeepLearningSection,
  projects: ProjectsSection,
  career: CareerSection,
  stack: StackSection,
  certs: CertsSection,
  recruiter: RecruiterSection,
  contact: ContactSection,
};

/* ============================================================
   HolographicScreen Component
   ============================================================ */

function HolographicScreen() {
  const groupRef = useRef<THREE.Group>(null);
  const { activeSection, isTransitioning } = useTerminalStore();

  // Screen dimensions
  const screenW = 16;
  const screenH = 9;

  // Emissive frame border geometry
  const frameGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(
      new THREE.PlaneGeometry(screenW + 0.1, screenH + 0.1)
    );
  }, []);

  const frameMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: new THREE.Color('#00F0FF'),
      transparent: true,
      opacity: 0.35,
    });
  }, []);

  // Subtle floating animation for screen
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = 2.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  const ActiveSectionComponent = SECTION_COMPONENTS[activeSection];

  return (
    <group ref={groupRef} position={[0, 2.5, -2]}>
      {/* Semi-transparent screen backing */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[screenW, screenH]} />
        <meshStandardMaterial
          color="#030f19"
          transparent
          opacity={0.85}
          emissive="#030f19"
          emissiveIntensity={0.3}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Glowing frame edges */}
      <lineSegments
        geometry={frameGeometry}
        material={frameMaterial}
        position={[0, 0, 0.01]}
      />

      {/* Inner glow edges (violet) */}
      <lineSegments
        geometry={useMemo(() => new THREE.EdgesGeometry(
          new THREE.PlaneGeometry(screenW - 0.2, screenH - 0.2)
        ), [])}
        material={useMemo(() => new THREE.LineBasicMaterial({
          color: new THREE.Color('#A855F7'),
          transparent: true,
          opacity: 0.15,
        }), [])}
        position={[0, 0, 0.02]}
      />

      {/* HTML content overlay */}
      <Html
        position={[0, 0, 0.05]}
        center
        distanceFactor={8}
        transform

        style={{
          width: `${screenW * 100}px`,
          height: `${screenH * 100}px`,
          transform: 'scale(1)',
          transformOrigin: 'center center',
        }}
        zIndexRange={[0, 0]}
      >
        <div
          className="holo-screen-frame"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: "'Geist Mono', monospace",
          }}
        >
          {/* Header bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 16px',
            borderBottom: '1px solid rgba(0, 240, 255, 0.1)',
            flexShrink: 0,
          }}>
            <span style={{ color: '#00f0ff', fontSize: 11, letterSpacing: 2 }}>
              {SECTION_DISPLAY_NAMES[activeSection]}
            </span>
            <span style={{ color: '#4a6b7c', fontSize: 10, letterSpacing: 1 }}>
              FARHAN://mainframe/{activeSection}
            </span>
          </div>

          {/* Content area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
            <GlitchTransition isActive={isTransitioning} sectionKey={activeSection}>
              <ActiveSectionComponent />
            </GlitchTransition>
          </div>
        </div>
      </Html>
    </group>
  );
}

export default HolographicScreen;
