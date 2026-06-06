'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  useTerminalStore,
  ALL_SECTIONS,
  SECTION_DISPLAY_NAMES,
  SECTION_ICONS,
  type SectionId,
} from '@/store/terminal-store';

interface SidebarItemProps {
  section: SectionId;
  index: number;
}

function SidebarItem({ section, index }: SidebarItemProps) {
  const { activeSection, setActiveSection } = useTerminalStore();
  const isActive = activeSection === section;
  const itemRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  // Subtle floating animation offset per item
  const floatOffset = useMemo(() => index * 0.3, [index]);

  useFrame((state) => {
    if (itemRef.current) {
      itemRef.current.position.y = -index * 1.1 + Math.sin(state.clock.elapsedTime * 0.8 + floatOffset) * 0.03;
    }
  });

  // Glow effect on hover/active
  const glowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: isActive ? new THREE.Color('#00F0FF') : new THREE.Color('#4A6B7C'),
      transparent: true,
      opacity: isActive ? 0.3 : 0.08,
    });
  }, [isActive]);

  const borderMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: isActive ? new THREE.Color('#00F0FF') : new THREE.Color('#4A6B7C'),
      transparent: true,
      opacity: isActive ? 0.5 : 0.15,
    });
  }, [isActive]);

  const iconGeometry = useMemo(() => new THREE.PlaneGeometry(0.5, 0.5), []);
  const edgeGeometry = useMemo(() => new THREE.EdgesGeometry(new THREE.PlaneGeometry(0.5, 0.5)), []);

  const handleClick = () => {
    setActiveSection(section);
  };

  return (
    <group
      ref={itemRef}
      position={[-10, -index * 1.1 + 3.5, 0]}
    >
      {/* Icon background plane */}
      <mesh
        ref={meshRef}
        geometry={iconGeometry}
        material={glowMaterial}
        onClick={handleClick}
      />

      {/* Icon border */}
      <lineSegments geometry={edgeGeometry} material={borderMaterial} />

      {/* Label */}
      <Html
        position={[0, -0.5, 0]}
        center
        distanceFactor={8}
        transform
        style={{ fontFamily: "'Geist Mono', monospace" }}
        zIndexRange={[0, 0]}
      >
        <div
          className={`sidebar-label ${isActive ? 'active' : ''}`}
          style={{
            fontSize: 8,
            whiteSpace: 'nowrap',
            letterSpacing: 0.5,
            cursor: 'pointer',
            userSelect: 'none',
            pointerEvents: 'auto',
          }}
          onClick={handleClick}
        >
          {SECTION_DISPLAY_NAMES[section].replace(/_/g, ' ')}
        </div>
      </Html>

      {/* Icon character */}
      <Html
        position={[0, 0, 0.01]}
        center
        distanceFactor={8}
        transform
        style={{ fontFamily: "'Geist Mono', monospace" }}
        zIndexRange={[0, 0]}
      >
        <div
          style={{
            fontSize: 16,
            textAlign: 'center',
            color: isActive ? '#00F0FF' : '#4A6B7C',
            cursor: 'pointer',
            userSelect: 'none',
            pointerEvents: 'auto',
            transition: 'color 0.3s ease',
            textShadow: isActive ? '0 0 10px rgba(0, 240, 255, 0.5)' : 'none',
          }}
          onClick={handleClick}
        >
          {SECTION_ICONS[section]}
        </div>
      </Html>
    </group>
  );
}

function Sidebar() {
  const sidebarRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (sidebarRef.current) {
      sidebarRef.current.position.x = -10 + Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  return (
    <group ref={sidebarRef} position={[-10, 3.5, 0]}>
      {ALL_SECTIONS.map((section, index) => (
        <SidebarItem key={section} section={section} index={index} />
      ))}
    </group>
  );
}

export default Sidebar;
