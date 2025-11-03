#!/usr/bin/env python3
"""
Compile evidence packs for LLM-assisted star system mapping.

For each gate.line, pulls:
- LC quote (≤25 words)
- Legge quote (≤25 words)
- Normalized meaning from hexagram files
- Keywords

Outputs to evidence/{gate}-{line}.json for LLM consumption.
"""

import json
import logging
from pathlib import Path
from typing import Dict, List, Optional

from config import (
    S3_DATA_ROOT,
    RESEARCH_OUTPUTS_DIR,
    LEGGE_MODE,
    LEGGE_PARAPHRASE_DIR,
)
from utils import setup_logging

logger = logging.getLogger(__name__)


def load_gate_file(gate: int) -> Optional[Dict]:
    """Load gate file from s3-data/gates/."""
    gate_file = S3_DATA_ROOT / "gates" / f"{gate:02d}.json"
    if not gate_file.exists():
        logger.warning(f"Gate file not found: {gate_file}")
        return None
    
    with open(gate_file, 'r', encoding='utf-8') as f:
        return json.load(f)


def load_hexagram_file(gate: int) -> Optional[Dict]:
    """Load hexagram file from s3-data/hexagrams/."""
    hex_file = S3_DATA_ROOT / "hexagrams" / f"{gate:02d}.json"
    if not hex_file.exists():
        logger.warning(f"Hexagram file not found: {hex_file}")
        return None
    
    with open(hex_file, 'r', encoding='utf-8') as f:
        return json.load(f)


def extract_quote(text: str, max_words: int = 25) -> str:
    """Extract first sentence up to max_words."""
    if not text:
        return ""
    
    # Split into sentences (simple approach)
    sentences = text.replace('!', '.').replace('?', '.').split('.')
    first_sentence = sentences[0].strip()
    
    # Truncate to max_words
    words = first_sentence.split()
    if len(words) > max_words:
        return ' '.join(words[:max_words]) + '...'
    
    return first_sentence


def compile_evidence_for_line(gate: int, line: int) -> Optional[Dict]:
    """Compile evidence pack for a single gate.line."""
    gate_data = load_gate_file(gate)
    hex_data = load_hexagram_file(gate)
    
    if not gate_data:
        logger.error(f"Cannot compile evidence for {gate}.{line}: gate file missing")
        return None
    
    line_key = str(line)
    gate_lines = gate_data.get('lines', {})
    
    if line_key not in gate_lines:
        logger.warning(f"Line {line} not found in gate {gate}")
        return None
    
    line_data = gate_lines[line_key]
    classical = line_data.get('classical', {})
    
    # Extract LC quote
    lc_data = classical.get('line_companion', {})
    lc_quote = lc_data.get('hd_quote', '')
    lc_title = lc_data.get('hd_title', '')
    
    # Extract Legge quote
    legge_data = classical.get('legge', {})
    legge_quote = legge_data.get('hd_quote', '')
    legge_title = legge_data.get('hd_title', '')
    
    # Extract normalized meaning from hexagram
    normalized_meaning = ""
    keywords = []
    
    if hex_data:
        hex_lines = hex_data.get('lines', {})
        if line_key in hex_lines:
            hex_line = hex_lines[line_key]
            normalized_meaning = hex_line.get('meaning', '')
            keywords = hex_line.get('keywords', [])
    
    # Build evidence pack
    evidence = {
        "gate_line": f"{gate}.{line}",
        "lc_quote": extract_quote(lc_quote, 25),
        "lc_title": lc_title,
        "lc_locator": f"gate-{gate:02d}.json#{line}",
        "legge_quote": extract_quote(legge_quote, 25),
        "legge_title": legge_title,
        "legge_locator": f"hx{gate:02d}:line{line}",
        "normalized_meaning": normalized_meaning,
        "keywords": keywords,
        "mode": LEGGE_MODE,
    }
    
    return evidence


def compile_all_evidence():
    """Compile evidence packs for all 384 gate.lines."""
    output_dir = RESEARCH_OUTPUTS_DIR / "evidence"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    logger.info(f"Compiling evidence packs to {output_dir}")
    
    compiled_count = 0
    missing_count = 0
    
    for gate in range(1, 65):
        for line in range(1, 7):
            evidence = compile_evidence_for_line(gate, line)
            
            if evidence:
                output_file = output_dir / f"{gate:02d}-{line}.json"
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(evidence, f, indent=2, ensure_ascii=False)
                compiled_count += 1
            else:
                missing_count += 1
                logger.warning(f"Could not compile evidence for {gate}.{line}")
    
    logger.info(f"Compiled {compiled_count} evidence packs")
    if missing_count > 0:
        logger.warning(f"Missing evidence for {missing_count} gate.lines")
    
    # Write summary
    summary = {
        "total_compiled": compiled_count,
        "total_missing": missing_count,
        "mode": LEGGE_MODE,
        "output_dir": str(output_dir),
    }
    
    summary_file = output_dir / "_summary.json"
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2)
    
    logger.info(f"Summary written to {summary_file}")


def main():
    setup_logging()
    logger.info("Starting evidence compilation")
    compile_all_evidence()
    logger.info("Evidence compilation complete")


if __name__ == "__main__":
    main()
