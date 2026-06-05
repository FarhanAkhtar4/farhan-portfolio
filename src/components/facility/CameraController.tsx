'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useFacilityStore, ROOM_POSITIONS } from '@/store/facility-store';

export default function CameraController() {
  const { camera } = useThree();
  const currentRoom = useFacilityStore((s) => s.currentRoom);
  const isTransitioning = useFacilityStore((s) => s.isTransitioning);
  const setTransitioning = useFacilityStore((s) => s.setTransitioning);
  const hasEntered = useFacilityStore((s) => s.hasEntered);
  const setHasEntered = useFacilityStore((s) => s.setHasEntered);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const cameraTarget = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());

  // Initial camera position
  useEffect(() => {
    camera.position.set(0, 3, 40);
    camera.lookAt(0, 2, 30);
    cameraTarget.current.copy(camera.position);
    lookTarget.current.set(0, 2, 30);
  }, [camera]);

  // Smooth camera look-at each frame
  useEffect(() => {
    let raf: number;
    const update = () => {
      camera.lookAt(lookTarget.current);
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [camera]);

  const goToRoom = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentRoom) return;

      const room = ROOM_POSITIONS[index];
      const targetPos = new THREE.Vector3(...room.position).add(new THREE.Vector3(0, 0, 8));
      const targetLook = new THREE.Vector3(...room.position);

      setTransitioning(true);

      if (tweenRef.current) {
        tweenRef.current.kill();
      }

      tweenRef.current = gsap.to(cameraTarget.current, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 1.8,
        ease: 'power2.inOut',
        onUpdate: () => {
          camera.position.copy(cameraTarget.current);
        },
        onComplete: () => {
          setTransitioning(false);
        },
      });

      gsap.to(lookTarget.current, {
        x: targetLook.x,
        y: targetLook.y,
        z: targetLook.z,
        duration: 1.8,
        ease: 'power2.inOut',
      });
    },
    [currentRoom, isTransitioning, setTransitioning, camera]
  );

  // React to room changes
  useEffect(() => {
    if (hasEntered) {
      goToRoom(currentRoom);
    }
  }, [currentRoom, hasEntered, goToRoom]);

  // Entry animation: dolly in from far
  const handleEnter = useCallback(() => {
    setHasEntered(true);
    useFacilityStore.getState().setCurrentRoom(1);
  }, [setHasEntered]);

  // Expose enter function to window for HUD
  useEffect(() => {
    (window as unknown as Record<string, () => void>).__facilityEnter = handleEnter;
    return () => {
      delete (window as unknown as Record<string, (() => void) | undefined>).__facilityEnter;
    };
  }, [handleEnter]);

  return null;
}
