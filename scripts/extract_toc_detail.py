import fitz
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

def extract_toc(pdf_path, name):
    doc = fitz.open(pdf_path)
    print(f"\n=======================================================")
    print(f"=== {name} ({len(doc)} pages) ===")
    print(f"=======================================================")
    
    # Check TOC if available
    toc = doc.get_toc()
    if toc:
        for item in toc:
            print("  " * item[0] + f"- {item[1]} (p.{item[2]})")
    else:
        # Search page by page for major section headers
        for pno in range(min(len(doc), 15)):
            txt = doc[pno].get_text()
            for line in txt.split("\n"):
                l = line.strip()
                if "sommaire" in l.lower() or "table des matières" in l.lower() or "programme" in l.lower():
                    # print nearby lines
                    pass
                if re.match(r'^(?:[0-9]+\.|[I|V|X]+\.|\bPartie\b|\bModule\b|\bChapitre\b)', l):
                    print(f"  [p.{pno+1}] {l}")

extract_toc("public/programmes/physique- 1er année MPSI.pdf", "MPSI 1")
extract_toc("public/programmes/physique-pcsi 1er année.pdf", "PCSI 1")
extract_toc("public/programmes/physique-psi 2eme année.pdf", "PSI 2")
