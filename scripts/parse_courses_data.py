import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def find_courses(obj, depth=0):
    courses = []
    if isinstance(obj, dict):
        # Look for course renderer or lockup
        for k, v in obj.items():
            if 'course' in k.lower() or 'lockup' in k.lower():
                # print(f"Key match: {k}")
                pass
            if isinstance(v, (dict, list)):
                courses.extend(find_courses(v, depth+1))
    elif isinstance(obj, list):
        for item in obj:
            courses.extend(find_courses(item, depth+1))
    return courses

with open('scratch_courses_initial_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("Searching ytInitialData for courses/playlists...")

# Let's search for listId or playlistId or course titles in data
def search_keys(node, path=""):
    results = []
    if isinstance(node, dict):
        if 'lockupViewModel' in node:
            results.append(node['lockupViewModel'])
        elif 'gridPlaylistRenderer' in node:
            results.append(node['gridPlaylistRenderer'])
        elif 'playlistRenderer' in node:
            results.append(node['playlistRenderer'])
        for k, v in node.items():
            results.extend(search_keys(v, f"{path}.{k}"))
    elif isinstance(node, list):
        for i, item in enumerate(node):
            results.extend(search_keys(item, f"{path}[{i}]"))
    return results

items = search_keys(data)
print(f"Found {len(items)} items!")
for i, it in enumerate(items):
    # try to extract title and url/id
    title = None
    url = None
    count = None
    if 'metadata' in it and 'title' in it.get('metadata', {}):
        title = it['metadata']['title'].get('content')
    if not title and 'title' in it:
        t = it['title']
        if isinstance(t, dict):
            title = t.get('simpleText') or (t.get('runs', [{}])[0].get('text') if 'runs' in t else None)
        elif isinstance(t, str):
            title = t
            
    content_id = it.get('contentId') or it.get('playlistId')
    print(f"{i+1:2d}. Title: {title} | ID: {content_id}")
