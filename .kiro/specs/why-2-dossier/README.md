# Why 2.0 + Dossier Feature Spec

## Overview

This spec defines the implementation of data-driven provenance tracking and comprehensive reporting for the Star System Sorter. The feature adds full source citations, confidence levels, and exportable dossier functionality while maintaining backward compatibility with the existing MVP.

## Status

✅ Requirements Complete  
✅ Design Complete  
✅ Tasks Complete  
⏳ Implementation Pending

## Documents

- **requirements.md** - 17 user stories with EARS-compliant acceptance criteria
- **design.md** - Lean technical design (contracts, components, algorithms)
- **design-detailed.md** - Extended design with code samples and implementation details
- **tasks.md** - 18 phases, 80+ incremental implementation tasks
- **prompt.md** - Original feature request (moved from workspace root)

## Key Features

### 1. Lore Bundle Compiler
- Deterministic YAML → TypeScript compilation
- Stable rules_hash for reproducibility
- Multi-file support with duplicate detection
- Integrated into build pipeline (predev, prebuild)

### 2. Enhanced Classification
- Full provenance: ruleId, rationale, sources, confidence
- Deterministic percentage rounding (largest remainder method)
- Input hash for reproducibility
- Rules_hash mismatch detection

### 3. UI Components
- **SourceBadge**: Chip-based source citations with disputed flags
- **ContributionCard**: Detailed contributor cards with collapsible details
- **SystemSummary**: Top systems overview with hybrid indicator
- **EvidenceMatrix**: Filterable table of all contributors

### 4. Why 2.0 Screen
- Refactored with SystemSummary, tabs, and filters
- Hide disputed sources (default: ON)
- Minimum confidence filter (default: 2)
- Empty states and virtualization (>75 items)
- Performance target: <50ms render

### 5. Dossier Screen
- Identity Snapshot (type, authority, profile, centers, signature channel)
- One-Line Verdict (primary/hybrid + descriptions)
- "Why Not" panel (closest non-selected systems + missing factors)
- Deployment Matrix (Primary/Secondary/Tertiary ranking)
- Gate→Faction Grid (EvidenceMatrix component)
- Sources Gallery (deduplicated badges)
- Export: PNG (1080×1920), Print/PDF, Generate Narrative

### 6. No Breaking Changes
- Existing MVP functionality unchanged
- Only adds Dossier button to Result screen
- All existing tests pass
- No new CSS tokens or colors

## Implementation Phases

1. **Phase 0**: Repository & CI setup (Node ≥18, scripts, hooks)
2. **Phase 1**: Foundation & data layer (compiler, lore bundle)
3. **Phase 2**: Enhanced classification (scorer, rounding, hashing)
4. **Phase 3**: UI state management (uiStore)
5. **Phase 4**: Lore UI components (4 new components)
6. **Phase 5**: Why 2.0 refactor (tabs, filters, empty states)
7. **Phase 6**: Dossier screen (6 sections + algorithms)
8. **Phase 7**: Export functionality (PNG, PDF, print CSS)
9. **Phase 8**: Result screen integration (Dossier button)
10. **Phase 9**: File organization (move lore.yaml, prompt2.md)
11. **Phase 10**: E2E testing (why.spec.ts, dossier.spec.ts)
12. **Phase 11**: Accessibility & polish (keyboard nav, reduced motion)
13. **Phase 12**: Final verification (TS, CSS, file sizes, performance)
14. **Phase 13**: Documentation & manual QA (README, QA script)

## Dependencies

**New:**
- `html-to-image`: ^1.11.11 (PNG export)
- `@tanstack/react-virtual`: ^3.0.0 (optional, for virtualization)

**Existing:**
- `yaml`: ^2.8.1 (already installed)
- `tsx`: For TypeScript compiler script
- `crypto`: Node.js built-in (SHA-256 hashing)

## File Changes

**New Files (15):**
- `data/lore/lore.yaml` (moved)
- `scripts/compile-lore.ts`
- `src/lib/lore.bundle.ts` (generated)
- `src/store/uiStore.ts`
- `src/components/lore/SourceBadge.tsx`
- `src/components/lore/ContributionCard.tsx`
- `src/components/lore/SystemSummary.tsx`
- `src/components/lore/EvidenceMatrix.tsx`
- `src/screens/DossierScreen.tsx`
- `tests/e2e/why.spec.ts`
- `tests/e2e/dossier.spec.ts`
- `.nvmrc`
- `.kiro/specs/why-2-dossier/prompt.md` (moved)

**Modified Files (6):**
- `src/lib/scorer.ts` (enhanced output)
- `src/lib/schemas.ts` (new types)
- `src/screens/WhyScreen.tsx` (refactor)
- `src/screens/ResultScreen.tsx` (add button)
- `src/App.tsx` (add route)
- `package.json` (scripts, deps)

## Acceptance Criteria

✅ /why renders contributors with provenance in <50ms  
✅ /dossier exports non-empty PNG with no network calls  
✅ Disputed sources hidden when toggle is ON  
✅ Existing happy-path E2E passes  
✅ TypeScript compiles with zero errors  
✅ No new CSS color tokens  
✅ Files ≤300 LOC where possible  
✅ Accessibility compliant (keyboard nav, ARIA, reduced motion)

## Next Steps

1. Review and approve this spec
2. Execute tasks in order (Phase 0 → Phase 13)
3. Mark tasks complete as you go
4. Run tests after each phase
5. Final verification before merge

## Notes

- Optional tasks marked with `*` can be skipped for faster MVP
- Detailed implementation algorithms in `design-detailed.md`
- All requirements traceable to tasks via `_Requirements:` tags
- CI must run `compile:lore` before builds and tests

---

**Spec Version:** 1.0  
**Created:** 2025-01-18  
**Status:** Ready for Implementation
