'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { AboutData, ProfileData, ContactsData } from '@/lib/types';
import { Check, Cpu, Camera, Sliders, MapPin, Sparkles, Award } from 'lucide-react';

interface AboutSectionProps {
  about: AboutData;
  profile: ProfileData;
  contacts: ContactsData;
  showEquipment?: boolean;
}

export default function AboutSection({ about, profile, contacts, showEquipment = true }: AboutSectionProps) {
  const { theme } = useTheme();

  return (
    <section id="about" className="relative py-24 border-t border-white/5 bg-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Story Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-zinc-950 shadow-2xl group">
              <img
                src="/images/dogi-hero.jpg"
                alt={profile.name}
                className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              {/* Float Badge */}
              <div className="absolute top-4 left-4 p-3 rounded-2xl bg-black/80 border border-white/15 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-white text-xs font-bold font-mono">DOĞANAY KESKİN</div>
                    <div className="text-[10px] text-zinc-400">{profile.age} Yaşında &bull; Sakarya</div>
                  </div>
                </div>
              </div>

              {/* Bottom Quote */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/75 border border-white/10 backdrop-blur-md">
                <p className="text-xs sm:text-sm text-zinc-200 italic">
                  &ldquo;Kurgu yalnızca görüntüleri kesip yapıştırmak değil; izleyicinin kalbini aynı ritimde attırabilmektir.&rdquo;
                </p>
                <div className="mt-2 text-right text-[11px] font-mono text-amber-400 font-semibold">
                  — Doğanay Keskin
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio & Equipment Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>HAKKIMDA & TEKNİK VİZYON</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {about.title}
            </h2>

            {/* Paragraphs */}
            <div className="space-y-4 text-zinc-300 text-sm sm:text-base leading-relaxed">
              {about.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Skills Pills */}
            <div className="pt-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-3">
                Yetkinlikler & Disiplinler
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {about.skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300 bg-white/[0.03] border border-white/5 p-2 rounded-xl">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment & Gear Grid */}
            {showEquipment !== false && about.equipment && about.equipment.length > 0 && (
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  Teknik Ekipman & Yazılım Parkı
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {about.equipment.map((grp, gIdx) => (
                    <div key={gIdx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                      <div className="text-xs font-bold text-white font-mono">{grp.category}</div>
                      <div className="text-xs text-zinc-400">
                        {grp.items.join(' • ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
