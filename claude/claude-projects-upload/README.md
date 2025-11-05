# Claude Projects Upload Package - Star System Mapping

This folder contains all the essential files needed to upload to Claude Projects for gate.line → star system mapping work.

## Contents

### Core Instructions
- `CLAUDE_PROJECTS_SCORING_UPLOAD.md` - Main workflow and instructions (symlink)
- `gate-line-standard.md` - Universal mapping methodology (motivation-based) **[CANONICAL LOCATION]**
- `SHADOW_AS_DISTORTION_NOT_OPPOSITION.md` - Critical conceptual framework (symlink)
- `BATCH_FILE_SPECIFICATION.md` - Expected output format (symlink)

### Star System Baselines (v4.2)
All 8 star system baseline files in `star-system-baselines/`:
- `andromeda-baseline-4.2.json`
- `arcturus-baseline-4.2.json`
- `draco-baseline-4.2.json`
- `lyra-baseline-4.2.json`
- `orion-dark-baseline-4.2.json`
- `orion-light-baseline-4.2.json`
- `pleiades-baseline-4.2.json`
- `sirius-baseline-4.2.json`

### Research Context
- `METHODOLOGY.md` - Research methodology documentation

## Usage

Upload all files in this folder to your Claude Project. The gate-line-API-call files (gate-line-1.json through gate-line-64.json) should be referenced from their original location as needed per batch.

## Note

Most files are symlinks to their canonical locations in the repo. This keeps the upload package in sync with any updates to the source files.

**Exception:** `gate-line-standard.md` lives here as its canonical location. It was moved from `.kiro/steering/` to avoid consuming tokens in every Kiro conversation, since it's only needed for Claude Projects star system mapping work.
