'use client';

import { useRef, useMemo, type ReactNode } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

/* ============================================================
   FARHAN AI MATRIX TERMINAL — Shared 3D UI Primitives
   ALL rendering uses R3F <Text> + <mesh> — NO <Html> divs.
   ============================================================ */

// ── Color Palette ──────────────────────────────────────────
export const C = {
  bg:        '#030712',
  screenBg:  '#0a1525',
  cyan:      '#00F0FF',
  violet:    '#A855F7',
  text:      '#E0F7FA',
  muted:     '#4A6B7C',
  dim:       '#7a9aaa',
  warning:   '#F59E0B',
  success:   '#10B981',
} as const;

// ── Layout Constants (content area on the holographic screen) ──
export const L = {
  SCREEN_W:     14,
  SCREEN_H:     8,
  LEFT:         -6.2,      // content left edge X
  RIGHT:         6.2,      // content right edge X
  TOP:           3.3,      // first content line Y
  LINE:         -0.24,     // line spacing decrement
  CARD_W:       5.8,      // card width
  CARD_H:        1.15,    // card height
  CARD_GAP:      0.15,    // gap between cards
} as const;

// ── Shared geometries (memoised per component) ────────────
const cardGeo = new THREE.PlaneGeometry(L.CARD_W, L.CARD_H);
const cardEdge = new THREE.EdgesGeometry(cardGeo);
const metricGeo = new THREE.PlaneGeometry(2.8, 0.85);
const metricEdge = new THREE.EdgesGeometry(metricGeo);
const sepGeo = new THREE.PlaneGeometry(12, 0.008);

/* ============================================================
   T — Positioned Text (single line)
   ============================================================ */
export interface TProps {
  text: string;
  position: [number, number, number];
  color?: string;
  size?: number;
  anchor?: 'left' | 'center' | 'right';
  maxWidth?: number;
  bold?: boolean;
  children?: ReactNode;
}

export function T({ text, position, color = C.text, size = 0.1, anchor = 'left', maxWidth, bold, children }: TProps) {
  return (
    <Text
      position={position}
      fontSize={size}
      color={color}
      anchorX={anchor}
      maxWidth={maxWidth}
      font={undefined}
      fillOpacity={1}
      {...(bold ? { fontWeight: 700 } : {})}
    >
      {text}
      {children}
    </Text>
  );
}

/* ============================================================
   MultiT — Multi-line text block (auto-wrapped)
   ============================================================ */
export interface MultiTProps {
  lines: { text: string; color?: string; size?: number; spacing?: number }[];
  startX: number;
  startY: number;
  anchor?: 'left' | 'center' | 'right';
}

export function MultiT({ lines, startX, startY, anchor = 'left' }: MultiTProps) {
  // Pre-compute Y positions using reduce to avoid mutation in render
  const lineData = lines.reduce<{ y: number; text: string; color?: string; size?: number }[]>(
    (acc, line, i) => {
      const spacing = line.spacing ?? 0.22;
      const y = i === 0 ? startY : acc[i - 1].y - (lines[i - 1].spacing ?? 0.22);
      acc.push({ y, text: line.text, color: line.color, size: line.size });
      return acc;
    },
    []
  );

  return (
    <>
      {lineData.map((ld, i) => (
        <T
          key={i}
          text={ld.text}
          position={[startX, ld.y, 0.01]}
          color={ld.color ?? C.text}
          size={ld.size ?? 0.1}
          anchor={anchor}
          maxWidth={12}
        />
      ))}
    </>
  );
}

/* ============================================================
   DataRow — Label on left, value on right
   ============================================================ */
export function DataRow({ label, value, y, valueColor = C.cyan }: {
  label: string; value: string; y: number; valueColor?: string;
}) {
  return (
    <>
      <T text={label} position={[L.LEFT, y, 0.01]} color={C.muted} size={0.09} />
      <T text={value} position={[L.RIGHT, y, 0.01]} color={valueColor} size={0.1} anchor="right" />
    </>
  );
}

/* ============================================================
   Separator — Thin glowing line
   ============================================================ */
export function Separator({ y }: { y: number }) {
  return (
    <mesh position={[0, y, 0.005]} geometry={sepGeo}>
      <meshBasicMaterial color={C.cyan} transparent opacity={0.12} />
    </mesh>
  );
}

/* ============================================================
   Tag — Small badge text
   ============================================================ */
export function Tag({ text, x, y, color = C.cyan }: {
  text: string; x: number; y: number; color?: string;
}) {
  return <T text={text} position={[x, y, 0.01]} color={color} size={0.07} />;
}

/* ============================================================
   MetricBox — Labeled stat display
   ============================================================ */
export function MetricBox({ label, value, x, y, accent = false }: {
  label: string; value: string; x: number; y: number; accent?: boolean;
}) {
  const c = accent ? C.violet : C.cyan;
  return (
    <group position={[x, y, 0]}>
      <mesh geometry={metricGeo}>
        <meshBasicMaterial color="#0a1525" transparent opacity={0.85} />
      </mesh>
      <lineSegments geometry={metricEdge}>
        <lineBasicMaterial color={c} transparent opacity={0.2} />
      </lineSegments>
      <T text={value} position={[0, 0.12, 0.01]} color={c} size={0.15} anchor="center" bold />
      <T text={label} position={[0, -0.16, 0.01]} color={C.muted} size={0.07} anchor="center" />
    </group>
  );
}

/* ============================================================
   Card — Glassmorphic content card
   ============================================================ */
export function Card({ title, desc, x = 0, y = 0, w = L.CARD_W, h = L.CARD_H, accent = false }: {
  title: string; desc: string; x?: number; y?: number; w?: number; h?: number; accent?: boolean;
}) {
  const geo = useMemo(() => new THREE.PlaneGeometry(w, h), [w, h]);
  const edge = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);
  const c = accent ? C.violet : C.cyan;
  return (
    <group position={[x, y, 0]}>
      <mesh geometry={geo}>
        <meshBasicMaterial color="#0a1525" transparent opacity={0.85} />
      </mesh>
      <lineSegments geometry={edge}>
        <lineBasicMaterial color={c} transparent opacity={0.12} />
      </lineSegments>
      <T text={title} position={[0, h * 0.22, 0.01]} color={c} size={0.11} anchor="center" bold />
      <T text={desc} position={[0, -h * 0.08, 0.01]} color={C.dim} size={0.08} anchor="center" maxWidth={w - 0.6} />
    </group>
  );
}

/* ============================================================
   SectionHeader — Title + subtitle for each section
   ============================================================ */
export function SectionHeader({ title, subtitle, y = L.TOP }: {
  title: string; subtitle: string; y?: number;
}) {
  return (
    <>
      <T text={title} position={[L.LEFT, y, 0.01]} color={C.cyan} size={0.2} bold />
      <T text={subtitle} position={[L.LEFT, y + L.LINE, 0.01]} color={C.violet} size={0.11} />
    </>
  );
}

/* ============================================================
   Cursor — Blinking block cursor for terminal
   ============================================================ */
export function Cursor({ x, y }: { x: number; y: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.PlaneGeometry(0.1, 0.14), []);

  // Blink every 0.5s using a flag
  // We handle opacity via useFrame
  // Since meshBasicMaterial doesn't have a useFrame hook, we use a ref trick
  return (
    <mesh ref={ref} position={[x, y, 0.01]} geometry={geo}>
      <meshBasicMaterial color={C.cyan} transparent opacity={1} />
    </mesh>
  );
}

/* ============================================================
   PlaceholderImage — Gray plane with "PLACEHOLDER" text
   ============================================================ */
export function PlaceholderImage({ x, y, w = 4, h = 2.5, label = 'SCREENSHOT PLACEHOLDER' }: {
  x: number; y: number; w?: number; h?: number; label?: string;
}) {
  const geo = useMemo(() => new THREE.PlaneGeometry(w, h), [w, h]);
  return (
    <group position={[x, y, 0]}>
      <mesh geometry={geo}>
        <meshBasicMaterial color="#1a1a2e" transparent opacity={0.9} />
      </mesh>
      <lineSegments geometry={useMemo(() => new THREE.EdgesGeometry(geo), [geo])}>
        <lineBasicMaterial color={C.muted} transparent opacity={0.2} />
      </lineSegments>
      <T text={label} position={[0, 0, 0.01]} color={C.muted} size={0.1} anchor="center" />
    </group>
  );
}
