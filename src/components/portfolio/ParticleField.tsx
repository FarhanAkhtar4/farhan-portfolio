'use client';

import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

// ============================================================
// NEURAL NETWORK CONFIGURATION
// ============================================================

const LAYERS = [
  { neuronCount: 6, xPos: -5.5 },
  { neuronCount: 9, xPos: -1.8 },
  { neuronCount: 8, xPos: 1.8 },
  { neuronCount: 5, xPos: 5.5 },
];

const LAYER_COLORS = [
  new THREE.Color(0x22d3ee),  // cyan - input
  new THREE.Color(0xa855f7),  // purple - hidden 1
  new THREE.Color(0x8b5cf6),  // indigo - hidden 2
  new THREE.Color(0x34d399),  // emerald - output
];

const NEURON_SPREAD_Y = 4.5;
const NEURON_Z_OFFSET = 1.2;
const CONNECTION_PROBABILITY = 0.38;
const MAX_SIGNALS = 55;
const BG_PARTICLE_COUNT = 100;
const NEURON_POINT_SIZE = 18.0;
const SIGNAL_POINT_SIZE = 8.0;
const WAVE_INTERVAL = 3.5;
const WAVE_DURATION = 2.0;
const MOUSE_WORLD_RADIUS = 3.5;
const MOUSE_STRENGTH = 0.4;

// ============================================================
// SHARED MOUSE STATE
// ============================================================

const mousePos = { x: 0, y: 0 };

// ============================================================
// TYPES
// ============================================================

interface NeuronInfo {
  position: THREE.Vector3;
  layerIndex: number;
  indexInLayer: number;
  globalIndex: number;
  color: THREE.Color;
  phase: number;
}

interface SynapseInfo {
  from: number;
  to: number;
  weight: number;
}

interface SignalInfo {
  synapseIndex: number;
  progress: number;
  speed: number;
  active: boolean;
}

// ============================================================
// NETWORK GENERATION
// ============================================================

function generateNetwork(): { neurons: NeuronInfo[]; synapses: SynapseInfo[] } {
  const neurons: NeuronInfo[] = [];
  const synapses: SynapseInfo[] = [];
  let globalIdx = 0;

  LAYERS.forEach((layer, layerIdx) => {
    for (let i = 0; i < layer.neuronCount; i++) {
      const t = layer.neuronCount === 1 ? 0.5 : i / (layer.neuronCount - 1);
      const y = (t - 0.5) * NEURON_SPREAD_Y;
      const z = (Math.random() - 0.5) * NEURON_Z_OFFSET;

      neurons.push({
        position: new THREE.Vector3(layer.xPos, y, z),
        layerIndex: layerIdx,
        indexInLayer: i,
        globalIndex: globalIdx,
        color: LAYER_COLORS[layerIdx].clone(),
        phase: Math.random() * Math.PI * 2,
      });

      globalIdx++;
    }
  });

  // Create synapses between adjacent layers
  for (let li = 0; li < LAYERS.length - 1; li++) {
    const startA = LAYERS.slice(0, li).reduce((s, l) => s + l.neuronCount, 0);
    const startB = startA + LAYERS[li].neuronCount;

    for (let a = startA; a < startB; a++) {
      for (let b = startB; b < startB + LAYERS[li + 1].neuronCount; b++) {
        if (Math.random() < CONNECTION_PROBABILITY) {
          synapses.push({
            from: a,
            to: b,
            weight: 0.3 + Math.random() * 0.7,
          });
        }
      }
    }
  }

  return { neurons, synapses };
}

// ============================================================
// NEURON RENDERER - Glowing spheres rendered as Points
// ============================================================

const NeuronRenderer = React.memo(function NeuronRenderer({
  neurons,
  activationRef,
}: {
  neurons: NeuronInfo[];
  activationRef: React.MutableRefObject<Float32Array>;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = neurons.length;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const n = neurons[i];
      positions[i * 3] = n.position.x;
      positions[i * 3 + 1] = n.position.y;
      positions[i * 3 + 2] = n.position.z;
      colors[i * 3] = n.color.r;
      colors[i * 3 + 1] = n.color.g;
      colors[i * 3 + 2] = n.color.b;
      phases[i] = n.phase;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: NEURON_POINT_SIZE * Math.min(window.devicePixelRatio, 1.5) },
        uActivation: { value: new Float32Array(count) },
      },
      vertexShader: /* glsl */ `
        attribute vec3 aColor;
        attribute float aPhase;
        varying vec3 vColor;
        varying float vActivation;
        uniform float uTime;
        uniform float uSize;

        void main() {
          vColor = aColor;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = uSize * (250.0 / -gl_Position.z);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        varying float vActivation;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          // Bright core with soft halo
          float core = pow(smoothstep(0.5, 0.0, dist), 2.0);
          float halo = smoothstep(0.5, 0.12, dist) * 0.35;
          float ring = smoothstep(0.22, 0.18, dist) * smoothstep(0.14, 0.18, dist) * 0.3;

          vec3 brightColor = mix(vColor, vec3(1.0), core * 0.6);
          float brightness = (core * 1.8 + halo + ring) * (0.7 + vActivation * 0.6);
          float alpha = core * 0.9 + halo * 0.6 + ring * 0.4;

          gl_FragColor = vec4(brightColor * brightness, alpha);
        }
      `,
    });

    return { geometry: geo, material: mat };
  }, [neurons]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    material.uniforms.uTime.value = t;

    // Update activation uniform
    const actArr = material.uniforms.uActivation.value as Float32Array;
    for (let i = 0; i < neurons.length; i++) {
      const pulse = 0.35 + 0.25 * Math.sin(t * 1.8 + neurons[i].phase);
      actArr[i] = Math.min(1.0, activationRef.current[i] + pulse);
    }
    material.uniforms.uActivation.needsUpdate = true;

    // Subtle position breathing
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.getAttribute('position');
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < neurons.length; i++) {
        const n = neurons[i];
        arr[i * 3] = n.position.x + Math.sin(t * 0.3 + n.phase) * 0.05;
        arr[i * 3 + 1] = n.position.y + Math.sin(t * 0.4 + n.phase * 1.3) * 0.08;
        arr[i * 3 + 2] = n.position.z + Math.cos(t * 0.35 + n.phase * 0.7) * 0.06;
      }
      posAttr.needsUpdate = true;
    }
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <points ref={pointsRef} geometry={geometry} material={material} />;
});

// ============================================================
// SYNAPSE RENDERER - Lines between neurons
// ============================================================

const SynapseRenderer = React.memo(function SynapseRenderer({
  neurons,
  synapses,
  signalRef,
}: {
  neurons: NeuronInfo[];
  synapses: SynapseInfo[];
  signalRef: React.MutableRefObject<SignalInfo[]>;
}) {
  const lineRef = useRef<THREE.LineSegments>(null);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = synapses.length;
    const positions = new Float32Array(count * 6);
    const colors = new Float32Array(count * 6);

    for (let i = 0; i < count; i++) {
      const s = synapses[i];
      const fromN = neurons[s.from];
      const toN = neurons[s.to];

      positions[i * 6] = fromN.position.x;
      positions[i * 6 + 1] = fromN.position.y;
      positions[i * 6 + 2] = fromN.position.z;
      positions[i * 6 + 3] = toN.position.x;
      positions[i * 6 + 4] = toN.position.y;
      positions[i * 6 + 5] = toN.position.z;

      const fromColor = LAYER_COLORS[fromN.layerIndex];
      const toColor = LAYER_COLORS[toN.layerIndex];

      colors[i * 6] = fromColor.r;
      colors[i * 6 + 1] = fromColor.g;
      colors[i * 6 + 2] = fromColor.b;
      colors[i * 6 + 3] = toColor.r;
      colors[i * 6 + 4] = toColor.g;
      colors[i * 6 + 5] = toColor.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: new Float32Array(count) },
      },
      vertexShader: /* glsl */ `
        attribute vec3 aColor;
        varying vec3 vColor;
        varying float vSegmentIndex;
        uniform float uTime;

        void main() {
          vColor = aColor;
          // Pass segment index for varying opacity
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;

        void main() {
          gl_FragColor = vec4(vColor, 0.15);
        }
      `,
    });

    return { geometry: geo, material: mat };
  }, [neurons, synapses]);

  useFrame(({ clock }) => {
    if (!lineRef.current) return;
    const t = clock.getElapsedTime();

    // Update line positions with breathing
    const posAttr = lineRef.current.geometry.getAttribute('position');
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < synapses.length; i++) {
      const s = synapses[i];
      const fromN = neurons[s.from];
      const toN = neurons[s.to];

      arr[i * 6] = fromN.position.x + Math.sin(t * 0.3 + fromN.phase) * 0.05;
      arr[i * 6 + 1] = fromN.position.y + Math.sin(t * 0.4 + fromN.phase * 1.3) * 0.08;
      arr[i * 6 + 2] = fromN.position.z + Math.cos(t * 0.35 + fromN.phase * 0.7) * 0.06;
      arr[i * 6 + 3] = toN.position.x + Math.sin(t * 0.3 + toN.phase) * 0.05;
      arr[i * 6 + 4] = toN.position.y + Math.sin(t * 0.4 + toN.phase * 1.3) * 0.08;
      arr[i * 6 + 5] = toN.position.z + Math.cos(t * 0.35 + toN.phase * 0.7) * 0.06;
    }
    posAttr.needsUpdate = true;
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <lineSegments ref={lineRef} geometry={geometry} material={material} />;
});

// ============================================================
// SIGNAL RENDERER - Data pulses traveling along synapses
// ============================================================

const SignalRenderer = React.memo(function SignalRenderer({
  neurons,
  synapses,
  signalRef,
}: {
  neurons: NeuronInfo[];
  synapses: SynapseInfo[];
  signalRef: React.MutableRefObject<SignalInfo[]>;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const maxPts = MAX_SIGNALS;
    const positions = new Float32Array(maxPts * 3);
    const colors = new Float32Array(maxPts * 3);

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uSize: { value: SIGNAL_POINT_SIZE * Math.min(window.devicePixelRatio, 1.5) },
      },
      vertexShader: /* glsl */ `
        attribute vec3 aColor;
        varying vec3 vColor;
        uniform float uSize;

        void main() {
          vColor = aColor;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = uSize * (180.0 / -gl_Position.z);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          float core = pow(smoothstep(0.5, 0.0, dist), 1.5);
          float trail = smoothstep(0.5, 0.15, dist) * 0.5;
          vec3 color = mix(vColor, vec3(1.0), core * 0.8);
          float alpha = core + trail;

          gl_FragColor = vec4(color * 2.0, alpha);
        }
      `,
    });

    return { geometry: geo, material: mat };
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.getAttribute('position');
    const colAttr = pointsRef.current.geometry.getAttribute('aColor');
    if (!posAttr || !colAttr) return;

    const posArr = posAttr.array as Float32Array;
    const colArr = colAttr.array as Float32Array;

    // Reset all
    posArr.fill(0);
    colArr.fill(0);

    const signals = signalRef.current;
    let drawIdx = 0;

    for (let i = 0; i < signals.length && drawIdx < MAX_SIGNALS; i++) {
      const sig = signals[i];
      if (!sig.active) continue;

      const syn = synapses[sig.synapseIndex];
      const fromN = neurons[syn.from];
      const toN = neurons[syn.to];

      const idx = drawIdx * 3;
      posArr[idx] = THREE.MathUtils.lerp(fromN.position.x, toN.position.x, sig.progress);
      posArr[idx + 1] = THREE.MathUtils.lerp(fromN.position.y, toN.position.y, sig.progress);
      posArr[idx + 2] = THREE.MathUtils.lerp(fromN.position.z, toN.position.z, sig.progress);

      // Color: blend from source to destination layer color
      const fromC = LAYER_COLORS[fromN.layerIndex];
      const toC = LAYER_COLORS[toN.layerIndex];
      colArr[idx] = fromC.r * (1 - sig.progress) + toC.r * sig.progress;
      colArr[idx + 1] = fromC.g * (1 - sig.progress) + toC.g * sig.progress;
      colArr[idx + 2] = fromC.b * (1 - sig.progress) + toC.b * sig.progress;

      drawIdx++;
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <points ref={pointsRef} geometry={geometry} material={material} />;
});

// ============================================================
// NEURON RINGS - Orbital rings around neurons
// ============================================================

const NeuronRings = React.memo(function NeuronRings({
  neurons,
  activationRef,
}: {
  neurons: NeuronInfo[];
  activationRef: React.MutableRefObject<Float32Array>;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const ringData = useMemo(() => {
    const data: { neuronIdx: number; radius: number; speed: number; tilt: number }[] = [];
    // Add rings to a subset of neurons for visual variety
    neurons.forEach((n, i) => {
      if (i % 3 === 0) {
        data.push({ neuronIdx: i, radius: 0.25 + Math.random() * 0.15, speed: 0.5 + Math.random() * 1.0, tilt: Math.random() * Math.PI });
      }
    });
    return data;
  }, [neurons]);

  const { geometries, material } = useMemo(() => {
    const geos = ringData.map(() => {
      const geo = new THREE.RingGeometry(0.22, 0.24, 32);
      return geo;
    });

    const mat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    return { geometries: geos, material: mat };
  }, [ringData]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    groupRef.current.children.forEach((child, i) => {
      const ring = ringData[i];
      const neuron = neurons[ring.neuronIdx];
      const activation = activationRef.current[ring.neuronIdx];

      const mesh = child as THREE.Mesh;
      mesh.position.set(
        neuron.position.x + Math.sin(t * 0.3 + neuron.phase) * 0.05,
        neuron.position.y + Math.sin(t * 0.4 + neuron.phase * 1.3) * 0.08,
        neuron.position.z + Math.cos(t * 0.35 + neuron.phase * 0.7) * 0.06
      );
      mesh.rotation.x = ring.tilt + t * ring.speed * 0.3;
      mesh.rotation.y = t * ring.speed;
      mesh.scale.setScalar(0.8 + activation * 0.6);

      // Update color based on neuron's layer color
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.06 + activation * 0.12;
      mat.color.copy(neuron.color);
    });
  });

  useEffect(() => {
    return () => {
      geometries.forEach((g) => g.dispose());
      material.dispose();
    };
  }, [geometries, material]);

  return (
    <group ref={groupRef}>
      {ringData.map((_, i) => (
        <mesh key={i} geometry={geometries[i]} material={material} />
      ))}
    </group>
  );
});

// ============================================================
// BACKGROUND PARTICLES - Ambient floating particles
// ============================================================

const BackgroundParticles = React.memo(function BackgroundParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, material, data } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = BG_PARTICLE_COUNT;
    const positions = new Float32Array(count * 3);
    const velocities: number[] = [];
    const sizes = new Float32Array(count);
    const opacities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      velocities.push(Math.random() * Math.PI * 2);
      sizes[i] = 0.3 + Math.random() * 0.7;
      opacities[i] = 0.15 + Math.random() * 0.35;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.2) },
      },
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uPixelRatio;
        varying float vAlpha;

        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 3.0 * uPixelRatio * (100.0 / -gl_Position.z);
          vAlpha = 0.25;
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vAlpha;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
          gl_FragColor = vec4(0.4, 0.6, 0.8, alpha);
        }
      `,
    });

    return { geometry: geo, material: mat, data: { velocities } };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.getAttribute('position');
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < BG_PARTICLE_COUNT; i++) {
      const phase = data.velocities[i];
      arr[i * 3] += Math.sin(t * 0.05 + phase) * 0.002;
      arr[i * 3 + 1] += Math.cos(t * 0.04 + phase) * 0.002;

      // Wrap around
      if (arr[i * 3] > 9) arr[i * 3] = -9;
      if (arr[i * 3] < -9) arr[i * 3] = 9;
      if (arr[i * 3 + 1] > 6) arr[i * 3 + 1] = -6;
      if (arr[i * 3 + 1] < -6) arr[i * 3 + 1] = 6;
    }
    posAttr.needsUpdate = true;
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <points ref={pointsRef} geometry={geometry} material={material} />;
});

// ============================================================
// FLOATING WIREFRAMES - Subtle geometric shapes
// ============================================================

interface WireframeConfig {
  geometry: 'icosahedron' | 'torus' | 'octahedron' | 'dodecahedron';
  position: [number, number, number];
  rotationSpeed: [number, number, number];
  scale: number;
  color: string;
}

const WIREFRAMES: WireframeConfig[] = [
  { geometry: 'icosahedron', position: [-7, 3, -4], rotationSpeed: [0.015, 0.025, 0.008], scale: 1.2, color: '#22d3ee' },
  { geometry: 'torus', position: [7, -2.5, -3], rotationSpeed: [0.01, 0.02, 0.012], scale: 1.4, color: '#a855f7' },
  { geometry: 'octahedron', position: [0, 4.5, -5], rotationSpeed: [0.018, 0.022, 0.015], scale: 0.9, color: '#34d399' },
  { geometry: 'dodecahedron', position: [-6, -3.5, -5], rotationSpeed: [0.012, 0.018, 0.01], scale: 0.7, color: '#8b5cf6' },
];

const FloatingWireframe = React.memo(function FloatingWireframe({
  config,
}: {
  config: WireframeConfig;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geo = useMemo(() => {
    switch (config.geometry) {
      case 'icosahedron': return new THREE.IcosahedronGeometry(1, 1);
      case 'torus': return new THREE.TorusGeometry(1, 0.3, 8, 16);
      case 'octahedron': return new THREE.OctahedronGeometry(1, 0);
      case 'dodecahedron': return new THREE.DodecahedronGeometry(1, 0);
    }
  }, [config.geometry]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.x = t * config.rotationSpeed[0];
    meshRef.current.rotation.y = t * config.rotationSpeed[1];
    meshRef.current.rotation.z = t * config.rotationSpeed[2];
    meshRef.current.position.y = config.position[1] + Math.sin(t * 0.15 + config.position[0]) * 0.4;
  });

  useEffect(() => {
    return () => { geo.dispose(); };
  }, [geo]);

  return (
    <mesh ref={meshRef} position={config.position} scale={config.scale} geometry={geo}>
      <meshBasicMaterial
        color={config.color}
        wireframe
        transparent
        opacity={0.04}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
});

// ============================================================
// CAMERA RIG - Mouse-driven parallax
// ============================================================

const CameraRig = React.memo(function CameraRig() {
  const { camera } = useThree();

  useFrame(() => {
    const targetRotY = mousePos.x * 0.06;
    const targetRotX = -mousePos.y * 0.03;

    camera.rotation.y += (targetRotY - camera.rotation.y) * 0.015;
    camera.rotation.x += (targetRotX - camera.rotation.x) * 0.015;
  });

  return null;
});

// ============================================================
// NEURAL NETWORK ORCHESTRATOR - Manages signals + wave activation
// ============================================================

const NeuralNetwork = React.memo(function NeuralNetwork() {
  const { neurons, synapses } = useMemo(() => generateNetwork(), []);
  const neuronCount = neurons.length;

  const activationRef = useRef(new Float32Array(neuronCount));
  const signalRef = useRef<SignalInfo[]>([]);
  const waveTimerRef = useRef(0);
  const waveLayerRef = useRef(-1);
  const waveActiveRef = useRef(false);

  // Layer start indices for quick lookup
  const layerStarts = useMemo(() => {
    const starts: number[] = [];
    let acc = 0;
    LAYERS.forEach((l) => {
      starts.push(acc);
      acc += l.neuronCount;
    });
    return starts;
  }, []);

  // Initialize signals pool
  useEffect(() => {
    const pool: SignalInfo[] = [];
    for (let i = 0; i < MAX_SIGNALS; i++) {
      pool.push({ synapseIndex: 0, progress: 0, speed: 0, active: false });
    }
    signalRef.current = pool;
  }, []);

  // Get synapses originating from a specific neuron
  const getOutgoingSynapses = useCallback(
    (neuronIdx: number): number[] => {
      const result: number[] = [];
      for (let i = 0; i < synapses.length; i++) {
        if (synapses[i].from === neuronIdx) result.push(i);
      }
      return result;
    },
    [synapses]
  );

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const activations = activationRef.current;
    const signals = signalRef.current;

    // ---- DECAY activations ----
    for (let i = 0; i < neuronCount; i++) {
      activations[i] *= 0.985;
      if (activations[i] < 0.01) activations[i] = 0;
    }

    // ---- MOUSE PROXIMITY activation ----
    const mx = mousePos.x * 8;
    const my = mousePos.y * 6;
    for (let i = 0; i < neuronCount; i++) {
      const n = neurons[i];
      const dx = n.position.x - mx;
      const dy = n.position.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_WORLD_RADIUS) {
        const influence = (1 - dist / MOUSE_WORLD_RADIUS) * MOUSE_STRENGTH;
        activations[i] = Math.min(1.0, activations[i] + influence * 0.1);

        // Spawn signals from nearby neurons occasionally
        if (Math.random() < 0.03) {
          const outgoing = getOutgoingSynapses(i);
          if (outgoing.length > 0) {
            const synIdx = outgoing[Math.floor(Math.random() * outgoing.length)];
            const freeSlot = signals.find((s) => !s.active);
            if (freeSlot) {
              freeSlot.active = true;
              freeSlot.synapseIndex = synIdx;
              freeSlot.progress = 0;
              freeSlot.speed = 0.4 + Math.random() * 0.5;
            }
          }
        }
      }
    }

    // ---- WAVE PROPAGATION ----
    waveTimerRef.current += delta;

    if (!waveActiveRef.current && waveTimerRef.current >= WAVE_INTERVAL) {
      waveActiveRef.current = true;
      waveTimerRef.current = 0;
      waveLayerRef.current = 0;

      // Activate input layer neurons
      const layer = LAYERS[0];
      const start = layerStarts[0];
      for (let i = 0; i < layer.neuronCount; i++) {
        activations[start + i] = 0.6 + Math.random() * 0.4;
      }
    }

    if (waveActiveRef.current) {
      // Progress wave through layers
      const layerProgress = waveTimerRef.current / (WAVE_DURATION / LAYERS.length);

      if (layerProgress >= 1 && waveLayerRef.current < LAYERS.length - 1) {
        waveLayerRef.current++;
        waveTimerRef.current = 0;

        const li = waveLayerRef.current;
        const start = layerStarts[li];
        const layer = LAYERS[li];

        // Activate neurons in this layer
        for (let i = 0; i < layer.neuronCount; i++) {
          activations[start + i] = 0.5 + Math.random() * 0.5;
        }

        // Fire signals TO this layer from previous layer
        const prevStart = layerStarts[li - 1];
        for (let ni = 0; ni < LAYERS[li - 1].neuronCount; ni++) {
          const neuronIdx = prevStart + ni;
          const outgoing = getOutgoingSynapses(neuronIdx);
          // Pick 1-2 random outgoing synapses to fire
          const shuffled = outgoing.sort(() => Math.random() - 0.5);
          const toFire = shuffled.slice(0, Math.min(2, shuffled.length));

          for (const synIdx of toFire) {
            const freeSlot = signals.find((s) => !s.active);
            if (freeSlot) {
              freeSlot.active = true;
              freeSlot.synapseIndex = synIdx;
              freeSlot.progress = 0;
              freeSlot.speed = 0.5 + Math.random() * 0.6;
            }
          }
        }
      }

      // End wave
      if (waveLayerRef.current >= LAYERS.length - 1 && waveTimerRef.current >= WAVE_DURATION / LAYERS.length) {
        waveActiveRef.current = false;
        waveTimerRef.current = 0;
      }
    }

    // ---- RANDOM SIGNAL SPAWNING (ambient activity) ----
    if (Math.random() < 0.08) {
      const randomSynIdx = Math.floor(Math.random() * synapses.length);
      const freeSlot = signals.find((s) => !s.active);
      if (freeSlot) {
        freeSlot.active = true;
        freeSlot.synapseIndex = randomSynIdx;
        freeSlot.progress = 0;
        freeSlot.speed = 0.3 + Math.random() * 0.5;

        // Slightly activate source neuron
        const srcNeuron = synapses[randomSynIdx].from;
        activations[srcNeuron] = Math.min(1.0, activations[srcNeuron] + 0.2);
      }
    }

    // ---- UPDATE SIGNALS ----
    for (let i = 0; i < signals.length; i++) {
      const sig = signals[i];
      if (!sig.active) continue;

      sig.progress += sig.speed * delta;

      if (sig.progress >= 1.0) {
        sig.active = false;
        sig.progress = 0;

        // Activate destination neuron
        const destNeuron = synapses[sig.synapseIndex].to;
        activations[destNeuron] = Math.min(1.0, activations[destNeuron] + 0.35);

        // Chain reaction: fire from destination neuron
        if (Math.random() < 0.3) {
          const outgoing = getOutgoingSynapses(destNeuron);
          if (outgoing.length > 0) {
            const nextSynIdx = outgoing[Math.floor(Math.random() * outgoing.length)];
            const freeSlot = signals.find((s) => !s.active);
            if (freeSlot) {
              freeSlot.active = true;
              freeSlot.synapseIndex = nextSynIdx;
              freeSlot.progress = 0;
              freeSlot.speed = 0.4 + Math.random() * 0.5;
            }
          }
        }
      }
    }
  });

  return (
    <>
      <NeuronRenderer neurons={neurons} activationRef={activationRef} />
      <SynapseRenderer neurons={neurons} synapses={synapses} signalRef={signalRef} />
      <SignalRenderer neurons={neurons} synapses={synapses} signalRef={signalRef} />
      <NeuronRings neurons={neurons} activationRef={activationRef} />
    </>
  );
});

// ============================================================
// MOUSE TRACKER HOOK
// ============================================================

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

function MouseTracker() {
  useMouseTracker();
  return null;
}

// ============================================================
// SCENE - Post-processing pipeline
// ============================================================

const Scene = React.memo(function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <CameraRig />
      <NeuralNetwork />
      <BackgroundParticles />

      {WIREFRAMES.map((config, i) => (
        <FloatingWireframe key={i} config={config} />
      ))}

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          intensity={1.4}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
});

// ============================================================
// PARTICLE FIELD - Main exported component
// ============================================================

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
          camera={{ position: [0, 0, 9], fov: 55 }}
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

export default ParticleField;
