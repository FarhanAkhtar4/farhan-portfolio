'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ============================================================
// RAW THREE.JS BRAIN VISUALIZATION
// No React Three Fiber, no postprocessing — maximum stability
// ============================================================

const BRAIN_RADIUS = 2.0;

export default function ParticleField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- Scene & Camera ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 8);

    // --- Mouse tracking ---
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // ============================================================
    // 1. BRAIN SURFACE — Displaced icosahedron with Fresnel glow
    // ============================================================
    const brainGeo = new THREE.IcosahedronGeometry(BRAIN_RADIUS, 4);
    const brainMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x2266cc) },
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
    const brain = new THREE.Mesh(brainGeo, brainMat);
    brain.scale.set(1.0, 0.92, 0.82);
    scene.add(brain);

    // ============================================================
    // 2. CORTEX SHELL — Wireframe overlay
    // ============================================================
    const shellGeo = new THREE.IcosahedronGeometry(BRAIN_RADIUS * 1.03, 2);
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0x4488cc,
      wireframe: true,
      transparent: true,
      opacity: 0.035,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    shell.scale.set(1.0, 0.92, 0.82);
    scene.add(shell);

    // ============================================================
    // 3. INNER GLOW — Radial light inside the brain
    // ============================================================
    const glowGeo = new THREE.IcosahedronGeometry(BRAIN_RADIUS * 0.65, 3);
    const glowMat = new THREE.ShaderMaterial({
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
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.scale.set(1.0, 0.92, 0.82);
    scene.add(glow);

    // ============================================================
    // 4. BRAIN PATHWAYS — Curved lines between neural regions
    // ============================================================
    const REGIONS = [
      [0.85, 0.45, 0.35], [0.65, 0.15, 0.65], [0.25, 0.75, 0.5],
      [-0.2, 0.7, 0.55], [0.45, -0.35, 0.7], [-0.75, 0.15, 0.45],
      [-0.5, -0.55, -0.15], [-0.25, -0.75, 0.1],
      [-0.85, 0.45, -0.35], [-0.65, 0.15, -0.65], [-0.25, 0.75, -0.5],
      [0.2, 0.7, -0.55], [-0.45, -0.35, -0.7], [0.75, 0.15, -0.45],
    ].map(([x, y, z]) => new THREE.Vector3(x, y, z).multiplyScalar(BRAIN_RADIUS));

    const PAIRS: [number, number][] = [
      [0, 2], [0, 1], [1, 4], [2, 3], [3, 5], [4, 6], [6, 7],
      [0, 8], [2, 10], [3, 11], [4, 12], [8, 10], [9, 12],
      [10, 11], [11, 13], [5, 13], [0, 3], [8, 11], [7, 6],
    ];

    const PATHWAY_COLORS = [
      new THREE.Color(0x22d3ee), new THREE.Color(0xa855f7),
      new THREE.Color(0x34d399), new THREE.Color(0x8b5cf6),
      new THREE.Color(0x06b6d4),
    ];

    const pathways = PAIRS.map(([a, b], i) => {
      const from = REGIONS[a];
      const to = REGIONS[b];
      const mid = from.clone().add(to).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(BRAIN_RADIUS * 1.4);
      mid.x += Math.sin(i * 2.3) * 0.35;
      mid.y += Math.cos(i * 1.7) * 0.35;
      mid.z += Math.sin(i * 3.1) * 0.3;
      const cp1 = from.clone().lerp(mid, 0.4);
      cp1.normalize().multiplyScalar(from.length() * 1.2);
      const cp2 = to.clone().lerp(mid, 0.4);
      cp2.normalize().multiplyScalar(to.length() * 1.2);
      const curve = new THREE.CatmullRomCurve3([from, cp1, mid, cp2, to]);
      const pts = curve.getPoints(32);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const lineMat = new THREE.LineBasicMaterial({
        color: PATHWAY_COLORS[i % PATHWAY_COLORS.length],
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);
      return { curve, color: PATHWAY_COLORS[i % PATHWAY_COLORS.length] };
    });

    // ============================================================
    // 5. BRAIN SIGNALS — Glowing pulses along pathways
    // ============================================================
    const MAX_SIGS = 50;
    const sigPool: { pwIdx: number; progress: number; speed: number; active: boolean }[] = [];
    for (let i = 0; i < MAX_SIGS; i++) {
      sigPool.push({ pwIdx: 0, progress: 0, speed: 0, active: false });
    }
    let sigSpawnTimer = 0;

    const sigGeo = new THREE.BufferGeometry();
    const sigPos = new Float32Array(MAX_SIGS * 3);
    const sigCol = new Float32Array(MAX_SIGS * 3);
    const sigSz = new Float32Array(MAX_SIGS);
    sigGeo.setAttribute('position', new THREE.BufferAttribute(sigPos, 3));
    sigGeo.setAttribute('aColor', new THREE.BufferAttribute(sigCol, 3));
    sigGeo.setAttribute('aSize', new THREE.BufferAttribute(sigSz, 1));

    const sigMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
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
    const sigPoints = new THREE.Points(sigGeo, sigMat);
    scene.add(sigPoints);

    // ============================================================
    // 6. ORBITAL RINGS
    // ============================================================
    const RINGS = [
      { r: 2.8, tb: 0.006, tilt: [0.3, 0, 0.1] as const, speed: 0.12, c: 0x22d3ee, o: 0.1 },
      { r: 3.3, tb: 0.005, tilt: [1.3, 0.4, 0.2] as const, speed: -0.08, c: 0xa855f7, o: 0.08 },
      { r: 2.4, tb: 0.008, tilt: [0.7, 0, 0.8] as const, speed: 0.06, c: 0x34d399, o: 0.06 },
    ];

    const ringGroup = new THREE.Group();
    ringGroup.scale.set(1.0, 0.92, 0.82);
    RINGS.forEach((r) => {
      const rg = new THREE.TorusGeometry(r.r, r.tb, 16, 100);
      const rm = new THREE.MeshBasicMaterial({
        color: r.c, transparent: true, opacity: r.o,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const mesh = new THREE.Mesh(rg, rm);
      ringGroup.add(mesh);
    });
    scene.add(ringGroup);

    // ============================================================
    // 7. NEURAL NETWORK — Background layers with wave propagation
    // ============================================================
    const NCOLS = [0x22d3ee, 0xa855f7, 0x8b5cf6, 0x34d399];
    const NLAYERS = [
      { count: 5, xPos: -6.5 },
      { count: 7, xPos: -2.2 },
      { count: 6, xPos: 2.2 },
      { count: 4, xPos: 6.5 },
    ];
    const NSPREAD = 5.0;
    const CONN_PROB = 0.4;

    interface Neuron { x: number; y: number; z: number; li: number; phase: number; }
    interface Synapse { from: number; to: number; }
    interface NSignal { synIdx: number; progress: number; speed: number; active: boolean; }

    const neurons: Neuron[] = [];
    const synapses: Synapse[] = [];

    NLAYERS.forEach((layer, li) => {
      for (let i = 0; i < layer.count; i++) {
        const t = layer.count === 1 ? 0.5 : i / (layer.count - 1);
        neurons.push({
          x: layer.xPos,
          y: (t - 0.5) * NSPREAD,
          z: (Math.random() - 0.5) * 1.5,
          li,
          phase: Math.random() * Math.PI * 2,
        });
      }
    });

    for (let li = 0; li < NLAYERS.length - 1; li++) {
      const sA = NLAYERS.slice(0, li).reduce((s, l) => s + l.count, 0);
      const sB = sA + NLAYERS[li].count;
      for (let a = sA; a < sB; a++) {
        for (let b = sB; b < sB + NLAYERS[li + 1].count; b++) {
          if (Math.random() < CONN_PROB) synapses.push({ from: a, to: b });
        }
      }
    }

    // Synapse lines
    synapses.forEach((syn) => {
      const a = neurons[syn.from];
      const b = neurons[syn.to];
      const sg = new THREE.BufferGeometry();
      const sp = new Float32Array([a.x, a.y, a.z, b.x, b.y, b.z]);
      sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
      const fc = new THREE.Color(NCOLS[a.li]);
      const tc = new THREE.Color(NCOLS[b.li]);
      const mc = fc.lerp(tc, 0.5);
      const sm = new THREE.LineBasicMaterial({
        color: mc, transparent: true, opacity: 0.04,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      scene.add(new THREE.Line(sg, sm));
    });

    // Neuron points
    const neuGeo = new THREE.BufferGeometry();
    const neuPos = new Float32Array(neurons.length * 3);
    const neuCol = new Float32Array(neurons.length * 3);
    const activations = new Float32Array(neurons.length);
    neurons.forEach((n, i) => {
      neuPos[i * 3] = n.x;
      neuPos[i * 3 + 1] = n.y;
      neuPos[i * 3 + 2] = n.z;
      const c = new THREE.Color(NCOLS[n.li]);
      neuCol[i * 3] = c.r;
      neuCol[i * 3 + 1] = c.g;
      neuCol[i * 3 + 2] = c.b;
    });
    neuGeo.setAttribute('position', new THREE.BufferAttribute(neuPos, 3));
    neuGeo.setAttribute('aColor', new THREE.BufferAttribute(neuCol, 3));
    const neuMat = new THREE.ShaderMaterial({
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
    const neuPoints = new THREE.Points(neuGeo, neuMat);
    scene.add(neuPoints);

    // Neuron signal particles
    const MAX_NSIGS = 40;
    const nSigPool: NSignal[] = [];
    for (let i = 0; i < MAX_NSIGS; i++) {
      nSigPool.push({ synIdx: 0, progress: 0, speed: 0, active: false });
    }

    const annGeo = new THREE.BufferGeometry();
    const annPos = new Float32Array(MAX_NSIGS * 3);
    const annCol = new Float32Array(MAX_NSIGS * 3);
    annGeo.setAttribute('position', new THREE.BufferAttribute(annPos, 3));
    annGeo.setAttribute('aColor', new THREE.BufferAttribute(annCol, 3));
    const annMat = new THREE.ShaderMaterial({
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
    const annPoints = new THREE.Points(annGeo, annMat);
    scene.add(annPoints);

    // Wave propagation state
    let waveTimer = 0;
    let waveLayer = -1;
    let waveActive = false;
    const layerStarts: number[] = [];
    let acc = 0;
    NLAYERS.forEach((l) => { layerStarts.push(acc); acc += l.count; });

    function getOutgoing(nIdx: number): number[] {
      const result: number[] = [];
      for (let i = 0; i < synapses.length; i++) {
        if (synapses[i].from === nIdx) result.push(i);
      }
      return result;
    }

    function spawnNSig(synIdx: number, speed: number) {
      const slot = nSigPool.find((s) => !s.active);
      if (slot) {
        slot.active = true;
        slot.synIdx = synIdx;
        slot.progress = 0;
        slot.speed = speed;
      }
    }

    // ============================================================
    // 8. BACKGROUND PARTICLES
    // ============================================================
    const BG_COUNT = 120;
    const bgGeo = new THREE.BufferGeometry();
    const bgPos = new Float32Array(BG_COUNT * 3);
    const bgCol = new Float32Array(BG_COUNT * 3);
    const bgVels: number[] = [];
    const bgPalette = [
      [0.13, 0.83, 0.93], [0.66, 0.33, 0.97], [0.20, 0.83, 0.60],
      [0.55, 0.36, 0.97], [0.40, 0.60, 0.90],
    ];
    for (let i = 0; i < BG_COUNT; i++) {
      bgPos[i * 3] = (Math.random() - 0.5) * 20;
      bgPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      bgPos[i * 3 + 2] = (Math.random() - 0.5) * 12;
      bgVels.push(Math.random() * Math.PI * 2);
      const c = bgPalette[Math.floor(Math.random() * bgPalette.length)];
      bgCol[i * 3] = c[0];
      bgCol[i * 3 + 1] = c[1];
      bgCol[i * 3 + 2] = c[2];
    }
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    bgGeo.setAttribute('aColor', new THREE.BufferAttribute(bgCol, 3));
    const bgMat = new THREE.ShaderMaterial({
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
    scene.add(new THREE.Points(bgGeo, bgMat));

    // ============================================================
    // 9. FLOATING WIREFRAMES
    // ============================================================
    const WIREFRAMES = [
      { geo: new THREE.IcosahedronGeometry(1.2, 1), pos: [-9, 4, -6] as const, rot: [0.012, 0.02, 0.006] as const, c: 0x22d3ee, o: 0.025 },
      { geo: new THREE.TorusGeometry(1.3, 0.3, 8, 16), pos: [9, -3, -5] as const, rot: [0.008, 0.015, 0.01] as const, c: 0xa855f7, o: 0.02 },
      { geo: new THREE.OctahedronGeometry(0.9, 0), pos: [0, 6, -7] as const, rot: [0.015, 0.018, 0.012] as const, c: 0x34d399, o: 0.022 },
      { geo: new THREE.DodecahedronGeometry(0.7, 0), pos: [-8, -4.5, -6] as const, rot: [0.01, 0.015, 0.008] as const, c: 0x8b5cf6, o: 0.025 },
      { geo: new THREE.TorusKnotGeometry(0.8, 0.25, 48, 8, 2, 3), pos: [6, 4.5, -7] as const, rot: [0.006, 0.01, 0.005] as const, c: 0xf59e0b, o: 0.02 },
    ];

    const wireframes = WIREFRAMES.map((f) => {
      const m = new THREE.Mesh(f.geo, new THREE.MeshBasicMaterial({
        color: f.c, wireframe: true, transparent: true, opacity: f.o,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      m.position.set(f.pos[0], f.pos[1], f.pos[2]);
      scene.add(m);
      return m;
    });

    // ============================================================
    // ANIMATION LOOP
    // ============================================================
    let prevTime = 0;

    function animate(ts: number) {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = Math.min((ts - prevTime) / 1000, 0.1); // Cap delta to avoid huge jumps
      prevTime = ts;
      const t = ts / 1000;

      // Camera mouse parallax
      camera.rotation.y += (mouse.x * 0.05 - camera.rotation.y) * 0.012;
      camera.rotation.x += (-mouse.y * 0.025 - camera.rotation.x) * 0.012;

      // Brain rotation
      brain.rotation.y = t * 0.06;
      brain.rotation.x = Math.sin(t * 0.12) * 0.08;
      brain.rotation.z = Math.cos(t * 0.09) * 0.04;
      brainMat.uniforms.uTime.value = t;

      // Shell sync
      shell.rotation.y = t * 0.06;
      shell.rotation.x = Math.sin(t * 0.12) * 0.08;

      // Glow pulse
      glowMat.uniforms.uTime.value = t;
      glow.scale.setScalar(1.0 + Math.sin(t * 0.4) * 0.06);
      glow.scale.y *= 0.92;
      glow.scale.z *= 0.82;

      // Orbital rings
      RINGS.forEach((r, i) => {
        const mesh = ringGroup.children[i] as THREE.Mesh;
        mesh.rotation.x = r.tilt[0] + t * r.speed * 0.3;
        mesh.rotation.y = t * r.speed;
        mesh.rotation.z = r.tilt[2] + t * r.speed * 0.15;
      });

      // Brain signals
      sigSpawnTimer += delta;
      if (sigSpawnTimer > 0.15) {
        sigSpawnTimer = 0;
        if (Math.random() < 0.5) {
          const slot = sigPool.find((s) => !s.active);
          if (slot) {
            slot.active = true;
            slot.pwIdx = Math.floor(Math.random() * pathways.length);
            slot.progress = 0;
            slot.speed = 0.25 + Math.random() * 0.4;
          }
        }
      }

      const sPosArr = sigGeo.attributes.position.array as Float32Array;
      const sColArr = sigGeo.attributes.aColor.array as Float32Array;
      const sSzArr = sigGeo.attributes.aSize.array as Float32Array;
      sPosArr.fill(0);
      sColArr.fill(0);
      sSzArr.fill(0);

      let sDraw = 0;
      for (let i = 0; i < sigPool.length && sDraw < MAX_SIGS; i++) {
        const sig = sigPool[i];
        if (!sig.active) continue;
        sig.progress += sig.speed * delta;
        if (sig.progress >= 1) {
          sig.active = false;
          continue;
        }
        const pw = pathways[sig.pwIdx];
        const pt = pw.curve.getPointAt(sig.progress);
        const idx = sDraw * 3;
        sPosArr[idx] = pt.x;
        sPosArr[idx + 1] = pt.y;
        sPosArr[idx + 2] = pt.z;
        sColArr[idx] = pw.color.r * (0.8 + 0.2 * Math.sin(t * 3 + sig.progress * 6));
        sColArr[idx + 1] = pw.color.g * (0.8 + 0.2 * Math.cos(t * 3 + sig.progress * 6));
        sColArr[idx + 2] = pw.color.b;
        const sf = Math.sin(sig.progress * Math.PI);
        sSzArr[sDraw] = 6.0 + sf * 10.0;

        // Trail
        if (sDraw + 1 < MAX_SIGS && sig.progress > 0.05) {
          const trailPt = pw.curve.getPointAt(Math.max(0, sig.progress - 0.04));
          const ti = (sDraw + 1) * 3;
          sPosArr[ti] = trailPt.x;
          sPosArr[ti + 1] = trailPt.y;
          sPosArr[ti + 2] = trailPt.z;
          sColArr[ti] = pw.color.r * 0.5;
          sColArr[ti + 1] = pw.color.g * 0.5;
          sColArr[ti + 2] = pw.color.b * 0.5;
          sSzArr[sDraw + 1] = 3.0 + sf * 4.0;
          sDraw += 2;
        } else {
          sDraw++;
        }
      }
      sigGeo.attributes.position.needsUpdate = true;
      sigGeo.attributes.aColor.needsUpdate = true;
      sigGeo.attributes.aSize.needsUpdate = true;

      // Neural network activations decay
      for (let i = 0; i < neurons.length; i++) {
        activations[i] *= 0.985;
        if (activations[i] < 0.01) activations[i] = 0;
      }

      // Mouse proximity activation
      const mx = mouse.x * 8;
      const my = mouse.y * 6;
      for (let i = 0; i < neurons.length; i++) {
        const n = neurons[i];
        const dx = n.x - mx;
        const dy = n.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 3.5) {
          activations[i] = Math.min(1.0, activations[i] + (1 - dist / 3.5) * 0.08);
          if (Math.random() < 0.02) {
            const out = getOutgoing(i);
            if (out.length > 0) {
              spawnNSig(out[Math.floor(Math.random() * out.length)], 0.35 + Math.random() * 0.5);
            }
          }
        }
      }

      // Wave propagation
      waveTimer += delta;
      if (!waveActive && waveTimer >= 4.0) {
        waveActive = true;
        waveTimer = 0;
        waveLayer = 0;
        const start = layerStarts[0];
        for (let i = 0; i < NLAYERS[0].count; i++) {
          activations[start + i] = 0.6 + Math.random() * 0.4;
        }
      }

      if (waveActive) {
        const lp = waveTimer / (1.8 / NLAYERS.length);
        if (lp >= 1 && waveLayer < NLAYERS.length - 1) {
          waveLayer++;
          waveTimer = 0;
          const li = waveLayer;
          const start = layerStarts[li];
          for (let i = 0; i < NLAYERS[li].count; i++) {
            activations[start + i] = 0.5 + Math.random() * 0.5;
          }
          if (li > 0) {
            const prevStart = layerStarts[li - 1];
            for (let ni = 0; ni < NLAYERS[li - 1].count; ni++) {
              const out = getOutgoing(prevStart + ni);
              const fire = out.sort(() => Math.random() - 0.5).slice(0, 2);
              for (const si of fire) {
                spawnNSig(si, 0.4 + Math.random() * 0.5);
              }
            }
          }
        }
        if (waveLayer >= NLAYERS.length - 1 && waveTimer >= 1.8 / NLAYERS.length) {
          waveActive = false;
          waveTimer = 0;
        }
      }

      // Random ambient signals
      if (Math.random() < 0.06 && synapses.length > 0) {
        const si = Math.floor(Math.random() * synapses.length);
        spawnNSig(si, 0.25 + Math.random() * 0.45);
        activations[synapses[si].from] = Math.min(1.0, activations[synapses[si].from] + 0.2);
      }

      // Update neuron signals
      for (let i = 0; i < nSigPool.length; i++) {
        const sig = nSigPool[i];
        if (!sig.active) continue;
        sig.progress += sig.speed * delta;
        if (sig.progress >= 1) {
          sig.active = false;
          sig.progress = 0;
          const dest = synapses[sig.synIdx].to;
          activations[dest] = Math.min(1.0, activations[dest] + 0.3);
          if (Math.random() < 0.25) {
            const out = getOutgoing(dest);
            if (out.length > 0) {
              spawnNSig(out[Math.floor(Math.random() * out.length)], 0.35 + Math.random() * 0.5);
            }
          }
        }
      }

      // Update neuron positions (gentle sway)
      const nPosArr = neuGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < neurons.length; i++) {
        const n = neurons[i];
        nPosArr[i * 3] = n.x + Math.sin(t * 0.25 + n.phase) * 0.06;
        nPosArr[i * 3 + 1] = n.y + Math.sin(t * 0.3 + n.phase * 1.3) * 0.09;
        nPosArr[i * 3 + 2] = n.z + Math.cos(t * 0.28 + n.phase * 0.7) * 0.07;
      }
      neuGeo.attributes.position.needsUpdate = true;

      // Update neuron signal positions
      const aPosArr = annGeo.attributes.position.array as Float32Array;
      const aColArr = annGeo.attributes.aColor.array as Float32Array;
      aPosArr.fill(0);
      aColArr.fill(0);
      let aDraw = 0;
      for (let i = 0; i < nSigPool.length && aDraw < MAX_NSIGS; i++) {
        const sig = nSigPool[i];
        if (!sig.active) continue;
        const syn = synapses[sig.synIdx];
        const fn = neurons[syn.from];
        const tn = neurons[syn.to];
        const idx = aDraw * 3;
        aPosArr[idx] = fn.x + (tn.x - fn.x) * sig.progress;
        aPosArr[idx + 1] = fn.y + (tn.y - fn.y) * sig.progress;
        aPosArr[idx + 2] = fn.z + (tn.z - fn.z) * sig.progress;
        const fc = new THREE.Color(NCOLS[fn.li]);
        const tc = new THREE.Color(NCOLS[tn.li]);
        aColArr[idx] = fc.r * (1 - sig.progress) + tc.r * sig.progress;
        aColArr[idx + 1] = fc.g * (1 - sig.progress) + tc.g * sig.progress;
        aColArr[idx + 2] = fc.b * (1 - sig.progress) + tc.b * sig.progress;
        aDraw++;
      }
      annGeo.attributes.position.needsUpdate = true;
      annGeo.attributes.aColor.needsUpdate = true;

      // Background particles drift
      for (let i = 0; i < BG_COUNT; i++) {
        const p = bgVels[i];
        bgPos[i * 3] += Math.sin(t * 0.04 + p) * 0.0015;
        bgPos[i * 3 + 1] += Math.cos(t * 0.035 + p) * 0.0015;
        bgPos[i * 3 + 2] += Math.sin(t * 0.03 + p * 1.3) * 0.001;
        if (bgPos[i * 3] > 10) bgPos[i * 3] = -10;
        if (bgPos[i * 3] < -10) bgPos[i * 3] = 10;
        if (bgPos[i * 3 + 1] > 7) bgPos[i * 3 + 1] = -7;
        if (bgPos[i * 3 + 1] < -7) bgPos[i * 3 + 1] = 7;
      }
      bgGeo.attributes.position.needsUpdate = true;

      // Floating wireframes
      WIREFRAMES.forEach((f, i) => {
        const m = wireframes[i];
        m.rotation.x = t * f.rot[0];
        m.rotation.y = t * f.rot[1];
        m.rotation.z = t * f.rot[2];
        m.position.y = f.pos[1] + Math.sin(t * 0.12 + f.pos[0]) * 0.5;
      });

      renderer.render(scene, camera);
    }

    animFrameRef.current = requestAnimationFrame(animate);

    // --- Resize handler ---
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      // Dispose geometries & materials
      [brainGeo, brainMat, shellGeo, shellMat, glowGeo, glowMat,
        sigGeo, sigMat, neuGeo, neuMat, annGeo, annMat, bgGeo, bgMat].forEach((obj) => {
        if (obj instanceof THREE.BufferGeometry) obj.dispose();
        if (obj instanceof THREE.Material) obj.dispose();
      });
      WIREFRAMES.forEach((f) => {
        f.geo.dispose();
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
}
