#!/usr/bin/env python3
"""
Generate 64 gate-specific prompts from the master template.

This script:
1. Reads the prompt template from GPT-5/prompts/gate-scoring-prompt-template.md
2. Verifies all required input files exist for each gate (1-64)
3. Generates gate-specific prompts by replacing {N} placeholders
4. Writes prompts to GPT-5/prompts/gates/ directory

Requirements: 8.1
"""

import os
import sys
from pathlib import Path


def verify_input_files(gate_num: int) -> tuple[bool, list[str]]:
    """
    Verify all required input files exist for a given gate.
    
    Args:
        gate_num: Gate number (1-64)
        
    Returns:
        Tuple of (all_exist: bool, missing_files: list[str])
    """
    missing = []
    
    # Check baseline file (same for all gates)
    baseline_path = Path("GPT-5/combined-baselines-4.2.json")
    if not baseline_path.exists():
        missing.append(str(baseline_path))
    
    # Check gate file (Line Companion)
    gate_path = Path(f"claude/Full Pass/gate-{gate_num}-full.json")
    if not gate_path.exists():
        missing.append(str(gate_path))
    
    # Check hexagram file (Legge I Ching)
    # Hexagram files use zero-padded numbers
    hex_num = f"{gate_num:02d}"
    hexagram_path = Path(f"claude/I-Ching-Full-Pass/hexagram-{hex_num}.json")
    if not hexagram_path.exists():
        missing.append(str(hexagram_path))
    
    return (len(missing) == 0, missing)


def generate_prompt(template: str, gate_num: int) -> str:
    """
    Generate a gate-specific prompt by replacing placeholders.
    
    Args:
        template: The prompt template string
        gate_num: Gate number (1-64)
        
    Returns:
        Gate-specific prompt string
    """
    # Replace {N} with gate number (non-zero-padded for most references)
    prompt = template.replace("{N}", str(gate_num))
    
    # Replace {NN} with zero-padded gate number for filenames
    gate_padded = f"{gate_num:02d}"
    prompt = prompt.replace("{NN}", gate_padded)
    
    return prompt


def main():
    """Main execution function."""
    # Get project root (assuming script is in GPT-5/scripts/)
    script_dir = Path(__file__).parent
    project_root = script_dir.parent.parent
    os.chdir(project_root)
    
    print("Gate Prompt Generation Script")
    print("=" * 60)
    print()
    
    # Read template
    template_path = Path("GPT-5/prompts/gate-scoring-prompt-template.md")
    if not template_path.exists():
        print(f"ERROR: Template file not found: {template_path}")
        sys.exit(1)
    
    print(f"Reading template: {template_path}")
    with open(template_path, 'r', encoding='utf-8') as f:
        template = f.read()
    
    print(f"Template loaded ({len(template)} characters)")
    print()
    
    # Create output directory
    output_dir = Path("GPT-5/prompts/gates")
    output_dir.mkdir(parents=True, exist_ok=True)
    print(f"Output directory: {output_dir}")
    print()
    
    # Verify baseline file exists (common to all gates)
    baseline_path = Path("GPT-5/combined-baselines-4.2.json")
    if not baseline_path.exists():
        print(f"ERROR: Baseline file not found: {baseline_path}")
        print("This file is required for all gates.")
        sys.exit(1)
    
    # Process each gate
    print("Verifying input files and generating prompts...")
    print()
    
    all_gates_valid = True
    missing_files_summary = []
    generated_count = 0
    
    for gate_num in range(1, 65):
        # Verify input files
        files_exist, missing = verify_input_files(gate_num)
        
        if not files_exist:
            all_gates_valid = False
            missing_files_summary.append((gate_num, missing))
            print(f"Gate {gate_num:2d}: MISSING FILES")
            for missing_file in missing:
                print(f"  - {missing_file}")
            continue
        
        # Generate prompt
        prompt = generate_prompt(template, gate_num)
        
        # Write to file
        output_file = output_dir / f"gate-{gate_num:02d}-prompt.md"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(prompt)
        
        generated_count += 1
        print(f"Gate {gate_num:2d}: ✓ Generated {output_file.name}")
    
    # Summary
    print()
    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total gates processed: 64")
    print(f"Prompts generated: {generated_count}")
    print(f"Missing input files: {len(missing_files_summary)}")
    print()
    
    if missing_files_summary:
        print("GATES WITH MISSING INPUT FILES:")
        print("-" * 60)
        for gate_num, missing in missing_files_summary:
            print(f"Gate {gate_num:2d}:")
            for missing_file in missing:
                print(f"  - {missing_file}")
        print()
        print("WARNING: Not all prompts could be generated.")
        print("Please ensure all required input files exist before processing.")
        sys.exit(1)
    else:
        print("SUCCESS: All 64 gate prompts generated successfully!")
        print()
        print("Next steps:")
        print("1. Review prompts in GPT-5/prompts/gates/")
        print("2. Run context packing script (Task 6)")
        print("3. Begin batch processing (Tasks 8-15)")


if __name__ == "__main__":
    main()
