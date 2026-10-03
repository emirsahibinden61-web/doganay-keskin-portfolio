'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConceptTheme } from '@/lib/types';

interface ThemeContextType {
  theme: ConceptTheme;
  setTheme: (theme: ConceptTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'cinematic',
  setTheme: () => {},
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ 
  children, 
  initialTheme = 'cinematic' 
}: { 
  children: React.ReactNode; 
  initialTheme?: ConceptTheme;
}) {
  const [theme, setThemeState] = useState<ConceptTheme>(initialTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('doganay_concept_theme') as ConceptTheme;
    if (saved && ['cinematic', 'cyber', 'luxe'].includes(saved)) {
      setThemeState(saved);
    }
  }, []);

  const setTheme = (newTheme: ConceptTheme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('doganay_concept_theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  const toggleTheme = () => {
    const list: ConceptTheme[] = ['cinematic', 'cyber', 'luxe'];
    const nextIdx = (list.indexOf(theme) + 1) % list.length;
    setTheme(list[nextIdx]);
  };

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div className={`theme-${theme} min-h-screen transition-colors duration-700`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
