import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import ThemeSwitcher from '@/components/common/ThemeSwitcher';

export const metadata: Metadata = {
  metadataBase: new URL('https://doganaykeskin.com'),
  title: {
    default: 'Doğanay Keskin — Sinematik Video Editörü & Keskinler Müzik Organizasyon',
    template: '%s | Doğanay Keskin',
  },
  description: 'Sakarya merkezli profesyonel video kurgusu, düğün & klip prodüksiyonu, Keskinler Müzik canlı sahne organizasyonları ve premium albüm-davetiye tasarımı.',
  keywords: [
    'Doğanay Keskin',
    'Keskinler Müzik Organizasyon',
    'Sakarya Video Editörü',
    'Video Kurgu Sakarya',
    'Sinematik Video Editörü',
    'Klip Yönetmeni Sakarya',
    'Düğün Hikayesi Çekimi',
    'Düğün Klibi Kurgusu Sakarya',
    'Sony Cinema FX3 Video Prodüksiyon',
    'After Effects Kurgusu',
    'Color Grading DaVinci Resolve',
    'Canlı Sahne Organizasyonu',
    'Orkestra Canlı Müzik Sakarya',
    'Lüks Albüm Tasarımı',
    'Davetiye Baskı Sakarya',
    '4K Drone Çekimi Sakarya',
    'Tanıtım Filmi Prodüksiyonu',
    'Reels Video Editörü',
    'Instagram Viral Video Kurgu',
    'Doğanay Keskin Portföy',
    'Sakarya Prodüksiyon',
    'Müzik Klibi Çekimi',
    'Profesyonel Montaj Hizmeti'
  ],
  authors: [{ name: 'Doğanay Keskin', url: 'https://doganaykeskin.com' }],
  creator: 'Doğanay Keskin',
  publisher: 'Keskinler Müzik Organizasyon',
  formatDetection: {
    email: true,
    telephone: true,
    address: true,
  },
  alternates: {
    canonical: 'https://doganaykeskin.com',
  },
  openGraph: {
    title: 'Doğanay Keskin — Sinematik Video Editörü & Keskinler Müzik',
    description: 'Hikayeleri ekrana, duyguları belleğe kazıyan sinematik vizyon. Profesyonel video kurgu, sahne organizasyonu ve lüks albüm-davetiye.',
    url: 'https://doganaykeskin.com',
    siteName: 'Doğanay Keskin Portföy',
    images: [
      {
        url: '/images/dogi-cinematic.jpg',
        width: 1200,
        height: 630,
        alt: 'Doğanay Keskin — Sinematik Video Editörü & Keskinler Müzik Organizasyon',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Doğanay Keskin — Sinematik Video Editörü & Yönetmen',
    description: 'Sakarya merkezli profesyonel video kurgusu, düğün & klip prodüksiyonu, Keskinler Müzik sahne organizasyonları ve premium albüm-davetiye tasarımı.',
    images: ['/images/dogi-cinematic.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  other: {
    'geo.region': 'TR-54',
    'geo.placename': 'Sakarya, Türkiye',
    'geo.position': '40.7731;30.4042',
    'ICBM': '40.7731, 30.4042',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Rich Structured JSON-LD Schema for Google & Search Engine indexing
  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': 'https://doganaykeskin.com/#person',
        name: 'Doğanay Keskin',
        jobTitle: 'Sinematik Video Editörü & Yönetmen',
        url: 'https://doganaykeskin.com',
        image: 'https://doganaykeskin.com/images/dogi-portrait.jpg',
        telephone: '+905445727292',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Sakarya',
          addressRegion: 'Marmara',
          addressCountry: 'TR',
        },
        sameAs: [
          'https://instagram.com/doganaykesking',
          'https://instagram.com/keskinlermuzik',
        ],
        knowsAbout: [
          'Sinematik Video Kurgusu',
          'Color Grading',
          'Sony Cinema FX3',
          'Düğün Prodüksiyonu',
          'Klip Yönetmenliği',
          'Canlı Sahne Organizasyonu',
          'Lüks Albüm ve Davetiye Tasarımı',
        ],
      },
      {
        '@type': 'ProfessionalService',
        '@id': 'https://doganaykeskin.com/#business',
        name: 'Doğanay Keskin — Keskinler Müzik Organizasyon & Video Prodüksiyon',
        url: 'https://doganaykeskin.com',
        logo: 'https://doganaykeskin.com/favicon.svg',
        image: 'https://doganaykeskin.com/images/dogi-cinematic.jpg',
        telephone: '+905445727292',
        priceRange: '₺₺',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Adapazarı',
          addressRegion: 'Sakarya',
          postalCode: '54100',
          addressCountry: 'TR',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 40.7731,
          longitude: 30.4042,
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '09:00',
          closes: '22:00',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Hizmetlerimiz',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Sinematik Video Kurgu & Color Grading',
                description: 'Tanıtım filmi, sosyal medya reels ve profesyonel reklam kurguları.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Düğün Hikayesi & Klip Prodüksiyonu',
                description: 'Günün tüm duygularını sinematik bir başyapıta dönüştüren özel klip çekimleri.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Keskinler Müzik Canlı Sahne & Orkestra',
                description: 'Düğün, kına, nişan ve özel davetler için profesyonel sahne orkestrası.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Lüks Albüm & Özel Davetiye Baskı',
                description: 'Kişiye özel tasarım, kadife ve deri kapaklı panoramik düğün albümleri.',
              },
            },
          ],
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://doganaykeskin.com/#website',
        url: 'https://doganaykeskin.com',
        name: 'Doğanay Keskin',
        description: 'Sinematik Video Editörü & Keskinler Müzik Organizasyon',
        publisher: {
          '@id': 'https://doganaykeskin.com/#person',
        },
        inLanguage: 'tr-TR',
      },
    ],
  };

  return (
    <html lang="tr" className="scroll-smooth">
      <head>
        {/* Inject Google Rich Snippet JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
        />
      </head>
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
