#!/usr/bin/env python3
"""
Handle missing gates in gates.json

This script:
1. Checks for any gates 1-64 that are missing or empty in gates.json
2. Logs missing gates to BAD_LINES.md
3. Updates gates.json with a _meta.missing_gates array
"""

import json
import sys
from pathlib import Path
from datetime import datetime
from config import RESEARCH_OUTPUTS_DIR

# File paths
GATES_JSON = RESEARCH_OUTPUTS_DIR / "line-companion" / "gates.json"
BAD_LINES_MD = RESEARCH_OUTPUTS_DIR / "BAD_LINES.md"


def load_gates_json():
    """Load the gates.json file"""
    if not GATES_JSON.exists():
        print(f"❌ Error: {GATES_JSON} not found")
        print("   Run 02-split-gates.py first")
        sys.exit(1)
    
    with open(GATES_JSON, 'r', encoding='utf-8') as f:
        return json.load(f)


def check_missing_gates(gates_data):
    """
    Check for missing or empty gates (1-64)
    
    Returns:
        list: Gate numbers that are missing or empty
    """
    missing_gates = []
    
    for gate_num in range(1, 65):
        gate_key = str(gate_num)
        
        # Check if gate is missing entirely
        if gate_key not in gates_data:
            missing_gates.append(gate_num)
            print(f"⚠️  Gate {gate_num}: not found in gates.json")
            continue
        
        # Check if gate exists but has empty/missing text
        gate_obj = gates_data[gate_key]
        if not isinstance(gate_obj, dict):
            missing_gates.append(gate_num)
            print(f"⚠️  Gate {gate_num}: invalid structure (not a dict)")
            continue
        
        text = gate_obj.get('text', '').strip()
        if not text:
            missing_gates.append(gate_num)
            print(f"⚠️  Gate {gate_num}: empty or missing text")
    
    return missing_gates


def ensure_bad_lines_file():
    """Create BAD_LINES.md if it doesn't exist"""
    if not BAD_LINES_MD.exists():
        header = """# Bad Lines - Manual Review Queue

Lines that could not be automatically extracted.

| Gate.Line | Source Tried | Problem | Suggestion |
|-----------|--------------|---------|------------|
"""
        BAD_LINES_MD.write_text(header, encoding='utf-8')
        print(f"✅ Created {BAD_LINES_MD}")


def log_missing_gates_to_bad_lines(missing_gates):
    """Log missing gates to BAD_LINES.md"""
    if not missing_gates:
        return
    
    ensure_bad_lines_file()
    
    # Read existing content
    content = BAD_LINES_MD.read_text(encoding='utf-8')
    
    # Append missing gates
    new_entries = []
    for gate_num in missing_gates:
        entry = f"| gate: {gate_num} | line-companion-normalized.txt | not found in normalized text | check I Ching fallback |"
        # Only add if not already present
        if entry not in content:
            new_entries.append(entry)
    
    if new_entries:
        # Append to file
        with open(BAD_LINES_MD, 'a', encoding='utf-8') as f:
            for entry in new_entries:
                f.write(entry + '\n')
        
        print(f"✅ Logged {len(new_entries)} missing gate(s) to {BAD_LINES_MD}")


def update_gates_json_meta(gates_data, missing_gates):
    """
    Update gates.json with _meta.missing_gates array
    
    Args:
        gates_data: The gates dictionary
        missing_gates: List of missing gate numbers
    """
    # Create or update _meta
    if '_meta' not in gates_data:
        gates_data['_meta'] = {}
    
    gates_data['_meta']['missing_gates'] = missing_gates
    gates_data['_meta']['detected_gates'] = 64 - len(missing_gates)
    gates_data['_meta']['last_checked'] = datetime.utcnow().isoformat() + 'Z'
    
    # Write back to file
    with open(GATES_JSON, 'w', encoding='utf-8') as f:
        json.dump(gates_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Updated {GATES_JSON} with _meta.missing_gates")


def main():
    print("=" * 60)
    print("Handle Missing Gates")
    print("=" * 60)
    
    # Load gates.json
    print(f"\n📖 Loading {GATES_JSON}...")
    gates_data = load_gates_json()
    
    # Check for missing gates
    print("\n🔍 Checking for missing gates (1-64)...")
    missing_gates = check_missing_gates(gates_data)
    
    if missing_gates:
        print(f"\n⚠️  Found {len(missing_gates)} missing gate(s): {missing_gates}")
        
        # Log to BAD_LINES.md
        print("\n📝 Logging to BAD_LINES.md...")
        log_missing_gates_to_bad_lines(missing_gates)
        
        # Update gates.json with _meta
        print("\n📝 Updating gates.json with _meta...")
        update_gates_json_meta(gates_data, missing_gates)
        
        print("\n" + "=" * 60)
        print(f"⚠️  INCOMPLETE: {len(missing_gates)} gate(s) need manual review")
        print(f"   Check {BAD_LINES_MD} for details")
        print(f"   Suggestion: check I Ching fallback source")
        print("=" * 60)
        sys.exit(1)
    else:
        print("\n✅ All 64 gates present and have text")
        
        # Still update _meta to record the check
        print("\n📝 Updating gates.json with _meta...")
        update_gates_json_meta(gates_data, missing_gates)
        
        print("\n" + "=" * 60)
        print("✅ SUCCESS: All gates validated")
        print("=" * 60)


if __name__ == '__main__':
    main()
