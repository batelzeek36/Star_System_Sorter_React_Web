#!/usr/bin/env python3
"""
Sanitize Legge lines in legge-hx.json to remove OCR artifacts.

Cleans up:
- Page headers (THE YI KING, TEXT., SECT. I, etc.)
- Orphan page numbers
- Soft hyphens (sub¬ject → subject)
- Double blank lines
- Trailing OCR noise

Task: Pre-sync cleanup for legge-hx.json
"""

import json
import re
import sys
from pathlib import Path
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))
from config import S3_DATA_ROOT
from utils import ensure_directory

def log_info(msg: str):
    print(f"[INFO] {msg}")

def log_warning(msg: str):
    print(f"[WARNING] {msg}")


def sanitize_text(text: str) -> str:
    """
    Clean OCR artifacts from Legge text.
    """
    if not text:
        return ""
    
    # Remove soft hyphens and ligatures
    text = text.replace('¬', '')
    text = text.replace('Ffi-', 'Fir')
    text = text.replace('Zau', 'Zhou')
    
    # Remove common OCR debris patterns
    text = re.sub(r'\bsub-\s+ject\b', 'subject', text)
    text = re.sub(r'\by!\b', 'yi', text, flags=re.IGNORECASE)
    text = re.sub(r'\b5»\b', '', text)
    text = re.sub(r'\bo\b(?=\s+VI\.)', '', text)  # orphan 'o' before section markers
    
    # Split into lines for processing
    lines = text.split('\n')
    cleaned_lines = []
    
    for line in lines:
        line = line.strip()
        
        # Skip common OCR headers/footers
        if re.match(r'^(THE|TH[EI])\s+(YI|Y!|\\\'?i)\s+K[ING]+\.?$', line, re.IGNORECASE):
            continue
        if re.match(r'^TEXT\.?$', line, re.IGNORECASE):
            continue
        if re.match(r'^SECT\.?\s+[IVX]+\.?$', line, re.IGNORECASE):
            continue
        if re.match(r'^THE\s+\w+\s+HEXAGRAM\.?$', line, re.IGNORECASE):
            continue
        
        # Skip "see vol." references
        if 'see vol.' in line.lower():
            continue
        
        # Skip orphan page numbers (single or double digits alone)
        if re.match(r'^\d{1,3}$', line):
            continue
        
        # Skip lines that are just roman numerals
        if re.match(r'^[IVXLCDM]+\.?$', line):
            continue
        
        if line:
            cleaned_lines.append(line)
    
    # Join back and collapse multiple spaces
    result = ' '.join(cleaned_lines)
    result = re.sub(r'\s+', ' ', result)
    result = result.strip()
    
    return result


def normalize_title(title: str) -> str:
    """
    Normalize OCR-corrupted Legge romanization to standard Wade-Giles.
    """
    # Common OCR corruptions in Legge titles
    title_map = {
        'Aj/ien': 'Qian',
        'Khwan': 'Kun', 
        'Km': 'Zhun',
        'MAng': 'Meng',
        'Hsu': 'Xu',
        'Sze': 'Shi',
        'Pi': 'Bi',
        'HsiAo Knti': 'Xiao Xu',
        'Lt': 'Li',
        'ThAi': 'Tai',
        'Put': 'Pi',
        'Ti-iung Zm': 'Tong Ren',
        'TA Yti': 'Da You',
        '/Yemen': 'Qian',
        'Yu': 'Yu',
        'Sui': 'Sui',
        'KO': 'Gu',
        'Lin': 'Lin',
        'Kwan': 'Guan',
        'Khizw': 'Kui',
    }
    
    return title_map.get(title, title)


def extract_line_text(text: str) -> str:
    """
    Clean line text but keep the full line description.
    Only remove commentary that's clearly separate (P. Regis notes, etc.)
    """
    if not text:
        return ""
    
    # First clean OCR artifacts
    text = sanitize_text(text)
    
    if not text:
        return ""
    
    # Remove P. Regis commentary (appears mid-text)
    text = re.sub(r'\bP\.\s+Regis[^.]+\.', '', text)
    
    # Remove "see vol." references
    text = re.sub(r'\bsee vol\.[^.]+\.', '', text)
    
    # Look for where next line number starts (e.g., "4. The fourth line")
    # This indicates next line begins
    next_line_match = re.search(r'\b\d+\.\s+The\s+(first|second|third|fourth|fifth|sixth|topmost)\s+line\b', text, re.IGNORECASE)
    if next_line_match:
        text = text[:next_line_match.start()].strip()
    
    # Clean up multiple spaces
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()


def sanitize_hexagram_index(index_path: Path) -> dict:
    """
    Load and sanitize all text in legge-hx.json.
    """
    log_info(f"Loading index from: {index_path}")
    
    with open(index_path, 'r', encoding='utf-8') as f:
        hexagrams = json.load(f)
    
    log_info(f"Loaded {len(hexagrams)} hexagrams")
    
    sanitized_count = 0
    line_count = 0
    
    for hex_num, hex_data in hexagrams.items():
        # Normalize title
        if 'title' in hex_data:
            original_title = hex_data['title']
            normalized = normalize_title(original_title)
            if normalized != original_title:
                hex_data['title'] = normalized
                hex_data['original_title'] = original_title  # Keep for reference
        
        # Sanitize raw_text (judgment only, no line paragraphs)
        if 'raw_text' in hex_data:
            original = hex_data['raw_text']
            # For judgment, just clean it
            sanitized = sanitize_text(original)
            # Extract only judgment (first paragraph before line numbers)
            match = re.match(r'^[^.]+\.(?:\s|$)', sanitized)
            if match:
                sanitized = match.group(0).strip()
            if sanitized != original:
                hex_data['raw_text'] = sanitized
                sanitized_count += 1
        
        # Sanitize line text - clean but keep full description
        if 'lines' in hex_data:
            for line_num, line_data in hex_data['lines'].items():
                if 'raw' in line_data:
                    original = line_data['raw']
                    sanitized = extract_line_text(original)
                    if sanitized != original:
                        line_data['raw'] = sanitized
                        line_count += 1
    
    log_info(f"Sanitized {sanitized_count} hexagram texts")
    log_info(f"Sanitized {line_count} line texts")
    
    return hexagrams


def main():
    """Main execution."""
    log_info("=" * 60)
    log_info("TASK: Sanitize Legge Lines")
    log_info("=" * 60)
    
    index_path = S3_DATA_ROOT / 'hexagrams' / 'legge-hx.json'
    
    if not index_path.exists():
        log_warning(f"Index not found: {index_path}")
        sys.exit(1)
    
    # Sanitize
    hexagrams = sanitize_hexagram_index(index_path)
    
    # Write back (atomic)
    temp_path = index_path.with_suffix('.json.tmp')
    
    log_info(f"Writing sanitized index to: {temp_path}")
    with open(temp_path, 'w', encoding='utf-8') as f:
        json.dump(hexagrams, f, indent=2, ensure_ascii=False)
    
    log_info(f"Moving {temp_path} → {index_path}")
    temp_path.replace(index_path)
    
    log_info("✓ Sanitization complete!")
    log_info("=" * 60)


if __name__ == '__main__':
    main()
