#!/usr/bin/env python3
"""
Duplicate star map template for all 64 gates in the same folder.

Creates:
- GPT-5/star-maps/gateLine_star_map_GateXX.json (for gates 02-64)
"""

from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).parent
STAR_MAPS_DIR = BASE_DIR / "star-maps"

# Template file
TEMPLATE_FILE = STAR_MAPS_DIR / "gateLine_star_map_Gate01.json"

def duplicate_star_map_files():
    """Duplicate star map template for gates 02-64 in the same folder."""
    
    # Ensure star-maps directory exists
    STAR_MAPS_DIR.mkdir(exist_ok=True)
    
    # Check if template exists and is empty
    if not TEMPLATE_FILE.exists():
        print(f"❌ Template file not found: {TEMPLATE_FILE}")
        return
    
    # Read template (even if empty)
    template_content = TEMPLATE_FILE.read_text()
    
    # Create files for gates 02-64
    for gate_num in range(2, 65):
        output_file = STAR_MAPS_DIR / f"gateLine_star_map_Gate{gate_num:02d}.json"
        output_file.write_text(template_content)
        print(f"✓ Created star-maps/gateLine_star_map_Gate{gate_num:02d}.json")
    
    print(f"\n✅ Done! Created 63 star map files in star-maps/")

if __name__ == "__main__":
    duplicate_star_map_files()
