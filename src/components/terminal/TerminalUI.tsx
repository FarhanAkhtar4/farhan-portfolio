'use client';

import { useRef, useMemo, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
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
  muted:     '#6B9BAB',    // BRIGHTER — was #4A6B7C
  dim:       '#9BC8D8',    // BRIGHTER — was #7a9aaa
  warning:   '#F59E0B',
  success:   '#10B981',
} as const;

// ── Layout Constants (content area on the holographic screen) ──
export const L = {
  SCREEN_W:     14,
  SCREEN_H:     8,
  LEFT:         -6.2,
  RIGHT:         6.2,
  TOP:           3.3,
  LINE:         -0.24,
  CARD_W:       5.8,
  CARD_H:        1.15,
  CARD_GAP:      0.15,
} as const;

// ── Shared geometries (memoised per component) ────────────
const cardGeo = new THREE.BoxGeometry(L.CARD_W, L.CARD_H, 0.06);
const cardEdge = new THREE.EdgesGeometry(cardGeo);
const metricGeo = new THREE.BoxGeometry(2.8, 0.85, 0.04);
const metricEdge = new THREE.EdgesGeometry(metricGeo);
const sepGeo = new THREE.PlaneGeometry(12, 0.008);

/* ============================================================
   T — Positioned Text (single line) — sizes increased ~20%
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

export function T({ text, position, color = C.text, size = 0.12, anchor = 'left', maxWidth, bold, children }: TProps) {
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
  const lineData = lines.reduce<{ y: number; text: string; color?: string; size?: number }[]>(
    (acc, line, i) => {
      const spacing = line.spacing ?? 0.26;
      const y = i === 0 ? startY : acc[i - 1].y - (lines[i - 1].spacing ?? 0.26);
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
          size={ld.size ?? 0.12}
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
      <T text={label} position={[L.LEFT, y, 0.01]} color={C.muted} size={0.11} />
      <T text={value} position={[L.RIGHT, y, 0.01]} color={valueColor} size={0.12} anchor="right" />
    </>
  );
}

/* ============================================================
   Separator — Thin glowing line — BRIGHTER
   ============================================================ */
export function Separator({ y }: { y: number }) {
  return (
    <mesh position={[0, y, 0.005]} geometry={sepGeo}>
      <meshBasicMaterial color={C.cyan} transparent opacity={0.35} />
    </mesh>
  );
}

/* ============================================================
   Tag — Small badge text — slightly larger
   ============================================================ */
export function Tag({ text, x, y, color = C.cyan }: {
  text: string; x: number; y: number; color?: string;
}) {
  return <T text={text} position={[x, y, 0.01]} color={color} size={0.085} />;
}

/* ============================================================
   MetricBox3D — Labeled stat display with 3D box geometry, floating bob
   ============================================================ */
export function MetricBox({ label, value, x, y, accent = false }: {
  label: string; value: string; x: number; y: number; accent?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const c = accent ? C.violet : C.cyan;
  const borderOpacity = accent ? 0.6 : 0.4;

  // Individual floating bob
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = y + Math.sin(t * 1.5 + x * 2) * 0.025;
  });

  return (
    <group ref={groupRef} position={[x, y, 0]}>
      {/* 3D Box backing */}
      <mesh geometry={metricGeo}>
        <meshBasicMaterial color="#0a1525" transparent opacity={0.85} />
      </mesh>
      {/* Emissive edge glow — BRIGHTER */}
      <lineSegments geometry={metricEdge}>
        <lineBasicMaterial color={c} transparent opacity={borderOpacity} />
      </lineSegments>
      {/* Additive glow face overlay — always present, brighter for accent */}
      <mesh geometry={metricGeo} position={[0, 0, 0.021]}>
        <meshBasicMaterial
          color={c}
          transparent
          opacity={accent ? 0.06 : 0.03}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <T text={value} position={[0, 0.12, 0.03]} color={c} size={0.18} anchor="center" bold />
      <T text={label} position={[0, -0.16, 0.03]} color={C.muted} size={0.085} anchor="center" />
    </group>
  );
}

/* ============================================================
   Card3D — Glassmorphic content card with 3D box geometry — DRAMATIC GLOW
   ============================================================ */
export function Card({ title, desc, x = 0, y = 0, w = L.CARD_W, h = L.CARD_H, accent = false }: {
  title: string; desc: string; x?: number; y?: number; w?: number; h?: number; accent?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const geo = useMemo(() => new THREE.BoxGeometry(w, h, 0.06), [w, h]);
  const edge = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);
  const faceGeo = useMemo(() => new THREE.PlaneGeometry(w - 0.1, h - 0.1), [w, h]);
  const c = accent ? C.violet : C.cyan;
  const edgeOpacity = accent ? 0.5 : 0.4;

  // Subtle hover-like scale effect
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const breathe = 1.0 + Math.sin(t * 1.0 + x * 1.5) * 0.005;
    groupRef.current.scale.set(breathe, breathe, 1);
  });

  return (
    <group ref={groupRef} position={[x, y, 0]}>
      {/* 3D Box backing */}
      <mesh geometry={geo}>
        <meshBasicMaterial color="#0a1525" transparent opacity={0.85} />
      </mesh>
      {/* Emissive edge lines — MUCH BRIGHTER */}
      <lineSegments geometry={edge}>
        <lineBasicMaterial color={c} transparent opacity={edgeOpacity} />
      </lineSegments>
      {/* Additive glow face overlay on front */}
      <mesh geometry={faceGeo} position={[0, 0, 0.032]}>
        <meshBasicMaterial
          color={c}
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Additive glow backing */}
      <mesh geometry={geo} position={[0, 0, -0.001]}>
        <meshBasicMaterial
          color={c}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Top edge highlight — BRIGHTER */}
      <line geometry={useMemo(() => {
        const pts = [
          new THREE.Vector3(-w / 2, h / 2, 0.033),
          new THREE.Vector3(w / 2, h / 2, 0.033),
        ];
        return new THREE.BufferGeometry().setFromPoints(pts);
      }, [w, h])}>
        <lineBasicMaterial color={c} transparent opacity={0.6} />
      </line>
      <T text={title} position={[0, h * 0.22, 0.035]} color={c} size={0.13} anchor="center" bold />
      <T text={desc} position={[0, -h * 0.08, 0.035]} color={C.dim} size={0.1} anchor="center" maxWidth={w - 0.6} />
    </group>
  );
}

/* ============================================================
   SectionHeader — Title + subtitle with glow backing
   ============================================================ */
export function SectionHeader({ title, subtitle, y = L.TOP }: {
  title: string; subtitle: string; y?: number;
}) {
  const glowGeo = useMemo(() => new THREE.PlaneGeometry(8, 0.5), []);

  return (
    <>
      {/* Additive glow plane behind section header */}
      <mesh position={[L.LEFT + 4, y + 0.05, -0.005]} geometry={glowGeo}>
        <meshBasicMaterial
          color={C.cyan}
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <T text={title} position={[L.LEFT, y, 0.01]} color={C.cyan} size={0.24} bold />
      <T text={subtitle} position={[L.LEFT, y + L.LINE, 0.01]} color={C.violet} size={0.13} />
    </>
  );
}

/* ============================================================
   Cursor — Blinking block cursor for terminal
   ============================================================ */
export function Cursor({ x, y }: { x: number; y: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.PlaneGeometry(0.1, 0.14), []);

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
  const geo = useMemo(() => new THREE.BoxGeometry(w, h, 0.04), [w, h]);
  return (
    <group position={[x, y, 0]}>
      <mesh geometry={geo}>
        <meshBasicMaterial color="#1a1a2e" transparent opacity={0.9} />
      </mesh>
      <lineSegments geometry={useMemo(() => new THREE.EdgesGeometry(geo), [geo])}>
        <lineBasicMaterial color={C.muted} transparent opacity={0.3} />
      </lineSegments>
      <T text={label} position={[0, 0, 0.022]} color={C.muted} size={0.12} anchor="center" />
    </group>
  );
}

/* ============================================================
   Section3DVisual — Base class for section-specific 3D visuals
   Position moved closer to center for visibility
   ============================================================ */
export function Section3DVisual({ children, position = [4.5, 0, 0.8] as [number, number, number] }: {
  children: ReactNode;
  position?: [number, number, number];
}) {
  return (
    <group position={position}>
      {children}
    </group>
  );
}
