import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cinematic: {
          dark: "#08090b",
          card: "#12141a",
          accent: "#f59e0b",
          gold: "#eab308",
          amber: "#d97706",
          red: "#ef4444"
        },
        cyber: {
          dark: "#05050f",
          card: "#0d0f24",
          neon: "#06b6d4",
          purple: "#8b5cf6",
          pink: "#ec4899",
          glow: "#3b82f6"
        },
        luxe: {
          dark: "#0a0a0a",
          card: "#141414",
          champagne: "#e6ca97",
          cream: "#f7f4ec",
          bronze: "#c59b27"
        }
      },
      fontFamily: {
        cinematic: ["Cabinet Grotesk", "sans-serif"],
        serif: ["Playfair Display", "serif"],
        mono: ["JetBrains Mono", "monospace"]
      },
      animation: {
        'glow-pulse': 'glow 3s ease-in-out infinite alternate',
        'float-slow': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { filter: 'drop-shadow(0 0 15px rgba(245, 158, 11, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 35px rgba(245, 158, 11, 0.8))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
