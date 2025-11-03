#!/usr/bin/env python3
"""
Validate hexagram files.

Checks that all 64 hexagrams are present and have required fields.

Usage:
    python3 07b-validate-hexagrams.py --dir s3-data/hexagrams/_candidate
"""

import json
import sys
import argparse
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))
from config import S3_DATA_ROOT

def log_info(msg: str):
    print(f"[INFO] {msg}")

def log_warning(msg: str):
    print(f"[WARNING] {msg}")

def log_error(msg: str):
    print(f"[ERROR] {msg}")


def validate_hexagram(hex_num: int, data: dict) -> list:
    """
    Validate a single hexagram file.
    
    Returns list of errors (empty if valid).
    """
    errors = []
    
    # Check basic fields
    if 'number' not in data:
        errors.append(f"Missing 'number' field")
    elif data['number'] != hex_num:
        errors.append(f"Number mismatch: expected {hex_num}, got {data['number']}")
    
    if 'name' not in data:
        errors.append(f"Missing 'name' field")
    
    # Check core_meaning
    if 'core_meaning' not in data:
        errors.append(f"Missing 'core_meaning' field")
    else:
        if 'legge_1899_public_domain' not in data['core_meaning']:
            errors.append(f"Missing 'core_meaning.legge_1899_public_domain'")
        elif not data['core_meaning']['legge_1899_public_domain']:
            errors.append(f"Empty 'core_meaning.legge_1899_public_domain'")
    
    # Check lines
    if 'lines' not in data:
        errors.append(f"Missing 'lines' field")
    else:
        lines = data['lines']
        if not isinstance(lines, list):
            errors.append(f"'lines' is not an array")
        else:
            # Check we have 6 lines
            line_nums = [line.get('line') for line in lines]
            expected = list(range(1, 7))
            if sorted(line_nums) != expected:
                errors.append(f"Missing lines: expected {expected}, got {sorted(line_nums)}")
            
            # Check each line has Legge translation
            for line in lines:
                line_num = line.get('line', '?')
                translations = line.get('translations', [])
                
                legge_found = False
                for trans in translations:
                    if trans.get('translator_id') == 'legge_1899_public_domain':
                        legge_found = True
                        if not trans.get('text'):
                            errors.append(f"Line {line_num}: empty Legge text")
                        break
                
                if not legge_found:
                    errors.append(f"Line {line_num}: missing Legge translation")
    
    return errors


def main():
    """Main execution."""
    parser = argparse.ArgumentParser(description='Validate hexagram files')
    parser.add_argument('--dir', required=True, help='Directory containing hexagram files')
    args = parser.parse_args()
    
    hex_dir = Path(args.dir)
    
    if not hex_dir.exists():
        log_error(f"Directory not found: {hex_dir}")
        sys.exit(1)
    
    log_info("=" * 60)
    log_info("TASK: Validate Hexagram Files")
    log_info("=" * 60)
    log_info(f"Validating files in: {hex_dir}")
    
    # Find all hexagram files
    hex_files = {}
    for hex_num in range(1, 65):
        # Try {N}.json
        path = hex_dir / f'{hex_num}.json'
        if path.exists():
            hex_files[hex_num] = path
            continue
        
        # Try hx{NN}.json
        path = hex_dir / f'hx{hex_num:02d}.json'
        if path.exists():
            hex_files[hex_num] = path
    
    log_info(f"Found {len(hex_files)} hexagram files")
    
    # Check for missing
    missing = [i for i in range(1, 65) if i not in hex_files]
    if missing:
        log_error(f"Missing hexagrams: {missing}")
    
    # Validate each file
    total_errors = 0
    for hex_num in range(1, 65):
        if hex_num not in hex_files:
            continue
        
        path = hex_files[hex_num]
        
        try:
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            errors = validate_hexagram(hex_num, data)
            
            if errors:
                log_error(f"Hexagram {hex_num} ({path.name}):")
                for error in errors:
                    log_error(f"  - {error}")
                total_errors += len(errors)
        
        except Exception as e:
            log_error(f"Hexagram {hex_num} ({path.name}): {e}")
            total_errors += 1
    
    # Summary
    log_info("=" * 60)
    log_info("SUMMARY")
    log_info("=" * 60)
    log_info(f"Files validated: {len(hex_files)}")
    log_info(f"Missing files: {len(missing)}")
    log_info(f"Total errors: {total_errors}")
    
    if total_errors == 0 and len(missing) == 0:
        log_info("✓ All hexagrams valid!")
        log_info("=" * 60)
        sys.exit(0)
    else:
        log_error("❌ Validation failed")
        log_info("=" * 60)
        sys.exit(1)


if __name__ == '__main__':
    main()
