#!/usr/bin/env python3
"""
Step 2: Split Line Companion into gate blocks
Extracts each of the 64 gates as separate chunks
"""

import re
import json
from pathlib import Path

INPUT_FILE = Path("lore-research/research-outputs/line-companion-normalized.txt")
OUTPUT_FILE = Path("lore-research/research-outputs/line-companion-gates.json")

def split_into_gates(text: str) -> list:
    """Split text into gate blocks"""
    # Pattern matches:
    # "HEXAGRAM 1 THE CREATIVE"
    # "Gate 10 – Behavior of the Self"
    # etc.
    gate_pattern = re.compile(
        r"((?:HEXAGRAM|Gate)\s+(\d{1,2})[^\n]*?)\n",
        re.IGNORECASE
    )
    
    parts = []
    matches = list(gate_pattern.finditer(text))
    
    print(f"   Found {len(matches)} gate headings")
    
    for i, m in enumerate(matches):
        gate_title = m.group(1).strip()
        gate_num = int(m.group(2))
        start = m.end()
        end = matches[i+1].start() if i + 1 < len(matches) else len(text)
        body = text[start:end].strip()
        
        parts.append({
            "gate": gate_num,
            "title": gate_title,
            "body": body,
            "char_count": len(body)
        })
    
    return parts

def main():
    print("🔪 Splitting Line Companion into gate blocks...")
    
    # Read normalized text
    text = INPUT_FILE.read_text(encoding="utf-8")
    print(f"   Read {len(text)} characters from {INPUT_FILE}")
    
    # Split into gates
    gates = split_into_gates(text)
    
    # Sort by gate number
    gates.sort(key=lambda x: x["gate"])
    
    # Write output
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.write_text(json.dumps(gates, indent=2), encoding="utf-8")
    
    print(f"✅ Wrote {len(gates)} gates to {OUTPUT_FILE}")
    
    # Show sample
    if gates:
        print(f"\n   Sample: Gate {gates[0]['gate']} - {gates[0]['title']}")
        print(f"   Body preview: {gates[0]['body'][:100]}...")

if __name__ == "__main__":
    main()
