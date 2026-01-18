#!/usr/bin/env python3
"""Generate 64 hexagram template files for Legge I Ching extraction."""

import json
from pathlib import Path

# Template structure
template = {
    "_INSTRUCTIONS": [
        "Copy COMPLETE Legge I Ching hexagram text verbatim into 'full_text' - no summarization, no trimming",
        "Copy line text verbatim into 'legge_line_text'",
        "Return exactly six lines (1–6)",
        "DO NOT attempt to guess gate names - fill in exactly the name from the material provided",
        "Extract from Legge translation (1899) only (this work is NOT copyrighted)"
    ],
    "hexagram": 0,  # Will be replaced
    "hexagram_name": "[DO NOT GUESS - EXTRACT FROM SOURCE]",
    "source": "I Ching (James Legge translation, 1899)",
    "lines": [
        {
            "line": i,
            "legge_line_text": "[VERBATIM LINE TEXT]",
            "full_text": "[COMPLETE UNEDITED HEXAGRAM TEXT FOR THIS LINE]"
        }
        for i in range(1, 7)
    ]
}

# Create directory if it doesn't exist
output_dir = Path(__file__).parent
output_dir.mkdir(exist_ok=True)

# Generate 64 files
for hexagram_num in range(1, 65):
    template_copy = template.copy()
    template_copy["hexagram"] = hexagram_num
    template_copy["lines"] = [
        {
            "line": i,
            "legge_line_text": "[VERBATIM LINE TEXT]",
            "full_text": "[COMPLETE UNEDITED HEXAGRAM TEXT FOR THIS LINE]"
        }
        for i in range(1, 7)
    ]
    
    filename = f"hexagram-{hexagram_num:02d}.json"
    filepath = output_dir / filename
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(template_copy, f, indent=2, ensure_ascii=False)
    
    print(f"Created {filename}")

print(f"\n✓ Successfully generated 64 hexagram template files in {output_dir}")
