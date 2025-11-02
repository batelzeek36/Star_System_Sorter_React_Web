#!/usr/bin/env python3
"""
03-fanout-gates.py

Reads the monolithic gates.json and fans out each gate into its own file.

Input:
  - lore-research/research-outputs/line-companion/gates.json

Output:
  - lore-research/research-outputs/line-companion/gates/gate-{NN}.json (64 files)
  - Updates BAD_LINES.md if any gate has empty/missing text

Requirements: FR-LC-3, FR-DI-5
"""

import json
import os
from datetime import datetime, timezone
from pathlib import Path

from config import RESEARCH_OUTPUTS_DIR
from utils import log_bad_line


def fanout_gates():
    """
    Read monolithic gates.json and create individual gate files.
    """
    gates_json_path = RESEARCH_OUTPUTS_DIR / "line-companion" / "gates.json"
    output_dir = RESEARCH_OUTPUTS_DIR / "line-companion" / "gates"
    
    # Ensure output directory exists
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Load monolithic gates.json
    if not gates_json_path.exists():
        print(f"❌ ERROR: {gates_json_path} not found")
        print("   Run 02-split-gates.py first")
        return 1
    
    print(f"📖 Reading {gates_json_path}")
    with open(gates_json_path, 'r', encoding='utf-8') as f:
        gates_data = json.load(f)
    
    # Track statistics
    total_gates = 0
    empty_gates = 0
    created_files = []
    
    # Process each gate 1..64
    for gate_num in range(1, 65):
        gate_key = str(gate_num)
        total_gates += 1
        
        # Check if gate exists in gates.json
        if gate_key not in gates_data:
            print(f"⚠️  Gate {gate_num} not found in gates.json")
            log_bad_line(
                gate=gate_num,
                line=None,
                source="line-companion-normalized.txt",
                problem="not found in gates.json",
                suggestion="check I Ching fallback"
            )
            empty_gates += 1
            continue
        
        gate_entry = gates_data[gate_key]
        
        # Extract text and title
        raw_text = gate_entry.get("text", "").strip()
        title = gate_entry.get("title", None)
        
        # Check if text is empty
        if not raw_text:
            print(f"⚠️  Gate {gate_num} has empty text")
            log_bad_line(
                gate=gate_num,
                line=None,
                source="line-companion-normalized.txt",
                problem="empty text in gates.json",
                suggestion="check I Ching fallback"
            )
            empty_gates += 1
        
        # Create individual gate file structure
        gate_file_data = {
            "gate": gate_num,
            "title": title,
            "raw_text": raw_text,
            "lines": {},
            "_meta": {
                "source": "line-companion-normalized.txt",
                "extracted_from": "gates.json",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        }
        
        # Write to individual file
        output_file = output_dir / f"gate-{gate_num:02d}.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(gate_file_data, f, indent=2, ensure_ascii=False)
        
        created_files.append(output_file.name)
        
        if gate_num % 10 == 0:
            print(f"✅ Processed {gate_num}/64 gates")
    
    # Summary
    print("\n" + "="*60)
    print("FANOUT COMPLETE")
    print("="*60)
    print(f"Total gates processed: {total_gates}")
    print(f"Files created: {len(created_files)}")
    print(f"Empty/missing gates: {empty_gates}")
    print(f"Output directory: {output_dir}")
    
    if empty_gates > 0:
        print(f"\n⚠️  {empty_gates} gates have issues - check BAD_LINES.md")
    
    return 0


if __name__ == "__main__":
    exit(fanout_gates())
