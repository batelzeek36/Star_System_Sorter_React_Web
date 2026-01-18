#!/usr/bin/env python3
"""
Verify quotes in evidence files against source texts.

This script validates:
- Quote length (≤25 words)
- Verbatim matching against source files
- Locator format and accuracy
- Legge same-line requirement for weights >0.50
- Line Companion line-agnostic matching within gate

See: GPT-5/docs/QUOTE_VALIDATION_RULES.md for canonical rules and error formats.

Usage:
    python verify_quotes.py GATE_NUMBER
    python verify_quotes.py 01
"""

import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path
from typing import Dict, List, Tuple, Optional


def normalize_text(text: str) -> str:
    """
    Apply minimal normalization for verbatim matching.
    
    - Unicode normalization (NFKC)
    - Normalize smart quotes/apostrophes to straight ASCII
    - Collapse internal whitespace runs to single space
    - Strip leading/trailing whitespace
    """
    # Unicode normalization
    text = unicodedata.normalize('NFKC', text)
    
    # Normalize all variants of smart quotes and apostrophes to straight ASCII
    # Left/right single quotes
    text = text.replace('\u2018', "'")  # '
    text = text.replace('\u2019', "'")  # '
    text = text.replace('\u201a', "'")  # ‚
    text = text.replace('\u201b', "'")  # ‛
    
    # Left/right double quotes
    text = text.replace('\u201c', '"')  # "
    text = text.replace('\u201d', '"')  # "
    text = text.replace('\u201e', '"')  # „
    text = text.replace('\u201f', '"')  # ‟
    
    # Prime marks (sometimes used as quotes)
    text = text.replace('\u2032', "'")  # ′
    text = text.replace('\u2033', '"')  # ″
    
    # Em-dash and en-dash to hyphen
    text = text.replace('\u2014', '-')  # —
    text = text.replace('\u2013', '-')  # –
    
    # Collapse whitespace
    text = re.sub(r'\s+', ' ', text)
    
    # Strip leading/trailing
    text = text.strip()
    
    return text


def count_words(text: str) -> int:
    """
    Count words according to specified rules.
    
    - Tokenize on whitespace
    - Collapse consecutive whitespace
    - Hyphenated words count as 1 word
    - Contractions count as 1 word
    - Em-dashes and en-dashes treated as word separators
    - Punctuation alone is not a word
    """
    # Apply Unicode normalization
    text = unicodedata.normalize('NFKC', text)
    
    # Replace em-dashes and en-dashes with spaces (word separators)
    text = text.replace('—', ' ').replace('–', ' ')
    
    # Collapse whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Split on whitespace
    tokens = text.split()
    
    # Filter out punctuation-only tokens
    words = []
    for token in tokens:
        # Remove leading/trailing punctuation but keep internal punctuation
        # (for contractions and hyphenated words)
        if re.search(r'[a-zA-Z0-9]', token):
            words.append(token)
    
    return len(words)


def parse_legge_locator(locator: str) -> Optional[Tuple[int, int]]:
    """
    Parse Legge locator format: "Hex {NN}, Line {L}"
    
    Returns (gate, line) tuple or None if invalid.
    """
    match = re.match(r'Hex\s+(\d+),\s+Line\s+(\d+)', locator, re.IGNORECASE)
    if not match:
        return None
    
    gate = int(match.group(1))
    line = int(match.group(2))
    
    if gate < 1 or gate > 64 or line < 1 or line > 6:
        return None
    
    return (gate, line)


def parse_line_companion_locator(locator: str) -> Optional[Tuple[int, int]]:
    """
    Parse Line Companion locator format: "Gate {N}, Line {L}"
    
    Returns (gate, line) tuple or None if invalid.
    """
    match = re.match(r'Gate\s+(\d+),\s+Line\s+(\d+)', locator, re.IGNORECASE)
    if not match:
        return None
    
    gate = int(match.group(1))
    line = int(match.group(2))
    
    if gate < 1 or gate > 64 or line < 1 or line > 6:
        return None
    
    return (gate, line)


def load_legge_source(gate: int) -> Dict:
    """Load Legge I Ching hexagram source file."""
    script_dir = Path(__file__).parent
    project_root = script_dir.parent.parent
    
    # Try multiple possible locations
    possible_paths = [
        project_root / "claude" / "I-Ching-Full-Pass" / f"hexagram-{gate:02d}.json",
        project_root / "s3-data" / "hexagrams" / f"{gate:02d}.json",
    ]
    
    for path in possible_paths:
        if path.exists():
            with open(path, 'r', encoding='utf-8') as f:
                return json.load(f)
    
    raise FileNotFoundError(f"Legge source not found for hexagram {gate}")


def load_line_companion_source(gate: int) -> Dict:
    """Load Line Companion gate source file."""
    script_dir = Path(__file__).parent
    project_root = script_dir.parent.parent
    
    # Try multiple possible locations
    possible_paths = [
        project_root / "claude" / "Full Pass" / f"gate-{gate}-full.json",
        project_root / "s3-data" / "gates" / f"{gate:02d}.json",
        project_root / "lore-research" / "research-outputs" / "line-companion" / "gates" / f"gate-{gate:02d}.json",
    ]
    
    for path in possible_paths:
        if path.exists():
            with open(path, 'r', encoding='utf-8') as f:
                return json.load(f)
    
    raise FileNotFoundError(f"Line Companion source not found for gate {gate}")


def find_quote_in_legge(quote: str, legge_data: Dict, expected_line: int) -> Tuple[bool, Optional[int]]:
    """
    Find quote in Legge source and return (found, actual_line).
    
    Returns:
        (True, line_number) if found
        (False, None) if not found
    """
    normalized_quote = normalize_text(quote)
    
    # Check each line
    for line_obj in legge_data.get('lines', []):
        line_num = line_obj.get('line')
        line_text = line_obj.get('legge_line_text', '')
        
        normalized_line = normalize_text(line_text)
        
        if normalized_quote in normalized_line:
            return (True, line_num)
    
    # Also check full_text if available
    full_text = legge_data.get('full_text', '')
    if full_text:
        normalized_full = normalize_text(full_text)
        if normalized_quote in normalized_full:
            # Try to determine which line it's from
            for line_obj in legge_data.get('lines', []):
                line_num = line_obj.get('line')
                line_text = line_obj.get('legge_line_text', '')
                normalized_line = normalize_text(line_text)
                if normalized_quote in normalized_line:
                    return (True, line_num)
            # Found in full text but can't determine line
            return (True, None)
    
    return (False, None)


def find_quote_in_line_companion(quote: str, lc_data: Dict, expected_gate: int) -> Tuple[bool, Optional[int], Optional[int]]:
    """
    Find quote in Line Companion source and return (found, actual_gate, actual_line).
    
    Line Companion quotes are line-agnostic within the gate.
    
    Returns:
        (True, gate, line) if found
        (False, None, None) if not found
    """
    normalized_quote = normalize_text(quote)
    
    gate_num = lc_data.get('gate')
    
    # Check each line's full_text
    for line_obj in lc_data.get('lines', []):
        line_num = line_obj.get('line')
        full_text = line_obj.get('full_text', '')
        
        normalized_text = normalize_text(full_text)
        
        if normalized_quote in normalized_text:
            return (True, gate_num, line_num)
    
    return (False, None, None)


def validate_quote_length(quote: str, line_key: str, star_system: str, source_type: str) -> List[str]:
    """Validate quote is ≤25 words."""
    errors = []
    
    word_count = count_words(quote)
    
    if word_count > 25:
        errors.append(
            f"{line_key} ({star_system}, {source_type}): "
            f"Quote exceeds 25 words (actual: {word_count} words)"
        )
    
    return errors


def validate_legge_quote(
    quote: str,
    locator: str,
    line_key: str,
    star_system: str,
    weight: float,
    legge_data: Dict
) -> List[str]:
    """Validate Legge quote against source."""
    errors = []
    
    # Skip if empty quote (allowed for weights ≤0.50)
    if not quote or len(quote.strip()) == 0:
        if weight > 0.50:
            errors.append(
                f"{line_key} ({star_system}): "
                f"Missing Legge quote for weight >0.50 (weight: {weight}, system: {star_system})"
            )
        return errors
    
    # Validate locator format
    parsed = parse_legge_locator(locator)
    if not parsed:
        errors.append(
            f"{line_key} ({star_system}, Legge): "
            f"Locator format invalid: '{locator}' (expected format: 'Hex NN, Line L')"
        )
        return errors
    
    locator_gate, locator_line = parsed
    
    # Extract expected line from line_key (e.g., "01.3" -> 3)
    expected_line = int(line_key.split('.')[1])
    
    # Verify locator line matches line_key
    if locator_line != expected_line:
        errors.append(
            f"{line_key} ({star_system}, Legge): "
            f"Locator line mismatch: expected Hex {locator_gate:02d} Line {expected_line}, "
            f"but locator says Line {locator_line}"
        )
    
    # Find quote in source
    found, actual_line = find_quote_in_legge(quote, legge_data, expected_line)
    
    if not found:
        errors.append(
            f"{line_key} ({star_system}, Legge): "
            f"Quote not found verbatim in source: Legge {locator}"
        )
    elif actual_line is not None and actual_line != expected_line:
        errors.append(
            f"{line_key} ({star_system}, Legge): "
            f"Locator line mismatch: expected Hex {locator_gate:02d} Line {expected_line}, "
            f"but quote found in Line {actual_line}"
        )
    
    return errors


def validate_line_companion_quote(
    quote: str,
    locator: str,
    line_key: str,
    star_system: str,
    lc_data: Dict
) -> List[str]:
    """Validate Line Companion quote against source."""
    errors = []
    
    # Skip if empty quote
    if not quote or len(quote.strip()) == 0:
        return errors
    
    # Validate locator format
    parsed = parse_line_companion_locator(locator)
    if not parsed:
        errors.append(
            f"{line_key} ({star_system}, Line Companion): "
            f"Locator format invalid: '{locator}' (expected format: 'Gate N, Line L')"
        )
        return errors
    
    locator_gate, locator_line = parsed
    
    # Extract expected gate from line_key (e.g., "01.3" -> 1)
    expected_gate = int(line_key.split('.')[0])
    
    # Verify locator gate matches line_key gate
    if locator_gate != expected_gate:
        errors.append(
            f"{line_key} ({star_system}, Line Companion): "
            f"Locator gate mismatch: expected Gate {expected_gate}, "
            f"but locator says Gate {locator_gate}"
        )
    
    # Find quote in source (line-agnostic within gate)
    found, actual_gate, actual_line = find_quote_in_line_companion(quote, lc_data, expected_gate)
    
    if not found:
        errors.append(
            f"{line_key} ({star_system}, Line Companion): "
            f"Quote not found verbatim in source: Line Companion {locator}"
        )
    elif actual_gate is not None and actual_gate != expected_gate:
        errors.append(
            f"{line_key} ({star_system}, Line Companion): "
            f"Locator gate mismatch: expected Gate {expected_gate}, "
            f"but quote found in Gate {actual_gate}"
        )
    
    return errors


def validate_evidence_file(
    evidence: Dict,
    weights: Dict,
    legge_data: Dict,
    lc_data: Dict
) -> List[str]:
    """Validate all quotes in evidence file."""
    all_errors = []
    
    for line_key in sorted([k for k in evidence.keys() if k != "_meta"]):
        evidence_entries = evidence[line_key]
        
        if not isinstance(evidence_entries, list):
            continue
        
        for entry in evidence_entries:
            star_system = entry.get('star_system', '')
            sources = entry.get('sources', {})
            
            # Get weight for this system from weights file
            weight = 0.0
            weight_systems = weights.get(line_key, [])
            for ws in weight_systems:
                if ws.get('star_system') == star_system:
                    weight = ws.get('weight', 0.0)
                    break
            
            # Validate Legge quote
            legge_source = sources.get('legge1899', {})
            legge_quote = legge_source.get('quote', '')
            legge_locator = legge_source.get('locator', '')
            
            if legge_quote:
                # Length validation
                errors = validate_quote_length(legge_quote, line_key, star_system, 'Legge')
                all_errors.extend(errors)
                
                # Verbatim and locator validation
                errors = validate_legge_quote(
                    legge_quote, legge_locator, line_key, star_system, weight, legge_data
                )
                all_errors.extend(errors)
            elif weight > 0.50:
                # Missing Legge quote for high weight
                all_errors.append(
                    f"{line_key} ({star_system}): "
                    f"Missing Legge quote for weight >0.50 (weight: {weight}, system: {star_system})"
                )
            
            # Validate Line Companion quote
            lc_source = sources.get('line_companion', {})
            lc_quote = lc_source.get('quote', '')
            lc_locator = lc_source.get('locator', '')
            
            if lc_quote:
                # Length validation
                errors = validate_quote_length(lc_quote, line_key, star_system, 'Line Companion')
                all_errors.extend(errors)
                
                # Verbatim and locator validation
                errors = validate_line_companion_quote(
                    lc_quote, lc_locator, line_key, star_system, lc_data
                )
                all_errors.extend(errors)
    
    return all_errors


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Verify quotes in evidence files against source texts"
    )
    parser.add_argument(
        "gate",
        type=str,
        help="Gate number (01-64, zero-padded)"
    )
    
    args = parser.parse_args()
    
    # Validate gate format
    if not args.gate.isdigit() or len(args.gate) != 2:
        print(f"ERROR: Gate must be zero-padded 2-digit number (01-64), got: {args.gate}", file=sys.stderr)
        return 1
    
    gate_num = int(args.gate)
    if gate_num < 1 or gate_num > 64:
        print(f"ERROR: Gate must be 01-64, got: {args.gate}", file=sys.stderr)
        return 1
    
    # Determine file paths
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    weights_path = project_root / "star-maps" / f"gateLine_star_map_Gate{args.gate}.json"
    evidence_path = project_root / "evidence" / f"gateLine_evidence_Gate{args.gate}.json"
    
    # Load files
    try:
        with open(weights_path, 'r', encoding='utf-8') as f:
            weights = json.load(f)
        with open(evidence_path, 'r', encoding='utf-8') as f:
            evidence = json.load(f)
        
        legge_data = load_legge_source(gate_num)
        lc_data = load_line_companion_source(gate_num)
    except Exception as e:
        print(f"ERROR loading files: {e}", file=sys.stderr)
        return 1
    
    # Run validation
    print(f"Verifying quotes for Gate {args.gate}...")
    print()
    
    errors = validate_evidence_file(evidence, weights, legge_data, lc_data)
    
    if errors:
        print(f"✗ Quote verification FAILED with {len(errors)} error(s):")
        print()
        for err in errors:
            print(f"  ✗ {err}")
        print()
        return 1
    else:
        print("✓ All quotes verified successfully")
        print()
        return 0


if __name__ == "__main__":
    sys.exit(main())
