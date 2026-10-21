import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Load playlists dump
with open('scratch_playlists_dump.json', 'r', encoding='utf-8') as f:
    playlists_dump = json.load(f)

pids = set()
for p in playlists_dump.values():
    for e in p.get('entries', []):
        if e.get('id'):
            pids.add(e['id'])

# Load channel videos
vids = []
for enc in ['utf-16', 'utf-8']:
    try:
        with open('scratch_videos.json', 'r', encoding=enc) as f:
            vids = json.load(f).get('entries', [])
            break
    except Exception:
        pass

standalone = [v for v in vids if v.get('id') not in pids]
print(f"Total standalone videos: {len(standalone)}")
for i, v in enumerate(standalone):
    dur = v.get('duration')
    m, s = divmod(dur or 0, 60)
    print(f"{i+1:2d}. [{v.get('id')}] {v.get('title')} ({m:02d}:{s:02d})")
