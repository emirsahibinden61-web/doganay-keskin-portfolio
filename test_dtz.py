import urllib.request
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}

code = 'DTz7sp6DbNw'
url = f'https://www.instagram.com/reel/{code}/'

req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, timeout=15) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

with open("dtz_page.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Saved dtz_page.html. Length:", len(html))

# Look for video tags or video_url or dash manifest
for keyword in ['video_url', 'browser_native_hd_url', 'browser_native_sd_url', 'video_versions', 'dash_manifest', 'MPD']:
    found = re.findall(rf'"{keyword}":"([^"]+)"', html)
    print(f"Keyword '{keyword}': found {len(found)}")
    if found:
        print("Sample:", found[0][:120])
