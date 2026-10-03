'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, MessageCircle, Calendar, User, Tag, Loader2 } from 'lucide-react';
import { PortfolioItem } from '@/lib/types';

interface VideoModalProps {
  item: PortfolioItem | null;
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber: string;
}

export default function VideoModal({ item, isOpen, onClose, whatsappNumber }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ' && item?.type === 'video') {
        e.preventDefault();
        togglePlay();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, item]);

  useEffect(() => {
    if (isOpen && videoRef.current && item?.type === 'video') {
      setIsBuffering(true);
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
        }).catch(() => {
          // If unmuted autoplay fails, try muted
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => {
              setIsPlaying(true);
              setIsBuffering(false);
            }).catch(() => {
              setIsPlaying(false);
              setIsBuffering(false);
            });
          }
        });
      }
    }
  }, [isOpen, item]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.debug('Play failed:', e);
      });
    }
  }, [isPlaying]);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !item) return null;

  const whatsappMsg = `Merhaba Doğanay Bey, portföyünüzdeki "${item.title}" çalışmanızı gördüm, benzer bir proje için bilgi ve fiyat almak istiyorum.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] rounded-2xl sm:rounded-3xl bg-zinc-950 border border-white/20 shadow-2xl overflow-hidden z-10 flex flex-col my-auto"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 border-b border-white/10 bg-black/80 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 truncate mr-3">
              <span className="text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase shrink-0">
                {item.category.replace('-', ' ')}
              </span>
              <h3 className="text-white font-bold text-sm sm:text-base truncate">
                {item.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors shrink-0"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Media Player Area - Scaled for Mobile & Desktop */}
          <div className="relative bg-black flex items-center justify-center w-full max-h-[48vh] sm:max-h-[56vh] overflow-hidden shrink-0">
            {item.type === 'video' ? (
              <div 
                className="relative w-full h-full flex items-center justify-center group cursor-pointer bg-black"
                onClick={togglePlay}
              >
                <video
                  ref={videoRef}
                  key={item.id}
                  src={item.mediaUrl}
                  poster={item.posterUrl}
                  playsInline
                  autoPlay
                  loop
                  preload="auto"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onWaiting={() => setIsBuffering(true)}
                  onPlaying={() => setIsBuffering(false)}
                  onCanPlay={() => setIsBuffering(false)}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleTimeUpdate}
                  className="max-h-[46vh] sm:max-h-[55vh] w-auto max-w-full object-contain mx-auto"
                />

                {/* Center buffering spinner */}
                {isBuffering && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/40 backdrop-blur-[2px] z-10">
                    <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                  </div>
                )}

                {/* Big center play icon if paused */}
                {!isPlaying && !isBuffering && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/30 z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-500/90 text-black flex items-center justify-center shadow-2xl transform scale-105">
                      <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current translate-x-0.5" />
                    </div>
                  </div>
                )}

                {/* Video Controls Bar - Responsive & Touch Friendly */}
                <div 
                  className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-1.5 z-20"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Progress Seek bar */}
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 sm:h-1.5 bg-white/20 accent-amber-500 rounded-lg cursor-pointer appearance-none"
                    aria-label="İlerleme çubuğu"
                  />

                  <div className="flex items-center justify-between text-xs text-zinc-300">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <button
                        onClick={togglePlay}
                        className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
                        title={isPlaying ? 'Durdur' : 'Oynat'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={toggleMute}
                        className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
                        title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-white" />}
                      </button>
                      <span className="font-mono text-[11px] sm:text-xs text-zinc-400">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleFullscreen}
                        className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
                        title="Tam Ekran"
                      >
                        <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4">
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  className="max-h-[46vh] sm:max-h-[55vh] max-w-full object-contain rounded-xl shadow-2xl"
                />
              </div>
            )}
          </div>

          {/* Details & Action Footer - Scrollable on mobile screens */}
          <div className="p-4 sm:p-5 bg-zinc-950 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-y-auto">
            <div className="space-y-1.5 max-w-2xl">
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none">
                {item.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-3 text-[11px] sm:text-xs font-mono text-zinc-400 pt-0.5">
                {item.client && (
                  <div className="flex items-center gap-1.5">
                    <User className="w-3 h-3 text-amber-400" />
                    <span>Müşteri: {item.client}</span>
                  </div>
                )}
                {item.year && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-zinc-400" />
                    <span>Yıl: {item.year}</span>
                  </div>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap">
                    <Tag className="w-3 h-3 text-amber-500" />
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="bg-white/5 px-1.5 py-0.5 rounded text-zinc-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Button for Mobile & Desktop */}
            <div className="flex items-center gap-3 shrink-0 pt-1 md:pt-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current shrink-0" />
                <span>Bu Proje İçin Fiyat Al</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
