#!/usr/bin/env python3
"""
Task 3.5: Line-shaping / exaltation–detriment splitter

For each gate-XX.json, read lines object and parse each line's raw text into segments:
- intro (text before exaltation)
- exaltation (text starting with planet name + "exalted")
- detriment (text starting with planet name + "in detriment")

Adds segments array to each line with type, planet, and text.
If no exaltation/detriment found, logs to BAD_LINES.md
"""

import json
import re
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple

# Paths
GATES_DIR = Path("lore-research/research-outputs/line-companion/gates")
BAD_LINES_FILE = Path("lore-research/research-outputs/BAD_LINES.md")

# Regex patterns for detecting exaltation and detriment
# Matches patterns like: "Mars exalted", "Jupiter in detriment", "The Moon exalted", etc.
EXALTATION_PATTERN = re.compile(
    r'\b(The\s+)?(Sun|Moon|Mercury|Venus|Mars|Jupiter|Saturn|Uranus|Neptune|Pluto|Earth)\s+exalted\b',
    re.IGNORECASE
)

DETRIMENT_PATTERN = re.compile(
    r'\b(The\s+)?(Sun|Moon|Mercury|Venus|Mars|Jupiter|Saturn|Uranus|Neptune|Pluto|Earth)\s+in\s+detriment\b',
    re.IGNORECASE
)


def parse_line_segments(raw_text: str, gate: int, line: int) -> Tuple[List[Dict], List[str]]:
    """
    Parse raw line text into segments: intro, exaltation, detriment.
    
    Returns:
        Tuple of (segments list, issues list)
    """
    segments = []
    issues = []
    
    # Find all exaltation and detriment positions
    exaltation_matches = list(EXALTATION_PATTERN.finditer(raw_text))
    detriment_matches = list(DETRIMENT_PATTERN.finditer(raw_text))
    
    # Create a list of all markers with their positions
    markers = []
    for match in exaltation_matches:
        planet = match.group(2)  # Group 2 is the planet name
        markers.append({
            'type': 'exaltation',
            'planet': planet,
            'start': match.start(),
            'end': match.end()
        })
    
    for match in detriment_matches:
        planet = match.group(2)  # Group 2 is the planet name
        markers.append({
            'type': 'detriment',
            'planet': planet,
            'start': match.start(),
            'end': match.end()
        })
    
    # Sort markers by position
    markers.sort(key=lambda x: x['start'])
    
    if not markers:
        # No exaltation or detriment found
        issues.append(f"gate.{gate}.{line}: no exaltation or detriment markers found")
        # Return entire text as intro
        segments.append({
            'type': 'intro',
            'text': raw_text.strip()
        })
        return segments, issues
    
    # Extract intro (text before first marker)
    intro_text = raw_text[:markers[0]['start']].strip()
    if intro_text:
        segments.append({
            'type': 'intro',
            'text': intro_text
        })
    
    # Extract each marked segment
    for i, marker in enumerate(markers):
        # Determine where this segment ends
        if i + 1 < len(markers):
            segment_end = markers[i + 1]['start']
        else:
            segment_end = len(raw_text)
        
        # Extract the segment text (from marker start to next marker or end)
        segment_text = raw_text[marker['start']:segment_end].strip()
        
        segments.append({
            'type': marker['type'],
            'planet': marker['planet'],
            'text': segment_text
        })
    
    # Validate: we should have at least one exaltation or detriment
    has_exaltation = any(s['type'] == 'exaltation' for s in segments)
    has_detriment = any(s['type'] == 'detriment' for s in segments)
    
    if not has_exaltation and not has_detriment:
        issues.append(f"gate.{gate}.{line}: parsed but no exaltation/detriment segments found")
    
    return segments, issues


def process_gate_file(gate_num: int) -> Tuple[bool, List[str]]:
    """
    Process a single gate file and add segments to each line.
    
    Returns:
        Tuple of (success boolean, issues list)
    """
    gate_file = GATES_DIR / f"gate-{gate_num:02d}.json"
    
    if not gate_file.exists():
        return False, [f"gate {gate_num}: file not found"]
    
    try:
        with open(gate_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        return False, [f"gate {gate_num}: failed to read JSON: {e}"]
    
    issues = []
    modified = False
    
    # Process each line
    if 'lines' in data and isinstance(data['lines'], dict):
        for line_num, line_data in data['lines'].items():
            if 'raw' not in line_data:
                issues.append(f"gate.{gate_num}.{line_num}: no 'raw' field")
                continue
            
            raw_text = line_data['raw']
            
            # Parse segments
            segments, line_issues = parse_line_segments(raw_text, gate_num, int(line_num))
            issues.extend(line_issues)
            
            # Add segments to line data
            line_data['segments'] = segments
            modified = True
    else:
        issues.append(f"gate {gate_num}: no 'lines' object found")
        return False, issues
    
    # Write back to file if modified
    if modified:
        try:
            with open(gate_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            return False, [f"gate {gate_num}: failed to write JSON: {e}"]
    
    return True, issues


def log_to_bad_lines(issues: List[str]):
    """
    Append issues to BAD_LINES.md
    """
    if not issues:
        return
    
    # Read existing content
    if BAD_LINES_FILE.exists():
        with open(BAD_LINES_FILE, 'r', encoding='utf-8') as f:
            content = f.read()
    else:
        content = "# Bad Lines - Manual Review Queue\n\nLines that could not be automatically extracted.\n\n"
        content += "| Gate.Line | Source Tried | Problem | Suggestion |\n"
        content += "|-----------|--------------|---------|------------|\n"
    
    # Add new section
    content += f"\n## Exaltation/Detriment Parsing Issues (Task 3.5) - {datetime.now(timezone.utc).isoformat()}\n\n"
    
    for issue in issues:
        content += f"- {issue}\n"
    
    # Write back
    with open(BAD_LINES_FILE, 'w', encoding='utf-8') as f:
        f.write(content)


def main():
    """
    Main execution: process all 64 gate files
    """
    print("Task 3.5: Splitting exaltation/detriment segments")
    print("=" * 60)
    
    all_issues = []
    success_count = 0
    fail_count = 0
    
    for gate_num in range(1, 65):
        success, issues = process_gate_file(gate_num)
        
        if success:
            success_count += 1
            status = "✓"
        else:
            fail_count += 1
            status = "✗"
        
        issue_count = len(issues)
        print(f"{status} Gate {gate_num:02d}: {issue_count} issues")
        
        all_issues.extend(issues)
    
    print("=" * 60)
    print(f"Processed: {success_count} success, {fail_count} failed")
    print(f"Total issues: {len(all_issues)}")
    
    # Log all issues to BAD_LINES.md
    if all_issues:
        log_to_bad_lines(all_issues)
        print(f"\nIssues logged to: {BAD_LINES_FILE}")
    
    print("\nDone!")


if __name__ == "__main__":
    main()
