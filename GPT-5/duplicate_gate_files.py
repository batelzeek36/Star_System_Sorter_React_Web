#!/usr/bin/env python3
"""
Duplicate template files for all 64 gates.

Creates:
- GPT-5/evidence/gateLine_evidence_GateXX.json (for gates 01-64)
- GPT-5/GateXX/gateLine_star_map_GateXX.json (for gates 01-64)
"""

import json
import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).parent

# Template files
EVIDENCE_TEMPLATE = BASE_DIR / "evidence" / "gateLine_evidence_Gate01.json"
STAR_MAP_TEMPLATE = BASE_DIR / "Gate01" / "gateLine_star_map_Gate01.json"

def create_gate_directories():
    """Create GateXX directories for gates 02-64."""
    for gate_num in range(2, 65):
        gate_dir = BASE_DIR / f"Gate{gate_num:02d}"
        gate_dir.mkdir(exist_ok=True)
        
        # Create star-maps subdirectory
        star_maps_dir = gate_dir / "star-maps"
        star_maps_dir.mkdir(exist_ok=True)
        
        print(f"✓ Created {gate_dir.name}/")

def duplicate_evidence_files():
    """Duplicate evidence template for gates 02-64."""
    # Read the template
    with open(EVIDENCE_TEMPLATE, 'r') as f:
        template_data = json.load(f)
    
    for gate_num in range(2, 65):
        # Create new evidence file
        output_file = BASE_DIR / "evidence" / f"gateLine_evidence_Gate{gate_num:02d}.json"
        
        # Transform the data: replace gate numbers in keys
        new_data = {}
        for key, value in template_data.items():
            # Replace "01.X" with "XX.X"
            new_key = key.replace("01.", f"{gate_num:02d}.")
            
            # Deep copy the value structure and update gate/hexagram references
            new_value = json.loads(json.dumps(value))  # Deep copy
            
            # Update citations in each alignment
            for alignment in new_value:
                for citation in alignment.get("citations", []):
                    if citation.get("source") == "Legge1899":
                        citation["hexagram"] = gate_num
                        citation["locator"] = f"Legge 1899, Hex {gate_num}, Line {key.split('.')[1]}"
                    elif citation.get("source") == "Line Companion":
                        citation["gate"] = gate_num
                        citation["locator"] = f"Line Companion, Gate {gate_num} Line {key.split('.')[1]}"
            
            new_data[new_key] = new_value
        
        # Write the new file
        with open(output_file, 'w') as f:
            json.dump(new_data, f, indent=2)
        
        print(f"✓ Created evidence/gateLine_evidence_Gate{gate_num:02d}.json")

def duplicate_star_map_files():
    """Duplicate star map template for gates 02-64."""
    # Check if template has content
    if STAR_MAP_TEMPLATE.stat().st_size == 0:
        # Create empty files
        for gate_num in range(2, 65):
            output_file = BASE_DIR / f"Gate{gate_num:02d}" / f"gateLine_star_map_Gate{gate_num:02d}.json"
            output_file.touch()
            print(f"✓ Created Gate{gate_num:02d}/gateLine_star_map_Gate{gate_num:02d}.json (empty)")
    else:
        # Read and transform template
        with open(STAR_MAP_TEMPLATE, 'r') as f:
            template_data = json.load(f)
        
        for gate_num in range(2, 65):
            output_file = BASE_DIR / f"Gate{gate_num:02d}" / f"gateLine_star_map_Gate{gate_num:02d}.json"
            
            # Transform data if needed
            new_data = json.loads(json.dumps(template_data))  # Deep copy
            # Add any gate-specific transformations here
            
            with open(output_file, 'w') as f:
                json.dump(new_data, f, indent=2)
            
            print(f"✓ Created Gate{gate_num:02d}/gateLine_star_map_Gate{gate_num:02d}.json")

def main():
    print("Creating gate directories...")
    create_gate_directories()
    
    print("\nDuplicating evidence files...")
    duplicate_evidence_files()
    
    print("\nDuplicating star map files...")
    duplicate_star_map_files()
    
    print("\n✅ Done! Created files for gates 02-64")
    print(f"   - 63 evidence files in evidence/")
    print(f"   - 63 star map files in GateXX/ directories")

if __name__ == "__main__":
    main()
