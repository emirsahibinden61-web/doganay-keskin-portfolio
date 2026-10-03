'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ContactsData } from '@/lib/types';
import { MessageCircle, Phone, Instagram, Send, MapPin, CheckCircle } from 'lucide-react';

interface ContactSectionProps {
  contacts: ContactsData;
}

export default function ContactSection({ contacts }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [projectType, setProjectType] = useState('Video Kurgu & Klip');
  const [userMsg, setUserMsg] = useState('');

  const phoneRaw = contacts.whatsapp.replace(/[^0-9]/g, '');
  const directWhatsappUrl = `https://wa.me/${phoneRaw}?text=${encodeURIComponent(contacts.whatsappMessage)}`;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = `Merhaba Doğanay Bey, websiten üzerinden ulaşıyorum.\n\nİsmim: ${name || 'Belirtilmedi'}\nProje Türü: ${projectType}\nMesajım: ${userMsg || 'Fiyat ve takvim bilgisi almak istiyorum.'}`;
    window.open(`https://wa.me/${phoneRaw}?text=${encodeURIComponent(formatted)}`, '_blank');
  };

  return (
    <section id="contact" className="relative py-24 border-t border-white/5 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>HEMEN İLETİŞİME GEÇİN</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Hayalinizdeki Projeyi Birlikte Başlatalım
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Düğün, klip, canlı sahne organizasyonu veya özel tasarım davetiye için doğrudan WhatsApp veya sosyal medya üzerinden ulaşabilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Cards: Quick Direct Contact Options */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Direct WhatsApp Big Card */}
            <a
              href={directWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 rounded-3xl bg-gradient-to-br from-emerald-950/60 to-zinc-900 border border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]"
            >
              <div className="flex items-center justify-between">
                <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-7 h-7 fill-current" />
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
                  En Hızlı Yanıt &bull; Çevrimiçi
                </span>
              </div>
              <div className="mt-5">
                <h4 className="text-white font-bold text-lg group-hover:text-emerald-300 transition-colors">
                  WhatsApp Doğrudan Mesaj
                </h4>
                <p className="text-zinc-300 text-xs mt-1">
                  &ldquo;{contacts.whatsappMessage}&rdquo; mesajı ile anında sohbete başlayın.
                </p>
                <div className="mt-3 font-mono font-bold text-emerald-400 text-base">
                  {contacts.whatsapp}
                </div>
              </div>
            </a>

            {/* Instagram Personal Card */}
            <a
              href={contacts.instagramPersonalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 rounded-2xl bg-zinc-900/60 border border-white/10 hover:border-pink-500/40 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-white font-bold text-sm">Kişisel Instagram</h5>
                    <div className="text-xs text-pink-400 font-mono">{contacts.instagramPersonal}</div>
                  </div>
                </div>
                <span className="text-xs text-zinc-400 group-hover:text-white transition-colors">
                  Profili Gör &rarr;
                </span>
              </div>
            </a>

            {/* Instagram Business Card */}
            <a
              href={contacts.instagramBusinessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 rounded-2xl bg-zinc-900/60 border border-white/10 hover:border-amber-500/40 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white shadow-md">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-white font-bold text-sm">Keskinler Müzik Instagram</h5>
                    <div className="text-xs text-amber-400 font-mono">{contacts.instagramBusiness}</div>
                  </div>
                </div>
                <span className="text-xs text-zinc-400 group-hover:text-white transition-colors">
                  Profili Gör &rarr;
                </span>
              </div>
            </a>

            {/* Phone Call Card */}
            <a
              href={`tel:${phoneRaw}`}
              className="block p-5 rounded-2xl bg-zinc-900/40 border border-white/10 hover:border-white/20 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/10 text-white">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-white font-bold text-sm">Doğrudan Arama</h5>
                    <div className="text-xs text-zinc-400 font-mono">{contacts.phone}</div>
                  </div>
                </div>
                <span className="text-xs text-zinc-400 group-hover:text-white">
                  Hemen Ara
                </span>
              </div>
            </a>

          </div>

          {/* Right Column: Fast Quote & Project Brief Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-zinc-900/70 border border-white/10 backdrop-blur-md">
              <h3 className="text-xl font-bold text-white mb-2">
                Hızlı Teklif & Randevu Formu
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm mb-6">
                Formu doldurduğunuzda bilgileriniz otomatik olarak WhatsApp mesajına dönüştürülür ve doğrudan Doğanay Keskin&apos;e iletilir.
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                    Adınız & Soyadınız
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Örn: Ayşe Yılmaz"
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/70 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                    İlgilendiğiniz Hizmet / Proje Türü
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/70 transition-colors"
                  >
                    <option value="Sinematik Video Kurgu & Klip">Sinematik Video Kurgu & Klip</option>
                    <option value="Düğün Hikayesi & Özel Gün Prodüksiyonu">Düğün Hikayesi & Özel Gün Prodüksiyonu</option>
                    <option value="Keskinler Müzik Canlı Orkestra & Sahne">Keskinler Müzik Canlı Orkestra & Sahne</option>
                    <option value="Lüks Albüm Tasarımı & Davetiye Baskısı">Lüks Albüm Tasarımı & Davetiye Baskısı</option>
                    <option value="4K Drone Çekimi & Reklam Tanıtımı">4K Drone Çekimi & Reklam Tanıtımı</option>
                    <option value="Sosyal Medya Reels Paketi">Sosyal Medya Reels Paketi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                    Proje Detayı veya Sorularınız
                  </label>
                  <textarea
                    rows={4}
                    value={userMsg}
                    onChange={(e) => setUserMsg(e.target.value)}
                    placeholder="Etkinlik tarihi, mekan, video süresi veya aklınızdaki konsepti kısaca belirtebilirsiniz..."
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/70 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Send className="w-4 h-4" />
                  <span>WhatsApp ile Teklif İsteğini İlet</span>
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
