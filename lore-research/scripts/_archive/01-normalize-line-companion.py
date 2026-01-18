#!/usr/bin/env python3
"""
Step 1: Normalize Line Companion text
Cleans up line breaks and spacing for easier regex parsing
"""

import re
from pathlib import Path

# Input/output paths
INPUT_FILE = Path("s3-data/Line Companion_djvu.txt")
OUTPUT_FILE = Path("lore-research/research-outputs/line-companion-normalized.txt")

def normalize_text(raw_text: str) -> str:
    """Normalize line breaks and spacing"""
    # Collapse Windows/Mac line endings
    text = raw_text.replace("\r\n", "\n").replace("\r", "\n")
    
    # Get rid of long runs of blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)
    
    # Remove page markers (e.g., "Page 1", "Page 2")
    text = re.sub(r"\n\s*Page\s+\d+\s*\n", "\n\n", text)
    
    return text

def main():
    print("📖 Normalizing Line Companion text...")
    
    # Read raw text
    raw = INPUT_FILE.read_text(encoding="utf-8", errors="ignore")
    print(f"   Read {len(raw)} characters from {INPUT_FILE}")
    
    # Normalize
    normalized = normalize_text(raw)
    print(f"   Normalized to {len(normalized)} characters")
    
    # Ensure output directory exists
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    
    # Write output
    OUTPUT_FILE.write_text(normalized, encoding="utf-8")
    print(f"✅ Wrote normalized text to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
