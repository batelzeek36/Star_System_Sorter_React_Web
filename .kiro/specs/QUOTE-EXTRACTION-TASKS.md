# Line Companion Quote Extraction Tasks

## Goal
Extract exact Ra Uru Hu quotes (<25 words) from Line Companion for all 384 gate.lines to populate s3-data/gates/*.json with proper citations.

## Files Created

### Python Scripts (in lore-research/scripts/)
1. **01-normalize-line-companion.py** - Cleans up line breaks and spacing
   - Input: `s3-data/Line Companion_djvu.txt`
   - Output: `lore-research/research-outputs/line-companion-normalized.txt`
   - Status: ✅ Working (1.5M chars normalized)

2. **02-split-gates.py** - Splits text into 64 gate blocks
   - Input: `line-companion-normalized.txt`
   - Output: `lore-research/research-outputs/line-companion-gates.json`
   - Status: ✅ Working (73 gates found - includes some duplicates/OCR issues)

3. **03-split-lines-per-gate.py** - Extracts 6 lines per gate
   - Input: `line-companion-gates.json`
   - Output: `lore-research/research-outputs/line-companion-gate-lines.json`
   - Status: ⚠️ Partial (818 lines extracted, some are fragments)

4. **04-extract-quotes.py** - Creates <25 word quotes
   - Input: `line-companion-gate-lines.json`
   - Output: `lore-research/research-outputs/line-companion-quotes.json`
   - Status: ⚠️ Partial (363/384 gate.lines, needs refinement)

### Documentation
5. **NEXT-STEPS-QUOTE-EXTRACTION.md** - Analysis of current issues and options
6. **lore-research/INTEGRATION-PLAN.md** - Overall data integration strategy
7. **DATA-INTEGRATION-STATUS.md** - Current state of all data files

## Current Issues

### Problem 1: OCR Artifacts
The djvu.txt has OCR errors that make regex matching difficult:
- Line breaks in middle of sentences
- Inconsistent formatting
- Some gate/line markers are malformed

### Problem 2: Regex Too Permissive
Current regex matches fragments like:
- "2.2 and says, 'They know where'" (not a real line title)
- "14.3 or a 14.6, it" (fragment from middle of text)

### Problem 3: Missing Gate.Lines
Only extracted 363 out of 384 expected gate.lines (missing 21)

## Tasks

### Task 1: Verify Line Companion Format
**Priority:** HIGH  
**Time:** 30 minutes

1. Open `s3-data/Line Companion.pdf` (or .epub)
2. Check Gates 1, 10, 20, 30, 40, 50, 60 (sample across the book)
3. Document the exact format used:
   - How are gate headings formatted?
   - How are line headings formatted?
   - Are there consistent patterns?
4. Create a reference document with examples

**Output:** `lore-research/line-companion-format-reference.md`

### Task 2: Improve Regex Patterns
**Priority:** HIGH  
**Time:** 1 hour  
**Depends on:** Task 1

Update the Python scripts with stricter regex:

```python
# For gate headings - must be at start of line
gate_pattern = re.compile(
    r"^((?:HEXAGRAM|Gate)\s+(\d{1,2})\s+[A-Z][^\n]{5,50})\n",
    re.MULTILINE
)

# For line headings - must be gate.line format with capitalized title
line_pattern = re.compile(
    r"^(\d+\.([1-6])\s+([A-Z][^\n]{3,50}))\n",
    re.MULTILINE
)
```

**Output:** Updated scripts that extract clean data

### Task 3: Manual Verification Sample
**Priority:** HIGH  
**Time:** 1 hour

Manually verify 10 gates (60 lines) against the PDF:

1. Pick gates: 1, 5, 10, 20, 30, 40, 48, 50, 60, 64
2. For each gate.line, extract:
   - Exact title
   - First sentence or <25 words as quote
   - Exaltation (if present)
   - Detriment (if present)
   - Page number
3. Compare with automated extraction
4. Calculate accuracy rate

**Output:** `lore-research/research-outputs/manual-verification-sample.json`

### Task 4: Try PDF/EPUB Parser
**Priority:** MEDIUM  
**Time:** 2 hours  
**Alternative to:** Tasks 2-3

If djvu.txt is too messy, parse the PDF or EPUB directly:

```python
# For PDF
import PyPDF2
# or
import pdfplumber

# For EPUB
import ebooklib
from ebooklib import epub
```

**Output:** New script `05-parse-pdf-directly.py`

### Task 5: Create Target Schema
**Priority:** HIGH  
**Time:** 30 minutes

Define the exact JSON structure for s3-data/gates/*.json:

```json
{
  "id": "gate.1",
  "hexagram": "hx01",
  "center": "G",
  "circuit": "Individual / Knowing",
  "lines": [
    {
      "id": "1.1",
      "line_number": 1,
      "classical": {
        "hd_title": "Creation is independent of will",
        "hd_quote": "Creation is independent of will. Right away you have this keynote that says: look, this is not about what your ego is doing.",
        "exaltation": "The Moon exalted as the symbol of adaptation. Time is everything.",
        "detriment": "Uranus in detriment. Instability leads to distortion.",
        "source": "Ra Uru Hu, Line Companion",
        "page": "1",
        "word_count": 24
      },
      "interpretation": {
        "keywords": ["deep creative pressure", "private self-expression"],
        "behavioral_axis": "Builds creative identity from a strong inner base before showing it.",
        "shadow_axis": "Panics about not being special and tries to force originality before it's ready."
      }
    }
  ]
}
```

**Output:** `s3-data/schemas/gate-schema.v2.json`

### Task 6: Update Gates Files
**Priority:** HIGH  
**Time:** 2-4 hours (depending on automation success)  
**Depends on:** Tasks 2-5

Create script to merge extracted quotes into existing s3-data/gates/*.json files:

```python
# 06-merge-quotes-into-gates.py
import json
from pathlib import Path

quotes = json.loads(Path("line-companion-quotes.json").read_text())
gates_dir = Path("s3-data/gates")

for gate_file in gates_dir.glob("*.json"):
    gate_num = int(gate_file.stem)
    gate_data = json.loads(gate_file.read_text())
    
    # Update each line with exact quote
    for line in gate_data["lines"]:
        line_num = line["line_number"]
        if str(gate_num) in quotes and str(line_num) in quotes[str(gate_num)]:
            quote_data = quotes[str(gate_num)][str(line_num)]
            line["classical"]["hd_quote"] = quote_data["quote"]
            line["classical"]["exaltation"] = quote_data["exaltation"]
            line["classical"]["detriment"] = quote_data["detriment"]
            line["classical"]["page"] = quote_data.get("page", "unknown")
    
    # Write back
    gate_file.write_text(json.dumps(gate_data, indent=2))
```

**Output:** Updated s3-data/gates/*.json files with exact quotes

### Task 7: Validate Completeness
**Priority:** HIGH  
**Time:** 30 minutes  
**Depends on:** Task 6

Create validation script:

```python
# 07-validate-gates.py
import json
from pathlib import Path

gates_dir = Path("s3-data/gates")
issues = []

for gate_file in gates_dir.glob("*.json"):
    gate_data = json.loads(gate_file.read_text())
    gate_num = gate_data["id"].split(".")[-1]
    
    # Check all 6 lines present
    if len(gate_data["lines"]) != 6:
        issues.append(f"Gate {gate_num}: has {len(gate_data['lines'])} lines, expected 6")
    
    # Check each line has quote
    for line in gate_data["lines"]:
        if not line["classical"].get("hd_quote"):
            issues.append(f"Gate {gate_num}.{line['line_number']}: missing hd_quote")
        
        # Check word count
        quote = line["classical"].get("hd_quote", "")
        word_count = len(quote.split())
        if word_count > 25:
            issues.append(f"Gate {gate_num}.{line['line_number']}: quote has {word_count} words (>25)")

if issues:
    print(f"Found {len(issues)} issues:")
    for issue in issues:
        print(f"  - {issue}")
else:
    print("✅ All 384 gate.lines validated successfully!")
```

**Output:** Validation report

### Task 8: Update Channels & Centers
**Priority:** MEDIUM  
**Time:** 2 hours  
**Depends on:** Task 6

Apply same process to:
- s3-data/channels/*.json (36 files)
- s3-data/centers/*.json (9 files)

Extract exact quotes for channel and center descriptions.

### Task 9: Complete Circuits
**Priority:** LOW  
**Time:** 1 hour

Add exact quotes to s3-data/circuits/*.json (5 files)

## Success Criteria

- [ ] All 384 gate.lines have exact Ra quotes (<25 words)
- [ ] All quotes have page number citations
- [ ] All quotes have source attribution
- [ ] Word count validation passes (all ≤25 words)
- [ ] No paraphrased content in classical.hd_quote fields
- [ ] Exaltation/detriment extracted where present

## Estimated Total Time

- **Minimum (if automation works):** 6-8 hours
- **Maximum (if manual extraction needed):** 15-20 hours

## Recommended Approach

1. Start with Task 1 (verify format) - 30 min
2. Do Task 3 (manual sample) - 1 hour
3. Based on results, choose:
   - **Path A:** Improve regex (Task 2) if format is consistent
   - **Path B:** Parse PDF directly (Task 4) if djvu.txt is too messy
4. Complete Tasks 5-7 (schema, merge, validate)
5. Tackle Tasks 8-9 when gates are done

## Notes

- **Copyright compliance:** Keep all quotes under 25 words
- **Fair use:** This is for academic research and educational purposes
- **Attribution:** Always cite "Ra Uru Hu, Line Companion" with page numbers
- **Accuracy:** Exact quotes are essential for research integrity
