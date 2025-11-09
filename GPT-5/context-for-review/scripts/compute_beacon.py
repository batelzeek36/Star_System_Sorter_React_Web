#!/usr/bin/env python3
"""
Compute baseline beacon (SHA256 hash, first 8 characters) for the baseline file.

This script computes the deterministic hash of the combined-baselines-4.2.json file
to ensure reproducible scoring across runs. The beacon is used in all output files
to verify that the same baseline was used.

Usage:
    python compute_beacon.py [baseline_file]

If no file is specified, defaults to ../combined-baselines-4.2.json
"""

import hashlib
import json
import sys
from pathlib import Path


def compute_beacon(baseline_path: Path) -> str:
    """
    Compute SHA256 hash (first 8 chars) of baseline file.
    
    Args:
        baseline_path: Path to combined-baselines-4.2.json
        
    Returns:
        First 8 characters of SHA256 hash
        
    Raises:
        FileNotFoundError: If baseline file doesn't exist
        json.JSONDecodeError: If baseline file is invalid JSON
    """
    if not baseline_path.exists():
        raise FileNotFoundError(f"Baseline file not found: {baseline_path}")
    
    # Read and parse JSON to ensure it's valid
    with open(baseline_path, 'r', encoding='utf-8') as f:
        baseline_data = json.load(f)
    
    # Compute hash of the canonical JSON representation
    # Use sort_keys and no whitespace for deterministic output
    canonical_json = json.dumps(baseline_data, sort_keys=True, separators=(',', ':'))
    hash_bytes = hashlib.sha256(canonical_json.encode('utf-8')).hexdigest()
    
    # Return first 8 characters
    beacon = hash_bytes[:8]
    
    return beacon


def main():
    """Main entry point."""
    # Determine baseline file path
    if len(sys.argv) > 1:
        baseline_path = Path(sys.argv[1])
    else:
        # Default to ../combined-baselines-4.2.json relative to script location
        script_dir = Path(__file__).parent
        baseline_path = script_dir.parent / "combined-baselines-4.2.json"
    
    try:
        beacon = compute_beacon(baseline_path)
        print(f"Baseline file: {baseline_path}")
        print(f"Baseline beacon: {beacon}")
        return 0
    except FileNotFoundError as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1
    except json.JSONDecodeError as e:
        print(f"ERROR: Invalid JSON in baseline file: {e}", file=sys.stderr)
        return 1
    except Exception as e:
        print(f"ERROR: Unexpected error: {e}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
