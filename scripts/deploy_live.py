#!/usr/bin/env python3
"""
Doğanay Keskin — Tek Komutla Canlı Sunucuya Yayınlama Aracı (Deploy Tool)
Bu scripti çalıştırdığınızda (veya Antigravity'ye "canlıya al" dediğinizde):
1. Yerel değişiklikleri GitHub'a yükler.
2. Canlı sunucuya (75.127.14.25) bağlanıp kodları çeker.
3. Next.js'i derleyip PM2 servisini yeniden başlatır.
"""

import subprocess
import sys
import time

if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

try:
    import paramiko
except ImportError:
    print("[BİLGİ] Paramiko kütüphanesi kuruluyor...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "paramiko"])
    import paramiko

# Sunucu Bilgileri
SERVER_IP = "75.127.14.25"
SERVER_USER = "root"
SERVER_PASS = "RHEvWmHPa9Qr"
APP_DIR = "/var/www/doganaykeskin"

def run_local(cmd):
    print(f"[YEREL] {cmd}")
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if res.stdout:
        print(res.stdout.strip())
    if res.returncode != 0 and res.stderr:
        print(f"[UYARI] {res.stderr.strip()}")
    return res.returncode

def main():
    print("=" * 60)
    print(" DOĞANAY KESKİN — CANLI SUNUCU YAYINLAMA ARACI (DEPLOY)")
    print("=" * 60)

    # 1. Git Push
    print("\n1. Kodlar GitHub'a gönderiliyor...")
    commit_msg = sys.argv[1] if len(sys.argv) > 1 else f"Guncelleme: {time.strftime('%Y-%m-%d %H:%M:%S')}"
    run_local("git add .")
    run_local(f'git commit -m "{commit_msg}"')
    push_code = run_local("git push origin main")
    if push_code != 0:
        print("[UYARI] GitHub push sırasında uyarı oluştu, sunucu güncellemesine devam ediliyor...")

    # 2. SSH ile Sunucuya Bağlan
    print(f"\n2. Canlı Sunucuya Bağlanılıyor ({SERVER_IP})...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(SERVER_IP, username=SERVER_USER, password=SERVER_PASS, timeout=30)
        print("✓ Sunucuya başarıyla bağlanıldı!")
    except Exception as e:
        print(f"[HATA] Sunucuya bağlanılamadı: {e}")
        sys.exit(1)

    # 3. Sunucuda Git Pull, Build ve PM2 Reload
    print("\n3. Sunucuda kodlar çekiliyor, derleniyor ve servis yeniden başlatılıyor...")
    remote_cmd = f"cd {APP_DIR} && git reset --hard && git pull origin main && npm run build && pm2 reload doganay-portfolio"
    
    stdin, stdout, stderr = client.exec_command(remote_cmd, get_pty=True)
    while not stdout.channel.exit_status_ready():
        if stdout.channel.recv_ready():
            chunk = stdout.channel.recv(1024).decode('utf-8', errors='replace')
            sys.stdout.write(chunk)
            sys.stdout.flush()
        time.sleep(0.1)

    rest = stdout.read().decode('utf-8', errors='replace')
    sys.stdout.write(rest)
    sys.stdout.flush()

    status_code = stdout.channel.recv_exit_status()
    client.close()

    if status_code == 0:
        print("\n" + "=" * 60)
        print(" 🎉 TEBRİKLER! GÜNCELLEMELER CANLIYA ALINDI!")
        print(" Site: https://doganaykeskin.com")
        print(" Admin: https://doganaykeskin.com/dogiadmin61")
        print("=" * 60)
    else:
        print(f"\n[HATA] Derleme sırasında hata oluştu (Kod: {status_code})")

if __name__ == "__main__":
    main()
