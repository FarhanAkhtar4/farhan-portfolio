"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 250 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null!);
  const mousePos = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const [positions, velocities, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const purple = new THREE.Color("#8b5cf6");
    const cyan = new THREE.Color("#06b6d4");
    const white = new THREE.Color("#ffffff");

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 20;
      pos[i3 + 1] = (Math.random() - 0.5) * 20;
      pos[i3 + 2] = (Math.random() - 0.5) * 10;

      vel[i3] = (Math.random() - 0.5) * 0.004;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.004;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.001;

      const t = Math.random();
      const c = t < 0.4 ? purple : t < 0.7 ? cyan : white;
      col[i3] = c.r;
      col[i3 + 1] = c.g;
      col[i3 + 2] = c.b;
    }
    return [pos, vel, col];
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime;
    const pa = mesh.current.geometry.attributes.position.array as Float32Array;

    const mx = mousePos.current.x * viewport.width * 0.5;
    const my = mousePos.current.y * viewport.height * 0.5;
    const mouseRadius = 3;
    const mouseRadiusSq = mouseRadius * mouseRadius;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pa[i3] += velocities[i3] + Math.sin(time * 0.3 + i * 0.1) * 0.0008;
      pa[i3 + 1] += velocities[i3 + 1] + Math.cos(time * 0.2 + i * 0.1) * 0.0008;

      if (pa[i3] > 10) pa[i3] = -10;
      if (pa[i3] < -10) pa[i3] = 10;
      if (pa[i3 + 1] > 10) pa[i3 + 1] = -10;
      if (pa[i3 + 1] < -10) pa[i3 + 1] = 10;

      // Mouse influence — distance squared (no sqrt)
      const dx = pa[i3] - mx;
      const dy = pa[i3 + 1] - my;
      const distSq = dx * dx + dy * dy;
      if (distSq < mouseRadiusSq) {
        const dist = Math.sqrt(distSq);
        const force = (mouseRadius - dist) * 0.0015;
        pa[i3] += (dx / dist) * force;
        pa[i3 + 1] += (dy / dist) * force;
      }
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.z = time * 0.01;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function NeuralLines() {
  const linesRef = useRef<THREE.LineSegments>(null!);

  const { positions } = useMemo(() => {
    const pos: number[] = [];
    for (let i = 0; i < 60; i++) {
      const x1 = (Math.random() - 0.5) * 12;
      const y1 = (Math.random() - 0.5) * 12;
      const z1 = (Math.random() - 0.5) * 6;
      const x2 = x1 + (Math.random() - 0.5) * 3;
      const y2 = y1 + (Math.random() - 0.5) * 3;
      const z2 = z1 + (Math.random() - 0.5) * 2;
      pos.push(x1, y1, z1, x2, y2, z2);
    }
    return { positions: new Float32Array(pos) };
  }, []);

  useFrame((state) => {
    if (!linesRef.current) return;
    linesRef.current.rotation.z = state.clock.elapsedTime * 0.008;
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#8b5cf6"
        transparent
        opacity={0.035}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

function FloatingGeometry() {
  const torusRef = useRef<THREE.Mesh>(null!);
  const icosaRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.15;
      torusRef.current.rotation.y = t * 0.1;
      torusRef.current.position.y = Math.sin(t * 0.3) * 0.4;
    }
    if (icosaRef.current) {
      icosaRef.current.rotation.x = t * 0.1;
      icosaRef.current.rotation.z = t * 0.08;
      icosaRef.current.position.y = Math.cos(t * 0.25) * 0.3;
    }
  });

  return (
    <>
      <mesh ref={torusRef} position={[4, 1, -3]}>
        <torusGeometry args={[0.6, 0.15, 12, 24]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>
      <mesh ref={icosaRef} position={[-4.5, -1, -2]}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.08}
          wireframe
        />
      </mesh>
    </>
  );
}

export default function ParticleField() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        frameloop="always"
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.2} />
        <Particles count={250} />
        <NeuralLines />
        <FloatingGeometry />
      </Canvas>
    </div>
  );
}
