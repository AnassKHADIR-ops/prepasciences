import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Load playlists dump
with open('scratch_playlists_dump.json', 'r', encoding='utf-8') as f:
    playlists_dump = json.load(f)

# Load channel videos
channel_videos = []
for enc in ['utf-16', 'utf-8', 'cp1252', 'latin-1']:
    try:
        with open('scratch_videos.json', 'r', encoding=enc) as f:
            data = json.load(f)
            channel_videos = data.get('entries', [])
            print(f"Loaded channel videos ({len(channel_videos)}) with enc {enc}")
            break
    except Exception:
        continue

print(f"Total channel videos: {len(channel_videos)}")
all_playlist_videos = {}
for pid, pdata in playlists_dump.items():
    ptitle = pdata['title']
    for entry in pdata.get('entries', []):
        vid_id = entry.get('id')
        if not vid_id:
            continue
        if vid_id not in all_playlist_videos:
            all_playlist_videos[vid_id] = {
                "id": vid_id,
                "title": entry.get('title'),
                "duration": entry.get('duration'),
                "url": f"https://www.youtube.com/watch?v={vid_id}",
                "playlists": []
            }
        all_playlist_videos[vid_id]["playlists"].append(ptitle)

print(f"Unique video IDs across all 39 playlists: {len(all_playlist_videos)}")

# Check channel videos vs playlist videos
missing_in_playlists = []
for cv in channel_videos:
    cid = cv.get('id')
    if cid and cid not in all_playlist_videos:
        missing_in_playlists.append(cv)

print(f"Channel videos NOT in any playlist: {len(missing_in_playlists)}")
for m in missing_in_playlists[:10]:
    print(f"  - [{m.get('id')}] {m.get('title')}")
