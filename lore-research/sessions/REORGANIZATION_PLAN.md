# Reorganization Plan - Better Folder Structure

## Current Problem
14 files in root directory - still too many, hard to scan visually.

## Proposed Structure

```
lore-research/
├── README.md (main entry point)
│
├── strategy/                          # Core strategy documents
│   ├── UNIFIED_GATE_LINE_STRATEGY.md
│   ├── GATE_LINE_SYNTHESIS_STRATEGY.md
│   └── gpt-5-gate-line-synthesis.md
│
├── academic/                          # Academic foundation & framing
│   ├── ACADEMIC_FRAMING.md
│   ├── ACADEMIC_CREDIBILITY_ASSESSMENT.md
│   ├── ACADEMIC_POSITIONING_STRATEGY.md
│   └── human-design.md
│
├── reference/                         # Quick reference docs
│   ├── GATE_ARCHETYPES.md
│   ├── CITATION_QUALITY_STANDARDS.md
│   └── STAR_SYSTEMS_FINAL_LIST.md
│
├── sessions/                          # Session notes & tracking
│   ├── SESSION_COMPLETE_2025-01-24.md
│   ├── SESSION_SUMMARY_2025-01-24.md
│   ├── DOCUMENTATION_AUDIT_2025-01-24.md
│   └── CLEANUP_COMPLETE_2025-01-24.md
│
├── prompts/                           # Research prompts (existing)
│   ├── TEMPLATE_PASS_A.txt
│   ├── TEMPLATE_PASS_B.txt
│   ├── TEMPLATE_PASS_C.txt
│   └── PHASE_0_STAR_SYSTEMS/
│
├── research-outputs/                  # Research results (existing)
│   ├── star-systems/
│   └── gate-1/
│
├── source-mining/                     # Source library (existing)
│   └── !ESOTERIC_SOURCE_LIBRARY.md
│
├── documentation/                     # Review needed (existing)
├── Important!/                        # Review needed (existing)
├── scripts/                           # Utility scripts (existing)
├── validation-archives/               # Historical validation (existing)
└── archives/                          # Archived docs (existing)
```

## Benefits

### Visual Clarity
- **Root has only README** (single entry point)
- **4 main folders** for active work (strategy, academic, reference, sessions)
- **5 supporting folders** (prompts, outputs, sources, etc.)

### Logical Grouping
- **strategy/** - Where you go to understand the approach
- **academic/** - Where you go for framing/credibility
- **reference/** - Where you go for quick lookups
- **sessions/** - Where you go for recent updates

### Easy Navigation
```bash
# Want to understand the strategy?
cd lore-research/strategy/

# Need academic framing?
cd lore-research/academic/

# Looking for gate info?
cd lore-research/reference/

# What happened recently?
cd lore-research/sessions/
```

## Files to Move

### Create strategy/ folder (3 files)
- UNIFIED_GATE_LINE_STRATEGY.md
- GATE_LINE_SYNTHESIS_STRATEGY.md
- gpt-5-gate-line-synthesis.md

### Create academic/ folder (4 files)
- ACADEMIC_FRAMING.md
- ACADEMIC_CREDIBILITY_ASSESSMENT.md
- ACADEMIC_POSITIONING_STRATEGY.md
- human-design.md

### Create sessions/ folder (4 files)
- SESSION_COMPLETE_2025-01-24.md
- SESSION_SUMMARY_2025-01-24.md
- DOCUMENTATION_AUDIT_2025-01-24.md
- CLEANUP_COMPLETE_2025-01-24.md

### Move to reference/ (3 files - folder exists, just move)
- GATE_ARCHETYPES.md
- CITATION_QUALITY_STANDARDS.md
- STAR_SYSTEMS_FINAL_LIST.md

## Updated README Structure

```markdown
# Lore Research

## Quick Start
- **New here?** Read [strategy/UNIFIED_GATE_LINE_STRATEGY.md](strategy/UNIFIED_GATE_LINE_STRATEGY.md)
- **Need academic context?** See [academic/ACADEMIC_FRAMING.md](academic/ACADEMIC_FRAMING.md)
- **What's happening now?** Check [sessions/SESSION_COMPLETE_2025-01-24.md](sessions/SESSION_COMPLETE_2025-01-24.md)

## Folders
- **strategy/** - Research methodology and approach
- **academic/** - Academic framing and credibility
- **reference/** - Quick reference documents
- **sessions/** - Session notes and updates
- **prompts/** - Research prompt templates
- **research-outputs/** - Generated research data
- **source-mining/** - Source library (300+ verified sources)
```

## Result

**Root directory:**
- README.md (only file)

**Active work folders (4):**
- strategy/ (3 files)
- academic/ (4 files)
- reference/ (3 files)
- sessions/ (4 files)

**Supporting folders (5):**
- prompts/
- research-outputs/
- source-mining/
- documentation/ (review later)
- Important!/ (review later)

**Archives:**
- archives/
- validation-archives/

**Total: 1 file + 9 folders in root = Much cleaner!**
