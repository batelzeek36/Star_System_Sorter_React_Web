#!/usr/bin/env python3
"""
03-fanout-gates.py

Reads monolithic gates.json and writes each gate to its own file.

Input:
    - lore-research/research-outputs/line-companion/gates.json

Output:
    - lore-research/research-outputs/line-companion/gates/gate-{NN}.json (64 files)
    - Updates BAD_LINES.md for any gates with empty/missing text

Requirements: FR-LC-3, FR-DI-5
"""

import sys
from datetime import datetime, timezone
from pathlib import Path

from config import (
    LINE_COMPANION_GATES,
    LINE_COMPANION_GATES_DIR,
    EXPECTED_GATES,
)
from utils import (
    setup_logging,
    read_json_file,
    write_json_file,
    ensure_directory,
    log_bad_line,
)


def main():
    """Main execution function."""
    logger = setup_logging(__name__)
    
    logger.info("=" * 60)
    logger.info("STAGE 3.2: Gate Fanout")
    logger.info("=" * 60)
    
    # Check if input file exists
    if not LINE_COMPANION_GATES.exists():
        logger.error(f"Input file not found: {LINE_COMPANION_GATES}")
        logger.error("Please run 02-split-gates.py first")
        sys.exit(1)
    
    # Read monolithic gates.json
    logger.info(f"Reading gates from: {LINE_COMPANION_GATES}")
    gates_data = read_json_file(LINE_COMPANION_GATES)
    
    # Extract top-level _meta if present
    top_level_meta = gates_data.get("_meta", {})
    logger.info(f"Top-level metadata: {top_level_meta}")
    
    # Create output directory
    ensure_directory(LINE_COMPANION_GATES_DIR)
    logger.info(f"Output directory: {LINE_COMPANION_GATES_DIR}")
    
    # Track statistics
    gates_written = 0
    gates_with_issues = 0
    empty_gates = []
    
    # Current timestamp for metadata
    created_at = datetime.now(timezone.utc).isoformat()
    
    # Iterate through gates 1-64
    for gate_num in range(1, EXPECTED_GATES + 1):
        gate_key = str(gate_num)
        
        # Check if gate exists in data
        if gate_key not in gates_data:
            logger.warning(f"Gate {gate_num} not found in gates.json")
            log_bad_line(
                gate=gate_num,
                line=0,  # 0 indicates gate-level issue
                source_tried="line-companion-normalized.txt",
                reason="gate not found in gates.json",
                suggestion="check I Ching fallback or re-run 02-split-gates.py"
            )
            empty_gates.append(gate_num)
            gates_with_issues += 1
            continue
        
        gate_data = gates_data[gate_key]
        
        # Extract gate information
        title = gate_data.get("title")
        raw_text = gate_data.get("raw_text", "")
        gate_meta = gate_data.get("_meta", {})
        
        # Check if gate has empty/missing text
        if not raw_text or raw_text.strip() == "":
            logger.warning(f"Gate {gate_num} has empty text")
            log_bad_line(
                gate=gate_num,
                line=0,
                source_tried="line-companion-normalized.txt",
                reason="empty text in gates.json",
                suggestion="check source file or re-run normalization"
            )
            empty_gates.append(gate_num)
            gates_with_issues += 1
        
        # Build individual gate file structure
        gate_file_data = {
            "gate": gate_num,
            "title": title,
            "raw_text": raw_text,
            "lines": {},  # Will be populated by 03a-detect-lines-per-gate.py
            "_meta": {
                "source": "line-companion-normalized.txt",
                "extracted_from": "gates.json",
                "created_at": created_at,
            }
        }
        
        # Copy page_hint from gate-level _meta if present
        if "page_hint" in gate_meta:
            gate_file_data["_meta"]["page_hint"] = gate_meta["page_hint"]
        
        # Write individual gate file
        output_file = LINE_COMPANION_GATES_DIR / f"gate-{gate_num:02d}.json"
        write_json_file(output_file, gate_file_data)
        gates_written += 1
        
        if gate_num % 10 == 0:
            logger.info(f"Processed {gate_num}/{EXPECTED_GATES} gates...")
    
    # Log summary
    logger.info("=" * 60)
    logger.info("FANOUT COMPLETE")
    logger.info("=" * 60)
    logger.info(f"Gates written: {gates_written}/{EXPECTED_GATES}")
    logger.info(f"Gates with issues: {gates_with_issues}")
    
    if empty_gates:
        logger.warning(f"Empty/missing gates: {empty_gates}")
        logger.warning(f"See BAD_LINES.md for details")
    
    logger.info(f"Output directory: {LINE_COMPANION_GATES_DIR}")
    logger.info(f"Monolithic gates.json preserved at: {LINE_COMPANION_GATES}")
    
    # Exit with appropriate code
    if gates_written < EXPECTED_GATES:
        logger.warning(f"Warning: Only {gates_written}/{EXPECTED_GATES} gates written")
        sys.exit(0)  # Don't fail, just warn
    
    logger.info("✓ All gates successfully fanned out")
    sys.exit(0)


if __name__ == "__main__":
    main()
