'use client';
import { useEffect, useRef } from "react";

/**
 * Глобальный анимированный фон сайта.
 */

const VELOCITY_TO_OFFSET = 0.06;
const MAX_OFFSET = 12;
const TARGET_DECAY = 0.12;
const SPRING = 0.18;

export function SiteBackground() {
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = layerRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let lastY = window.scrollY;
    let target = 0;
    let current = 0;
    let rafId = 0;
    let running = false;

    const clamp = (v: number, min: number, max: number) =>
      v < min ? min : v > max ? max : v;

    const tick = () => {
      target *= 1 - TARGET_DECAY;
      current += (target - current) * SPRING;

      if (Math.abs(target) < 0.05 && Math.abs(current) < 0.05) {
        current = 0;
        target = 0;
        el.style.transform = "translate3d(0, 0, 0)";
        running = false;
        return;
      }

      el.style.transform = `translate3d(0, ${current.toFixed(2)}px, 0)`;
      rafId = requestAnimationFrame(tick);
    };

    const ensureRunning = () => {
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;

      const next = target - delta * VELOCITY_TO_OFFSET;
      target = clamp(next, -MAX_OFFSET, MAX_OFFSET);

      ensureRunning();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div aria-hidden className="site-bg">
      <div className="site-bg__base" />

      <div ref={layerRef} className="site-bg__parallax">
        <div className="site-bg__grid" />
        <div className="site-bg__aurora">
          <span className="site-bg__orb site-bg__orb--1" />
          <span className="site-bg__orb site-bg__orb--2" />
          <span className="site-bg__orb site-bg__orb--3" />
          <span className="site-bg__orb site-bg__orb--4" />
        </div>

        {/* Крупная медленная электро-дуга */}
        <svg
          className="site-bg__arc"
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            <linearGradient id="siteBgArcGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="oklch(0.78 0.22 250)" stopOpacity="0" />
              <stop offset="25%" stopColor="oklch(0.82 0.2 240)" stopOpacity="1" />
              <stop offset="55%" stopColor="oklch(0.92 0.18 95)" stopOpacity="1" />
              <stop offset="80%" stopColor="oklch(0.78 0.22 30)" stopOpacity="1" />
              <stop offset="100%" stopColor="oklch(0.78 0.22 30)" stopOpacity="0" />
            </linearGradient>
            <filter id="siteBgArcGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="b1" />
              <feGaussianBlur stdDeviation="18" in="SourceGraphic" result="b2" />
              <feMerge>
                <feMergeNode in="b2" />
                <feMergeNode in="b1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            className="site-bg__arc-glow"
            d="M 40 360 C 260 80, 520 40, 720 200 S 1080 520, 1160 280"
            fill="none"
            stroke="url(#siteBgArcGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.35"
            filter="url(#siteBgArcGlow)"
          />
          <path
            className="site-bg__arc-line"
            d="M 40 360 C 260 80, 520 40, 720 200 S 1080 520, 1160 280"
            fill="none"
            stroke="url(#siteBgArcGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#siteBgArcGlow)"
          />
        </svg>
      </div>

      {/* Шум и виньетка — поверх parallax-слоя, статичные. */}
      <div className="site-bg__noise" />
      <div className="site-bg__vignette" />
    </div>
  );
}
