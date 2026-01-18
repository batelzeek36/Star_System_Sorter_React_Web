# Bulletproof Enforcement - Quick Reference Card

## ✅ What Changed

Every baseline prompt now **REJECTS** responses with:
- ❌ Placeholder quotes like "[EXAMPLE QUOTE]"
- ❌ "Unknown" or missing page numbers
- ❌ Missing `"verified": true` field
- ❌ Abbreviated titles or author initials
- ❌ Missing translator/editor for ancient texts
- ❌ Blog sources or social media posts
- ❌ More than 20% missing URLs (30% for Sirius)

## 🎯 Key Requirements

### Every Source Must Have:
1. **Full title** (not abbreviated)
2. **Full author name** (not initials)
3. **Specific edition** (not "unknown")
4. **Exact page/location** (not "various pages")
5. **Verbatim quote** ≤25 words (not placeholder)
6. **URL** (if available online)
7. **Source type** (ancient|research|channeled|etc.)
8. **Translator/editor** (for ancient texts)
9. **`"verified": true`** (NEW - mandatory field)

### SIRIUS Only - Additional:
10. **`"astronomical_component"`** (A|B|C|unspecified)
11. **`"component_reasoning"`** (why this component)

## 📊 Quality Thresholds

| Metric | Target | Rejection Trigger |
|--------|--------|-------------------|
| Sources per characteristic | 5+ (min 3) | <3 sources |
| URLs included | >80% | >20% missing |
| Ancient translator/editor | 100% | Any missing |
| Placeholder quotes | 0% | Any found |
| "Unknown" fields | 0% | Any found |
| Verified field | 100% | Any missing |

**SIRIUS Special:** <30% unspecified astronomical components

## 🔍 Verification Process

Before including any source, verify:
1. ✅ Book findable on Amazon/publisher/library?
2. ✅ Page number exists in actual source?
3. ✅ Quote verbatim from source (≤25 words)?
4. ✅ Author's full name provided?
5. ✅ Edition specified?

**If ANY answer is NO → Find a better source**

## 🚫 Unacceptable Sources

Never include:
- Blog posts or personal websites
- Social media posts (Twitter, Reddit, Facebook)
- YouTube videos (unless published transcript with ISBN)
- Wiki-style sites without citations
- Anonymous authors or "Various researchers"
- Starseed community websites without published books

## ✅ Acceptable Sources

Always prefer:
- Published books with ISBN
- Academic journals with DOI/JSTOR
- Ancient texts with named translator
- University/museum websites with citations
- Established channeled works (published books)

## 🎯 System-Specific Notes

### SIRIUS
- Pre-1862 sources = Component A
- Dogon po tolo = Component B
- Channeled without stellar detail = unspecified
- <30% unspecified threshold

### PLEIADES
- Cross-cultural Seven Sisters validation required
- Ancient myths vs modern overlay separated

### LYRA
- Feline vs avian inconsistencies documented
- Root race theory connections noted

### ANDROMEDA
- Greek mythology = symbolic evidence only
- Contactee sources labeled appropriately

### ORION LIGHT
- Light vs Dark distinction clear
- Egyptian Orion-Osiris link (HIGH ancient support)
- Bauval theory marked as disputed

### ORION DARK
- Shadow work nuance (not just "evil")
- Orion Dark vs Draco distinction clear

### ARCTURUS
- Edgar Cayce readings with reading numbers
- Ancient support explicitly LOW/UNKNOWN

### DRACO
- Ancient dragon myths (HIGH ancient support)
- Icke material marked controversial
- Kundalini NOT conflated with Draco

### ZETA RETICULI
- Hill star map marked as disputed
- Ancient support explicitly NONE

## 📝 Example Perfect Source

```json
{
  "title": "The Ancient Egyptian Pyramid Texts",
  "author": "Raymond O. Faulkner",
  "translator_or_editor": "Raymond O. Faulkner (translator)",
  "edition": "Oxford University Press",
  "year": 1969,
  "page": "Utterance 151, §91",
  "quote": "Sothis is encircled by the Duat",
  "url": "https://archive.org/details/...",
  "source_type": "ancient",
  "astronomical_component": "A",
  "component_reasoning": "Ancient Egyptian visible star reference (pre-1862)",
  "verified": true
}
```

## 🚨 Common Mistakes to Avoid

1. **Using initials:** ❌ "R. Faulkner" → ✅ "Raymond O. Faulkner"
2. **Vague pages:** ❌ "throughout" → ✅ "Utterance 151, §91"
3. **Placeholder quotes:** ❌ "[EXAMPLE]" → ✅ "actual quote"
4. **Missing edition:** ❌ "unknown" → ✅ "Oxford University Press"
5. **No translator:** ❌ Missing → ✅ "Raymond O. Faulkner (translator)"
6. **No verified field:** ❌ Missing → ✅ `"verified": true`
7. **Abbreviated title:** ❌ "Pyramid Texts" → ✅ "The Ancient Egyptian Pyramid Texts"

## 📦 Backup Location

Original files backed up to:
`lore-research/prompts/PHASE_0_STAR_SYSTEMS/backups/pre-bulletproof-20251024/`

## 🎯 Success Metrics

Your research passes if:
- ✅ Zero placeholder quotes
- ✅ Zero "unknown" fields
- ✅ 100% ancient sources have translator
- ✅ 100% sources have `"verified": true`
- ✅ >80% sources have URLs
- ✅ All page numbers specific
- ✅ All titles/authors complete

**Status: BULLETPROOF ✅**
