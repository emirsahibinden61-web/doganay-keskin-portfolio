'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, MessageCircle, Calendar, User, Tag } from 'lucide-react';
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
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && videoRef.current && item?.type === 'video') {
      try {
        videoRef.current.load();
        const p = videoRef.current.play();
        if (p !== undefined) {
          p.then(() => {
            setIsPlaying(true);
          }).catch((err) => {
            console.debug('Autoplay with audio blocked, trying muted:', err);
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => {
                setIsPlaying(true);
              }).catch(() => {
                setIsPlaying(false);
              });
            }
          });
        }
      } catch (err) {
        console.error('Video load error:', err);
      }
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.error('Play error:', e);
      });
    }
  };

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

  const whatsappMsg = `Merhaba Doğanay Bey, portföyünüzdeki "${item.title}" çalışmanızı gördüm, benzer bir proje için bilgi ve teklif almak istiyorum.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
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
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl rounded-3xl bg-zinc-950 border border-white/20 shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[90vh]"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/60 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                {item.category.replace('-', ' ')}
              </span>
              <h3 className="text-white font-bold text-base sm:text-lg truncate max-w-md">
                {item.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Media Player Area */}
          <div className="relative bg-black flex items-center justify-center min-h-[300px] sm:min-h-[460px] overflow-hidden">
            {item.type === 'video' ? (
              <div 
                className="relative w-full h-full flex items-center justify-center group cursor-pointer"
                onClick={togglePlay}
              >
                <video
                  ref={videoRef}
                  key={item.id}
                  src={item.mediaUrl}
                  poster={item.posterUrl}
                  playsInline
                  loop
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onWaiting={() => setIsBuffering(true)}
                  onPlaying={() => setIsBuffering(false)}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleTimeUpdate}
                  className="max-h-[60vh] w-auto max-w-full object-contain mx-auto"
                />

                {/* Big center play icon if paused */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/30">
                    <div className="w-16 h-16 rounded-full bg-amber-500/90 text-black flex items-center justify-center shadow-2xl transform scale-110">
                      <Play className="w-8 h-8 fill-current translate-x-0.5" />
                    </div>
                  </div>
                )}

                {/* Video Controls Bar */}
                <div 
                  className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col gap-2 z-20"
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
                    className="w-full h-1.5 bg-white/20 accent-amber-500 rounded-lg cursor-pointer appearance-none"
                  />

                  <div className="flex items-center justify-between text-xs text-zinc-300">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={togglePlay}
                        className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
                        title={isPlaying ? 'Durdur' : 'Oynat'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={toggleMute}
                        className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
                        title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-white" />}
                      </button>
                      <span className="font-mono text-zinc-400">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={toggleFullscreen}
                        className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
                        title="Tam Ekran"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-2xl"
                />
              </div>
            )}
          </div>

          {/* Details & Action Footer */}
          <div className="p-6 bg-zinc-950 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-y-auto">
            <div className="space-y-2 max-w-2xl">
              <p className="text-zinc-300 text-sm leading-relaxed">
                {item.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 pt-1">
                {item.client && (
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Müşteri: {item.client}</span>
                  </div>
                )}
                {item.year && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Yıl: {item.year}</span>
                  </div>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Tag className="w-3.5 h-3.5 text-amber-500" />
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="bg-white/5 px-2 py-0.5 rounded text-zinc-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Bu Proje İçin Fiyat Al</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
