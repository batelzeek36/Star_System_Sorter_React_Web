#!/usr/bin/env python3
"""
Merge all gate-*.json files from star-mapping-by-gate/ into a single
gateLine_star_map.json file for consumption by the React app.

Output format:
{
  "_meta": {
    "version": "1.0.0",
    "generated_at_utc": "2024-11-03T...",
    "source_star_system_version": "4.2",
    "total_gate_lines": 384,
    "systems": ["andromeda", "arcturus", "draco", "lyra", "orion-dark", "orion-light", "pleiades", "sirius"]
  },
  "1.1": [
    {
      "star_system": "Lyra",
      "weight": 0.85,
      "alignment_type": "core",
      "why": "Pure, original creative emanation..."
    },
    ...
  ],
  ...
}
"""

import json
from pathlib import Path
from datetime import datetime, timezone

# Paths
SCRIPT_DIR = Path(__file__).parent
REPO_ROOT = SCRIPT_DIR.parent.parent
GATE_DIR = REPO_ROOT / "lore-research/research-outputs/star-mapping-by-gate"
OUTPUT_FILE = REPO_ROOT / "star-system-sorter/public/data/gateLine_star_map.json"

# System ID to label mapping
SYSTEM_LABELS = {
    "andromeda": "Andromeda",
    "arcturus": "Arcturus",
    "draco": "Draco",
    "lyra": "Lyra",
    "orion-dark": "Orion Dark",
    "orion-light": "Orion Light",
    "pleiades": "Pleiades",
    "sirius": "Sirius",
}

def merge_gate_files():
    """Merge all gate-*.json files into a single consolidated map."""
    
    # Initialize output structure
    output = {
        "_meta": {
            "version": "1.0.0",
            "generated_at_utc": datetime.now(timezone.utc).isoformat(),
            "source_star_system_version": "4.2",
            "total_gate_lines": 0,
            "systems": list(SYSTEM_LABELS.keys()),
        }
    }
    
    gate_line_count = 0
    
    # Process each gate file (1-64)
    for gate_num in range(1, 65):
        gate_file = GATE_DIR / f"gate-{gate_num}.json"
        
        if not gate_file.exists():
            print(f"⚠️  Missing: {gate_file.name}")
            continue
        
        print(f"Processing {gate_file.name}...")
        
        with open(gate_file, 'r', encoding='utf-8') as f:
            gate_data = json.load(f)
        
        # Process each line (1-6) in this gate
        for line_num in range(1, 7):
            gate_line_key = f"{gate_num}.{line_num}"
            
            if gate_line_key not in gate_data:
                print(f"  ⚠️  Missing line: {gate_line_key}")
                continue
            
            line_data = gate_data[gate_line_key]
            
            # Convert from system-keyed to array format
            mappings = []
            
            for system_id, system_data in line_data.items():
                # Skip non-system keys
                if system_id not in SYSTEM_LABELS:
                    continue
                
                # Only include if weight > 0 or explicitly mapped
                weight = system_data.get("weight", 0)
                alignment_type = system_data.get("alignment_type", "none")
                why = system_data.get("why", "")
                
                # Include all mappings (even weight=0) for completeness
                # The scorer will filter by weight > 0
                mapping = {
                    "star_system": SYSTEM_LABELS[system_id],
                    "weight": weight,
                    "alignment_type": alignment_type,
                    "why": why,
                }
                
                # Add optional fields if present
                if "confidence" in system_data:
                    mapping["confidence"] = system_data["confidence"]
                if "sources" in system_data:
                    mapping["sources"] = system_data["sources"]
                if "behavioral_match" in system_data:
                    mapping["behavioral_match"] = system_data["behavioral_match"]
                if "keywords" in system_data:
                    mapping["keywords"] = system_data["keywords"]
                
                mappings.append(mapping)
            
            # Sort mappings by weight descending
            mappings.sort(key=lambda m: m["weight"], reverse=True)
            
            output[gate_line_key] = mappings
            gate_line_count += 1
    
    output["_meta"]["total_gate_lines"] = gate_line_count
    
    # Ensure output directory exists
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    
    # Write output file
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Merged {gate_line_count} gate.lines into {OUTPUT_FILE}")
    print(f"   File size: {OUTPUT_FILE.stat().st_size / 1024:.1f} KB")
    
    return output

if __name__ == "__main__":
    result = merge_gate_files()
    
    # Print summary
    meta = result["_meta"]
    print(f"\n📊 Summary:")
    print(f"   Version: {meta['version']}")
    print(f"   Total gate.lines: {meta['total_gate_lines']}")
    print(f"   Systems: {len(meta['systems'])}")
    print(f"   Generated: {meta['generated_at_utc']}")
