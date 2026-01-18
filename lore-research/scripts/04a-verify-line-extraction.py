#!/usr/bin/env python3
"""
04a-verify-line-extraction.py

Verify that all gate files have line data populated correctly.
Check that each gate has exactly 6 lines (or is logged in BAD_LINES.md).
Validate line heading format and content.

Requirements: FR-LC-4, FR-LC-5
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Tuple, Set

from config import (
    LINE_COMPANION_GATES_DIR,
    BAD_LINES_FILE,
    LINES_PER_GATE,
)
from utils import setup_logging, ensure_directory

logger = setup_logging(__name__)


def validate_line_heading(heading: str, gate: int, line: int) -> List[str]:
    """
    Validate line heading format and content.
    Returns list of issues found (empty if valid).
    """
    issues = []
    
    if not heading:
        issues.append("empty heading")
        return issues
    
    # Check for reasonable length (not too short, not too long)
    if len(heading) < 3:
        issues.append(f"heading too short: '{heading}'")
    elif len(heading) > 200:
        issues.append(f"heading too long ({len(heading)} chars)")
    
    # Check for OCR artifacts
    ocr_artifacts = [
        r'\d{3,}',  # Long number sequences
        r'[^\x00-\x7F]{5,}',  # Long non-ASCII sequences
        r'[|]{2,}',  # Multiple pipes
        r'_{3,}',  # Multiple underscores
    ]
    
    for pattern in ocr_artifacts:
        if re.search(pattern, heading):
            issues.append(f"possible OCR artifact in heading: {pattern}")
    
    return issues


def validate_line_content(raw: str, gate: int, line: int) -> List[str]:
    """
    Validate line raw content.
    Returns list of issues found (empty if valid).
    """
    issues = []
    
    if not raw:
        issues.append("empty raw content")
        return issues
    
    # Check for minimum content length
    if len(raw) < 50:
        issues.append(f"raw content too short ({len(raw)} chars)")
    
    # Check for maximum content length (might indicate extraction error)
    if len(raw) > 10000:
        issues.append(f"raw content suspiciously long ({len(raw)} chars)")
    
    return issues


def check_gate_file(gate_file: Path) -> Tuple[bool, Dict]:
    """
    Check a single gate file for completeness and validity.
    
    Returns (is_valid, report_dict)
    """
    gate_number = int(gate_file.stem.split('-')[1])
    
    report = {
        'gate': gate_number,
        'file': str(gate_file),
        'has_lines': False,
        'lines_found': 0,
        'lines_expected': LINES_PER_GATE,
        'missing_lines': [],
        'issues': []
    }
    
    try:
        with open(gate_file, 'r', encoding='utf-8') as f:
            gate_data = json.load(f)
    except json.JSONDecodeError as e:
        report['issues'].append(f"JSON decode error: {e}")
        return False, report
    except Exception as e:
        report['issues'].append(f"Error reading file: {e}")
        return False, report
    
    # Check if lines object exists
    if 'lines' not in gate_data:
        report['issues'].append("no 'lines' object in gate file")
        return False, report
    
    report['has_lines'] = True
    lines = gate_data['lines']
    
    # Check line count
    report['lines_found'] = len(lines)
    
    # Check for all expected lines (1-6)
    expected_lines = set(str(i) for i in range(1, LINES_PER_GATE + 1))
    found_lines = set(lines.keys())
    
    missing = expected_lines - found_lines
    if missing:
        report['missing_lines'] = sorted(missing, key=int)
        report['issues'].append(f"missing lines: {', '.join(sorted(missing, key=int))}")
    
    # Check for unexpected line numbers
    unexpected = found_lines - expected_lines
    if unexpected:
        report['issues'].append(f"unexpected line numbers: {', '.join(sorted(unexpected, key=int))}")
    
    # Validate each line
    for line_num, line_data in lines.items():
        if not isinstance(line_data, dict):
            report['issues'].append(f"line {line_num}: not a dict")
            continue
        
        # Check required fields
        if 'heading' not in line_data:
            report['issues'].append(f"line {line_num}: missing 'heading' field")
        else:
            heading_issues = validate_line_heading(
                line_data['heading'], 
                gate_number, 
                int(line_num)
            )
            for issue in heading_issues:
                report['issues'].append(f"line {line_num}: {issue}")
        
        if 'raw' not in line_data:
            report['issues'].append(f"line {line_num}: missing 'raw' field")
        else:
            content_issues = validate_line_content(
                line_data['raw'],
                gate_number,
                int(line_num)
            )
            for issue in content_issues:
                report['issues'].append(f"line {line_num}: {issue}")
    
    # Check if raw_text is still present (for provenance)
    if 'raw_text' not in gate_data:
        report['issues'].append("missing 'raw_text' field (provenance)")
    
    # Check _meta
    if '_meta' not in gate_data:
        report['issues'].append("missing '_meta' field")
    
    is_valid = (
        report['lines_found'] == LINES_PER_GATE and
        len(report['missing_lines']) == 0 and
        len(report['issues']) == 0
    )
    
    return is_valid, report


def check_bad_lines_file() -> Set[int]:
    """
    Check BAD_LINES.md for gates that are already logged.
    Returns set of gate numbers that are logged.
    """
    logged_gates = set()
    
    if not BAD_LINES_FILE.exists():
        return logged_gates
    
    with open(BAD_LINES_FILE, 'r', encoding='utf-8') as f:
        for line in f:
            # Parse lines like: "gate: 27 | source: ... | problem: ..."
            match = re.match(r'gate:\s*(\d+)\s*\|', line)
            if match:
                logged_gates.add(int(match.group(1)))
    
    return logged_gates


def main():
    """Main execution"""
    logger.info("=" * 60)
    logger.info("Stage 4.1: Verify line extraction completeness")
    logger.info("=" * 60)
    
    # Check if gates directory exists
    if not LINE_COMPANION_GATES_DIR.exists():
        logger.error(f"Gates directory not found: {LINE_COMPANION_GATES_DIR}")
        logger.error("Run 03-fanout-gates.py and 03a-detect-lines-per-gate.py first")
        return 1
    
    # Get all gate files
    gate_files = sorted(LINE_COMPANION_GATES_DIR.glob("gate-*.json"))
    
    if not gate_files:
        logger.error(f"No gate files found in {LINE_COMPANION_GATES_DIR}")
        return 1
    
    logger.info(f"Found {len(gate_files)} gate files to verify")
    
    # Check which gates are already logged in BAD_LINES.md
    logged_gates = check_bad_lines_file()
    if logged_gates:
        logger.info(f"Found {len(logged_gates)} gates already logged in BAD_LINES.md")
    
    # Verify each gate
    valid_gates = []
    invalid_gates = []
    reports = []
    
    for gate_file in gate_files:
        is_valid, report = check_gate_file(gate_file)
        reports.append(report)
        
        if is_valid:
            valid_gates.append(report['gate'])
            logger.info(f"✓ Gate {report['gate']:2d}: Valid (6/6 lines)")
        else:
            invalid_gates.append(report['gate'])
            logger.warning(f"✗ Gate {report['gate']:2d}: Issues found")
            
            # Log details
            if report['lines_found'] != LINES_PER_GATE:
                logger.warning(f"    Lines: {report['lines_found']}/{LINES_PER_GATE}")
            
            if report['missing_lines']:
                logger.warning(f"    Missing: {', '.join(report['missing_lines'])}")
            
            for issue in report['issues'][:3]:  # Show first 3 issues
                logger.warning(f"    - {issue}")
            
            if len(report['issues']) > 3:
                logger.warning(f"    ... and {len(report['issues']) - 3} more issues")
            
            # Check if already logged
            if report['gate'] in logged_gates:
                logger.info(f"    (Already logged in BAD_LINES.md)")
            else:
                logger.warning(f"    (NOT logged in BAD_LINES.md - should be added)")
    
    # Summary
    logger.info("=" * 60)
    logger.info("Verification Summary:")
    logger.info(f"  Total gates: {len(gate_files)}")
    logger.info(f"  Valid gates (6/6 lines): {len(valid_gates)}")
    logger.info(f"  Invalid gates: {len(invalid_gates)}")
    logger.info(f"  Gates logged in BAD_LINES.md: {len(logged_gates)}")
    
    # Calculate total lines
    total_lines = sum(r['lines_found'] for r in reports)
    expected_lines = len(gate_files) * LINES_PER_GATE
    logger.info(f"  Total lines found: {total_lines}/{expected_lines}")
    
    # Check for gates that should be logged but aren't
    should_be_logged = set(invalid_gates) - logged_gates
    if should_be_logged:
        logger.warning(f"  Gates with issues NOT in BAD_LINES.md: {sorted(should_be_logged)}")
        logger.warning(f"    Run 03a-detect-lines-per-gate.py to log these")
    
    # Check for gates that are logged but now valid
    false_positives = logged_gates - set(invalid_gates)
    if false_positives:
        logger.info(f"  Gates in BAD_LINES.md but now valid: {sorted(false_positives)}")
        logger.info(f"    These can be removed from BAD_LINES.md")
    
    logger.info("=" * 60)
    
    # Detailed report for invalid gates
    if invalid_gates:
        logger.info("")
        logger.info("Detailed Issues:")
        logger.info("-" * 60)
        
        for report in reports:
            if report['gate'] in invalid_gates:
                logger.info(f"\nGate {report['gate']}:")
                logger.info(f"  Lines: {report['lines_found']}/{LINES_PER_GATE}")
                
                if report['missing_lines']:
                    logger.info(f"  Missing lines: {', '.join(report['missing_lines'])}")
                
                if report['issues']:
                    logger.info(f"  Issues:")
                    for issue in report['issues']:
                        logger.info(f"    - {issue}")
    
    # Exit code
    if invalid_gates:
        logger.warning(f"\n⚠ Verification failed: {len(invalid_gates)} gates have issues")
        return 1
    else:
        logger.info(f"\n✓ Verification passed: All {len(valid_gates)} gates are valid")
        return 0


if __name__ == "__main__":
    exit(main())
