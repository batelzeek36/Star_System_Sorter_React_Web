# Star System Sorter - Logic Development Plan

## Current State Analysis

### What We Have
1. **Lore System Architecture** ✅
   - YAML-based rule definition (`data/lore/lore.yaml`)
   - TypeScript compiler with validation (`scripts/compile-lore.ts`)
   - Zod schemas for type safety
   - Version tracking with `lore_version` and `rules_hash`
   - Source citation system with confidence levels (1-5)

2. **Existing Rules** ✅
   - ~50 rules covering types, authorities, profiles, centers, gates, and channels
   - 8 star systems: Arcturus, Sirius, Pleiades, Andromeda, Lyra, Orion, Draco, Zeta Reticuli
   - Sources from Law of One, Prism of Lyra, Bringers of the Dawn, etc.

3. **Reference Data** ✅
   - Complete 64 gates documentation in `.gpt-4o-rules/gates.md`
   - Personal HD chart in `.gpt-4o-rules/my-hd.md` for testing
   - Seed weights in `.gpt-4o-rules/seed-weights.json` (appears to be initial/legacy data)

4. **Implementation** ✅
   - Scorer algorithm in `src/lib/scorer.ts`
   - UI components for displaying lore (WhyScreen, DossierScreen)
   - Evidence matrix with source citations
   - Deterministic classification with hybrid detection

### What We Need

The current lore rules are **incomplete and need significant expansion**. Here's what's missing:

## Gap Analysis

### 1. Gate Coverage (CRITICAL)
**Current:** ~15 gates have explicit rules
**Needed:** All 64 gates need mappings

**Missing Gates:**
- Gates 4, 5, 6, 8, 9, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 30, 31, 35, 36, 37, 40, 41, 42, 45, 46, 47, 50, 52, 53, 56, 57, 58, 59, 60, 64

**Priority:** HIGH - Gates are the most granular HD data point

### 2. Channel Coverage (IMPORTANT)
**Current:** ~10 channel synergy rules
**Needed:** All 36 defined channels need mappings

**Missing Channels:**
- Most channels beyond the ~10 already defined
- Need to map channel synergies (when two gates form a channel, the meaning changes)

**Priority:** MEDIUM-HIGH - Channels show integration patterns

### 3. Profile Line Nuance (MEDIUM)
**Current:** Basic profile mappings (1/3, 3/5, etc.)
**Needed:** More nuanced line-by-line analysis

**Missing:**
- Individual line meanings (Line 1 = Foundation, Line 2 = Hermit, etc.)
- How lines interact in profiles (conscious/unconscious)

**Priority:** MEDIUM - Profiles are important but less granular than gates

### 4. Center Combinations (LOW-MEDIUM)
**Current:** Individual center rules
**Needed:** Undefined center patterns, center combinations

**Missing:**
- What it means to have undefined centers
- Specific center combinations (e.g., defined Head + Ajna = mental authority)

**Priority:** MEDIUM - Centers show energy patterns

### 5. Cross-Attribute Synergies (ADVANCED)
**Current:** Mostly single-attribute rules
**Needed:** Multi-condition rules

**Examples:**
- "If Emotional Authority + Gate 49 + Pleiades gates → extra Pleiades weight"
- "If Manifestor + Orion gates + defined Throat → Orion leadership archetype"

**Priority:** LOW - Nice to have, but complex

## Research Strategy

### Phase 1: Gate Mapping Research (WEEKS 1-2)
**Goal:** Map all 64 gates to star systems with rationale and sources

**Approach:**
1. **Use Existing Documentation**
   - `.gpt-4o-rules/gates.md` has gate meanings and star system candidates
   - Cross-reference with Human Design literature (Ra Uru Hu, Gene Keys)
   - Use esoteric sources (Law of One, Pleiadian material, etc.)

2. **Methodology for Each Gate**
   - Read traditional HD meaning
   - Read esoteric/metaphysical lore
   - Identify behavioral traits/archetypes
   - Match to star system characteristics
   - Assign confidence level (1-5)
   - Document sources

3. **Quality Control**
   - Test against known charts (`.gpt-4o-rules/my-hd.md`)
   - Ensure deterministic results
   - Validate that percentages make sense

**Deliverable:** 64 gate rules in `lore.yaml`

### Phase 2: Channel Synergy Research (WEEKS 3-4)
**Goal:** Map all 36 defined channels with synergy bonuses

**Approach:**
1. **Channel List**
   - Get complete list of 36 defined channels from HD system
   - Understand channel meanings (integration of two gates)

2. **Synergy Logic**
   - When both gates of a channel are present, apply bonus weight
   - Channel meaning often transcends individual gate meanings
   - Example: 13-33 (Prodigal) = Orion historians/archivists

3. **Research Sources**
   - Ra Uru Hu channel definitions
   - Gene Keys channel interpretations
   - Esoteric channel lore

**Deliverable:** 36 channel synergy rules in `lore.yaml`

### Phase 3: Profile & Center Refinement (WEEK 5)
**Goal:** Add nuanced profile and center rules

**Approach:**
1. **Profile Lines**
   - Research individual line meanings (1-6)
   - Map conscious/unconscious line interactions
   - Add rules for specific profile combinations

2. **Center Patterns**
   - Research undefined center meanings
   - Add rules for center combinations
   - Consider motor centers vs. awareness centers

**Deliverable:** Enhanced profile and center rules

### Phase 4: Validation & Testing (WEEK 6)
**Goal:** Ensure all rules are accurate and deterministic

**Approach:**
1. **Test Against Known Charts**
   - Use `.gpt-4o-rules/my-hd.md` as test case
   - Collect additional test charts (with permission)
   - Verify classifications make sense

2. **Edge Case Testing**
   - Test charts with minimal gates
   - Test charts with many gates
   - Test hybrid classifications
   - Test unresolved classifications

3. **Confidence Calibration**
   - Ensure confidence levels (1-5) are consistent
   - Higher confidence for well-sourced rules
   - Lower confidence for speculative rules

**Deliverable:** Validated lore bundle v3.0.0

## Implementation Plan

### Step 1: Set Up Research Workspace
- [ ] Create `research/` directory for notes
- [ ] Set up gate-by-gate research template
- [ ] Organize source materials

### Step 2: Gate Research (Batch Processing)
- [ ] Gates 1-10: Research and document
- [ ] Gates 11-20: Research and document
- [ ] Gates 21-30: Research and document
- [ ] Gates 31-40: Research and document
- [ ] Gates 41-50: Research and document
- [ ] Gates 51-64: Research and document

### Step 3: Add Rules to lore.yaml
- [ ] Write gate rules in YAML format
- [ ] Run compiler to validate
- [ ] Test with `npm run classify`
- [ ] Commit and increment lore version

### Step 4: Channel Research
- [ ] List all 36 defined channels
- [ ] Research channel meanings
- [ ] Add channel synergy rules
- [ ] Test and validate

### Step 5: Profile & Center Enhancement
- [ ] Add profile line rules
- [ ] Add center combination rules
- [ ] Test and validate

### Step 6: Final Validation
- [ ] Run full test suite
- [ ] Test against multiple charts
- [ ] Document any edge cases
- [ ] Publish lore v3.0.0

## Research Sources

### Primary Sources (High Confidence)
1. **Ra Uru Hu** - Human Design founder
   - The Definitive Book of Human Design
   - Rave I'Ching
   - HD lectures and materials

2. **Gene Keys** - Richard Rudd
   - Gene Keys book
   - 64 Gene Keys profiles

### Secondary Sources (Medium Confidence)
3. **Law of One** - Ra Material (L/L Research)
   - Books I-V
   - Focus on density/polarity teachings

4. **Pleiadian Material**
   - Barbara Marciniak: Bringers of the Dawn
   - Barbara Hand Clow: The Pleiadian Agenda

5. **Lyran/Arcturian Material**
   - Lyssa Royal: Prism of Lyra
   - Arcturian teachings (various channels)

### Tertiary Sources (Lower Confidence)
6. **Sirius Material**
   - Robert Temple: The Sirius Mystery
   - Various Sirian channeled material

7. **Orion Material**
   - Law of One Orion references
   - Various Orion lore

8. **Esoteric Synthesis**
   - Thoth/Emerald Tablets (Billy Carson)
   - Ancient mystery school teachings
   - Cross-cultural star lore

## Quality Standards

### Rule Requirements
1. **ID Format:** `[system]_[attribute]_[descriptor]` (lowercase, underscores)
2. **Rationale:** Clear, concise explanation (1-2 sentences)
3. **Sources:** At least 1 source, preferably 2-3
4. **Confidence:** 
   - 5 = Multiple primary sources agree
   - 4 = Primary source + secondary confirmation
   - 3 = Single primary source OR multiple secondary sources
   - 2 = Single secondary source OR logical inference
   - 1 = Speculative/disputed

### Testing Requirements
1. **Deterministic:** Same input always produces same output
2. **Balanced:** No single system dominates unfairly
3. **Meaningful:** Classifications align with HD archetypes
4. **Traceable:** Every weight can be traced to a source

## Timeline

- **Week 1-2:** Gate research (Gates 1-64)
- **Week 3-4:** Channel research (36 channels)
- **Week 5:** Profile & center refinement
- **Week 6:** Validation & testing
- **Week 7:** Documentation & release

**Total:** ~7 weeks for comprehensive logic development

## Next Steps

1. **Immediate:** Review this plan and adjust priorities
2. **This Session:** Start with Gates 1-10 research
3. **Ongoing:** Batch process gates in groups of 10
4. **Milestone:** Complete all 64 gates before moving to channels

## Notes

- The existing `seed-weights.json` appears to be legacy data - we should validate it against our new research
- The current lore.yaml has good structure but needs 10x more rules
- We should maintain backward compatibility (don't break existing rules)
- Consider creating a "disputed lore" flag for controversial mappings
- The confidence system (1-5) is crucial for transparency

---

**Status:** Ready to begin Phase 1 (Gate Research)
**Branch:** `implementing-logic`
**Next Action:** Start researching Gates 1-10 and adding rules to lore.yaml
