# Line Companion Production Extraction - Claude Instructions

## Goal
Extract Line Companion content and format it to match the **existing gate-line-API-call schema** used in production.

## Template
Use `lore-research/LINE_COMPANION_PRODUCTION_TEMPLATE.json` as your guide.

## Critical Rules

### 1. Schema Match
Your output MUST match the structure in `lore-research/research-outputs/gate-line-API-call/gate-line-1.json` exactly:
- Object with keys: `gate`, `gate_name`, `lines`
- `lines` is an object (NOT array) with keys like `"1.1"`, `"1.2"`, etc.
- Each line has: `line`, `hd_title`, `hd_quote`, `keywords`, `behavioral_axis`, `shadow_axis`, `source`

### 2. hd_quote Rules (CRITICAL)
- **≤25 words maximum**
- **Verbatim from Line Companion** - exact substring from the chunks
- Choose the KEY insight, not Ra's full commentary
- This is the "money quote" that captures the essence

**Good examples:**
- ✅ "Creation is independent of will. Time is everything."
- ✅ "Mars exalted as the symbol of a profound need for self-expression."
- ✅ "When one has to be creative, one needs to be alone."

**Bad examples:**
- ❌ Long paragraph of Ra's teaching (save for behavioral_axis)
- ❌ Paraphrased summary
- ❌ Multiple disconnected quotes stitched together

### 3. hd_title
- Exact line heading from Line Companion
- Examples: "Creation is independent of will", "Love is light", "Objectivity"

### 4. keywords
- Array of 3 behavioral keywords/phrases
- Focus on WHAT THIS PERSON DOES, not abstract concepts
- Use plain language, not HD jargon

**Good examples:**
- ✅ `["trial-and-error artistry", "raw experimentation", "learning through interference"]`
- ✅ `["projected icon", "creative representative", "public-facing individuality"]`

**Bad examples:**
- ❌ `["mutation", "creativity", "individuality"]` (too abstract)
- ❌ `["exalted Mars", "detriment Uranus"]` (technical, not behavioral)

### 5. behavioral_axis
- **One sentence** describing what this person DOES interpersonally/psychologically in healthy expression
- Focus on observable behavior, not internal states
- Use active verbs

**Good examples:**
- ✅ "Builds creative identity from a strong inner base before showing it."
- ✅ "Radiates unique creative energy without trying; inspires by just existing."
- ✅ "Turns personal self-expression into a recognizable frequency others can gather around."

**Bad examples:**
- ❌ "Has creative energy" (too vague)
- ❌ "Feels unique inside" (internal, not behavioral)
- ❌ Long paragraph with multiple ideas

### 6. shadow_axis
- **One sentence** describing what this person DOES when distorted/wounded
- Focus on observable behavior
- This is the detriment expression, not just "opposite of healthy"

**Good examples:**
- ✅ "Tries to force mutation with ego/will and gets unstable."
- ✅ "Withdraws or sulks if pushed to perform on demand."
- ✅ "Gets pulled into materialism and loses the mutative thread."

### 7. source
Always: `"Line Companion (Ra Uru Hu) via normalized chunks"`

## Extraction Workflow

1. **Search chunks** for Gate [N] content across all 27 files
2. **Extract hd_title** - the line heading
3. **Extract hd_quote** - find the KEY verbatim quote (≤25 words)
4. **Read Ra's full commentary** for that line (exaltation + detriment)
5. **Synthesize behavioral_axis** from exaltation commentary
6. **Synthesize shadow_axis** from detriment commentary
7. **Generate 3 keywords** that capture the behavioral essence
8. **Validate** - does it match the schema? Is hd_quote verbatim and ≤25 words?

## What NOT to Include

- ❌ No `raw` field with full text
- ❌ No `segments` array
- ❌ No `_meta` section
- ❌ No planet names in the output (use them to understand exaltation/detriment, but don't include)
- ❌ No page markers
- ❌ No long commentary blocks

## Quality Checks

Before submitting, verify:
- [ ] Matches gate-line-API-call schema exactly
- [ ] `hd_quote` is verbatim from chunks and ≤25 words
- [ ] `hd_title` is exact line heading
- [ ] `behavioral_axis` and `shadow_axis` are single sentences
- [ ] `keywords` are behavioral, not abstract
- [ ] All 6 lines present (or note if missing)
- [ ] Valid JSON (no trailing commas, proper escaping)
- [ ] `lines` is an object with string keys like `"1.1"`, not an array

## Example Reference

See `lore-research/research-outputs/gate-line-API-call/gate-line-1.json` for the exact format.

## Output Filename

`gate-line-[N].json` (e.g., `gate-line-5.json`, `gate-line-42.json`)

---

## Key Difference from Archive Template

The **archive template** (`LINE_COMPANION_EXTRACTION_TEMPLATE.json`) preserves ALL of Ra's commentary in nested segments. That's for research/archival purposes.

This **production template** distills it down to:
- One KEY quote (≤25 words)
- One sentence for healthy behavior
- One sentence for shadow behavior
- 3 behavioral keywords

Use the archive chunks to READ and UNDERSTAND, but OUTPUT in this lean production format.
