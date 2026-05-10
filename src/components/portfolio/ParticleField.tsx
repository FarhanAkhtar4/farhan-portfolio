'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

// ============================================================
// CONFIGURATION — Brain Anatomy & Neural System
// ============================================================

const BRAIN_RADIUS = 1.8;
const BRAIN_WARP = [1.0, 0.88, 0.78] as [number, number, number];
const BG_PARTICLES = 200;
const MAX_PATHWAY_SIGNALS = 80;
const MAX_DISCHARGES = 12;

// Brain regions — anatomically inspired positions on the brain surface
const BRAIN_REGIONS = [
  { name: 'prefrontal', pos: [0.9, 0.5, 0.2], color: 0x22d3ee, size: 0.28 },
  { name: 'motor_cortex', pos: [0.7, 0.8, 0.3], color: 0x06b6d4, size: 0.22 },
  { name: 'somatosensory', pos: [0.3, 0.85, 0.55], color: 0x34d399, size: 0.24 },
  { name: 'parietal', pos: [-0.1, 0.8, 0.7], color: 0x10b981, size: 0.25 },
  { name: 'temporal', pos: [0.7, -0.1, 0.65], color: 0xa855f7, size: 0.26 },
  { name: 'occipital', pos: [-0.5, 0.2, 0.85], color: 0x8b5cf6, size: 0.24 },
  { name: 'cerebellum', pos: [-0.7, -0.5, 0.4], color: 0x6366f1, size: 0.3 },
  { name: 'brainstem', pos: [-0.3, -0.7, 0.1], color: 0x818cf8, size: 0.18 },
  { name: 'limbic', pos: [0.35, 0.15, 0.45], color: 0xf472b6, size: 0.2 },
  { name: 'basal_ganglia', pos: [0.5, -0.1, 0.3], color: 0xfb923c, size: 0.18 },
  // Right hemisphere mirror
  { name: 'prefrontal_r', pos: [-0.9, 0.5, -0.2], color: 0x22d3ee, size: 0.28 },
  { name: 'motor_r', pos: [-0.7, 0.8, -0.3], color: 0x06b6d4, size: 0.22 },
  { name: 'temporal_r', pos: [-0.7, -0.1, -0.65], color: 0xa855f7, size: 0.26 },
  { name: 'occipital_r', pos: [0.5, 0.2, -0.85], color: 0x8b5cf6, size: 0.24 },
  { name: 'parietal_r', pos: [0.1, 0.8, -0.7], color: 0x10b981, size: 0.25 },
  { name: 'cerebellum_r', pos: [0.7, -0.5, -0.4], color: 0x6366f1, size: 0.3 },
].map((r) => ({
  ...r,
  pos: new THREE.Vector3(...r.pos).multiplyScalar(BRAIN_RADIUS),
  color: new THREE.Color(r.color),
  activation: 0,
  lastFireTime: -10,
}));

// Neural pathway connections between regions
const PATHWAY_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 5], [0, 4], [4, 6], [6, 7], [0, 8], [8, 9],
  [9, 4], [5, 6], [3, 8], [1, 8], [0, 10], [10, 11], [11, 14], [14, 13],
  [13, 15], [10, 12], [12, 15], [8, 9], [0, 3], [5, 13], [3, 14], [4, 12],
  [7, 6], [7, 15], [0, 5], [2, 8], [11, 8],
];

// ============================================================
// MOUSE STATE
// ============================================================

const mouse = { x: 0, y: 0, ndcX: 0, ndcY: 0, ray: new THREE.Vector3(), active: false };

function useInputTracker() {
  const { camera } = useThree();
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = e.clientY / window.innerHeight;
      mouse.ndcX = mouse.x * 2 - 1;
      mouse.ndcY = -(mouse.y * 2 - 1);
      mouse.ray.set(mouse.ndcX, mouse.ndcY, 0.5).unproject(camera);
      mouse.ray.sub(camera.position).normalize();
      mouse.active = true;
    };
    const onClick = () => { triggerBrainCascade(); };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('click', onClick, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
    };
  }, [camera]);
}

// ============================================================
// BRAIN CASCADE SYSTEM — Global neural cascade manager
// ============================================================

let cascadeRegions = [...BRAIN_REGIONS];
let cascadeTriggerTime = -100;
let cascadeOriginRegion = -1;

function triggerBrainCascade() {
  cascadeTriggerTime = performance.now() / 1000;
  cascadeOriginRegion = Math.floor(Math.random() * cascadeRegions.length);
  cascadeRegions[cascadeOriginRegion].activation = 1.0;
  cascadeRegions[cascadeOriginRegion].lastFireTime = cascadeTriggerTime;
}

function updateCascadeSystem(elapsedTime: number, delta: number) {
  const regions = cascadeRegions;

  // Decay all activations
  for (let i = 0; i < regions.length; i++) {
    if (regions[i].activation > 0) {
      regions[i].activation *= Math.pow(0.92, delta * 60);
      if (regions[i].activation < 0.01) regions[i].activation = 0;
    }
  }

  // Propagate signals along pathways
  for (const [a, b] of PATHWAY_CONNECTIONS) {
    const rA = regions[a];
    const rB = regions[b];
    if (rA.activation > 0.3 && rB.lastFireTime < rA.lastFireTime) {
      const dist = rA.pos.distanceTo(rB.pos);
      const delay = dist * 0.25;
      const timeSinceFire = elapsedTime - rA.lastFireTime;
      if (timeSinceFire > delay && timeSinceFire < delay + 0.15) {
        rB.activation = Math.min(1.0, rA.activation * 0.85);
        rB.lastFireTime = elapsedTime;
      }
    }
  }

  // Mouse proximity activation
  if (mouse.active) {
    const rayOrigin = new THREE.Vector3(0, 0, 8);
    for (let i = 0; i < regions.length; i++) {
      const toRegion = regions[i].pos.clone().sub(rayOrigin);
      const proj = toRegion.dot(mouse.ray);
      if (proj < 0) continue;
      const closest = mouse.ray.clone().multiplyScalar(proj).add(rayOrigin);
      const dist = closest.distanceTo(regions[i].pos);
      if (dist < 1.2) {
        regions[i].activation = Math.min(1.0, regions[i].activation + delta * (1.2 - dist) * 0.8);
      }
    }
  }
}

// ============================================================
// BRAIN SURFACE — Detailed brain mesh with cortical folds
// ============================================================

const BrainSurface = React.memo(function BrainSurface() {
  const meshRef = useRef<THREE.Mesh>(null);
  const regions = cascadeRegions;

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(BRAIN_RADIUS, 5);

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uActivationMap: { value: new Float32Array(32) },
        uRegionPositions: { value: new Float32Array(32 * 3) },
        uRegionCount: { value: regions.length },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uActivationMap[16];
        uniform vec3 uRegionPositions[16];
        uniform float uRegionCount;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying float vActivation;
        varying float vDisp;

        // Cortical fold noise
        float foldNoise(vec3 p) {
          float d = 0.0;
          // Large sulci
          d += sin(p.x * 3.5 + p.y * 2.8 + 0.3) * 0.09;
          d += cos(p.y * 4.2 + p.z * 3.6 + 1.1) * 0.08;
          d += sin(p.z * 2.8 + p.x * 4.5 + 2.0) * 0.07;
          // Medium gyri
          d += sin(p.x * 7.0 + p.y * 6.5 + p.z * 5.5 + 0.5) * 0.04;
          d += cos(p.x * 9.0 + p.y * 8.5 + p.z * 7.5 + 1.2) * 0.025;
          // Fine texture
          d += sin(p.x * 14.0 + p.y * 12.0 + p.z * 11.0 + 0.7) * 0.012;
          d += cos(p.x * 20.0 + p.y * 18.0 + p.z * 16.0) * 0.006;
          return d;
        }

        // Central sulcus (longitudinal fissure)
        float fissureEffect(vec3 p) {
          float fissure = smoothstep(0.0, 0.15, abs(p.x));
          p.x += sign(p.x) * (1.0 - fissure) * 0.05;
          float lateral = smoothstep(0.0, 0.1, abs(p.z));
          p.z += sign(p.z) * (1.0 - lateral) * 0.02;
          return fissure * lateral;
        }

        void main() {
          vec3 pos = position;
          float disp = foldNoise(pos * 1.6);
          vDisp = disp;

          float fissure = fissureEffect(pos);
          pos += normal * disp;
          pos *= fissure > 0.5 ? 1.0 : (0.96 + fissure * 0.04);

          // Breathing
          float breathe = 1.0 + sin(uTime * 0.3) * 0.01;
          pos *= breathe;

          // Compute local activation from nearby regions
          vActivation = 0.0;
          for (int i = 0; i < 16; i++) {
            if (float(i) >= uRegionCount) break;
            float dist = distance(pos, uRegionPositions[i]);
            float influence = uActivationMap[i] / (1.0 + dist * dist * 2.0);
            vActivation = max(vActivation, influence);
          }
          vActivation = clamp(vActivation, 0.0, 1.0);

          // Activation pulse displacement
          pos += normal * vActivation * 0.06;

          vNormal = normalize(normalMatrix * normal);
          vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying float vActivation;
        varying float vDisp;

        void main() {
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);

          // Base brain color
          vec3 baseColor = vec3(0.12, 0.22, 0.45);
          vec3 ridgeColor = vec3(0.18, 0.35, 0.65);
          vec3 surfaceColor = mix(baseColor, ridgeColor, smoothstep(0.01, 0.06, abs(vDisp)));

          // Activation glow (neural response)
          vec3 activeColor = mix(
            vec3(0.1, 0.7, 1.0),
            vec3(0.8, 0.3, 1.0),
            sin(vActivation * 3.14159 + uTime * 2.0) * 0.5 + 0.5
          );
          surfaceColor = mix(surfaceColor, activeColor * 1.8, vActivation * 0.7);

          // Rim/edge glow
          vec3 rimColor = mix(vec3(0.3, 0.6, 1.0), vec3(0.6, 0.3, 1.0), fresnel);
          vec3 finalColor = mix(surfaceColor, rimColor, fresnel * 0.9);

          // Hemisphere lighting
          vec3 lightDir = normalize(vec3(0.5, 1.0, 0.8));
          float diff = max(dot(vNormal, lightDir), 0.0) * 0.2;
          finalColor += diff * vec3(0.2, 0.4, 0.8);

          // Activation pulse brightness
          finalColor += vec3(0.3, 0.5, 1.0) * vActivation * 0.5;

          // Global pulse
          float pulse = 0.93 + 0.07 * sin(uTime * 0.4);
          finalColor *= pulse;

          // Alpha
          float alpha = 0.05 + fresnel * 0.55;
          alpha += smoothstep(0.01, 0.07, abs(vDisp)) * 0.05;
          alpha += vActivation * 0.3;

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
    });

    return { geometry: geo, material: mat };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    material.uniforms.uTime.value = t;

    // Update activation data
    const actMap = material.uniforms.uActivationMap.value as Float32Array;
    const posMap = material.uniforms.uRegionPositions.value as Float32Array;
    for (let i = 0; i < regions.length; i++) {
      actMap[i] = regions[i].activation;
      posMap[i * 3] = regions[i].pos.x;
      posMap[i * 3 + 1] = regions[i].pos.y;
      posMap[i * 3 + 2] = regions[i].pos.z;
    }

    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.05;
      meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.06;
      meshRef.current.rotation.z = Math.cos(t * 0.07) * 0.03;
    }
  });

  useEffect(() => { return () => { geometry.dispose(); material.dispose(); }; }, [geometry, material]);

  return <mesh ref={meshRef} scale={BRAIN_WARP} geometry={geometry} material={material} />;
});

// ============================================================
// BRAIN CORE GLOW — Pulsing inner energy core
// ============================================================

const BrainCoreGlow = React.memo(function BrainCoreGlow() {
  const meshRef = useRef<THREE.Mesh>(null);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(BRAIN_RADIUS * 0.55, 3);
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      uniforms: { uTime: { value: 0 }, uActivation: { value: 0 } },
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
        uniform float uActivation;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main() {
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 1.5);

          vec3 glowA = vec3(0.08, 0.25, 0.75);
          vec3 glowB = vec3(0.3, 0.15, 0.9);
          vec3 glowActive = vec3(0.4, 0.7, 1.0);

          float base = (1.0 - fresnel) * 0.5;
          float pulse = 0.85 + 0.15 * sin(uTime * 0.6);

          vec3 glowColor = mix(glowA, glowB, fresnel);
          glowColor = mix(glowColor, glowActive, uActivation * 0.6);

          float intensity = base * pulse + uActivation * 0.3;
          gl_FragColor = vec4(glowColor, intensity);
        }
      `,
    });
    return { geometry: geo, material: mat };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    material.uniforms.uTime.value = t;

    // Average activation of all regions
    let avg = 0;
    for (let i = 0; i < cascadeRegions.length; i++) avg += cascadeRegions[i].activation;
    avg /= cascadeRegions.length;
    material.uniforms.uActivation.value = avg;

    if (meshRef.current) {
      const s = 1.0 + Math.sin(t * 0.35) * 0.05 + avg * 0.15;
      meshRef.current.scale.set(s * BRAIN_WARP[0], s * BRAIN_WARP[1], s * BRAIN_WARP[2]);
    }
  });

  useEffect(() => { return () => { geometry.dispose(); material.dispose(); }; }, [geometry, material]);

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
});

// ============================================================
// CORTICAL WIREFRAME — Brain surface wireframe shell
// ============================================================

const CorticalWireframe = React.memo(function CorticalWireframe() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(BRAIN_RADIUS * 1.015, 3), []);
  const material = useMemo(() => new THREE.ShaderMaterial({
    color: 0x4488cc,
    wireframe: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: { uTime: { value: 0 }, uActivation: { value: 0 } },
    vertexShader: `
      uniform float uTime;
      varying float vY;
      void main() {
        vY = position.y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uActivation;
      varying float vY;
      void main() {
        float wave = sin(vY * 3.0 + uTime * 1.5) * 0.5 + 0.5;
        float alpha = 0.025 + wave * 0.015 + uActivation * 0.04;
        vec3 color = mix(vec3(0.25, 0.5, 0.9), vec3(0.6, 0.4, 1.0), uActivation);
        gl_FragColor = vec4(color, alpha);
      }
    `,
  }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    material.uniforms.uTime.value = t;
    let avg = 0;
    for (let i = 0; i < cascadeRegions.length; i++) avg += cascadeRegions[i].activation;
    material.uniforms.uActivation.value = avg / cascadeRegions.length;

    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.05;
      meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.06;
    }
  });

  useEffect(() => { return () => { geometry.dispose(); material.dispose(); }; }, [geometry, material]);

  return <mesh ref={meshRef} scale={BRAIN_WARP} geometry={geometry} material={material} />;
});

// ============================================================
// NEURAL PATHWAYS — Curved connections between regions
// ============================================================

interface PathwayData {
  curve: THREE.CatmullRomCurve3;
  color: THREE.Color;
  fromIdx: number;
  toIdx: number;
  length: number;
}

function generatePathways(): PathwayData[] {
  return PATHWAY_CONNECTIONS.map(([a, b]) => {
    const from = cascadeRegions[a].pos;
    const to = cascadeRegions[b].pos;
    const mid = from.clone().add(to).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(BRAIN_RADIUS * 1.35);
    mid.x += (Math.random() - 0.5) * 0.3;
    mid.y += (Math.random() - 0.5) * 0.3;
    mid.z += (Math.random() - 0.5) * 0.3;

    const cp1 = from.clone().lerp(mid, 0.5);
    cp1.normalize().multiplyScalar(from.length() * 1.25);
    const cp2 = to.clone().lerp(mid, 0.5);
    cp2.normalize().multiplyScalar(to.length() * 1.25);

    const curve = new THREE.CatmullRomCurve3([from, cp1, mid, cp2, to]);
    const color = cascadeRegions[a].color.clone().lerp(cascadeRegions[b].color, 0.5);

    return { curve, color, fromIdx: a, toIdx: b, length: from.distanceTo(to) };
  });
}

const NeuralPathways = React.memo(function NeuralPathways() {
  const pathways = useMemo(() => generatePathways(), []);
  const groupRef = useRef<THREE.Group>(null);

  const lineObjects = useMemo(() => {
    return pathways.map((pw) => {
      const pts = pw.curve.getPoints(40);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uColor: { value: pw.color },
          uActivation: { value: 0 },
          uTime: { value: 0 },
        },
        vertexShader: `
          varying vec2 vUvCoord;
          void main() {
            vUvCoord = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform float uActivation;
          uniform float uTime;
          varying vec2 vUvCoord;
          void main() {
            float flow = fract(vUvCoord.x * 3.0 - uTime * 0.5);
            float pulse = smoothstep(0.0, 0.3, flow) * smoothstep(1.0, 0.7, flow);
            float alpha = 0.06 + pulse * 0.04 + uActivation * 0.15;
            vec3 color = mix(uColor, vec3(1.0), uActivation * 0.5);
            gl_FragColor = vec4(color, alpha);
          }
        `,
      });

      // Since ShaderMaterial doesn't compute UVs automatically, add them
      const uvs = new Float32Array(pts.length * 2);
      for (let i = 0; i < pts.length; i++) {
        uvs[i * 2] = i / (pts.length - 1);
        uvs[i * 2 + 1] = 0;
      }
      geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

      return { line: new THREE.Line(geo, mat), fromIdx: pw.fromIdx, toIdx: pw.toIdx };
    });
  }, [pathways]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    for (let i = 0; i < lineObjects.length; i++) {
      const obj = lineObjects[i];
      const mat = obj.line.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = t;
      const fromAct = cascadeRegions[obj.fromIdx].activation;
      const toAct = cascadeRegions[obj.toIdx].activation;
      mat.uniforms.uActivation.value = Math.max(fromAct, toAct);
    }
  });

  useEffect(() => {
    return () => lineObjects.forEach((o) => {
      o.line.geometry.dispose();
      (o.line.material as THREE.Material).dispose();
    });
  }, [lineObjects]);

  return (
    <group ref={groupRef}>
      {lineObjects.map((o, i) => <primitive key={i} object={o.line} />)}
    </group>
  );
});

// ============================================================
// PATHWAY SIGNALS — Neural impulses traveling along pathways
// ============================================================

interface PathSignal {
  pathwayIdx: number;
  progress: number;
  speed: number;
  active: boolean;
  intensity: number;
}

const PathwaySignals = React.memo(function PathwaySignals() {
  const pointsRef = useRef<THREE.Points>(null);
  const trailRef = useRef<THREE.Points>(null);
  const pathways = useMemo(() => generatePathways(), []);

  const signalPool = useRef<PathSignal[]>([]);
  const spawnTimer = useRef(0);

  useEffect(() => {
    const pool: PathSignal[] = [];
    for (let i = 0; i < MAX_PATHWAY_SIGNALS; i++) {
      pool.push({ pathwayIdx: 0, progress: 0, speed: 0, active: false, intensity: 0 });
    }
    signalPool.current = pool;
  }, []);

  // Main signal points
  const { geometry: sigGeo, material: sigMat } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX_PATHWAY_SIGNALS * 3), 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(MAX_PATHWAY_SIGNALS * 3), 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(MAX_PATHWAY_SIGNALS), 1));
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uPR: { value: Math.min(window.devicePixelRatio, 1.5) } },
      vertexShader: `
        attribute vec3 aColor;
        attribute float aSize;
        varying vec3 vColor;
        uniform float uPR;
        void main() {
          vColor = aColor;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uPR * (220.0 / -gl_Position.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float core = pow(smoothstep(0.5, 0.0, dist), 2.5);
          float glow = smoothstep(0.5, 0.08, dist) * 0.5;
          vec3 color = mix(vColor, vec3(1.0), core * 0.95);
          gl_FragColor = vec4(color * 3.0, core * 0.95 + glow * 0.4);
        }
      `,
    });
    return { geometry: sigGeo, material: sigMat };
  }, []);

  // Trail points (secondary, dimmer)
  const TRAIL_COUNT = MAX_PATHWAY_SIGNALS * 4;
  const { geometry: trailGeo, material: trailMat } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TRAIL_COUNT * 3), 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(TRAIL_COUNT * 3), 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(TRAIL_COUNT), 1));
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uPR: { value: Math.min(window.devicePixelRatio, 1.5) } },
      vertexShader: `
        attribute vec3 aColor;
        attribute float aSize;
        varying vec3 vColor;
        uniform float uPR;
        void main() {
          vColor = aColor;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uPR * (180.0 / -gl_Position.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float core = pow(smoothstep(0.5, 0.0, dist), 1.5);
          gl_FragColor = vec4(vColor * 1.5, core * 0.6);
        }
      `,
    });
    return { geometry: trailGeo, material: trailMat };
  }, []);

  useFrame(({ clock }, delta) => {
    if (!pointsRef.current || !trailRef.current) return;
    const t = clock.getElapsedTime();

    // Spawn signals — higher rate when cascading
    let globalAct = 0;
    for (let i = 0; i < cascadeRegions.length; i++) globalAct += cascadeRegions[i].activation;
    globalAct /= cascadeRegions.length;

    spawnTimer.current += delta;
    const spawnInterval = Math.max(0.04, 0.2 - globalAct * 0.16);
    if (spawnTimer.current > spawnInterval) {
      spawnTimer.current = 0;
      const spawnChance = 0.4 + globalAct * 0.5;
      if (Math.random() < spawnChance) {
        const slot = signalPool.current.find(s => !s.active);
        if (slot) {
          // Prefer activated pathways
          let pwIdx = Math.floor(Math.random() * pathways.length);
          if (globalAct > 0.1) {
            const activated = pathways
              .map((p, i) => ({ i, act: Math.max(cascadeRegions[p.fromIdx].activation, cascadeRegions[p.toIdx].activation) }))
              .filter(p => p.act > 0.15)
              .sort((a, b) => b.act - a.act);
            if (activated.length > 0) {
              pwIdx = activated[Math.floor(Math.random() * Math.min(5, activated.length))].i;
            }
          }
          slot.active = true;
          slot.pathwayIdx = pwIdx;
          slot.progress = 0;
          slot.speed = 0.2 + Math.random() * 0.5 + globalAct * 0.3;
          slot.intensity = 0.5 + Math.random() * 0.5;
        }
      }
    }

    // Update signals
    const signals = signalPool.current;
    const posAttr = pointsRef.current.geometry.getAttribute('position')!;
    const colAttr = pointsRef.current.geometry.getAttribute('aColor')!;
    const sizeAttr = pointsRef.current.geometry.getAttribute('aSize')!;
    const posArr = posAttr.array as Float32Array;
    const colArr = colAttr.array as Float32Array;
    const sizeArr = sizeAttr.array as Float32Array;
    posArr.fill(0); colArr.fill(0); sizeArr.fill(0);

    const tPosAttr = trailRef.current.geometry.getAttribute('position')!;
    const tColAttr = trailRef.current.geometry.getAttribute('aColor')!;
    const tSizeAttr = trailRef.current.geometry.getAttribute('aSize')!;
    const tPosArr = tPosAttr.array as Float32Array;
    const tColArr = tColAttr.array as Float32Array;
    const tSizeArr = tSizeAttr.array as Float32Array;
    tPosArr.fill(0); tColArr.fill(0); tSizeArr.fill(0);

    let drawIdx = 0;
    let trailIdx = 0;

    for (let i = 0; i < signals.length && drawIdx < MAX_PATHWAY_SIGNALS; i++) {
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
      posArr[idx] = pt.x; posArr[idx + 1] = pt.y; posArr[idx + 2] = pt.z;

      // Color with activation-based intensity
      const r = pw.color.r * (0.8 + 0.2 * Math.sin(t * 4 + sig.progress * 8));
      const g = pw.color.g * (0.8 + 0.2 * Math.cos(t * 4 + sig.progress * 8));
      const b = pw.color.b;
      colArr[idx] = r; colArr[idx + 1] = g; colArr[idx + 2] = b;

      // Size: bigger at midpoint
      const sizeFactor = Math.sin(sig.progress * Math.PI);
      sizeArr[drawIdx] = (5.0 + sizeFactor * 12.0) * sig.intensity;

      // Draw trail particles
      const trailCount = 6;
      for (let ti = 1; ti <= trailCount && trailIdx < TRAIL_COUNT; ti++) {
        const trailProg = Math.max(0, sig.progress - ti * 0.025);
        const trailPt = pw.curve.getPointAt(trailProg);
        const tIdx = trailIdx * 3;
        tPosArr[tIdx] = trailPt.x; tPosArr[tIdx + 1] = trailPt.y; tPosArr[tIdx + 2] = trailPt.z;
        const fade = 1 - ti / (trailCount + 1);
        tColArr[tIdx] = r * fade * 0.6; tColArr[tIdx + 1] = g * fade * 0.6; tColArr[tIdx + 2] = b * fade * 0.6;
        tSizeArr[trailIdx] = (2.0 + sizeFactor * 5.0) * fade * sig.intensity;
        trailIdx++;
      }

      drawIdx++;
    }

    posAttr.needsUpdate = true; colAttr.needsUpdate = true; sizeAttr.needsUpdate = true;
    tPosAttr.needsUpdate = true; tColAttr.needsUpdate = true; tSizeAttr.needsUpdate = true;
  });

  useEffect(() => {
    return () => {
      sigGeo.dispose(); sigMat.dispose();
      trailGeo.dispose(); trailMat.dispose();
    };
  }, [sigGeo, sigMat, trailGeo, trailMat]);

  return (
    <>
      <points ref={trailRef} geometry={trailGeo} material={trailMat} />
      <points ref={pointsRef} geometry={sigGeo} material={sigMat} />
    </>
  );
});

// ============================================================
// REGION NODES — Glowing nodes at brain regions
// ============================================================

const RegionNodes = React.memo(function RegionNodes() {
  const pointsRef = useRef<THREE.Points>(null);
  const regions = cascadeRegions;

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const n = regions.length;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const baseSize = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = regions[i].pos.x;
      pos[i * 3 + 1] = regions[i].pos.y;
      pos[i * 3 + 2] = regions[i].pos.z;
      col[i * 3] = regions[i].color.r;
      col[i * 3 + 1] = regions[i].color.g;
      col[i * 3 + 2] = regions[i].color.b;
      baseSize[i] = regions[i].size;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('aBaseSize', new THREE.BufferAttribute(baseSize, 1));

    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uPR: { value: Math.min(window.devicePixelRatio, 1.5) } },
      vertexShader: `
        attribute vec3 aColor;
        attribute float aBaseSize;
        varying vec3 vColor;
        uniform float uPR;
        void main() {
          vColor = aColor;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aBaseSize * uPR * (250.0 / -gl_Position.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float core = pow(smoothstep(0.5, 0.0, dist), 2.0);
          float glow = smoothstep(0.5, 0.1, dist) * 0.4;
          float halo = smoothstep(0.5, 0.3, dist) * 0.15;
          vec3 color = mix(vColor, vec3(1.0), core * 0.85);
          gl_FragColor = vec4(color * 2.0, core * 0.9 + glow + halo);
        }
      `,
    });
    return { geometry: geo, material: mat };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.getAttribute('position')!;
    const sizeAttr = pointsRef.current.geometry.getAttribute('aBaseSize')!;
    const posArr = posAttr.array as Float32Array;
    const sizeArr = sizeAttr.array as Float32Array;

    for (let i = 0; i < regions.length; i++) {
      const r = regions[i];
      // Slight breathing movement
      posArr[i * 3] = r.pos.x + Math.sin(t * 0.4 + i * 1.3) * 0.02;
      posArr[i * 3 + 1] = r.pos.y + Math.cos(t * 0.35 + i * 0.9) * 0.03;
      posArr[i * 3 + 2] = r.pos.z + Math.sin(t * 0.3 + i * 1.7) * 0.02;

      // Size pulses with activation
      sizeArr[i] = r.size * (1.0 + r.activation * 1.5 + Math.sin(t * 2 + i) * 0.1);
    }

    posAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;
  });

  useEffect(() => { return () => { geometry.dispose(); material.dispose(); }; }, [geometry, material]);

  return <points ref={pointsRef} geometry={geometry} material={material} />;
});

// ============================================================
// ELECTRICAL DISCHARGES — Lightning arcs between active regions
// ============================================================

interface Discharge {
  fromIdx: number;
  toIdx: number;
  life: number;
  maxLife: number;
  points: Float32Array;
}

const ElectricalDischarges = React.memo(function ElectricalDischarges() {
  const groupRef = useRef<THREE.Group>(null);
  const discharges = useRef<Discharge[]>([]);
  const spawnTimer = useRef(0);
  const lineRefs = useRef<(THREE.Line | null)[]>([]);

  useEffect(() => { return () => { discharges.current = []; }; }, []);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Spawn discharges between highly activated regions
    spawnTimer.current += delta;
    if (spawnTimer.current > 0.3) {
      spawnTimer.current = 0;
      for (let i = 0; i < cascadeRegions.length; i++) {
        if (cascadeRegions[i].activation < 0.4) continue;
        for (let j = i + 1; j < cascadeRegions.length; j++) {
          if (cascadeRegions[j].activation < 0.3) continue;
          if (Math.random() > 0.3) continue;
          const existing = discharges.current.find(
            d => d.life > 0 && ((d.fromIdx === i && d.toIdx === j) || (d.fromIdx === j && d.toIdx === i))
          );
          if (existing) continue;
          if (discharges.current.filter(d => d.life > 0).length >= MAX_DISCHARGES) continue;

          // Generate jagged lightning points
          const from = cascadeRegions[i].pos;
          const to = cascadeRegions[j].pos;
          const segments = 8 + Math.floor(Math.random() * 6);
          const pts = new Float32Array((segments + 1) * 3);
          for (let s = 0; s <= segments; s++) {
            const frac = s / segments;
            pts[s * 3] = THREE.MathUtils.lerp(from.x, to.x, frac) + (s > 0 && s < segments ? (Math.random() - 0.5) * 0.3 : 0);
            pts[s * 3 + 1] = THREE.MathUtils.lerp(from.y, to.y, frac) + (s > 0 && s < segments ? (Math.random() - 0.5) * 0.3 : 0);
            pts[s * 3 + 2] = THREE.MathUtils.lerp(from.z, to.z, frac) + (s > 0 && s < segments ? (Math.random() - 0.5) * 0.3 : 0);
          }

          discharges.current.push({
            fromIdx: i, toIdx: j,
            life: 0.2 + Math.random() * 0.3,
            maxLife: 0.2 + Math.random() * 0.3,
            points: pts,
          });
          break;
        }
      }
    }

    // Update discharges - manage line objects
    const activeDischarges = discharges.current.filter(d => d.life > 0);

    // Remove excess line objects
    while (groupRef.current.children.length > activeDischarges.length) {
      const child = groupRef.current.children[groupRef.current.children.length - 1];
      groupRef.current.remove(child);
      if (child instanceof THREE.Line) {
        child.geometry.dispose();
        (child.material as THREE.Material).dispose();
      }
    }

    // Create/update line objects
    for (let i = 0; i < activeDischarges.length; i++) {
      const d = activeDischarges[i];
      d.life -= delta;

      // Regenerate jagged points for flickering effect
      const from = cascadeRegions[d.fromIdx].pos;
      const to = cascadeRegions[d.toIdx].pos;
      const segments = (d.points.length / 3) - 1;
      for (let s = 1; s < segments; s++) {
        const frac = s / segments;
        d.points[s * 3] = THREE.MathUtils.lerp(from.x, to.x, frac) + (Math.random() - 0.5) * 0.25;
        d.points[s * 3 + 1] = THREE.MathUtils.lerp(from.y, to.y, frac) + (Math.random() - 0.5) * 0.25;
        d.points[s * 3 + 2] = THREE.MathUtils.lerp(from.z, to.z, frac) + (Math.random() - 0.5) * 0.25;
      }

      const lifeRatio = d.life / d.maxLife;
      const color = cascadeRegions[d.fromIdx].color.clone().lerp(cascadeRegions[d.toIdx].color, 0.5);

      if (i >= groupRef.current.children.length) {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(d.points, 3));
        const mat = new THREE.LineBasicMaterial({
          color: color,
          transparent: true,
          opacity: lifeRatio * 0.8,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const line = new THREE.Line(geo, mat);
        groupRef.current.add(line);
      } else {
        const child = groupRef.current.children[i] as THREE.Line;
        const posAttr = child.geometry.getAttribute('position');
        if (posAttr) {
          (posAttr.array as Float32Array).set(d.points);
          posAttr.needsUpdate = true;
        }
        (child.material as THREE.LineBasicMaterial).opacity = lifeRatio * 0.8;
        (child.material as THREE.LineBasicMaterial).color.copy(color);
      }
    }

    // Cleanup expired discharges
    discharges.current = discharges.current.filter(d => d.life > 0);
  });

  return <group ref={groupRef} />;
});

// ============================================================
// ORBITAL RINGS — Sci-fi rings around brain
// ============================================================

const RING_CONFIGS = [
  { radius: 2.9, tube: 0.005, tilt: [0.3, 0, 0.1], speed: 0.1, color: 0x22d3ee, opacity: 0.08, segments: 6 },
  { radius: 3.4, tube: 0.004, tilt: [1.3, 0.4, 0.2], speed: -0.07, color: 0xa855f7, opacity: 0.06, segments: 8 },
  { radius: 2.5, tube: 0.006, tilt: [0.7, 0, 0.8], speed: 0.05, color: 0x34d399, opacity: 0.05, segments: 5 },
  { radius: 3.8, tube: 0.003, tilt: [2.0, 0.6, 0.3], speed: -0.04, color: 0x6366f1, opacity: 0.04, segments: 10 },
];

const OrbitalRings = React.memo(function OrbitalRings() {
  const groupRef = useRef<THREE.Group>(null);

  const rings = useMemo(() => {
    return RING_CONFIGS.map((r) => ({
      geometry: new THREE.TorusGeometry(r.radius, r.tube, 16, 120),
      material: new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: new THREE.Color(r.color) }, uOpacity: { value: r.opacity }, uTime: { value: 0 }, uSegments: { value: r.segments } },
        vertexShader: `
          varying vec2 vUvCoord;
          void main() {
            vUvCoord = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform float uOpacity;
          uniform float uTime;
          uniform float uSegments;
          varying vec2 vUvCoord;
          void main() {
            float seg = fract(vUvCoord.x * uSegments - uTime * 0.3);
            float pulse = smoothstep(0.0, 0.15, seg) * smoothstep(0.5, 0.35, seg);
            float alpha = uOpacity + pulse * 0.06;
            gl_FragColor = vec4(uColor, alpha);
          }
        `,
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
      (child.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
    });
  });

  useEffect(() => {
    return () => rings.forEach((r) => { r.geometry.dispose(); r.material.dispose(); });
  }, [rings]);

  return (
    <group ref={groupRef} scale={BRAIN_WARP}>
      {rings.map((r, i) => <mesh key={i} geometry={r.geometry} material={r.material} rotation={r.tilt} />)}
    </group>
  );
});

// ============================================================
// BACKGROUND PARTICLES — Ambient depth atmosphere
// ============================================================

const BackgroundParticles = React.memo(function BackgroundParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, material, velocities } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(BG_PARTICLES * 3);
    const col = new Float32Array(BG_PARTICLES * 3);
    const sizes = new Float32Array(BG_PARTICLES);
    const vels: number[] = [];
    const palette = [
      [0.13, 0.83, 0.93], [0.66, 0.33, 0.97], [0.20, 0.83, 0.60],
      [0.55, 0.36, 0.97], [0.40, 0.60, 0.90], [0.98, 0.45, 0.80],
    ];
    for (let i = 0; i < BG_PARTICLES; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 2;
      vels.push(Math.random() * Math.PI * 2);
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2];
      sizes[i] = 0.5 + Math.random() * 1.5;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uPR: { value: Math.min(window.devicePixelRatio, 1.2) } },
      vertexShader: `
        attribute vec3 aColor;
        attribute float aSize;
        varying vec3 vColor;
        uniform float uPR;
        void main() {
          vColor = aColor;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uPR * (90.0 / -gl_Position.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, dist) * 0.25;
          float core = pow(smoothstep(0.5, 0.0, dist), 2.0) * 0.3;
          gl_FragColor = vec4(vColor, alpha + core);
        }
      `,
    });
    return { geometry: geo, material: mat, velocities: vels };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.getAttribute('position')!;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < BG_PARTICLES; i++) {
      const p = velocities[i];
      arr[i * 3] += Math.sin(t * 0.04 + p) * 0.0012;
      arr[i * 3 + 1] += Math.cos(t * 0.035 + p) * 0.0012;
      arr[i * 3 + 2] += Math.sin(t * 0.03 + p * 1.3) * 0.0008;
      if (arr[i * 3] > 12.5) arr[i * 3] = -12.5;
      if (arr[i * 3] < -12.5) arr[i * 3] = 12.5;
      if (arr[i * 3 + 1] > 8) arr[i * 3 + 1] = -8;
      if (arr[i * 3 + 1] < -8) arr[i * 3 + 1] = 8;
    }
    posAttr.needsUpdate = true;
  });

  useEffect(() => { return () => { geometry.dispose(); material.dispose(); }; }, [geometry, material]);

  return <points ref={pointsRef} geometry={geometry} material={material} />;
});

// ============================================================
// FLOATING WIREFRAMES — Geometric accents for depth
// ============================================================

const WIREFRAME_CONFIGS = [
  { geo: 'icosahedron' as const, pos: [-9, 4, -6] as [number, number, number], rot: [0.012, 0.02, 0.006], s: 1.4, c: '#22d3ee', o: 0.025 },
  { geo: 'torus' as const, pos: [9, -3.5, -5] as [number, number, number], rot: [0.008, 0.015, 0.01], s: 1.6, c: '#a855f7', o: 0.02 },
  { geo: 'octahedron' as const, pos: [0.5, 5.5, -7] as [number, number, number], rot: [0.015, 0.018, 0.012], s: 1.1, c: '#34d399', o: 0.02 },
  { geo: 'dodecahedron' as const, pos: [-8, -4.5, -7] as [number, number, number], rot: [0.01, 0.015, 0.008], s: 0.9, c: '#8b5cf6', o: 0.025 },
  { geo: 'torusKnot' as const, pos: [7, 5, -8] as [number, number, number], rot: [0.006, 0.01, 0.005], s: 0.7, c: '#f472b6', o: 0.018 },
  { geo: 'icosahedron' as const, pos: [-5, -6, -4] as [number, number, number], rot: [-0.01, 0.012, 0.008], s: 0.6, c: '#06b6d4', o: 0.015 },
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
    meshRef.current.position.y = cfg.pos[1] + Math.sin(t * 0.1 + cfg.pos[0]) * 0.5;
  });

  useEffect(() => { return () => { geo.dispose(); mat.dispose(); }; }, [geo, mat]);

  return <mesh ref={meshRef} position={cfg.pos} scale={cfg.s} geometry={geo} material={mat} />;
});

// ============================================================
// ORBITAL CAMERA — Smooth 360° auto-rotation + mouse parallax
// ============================================================

const OrbitalCamera = React.memo(function OrbitalCamera() {
  const { camera } = useThree();
  const angle = useRef(0);
  const targetAngle = useRef(0);
  const elevation = useRef(0.15);
  const targetElevation = useRef(0.15);

  useFrame((_, delta) => {
    // Auto orbit
    angle.current += delta * 0.15;
    targetAngle.current = angle.current;

    // Mouse influence on elevation and slight orbit speed change
    targetElevation.current = 0.15 + mouse.ndcY * 0.2;
    elevation.current += (targetElevation.current - elevation.current) * 0.02;

    const orbitRadius = 7.5;
    const x = Math.sin(targetAngle.current + mouse.ndcX * 0.3) * orbitRadius;
    const y = elevation.current * orbitRadius;
    const z = Math.cos(targetAngle.current + mouse.ndcX * 0.3) * orbitRadius;

    camera.position.x += (x - camera.position.x) * 0.03;
    camera.position.y += (y - camera.position.y) * 0.03;
    camera.position.z += (z - camera.position.z) * 0.03;
    camera.lookAt(0, 0, 0);
  });

  return null;
});

// ============================================================
// AMBIENT CASCADE — Auto-trigger cascades periodically
// ============================================================

const AmbientCascade = React.memo(function AmbientCascade() {
  const timer = useRef(0);

  useFrame(({ clock }, delta) => {
    timer.current += delta;

    // Auto-trigger cascade every 3-5 seconds
    if (timer.current > 3 + Math.sin(clock.getElapsedTime() * 0.3) * 1.5) {
      timer.current = 0;

      // Check if there's already significant activity
      let totalAct = 0;
      for (let i = 0; i < cascadeRegions.length; i++) totalAct += cascadeRegions[i].activation;
      if (totalAct < 2.0) {
        // Pick a random region to fire
        const regionIdx = Math.floor(Math.random() * cascadeRegions.length);
        const elapsed = clock.getElapsedTime();
        cascadeRegions[regionIdx].activation = 0.7 + Math.random() * 0.3;
        cascadeRegions[regionIdx].lastFireTime = elapsed;
      }
    }

    // Update global cascade system
    updateCascadeSystem(clock.getElapsedTime(), delta);
  });

  return null;
});

// ============================================================
// SCENE — All visual layers orchestrated
// ============================================================

const Scene = React.memo(function Scene() {
  return (
    <>
      <ambientLight intensity={0.1} />

      {/* Camera system */}
      <OrbitalCamera />

      {/* Cascade manager */}
      <AmbientCascade />

      {/* Layer 1: Background atmosphere */}
      <BackgroundParticles />

      {/* Layer 2: Floating geometric accents */}
      {WIREFRAME_CONFIGS.map((cfg, i) => (
        <FloatingWireframe key={i} cfg={cfg} />
      ))}

      {/* Layer 3: Brain core (centerpiece) */}
      <group>
        <BrainCoreGlow />
        <BrainSurface />
        <CorticalWireframe />
        <RegionNodes />
        <NeuralPathways />
        <PathwaySignals />
        <ElectricalDischarges />
        <OrbitalRings />
      </group>

      {/* Post-Processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
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

const ParticleField = React.memo(function ParticleField() {
  const [mounted, setMounted] = useState(false);
  const [hasError, setHasError] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (hasError) return null;

  return (
    <div className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }} aria-hidden="true">
      {mounted && (
        <React.Suspense fallback={null}>
          <Canvas
            camera={{ position: [0, 1, 7.5], fov: 50 }}
            dpr={[1, 1.5]}
            gl={{
              antialias: false,
              alpha: true,
              powerPreference: 'high-performance',
              stencil: false,
            }}
            style={{ background: 'transparent' }}
            frameloop="always"
            onError={() => setHasError(true)}
          >
            <InputTracker />
            <Scene />
          </Canvas>
        </React.Suspense>
      )}
    </div>
  );
});

function InputTracker() {
  useInputTracker();
  return null;
}

export default ParticleField;
