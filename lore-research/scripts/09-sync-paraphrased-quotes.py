#!/usr/bin/env python3
"""
09-sync-paraphrased-quotes.py

Sync paraphrased quotes from s3-data/gates/*.json into gate-line-API-call files.
This replaces the long verbatim quotes with clean, legally-safe paraphrased versions
for use in the connecting dots / star system mapping work.

The paraphrased quotes are <25 words and safe to use.
"""

import json
from pathlib import Path
from typing import Dict

from config import JSON_INDENT, JSON_ENSURE_ASCII
from utils import setup_logging

logger = setup_logging(__name__)

# Paths
S3_GATES_DIR = Path("s3-data/gates")
GATE_LINE_API_DIR = Path("lore-research/research-outputs/gate-line-API-call")


def load_s3_gate(gate_num: int) -> Dict:
    """Load a gate file from s3-data/gates/"""
    gate_file = S3_GATES_DIR / f"{gate_num:02d}.json"
    
    if not gate_file.exists():
        logger.warning(f"S3 gate file not found: {gate_file}")
        return {}
    
    with open(gate_file, 'r', encoding='utf-8') as f:
        return json.load(f)


def sync_gate_quotes(gate_num: int) -> bool:
    """
    Sync paraphrased quotes from s3-data gate file to gate-line-API-call file.
    Returns True if successful, False otherwise.
    """
    logger.info(f"Syncing gate {gate_num}...")
    
    # Load S3 gate file (with paraphrased quotes)
    s3_gate = load_s3_gate(gate_num)
    if not s3_gate:
        return False
    
    # Load gate-line-API-call file
    api_file = GATE_LINE_API_DIR / f"gate-line-{gate_num}.json"
    if not api_file.exists():
        logger.warning(f"API file not found: {api_file}")
        return False
    
    with open(api_file, 'r', encoding='utf-8') as f:
        api_data = json.load(f)
    
    # Track changes
    changes = 0
    
    # Sync each line
    for s3_line in s3_gate.get('lines', []):
        line_num = s3_line['line_number']
        line_id = f"{gate_num}.{line_num}"
        
        # Get paraphrased quote
        hd_title = s3_line.get('classical', {}).get('hd_title', '')
        hd_quote = s3_line.get('classical', {}).get('hd_quote', '')
        
        if not hd_title or not hd_quote:
            logger.warning(f"Missing paraphrased quote for {line_id}")
            continue
        
        # Update API data
        if line_id in api_data:
            # Update the paraphrased_quote field
            old_quote = api_data[line_id].get('paraphrased_quote', '')
            
            if old_quote != hd_quote:
                api_data[line_id]['paraphrased_quote'] = hd_quote
                api_data[line_id]['paraphrased_title'] = hd_title
                changes += 1
                logger.debug(f"Updated {line_id}: {hd_title}")
        else:
            logger.warning(f"Line {line_id} not found in API file")
    
    # Write back if changes were made
    if changes > 0:
        with open(api_file, 'w', encoding='utf-8') as f:
            json.dump(api_data, f, indent=JSON_INDENT, ensure_ascii=JSON_ENSURE_ASCII)
        
        logger.info(f"Gate {gate_num}: Updated {changes} lines")
        return True
    else:
        logger.info(f"Gate {gate_num}: No changes needed")
        return True


def main():
    """Main execution"""
    logger.info("=" * 60)
    logger.info("Syncing paraphrased quotes from s3-data/gates to gate-line-API-call")
    logger.info("=" * 60)
    
    # Check directories exist
    if not S3_GATES_DIR.exists():
        logger.error(f"S3 gates directory not found: {S3_GATES_DIR}")
        return 1
    
    if not GATE_LINE_API_DIR.exists():
        logger.error(f"Gate-line API directory not found: {GATE_LINE_API_DIR}")
        return 1
    
    # Process all 64 gates
    success_count = 0
    fail_count = 0
    
    for gate_num in range(1, 65):
        if sync_gate_quotes(gate_num):
            success_count += 1
        else:
            fail_count += 1
    
    # Summary
    logger.info("=" * 60)
    logger.info("Summary:")
    logger.info(f"  Successfully synced: {success_count} gates")
    logger.info(f"  Failed: {fail_count} gates")
    logger.info("=" * 60)
    
    return 0 if fail_count == 0 else 1


if __name__ == "__main__":
    exit(main())
