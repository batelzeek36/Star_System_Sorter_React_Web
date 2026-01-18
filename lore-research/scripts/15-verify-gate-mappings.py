#!/usr/bin/env python3
"""
Verify the integrity of the merged gate-line star mapping data.

Checks:
- All 384 gate.lines are present (64 gates × 6 lines)
- All 8 star systems are represented
- Weights are in valid range [0, 1]
- Alignment types are valid
- No missing required fields
"""

import json
from pathlib import Path

# Paths
SCRIPT_DIR = Path(__file__).parent
REPO_ROOT = SCRIPT_DIR.parent.parent
MAP_FILE = REPO_ROOT / "star-system-sorter/public/data/gateLine_star_map.json"

# Expected values
EXPECTED_GATES = 64
EXPECTED_LINES_PER_GATE = 6
EXPECTED_TOTAL_GATE_LINES = EXPECTED_GATES * EXPECTED_LINES_PER_GATE
EXPECTED_SYSTEMS = [
    "Andromeda",
    "Arcturus",
    "Draco",
    "Lyra",
    "Orion Dark",
    "Orion Light",
    "Pleiades",
    "Sirius",
]
VALID_ALIGNMENT_TYPES = ["core", "shadow", "none"]

def verify_gate_mappings():
    """Verify the merged gate-line map."""
    
    print("🔍 Verifying gate-line star mapping data...")
    print(f"   File: {MAP_FILE}")
    print()
    
    # Load data
    with open(MAP_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    errors = []
    warnings = []
    
    # Check metadata
    if "_meta" not in data:
        errors.append("Missing _meta field")
    else:
        meta = data["_meta"]
        
        if meta.get("total_gate_lines") != EXPECTED_TOTAL_GATE_LINES:
            errors.append(
                f"Metadata total_gate_lines is {meta.get('total_gate_lines')}, "
                f"expected {EXPECTED_TOTAL_GATE_LINES}"
            )
        
        if len(meta.get("systems", [])) != len(EXPECTED_SYSTEMS):
            errors.append(
                f"Metadata has {len(meta.get('systems', []))} systems, "
                f"expected {len(EXPECTED_SYSTEMS)}"
            )
    
    # Check all gate.lines are present
    missing_gate_lines = []
    for gate in range(1, EXPECTED_GATES + 1):
        for line in range(1, EXPECTED_LINES_PER_GATE + 1):
            gate_line_key = f"{gate}.{line}"
            if gate_line_key not in data:
                missing_gate_lines.append(gate_line_key)
    
    if missing_gate_lines:
        errors.append(f"Missing {len(missing_gate_lines)} gate.lines: {missing_gate_lines[:10]}...")
    
    # Check each gate.line
    total_mappings = 0
    positive_weight_count = 0
    
    for gate in range(1, EXPECTED_GATES + 1):
        for line in range(1, EXPECTED_LINES_PER_GATE + 1):
            gate_line_key = f"{gate}.{line}"
            
            if gate_line_key not in data:
                continue
            
            mappings = data[gate_line_key]
            
            if not isinstance(mappings, list):
                errors.append(f"{gate_line_key}: mappings is not a list")
                continue
            
            # Check we have all 8 systems
            systems_found = set()
            
            for mapping in mappings:
                total_mappings += 1
                
                # Check required fields
                if "star_system" not in mapping:
                    errors.append(f"{gate_line_key}: missing star_system field")
                    continue
                
                system = mapping["star_system"]
                systems_found.add(system)
                
                if "weight" not in mapping:
                    errors.append(f"{gate_line_key}.{system}: missing weight field")
                    continue
                
                weight = mapping["weight"]
                
                # Check weight range
                if not isinstance(weight, (int, float)):
                    errors.append(f"{gate_line_key}.{system}: weight is not a number")
                elif weight < 0 or weight > 1:
                    errors.append(f"{gate_line_key}.{system}: weight {weight} out of range [0, 1]")
                elif weight > 0:
                    positive_weight_count += 1
                
                # Check alignment_type
                if "alignment_type" not in mapping:
                    errors.append(f"{gate_line_key}.{system}: missing alignment_type field")
                elif mapping["alignment_type"] not in VALID_ALIGNMENT_TYPES:
                    errors.append(
                        f"{gate_line_key}.{system}: invalid alignment_type "
                        f"'{mapping['alignment_type']}'"
                    )
                
                # Check why field
                if "why" not in mapping:
                    errors.append(f"{gate_line_key}.{system}: missing why field")
                elif not mapping["why"]:
                    warnings.append(f"{gate_line_key}.{system}: empty why field")
            
            # Check all systems are present
            missing_systems = set(EXPECTED_SYSTEMS) - systems_found
            if missing_systems:
                errors.append(f"{gate_line_key}: missing systems {missing_systems}")
    
    # Print results
    print("📊 Statistics:")
    print(f"   Total gate.lines: {EXPECTED_TOTAL_GATE_LINES}")
    print(f"   Total mappings: {total_mappings}")
    print(f"   Positive weights: {positive_weight_count}")
    print(f"   Average positive weights per gate.line: {positive_weight_count / EXPECTED_TOTAL_GATE_LINES:.1f}")
    print()
    
    if errors:
        print(f"❌ Found {len(errors)} error(s):")
        for error in errors[:20]:  # Show first 20
            print(f"   • {error}")
        if len(errors) > 20:
            print(f"   ... and {len(errors) - 20} more")
        print()
    
    if warnings:
        print(f"⚠️  Found {len(warnings)} warning(s):")
        for warning in warnings[:10]:  # Show first 10
            print(f"   • {warning}")
        if len(warnings) > 10:
            print(f"   ... and {len(warnings) - 10} more")
        print()
    
    if not errors and not warnings:
        print("✅ All checks passed!")
        print()
        return True
    elif not errors:
        print("✅ All critical checks passed (warnings only)")
        print()
        return True
    else:
        print("❌ Verification failed")
        print()
        return False

if __name__ == "__main__":
    success = verify_gate_mappings()
    exit(0 if success else 1)
