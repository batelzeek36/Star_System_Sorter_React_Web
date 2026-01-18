# Orion Light Prompt Fix V2 - Balancing Rigor with Synthesis

## Problem Evolution

### Issue #1: Too Lenient (Original Output)
- AI included Encyclopedia.com as a source
- Violated "no wiki/aggregator sites" rule

### Issue #2: Too Strict (After First Fix)
AI refused to complete the task, saying:
> "The hypothesis of a distinct 'Orion Light' faction appears to be a modern esoteric synthesis rather than an ancient documented tradition."

**The AI misunderstood the task** - it thought we needed sources that explicitly say "Orion Light faction" rather than synthesizing from multiple verified sources.

## The Balance We Need

### ✅ STRICT ABOUT: Source Quality
- NO blogs, wikis, encyclopedias, social media
- YES published books with ISBNs
- YES academic papers
- YES ancient texts with named translators
- YES established channeled works (published books)

### ✅ FLEXIBLE ABOUT: Evidence Type
- **Direct evidence**: Source explicitly states the characteristic
- **Inferred evidence**: Source provides information that logically supports the characteristic
- **Symbolic evidence**: Source uses symbolism/mythology that relates to the characteristic

## What We Added (V2 Fix)

### 1. "CRITICAL: INFERENCE AND SYNTHESIS ARE REQUIRED" Section

Explains the difference between:
- **Source quality** (what we're strict about) - NO wikis/blogs
- **Evidence type** (what we document) - direct/inferred/symbolic

Shows acceptable research approach:
```
✅ Orion = Osiris (Pyramid Texts) + Osiris = resurrection 
   → Characteristic: "Associated with spiritual rebirth"
   Evidence type: direct, Ancient support: high

✅ Thoth = record keeper (Hermetic texts) + Thoth = Egyptian wisdom god
   → Characteristic: "Record keepers and historians"  
   Evidence type: inferred, Ancient support: high
```

### 2. Clarified "Light vs Dark" Expectations

Added explicit guidance:
- The "Light vs Dark" distinction is a **modern esoteric framework** (not ancient)
- This is EXPECTED and ACCEPTABLE
- Task: Document ancient sources (Orion-Osiris as benevolent) + modern sources (Law of One duality)
- Explain the synthesis in `light_vs_dark_distinctions` field

### 3. "STOP OVERTHINKING" Section

Lists all the sources the AI has access to:
- Pyramid Texts (Faulkner, Allen)
- Book of the Dead
- Hermetic Corpus
- The Kybalion
- Manly P. Hall
- Robert Bauval
- Plutarch, Iamblichus

Explicitly states:
> "Your job: Cite these verified sources, extract quotes, synthesize characteristics, mark evidence_type"

> "What you're NOT doing: Looking for sources that say 'Orion Light faction' explicitly"

### 4. Concrete Example

Shows exactly how to handle "Record keepers and historians":
- Which sources to cite (Pyramid Texts, Hermetic Corpus, Manly P. Hall)
- What evidence_type to use (inferred)
- What ancient_support level (high)
- Why this is acceptable (documenting verified sources + synthesizing connections)

## Key Insight

**Lore research requires synthesis.** We're not looking for one source that validates the entire hypothesis. We're:

1. Finding verified sources about Orion/Osiris (ancient Egyptian texts)
2. Finding verified sources about Thoth/Hermes (Hermetic tradition)
3. Finding verified sources about mystery schools (classical sources)
4. Finding verified sources about Orion factions (modern channeled material)
5. **Synthesizing** these into characteristics, properly marked with evidence_type

The rigor is in **source quality** (no blogs/wikis), not in requiring ancient Egyptians to use the term "Orion Light faction."

## Testing

Re-run the Orion Light baseline with V2 prompt. Expected outcome:
- ✅ No Encyclopedia.com or wiki sources
- ✅ Proper synthesis of ancient + Hermetic + modern sources
- ✅ Characteristics marked with appropriate evidence_type (direct/inferred/symbolic)
- ✅ Light vs Dark distinction explained as modern framework
- ✅ All sources have complete citations with ISBNs, page numbers, quotes
