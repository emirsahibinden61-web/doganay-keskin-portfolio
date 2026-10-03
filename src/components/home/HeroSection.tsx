'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { SiteContent } from '@/lib/types';
import { Play, MessageCircle, MapPin, Sparkles, Film, ArrowRight, Instagram } from 'lucide-react';

interface HeroSectionProps {
  content: SiteContent;
  onOpenVideoModal?: (videoUrl: string, title: string) => void;
}

export default function HeroSection({ content, onOpenVideoModal }: HeroSectionProps) {
  const { theme } = useTheme();
  const { profile, contacts, stats } = content;
  const whatsappUrl = `https://wa.me/${contacts.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(contacts.whatsappMessage)}`;

  // Concept-specific styles
  const getHeroThemeStyles = () => {
    switch (theme) {
      case 'cyber':
        return {
          glowBg: 'from-cyan-500/15 via-purple-600/10 to-transparent',
          accentText: 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400',
          badge: 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]',
          btnPrimary: 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)]',
          cardBorder: 'border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.15)]',
          imageGlow: 'from-cyan-500/30 to-purple-500/30',
        };
      case 'luxe':
        return {
          glowBg: 'from-amber-200/10 via-yellow-600/5 to-transparent',
          accentText: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500',
          badge: 'border-amber-400/40 bg-amber-950/30 text-amber-200 shadow-[0_0_20px_rgba(230,202,151,0.2)]',
          btnPrimary: 'bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-300 hover:to-yellow-500 text-black font-semibold shadow-[0_0_30px_rgba(230,202,151,0.3)]',
          cardBorder: 'border-amber-400/30 hover:border-amber-300/60 shadow-[0_0_25px_rgba(230,202,151,0.1)]',
          imageGlow: 'from-amber-400/20 to-yellow-500/20',
        };
      case 'cinematic':
      default:
        return {
          glowBg: 'from-amber-500/15 via-orange-600/10 to-transparent',
          accentText: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-400',
          badge: 'border-amber-500/40 bg-amber-950/40 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
          btnPrimary: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-semibold shadow-[0_0_30px_rgba(245,158,11,0.4)]',
          cardBorder: 'border-amber-500/30 hover:border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.15)]',
          imageGlow: 'from-amber-500/30 to-red-500/30',
        };
    }
  };

  const themeStyle = getHeroThemeStyles();

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[550px] bg-gradient-to-b ${themeStyle.glowBg} blur-[120px] rounded-full pointer-events-none`} />

      {/* Subtle Grid overlay for technical/director vibe */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text / Info Column (7 Cols on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-start space-y-6 text-left"
          >
            {/* Tagline / Director Pill */}
            <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-xs sm:text-sm font-medium tracking-wide backdrop-blur-md ${themeStyle.badge}`}>
              <Sparkles className="w-4 h-4 animate-spin [animation-duration:8s]" />
              <span>{profile.age} Yaşında &bull; {profile.location}</span>
              <span className="hidden sm:inline">&bull; {profile.brandName}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] font-sans">
              Merhaba, Ben{' '}
              <span className="relative inline-block">
                <span className={themeStyle.accentText}>{profile.name}</span>
              </span>
              <br />
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-300 font-mono tracking-tight block mt-2">
                Sinematik Video Editörü & Yönetmen
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
              {profile.heroSubtitle}
            </p>

            {/* Key Service Tags / Hashtags (Managed from Admin Panel) */}
            {content.sectionVisibility?.heroHashtags !== false && content.heroHashtags && content.heroHashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {content.heroHashtags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-md text-xs font-mono bg-white/[0.04] border border-white/10 text-zinc-300 backdrop-blur-sm"
                  >
                    #{tag.replace(/^#/, '')}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3 w-full sm:w-auto">
              {/* WhatsApp direct contact */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${themeStyle.btnPrimary}`}
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp ile Projeyi Başlat</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* Showreel Play Button */}
              <button
                onClick={() => {
                  if (onOpenVideoModal) {
                    onOpenVideoModal(
                      "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-dj-playing-music-on-a-sound-mixer-41270-large.mp4",
                      "Doğanay Keskin — Master Showreel"
                    );
                  } else {
                    const el = document.getElementById('portfolio');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
              >
                <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Showreel İzle</span>
              </button>

              {/* Instagram quick icon */}
              <a
                href={contacts.instagramPersonalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
                title={`Instagram: ${contacts.instagramPersonal}`}
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>

            {/* Live Stats Bar */}
            {content.sectionVisibility?.stats !== false && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 w-full">
                {stats.map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                      {stat.value}
                    </span>
                    <span className="text-xs text-zinc-400 font-medium">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right Featured Hero Image / Doğanay Portrait (5 Cols on desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-5 relative flex justify-center"
          >
            {/* Glowing Backdrop Frame */}
            <div className={`absolute -inset-2 bg-gradient-to-tr ${themeStyle.imageGlow} rounded-3xl blur-2xl opacity-60`} />

            <div className={`relative w-full max-w-md rounded-2xl overflow-hidden border bg-zinc-950/80 backdrop-blur-md ${themeStyle.cardBorder} group`}>
              
              {/* Camera Header Banner */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-white/10 text-[11px] font-mono text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-zinc-200 font-bold">SONY CINEMA FX3</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>4K 60FPS</span>
                  <span className="text-amber-400">S-LOG3 / LUT</span>
                </div>
              </div>

              {/* The Photo: Professionally color graded and cropped from dogi.jpg */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src="/images/dogi-portrait.jpg"
                  alt={profile.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Vignette & Cinematic Dark Gradient at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                {/* Director Slate Tag on Photo */}
                <div className="absolute top-4 left-4 flex flex-col gap-1">
                  <span className="px-2.5 py-1 rounded bg-black/75 border border-white/15 text-[10px] font-mono text-white backdrop-blur-md">
                    PROD: KESKİNLER
                  </span>
                  <span className="px-2.5 py-1 rounded bg-black/75 border border-white/15 text-[10px] font-mono text-amber-400 backdrop-blur-md">
                    DIR: DOĞANAY KESKİN
                  </span>
                </div>

                {/* Bottom Overlay with identity info */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/70 border border-white/15 backdrop-blur-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold text-base flex items-center gap-1.5">
                        <span>{profile.name}</span>
                        <span className="text-amber-400 text-xs font-mono">(24)</span>
                      </div>
                      <div className="text-xs text-zinc-300 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-red-400" />
                        <span>{profile.location}</span>
                      </div>
                    </div>

                    <a
                      href={contacts.instagramBusinessUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-mono font-medium transition-colors"
                    >
                      @keskinlermuzik
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom Reel Audio Wave Visualizer Simulation */}
              <div className="px-4 py-3 bg-black/80 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Film className="w-3.5 h-3.5 text-amber-400" />
                  TIMELINE SYNC
                </span>
                <div className="flex items-end gap-1 h-3">
                  {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 35].map((h, idx) => (
                    <motion.div
                      key={idx}
                      className="w-1 bg-amber-400/80 rounded-full"
                      animate={{ height: [`${h}%`, `${Math.max(20, (h + 30) % 100)}%`, `${h}%`] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: idx * 0.1 }}
                    />
                  ))}
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
