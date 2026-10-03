'use client';

import React from 'react';

interface DkLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  showGlow?: boolean;
}

export default function DkLogo({
  className = '',
  size = 'md',
  showGlow = true,
}: DkLogoProps) {
  // Height and aspect ratio mapping for enlarged, frameless presence
  let sizeStyle = 'h-10 w-auto sm:h-11';
  if (typeof size === 'number') {
    sizeStyle = '';
  } else {
    switch (size) {
      case 'sm':
        sizeStyle = 'h-8 w-auto';
        break;
      case 'md':
        // Slightly enlarged as requested: prominent and bold
        sizeStyle = 'h-10 w-auto sm:h-11';
        break;
      case 'lg':
        sizeStyle = 'h-12 w-auto sm:h-14';
        break;
      case 'xl':
        sizeStyle = 'h-16 w-auto sm:h-20';
        break;
    }
  }

  const dimension = typeof size === 'number' ? size : undefined;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none group/dk ${sizeStyle} ${className}`}
      style={dimension ? { height: dimension, width: 'auto' } : undefined}
    >
      {/* Dynamic Ambient Glow Aura */}
      {showGlow && (
        <div
          className="absolute inset-0 -inset-x-2 rounded-full bg-amber-500/25 blur-lg -z-10 group-hover/dk:bg-amber-400/40 group-hover/dk:blur-xl transition-all duration-300 opacity-90 pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Aggressive, Dynamic, Frameless DK Vector Monogram */}
      <svg
        viewBox="0 0 130 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto drop-shadow-[0_4px_12px_rgba(245,158,11,0.35)] transition-transform duration-300 group-hover/dk:scale-[1.05]"
        role="img"
        aria-label="Doğanay Keskin Agresif DK Logosu"
      >
        <defs>
          {/* Master 6-Stop Amber Gold Metallic Gradient */}
          <linearGradient id="dkAggressiveGold" x1="0%" y1="0%" x2="100%" y2="85%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="14%" stopColor="#FEF08A" />
            <stop offset="38%" stopColor="#FBBF24" />
            <stop offset="65%" stopColor="#F59E0B" />
            <stop offset="88%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Dynamic Specular Highlights */}
          <linearGradient id="dkBladeEdge" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#FEF08A" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </linearGradient>

          {/* Neon Filter for high-impact edge luminescence */}
          <filter id="dkAggressiveGlow" x="-20%" y="-20%" width="145%" height="145%">
            <feDropShadow dx="0" dy="2" stdDeviation="3.5" floodColor="#F59E0B" floodOpacity="0.5" />
            <feDropShadow dx="0" dy="5" stdDeviation="9" floodColor="#D97706" floodOpacity="0.25" />
          </filter>
        </defs>

        <g filter="url(#dkAggressiveGlow)">
          {/* ==================== LETTER "D" ==================== */}
          {/* Aggressive Faceted Silhouette with Razor Cuts */}
          <path
            d="
              M 17 6 
              H 43 
              L 57 20 
              L 57 44 
              L 43 66 
              L 4 66 
              L 17 6 
              Z 
              M 26 19 
              L 17 53 
              L 36 53 
              L 44 42 
              L 44 29 
              L 36 19 
              Z
            "
            fill="url(#dkAggressiveGold)"
            fillRule="evenodd"
          />

          {/* ==================== LETTER "K" ==================== */}
          {/* K - Vertical Slanted Spine */}
          <path
            d="
              M 65 6 
              H 79 
              L 66 66 
              H 52 
              Z
            "
            fill="url(#dkAggressiveGold)"
          />

          {/* K - Upper Katana Blade Arm */}
          <path
            d="
              M 76 35 
              L 104 6 
              H 124 
              L 90 41 
              Z
            "
            fill="url(#dkAggressiveGold)"
          />

          {/* K - Lower Power Wedge Arm */}
          <path
            d="
              M 84 38 
              L 116 66 
              H 96 
              L 72 46 
              Z
            "
            fill="url(#dkAggressiveGold)"
          />

          {/* ==================== CINEMATIC ACCENTS ==================== */}
          {/* High-Velocity Embedded Play Core inside K */}
          <polygon
            points="89,38 80,32 80,44"
            fill="#FFFFFF"
            opacity="0.95"
          />

          {/* Specular Edge Highlights */}
          <line
            x1="104"
            y1="6"
            x2="124"
            y2="6"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <line
            x1="17"
            y1="6"
            x2="43"
            y2="6"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
