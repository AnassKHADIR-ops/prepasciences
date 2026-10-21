import sys
import test_complete_classification as t

sys.stdout.reconfigure(encoding='utf-8')

print("17 Physique Générale videos:")
for vid_id, v in t.all_videos.items():
    dom, mid, chap, niv, fils, is_c, conc = t.classify_video(v)
    if dom == "Physique Générale":
        print(f"[{v['id']}] {v['title']} | Playlists: {v['playlists']}")
