# Steering Docs Updated for GPT-4o Classification

## Summary

Updated all steering docs in `.kiro/steering/` to reflect the new GPT-4o classification system and the toggle for switching back to deterministic scoring.

## Files Updated

### 1. `.kiro/steering/tech.md`

**Added Section**: "Star System Classification (GPT-4o)"

- Explains current implementation uses GPT-4o
- Documents the classification flow
- Lists what GPT system prompt includes
- Shows cost per classification (~$0.004)
- Explains how to toggle back to deterministic scoring
- Lists all preserved deterministic code files
- References `GPT_CLASSIFICATION_MIGRATION.md` for details

**Key Points**:
- GPT-4o is the current classification engine
- Deterministic scorer is preserved but disabled
- Feature flag: `VITE_USE_DETERMINISTIC_SCORING=true` to re-enable
- All deterministic code intact for rollback

### 2. `.kiro/steering/product.md`

**Updated Section**: "What We're Building"

- Changed from "deterministic star system classification" to "GPT-4o analyzes their chart"
- Added warning banner about current implementation
- Updated core value proposition to include AI-powered features

**Added Section**: "Classification System"

- Documents current GPT-4o implementation
- Explains how it works (5-step flow)
- Lists benefits of GPT approach
- Shows cost per classification
- Explains toggle back to deterministic
- Lists preserved code files
- References migration docs

**Key Points**:
- Emphasizes AI-powered classification with automatic explanations
- Adaptive intelligence for edge cases
- Easier maintenance (prompt refinement vs algorithm tuning)
- Preserves all deterministic code for rollback

### 3. `.kiro/steering/structure.md`

**Updated Section**: "Key Files"

**Client Files**:
- Marked `lib/scorer.ts` as DEPRECATED (preserved for rollback)
- Added `lib/scorer-config.ts` (preserved)
- Added `lib/gateline-map.ts` (preserved)
- Added `hooks/useGPTClassification.ts` as NEW
- Marked `hooks/useGateLineScoring.ts` as DEPRECATED (preserved)
- Updated `hooks/useHDData.ts` description to include GPT classification

**Server Files**:
- Added `routes/classify.ts` as NEW
- Added `routes/narrative.ts` (already existed)
- Added `services/gpt-classification.ts` as NEW
- Added `services/narrative.ts` (already existed)

**Key Points**:
- Clear marking of deprecated vs new files
- All deprecated files preserved for rollback
- New GPT classification files clearly marked

## What Agents Will Know

When agents read the steering docs, they will now understand:

1. **Current State**: GPT-4o is the active classification engine
2. **How It Works**: Full flow from birth data to GPT classification
3. **Cost**: ~$0.004 per classification
4. **Rollback**: How to toggle back to deterministic scoring
5. **Preserved Code**: All deterministic code is intact
6. **File Structure**: Which files are new, deprecated, or preserved

## Benefits

✅ Agents won't accidentally modify deprecated scorer code  
✅ Agents will know to use GPT classification by default  
✅ Agents understand the rollback strategy  
✅ Clear documentation of what changed and why  
✅ References to detailed migration docs for deep dives  

## Related Documentation

- `GPT_CLASSIFICATION_MIGRATION.md` - Full technical details
- `GPT_CLASSIFICATION_QUICKSTART.md` - Setup and usage
- `GPT_CLASSIFICATION_SUMMARY.md` - High-level overview
- `BEFORE_AFTER_COMPARISON.md` - Architecture comparison
- `GPT_CLASSIFICATION_CHECKLIST.md` - Implementation checklist

## Next Steps

Agents working on the project will now:

1. Use GPT classification by default
2. Understand the toggle mechanism
3. Know where to find preserved code
4. Reference migration docs for details
5. Avoid modifying deprecated files unless explicitly asked
