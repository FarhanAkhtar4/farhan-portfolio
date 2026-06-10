'use client';

import * as THREE from 'three';

/* ============================================================
   Procedural Textures — Canvas-based texture generators
   All return THREE.CanvasTexture objects
   ============================================================ */

/**
 * Circuit Board Texture — Dark background with cyan circuit traces, nodes, and data paths
 */
export function createCircuitBoardTexture(width = 1024, height = 1024): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Dark base
  ctx.fillStyle = '#060d18';
  ctx.fillRect(0, 0, width, height);

  // Subtle grid lines
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
  ctx.lineWidth = 1;
  const gridSize = 32;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Circuit traces
  const traceColor = 'rgba(0, 240, 255, 0.12)';
  const traceHighlight = 'rgba(0, 240, 255, 0.25)';
  ctx.strokeStyle = traceColor;
  ctx.lineWidth = 2;

  // Horizontal and vertical traces
  const rng = (seed: number) => {
    let s = seed;
    return () => {
      s = (s * 16807 + 0) % 2147483647;
      return s / 2147483647;
    };
  };

  const rand = rng(42);

  // Draw circuit paths
  for (let i = 0; i < 60; i++) {
    ctx.strokeStyle = rand() > 0.7 ? traceHighlight : traceColor;
    ctx.lineWidth = rand() > 0.8 ? 3 : 1.5;
    ctx.beginPath();

    let x = Math.floor(rand() * (width / gridSize)) * gridSize;
    let y = Math.floor(rand() * (height / gridSize)) * gridSize;
    ctx.moveTo(x, y);

    const segments = 4 + Math.floor(rand() * 8);
    for (let s = 0; s < segments; s++) {
      if (rand() > 0.5) {
        x += (rand() > 0.5 ? 1 : -1) * gridSize * (1 + Math.floor(rand() * 4));
      } else {
        y += (rand() > 0.5 ? 1 : -1) * gridSize * (1 + Math.floor(rand() * 4));
      }
      x = Math.max(0, Math.min(width, x));
      y = Math.max(0, Math.min(height, y));
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Nodes at intersections
  for (let i = 0; i < 120; i++) {
    const nx = Math.floor(rand() * (width / gridSize)) * gridSize;
    const ny = Math.floor(rand() * (height / gridSize)) * gridSize;
    const nodeSize = 2 + rand() * 4;

    ctx.fillStyle = rand() > 0.8 ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.15)';
    ctx.beginPath();
    ctx.arc(nx, ny, nodeSize, 0, Math.PI * 2);
    ctx.fill();

    // Glow ring for some nodes
    if (rand() > 0.9) {
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(nx, ny, nodeSize + 4, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Data path highlights (violet)
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.08)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 15; i++) {
    ctx.beginPath();
    let x = Math.floor(rand() * (width / gridSize)) * gridSize;
    let y = Math.floor(rand() * (height / gridSize)) * gridSize;
    ctx.moveTo(x, y);
    const segments = 3 + Math.floor(rand() * 5);
    for (let s = 0; s < segments; s++) {
      if (rand() > 0.5) x += gridSize * (1 + Math.floor(rand() * 6));
      else y += gridSize * (1 + Math.floor(rand() * 6));
      x = Math.max(0, Math.min(width, x));
      y = Math.max(0, Math.min(height, y));
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Nebula Texture — Colorful nebula/space background with stars
 */
export function createNebulaTexture(width = 2048, height = 2048): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Dark base
  ctx.fillStyle = '#020408';
  ctx.fillRect(0, 0, width, height);

  // Nebula clouds (layered radial gradients)
  const clouds = [
    { x: width * 0.3, y: height * 0.4, r: 400, color1: 'rgba(0, 240, 255, 0.06)', color2: 'rgba(0, 240, 255, 0)' },
    { x: width * 0.7, y: height * 0.3, r: 350, color1: 'rgba(168, 85, 247, 0.05)', color2: 'rgba(168, 85, 247, 0)' },
    { x: width * 0.5, y: height * 0.6, r: 500, color1: 'rgba(0, 120, 200, 0.04)', color2: 'rgba(0, 120, 200, 0)' },
    { x: width * 0.2, y: height * 0.7, r: 300, color1: 'rgba(100, 50, 180, 0.04)', color2: 'rgba(100, 50, 180, 0)' },
    { x: width * 0.8, y: height * 0.7, r: 350, color1: 'rgba(0, 200, 220, 0.04)', color2: 'rgba(0, 200, 220, 0)' },
    { x: width * 0.5, y: height * 0.3, r: 600, color1: 'rgba(10, 20, 60, 0.08)', color2: 'rgba(10, 20, 60, 0)' },
  ];

  for (const cloud of clouds) {
    const grad = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.r);
    grad.addColorStop(0, cloud.color1);
    grad.addColorStop(0.5, cloud.color2);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  // Stars
  const rng = (seed: number) => {
    let s = seed;
    return () => {
      s = (s * 16807 + 0) % 2147483647;
      return s / 2147483647;
    };
  };
  const rand = rng(777);

  for (let i = 0; i < 800; i++) {
    const sx = rand() * width;
    const sy = rand() * height;
    const brightness = rand();
    const starSize = brightness > 0.95 ? 2 : (brightness > 0.8 ? 1.5 : 0.8);

    const alpha = 0.3 + brightness * 0.7;
    if (brightness > 0.9) {
      ctx.fillStyle = `rgba(180, 220, 255, ${alpha})`;
    } else if (brightness > 0.7) {
      ctx.fillStyle = `rgba(200, 200, 255, ${alpha * 0.6})`;
    } else {
      ctx.fillStyle = `rgba(150, 180, 220, ${alpha * 0.4})`;
    }

    ctx.beginPath();
    ctx.arc(sx, sy, starSize, 0, Math.PI * 2);
    ctx.fill();

    // Star glow for bright ones
    if (brightness > 0.9) {
      const glowGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, starSize * 4);
      glowGrad.addColorStop(0, `rgba(180, 220, 255, ${alpha * 0.3})`);
      glowGrad.addColorStop(1, 'rgba(180, 220, 255, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(sx - starSize * 4, sy - starSize * 4, starSize * 8, starSize * 8);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Scanline Texture — Horizontal scan lines for holographic overlay
 */
export function createScanlineTexture(width = 1024, height = 1024): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.clearRect(0, 0, width, height);

  // Horizontal scanlines
  for (let y = 0; y < height; y += 3) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, y, width, 1);
  }

  // Slight brighter line every 4th
  for (let y = 0; y < height; y += 12) {
    ctx.fillStyle = 'rgba(0, 240, 255, 0.02)';
    ctx.fillRect(0, y, width, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Noise Texture — Random noise for film grain effect
 */
export function createNoiseTexture(width = 512, height = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const v = Math.random() * 255;
    data[i] = v;
    data[i + 1] = v;
    data[i + 2] = v;
    data[i + 3] = 25;
  }

  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Holographic Noise — Interference pattern for holographic effect
 */
export function createHolographicNoise(width = 1024, height = 1024): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.clearRect(0, 0, width, height);

  // Holographic interference bands
  for (let y = 0; y < height; y++) {
    const val = Math.sin(y * 0.1) * 0.5 + 0.5;
    const alpha = val * 0.04;
    const r = Math.sin(y * 0.05) * 30;
    const g = Math.sin(y * 0.03 + 1) * 60 + 180;
    const b = Math.sin(y * 0.07 + 2) * 40 + 215;

    ctx.fillStyle = `rgba(${Math.floor(r + 180)}, ${Math.floor(g)}, ${Math.floor(b)}, ${alpha})`;
    ctx.fillRect(0, y, width, 1);
  }

  // Random sparkle pixels
  const rng = (seed: number) => {
    let s = seed;
    return () => {
      s = (s * 16807 + 0) % 2147483647;
      return s / 2147483647;
    };
  };
  const rand = rng(123);

  for (let i = 0; i < 300; i++) {
    const sx = rand() * width;
    const sy = rand() * height;
    ctx.fillStyle = `rgba(0, 240, 255, ${0.05 + rand() * 0.1})`;
    ctx.fillRect(sx, sy, 1, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}
