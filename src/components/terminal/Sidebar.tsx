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

/* ============================================================
   CircuitLine — vertical connecting line between sidebar items
   ============================================================ */
function CircuitLine() {
  const totalHeight = (ALL_SECTIONS.length - 1) * ITEM_SPACING;
  const startY = CENTER_Y + totalHeight / 2;
  const endY = CENTER_Y - totalHeight / 2;

  const points = useMemo(() => [
    new THREE.Vector3(SIDEBAR_X + ITEM_SIZE / 2 + 0.08, startY, -2),
    new THREE.Vector3(SIDEBAR_X + ITEM_SIZE / 2 + 0.08, endY, -2),
  ], []);
  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  // Animated pulse traveling down the line
  const pulseRef = useRef<THREE.Mesh>(null);
  const pulseGeo = useMemo(() => new THREE.PlaneGeometry(0.06, 0.15), []);

  useFrame((state) => {
    if (!pulseRef.current) return;
    const t = state.clock.elapsedTime;
    // Pulse moves from top to bottom every ~3 seconds
    const normalized = (t * 0.35) % 1.0;
    pulseRef.current.position.y = startY - normalized * totalHeight;
  });

  return (
    <group>
      {/* Static vertical line */}
      <line geometry={geo}>
        <lineBasicMaterial color={C.muted} transparent opacity={0.25} />
      </line>

      {/* Traveling pulse dot */}
      <mesh ref={pulseRef} position={[SIDEBAR_X + ITEM_SIZE / 2 + 0.08, startY, -1.99]} geometry={pulseGeo}>
        <meshBasicMaterial
          color={C.cyan}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

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
  const iconRef = useRef<THREE.Mesh>(null);
  const setActiveSection = useTerminalStore((s) => s.setActiveSection);
  const isTransitioning = useTerminalStore((s) => s.isTransitioning);

  const y = CENTER_Y - index * ITEM_SPACING + ((ALL_SECTIONS.length - 1) * ITEM_SPACING) / 2;

  // 3D box geometry (thin box for depth)
  const iconGeo = useMemo(() => new THREE.BoxGeometry(ITEM_SIZE, ITEM_SIZE, 0.04), []);
  const iconEdgeGeo = useMemo(() => new THREE.EdgesGeometry(iconGeo), [iconGeo]);

  const iconMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: isActive ? C.cyan : '#0a1525',
      transparent: true,
      opacity: isActive ? 0.3 : 0.6,
    });
  }, [isActive]);

  const borderMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: isActive ? C.cyan : C.muted,
      transparent: true,
      opacity: isActive ? 1.0 : 0.25,
    });
  }, [isActive]);

  // Floating animation + active pulse
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const offset = index * 0.3;

    // Float
    groupRef.current.position.y = y + Math.sin(t * 1.2 + offset) * 0.02;

    // Active item pulse — scale breathing
    if (isActive && iconRef.current) {
      const pulse = 1.0 + Math.sin(t * 3.0) * 0.04;
      iconRef.current.scale.set(pulse, pulse, 1);
    } else if (iconRef.current) {
      iconRef.current.scale.set(1, 1, 1);
    }
  });

  const handleClick = useCallback(() => {
    if (isTransitioning) return;
    setActiveSection(sectionId);
  }, [sectionId, isTransitioning, setActiveSection]);

  const iconChar = SECTION_ICONS[sectionId];
  const label = SECTION_DISPLAY_NAMES[sectionId];
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
      {/* 3D box icon */}
      <mesh ref={iconRef} geometry={iconGeo} material={iconMaterial} />
      <lineSegments geometry={iconEdgeGeo} material={borderMaterial} />

      {/* Glow halo for active item */}
      {isActive && (
        <mesh geometry={iconGeo} position={[0, 0, -0.01]}>
          <meshBasicMaterial
            color={C.cyan}
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Icon text */}
      <Text
        position={[0, 0, 0.03]}
        fontSize={isActive ? 0.2 : 0.16}
        color={isActive ? C.cyan : C.muted}
        anchorX="center"
        anchorY="middle"
      >
        {iconChar}
      </Text>

      {/* Label text */}
      <Text
        position={[ITEM_SIZE / 2 + 0.15, 0, 0.03]}
        fontSize={isActive ? 0.09 : 0.08}
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
      <CircuitLine />
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
