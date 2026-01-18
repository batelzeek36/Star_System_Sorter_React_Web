#!/usr/bin/env python3
"""
Merge Star Mapping Batches into Master Lookup

Merges all 56 star-mapping-drafts batch files into a single master mapping file.
Output: lore-research/research-outputs/gateLine_star_map.json

Structure:
{
  "_meta": { "version": "1.0", "generated_at_utc": "...", ... },
  "1.1": [
    { "star_system": "Pleiades", "weight": 0.95, "alignment_type": "core", "why": "..." },
    ...
  ],
  ...
}
"""

import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Any

# Paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
DRAFTS_DIR = PROJECT_ROOT / "lore-research" / "research-outputs" / "star-mapping-drafts"
OUTPUT_FILE = PROJECT_ROOT / "lore-research" / "research-outputs" / "gateLine_star_map.json"

# Star systems
SYSTEMS = [
    "andromeda",
    "arcturus", 
    "draco",
    "lyra",
    "orion-dark",
    "orion-light",
    "pleiades",
    "sirius"
]

def load_batch_file(system: str, batch: int) -> Dict[str, Any]:
    """Load a single batch file"""
    filename = f"{system}-batch{batch}.json"
    filepath = DRAFTS_DIR / filename
    
    if not filepath.exists():
        raise FileNotFoundError(f"Missing batch file: {filename}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def merge_batches() -> Dict[str, List[Dict[str, Any]]]:
    """Merge all batch files into master mapping"""
    master = {}
    
    print(f"📦 Merging {len(SYSTEMS)} systems × 7 batches = 56 files...")
    
    for system in SYSTEMS:
        print(f"  Processing {system}...")
        
        for batch in range(1, 8):  # batches 1-7
            try:
                batch_data = load_batch_file(system, batch)
                
                # Process each gate.line in this batch
                for gate_line, mapping in batch_data.items():
                    # Initialize gate.line entry if not exists
                    if gate_line not in master:
                        master[gate_line] = []
                    
                    # Only add if weight > 0
                    if mapping.get("weight", 0) > 0:
                        # Normalize system name (remove hyphens, capitalize)
                        system_label = system.replace("-", " ").title()
                        
                        master[gate_line].append({
                            "star_system": system_label,
                            "weight": mapping["weight"],
                            "alignment_type": mapping["alignment_type"],
                            "why": mapping["why"]
                        })
            
            except FileNotFoundError as e:
                print(f"    ⚠️  {e}")
                continue
            except json.JSONDecodeError as e:
                print(f"    ❌ Error parsing {system}-batch{batch}.json: {e}")
                continue
    
    # Sort each gate.line's systems by weight descending
    for gate_line in master:
        master[gate_line].sort(key=lambda x: x["weight"], reverse=True)
    
    return master

def validate_coverage(master: Dict[str, List[Dict[str, Any]]]) -> None:
    """Validate that all 384 gate.lines are present"""
    expected_count = 64 * 6  # 64 gates × 6 lines
    actual_count = len(master)
    
    print(f"\n📊 Coverage Check:")
    print(f"  Expected: {expected_count} gate.lines")
    print(f"  Found: {actual_count} gate.lines")
    
    if actual_count < expected_count:
        print(f"  ⚠️  Missing {expected_count - actual_count} gate.lines")
        
        # Find missing gate.lines
        all_gate_lines = set()
        for gate in range(1, 65):
            for line in range(1, 7):
                all_gate_lines.add(f"{gate}.{line}")
        
        found_gate_lines = set(master.keys())
        missing = sorted(all_gate_lines - found_gate_lines, key=lambda x: (int(x.split('.')[0]), int(x.split('.')[1])))
        
        if missing:
            print(f"  Missing gate.lines: {', '.join(missing[:20])}")
            if len(missing) > 20:
                print(f"  ... and {len(missing) - 20} more")
    else:
        print(f"  ✅ Complete!")

def generate_master_file(master: Dict[str, List[Dict[str, Any]]]) -> None:
    """Generate the master mapping JSON file"""
    output = {
        "_meta": {
            "version": "1.0",
            "generated_at_utc": datetime.now(timezone.utc).isoformat(),
            "source_star_system_version": "4.2",
            "total_gate_lines": len(master),
            "systems": SYSTEMS
        }
    }
    
    # Add gate.lines in sorted order
    for gate_line in sorted(master.keys(), key=lambda x: (int(x.split('.')[0]), int(x.split('.')[1]))):
        output[gate_line] = master[gate_line]
    
    # Write to file
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Generated: {OUTPUT_FILE.relative_to(PROJECT_ROOT)}")
    print(f"   Size: {OUTPUT_FILE.stat().st_size:,} bytes")

def main():
    print("🔮 Star Mapping Merger")
    print("=" * 60)
    
    # Merge all batches
    master = merge_batches()
    
    # Validate coverage
    validate_coverage(master)
    
    # Generate output file
    generate_master_file(master)
    
    print("\n" + "=" * 60)
    print("✨ Merge complete!")

if __name__ == "__main__":
    main()
