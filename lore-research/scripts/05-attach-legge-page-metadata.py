#!/usr/bin/env python3
"""
Attach Legge page/leaf metadata to hexagram index.

Reads page map from s3-data/236066-The I Ching_page_numbers.json and
estimates which leaf range each hexagram came from, attaching metadata
to s3-data/hexagrams/legge-hx.json.

Task 2.5 from quote-extraction spec.
"""

import json
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


def load_page_map(page_map_path: Path) -> dict:
    """
    Load page map and build lookup: leafNum -> {confidence, ocr_value, pageNumber}
    """
    log_info(f"Loading page map from: {page_map_path}")
    
    with open(page_map_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Build lookup dictionary
    lookup = {}
    for entry in data.get('pages', []):
        leaf_num = entry.get('leafNum')
        if leaf_num:
            lookup[leaf_num] = {
                'confidence': entry.get('confidence', 0),
                'ocr_value': entry.get('ocr_value', []),
                'pageNumber': entry.get('pageNumber', '')
            }
    
    log_info(f"Loaded {len(lookup)} page map entries")
    return lookup


def estimate_leaf_range(hex_num: int, total_hexagrams: int = 64, 
                       total_leaves: int = 500) -> tuple:
    """
    Estimate leaf range for a hexagram based on its position.
    
    This is a rough estimate assuming hexagrams are distributed
    somewhat evenly through the document.
    
    Returns: (leaf_start, leaf_end) or (None, None) if can't estimate
    """
    # Rough estimate: divide total leaves by number of hexagrams
    # Account for front matter (first ~50 leaves are often intro/TOC)
    front_matter_leaves = 50
    content_leaves = total_leaves - front_matter_leaves
    
    leaves_per_hexagram = content_leaves / total_hexagrams
    
    # Estimate start and end
    leaf_start = int(front_matter_leaves + (hex_num - 1) * leaves_per_hexagram)
    leaf_end = int(front_matter_leaves + hex_num * leaves_per_hexagram)
    
    return (leaf_start, leaf_end)


def get_page_candidates(page_map: dict, leaf_start: int, leaf_end: int) -> tuple:
    """
    Get page number candidates for a leaf range.
    
    Returns: (page_candidates, confidence)
    """
    candidates = []
    confidences = []
    
    for leaf_num in range(leaf_start, leaf_end + 1):
        if leaf_num in page_map:
            entry = page_map[leaf_num]
            ocr_values = entry.get('ocr_value', [])
            confidence = entry.get('confidence', 0)
            
            # Add OCR values to candidates
            for val in ocr_values:
                if val and val not in candidates:
                    candidates.append(val)
            
            confidences.append(confidence)
    
    # Calculate average confidence
    avg_confidence = sum(confidences) / len(confidences) if confidences else 0
    
    return (candidates, avg_confidence)


def attach_page_metadata(hexagrams: dict, page_map: dict) -> dict:
    """
    Attach page/leaf metadata to each hexagram.
    """
    log_info("Attaching page/leaf metadata to hexagrams...")
    
    # Determine total leaves from page map
    max_leaf = max(page_map.keys()) if page_map else 500
    log_info(f"Max leaf number in page map: {max_leaf}")
    
    updated_count = 0
    failed_count = 0
    
    for hex_num_str, hex_data in hexagrams.items():
        hex_num = int(hex_num_str)
        
        # Estimate leaf range
        leaf_start, leaf_end = estimate_leaf_range(hex_num, total_leaves=max_leaf)
        
        if leaf_start is None or leaf_end is None:
            log_warning(f"Could not estimate leaf range for hexagram {hex_num}")
            hex_data['source_leaf_start'] = None
            hex_data['source_leaf_end'] = None
            hex_data['source_page_candidates'] = []
            hex_data['source_page_confidence'] = 0
            failed_count += 1
            continue
        
        # Get page candidates
        page_candidates, confidence = get_page_candidates(page_map, leaf_start, leaf_end)
        
        # Attach metadata
        hex_data['source_leaf_start'] = leaf_start
        hex_data['source_leaf_end'] = leaf_end
        hex_data['source_page_candidates'] = page_candidates
        hex_data['source_page_confidence'] = round(confidence, 2)
        
        log_info(f"Hexagram {hex_num}: leaves {leaf_start}-{leaf_end}, "
                f"pages {page_candidates}, confidence {confidence:.2f}")
        
        updated_count += 1
    
    log_info(f"✓ Updated {updated_count} hexagrams with page metadata")
    if failed_count > 0:
        log_warning(f"Failed to estimate metadata for {failed_count} hexagrams")
    
    return hexagrams


def log_failures_to_bad_lines(hexagrams: dict):
    """
    Log hexagrams with missing page metadata to BAD_LINES.md
    """
    bad_lines_path = RESEARCH_OUTPUTS_DIR / 'BAD_LINES.md'
    ensure_directory(bad_lines_path.parent)
    
    failures = []
    for hex_num_str, hex_data in hexagrams.items():
        if hex_data.get('source_leaf_start') is None:
            failures.append(hex_num_str)
    
    if not failures:
        return
    
    log_info(f"Logging {len(failures)} failures to {bad_lines_path}")
    
    with open(bad_lines_path, 'a', encoding='utf-8') as f:
        f.write(f"\n## Legge Page Metadata Issues (Task 2.5)\n\n")
        f.write(f"Generated: {datetime.utcnow().isoformat()}Z\n\n")
        for hex_num in failures:
            f.write(f"- hexagram: {hex_num} | source: legge-hx.json | "
                   f"problem: could not estimate leaf range | "
                   f"suggestion: manual review needed\n")


def main():
    """Main execution."""
    log_info("=" * 60)
    log_info("TASK 2.5: Attach Legge Page/Leaf Metadata")
    log_info("=" * 60)
    
    # Input files
    page_map_path = S3_DATA_ROOT / '236066-The I Ching_page_numbers.json'
    hexagrams_path = S3_DATA_ROOT / 'hexagrams' / 'legge-hx.json'
    
    # Check inputs exist
    if not page_map_path.exists():
        log_error(f"Page map not found: {page_map_path}")
        sys.exit(1)
    
    if not hexagrams_path.exists():
        log_error(f"Hexagram index not found: {hexagrams_path}")
        log_error("Please run task 2.4 (04-build-legge-hexagram-index.py) first")
        sys.exit(1)
    
    # Load data
    page_map = load_page_map(page_map_path)
    
    log_info(f"Loading hexagram index from: {hexagrams_path}")
    with open(hexagrams_path, 'r', encoding='utf-8') as f:
        hexagrams = json.load(f)
    
    log_info(f"Loaded {len(hexagrams)} hexagrams")
    
    # Attach metadata
    hexagrams = attach_page_metadata(hexagrams, page_map)
    
    # Log failures
    log_failures_to_bad_lines(hexagrams)
    
    # Write updated hexagrams back
    log_info(f"Writing updated hexagrams to: {hexagrams_path}")
    with open(hexagrams_path, 'w', encoding='utf-8') as f:
        json.dump(hexagrams, f, indent=2, ensure_ascii=False)
    
    log_info("✓ Successfully updated hexagram index with page metadata")
    
    # Summary
    log_info("=" * 60)
    log_info("SUMMARY")
    log_info("=" * 60)
    
    with_metadata = sum(1 for h in hexagrams.values() 
                       if h.get('source_leaf_start') is not None)
    without_metadata = len(hexagrams) - with_metadata
    
    log_info(f"Hexagrams with page metadata: {with_metadata}")
    log_info(f"Hexagrams without page metadata: {without_metadata}")
    
    log_info("=" * 60)
    log_info("Task 2.5 complete!")
    log_info("=" * 60)


if __name__ == '__main__':
    main()
