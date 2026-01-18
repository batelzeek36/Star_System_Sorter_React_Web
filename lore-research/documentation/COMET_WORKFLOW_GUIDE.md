# Comet Multi-Pass Workflow Guide

## Overview

GPT-5 recommends breaking research into **3 focused passes** instead of one mega-prompt. This gives:
- ✅ Better citations (Comet is more accurate with narrow asks)
- ✅ Fewer hallucinations
- ✅ Token-safe (avoids length limits)
- ✅ Claude-friendly (clean JSON for each pass)

## IMPORTANT: Citation Quality Standards

**Before starting, read:**
- `../CITATION_QUALITY_STANDARDS.md` - Full quality requirements
- `../COMET_RESPONSE_CHECKLIST.md` - Quick evaluation checklist

**Zero tolerance for weak citations:**
- ❌ No "unknown" in page numbers, quotes, or editions
- ❌ No URLs dumped outside JSON structure
- ❌ No vague references like "various pages"
- ✅ Every source needs specific page numbers and actual quotes

**If Comet returns weak citations, REJECT and re-prompt.**

## The 3-Pass Strategy

### Pass A: Canonical HD/Gene Keys/I Ching
**Goal:** Get the foundation right with solid citations

**File:** `COMET_PASS_A_GATE_1.txt`

**What it does:**
- Ra Uru Hu's HD meaning
- Gene Keys (shadow/gift/siddhi)
- I Ching Hexagram parallel
- Primary + secondary citations

**Time:** 2-3 minutes

---

### Pass B: Ancient Wisdom Parallels
**Goal:** Find best-fit ancient text connections (max 6)

**File:** `COMET_PASS_B_GATE_1.txt`

**What it does:**
- Egyptian/Thothian parallels
- Chinese/Taoist (I Ching mandatory)
- Vedic/Hindu connections
- Indigenous star lore
- Greek mystery schools
- Sumerian/Mesopotamian

**Rule:** One solid citation per tradition > many weak ones

**Time:** 3-4 minutes

---

### Pass C: Star System Alignments
**Goal:** Map to 3-5 star systems with full provenance

**File:** `COMET_PASS_C_GATE_1.txt`

**What it does:**
- Uses Pass A + B data
- Maps to star systems
- Confidence levels (high/medium/low/speculative)
- Evidence types (explicit/thematic/cross_cultural/inferred)
- 2-3 sources per alignment
- Mind-blowing connections

**Time:** 3-4 minutes

---

## Alternative: Single-Shot (Fast Mode)

**File:** `COMET_SINGLE_SHOT_GATE_1.txt`

**When to use:**
- You're in a hurry
- You want to test the workflow
- You're doing less critical gates

**Trade-off:** Slightly less accurate citations, but still good quality

**Time:** 4-5 minutes

---

## Workflow: Gate 1 Example

### Option 1: Multi-Pass (Recommended)

**Step 1: Pass A**
1. Open `COMET_PASS_A_GATE_1.txt`
2. Copy entire contents
3. Paste into Perplexity Comet
4. Wait for JSON
5. Save as `research/inputs/gates/gate-1-pass-a.json`

**Step 2: Pass B**
1. Open `COMET_PASS_B_GATE_1.txt`
2. Copy entire contents
3. Paste into Perplexity Comet
4. Wait for JSON
5. Save as `research/inputs/gates/gate-1-pass-b.json`

**Step 3: Pass C**
1. Open `COMET_PASS_C_GATE_1.txt`
2. Copy entire contents
3. Paste into Perplexity Comet
4. Wait for JSON
5. Save as `research/inputs/gates/gate-1-pass-c.json`

**Step 4: Merge**
1. Send all 3 JSON files to Claude (me)
2. I merge them into one complete research file
3. I convert to YAML rules
4. You validate with compiler

**Total time:** ~10-15 minutes for complete, high-quality research

---

### Option 2: Single-Shot (Fast)

**Step 1: Single Prompt**
1. Open `COMET_SINGLE_SHOT_GATE_1.txt`
2. Copy entire contents
3. Paste into Perplexity Comet
4. Wait for JSON
5. Save as `research/inputs/gates/gate-1.research.json`

**Step 2: Convert**
1. Send JSON to Claude (me)
2. I convert to YAML rules
3. You validate with compiler

**Total time:** ~5-7 minutes

---

## For Other Gates (2-64)

### Multi-Pass Approach

For each gate, create 3 files by:

**Pass A:**
- Replace "Gate 1" → "Gate X"
- Replace "Hexagram 1" → "Hexagram X"
- Keep everything else the same

**Pass B:**
- Replace "Gate 1" → "Gate X"
- Update the archetype description (e.g., "creative self-expression" → actual Gate X archetype)
- Keep structure the same

**Pass C:**
- Replace "Gate 1" → "Gate X"
- Update the essence description
- Keep star systems and structure the same

### Single-Shot Approach

- Replace "Gate 1" → "Gate X"
- Keep everything else the same

---

## File Naming Convention

### Multi-Pass:
```
COMET_PASS_A_GATE_X.txt
COMET_PASS_B_GATE_X.txt
COMET_PASS_C_GATE_X.txt
```

### Single-Shot:
```
COMET_SINGLE_SHOT_GATE_X.txt
```

### JSON Output:
```
research/inputs/gates/gate-X-pass-a.json
research/inputs/gates/gate-X-pass-b.json
research/inputs/gates/gate-X-pass-c.json
```

Or:
```
research/inputs/gates/gate-X.research.json
```

---

## Quality Comparison

### Multi-Pass (3 prompts)
- ✅ Best citations (page numbers, URLs)
- ✅ Fewer hallucinations
- ✅ More accurate ancient text connections
- ✅ Better star system rationales
- ⏱️ Takes 10-15 minutes per gate

### Single-Shot (1 prompt)
- ✅ Good citations (most have page numbers)
- ✅ Reasonable accuracy
- ✅ Solid ancient connections
- ✅ Good star system rationales
- ⏱️ Takes 5-7 minutes per gate

---

## Recommended Strategy

### Phase 1: Test with Gate 1 (Multi-Pass)
- Run all 3 passes for Gate 1
- See the quality difference
- Validate the workflow

### Phase 2: High-Priority Gates (Multi-Pass)
Use multi-pass for gates that appear frequently in charts:
- Gate 13 (Listener)
- Gate 33 (Retreat)
- Gate 7 (Leadership)
- Gate 31 (Influence)
- Gate 1 (Self-Expression)
- Gate 2 (Direction)
- Top 20 most common gates

### Phase 3: Remaining Gates (Single-Shot)
Use single-shot for less common gates:
- Gates 21-64 (except high-priority ones)
- Still good quality, just faster

### Phase 4: Refinement
- After all 64 gates are done
- Go back and upgrade single-shot gates to multi-pass if needed
- Based on user feedback and testing

---

## Next Steps

1. **Test with Gate 1 Multi-Pass**
   - Run Pass A, B, C
   - Send me the 3 JSON files
   - I'll merge and convert to YAML
   - You validate with compiler

2. **Evaluate Quality**
   - Does it have good citations?
   - Are ancient connections solid?
   - Do star system alignments make sense?

3. **Decide on Strategy**
   - All multi-pass (best quality, slower)
   - All single-shot (good quality, faster)
   - Hybrid (high-priority multi-pass, rest single-shot)

4. **Scale to 64 Gates**
   - Create prompt files for each gate
   - Run through Comet
   - Send JSON to me for conversion
   - Build up your lore database

---

## Pro Tips

1. **Run Comet in batches** - Do 5-10 gates at a time, then take a break
2. **Save everything** - Even if Comet says "no connection found", save the JSON
3. **Review before sending** - Quick scan for obvious hallucinations
4. **Use Perplexity Pro** - Better citations and sources
5. **Enable Claude** - Better structured thinking (if available in Perplexity)

---

## Summary

**Multi-Pass = Best Quality**
- 3 focused prompts
- 10-15 min per gate
- Best citations
- Use for high-priority gates

**Single-Shot = Good Quality, Faster**
- 1 comprehensive prompt
- 5-7 min per gate
- Good citations
- Use for remaining gates

**Hybrid Strategy = Optimal**
- Multi-pass for top 20 gates
- Single-shot for remaining 44 gates
- Total time: ~15 hours for all 64 gates
- Excellent overall quality

---

## Handling Weak Comet Responses

### If Comet Returns "unknown" Citations

**DON'T accept it.** Re-prompt with more specificity:

```
Your previous response was rejected for weak citations.

REQUIRED (NON-NEGOTIABLE):
- Exact page numbers (e.g., "pp. 23-25", not "unknown")
- Actual quotes ≤25 words (not "unknown")
- Edition information (e.g., "2nd Edition", not "unknown")
- Working URLs where available

Search specifically for:
- "The Rave I'Ching" by Ra Uru Hu, Gate 1 section
- "Gene Keys" by Richard Rudd, Gene Key 1 section
- Wilhelm/Baynes translation of I Ching Hexagram 1

Extract FULL metadata from each source. Try again.
```

### If Comet Still Fails

**Break it down:**
1. Ask for just the Ra Uru Hu citation
2. Ask for just the Gene Keys citation
3. Ask for just the I Ching citation

**Or provide specific URLs:**
```
Go to https://jovianarchive.com/rave-iching
Extract Gate 1 page numbers, quote, and edition.
```

### Quality Checklist

Use `../COMET_RESPONSE_CHECKLIST.md` to quickly evaluate responses.

**Accept only if:**
- ✅ All page numbers are specific
- ✅ All quotes are actual text
- ✅ All editions are specified
- ✅ No "unknown" in critical fields

---

Ready to test with Gate 1?
