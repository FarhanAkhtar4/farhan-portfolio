'use client';

import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PARTICLE_COUNT = 300;
const CONNECTION_DISTANCE = 1.6;
const MAX_CONNECTIONS = 50;
const PARTICLE_SIZE = 2.8;
const FLOAT_SPEED = 0.15;
const FLOAT_AMPLITUDE = 0.3;
const WIREFRAME_OPACITY = 0.07;
const MOUSE_INFLUENCE_RADIUS = 3.0;
const MOUSE_INFLUENCE_STRENGTH = 0.6;

// Color palette: cyan, purple, emerald
const PARTICLE_COLORS = [
  new THREE.Color(0x22d3ee),  // cyan
  new THREE.Color(0xa855f7),  // purple
  new THREE.Color(0x34d399),  // emerald
  new THREE.Color(0x67e8f9),  // lighter cyan
  new THREE.Color(0xc084fc),  // lighter purple
];

// ---------------------------------------------------------------------------
// Mouse context — share normalized mouse position
// ---------------------------------------------------------------------------

const mousePos = { x: 0, y: 0 };

function useMouseTracker() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ParticleData {
  positions: Float32Array;
  basePositions: Float32Array;
  velocities: number[];
  colorIndices: number[];
}

// ---------------------------------------------------------------------------
// Particles – rendered as a single Points object with mouse reactivity
// ---------------------------------------------------------------------------

const Particles = React.memo(function Particles() {
  const pointsRef = useRef<THREE.Points>(null);

  const particleData = useMemo<ParticleData>(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const basePositions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities: number[] = [];
    const colorIndices: number[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 14;
      const z = (Math.random() - 0.5) * 8;
      const idx = i * 3;

      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;

      basePositions[idx] = x;
      basePositions[idx + 1] = y;
      basePositions[idx + 2] = z;

      velocities.push(Math.random() * Math.PI * 2);
      colorIndices.push(Math.floor(Math.random() * PARTICLE_COLORS.length));
    }

    return { positions, basePositions, velocities, colorIndices };
  }, []);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: PARTICLE_SIZE * Math.min(window.devicePixelRatio, 1) },
      },
      vertexShader: /* glsl */ `
        attribute float aOpacity;
        attribute vec3 aColor;
        varying float vOpacity;
        varying vec3 vColor;
        uniform float uTime;
        uniform float uSize;

        void main() {
          vOpacity = aOpacity;
          vColor = aColor;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = uSize * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vOpacity;
        varying vec3 vColor;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          float alpha = smoothstep(0.5, 0.05, dist) * vOpacity;
          vec3 white = vec3(1.0);
          vec3 color = mix(vColor, white, smoothstep(0.3, 0.0, dist));

          gl_FragColor = vec4(color, alpha * 0.65);
        }
      `,
    });
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(particleData.positions, 3));

    const opacities = new Float32Array(PARTICLE_COUNT);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      opacities[i] = 0.3 + Math.random() * 0.7;
      const color = PARTICLE_COLORS[particleData.colorIndices[i]];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    geo.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

    return geo;
  }, [particleData]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;

    const t = clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.getAttribute('position');
    if (!posAttr) return;

    const arr = posAttr.array as Float32Array;
    const mx = mousePos.x * 7; // Scale mouse to world space
    const my = mousePos.y * 7;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      const phase = particleData.velocities[i];

      // Base floating position
      let x = particleData.basePositions[idx];
      let y = particleData.basePositions[idx + 1] + Math.sin(t * FLOAT_SPEED + phase) * FLOAT_AMPLITUDE;
      let z = particleData.basePositions[idx + 2];

      // Mouse repulsion
      const dx = x - mx;
      const dy = y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_INFLUENCE_RADIUS && dist > 0.01) {
        const force = (1 - dist / MOUSE_INFLUENCE_RADIUS) * MOUSE_INFLUENCE_STRENGTH;
        x += (dx / dist) * force;
        y += (dy / dist) * force;
        z += Math.sin(t * 2 + phase) * force * 0.3;
      }

      arr[idx] = x;
      arr[idx + 1] = y;
      arr[idx + 2] = z;
    }

    posAttr.needsUpdate = true;
  });

  useEffect(() => {
    return () => {
      material.dispose();
      geometry.dispose();
    };
  }, [material, geometry]);

  return <points ref={pointsRef} geometry={geometry} material={material} />;
});

// ---------------------------------------------------------------------------
// ParticleConnections – gradient opacity lines between nearby particles
// ---------------------------------------------------------------------------

const ParticleConnections = React.memo(function ParticleConnections() {
  const groupRef = useRef<THREE.Group>(null);

  const basePositions = useMemo(() => {
    const pos: [number, number, number][] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos.push([
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8,
      ]);
    }
    return pos;
  }, []);

  const connections = useMemo(() => {
    const pairs: [number, number, number][] = [];
    const dists: { a: number; b: number; d: number }[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = basePositions[i][0] - basePositions[j][0];
        const dy = basePositions[i][1] - basePositions[j][1];
        const dz = basePositions[i][2] - basePositions[j][2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < CONNECTION_DISTANCE) {
          dists.push({ a: i, b: j, d });
        }
      }
    }

    dists.sort((a, b) => a.d - b.d);
    for (let k = 0; k < Math.min(MAX_CONNECTIONS, dists.length); k++) {
      pairs.push([dists[k].a, dists[k].b, dists[k].d]);
    }

    return pairs;
  }, [basePositions]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const children = groupRef.current.children;
    const mx = mousePos.x * 7;
    const my = mousePos.y * 7;

    for (let c = 0; c < children.length; c++) {
      const line = children[c] as THREE.Line;
      const posAttr = line.geometry.getAttribute('position');
      if (!posAttr) continue;

      const [a, b, origDist] = connections[c];
      const phaseA = (a / PARTICLE_COUNT) * Math.PI * 2;
      const phaseB = (b / PARTICLE_COUNT) * Math.PI * 2;

      let ax = basePositions[a][0];
      let ay = basePositions[a][1] + Math.sin(t * FLOAT_SPEED + phaseA) * FLOAT_AMPLITUDE;
      let az = basePositions[a][2];
      let bx = basePositions[b][0];
      let by = basePositions[b][1] + Math.sin(t * FLOAT_SPEED + phaseB) * FLOAT_AMPLITUDE;
      let bz = basePositions[b][2];

      // Mouse influence on connection endpoints
      [
        { x: ax, y: ay, i: a, phase: phaseA },
        { x: bx, y: by, i: b, phase: phaseB },
      ].forEach((p) => {
        const ddx = p.x - mx;
        const ddy = p.y - my;
        const dd = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dd < MOUSE_INFLUENCE_RADIUS && dd > 0.01) {
          const force = (1 - dd / MOUSE_INFLUENCE_RADIUS) * MOUSE_INFLUENCE_STRENGTH * 0.5;
          if (p.i === a) {
            ax += (ddx / dd) * force;
            ay += (ddy / dd) * force;
          } else {
            bx += (ddx / dd) * force;
            by += (ddy / dd) * force;
          }
        }
      });

      const arr = posAttr.array as Float32Array;
      arr[0] = ax; arr[1] = ay; arr[2] = az;
      arr[3] = bx; arr[4] = by; arr[5] = bz;

      posAttr.needsUpdate = true;

      // Gradient opacity based on distance
      const lineMat = line.material as THREE.LineBasicMaterial;
      const normalizedDist = origDist / CONNECTION_DISTANCE;
      lineMat.opacity = 0.18 * (1 - normalizedDist * 0.7);
    }
  });

  const lineGeometries = useMemo(() => {
    return connections.map(([a, b]) => {
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array([
        basePositions[a][0], basePositions[a][1], basePositions[a][2],
        basePositions[b][0], basePositions[b][1], basePositions[b][2],
      ]);
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      return geo;
    });
  }, [connections, basePositions]);

  // Mixed colors for connections
  const connectionColors = useMemo(() => {
    return [
      new THREE.Color(0x66ddee),
      new THREE.Color(0x8866dd),
      new THREE.Color(0x44bb88),
    ];
  }, []);

  return (
    <group ref={groupRef}>
      {lineGeometries.map((geo, i) => (
        <primitive key={i} object={new THREE.Line(geo, new THREE.LineBasicMaterial({
          color: connectionColors[i % connectionColors.length],
          transparent: true,
          opacity: 0.12,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }))} />
      ))}
    </group>
  );
});

// ---------------------------------------------------------------------------
// Floating wireframe geometry — expanded with dodecahedron and torus knot
// ---------------------------------------------------------------------------

interface WireframeProps {
  position: [number, number, number];
  rotationSpeed: [number, number, number];
  geometry: 'icosahedron' | 'torus' | 'octahedron' | 'dodecahedron' | 'torusKnot';
  scale?: number;
  color?: string;
}

const WireframeShape = React.memo(function WireframeShape({
  position,
  rotationSpeed,
  geometry,
  scale = 1,
  color = '#55ccdd',
}: WireframeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geo = useMemo(() => {
    switch (geometry) {
      case 'icosahedron':
        return new THREE.IcosahedronGeometry(1, 1);
      case 'torus':
        return new THREE.TorusGeometry(1, 0.35, 8, 16);
      case 'octahedron':
        return new THREE.OctahedronGeometry(1, 0);
      case 'dodecahedron':
        return new THREE.DodecahedronGeometry(1, 0);
      case 'torusKnot':
        return new THREE.TorusKnotGeometry(0.8, 0.25, 48, 8, 2, 3);
      default:
        return new THREE.IcosahedronGeometry(1, 1);
    }
  }, [geometry]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.x = t * rotationSpeed[0];
    meshRef.current.rotation.y = t * rotationSpeed[1];
    meshRef.current.rotation.z = t * rotationSpeed[2];
    meshRef.current.position.y = position[1] + Math.sin(t * 0.1 + position[0]) * 0.3;
  });

  useEffect(() => {
    return () => { geo.dispose(); };
  }, [geo]);

  return (
    <mesh ref={meshRef} position={position} scale={scale} geometry={geo}>
      <meshBasicMaterial
        color={color}
        wireframe
        transparent
        opacity={WIREFRAME_OPACITY}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
});

// ---------------------------------------------------------------------------
// Camera rig — parallax rotation based on mouse position
// ---------------------------------------------------------------------------

const CameraRig = React.memo(function CameraRig() {
  const { camera } = useThree();

  useFrame(() => {
    // Subtle parallax rotation based on mouse X
    const targetRotY = mousePos.x * 0.08;
    const targetRotX = -mousePos.y * 0.04;

    camera.rotation.y += (targetRotY - camera.rotation.y) * 0.02;
    camera.rotation.x += (targetRotX - camera.rotation.x) * 0.02;
  });

  return null;
});

// ---------------------------------------------------------------------------
// Scene – everything inside the Canvas
// ---------------------------------------------------------------------------

const Scene = React.memo(function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />

      {/* Camera parallax */}
      <CameraRig />

      {/* Particles */}
      <Particles />

      {/* Connections */}
      <ParticleConnections />

      {/* Floating wireframes — original 3 */}
      <WireframeShape
        geometry="icosahedron"
        position={[-4, 1.8, -2]}
        rotationSpeed={[0.03, 0.05, 0.01]}
        scale={1.3}
        color="#22d3ee"
      />
      <WireframeShape
        geometry="torus"
        position={[3.5, -1.2, -1.5]}
        rotationSpeed={[0.02, 0.04, 0.015]}
        scale={1.5}
        color="#a855f7"
      />
      <WireframeShape
        geometry="octahedron"
        position={[0.5, 3, -3]}
        rotationSpeed={[0.025, 0.03, 0.02]}
        scale={1.0}
        color="#34d399"
      />

      {/* New wireframes — dodecahedron and torus knot */}
      <WireframeShape
        geometry="dodecahedron"
        position={[-5, -2.5, -3.5]}
        rotationSpeed={[0.015, 0.025, 0.01]}
        scale={0.8}
        color="#c084fc"
      />
      <WireframeShape
        geometry="torusKnot"
        position={[5.5, 2.5, -4]}
        rotationSpeed={[0.01, 0.02, 0.008]}
        scale={0.7}
        color="#67e8f9"
      />

      {/* Post-processing bloom */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={0.6}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
});

// ---------------------------------------------------------------------------
// ParticleField – main exported component
// ---------------------------------------------------------------------------

const ParticleField = React.memo(function ParticleField() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="fixed inset-0 z-0"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      {mounted && (
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          dpr={1}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: 'low-power',
          }}
          style={{ background: 'transparent' }}
          frameloop="always"
        >
          <MouseTracker />
          <Scene />
        </Canvas>
      )}
    </div>
  );
});

function MouseTracker() {
  useMouseTracker();
  return null;
}

export default ParticleField;
