import pymupdf as fitz
import glob
import os
import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def extract_pdf_chapters(filepath):
    doc = fitz.open(filepath)
    text = ""
    for page in doc:
        text += page.get_text() + "\n"
    
    filename = os.path.basename(filepath)
    print(f"\n==========================================")
    print(f"Analyzing: {filename}")
    print(f"Total pages: {len(doc)}")
    print(f"==========================================")

    # Search for headings like 1. Electromagnétisme, 1.1 ..., etc.
    # We can detect major sections and keywords
    lines = text.split("\n")
    sections = []
    current_sec = None

    for line in lines:
        l = line.strip()
        # Look for headers
        if re.match(r'^(?:[1-9]\.|\b(?:I|II|III|IV|V|VI|VII|VIII)\b\s*[\.\-]?)\s+[A-ZÀ-ÿ]', l) and len(l) < 80:
            sections.append(l)

    return {
        "filename": filename,
        "total_pages": len(doc),
        "detected_headings": sections[:50]
    }

pdf_files = glob.glob(r'C:\Users\hp\Downloads\Programmes\*.pdf')
results = {}
for pf in pdf_files:
    results[os.path.basename(pf)] = extract_pdf_chapters(pf)

with open('scratch_programmes_analysis.json', 'w', encoding='utf-8') as out:
    json.dump(results, out, ensure_ascii=False, indent=2)

print("\nAnalysis saved to scratch_programmes_analysis.json")
