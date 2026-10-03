'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export default function ScrollIndicator({ showHud = true }: { showHud?: boolean }) {
  const { theme } = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [timecode, setTimecode] = useState('00:00:00:00');
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      const pct = Math.round(latest * 100);
      setPercent(pct);

      // Convert scroll percent to video timecode format (HH:MM:SS:FF)
      const totalFrames = Math.round(latest * 2400); // 2400 frames ~ 100 seconds at 24fps
      const frames = totalFrames % 24;
      const totalSec = Math.floor(totalFrames / 24);
      const seconds = totalSec % 60;
      const minutes = Math.floor(totalSec / 60) % 60;
      const hours = Math.floor(totalSec / 3600);

      const pad = (n: number) => n.toString().padStart(2, '0');
      setTimecode(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`);
    });
  }, [scrollYProgress]);

  const getThemeProgressClass = () => {
    switch (theme) {
      case 'cyber':
        return 'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_12px_#06b6d4]';
      case 'luxe':
        return 'bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 shadow-[0_0_10px_#e6ca97]';
      case 'cinematic':
      default:
        return 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-[0_0_12px_#f59e0b]';
    }
  };

  return (
    <>
      {/* Top synchronized progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-white/5 z-50">
        <motion.div
          className={`h-full origin-left ${getThemeProgressClass()}`}
          style={{ scaleX }}
        />
      </div>

      {/* Floating Timecode HUD (Director / Editor aesthetic) */}
      {showHud && (
        <div className="fixed bottom-6 left-6 z-40 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[11px] font-mono text-zinc-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-zinc-500 font-semibold tracking-wider">REC</span>
          <span className="text-amber-400/90 font-mono tracking-widest">{timecode}</span>
          <span className="text-zinc-500">|</span>
          <span className="text-zinc-400">{percent}%</span>
        </div>
      )}
    </>
  );
}
