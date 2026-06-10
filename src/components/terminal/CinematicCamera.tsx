'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTerminalStore } from '@/store/terminal-store';

/* ============================================================
   Cinematic Camera Controller
   Automated dolly forward → pan → pull back → orbit
   with smooth easing and sinusoidal sway overlay.
   Responds to section changes (interactive mode).
   ============================================================ */

// Camera keyframe definitions
interface Keyframe {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
}

// Phase definitions (32s total loop)
const PHASES: { duration: number; start: Keyframe; end: Keyframe }[] = [
  {
    duration: 8,
    start: { position: new THREE.Vector3(0, 2.5, 8), lookAt: new THREE.Vector3(0, 2.5, -2) },
    end: { position: new THREE.Vector3(0, 2.5, 5.5), lookAt: new THREE.Vector3(0, 2.2, -2) },
  },
  {
    duration: 8,
    start: { position: new THREE.Vector3(0, 2.5, 5.5), lookAt: new THREE.Vector3(0, 2.2, -2) },
    end: { position: new THREE.Vector3(1.5, 2.8, 5), lookAt: new THREE.Vector3(0, 2.3, -2) },
  },
  {
    duration: 8,
    start: { position: new THREE.Vector3(1.5, 2.8, 5), lookAt: new THREE.Vector3(0, 2.3, -2) },
    end: { position: new THREE.Vector3(0, 2.2, 7), lookAt: new THREE.Vector3(0, 2.4, -2) },
  },
  {
    duration: 8,
    start: { position: new THREE.Vector3(0, 2.2, 7), lookAt: new THREE.Vector3(0, 2.4, -2) },
    end: { position: new THREE.Vector3(0, 2.5, 8), lookAt: new THREE.Vector3(0, 2.5, -2) },
  },
];

const TOTAL_DURATION = PHASES.reduce((sum, p) => sum + p.duration, 0);
const INTERACTIVE_DURATION = 10; // seconds before returning to cinematic
const INTERACTIVE_POSITION = new THREE.Vector3(0, 2.5, 5.5);
const INTERACTIVE_LOOKAT = new THREE.Vector3(0, 2.2, -2);

// Smoothstep easing
function smoothstep(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped * clamped * (3 - 2 * clamped);
}

// Smootherstep for more cinematic feel
function smootherstep(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped * clamped * clamped * (clamped * (clamped * 6 - 15) + 10);
}

// Get phase index and local time
function getPhaseInfo(time: number): { phaseIndex: number; localT: number } {
  const loopedTime = time % TOTAL_DURATION;
  let elapsed = 0;
  for (let i = 0; i < PHASES.length; i++) {
    if (loopedTime < elapsed + PHASES[i].duration) {
      return { phaseIndex: i, localT: (loopedTime - elapsed) / PHASES[i].duration };
    }
    elapsed += PHASES[i].duration;
  }
  return { phaseIndex: PHASES.length - 1, localT: 1 };
}

// Get camera state at a given time in the cinematic loop
function getCinematicState(time: number): { position: THREE.Vector3; lookAt: THREE.Vector3 } {
  const { phaseIndex, localT } = getPhaseInfo(time);
  const phase = PHASES[phaseIndex];
  const t = smootherstep(localT);

  const position = new THREE.Vector3().lerpVectors(phase.start.position, phase.end.position, t);
  const lookAt = new THREE.Vector3().lerpVectors(phase.start.lookAt, phase.end.lookAt, t);

  return { position, lookAt };
}

// Lerp vector3
function lerpV3(a: THREE.Vector3, b: THREE.Vector3, t: number): THREE.Vector3 {
  return new THREE.Vector3(
    a.x + (b.x - a.x) * t,
    a.y + (b.y - a.y) * t,
    a.z + (b.z - a.z) * t
  );
}

export default function CinematicCamera() {
  const { camera } = useThree();
  const cameraMode = useTerminalStore((s) => s.cameraMode);
  const interactiveTriggerTime = useRef(0);
  const currentPosition = useRef(new THREE.Vector3(0, 2.5, 8));
  const currentLookAt = useRef(new THREE.Vector3(0, 2.5, -2));
  const initialized = useRef(false);
  const elapsedRef = useRef(0);

  // Phase 4 orbital position calculation
  const getOrbitalState = (time: number) => {
    const { phaseIndex, localT } = getPhaseInfo(time);
    if (phaseIndex !== 3) return null;

    // During phase 4, we orbit the scene
    const orbitAngle = localT * Math.PI * 0.5; // quarter orbit
    const radius = 7 - localT * 0.5; // gradually move back to start position
    const height = 2.2 + localT * 0.3;

    const x = Math.sin(orbitAngle) * radius;
    const z = Math.cos(orbitAngle) * radius;

    return {
      position: new THREE.Vector3(x, height, z),
      lookAt: new THREE.Vector3(0, 2.4 + localT * 0.1, -2),
    };
  };

  useFrame((state, delta) => {
    elapsedRef.current += delta;
    const time = elapsedRef.current;

    let targetPosition: THREE.Vector3;
    let targetLookAt: THREE.Vector3;

    if (cameraMode === 'interactive') {
      targetPosition = INTERACTIVE_POSITION;
      targetLookAt = INTERACTIVE_LOOKAT;
    } else {
      // Check for phase 4 orbital
      const orbitalState = getOrbitalState(time);
      if (orbitalState) {
        targetPosition = orbitalState.position;
        targetLookAt = orbitalState.lookAt;
      } else {
        const cinematicState = getCinematicState(time);
        targetPosition = cinematicState.position;
        targetLookAt = cinematicState.lookAt;
      }
    }

    // Sinusoidal sway overlay (subtle breathing motion)
    const swayX = Math.sin(time * 0.4) * 0.04;
    const swayY = Math.sin(time * 0.6 + 1.0) * 0.03;
    targetPosition = targetPosition.clone().add(new THREE.Vector3(swayX, swayY, 0));

    // Smooth interpolation to target (for mode transitions)
    const lerpFactor = 1 - Math.pow(0.05, delta); // frame-rate independent smoothing
    currentPosition.current.lerp(targetPosition, lerpFactor);
    currentLookAt.current.lerp(targetLookAt, lerpFactor);

    // Apply to camera
    camera.position.copy(currentPosition.current);
    camera.lookAt(currentLookAt.current);
  });

  return null; // This component only manipulates the camera, renders nothing
}
