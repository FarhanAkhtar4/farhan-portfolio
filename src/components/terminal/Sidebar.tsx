'use client';

import { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import {
  useTerminalStore,
  ALL_SECTIONS,
  SECTION_DISPLAY_NAMES,
  SECTION_ICONS,
  type SectionId,
} from '@/store/terminal-store';
import { C } from './TerminalUI';

const ITEM_SIZE = 0.45;
const ITEM_SPACING = 0.7;
const SIDEBAR_X = -7.8;
const CENTER_Y = 2.5;

function SidebarItem({
  sectionId,
  index,
  isActive,
}: {
  sectionId: SectionId;
  index: number;
  isActive: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const setActiveSection = useTerminalStore((s) => s.setActiveSection);
  const isTransitioning = useTerminalStore((s) => s.isTransitioning);

  const y = CENTER_Y - index * ITEM_SPACING + ((ALL_SECTIONS.length - 1) * ITEM_SPACING) / 2;

  // Icon plane geometry
  const iconGeo = useMemo(() => new THREE.PlaneGeometry(ITEM_SIZE, ITEM_SIZE), []);
  const iconEdgeGeo = useMemo(() => new THREE.EdgesGeometry(iconGeo), [iconGeo]);

  // Active material
  const iconMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: isActive ? C.cyan : '#0a1525',
      transparent: true,
      opacity: isActive ? 0.25 : 0.6,
    });
  }, [isActive]);

  const borderMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: isActive ? C.cyan : C.muted,
      transparent: true,
      opacity: isActive ? 0.6 : 0.15,
    });
  }, [isActive]);

  // Floating animation — subtle per-item offset
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const offset = index * 0.3;
    groupRef.current.position.y = y + Math.sin(t * 1.2 + offset) * 0.02;
  });

  const handleClick = useCallback(() => {
    if (isTransitioning) return;
    setActiveSection(sectionId);
  }, [sectionId, isTransitioning, setActiveSection]);

  const iconChar = SECTION_ICONS[sectionId];
  const label = SECTION_DISPLAY_NAMES[sectionId];

  // Format label with spaces between words (replace _ with spaces)
  const formattedLabel = label.replace(/_/g, ' ');

  return (
    <group
      ref={groupRef}
      position={[SIDEBAR_X, y, -2]}
      onClick={handleClick}
      onPointerOver={() => {
        if (groupRef.current) {
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* Icon plane */}
      <mesh geometry={iconGeo} material={iconMaterial} />
      <lineSegments geometry={iconEdgeGeo} material={borderMaterial} />

      {/* Icon text (Unicode glyph) */}
      <Text
        position={[0, 0, 0.01]}
        fontSize={isActive ? 0.2 : 0.16}
        color={isActive ? C.cyan : C.muted}
        anchorX="center"
        anchorY="middle"
      >
        {iconChar}
      </Text>

      {/* Label text — to the right */}
      <Text
        position={[ITEM_SIZE / 2 + 0.15, 0, 0.01]}
        fontSize={isActive ? 0.075 : 0.065}
        color={isActive ? C.cyan : C.muted}
        anchorX="left"
        anchorY="middle"
        maxWidth={2.2}
      >
        {formattedLabel}
      </Text>
    </group>
  );
}

function Sidebar() {
  const activeSection = useTerminalStore((s) => s.activeSection);

  return (
    <group>
      {ALL_SECTIONS.map((sectionId, index) => (
        <SidebarItem
          key={sectionId}
          sectionId={sectionId}
          index={index}
          isActive={activeSection === sectionId}
        />
      ))}
    </group>
  );
}

export default Sidebar;
