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

  const ITEM_SPACING = 0.72;
  const TOTAL_ITEMS = 10;
  const START_Y = ((TOTAL_ITEMS - 1) * ITEM_SPACING) / 2;

  useFrame((state) => {
    if (itemRef.current) {
      itemRef.current.position.y = -index * ITEM_SPACING + START_Y + Math.sin(state.clock.elapsedTime * 0.8 + floatOffset) * 0.03;
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
      position={[-8, -index * 0.72 + 3.24, 0]}
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
        position={[0.6, 0, 0]}
        center
        distanceFactor={8}
        transform
        style={{ fontFamily: "'Geist Mono', monospace" }}
        zIndexRange={[0, 0]}
      >
        <div
          style={{
            fontSize: 9,
            whiteSpace: 'nowrap',
            letterSpacing: 0.5,
            cursor: 'pointer',
            userSelect: 'none',
            pointerEvents: 'auto',
            color: isActive ? '#00F0FF' : '#4A6B7C',
            transition: 'color 0.3s ease',
            textShadow: isActive ? '0 0 8px rgba(0, 240, 255, 0.3)' : 'none',
          }}
          onClick={handleClick}
        >
          {SECTION_ICONS[section]} {SECTION_DISPLAY_NAMES[section].replace(/_/g, ' ')}
        </div>
      </Html>
    </group>
  );
}

function Sidebar() {
  const sidebarRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (sidebarRef.current) {
      sidebarRef.current.position.x = -8 + Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  return (
    <group ref={sidebarRef} position={[-8, 3.24, 0]}>
      {ALL_SECTIONS.map((section, index) => (
        <SidebarItem key={section} section={section} index={index} />
      ))}
    </group>
  );
}

export default Sidebar;
