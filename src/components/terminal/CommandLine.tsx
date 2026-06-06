'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Html } from '@react-three/drei';
import { useTerminalStore, COMMAND_MAP } from '@/store/terminal-store';

function CommandLine() {
  const [inputValue, setInputValue] = useState('');
  const [commandOutput, setCommandOutput] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const { executeCommand, commandHistory, activeSection } = useTerminalStore();

  const prevSectionRef = useRef(activeSection);

  // Focus input on mount and section change
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // Clear output only when section actually changes
    if (prevSectionRef.current !== activeSection) {
      prevSectionRef.current = activeSection;
      // Use timeout to avoid synchronous setState in effect
      const timer = setTimeout(() => {
        setCommandOutput([]);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeSection]);

  const handleExecute = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    // Add to output log
    setCommandOutput(prev => [...prev.slice(-5), `> ${trimmed}`]);

    // Check if it's a valid command
    const normalizedCmd = trimmed.toLowerCase();

    if (normalizedCmd === 'help') {
      const helpText = COMMAND_MAP.map(m => `  ${m.command.padEnd(12)} — ${m.description}`);
      helpText.push(`  clear        — Clear terminal`);
      helpText.push(`  download resume — Download resume`);
      helpText.push(`  stats        — View tech stack`);
      setCommandOutput(prev => [...prev.slice(-5), ...helpText]);
    } else if (normalizedCmd === 'clear') {
      setCommandOutput([]);
    } else if (normalizedCmd === 'download resume') {
      setCommandOutput(prev => [...prev.slice(-5), '  Downloading resume...']);
      executeCommand(trimmed);
    } else if (normalizedCmd === 'stats') {
      executeCommand(trimmed);
      setCommandOutput(prev => [...prev.slice(-5), '  Navigating to tech stack...']);
    } else {
      const found = COMMAND_MAP.find(m => m.command === normalizedCmd);
      if (found) {
        executeCommand(trimmed);
        setCommandOutput(prev => [...prev.slice(-5), `  Navigating to ${found.description}...`]);
      } else {
        setCommandOutput(prev => [...prev.slice(-5), `  Unknown command: "${trimmed}". Type "help" for commands.`]);
      }
    }

    setInputValue('');
    setHistoryIndex(-1);

    // Focus after execute
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 50);
  }, [executeCommand]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleExecute(inputValue);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const hist = commandHistory;
      if (hist.length > 0) {
        const newIndex = historyIndex === -1 ? hist.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInputValue(hist[newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInputValue('');
        } else {
          setHistoryIndex(newIndex);
          setInputValue(commandHistory[newIndex] || '');
        }
      }
    }
  }, [inputValue, historyIndex, commandHistory, handleExecute]);

  return (
    <Html
      position={[0, -3.8, -0.1]}
      center
      distanceFactor={8}
      transform
      style={{ width: '1600px' }}
      zIndexRange={[0, 0]}
    >
      <div
        className="command-line-wrapper"
        style={{ fontFamily: "'Geist Mono', monospace" }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Command output log */}
        {commandOutput.length > 0 && (
          <div style={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            right: 0,
            padding: '8px 16px',
            background: 'rgba(3, 15, 25, 0.95)',
            borderBottom: '1px solid rgba(0, 240, 255, 0.1)',
            maxHeight: '120px',
            overflowY: 'auto',
            fontSize: 11,
          }}>
            {commandOutput.map((line, i) => (
              <div key={i} style={{
                color: line.startsWith('>') ? '#4a6b7c' : '#7a9aaa',
                marginBottom: 2,
                fontSize: 11,
              }}>
                {line}
              </div>
            ))}
          </div>
        )}

        <span className="command-line-prompt">FARHAN://mainframe/&gt;</span>
        <input
          ref={inputRef}
          className="command-line-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type 'help' for commands..."
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
        />
        <span className="command-line-cursor">█</span>
      </div>
    </Html>
  );
}

export default CommandLine;
