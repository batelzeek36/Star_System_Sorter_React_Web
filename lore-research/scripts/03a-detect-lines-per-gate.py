#!/usr/bin/env python3
"""
03a-detect-lines-per-gate.py

For each gate-XX.json file, scan raw_text for line headings and populate the "lines" object.
Logs gates with <6 lines to BAD_LINES.md.

Requirements: FR-LC-4, FR-VQ-2
"""

import json
import re
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List, Tuple

from config import (
    LINE_COMPANION_GATES_DIR,
    BAD_LINES_FILE,
    LINES_PER_GATE,
    JSON_INDENT,
    JSON_SORT_KEYS,
    JSON_ENSURE_ASCII,
)
from utils import setup_logging, ensure_directory

logger = setup_logging(__name__)


def detect_line_headings(raw_text: str, gate_number: int) -> Dict[str, Dict[str, str]]:
    """
    Detect line headings in raw_text and extract line content.
    
    Returns dict like:
    {
        "1": {"heading": "Creation is independent of will", "raw": "..."},
        "2": {"heading": "Love is light", "raw": "..."},
        ...
    }
    """
    lines_data = {}
    
    # Pattern to match line headings like "1.1 Creation is independent of will"
    # or "1.2 Love is light" etc.
    # Format: <gate>.<line> <heading text>
    line_pattern = rf"^{gate_number}\.(\d)\s+(.+)$"
    
    # Split text into lines for processing
    text_lines = raw_text.split('\n')
    
    current_line_num = None
    current_heading = None
    current_content = []
    
    for i, text_line in enumerate(text_lines):
        # Check if this line matches a line heading pattern
        match = re.match(line_pattern, text_line.strip())
        
        if match:
            # Save previous line if exists
            if current_line_num is not None:
                lines_data[current_line_num] = {
                    "heading": current_heading,
                    "raw": '\n'.join(current_content).strip()
                }
            
            # Start new line
            current_line_num = match.group(1)
            current_heading = match.group(2).strip()
            current_content = []
            
        elif current_line_num is not None:
            # Accumulate content for current line
            current_content.append(text_line)
    
    # Save last line if exists
    if current_line_num is not None:
        lines_data[current_line_num] = {
            "heading": current_heading,
            "raw": '\n'.join(current_content).strip()
        }
    
    return lines_data


def log_to_bad_lines(gate: int, reason: str):
    """Log a gate with issues to BAD_LINES.md"""
    ensure_directory(BAD_LINES_FILE.parent)
    
    # Create file with header if it doesn't exist
    if not BAD_LINES_FILE.exists():
        with open(BAD_LINES_FILE, 'w', encoding='utf-8') as f:
            f.write("# BAD LINES - Manual Review Queue\n\n")
            f.write("This file tracks gate.lines that could not be cleanly extracted.\n\n")
            f.write("Format: `gate: <N> | source: <file> | problem: <description> | suggestion: <action>`\n\n")
            f.write("---\n\n")
    
    # Append the issue
    with open(BAD_LINES_FILE, 'a', encoding='utf-8') as f:
        f.write(f"gate: {gate} | source: line-companion-normalized.txt | problem: {reason} | suggestion: check PDF/EPUB for line headings\n")


def write_json_if_changed(path: Path, data: dict) -> bool:
    """
    Write JSON only if content has changed.
    Returns True if file was written, False if unchanged.
    """
    new_payload = json.dumps(
        data,
        ensure_ascii=JSON_ENSURE_ASCII,
        indent=JSON_INDENT
    )
    
    if path.exists():
        old_payload = path.read_text(encoding='utf-8')
        if old_payload == new_payload:
            return False  # No change, skip write
    
    path.write_text(new_payload, encoding='utf-8')
    return True


def process_gate_file(gate_file: Path) -> Tuple[bool, int]:
    """
    Process a single gate file to detect and populate line data.
    
    Returns (success, lines_found)
    """
    gate_number = int(gate_file.stem.split('-')[1])
    
    logger.info(f"Processing gate {gate_number}...")
    
    # Read gate file
    with open(gate_file, 'r', encoding='utf-8') as f:
        gate_data = json.load(f)
    
    raw_text = gate_data.get('raw_text', '')
    
    if not raw_text:
        logger.warning(f"Gate {gate_number}: No raw_text found")
        log_to_bad_lines(gate_number, "no raw_text in gate file")
        return False, 0
    
    # Detect lines
    lines_data = detect_line_headings(raw_text, gate_number)
    lines_found = len(lines_data)
    
    # Check if we have all 6 lines
    if lines_found < LINES_PER_GATE:
        logger.warning(f"Gate {gate_number}: Found only {lines_found}/6 lines")
        log_to_bad_lines(
            gate_number,
            f"found only {lines_found}/6 lines - incomplete line detection"
        )
    
    # Update gate data with lines
    gate_data['lines'] = lines_data
    
    # Write only if changed
    was_written = write_json_if_changed(gate_file, gate_data)
    if was_written:
        logger.debug(f"Gate {gate_number}: File updated")
    
    logger.info(f"Gate {gate_number}: Detected {lines_found} lines")
    
    return lines_found == LINES_PER_GATE, lines_found


def main():
    """Main execution"""
    logger.info("=" * 60)
    logger.info("Stage 3a: Detect lines per gate")
    logger.info("=" * 60)
    
    # Check if gates directory exists
    if not LINE_COMPANION_GATES_DIR.exists():
        logger.error(f"Gates directory not found: {LINE_COMPANION_GATES_DIR}")
        logger.error("Run 03-fanout-gates.py first")
        return 1
    
    # Get all gate files
    gate_files = sorted(LINE_COMPANION_GATES_DIR.glob("gate-*.json"))
    
    if not gate_files:
        logger.error(f"No gate files found in {LINE_COMPANION_GATES_DIR}")
        return 1
    
    logger.info(f"Found {len(gate_files)} gate files")
    
    # Process each gate
    total_gates = 0
    complete_gates = 0
    total_lines = 0
    
    for gate_file in gate_files:
        success, lines_found = process_gate_file(gate_file)
        total_gates += 1
        total_lines += lines_found
        if success:
            complete_gates += 1
    
    # Summary
    logger.info("=" * 60)
    logger.info("Summary:")
    logger.info(f"  Total gates processed: {total_gates}")
    logger.info(f"  Complete gates (6 lines): {complete_gates}")
    logger.info(f"  Incomplete gates: {total_gates - complete_gates}")
    logger.info(f"  Total lines detected: {total_lines}")
    logger.info(f"  Expected lines: {total_gates * LINES_PER_GATE}")
    
    if total_gates - complete_gates > 0:
        logger.warning(f"  Issues logged to: {BAD_LINES_FILE}")
    
    logger.info("=" * 60)
    
    return 0


if __name__ == "__main__":
    exit(main())
