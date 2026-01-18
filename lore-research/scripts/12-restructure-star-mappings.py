#!/usr/bin/env python3
"""
Restructure star mapping files from per-system batches to per-gate-range batches.

Current structure: {system}-batch{N}.json (56 files)
New structure: batch{N}.json with all 8 systems per gate.line (7 files)

This makes it much easier to:
1. Compare star systems for a single gate.line
2. Avoid redundant evaluation of the same gate.line 8 times
3. See patterns and prevent cross-contamination
"""

import json
import os
from pathlib import Path
from collections import defaultdict

# Configuration
DRAFTS_DIR = Path("lore-research/research-outputs/star-mapping-drafts")
OUTPUT_DIR = Path("lore-research/research-outputs/star-mapping-collapsed")
SYSTEMS = ["andromeda", "arcturus", "draco", "lyra", "orion-dark", "orion-light", "pleiades", "sirius"]
BATCHES = list(range(1, 8))  # 1-7

# Batch gate ranges
BATCH_RANGES = {
    1: (1, 8),    # Gates 1-8 (48 lines)
    2: (9, 16),   # Gates 9-16 (48 lines)
    3: (17, 24),  # Gates 17-24 (48 lines)
    4: (25, 32),  # Gates 25-32 (48 lines)
    5: (33, 40),  # Gates 33-40 (48 lines)
    6: (41, 48),  # Gates 41-48 (48 lines)
    7: (49, 64),  # Gates 49-64 (96 lines)
}

def get_gate_lines_for_batch(batch_num):
    """Generate all gate.line keys for a batch."""
    start_gate, end_gate = BATCH_RANGES[batch_num]
    gate_lines = []
    for gate in range(start_gate, end_gate + 1):
        for line in range(1, 7):
            gate_lines.append(f"{gate}.{line}")
    return gate_lines

def load_system_batch(system, batch_num):
    """Load a system's batch file, return dict of gate.line mappings."""
    filepath = DRAFTS_DIR / f"{system}-batch{batch_num}.json"
    if not filepath.exists():
        print(f"⚠️  Missing: {filepath}")
        return {}
    
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
        return data
    except json.JSONDecodeError as e:
        print(f"❌ JSON error in {filepath}: {e}")
        return {}
    except Exception as e:
        print(f"❌ Error loading {filepath}: {e}")
        return {}

def create_collapsed_batch(batch_num):
    """Create a collapsed batch file with all systems for each gate.line."""
    print(f"\n📦 Processing Batch {batch_num} (Gates {BATCH_RANGES[batch_num][0]}-{BATCH_RANGES[batch_num][1]})")
    
    gate_lines = get_gate_lines_for_batch(batch_num)
    collapsed = {}
    
    # Initialize structure for each gate.line
    for gate_line in gate_lines:
        collapsed[gate_line] = {}
    
    # Load data from each system
    for system in SYSTEMS:
        system_data = load_system_batch(system, batch_num)
        
        if not system_data:
            print(f"  ⚠️  {system}: No data")
            # Fill with empty mappings
            for gate_line in gate_lines:
                collapsed[gate_line][system] = {
                    "weight": 0,
                    "alignment_type": "none",
                    "why": "Not yet evaluated",
                    "confidence": 1,
                    "sources": [],
                    "behavioral_match": "none",
                    "keywords": []
                }
        else:
            # Copy mappings from system file
            mapped_count = 0
            for gate_line in gate_lines:
                if gate_line in system_data:
                    collapsed[gate_line][system] = system_data[gate_line]
                    if system_data[gate_line].get("weight", 0) > 0:
                        mapped_count += 1
                else:
                    # Missing gate.line in system file
                    collapsed[gate_line][system] = {
                        "weight": 0,
                        "alignment_type": "none",
                        "why": "Missing from source file",
                        "confidence": 1,
                        "sources": [],
                        "behavioral_match": "none",
                        "keywords": []
                    }
            
            print(f"  ✓ {system}: {mapped_count}/{len(gate_lines)} non-zero mappings")
    
    return collapsed

def main():
    """Main restructuring process."""
    print("🔄 Restructuring Star Mapping Files")
    print("=" * 60)
    print(f"Input: {DRAFTS_DIR}")
    print(f"Output: {OUTPUT_DIR}")
    print(f"Systems: {', '.join(SYSTEMS)}")
    print(f"Batches: {len(BATCHES)}")
    
    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Process each batch
    total_gate_lines = 0
    for batch_num in BATCHES:
        collapsed = create_collapsed_batch(batch_num)
        
        # Write collapsed batch file
        output_file = OUTPUT_DIR / f"batch{batch_num}.json"
        with open(output_file, 'w') as f:
            json.dump(collapsed, f, indent=2)
        
        gate_line_count = len(collapsed)
        total_gate_lines += gate_line_count
        print(f"  💾 Wrote {output_file} ({gate_line_count} gate.lines)")
    
    print("\n" + "=" * 60)
    print(f"✅ Complete! Created {len(BATCHES)} collapsed batch files")
    print(f"📊 Total gate.lines: {total_gate_lines} (should be 384)")
    print(f"📁 Output directory: {OUTPUT_DIR}")
    print("\n💡 Next steps:")
    print("   1. Review collapsed files in star-mapping-collapsed/")
    print("   2. Use these for AI-assisted mapping (all systems visible)")
    print("   3. Run merge script to create final gateLine_star_map.json")

if __name__ == "__main__":
    main()
