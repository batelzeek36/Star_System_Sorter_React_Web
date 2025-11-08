# LINE_COMPANION_PRODUCTION_TEMPLATE.json Upgrade Notes

**Date:** 2025-11-05  
**Reason:** Incorporate mechanical precision feedback from GPT-5 review of Gates 1 and 4

## What Changed

### 1. Added MECHANICAL_PRECISION_RULES Section
**Purpose:** Ensure every gate extraction considers CENTER and CIRCUIT context

**Key additions:**
- Center-specific language (G=identity not work, Ajna=mental not instinct, Spleen=instinct not mental)
- Circuit-specific themes (Individual=melancholy/mutation, Logic=formulas, Tribal=bargains, Collective=sharing)
- Explicit reminders to check gate mechanics before writing axes

**Impact:** Prevents confusion like:
- ❌ Gate 4 (Ajna/Logic) using "instinctive timing" → ✅ "mental recognition of readiness"
- ❌ Gate 1 (G Center/Individual) framed as work gate → ✅ "creative timing, identity, mutation"

---

### 2. Added LINE_ARCHETYPE_PRECISION Section
**Purpose:** Prevent line archetype confusion (especially 2nd vs 5th line projection)

**Key distinctions:**
- **Line 2:** HERMIT/NATURAL - others project ONTO them, they get called out, natural talent
- **Line 5:** PROJECTION FIELD - others project expectations (savior/heretic), must deliver practical solutions
- **Line 3:** TRIAL-AND-ERROR - explicitly use this language, experimentation, learning through mistakes
- **Line 4:** EXTERNALIZATION - say yes first then figure it out, role-playing to learn (not "lying")
- **Line 6:** THREE LIFE PHASES - trial (0-30), roof (30-50), role model (50+), objectivity matures over time

**Impact:** Prevents errors like:
- ❌ Gate 4 Line 2: "Projects answers outward" → ✅ "Naturally embodies answers, called out by others"
- ❌ Generic 5th line treatment → ✅ "Holds steady under projection field, seduces energy, reputation at stake"

---

### 3. Added LANGUAGE_REFINEMENTS Section
**Purpose:** Use precise HD language that matches Ra's mechanics

**Key refinements:**
- "Auric boundaries" or "non-interference" instead of "isolation" (unless truly hermit mode)
- "Projection field" for 5th lines (they receive projections, don't just project)
- "Consequences" instead of "punishment" (less moralistic)
- "Role-playing to learn" instead of "lying" for 4th line (unless Ra explicitly says "liar")
- "Melancholy as fuel" for Individual circuit gates (not pathology)
- "Creative timing" instead of "waiting" for Individual gates (waiting is Type strategy, not gate theme)

**Impact:** Softens harsh language, increases mechanical accuracy, avoids Type/Strategy confusion

---

### 4. Added GATE_MECHANICS_QUICK_REFERENCE
**Purpose:** Lookup table for gate assignments to centers and circuits

**Contents:**
- Lists of gates by circuit (Individual, Logic, Tribal, Collective)
- Lists of gates by center (Head, Ajna, Throat, G, Ego, Sacral, Spleen, Solar Plexus, Root)
- Quick notes on each circuit/center's themes

**Usage:** Before extracting any gate, check this reference to understand its mechanical context

---

### 5. Enhanced Line-Specific Template Instructions
**Purpose:** Inline guidance for each line archetype directly in the template

**Changes:**
- Line 1.2 now includes: "2nd line = HERMIT/NATURAL. They have natural talent, get CALLED OUT by others..."
- Line 1.3 now includes: "3rd line = MARTYR/EXPERIMENTER. Explicitly use 'trial-and-error'..."
- Line 1.4 now includes: "4th line = OPPORTUNIST/EXTERNALIZER. They learn by SAYING YES FIRST..."
- Line 1.5 now includes: "5th line = HERETIC/PROJECTION FIELD. CRITICAL: Others project expectations ONTO them..."
- Line 1.6 now includes: "6th line = ROLE MODEL. Three life phases: trial (0-30), roof (30-50)..."

**Impact:** Impossible to miss line archetype mechanics while filling out template

---

### 6. Added FINAL_CHECKLIST Section
**Purpose:** Pre-submission validation to catch common errors

**Checklist items:**
- ✓ Checked gate's CENTER and CIRCUIT
- ✓ Applied circuit-specific themes
- ✓ Applied line archetype correctly
- ✓ Used concrete action verbs
- ✓ Quotes are VERBATIM
- ✓ 5th lines mention "projection field"
- ✓ Individual gates include melancholy/mutation
- ✓ Ajna gates use "mental" not "instinctive"
- ✓ G Center gates avoid work/productivity framing

---

## Expected Accuracy Improvement

**Before upgrade:** 75-85% mechanical accuracy (good axes, but missing circuit/center context)  
**After upgrade:** 90-95% mechanical accuracy (axes + mechanical precision)

**Remaining 5-10% gap:** Nuanced interpretation of Ra's specific language choices, which requires human judgment and deep Line Companion familiarity

---

## How to Use the Upgraded Template

1. **Start with gate number** - look it up in GATE_MECHANICS_QUICK_REFERENCE
2. **Note the center and circuit** - this frames the entire gate's energy
3. **Read the circuit/center notes** - understand the mechanical context
4. **Extract each line** - use the inline guidance for line archetypes
5. **Apply language refinements** - use the precise HD terminology
6. **Run the final checklist** - validate before submitting

---

## Common Pitfalls Now Prevented

### ❌ Before: Gate 4 Line 2
```json
"behavioral_axis": "Projects answers outward and accepts that not everyone can understand"
```
**Problem:** 2nd lines don't project outward - that's 5th line

### ✅ After: Gate 4 Line 2
```json
"behavioral_axis": "Naturally embodies answers without needing to teach, accepting that not everyone has the same capacity for understanding"
```

---

### ❌ Before: Gate 1 (Individual/G Center)
```json
"keywords": ["creativity", "timing", "answers"]
```
**Problem:** Missing Individual circuit themes

### ✅ After: Gate 1 (Individual/G Center)
```json
"keywords": ["creativity", "timing", "mutation", "melancholy", "pulse"]
```

---

### ❌ Before: Gate 4 Line 1 (Ajna/Logic)
```json
"behavioral_axis": "Waits for the right moment to offer answers, recognizing intuitively when people are ready"
```
**Problem:** Ajna is mental, not intuitive (Spleen is intuitive)

### ✅ After: Gate 4 Line 1 (Ajna/Logic)
```json
"behavioral_axis": "Recognizes when others are ready to receive answers, offering understanding at the right moment without forcing the timing"
```

---

### ❌ Before: Any 5th Line
```json
"behavioral_axis": "Projects solutions to others and waits for recognition"
```
**Problem:** Missing "projection field" language - others project ONTO them

### ✅ After: Any 5th Line
```json
"behavioral_axis": "Holds steady under the 5th-line projection field, letting recognition come without performing to meet projections"
```

---

## Testing the Upgrade

**Recommended approach:**
1. Re-extract Gates 1-7 using the upgraded template
2. Compare with existing `gate-line-claude-1.json` through `gate-line-claude-7.json`
3. Document improvements in `claude/claude-project-gates/second-pass/`
4. If accuracy improves significantly, consider batch re-extraction of all 64 gates

**Success metrics:**
- 95%+ mechanical accuracy (center/circuit context correct)
- 100% line archetype accuracy (no more 2nd/5th line confusion)
- Consistent use of HD terminology (projection field, melancholy, trial-and-error, etc.)
- No Type/Strategy confusion (creative timing vs waiting for invitation)

---

## Future Enhancements (Phase 2)

**Potential additions:**
- Channel context (e.g., Gate 1 in Channel 1-8 with Gate 8)
- Exaltation/Detriment planetary influences
- Cross-references to I Ching hexagram themes
- Star system alignment hints (which circuits/centers align with which star systems)

**Not included yet because:**
- MVP focuses on gate.line extraction accuracy
- Star system mapping happens in separate layer (`lore-research/research-outputs/star-mapping-by-gate/`)
- Channel context is useful for narrative generation, not classification scoring
