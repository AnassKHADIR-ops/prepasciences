import fitz
import glob
import sys
import os
import re

sys.stdout.reconfigure(encoding='utf-8')

pdf_map = {
    "TSI 1": "public/programmes/Physique TSI 1er année.pdf",
    "MPSI 1": "public/programmes/physique- 1er année MPSI.pdf",
    "PCSI 1": "public/programmes/physique-pcsi 1er année.pdf",
    "TSI 2": "public/programmes/physique-TSI 2e année.pdf",
    "MP 2": "public/programmes/programme 2eme année MP.pdf",
    "PSI 2": "public/programmes/physique-psi 2eme année.pdf"
}

for name, path in pdf_map.items():
    if not os.path.exists(path):
        print(f"Missing {path}")
        continue
    doc = fitz.open(path)
    print(f"\n=======================================================")
    print(f"=== SYLLABUS: {name} ({len(doc)} pages) ===")
    print(f"=======================================================")
    
    # Extract text from all pages
    full_text = ""
    for p in doc:
        full_text += p.get_text() + "\n"
    
    # Find all major section headers or TOC items
    # Looking for lines starting with roman numerals, capital letters, or numbering
    headers = []
    lines = full_text.split("\n")
    for line in lines:
        l = line.strip()
        # Common patterns in CPGE syllabus
        if re.match(r'^(?:[A-Z]\s*[-–\.]|[0-9]+\s*[-–\.]|[I|V|X]+\s*[-–\.]|\b(?:MODULE|PARTIE|CHAPITRE)\b)', l, re.IGNORECASE) and 5 < len(l) < 90:
            if not any(h == l for h in headers):
                headers.append(l)
        elif any(keyword in l.lower() for keyword in [
            "ondes", "électromagnétisme", "mecanique", "mécanique", "thermodynamique", 
            "optique", "électronique", "quantique", "fluide", "induction", "rayonnement",
            "statique", "diffusion", "frottement", "schrödinger", "navier-stokes"
        ]) and len(l) < 60 and l.isupper():
            if not any(h == l for h in headers):
                headers.append(l)
                
    for h in headers[:30]:
        print(f"  * {h}")
