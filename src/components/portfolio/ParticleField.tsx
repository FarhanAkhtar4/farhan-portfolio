'use client';

import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

// ============================================================
// PLAIN DATA — No THREE objects at module scope
// ============================================================

const BRAIN_RADIUS = 1.8;
const BRAIN_WARP: [number, number, number] = [1.0, 0.88, 0.78];
const BG_PARTICLES = 150;
const MAX_SIGNALS = 60;
const MAX_TRAILS = 240;
const MAX_DISCHARGES = 10;

// Raw region data (plain arrays, no THREE objects)
const REGION_RAW = [
  { name: 'prefrontal', pos: [0.9, 0.5, 0.2], hex: 0x22d3ee, size: 0.28 },
  { name: 'motor', pos: [0.7, 0.8, 0.3], hex: 0x06b6d4, size: 0.22 },
  { name: 'somatosensory', pos: [0.3, 0.85, 0.55], hex: 0x34d399, size: 0.24 },
  { name: 'parietal', pos: [-0.1, 0.8, 0.7], hex: 0x10b981, size: 0.25 },
  { name: 'temporal', pos: [0.7, -0.1, 0.65], hex: 0xa855f7, size: 0.26 },
  { name: 'occipital', pos: [-0.5, 0.2, 0.85], hex: 0x8b5cf6, size: 0.24 },
  { name: 'cerebellum', pos: [-0.7, -0.5, 0.4], hex: 0x6366f1, size: 0.3 },
  { name: 'brainstem', pos: [-0.3, -0.7, 0.1], hex: 0x818cf8, size: 0.18 },
  { name: 'limbic', pos: [0.35, 0.15, 0.45], hex: 0xf472b6, size: 0.2 },
  { name: 'basal_ganglia', pos: [0.5, -0.1, 0.3], hex: 0xfb923c, size: 0.18 },
  { name: 'prefrontal_r', pos: [-0.9, 0.5, -0.2], hex: 0x22d3ee, size: 0.28 },
  { name: 'motor_r', pos: [-0.7, 0.8, -0.3], hex: 0x06b6d4, size: 0.22 },
  { name: 'temporal_r', pos: [-0.7, -0.1, -0.65], hex: 0xa855f7, size: 0.26 },
  { name: 'occipital_r', pos: [0.5, 0.2, -0.85], hex: 0x8b5cf6, size: 0.24 },
  { name: 'parietal_r', pos: [0.1, 0.8, -0.7], hex: 0x10b981, size: 0.25 },
  { name: 'cerebellum_r', pos: [0.7, -0.5, -0.4], hex: 0x6366f1, size: 0.3 },
];

const CONNECTIONS: [number, number][] = [
  [0,1],[1,2],[2,3],[3,5],[0,4],[4,6],[6,7],[0,8],[8,9],
  [9,4],[5,6],[3,8],[1,8],[0,10],[10,11],[11,14],[14,13],
  [13,15],[10,12],[12,15],[0,3],[5,13],[3,14],[4,12],
  [7,6],[7,15],[0,5],[2,8],[11,8],
];

// ============================================================
// BRAIN STATE — Inside component, not module scope
// ============================================================

interface RegionState {
  pos: THREE.Vector3;
  color: THREE.Color;
  activation: number;
  lastFire: number;
  baseSize: number;
}

function initRegions(): RegionState[] {
  return REGION_RAW.map(r => ({
    pos: new THREE.Vector3(r.pos[0], r.pos[1], r.pos[2]).multiplyScalar(BRAIN_RADIUS),
    color: new THREE.Color(r.hex),
    activation: 0,
    lastFire: -10,
    baseSize: r.size,
  }));
}

function initPathways(regions: RegionState[]) {
  return CONNECTIONS.map(([a, b]) => {
    const from = regions[a].pos;
    const to = regions[b].pos;
    const mid = from.clone().add(to).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(BRAIN_RADIUS * 1.3);
    mid.x += (Math.random() - 0.5) * 0.3;
    mid.y += (Math.random() - 0.5) * 0.3;
    mid.z += (Math.random() - 0.5) * 0.3;
    const cp1 = from.clone().lerp(mid, 0.5).normalize().multiplyScalar(from.length() * 1.2);
    const cp2 = to.clone().lerp(mid, 0.5).normalize().multiplyScalar(to.length() * 1.2);
    return {
      curve: new THREE.CatmullRomCurve3([from, cp1, mid, cp2, to]),
      color: regions[a].color.clone().lerp(regions[b].color, 0.5),
      from: a, to: b,
    };
  });
}

// ============================================================
// MOUSE TRACKER — Simple, no camera dependency
// ============================================================

const mouseState = { x: 0, y: 0 };

function useMouseTracker() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseState.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseState.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);
}

// ============================================================
// BRAIN MESH — Cortical surface with activation glow
// ============================================================

const BrainMesh = React.memo(function BrainMesh({ regionsRef }: { regionsRef: React.RefObject<RegionState[]> }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(BRAIN_RADIUS, 4);
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uAvgAct: { value: 0 } },
      vertexShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        varying float vDisp;

        float noise(vec3 p) {
          float d = 0.0;
          d += sin(p.x*4.0+p.y*3.5+0.5)*0.07;
          d += cos(p.y*5.0+p.z*4.5+1.2)*0.06;
          d += sin(p.z*3.0+p.x*5.0+2.1)*0.05;
          d += sin(p.x*8.0+p.y*7.0+p.z*6.0+0.7)*0.03;
          d += cos(p.x*11.0+p.y*10.0+p.z*9.0+1.5)*0.018;
          return d;
        }

        void main() {
          vec3 pos = position;
          float disp = noise(pos * 1.8);
          vDisp = disp;
          pos += normal * disp;
          float breathe = 1.0 + sin(uTime * 0.35) * 0.012;
          pos *= breathe;
          vNormal = normalize(normalMatrix * normal);
          vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uAvgAct;
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        varying float vDisp;

        void main() {
          vec3 viewDir = normalize(cameraPosition - vWorldPos);
          float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.8);
          vec3 base = vec3(0.12, 0.22, 0.45);
          vec3 ridge = vec3(0.18, 0.35, 0.65);
          vec3 surf = mix(base, ridge, smoothstep(0.01, 0.07, abs(vDisp)));
          vec3 rim = mix(vec3(0.3,0.6,1.0), vec3(0.6,0.4,1.0), fresnel);
          vec3 active = mix(vec3(0.1,0.7,1.0), vec3(0.8,0.3,1.0), sin(uTime*2.0)*0.5+0.5);
          surf = mix(surf, active*1.8, uAvgAct*0.6);
          vec3 col = mix(surf, rim, fresnel*0.85);
          col += vec3(0.2,0.4,0.8)*max(dot(vNormal, normalize(vec3(0.5,1.0,0.8))),0.0)*0.25;
          col += vec3(0.3,0.5,1.0)*uAvgAct*0.4;
          col *= 0.93 + 0.07*sin(uTime*0.4);
          float alpha = 0.06 + fresnel*0.5 + smoothstep(0.015,0.08,abs(vDisp))*0.06 + uAvgAct*0.25;
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });
    return { geometry: geo, material: mat };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    material.uniforms.uTime.value = t;
    const regions = regionsRef.current;
    if (!regions) return;
    let avg = 0;
    for (let i = 0; i < regions.length; i++) avg += regions[i].activation;
    material.uniforms.uAvgAct.value = avg / regions.length;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.05;
      meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.06;
      meshRef.current.rotation.z = Math.cos(t * 0.07) * 0.03;
    }
  });

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  return <mesh ref={meshRef} scale={BRAIN_WARP} geometry={geometry} material={material} />;
});

// ============================================================
// BRAIN GLOW — Inner radial energy
// ============================================================

const BrainGlow = React.memo(function BrainGlow({ regionsRef }: { regionsRef: React.RefObject<RegionState[]> }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(BRAIN_RADIUS * 0.6, 3);
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.FrontSide,
      uniforms: { uTime: { value: 0 }, uAct: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uAct;
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        void main() {
          vec3 vd = normalize(cameraPosition - vWorldPos);
          float f = pow(1.0 - max(dot(vNormal, vd), 0.0), 1.6);
          vec3 gc = mix(vec3(0.12,0.35,0.85), vec3(0.3,0.6,1.0), f);
          gc = mix(gc, vec3(0.4,0.7,1.0), uAct*0.6);
          float i = (1.0-f)*0.4*(0.85+0.15*sin(uTime*0.6)) + uAct*0.3;
          gl_FragColor = vec4(gc, i);
        }
      `,
    });
    return { geometry: geo, material: mat };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    material.uniforms.uTime.value = t;
    const regions = regionsRef.current;
    if (!regions) return;
    let avg = 0;
    for (let i = 0; i < regions.length; i++) avg += regions[i].activation;
    material.uniforms.uAct.value = avg / regions.length;
    if (meshRef.current) {
      const s = 1.0 + Math.sin(t * 0.35) * 0.05 + (avg / regions.length) * 0.15;
      meshRef.current.scale.set(s, s * 0.92, s * 0.85);
    }
  });

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  return <mesh ref={meshRef} geometry={geometry} material={material} />;
});

// ============================================================
// WIREFRAME SHELL — Cortical wireframe
// ============================================================

const WireframeShell = React.memo(function WireframeShell() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(BRAIN_RADIUS * 1.02, 2), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0x4488cc, wireframe: true, transparent: true, opacity: 0.035,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.05;
    meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.06;
  });

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  return <mesh ref={meshRef} scale={BRAIN_WARP} geometry={geometry} material={material} />;
});

// ============================================================
// REGION NODES — Glowing brain region points
// ============================================================

const RegionNodes = React.memo(function RegionNodes({ regionsRef }: { regionsRef: React.RefObject<RegionState[]> }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, material } = useMemo(() => {
    const n = REGION_RAW.length;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(n), 1));
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uPR: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5) } },
      vertexShader: `
        attribute vec3 aColor;
        attribute float aSize;
        varying vec3 vColor;
        uniform float uPR;
        void main() {
          vColor = aColor;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uPR * (250.0 / -gl_Position.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float core = pow(smoothstep(0.5, 0.0, d), 2.0);
          float glow = smoothstep(0.5, 0.1, d) * 0.4;
          vec3 c = mix(vColor, vec3(1.0), core * 0.85);
          gl_FragColor = vec4(c * 2.0, core * 0.9 + glow);
        }
      `,
    });
    return { geometry: geo, material: mat };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current || !regionsRef.current) return;
    const t = clock.getElapsedTime();
    const regions = regionsRef.current;
    const posArr = pointsRef.current.geometry.getAttribute('position')!.array as Float32Array;
    const colArr = pointsRef.current.geometry.getAttribute('aColor')!.array as Float32Array;
    const sizeArr = pointsRef.current.geometry.getAttribute('aSize')!.array as Float32Array;

    for (let i = 0; i < regions.length; i++) {
      const r = regions[i];
      posArr[i*3] = r.pos.x + Math.sin(t*0.4+i*1.3)*0.02;
      posArr[i*3+1] = r.pos.y + Math.cos(t*0.35+i*0.9)*0.03;
      posArr[i*3+2] = r.pos.z + Math.sin(t*0.3+i*1.7)*0.02;
      colArr[i*3] = r.color.r; colArr[i*3+1] = r.color.g; colArr[i*3+2] = r.color.b;
      sizeArr[i] = r.baseSize * (1.0 + r.activation * 1.5 + Math.sin(t*2+i)*0.1);
    }
    pointsRef.current.geometry.getAttribute('position')!.needsUpdate = true;
    pointsRef.current.geometry.getAttribute('aColor')!.needsUpdate = true;
    pointsRef.current.geometry.getAttribute('aSize')!.needsUpdate = true;
  });

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  return <points ref={pointsRef} geometry={geometry} material={material} />;
});

// ============================================================
// NEURAL PATHWAYS — Connection lines
// ============================================================

const NeuralPathways = React.memo(function NeuralPathways({ regionsRef, pathwaysRef }: {
  regionsRef: React.RefObject<RegionState[]>;
  pathwaysRef: React.RefObject<{ curve: THREE.CatmullRomCurve3; color: THREE.Color; from: number; to: number }[]>;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const lineObjects = useMemo(() => {
    const regions = regionsRef.current;
    if (!regions) return [];
    const pws = pathwaysRef.current;
    if (!pws) return [];
    return pws.map((pw) => {
      const pts = pw.curve.getPoints(32);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: pw.color, transparent: true, opacity: 0.1,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      return { line: new THREE.Line(geo, mat), from: pw.from, to: pw.to };
    });
  }, []);

  useFrame(() => {
    if (!groupRef.current || !regionsRef.current) return;
    const regions = regionsRef.current;
    for (let i = 0; i < lineObjects.length; i++) {
      const obj = lineObjects[i];
      const fromAct = regions[obj.from].activation;
      const toAct = regions[obj.to].activation;
      (obj.line.material as THREE.LineBasicMaterial).opacity = 0.08 + Math.max(fromAct, toAct) * 0.25;
    }
  });

  useEffect(() => {
    return () => lineObjects.forEach(o => {
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
// PATHWAY SIGNALS — Neural impulses
// ============================================================

interface Sig { pathIdx: number; progress: number; speed: number; active: boolean; intensity: number; }

const PathwaySignals = React.memo(function PathwaySignals({
  regionsRef, pathwaysRef,
}: {
  regionsRef: React.RefObject<RegionState[]>;
  pathwaysRef: React.RefObject<{ curve: THREE.CatmullRomCurve3; color: THREE.Color; from: number; to: number }[]>;
}) {
  const sigRef = useRef<THREE.Points>(null);
  const trailRef = useRef<THREE.Points>(null);
  const signals = useRef<Sig[]>([]);
  const spawnT = useRef(0);

  useEffect(() => {
    const pool: Sig[] = [];
    for (let i = 0; i < MAX_SIGNALS; i++) pool.push({ pathIdx: 0, progress: 0, speed: 0, active: false, intensity: 0 });
    signals.current = pool;
  }, []);

  const { sigGeo, sigMat, trailGeo, trailMat } = useMemo(() => {
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1;
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX_SIGNALS * 3), 3));
    sg.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(MAX_SIGNALS * 3), 3));
    sg.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(MAX_SIGNALS), 1));
    const sm = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uPR: { value: dpr } },
      vertexShader: `
        attribute vec3 aColor; attribute float aSize;
        varying vec3 vColor; uniform float uPR;
        void main() { vColor=aColor; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); gl_PointSize=aSize*uPR*(220.0/-gl_Position.z); }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() { float d=length(gl_PointCoord-vec2(0.5)); if(d>0.5) discard; float c=pow(smoothstep(0.5,0.0,d),2.5); float g=smoothstep(0.5,0.08,d)*0.5; vec3 col=mix(vColor,vec3(1.0),c*0.95); gl_FragColor=vec4(col*3.0,c*0.95+g*0.4); }
      `,
    });
    const tg = new THREE.BufferGeometry();
    tg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX_TRAILS * 3), 3));
    tg.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(MAX_TRAILS * 3), 3));
    tg.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(MAX_TRAILS), 1));
    const tm = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uPR: { value: dpr } },
      vertexShader: `
        attribute vec3 aColor; attribute float aSize;
        varying vec3 vColor; uniform float uPR;
        void main() { vColor=aColor; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); gl_PointSize=aSize*uPR*(180.0/-gl_Position.z); }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() { float d=length(gl_PointCoord-vec2(0.5)); if(d>0.5) discard; float c=pow(smoothstep(0.5,0.0,d),1.5); gl_FragColor=vec4(vColor*1.5,c*0.6); }
      `,
    });
    return { sigGeo: sg, sigMat: sm, trailGeo: tg, trailMat: tm };
  }, []);

  useFrame(({ clock }, delta) => {
    if (!sigRef.current || !trailRef.current || !regionsRef.current || !pathwaysRef.current) return;
    const t = clock.getElapsedTime();
    const regions = regionsRef.current;
    const pathways = pathwaysRef.current;

    let gAct = 0;
    for (let i = 0; i < regions.length; i++) gAct += regions[i].activation;
    gAct /= regions.length;

    // Spawn
    spawnT.current += delta;
    const interval = Math.max(0.05, 0.2 - gAct * 0.15);
    if (spawnT.current > interval && Math.random() < 0.5 + gAct * 0.4) {
      spawnT.current = 0;
      const slot = signals.current.find(s => !s.active);
      if (slot && pathways.length > 0) {
        let pi = Math.floor(Math.random() * pathways.length);
        if (gAct > 0.1) {
          const act = pathways.map((p, i) => ({ i, a: Math.max(regions[p.from].activation, regions[p.to].activation) }))
            .filter(p => p.a > 0.15).sort((a, b) => b.a - a.a);
          if (act.length > 0) pi = act[Math.floor(Math.random() * Math.min(4, act.length))].i;
        }
        slot.active = true; slot.pathIdx = pi; slot.progress = 0;
        slot.speed = 0.25 + Math.random() * 0.45 + gAct * 0.25;
        slot.intensity = 0.5 + Math.random() * 0.5;
      }
    }

    // Update
    const posArr = (sigRef.current.geometry.getAttribute('position')!.array as Float32Array);
    const colArr = (sigRef.current.geometry.getAttribute('aColor')!.array as Float32Array);
    const sizeArr = (sigRef.current.geometry.getAttribute('aSize')!.array as Float32Array);
    posArr.fill(0); colArr.fill(0); sizeArr.fill(0);
    const tpArr = (trailRef.current.geometry.getAttribute('position')!.array as Float32Array);
    const tcArr = (trailRef.current.geometry.getAttribute('aColor')!.array as Float32Array);
    const tsArr = (trailRef.current.geometry.getAttribute('aSize')!.array as Float32Array);
    tpArr.fill(0); tcArr.fill(0); tsArr.fill(0);

    let di = 0, ti = 0;
    for (let i = 0; i < signals.current.length && di < MAX_SIGNALS; i++) {
      const sig = signals.current[i];
      if (!sig.active) continue;
      sig.progress += sig.speed * delta;
      if (sig.progress >= 1.0) { sig.active = false; continue; }
      const pw = pathways[sig.pathIdx];
      if (!pw) { sig.active = false; continue; }
      const pt = pw.curve.getPointAt(sig.progress);
      const idx = di * 3;
      posArr[idx] = pt.x; posArr[idx+1] = pt.y; posArr[idx+2] = pt.z;
      const r = pw.color.r*(0.8+0.2*Math.sin(t*4+sig.progress*8));
      const g = pw.color.g*(0.8+0.2*Math.cos(t*4+sig.progress*8));
      colArr[idx] = r; colArr[idx+1] = g; colArr[idx+2] = pw.color.b;
      const sf = Math.sin(sig.progress * Math.PI);
      sizeArr[di] = (5+sf*12)*sig.intensity;
      // Trail
      for (let j = 1; j <= 5 && ti < MAX_TRAILS; j++) {
        const tp = pw.curve.getPointAt(Math.max(0, sig.progress - j*0.025));
        const tIdx = ti * 3;
        tpArr[tIdx] = tp.x; tpArr[tIdx+1] = tp.y; tpArr[tIdx+2] = tp.z;
        const fade = 1 - j/6;
        tcArr[tIdx] = r*fade*0.6; tcArr[tIdx+1] = g*fade*0.6; tcArr[tIdx+2] = pw.color.b*fade*0.6;
        tsArr[ti] = (2+sf*5)*fade*sig.intensity;
        ti++;
      }
      di++;
    }

    sigRef.current.geometry.getAttribute('position')!.needsUpdate = true;
    sigRef.current.geometry.getAttribute('aColor')!.needsUpdate = true;
    sigRef.current.geometry.getAttribute('aSize')!.needsUpdate = true;
    trailRef.current.geometry.getAttribute('position')!.needsUpdate = true;
    trailRef.current.geometry.getAttribute('aColor')!.needsUpdate = true;
    trailRef.current.geometry.getAttribute('aSize')!.needsUpdate = true;
  });

  useEffect(() => () => { sigGeo.dispose(); sigMat.dispose(); trailGeo.dispose(); trailMat.dispose(); }, [sigGeo, sigMat, trailGeo, trailMat]);

  return (
    <>
      <points ref={trailRef} geometry={trailGeo} material={trailMat} />
      <points ref={sigRef} geometry={sigGeo} material={sigMat} />
    </>
  );
});

// ============================================================
// ELECTRICAL DISCHARGES — Lightning arcs
// ============================================================

interface Discharge { from: number; to: number; life: number; maxLife: number; segs: number; }

const ElectricalDischarges = React.memo(function ElectricalDischarges({ regionsRef }: {
  regionsRef: React.RefObject<RegionState[]>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const discharges = useRef<Discharge[]>([]);
  const timer = useRef(0);
  const lines = useRef<THREE.Line[]>([]);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current || !regionsRef.current) return;
    const regions = regionsRef.current;

    // Spawn
    timer.current += delta;
    if (timer.current > 0.35) {
      timer.current = 0;
      for (let i = 0; i < regions.length; i++) {
        if (regions[i].activation < 0.4) continue;
        for (let j = i + 1; j < regions.length; j++) {
          if (regions[j].activation < 0.3 || Math.random() > 0.3) continue;
          if (discharges.current.filter(d => d.life > 0).length >= MAX_DISCHARGES) break;
          discharges.current.push({
            from: i, to: j,
            life: 0.2 + Math.random() * 0.25,
            maxLife: 0.2 + Math.random() * 0.25,
            segs: 8 + Math.floor(Math.random() * 5),
          });
          break;
        }
      }
    }

    // Update
    const active = discharges.current.filter(d => d.life > 0);

    // Remove excess lines
    while (groupRef.current.children.length > active.length) {
      const child = groupRef.current.children[groupRef.current.children.length - 1];
      groupRef.current.remove(child);
      if (child instanceof THREE.Line) { child.geometry.dispose(); (child.material as THREE.Material).dispose(); }
    }

    for (let i = 0; i < active.length; i++) {
      const d = active[i];
      d.life -= delta;
      const lr = Math.max(0, d.life / d.maxLife);
      const from = regions[d.from].pos;
      const to = regions[d.to].pos;

      if (i >= groupRef.current.children.length) {
        const pts = new Float32Array((d.segs + 1) * 3);
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
        const mat = new THREE.LineBasicMaterial({
          color: regions[d.from].color.clone().lerp(regions[d.to].color, 0.5),
          transparent: true, opacity: lr * 0.7,
          blending: THREE.AdditiveBlending, depthWrite: false,
        });
        const line = new THREE.Line(geo, mat);
        groupRef.current.add(line);
      }

      const child = groupRef.current.children[i] as THREE.Line;
      const posAttr = child.geometry.getAttribute('position');
      if (posAttr) {
        const arr = posAttr.array as Float32Array;
        for (let s = 0; s <= d.segs; s++) {
          const f = s / d.segs;
          arr[s*3] = THREE.MathUtils.lerp(from.x, to.x, f) + (s > 0 && s < d.segs ? (Math.random()-0.5)*0.25 : 0);
          arr[s*3+1] = THREE.MathUtils.lerp(from.y, to.y, f) + (s > 0 && s < d.segs ? (Math.random()-0.5)*0.25 : 0);
          arr[s*3+2] = THREE.MathUtils.lerp(from.z, to.z, f) + (s > 0 && s < d.segs ? (Math.random()-0.5)*0.25 : 0);
        }
        posAttr.needsUpdate = true;
      }
      (child.material as THREE.LineBasicMaterial).opacity = lr * 0.7;
    }

    discharges.current = discharges.current.filter(d => d.life > 0);
  });

  return <group ref={groupRef} />;
});

// ============================================================
// ORBITAL RINGS
// ============================================================

const RINGS = [
  { r: 2.9, tube: 0.005, tilt: [0.3, 0, 0.1], spd: 0.1, col: 0x22d3ee, op: 0.08 },
  { r: 3.4, tube: 0.004, tilt: [1.3, 0.4, 0.2], spd: -0.07, col: 0xa855f7, op: 0.06 },
  { r: 2.5, tube: 0.006, tilt: [0.7, 0, 0.8], spd: 0.05, col: 0x34d399, op: 0.05 },
];

const OrbitalRings = React.memo(function OrbitalRings() {
  const groupRef = useRef<THREE.Group>(null);

  const ringData = useMemo(() => RINGS.map(r => ({
    geo: new THREE.TorusGeometry(r.r, r.tube, 16, 100),
    mat: new THREE.MeshBasicMaterial({
      color: r.col, transparent: true, opacity: r.op,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }),
    tilt: r.tilt as [number, number, number],
    spd: r.spd,
  })), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    ringData.forEach((rd, i) => {
      const child = groupRef.current!.children[i] as THREE.Mesh;
      child.rotation.x = rd.tilt[0] + t * rd.spd * 0.3;
      child.rotation.y = t * rd.spd;
      child.rotation.z = rd.tilt[2] + t * rd.spd * 0.15;
    });
  });

  useEffect(() => () => ringData.forEach(r => { r.geo.dispose(); r.mat.dispose(); }), [ringData]);

  return (
    <group ref={groupRef} scale={BRAIN_WARP}>
      {ringData.map((r, i) => <mesh key={i} geometry={r.geo} material={r.mat} rotation={r.tilt} />)}
    </group>
  );
});

// ============================================================
// BACKGROUND PARTICLES
// ============================================================

const BackgroundParticles = React.memo(function BackgroundParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, material, vels } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(BG_PARTICLES * 3);
    const col = new Float32Array(BG_PARTICLES * 3);
    const v: number[] = [];
    const pal = [[0.13,0.83,0.93],[0.66,0.33,0.97],[0.2,0.83,0.6],[0.55,0.36,0.97],[0.4,0.6,0.9]];
    for (let i = 0; i < BG_PARTICLES; i++) {
      pos[i*3] = (Math.random()-0.5)*22; pos[i*3+1] = (Math.random()-0.5)*14; pos[i*3+2] = (Math.random()-0.5)*12;
      v.push(Math.random()*Math.PI*2);
      const c = pal[Math.floor(Math.random()*pal.length)];
      col[i*3]=c[0]; col[i*3+1]=c[1]; col[i*3+2]=c[2];
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uPR: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.2) } },
      vertexShader: `
        attribute vec3 aColor; varying vec3 vColor; uniform float uPR;
        void main() { vColor=aColor; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); gl_PointSize=2.5*uPR*(80.0/-gl_Position.z); }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() { float d=length(gl_PointCoord-vec2(0.5)); if(d>0.5) discard; gl_FragColor=vec4(vColor, smoothstep(0.5,0.0,d)*0.2); }
      `,
    });
    return { geometry: geo, material: mat, vels: v };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const arr = pointsRef.current.geometry.getAttribute('position')!.array as Float32Array;
    for (let i = 0; i < BG_PARTICLES; i++) {
      const p = vels[i];
      arr[i*3] += Math.sin(t*0.04+p)*0.0012;
      arr[i*3+1] += Math.cos(t*0.035+p)*0.0012;
      arr[i*3+2] += Math.sin(t*0.03+p*1.3)*0.0008;
      if (arr[i*3]>11) arr[i*3]=-11; if (arr[i*3]<-11) arr[i*3]=11;
      if (arr[i*3+1]>7) arr[i*3+1]=-7; if (arr[i*3+1]<-7) arr[i*3+1]=7;
    }
    pointsRef.current.geometry.getAttribute('position')!.needsUpdate = true;
  });

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  return <points ref={pointsRef} geometry={geometry} material={material} />;
});

// ============================================================
// FLOATING WIREFRAMES
// ============================================================

const WIREFRAMES = [
  { type: 'icosa' as const, pos: [-8,3.5,-5] as [number,number,number], rot:[0.012,0.02,0.006], s:1.3, c:0x22d3ee, o:0.03 },
  { type: 'torus' as const, pos: [8,-3,-4] as [number,number,number], rot:[0.008,0.015,0.01], s:1.5, c:0xa855f7, o:0.025 },
  { type: 'octa' as const, pos: [0.5,5,-6] as [number,number,number], rot:[0.015,0.018,0.012], s:1.0, c:0x34d399, o:0.025 },
  { type: 'dodeca' as const, pos: [-7,-4,-6] as [number,number,number], rot:[0.01,0.015,0.008], s:0.8, c:0x8b5cf6, o:0.03 },
];

const FloatingWireframe = React.memo(function FloatingWireframe(cfg: typeof WIREFRAMES[number]) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => {
    switch(cfg.type) {
      case 'icosa': return new THREE.IcosahedronGeometry(1, 1);
      case 'torus': return new THREE.TorusGeometry(1, 0.3, 8, 16);
      case 'octa': return new THREE.OctahedronGeometry(1, 0);
      case 'dodeca': return new THREE.DodecahedronGeometry(1, 0);
    }
  }, [cfg.type]);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    color: cfg.c, wireframe: true, transparent: true, opacity: cfg.o,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), [cfg.c, cfg.o]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.x = t*cfg.rot[0]; meshRef.current.rotation.y = t*cfg.rot[1]; meshRef.current.rotation.z = t*cfg.rot[2];
    meshRef.current.position.y = cfg.pos[1] + Math.sin(t*0.12+cfg.pos[0])*0.5;
  });

  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);
  return <mesh ref={meshRef} position={cfg.pos} scale={cfg.s} geometry={geo} material={mat} />;
});

// ============================================================
// ORBITAL CAMERA
// ============================================================

const OrbitalCamera = React.memo(function OrbitalCamera() {
  const { camera } = useThree();
  const angle = useRef(0);

  useFrame((_, delta) => {
    angle.current += delta * 0.12;
    const r = 7.5;
    const x = Math.sin(angle.current + mouseState.x * 0.4) * r;
    const y = (0.15 + mouseState.y * 0.2) * r;
    const z = Math.cos(angle.current + mouseState.x * 0.4) * r;
    camera.position.x += (x - camera.position.x) * 0.025;
    camera.position.y += (y - camera.position.y) * 0.025;
    camera.position.z += (z - camera.position.z) * 0.025;
    camera.lookAt(0, 0, 0);
  });

  return null;
});

// ============================================================
// CASCADE MANAGER — Brain neural response system
// ============================================================

const CascadeManager = React.memo(function CascadeManager({ regionsRef }: {
  regionsRef: React.RefObject<RegionState[]>;
}) {
  const timer = useRef(0);

  const fireRegion = useCallback((idx: number, time: number) => {
    if (!regionsRef.current) return;
    regionsRef.current[idx].activation = 0.7 + Math.random() * 0.3;
    regionsRef.current[idx].lastFire = time;
  }, [regionsRef]);

  useFrame(({ clock }, delta) => {
    if (!regionsRef.current) return;
    const t = clock.getElapsedTime();
    const regions = regionsRef.current;

    // Decay
    for (let i = 0; i < regions.length; i++) {
      if (regions[i].activation > 0) {
        regions[i].activation *= Math.pow(0.92, delta * 60);
        if (regions[i].activation < 0.01) regions[i].activation = 0;
      }
    }

    // Propagate
    for (const [a, b] of CONNECTIONS) {
      const rA = regions[a], rB = regions[b];
      if (rA.activation > 0.3 && rB.lastFire < rA.lastFire) {
        const dist = rA.pos.distanceTo(rB.pos);
        const delay = dist * 0.25;
        const since = t - rA.lastFire;
        if (since > delay && since < delay + 0.15) {
          rB.activation = Math.min(1.0, rA.activation * 0.85);
          rB.lastFire = t;
        }
      }
    }

    // Auto-fire
    timer.current += delta;
    if (timer.current > 3.5 + Math.sin(t * 0.3) * 1.5) {
      timer.current = 0;
      let totalAct = 0;
      for (let i = 0; i < regions.length; i++) totalAct += regions[i].activation;
      if (totalAct < 2.0) {
        fireRegion(Math.floor(Math.random() * regions.length), t);
      }
    }
  });

  return null;
});

// ============================================================
// MAIN SCENE
// ============================================================

const Scene = React.memo(function Scene() {
  const regionsRef = useRef<RegionState[] | null>(null);
  const pathwaysRef = useRef<{ curve: THREE.CatmullRomCurve3; color: THREE.Color; from: number; to: number }[] | null>(null);

  // Initialize regions + pathways inside the Canvas (client-only)
  if (regionsRef.current === null) {
    regionsRef.current = initRegions();
    pathwaysRef.current = initPathways(regionsRef.current);
  }

  return (
    <>
      <ambientLight intensity={0.1} />
      <OrbitalCamera />
      <CascadeManager regionsRef={regionsRef} />

      <BackgroundParticles />
      {WIREFRAMES.map((cfg, i) => <FloatingWireframe key={i} {...cfg} />)}

      <group>
        <BrainGlow regionsRef={regionsRef} />
        <BrainMesh regionsRef={regionsRef} />
        <WireframeShell />
        <RegionNodes regionsRef={regionsRef} />
        <NeuralPathways regionsRef={regionsRef} pathwaysRef={pathwaysRef} />
        <PathwaySignals regionsRef={regionsRef} pathwaysRef={pathwaysRef} />
        <ElectricalDischarges regionsRef={regionsRef} />
        <OrbitalRings />
      </group>

      <EffectComposer>
        <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} intensity={1.8} mipmapBlur />
      </EffectComposer>
    </>
  );
});

// ============================================================
// EXPORTED COMPONENT — Safe mount with error handling
// ============================================================

function MouseTrackerComponent() {
  useMouseTracker();
  return null;
}

const ParticleField = React.memo(function ParticleField() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <React.Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 1, 7.5], fov: 50 }}
          dpr={1}
          gl={{ antialias: false, alpha: true }}
          style={{ background: 'transparent' }}
          frameloop="always"
        >
          <MouseTrackerComponent />
          <Scene />
        </Canvas>
      </React.Suspense>
    </div>
  );
});

export default ParticleField;
