#!/usr/bin/env python3
"""
Build Legge hexagram index from normalized text.

Parses s3-data/hexagrams/legge-normalized.txt and splits into 64 hexagrams,
extracting title, body, and lines 1-6 for each.

Output: s3-data/hexagrams/legge-hx.json
"""

import json
import re
import sys
from pathlib import Path
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))
from config import S3_DATA_ROOT, RESEARCH_OUTPUTS_DIR
from utils import ensure_directory

# Simple logging functions
def log_info(msg: str):
    print(f"[INFO] {msg}")

def log_warning(msg: str):
    print(f"[WARNING] {msg}")

def log_error(msg: str):
    print(f"[ERROR] {msg}")


def parse_legge_hexagrams(normalized_path: Path) -> dict:
    """
    Parse normalized Legge text into structured hexagram data.
    
    Returns dict with hexagram numbers as keys (1-64).
    """
    log_info(f"Reading normalized Legge text from: {normalized_path}")
    
    with open(normalized_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    hexagrams = {}
    
    # Pattern to match hexagram headers
    # Examples: 
    # - "I. The Aj/ien Hexagram."
    # - "IV, The MAng Hexagram."
    # - "V. Ti-ie Hsu Hexagram." (no period after Hexagram)
    # - "XVIII. Ti-ie KO Hexagram." (OCR error: Ti-ie instead of The)
    hexagram_pattern = re.compile(
        r'^([IVXLCDM]+)[.,]\s+(The|Ti-ie)\s+(.+?)\s+Hexagram\.?',
        re.MULTILINE
    )
    
    # Find all hexagram headers
    matches = list(hexagram_pattern.finditer(content))
    log_info(f"Found {len(matches)} hexagram headers")
    
    if len(matches) < 50:
        log_error(f"Only found {len(matches)} hexagrams, expected at least 50")
        log_error("This is too few - check the source file")
        sys.exit(1)
    
    # Roman numeral to integer conversion
    roman_map = {
        'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5,
        'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10,
        'XI': 11, 'XII': 12, 'XIII': 13, 'XIV': 14, 'XV': 15,
        'XVI': 16, 'XVII': 17, 'XVIII': 18, 'XIX': 19, 'XX': 20,
        'XXI': 21, 'XXII': 22, 'XXIII': 23, 'XXIV': 24, 'XXV': 25,
        'XXVI': 26, 'XXVII': 27, 'XXVIII': 28, 'XXIX': 29, 'XXX': 30,
        'XXXI': 31, 'XXXII': 32, 'XXXIII': 33, 'XXXIV': 34, 'XXXV': 35,
        'XXXVI': 36, 'XXXVII': 37, 'XXXVIII': 38, 'XXXIX': 39, 'XL': 40,
        'XLI': 41, 'XLII': 42, 'XLIII': 43, 'XLIV': 44, 'XLV': 45,
        'XLVI': 46, 'XLVII': 47, 'XLVIII': 48, 'XLIX': 49, 'L': 50,
        'LI': 51, 'LII': 52, 'LIII': 53, 'LIV': 54, 'LV': 55,
        'LVI': 56, 'LVII': 57, 'LVIII': 58, 'LIX': 59, 'LX': 60,
        'LXI': 61, 'LXII': 62, 'LXIII': 63, 'LXIV': 64
    }
    
    # Process each hexagram
    for i, match in enumerate(matches):
        roman_num = match.group(1)
        title = match.group(3).strip()  # group 2 is "The" or "Ti-ie", group 3 is the actual title
        
        # Convert roman numeral to integer
        hex_num = roman_map.get(roman_num)
        if not hex_num:
            log_warning(f"Could not convert roman numeral: {roman_num}")
            continue
        
        # Extract text from this hexagram to the next (or end of file)
        start_pos = match.end()
        if i + 1 < len(matches):
            end_pos = matches[i + 1].start()
        else:
            end_pos = len(content)
        
        raw_text = content[start_pos:end_pos].strip()
        
        # Parse lines from the raw text
        lines = parse_hexagram_lines(raw_text, hex_num)
        
        hexagrams[str(hex_num)] = {
            "hexagram": hex_num,
            "title": title,
            "raw_text": raw_text,
            "lines": lines,
            "_meta": {
                "source": "legge-1899",
                "source_file": "s3-data/236066-The I Ching_djvu.txt",
                "normalized_from": "s3-data/hexagrams/legge-normalized.txt",
                "extracted_at": datetime.utcnow().isoformat() + "Z"
            }
        }
        
        log_info(f"Parsed hexagram {hex_num}: {title} ({len(lines)} lines)")
    
    return hexagrams


def parse_hexagram_lines(text: str, hex_num: int) -> dict:
    """
    Extract lines 1-6 from hexagram text.
    
    Looks for patterns like:
    - "1. In the first line, undivided, ..."
    - "2. The second line, divided, ..."
    etc.
    """
    lines = {}
    
    # Pattern to match line entries
    # Examples: "1. In the first line, undivided, ..." or "2. The second line, divided, ..."
    line_pattern = re.compile(
        r'^(\d)\.\s+(In the |The )?(first|second|third|fourth|fifth|sixth|topmost)\s+line',
        re.MULTILINE | re.IGNORECASE
    )
    
    matches = list(line_pattern.finditer(text))
    
    for i, match in enumerate(matches):
        line_num = int(match.group(1))
        
        # Skip line 7 (supernumerary paragraph in hexagrams 1 and 2)
        if line_num > 6:
            continue
        
        # Extract text from this line to the next (or end of section)
        start_pos = match.start()
        if i + 1 < len(matches):
            end_pos = matches[i + 1].start()
        else:
            # Look for the next hexagram or end of text
            end_pos = len(text)
        
        line_text = text[start_pos:end_pos].strip()
        
        lines[str(line_num)] = {
            "line": line_num,
            "raw": line_text
        }
    
    return lines


def main():
    """Main execution."""
    log_info("=" * 60)
    log_info("TASK 2.4: Build Legge Hexagram Index")
    log_info("=" * 60)
    
    # Input file
    normalized_path = S3_DATA_ROOT / 'hexagrams' / 'legge-normalized.txt'
    
    if not normalized_path.exists():
        log_error(f"Normalized Legge file not found: {normalized_path}")
        log_error("Please run task 2.3 (02-normalize-legge.py) first")
        sys.exit(1)
    
    # Parse hexagrams
    hexagrams = parse_legge_hexagrams(normalized_path)
    
    # Validate count  
    if len(hexagrams) < 50:
        log_error(f"Only parsed {len(hexagrams)} hexagrams, expected at least 50")
        log_error("This is too few - check the normalized file")
        sys.exit(1)
    elif len(hexagrams) < 64:
        log_warning(f"Parsed {len(hexagrams)} hexagrams, expected 64")
        log_warning(f"Missing hexagrams will be logged to BAD_LINES.md")
    else:
        log_info(f"✓ Successfully parsed all 64 hexagrams")
    
    # Check for missing hexagrams
    missing = []
    for i in range(1, 65):
        if str(i) not in hexagrams:
            missing.append(i)
    
    if missing:
        log_warning(f"Missing hexagrams: {missing}")
        
        # Log to BAD_LINES.md
        bad_lines_path = RESEARCH_OUTPUTS_DIR / 'BAD_LINES.md'
        ensure_directory(bad_lines_path.parent)
        
        with open(bad_lines_path, 'a', encoding='utf-8') as f:
            f.write(f"\n## Legge Hexagram Parsing Issues (Task 2.4)\n\n")
            for hex_num in missing:
                f.write(f"- hexagram: {hex_num} | source: legge-normalized.txt | "
                       f"problem: not found in normalized text | "
                       f"suggestion: check original djvu.txt\n")
    
    # Write output
    output_path = S3_DATA_ROOT / 'hexagrams' / 'legge-hx.json'
    ensure_directory(output_path.parent)
    
    log_info(f"Writing consolidated JSON to: {output_path}")
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(hexagrams, f, indent=2, ensure_ascii=False)
    
    log_info(f"✓ Wrote {len(hexagrams)} hexagrams to {output_path}")
    
    # Summary
    log_info("=" * 60)
    log_info("SUMMARY")
    log_info("=" * 60)
    log_info(f"Total hexagrams parsed: {len(hexagrams)}")
    log_info(f"Missing hexagrams: {len(missing)}")
    
    # Count lines per hexagram
    total_lines = 0
    incomplete = []
    for hex_num, data in hexagrams.items():
        line_count = len(data['lines'])
        total_lines += line_count
        if line_count < 6:
            incomplete.append((hex_num, line_count))
    
    log_info(f"Total lines extracted: {total_lines}")
    
    if incomplete:
        log_warning(f"Hexagrams with <6 lines: {len(incomplete)}")
        for hex_num, count in incomplete:
            log_warning(f"  Hexagram {hex_num}: {count} lines")
    
    log_info("=" * 60)
    log_info("Task 2.4 complete!")
    log_info("=" * 60)


if __name__ == '__main__':
    main()
