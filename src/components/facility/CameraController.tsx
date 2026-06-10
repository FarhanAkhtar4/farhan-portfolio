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

  // Mouse drag state
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    offsetX: 0, // radians
    offsetY: 0, // radians
    targetOffsetX: 0,
    targetOffsetY: 0,
  });

  // Rotational offset for look-around
  const lookOffset = useRef(new THREE.Vector2(0, 0));

  // Initial camera position
  useEffect(() => {
    camera.position.set(0, 3, 40);
    camera.lookAt(0, 2, 30);
    cameraTarget.current.copy(camera.position);
    lookTarget.current.set(0, 2, 30);
  }, [camera]);

  // Smooth camera look-at each frame with drag offset
  useEffect(() => {
    let raf: number;
    const update = () => {
      // Lerp offset back to 0 when not dragging
      const ds = dragState.current;
      if (!ds.isDragging) {
        ds.targetOffsetX *= 0.95;
        ds.targetOffsetY *= 0.95;
      }
      lookOffset.current.x += (ds.targetOffsetX - lookOffset.current.x) * 0.08;
      lookOffset.current.y += (ds.targetOffsetY - lookOffset.current.y) * 0.08;

      // Calculate offset direction from camera to look target
      const dir = new THREE.Vector3().subVectors(lookTarget.current, camera.position).normalize();

      // Create a right vector and up vector for rotational offsets
      const worldUp = new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3().crossVectors(dir, worldUp).normalize();
      const actualUp = new THREE.Vector3().crossVectors(right, dir).normalize();

      // Apply horizontal (yaw) and vertical (pitch) rotation offsets
      const offsetDir = dir
        .clone()
        .applyAxisAngle(worldUp, lookOffset.current.x)
        .applyAxisAngle(right, -lookOffset.current.y);

      const finalTarget = camera.position.clone().add(offsetDir.multiplyScalar(10));
      camera.lookAt(finalTarget);

      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [camera]);

  // Mouse/touch drag event handlers on the canvas
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const handlePointerDown = (e: PointerEvent) => {
      dragState.current.isDragging = true;
      dragState.current.startX = e.clientX;
      dragState.current.startY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!dragState.current.isDragging) return;
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;

      // Sensitivity factor
      const sensitivity = 0.002;

      dragState.current.targetOffsetX = Math.max(-0.3, Math.min(0.3, dx * sensitivity));
      dragState.current.targetOffsetY = Math.max(-0.15, Math.min(0.15, -dy * sensitivity));
    };

    const handlePointerUp = () => {
      dragState.current.isDragging = false;
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);
    };
  }, []);

  const goToRoom = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentRoom) return;

      const room = ROOM_POSITIONS[index];
      const targetPos = new THREE.Vector3(...room.position).add(new THREE.Vector3(0, 0, 8));
      const targetLook = new THREE.Vector3(...room.position);

      setTransitioning(true);

      // Reset drag offset on room change
      dragState.current.targetOffsetX = 0;
      dragState.current.targetOffsetY = 0;

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
