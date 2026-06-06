'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text, AdaptiveDpr } from '@react-three/drei';
import { EffectComposer, Vignette } from '@react-three/postprocessing';
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
      position={[0, 0, 5]}
      fontSize={0.5}
      color="#00F0FF"
      anchorX="center"
      anchorY="middle"
      font="/fonts/geist-mono.woff"
      letterSpacing={0.15}
    >
      INITIALIZING...
    </Text>
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
   Post Processing Effects
   ============================================================ */
function Effects() {
  return (
    <EffectComposer>
      <Vignette
        offset={0.3}
        darkness={0.7}
        blendFunction={undefined}
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

  // Camera settings
  const cameraPosition: [number, number, number] = [0, 2, 8];
  const cameraLookAt: [number, number, number] = [0, 1, 0];

  const handleCreated = useCallback((state: any) => {
    // Set camera to look at target
    if (state.camera) {
      state.camera.lookAt(new THREE.Vector3(...cameraLookAt));
    }

    // Mark as loaded after a short delay for assets
    const timer = setTimeout(() => {
      setIsReady(true);
      setLoaded(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [setLoaded]);

  // Handle dpr changes
  const dpr: [number, number] = [0.8, 1.5];

  return (
    <>
      {/* Audio toggle overlay (HTML, not in Canvas) */}
      <AudioToggle />

      {/* Main 3D Canvas */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
        <Canvas
          dpr={dpr}
          camera={{
            position: cameraPosition,
            fov: 50,
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
          {/* Loading state — shows text until ready */}
          {!isReady ? (
            <CanvasLoadingText />
          ) : (
            <Suspense fallback={<CanvasLoadingText />}>
              <SceneContent />
              <AdaptiveDpr pixelated />
            </Suspense>
          )}

          {/* Post processing — always active */}
          <Suspense fallback={null}>
            <Effects />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

export default TerminalExperience;
