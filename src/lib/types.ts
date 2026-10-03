export type ConceptTheme = 'cinematic' | 'cyber' | 'luxe';

export interface ProfileData {
  name: string;
  shortName: string;
  tagline: string;
  age: string;
  location: string;
  brandName: string;
  heroTitle: string;
  heroSubtitle: string;
  avatar: string;
  heroImage: string;
  originalImage: string;
  defaultTheme: ConceptTheme;
}

export interface ContactsData {
  phone: string;
  whatsapp: string;
  whatsappMessage: string;
  instagramPersonal: string;
  instagramPersonalUrl: string;
  instagramBusiness: string;
  instagramBusinessUrl: string;
  email: string;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface EquipmentGroup {
  category: string;
  items: string[];
}

export interface AboutData {
  title: string;
  paragraphs: string[];
  skills: string[];
  equipment: EquipmentGroup[];
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  icon: string;
  features: string[];
}

export interface CategoryConfig {
  id: string;
  label: string;
  enabled: boolean;
}

export interface InstagramReel {
  id: string;
  reelUrl: string;
  videoUrl: string;
  posterUrl: string;
  caption: string;
  likes: string;
  views?: string;
  musicTrack?: string;
  date?: string;
}

export interface SectionVisibility {
  heroHashtags: boolean;
  stats: boolean;
  portfolio: boolean;
  services: boolean;
  keskinlerMusic: boolean;
  personalReels?: boolean;
  instagramReels: boolean;
  about: boolean;
  equipment: boolean;
  contact: boolean;
  whatsappFloating: boolean;
  timecodeHud: boolean;
  cursorEffect: boolean;
}

export interface SiteContent {
  profile: ProfileData;
  contacts: ContactsData;
  stats: StatItem[];
  about: AboutData;
  services: ServiceItem[];
  heroHashtags: string[];
  categories: CategoryConfig[];
  personalReels?: InstagramReel[];
  instagramReels?: InstagramReel[];
  sectionVisibility: SectionVisibility;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  type: 'video' | 'image';
  mediaUrl: string;
  posterUrl: string;
  description: string;
  client: string;
  year: string;
  tags: string[];
  featured?: boolean;
  aspect?: '16:9' | '9:16' | '1:1';
  duration?: string;
}
