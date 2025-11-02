#!/usr/bin/env python3
"""
Stage 2: Gate Block Detector

Reads normalized Line Companion text and splits it into 64 gate blocks.
"""

import re
import sys

from config import (
    LINE_COMPANION_NORMALIZED,
    LINE_COMPANION_GATES,
    BAD_LINES_FILE,
    MIN_GATES_REQUIRED,
    EXPECTED_GATES,
    GATE_HEADING_PATTERNS,
)
from utils import (
    setup_logging,
    read_text_file,
    write_json_file,
    log_bad_line,
    ensure_directory,
)


def detect_gate_headings(text, logger):
    """Detect all gate headings in the text."""
    headings = []
    lines = text.split("\n")
    current_pos = 0
    
    for line in lines:
        for pattern in GATE_HEADING_PATTERNS:
            match = re.match(pattern, line, re.IGNORECASE)
            if match:
                gate_num = int(match.group(1))
                headings.append((gate_num, current_pos, line.strip()))
                logger.debug(f"Found gate {gate_num}: {line.strip()}")
                break
        current_pos += len(line) + 1
    
    return headings



def extract_gate_blocks(text, headings, logger):
    """Extract text blocks between gate headings."""
    gates = {}
    
    for i, (gate_num, start_pos, heading_text) in enumerate(headings):
        if i + 1 < len(headings):
            end_pos = headings[i + 1][1]
        else:
            end_pos = len(text)
        
        block_text = text[start_pos:end_pos].strip()
        gates[str(gate_num)] = {
            "title": heading_text,
            "text": block_text,
        }
        logger.debug(f"Extracted gate {gate_num}: {len(block_text)} chars")
    
    return gates


def validate_gates(gates, logger):
    """Validate gate count and identify missing gates."""
    detected_count = len(gates)
    expected_gates = set(range(1, EXPECTED_GATES + 1))
    found_gates = set(int(g) for g in gates.keys())
    missing_gates = sorted(expected_gates - found_gates)
    
    logger.info(f"Detected {detected_count} gates")
    
    if missing_gates:
        logger.warning(f"Missing gates: {missing_gates}")
    
    if detected_count < MIN_GATES_REQUIRED:
        logger.error(f"FATAL: Only {detected_count} gates (min: {MIN_GATES_REQUIRED})")
        return False, detected_count, missing_gates
    elif detected_count < EXPECTED_GATES:
        logger.warning(f"WARNING: {detected_count} gates (expected: {EXPECTED_GATES})")
        return True, detected_count, missing_gates
    else:
        logger.info(f"✅ All {EXPECTED_GATES} gates detected")
        return True, detected_count, missing_gates


def log_missing_gates(missing_gates, logger):
    """Log missing gates to BAD_LINES.md."""
    if not missing_gates:
        return
    
    logger.info(f"Logging {len(missing_gates)} missing gates to BAD_LINES.md")
    
    for gate_num in missing_gates:
        log_bad_line(
            gate=gate_num,
            line=0,
            source_tried="Line Companion normalized.txt",
            reason="gate not found in normalized text",
            suggestion="check I Ching fallback or PDF/EPUB manually"
        )



def main():
    """Main execution function."""
    logger = setup_logging(__name__)
    logger.info("=" * 60)
    logger.info("Stage 2: Gate Block Detector")
    logger.info("=" * 60)
    
    if not LINE_COMPANION_NORMALIZED.exists():
        logger.error(f"ERROR: Normalized file not found: {LINE_COMPANION_NORMALIZED}")
        logger.error("Please run 01-normalize-line-companion.py first")
        sys.exit(1)
    
    logger.info(f"Reading: {LINE_COMPANION_NORMALIZED}")
    
    try:
        text = read_text_file(LINE_COMPANION_NORMALIZED)
        logger.info(f"Loaded {len(text)} characters")
        
        logger.info("Detecting gate headings...")
        headings = detect_gate_headings(text, logger)
        logger.info(f"Found {len(headings)} gate headings")
        
        if not headings:
            logger.error("FATAL: No gate headings detected")
            sys.exit(1)
        
        logger.info("Extracting gate blocks...")
        gates = extract_gate_blocks(text, headings, logger)
        
        logger.info("Validating gate count...")
        is_valid, detected_count, missing_gates = validate_gates(gates, logger)
        
        if not is_valid:
            logger.error("Validation failed: insufficient gates detected")
            sys.exit(1)
        
        if missing_gates:
            log_missing_gates(missing_gates, logger)
        
        output = {
            "_meta": {
                "detected_gates": detected_count,
                "missing_gates": missing_gates,
                "source_file": str(LINE_COMPANION_NORMALIZED),
            }
        }
        output.update(gates)
        
        ensure_directory(LINE_COMPANION_GATES.parent)
        write_json_file(LINE_COMPANION_GATES, output)
        logger.info(f"✅ Wrote gates to: {LINE_COMPANION_GATES}")
        
        if detected_count == EXPECTED_GATES:
            logger.info("✅ SUCCESS: All 64 gates extracted")
            sys.exit(0)
        else:
            logger.warning(f"⚠️  WARNING: {detected_count}/{EXPECTED_GATES} gates")
            logger.warning(f"Missing gates logged to: {BAD_LINES_FILE}")
            sys.exit(0)
    
    except Exception as e:
        logger.error(f"FATAL ERROR: {e}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    main()
