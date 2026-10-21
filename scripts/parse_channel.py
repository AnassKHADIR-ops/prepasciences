import json
import os
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

def main():
    if not os.path.exists('scratch_playlists.json'):
        print('scratch_playlists.json not found')
        return

    content = None
    for enc in ['utf-16', 'utf-8', 'cp1252', 'latin-1']:
        try:
            with open('scratch_playlists.json', 'r', encoding=enc) as f:
                content = f.read()
                data = json.loads(content)
                print(f"Loaded successfully with encoding: {enc}")
                break
        except Exception:
            continue

    if not content:
        print("Failed to decode scratch_playlists.json")
        return

    entries = data.get('entries', [])
    print(f"Total playlists found: {len(entries)}")
    for i, e in enumerate(entries):
        title = e.get('title')
        url = e.get('url') or e.get('webpage_url')
        count = e.get('video_count') or e.get('playlist_count')
        print(f"{i+1:3d}. {title} | Count: {count} | URL: {url}")

if __name__ == '__main__':
    main()
