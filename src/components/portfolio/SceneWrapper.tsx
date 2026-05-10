'use client';

import React, { Component, useState, useEffect } from 'react';
import ParticleField from './ParticleField';

class ThreeErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export default function SceneWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ThreeErrorBoundary>
      <ParticleField />
    </ThreeErrorBoundary>
  );
}
