# UI Reference Template

This folder contains the **minimal** UI reference files needed for the Figma agent to generate new screen designs.

## Contents

- **App.tsx** - 3 essential screens (346 lines vs 1974 lines in original)
  - Onboarding: Welcome flow with steps
  - Input: Form with fields and validation hints
  - Result: Classification display with crest and percentages
- **design-tokens.json** - Design system tokens (colors, spacing, typography)
- **globals.css** - Global CSS variables and styles
- **components/** - Reusable UI components
- **Guidelines.md** - Concise UI/UX rules

## What Was Removed

The original had 19 screens (login, community, profile, paywall, settings, empty states, 10 game screens). This minimal version keeps only the 3 core screens that demonstrate all essential patterns:
- Layout structure
- Component usage
- Form patterns
- Result display
- Cosmic theme (starfield, gradients)

## Usage

The Figma agent can reference these files to understand:
- Component structure and patterns
- Design token values
- Visual styling approach
- Layout patterns
- Cosmic aesthetic (dark theme, lavender accents, starfield)

**Note:** Full version backed up as `App-Full.tsx.backup` if needed.
