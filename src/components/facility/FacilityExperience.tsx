'use client';

import { Canvas } from '@react-three/fiber';
import { Preload, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { Suspense } from 'react';
import Scene from './Scene';
import CameraController from './CameraController';
import NavigationHUD from './NavigationHUD';
import LoadingScreen from './LoadingScreen';

export default function FacilityExperience() {
  return (
    <div className="w-full h-screen bg-[#030712] relative overflow-hidden">
      <Canvas
        camera={{ position: [0, 2, 35], fov: 60, near: 0.1, far: 500 }}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <Scene />
          <CameraController />
          <Preload all />
        </Suspense>
      </Canvas>
      <NavigationHUD />
      <LoadingScreen />
    </div>
  );
}
