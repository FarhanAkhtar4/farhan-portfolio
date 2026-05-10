'use client';

import React, { Component } from 'react';
import dynamic from 'next/dynamic';

const ParticleField = dynamic(() => import('./ParticleField'), {
  ssr: false,
  loading: () => null,
});

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
  return (
    <ThreeErrorBoundary>
      <ParticleField />
    </ThreeErrorBoundary>
  );
}
