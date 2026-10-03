import fs from 'fs';
import path from 'path';
import { SiteContent, PortfolioItem } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'site-content.json');
const PORTFOLIO_FILE = path.join(DATA_DIR, 'portfolio-items.json');

export function getSiteContent(): SiteContent {
  try {
    if (!fs.existsSync(CONTENT_FILE)) {
      throw new Error('Content file not found');
    }
    const data = fs.readFileSync(CONTENT_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    
    // Ensure new fields exist even if file was older
    if (!parsed.heroHashtags) {
      parsed.heroHashtags = [
        "Video Kurgu & Color Grading",
        "Düğün & Klip Prodüksiyon",
        "Keskinler Canlı Sahne",
        "Lüks Albüm & Davetiye Baskı",
        "4K Drone"
      ];
    }
    if (!parsed.categories) {
      parsed.categories = [
        { id: "all", label: "Tüm Çalışmalar", enabled: true },
        { id: "video-kurgu", label: "Video Kurgu & Klip", enabled: true },
        { id: "dugun-klip", label: "Düğün Hikayesi", enabled: true },
        { id: "organizasyon", label: "Keskinler Sahne & Canlı Müzik", enabled: true },
        { id: "album-davetiye", label: "Albüm & Davetiye Tasarım", enabled: true },
        { id: "drone-reklam", label: "4K Drone & Tanıtım", enabled: true }
      ];
    }
    if (!parsed.sectionVisibility) {
      parsed.sectionVisibility = {
        heroHashtags: true,
        stats: true,
        portfolio: true,
        services: true,
        keskinlerMusic: true,
        instagramReels: true,
        about: true,
        equipment: true,
        contact: true,
        whatsappFloating: true,
        timecodeHud: true,
        cursorEffect: true
      };
    }
    return parsed;
  } catch (error) {
    console.error('Error reading site content:', error);
    return {
      profile: {
        name: "Doğanay Keskin",
        shortName: "Dogi",
        tagline: "Sinematik Video Editörü & Keskinler Müzik Sahibi",
        age: "24",
        location: "Sakarya, Türkiye",
        brandName: "Keskinler Müzik Organizasyon",
        heroTitle: "Hikayeleri Ekrana, Duyguları Belleğe Kazıyan Sinematik Vizyon",
        heroSubtitle: "Sakarya merkezli profesyonel video kurgusu, düğün & klip prodüksiyonu, canlı müzik sahne organizasyonları ve premium albüm-davetiye tasarımı.",
        avatar: "/images/dogi-portrait.jpg",
        heroImage: "/images/dogi-cinematic.jpg",
        originalImage: "/images/dogi-original.jpg",
        defaultTheme: "cinematic"
      },
      contacts: {
        phone: "+905445727292",
        whatsapp: "+905445727292",
        whatsappMessage: "Merhaba, websiten üzerinden ulaşıyorum",
        instagramPersonal: "@doganaykesking",
        instagramPersonalUrl: "https://instagram.com/doganaykesking",
        instagramBusiness: "@keskinlermuzik",
        instagramBusinessUrl: "https://instagram.com/keskinlermuzik",
        email: "doganaykeskin@keskinlermuzik.com"
      },
      heroHashtags: [
        "Video Kurgu & Color Grading",
        "Düğün & Klip Prodüksiyon",
        "Keskinler Canlı Sahne",
        "Lüks Albüm & Davetiye Baskı",
        "4K Drone"
      ],
      categories: [
        { id: "all", label: "Tüm Çalışmalar", enabled: true },
        { id: "video-kurgu", label: "Video Kurgu & Klip", enabled: true },
        { id: "dugun-klip", label: "Düğün Hikayesi", enabled: true },
        { id: "organizasyon", label: "Keskinler Sahne & Canlı Müzik", enabled: true },
        { id: "album-davetiye", label: "Albüm & Davetiye Tasarım", enabled: true },
        { id: "drone-reklam", label: "4K Drone & Tanıtım", enabled: true }
      ],
      sectionVisibility: {
        heroHashtags: true,
        stats: true,
        portfolio: true,
        services: true,
        keskinlerMusic: true,
        instagramReels: true,
        about: true,
        equipment: true,
        contact: true,
        whatsappFloating: true,
        timecodeHud: true,
        cursorEffect: true
      },
      stats: [
        { label: "Tamamlanan Proje", value: "280+" },
        { label: "Sahne & Organizasyon", value: "150+" },
        { label: "Özel Albüm & Davetiye", value: "350+" },
        { label: "Sektör Tecrübesi", value: "7+ Yıl" }
      ],
      about: {
        title: "Kurguda Ritim, Sahnede Enerji, Tasarımda Zarafet",
        paragraphs: [
          "Merhaba, ben Doğanay Keskin. 24 yaşındayım ve Sakarya'da yaşıyorum. Video kurgu, klip yönetmenliği ve post-prodüksiyon dünyasında her kareye anlam katan bir vizyonla çalışıyorum.",
          "Aynı zamanda 'Keskinler Müzik Organizasyon'un kurucusu olarak düğün, konser ve davetlerde profesyonel canlı orkestra ve sahne kurulumlarını yönetiyorum.",
          "Görsel sanatların yanı sıra en özel günleriniz için kişiye özel lüks albüm tasarımı ve birinci sınıf davetiye baskı hizmeti sunuyorum."
        ],
        skills: ["Sinematik Video Kurgu", "Düğün Hikayesi & Klip", "Canlı Müzik & Sahne", "4K Drone Çekimi", "Lüks Albüm Tasarımı & Davetiye"],
        equipment: []
      },
      services: []
    };
  }
}

export function saveSiteContent(content: SiteContent): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8');
}

export function getPortfolioItems(): PortfolioItem[] {
  try {
    if (!fs.existsSync(PORTFOLIO_FILE)) {
      return [];
    }
    const data = fs.readFileSync(PORTFOLIO_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading portfolio items:', error);
    return [];
  }
}

export function savePortfolioItems(items: PortfolioItem[]): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(items, null, 2), 'utf-8');
}
