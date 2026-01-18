#!/usr/bin/env python3
"""
Generate disagreement report comparing LLM scores with existing draft mappings.

Outputs CSV/MD showing where LLM diverges from manual drafts by >0.3 weight.
"""

import json
import logging
from pathlib import Path
from typing import Dict, List, Optional

from config import RESEARCH_OUTPUTS_DIR
from utils import setup_logging

logger = logging.getLogger(__name__)


def load_draft_mappings() -> Dict[str, Dict]:
    """Load existing draft mappings from star-mapping-drafts/."""
    drafts_dir = RESEARCH_OUTPUTS_DIR / "star-mapping-drafts"
    
    if not drafts_dir.exists():
        logger.warning(f"Drafts directory not found: {drafts_dir}")
        return {}
    
    mappings = {}
    
    for draft_file in drafts_dir.glob("*.json"):
        with open(draft_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Extract system name from filename (e.g., "andromeda-batch1.json" -> "andromeda")
        system_name = draft_file.stem.split('-')[0]
        
        # Iterate through gate.line mappings
        for gate_line, mapping in data.items():
            if gate_line.startswith('_'):
                continue  # Skip metadata
            
            if gate_line not in mappings:
                mappings[gate_line] = {}
            
            mappings[gate_line][system_name] = {
                "weight": mapping.get('weight', 0.0),
                "alignment_type": mapping.get('alignment_type', 'none'),
                "why": mapping.get('why', '')
            }
    
    return mappings


def compare_scores(llm_score: Dict, draft_mapping: Optional[Dict]) -> List[Dict]:
    """Compare LLM score with draft mapping, return disagreements."""
    disagreements = []
    
    if not draft_mapping:
        return disagreements
    
    gate_line = llm_score['gate_line']
    
    for system in llm_score['systems']:
        system_id = system['id']
        llm_weight = system['weight']
        llm_alignment = system['alignment']
        
        # Get draft data
        draft = draft_mapping.get(system_id, {})
        draft_weight = draft.get('weight', 0.0)
        draft_alignment = draft.get('alignment_type', 'none')
        
        # Calculate difference
        weight_diff = abs(llm_weight - draft_weight)
        
        # Flag if significant disagreement
        if weight_diff > 0.3:
            disagreements.append({
                "gate_line": gate_line,
                "system": system_id,
                "llm_weight": llm_weight,
                "draft_weight": draft_weight,
                "weight_diff": weight_diff,
                "llm_alignment": llm_alignment,
                "draft_alignment": draft_alignment,
                "llm_why": system['why'],
                "draft_why": draft.get('why', ''),
                "llm_confidence": system['confidence']
            })
    
    return disagreements


def generate_report():
    """Generate disagreement report."""
    llm_dir = RESEARCH_OUTPUTS_DIR / "star-maps-calibrated"
    if not llm_dir.exists():
        llm_dir = RESEARCH_OUTPUTS_DIR / "star-maps-llm"
    
    if not llm_dir.exists():
        logger.error(f"LLM scores directory not found: {llm_dir}")
        return 1
    
    output_dir = RESEARCH_OUTPUTS_DIR / "star-maps-reports"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Load draft mappings
    logger.info("Loading draft mappings...")
    draft_mappings = load_draft_mappings()
    logger.info(f"Loaded drafts for {len(draft_mappings)} gate.lines")
    
    # Compare all LLM scores
    all_disagreements = []
    
    llm_files = sorted(llm_dir.glob("*.json"))
    llm_files = [f for f in llm_files if not f.name.startswith('_')]
    
    logger.info(f"Comparing {len(llm_files)} LLM scores with drafts...")
    
    for llm_file in llm_files:
        with open(llm_file, 'r', encoding='utf-8') as f:
            llm_score = json.load(f)
        
        gate_line = llm_score['gate_line']
        draft_mapping = draft_mappings.get(gate_line)
        
        disagreements = compare_scores(llm_score, draft_mapping)
        all_disagreements.extend(disagreements)
    
    # Sort by weight difference (largest first)
    all_disagreements.sort(key=lambda x: x['weight_diff'], reverse=True)
    
    # Write JSON report
    json_report = output_dir / "disagreements.json"
    with open(json_report, 'w', encoding='utf-8') as f:
        json.dump(all_disagreements, f, indent=2)
    
    logger.info(f"JSON report written to {json_report}")
    
    # Write Markdown report
    md_report = output_dir / "disagreements.md"
    with open(md_report, 'w', encoding='utf-8') as f:
        f.write("# Star System Mapping Disagreements\n\n")
        f.write(f"Total disagreements (Δweight >0.3): {len(all_disagreements)}\n\n")
        
        if all_disagreements:
            f.write("| Gate.Line | System | LLM Weight | Draft Weight | Δ | LLM Align | Draft Align | Confidence |\n")
            f.write("|-----------|--------|------------|--------------|---|-----------|-------------|------------|\n")
            
            for d in all_disagreements:
                f.write(f"| {d['gate_line']} | {d['system']} | {d['llm_weight']:.2f} | {d['draft_weight']:.2f} | {d['weight_diff']:.2f} | {d['llm_alignment']} | {d['draft_alignment']} | {d['llm_confidence']:.2f} |\n")
            
            f.write("\n## Detailed Disagreements\n\n")
            
            for d in all_disagreements[:50]:  # Top 50
                f.write(f"### {d['gate_line']} - {d['system']}\n\n")
                f.write(f"**Weight Difference:** {d['weight_diff']:.2f} (LLM: {d['llm_weight']:.2f}, Draft: {d['draft_weight']:.2f})\n\n")
                f.write(f"**LLM Reasoning ({d['llm_alignment']}):** {d['llm_why']}\n\n")
                if d['draft_why']:
                    f.write(f"**Draft Reasoning ({d['draft_alignment']}):** {d['draft_why']}\n\n")
                f.write(f"**LLM Confidence:** {d['llm_confidence']:.2f}\n\n")
                f.write("---\n\n")
    
    logger.info(f"Markdown report written to {md_report}")
    
    # Write CSV for spreadsheet review
    csv_report = output_dir / "disagreements.csv"
    with open(csv_report, 'w', encoding='utf-8') as f:
        f.write("gate_line,system,llm_weight,draft_weight,weight_diff,llm_alignment,draft_alignment,llm_confidence,llm_why,draft_why\n")
        
        for d in all_disagreements:
            # Escape quotes in why fields
            llm_why = d['llm_why'].replace('"', '""')
            draft_why = d['draft_why'].replace('"', '""')
            
            f.write(f'"{d["gate_line"]}","{d["system"]}",{d["llm_weight"]:.2f},{d["draft_weight"]:.2f},{d["weight_diff"]:.2f},"{d["llm_alignment"]}","{d["draft_alignment"]}",{d["llm_confidence"]:.2f},"{llm_why}","{draft_why}"\n')
    
    logger.info(f"CSV report written to {csv_report}")
    
    # Summary
    logger.info(f"\nSummary:")
    logger.info(f"  Total disagreements: {len(all_disagreements)}")
    logger.info(f"  Unique gate.lines affected: {len(set(d['gate_line'] for d in all_disagreements))}")
    logger.info(f"  Average weight difference: {sum(d['weight_diff'] for d in all_disagreements) / len(all_disagreements):.2f}" if all_disagreements else "  No disagreements")
    
    return 0


def main():
    setup_logging()
    logger.info("Generating disagreement report")
    return generate_report()


if __name__ == "__main__":
    exit(main())
