'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Line } from '@react-three/drei';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PARTICLE_COUNT = 200;
const CONNECTION_DISTANCE = 1.8;
const MAX_CONNECTIONS = 30;
const PARTICLE_SIZE = 2.5;
const FLOAT_SPEED = 0.15;
const FLOAT_AMPLITUDE = 0.3;
const WIREFRAME_OPACITY = 0.08;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ParticleData {
  positions: Float32Array;
  basePositions: Float32Array;
  velocities: number[];
}

// ---------------------------------------------------------------------------
// Particles – rendered as a single Points object
// ---------------------------------------------------------------------------

const Particles = React.memo(function Particles() {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate stable random positions once
  const particleData = useMemo<ParticleData>(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const basePositions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities: number[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 12;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 8;
      const idx = i * 3;

      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;

      basePositions[idx] = x;
      basePositions[idx + 1] = y;
      basePositions[idx + 2] = z;

      velocities.push(Math.random() * Math.PI * 2);
    }

    return { positions, basePositions, velocities };
  }, []);

  // Custom shader material for round, soft particles
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: PARTICLE_SIZE * window.devicePixelRatio },
      },
      vertexShader: /* glsl */ `
        attribute float aOpacity;
        varying float vOpacity;
        uniform float uTime;
        uniform float uSize;

        void main() {
          vOpacity = aOpacity;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = uSize * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vOpacity;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          float alpha = smoothstep(0.5, 0.1, dist) * vOpacity;

          // Cyan-white mix
          vec3 cyan = vec3(0.5, 0.95, 1.0);
          vec3 white = vec3(1.0);
          vec3 color = mix(cyan, white, smoothstep(0.3, 0.0, dist));

          gl_FragColor = vec4(color, alpha * 0.7);
        }
      `,
    });
  }, []);

  // Build geometry once
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(particleData.positions, 3));

    // Per-particle opacity for visual variety
    const opacities = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      opacities[i] = 0.3 + Math.random() * 0.7;
    }
    geo.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));

    return geo;
  }, [particleData.positions]);

  // Animate floating
  useFrame(({ clock }) => {
    if (!pointsRef.current) return;

    const t = clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.getAttribute('position');
    if (!posAttr) return;

    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      const phase = particleData.velocities[i];
      arr[idx] = particleData.basePositions[idx];
      arr[idx + 1] =
        particleData.basePositions[idx + 1] +
        Math.sin(t * FLOAT_SPEED + phase) * FLOAT_AMPLITUDE;
      arr[idx + 2] = particleData.basePositions[idx + 2];
    }

    posAttr.needsUpdate = true;
  });

  // Cleanup material on unmount
  useEffect(() => {
    return () => {
      material.dispose();
      geometry.dispose();
    };
  }, [material, geometry]);

  return <points ref={pointsRef} geometry={geometry} material={material} />;
});

// ---------------------------------------------------------------------------
// ParticleConnections – lines between nearby particles
// ---------------------------------------------------------------------------

const ParticleConnections = React.memo(function ParticleConnections() {
  const groupRef = useRef<THREE.Group>(null);

  // Stable base positions (shared concept with Particles)
  const basePositions = useMemo(() => {
    const pos: [number, number, number][] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos.push([
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
      ]);
    }
    return pos;
  }, []);

  // Pre-compute which connections to show (fixed pairs)
  const connections = useMemo(() => {
    const pairs: [number, number][] = [];
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

    // Sort by distance ascending and take the closest MAX_CONNECTIONS
    dists.sort((a, b) => a.d - b.d);
    for (let k = 0; k < Math.min(MAX_CONNECTIONS, dists.length); k++) {
      pairs.push([dists[k].a, dists[k].b]);
    }

    return pairs;
  }, [basePositions]);

  // Animate line endpoints to follow particle float
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const children = groupRef.current.children;

    for (let c = 0; c < children.length; c++) {
      const line = children[c] as THREE.Line;
      const posAttr = line.geometry.getAttribute('position');
      if (!posAttr) continue;

      const [a, b] = connections[c];
      const phaseA = (a / PARTICLE_COUNT) * Math.PI * 2;
      const phaseB = (b / PARTICLE_COUNT) * Math.PI * 2;

      const arr = posAttr.array as Float32Array;
      arr[0] = basePositions[a][0];
      arr[1] = basePositions[a][1] + Math.sin(t * FLOAT_SPEED + phaseA) * FLOAT_AMPLITUDE;
      arr[2] = basePositions[a][2];
      arr[3] = basePositions[b][0];
      arr[4] = basePositions[b][1] + Math.sin(t * FLOAT_SPEED + phaseB) * FLOAT_AMPLITUDE;
      arr[5] = basePositions[b][2];

      posAttr.needsUpdate = true;
    }
  });

  // Build geometries for lines
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

  return (
    <group ref={groupRef}>
      {lineGeometries.map((geo, i) => (
        <primitive key={i} object={new THREE.Line(geo, new THREE.LineBasicMaterial({
          color: new THREE.Color(0x66ddee),
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
// Floating wireframe geometry
// ---------------------------------------------------------------------------

interface WireframeProps {
  position: [number, number, number];
  rotationSpeed: [number, number, number];
  geometry: 'icosahedron' | 'torus' | 'octahedron';
  scale?: number;
}

const WireframeShape = React.memo(function WireframeShape({
  position,
  rotationSpeed,
  geometry,
  scale = 1,
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

    // Gentle bobbing
    meshRef.current.position.y =
      position[1] + Math.sin(t * 0.1 + position[0]) * 0.3;
  });

  useEffect(() => {
    return () => {
      geo.dispose();
    };
  }, [geo]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      geometry={geo}
    >
      <meshBasicMaterial
        color="#55ccdd"
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
// Scene – everything inside the Canvas
// ---------------------------------------------------------------------------

const Scene = React.memo(function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />

      {/* Particles */}
      <Particles />

      {/* Connections */}
      <ParticleConnections />

      {/* Floating wireframes */}
      <WireframeShape
        geometry="icosahedron"
        position={[-3.5, 1.5, -2]}
        rotationSpeed={[0.03, 0.05, 0.01]}
        scale={1.2}
      />
      <WireframeShape
        geometry="torus"
        position={[3, -1, -1.5]}
        rotationSpeed={[0.02, 0.04, 0.015]}
        scale={1.4}
      />
      <WireframeShape
        geometry="octahedron"
        position={[0, 2.5, -3]}
        rotationSpeed={[0.025, 0.03, 0.02]}
        scale={0.9}
      />
    </>
  );
});

// ---------------------------------------------------------------------------
// ParticleField – main exported component
// ---------------------------------------------------------------------------

const ParticleField = React.memo(function ParticleField() {
  return (
    <div
      className="fixed inset-0 z-0"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
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
        <Scene />
      </Canvas>
    </div>
  );
});

export default ParticleField;
