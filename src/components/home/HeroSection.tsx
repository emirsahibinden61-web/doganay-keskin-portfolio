'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { SiteContent } from '@/lib/types';
import { MessageCircle, MapPin, Film, ArrowRight, Instagram } from 'lucide-react';

interface HeroSectionProps {
  content: SiteContent;
  onOpenVideoModal?: (videoUrl: string, title: string) => void;
}

export default function HeroSection({ content }: HeroSectionProps) {
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
      <div className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-gradient-to-b ${themeStyle.glowBg} blur-[120px] rounded-full pointer-events-none`} />

      {/* Subtle Grid overlay for technical/director vibe */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 flex flex-col items-center text-center space-y-7">
        
        {/* 1. Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-2"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] font-sans">
            Merhaba, Ben{' '}
            <span className="relative inline-block">
              <span className={themeStyle.accentText}>{profile.name}</span>
            </span>
            <br />
            <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-zinc-300 font-mono tracking-tight block mt-2">
              Sinematik Video Editörü &amp; Yönetmen
            </span>
          </h1>
        </motion.div>

        {/* 2. Featured Sony Cinema FX3 Photo Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="relative w-full max-w-xs sm:max-w-sm mx-auto group"
        >
          {/* Glowing Backdrop Frame */}
          <div className={`absolute -inset-2 bg-gradient-to-tr ${themeStyle.imageGlow} rounded-3xl blur-2xl opacity-60`} />

          <div className={`relative w-full rounded-2xl overflow-hidden border bg-zinc-950/90 backdrop-blur-md ${themeStyle.cardBorder} shadow-2xl`}>
            
            {/* Camera Header Banner */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-black/80 border-b border-white/10 text-[11px] font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-zinc-200 font-bold">SONY CINEMA FX3</span>
              </div>
              <div className="flex items-center gap-3">
                <span>4K 60FPS</span>
                <span className="text-amber-400">S-LOG3 / LUT</span>
              </div>
            </div>

            {/* The Photo */}
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src="/images/dogi-portrait.jpg"
                alt={profile.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Vignette & Cinematic Dark Gradient at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent opacity-85 pointer-events-none" />

              {/* Director Slate Tag on Photo */}
              <div className="absolute top-3.5 left-3.5 flex flex-col gap-1 text-left pointer-events-none">
                <span className="px-2.5 py-1 rounded bg-black/80 border border-white/15 text-[10px] font-mono text-white backdrop-blur-md">
                  PROD: KESKİNLER
                </span>
                <span className="px-2.5 py-1 rounded bg-black/80 border border-white/15 text-[10px] font-mono text-amber-400 backdrop-blur-md">
                  DIR: DOĞANAY KESKİN
                </span>
              </div>

              {/* Bottom Overlay with identity info */}
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/80 border border-white/15 backdrop-blur-lg text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold text-sm sm:text-base flex items-center gap-1.5">
                      <span>{profile.name}</span>
                    </div>
                    <div className="text-xs text-zinc-300 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-red-400" />
                      <span>{profile.location}</span>
                    </div>
                  </div>

                  <a
                    href={contacts.instagramPersonalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-300 text-xs font-mono font-medium transition-colors flex items-center gap-1.5"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>@doganaykesking</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Reel Audio Wave Visualizer Simulation */}
            <div className="px-4 py-2.5 bg-black/90 flex items-center justify-between text-xs font-mono text-zinc-400">
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

        {/* 3. Description Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed"
        >
          {profile.heroSubtitle || "Sakarya merkezli, profesyonel video kurgusu, düğün & klip prodüksiyonu, canlı müzik sahne organizasyonları ve premium albüm-davetiye tasarımı."}
        </motion.p>

        {/* 4. Hashtags */}
        {content.sectionVisibility?.heroHashtags !== false && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 pt-0.5 max-w-2xl"
          >
            {(content.heroHashtags && content.heroHashtags.length > 0 ? content.heroHashtags : [
              "Video Kurgu & Color Grading",
              "Düğün & Klip Prodüksiyon",
              "Keskinler Canlı Sahne",
              "Lüks Albüm & Davetiye Baskı"
            ]).map((tag) => (
              <span
                key={tag}
                className="px-3.5 py-1.5 rounded-full text-xs font-mono bg-white/[0.05] border border-white/10 text-zinc-200 backdrop-blur-sm shadow-sm"
              >
                #{tag.replace(/^#/, '')}
              </span>
            ))}
          </motion.div>
        )}

        {/* 5. Action Buttons (WhatsApp & Instagram Side-by-Side) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2 w-full"
        >
          {/* WhatsApp Direct Contact Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg ${themeStyle.btnPrimary}`}
          >
            <MessageCircle className="w-4 h-4 fill-current shrink-0" />
            <span>WhatsApp ile Projeyi Başlat</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </a>

          {/* Instagram Button right beside WhatsApp */}
          <a
            href={contacts.instagramPersonalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-full text-sm font-semibold bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-amber-500/20 hover:from-pink-600/30 hover:via-purple-600/30 hover:to-amber-500/30 text-white border border-pink-500/30 transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-md shadow-lg"
            title={`Instagram: ${contacts.instagramPersonal}`}
          >
            <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
            <span>Instagram</span>
          </a>
        </motion.div>

        {/* 6. Live Stats Counter Bar */}
        {content.sectionVisibility?.stats !== false && stats && stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 pt-6 sm:pt-8 border-t border-white/10 w-full max-w-3xl"
          >
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {stat.value}
                </span>
                <span className="text-xs text-zinc-400 font-medium mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}

      </div>
    </section>
  );
}
