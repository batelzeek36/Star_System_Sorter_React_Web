#!/usr/bin/env python3
"""
Post-calibration consistency checker for LLM star system scores.

Checks:
- Are weights sparse (≤2 systems >0.4)?
- Do "core" and "shadow" both appear for the same system with high weights?
- Does the "why" actually reference evidence phrases?

Optionally runs ensemble averaging of multiple model passes.
"""

import json
import logging
from pathlib import Path
from typing import Dict, List

from config import RESEARCH_OUTPUTS_DIR
from utils import setup_logging

logger = logging.getLogger(__name__)


def check_sparsity(systems: List[Dict]) -> Dict:
    """Check if weights are appropriately sparse."""
    high_weight_systems = [s for s in systems if s['weight'] > 0.4]
    
    return {
        "pass": len(high_weight_systems) <= 2,
        "high_weight_count": len(high_weight_systems),
        "high_weight_systems": [s['id'] for s in high_weight_systems],
        "issue": f"Too many high weights ({len(high_weight_systems)})" if len(high_weight_systems) > 2 else None
    }


def check_core_shadow_conflict(systems: List[Dict]) -> Dict:
    """Check if same system has both core and shadow with high weights."""
    conflicts = []
    
    # Group by system ID
    by_system = {}
    for s in systems:
        if s['id'] not in by_system:
            by_system[s['id']] = []
        by_system[s['id']].append(s)
    
    for system_id, scores in by_system.items():
        core_scores = [s for s in scores if s['alignment'] == 'core' and s['weight'] > 0.3]
        shadow_scores = [s for s in scores if s['alignment'] == 'shadow' and s['weight'] > 0.3]
        
        if core_scores and shadow_scores:
            conflicts.append({
                "system": system_id,
                "core_weight": max(s['weight'] for s in core_scores),
                "shadow_weight": max(s['weight'] for s in shadow_scores),
                "suggestion": "Lower the weaker alignment"
            })
    
    return {
        "pass": len(conflicts) == 0,
        "conflicts": conflicts,
        "issue": f"Core/shadow conflict in {len(conflicts)} systems" if conflicts else None
    }


def check_evidence_citation(system: Dict, evidence: Dict) -> bool:
    """Check if 'why' references actual evidence phrases."""
    why = system['why'].lower()
    
    # Check if any evidence phrases appear in the reasoning
    lc_quote = evidence.get('lc_quote', '').lower()
    legge_quote = evidence.get('legge_quote', '').lower()
    keywords = [k.lower() for k in evidence.get('keywords', [])]
    
    # Extract key phrases (3+ word sequences)
    lc_phrases = [' '.join(lc_quote.split()[i:i+3]) for i in range(len(lc_quote.split())-2)]
    legge_phrases = [' '.join(legge_quote.split()[i:i+3]) for i in range(len(legge_quote.split())-2)]
    
    # Check for matches
    for phrase in lc_phrases + legge_phrases:
        if len(phrase) > 10 and phrase in why:
            return True
    
    # Check for keyword matches
    for keyword in keywords:
        if keyword in why:
            return True
    
    return False


def calibrate_score(score_file: Path, evidence_file: Path) -> Dict:
    """Run calibration checks on a single score."""
    with open(score_file, 'r', encoding='utf-8') as f:
        score_data = json.load(f)
    
    with open(evidence_file, 'r', encoding='utf-8') as f:
        evidence = json.load(f)
    
    gate_line = score_data['gate_line']
    systems = score_data['systems']
    
    # Run checks
    sparsity_check = check_sparsity(systems)
    conflict_check = check_core_shadow_conflict(systems)
    
    # Check evidence citation for non-zero weights
    citation_issues = []
    for system in systems:
        if system['weight'] > 0.1:
            if not check_evidence_citation(system, evidence):
                citation_issues.append({
                    "system": system['id'],
                    "weight": system['weight'],
                    "why": system['why']
                })
    
    citation_check = {
        "pass": len(citation_issues) == 0,
        "issues": citation_issues,
        "issue": f"{len(citation_issues)} systems lack evidence citation" if citation_issues else None
    }
    
    # Overall result
    all_pass = sparsity_check['pass'] and conflict_check['pass'] and citation_check['pass']
    
    return {
        "gate_line": gate_line,
        "pass": all_pass,
        "sparsity": sparsity_check,
        "conflicts": conflict_check,
        "citations": citation_check,
        "needs_review": not all_pass
    }


def calibrate_all():
    """Run calibration on all scored files."""
    score_dir = RESEARCH_OUTPUTS_DIR / "star-maps-llm"
    evidence_dir = RESEARCH_OUTPUTS_DIR / "evidence"
    output_dir = RESEARCH_OUTPUTS_DIR / "star-maps-calibrated"
    
    if not score_dir.exists():
        logger.error(f"Score directory not found: {score_dir}")
        return 1
    
    output_dir.mkdir(parents=True, exist_ok=True)
    
    score_files = sorted(score_dir.glob("*.json"))
    score_files = [f for f in score_files if not f.name.startswith('_')]
    
    logger.info(f"Calibrating {len(score_files)} scores")
    
    results = []
    needs_review = []
    
    for score_file in score_files:
        evidence_file = evidence_dir / score_file.name
        
        if not evidence_file.exists():
            logger.warning(f"Evidence file not found for {score_file.name}")
            continue
        
        result = calibrate_score(score_file, evidence_file)
        results.append(result)
        
        if result['needs_review']:
            needs_review.append(result)
        
        # Write calibrated score (with added metadata)
        with open(score_file, 'r', encoding='utf-8') as f:
            score_data = json.load(f)
        
        score_data['_calibration'] = {
            "pass": result['pass'],
            "issues": [
                result['sparsity'].get('issue'),
                result['conflicts'].get('issue'),
                result['citations'].get('issue')
            ]
        }
        score_data['_calibration']['issues'] = [i for i in score_data['_calibration']['issues'] if i]
        
        output_file = output_dir / score_file.name
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(score_data, f, indent=2, ensure_ascii=False)
    
    # Write summary
    summary = {
        "total_scored": len(results),
        "passed": sum(1 for r in results if r['pass']),
        "needs_review": len(needs_review),
        "review_items": needs_review
    }
    
    summary_file = output_dir / "_calibration_summary.json"
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2)
    
    logger.info(f"Calibration complete: {summary['passed']}/{summary['total_scored']} passed")
    logger.info(f"Summary written to {summary_file}")
    
    return 0


def main():
    setup_logging()
    logger.info("Starting post-calibration")
    return calibrate_all()


if __name__ == "__main__":
    exit(main())
