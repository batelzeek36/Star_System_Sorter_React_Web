#!/usr/bin/env python3
"""
Promote candidate hexagram files to production.

Copies validated files from candidates folder to production folder.

Usage:
    python3 promote_hex_candidates.py --from s3-data/hexagrams/_candidate --to s3-data/hexagrams
"""

import sys
import argparse
from pathlib import Path
from shutil import copy2

def log_info(msg: str):
    print(f"[INFO] {msg}")

def log_warning(msg: str):
    print(f"[WARNING] {msg}")

def log_error(msg: str):
    print(f"[ERROR] {msg}")


def main():
    """Main execution."""
    parser = argparse.ArgumentParser(description='Promote candidate hexagram files')
    parser.add_argument('--from', dest='from_dir', required=True,
                       help='Source directory (candidates)')
    parser.add_argument('--to', dest='to_dir', required=True,
                       help='Target directory (production)')
    parser.add_argument('--dry-run', action='store_true',
                       help='Show what would be done without doing it')
    args = parser.parse_args()
    
    from_dir = Path(args.from_dir)
    to_dir = Path(args.to_dir)
    
    if not from_dir.exists():
        log_error(f"Source directory not found: {from_dir}")
        sys.exit(1)
    
    if not to_dir.exists():
        log_error(f"Target directory not found: {to_dir}")
        sys.exit(1)
    
    log_info("=" * 60)
    log_info("TASK: Promote Hexagram Candidates")
    log_info("=" * 60)
    log_info(f"From: {from_dir}")
    log_info(f"To: {to_dir}")
    
    if args.dry_run:
        log_info("DRY RUN MODE - no files will be modified")
    
    # Find all candidate files
    candidate_files = list(from_dir.glob('*.json'))
    log_info(f"Found {len(candidate_files)} candidate files")
    
    if not candidate_files:
        log_warning("No candidate files found")
        sys.exit(0)
    
    # Promote each file
    promoted_count = 0
    
    for candidate_path in sorted(candidate_files):
        target_path = to_dir / candidate_path.name
        
        log_info(f"Promoting: {candidate_path.name}")
        
        if not args.dry_run:
            copy2(candidate_path, target_path)
            promoted_count += 1
        else:
            log_info(f"  Would copy: {candidate_path} → {target_path}")
            promoted_count += 1
    
    # Summary
    log_info("=" * 60)
    log_info("SUMMARY")
    log_info("=" * 60)
    
    if args.dry_run:
        log_info(f"Would promote: {promoted_count} files")
    else:
        log_info(f"Promoted: {promoted_count} files")
        log_info("✓ Promotion complete!")
    
    log_info("=" * 60)


if __name__ == '__main__':
    main()
