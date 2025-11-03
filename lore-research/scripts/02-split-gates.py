#!/usr/bin/env python3
"""
Stage 2: Gate Block Detector (Task 3.1)

Reads normalized Line Companion text and splits it into 64 gate blocks.
Validates gate count and logs missing gates to BAD_LINES.md.
Optionally estimates page ranges from scandata if available.

Requirements: FR-LC-3
"""

import re
import sys
from pathlib import Path
from datetime import datetime

from config import (
    LINE_COMPANION_NORMALIZED,
    LINE_COMPANION_GATES,
    LINE_COMPANION_DIR,
    BAD_LINES_FILE,
    MIN_GATES_REQUIRED,
    EXPECTED_GATES,
    GATE_HEADING_PATTERNS,
)
from utils import (
    setup_logging,
    read_text_file,
    read_json_file,
    write_json_file,
    write_text_file,
    log_bad_line,
    ensure_directory,
)


def detect_gate_headings(text, logger):
    """
    Detect all gate headings in the text using patterns from config.
    First match wins per line.
    
    Returns list of tuples: (gate_num, byte_offset, line_number, heading_text)
    """
    headings = []
    lines = text.split("\n")
    current_byte_pos = 0
    
    for line_num, line in enumerate(lines, 1):
        # Loop over all gate heading patterns - first match wins
        for pattern in GATE_HEADING_PATTERNS:
            match = re.match(pattern, line, re.IGNORECASE)
            if match:
                gate_num = int(match.group(1))
                headings.append((gate_num, current_byte_pos, line_num, line.strip()))
                logger.debug(f"Found gate {gate_num} at line {line_num}, byte {current_byte_pos}: {line.strip()}")
                break  # First match wins
        current_byte_pos += len(line) + 1  # +1 for newline
    
    return headings


def extract_gate_blocks(text, headings, logger):
    """Extract text blocks between gate headings."""
    gates = {}
    
    for i, (gate_num, start_pos, start_line, heading_text) in enumerate(headings):
        if i + 1 < len(headings):
            end_pos = headings[i + 1][1]
            end_line = headings[i + 1][2] - 1
        else:
            end_pos = len(text)
            end_line = len(text.split("\n"))
        
        block_text = text[start_pos:end_pos].strip()
        gates[str(gate_num)] = {
            "title": heading_text,
            "text": block_text,
            "byte_offset": start_pos,
            "line_range": [start_line, end_line],
        }
        logger.debug(f"Extracted gate {gate_num}: {len(block_text)} chars, lines {start_line}-{end_line}")
    
    return gates


def estimate_page_hints(gates, scandata, total_text_bytes, logger):
    """
    Estimate page ranges for each gate based on byte offsets.
    
    Args:
        gates: Dictionary of gate data with byte_offset
        scandata: Parsed scandata.json
        total_text_bytes: Total bytes in normalized.txt
        logger: Logger instance
    
    Returns:
        Dictionary mapping gate_num -> page_hint dict
    """
    if not scandata:
        return {}
    
    total_pages = scandata.get("bookData", {}).get("leafCount", 0)
    if total_pages == 0:
        logger.warning("No leafCount in scandata, cannot estimate pages")
        return {}
    
    dpi = scandata.get("bookData", {}).get("dpi", 300)
    page_hints = {}
    
    for gate_num, gate_data in gates.items():
        byte_offset = gate_data.get("byte_offset", 0)
        
        # Simple linear estimation: byte_offset / total_bytes * total_pages
        estimated_page = int((byte_offset / total_text_bytes) * total_pages)
        
        # Estimate a range (±2 pages for safety)
        leaf_start = max(0, estimated_page - 2)
        leaf_end = min(total_pages - 1, estimated_page + 2)
        
        page_hints[gate_num] = {
            "leaf_start": leaf_start,
            "leaf_end": leaf_end,
            "dpi": dpi,
            "estimation_method": "linear_byte_offset",
        }
        
        logger.debug(f"Gate {gate_num}: estimated pages {leaf_start}-{leaf_end}")
    
    return page_hints


def validate_gates(gates, logger):
    """
    Validate gate count and identify missing gates.
    
    Returns: (is_valid, detected_count, missing_gates)
    - is_valid: False if <60 gates, True otherwise
    - detected_count: number of gates found
    - missing_gates: sorted list of missing gate numbers
    """
    detected_count = len(gates)
    expected_gates = set(range(1, EXPECTED_GATES + 1))
    found_gates = set(int(g) for g in gates.keys())
    missing_gates = sorted(expected_gates - found_gates)
    
    logger.info(f"Detected {detected_count} gates")
    
    if missing_gates:
        logger.warning(f"Missing gates: {missing_gates}")
    
    # Validation logic per task requirements:
    # <60 → exit 1
    # 60-63 → write JSON + warning + BAD_LINES
    # 64 → ✅
    if detected_count < MIN_GATES_REQUIRED:
        logger.error(f"FATAL: Only {detected_count} gates detected (minimum required: {MIN_GATES_REQUIRED})")
        return False, detected_count, missing_gates
    elif detected_count < EXPECTED_GATES:
        logger.warning(f"WARNING: {detected_count} gates detected (expected: {EXPECTED_GATES})")
        return True, detected_count, missing_gates
    else:
        logger.info(f"✅ All {EXPECTED_GATES} gates detected")
        return True, detected_count, missing_gates


def log_missing_gates(missing_gates, logger):
    """
    Log missing gates to BAD_LINES.md.
    
    Format: gate: <N> | source: line-companion-normalized.txt | problem: not found in normalized text | suggestion: check I Ching fallback
    """
    if not missing_gates:
        return
    
    logger.info(f"Logging {len(missing_gates)} missing gates to BAD_LINES.md")
    
    for gate_num in missing_gates:
        log_bad_line(
            gate=gate_num,
            line=0,
            source_tried="line-companion-normalized.txt",
            reason="not found in normalized text",
            suggestion="check I Ching fallback"
        )


def log_page_hint_issues(issues, logger):
    """Log page hint estimation issues to OCR_ISSUES.md."""
    if not issues:
        return
    
    ocr_issues_file = LINE_COMPANION_DIR / "OCR_ISSUES.md"
    logger.info(f"Logging {len(issues)} page hint issues to {ocr_issues_file}")
    
    # Read existing content if file exists
    existing_content = ""
    if ocr_issues_file.exists():
        existing_content = read_text_file(ocr_issues_file)
    
    # Append new issues
    new_content = existing_content
    if not existing_content:
        new_content = "# OCR and Processing Issues\n\n"
        new_content += "Issues detected during quote extraction pipeline.\n\n"
    
    new_content += "\n## Page Hint Estimation Issues\n\n"
    for issue in issues:
        new_content += f"- {issue}\n"
    
    write_text_file(ocr_issues_file, new_content)


def main():
    """Main execution function."""
    logger = setup_logging(__name__)
    logger.info("=" * 60)
    logger.info("Stage 2: Gate Block Detector (Task 3.1)")
    logger.info("=" * 60)
    
    # Check for normalized.txt - fail with clear message if missing
    if not LINE_COMPANION_NORMALIZED.exists():
        logger.error(f"ERROR: {LINE_COMPANION_NORMALIZED} not found")
        logger.error("Please run 01-normalize-line-companion.py first")
        sys.exit(1)
    
    logger.info(f"Reading: {LINE_COMPANION_NORMALIZED}")
    
    try:
        text = read_text_file(LINE_COMPANION_NORMALIZED)
        total_bytes = len(text)
        logger.info(f"Loaded {total_bytes:,} characters")
        
        logger.info("Detecting gate headings using patterns from config.GATE_HEADING_PATTERNS...")
        headings = detect_gate_headings(text, logger)
        logger.info(f"Found {len(headings)} gate headings")
        
        if not headings:
            logger.error("FATAL: No gate headings detected")
            sys.exit(1)
        
        logger.info("Extracting text blocks between gate headings...")
        gates = extract_gate_blocks(text, headings, logger)
        
        logger.info("Validating gate count...")
        is_valid, detected_count, missing_gates = validate_gates(gates, logger)
        
        # Per task requirements: <60 → exit 1
        if not is_valid:
            logger.error("Validation failed: insufficient gates detected")
            sys.exit(1)
        
        # Log missing gates to BAD_LINES.md
        if missing_gates:
            log_missing_gates(missing_gates, logger)
        
        # Try to load scandata and estimate page hints
        scandata_file = LINE_COMPANION_DIR / "scandata.json"
        page_hints = {}
        page_hint_issues = []
        
        if scandata_file.exists():
            logger.info(f"Loading scandata from: {scandata_file}")
            try:
                scandata = read_json_file(scandata_file)
                logger.info("Estimating page ranges for gates based on byte/line offset...")
                page_hints = estimate_page_hints(gates, scandata, total_bytes, logger)
                
                if page_hints:
                    logger.info(f"✅ Estimated page hints for {len(page_hints)} gates")
                else:
                    issue = "Failed to estimate page hints (scandata may be incomplete)"
                    logger.warning(issue)
                    page_hint_issues.append(issue)
            except Exception as e:
                issue = f"Error loading scandata: {e}"
                logger.warning(issue)
                page_hint_issues.append(issue)
        else:
            issue = f"Scandata not found at {scandata_file}, skipping page hint estimation"
            logger.info(issue)
            page_hint_issues.append(issue)
        
        # Log page hint issues to OCR_ISSUES.md (do NOT error)
        if page_hint_issues:
            log_page_hint_issues(page_hint_issues, logger)
        
        # Build output with _meta block
        output = {
            "_meta": {
                "detected_gates": detected_count,
                "missing_gates": missing_gates,
                "source_file": str(LINE_COMPANION_NORMALIZED.relative_to(Path.cwd())),
                "created_at": datetime.utcnow().isoformat() + "Z",
            }
        }
        
        # Add page_hint info to _meta if available
        if page_hints:
            output["_meta"]["page_hints_available"] = True
            output["_meta"]["page_hints_count"] = len(page_hints)
        else:
            output["_meta"]["page_hints_available"] = False
        
        # Add gates with page hints if available
        for gate_num, gate_data in gates.items():
            gate_output = {
                "title": gate_data["title"],
                "raw_text": gate_data["text"],
            }
            
            # Add page hint if available (attach to gates.json under _meta.page_hint)
            if gate_num in page_hints:
                gate_output["_meta"] = {
                    "page_hint": page_hints[gate_num]
                }
            
            output[gate_num] = gate_output
        
        ensure_directory(LINE_COMPANION_GATES.parent)
        write_json_file(LINE_COMPANION_GATES, output)
        logger.info(f"✅ Wrote gates to: {LINE_COMPANION_GATES}")
        
        # Per task requirements:
        # 60-63 → write JSON + warning + BAD_LINES
        # 64 → ✅
        if detected_count == EXPECTED_GATES:
            logger.info("✅ SUCCESS: All 64 gates extracted")
            sys.exit(0)
        else:
            logger.warning(f"⚠️  WARNING: {detected_count}/{EXPECTED_GATES} gates extracted")
            logger.warning(f"Missing gates logged to: {BAD_LINES_FILE}")
            sys.exit(0)
    
    except Exception as e:
        logger.error(f"FATAL ERROR: {e}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    main()
