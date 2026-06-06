'use client';

import { Suspense, useCallback, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, AdaptiveDpr } from '@react-three/drei';
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
   Camera Controller — subtle continuous sway + pulse on section change
   Uses a scene group transform instead of direct camera mutation
   ============================================================ */
function CameraSway() {
  const groupRef = useRef<THREE.Group>(null);
  const prevSectionRef = useRef<string | null>(null);
  const pulseTimerRef = useRef(0);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const activeSection = useTerminalStore.getState().activeSection;

    // Detect section change → pulse
    if (activeSection !== prevSectionRef.current) {
      pulseTimerRef.current = 1.0;
      prevSectionRef.current = activeSection;
    }

    // Continuous sinusoidal sway applied to scene group
    const swayX = Math.sin(t * 0.15) * 0.08;
    const swayY = Math.sin(t * 0.2 + 0.5) * 0.06;

    // Pulse decay (zoom in then back)
    if (pulseTimerRef.current > 0) {
      pulseTimerRef.current = Math.max(0, pulseTimerRef.current - 0.04);
    }
    const pulseAmount = pulseTimerRef.current * 0.4;
    const pulseEase = Math.sin(pulseTimerRef.current * Math.PI);

    groupRef.current.position.x = swayX;
    groupRef.current.position.y = swayY;
    groupRef.current.position.z = -pulseEase * pulseAmount;
  });

  return <group ref={groupRef} />;
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
      <CameraSway />
    </>
  );
}

/* ============================================================
   Post Processing Effects — Bloom + Vignette
   ============================================================ */
function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={1.5}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
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

  // Camera settings
  const cameraPosition: [number, number, number] = [0, 2.5, 9];
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
