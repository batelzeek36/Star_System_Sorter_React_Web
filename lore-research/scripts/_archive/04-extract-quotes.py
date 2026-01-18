#!/usr/bin/env python3
"""
Step 4: Extract exact quotes from each gate.line
Creates structured JSON with exact Ra Uru Hu quotes (<25 words)
"""

import json
from pathlib import Path

INPUT_FILE = Path("lore-research/research-outputs/line-companion-gate-lines.json")
OUTPUT_FILE = Path("lore-research/research-outputs/line-companion-quotes.json")

def extract_first_sentence(text: str, max_words: int = 25) -> str:
    """Extract first sentence or first N words as quote"""
    # Try to find first sentence (ends with period, exclamation, or question mark)
    sentences = text.split('. ')
    if sentences:
        first_sentence = sentences[0].strip()
        # If first sentence is reasonable length, use it
        word_count = len(first_sentence.split())
        if word_count <= max_words:
            return first_sentence + ('.' if not first_sentence.endswith(('.', '!', '?')) else '')
    
    # Otherwise, take first N words
    words = text.split()
    return ' '.join(words[:max_words]) + ('...' if len(words) > max_words else '')

def extract_exaltation_detriment(text: str) -> dict:
    """Extract planetary exaltation and detriment if present"""
    result = {
        "exaltation": None,
        "detriment": None
    }
    
    # Look for patterns like:
    # "The Moon exalted as the symbol of adaptation."
    # "Uranus in detriment. Instability leads to distortion."
    
    lines = text.split('\n')
    for line in lines[:10]:  # Check first 10 lines
        line_lower = line.lower()
        
        if 'exalted' in line_lower or 'exaltation' in line_lower:
            result["exaltation"] = line.strip()
        
        if 'detriment' in line_lower:
            result["detriment"] = line.strip()
    
    return result

def main():
    print("💎 Extracting exact quotes from gate.lines...")
    
    # Read gate.line entries
    entries = json.loads(INPUT_FILE.read_text(encoding="utf-8"))
    print(f"   Processing {len(entries)} entries")
    
    # Organize by gate
    by_gate = {}
    
    for entry in entries:
        gate = entry["gate"]
        line = entry["line"]
        
        if line is None:
            continue  # Skip entries without line numbers
        
        text = entry["text"].strip()
        if not text:
            continue
        
        # Extract quote and planetary data
        quote = extract_first_sentence(text, max_words=25)
        planetary = extract_exaltation_detriment(text)
        
        if gate not in by_gate:
            by_gate[gate] = {}
        
        by_gate[gate][line] = {
            "title": entry["title"],
            "heading": entry["heading"],
            "quote": quote,
            "exaltation": planetary["exaltation"],
            "detriment": planetary["detriment"],
            "full_text_length": len(text)
        }
    
    # Write output
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.write_text(json.dumps(by_gate, indent=2), encoding="utf-8")
    
    print(f"✅ Wrote quotes for {len(by_gate)} gates to {OUTPUT_FILE}")
    
    # Statistics
    total_lines = sum(len(lines) for lines in by_gate.values())
    print(f"\n   Total gate.lines with quotes: {total_lines}")
    print(f"   Expected: 384 (64 gates × 6 lines)")
    
    if total_lines < 384:
        print(f"   ⚠️  Missing {384 - total_lines} gate.lines")
    
    # Show sample
    if by_gate:
        first_gate = min(by_gate.keys())
        first_line = min(by_gate[first_gate].keys())
        sample = by_gate[first_gate][first_line]
        print(f"\n   Sample: Gate {first_gate}.{first_line}")
        print(f"   Title: {sample['title']}")
        print(f"   Quote: {sample['quote']}")

if __name__ == "__main__":
    main()
