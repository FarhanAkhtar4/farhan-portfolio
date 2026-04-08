"use client";

import { useEffect, useRef, useCallback } from "react";

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const visible = useRef(false);
  const hovered = useRef(false);
  const clicked = useRef(false);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef(0);

  const isInteractive = useCallback((el: EventTarget | null): boolean => {
    if (!el || !(el instanceof HTMLElement)) return false;
    const t = el;
    return (
      t.tagName === "A" ||
      t.tagName === "BUTTON" ||
      t.closest("a") !== null ||
      t.closest("button") !== null ||
      t.closest('[role="button"]') !== null ||
      t.dataset.cursor === "pointer"
    );
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || "ontouchstart" in window) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const animate = () => {
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.15);
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.15);

      ring.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
      dot.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;

      rafId.current = requestAnimationFrame(animate);
    };

    const onMove = (e: MouseEvent) => {
      if (!visible.current) {
        visible.current = true;
        ring.style.opacity = "1";
        dot.style.opacity = "1";
      }
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
    };

    const onDown = () => {
      clicked.current = true;
      ring.style.width = "24px";
      ring.style.height = "24px";
      ring.style.borderColor = "rgba(255,255,255,0.6)";
      dot.style.width = "3px";
      dot.style.height = "3px";
      dot.style.transform += " scale(0.8)";
    };

    const onUp = () => {
      clicked.current = false;
      const size = hovered.current ? 40 : 32;
      ring.style.width = size + "px";
      ring.style.height = size + "px";
      ring.style.borderColor = "rgba(255,255,255,0.35)";
      dot.style.width = "4px";
      dot.style.height = "4px";
    };

    const onOver = (e: MouseEvent) => {
      if (isInteractive(e.target)) {
        hovered.current = true;
        ring.style.width = "40px";
        ring.style.height = "40px";
        ring.style.borderColor = "rgba(139,92,246,0.5)";
        ring.style.background = "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)";
        dot.style.width = "5px";
        dot.style.height = "5px";
        dot.style.background = "#8b5cf6";
      }
    };

    const onOut = (e: MouseEvent) => {
      if (isInteractive(e.target)) {
        hovered.current = false;
        if (!clicked.current) {
          ring.style.width = "32px";
          ring.style.height = "32px";
          ring.style.borderColor = "rgba(255,255,255,0.35)";
          ring.style.background = "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)";
          dot.style.width = "4px";
          dot.style.height = "4px";
          dot.style.background = "#ffffff";
        }
      }
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });

    rafId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId.current);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [isInteractive]);

  return (
    <>
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.35)",
          background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 0,
          willChange: "transform, width, height, border-color, background",
          transition: "width 0.2s ease, height 0.2s ease, border-color 0.2s ease, background 0.2s ease",
        }}
      />
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: "#ffffff",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 0,
          willChange: "transform, width, height, background",
          transition: "width 0.15s ease, height 0.15s ease, background 0.15s ease",
        }}
      />
    </>
  );
}
