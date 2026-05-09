'use client';

import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

// ============================================================
// CONFIGURATION
// ============================================================

const BRAIN_RADIUS = 1.7;
const BG_PARTICLE_COUNT = 120;
const MAX_BRAIN_SIGNALS = 50;
const MAX_NEURON_SIGNALS = 40;
const NEURON_LAYERS = [
  { count: 5, xPos: -6.5 },
  { count: 7, xPos: -2.2 },
  { count: 6, xPos: 2.2 },
  { count: 4, xPos: 6.5 },
];
const NEURON_COLORS = [0x22d3ee, 0xa855f7, 0x8b5cf6, 0x34d399];
const NEURON_SPREAD_Y = 5.0;
const CONNECTION_PROB = 0.4;

// ============================================================
// MOUSE STATE
// ============================================================

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

// ============================================================
// BRAIN DATA GENERATION
// ============================================================

interface PathwayCurve {
  curve: THREE.CatmullRomCurve3;
  color: THREE.Color;
}

function generateBrainData(): PathwayCurve[] {
  const regions = [
    [0.85, 0.45, 0.35], [0.65, 0.15, 0.65], [0.25, 0.75, 0.5],
    [-0.2, 0.7, 0.55], [0.45, -0.35, 0.7], [-0.75, 0.15, 0.45],
    [-0.5, -0.55, -0.15], [-0.25, -0.75, 0.1],
    [-0.85, 0.45, -0.35], [-0.65, 0.15, -0.65], [-0.25, 0.75, -0.5],
    [0.2, 0.7, -0.55], [-0.45, -0.35, -0.7], [0.75, 0.15, -0.45],
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z).multiplyScalar(BRAIN_RADIUS));

  const pairs: [number, number][] = [
    [0, 2], [0, 1], [1, 4], [2, 3], [3, 5], [4, 6], [6, 7],
    [0, 8], [2, 10], [3, 11], [4, 12], [8, 10], [9, 12],
    [10, 11], [11, 13], [5, 13], [0, 3], [8, 11], [7, 6],
  ];

  const palette = [
    new THREE.Color(0x22d3ee), new THREE.Color(0xa855f7),
    new THREE.Color(0x34d399), new THREE.Color(0x8b5cf6),
    new THREE.Color(0x06b6d4),
  ];

  return pairs.map(([a, b], i) => {
    const from = regions[a];
    const to = regions[b];
    const mid = from.clone().add(to).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(BRAIN_RADIUS * 1.4);
    mid.x += (Math.sin(i * 2.3) * 0.35);
    mid.y += (Math.cos(i * 1.7) * 0.35);
    mid.z += (Math.sin(i * 3.1) * 0.3);

    const cp1 = from.clone().lerp(mid, 0.4);
    cp1.normalize().multiplyScalar(from.length() * 1.2);
    const cp2 = to.clone().lerp(mid, 0.4);
    cp2.normalize().multiplyScalar(to.length() * 1.2);

    return {
      curve: new THREE.CatmullRomCurve3([from, cp1, mid, cp2, to]),
      color: palette[i % palette.length],
    };
  });
}

// ============================================================
// BRAIN SURFACE — Displaced icosahedron with Fresnel glow
// ============================================================

const BrainSurface = React.memo(function BrainSurface() {
  const meshRef = useRef<THREE.Mesh>(null);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(BRAIN_RADIUS, 4);

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x3388dd) },
      },
      vertexShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying float vDisp;

        float brainDisp(vec3 p) {
          float d = 0.0;
          d += sin(p.x * 4.0 + p.y * 3.5 + 0.5) * 0.07;
          d += cos(p.y * 5.0 + p.z * 4.5 + 1.2) * 0.06;
          d += sin(p.z * 3.0 + p.x * 5.0 + 2.1) * 0.05;
          d += sin(p.x * 8.0 + p.y * 7.0 + p.z * 6.0 + 0.7) * 0.03;
          d += cos(p.x * 11.0 + p.y * 10.0 + p.z * 9.0 + 1.5) * 0.018;
          d += sin(p.x * 16.0 + p.y * 14.0 + p.z * 13.0) * 0.008;
          return d;
        }

        void main() {
          vec3 pos = position;
          float disp = brainDisp(pos * 1.8);
          vDisp = disp;
          pos += normal * disp;

          float fissure = smoothstep(0.0, 0.12, abs(pos.x));
          pos.x += sign(pos.x) * (1.0 - fissure) * 0.04;

          float breathe = 1.0 + sin(uTime * 0.35) * 0.012;
          pos *= breathe;

          vNormal = normalize(normalMatrix * normal);
          vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying float vDisp;

        void main() {
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.8);

          vec3 baseColor = uColor * 0.5;
          vec3 ridgeColor = uColor * 1.5;
          vec3 surfaceColor = mix(baseColor, ridgeColor, smoothstep(0.01, 0.07, abs(vDisp)));

          vec3 rimColor = mix(vec3(0.3, 0.7, 1.0), vec3(0.6, 0.4, 1.0), fresnel);
          vec3 finalColor = mix(surfaceColor, rimColor, fresnel * 0.85);

          vec3 lightDir = normalize(vec3(0.5, 1.0, 0.8));
          float diff = max(dot(vNormal, lightDir), 0.0) * 0.25;
          finalColor += diff * vec3(0.2, 0.4, 0.8);

          float pulse = 0.92 + 0.08 * sin(uTime * 0.5);
          finalColor *= pulse;

          float alpha = 0.06 + fresnel * 0.5;
          alpha += smoothstep(0.015, 0.08, abs(vDisp)) * 0.06;

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
    });

    return { geometry: geo, material: mat };
  }, []);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.06;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.12) * 0.08;
      meshRef.current.rotation.z = Math.cos(clock.getElapsedTime() * 0.09) * 0.04;
    }
  });

  useEffect(() => { return () => { geometry.dispose(); material.dispose(); }; }, [geometry, material]);

  return (
    <mesh ref={meshRef} scale={[1.0, 0.92, 0.82]} geometry={geometry} material={material} />
  );
});

// ============================================================
// BRAIN GLOW — Inner radial glow
// ============================================================

const BrainGlow = React.memo(function BrainGlow() {
  const meshRef = useRef<THREE.Mesh>(null);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(BRAIN_RADIUS * 0.65, 3);
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main() {
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 1.6);
          vec3 glowColor = mix(vec3(0.12, 0.35, 0.85), vec3(0.3, 0.6, 1.0), fresnel);
          float intensity = (1.0 - fresnel) * 0.4;
          float pulse = 0.85 + 0.15 * sin(uTime * 0.7);
          intensity *= pulse;
          gl_FragColor = vec4(glowColor, intensity);
        }
      `,
    });
    return { geometry: geo, material: mat };
  }, []);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1.0 + Math.sin(clock.getElapsedTime() * 0.4) * 0.06);
    }
  });

  useEffect(() => { return () => { geometry.dispose(); material.dispose(); }; }, [geometry, material]);

  return (
    <mesh ref={meshRef} scale={[1.0, 0.92, 0.82]} geometry={geometry} material={material} />
  );
});

// ============================================================
// BRAIN CORTEX SHELL — Wireframe shell for cortical surface
// ============================================================

const BrainCortexShell = React.memo(function BrainCortexShell() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(BRAIN_RADIUS * 1.02, 2), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0x4488cc,
    wireframe: true,
    transparent: true,
    opacity: 0.035,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.06;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.12) * 0.08;
    }
  });

  useEffect(() => { return () => { geometry.dispose(); material.dispose(); }; }, [geometry, material]);

  return (
    <mesh ref={meshRef} scale={[1.0, 0.92, 0.82]} geometry={geometry} material={material} />
  );
});

// ============================================================
// BRAIN PATHWAYS — Lines connecting brain regions
// ============================================================

const BrainPathways = React.memo(function BrainPathways() {
  const pathways = useMemo(() => generateBrainData(), []);

  const lineObjects = useMemo(() => {
    return pathways.map((pw) => {
      const pts = pw.curve.getPoints(32);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: pw.color,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      return new THREE.Line(geo, mat);
    });
  }, [pathways]);

  useEffect(() => {
    return () => lineObjects.forEach((o) => { o.geometry.dispose(); (o.material as THREE.Material).dispose(); });
  }, [lineObjects]);

  return (
    <group rotation={[0, 0, 0]}>
      {lineObjects.map((obj, i) => (
        <primitive key={i} object={obj} />
      ))}
    </group>
  );
});

// ============================================================
// BRAIN SIGNALS — Glowing pulses traveling along pathways
// ============================================================

interface BrainSignal {
  pathwayIdx: number;
  progress: number;
  speed: number;
  active: boolean;
}

const BrainSignals = React.memo(function BrainSignals() {
  const pointsRef = useRef<THREE.Points>(null);
  const pathways = useMemo(() => generateBrainData(), []);

  const signalPool = useRef<BrainSignal[]>([]);
  const spawnTimer = useRef(0);

  useEffect(() => {
    const pool: BrainSignal[] = [];
    for (let i = 0; i < MAX_BRAIN_SIGNALS; i++) {
      pool.push({ pathwayIdx: 0, progress: 0, speed: 0, active: false });
    }
    signalPool.current = pool;
  }, []);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(MAX_BRAIN_SIGNALS * 3);
    const colors = new Float32Array(MAX_BRAIN_SIGNALS * 3);
    const sizes = new Float32Array(MAX_BRAIN_SIGNALS);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uScale: { value: Math.min(window.devicePixelRatio, 1.5) } },
      vertexShader: `
        attribute vec3 aColor;
        attribute float aSize;
        varying vec3 vColor;
        uniform float uScale;
        void main() {
          vColor = aColor;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uScale * (200.0 / -gl_Position.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float core = pow(smoothstep(0.5, 0.0, dist), 2.0);
          float glow = smoothstep(0.5, 0.1, dist) * 0.6;
          vec3 color = mix(vColor, vec3(1.0), core * 0.9);
          gl_FragColor = vec4(color * 2.5, core * 0.95 + glow * 0.5);
        }
      `,
    });
    return { geometry: geo, material: mat };
  }, []);

  useFrame(({ clock }, delta) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.getAttribute('position');
    const colAttr = pointsRef.current.geometry.getAttribute('aColor');
    const sizeAttr = pointsRef.current.geometry.getAttribute('aSize');
    if (!posAttr || !colAttr || !sizeAttr) return;

    const posArr = posAttr.array as Float32Array;
    const colArr = colAttr.array as Float32Array;
    const sizeArr = sizeAttr.array as Float32Array;
    posArr.fill(0); colArr.fill(0); sizeArr.fill(0);

    // Spawn signals
    spawnTimer.current += delta;
    if (spawnTimer.current > 0.15) {
      spawnTimer.current = 0;
      if (Math.random() < 0.5) {
        const slot = signalPool.current.find(s => !s.active);
        if (slot) {
          slot.active = true;
          slot.pathwayIdx = Math.floor(Math.random() * pathways.length);
          slot.progress = 0;
          slot.speed = 0.25 + Math.random() * 0.4;
        }
      }
    }

    // Update signals
    const signals = signalPool.current;
    let drawIdx = 0;

    for (let i = 0; i < signals.length && drawIdx < MAX_BRAIN_SIGNALS; i++) {
      const sig = signals[i];
      if (!sig.active) continue;

      sig.progress += sig.speed * delta;
      if (sig.progress >= 1.0) {
        sig.active = false;
        continue;
      }

      const pw = pathways[sig.pathwayIdx];
      const pt = pw.curve.getPointAt(sig.progress);
      const idx = drawIdx * 3;
      posArr[idx] = pt.x;
      posArr[idx + 1] = pt.y;
      posArr[idx + 2] = pt.z;

      // Color blend along pathway
      colArr[idx] = pw.color.r * (0.8 + 0.2 * Math.sin(t * 3 + sig.progress * 6));
      colArr[idx + 1] = pw.color.g * (0.8 + 0.2 * Math.cos(t * 3 + sig.progress * 6));
      colArr[idx + 2] = pw.color.b;

      // Size: larger at midpoint
      const sizeFactor = Math.sin(sig.progress * Math.PI);
      sizeArr[drawIdx] = 6.0 + sizeFactor * 10.0;

      // Draw a trail point slightly behind
      if (drawIdx + 1 < MAX_BRAIN_SIGNALS && sig.progress > 0.05) {
        const trailPt = pw.curve.getPointAt(Math.max(0, sig.progress - 0.04));
        const ti = (drawIdx + 1) * 3;
        posArr[ti] = trailPt.x;
        posArr[ti + 1] = trailPt.y;
        posArr[ti + 2] = trailPt.z;
        colArr[ti] = pw.color.r * 0.5;
        colArr[ti + 1] = pw.color.g * 0.5;
        colArr[ti + 2] = pw.color.b * 0.5;
        sizeArr[drawIdx + 1] = 3.0 + sizeFactor * 4.0;
        drawIdx += 2;
      } else {
        drawIdx++;
      }
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;
  });

  useEffect(() => { return () => { geometry.dispose(); material.dispose(); }; }, [geometry, material]);

  return <points ref={pointsRef} geometry={geometry} material={material} />;
});

// ============================================================
// ORBITAL RINGS — Sci-fi rings orbiting the brain
// ============================================================

const ORBITAL_RINGS = [
  { radius: 2.8, tube: 0.006, tilt: [0.3, 0, 0.1], speed: 0.12, color: 0x22d3ee, opacity: 0.1 },
  { radius: 3.3, tube: 0.005, tilt: [1.3, 0.4, 0.2], speed: -0.08, color: 0xa855f7, opacity: 0.08 },
  { radius: 2.4, tube: 0.008, tilt: [0.7, 0, 0.8], speed: 0.06, color: 0x34d399, opacity: 0.06 },
];

const OrbitalRings = React.memo(function OrbitalRings() {
  const groupRef = useRef<THREE.Group>(null);

  const rings = useMemo(() => {
    return ORBITAL_RINGS.map((r) => ({
      geometry: new THREE.TorusGeometry(r.radius, r.tube, 16, 100),
      material: new THREE.MeshBasicMaterial({
        color: r.color, transparent: true, opacity: r.opacity,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }),
      tilt: r.tilt as [number, number, number],
      speed: r.speed,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    rings.forEach((ring, i) => {
      const child = groupRef.current!.children[i] as THREE.Mesh;
      child.rotation.x = ring.tilt[0] + t * ring.speed * 0.3;
      child.rotation.y = t * ring.speed;
      child.rotation.z = ring.tilt[2] + t * ring.speed * 0.15;
    });
  });

  useEffect(() => {
    return () => rings.forEach((r) => { r.geometry.dispose(); r.material.dispose(); });
  }, [rings]);

  return (
    <group ref={groupRef} scale={[1, 0.92, 0.82]}>
      {rings.map((r, i) => (
        <mesh key={i} geometry={r.geometry} material={r.material} rotation={r.tilt} />
      ))}
    </group>
  );
});

// ============================================================
// BACKGROUND NEURAL NETWORK — Subtle depth network
// ============================================================

interface NeuronInfo {
  position: THREE.Vector3;
  layerIdx: number;
  color: THREE.Color;
  phase: number;
}
interface SynapseInfo { from: number; to: number; }
interface NeuronSignal { synIdx: number; progress: number; speed: number; active: boolean; }

function generateNetwork() {
  const neurons: NeuronInfo[] = [];
  const synapses: SynapseInfo[] = [];
  let gIdx = 0;

  NEURON_LAYERS.forEach((layer, li) => {
    for (let i = 0; i < layer.count; i++) {
      const t = layer.count === 1 ? 0.5 : i / (layer.count - 1);
      neurons.push({
        position: new THREE.Vector3(
          layer.xPos, (t - 0.5) * NEURON_SPREAD_Y, (Math.random() - 0.5) * 1.5
        ),
        layerIdx: li,
        color: new THREE.Color(NEURON_COLORS[li]),
        phase: Math.random() * Math.PI * 2,
      });
      gIdx++;
    }
  });

  for (let li = 0; li < NEURON_LAYERS.length - 1; li++) {
    const sA = NEURON_LAYERS.slice(0, li).reduce((s, l) => s + l.count, 0);
    const sB = sA + NEURON_LAYERS[li].count;
    for (let a = sA; a < sB; a++) {
      for (let b = sB; b < sB + NEURON_LAYERS[li + 1].count; b++) {
        if (Math.random() < CONNECTION_PROB) synapses.push({ from: a, to: b });
      }
    }
  }

  return { neurons, synapses };
}

const NetworkNeurons = React.memo(function NetworkNeurons({
  neurons, activationRef,
}: { neurons: NeuronInfo[]; activationRef: React.MutableRefObject<Float32Array> }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const n = neurons.length;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = neurons[i].position.x; pos[i * 3 + 1] = neurons[i].position.y; pos[i * 3 + 2] = neurons[i].position.z;
      col[i * 3] = neurons[i].color.r; col[i * 3 + 1] = neurons[i].color.g; col[i * 3 + 2] = neurons[i].color.b;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));

    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uSize: { value: 10.0 * Math.min(window.devicePixelRatio, 1.2) } },
      vertexShader: `
        attribute vec3 aColor;
        varying vec3 vColor;
        uniform float uSize;
        void main() {
          vColor = aColor;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = uSize * (180.0 / -gl_Position.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float core = pow(smoothstep(0.5, 0.0, dist), 1.8);
          float glow = smoothstep(0.5, 0.15, dist) * 0.3;
          vec3 color = mix(vColor, vec3(1.0), core * 0.5);
          gl_FragColor = vec4(color * 1.5, core * 0.7 + glow * 0.3);
        }
      `,
    });
    return { geometry: geo, material: mat };
  }, [neurons]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.getAttribute('position');
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < neurons.length; i++) {
      const n = neurons[i];
      arr[i * 3] = n.position.x + Math.sin(t * 0.25 + n.phase) * 0.06;
      arr[i * 3 + 1] = n.position.y + Math.sin(t * 0.3 + n.phase * 1.3) * 0.09;
      arr[i * 3 + 2] = n.position.z + Math.cos(t * 0.28 + n.phase * 0.7) * 0.07;
    }
    posAttr.needsUpdate = true;
  });

  useEffect(() => { return () => { geometry.dispose(); material.dispose(); }; }, [geometry, material]);

  return <points ref={pointsRef} geometry={geometry} material={material} />;
});

const NetworkSynapses = React.memo(function NetworkSynapses({
  neurons, synapses,
}: { neurons: NeuronInfo[]; synapses: SynapseInfo[] }) {
  const { lineObjects } = useMemo(() => {
    const objs = synapses.map((s) => {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(6);
      const fn = neurons[s.from]; const tn = neurons[s.to];
      pos[0] = fn.position.x; pos[1] = fn.position.y; pos[2] = fn.position.z;
      pos[3] = tn.position.x; pos[4] = tn.position.y; pos[5] = tn.position.z;
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const fromC = new THREE.Color(NEURON_COLORS[fn.layerIdx]);
      const toC = new THREE.Color(NEURON_COLORS[tn.layerIdx]);
      const mat = new THREE.LineBasicMaterial({
        color: fromC.lerp(toC, 0.5), transparent: true, opacity: 0.06,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      return new THREE.Line(geo, mat);
    });
    return { lineObjects: objs };
  }, [neurons, synapses]);

  useEffect(() => {
    return () => lineObjects.forEach((o) => { o.geometry.dispose(); (o.material as THREE.Material).dispose(); });
  }, [lineObjects]);

  return (
    <group>
      {lineObjects.map((o, i) => <primitive key={i} object={o} />)}
    </group>
  );
});

const NetworkSignals = React.memo(function NetworkSignals({
  neurons, synapses, signalRef,
}: { neurons: NeuronInfo[]; synapses: SynapseInfo[]; signalRef: React.MutableRefObject<NeuronSignal[]> }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX_NEURON_SIGNALS * 3), 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(MAX_NEURON_SIGNALS * 3), 3));
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uSize: { value: 5.0 * Math.min(window.devicePixelRatio, 1.2) } },
      vertexShader: `
        attribute vec3 aColor;
        varying vec3 vColor;
        uniform float uSize;
        void main() {
          vColor = aColor;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = uSize * (150.0 / -gl_Position.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float core = pow(smoothstep(0.5, 0.0, dist), 1.5);
          gl_FragColor = vec4(mix(vColor, vec3(1.0), core * 0.8) * 2.0, core);
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
    posArr.fill(0); colArr.fill(0);

    const signals = signalRef.current;
    let di = 0;
    for (let i = 0; i < signals.length && di < MAX_NEURON_SIGNALS; i++) {
      const sig = signals[i];
      if (!sig.active) continue;
      const syn = synapses[sig.synIdx];
      const fn = neurons[syn.from]; const tn = neurons[syn.to];
      const idx = di * 3;
      posArr[idx] = THREE.MathUtils.lerp(fn.position.x, tn.position.x, sig.progress);
      posArr[idx + 1] = THREE.MathUtils.lerp(fn.position.y, tn.position.y, sig.progress);
      posArr[idx + 2] = THREE.MathUtils.lerp(fn.position.z, tn.position.z, sig.progress);
      const fc = new THREE.Color(NEURON_COLORS[fn.layerIdx]);
      const tc = new THREE.Color(NEURON_COLORS[tn.layerIdx]);
      colArr[idx] = fc.r * (1 - sig.progress) + tc.r * sig.progress;
      colArr[idx + 1] = fc.g * (1 - sig.progress) + tc.g * sig.progress;
      colArr[idx + 2] = fc.b * (1 - sig.progress) + tc.b * sig.progress;
      di++;
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  useEffect(() => { return () => { geometry.dispose(); material.dispose(); }; }, [geometry, material]);

  return <points ref={pointsRef} geometry={geometry} material={material} />;
});

// ============================================================
// NEURAL NETWORK ORCHESTRATOR — Wave propagation + signals
// ============================================================

const NeuralNetwork = React.memo(function NeuralNetwork() {
  const { neurons, synapses } = useMemo(() => generateNetwork(), []);
  const nCount = neurons.length;
  const activationRef = useRef(new Float32Array(nCount));
  const signalRef = useRef<NeuronSignal[]>([]);
  const waveTimer = useRef(0);
  const waveLayer = useRef(-1);
  const waveActive = useRef(false);

  const layerStarts = useMemo(() => {
    const s: number[] = []; let a = 0;
    NEURON_LAYERS.forEach((l) => { s.push(a); a += l.count; });
    return s;
  }, []);

  useEffect(() => {
    const pool: NeuronSignal[] = [];
    for (let i = 0; i < MAX_NEURON_SIGNALS; i++) pool.push({ synIdx: 0, progress: 0, speed: 0, active: false });
    signalRef.current = pool;
  }, []);

  const getOutgoing = useCallback((nIdx: number) => {
    const r: number[] = [];
    for (let i = 0; i < synapses.length; i++) { if (synapses[i].from === nIdx) r.push(i); }
    return r;
  }, [synapses]);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const acts = activationRef.current;
    const sigs = signalRef.current;

    for (let i = 0; i < nCount; i++) { acts[i] *= 0.985; if (acts[i] < 0.01) acts[i] = 0; }

    // Mouse proximity
    const mx = mousePos.x * 8; const my = mousePos.y * 6;
    for (let i = 0; i < nCount; i++) {
      const n = neurons[i];
      const dx = n.position.x - mx; const dy = n.position.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 3.5) {
        acts[i] = Math.min(1.0, acts[i] + (1 - dist / 3.5) * 0.08);
        if (Math.random() < 0.02) {
          const out = getOutgoing(i);
          if (out.length > 0) {
            const slot = sigs.find(s => !s.active);
            if (slot) { slot.active = true; slot.synIdx = out[Math.floor(Math.random() * out.length)]; slot.progress = 0; slot.speed = 0.35 + Math.random() * 0.5; }
          }
        }
      }
    }

    // Wave propagation
    waveTimer.current += delta;
    if (!waveActive.current && waveTimer.current >= 4.0) {
      waveActive.current = true; waveTimer.current = 0; waveLayer.current = 0;
      const start = layerStarts[0];
      for (let i = 0; i < NEURON_LAYERS[0].count; i++) acts[start + i] = 0.6 + Math.random() * 0.4;
    }

    if (waveActive.current) {
      const lp = waveTimer.current / (1.8 / NEURON_LAYERS.length);
      if (lp >= 1 && waveLayer.current < NEURON_LAYERS.length - 1) {
        waveLayer.current++; waveTimer.current = 0;
        const li = waveLayer.current; const start = layerStarts[li];
        for (let i = 0; i < NEURON_LAYERS[li].count; i++) acts[start + i] = 0.5 + Math.random() * 0.5;
        if (li > 0) {
          const prevStart = layerStarts[li - 1];
          for (let ni = 0; ni < NEURON_LAYERS[li - 1].count; ni++) {
            const out = getOutgoing(prevStart + ni);
            const fire = out.sort(() => Math.random() - 0.5).slice(0, 2);
            for (const si of fire) {
              const slot = sigs.find(s => !s.active);
              if (slot) { slot.active = true; slot.synIdx = si; slot.progress = 0; slot.speed = 0.4 + Math.random() * 0.5; }
            }
          }
        }
      }
      if (waveLayer.current >= NEURON_LAYERS.length - 1 && waveTimer.current >= 1.8 / NEURON_LAYERS.length) {
        waveActive.current = false; waveTimer.current = 0;
      }
    }

    // Random ambient signals
    if (Math.random() < 0.06) {
      const slot = sigs.find(s => !s.active);
      if (slot) {
        const si = Math.floor(Math.random() * synapses.length);
        slot.active = true; slot.synIdx = si; slot.progress = 0; slot.speed = 0.25 + Math.random() * 0.45;
        acts[synapses[si].from] = Math.min(1.0, acts[synapses[si].from] + 0.2);
      }
    }

    // Update signals
    for (let i = 0; i < sigs.length; i++) {
      const sig = sigs[i]; if (!sig.active) continue;
      sig.progress += sig.speed * delta;
      if (sig.progress >= 1.0) {
        sig.active = false; sig.progress = 0;
        const dest = synapses[sig.synIdx].to;
        acts[dest] = Math.min(1.0, acts[dest] + 0.3);
        if (Math.random() < 0.25) {
          const out = getOutgoing(dest);
          if (out.length > 0) {
            const slot = sigs.find(s => !s.active);
            if (slot) { slot.active = true; slot.synIdx = out[Math.floor(Math.random() * out.length)]; slot.progress = 0; slot.speed = 0.35 + Math.random() * 0.5; }
          }
        }
      }
    }
  });

  return (
    <>
      <NetworkNeurons neurons={neurons} activationRef={activationRef} />
      <NetworkSynapses neurons={neurons} synapses={synapses} />
      <NetworkSignals neurons={neurons} synapses={synapses} signalRef={signalRef} />
    </>
  );
});

// ============================================================
// BACKGROUND PARTICLES — Ambient depth
// ============================================================

const BackgroundParticles = React.memo(function BackgroundParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, material, velocities } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(BG_PARTICLE_COUNT * 3);
    const col = new Float32Array(BG_PARTICLE_COUNT * 3);
    const vels: number[] = [];
    const palette = [
      [0.13, 0.83, 0.93], [0.66, 0.33, 0.97], [0.20, 0.83, 0.60],
      [0.55, 0.36, 0.97], [0.40, 0.60, 0.90],
    ];
    for (let i = 0; i < BG_PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
      vels.push(Math.random() * Math.PI * 2);
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2];
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uPR: { value: Math.min(window.devicePixelRatio, 1.2) } },
      vertexShader: `
        attribute vec3 aColor;
        varying vec3 vColor;
        uniform float uPR;
        void main() {
          vColor = aColor;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 2.5 * uPR * (80.0 / -gl_Position.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, dist) * 0.2;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
    });
    return { geometry: geo, material: mat, velocities: vels };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.getAttribute('position');
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < BG_PARTICLE_COUNT; i++) {
      const p = velocities[i];
      arr[i * 3] += Math.sin(t * 0.04 + p) * 0.0015;
      arr[i * 3 + 1] += Math.cos(t * 0.035 + p) * 0.0015;
      arr[i * 3 + 2] += Math.sin(t * 0.03 + p * 1.3) * 0.001;
      if (arr[i * 3] > 10) arr[i * 3] = -10;
      if (arr[i * 3] < -10) arr[i * 3] = 10;
      if (arr[i * 3 + 1] > 7) arr[i * 3 + 1] = -7;
      if (arr[i * 3 + 1] < -7) arr[i * 3 + 1] = 7;
    }
    posAttr.needsUpdate = true;
  });

  useEffect(() => { return () => { geometry.dispose(); material.dispose(); }; }, [geometry, material]);

  return <points ref={pointsRef} geometry={geometry} material={material} />;
});

// ============================================================
// FLOATING WIREFRAMES — Geometric accent shapes
// ============================================================

const WIREFRAME_CONFIGS = [
  { geo: 'icosahedron' as const, pos: [-8, 3.5, -5] as [number, number, number], rot: [0.012, 0.02, 0.006], s: 1.3, c: '#22d3ee', o: 0.03 },
  { geo: 'torus' as const, pos: [8, -3, -4] as [number, number, number], rot: [0.008, 0.015, 0.01], s: 1.5, c: '#a855f7', o: 0.025 },
  { geo: 'octahedron' as const, pos: [0.5, 5, -6] as [number, number, number], rot: [0.015, 0.018, 0.012], s: 1.0, c: '#34d399', o: 0.025 },
  { geo: 'dodecahedron' as const, pos: [-7, -4, -6] as [number, number, number], rot: [0.01, 0.015, 0.008], s: 0.8, c: '#8b5cf6', o: 0.03 },
  { geo: 'torusKnot' as const, pos: [6, 4.5, -7] as [number, number, number], rot: [0.006, 0.01, 0.005], s: 0.6, c: '#f59e0b', o: 0.02 },
];

const FloatingWireframe = React.memo(function FloatingWireframe({
  cfg,
}: { cfg: typeof WIREFRAME_CONFIGS[number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => {
    switch (cfg.geo) {
      case 'icosahedron': return new THREE.IcosahedronGeometry(1, 1);
      case 'torus': return new THREE.TorusGeometry(1, 0.3, 8, 16);
      case 'octahedron': return new THREE.OctahedronGeometry(1, 0);
      case 'dodecahedron': return new THREE.DodecahedronGeometry(1, 0);
      case 'torusKnot': return new THREE.TorusKnotGeometry(0.8, 0.25, 48, 8, 2, 3);
    }
  }, [cfg.geo]);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    color: cfg.c, wireframe: true, transparent: true, opacity: cfg.o,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), [cfg.c, cfg.o]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.x = t * cfg.rot[0];
    meshRef.current.rotation.y = t * cfg.rot[1];
    meshRef.current.rotation.z = t * cfg.rot[2];
    meshRef.current.position.y = cfg.pos[1] + Math.sin(t * 0.12 + cfg.pos[0]) * 0.5;
  });

  useEffect(() => { return () => { geo.dispose(); mat.dispose(); }; }, [geo, mat]);

  return <mesh ref={meshRef} position={cfg.pos} scale={cfg.s} geometry={geo} material={mat} />;
});

// ============================================================
// CAMERA RIG — Mouse parallax
// ============================================================

const CameraRig = React.memo(function CameraRig() {
  const { camera } = useThree();
  useFrame(() => {
    camera.rotation.y += (mousePos.x * 0.05 - camera.rotation.y) * 0.012;
    camera.rotation.x += (-mousePos.y * 0.025 - camera.rotation.x) * 0.012;
  });
  return null;
});

// ============================================================
// SCENE — All visual layers + post-processing
// ============================================================

const Scene = React.memo(function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <CameraRig />

      {/* Layer 1: Background Neural Network */}
      <NeuralNetwork />

      {/* Layer 2: Background Particles */}
      <BackgroundParticles />

      {/* Layer 3: Floating Wireframes */}
      {WIREFRAME_CONFIGS.map((cfg, i) => (
        <FloatingWireframe key={i} cfg={cfg} />
      ))}

      {/* Layer 4: Brain (centerpiece) */}
      <group position={[0, 0, 0]}>
        <BrainGlow />
        <BrainSurface />
        <BrainCortexShell />
        <BrainPathways />
        <BrainSignals />
        <OrbitalRings />
      </group>

      {/* Post-Processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.1}
          luminanceSmoothing={0.95}
          intensity={1.8}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
});

// ============================================================
// PARTICLE FIELD — Main exported component
// ============================================================

function MouseTracker() {
  useMouseTracker();
  return null;
}

const ParticleField = React.memo(function ParticleField() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }} aria-hidden="true">
      {mounted && (
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          dpr={1}
          gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
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
