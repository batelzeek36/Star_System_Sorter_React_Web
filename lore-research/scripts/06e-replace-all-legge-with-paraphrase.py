#!/usr/bin/env python3
"""
06e-replace-all-legge-with-paraphrase.py

Replaces the entire Legge block in all 64 hexagram files with paraphrased data
from the same files. Marks as beta/unverified and preserves old OCR as backup.

Usage:
    python3 lore-research/scripts/06e-replace-all-legge-with-paraphrase.py
"""

import json
import shutil
from pathlib import Path
from datetime import datetime

HEX_DIR = Path("s3-data/hexagrams")
BACKUP_DIR = Path("lore-research/scripts") / f"_backup_replace_legge_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"

def pick_paraphrase_judgment(data):
    """Extract judgment/core meaning from paraphrase fields."""
    cm = data.get("core_meaning", {}) or {}
    # Try various fields that might contain the judgment paraphrase
    return (
        cm.get("legge_1899_public_domain") or
        cm.get("normalized_summary") or
        cm.get("summary") or
        ""
    )

def pick_paraphrase_line_text(line):
    """Extract line text from paraphrase/translation fields."""
    txt = None
    
    # First try translations array
    for t in (line.get("translations") or []):
        if t.get("translator_id") == "legge_1899_public_domain" and t.get("text"):
            txt = t["text"]
            break
    
    # Fall back to first translation
    if not txt and line.get("translations"):
        txt = (line["translations"][0] or {}).get("text")
    
    # Fall back to normalized_meaning
    if not txt:
        txt = line.get("normalized_meaning") or ""
    
    return (txt or "").strip()

def main():
    """Replace Legge blocks in all 64 hexagram files with paraphrased data."""
    
    # Create backup directory
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Created backup directory: {BACKUP_DIR}")
    
    updated = 0
    skipped = 0
    
    # Backup all 64 files first
    print("\nBacking up files...")
    for i in range(1, 65):
        src = HEX_DIR / f"{i:02}.json"
        if src.exists():
            shutil.copy2(src, BACKUP_DIR / src.name)
    
    print("\nProcessing hexagram files...")
    
    for i in range(1, 65):
        path = HEX_DIR / f"{i:02}.json"
        
        if not path.exists():
            print(f"  ⚠️  Hexagram {i:02} not found")
            skipped += 1
            continue
        
        # Load file
        data = json.loads(path.read_text(encoding="utf-8"))
        
        # Ensure sources container exists
        sources = data.setdefault("sources", {})
        
        # If an existing 'legge_1899' block exists, preserve it as 'legge_ocr_raw'
        if "legge_1899" in sources and "legge_ocr_raw" not in sources:
            sources["legge_ocr_raw"] = sources["legge_1899"]
        
        # Build the replacement block from paraphrase fields in THIS file
        judgment = pick_paraphrase_judgment(data)
        lines_arr = data.get("lines") or []
        
        lines_map = {}
        for ln in lines_arr:
            n = ln.get("line")
            if not isinstance(n, int) or not (1 <= n <= 6):
                continue
            
            text = pick_paraphrase_line_text(ln)
            lines_map[str(n)] = {
                "line": n,
                "text": text,
                "verified": False,  # explicitly unverified
                "origin": "paraphrase-beta"  # not OCR-verified Legge
            }
        
        # Create new Legge block
        sources["legge_1899"] = {
            "title": data.get("name") or "",
            "judgment": judgment,
            "lines": lines_map,
            "_meta": {
                "source_id": "legge_paraphrase_beta",
                "mode": "paraphrase_full_replace",
                "replaced_source": "legge_1899_ocr",
                "ui_badge": "BETA",
                "note": "Entire Legge block replaced by paraphrase due to OCR corruption; will be swapped back when clean Legge is available.",
                "replaced_at": datetime.utcnow().isoformat(timespec="seconds") + "Z"
            }
        }
        
        # Save file
        path.write_text(
            json.dumps(data, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8"
        )
        
        print(f"  ✓ Hexagram {i:02} - {data.get('name', 'Unknown')}")
        updated += 1
    
    print(f"\n{'='*60}")
    print(f"✓ Replaced Legge for {updated} files")
    print(f"⚠️  Skipped {skipped} missing files")
    print(f"📁 Backup at: {BACKUP_DIR}")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
