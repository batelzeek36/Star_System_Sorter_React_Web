#!/usr/bin/env python3
"""Duplicate I-Ching-Template-2.json 64 times for all hexagrams."""

import json
from pathlib import Path

# Read the template
template_path = Path(__file__).parent / "I-Ching-Template-2.json"
with open(template_path, 'r', encoding='utf-8') as f:
    template = json.load(f)

# Output directory (same as script location)
output_dir = Path(__file__).parent

# Generate 64 files
for hexagram_num in range(1, 65):
    # Create a copy of the template
    hexagram_data = json.loads(json.dumps(template))  # Deep copy
    
    # Update the hexagram number
    hexagram_data["hexagram"] = hexagram_num
    
    # Create filename
    filename = f"hexagram-{hexagram_num:02d}.json"
    filepath = output_dir / filename
    
    # Write the file
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(hexagram_data, f, indent=2, ensure_ascii=False)
    
    print(f"Created {filename}")

print(f"\n✓ Successfully generated 64 hexagram files in {output_dir}")
