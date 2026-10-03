'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { Music, Mic2, Radio, Sparkles, MessageCircle, Instagram, Volume2 } from 'lucide-react';

interface KeskinlerMusicSectionProps {
  whatsappNumber: string;
  instagramBusiness: string;
  instagramBusinessUrl: string;
}

export default function KeskinlerMusicSection({
  whatsappNumber,
  instagramBusiness,
  instagramBusinessUrl,
}: KeskinlerMusicSectionProps) {
  const { theme } = useTheme();

  const bookingMsg = 'Merhaba Doğanay Bey, Keskinler Müzik Organizasyon için canlı müzik ve sahne kurulumu hakkında bilgi almak istiyorum.';
  const waUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(bookingMsg)}`;

  return (
    <section id="keskinler" className="relative py-24 overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-red-600/10 via-amber-600/10 to-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 p-8 sm:p-12 lg:p-16 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          
          {/* Subtle Stage Lights beam effect */}
          <div className="absolute top-0 right-1/4 w-32 h-96 bg-gradient-to-b from-amber-400/10 to-transparent transform rotate-12 blur-xl pointer-events-none" />
          <div className="absolute top-0 left-1/4 w-32 h-96 bg-gradient-to-b from-red-500/10 to-transparent transform -rotate-12 blur-xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                <Music className="w-3.5 h-3.5" />
                <span>SAHNE, ENERJİ & CANLI ORKESTRA</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Keskinler Müzik Organizasyon
              </h2>

              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
                Doğanay Keskin kuruculuğunda; Sakarya, Kocaeli, İstanbul ve tüm Türkiye genelinde unutulmaz geceler tasarlıyoruz. Profesyonel sahne orkestrası, güçlü solistler, birinci sınıf ses-ışık sistemleri ve kusursuz organizasyon akışı.
              </p>

              {/* Highlights Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                  <Mic2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-bold text-sm">Geniş Orkestra Kadrosu</h4>
                    <p className="text-zinc-400 text-xs mt-1">Düğün, nişan, gala ve festivaller için zengin repertuar ve usta müzisyenler.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                  <Volume2 className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-bold text-sm">Konser Seviyesi Ses & Işık</h4>
                    <p className="text-zinc-400 text-xs mt-1">Line array hoparlörler, robot ışıklar, lazer ve truss sahne sistemleri.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                  <Radio className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-bold text-sm">Video & Sahne Entegrasyonu</h4>
                    <p className="text-zinc-400 text-xs mt-1">Gecenin hem canlı enerjisini hem de video belgesel kurgusunu tek elden yönetin.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-bold text-sm">Tam Kapsamlı Yönetim</h4>
                    <p className="text-zinc-400 text-xs mt-1">Giriş seremonisinden gecenin finaline kadar kesintisiz akış garantisi.</p>
                  </div>
                </div>
              </div>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Sahne Rezervasyonu & Fiyat Al</span>
                </a>

                <a
                  href={instagramBusinessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-sm transition-all"
                >
                  <Instagram className="w-4 h-4 text-pink-400" />
                  <span>{instagramBusiness} Takip Et</span>
                </a>
              </div>

            </div>

            {/* Right Visual Atmosphere Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80"
                  alt="Keskinler Müzik Canlı Performans"
                  className="w-full h-80 sm:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 font-mono text-xs uppercase tracking-wider font-semibold">2026 Sezon Rezervasyonları Açık</span>
                  </div>
                  <h3 className="text-white text-xl font-bold">Unutulmaz Bir Gece İçin Hazır mısınız?</h3>
                  <p className="text-zinc-300 text-xs mt-1">Düğün, konser ve kurumsal etkinlikleriniz için yerinizi erkenden ayırtın.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
