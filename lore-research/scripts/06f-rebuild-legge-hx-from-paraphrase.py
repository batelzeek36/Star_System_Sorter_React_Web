#!/usr/bin/env python3
"""
06f-rebuild-legge-hx-from-paraphrase.py

Rebuilds s3-data/hexagrams/legge-hx.json using paraphrased Legge data
from the individual hexagram files (01.json through 64.json).

This replaces the failed OCR import with clean paraphrased data.

Usage:
    python3 lore-research/scripts/06f-rebuild-legge-hx-from-paraphrase.py
"""

import json
import shutil
from pathlib import Path
from datetime import datetime

HEX_DIR = Path("s3-data/hexagrams")
LEGGE_HX_FILE = HEX_DIR / "legge-hx.json"
BACKUP_FILE = HEX_DIR / f"legge-hx.backup.{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"

def extract_legge_judgment(data):
    """Extract Legge judgment/core meaning from hexagram file."""
    cm = data.get("core_meaning", {}) or {}
    return (
        cm.get("legge_1899_public_domain") or
        cm.get("normalized_summary") or
        ""
    )

def extract_legge_line(line_obj):
    """Extract Legge line text from line object."""
    # Look for Legge translation
    for trans in (line_obj.get("translations") or []):
        if trans.get("translator_id") == "legge_1899_public_domain":
            return trans.get("text", "").strip()
    
    # Fall back to first translation
    if line_obj.get("translations"):
        first_trans = line_obj["translations"][0]
        if first_trans:
            return first_trans.get("text", "").strip()
    
    # Fall back to normalized_meaning
    return line_obj.get("normalized_meaning", "").strip()

def main():
    """Rebuild legge-hx.json from individual hexagram files."""
    
    # Backup existing file if it exists
    if LEGGE_HX_FILE.exists():
        shutil.copy2(LEGGE_HX_FILE, BACKUP_FILE)
        print(f"✓ Backed up existing file to: {BACKUP_FILE}")
    
    # Build new legge-hx structure
    legge_hx = {}
    
    print("\nExtracting paraphrased Legge data from hexagram files...")
    
    for i in range(1, 65):
        hex_file = HEX_DIR / f"{i:02}.json"
        
        if not hex_file.exists():
            print(f"  ⚠️  Hexagram {i:02} not found, skipping")
            continue
        
        # Load hexagram file
        data = json.loads(hex_file.read_text(encoding="utf-8"))
        
        # Extract title (use the name field, clean it up)
        title = data.get("name", "")
        # Remove the English/Chinese parts, keep just the romanized name
        if "/" in title:
            parts = title.split("/")
            # Try to extract the romanized name from parentheses
            for part in parts:
                if "(" in part and ")" in part:
                    # Extract content before the comma in parentheses
                    paren_content = part[part.find("(")+1:part.find(")")]
                    if "," in paren_content:
                        title = paren_content.split(",")[1].strip()
                    else:
                        title = paren_content.strip()
                    break
            else:
                # Just use the first part if no parentheses found
                title = parts[0].strip()
        
        # Extract judgment
        judgment = extract_legge_judgment(data)
        
        # Extract lines
        lines_dict = {}
        for line_obj in (data.get("lines") or []):
            line_num = line_obj.get("line")
            if not isinstance(line_num, int) or not (1 <= line_num <= 6):
                continue
            
            line_text = extract_legge_line(line_obj)
            
            lines_dict[str(line_num)] = {
                "line": line_num,
                "raw": line_text
            }
        
        # Build hexagram entry matching legge-hx.json format
        legge_hx[str(i)] = {
            "hexagram": i,
            "title": title,
            "raw_text": judgment,
            "lines": lines_dict,
            "_meta": {
                "source": "legge-1899-paraphrase",
                "source_file": f"s3-data/hexagrams/{i:02}.json",
                "mode": "paraphrase_full_replace",
                "note": "Rebuilt from paraphrased Legge data in individual hexagram files due to OCR corruption",
                "extracted_at": datetime.utcnow().isoformat(timespec="seconds") + "Z"
            }
        }
        
        print(f"  ✓ Hexagram {i:02} - {title}")
    
    # Write new legge-hx.json
    LEGGE_HX_FILE.write_text(
        json.dumps(legge_hx, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8"
    )
    
    print(f"\n{'='*60}")
    print(f"✓ Rebuilt legge-hx.json with {len(legge_hx)} hexagrams")
    print(f"📁 Output: {LEGGE_HX_FILE}")
    if BACKUP_FILE.exists():
        print(f"📁 Backup: {BACKUP_FILE}")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
