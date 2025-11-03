#!/usr/bin/env python3
"""
LLM-assisted star system scoring using OpenAI structured outputs.

Reads evidence packs and uses LLM as a constrained "judge" to score
all 8 star systems for each gate.line with alignment, weight, confidence, and reasoning.
"""

import json
import logging
import os
import time
from pathlib import Path
from typing import Dict, List, Optional, Literal

from pydantic import BaseModel, Field, conlist, confloat

from config import RESEARCH_OUTPUTS_DIR
from utils import setup_logging

logger = logging.getLogger(__name__)

# Check for OpenAI
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    logger.warning("OpenAI library not installed. Install with: pip install openai")


# ============================================================================
# Pydantic Models for Structured Output
# ============================================================================

class SystemScore(BaseModel):
    """Score for a single star system."""
    id: Literal["andromeda", "arcturus", "draco", "lyra", "orion_light", "orion_dark", "pleiades", "sirius"]
    alignment: Literal["core", "shadow", "none"]
    weight: confloat(ge=0.0, le=1.0) = Field(description="Intensity of match, 0.0-1.0")
    why: str = Field(max_length=400, description="Concise reasoning citing evidence phrases")
    confidence: confloat(ge=0.0, le=1.0) = Field(description="Confidence in this scoring, 0.0-1.0")


class StarMapOutput(BaseModel):
    """Complete star system mapping for one gate.line."""
    gate_line: str
    systems: conlist(SystemScore, min_length=8, max_length=8)
    notes: Optional[str] = None
    source_meta: Dict


# ============================================================================
# Rubric (condensed from v4.2 baselines)
# ============================================================================

RUBRIC = """
**Andromeda (core):** Liberation, sovereignty reclamation, anti-domination, rescue/uncapturing, confronting exploitation.
**Andromeda (shadow):** Passive victimhood, savior fixation without boundary, martyr witness.

**Arcturus (core):** Systems thinking, calibration, elegant order, signal hygiene, frequency repair, trauma static cleanup.
**Arcturus (shadow):** Rigidity, technocracy, cold detachment, treating people as energy problems.

**Draco (core):** Raw will, conquest impulse, survival ruthlessness transmuted, predator-guard, resource control for survival.
**Draco (shadow):** Predation, coercive power, domination to secure status, weaponized access.

**Lyra (core):** Artistry, beauty, harmonic imprinting, aesthetic creation, cultural transmission.
**Lyra (shadow):** Aesthetic vanity, hollow performance, beauty without substance.

**Orion-Light (core):** Truth-quest, valor under trial, lawful order, initiation through ordeal, mystery schools, sacred geometry.
**Orion-Light (shadow):** Crusader zealotry, forcing tests on others, spiritualizing suffering to justify power.

**Orion-Dark (core):** Shadow work, taboo alchemy, pattern exposure, using hierarchy as transformation tool.
**Orion-Dark (shadow):** Exploitation, glamorization of darkness, predatory use of hierarchy, status-feeding.

**Pleiades (core):** Nurture, kinship fields, abundance sharing, nervous system caretaking, attachment safety, emotional bonding.
**Pleiades (shadow):** Smothering, martyrdom, panic-attachment, codependency, self-erasure to keep closeness.

**Sirius (core):** Guardianship, kingship service, oaths, catalyzing transformation through crisis, rites of passage.
**Sirius (shadow):** Authoritarianism, divine-right cosplay, forcing ordeals to prove worth.
"""


# ============================================================================
# Prompt Builder
# ============================================================================

def build_prompt(evidence: Dict) -> str:
    """Build the LLM prompt from evidence pack."""
    return f"""Context:
- Gate.Line: {evidence['gate_line']}
- LC: "{evidence['lc_quote']}" (title: {evidence['lc_title']}, locator: {evidence['lc_locator']})
- Legge: "{evidence['legge_quote']}" (title: {evidence['legge_title']}, locator: {evidence['legge_locator']})
- Normalized meaning: {evidence['normalized_meaning']}
- Keywords: {', '.join(evidence['keywords'])}

Task:
Score ALL 8 star systems with alignment (core|shadow|none), weight (0..1), confidence (0..1), and a short "why" that references phrases from the evidence.

Rules:
- Use evidence quotes literally. Do NOT invent text.
- If unsure, set alignment="none" and weight=0.0 with low confidence.
- Prefer precision over coverage. Keep "why" concise (≤60 words).
- At most 2 systems should have weight >0.4 per line.
- If a behavior matches a system's core function, use alignment="core".
- If a behavior matches a system's shadow/distorted expression, use alignment="shadow".
- If no match, use alignment="none" and weight=0.0.

Respond with valid JSON matching the StarMapOutput schema."""


# ============================================================================
# LLM Scorer
# ============================================================================

class LLMScorer:
    """LLM-based star system scorer using OpenAI structured outputs."""
    
    def __init__(self, model: str = "gpt-4o-mini", temperature: float = 0.0):
        if not OPENAI_AVAILABLE:
            raise ImportError("OpenAI library required. Install with: pip install openai")
        
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable not set")
        
        self.client = OpenAI(api_key=api_key)
        self.model = model
        self.temperature = temperature
        self.system_prompt = f"""You are a strict evaluator for star system mapping. Output ONLY valid JSON that conforms to the provided schema.

{RUBRIC}

Rules:
- Use evidence quotes literally. Do NOT invent text.
- If unsure, set alignment="none" and weight=0.0 with low confidence.
- Prefer precision over coverage.
- At most 2 systems should have weight >0.4 per line."""
    
    def score_gate_line(self, evidence: Dict, retry_on_fail: bool = True) -> Optional[StarMapOutput]:
        """Score a single gate.line using LLM."""
        user_prompt = build_prompt(evidence)
        
        try:
            # Use structured output (if available in your OpenAI version)
            # Otherwise, parse JSON from response
            response = self.client.chat.completions.create(
                model=self.model,
                temperature=self.temperature,
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            data = json.loads(content)
            
            # Validate with Pydantic
            result = StarMapOutput(**data)
            return result
            
        except Exception as e:
            logger.error(f"Error scoring {evidence['gate_line']}: {e}")
            
            if retry_on_fail:
                logger.info(f"Retrying {evidence['gate_line']}...")
                time.sleep(1)
                return self.score_gate_line(evidence, retry_on_fail=False)
            
            return None
    
    def score_batch(self, evidence_files: List[Path], output_dir: Path) -> Dict:
        """Score a batch of gate.lines."""
        output_dir.mkdir(parents=True, exist_ok=True)
        
        results = {
            "scored": 0,
            "failed": 0,
            "needs_review": []
        }
        
        for evidence_file in evidence_files:
            with open(evidence_file, 'r', encoding='utf-8') as f:
                evidence = json.load(f)
            
            gate_line = evidence['gate_line']
            logger.info(f"Scoring {gate_line}...")
            
            result = self.score_gate_line(evidence)
            
            if result:
                # Write output
                output_file = output_dir / f"{evidence_file.stem}.json"
                with open(output_file, 'w', encoding='utf-8') as f:
                    f.write(result.model_dump_json(indent=2))
                
                results["scored"] += 1
                
                # Check if needs review (high weights on >2 systems)
                high_weight_count = sum(1 for s in result.systems if s.weight > 0.4)
                if high_weight_count > 2:
                    results["needs_review"].append({
                        "gate_line": gate_line,
                        "reason": f"High weights on {high_weight_count} systems"
                    })
            else:
                results["failed"] += 1
                results["needs_review"].append({
                    "gate_line": gate_line,
                    "reason": "Scoring failed after retry"
                })
            
            # Rate limiting
            time.sleep(0.5)
        
        return results


# ============================================================================
# Main
# ============================================================================

def main():
    import argparse
    
    setup_logging()
    
    parser = argparse.ArgumentParser(description="LLM-assisted star system scoring")
    parser.add_argument("--model", default="gpt-4o-mini", help="OpenAI model to use")
    parser.add_argument("--temperature", type=float, default=0.0, help="Temperature (0.0-1.0)")
    parser.add_argument("--batch-size", type=int, default=32, help="Number of lines to score per run")
    parser.add_argument("--start-gate", type=int, default=1, help="Starting gate number")
    parser.add_argument("--end-gate", type=int, default=64, help="Ending gate number")
    
    args = parser.parse_args()
    
    evidence_dir = RESEARCH_OUTPUTS_DIR / "evidence"
    output_dir = RESEARCH_OUTPUTS_DIR / "star-maps-llm"
    
    if not evidence_dir.exists():
        logger.error(f"Evidence directory not found: {evidence_dir}")
        logger.error("Run 08a-compile-evidence.py first")
        return 1
    
    # Collect evidence files
    evidence_files = []
    for gate in range(args.start_gate, args.end_gate + 1):
        for line in range(1, 7):
            evidence_file = evidence_dir / f"{gate:02d}-{line}.json"
            if evidence_file.exists():
                evidence_files.append(evidence_file)
    
    if not evidence_files:
        logger.error("No evidence files found")
        return 1
    
    # Limit to batch size
    evidence_files = evidence_files[:args.batch_size]
    
    logger.info(f"Scoring {len(evidence_files)} gate.lines with {args.model}")
    
    scorer = LLMScorer(model=args.model, temperature=args.temperature)
    results = scorer.score_batch(evidence_files, output_dir)
    
    logger.info(f"Scored: {results['scored']}, Failed: {results['failed']}")
    
    if results['needs_review']:
        logger.warning(f"{len(results['needs_review'])} items need review")
        review_file = output_dir / "_needs_review.json"
        with open(review_file, 'w', encoding='utf-8') as f:
            json.dump(results['needs_review'], f, indent=2)
        logger.info(f"Review list written to {review_file}")
    
    return 0


if __name__ == "__main__":
    exit(main())
