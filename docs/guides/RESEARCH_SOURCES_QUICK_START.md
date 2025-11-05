# Research Sources - Quick Start Guide

## What This Does

Shows users the academic sources behind their star system classification, building trust and credibility.

## User Experience

When users receive their classification result, they'll see:

1. **Primary star system** with percentage
2. **Ally systems** (top 3)
3. **"Research Sources"** expandable panel ⬅️ NEW!
   - Shows "86 academic sources • 862-1,656 hours of research"
   - Click to expand and see:
     - Core themes for their system
     - 5 key sources (expandable to all)
     - Source types (ancient, research, channeled)
     - ISBNs, publishers, years
     - Links to external sources
     - Research standards note

## Data Stats

- **8 star systems** covered
- **86 total sources** extracted
- **21 source categories** in library
- **400+ sources** in full library
- **862-1,656 hours** of research documented

## Example Sources

### Pleiades (15 sources)
- **Metamorphoses** by Ovid (8 CE / 1916 Loeb ed.)
- **Works and Days** by Hesiod (~700 BCE / 1914 Loeb ed.)
- **Matariki: The Star of the Year** by Rangi Matamua (2017)
- **Bringers of the Dawn** by Barbara Marciniak (1992)

### Sirius (9 sources)
- **The Pyramid Texts** (Mercer translation, 1952)
- **Esoteric Astrology** by Alice Bailey (1951)
- **The Sirius Mystery** by Robert Temple (1976/2019)

### Andromeda (7 sources)
- **Star Names: Their Lore and Meaning** by R.H. Allen (1899)
- **The Library** by Apollodorus (~150 BCE / 1921 Loeb ed.)
- **Defending Sacred Ground** by Alex Collier (1998)

## How to Update

```bash
# 1. Edit baseline files
vim lore-research/research-outputs/star-systems/v4.2/pleiades-baseline-4.2.json

# 2. Regenerate sources
python3 lore-research/scripts/16-consolidate-sources.py

# 3. Done! (no rebuild needed)
```

## File Locations

### Data
- **Input:** `lore-research/research-outputs/star-systems/v4.2/*.json`
- **Output:** `star-system-sorter/public/data/star_system_sources.json` (116KB)
- **Library:** `lore-research/source-mining/!ESOTERIC_SOURCE_LIBRARY.md`

### Code
- **Script:** `lore-research/scripts/16-consolidate-sources.py`
- **Component:** `star-system-sorter/src/components/ResearchSources.tsx`
- **Hook:** `star-system-sorter/src/hooks/useStarSystemSources.ts`
- **Integration:** `star-system-sorter/src/screens/ResultScreen.tsx`

## Source Types

| Type | Badge Color | Examples |
|------|-------------|----------|
| Ancient | Amber | I Ching, Pyramid Texts, Ovid |
| Research | Blue | University press, peer-reviewed |
| Channeled | Purple | Alice Bailey, Barbara Marciniak |
| Controversial | Red | Disputed claims with counter-evidence |

## Why This Matters

### Competitive Advantage
No other astrology/mythology app can claim:
- 862-1,656 hours of research
- Publisher-backed sources only
- Full citation metadata
- Academic-grade provenance
- 400+ source library

### User Trust
Users see:
- Real books with ISBNs
- Named authors and translators
- Publication years and publishers
- Links to verify sources
- Transparent research standards

### Academic Credibility
Positions Star System Sorter as:
- Digital humanities research project
- Comparative mythology with rigor
- Citable, reproducible dataset
- Not "made up" astrology content

## Technical Details

### Data Structure
```typescript
{
  version: "1.0",
  methodology: {
    framework: string,
    research_hours: string,
    source_standards: string,
    academic_foundations: string[]
  },
  star_systems: {
    [systemName]: {
      name: string,
      core_themes: string[],
      sources: {
        core_sources: Source[],
        all_sources: Source[],
        source_count: number
      }
    }
  }
}
```

### Source Object
```typescript
{
  title: string,
  author: string,
  year: number,
  publisher: string,
  source_type: "ancient" | "research" | "channeled" | "controversial",
  isbn?: string,
  url?: string,
  summary: string,
  astronomical_component: "A" | "B" | "G" | "H" | "unspecified",
  used_for: string
}
```

## Performance

- **File size:** 116KB (reasonable)
- **Load time:** Async, doesn't block render
- **Build impact:** None (public data file)
- **Bundle size:** +2KB for component

## Future Enhancements (Optional)

1. Filter sources by type
2. Search within sources
3. Dedicated `/sources/:system` route
4. Full bibliography modal
5. Link to methodology docs
6. Source comparison across systems

## Testing Checklist

✅ Build succeeds  
✅ TypeScript compiles  
✅ 86 sources extracted  
✅ Component renders  
✅ Expand/collapse works  
✅ Source types color-coded  
✅ Links open correctly  
✅ Mobile responsive  

## Support

For questions or issues:
1. Check `SOURCES_INTEGRATION_COMPLETE.md` for full details
2. Review baseline files in `lore-research/research-outputs/star-systems/v4.2/`
3. Inspect generated JSON in `star-system-sorter/public/data/`
