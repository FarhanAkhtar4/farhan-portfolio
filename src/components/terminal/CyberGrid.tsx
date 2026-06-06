'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const gridVertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const gridFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uGridSize;
  uniform float uFadeDistance;

  varying vec2 vUv;
  varying vec3 vWorldPosition;

  float gridLine(vec2 coord, float lineWidth, float gridSize) {
    vec2 wrapped = mod(coord + gridSize * 0.5, gridSize) - gridSize * 0.5;
    vec2 grid = abs(wrapped);
    vec2 lines = smoothstep(lineWidth, lineWidth + 0.02, grid);
    return 1.0 - min(lines.x, lines.y);
  }

  void main() {
    // Distance from camera (approximate fade)
    float dist = length(vWorldPosition.xz) / uFadeDistance;
    float fade = 1.0 - smoothstep(0.2, 1.0, dist);

    // Animated grid
    float speed = uTime * 0.08;
    vec2 gridCoord = vWorldPosition.xz;

    // Horizontal and vertical grid lines
    float lineX = gridLine(vec2(gridCoord.x, gridCoord.y + speed), 0.03, uGridSize);
    float lineZ = gridLine(vec2(gridCoord.x + speed * 0.5, gridCoord.y), 0.03, uGridSize);

    // Major grid lines (every 5th line)
    float majorLineX = gridLine(vec2(gridCoord.x, gridCoord.y + speed), 0.05, uGridSize * 5.0);
    float majorLineZ = gridLine(vec2(gridCoord.x + speed * 0.5, gridCoord.y), 0.05, uGridSize * 5.0);

    float grid = max(lineX, lineZ) * 0.6 + max(majorLineX, majorLineZ) * 0.8;

    // Subtle pulse
    float pulse = sin(uTime * 0.5) * 0.15 + 0.85;

    // PULSE WAVE emanating from center — bright ring expanding outward
    float distFromCenter = length(vWorldPosition.xz);
    float waveSpeed = 2.0;
    float waveWidth = 3.0;
    float wave = smoothstep(waveWidth, 0.0, abs(distFromCenter - mod(uTime * waveSpeed, 30.0))) * 0.45;

    // Final color — BRIGHTER lines (0.55)
    vec3 color = uColor * grid * fade * pulse * 0.55;

    // Add subtle glow at intersections
    float intersections = max(lineX * lineZ, 0.0) * fade;
    color += uColor * intersections * 0.5;

    // Add pulse wave
    color += uColor * wave * fade;

    // Base dark with subtle noise-like variation
    float noise = fract(sin(dot(vWorldPosition.xz, vec2(12.9898, 78.233))) * 43758.5453) * 0.01;
    vec3 baseColor = vec3(0.012, 0.027, 0.07) + noise;
    
    // Mix grid on top of base
    vec3 finalColor = baseColor + color;

    gl_FragColor = vec4(finalColor, fade * 0.95);
  }
`;

function CyberGrid() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#00F0FF') },
      uGridSize: { value: 1.0 },
      uFadeDistance: { value: 25.0 },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
    >
      <planeGeometry args={[80, 80, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={gridVertexShader}
        fragmentShader={gridFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export default CyberGrid;
