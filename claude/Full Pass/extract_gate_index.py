#!/usr/bin/env python3
"""Extract gate number and name from all gate-*-full.json files."""

import json
from pathlib import Path

def extract_gate_info():
    """Extract gate number and name from all gate files."""
    gate_dir = Path("claude/Full Pass")
    gate_files = sorted(gate_dir.glob("gate-*-full.json"), key=lambda x: int(x.stem.split('-')[1]))
    
    gates = []
    
    for gate_file in gate_files:
        with open(gate_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        gate_info = {
            "number": data.get("gate"),
            "name": data.get("gate_name")
        }
        gates.append(gate_info)
    
    # Create output
    output = {
        "gates": gates,
        "total": len(gates)
    }
    
    # Write to file
    output_file = gate_dir / "gate-index.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Extracted {len(gates)} gates to {output_file}")
    
    # Print first few for verification
    print("\nFirst 5 gates:")
    for gate in gates[:5]:
        print(f"  Gate {gate['number']}: {gate['name']}")

if __name__ == "__main__":
    extract_gate_info()
