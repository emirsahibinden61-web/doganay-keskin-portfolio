'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export default function CustomCursor() {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Smooth springs for cursor position
  const cursorX = useSpring(0, { damping: 25, stiffness: 350 });
  const cursorY = useSpring(0, { damping: 25, stiffness: 350 });
  
  // Slower trail for glowing ambient light
  const trailX = useSpring(0, { damping: 40, stiffness: 180 });
  const trailY = useSpring(0, { damping: 40, stiffness: 180 });

  useEffect(() => {
    // Detect touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      trailX.set(e.clientX);
      trailY.set(e.clientY);

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest('button, a, input, textarea, select, [role="button"], [data-cursor], .interactive-target');
      setIsHovered(!!interactive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleElementHover);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleElementHover);
    };
  }, [cursorX, cursorY, trailX, trailY, isVisible]);

  if (isTouchDevice || !isVisible) return null;

  // Theme-based accent colors
  const getColors = () => {
    switch (theme) {
      case 'cyber':
        return {
          glow: 'rgba(6, 182, 212, 0.15)',
          outerBorder: 'border-cyan-400/60',
          dot: 'bg-cyan-400 shadow-[0_0_12px_#06b6d4]',
          flare: 'from-cyan-500/20 via-purple-500/10 to-transparent'
        };
      case 'luxe':
        return {
          glow: 'rgba(230, 202, 151, 0.12)',
          outerBorder: 'border-amber-200/50',
          dot: 'bg-amber-100 shadow-[0_0_10px_#e6ca97]',
          flare: 'from-amber-200/15 via-stone-400/5 to-transparent'
        };
      case 'cinematic':
      default:
        return {
          glow: 'rgba(245, 158, 11, 0.12)',
          outerBorder: 'border-amber-400/60',
          dot: 'bg-amber-400 shadow-[0_0_12px_#f59e0b]',
          flare: 'from-amber-500/18 via-orange-500/10 to-transparent'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Ambient Torch / Glow Following Cursor */}
      <motion.div
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className={`fixed w-80 h-80 rounded-full bg-gradient-to-r ${colors.flare} blur-3xl opacity-70 transition-opacity duration-300`}
      />

      {/* Outer Ring */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovered ? 1.7 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300, mass: 0.2 }}
        className={`fixed w-9 h-9 rounded-full border ${colors.outerBorder} backdrop-blur-[1px] transition-colors duration-300`}
      />

      {/* Inner Precision Center Dot */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 1.3 : isHovered ? 0.4 : 1,
        }}
        className={`fixed w-2 h-2 rounded-full ${colors.dot} transition-colors duration-300`}
      />
    </div>
  );
}
