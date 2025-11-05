# Shadow as Distortion, Not Opposition

## The Problem

When mapping gate.lines to star systems, there's a risk of treating `behavioral_axis` (healthy) and `shadow_axis` (distorted) as **two different star systems**, which creates user confusion:

❌ **Wrong:** "You have Draco energy (secrecy) but also Orion-Light energy (broadcasting)"
✅ **Right:** "You have Draco energy. When healthy, you keep secrets. When stressed, you lose control and blab."

## Core Principle

**Each gate.line maps to ONE star system only.**

The `behavioral_axis` and `shadow_axis` represent:
- **Healthy expression** of that system's archetype
- **Distorted expression** of the SAME archetype

Shadow is NOT a different system - it's the same system going wrong.

## Example: Gate 2.4

**Line Companion Data:**
```json
{
  "behavioral_axis": "Keeps their direction secret in a one-tracked way, not telling others which way they're turning until they actually make the turn",
  "shadow_axis": "Lets ego announce their direction beforehand, blabbing about which way they're going and inviting interference"
}
```

**Correct Mapping:**
```json
{
  "2.4": {
    "star_system": "Draco",
    "weight": 0.6,
    "alignment_type": "core",
    "why": "Keeps direction secret, controls information flow — Draco discretion/control strategy"
  }
}
```

**Interpretation:**
- Healthy Draco: Strategic secrecy, controlled information flow
- Shadow Draco: Ego blabbing, losing control of narrative

Both are **Draco** - just healthy vs distorted.

---

## Implementation Changes

### 1. Gate-Line Mapping Process

**When mapping gate.lines to star systems:**

1. Read both `behavioral_axis` and `shadow_axis` from Line Companion JSON
2. Identify which **ONE star system** this gate.line expresses
3. Map to that system with appropriate weight and alignment_type
4. Use behavioral/shadow data as **reference** to understand the archetype, not as separate mappings

**Mapping Logic:**
```
IF behavioral matches System A core themes:
  → Map to System A (core alignment)
  
IF behavioral matches System A shadow themes:
  → Map to System A (secondary alignment)
  
NEVER:
  → Map behavioral to System A AND shadow to System B
```

### 2. Update gate-line-standard.md

Add this section to `.kiro/steering/gate-line-standard.md`:

```markdown
## CRITICAL: One System Per Gate.Line

Each gate.line maps to ONE star system only. The behavioral_axis and 
shadow_axis from Line Companion represent healthy vs distorted expressions 
of THE SAME archetype.

**Example:**
- Gate 2.4 → Draco (0.6 core)
  - Healthy: Strategic secrecy, controlled information flow
  - Shadow: Ego blabbing, losing control of narrative

**DO NOT:**
- Map behavioral_axis to System A and shadow_axis to System B
- Treat shadow as a different/opposite system
- Score shadow separately from the primary system

**Shadow is not opposition - it's distortion of the same energy.**
```

### 3. Narrative Generation Prompt

Update `server/src/services/narrative-mission-prompt.md`:

```markdown
## Gate.Line Placement Descriptions

When describing specific gate.line placements in the user's chart:

**Frame shadow as distortion, not opposition:**

✅ GOOD:
"Your Draco placement in Gate 2, Line 4 gives you strategic discretion. 
When you're centered, you keep plans private until the right moment. 
When stressed or ego-driven, you may lose control and reveal too much too soon."

❌ BAD:
"You have both Draco secrecy and Orion-Light broadcasting energy" 
(This implies contradiction/opposition)

**Language patterns to use:**
- "When healthy/aligned: [behavioral_axis]"
- "When stressed/distorted: [shadow_axis]"
- "At your best: [behavioral]"
- "Under pressure: [shadow]"

**Language patterns to AVOID:**
- "You also have [opposite system]"
- "This contradicts your [other system]"
- "You're both X and anti-X"
```

### 4. UI Component Updates

**File:** `star-system-sorter/src/components/ResearchSources.tsx` (or similar)

**Current (problematic):**
```tsx
// DON'T DO THIS:
<div>
  <p>Behavioral: {behavioral_axis}</p>
  <p>Shadow: {shadow_axis}</p>
</div>
```

**Updated (correct):**
```tsx
// DO THIS:
<div className="gate-line-detail">
  <h3>{starSystem} Energy in Gate {gate}.{line}</h3>
  <div className="healthy-expression">
    <span className="icon">✓</span>
    <p><strong>When aligned:</strong> {behavioral_axis}</p>
  </div>
  <div className="shadow-expression">
    <span className="icon">⚠</span>
    <p><strong>When distorted:</strong> {shadow_axis}</p>
  </div>
</div>
```

**CSS Styling:**
```css
.healthy-expression {
  border-left: 3px solid var(--color-success);
  padding-left: 1rem;
  margin-bottom: 0.5rem;
}

.shadow-expression {
  border-left: 3px solid var(--color-warning);
  padding-left: 1rem;
  opacity: 0.8;
}
```

### 5. Result Screen Language

**File:** `star-system-sorter/src/screens/ResultScreen.tsx`

**When displaying gate.line contributors:**

```tsx
// Group by star system, show healthy/shadow as states
<div className="system-placements">
  <h3>Your {systemName} Placements</h3>
  {placements.map(p => (
    <div key={p.gateLineKey}>
      <h4>{p.planet} in Gate {p.gate}, Line {p.line}</h4>
      <p className="core-expression">{p.behavioral_axis}</p>
      <p className="shadow-note">
        <em>When stressed:</em> {p.shadow_axis}
      </p>
    </div>
  ))}
</div>
```

### 6. Scorer Logic (Already Correct!)

**File:** `star-system-sorter/src/lib/scorer.ts`

Your scorer already handles this correctly - it scores each gate.line once per system. No changes needed here.

**Current structure (keep this):**
```typescript
{
  star_system: "Draco",
  weight: 0.6,
  alignment_type: "core" | "secondary"
}
```

The `alignment_type` distinguishes core vs secondary expressions, NOT healthy vs shadow. Shadow is implicit - it's what happens when that system's energy is distorted.

---

## Why This Matters

### User Experience Impact

**Without this fix:**
- "Wait, am I Draco or Orion-Light? This is contradictory!"
- "The app says I'm both secretive and broadcasting - that makes no sense"
- Cognitive dissonance, confusion, loss of trust

**With this fix:**
- "I'm Draco. When I'm healthy, I'm strategic. When I'm stressed, I lose control."
- Clear, coherent narrative
- Users understand their patterns and growth edges

### Conceptual Accuracy

This aligns with how Human Design actually works:
- Each gate.line has a **defined** expression (not multiple contradictory ones)
- Shadow is the **low expression** of the same energy, not a different energy
- Growth is about moving from shadow to healthy expression of YOUR archetype

---

## Implementation Checklist

- [ ] Update `.kiro/steering/gate-line-standard.md` with "One System Per Gate.Line" section
- [ ] Update `server/src/services/narrative-mission-prompt.md` with shadow framing guidance
- [ ] Update UI components to show healthy/shadow as states, not separate systems
- [ ] Update Result Screen language to frame shadow as distortion
- [ ] Review existing gate.line mappings to ensure one-system-per-line
- [ ] Test narrative generation with new framing
- [ ] User test to confirm clarity (no confusion about "contradictory" energies)

---

## Quick Reference

**Remember:**
- One gate.line = One star system
- Behavioral + Shadow = Healthy + Distorted expressions of SAME system
- Shadow is not opposition, it's distortion
- Frame as "when aligned" vs "when stressed"
- Never present shadow as a different/opposite system

**This prevents user whiplash and maintains conceptual coherence.**
