#!/usr/bin/env python3
"""
Update gate task descriptions in tasks.md to include detailed workflow steps.
Updates tasks 9-71 to match the format of task 8.
"""

import re
from pathlib import Path

def generate_task_description(gate_num: int) -> str:
    """Generate detailed task description for a gate."""
    gate_str = str(gate_num)
    gate_padded = f"{gate_num:02d}"
    
    return f"""- [ ] {gate_num + 7}. Gate {gate_num} Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-{gate_str}-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-{gate_padded}.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate{gate_padded}.json` and `GPT-5/evidence/gateLine_evidence_Gate{gate_padded}.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py {gate_num}` and `python GPT-5/scripts/verify_quotes.py {gate_num}`
  - Document reasoning for difficult decisions"""

def update_tasks_file():
    """Update the tasks.md file with detailed descriptions for gates 2-64."""
    tasks_file = Path(".kiro/specs/gate-hexagram-scoring-v2/tasks.md")
    
    if not tasks_file.exists():
        print(f"Error: {tasks_file} not found")
        return False
    
    content = tasks_file.read_text()
    
    # Pattern to match tasks 9-71 (gates 2-64)
    # Matches: "- [ ] N. Gate M Analysis & Scoring" followed by bullet points until next task or section
    pattern = r'(- \[ \] (\d+)\. Gate (\d+) Analysis & Scoring\n(?:  - [^\n]+\n)*)'
    
    def replace_task(match):
        task_num = int(match.group(2))
        gate_num = int(match.group(3))
        
        # Only update tasks 9-71 (gates 2-64)
        if task_num < 9 or task_num > 71:
            return match.group(0)
        
        return generate_task_description(gate_num) + "\n"
    
    # Replace all matching tasks
    updated_content = re.sub(pattern, replace_task, content)
    
    # Check if any changes were made
    if updated_content == content:
        print("No changes made - pattern might not match")
        return False
    
    # Write back to file
    tasks_file.write_text(updated_content)
    
    # Count how many tasks were updated
    tasks_updated = len(re.findall(r'- \[ \] \d+\. Gate \d+ Analysis & Scoring\n  - Read `GPT-5/combined-baselines', updated_content))
    
    print(f"✅ Updated {tasks_updated} gate task descriptions in {tasks_file}")
    print(f"   Tasks 9-71 (Gates 2-64) now include detailed workflow steps")
    
    return True

if __name__ == "__main__":
    success = update_tasks_file()
    exit(0 if success else 1)
