'use client';

import dynamic from 'next/dynamic';

const TerminalExperience = dynamic(
  () => import('@/components/terminal/TerminalExperience'),
  {
    ssr: false,
    loading: () => (
      <div className="loading-screen">
        <div className="loading-text">INITIALIZING SYSTEM...</div>
        <div className="loading-bar">
          <div className="loading-bar-fill" />
        </div>
      </div>
    ),
  }
);

export default function Page() {
  return <TerminalExperience />;
}
