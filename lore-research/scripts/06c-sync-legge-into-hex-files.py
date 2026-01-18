#!/usr/bin/env python3
"""
Sync verified Legge quotes from legge-hx.json into per-hexagram files.

Reads legge-hx.json (the verified index) and updates the Legge translations
in each per-hexagram file (s3-data/hexagrams/{N}.json), preserving all other
rich fields (Chinese, keywords, normalized meanings, etc.).

Writes to candidates folder for review before promotion.

Usage:
    python3 06c-sync-legge-into-hex-files.py --write-candidates
"""

import json
import sys
import argparse
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

def log_error(msg: str):
    print(f"[ERROR] {msg}")


def find_per_hex_file(hex_num: int, hexagrams_dir: Path) -> Path:
    """
    Find the per-hexagram file. Try {N}.json first, then {NN}.json, then hx{NN}.json.
    """
    # Try {N}.json
    path1 = hexagrams_dir / f'{hex_num}.json'
    if path1.exists():
        return path1
    
    # Try {NN}.json (zero-padded)
    path2 = hexagrams_dir / f'{hex_num:02d}.json'
    if path2.exists():
        return path2
    
    # Try hx{NN}.json (zero-padded with prefix)
    path3 = hexagrams_dir / f'hx{hex_num:02d}.json'
    if path3.exists():
        return path3
    
    return None


def sync_hexagram(hex_num: int, index_data: dict, per_hex_data: dict) -> dict:
    """
    Sync Legge quotes from index into per-hexagram file.
    
    Returns updated per-hex data.
    """
    updated = per_hex_data.copy()
    
    # Sync hexagram-level: core_meaning.legge_1899_public_domain
    if 'core_meaning' not in updated:
        updated['core_meaning'] = {}
    
    # Use raw_text from index (but keep normalized_summary)
    if 'raw_text' in index_data:
        updated['core_meaning']['legge_1899_public_domain'] = index_data['raw_text']
    
    # Sync line-level
    if 'lines' not in updated:
        updated['lines'] = []
    
    # Ensure lines is an array
    if not isinstance(updated['lines'], list):
        log_warning(f"Hexagram {hex_num}: lines is not an array, converting")
        updated['lines'] = []
    
    # Get index lines
    index_lines = index_data.get('lines', {})
    
    # Process each line (1-6)
    for line_num in range(1, 7):
        line_num_str = str(line_num)
        
        # Get index line text
        if line_num_str not in index_lines:
            log_warning(f"Hexagram {hex_num}, line {line_num}: not in index")
            continue
        
        index_line_text = index_lines[line_num_str].get('raw', '')
        if not index_line_text:
            log_warning(f"Hexagram {hex_num}, line {line_num}: empty in index")
            continue
        
        # Find or create line entry in per-hex file
        line_entry = None
        for entry in updated['lines']:
            if entry.get('line') == line_num:
                line_entry = entry
                break
        
        if not line_entry:
            # Create new line entry
            line_entry = {
                'line': line_num,
                'translations': [],
                'normalized_meaning': '',
                'keywords': []
            }
            updated['lines'].append(line_entry)
        
        # Ensure translations array exists
        if 'translations' not in line_entry:
            line_entry['translations'] = []
        
        # Find or create Legge translation
        legge_trans = None
        for trans in line_entry['translations']:
            if trans.get('translator_id') == 'legge_1899_public_domain':
                legge_trans = trans
                break
        
        if not legge_trans:
            # Create new Legge translation entry
            legge_trans = {
                'translator_id': 'legge_1899_public_domain',
                'text': '',
                'citation_status': 'public_domain'
            }
            line_entry['translations'].insert(0, legge_trans)  # Put Legge first
        
        # Update the text
        legge_trans['text'] = index_line_text
    
    # Sort lines by line number
    updated['lines'].sort(key=lambda x: x.get('line', 0))
    
    # Add/update verification metadata
    if '_meta' not in updated:
        updated['_meta'] = {}
    
    updated['_meta']['verification'] = 'legge-1899.sync.v1'
    updated['_meta']['verified_at'] = datetime.utcnow().isoformat() + 'Z'
    
    # Add Legge source metadata
    updated['_meta']['legge_source'] = {
        'index_file': 's3-data/hexagrams/legge-hx.json',
        'leaf_start': index_data.get('source_leaf_start'),
        'leaf_end': index_data.get('source_leaf_end'),
        'page_candidates': index_data.get('source_page_candidates', []),
        'page_confidence': index_data.get('source_page_confidence', 0)
    }
    
    return updated


def main():
    """Main execution."""
    parser = argparse.ArgumentParser(description='Sync Legge quotes into per-hexagram files')
    parser.add_argument('--write-candidates', action='store_true',
                       help='Write to candidates folder')
    args = parser.parse_args()
    
    if not args.write_candidates:
        log_error("Must specify --write-candidates flag")
        log_error("Usage: python3 06c-sync-legge-into-hex-files.py --write-candidates")
        sys.exit(1)
    
    log_info("=" * 60)
    log_info("TASK: Sync Legge Quotes into Per-Hexagram Files")
    log_info("=" * 60)
    
    # Paths
    index_path = S3_DATA_ROOT / 'hexagrams' / 'legge-hx.json'
    hexagrams_dir = S3_DATA_ROOT / 'hexagrams'
    candidates_dir = hexagrams_dir / '_candidate'
    
    # Check index exists
    if not index_path.exists():
        log_error(f"Index not found: {index_path}")
        sys.exit(1)
    
    # Load index
    log_info(f"Loading index from: {index_path}")
    with open(index_path, 'r', encoding='utf-8') as f:
        index = json.load(f)
    
    log_info(f"Loaded {len(index)} hexagrams from index")
    
    # Create candidates directory
    ensure_directory(candidates_dir)
    log_info(f"Writing candidates to: {candidates_dir}")
    
    # Process each hexagram
    synced_count = 0
    missing_count = 0
    
    for hex_num in range(1, 65):
        hex_num_str = str(hex_num)
        
        # Get index data
        if hex_num_str not in index:
            log_warning(f"Hexagram {hex_num}: not in index")
            missing_count += 1
            continue
        
        index_data = index[hex_num_str]
        
        # Find per-hex file
        per_hex_path = find_per_hex_file(hex_num, hexagrams_dir)
        
        if not per_hex_path:
            log_warning(f"Hexagram {hex_num}: per-hex file not found")
            missing_count += 1
            continue
        
        # Load per-hex file
        log_info(f"Processing hexagram {hex_num}: {per_hex_path.name}")
        with open(per_hex_path, 'r', encoding='utf-8') as f:
            per_hex_data = json.load(f)
        
        # Sync
        updated_data = sync_hexagram(hex_num, index_data, per_hex_data)
        
        # Write to candidates
        candidate_path = candidates_dir / f'{hex_num}.json'
        with open(candidate_path, 'w', encoding='utf-8') as f:
            json.dump(updated_data, f, indent=2, ensure_ascii=False)
        
        synced_count += 1
    
    # Summary
    log_info("=" * 60)
    log_info("SUMMARY")
    log_info("=" * 60)
    log_info(f"Synced: {synced_count}")
    log_info(f"Missing: {missing_count}")
    log_info(f"Candidates written to: {candidates_dir}")
    log_info("=" * 60)
    log_info("Next steps:")
    log_info("1. Validate: python3 lore-research/scripts/07b-validate-hexagrams.py --dir s3-data/hexagrams/_candidate")
    log_info("2. Promote: python3 lore-research/scripts/promote_hex_candidates.py --from s3-data/hexagrams/_candidate --to s3-data/hexagrams")


if __name__ == '__main__':
    main()
