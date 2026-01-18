#!/usr/bin/env python3
"""
Restructure star mapping files into per-gate files.

Current structure: {system}-batch{N}.json (56 files)
New structure: gate-{N}.json with all 6 lines and all 8 systems (64 files)

This creates manageable files where each gate has:
- All 6 lines (X.1 through X.6)
- All 8 star systems for each line
- Perfect size for AI-assisted completion
"""

import json
import os
from pathlib import Path
from collections import defaultdict

# Configuration
DRAFTS_DIR = Path("lore-research/research-outputs/star-mapping-drafts")
OUTPUT_DIR = Path("lore-research/research-outputs/star-mapping-by-gate")
SYSTEMS = ["andromeda", "arcturus", "draco", "lyra", "orion-dark", "orion-light", "pleiades", "sirius"]

# Batch gate ranges
BATCH_RANGES = {
    1: (1, 8),
    2: (9, 16),
    3: (17, 24),
    4: (25, 32),
    5: (33, 40),
    6: (41, 48),
    7: (49, 64),
}

def get_batch_for_gate(gate_num):
    """Determine which batch a gate belongs to."""
    for batch_num, (start, end) in BATCH_RANGES.items():
        if start <= gate_num <= end:
            return batch_num
    return None

def load_system_batch(system, batch_num):
    """Load a system's batch file."""
    filepath = DRAFTS_DIR / f"{system}-batch{batch_num}.json"
    if not filepath.exists():
        return {}
    
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Error loading {filepath}: {e}")
        return {}

def create_gate_file(gate_num):
    """Create a file for one gate with all 6 lines and all 8 systems."""
    batch_num = get_batch_for_gate(gate_num)
    if not batch_num:
        print(f"❌ Gate {gate_num} not in any batch range")
        return None
    
    gate_data = {}
    
    # For each line in this gate
    for line_num in range(1, 7):
        gate_line = f"{gate_num}.{line_num}"
        gate_data[gate_line] = {}
        
        # Load data from each system
        for system in SYSTEMS:
            system_data = load_system_batch(system, batch_num)
            
            if gate_line in system_data:
                gate_data[gate_line][system] = system_data[gate_line]
            else:
                # Missing - create placeholder
                gate_data[gate_line][system] = {
                    "weight": 0,
                    "alignment_type": "none",
                    "why": "Not yet evaluated",
                    "confidence": 1,
                    "sources": [],
                    "behavioral_match": "none",
                    "keywords": []
                }
    
    return gate_data

def count_mappings(gate_data):
    """Count non-zero mappings per system in a gate file."""
    counts = {system: 0 for system in SYSTEMS}
    
    for gate_line, systems in gate_data.items():
        for system, mapping in systems.items():
            if mapping.get("weight", 0) > 0:
                counts[system] += 1
    
    return counts

def main():
    """Main restructuring process."""
    print("🔄 Restructuring Star Mapping Files by Gate")
    print("=" * 60)
    print(f"Input: {DRAFTS_DIR}")
    print(f"Output: {OUTPUT_DIR}")
    print(f"Creating 64 gate files (gate-1.json through gate-64.json)")
    print()
    
    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Process each gate
    total_files = 0
    total_mappings = {system: 0 for system in SYSTEMS}
    
    for gate_num in range(1, 65):
        gate_data = create_gate_file(gate_num)
        
        if gate_data:
            # Write gate file
            output_file = OUTPUT_DIR / f"gate-{gate_num}.json"
            with open(output_file, 'w') as f:
                json.dump(gate_data, f, indent=2)
            
            # Count mappings
            counts = count_mappings(gate_data)
            for system, count in counts.items():
                total_mappings[system] += count
            
            # Show summary
            non_zero_systems = [s for s, c in counts.items() if c > 0]
            if non_zero_systems:
                summary = ", ".join([f"{s}:{counts[s]}" for s in non_zero_systems])
                print(f"  ✓ Gate {gate_num:2d}: {summary}")
            else:
                print(f"  ○ Gate {gate_num:2d}: (no mappings yet)")
            
            total_files += 1
    
    print("\n" + "=" * 60)
    print(f"✅ Complete! Created {total_files} gate files")
    print(f"📁 Output directory: {OUTPUT_DIR}")
    print("\n📊 Total mappings per system:")
    for system in SYSTEMS:
        print(f"   {system:15s}: {total_mappings[system]:3d} gate.lines")
    
    print("\n💡 Next steps:")
    print("   1. Review gate files in star-mapping-by-gate/")
    print("   2. Complete missing mappings gate-by-gate")
    print("   3. Each file is ~150-300 lines - perfect for AI context")
    print("   4. Run merge script when done to create final output")

if __name__ == "__main__":
    main()
