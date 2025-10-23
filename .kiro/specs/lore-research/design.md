# Lore Research Design

## Architecture

### Template-Based System

**Problem**: 64 gates × 3 passes = 192 prompts with 95% identical content  
**Solution**: 3 templates with variable substitution

```
TEMPLATE_PASS_A.txt  →  gate-X/COMET_PASS_A_GATE_X.txt
TEMPLATE_PASS_B.txt  →  gate-X/COMET_PASS_B_GATE_X.txt
TEMPLATE_PASS_C.txt  →  gate-X/COMET_PASS_C_GATE_X.txt
```

**Variables**:
- `{{GATE_NUMBER}}` - Gate number (1-64)
- `{{GATE_ARCHETYPE}}` - Keywords from GATE_ARCHETYPES.md

### Folder Structure

```
lore-research/
├── prompts/
│   ├── TEMPLATE_PASS_A.txt           # HD/Gene Keys/I Ching template
│   ├── TEMPLATE_PASS_B.txt           # Ancient wisdom template
│   ├── TEMPLATE_PASS_C.txt           # Star systems template
│   ├── gate-1/                       # Generated prompts
│   │   ├── COMET_PASS_A_GATE_1.txt
│   │   ├── COMET_PASS_B_GATE_1.txt
│   │   └── COMET_PASS_C_GATE_1.txt
│   └── gate-X/                       # One folder per gate
├── research-outputs/
│   ├── gate-1-pass-a.json            # Comet responses
│   ├── gate-1-pass-b.json
│   ├── gate-1-pass-c.json
│   └── gate-X-pass-[a|b|c].json
├── scripts/
│   ├── generate-gate-prompts.sh      # Automation
│   └── check-progress.sh             # Progress tracking
├── GATE_ARCHETYPES.md                # Keywords reference
├── CITATION_QUALITY_STANDARDS.md     # Validation criteria
└── TASKS.md                          # Workflow & checklist
```

## Workflow Design

### Phase 1: Generate Prompts

```bash
./scripts/generate-gate-prompts.sh X "archetype keywords"
```

**Process**:
1. Read templates
2. Replace `{{GATE_NUMBER}}` with X
3. Replace `{{GATE_ARCHETYPE}}` with keywords
4. Write to `prompts/gate-X/`

**Time**: 30 seconds per gate

### Phase 2: Research in Comet

**For each gate**:
1. Paste `COMET_PASS_A_GATE_X.txt` into Perplexity Comet
2. Save JSON response to `research-outputs/gate-X-pass-a.json`
3. Repeat for Pass B and Pass C

**Time**: 10-15 minutes per gate (3-5 min per pass)

### Phase 3: Validate

**Checklist per gate**:
- [ ] All 3 JSON files exist
- [ ] All citations have page numbers
- [ ] All citations have actual quotes (not "unknown")
- [ ] All citations have edition info
- [ ] URLs included where available

**Time**: 2-3 minutes per gate

### Phase 4: Track Progress

```bash
./scripts/check-progress.sh
```

**Output**:
```
✅ Gate 1 - COMPLETE (all 3 passes)
⚠️  Gate 2 - PARTIAL (A B -)
📊 Progress: 1 / 64 gates (1% complete)
```

## Research Pass Design

### Pass A: Foundation (HD + Gene Keys + I Ching)

**Purpose**: Establish core meaning from authoritative sources

**Output Schema**:
```json
{
  "gate": 1,
  "gate_name": "Self-Expression",
  "hd_meaning": "...",
  "gene_keys": {
    "shadow": "...",
    "gift": "...",
    "siddhi": "..."
  },
  "i_ching_parallel": {
    "hexagram": 1,
    "name": "The Creative",
    "meaning": "...",
    "relevance": "..."
  },
  "citations": {
    "primary": [...],
    "secondary": [...]
  }
}
```

### Pass B: Ancient Wisdom Connections

**Purpose**: Find parallels in ancient traditions

**Output Schema**:
```json
{
  "gate": 1,
  "ancient_wisdom_connections": [
    {
      "source_type": "egyptian|chinese|vedic|indigenous|greek|sumerian",
      "text": "I Ching",
      "author": "...",
      "edition": "Wilhelm/Baynes translation, 3rd Edition",
      "year": 1950,
      "connection": "...",
      "quote": "...",
      "page_or_section": "Hexagram 1, Line 1",
      "url": "..."
    }
  ],
  "contradictions": [],
  "notes": "..."
}
```

### Pass C: Star System Alignments

**Purpose**: Map gate essence to star system archetypes

**Output Schema**:
```json
{
  "gate": 1,
  "star_system_alignments": [
    {
      "system": "Pleiades",
      "confidence": "high|medium|low|speculative",
      "evidence_type": "explicit|thematic|cross_cultural|inferred",
      "primary_rationale": "...",
      "ancient_support": [...],
      "modern_support": [...],
      "cross_cultural_pattern": "...",
      "sources": [
        {
          "title": "...",
          "author": "...",
          "edition": "2nd Edition 2005",
          "year": 2005,
          "source_type": "ancient|channeled|research|indigenous",
          "quote": "...",
          "page": "Chapter 5, pp. 78-80",
          "url": "...",
          "disputed": false
        }
      ]
    }
  ],
  "mind_blowing_connections": [],
  "contradictions": []
}
```

## Priority Design

### Research Order (by Human Design Center)

1. **G Center** (8 gates) - Identity & direction
2. **Throat** (11 gates) - Expression & manifestation
3. **Solar Plexus** (9 gates) - Emotional authority
4. **Spleen** (7 gates) - Intuition & survival
5. **Ajna** (6 gates) - Mental awareness
6. **Head** (3 gates) - Mental pressure
7. **Heart/Ego** (4 gates) - Willpower
8. **Sacral** (9 gates) - Life force
9. **Root** (7 gates) - Drive & pressure

**Rationale**: G Center gates define identity/direction, most relevant to star system classification.

## Automation Design

### generate-gate-prompts.sh

```bash
#!/bin/bash
GATE_NUMBER=$1
GATE_ARCHETYPE=$2

# Create folder
mkdir -p "prompts/gate-$GATE_NUMBER"

# Generate 3 prompts from templates
sed "s/{{GATE_NUMBER}}/$GATE_NUMBER/g; s/{{GATE_ARCHETYPE}}/$GATE_ARCHETYPE/g" \
    TEMPLATE_PASS_A.txt > "prompts/gate-$GATE_NUMBER/COMET_PASS_A_GATE_$GATE_NUMBER.txt"

# Repeat for B and C
```

### check-progress.sh

```bash
#!/bin/bash
for i in {1..64}; do
  if [ -f "gate-$i-pass-a.json" ] && 
     [ -f "gate-$i-pass-b.json" ] && 
     [ -f "gate-$i-pass-c.json" ]; then
    echo "✅ Gate $i - COMPLETE"
  fi
done
```

## Integration Design

### Final Compilation

**Process**:
1. Collect all 192 JSON files
2. Extract star system alignments
3. Convert to YAML rules
4. Merge into `star-system-sorter/data/lore/lore.yaml`

**Example Rule**:
```yaml
- gate: 1
  condition: "gate_1_defined"
  systems:
    - name: "Pleiades"
      weight: 0.8
      confidence: "high"
      evidence_type: "cross_cultural"
      sources:
        - "The Rave I'Ching, Gate 1, pp. 23-25"
        - "I Ching, Hexagram 1 (Wilhelm/Baynes)"
```

## Quality Assurance Design

### Validation Checklist

**Per JSON file**:
- [ ] Valid JSON structure
- [ ] All required fields present
- [ ] Citations have page numbers (not "unknown")
- [ ] Citations have quotes (not "unknown")
- [ ] Citations have editions (not "unknown")
- [ ] URLs included where available

**Per gate (all 3 passes)**:
- [ ] Consistent gate number across files
- [ ] No contradictions between passes
- [ ] Cross-references validated
- [ ] Confidence levels justified

### Rejection Criteria

**Reject response if**:
- Page numbers are "unknown"
- Quotes are "unknown"
- Editions are "unknown"
- URLs missing for online sources
- Evidence doesn't support confidence level

## Time Estimates

| Phase | Time per Gate | Total (64 gates) |
|-------|---------------|------------------|
| Generate prompts | 30 sec | 32 min |
| Research (3 passes) | 10-15 min | 10-16 hours |
| Validate | 2-3 min | 2-3 hours |
| **Total** | **15-20 min** | **16-21 hours** |

## Success Metrics

- ✅ 192 JSON files (64 gates × 3 passes)
- ✅ 100% citation quality compliance
- ✅ 0 "unknown" values for required fields
- ✅ Average 2-3 sources per star system alignment
- ✅ Cross-cultural patterns identified for 30%+ of gates
- ✅ Integration with lore.yaml complete
