'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { PortfolioItem, CategoryConfig } from '@/lib/types';
import { Play, Film, Eye, Smartphone, Tv } from 'lucide-react';

interface PortfolioGalleryProps {
  items: PortfolioItem[];
  categories?: CategoryConfig[];
  onSelectItem: (item: PortfolioItem) => void;
}

// Individual card with robust video hover & playback handling
function PortfolioCard({
  item,
  index,
  themeStyle,
  onSelect,
}: {
  item: PortfolioItem;
  index: number;
  themeStyle: any;
  onSelect: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVertical = item.aspect === '9:16';

  useEffect(() => {
    if (!videoRef.current || item.type !== 'video') return;

    if (isHovered) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Autoplay policy or buffering catch
          console.debug('Hover preview play prevented:', err);
        });
      }
    } else {
      videoRef.current.pause();
    }
  }, [isHovered, item.type]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
      className={`group relative rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 cursor-pointer transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between ${themeStyle.cardHover}`}
    >
      {/* Uniform Media Frame (Aspect 16/10 for all cards to prevent awkward height differences!) */}
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900 w-full">
        
        {/* If Vertical 9:16 (Reels/Shorts): Blurred ambient background + crisp centered frame */}
        {isVertical ? (
          <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-black">
            {/* Ambient Blurred Backdrop */}
            <img
              src={item.posterUrl || '/images/dogi-cinematic.jpg'}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-md scale-125 opacity-40 transition-transform duration-700 group-hover:scale-130"
            />
            <div className="absolute inset-0 bg-black/40" />

            {/* Centered Vertical 9:16 Video / Poster Frame */}
            <div className="relative h-full aspect-[9/16] overflow-hidden rounded-md shadow-2xl border border-white/20">
              <img
                src={item.posterUrl || '/images/dogi-cinematic.jpg'}
                alt={item.title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isHovered && isVideoReady && item.type === 'video' ? 'opacity-0' : 'opacity-100'
                }`}
              />
              {item.type === 'video' && (
                <video
                  ref={videoRef}
                  src={item.mediaUrl}
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  onCanPlay={() => setIsVideoReady(true)}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    isHovered && isVideoReady ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}
            </div>
          </div>
        ) : (
          /* Standard 16:9 / Horizontal / Square Media */
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={item.posterUrl || '/images/dogi-cinematic.jpg'}
              alt={item.title}
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                isHovered && isVideoReady && item.type === 'video' ? 'opacity-0' : 'opacity-100'
              }`}
              loading="lazy"
            />

            {item.type === 'video' && (
              <video
                ref={videoRef}
                src={item.mediaUrl}
                muted
                playsInline
                loop
                preload="metadata"
                onCanPlay={() => setIsVideoReady(true)}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  isHovered && isVideoReady ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}
          </div>
        )}

        {/* Dark gradient overlay for title legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border backdrop-blur-md ${themeStyle.badge}`}>
            {item.type === 'video' ? 'Video' : 'Görsel / Tasarım'}
          </span>

          <div className="flex items-center gap-1.5">
            {item.aspect === '9:16' ? (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/75 border border-pink-500/40 text-[10px] text-pink-300 backdrop-blur-md">
                <Smartphone className="w-3 h-3 text-pink-400" />
                9:16 Reels
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/75 border border-white/15 text-[10px] text-zinc-300 backdrop-blur-md">
                <Tv className="w-3 h-3 text-amber-400" />
                Sinematik
              </span>
            )}

            {item.duration && (
              <span className="px-2 py-0.5 rounded bg-black/80 border border-white/15 text-[10px] font-mono text-zinc-300 backdrop-blur-md">
                {item.duration}
              </span>
            )}
          </div>
        </div>

        {/* Center Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
            isHovered ? 'scale-110 opacity-100' : 'scale-90 opacity-75'
          } ${themeStyle.playBtn}`}>
            {item.type === 'video' ? (
              <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current translate-x-0.5" />
            ) : (
              <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </div>
        </div>

        {/* Bottom Metadata inside media frame */}
        <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none">
          <h3 className="text-white font-bold text-base leading-snug line-clamp-1 group-hover:text-amber-300 transition-colors">
            {item.title}
          </h3>
          <p className="text-zinc-300 text-xs line-clamp-1 mt-0.5">
            {item.description}
          </p>
        </div>

      </div>

      {/* Card Bottom Meta Footer */}
      <div className="p-3.5 sm:p-4 flex items-center justify-between border-t border-white/10 bg-zinc-950 text-xs text-zinc-400 font-mono">
        <span className="text-zinc-300 font-sans truncate max-w-[200px]">
          {item.client || 'Özel Yapım'}
        </span>
        <span className="text-amber-400 font-mono shrink-0">
          {item.year || '2026'}
        </span>
      </div>

    </motion.div>
  );
}

export default function PortfolioGallery({ items, categories, onSelectItem }: PortfolioGalleryProps) {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Filter only enabled categories from config or fallback
  const activeCategories = (categories && categories.length > 0)
    ? categories.filter(c => c.enabled !== false)
    : [
        { id: 'all', label: 'Tüm Çalışmalar', enabled: true },
        { id: 'video-kurgu', label: 'Video Kurgu & Klip', enabled: true },
        { id: 'dugun-klip', label: 'Düğün Hikayesi', enabled: true },
        { id: 'organizasyon', label: 'Keskinler Sahne & Canlı Müzik', enabled: true },
        { id: 'album-davetiye', label: 'Albüm & Davetiye Tasarım', enabled: true },
        { id: 'drone-reklam', label: '4K Drone & Tanıtım', enabled: true },
      ];

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(item => item.category === activeCategory);

  // Theme card colors
  const getThemeStyles = () => {
    switch (theme) {
      case 'cyber':
        return {
          pillActive: 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_#06b6d4]',
          cardHover: 'hover:border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.15)]',
          badge: 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40',
          playBtn: 'bg-cyan-500 text-black shadow-[0_0_20px_#06b6d4]',
        };
      case 'luxe':
        return {
          pillActive: 'bg-amber-300 text-black font-bold shadow-[0_0_15px_#e6ca97]',
          cardHover: 'hover:border-amber-300/60 shadow-[0_0_25px_rgba(230,202,151,0.15)]',
          badge: 'bg-amber-950/70 text-amber-200 border-amber-400/40',
          playBtn: 'bg-amber-300 text-black shadow-[0_0_20px_#e6ca97]',
        };
      case 'cinematic':
      default:
        return {
          pillActive: 'bg-amber-500 text-black font-bold shadow-[0_0_15px_#f59e0b]',
          cardHover: 'hover:border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.15)]',
          badge: 'bg-amber-950/70 text-amber-300 border-amber-500/40',
          playBtn: 'bg-amber-500 text-black shadow-[0_0_20px_#f59e0b]',
        };
    }
  };

  const themeStyle = getThemeStyles();

  return (
    <section id="portfolio" className="relative py-24 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-zinc-300">
            <Film className="w-3.5 h-3.5 text-amber-400" />
            <span>SEÇKİN EDİT & PRODÜKSİYON PORTFÖYÜ</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Görsel Güç ve Kusursuz Kurgu
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Düğün hikayelerinden sanatçı kliplerine, canlı sahne organizasyonlarından özel tasarım albüm ve davetiyelere kadar her projeye özgün bir ruh katıyoruz.
          </p>
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {activeCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? themeStyle.pillActive
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Portfolio Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <PortfolioCard
                key={item.id}
                item={item}
                index={index}
                themeStyle={themeStyle}
                onSelect={() => onSelectItem(item)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-white/[0.02] rounded-2xl border border-white/5">
            <p className="text-zinc-400 text-sm">Bu kategoride henüz çalışma bulunmuyor.</p>
          </div>
        )}

      </div>
    </section>
  );
}
