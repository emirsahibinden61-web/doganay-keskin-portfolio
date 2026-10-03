'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { ServiceItem } from '@/lib/types';
import { Film, HeartHandshake, Music, Palette, Camera, Sparkles, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface ServicesSectionProps {
  services: ServiceItem[];
  whatsappNumber: string;
}

export default function ServicesSection({ services, whatsappNumber }: ServicesSectionProps) {
  const { theme } = useTheme();

  const getIcon = (name: string) => {
    switch (name) {
      case 'Film':
        return <Film className="w-6 h-6" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6" />;
      case 'Music':
        return <Music className="w-6 h-6" />;
      case 'Palette':
        return <Palette className="w-6 h-6" />;
      case 'Camera':
        return <Camera className="w-6 h-6" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'cyber':
        return {
          cardBorder: 'border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]',
          iconBg: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
          bulletColor: 'text-cyan-400',
        };
      case 'luxe':
        return {
          cardBorder: 'border-amber-300/20 hover:border-amber-300/50 hover:shadow-[0_0_30px_rgba(230,202,151,0.15)]',
          iconBg: 'bg-amber-300/10 text-amber-200 border border-amber-300/30',
          bulletColor: 'text-amber-300',
        };
      case 'cinematic':
      default:
        return {
          cardBorder: 'border-amber-500/20 hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
          iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
          bulletColor: 'text-amber-400',
        };
    }
  };

  const themeStyle = getThemeStyles();

  return (
    <section id="services" className="relative py-24 border-t border-white/5 bg-zinc-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>UZMANLIK ALANLARI & HİZMETLER</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Kamera Önünden Matbaaya, Sahneden Ekrana
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Her karede yüksek sinematik standart, her davette unutulmaz müzik ve her tasarımda el işçiliği zarafeti.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((srv, idx) => {
            const reqMsg = `Merhaba Doğanay Bey, "${srv.title}" hizmetiniz hakkında bilgi ve teklif almak istiyorum.`;
            const waLink = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(reqMsg)}`;

            return (
              <motion.div
                key={srv.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`relative p-8 rounded-3xl bg-zinc-900/40 backdrop-blur-sm border transition-all duration-300 flex flex-col justify-between group ${themeStyle.cardBorder}`}
              >
                <div>
                  {/* Icon & Index */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3.5 rounded-2xl ${themeStyle.iconBg}`}>
                      {getIcon(srv.icon)}
                    </div>
                    <span className="text-2xl font-mono font-bold text-zinc-700 group-hover:text-zinc-500 transition-colors">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                  </div>

                  {/* Title & Short Desc */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    {srv.shortDesc}
                  </p>

                  {/* Features Bullet List */}
                  {srv.features && (
                    <ul className="space-y-2.5 mb-8">
                      {srv.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2.5 text-xs text-zinc-300 font-sans">
                          <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${themeStyle.bulletColor}`} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Direct Action */}
                <div className="pt-4 border-t border-white/5">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-white group-hover:translate-x-1 transition-all"
                  >
                    <span>Detaylı Bilgi & Teklif Al</span>
                    <ArrowUpRight className="w-4 h-4 text-amber-400" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
