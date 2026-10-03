'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Film, Zap, Crown } from 'lucide-react';
import { ConceptTheme } from '@/lib/types';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const themes: { id: ConceptTheme; name: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'cinematic',
      name: 'Sinematik Kurgu',
      icon: <Film className="w-3.5 h-3.5" />,
      desc: 'Director Onyx & Amber'
    },
    {
      id: 'cyber',
      name: 'Cyber Studio',
      icon: <Zap className="w-3.5 h-3.5" />,
      desc: 'Neon Cyan & Violet'
    },
    {
      id: 'luxe',
      name: 'Lüks Davetiye & Düğün',
      icon: <Crown className="w-3.5 h-3.5" />,
      desc: 'Editorial Gold & Velvet'
    }
  ];

  return (
    <div className="fixed top-5 right-5 z-40">
      <div className="flex items-center p-1 rounded-full bg-black/70 border border-white/15 backdrop-blur-xl shadow-2xl">
        {themes.map((t) => {
          const isActive = theme === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              title={`${t.name} (${t.desc})`}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-white/20 to-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-white/25'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <span className={isActive ? 'text-amber-400' : 'text-zinc-400'}>
                {t.icon}
              </span>
              <span className="hidden sm:inline">{t.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
