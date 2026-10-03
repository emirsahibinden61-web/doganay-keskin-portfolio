'use client';

import React from 'react';
import Link from 'next/link';
import { SiteContent } from '@/lib/types';
import { Heart, Lock, Instagram, MessageCircle, Phone, ArrowUp } from 'lucide-react';
import DkLogo from '@/components/common/DkLogo';

interface FooterProps {
  content: SiteContent;
}

export default function Footer({ content }: FooterProps) {
  const { profile, contacts } = content;
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappUrl = `https://wa.me/${contacts.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(contacts.whatsappMessage)}`;

  return (
    <footer className="relative bg-black border-t border-white/10 pt-16 pb-12 overflow-hidden text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <DkLogo size="md" />
              <div>
                <div className="text-white font-black tracking-wider text-base font-mono">
                  {profile.name}
                </div>
                <div className="text-xs text-amber-400 font-sans">
                  {profile.brandName}
                </div>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400">
              Sakarya ve tüm Türkiye genelinde sinematik video kurgu, profesyonel klip ve düğün çekimleri, canlı orkestra organizasyonu ve lüks albüm & davetiye tasarımı.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-mono font-bold uppercase tracking-wider mb-4">
              Hızlı Gezinme
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#portfolio" className="hover:text-amber-400 transition-colors">Portföy & Kurgular</a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-400 transition-colors">Hizmetlerimiz</a>
              </li>
              <li>
                <a href="#keskinler" className="hover:text-amber-400 transition-colors">Keskinler Müzik Organizasyon</a>
              </li>
              <li>
                <a href="#about" className="hover:text-amber-400 transition-colors">Hakkımda & Ekipmanlar</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-amber-400 transition-colors">İletişim & Teklif</a>
              </li>
            </ul>
          </div>

          {/* Socials & Contacts */}
          <div>
            <h4 className="text-white text-xs font-mono font-bold uppercase tracking-wider mb-4">
              Sosyal Medya & İletişim
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href={contacts.instagramPersonalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  <span>Kişisel: {contacts.instagramPersonal}</span>
                </a>
              </li>
              <li>
                <a
                  href={contacts.instagramBusinessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-amber-400" />
                  <span>İşletme: {contacts.instagramBusiness}</span>
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                  <span>WhatsApp: {contacts.whatsapp}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contacts.phone.replace(/[^0-9]/g, '')}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Telefon: {contacts.phone}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Studio & Booking info */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-mono font-bold uppercase tracking-wider mb-4">
              Stüdyo & Rezervasyon
            </h4>
            <p className="text-xs text-zinc-400">
              Lokasyon: {profile.location}
            </p>
            <p className="text-xs text-zinc-400">
              Çalışma Saatleri: Haftanın 7 Günü (Randevu ile)
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                2026 Sezon Rezervasyonları Açık
              </span>
            </div>
          </div>

        </div>

        {/* Bottom copyright & Scroll to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            &copy; {new Date().getFullYear()} {profile.name} &bull; {profile.brandName}. Tüm hakları saklıdır.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
          >
            <span>Yukarı Çık</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
