import urllib.request
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
}

code = 'DMQ_fnwNUEB'
url = f'https://www.instagram.com/reel/{code}/'

req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, timeout=15) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

matches = re.findall(r'https:[^\"\'<>\s]+?(?:fbcdn\.net|cdninstagram\.com)[^\"\'<>\s]+', html)
clean_urls = list(set([m.replace('\\/', '/').replace('&amp;', '&').replace('\\u0026', '&') for m in matches]))

print(f"Total CDN URLs for {code}: {len(clean_urls)}")
mp4_urls = [u for u in clean_urls if '.mp4' in u]
print(f"Total MP4 URLs: {len(mp4_urls)}")
for idx, u in enumerate(mp4_urls):
    print(f"[{idx}] {u[:140]}")
    # Check what kind of stream this is
    if 'audio' in u:
        print("   -> AUDIO STREAM!")
    if 'dash_vp9' in u or 'baseline' in u or 'xpv' in u:
        print("   -> VIDEO STREAM / PROGRESSIVE!")
