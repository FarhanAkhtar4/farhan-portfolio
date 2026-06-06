'use client';

import { Suspense, useCallback, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text, AdaptiveDpr, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import SceneSetup from './SceneSetup';
import CyberGrid from './CyberGrid';
import DataStreamParticles from './DataStreamParticles';
import HolographicScreen from './HolographicScreen';
import CommandLine from './CommandLine';
import Sidebar from './Sidebar';
import AudioToggle from './AudioToggle';
import { useTerminalStore } from '@/store/terminal-store';

/* ============================================================
   Loading Fallback — shown while Canvas initializes
   ============================================================ */
function LoadingFallback() {
  return (
    <div className="loading-screen">
      <div className="loading-text">INITIALIZING SYSTEM...</div>
      <div className="loading-bar">
        <div className="loading-bar-fill" />
      </div>
    </div>
  );
}

/* ============================================================
   3D Loading Text — Inside Canvas
   ============================================================ */
function CanvasLoadingText() {
  return (
    <Text
      position={[0, 2.5, 5]}
      fontSize={0.5}
      color="#00F0FF"
      anchorX="center"
      anchorY="middle"
      letterSpacing={0.15}
    >
      INITIALIZING...
    </Text>
  );
}

/* ============================================================
   Background Layer — Space nebula + atmospheric glow orbs
   ============================================================ */
function BackgroundLayer() {
  const [spaceTexture] = useTexture(['/textures/space-bg.png']);

  const spaceBgRef = useCallback((mesh: THREE.Mesh | null) => {
    if (mesh) {
      mesh.material = new THREE.MeshBasicMaterial({
        map: spaceTexture,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
    }
  }, [spaceTexture]);

  return (
    <group>
      {/* Space background plane — far behind everything */}
      <mesh ref={spaceBgRef} position={[0, 3, -30]}>
        <planeGeometry args={[60, 40]} />
      </mesh>

      {/* Atmospheric glow orb 1 — cyan, large, dim */}
      <mesh position={[-8, 4, -15]}>
        <sphereGeometry args={[8, 16, 16]} />
        <meshBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0.02}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Atmospheric glow orb 2 — violet, medium */}
      <mesh position={[8, 2, -12]}>
        <sphereGeometry args={[6, 16, 16]} />
        <meshBasicMaterial
          color="#A855F7"
          transparent
          opacity={0.015}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Atmospheric glow orb 3 — cyan, very large, very dim */}
      <mesh position={[0, 6, -20]}>
        <sphereGeometry args={[10, 16, 16]} />
        <meshBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0.01}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ============================================================
   Scene Content — All 3D elements
   ============================================================ */
function SceneContent() {
  return (
    <>
      <SceneSetup />
      <CyberGrid />
      <DataStreamParticles />
      <HolographicScreen />
      <CommandLine />
      <Sidebar />
    </>
  );
}

/* ============================================================
   Post Processing Effects — STRONG Bloom + Vignette
   ============================================================ */
function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={2.5}
        luminanceThreshold={0.1}
        luminanceSmoothing={0.4}
        mipmapBlur
      />
      <Vignette
        offset={0.3}
        darkness={0.6}
      />
    </EffectComposer>
  );
}

/* ============================================================
   Main TerminalExperience Component
   ============================================================ */
function TerminalExperience() {
  const [isReady, setIsReady] = useState(false);
  const { setLoaded } = useTerminalStore();

  // Camera settings — CLOSER and WIDER for dramatic 3D perspective
  const cameraPosition: [number, number, number] = [0, 2.2, 7];
  const cameraLookAt: [number, number, number] = [0, 2, 0];

  const handleCreated = useCallback((state: any) => {
    if (state.camera) {
      state.camera.lookAt(new THREE.Vector3(...cameraLookAt));
    }

    const timer = setTimeout(() => {
      setIsReady(true);
      setLoaded(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [setLoaded, cameraLookAt]);

  const dpr: [number, number] = [0.8, 1.5];

  return (
    <>
      <AudioToggle />

      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
        <Canvas
          dpr={dpr}
          camera={{
            position: cameraPosition,
            fov: 60,
            near: 0.1,
            far: 100,
          }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
            alpha: false,
            powerPreference: 'high-performance',
          }}
          onCreated={handleCreated}
          style={{ background: '#030712' }}
          frameloop="always"
          performance={{ min: 0.5 }}
        >
          <Suspense fallback={<CanvasLoadingText />}>
            <BackgroundLayer />
          </Suspense>

          {!isReady ? (
            <CanvasLoadingText />
          ) : (
            <Suspense fallback={<CanvasLoadingText />}>
              <SceneContent />
              <AdaptiveDpr pixelated />
            </Suspense>
          )}

          <Suspense fallback={null}>
            <Effects />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

export default TerminalExperience;
