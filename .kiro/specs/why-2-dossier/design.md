# Design Document - Why 2.0 + Dossier

## Overview

Data-driven enhancement adding provenance tracking, source citations, and comprehensive reporting to the Star System Sorter. Zero network calls from Why/Dossier screens—all data from store + compiled lore bundle.

**Constraints:**
- Compose from existing Figma components only
- No new CSS tokens or colors
- Files ≤300 LOC where possible
- Deterministic compilation and classification

## Architecture

```
lore.yaml → [compile:lore] → lore.bundle.ts → scorer.ts → birthDataStore → UI
```

**Module Dependencies:**
```
Screens → Lore Components → Figma Components → Stores → Lib
```

## Key Contracts

### 1. Lore Bundle Compiler (`scripts/compile-lore.ts`)

**Input:** `data/lore/lore.yaml`  
**Output:** `src/lib/lore.bundle.ts`

**Process:**
1. Read & validate YAML with Zod
2. Sort systems/sources/rules by ID (alphabetical)
3. Compute `rules_hash` (SHA-256 of sorted rules JSON)
4. Generate typed TS module
5. Exit non-zero on validation failure

**Build Integration:**
```json
{
  "compile:lore": "tsx scripts/compile-lore.ts",
  "predev": "npm run compile:lore",
  "prebuild": "npm run compile:lore"
}
```

**Requirements:**
- Node ≥18 (for built-in `crypto.createHash`)
- Supports `data/lore/*.yaml` (merge by ID, last-writer-wins)
- Rule ID format: `^([a-z0-9]+[_-]?)+$`

**Output Interface:**
```typescript
export interface LoreBundle {
  lore_version: string;
  tieThresholdPct: number;
  rules_hash: string;
  systems: Array<{ id: string; label: string; description: string }>;
  sources: Array<{ id: string; title: string; author: string; year: number; disputed: boolean; url?: string }>;
  rules: Array<{
    id: string;
    systems: Array<{ id: string; w: number }>;
    if: { typeAny?: string[]; authorityAny?: string[]; profileAny?: string[]; centersAny?: string[]; channelsAny?: string[]; gatesAny?: number[] };
    rationale: string;
    sources: string[];
    confidence: 1 | 2 | 3 | 4 | 5;
    synergy?: boolean;
  }>;
}
```

**Note:** `channelsAny` is `string[]` only (e.g., `["13-33"]`), not `number[]`.

**Error Handling:**
- If compile fails, Why/Dossier show banner: "Lore bundle unavailable — see console."

### 2. Enhanced Scorer (`src/lib/scorer.ts`)

**Changes:**
- Import `loreBundle` from `./lore.bundle`
- Match HD attributes to lore rules
- Add `ruleId`, `rationale`, `sources`, `confidence` to contributors
- Add `rules_hash` and `input_hash` to meta

**Enhanced Contributor:**
```typescript
export interface EnhancedContributor {
  ruleId: string;
  key: string;
  weight: number;
  label: string;
  rationale: string;
  sources: string[];  // source IDs
  confidence: 1 | 2 | 3 | 4 | 5;
}
```

**Percentage Rounding:**
- Use largest remainder (Hamilton) method
- Round to 2 decimals
- Ensure sum = 100.00

**Input Hash:**
- SHA-256 of normalized HD data (sorted arrays)
- Slice to 16 chars for brevity

**Hybrid Rule:**
- `|p1 - p2| ≤ tieThresholdPct`

### 3. UI Store (`src/store/uiStore.ts`)

```typescript
export interface UIState {
  hideDisputed: boolean;  // default: true
  minConfidence: 1 | 2 | 3 | 4 | 5;  // default: 2
  setHideDisputed: (value: boolean) => void;
  setMinConfidence: (value: 1 | 2 | 3 | 4 | 5) => void;
}
```

Persist to localStorage with Zustand persist middleware.

### 4. Lore Components

#### SourceBadge (`src/components/lore/SourceBadge.tsx`)
- Props: `{ sourceId: string; showTooltip?: boolean }`
- Compose from Figma `Chip` (selectable variant)
- Prepend ⚑ if disputed
- Tooltip with author/year (keyboard-accessible: `tabIndex=0` + `aria-describedby`)

#### ContributionCard (`src/components/lore/ContributionCard.tsx`)
- Props: `{ contributor: EnhancedContributor; totalWeight: number; systemId: string }`
- Compose from Figma `Card`, `Chip`, `Button`
- Show percentage bar, rationale, source badges, confidence dots
- Collapsible details section

#### SystemSummary (`src/components/lore/SystemSummary.tsx`)
- Props: `{ classification: ClassificationResult }`
- Compose from Figma `Card` (emphasis), `Chip`
- Show top 3 systems, hybrid indicator, lore version

#### EvidenceMatrix (`src/components/lore/EvidenceMatrix.tsx`)
- Props: `{ contributors: EnhancedContributor[]; activeSystemId?: string }`
- Compose from Figma `Card`, `Button`
- Table columns: **Attribute Type** (Gate/Channel/Center/Profile/Type/Authority), Attribute, Weight, Confidence, Sources
- Filters: hide disputed, min confidence
- Sort by weight descending

### 5. Why 2.0 Screen (`src/screens/WhyScreen.tsx`)

**Refactor:**
- Top: `<SystemSummary />`
- Tabs: Primary + Ally systems
- Body: Filtered `<ContributionCard />` list
- Filters: hideDisputed, minConfidence (from UI Store)
- Footer: Lore version + disclaimer

**Empty State:**
- Show "Nothing matches your filters" card when filtered list is empty

**Virtualization:**
- If contributors >75, use `@tanstack/react-virtual`

**Performance:**
- Memoize filtered contributors
- Target: <50ms render after data ready

### 6. Dossier Screen (`src/screens/DossierScreen.tsx`)

**Sections:**
1. **Identity Snapshot:** type, authority, profile, defined centers, signature channel
2. **One-Line Verdict:** primary/hybrid + system descriptions
3. **Why Not:** next 1-2 systems + top 3 unmatched rules (by weight)
4. **Deployment Matrix:** Primary/Secondary/Tertiary ranking
5. **Gate→Faction Grid:** `<EvidenceMatrix />`
6. **Sources Gallery:** Deduplicated `<SourceBadge />` list

**Signature Channel:**
- Highest-weight channel-based rule
- Tie-break: lower channel number, then alphabetical
- Fallback: Display "—" if no channel rules matched

**Why Not Algorithm:**
- Select next 1-2 systems by score (skip hybrid pair if applicable)
- Find unmatched rules for each system
- Sort by weight desc, then confidence desc, then ID
- Take top 3

**Hybrid UI Copy:**
- Format: "Hybrid: Pleiades + Sirius (Δ 3.2%)"

**Export Actions:**
- **Export PNG:** `html-to-image` at 1080×1920, timestamped filename
- **Print/PDF:** Browser print dialog with print CSS (animations off, page breaks between sections)
- **Generate Narrative:** Route to placeholder

**Performance Target:** <200ms render

### 7. Result Screen Modification (`src/screens/ResultScreen.tsx`)

Add secondary button below "View Why":
```tsx
<Button variant="secondary" className="w-full" onClick={() => navigate('/dossier')}>
  Open Dossier
</Button>
```

### 8. Routing (`src/App.tsx`)

Add lazy-loaded route:
```tsx
const DossierScreen = lazy(() => import('./screens/DossierScreen'));
<Route path="/dossier" element={<DossierScreen />} />
```

## Data Models

**Enhanced ClassificationResult:**
```typescript
{
  // ... existing fields
  contributorsWithWeights: Record<string, EnhancedContributor[]>;  // NEW
  meta: {
    lore_version: string;  // NEW
    rules_hash: string;  // NEW
    input_hash: string;  // NEW
    canonVersion: string;  // DEPRECATED
    canonChecksum: string;  // DEPRECATED
  };
}
```

## Testing

### Unit Tests

**scorer.test.ts:**
- Percentage rounding sums to 100.00 (property test, 1k randomized vectors)
- Input hash stability
- Enhanced contributor output

### E2E Tests

**why.spec.ts:**
- Navigate to /why
- Toggle "Hide disputed" filter
- Assert disputed badges hidden/visible

**dossier.spec.ts:**
- Navigate to /dossier
- Assert Identity Snapshot, Deployment Matrix, Sources Gallery visible
- Click Export PNG, assert non-empty data URL

## Dependencies

**New:**
- `html-to-image`: ^1.11.11
- `@tanstack/react-virtual`: ^3.0.0 (optional, if virtualization needed)

**Existing:**
- `yaml`: ^2.8.1
- `tsx`: For compile script
- `crypto`: Node.js built-in

## File Changes

**New:**
- `data/lore/lore.yaml` (moved from root)
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

**Modified:**
- `src/lib/scorer.ts` (enhanced output)
- `src/lib/schemas.ts` (new types)
- `src/screens/WhyScreen.tsx` (refactor)
- `src/screens/ResultScreen.tsx` (add button)
- `src/App.tsx` (add route)
- `package.json` (scripts, deps)

**Moved:**
- `lore.yaml` → `data/lore/lore.yaml`
- `prompt2.md` → `.kiro/specs/why-2-dossier/prompt.md`

## Accessibility

- Tooltips keyboard-accessible (`aria-describedby`)
- Respect `prefers-reduced-motion`
- No animations >3 Hz
- 44px minimum touch targets
- Disclaimer on both Why and Dossier screens

## Summary

This design adds full provenance tracking to the Star System Sorter through a deterministic lore compiler, enhanced scorer output, and rich UI components. The Why 2.0 screen provides filterable exploration of classification factors, while the Dossier screen offers a comprehensive, exportable report. All changes maintain backward compatibility with the existing MVP.

**See `design-detailed.md` for implementation algorithms and code samples.**
