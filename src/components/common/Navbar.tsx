'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { SiteContent } from '@/lib/types';
import { Menu, X, Shield, MessageCircle, Play } from 'lucide-react';
import DkLogo from '@/components/common/DkLogo';

interface NavbarProps {
  content: SiteContent;
}

export default function Navbar({ content }: NavbarProps) {
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappUrl = `https://wa.me/${content.contacts.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(content.contacts.whatsappMessage)}`;

  // Styling per theme
  const getThemeNavStyle = () => {
    switch (theme) {
      case 'cyber':
        return scrolled
          ? 'bg-[#060714]/85 border-cyan-500/20 shadow-[0_4px_30px_rgba(6,182,212,0.15)]'
          : 'bg-transparent border-transparent';
      case 'luxe':
        return scrolled
          ? 'bg-[#0c0c0e]/85 border-amber-200/20 shadow-[0_4px_30px_rgba(230,202,151,0.1)]'
          : 'bg-transparent border-transparent';
      case 'cinematic':
      default:
        return scrolled
          ? 'bg-[#090a0d]/85 border-amber-500/20 shadow-[0_4px_30px_rgba(245,158,11,0.1)]'
          : 'bg-transparent border-transparent';
    }
  };

  const getAccentBadge = () => {
    switch (theme) {
      case 'cyber':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30';
      case 'luxe':
        return 'text-amber-200 bg-amber-950/40 border-amber-400/30';
      case 'cinematic':
      default:
        return 'text-amber-400 bg-amber-950/60 border-amber-500/30';
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 backdrop-blur-md border-b ${getThemeNavStyle()}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <DkLogo size="md" className="group-hover:scale-105 transition-transform duration-300" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-base sm:text-lg text-white group-hover:text-amber-400 transition-colors uppercase font-mono">
                {content.profile.name}
              </span>
            </div>
            <span className="text-xs text-amber-400 font-sans tracking-tight">
              Keskinler Müzik Organizasyon
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-300">
          <a href="#portfolio" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
            <Play className="w-3 h-3 text-amber-500" />
            Portföy & Kurgular
          </a>
          <a href="#reels-album" className="hover:text-pink-400 transition-colors flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
            Reels Albümü
          </a>
          <a href="#services" className="hover:text-amber-400 transition-colors">
            Hizmetler
          </a>
          <a href="#keskinler" className="hover:text-amber-400 transition-colors">
            Keskinler Müzik
          </a>
          <a href="#about" className="hover:text-amber-400 transition-colors">
            Hakkımda
          </a>
          <a href="#contact" className="hover:text-amber-400 transition-colors">
            İletişim
          </a>
        </nav>

        {/* Right Action buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Direct WhatsApp Action */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            WhatsApp
          </a>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-zinc-300 hover:text-white bg-white/5 border border-white/10"
            aria-label="Menüyü Aç"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-2xl px-6 py-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <DkLogo size="lg" className="w-12 h-12" />
            <div>
              <div className="text-white font-bold">{content.profile.name}</div>
              <div className="text-xs text-amber-400">{content.profile.tagline}</div>
            </div>
          </div>

          <div className="flex flex-col gap-3 font-medium text-base text-zinc-200">
            <a
              href="#portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-400 py-1"
            >
              Portföy & Video Galerisi
            </a>
            <a
              href="#reels-album"
              onClick={() => setMobileMenuOpen(false)}
              className="text-pink-400 hover:text-pink-300 py-1 flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              Keskinler Müzik Reels Albümü
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-400 py-1"
            >
              Hizmet Alanları
            </a>
            <a
              href="#keskinler"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-400 py-1"
            >
              Keskinler Müzik Organizasyon
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-400 py-1"
            >
              Hakkımda & Ekipmanlar
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-400 py-1"
            >
              İletişim & Sosyal Medya
            </a>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-500 text-white font-semibold shadow-lg text-sm"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              WhatsApp ile Hemen Ulaşın
            </a>
            <a
              href={content.contacts.instagramPersonalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs"
            >
              Kişisel Instagram ({content.contacts.instagramPersonal})
            </a>
            <a
              href={content.contacts.instagramBusinessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs"
            >
              İşletme Instagram ({content.contacts.instagramBusiness})
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
