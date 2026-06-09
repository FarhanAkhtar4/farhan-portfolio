'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';
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

/* ============================================================
   Corner Bracket — holographic frame accent at each corner — BRIGHTER
   ============================================================ */
function CornerBracket({ position, rotation, color = '#00F0FF' }: {
  position: [number, number, number];
  rotation: [number, number, number];
  color?: string;
}) {
  const bracketLen = 0.35;
  const points = useMemo(() => [
    new THREE.Vector3(-bracketLen, bracketLen, 0),
    new THREE.Vector3(-bracketLen, -bracketLen, 0),
    new THREE.Vector3(bracketLen, -bracketLen, 0),
  ], []);
  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <group position={position} rotation={rotation}>
      <line geometry={geo}>
        <lineBasicMaterial color={color} transparent opacity={1.0} />
      </line>
      {/* Corner dot — LARGER */}
      <mesh position={[-bracketLen, -bracketLen, 0.001]}>
        <circleGeometry args={[0.035, 8]} />
        <meshBasicMaterial color={color} transparent opacity={1.0} />
      </mesh>
    </group>
  );
}

/* ============================================================
   Scanline Beam — moving horizontal line
   ============================================================ */
function ScanlineBeam({ width, height }: { width: number; height: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.PlaneGeometry(width * 0.85, 0.04), [width, height]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    // Scanline moves from top to bottom every ~4 seconds
    const normalized = (t * 0.25) % 1.0;
    meshRef.current.position.y = (height / 2) - normalized * height;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0.006]} geometry={geo}>
      <meshBasicMaterial
        color="#00F0FF"
        transparent
        opacity={0.12}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ============================================================
   HolographicScreen with texture-backed background + scanline overlay
   ============================================================ */
function HolographicScreen() {
  const groupRef = useRef<THREE.Group>(null);
  const screenBackingRef = useRef<THREE.Mesh>(null);
  const activeSection = useTerminalStore((s) => s.activeSection);

  // Load textures
  const [holoTexture, scanlineTexture] = useTexture(['/textures/holo-bg.png', '/textures/scanlines.png']);

  const screenGeo = useMemo(() => new THREE.PlaneGeometry(L.SCREEN_W, L.SCREEN_H), []);
  const outerEdgeGeo = useMemo(() => new THREE.EdgesGeometry(screenGeo), [screenGeo]);

  const innerGeo = useMemo(
    () => new THREE.PlaneGeometry(L.SCREEN_W - 0.15, L.SCREEN_H - 0.15),
    []
  );
  const innerEdgeGeo = useMemo(() => new THREE.EdgesGeometry(innerGeo), [innerGeo]);

  const scanGeo = useMemo(() => new THREE.PlaneGeometry(L.SCREEN_W - 0.3, L.SCREEN_H - 0.3), []);

  // Holo-bg textured background plane
  const holoBgGeo = useMemo(() => new THREE.PlaneGeometry(L.SCREEN_W - 0.05, L.SCREEN_H - 0.05), []);

  // Scanline overlay plane
  const scanlineOverlayGeo = useMemo(() => new THREE.PlaneGeometry(L.SCREEN_W - 0.1, L.SCREEN_H - 0.1), []);

  // Floating animation + flicker/hum
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Float
    groupRef.current.position.y = 2.5 + Math.sin(t * 0.8) * 0.06;

    // Subtle flicker/hum (oscillate opacity between 0.93-1.0)
    if (screenBackingRef.current) {
      const mat = screenBackingRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.965 + Math.sin(t * 7.5) * 0.035;
    }
  });

  const ActiveSectionComponent = SECTION_COMPONENTS[activeSection];

  // Corner bracket positions (outer frame corners)
  const hw = L.SCREEN_W / 2;
  const hh = L.SCREEN_H / 2;

  return (
    <group ref={groupRef} position={[0, 2.5, -2]}>
      {/* Holographic circuit board texture background */}
      <mesh geometry={holoBgGeo} position={[0, 0, -0.002]}>
        <meshBasicMaterial
          map={holoTexture}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>

      {/* Scanline overlay texture */}
      <mesh geometry={scanlineOverlayGeo} position={[0, 0, 0.0055]}>
        <meshBasicMaterial
          map={scanlineTexture}
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Screen backing — dark semi-transparent plane with flicker */}
      <mesh ref={screenBackingRef} geometry={screenGeo}>
        <meshBasicMaterial
          color={C.screenBg}
          transparent
          opacity={0.82}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer glowing frame — cyan — MUCH BRIGHTER for bloom */}
      <lineSegments geometry={outerEdgeGeo}>
        <lineBasicMaterial color={C.cyan} transparent opacity={0.85} />
      </lineSegments>

      {/* Inner glowing frame — violet — BRIGHTER for bloom */}
      <lineSegments geometry={innerEdgeGeo}>
        <lineBasicMaterial color={C.violet} transparent opacity={0.6} />
      </lineSegments>

      {/* Holographic corner brackets — FULL BRIGHTNESS */}
      <CornerBracket position={[-hw + 0.05, hh - 0.05, 0.003]} rotation={[0, 0, 0]} />
      <CornerBracket position={[hw - 0.05, hh - 0.05, 0.003]} rotation={[0, 0, Math.PI / 2]} />
      <CornerBracket position={[hw - 0.05, -hh + 0.05, 0.003]} rotation={[0, 0, Math.PI]} />
      <CornerBracket position={[-hw + 0.05, -hh + 0.05, 0.003]} rotation={[0, 0, -Math.PI / 2]} />

      {/* Scanline beam */}
      <ScanlineBeam width={L.SCREEN_W} height={L.SCREEN_H} />

      {/* Static scanline overlay */}
      <mesh geometry={scanGeo} position={[0, 0, 0.006]}>
        <meshBasicMaterial color={C.bg} transparent opacity={0.03} />
      </mesh>

      {/* Section content */}
      <group position={[0, 0, 0.02]}>
        <GlitchTransition sectionKey={activeSection}>
          <ActiveSectionComponent />
        </GlitchTransition>
      </group>
    </group>
  );
}

export default HolographicScreen;
