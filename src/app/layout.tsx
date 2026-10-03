import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import ThemeSwitcher from '@/components/common/ThemeSwitcher';

export const metadata: Metadata = {
  title: 'Doğanay Keskin — Sinematik Video Editörü & Keskinler Müzik Organizasyon',
  description: 'Sakarya merkezli profesyonel video kurgusu, düğün & klip prodüksiyonu, Keskinler Müzik sahne organizasyonları ve premium albüm-davetiye tasarımı.',
  keywords: [
    'Doğanay Keskin',
    'Keskinler Müzik Organizasyon',
    'Sakarya Video Editörü',
    'Video Kurgu',
    'Düğün Hikayesi Çekimi',
    'Klip Yönetmeni',
    'Albüm Tasarımı',
    'Davetiye Baskı Sakarya',
    'Canlı Müzik Sahne'
  ],
  authors: [{ name: 'Doğanay Keskin' }],
  openGraph: {
    title: 'Doğanay Keskin — Sinematik Video Editörü & Keskinler Müzik',
    description: 'Hikayeleri ekrana, duyguları belleğe kazıyan sinematik vizyon. Profesyonel video kurgu, sahne organizasyonu ve lüks albüm-davetiye.',
    images: ['/images/dogi-cinematic.jpg'],
    locale: 'tr_TR',
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body className="antialiased bg-[#08090b] text-zinc-100 min-h-screen">
        <ThemeProvider initialTheme="cinematic">
          {/* 3 Concepts Switcher */}
          <ThemeSwitcher />

          {/* Main App Content */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
