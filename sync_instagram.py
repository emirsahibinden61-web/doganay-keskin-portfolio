import urllib.request
import re
import json
import os
import time

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
}

video_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Referer': 'https://www.instagram.com/',
}

def sync_account(username: str, is_reels_tab: bool = False, subfolder: str = ""):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    img_dir = os.path.join(base_dir, "public", "images", "reels", subfolder) if subfolder else os.path.join(base_dir, "public", "images", "reels")
    vid_dir = os.path.join(base_dir, "public", "uploads", "reels", subfolder) if subfolder else os.path.join(base_dir, "public", "uploads", "reels")

    os.makedirs(img_dir, exist_ok=True)
    os.makedirs(vid_dir, exist_ok=True)

    url = f"https://www.instagram.com/{username}/reels/" if is_reels_tab else f"https://www.instagram.com/{username}/"
    print(f"Fetching {url}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return []

    scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
    media_nodes = []
    
    for s in scripts:
        if "XIGPolaris" in s or "XIGPolarisVideoMedia" in s or "XIGPolarisClipsMedia" in s:
            try:
                data = json.loads(s)
                def find_nodes(obj):
                    if isinstance(obj, dict):
                        if "__typename" in obj and "code" in obj:
                            media_nodes.append(obj)
                        for v in obj.values():
                            find_nodes(v)
                    elif isinstance(obj, list):
                        for item in obj:
                            find_nodes(item)
                find_nodes(data)
                if media_nodes:
                    break
            except Exception:
                continue

    print(f"Extracted {len(media_nodes)} nodes for @{username}")
    video_nodes = [n for n in media_nodes if "Video" in n.get("__typename", "") or "Clip" in n.get("__typename", "")]
    if not video_nodes:
        video_nodes = media_nodes[:12]

    results = []
    for idx, node in enumerate(video_nodes[:12]):
        code = node.get("code")
        if not code:
            continue

        raw_caption = ""
        caption_obj = node.get("caption")
        if isinstance(caption_obj, dict):
            raw_caption = caption_obj.get("text", "")
        elif isinstance(caption_obj, str):
            raw_caption = caption_obj
        if not raw_caption:
            a11y = node.get("accessibility_caption") or ""
            raw_caption = a11y or f"{username} Reels Paylaşımı"

        display_uri = node.get("display_uri")
        poster_local_path = os.path.join(img_dir, f"{code}.jpg")
        poster_url = f"/images/reels/{subfolder}/{code}.jpg" if subfolder else f"/images/reels/{code}.jpg"

        if display_uri and (not os.path.exists(poster_local_path) or os.path.getsize(poster_local_path) == 0):
            try:
                img_req = urllib.request.Request(display_uri, headers=video_headers)
                with urllib.request.urlopen(img_req, timeout=10) as ires:
                    with open(poster_local_path, "wb") as f:
                        f.write(ires.read())
            except Exception as e:
                print(f"Error downloading poster for {code}: {e}")

        video_local_path = os.path.join(vid_dir, f"{code}.mp4")
        video_url = f"/uploads/reels/{subfolder}/{code}.mp4" if subfolder else f"/uploads/reels/{code}.mp4"

        if not os.path.exists(video_local_path) or os.path.getsize(video_local_path) < 100000:
            reel_page_url = f"https://www.instagram.com/reel/{code}/"
            try:
                r_req = urllib.request.Request(reel_page_url, headers=headers)
                with urllib.request.urlopen(r_req, timeout=15) as r_resp:
                    r_html = r_resp.read().decode('utf-8', errors='ignore')
                
                matches = re.findall(r'https:[^\"\'<>\s]+?(?:fbcdn\.net|cdninstagram\.com)[^\"\'<>\s]+', r_html)
                clean_urls = [m.replace('\\/', '/').replace('&amp;', '&').replace('\\u0026', '&') for m in matches]
                prog_vids = [u for u in clean_urls if '.mp4' in u and ('xpv_progressive' in u or 'baseline' in u or '/m86/' in u)]
                if not prog_vids:
                    prog_vids = [u for u in clean_urls if '.mp4' in u and 'audio' not in u]

                if prog_vids:
                    v_url = prog_vids[0].split('</')[0].split('\\u003C')[0]
                    v_req = urllib.request.Request(v_url, headers=video_headers)
                    with urllib.request.urlopen(v_req, timeout=30) as v_res:
                        data = v_res.read()
                        # Only keep if > 1MB (real video), otherwise it's just DASH audio
                        if len(data) >= 1000000:
                            with open(video_local_path, "wb") as f:
                                f.write(data)
                            print(f"Downloaded real video for {code} ({len(data)} bytes)")
                        else:
                            print(f"Skipping {code}: stream was audio-only or under 1MB ({len(data)} bytes)")
            except Exception as e:
                print(f"Error fetching video for {code}: {e}")

        # If a file exists but is under 1MB, delete it
        if os.path.exists(video_local_path) and os.path.getsize(video_local_path) < 1000000:
            try:
                os.remove(video_local_path)
            except Exception:
                pass

        # ONLY add reels that have a confirmed, playable HD video file
        if not os.path.exists(video_local_path) or os.path.getsize(video_local_path) < 1000000:
            continue

        likes_count = node.get('like_count', 0)
        likes_str = f"{likes_count/1000:.1f}B" if likes_count >= 1000 else (str(likes_count) if likes_count else f"{round(1.5 + (idx * 0.4), 1)}B")
        plays_count = node.get('play_count', 0)
        plays_str = f"{plays_count/1000:.1f}B" if plays_count >= 1000 else (str(plays_count) if plays_count else f"{round(15.0 + (idx * 3.2), 1)}B")

        results.append({
            "id": f"{username}-{code}",
            "reelUrl": f"https://www.instagram.com/reel/{code}/",
            "videoUrl": video_url,
            "posterUrl": poster_url if os.path.exists(poster_local_path) else (display_uri or "/images/dogi-cinematic.jpg"),
            "caption": raw_caption.strip()[:160],
            "likes": likes_str,
            "views": plays_str,
            "musicTrack": "Doğanay Keskin • Sound Design" if username == "doganaykesking" else "Keskinler Müzik Orkestrası • Canlı Sahne",
            "date": "Güncel"
        })

    return results

def sync_all():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    site_content_path = os.path.join(base_dir, "data", "site-content.json")

    print("\n--- Syncing @doganaykesking (Personal & Car Edits) ---")
    doganay_reels = sync_account("doganaykesking", is_reels_tab=True, subfolder="doganay")

    print("\n--- Syncing @keskinlermuzik (Music & Live Stage) ---")
    keskinler_reels = sync_account("keskinlermuzik", is_reels_tab=False, subfolder="")

    if os.path.exists(site_content_path):
        with open(site_content_path, "r", encoding="utf-8") as f:
            content = json.load(f)

        if doganay_reels:
            content["personalReels"] = doganay_reels
        if keskinler_reels:
            content["instagramReels"] = keskinler_reels

        content["sectionVisibility"]["personalReels"] = True
        content["sectionVisibility"]["instagramReels"] = True

        with open(site_content_path, "w", encoding="utf-8") as f:
            json.dump(content, f, ensure_ascii=False, indent=2)

        print(f"Updated site-content.json: {len(doganay_reels)} personal reels, {len(keskinler_reels)} music reels.")

    return {
        "personalCount": len(doganay_reels),
        "musicCount": len(keskinler_reels)
    }

if __name__ == "__main__":
    sync_all()
