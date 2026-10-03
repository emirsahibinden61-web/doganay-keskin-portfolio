# 🎬 DOĞANAY KESKİN — WEB SİTESİ DEVİR & ANTIGRAVITY KULLANIM KILAVUZU

Merhaba Doğanay! Bu kılavuz, web siteni dilediğin zaman yönetebilmen, yapay zekaya (Antigravity) Türkçe talimat vererek siteni tek tıkla güncelleyebilmen ve canlı sunucunu yönetebilmen için özel olarak hazırlandı.

---

## 🌐 1. Canlı Yayın Bilgileri

- **Web Siten (Canlı & Güvenli SSL)**: [https://doganaykeskin.com](https://doganaykeskin.com)
- **Gizli Admin Panelin**: [https://doganaykeskin.com/dogiadmin61](https://doganaykeskin.com/dogiadmin61)
  - **Panel Güvenlik Şifresi**: `Dogi5461.`
  - **Özellikleri**: 500 MB'a kadar doğrudan 4K video yükleme, video silme, metin, kategori, telefon ve hashtag düzenleme.

---

## 🤖 2. Antigravity ile Siteni Nasıl Yönetirsin? (Sihirli Kısım)

Antigravity senin kişisel yapay zeka yazılımcındır. Bilgisayarında Antigravity açıkken ona **aynı bir insanla konuşur gibi Türkçe yazarak** sitenin her yerini değiştirebilir ve doğrudan canlı sunucuna yükletebilirsin.

### Kendi Bilgisayarında Başlatma (İlk Kurulum):
1. **Antigravity'yi Aç**.
2. Sol üstteki menüden **File -> Open Folder** (Klasör Aç) seçeneğine tıkla.
3. Bu proje klasörünü (`doganay-keskin-portfolio`) seç.
4. Bitti! Antigravity projeyi açtığı an bu kılavuzu, sunucu şifrelerini ve kod yapısını otomatik olarak tanır.

### Antigravity'ye Yazabileceğin Örnek Komutlar:
Antigravity'nin sohbet kutusuna aşağıdaki gibi istediğin şeyi yazman yeterlidir:

- *"Antigravity, ana sayfadaki '24 yaşındayım' yazısını '25 yaşındayım' yap ve canlı sunucuya yükle."*
- *"Antigravity, Instagram reels bölümüne yeni bir video kartı ekle ve canlıya at."*
- *"Antigravity, WhatsApp numaram değişti, yeni numaram +905XXXXXXXXX, sitenin her yerinde güncelle ve sunucuya gönder."*
- *"Antigravity, sunucuma bağlanıp her şey yolunda mı diye kontrol et."*
- *"Antigravity, yaptığım değişiklikleri canlı sunucuya deploy et."*

Antigravity senin yerine kodları değiştirecek, test edecek, GitHub'a gönderecek ve sunucuna SSH ile bağlanıp **saniyeler içinde canlıya alacaktır.**

---

## 🖥️ 3. Sunucu (VPS) ve Altyapı Bilgileri

Web siten paylaşımlı kısıtlı hostinglerde değil, tamamen sana ait bağımsız bir sanal sunucuda (KVM VPS) barınmaktadır.

- **Sunucu Sağlayıcısı**: RackNerd (New York Datacenter)
- **Sunucu IP Adresi**: `75.127.14.25`
- **Kullanıcı Adı (SSH)**: `root`
- **Sunucu Root Şifresi**: `RHEvWmHPa9Qr`
- **Proje Dizin Yolu**: `/var/www/doganaykeskin`
- **Çalışma Servisi**: Node.js 20 LTS + PM2 (`pm2 status`)
- **Web Sunucusu**: Nginx (Ters Vekil Sunucu + 500 MB Video Yükleme Limiti)
- **SSL Sertifikası**: Let's Encrypt (Otomatik yenilenen HTTPS yeşil kilit)

---

## 🌍 4. Domain & DNS Yönetimi (Wix)

- **Domain Sağlayıcın**: Wix
- **Alan Adın**: `doganaykeskin.com` & `www.doganaykeskin.com`
- **DNS Yapılandırması**:
  - `A Kaydı (@)` ➔ `75.127.14.25`
  - `CNAME (www)` ➔ `doganaykeskin.com`

---

## 💾 5. Otomatik Gece Yedeklemesi

Sunucun her gece **saat 03:00'te** sitedeki tüm videolarını, fotoğraflarını ve CMS verilerini otomatik olarak sıkıştırıp sunucu içindeki güvenli yedek alanına arşivler:
- **Yedek Dizini**: `/var/backups/portfolio/`
- Son 14 günün yedekleri güvenle saklanır, veri kaybı riski sıfırdır.

---

## 🚀 6. Tek Komutla Manuel Canlıya Alma (Deploy)

İstersen terminalden tek bir komut çalıştırarak da yaptığın tüm değişiklikleri anında canlıya alabilirsin:
```bash
python scripts/deploy_live.py "Yapılan değişiklik açıklaması"
```
Bu script otomatik olarak:
1. Değişiklikleri GitHub'a kaydeder.
2. Sunucuna bağlanır (`75.127.14.25`).
3. En güncel kodları çekip `npm run build` yapar ve PM2 servisini yeniden başlatır.

---

*Doğanay Keskin'e özel olarak hazırlanmıştır. Bol kazançlar ve harika projeler!* 🎬🔥
