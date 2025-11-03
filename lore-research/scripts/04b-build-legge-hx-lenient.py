#!/usr/bin/env python3
"""
04b-build-legge-hx-lenient.py

Lenient index builder that guarantees all 64 hexagrams are present in legge-hx.json,
even if OCR quality is poor. Creates stub entries with provenance metadata and
quality flags for downstream processing.

Usage:
    python3 lore-research/scripts/04b-build-legge-hx-lenient.py
"""

import json
import re
from pathlib import Path
from datetime import datetime

# Paths
SRC_TXT = Path("s3-data/hexagrams/legge-normalized.txt")
PARA_DIR = Path("s3-data/hexagrams")
OUT_JSON = Path("s3-data/hexagrams/legge-hx.json")

# Lenient regex patterns
HEX_HEADER_RE = re.compile(r"^\s*(?:[IVXLCDM]{1,6}|\d{1,2})\s*\.\s*(.+)$", re.IGNORECASE)
LINE_RE = re.compile(r"^\s*([1-6])\.\s*(.+)$")


def load_paraphrase_titles():
    """Load titles from paraphrase JSON files as fallback."""
    titles = {}
    for i in range(1, 65):
        p = PARA_DIR / f"{i:02}.json"
        if not p.exists():
            continue
        try:
            d = json.loads(p.read_text(encoding="utf-8"))
            # Prefer the rich "name" if present; fall back to id
            titles[i] = d.get("name") or d.get("id") or f"Hexagram {i}"
        except Exception:
            pass
    return titles


def parse_blocks_lenient(txt):
    """
    Very permissive parser that splits text into 64 hexagram blocks.
    Allows for OCR artifacts and missing data.
    """
    lines = txt.splitlines()
    
    # Initialize accumulator for all 64 hexagrams
    acc = {n: {"title": None, "raw_text": [], "lines": {}} for n in range(1, 65)}
    current = None

    def ensure_hex(n):
        return acc.setdefault(n, {"title": None, "raw_text": [], "lines": {}})

    # Parse line by line
    for ln in lines:
        # Check for line markers (1. 2. 3. etc.)
        m_line = LINE_RE.match(ln)
        if m_line and current:
            idx = m_line.group(1)
            text = m_line.group(2).strip()
            acc[current]["lines"].setdefault(idx, [])
            acc[current]["lines"][idx].append(text)
            acc[current]["raw_text"].append(ln)
            continue

        # Check for hexagram header (e.g., "Hexagram 12", "XII.", "12.")
        hex_match = re.search(r"Hexagram\s+(\d{1,2})", ln, re.IGNORECASE)
        if hex_match:
            n = int(hex_match.group(1))
            if 1 <= n <= 64:
                current = n
                ensure_hex(current)
                acc[current]["raw_text"].append(ln)
            continue

        # Check for roman numeral or number header
        m_hdr = HEX_HEADER_RE.match(ln)
        if m_hdr and current:
            # Capture potential title
            if not acc[current]["title"]:
                acc[current]["title"] = m_hdr.group(1).strip()
            acc[current]["raw_text"].append(ln)
            continue

        # Append to current hexagram if any
        if current:
            acc[current]["raw_text"].append(ln)

    # Collapse to final structure
    out = {}
    for n in range(1, 65):
        blk = acc[n]
        lines_obj = {}
        
        # Build lines object (1-6)
        for k in ("1", "2", "3", "4", "5", "6"):
            arr = blk["lines"].get(k, [])
            lines_obj[k] = {
                "line": int(k),
                "raw": (arr[0].strip() if arr else "")
            }

        out[str(n)] = {
            "hexagram": n,
            "title": (blk["title"] or "").strip(),
            "raw_text": "\n".join(blk["raw_text"]).strip(),
            "lines": lines_obj,
            "_meta": {
                "source": "legge-1899-ocr",
                "normalized_from": str(SRC_TXT),
                "extracted_at": datetime.utcnow().isoformat(timespec="seconds") + "Z",
                "quality": "ocr_janky"  # Important flag for downstream
            },
            # Keep page fields for compatibility (may be None)
            "source_leaf_start": None,
            "source_leaf_end": None,
            "source_page_candidates": [],
            "source_page_confidence": 0.0
        }
    
    return out


def main():
    """Main execution."""
    print(f"Reading source: {SRC_TXT}")
    
    txt = SRC_TXT.read_text(encoding="utf-8") if SRC_TXT.exists() else ""
    
    if not txt:
        print(f"Warning: Source file {SRC_TXT} is empty or missing")
    
    # Parse with lenient rules
    idx = parse_blocks_lenient(txt)
    
    # Backfill titles from paraphrase JSONs so UI is readable
    p_titles = load_paraphrase_titles()
    for n in range(1, 65):
        k = str(n)
        if not idx[k]["title"] and n in p_titles:
            idx[k]["title"] = p_titles[n]
    
    # Write output
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(idx, ensure_ascii=False, indent=2), encoding="utf-8")
    
    print(f"✓ Wrote lenient index with all 64 hexagrams → {OUT_JSON}")
    
    # Report quality stats
    empty_count = sum(1 for k, v in idx.items() if not v["raw_text"])
    print(f"  - Hexagrams with no text: {empty_count}/64")
    print(f"  - All entries marked as quality: 'ocr_janky'")


if __name__ == "__main__":
    main()
