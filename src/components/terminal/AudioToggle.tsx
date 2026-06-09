'use client';

import { useCallback } from 'react';
import { useTerminalStore } from '@/store/terminal-store';

function AudioToggle() {
  const { audioEnabled, toggleAudio } = useTerminalStore();

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleAudio();
  }, [toggleAudio]);

  return (
    <button
      className="audio-toggle-btn"
      onClick={handleClick}
      title={audioEnabled ? 'Mute audio' : 'Enable audio'}
      aria-label={audioEnabled ? 'Mute audio' : 'Enable audio'}
    >
      {audioEnabled ? (
        <span>♪</span>
      ) : (
        <span className="icon-muted">♪</span>
      )}
    </button>
  );
}

export default AudioToggle;
