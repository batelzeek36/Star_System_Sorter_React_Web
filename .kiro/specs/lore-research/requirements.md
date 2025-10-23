# Lore Research Requirements

## Objective

Research all 64 Human Design gates and establish evidence-based connections to star system archetypes for the Star System Sorter application.

## Scope

### In Scope

1. **64 Human Design Gates**
   - Ra Uru Hu's meanings from The Rave I'Ching
   - Gene Keys (shadow, gift, siddhi) from Richard Rudd
   - I Ching hexagram parallels

2. **Ancient Wisdom Connections**
   - Egyptian/Thothian (Emerald Tablets, Book of the Dead, Pyramid Texts, Hermetica)
   - Chinese/Taoist (I Ching, Tao Te Ching)
   - Vedic/Hindu (Rig Veda, Bhagavad Gita, Upanishads)
   - Indigenous (Hopi, Dogon, Aboriginal, Cherokee/Mayan)
   - Greek/Mystery Schools (Orphic, Plato, Pythagoras)
   - Sumerian/Mesopotamian (Enuma Elish, Gilgamesh)

3. **Star System Alignments**
   - Sirius (teachers, guardians, Sirian-Christos lineage)
   - Pleiades (nurturers, artists, empaths, Seven Sisters)
   - Orion Light/Osirian (historians, Egyptian mystery schools)
   - Arcturus (engineers, healers, geometric consciousness)
   - Andromeda (explorers, iconoclasts, freedom, sovereignty)
   - Lyra (primordial builders, feline beings, instinct)

### Out of Scope

- Draco (disputed, not in primary 6 systems)
- Zeta Reticuli (disputed, not in primary 6 systems)
- Modern channeled material without ancient precedent
- Personal interpretations without citations

## Quality Standards

### Citation Requirements (Non-Negotiable)

All research MUST include:
- ✅ Specific page numbers or sections (e.g., "Gate 1, pp. 23-25")
- ✅ Actual quotes ≤25 words from source material
- ✅ Edition information (e.g., "2nd Edition", "Wilhelm/Baynes translation")
- ✅ Working URLs where available
- ❌ "unknown" only if source is genuinely inaccessible

### Evidence Types

- **Explicit**: Direct statement in source material
- **Thematic**: Strong thematic parallel with clear connection
- **Cross-cultural**: Pattern appears across multiple traditions
- **Inferred**: Logical inference from established patterns

### Confidence Levels

- **High**: 3+ sources, explicit evidence, cross-cultural patterns
- **Medium**: 2 sources, thematic evidence, single tradition
- **Low**: 1 source, inferred connection
- **Speculative**: Logical but limited evidence

## Deliverables

### Per Gate (3 JSON files)

1. **Pass A**: `gate-X-pass-a.json`
   - HD meaning, Gene Keys, I Ching parallel
   - Primary citations (Ra Uru Hu, Richard Rudd)

2. **Pass B**: `gate-X-pass-b.json`
   - Ancient wisdom connections (max 6)
   - Citations with page numbers, quotes, editions

3. **Pass C**: `gate-X-pass-c.json`
   - Star system alignments (3-5 systems)
   - 2-3 sources per alignment with full metadata

### Final Output

- 192 JSON files (64 gates × 3 passes)
- Compiled into `data/lore/lore.yaml`
- Integrated into Star System Sorter scoring algorithm

## Success Criteria

1. ✅ All 64 gates researched with 3 passes each
2. ✅ All citations meet quality standards
3. ✅ No "unknown" values for page numbers, quotes, or editions
4. ✅ Evidence types and confidence levels documented
5. ✅ Cross-cultural patterns identified where present
6. ✅ Contradictions noted and explained
7. ✅ Integration with existing lore.yaml structure

## Timeline

- **Per Gate**: 15-20 minutes (generate prompts + research + validate)
- **Total**: ~16-21 hours for all 64 gates
- **Phases**: Organized by Human Design center (G → Throat → Solar Plexus → etc.)

## Tools Required

- Perplexity Pro (Comet research with citations)
- Template system (`TEMPLATE_PASS_A/B/C.txt`)
- Automation scripts (`generate-gate-prompts.sh`, `check-progress.sh`)
- Validation checklist (`CITATION_QUALITY_STANDARDS.md`)

## Constraints

- Must use Perplexity Comet (not GPT-4) for citation quality
- Must follow template structure for consistency
- Must validate all responses before marking complete
- Must prioritize G Center gates (identity) first
- Must maintain separation between ancient sources and modern channeling

## Dependencies

- `lore-research/GATE_ARCHETYPES.md` (keywords for all 64 gates)
- `lore-research/prompts/TEMPLATE_PASS_[A|B|C].txt` (prompt templates)
- `lore-research/CITATION_QUALITY_STANDARDS.md` (validation criteria)
- `star-system-sorter/data/lore/lore.yaml` (integration target)
