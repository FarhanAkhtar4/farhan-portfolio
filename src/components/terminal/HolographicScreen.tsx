'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTerminalStore, type SectionId } from '@/store/terminal-store';
import { C, L } from './TerminalUI';
import GlitchTransition from './GlitchTransition';

// Section components
import IdentificationSection from './sections/IdentificationSection';
import SeismicSection from './sections/SeismicSection';
import AgentsSection from './sections/AgentsSection';
import DeepLearningSection from './sections/DeepLearningSection';
import ProjectsSection from './sections/ProjectsSection';
import CareerSection from './sections/CareerSection';
import StackSection from './sections/StackSection';
import CertsSection from './sections/CertsSection';
import RecruiterSection from './sections/RecruiterSection';
import ContactSection from './sections/ContactSection';

const SECTION_COMPONENTS: Record<SectionId, React.ComponentType> = {
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

function HolographicScreen() {
  const groupRef = useRef<THREE.Group>(null);
  const activeSection = useTerminalStore((s) => s.activeSection);

  // Geometries — memoized
  const screenGeo = useMemo(() => new THREE.PlaneGeometry(L.SCREEN_W, L.SCREEN_H), []);
  const outerEdgeGeo = useMemo(() => new THREE.EdgesGeometry(screenGeo), [screenGeo]);

  // Inner frame (slightly smaller)
  const innerGeo = useMemo(
    () => new THREE.PlaneGeometry(L.SCREEN_W - 0.15, L.SCREEN_H - 0.15),
    []
  );
  const innerEdgeGeo = useMemo(() => new THREE.EdgesGeometry(innerGeo), [innerGeo]);

  // Scanline overlay geo
  const scanGeo = useMemo(() => new THREE.PlaneGeometry(L.SCREEN_W - 0.3, L.SCREEN_H - 0.3), []);

  // Floating animation
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = 2.5 + Math.sin(t * 0.8) * 0.06;
  });

  const ActiveSectionComponent = SECTION_COMPONENTS[activeSection];

  return (
    <group ref={groupRef} position={[0, 2.5, -2]}>
      {/* Screen backing — dark semi-transparent plane */}
      <mesh geometry={screenGeo}>
        <meshBasicMaterial
          color={C.screenBg}
          transparent
          opacity={0.82}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer glowing frame — cyan */}
      <lineSegments geometry={outerEdgeGeo}>
        <lineBasicMaterial color={C.cyan} transparent opacity={0.35} />
      </lineSegments>

      {/* Inner glowing frame — violet */}
      <lineSegments geometry={innerEdgeGeo}>
        <lineBasicMaterial color={C.violet} transparent opacity={0.2} />
      </lineSegments>

      {/* Scanline overlay for holographic effect */}
      <mesh geometry={scanGeo} position={[0, 0, 0.005]}>
        <meshBasicMaterial color={C.bg} transparent opacity={0.04} />
      </mesh>

      {/* Section content — offset by z+0.02 */}
      <group position={[0, 0, 0.02]}>
        <GlitchTransition sectionKey={activeSection}>
          <ActiveSectionComponent />
        </GlitchTransition>
      </group>
    </group>
  );
}

export default HolographicScreen;
