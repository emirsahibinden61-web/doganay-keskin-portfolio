'use client';

import React, { useState } from 'react';
import { SiteContent, PortfolioItem } from '@/lib/types';
import Navbar from '@/components/common/Navbar';
import HeroSection from '@/components/home/HeroSection';
import PortfolioGallery from '@/components/home/PortfolioGallery';
import ServicesSection from '@/components/home/ServicesSection';
import KeskinlerMusicSection from '@/components/home/KeskinlerMusicSection';
import AboutSection from '@/components/home/AboutSection';
import ContactSection from '@/components/home/ContactSection';
import Footer from '@/components/home/Footer';
import VideoModal from '@/components/home/VideoModal';
import CustomCursor from '@/components/common/CustomCursor';
import ScrollIndicator from '@/components/common/ScrollIndicator';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import InstagramReelsSection from '@/components/home/InstagramReelsSection';

interface HomeClientProps {
  initialContent: SiteContent;
  initialPortfolio: PortfolioItem[];
}

export default function HomeClient({ initialContent, initialPortfolio }: HomeClientProps) {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const vis = initialContent.sectionVisibility || {
    heroHashtags: true,
    stats: true,
    portfolio: true,
    services: true,
    keskinlerMusic: true,
    about: true,
    equipment: true,
    contact: true,
    whatsappFloating: true,
    timecodeHud: true,
    cursorEffect: true
  };

  const handleOpenItem = (item: PortfolioItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleOpenDirectVideo = (videoUrl: string, title: string) => {
    setSelectedItem({
      id: 'quick-preview',
      title,
      category: 'video-kurgu',
      type: 'video',
      mediaUrl: videoUrl,
      posterUrl: initialContent.profile.heroImage,
      description: initialContent.profile.heroSubtitle,
      client: initialContent.profile.brandName,
      year: '2026',
      tags: ['Showreel', 'Doğanay Keskin'],
      aspect: '16:9'
    });
    setIsModalOpen(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-amber-500/30">
      {/* Scroll-synchronized progress & timecode hud */}
      <ScrollIndicator showHud={vis.timecodeHud !== false} />

      {/* Interactive Glowing Cursor */}
      {vis.cursorEffect !== false && <CustomCursor />}

      {/* Floating WhatsApp Quick Contact */}
      {vis.whatsappFloating !== false && <WhatsAppButton />}

      {/* Top Navbar (without any admin buttons for visitors) */}
      <Navbar content={initialContent} />

      {/* Main Content Sections with individual visibility toggles */}
      <main className="flex-1">
        {/* 1. Hero Section (Giriş) */}
        <HeroSection
          content={initialContent}
          onOpenVideoModal={handleOpenDirectVideo}
        />

        {/* 2. Doğanay Keskin Kişisel Reels Akışı (Araba & Viral Editler - @doganaykesking) */}
        {vis.personalReels !== false && (
          <InstagramReelsSection
            sectionId="personal-reels"
            badgeLabel="DOĞANAY KESKİN VİRAL & ARABA EDİTLERİ"
            title="Sinematik Kurgu & Araba Editleri"
            subtitle="Doğanay Keskin kişisel profilinden en popüler After Effects, viral kancalar, gece sürüşü ve araba drift kurguları."
            reels={initialContent.personalReels}
            instagramBusiness={initialContent.contacts.instagramPersonal}
            instagramBusinessUrl={initialContent.contacts.instagramPersonalUrl}
            avatarUrl="/images/dogi-avatar.jpg"
            ambientColor="from-cyan-600/15 via-purple-600/15 to-pink-500/15"
          />
        )}

        {/* 3. Keskinler Müzik Canlı Sahne Reels Albümü (@keskinlermuzik) */}
        {vis.instagramReels !== false && (
          <InstagramReelsSection
            sectionId="reels-album"
            badgeLabel="KESKİNLER MÜZİK CANLI SAHNE & ŞOV"
            title="Canlı Sahne & Orkestra Reels Akışı"
            subtitle="Doğanay Keskin ve Keskinler Müzik ekibinin en güncel sahne performansları, orkestra soloları ve özel anları."
            reels={initialContent.instagramReels}
            instagramBusiness={initialContent.contacts.instagramBusiness}
            instagramBusinessUrl={initialContent.contacts.instagramBusinessUrl}
            avatarUrl="/images/dogi-portrait.jpg"
            ambientColor="from-amber-600/15 via-pink-600/15 to-purple-600/15"
          />
        )}

        {/* 4. Normal Web Sitesi Kategorileri ve Video/Resim Portföy Galerisi */}
        {vis.portfolio !== false && (
          <PortfolioGallery
            items={initialPortfolio}
            categories={initialContent.categories}
            onSelectItem={handleOpenItem}
          />
        )}

        {/* 5. Services Specialization */}
        {vis.services !== false && (
          <ServicesSection
            services={initialContent.services}
            whatsappNumber={initialContent.contacts.whatsapp}
          />
        )}

        {/* 6. Keskinler Müzik Organizasyon Section */}
        {vis.keskinlerMusic !== false && (
          <KeskinlerMusicSection
            whatsappNumber={initialContent.contacts.whatsapp}
            instagramBusiness={initialContent.contacts.instagramBusiness}
            instagramBusinessUrl={initialContent.contacts.instagramBusinessUrl}
          />
        )}

        {/* 5. About & Gear */}
        {vis.about !== false && (
          <AboutSection
            about={initialContent.about}
            profile={initialContent.profile}
            contacts={initialContent.contacts}
            showEquipment={vis.equipment !== false}
          />
        )}

        {/* 6. Contact & Direct WhatsApp */}
        {vis.contact !== false && (
          <ContactSection contacts={initialContent.contacts} />
        )}
      </main>

      {/* Footer */}
      <Footer content={initialContent} />

      {/* Video / Photo Lightbox Modal */}
      <VideoModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        whatsappNumber={initialContent.contacts.whatsapp}
      />
    </div>
  );
}
