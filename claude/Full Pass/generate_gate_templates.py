#!/usr/bin/env python3
"""Generate 64 gate template files for Line Companion extraction."""

import json
from pathlib import Path

# Gate names mapping (you can update these with actual names)
GATE_NAMES = {
    1: "The Creative", 2: "The Receptive", 3: "Difficulty at the Beginning",
    4: "Youthful Folly", 5: "Waiting", 6: "Conflict", 7: "The Army",
    8: "Holding Together", 9: "Small Taming", 10: "Treading",
    11: "Peace", 12: "Standstill", 13: "Fellowship", 14: "Great Possessing",
    15: "Modesty", 16: "Enthusiasm", 17: "Following", 18: "Work on the Decayed",
    19: "Approach", 20: "Contemplation", 21: "Biting Through", 22: "Grace",
    23: "Splitting Apart", 24: "Return", 25: "Innocence", 26: "Great Taming",
    27: "Nourishment", 28: "Great Preponderance", 29: "The Abysmal",
    30: "The Clinging", 31: "Influence", 32: "Duration", 33: "Retreat",
    34: "Great Power", 35: "Progress", 36: "Darkening of the Light",
    37: "The Family", 38: "Opposition", 39: "Obstruction", 40: "Deliverance",
    41: "Decrease", 42: "Increase", 43: "Breakthrough", 44: "Coming to Meet",
    45: "Gathering Together", 46: "Pushing Upward", 47: "Oppression",
    48: "The Well", 49: "Revolution", 50: "The Cauldron", 51: "The Arousing",
    52: "Keeping Still", 53: "Development", 54: "The Marrying Maiden",
    55: "Abundance", 56: "The Wanderer", 57: "The Gentle", 58: "The Joyous",
    59: "Dispersion", 60: "Limitation", 61: "Inner Truth", 62: "Small Exceeding",
    63: "After Completion", 64: "Before Completion"
}

template = {
    "_INSTRUCTIONS": [
        "Copy COMPLETE Line Companion text verbatim into 'full_text' - no summarization, no trimming",
        "Copy line title verbatim into 'hd_title'",
        "Return exactly six lines (1–6)"
    ],
    "gate": 0,  # Will be replaced
    "gate_name": "",  # Will be replaced
    "source": "Line Companion (Ra Uru Hu)",
    "lines": [
        {
            "line": i,
            "hd_title": "[VERBATIM]",
            "full_text": "[COMPLETE UNEDITED TEXT]"
        }
        for i in range(1, 7)
    ]
}

# Create output directory if it doesn't exist
output_dir = Path(__file__).parent
output_dir.mkdir(parents=True, exist_ok=True)

# Generate all 64 files
for gate_num in range(1, 65):
    template_copy = template.copy()
    template_copy["gate"] = gate_num
    template_copy["gate_name"] = GATE_NAMES.get(gate_num, f"Gate {gate_num}")
    
    filename = f"gate-{gate_num}-full.json"
    filepath = output_dir / filename
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(template_copy, f, indent=2, ensure_ascii=False)
    
    print(f"Created {filename}")

print(f"\n✓ Generated 64 gate template files in {output_dir}")
