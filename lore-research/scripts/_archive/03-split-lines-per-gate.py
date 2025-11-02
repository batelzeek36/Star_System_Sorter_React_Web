#!/usr/bin/env python3
"""
Step 3: Split each gate into 6 lines
Extracts individual line descriptions from each gate
"""

import re
import json
from pathlib import Path

INPUT_FILE = Path("lore-research/research-outputs/line-companion-gates.json")
OUTPUT_FILE = Path("lore-research/research-outputs/line-companion-gate-lines.json")

def extract_lines_from_gate(gate_data: dict) -> list:
    """Extract individual lines from a gate's body text"""
    body = gate_data["body"]
    gate_num = gate_data["gate"]
    
    # Pattern matches:
    # "1.1 Creation is independent of will"
    # "1.2 Love is light"
    # etc.
    line_pattern = re.compile(
        r"(\d+\.([1-6])\s+([^\n]+))\n",
        re.IGNORECASE
    )
    
    matches = list(line_pattern.finditer(body))
    
    if not matches:
        # No lines detected - return whole gate as single entry
        return [{
            "gate": gate_num,
            "line": None,
            "title": gate_data["title"],
            "heading": None,
            "text": body,
            "char_count": len(body)
        }]
    
    lines = []
    for i, m in enumerate(matches):
        line_num = int(m.group(2))
        line_title = m.group(3).strip()
        heading = m.group(1).strip()
        
        start = m.end()
        end = matches[i+1].start() if i + 1 < len(matches) else len(body)
        line_text = body[start:end].strip()
        
        lines.append({
            "gate": gate_num,
            "line": line_num,
            "title": line_title,
            "heading": heading,
            "text": line_text,
            "char_count": len(line_text)
        })
    
    return lines

def main():
    print("✂️  Splitting gates into individual lines...")
    
    # Read gate blocks
    gates = json.loads(INPUT_FILE.read_text(encoding="utf-8"))
    print(f"   Processing {len(gates)} gates")
    
    # Extract all lines
    all_lines = []
    for gate in gates:
        lines = extract_lines_from_gate(gate)
        all_lines.extend(lines)
    
    # Write output
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.write_text(json.dumps(all_lines, indent=2), encoding="utf-8")
    
    print(f"✅ Wrote {len(all_lines)} gate.line entries to {OUTPUT_FILE}")
    
    # Statistics
    with_lines = [l for l in all_lines if l["line"] is not None]
    without_lines = [l for l in all_lines if l["line"] is None]
    
    print(f"\n   Lines extracted: {len(with_lines)}")
    print(f"   Gates without line markers: {len(without_lines)}")
    
    if with_lines:
        sample = with_lines[0]
        print(f"\n   Sample: Gate {sample['gate']}.{sample['line']} - {sample['title']}")
        print(f"   Text preview: {sample['text'][:100]}...")

if __name__ == "__main__":
    main()
