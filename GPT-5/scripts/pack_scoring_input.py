#!/usr/bin/env python3
"""
Pack context into gate prompts by inlining baseline, gate, and hexagram files.

This script:
1. Reads gate-specific prompts from GPT-5/prompts/gates/
2. Loads the three required input files (baseline, gate, hexagram)
3. Inlines the JSON content into the prompt as markdown code blocks
4. Writes self-contained packed prompts ready for LLM processing

The packed prompts are completely self-contained and can be used directly
without needing to reference external files.

Requirements: 5.1-5.3, 8.1
"""

import json
import sys
from pathlib import Path
from typing import Optional


def load_json_file(file_path: Path) -> Optional[dict]:
    """
    Load and parse a JSON file.
    
    Args:
        file_path: Path to JSON file
        
    Returns:
        Parsed JSON data or None if file doesn't exist
    """
    if not file_path.exists():
        return None
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        print(f"ERROR: Invalid JSON in {file_path}: {e}", file=sys.stderr)
        return None


def format_json_block(data: dict, title: str) -> str:
    """
    Format JSON data as a markdown code block with title.
    
    Args:
        data: JSON data to format
        title: Title for the code block
        
    Returns:
        Formatted markdown string
    """
    json_str = json.dumps(data, indent=2, ensure_ascii=False)
    return f"### {title}\n\n```json\n{json_str}\n```\n"


def pack_prompt(gate_num: int, prompt_template: str, baseline_data: dict, 
                gate_data: dict, hexagram_data: dict) -> str:
    """
    Pack a gate prompt with inlined JSON data.
    
    Args:
        gate_num: Gate number (1-64)
        prompt_template: The prompt template string
        baseline_data: Parsed baseline JSON
        gate_data: Parsed gate JSON
        hexagram_data: Parsed hexagram JSON
        
    Returns:
        Packed prompt with inlined data
    """
    # Create the context section with all three JSON files
    context_section = "\n---\n\n## INLINED CONTEXT DATA\n\n"
    context_section += "**The following three files are inlined below for your reference.**\n\n"
    
    # Add baseline data
    context_section += format_json_block(
        baseline_data,
        f"File 1: GPT-5/combined-baselines-4.2.json"
    )
    context_section += "\n"
    
    # Add gate data
    context_section += format_json_block(
        gate_data,
        f"File 2: claude/Full Pass/gate-{gate_num}-full.json"
    )
    context_section += "\n"
    
    # Add hexagram data
    hex_padded = f"{gate_num:02d}"
    context_section += format_json_block(
        hexagram_data,
        f"File 3: claude/I-Ching-Full-Pass/hexagram-{hex_padded}.json"
    )
    
    context_section += "\n---\n"
    
    # Insert context section after the "BEGIN PROCESSING" section
    # Find the position to insert (right before "BEGIN PROCESSING")
    begin_marker = "## BEGIN PROCESSING"
    
    if begin_marker in prompt_template:
        parts = prompt_template.split(begin_marker, 1)
        packed_prompt = parts[0] + context_section + "\n" + begin_marker + parts[1]
    else:
        # Fallback: append at the end
        packed_prompt = prompt_template + "\n" + context_section
    
    return packed_prompt


def pack_gate_prompt(gate_num: int, project_root: Path) -> tuple[bool, Optional[str], Optional[str]]:
    """
    Pack a single gate prompt with inlined context.
    
    Args:
        gate_num: Gate number (1-64)
        project_root: Path to project root directory
        
    Returns:
        Tuple of (success: bool, packed_prompt: str or None, error_message: str or None)
    """
    # Load prompt template
    gate_padded = f"{gate_num:02d}"
    prompt_path = project_root / "GPT-5" / "prompts" / "gates" / f"gate-{gate_padded}-prompt.md"
    
    if not prompt_path.exists():
        return False, None, f"Prompt file not found: {prompt_path}"
    
    with open(prompt_path, 'r', encoding='utf-8') as f:
        prompt_template = f.read()
    
    # Load baseline file (same for all gates)
    baseline_path = project_root / "GPT-5" / "combined-baselines-4.2.json"
    baseline_data = load_json_file(baseline_path)
    if baseline_data is None:
        return False, None, f"Failed to load baseline file: {baseline_path}"
    
    # Load gate file (Line Companion)
    gate_path = project_root / "claude" / "Full Pass" / f"gate-{gate_num}-full.json"
    gate_data = load_json_file(gate_path)
    if gate_data is None:
        return False, None, f"Failed to load gate file: {gate_path}"
    
    # Load hexagram file (Legge I Ching)
    hexagram_path = project_root / "claude" / "I-Ching-Full-Pass" / f"hexagram-{gate_padded}.json"
    hexagram_data = load_json_file(hexagram_path)
    if hexagram_data is None:
        return False, None, f"Failed to load hexagram file: {hexagram_path}"
    
    # Pack the prompt
    packed_prompt = pack_prompt(gate_num, prompt_template, baseline_data, gate_data, hexagram_data)
    
    return True, packed_prompt, None


def main():
    """Main execution function."""
    # Get project root (assuming script is in GPT-5/scripts/)
    script_dir = Path(__file__).parent
    project_root = script_dir.parent.parent
    
    print("Context Packing Script")
    print("=" * 60)
    print()
    
    # Parse command line arguments
    if len(sys.argv) > 1:
        # Pack specific gate(s)
        gate_nums = []
        for arg in sys.argv[1:]:
            try:
                gate_num = int(arg)
                if 1 <= gate_num <= 64:
                    gate_nums.append(gate_num)
                else:
                    print(f"WARNING: Gate number {gate_num} out of range (1-64), skipping")
            except ValueError:
                print(f"WARNING: Invalid gate number '{arg}', skipping")
        
        if not gate_nums:
            print("ERROR: No valid gate numbers provided")
            print("Usage: python pack_scoring_input.py [gate_number ...]")
            print("Example: python pack_scoring_input.py 1")
            print("Example: python pack_scoring_input.py 1 2 3")
            print("Or run without arguments to pack all 64 gates")
            sys.exit(1)
    else:
        # Pack all gates
        gate_nums = list(range(1, 65))
    
    print(f"Packing {len(gate_nums)} gate prompt(s)...")
    print()
    
    # Create output directory
    output_dir = project_root / "GPT-5" / "prompts" / "gates-packed"
    output_dir.mkdir(parents=True, exist_ok=True)
    print(f"Output directory: {output_dir}")
    print()
    
    # Pack each gate
    success_count = 0
    error_count = 0
    errors = []
    
    for gate_num in gate_nums:
        success, packed_prompt, error_msg = pack_gate_prompt(gate_num, project_root)
        
        if not success:
            error_count += 1
            errors.append((gate_num, error_msg))
            print(f"Gate {gate_num:2d}: ✗ FAILED - {error_msg}")
            continue
        
        # Write packed prompt to file
        gate_padded = f"{gate_num:02d}"
        output_file = output_dir / f"gate-{gate_padded}-prompt-packed.md"
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(packed_prompt)
        
        success_count += 1
        file_size_kb = len(packed_prompt) / 1024
        print(f"Gate {gate_num:2d}: ✓ Packed ({file_size_kb:.1f} KB) → {output_file.name}")
    
    # Summary
    print()
    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total gates processed: {len(gate_nums)}")
    print(f"Successfully packed: {success_count}")
    print(f"Failed: {error_count}")
    print()
    
    if errors:
        print("ERRORS:")
        print("-" * 60)
        for gate_num, error_msg in errors:
            print(f"Gate {gate_num:2d}: {error_msg}")
        print()
        sys.exit(1)
    else:
        print("SUCCESS: All prompts packed successfully!")
        print()
        print("Packed prompts are self-contained and ready for LLM processing.")
        print(f"Location: {output_dir}")
        print()
        print("Next steps:")
        print("1. Review a packed prompt to verify format")
        print("2. Begin batch processing (Tasks 8-15)")
        print("3. Run validation scripts on outputs")


if __name__ == "__main__":
    main()
