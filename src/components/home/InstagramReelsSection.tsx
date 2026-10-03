'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { InstagramReel } from '@/lib/types';
import { 
  Instagram, Heart, Eye, Play, Pause, Volume2, VolumeX, 
  ChevronLeft, ChevronRight, X, Sparkles, Music, Share2, Loader2 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InstagramReelsSectionProps {
  sectionId?: string;
  badgeLabel?: string;
  title?: string;
  subtitle?: string;
  reels?: InstagramReel[];
  instagramBusiness: string;
  instagramBusinessUrl: string;
  avatarUrl?: string;
  ambientColor?: string;
}

export default function InstagramReelsSection({
  sectionId = 'reels-album',
  badgeLabel = 'KESKİNLER MÜZİK REELS ALBÜMÜ',
  title = 'Canlı Sahne & Reels Akışı',
  subtitle = 'Doğanay Keskin ve Keskinler Müzik ekibinin en güncel sahne performansları, orkestra soloları ve özel anları.',
  reels = [],
  instagramBusiness,
  instagramBusinessUrl,
  avatarUrl = '/images/dogi-avatar.jpg',
  ambientColor = 'from-pink-600/10 via-purple-600/10 to-amber-500/10',
}: InstagramReelsSectionProps) {
  const { theme } = useTheme();
  const [activeReelIndex, setActiveReelIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<'prev' | 'next' | 'none'>('none');
  const [hoveredReelId, setHoveredReelId] = useState<string | null>(null);
  const [isModalPlaying, setIsModalPlaying] = useState(true);
  const [isModalMuted, setIsModalMuted] = useState(false);
  const [isVideoBuffering, setIsVideoBuffering] = useState(false);
  const [likedReelIds, setLikedReelIds] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  if (!reels || reels.length === 0) return null;

  const activeReel = activeReelIndex !== null ? reels[activeReelIndex] : null;

  // Horizontal scroll arrows for the gallery strip
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Like reaction animation
  const handleLike = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (likedReelIds.includes(id)) {
      setLikedReelIds(likedReelIds.filter(i => i !== id));
    } else {
      setLikedReelIds([...likedReelIds, id]);
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#ec4899', '#f43f5e', '#fb7185']
      });
    }
  };

  const handleNextReel = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSlideDirection('next');
    setIsVideoBuffering(false);
    setActiveReelIndex((prev) => {
      if (prev === null) return 0;
      return prev < reels.length - 1 ? prev + 1 : 0;
    });
  }, [reels.length]);

  const handlePrevReel = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSlideDirection('prev');
    setIsVideoBuffering(false);
    setActiveReelIndex((prev) => {
      if (prev === null) return 0;
      return prev > 0 ? prev - 1 : reels.length - 1;
    });
  }, [reels.length]);

  // Touch drag gesture end handler:
  // Drag right (offset.x > 50) -> Switch to PREVIOUS reel (as requested: "sağa doğru kaydırıp daha önceki reels videolarına da geçiş yapılabilesin")
  // Drag left (offset.x < -50) -> Switch to NEXT reel
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 45;
    if (info.offset.x > threshold || info.velocity.x > 250) {
      handlePrevReel();
    } else if (info.offset.x < -threshold || info.velocity.x < -250) {
      handleNextReel();
    }
  };

  // Keyboard navigation for active modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeReelIndex === null) return;
      if (e.key === 'Escape') setActiveReelIndex(null);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleNextReel();
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handlePrevReel();
      }
      if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReelIndex, handleNextReel, handlePrevReel]);

  // Smooth video playback & desync elimination
  const handleVideoCanPlay = () => {
    setIsVideoBuffering(false);
    if (modalVideoRef.current && isModalPlaying) {
      modalVideoRef.current.play().catch(() => {
        // Fallback to muted if browser policy requires it
        if (modalVideoRef.current) {
          modalVideoRef.current.muted = true;
          setIsModalMuted(true);
          modalVideoRef.current.play().catch(() => {});
        }
      });
    }
  };

  const togglePlayPause = () => {
    if (modalVideoRef.current) {
      if (isModalPlaying) {
        modalVideoRef.current.pause();
        setIsModalPlaying(false);
      } else {
        modalVideoRef.current.play().then(() => {
          setIsModalPlaying(true);
        }).catch(() => {});
      }
    }
  };

  // Theme styling
  const getThemeStyles = () => {
    switch (theme) {
      case 'cyber':
        return {
          badge: 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300',
          gradientText: 'from-cyan-400 via-purple-400 to-pink-500',
          cardHover: 'hover:border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.15)]',
        };
      case 'luxe':
        return {
          badge: 'border-amber-300/40 bg-amber-950/30 text-amber-200',
          gradientText: 'from-amber-200 via-yellow-400 to-amber-600',
          cardHover: 'hover:border-amber-300/60 shadow-[0_0_25px_rgba(230,202,151,0.15)]',
        };
      case 'cinematic':
      default:
        return {
          badge: 'border-pink-500/40 bg-pink-950/40 text-pink-300',
          gradientText: 'from-pink-400 via-purple-400 to-amber-400',
          cardHover: 'hover:border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.2)]',
        };
    }
  };

  const themeStyle = getThemeStyles();

  return (
    <section id={sectionId} className="relative py-20 overflow-hidden bg-black/60 border-t border-b border-white/5">
      {/* Background Ambient Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-r ${ambientColor} blur-[140px] pointer-events-none rounded-full`} />

      {/* Preload adjacent videos silently in background for instantaneous playback with 0ms lag */}
      {activeReelIndex !== null && (
        <div className="hidden pointer-events-none" aria-hidden="true">
          {reels[(activeReelIndex + 1) % reels.length]?.videoUrl && (
            <video src={reels[(activeReelIndex + 1) % reels.length].videoUrl} preload="auto" muted />
          )}
          {reels[(activeReelIndex - 1 + reels.length) % reels.length]?.videoUrl && (
            <video src={reels[(activeReelIndex - 1 + reels.length) % reels.length].videoUrl} preload="auto" muted />
          )}
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-3">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-medium backdrop-blur-md ${themeStyle.badge}`}>
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <span>{badgeLabel}</span>
              <Sparkles className="w-3 h-3 text-pink-400" />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-sans">
              {title}
            </h2>

            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Header Action: Instagram Profile Link & Horizontal Arrows */}
          <div className="flex items-center gap-3">
            <a
              href={instagramBusinessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:via-pink-500 hover:to-amber-400 text-white font-semibold text-xs transition-all shadow-lg hover:shadow-pink-500/30 hover:scale-105 active:scale-95"
            >
              <Instagram className="w-4 h-4" />
              <span>{instagramBusiness}</span>
            </a>

            <div className="flex items-center gap-1.5 ml-2">
              <button
                onClick={() => scroll('left')}
                className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white border border-white/10 transition-colors"
                aria-label="Önceki"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white border border-white/10 transition-colors"
                aria-label="Sonraki"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Reels Horizontal Scroll Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]"
          style={{ scrollbarWidth: 'none' }}
        >
          {reels.map((reel, idx) => {
            const isHovered = hoveredReelId === reel.id;
            const isLiked = likedReelIds.includes(reel.id);

            return (
              <div
                key={reel.id}
                onClick={() => {
                  setSlideDirection('none');
                  setActiveReelIndex(idx);
                  setIsModalPlaying(true);
                }}
                onMouseEnter={() => setHoveredReelId(reel.id)}
                onMouseLeave={() => setHoveredReelId(null)}
                className={`relative flex-shrink-0 w-[240px] sm:w-[280px] aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer snap-start bg-zinc-900 border border-white/10 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] ${themeStyle.cardHover} group shadow-xl`}
              >
                {/* Poster / Thumbnail image */}
                <img
                  src={reel.posterUrl}
                  alt={reel.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Subtle video preview on hover (desktop) */}
                <div className="absolute inset-0 hidden md:block pointer-events-none">
                  <video
                    src={reel.videoUrl}
                    muted
                    loop
                    playsInline
                    preload="none"
                    ref={(el) => {
                      if (el) {
                        if (isHovered) {
                          el.play().catch(() => {});
                        } else {
                          el.pause();
                          el.currentTime = 0;
                        }
                      }
                    }}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />

                {/* Top Overlay: Instagram Badge & Date */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600" />
                    <span className="text-[10px] font-mono text-white font-medium">Reels</span>
                  </div>

                  <span className="text-[10px] font-mono text-zinc-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                    {reel.date || 'Yeni'}
                  </span>
                </div>

                {/* Center Hover Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className={`w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all duration-300 ${
                    isHovered ? 'scale-110 opacity-100' : 'scale-90 opacity-0'
                  }`}>
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  </div>
                </div>

                {/* Right Floating Actions (Heart & Views) */}
                <div className="absolute right-3 bottom-20 flex flex-col items-center gap-3 z-10">
                  <button
                    onClick={(e) => handleLike(reel.id, e)}
                    className="flex flex-col items-center gap-0.5 group/btn"
                    aria-label="Beğen"
                  >
                    <div className={`p-2 rounded-full backdrop-blur-md transition-transform duration-300 active:scale-125 ${
                      isLiked 
                        ? 'bg-pink-500 text-white shadow-[0_0_15px_#ec4899]' 
                        : 'bg-black/50 text-white border border-white/15 hover:bg-black/70'
                    }`}>
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    </div>
                    <span className="text-[10px] font-mono text-white/90 font-bold drop-shadow">
                      {reel.likes}
                    </span>
                  </button>

                  <div className="flex flex-col items-center gap-0.5">
                    <div className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/15">
                      <Eye className="w-4 h-4 text-zinc-300" />
                    </div>
                    <span className="text-[10px] font-mono text-white/90 font-bold drop-shadow">
                      {reel.views || '10B'}
                    </span>
                  </div>
                </div>

                {/* Bottom Overlay: Audio Track & Caption */}
                <div className="absolute bottom-3 left-3 right-12 z-10">
                  {reel.musicTrack && (
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-300 font-mono mb-1 truncate">
                      <Music className="w-3 h-3 text-pink-400 shrink-0" />
                      <span className="truncate">{reel.musicTrack}</span>
                    </div>
                  )}

                  <p className="text-white text-xs font-medium leading-snug line-clamp-2 drop-shadow">
                    {reel.caption}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* ==================== IMMERSIVE FULLSCREEN REELS VIEWER MODAL ==================== */}
      <AnimatePresence>
        {activeReelIndex !== null && activeReel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-2xl">
            
            {/* Top Close Button */}
            <button
              onClick={() => setActiveReelIndex(null)}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Kapat"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Desktop Previous Reel Arrow */}
            <button
              onClick={handlePrevReel}
              className="absolute left-4 lg:left-12 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/70 hover:bg-black border border-white/20 text-white transition-all hidden md:flex items-center justify-center hover:scale-110 shadow-2xl"
              aria-label="Önceki Reels"
              title="Önceki Reels (Sağa kaydır veya Sol Tuş)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Desktop Next Reel Arrow */}
            <button
              onClick={handleNextReel}
              className="absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/70 hover:bg-black border border-white/20 text-white transition-all hidden md:flex items-center justify-center hover:scale-110 shadow-2xl"
              aria-label="Sonraki Reels"
              title="Sonraki Reels (Sola kaydır veya Sağ Tuş)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Interactive Vertical Reels Phone Stage with Swipe Navigation */}
            <motion.div
              key={activeReel.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.35}
              onDragEnd={handleDragEnd}
              initial={{
                scale: 0.75,
                opacity: 0,
                x: slideDirection === 'prev' ? -80 : (slideDirection === 'next' ? 80 : 0)
              }}
              animate={{
                scale: 1,
                opacity: 1,
                x: 0
              }}
              exit={{
                scale: 0.75,
                opacity: 0,
                x: slideDirection === 'prev' ? 80 : -80
              }}
              transition={{
                type: 'spring',
                damping: 26,
                stiffness: 320
              }}
              className="relative w-full max-w-[380px] h-[86vh] max-h-[740px] rounded-3xl overflow-hidden bg-black border border-white/20 shadow-2xl flex flex-col justify-between select-none touch-pan-y"
            >
              {/* High Performance Video Player Engine */}
              <video
                ref={modalVideoRef}
                key={`video-${activeReel.id}`}
                src={activeReel.videoUrl}
                poster={activeReel.posterUrl}
                playsInline
                autoPlay
                loop
                preload="auto"
                onWaiting={() => setIsVideoBuffering(true)}
                onPlaying={() => setIsVideoBuffering(false)}
                onCanPlay={handleVideoCanPlay}
                onClick={togglePlayPause}
                className="absolute inset-0 w-full h-full object-cover cursor-pointer"
              />

              {/* Video Buffering Spinner */}
              {isVideoBuffering && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 bg-black/30 backdrop-blur-[2px]">
                  <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
                </div>
              )}

              {/* Top Controls Overlay */}
              <div className="relative z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/85 via-black/40 to-transparent">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-pink-500 shadow-md">
                    <img
                      src={avatarUrl}
                      alt={instagramBusiness}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-white text-xs font-bold font-mono flex items-center gap-1">
                      <span>{instagramBusiness}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[10px] text-zinc-300">
                      Reels {activeReelIndex + 1} / {reels.length}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (modalVideoRef.current) {
                        modalVideoRef.current.muted = !modalVideoRef.current.muted;
                        setIsModalMuted(modalVideoRef.current.muted);
                      }
                    }}
                    className="p-2 rounded-full bg-black/60 text-white border border-white/20 backdrop-blur-md active:scale-95"
                    title={isModalMuted ? 'Sesi Aç' : 'Sesi Kapat'}
                  >
                    {isModalMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-white" />}
                  </button>
                </div>
              </div>

              {/* Pause Big Icon if video is paused */}
              {!isModalPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-black/25">
                  <div className="w-16 h-16 rounded-full bg-black/70 text-white flex items-center justify-center backdrop-blur-md shadow-2xl">
                    <Play className="w-8 h-8 fill-current translate-x-0.5" />
                  </div>
                </div>
              )}

              {/* Right Vertical Action Buttons */}
              <div className="absolute right-3.5 bottom-24 flex flex-col items-center gap-4 z-20">
                <button
                  onClick={(e) => handleLike(activeReel.id, e)}
                  className="flex flex-col items-center gap-1 group/btn"
                >
                  <div className={`p-3 rounded-full backdrop-blur-md transition-all active:scale-125 ${
                    likedReelIds.includes(activeReel.id)
                      ? 'bg-pink-500 text-white shadow-[0_0_20px_#ec4899]'
                      : 'bg-black/60 text-white border border-white/20'
                  }`}>
                    <Heart className={`w-5 h-5 ${likedReelIds.includes(activeReel.id) ? 'fill-current' : ''}`} />
                  </div>
                  <span className="text-xs font-mono font-bold text-white drop-shadow">
                    {activeReel.likes}
                  </span>
                </button>

                <a
                  href={instagramBusinessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1"
                  title="Instagram'da Aç"
                >
                  <div className="p-3 rounded-full bg-black/60 hover:bg-pink-600/80 text-white border border-white/20 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-300">Paylaş</span>
                </a>
              </div>

              {/* Mobile Swipe Navigation Floating Indicator */}
              <div className="absolute top-1/2 left-2 right-2 -translate-y-1/2 flex items-center justify-between pointer-events-none md:hidden z-15 opacity-60">
                <div className="p-1 rounded-full bg-black/40 text-white/70">
                  <ChevronLeft className="w-5 h-5" />
                </div>
                <div className="p-1 rounded-full bg-black/40 text-white/70">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>

              {/* Bottom Caption & Audio & Direct Instagram Button */}
              <div className="relative z-10 p-4 sm:p-5 bg-gradient-to-t from-black via-black/85 to-transparent space-y-2.5">
                {activeReel.musicTrack && (
                  <div className="flex items-center gap-2 text-xs text-zinc-300 font-mono">
                    <Music className="w-3.5 h-3.5 text-pink-400 animate-spin [animation-duration:6s]" />
                    <span className="truncate">{activeReel.musicTrack}</span>
                  </div>
                )}

                <p className="text-white text-xs sm:text-sm font-medium leading-relaxed pr-12 line-clamp-3">
                  {activeReel.caption}
                </p>

                {/* Mobile Gesture Help Tip */}
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-0.5">
                  <span>← Sağa / Sola Kaydır →</span>
                  <span>{activeReelIndex + 1}/{reels.length}</span>
                </div>

                <div className="pt-1">
                  <a
                    href={activeReel.reelUrl || instagramBusinessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-98 transition-all"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>Instagram&apos;da İzle &amp; Takip Et</span>
                  </a>
                </div>
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
