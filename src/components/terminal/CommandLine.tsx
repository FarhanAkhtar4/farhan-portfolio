'use client';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTerminalStore } from '@/store/terminal-store';
import { C } from './TerminalUI';

const CMD_AREA_W = 12.0;
const CMD_AREA_H = 0.8;

function CommandLine() {
  const inputRef = useRef<HTMLInputElement>(null);
  const groupRef = useRef<THREE.Group>(null);
  const promptRef = useRef<THREE.Mesh>(null);
  const cursorGeo = useMemo(() => new THREE.PlaneGeometry(0.07, 0.14), []);
  const cursorRef = useRef<THREE.Mesh>(null);
  const cursorOpacityRef = useRef(1);
  const frameCountRef = useRef(0);

  // Terminal frame geometries
  const frameGeo = useMemo(() => new THREE.PlaneGeometry(CMD_AREA_W, CMD_AREA_H), []);
  const frameEdgeGeo = useMemo(() => new THREE.EdgesGeometry(frameGeo), [frameGeo]);
  const scanGeo = useMemo(() => new THREE.PlaneGeometry(CMD_AREA_W * 0.9, 0.015), []);

  const [inputValue, setInputValue] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [localHistory, setLocalHistory] = useState<string[]>([]);

  const commandOutput = useTerminalStore((s) => s.commandOutput);
  const executeCommand = useTerminalStore((s) => s.executeCommand);
  const setActiveSection = useTerminalStore((s) => s.setActiveSection);

  useEffect(() => {
    const tryFocus = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    tryFocus();
    const interval = setInterval(tryFocus, 500);
    const handleClick = () => {
      tryFocus();
    };
    window.addEventListener('click', handleClick);
    return () => {
      clearInterval(interval);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  useFrame((state) => {
    frameCountRef.current++;
    if (frameCountRef.current % 30 === 0) {
      cursorOpacityRef.current = cursorOpacityRef.current > 0.5 ? 0 : 1;
    }
    if (cursorRef.current) {
      const mat = cursorRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = cursorOpacityRef.current;
    }

    // Subtle prompt pulse
    if (promptRef.current) {
      const mat = promptRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.08 + Math.sin(state.clock.elapsedTime * 2.5) * 0.04;
    }
  });

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = inputValue.trim();
        if (cmd) {
          setLocalHistory((prev) => [...prev, cmd]);
          executeCommand(cmd);
          setInputValue('');
          setHistoryIndex(-1);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (localHistory.length === 0) return;
        const newIndex = historyIndex === -1 ? localHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInputValue(localHistory[newIndex]);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex === -1) return;
        const newIndex = historyIndex + 1;
        if (newIndex >= localHistory.length) {
          setHistoryIndex(-1);
          setInputValue('');
        } else {
          setHistoryIndex(newIndex);
          setInputValue(localHistory[newIndex]);
        }
      }
    },
    [inputValue, localHistory, historyIndex, executeCommand]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const promptText = 'FARHAN://mainframe > ';
  const displayText = inputValue || '';

  const visibleOutput = commandOutput.slice(-3);

  return (
    <group ref={groupRef} position={[0, -2.5, -2]}>
      {/* Glowing terminal frame background */}
      <mesh geometry={frameGeo} position={[0, 0.3, -0.001]}>
        <meshBasicMaterial color="#030a15" transparent opacity={0.9} />
      </mesh>

      {/* Frame edges — bright cyan for bloom */}
      <lineSegments geometry={frameEdgeGeo} position={[0, 0.3, 0.001]}>
        <lineBasicMaterial color={C.cyan} transparent opacity={0.7} />
      </lineSegments>

      {/* Inner subtle glow fill behind prompt */}
      <mesh ref={promptRef} geometry={frameGeo} position={[0, 0.3, -0.0005]}>
        <meshBasicMaterial
          color={C.cyan}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Command output lines above input */}
      {visibleOutput.map((line, i) => (
        <Text
          key={`output-${i}-${line}`}
          position={[-5.8, 0.65 + (visibleOutput.length - 1 - i) * 0.22, 0.01]}
          fontSize={0.1}
          color={C.dim}
          anchorX="left"
          maxWidth={12}
        >
          {line}
        </Text>
      ))}

      {/* Prompt text — pulsing */}
      <Text
        position={[-5.8, 0.3, 0.01]}
        fontSize={0.11}
        color={C.cyan}
        anchorX="left"
      >
        {promptText}
      </Text>

      {/* Typed text */}
      <Text
        position={[-5.8 + promptText.length * 0.055, 0.3, 0.01]}
        fontSize={0.11}
        color={C.text}
        anchorX="left"
        maxWidth={10}
      >
        {displayText}
      </Text>

      {/* Blinking cursor */}
      <mesh ref={cursorRef} geometry={cursorGeo} position={[-5.8 + (promptText.length + displayText.length) * 0.055, 0.3, 0.012]}>
        <meshBasicMaterial color={C.cyan} transparent opacity={1} />
      </mesh>

      {/* Scanning line through command area */}
      <mesh geometry={scanGeo} position={[0, 0.3, 0.002]}>
        <meshBasicMaterial
          color={C.cyan}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Hidden input for keyboard capture */}
      <Html
        position={[0, 0, 0]}
        style={{ pointerEvents: 'none' }}
        zIndexRange={[-1, -1]}
      >
        <input
          ref={inputRef}
          className="terminal-hidden-input"
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          tabIndex={-1}
        />
      </Html>
    </group>
  );
}

export default CommandLine;
