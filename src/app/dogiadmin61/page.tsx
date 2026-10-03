'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { SiteContent, PortfolioItem, ConceptTheme, CategoryConfig } from '@/lib/types';
import { 
  Lock, KeyRound, Shield, Check, Trash2, Plus, Upload, 
  Video, Image as ImageIcon, Save, ArrowLeft, RefreshCw, 
  Sparkles, ExternalLink, Film, Palette, Zap, Crown, Eye, 
  Hash, ToggleLeft, ToggleRight, Sliders, Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import DkLogo from '@/components/common/DkLogo';

export default function DogiAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'portfolio' | 'categories' | 'hashtags' | 'reels' | 'visibility' | 'content' | 'theme' | 'optimization'>('portfolio');

  // Site Data State
  const [content, setContent] = useState<SiteContent | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string>('');

  // Portfolio Form State
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // New item inputs
  const [newTagInput, setNewTagInput] = useState('');
  const [newCategoryLabel, setNewCategoryLabel] = useState('');

  // New Reel inputs
  const [newReelCaption, setNewReelCaption] = useState('');
  const [newReelVideoUrl, setNewReelVideoUrl] = useState('');
  const [newReelPosterUrl, setNewReelPosterUrl] = useState('');
  const [newReelLikes, setNewReelLikes] = useState('1.5B');
  const [newReelViews, setNewReelViews] = useState('22.4B');
  const [newReelTrack, setNewReelTrack] = useState('Keskinler Müzik Orkestrası • Canlı Sahne');
  const [newReelUrl, setNewReelUrl] = useState('https://instagram.com/keskinlermuzik');
  const [isSyncingReels, setIsSyncingReels] = useState(false);

  // File upload refs
  const mediaFileInputRef = useRef<HTMLInputElement>(null);
  const posterFileInputRef = useRef<HTMLInputElement>(null);
  const reelVideoInputRef = useRef<HTMLInputElement>(null);
  const reelPosterInputRef = useRef<HTMLInputElement>(null);

  // Check existing session
  useEffect(() => {
    const authSession = sessionStorage.getItem('dogi_admin_logged_in');
    if (authSession === 'true') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('dogi_admin_logged_in', 'true');
        fetchData();
      } else {
        setAuthError(data.message || 'Hatalı şifre!');
      }
    } catch (err) {
      setAuthError('Giriş yapılırken bağlantı hatası oluştu.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('dogi_admin_logged_in');
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [contentRes, portfolioRes] = await Promise.all([
        fetch('/api/admin/content'),
        fetch('/api/admin/portfolio')
      ]);
      const contentData = await contentRes.json();
      const portfolioData = await portfolioRes.json();
      setContent(contentData);
      setPortfolio(portfolioData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Content Save
  const handleSaveContent = async () => {
    if (!content) return;
    setSaveStatus('Kaydediliyor...');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus('Başarıyla Kaydedildi!');
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus('Hata: Kaydedilemedi');
      }
    } catch (err) {
      setSaveStatus('Bağlantı hatası');
    }
  };

  // Upload handler
  const handleFileUpload = async (file: File, target: 'media' | 'poster') => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadProgress(60);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setUploadProgress(100);
        if (editingItem) {
          if (target === 'media') {
            setEditingItem({
              ...editingItem,
              mediaUrl: data.url,
              type: data.isVideo ? 'video' : 'image',
              posterUrl: data.isVideo ? (editingItem.posterUrl || '/images/dogi-cinematic.jpg') : data.url,
            });
          } else {
            setEditingItem({
              ...editingItem,
              posterUrl: data.url,
            });
          }
        }
      } else {
        alert(data.message || 'Yükleme başarısız!');
      }
    } catch (err) {
      alert('Dosya yüklenirken hata oluştu');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(null), 1000);
    }
  };

  // Portfolio Save Item
  const handleSavePortfolioItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });
      const data = await res.json();
      if (data.success) {
        setPortfolio(data.items);
        setIsModalOpen(false);
        setEditingItem(null);
        confetti({ particleCount: 50, spread: 60 });
      }
    } catch (err) {
      alert('Kayıt sırasında hata oluştu.');
    }
  };

  // Portfolio Delete Item
  const handleDeletePortfolioItem = async (id: string) => {
    if (!confirm('Bu çalışmayı silmek istediğinizden emin misiniz?')) return;

    try {
      const res = await fetch(`/api/admin/portfolio?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setPortfolio(data.items);
      }
    } catch (err) {
      alert('Silme sırasında hata oluştu.');
    }
  };

  const handleOpenNewItem = () => {
    setEditingItem({
      id: `work-${Date.now()}`,
      title: '',
      category: 'video-kurgu',
      type: 'video',
      mediaUrl: '',
      posterUrl: '',
      description: '',
      client: '',
      year: new Date().getFullYear().toString(),
      tags: ['Video Kurgu', 'Sony FX3'],
      featured: false,
      aspect: '16:9',
      duration: '01:00'
    });
    setIsModalOpen(true);
  };

  // Category Management Handlers
  const toggleCategoryEnabled = (catId: string) => {
    if (!content) return;
    const updated = content.categories.map((c) => 
      c.id === catId ? { ...c, enabled: !c.enabled } : c
    );
    setContent({ ...content, categories: updated });
  };

  const updateCategoryLabel = (catId: string, label: string) => {
    if (!content) return;
    const updated = content.categories.map((c) => 
      c.id === catId ? { ...c, label } : c
    );
    setContent({ ...content, categories: updated });
  };

  const handleAddCategory = () => {
    if (!newCategoryLabel.trim() || !content) return;
    const id = newCategoryLabel.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCat: CategoryConfig = {
      id,
      label: newCategoryLabel.trim(),
      enabled: true,
    };
    setContent({
      ...content,
      categories: [...content.categories, newCat]
    });
    setNewCategoryLabel('');
  };

  const handleDeleteCategory = (catId: string) => {
    if (!content) return;
    if (catId === 'all') {
      alert('Tüm Çalışmalar ana sekmesi silinemez, dilerseniz pasif yapabilirsiniz.');
      return;
    }
    setContent({
      ...content,
      categories: content.categories.filter((c) => c.id !== catId)
    });
  };

  // Hashtag Management Handlers
  const handleAddHashtag = () => {
    if (!newTagInput.trim() || !content) return;
    const clean = newTagInput.replace(/^#/, '').trim();
    if (!content.heroHashtags.includes(clean)) {
      setContent({
        ...content,
        heroHashtags: [...content.heroHashtags, clean]
      });
    }
    setNewTagInput('');
  };

  const handleRemoveHashtag = (tagToRemove: string) => {
    if (!content) return;
    setContent({
      ...content,
      heroHashtags: content.heroHashtags.filter(t => t !== tagToRemove)
    });
  };

  // Instagram Reels Management Handlers
  const handleAddReel = () => {
    if (!content || !newReelVideoUrl.trim()) {
      alert('Lütfen bir video linki yapıştırın veya bilgisayardan yükleyin.');
      return;
    }
    const newReel = {
      id: `reel-${Date.now()}`,
      reelUrl: newReelUrl || 'https://instagram.com/keskinlermuzik',
      videoUrl: newReelVideoUrl,
      posterUrl: newReelPosterUrl || '/images/dogi-cinematic.jpg',
      caption: newReelCaption || 'Keskinler Müzik Sahne Performansı ✨',
      likes: newReelLikes || '1.2B',
      views: newReelViews || '14.5B',
      musicTrack: newReelTrack || 'Keskinler Müzik Orkestrası',
      date: 'Yeni'
    };
    const currentReels = content.instagramReels || [];
    setContent({
      ...content,
      instagramReels: [newReel, ...currentReels]
    });
    setNewReelCaption('');
    setNewReelVideoUrl('');
    setNewReelPosterUrl('');
    alert('Reels albüme başarıyla eklendi! Sayfanın üstündeki "Tüm Değişiklikleri Kaydet" butonuna basarak kaydedebilirsiniz.');
  };

  const handleDeleteReel = (id: string, isPersonal: boolean = false) => {
    if (!content) return;
    if (!confirm('Bu Reels videosunu albümden kaldırmak istediğinize emin misiniz?')) return;
    if (isPersonal) {
      setContent({
        ...content,
        personalReels: (content.personalReels || []).filter(r => r.id !== id)
      });
    } else {
      setContent({
        ...content,
        instagramReels: (content.instagramReels || []).filter(r => r.id !== id)
      });
    }
  };

  const handleSyncInstagram = async () => {
    setIsSyncingReels(true);
    try {
      const res = await fetch('/api/admin/sync-instagram', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        if (content) {
          setContent({
            ...content,
            instagramReels: data.instagramReels || data.reels || content.instagramReels,
            personalReels: data.personalReels || content.personalReels,
          });
        }
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
        alert(data.message || 'Instagram Reels başarıyla senkronize edildi!');
      } else {
        alert(data.message || 'Senkronizasyon başarısız oldu.');
      }
    } catch (err) {
      alert('Instagram senkronize edilirken bir hata oluştu.');
    } finally {
      setIsSyncingReels(false);
    }
  };

  // Section Visibility Toggle
  const toggleVisibility = (key: keyof SiteContent['sectionVisibility']) => {
    if (!content) return;
    setContent({
      ...content,
      sectionVisibility: {
        ...content.sectionVisibility,
        [key]: !content.sectionVisibility[key]
      }
    });
  };

  // -------------------- LOGIN SCREEN --------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative w-full max-w-md p-8 rounded-3xl bg-zinc-950 border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="text-center space-y-3 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white font-mono">
              DOĞANAY KESKİN
            </h1>
            <p className="text-xs text-zinc-400">
              Gizli Yönetim Paneli & CMS Girişi (/dogiadmin61)
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-2">
                Panel Güvenlik Şifresi
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Şifrenizi girin..."
                  className="w-full px-4 py-3.5 pl-11 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
                <KeyRound className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] text-zinc-500 mt-1.5 font-mono">
                Şifre: <span className="text-amber-400/90 font-mono">Dogi5461.</span>
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Panele Güvenli Giriş Yap
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Websitesine Dön</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------- AUTHENTICATED DASHBOARD --------------------
  return (
    <div className="min-h-screen bg-[#08090b] text-zinc-200">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-zinc-950/85 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3.5 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <DkLogo size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base font-mono">
                  DOĞANAY KESKİN CMS
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-mono">
                  /dogiadmin61
                </span>
              </div>
              <span className="text-xs text-zinc-400">Tam Kapsamlı İçerik & Görünürlük Kontrolü</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-300 hover:text-white border border-white/10 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Canlı Siteyi Gör</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs transition-colors"
            >
              Çıkış
            </button>
          </div>

        </div>
      </header>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'portfolio'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Videolar & Galeriler ({portfolio.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'categories'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Kategoriler & Filtreler</span>
          </button>

          <button
            onClick={() => setActiveTab('hashtags')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'hashtags'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            <Hash className="w-4 h-4" />
            <span>Hero Hashtag&apos;leri</span>
          </button>

          <button
            onClick={() => setActiveTab('reels')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'reels'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>Instagram Reels ({(content?.instagramReels?.length || 0) + (content?.personalReels?.length || 0)})</span>
          </button>

          <button
            onClick={() => setActiveTab('visibility')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'visibility'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Bölüm Görünürlüğü (Göster/Gizle)</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'content'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Site Metinleri & İletişim</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'theme'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>3 Şablon (UI)</span>
          </button>

          <button
            onClick={() => setActiveTab('optimization')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'optimization'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Video Hız Rehberi</span>
          </button>
        </div>

        {/* Global Save Button on top right of all tabs */}
        <div className="flex items-center justify-end mb-6">
          <button
            onClick={handleSaveContent}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{saveStatus || 'Tüm Değişiklikleri Kaydet'}</span>
          </button>
        </div>

        {/* ==================== TAB 1: PORTFOLIO & VIDEOS ==================== */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Video & Tasarım Portföyü</h2>
                <p className="text-xs text-zinc-400">
                  Yeni video ekleyin, silin, 9:16 Reels veya 16:9 Sinematik format belirleyin.
                </p>
              </div>
              <button
                onClick={handleOpenNewItem}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Video / Çalışma Ekle</span>
              </button>
            </div>

            {/* Grid of existing works */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-zinc-950 border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-amber-500/40 transition-colors"
                >
                  <div className="relative aspect-video bg-black overflow-hidden">
                    <img
                      src={item.posterUrl || '/images/dogi-cinematic.jpg'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-black/80 text-amber-400 border border-amber-500/30">
                        {item.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-zinc-300">
                        {item.type}
                      </span>
                    </div>

                    {item.aspect === '9:16' && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-pink-500/80 text-white font-bold">
                        9:16 Reels
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-white font-bold text-sm leading-snug line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-zinc-400 text-xs line-clamp-2 mt-1">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono mt-2">
                        <span>{item.client || 'Özel Yapım'}</span>
                        <span>&bull;</span>
                        <span>{item.year || '2026'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsModalOpen(true);
                        }}
                        className="text-xs text-amber-400 hover:text-amber-300 font-medium"
                      >
                        Düzenle
                      </button>

                      <button
                        onClick={() => handleDeletePortfolioItem(item.id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 2: CATEGORIES MANAGEMENT (NEW) ==================== */}
        {activeTab === 'categories' && content && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h2 className="text-xl font-bold text-white">Galeri Kategorileri (Aktif / Pasif & Düzenleme)</h2>
              <p className="text-xs text-zinc-400">
                Websitesindeki filtreleme butonlarını aktif veya pasif yapabilir, isimlerini değiştirebilir veya yeni kategori ekleyebilirsiniz.
              </p>
            </div>

            {/* Existing Categories List */}
            <div className="space-y-3">
              {content.categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    cat.enabled
                      ? 'bg-zinc-950 border-white/10'
                      : 'bg-zinc-950/40 border-red-500/20 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleCategoryEnabled(cat.id)}
                      className={`p-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
                        cat.enabled
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                      }`}
                    >
                      {cat.enabled ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>AKTİF (GÖSTERİLİYOR)</span>
                        </>
                      ) : (
                        <span>PASİF (GİZLİ)</span>
                      )}
                    </button>

                    <input
                      type="text"
                      value={cat.label}
                      onChange={(e) => updateCategoryLabel(cat.id, e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                    />

                    <span className="text-[11px] font-mono text-zinc-500 shrink-0">
                      ID: {cat.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {cat.id !== 'all' && (
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Kategoriyi Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Category Box */}
            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/10 space-y-3">
              <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Yeni Kategori Ekle</span>
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryLabel}
                  onChange={(e) => setNewCategoryLabel(e.target.value)}
                  placeholder="Örn: Konser & Sahne Çekimleri"
                  className="flex-1 px-3.5 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm"
                />
                <button
                  onClick={handleAddCategory}
                  className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs"
                >
                  Kategori Ekle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: HERO HASHTAGS (NEW) ==================== */}
        {activeTab === 'hashtags' && content && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h2 className="text-xl font-bold text-white">Hero Başlık Altı Hashtag&apos;leri</h2>
              <p className="text-xs text-zinc-400">
                Ana sayfadaki Doğanay Keskin başlığının altındaki etiketleri ekleyip çıkarabilir veya bölümü tamamen gizleyebilirsiniz.
              </p>
            </div>

            {/* Toggle Hashtags section */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Hashtag Alanı Sitede Gözüksün mü?</h4>
                <p className="text-xs text-zinc-400">Kapalı olduğunda ana sayfada etiketler görünmez.</p>
              </div>
              <button
                onClick={() => toggleVisibility('heroHashtags')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  content.sectionVisibility.heroHashtags
                    ? 'bg-emerald-500 text-black'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {content.sectionVisibility.heroHashtags ? 'AÇIK (GÖSTER)' : 'KAPALI (GİZLE)'}
              </button>
            </div>

            {/* Current Hashtags Pills */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-4">
              <h4 className="text-xs font-mono uppercase text-amber-400 tracking-wider">
                Mevcut Etiketler
              </h4>

              <div className="flex flex-wrap gap-2.5">
                {content.heroHashtags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/15 text-xs text-white"
                  >
                    <span className="text-amber-400 font-mono">#{tag}</span>
                    <button
                      onClick={() => handleRemoveHashtag(tag)}
                      className="text-zinc-400 hover:text-red-400"
                      title="Sil"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Tag */}
              <div className="pt-4 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="Yeni etiket yazın (Örn: Sakarya Video Editörü)..."
                  className="flex-1 px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs"
                />
                <button
                  onClick={handleAddHashtag}
                  className="px-4 py-2.5 rounded-lg bg-amber-500 text-black font-bold text-xs"
                >
                  Etiket Ekle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: INSTAGRAM REELS ==================== */}
        {activeTab === 'reels' && content && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                  <span>Instagram Reels Albümleri (Doğanay & Keskinler Müzik)</span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Websitenizde ana sayfada üst üste gösterilen kişisel ve organizasyon Reels albümlerini yönetin.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleSyncInstagram}
                  disabled={isSyncingReels}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:brightness-110 text-white shadow-lg shadow-pink-500/20 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                  title="Hem @doganaykesking hem de @keskinlermuzik hesaplarındaki en güncel Reels videolarını ve kapaklarını çeker"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingReels ? 'animate-spin' : ''}`} />
                  <span>{isSyncingReels ? 'Reels Çekiliyor...' : 'Tüm Reels\'leri Canlı Çek'}</span>
                </button>

                <button
                  onClick={() => toggleVisibility('personalReels')}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    content.sectionVisibility.personalReels !== false
                      ? 'bg-cyan-500 text-black'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {content.sectionVisibility.personalReels !== false ? 'KİŞİSEL: AÇIK' : 'KİŞİSEL: GİZLİ'}
                </button>

                <button
                  onClick={() => toggleVisibility('instagramReels')}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    content.sectionVisibility.instagramReels
                      ? 'bg-emerald-500 text-black'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {content.sectionVisibility.instagramReels ? 'KESKİNLER: AÇIK' : 'KESKİNLER: GİZLİ'}
                </button>
              </div>
            </div>

            {/* Add New Reel Card */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-4">
              <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Plus className="w-4 h-4 text-pink-400" />
                <span>Yeni Instagram Reels Ekle</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Reels Instagram Linki</label>
                  <input
                    type="text"
                    value={newReelUrl}
                    onChange={(e) => setNewReelUrl(e.target.value)}
                    placeholder="https://instagram.com/keskinlermuzik/reel/..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Video Dosyası / Video URL</label>
                  <input
                    type="text"
                    value={newReelVideoUrl}
                    onChange={(e) => setNewReelVideoUrl(e.target.value)}
                    placeholder="/uploads/... veya https://..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Kapak Görseli (Poster)</label>
                  <input
                    type="text"
                    value={newReelPosterUrl}
                    onChange={(e) => setNewReelPosterUrl(e.target.value)}
                    placeholder="/images/dogi-cinematic.jpg veya https://..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Açıklama / Metin</label>
                  <textarea
                    rows={2}
                    value={newReelCaption}
                    onChange={(e) => setNewReelCaption(e.target.value)}
                    placeholder="Düğün sahnesi orkestra performansı..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Müzik / Ses Adı</label>
                  <input
                    type="text"
                    value={newReelTrack}
                    onChange={(e) => setNewReelTrack(e.target.value)}
                    placeholder="Keskinler Müzik Orkestrası • Canlı Sahne"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Beğeni</label>
                    <input
                      type="text"
                      value={newReelLikes}
                      onChange={(e) => setNewReelLikes(e.target.value)}
                      placeholder="1.8B"
                      className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">İzlenme</label>
                    <input
                      type="text"
                      value={newReelViews}
                      onChange={(e) => setNewReelViews(e.target.value)}
                      placeholder="25.4B"
                      className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAddReel}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-bold text-xs shadow-lg hover:brightness-110 transition-all"
                >
                  Reels Albüme Ekle
                </button>
              </div>
            </div>

            {/* 1. Doğanay Keskin Kişisel Reels */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <span>🚗 Doğanay Keskin Kişisel Reels (@doganaykesking - Araba &amp; Viral)</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                    {content.personalReels?.length || 0} Video
                  </span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {content.personalReels?.map((reel) => (
                  <div
                    key={reel.id}
                    className="p-4 rounded-2xl bg-zinc-950 border border-white/10 flex gap-4 items-start justify-between group hover:border-cyan-500/40 transition-colors"
                  >
                    <div className="w-20 aspect-[9/16] rounded-xl overflow-hidden bg-black shrink-0 relative border border-white/10">
                      <img
                        src={reel.posterUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-xs text-white font-medium line-clamp-2">
                        {reel.caption}
                      </p>
                      <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-2">
                        <span>❤️ {reel.likes}</span>
                        <span>👁️ {reel.views || '10B'}</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate font-mono">
                        {reel.musicTrack}
                      </div>
                      <a
                        href={reel.reelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white"
                      >
                        <span>Instagram Linki</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>

                    <button
                      onClick={() => handleDeleteReel(reel.id, true)}
                      className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Keskinler Müzik Canlı Sahne Reels */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-mono text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <span>🎶 Keskinler Müzik Sahne Reels (@keskinlermuzik - Sahne &amp; Düğün)</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                    {content.instagramReels?.length || 0} Video
                  </span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {content.instagramReels?.map((reel) => (
                  <div
                    key={reel.id}
                    className="p-4 rounded-2xl bg-zinc-950 border border-white/10 flex gap-4 items-start justify-between group hover:border-pink-500/40 transition-colors"
                  >
                    <div className="w-20 aspect-[9/16] rounded-xl overflow-hidden bg-black shrink-0 relative border border-white/10">
                      <img
                        src={reel.posterUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-xs text-white font-medium line-clamp-2">
                        {reel.caption}
                      </p>
                      <div className="text-[11px] font-mono text-pink-400 flex items-center gap-2">
                        <span>❤️ {reel.likes}</span>
                        <span>👁️ {reel.views || '10B'}</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate font-mono">
                        {reel.musicTrack}
                      </div>
                      <a
                        href={reel.reelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white"
                      >
                        <span>Instagram Linki</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>

                    <button
                      onClick={() => handleDeleteReel(reel.id, false)}
                      className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 4: SECTION VISIBILITY (GÖSTER / GİZLE) ==================== */}
        {activeTab === 'visibility' && content && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h2 className="text-xl font-bold text-white">Site Bölümleri Görünürlük Kontrolü (Göster / Gizle)</h2>
              <p className="text-xs text-zinc-400">
                Websitenizdeki her bir bölümü tek tıkla açıp kapatabilirsiniz.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {[
                { key: 'heroHashtags', label: 'Hero Başlık Altı Hashtagleri (#Video Kurgu vb.)', desc: 'Ana manşetin altındaki etiket kutuları' },
                { key: 'stats', label: 'Canlı İstatistik Sayaçları (280+ Proje vb.)', desc: 'Hero bölümü altındaki rakamsal başarı barları' },
                { key: 'portfolio', label: 'Portföy & Video Galerisi Bölümü', desc: 'Tüm video ve tasarım çalışmalarının sergilendiği ana galeri' },
                { key: 'services', label: 'Uzmanlık Alanları & Hizmet Kartları', desc: 'Video Kurgu, Düğün, Albüm, Drone vb. 6 hizmet alanı' },
                { key: 'keskinlerMusic', label: 'Keskinler Müzik Organizasyon Özel Bölümü', desc: 'Canlı müzik orkestrası ve sahne sistemleri alanı' },
                { key: 'personalReels', label: 'Doğanay Keskin Kişisel Reels (@doganaykesking)', desc: 'Araba, drift, VFX ve After Effects viral video kurguları akışı' },
                { key: 'instagramReels', label: 'Keskinler Müzik Canlı Reels Albümü (@keskinlermuzik)', desc: 'Instagram Reels dikey video akışı ve mobil albüm oynatıcısı' },
                { key: 'about', label: 'Hakkımda & Doğanay Keskin Hikayesi', desc: 'Fotoğraf, biyografi ve teknik detaylar' },
                { key: 'equipment', label: 'Teknik Ekipman & Yazılım Parkı Listesi', desc: 'Sony FX3, DaVinci Resolve, DJI Drone vb. ekipmanlar' },
                { key: 'contact', label: 'İletişim & Hızlı Randevu / Teklif Formu', desc: 'WhatsApp mesaj hazırlama ve sosyal medya kartları' },
                { key: 'whatsappFloating', label: 'Sağ Altta Yüzen WhatsApp Butonu & Baloncuğu', desc: 'Hızlı WhatsApp doğrudan iletişim butonu' },
                { key: 'timecodeHud', label: 'Sol Altta Video REC Timecode Göstergesi', desc: 'Kaydırma senkronizasyonlu sayaç' },
                { key: 'cursorEffect', label: 'Parlak İnteraktif Özel İmleç Işığı', desc: 'Farenin arkasından gelen sinematik ışık' },
              ].map((item) => {
                const isVisible = content.sectionVisibility[item.key as keyof SiteContent['sectionVisibility']];
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleVisibility(item.key as any)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                      isVisible
                        ? 'bg-zinc-950 border-white/15 hover:border-emerald-500/40'
                        : 'bg-zinc-950/40 border-red-500/20 opacity-60'
                    }`}
                  >
                    <div>
                      <h4 className="text-white text-xs font-bold font-sans">{item.label}</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{item.desc}</p>
                    </div>

                    <div className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold shrink-0 ${
                      isVisible
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {isVisible ? 'AÇIK' : 'KAPALI'}
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        )}

        {/* ==================== TAB 5: SITE CONTENT CMS ==================== */}
        {activeTab === 'content' && content && (
          <div className="space-y-8 max-w-4xl">
            <div>
              <h2 className="text-xl font-bold text-white">Web Sitesi Metinleri & İletişim</h2>
              <p className="text-xs text-zinc-400">
                Sitedeki tüm başlıklar, bio, WhatsApp numarası ve sosyal medya linklerini tek yerden güncelleyin.
              </p>
            </div>

            {/* Profile Info Section */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold font-mono text-amber-400 uppercase tracking-wider">
                Profil & Kimlik Bilgileri
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Ad Soyad</label>
                  <input
                    type="text"
                    value={content.profile.name}
                    onChange={(e) => setContent({
                      ...content,
                      profile: { ...content.profile, name: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Kısa İsim / Takma Ad</label>
                  <input
                    type="text"
                    value={content.profile.shortName}
                    onChange={(e) => setContent({
                      ...content,
                      profile: { ...content.profile, shortName: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Yaş</label>
                  <input
                    type="text"
                    value={content.profile.age}
                    onChange={(e) => setContent({
                      ...content,
                      profile: { ...content.profile, age: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Şehir / Lokasyon</label>
                  <input
                    type="text"
                    value={content.profile.location}
                    onChange={(e) => setContent({
                      ...content,
                      profile: { ...content.profile, location: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Marka & Organizasyon Adı</label>
                  <input
                    type="text"
                    value={content.profile.brandName}
                    onChange={(e) => setContent({
                      ...content,
                      profile: { ...content.profile, brandName: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Ana Başlık (Hero Title)</label>
                  <input
                    type="text"
                    value={content.profile.heroTitle}
                    onChange={(e) => setContent({
                      ...content,
                      profile: { ...content.profile, heroTitle: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Alt Açıklama (Hero Subtitle)</label>
                  <textarea
                    rows={2}
                    value={content.profile.heroSubtitle}
                    onChange={(e) => setContent({
                      ...content,
                      profile: { ...content.profile, heroSubtitle: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Contacts & Socials Section */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold font-mono text-emerald-400 uppercase tracking-wider">
                WhatsApp & Sosyal Medya İletişim
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">WhatsApp Telefon Numarası</label>
                  <input
                    type="text"
                    value={content.contacts.whatsapp}
                    onChange={(e) => setContent({
                      ...content,
                      contacts: { ...content.contacts, whatsapp: e.target.value, phone: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">WhatsApp Otomatik İlk Mesaj</label>
                  <input
                    type="text"
                    value={content.contacts.whatsappMessage}
                    onChange={(e) => setContent({
                      ...content,
                      contacts: { ...content.contacts, whatsappMessage: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Kişisel Instagram Kullanıcı Adı</label>
                  <input
                    type="text"
                    value={content.contacts.instagramPersonal}
                    onChange={(e) => setContent({
                      ...content,
                      contacts: {
                        ...content.contacts,
                        instagramPersonal: e.target.value,
                        instagramPersonalUrl: `https://instagram.com/${e.target.value.replace('@', '')}`
                      }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">İşletme Instagram Kullanıcı Adı (Keskinler Müzik)</label>
                  <input
                    type="text"
                    value={content.contacts.instagramBusiness}
                    onChange={(e) => setContent({
                      ...content,
                      contacts: {
                        ...content.contacts,
                        instagramBusiness: e.target.value,
                        instagramBusinessUrl: `https://instagram.com/${e.target.value.replace('@', '')}`
                      }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Live Stats */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold font-mono text-amber-400 uppercase tracking-wider">
                Ana Sayfa İstatistikleri
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {content.stats.map((st, sIdx) => (
                  <div key={sIdx} className="space-y-1">
                    <label className="block text-[11px] text-zinc-400">{st.label}</label>
                    <input
                      type="text"
                      value={st.value}
                      onChange={(e) => {
                        const newStats = [...content.stats];
                        newStats[sIdx].value = e.target.value;
                        setContent({ ...content, stats: newStats });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white font-mono font-bold text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 6: 3 UI CONCEPTS ==================== */}
        {activeTab === 'theme' && content && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h2 className="text-xl font-bold text-white">3 Farklı Tasarım Şablonu (UI Konseptleri)</h2>
              <p className="text-xs text-zinc-400">
                Sitenize gelen ziyaretçilerin ilk göreceği varsayılan konsepti seçebilirsiniz.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Concept 1 */}
              <div
                onClick={() => {
                  setContent({
                    ...content,
                    profile: { ...content.profile, defaultTheme: 'cinematic' }
                  });
                }}
                className={`p-6 rounded-3xl border cursor-pointer transition-all duration-300 relative ${
                  content.profile.defaultTheme === 'cinematic'
                    ? 'border-amber-400 bg-amber-950/20 shadow-[0_0_30px_rgba(245,158,11,0.2)]'
                    : 'border-white/10 bg-zinc-950/60 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                    <Film className="w-6 h-6" />
                  </div>
                  {content.profile.defaultTheme === 'cinematic' && (
                    <span className="text-[10px] font-mono bg-amber-400 text-black px-2 py-0.5 rounded-full font-bold">
                      AKTİF VARSAYILAN
                    </span>
                  )}
                </div>
                <h3 className="text-white font-bold text-base mb-1">1. Sinematik Kurgu (Director Onyx)</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Film stüdyosu atmosferi, derin siyahlar, altın kehribar vurgular, timecode sayacı ve sinematik vizyon.
                </p>
              </div>

              {/* Concept 2 */}
              <div
                onClick={() => {
                  setContent({
                    ...content,
                    profile: { ...content.profile, defaultTheme: 'cyber' }
                  });
                }}
                className={`p-6 rounded-3xl border cursor-pointer transition-all duration-300 relative ${
                  content.profile.defaultTheme === 'cyber'
                    ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_30px_rgba(6,182,212,0.2)]'
                    : 'border-white/10 bg-zinc-950/60 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400">
                    <Zap className="w-6 h-6" />
                  </div>
                  {content.profile.defaultTheme === 'cyber' && (
                    <span className="text-[10px] font-mono bg-cyan-400 text-black px-2 py-0.5 rounded-full font-bold">
                      AKTİF VARSAYILAN
                    </span>
                  )}
                </div>
                <h3 className="text-white font-bold text-base mb-1">2. Cyber Studio (Neon Vanguard)</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Neon cam efektleri, elektrik cyan & mor ışıklar, yüksek tempolu video editör ve modern klip enerjisi.
                </p>
              </div>

              {/* Concept 3 */}
              <div
                onClick={() => {
                  setContent({
                    ...content,
                    profile: { ...content.profile, defaultTheme: 'luxe' }
                  });
                }}
                className={`p-6 rounded-3xl border cursor-pointer transition-all duration-300 relative ${
                  content.profile.defaultTheme === 'luxe'
                    ? 'border-amber-200 bg-amber-950/30 shadow-[0_0_30px_rgba(230,202,151,0.2)]'
                    : 'border-white/10 bg-zinc-950/60 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-amber-200/20 text-amber-200">
                    <Crown className="w-6 h-6" />
                  </div>
                  {content.profile.defaultTheme === 'luxe' && (
                    <span className="text-[10px] font-mono bg-amber-200 text-black px-2 py-0.5 rounded-full font-bold">
                      AKTİF VARSAYILAN
                    </span>
                  )}
                </div>
                <h3 className="text-white font-bold text-base mb-1">3. Lüks Davetiye & Düğün (Editorial Luxe)</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Şampanya sarısı ve kadife zarafeti, lüks düğün organizasyonları, kristal albümler ve el yapımı davetiye matbaası için kusursuz.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* ==================== TAB 7: VIDEO OPTIMIZATION GUIDE ==================== */}
        {activeTab === 'optimization' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h2 className="text-xl font-bold text-white">Video Kalite & Sıkıştırma Optimizasyon Kılavuzu</h2>
              <p className="text-xs text-zinc-400">
                Videoların sıfır donma, hızlı başlama ve yüksek görüntü kalitesiyle çalışmasını sağlayan teknik rehber.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm font-mono">
                  <Check className="w-5 h-5" />
                  <span>Sistemdeki Otomatik Hızlandırma Özellikleri</span>
                </div>
                <ul className="text-xs text-zinc-300 space-y-2">
                  <li>&bull; <strong className="text-white">Preload Metadata:</strong> Videolar tüm dosyayı önceden indirip tarayıcıyı kitlemez, sadece başlık ve süre bilgisini okur.</li>
                  <li>&bull; <strong className="text-white">Hover Preview:</strong> Fare kartın üzerine gelene kadar video oynamaz, CPU ve internet tüketimi sıfırdır.</li>
                  <li>&bull; <strong className="text-white">Eşit Kart Oranı:</strong> 9:16 dikey reels videoları sinematik bulanık arka planla ortalanarak diğer 16:9 kartlarla aynı hizada durur, altı boş kalmaz!</li>
                  <li>&bull; <strong className="text-white">Mobil Pil & Veri Dostu:</strong> Mobilde videolar sadece tıklandığında oynar, otomatik hücresel veri tüketmez.</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm font-mono">
                  <Film className="w-5 h-5" />
                  <span>DaVinci & Premiere İhracat (Render) Ayarları</span>
                </div>
                <ul className="text-xs text-zinc-300 space-y-2">
                  <li>&bull; <strong className="text-white">Format:</strong> MP4 (H.264 / H.265)</li>
                  <li>&bull; <strong className="text-white">Bitrate (1080p):</strong> 6.000 - 8.000 Kbps (CBR / VBR 2-Pass)</li>
                  <li>&bull; <strong className="text-white">Bitrate (4K):</strong> 15.000 - 20.000 Kbps</li>
                  <li>&bull; <strong className="text-white">Fast Start (Web Optimized):</strong> Açık olmalıdır (Moov atom başa taşınır, beklemeden anında başlar).</li>
                  <li>&bull; <strong className="text-white">Ses:</strong> AAC 320 Kbps 48kHz Stereo</li>
                </ul>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ==================== PORTFOLIO ITEM MODAL ==================== */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">
                {editingItem.id ? 'Çalışmayı Düzenle' : 'Yeni Video / Görsel Ekle'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePortfolioItem} className="space-y-4">
              
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Başlık</label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Örn: Sinematik Düğün Hikayesi"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Kategori</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs"
                  >
                    {content?.categories.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Medya Türü</label>
                  <select
                    value={editingItem.type}
                    onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs"
                  >
                    <option value="video">Video (MP4 / WebM)</option>
                    <option value="image">Görsel / Fotoğraf</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Format / Ekran Oranı</label>
                  <select
                    value={editingItem.aspect || '16:9'}
                    onChange={(e) => setEditingItem({ ...editingItem, aspect: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs"
                  >
                    <option value="16:9">16:9 Sinematik Yatay</option>
                    <option value="9:16">9:16 Reels / Dikey</option>
                    <option value="1:1">1:1 Kare / Albüm</option>
                  </select>
                </div>
              </div>

              {/* Media URL & Direct File Upload */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 space-y-3">
                <label className="block text-xs font-mono text-zinc-300">
                  {editingItem.type === 'video' ? 'Video Dosyası / Bağlantısı' : 'Görsel Dosyası / Bağlantısı'}
                </label>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={editingItem.mediaUrl}
                    onChange={(e) => setEditingItem({ ...editingItem, mediaUrl: e.target.value })}
                    placeholder="https://... veya dosya yükleyin"
                    className="flex-1 px-3.5 py-2.5 rounded-lg bg-black border border-white/10 text-white text-xs font-mono"
                  />
                  
                  <input
                    ref={mediaFileInputRef}
                    type="file"
                    accept={editingItem.type === 'video' ? 'video/mp4,video/webm,video/*' : 'image/*'}
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0], 'media');
                    }}
                    className="hidden"
                  />
                  
                  <button
                    type="button"
                    onClick={() => mediaFileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Bilgisayardan Yükle</span>
                  </button>
                </div>

                {uploadProgress !== null && (
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Poster / Thumbnail URL */}
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Kapak / Poster Görseli (URL veya Dosya)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingItem.posterUrl}
                    onChange={(e) => setEditingItem({ ...editingItem, posterUrl: e.target.value })}
                    placeholder="/images/... veya https://..."
                    className="flex-1 px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs font-mono"
                  />
                  <input
                    ref={posterFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0], 'poster');
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => posterFileInputRef.current?.click()}
                    className="px-3 py-2 rounded-lg bg-white/10 text-white text-xs font-semibold"
                  >
                    Kapak Yükle
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Müşteri / Proje Sahibi</label>
                  <input
                    type="text"
                    value={editingItem.client}
                    onChange={(e) => setEditingItem({ ...editingItem, client: e.target.value })}
                    placeholder="Örn: Seda & Mert Çifti"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Süre (Video ise)</label>
                  <input
                    type="text"
                    value={editingItem.duration || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, duration: e.target.value })}
                    placeholder="Örn: 02:45"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Açıklama</label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Projenin detayları..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Etiketler (Virgülle ayırın)</label>
                <input
                  type="text"
                  value={editingItem.tags.join(', ')}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="Color Grading, Sony FX3, 4K Drone"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white text-xs"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md"
                >
                  Kaydet ve Yayınla
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
