# Line Companion Extraction Instructions for Claude Projects

## Task
Search the Line Companion chunked text files to extract complete gate.line content and format it as JSON following the template structure.

## Source Files
You have been given 27 chunked Line Companion files:
- `lore-research/research-outputs/line-companion/normalized.clean-part01.txt` through `part27.txt`

## Template
Use the structure defined in `lore-research/LINE_COMPANION_EXTRACTION_TEMPLATE.json`

## Extraction Rules

### 1. Finding Gate Content
- Search across all 27 chunk files for the gate you're extracting
- Gate content typically starts with "HEXAGRAM [N] [NAME]" or "GATE [N]"
- Each gate has 6 lines (line 1 through line 6)
- Content may span multiple chunk files - search thoroughly

### 2. Structure Requirements

#### _meta Section
```json
{
  "created_at": "2025-11-05T[current-time]",
  "extracted_from": "Line Companion chunked text files",
  "source": "normalized.clean-part[XX].txt (or multiple if spans chunks)",
  "extraction_method": "manual_search",
  "notes": "Any relevant notes about extraction quality or issues"
}
```

#### Each Line Must Have
1. **heading**: The line title/heading exactly as it appears in source
2. **raw**: Complete unprocessed text for that line (preserve all paragraph breaks as `\n\n`)
3. **segments**: Array of structured content blocks

#### Segment Types
- **intro**: Commentary before exaltation/detriment discussion
- **exaltation**: The exalted planetary expression (includes planet name + all commentary)
- **detriment**: The detriment planetary expression (includes planet name + all commentary)

### 3. Text Preservation Rules

**CRITICAL**: Preserve Ra's exact wording. Do NOT:
- Paraphrase or summarize
- "Clean up" his casual speaking style
- Remove examples, stories, or tangents
- Modernize language or fix grammar

**DO**:
- Include ALL text exactly as written
- Preserve paragraph breaks (use `\n\n` in JSON strings)
- Keep page markers like "Page 3" if they appear
- Include all exaltation/detriment planet statements verbatim
- Capture Ra's full teaching commentary, not just the formal definitions

### 4. Handling Split Content
If a line's text is split across chunk files:
- Search both chunks
- Combine the text seamlessly
- Note in `_meta.source` which chunks were used
- Ensure no text is lost at chunk boundaries

### 5. Handling Missing or Unclear Content
If you cannot find a line or the text is garbled:
- Note in `_meta.notes`: "Line [X] not found in chunks" or "Line [X] text unclear/incomplete"
- Leave that line's content as empty strings or mark with "[NOT FOUND]"
- Do NOT invent or fill in content

### 6. Planet Names
Valid planet names for exaltation/detriment:
- Sun, Moon, Earth
- Mercury, Venus, Mars, Jupiter, Saturn
- Uranus, Neptune, Pluto
- North Node, South Node

### 7. Quality Checks Before Submitting
- [ ] All 6 lines present (or noted as missing)
- [ ] Each line has heading, raw, and segments
- [ ] Exaltation and detriment planets identified correctly
- [ ] No text truncated mid-sentence
- [ ] Page markers preserved if present
- [ ] `raw_text` field contains complete gate overview
- [ ] Valid JSON syntax (no trailing commas, proper escaping)

## Example Output Structure
See `lore-research/research-outputs/line-companion/gates/gate-01.json` for a complete working example.

## Common Issues to Avoid
1. **Truncating Ra's commentary**: Include ALL his teaching, not just the formal line definition
2. **Losing paragraph breaks**: Preserve `\n\n` between paragraphs in the raw text
3. **Missing the gate overview**: The `raw_text` field should have the intro before line 1
4. **Splitting exaltation/detriment incorrectly**: Keep all commentary with the relevant planet
5. **Invalid JSON**: Escape quotes, newlines, and special characters properly

## Workflow
1. Search chunks for "HEXAGRAM [N]" or "GATE [N]"
2. Extract complete text for all 6 lines
3. Structure according to template
4. Validate JSON syntax
5. Double-check nothing was truncated
6. Submit completed JSON file

## File Naming
Output file should be named: `gate-[NN].json` (e.g., `gate-05.json`, `gate-42.json`)
