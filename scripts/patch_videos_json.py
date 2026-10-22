import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/elearningPhysiqueVideos.json', 'r', encoding='utf-8') as f:
    vids = json.load(f)

print(f"Loaded {len(vids)} videos.")

modified_count = 0

for v in vids:
    vid_id = v.get('id')
    title = v.get('title', '')
    title_lower = title.lower()
    
    # 1. Fix misclassified second principe / premier principe / gaz reel
    if vid_id in ['7Dhck3tqgJo', 'CvKEewM8Ed4', 'izj7fxlrz8Q', 'RZ-NEEZ3ZAw']:
        if v.get('niveau') != 'sup':
            v['niveau'] = 'sup'
            modified_count += 1
            print(f"Fixed niveau for {vid_id}: {title} -> sup")
            
    # 2. Fix Fourier optics image processing mistakenly in thermo
    if vid_id == 'ylj0YaonHQk':
        v['moduleId'] = 'optique'
        v['domaine'] = 'Optique Ondulatoire & Géométrique'
        v['chapitre'] = 'Diffraction & Optique de Fourier'
        modified_count += 1
        print(f"Fixed module for {vid_id}: {title} -> optique")
        
    # 3. Ensure filières consistency for Sup chemistry videos
    if v.get('moduleId') == 'chimie':
        if 'PC' not in v['filieres']:
            v['filieres'].append('PC')
        if 'PSI' not in v['filieres']:
            v['filieres'].append('PSI')
        if 'MP' not in v['filieres']:
            v['filieres'].append('MP')
        modified_count += 1

    # 4. If filières contains MPSI or PCSI, also add standard target filières
    if 'MPSI' in v.get('filieres', []):
        for standard in ['MP', 'PSI']:
            if standard not in v['filieres']:
                v['filieres'].append(standard)
    if 'PCSI' in v.get('filieres', []):
        for standard in ['PC', 'PSI']:
            if standard not in v['filieres']:
                v['filieres'].append(standard)

with open('src/data/elearningPhysiqueVideos.json', 'w', encoding='utf-8') as f:
    json.dump(vids, f, ensure_ascii=False, indent=2)

print(f"Saved changes! {modified_count} specific fixes applied.")
