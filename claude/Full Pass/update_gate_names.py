#!/usr/bin/env python3
"""
Update gate-X-full.json files with HD names and aliases from HD-name-and-alias.json
Replaces gate_name field and adds aliases field without touching anything else.
"""

import json
from pathlib import Path

def load_hd_mapping():
    """Load the HD name and alias mapping."""
    mapping_file = Path(__file__).parent / "HD-name-and-alias.json"
    with open(mapping_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Create a lookup dict by gate number
    return {gate['number']: gate for gate in data['gates']}

def update_gate_file(gate_num, hd_mapping):
    """Update a single gate file with HD name and aliases."""
    gate_file = Path(__file__).parent / f"gate-{gate_num}-full.json"
    
    if not gate_file.exists():
        print(f"⚠️  Skipping gate-{gate_num}-full.json (file not found)")
        return False
    
    # Load the gate file
    with open(gate_file, 'r', encoding='utf-8') as f:
        gate_data = json.load(f)
    
    # Get the HD mapping for this gate
    hd_info = hd_mapping.get(gate_num)
    if not hd_info:
        print(f"⚠️  No HD mapping found for gate {gate_num}")
        return False
    
    # Update gate_name and add aliases
    old_name = gate_data.get('gate_name', 'N/A')
    gate_data['gate_name'] = hd_info['hd_name']
    gate_data['aliases'] = hd_info['aliases']
    
    # Write back to file with pretty formatting
    with open(gate_file, 'w', encoding='utf-8') as f:
        json.dump(gate_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Gate {gate_num:2d}: '{old_name}' → '{hd_info['hd_name']}'")
    return True

def main():
    """Update all gate files."""
    print("Loading HD name and alias mapping...")
    hd_mapping = load_hd_mapping()
    print(f"Loaded {len(hd_mapping)} gate mappings\n")
    
    print("Updating gate files...")
    print("-" * 70)
    
    success_count = 0
    for gate_num in range(1, 65):
        if update_gate_file(gate_num, hd_mapping):
            success_count += 1
    
    print("-" * 70)
    print(f"\n✨ Updated {success_count}/64 gate files successfully!")

if __name__ == "__main__":
    main()
