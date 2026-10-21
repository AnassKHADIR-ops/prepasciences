import json
import os
import sys
import urllib.request
import re

sys.stdout.reconfigure(encoding='utf-8')

def check_videos():
    if not os.path.exists('scratch_videos.json'):
        print('scratch_videos.json missing')
        return []
    
    for enc in ['utf-16', 'utf-8', 'cp1252', 'latin-1']:
        try:
            with open('scratch_videos.json', 'r', encoding=enc) as f:
                data = json.load(f)
                entries = data.get('entries', [])
                print(f"Total videos in /videos: {len(entries)}")
                return entries
        except Exception:
            continue
    return []

def fetch_courses_tab():
    url = "https://www.youtube.com/@e-learningphysique4910/courses"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print(f"Courses HTML fetched: {len(html)} bytes")
            
            # Save html for deep inspection
            with open('scratch_courses.html', 'w', encoding='utf-8') as out:
                out.write(html)
                
            # Extract ytInitialData
            match = re.search(r'var ytInitialData = ({.*?});</script>', html)
            if not match:
                match = re.search(r'window\["ytInitialData"\] = ({.*?});', html)
            if match:
                initial_data = json.loads(match.group(1))
                with open('scratch_courses_initial_data.json', 'w', encoding='utf-8') as out_json:
                    json.dump(initial_data, out_json, ensure_ascii=False, indent=2)
                print("ytInitialData extracted successfully!")
            else:
                print("Could not find ytInitialData in HTML")
    except Exception as e:
        print(f"Error fetching courses tab: {e}")

if __name__ == '__main__':
    vids = check_videos()
    fetch_courses_tab()
