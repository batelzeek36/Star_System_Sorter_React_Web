#!/usr/bin/env python3
"""
05c-llm-repair-legge.py

LLM-powered OCR repair pass for Legge I Ching text.
Fixes only OCR artifacts (broken hyphenation, ligatures, spurious headers)
without paraphrasing or modernizing the text.

Includes strict guardrails:
- Change ratio threshold to reject large edits
- Full audit logging with diffs
- Reversible (keeps original in separate file)

Usage:
    # Dry run first
    python3 lore-research/scripts/05c-llm-repair-legge.py --dry-run
    
    # Actual repair
    python3 lore-research/scripts/05c-llm-repair-legge.py --provider openai --model gpt-4o-mini
    
    # With custom threshold
    python3 lore-research/scripts/05c-llm-repair-legge.py --max-change-ratio 0.2
"""

import json
import difflib
import argparse
from pathlib import Path
from datetime import datetime

# Paths
IN_PATH = Path("s3-data/hexagrams/legge-hx.json")
OUT_PATH = Path("s3-data/hexagrams/legge-hx.repaired.json")
LOG_DIR = Path("lore-research/repair_reports")
LOG_DIR.mkdir(parents=True, exist_ok=True)

# System prompt for LLM
SYSTEM_RULES = """You are a text restorer for a public-domain 1899 English translation (Legge) of the I Ching.

ONLY fix obvious OCR artifacts:
- Broken hyphenation (e.g., "sub¬ject" → "subject")
- Spurious page headers/footers
- Split words (e.g., "sub ject" → "subject")
- Ligature errors (e.g., "ﬁ" → "fi")
- Accidental inserted commentary snippets

DO NOT:
- Rephrase or modernize wording
- Change punctuation unless required to fix OCR glitch
- Alter line numbering
- Add interpretations or explanations

If unsure, return the input unchanged.
Return ONLY the repaired line as plain text (no quotes, no explanations)."""


def call_model(provider, model, user_prompt, system=SYSTEM_RULES, max_tokens=256):
    """
    Call LLM provider to repair text.
    
    TODO: Implement with your SDK of choice.
    
    Examples:
    - OpenAI: client.chat.completions.create(...)
    - Anthropic: client.messages.create(...)
    """
    # Placeholder - implement with your LLM provider
    raise NotImplementedError(
        "Wire this to your LLM provider (OpenAI, Anthropic, etc.)\n"
        "See function docstring for examples."
    )


def change_ratio(a, b):
    """Calculate edit distance ratio between two strings."""
    return 1.0 - difflib.SequenceMatcher(None, a, b).ratio()


def build_prompt(title, judgment, line_no, raw_line):
    """Build repair prompt with context."""
    ctx = f"Hexagram Title: {title or '(unknown)'}\n"
    if judgment:
        ctx += f"Judgment snippet (optional): {judgment[:500]}\n"
    
    return f"""{ctx}
Task: Repair ONLY OCR artifacts in the following Legge line without changing its wording meaningfully.

Line {line_no} (OCR):
{raw_line}"""


def main():
    """Main execution."""
    ap = argparse.ArgumentParser(description="LLM-powered OCR repair for Legge text")
    ap.add_argument("--provider", default="openai", help="LLM provider (openai, anthropic, etc.)")
    ap.add_argument("--model", default="gpt-4o-mini", help="Model name")
    ap.add_argument(
        "--max-change-ratio",
        type=float,
        default=0.28,
        help="Reject if edit distance ratio exceeds this (0.0-1.0)"
    )
    ap.add_argument("--dry-run", action="store_true", help="Don't write changes, just report")
    args = ap.parse_args()

    print(f"Reading index: {IN_PATH}")
    idx = json.loads(IN_PATH.read_text(encoding="utf-8"))

    repaired = 0
    rejected = 0
    decisions = []

    for k, hx in idx.items():
        title = hx.get("title", "")
        judgment = hx.get("raw_text", "")
        lines = hx.get("lines", {})

        for sline, obj in lines.items():
            raw = (obj or {}).get("raw", "")
            
            if not raw:
                # Skip empty lines
                continue

            # Build prompt with context
            prompt = build_prompt(title, judgment, sline, raw)

            try:
                repaired_text = call_model(args.provider, args.model, prompt)
            except NotImplementedError:
                print("\n⚠️  LLM provider not implemented yet!")
                print("   Edit call_model() function to wire up your LLM SDK")
                return
            except Exception as e:
                print(f"Error processing {k}.{sline}: {e}")
                repaired_text = raw

            # Calculate change ratio
            ratio = change_ratio(raw, repaired_text)
            accept = ratio <= args.max_change_ratio and len(repaired_text.strip()) > 0

            # Log decision
            decisions.append({
                "hexagram": int(k),
                "line": int(sline),
                "accepted": accept,
                "change_ratio": round(ratio, 3),
                "before": raw,
                "after": repaired_text
            })

            if accept:
                if not args.dry_run:
                    # Apply repair
                    idx[k]["lines"][sline]["raw"] = repaired_text
                    
                    # Add quality note
                    meta = idx[k].setdefault("_meta", {})
                    q = meta.setdefault("quality_notes", [])
                    q.append({
                        "ts": datetime.utcnow().isoformat(timespec="seconds") + "Z",
                        "line": int(sline),
                        "action": "llm_ocr_repair",
                        "model": args.model,
                        "provider": args.provider,
                        "change_ratio": round(ratio, 3)
                    })
                
                repaired += 1
            else:
                rejected += 1

    # Write output
    if not args.dry_run:
        OUT_PATH.write_text(json.dumps(idx, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"✓ Wrote repaired index → {OUT_PATH}")
    else:
        print("✓ Dry run complete (no files written)")

    # Write decision log
    report = LOG_DIR / f"llm_repair_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.ndjson"
    report.write_text("\n".join(json.dumps(d, ensure_ascii=False) for d in decisions), encoding="utf-8")

    # Summary
    print(f"\nSummary:")
    print(f"  - Lines repaired: {repaired}")
    print(f"  - Lines rejected: {rejected}")
    print(f"  - Decision log: {report}")


if __name__ == "__main__":
    main()
