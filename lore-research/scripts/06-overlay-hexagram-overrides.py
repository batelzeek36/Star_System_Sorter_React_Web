#!/usr/bin/env python3
"""
Overlay hexagram overrides into legge-hx.json.

Reads override files from s3-data/hexagrams/overrides/ and merges them
into the main legge-hx.json index, marking them as "override-paraphrase".

Task 2.5+ from quote-extraction spec.
"""

import json
import sys
import re
from pathlib import Path
from datetime import datetime
from shutil import copy2

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))
from config import S3_DATA_ROOT
from utils import ensure_directory

# Simple logging functions
def log_info(msg: str):
    print(f"[INFO] {msg}")

def log_warning(msg: str):
    print(f"[WARNING] {msg}")

def log_error(msg: str):
    print(f"[ERROR] {msg}")


def normalize_whitespace(text: str) -> str:
    """
    Normalize whitespace in text to reduce false mismatches.
    - Trim leading/trailing whitespace
    - Collapse multiple spaces to single space
    - Normalize line breaks
    """
    if not text:
        return ""
    
    # Collapse multiple spaces
    text = re.sub(r'\s+', ' ', text)
    # Trim
    text = text.strip()
    
    return text


def find_translation_by_id(translations: list, translator_id: str) -> dict:
    """
    Find a translation by translator_id.
    Returns the translation dict or None if not found.
    """
    for trans in translations:
        if trans.get('translator_id') == translator_id:
            return trans
    return None


def convert_override_to_legge_format(override_data: dict, override_path: Path) -> dict:
    """
    Convert an override hexagram file to legge-hx.json format.
    
    Fails fast if required fields are missing.
    """
    hex_num = override_data.get('number')
    if not hex_num:
        raise ValueError(f"Override file {override_path} missing 'number' field")
    
    name = override_data.get('name')
    if not name:
        raise ValueError(f"Override file {override_path} missing 'name' field")
    
    core_meaning = override_data.get('core_meaning', {})
    normalized_summary = core_meaning.get('normalized_summary', '')
    
    lines_array = override_data.get('lines', [])
    if len(lines_array) != 6:
        raise ValueError(f"Override file {override_path} has {len(lines_array)} lines, expected 6")
    
    # Convert lines array to legge-hx format
    lines_dict = {}
    lines_meta_dict = {}
    
    for i, line_data in enumerate(lines_array):
        line_num = i + 1
        line_num_str = str(line_num)
        
        # Verify line number matches
        if line_data.get('line') != line_num:
            log_warning(f"Line {line_num} in {override_path} has mismatched line number: {line_data.get('line')}")
        
        translations = line_data.get('translations', [])
        if not translations:
            raise ValueError(f"Override file {override_path} line {line_num} has no translations")
        
        # Find Legge translation by translator_id
        legge_trans = find_translation_by_id(translations, 'legge_1899_public_domain')
        if not legge_trans:
            raise ValueError(
                f"Override file {override_path} line {line_num} missing "
                f"'legge_1899_public_domain' translation"
            )
        
        legge_text = legge_trans.get('text', '')
        if not legge_text:
            raise ValueError(f"Override file {override_path} line {line_num} has empty Legge text")
        
        # Normalize whitespace
        legge_text = normalize_whitespace(legge_text)
        
        # Create line entry
        lines_dict[line_num_str] = {
            "line": line_num,
            "raw": legge_text
        }
        
        # Find Chinese translation
        chinese_trans = find_translation_by_id(translations, 'chinese_original')
        chinese_text = chinese_trans.get('text', '') if chinese_trans else ''
        
        # Create lines_meta entry
        lines_meta_dict[line_num_str] = {
            "cn": chinese_text,
            "normalized": line_data.get('normalized_meaning', ''),
            "translator_id": "legge_1899_public_domain"
        }
    
    # Build the hexagram entry
    hexagram_entry = {
        "hexagram": hex_num,
        "title": name,
        "raw_text": normalized_summary,
        "lines": lines_dict,
        "lines_meta": lines_meta_dict,
        "_meta": {
            "source": "override-paraphrase",
            "source_file": f"s3-data/hexagrams/overrides/{hex_num}.json",
            "extracted_at": datetime.utcnow().isoformat() + "Z"
        },
        "source_leaf_start": None,
        "source_leaf_end": None,
        "source_page_candidates": [],
        "source_page_confidence": "override-no-map"
    }
    
    return hexagram_entry


def copy_overrides_to_folder(override_nums: list) -> list:
    """
    Copy override files from s3-data/hexagrams/ to s3-data/hexagrams/overrides/
    
    Returns list of successfully copied files.
    """
    source_dir = S3_DATA_ROOT / 'hexagrams'
    target_dir = S3_DATA_ROOT / 'hexagrams' / 'overrides'
    
    ensure_directory(target_dir)
    
    copied = []
    for num in override_nums:
        source_file = source_dir / f'{num}.json'
        target_file = target_dir / f'{num}.json'
        
        if not source_file.exists():
            log_error(f"Source override file not found: {source_file}")
            continue
        
        if target_file.exists():
            log_info(f"Override file already exists: {target_file}")
        else:
            log_info(f"Copying {source_file} → {target_file}")
            copy2(source_file, target_file)
        
        copied.append(num)
    
    return copied


def overlay_hexagrams(legge_hx_path: Path, overrides_dir: Path) -> dict:
    """
    Load legge-hx.json and overlay hexagrams from overrides directory.
    """
    log_info(f"Loading legge-hx.json from: {legge_hx_path}")
    
    with open(legge_hx_path, 'r', encoding='utf-8') as f:
        hexagrams = json.load(f)
    
    log_info(f"Loaded {len(hexagrams)} hexagrams from legge-hx.json")
    
    # Find all override files
    override_files = sorted(overrides_dir.glob('*.json'))
    log_info(f"Found {len(override_files)} override files in {overrides_dir}")
    
    overlaid_count = 0
    
    for override_file in override_files:
        log_info(f"Processing override: {override_file.name}")
        
        try:
            with open(override_file, 'r', encoding='utf-8') as f:
                override_data = json.load(f)
            
            # Convert to legge-hx format
            hexagram_entry = convert_override_to_legge_format(override_data, override_file)
            hex_num_str = str(hexagram_entry['hexagram'])
            
            # Overlay into main index
            hexagrams[hex_num_str] = hexagram_entry
            overlaid_count += 1
            
            log_info(f"✓ Overlaid hexagram {hex_num_str}: {hexagram_entry['title']}")
            
        except Exception as e:
            log_error(f"Failed to process {override_file.name}: {e}")
            raise
    
    log_info(f"✓ Successfully overlaid {overlaid_count} hexagrams")
    
    return hexagrams


def main():
    """Main execution."""
    log_info("=" * 60)
    log_info("TASK 2.5+: Overlay Hexagram Overrides")
    log_info("=" * 60)
    
    # Define paths
    legge_hx_path = S3_DATA_ROOT / 'hexagrams' / 'legge-hx.json'
    overrides_dir = S3_DATA_ROOT / 'hexagrams' / 'overrides'
    
    # Check if legge-hx.json exists
    if not legge_hx_path.exists():
        log_error(f"legge-hx.json not found: {legge_hx_path}")
        log_error("Please run task 2.4 (04-build-legge-hexagram-index.py) first")
        sys.exit(1)
    
    # Copy override files to overrides folder
    override_nums = [22, 52, 53, 58, 61, 62]
    log_info(f"Copying {len(override_nums)} override files to {overrides_dir}")
    copied = copy_overrides_to_folder(override_nums)
    
    if len(copied) != len(override_nums):
        log_error(f"Only copied {len(copied)}/{len(override_nums)} override files")
        sys.exit(1)
    
    log_info(f"✓ All {len(copied)} override files ready")
    
    # Overlay hexagrams
    hexagrams = overlay_hexagrams(legge_hx_path, overrides_dir)
    
    # Write back to legge-hx.json (atomic write)
    temp_path = legge_hx_path.with_suffix('.json.tmp')
    
    log_info(f"Writing updated index to: {temp_path}")
    with open(temp_path, 'w', encoding='utf-8') as f:
        json.dump(hexagrams, f, indent=2, ensure_ascii=False)
    
    # Atomic move
    log_info(f"Moving {temp_path} → {legge_hx_path}")
    temp_path.replace(legge_hx_path)
    
    log_info("✓ Successfully updated legge-hx.json")
    
    # Summary
    log_info("=" * 60)
    log_info("SUMMARY")
    log_info("=" * 60)
    
    total_hexagrams = len(hexagrams)
    override_count = sum(1 for h in hexagrams.values() 
                        if h.get('_meta', {}).get('source') == 'override-paraphrase')
    legge_count = total_hexagrams - override_count
    
    log_info(f"Total hexagrams: {total_hexagrams}")
    log_info(f"  From Legge extraction: {legge_count}")
    log_info(f"  From overrides: {override_count}")
    
    # Check for missing hexagrams
    missing = []
    for i in range(1, 65):
        if str(i) not in hexagrams:
            missing.append(i)
    
    if missing:
        log_warning(f"Missing hexagrams: {missing}")
    else:
        log_info("✓ All 64 hexagrams present!")
    
    # Spot check hexagram 22
    if '22' in hexagrams:
        h22 = hexagrams['22']
        log_info("\nSpot check - Hexagram 22:")
        log_info(f"  Title: {h22.get('title')}")
        log_info(f"  Source: {h22.get('_meta', {}).get('source')}")
        log_info(f"  Lines: {len(h22.get('lines', {}))}")
        log_info(f"  Line 1 text: {h22.get('lines', {}).get('1', {}).get('raw', '')[:50]}...")
    
    log_info("=" * 60)
    log_info("Overlay complete!")
    log_info("=" * 60)
    log_info("\nNext steps:")
    log_info("1. Run: python3 lore-research/scripts/05-attach-legge-page-metadata.py")
    log_info("2. Run: python3 lore-research/scripts/03b-xcheck-with-hexagrams.py")


if __name__ == '__main__':
    main()
