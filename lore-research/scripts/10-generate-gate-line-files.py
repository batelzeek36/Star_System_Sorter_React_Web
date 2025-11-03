#!/usr/bin/env python3
"""
Generate all 64 gate-line-API-call files with paraphrased quotes from s3-data/gates/*.json
"""

import json
from pathlib import Path

# Paths
S3_GATES_DIR = Path("s3-data/gates")
OUTPUT_DIR = Path("lore-research/research-outputs/gate-line-API-call")

def generate_gate_line_file(gate_num: int):
    """Generate a gate-line-X.json file with paraphrased quotes from s3-data"""
    
    # Read source gate file
    gate_file = S3_GATES_DIR / f"{gate_num:02d}.json"
    if not gate_file.exists():
        print(f"⚠️  Source file not found: {gate_file}")
        return False
    
    with open(gate_file, 'r', encoding='utf-8') as f:
        gate_data = json.load(f)
    
    # Build output structure
    output = {
        "gate": gate_num,
        "gate_name": gate_data.get("name", ""),
        "lines": {}
    }
    
    # Extract lines
    lines = gate_data.get("lines", [])
    if not lines:
        print(f"⚠️  No lines found in gate {gate_num}")
        return False
    
    for line_data in lines:
        line_num = line_data.get("line_number")
        if not line_num:
            continue
        
        gate_line_key = f"{gate_num}.{line_num}"
        
        # Extract paraphrased quote data from classical section
        classical = line_data.get("classical", {})
        hd_title = classical.get("hd_title", "")
        hd_quote = classical.get("hd_quote", "")
        
        # Extract interpretation data
        interpretation = line_data.get("interpretation", {})
        keywords = interpretation.get("keywords", [])
        behavioral_axis = interpretation.get("behavioral_axis", "")
        shadow_axis = interpretation.get("shadow_axis", "")
        
        output["lines"][gate_line_key] = {
            "line": line_num,
            "hd_title": hd_title,
            "hd_quote": hd_quote,
            "keywords": keywords,
            "behavioral_axis": behavioral_axis,
            "shadow_axis": shadow_axis,
            "source": "s3-data/gates (paraphrased quotes + behavioral interpretation)"
        }
    
    # Write output file
    output_file = OUTPUT_DIR / f"gate-line-{gate_num}.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Generated: {output_file.name} ({len(output['lines'])} lines)")
    return True

def main():
    print("=" * 60)
    print("GENERATING GATE-LINE-API-CALL FILES")
    print("=" * 60)
    
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    success_count = 0
    fail_count = 0
    
    for gate_num in range(1, 65):
        if generate_gate_line_file(gate_num):
            success_count += 1
        else:
            fail_count += 1
    
    print("\n" + "=" * 60)
    print(f"✅ Successfully generated: {success_count} files")
    if fail_count > 0:
        print(f"⚠️  Failed: {fail_count} files")
    print("=" * 60)

if __name__ == "__main__":
    main()
