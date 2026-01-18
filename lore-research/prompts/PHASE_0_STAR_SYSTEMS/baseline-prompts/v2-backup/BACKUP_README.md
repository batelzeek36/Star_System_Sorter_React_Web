# V2 Baseline Prompts Backup

**Date:** 2025-01-24

## Why This Backup Exists

These are the v2 baseline prompts that were too strict for Comet to complete. The Sirius v2 prompt caused Comet to give up because it demanded:
- Verbatim quotes from books it couldn't fully access
- Exact page numbers from sources behind paywalls
- Zero tolerance for any missing information

## What Changed in V3

The v3 prompts maintain bulletproof standards but allow:
- Best-effort quotes when full text isn't accessible
- Page ranges or chapter references when exact pages unavailable
- Clear marking of "partial access" sources that need manual verification

## Files Backed Up

- `_BULLETPROOF_TEMPLATE.txt` - Core standards (unchanged)
- `PLEIADES_BASELINE.txt` - Worked successfully
- `SIRIUS_BASELINE.txt` - Too strict, caused failure
- `LYRA_BASELINE.txt` - Not yet tested
- `ANDROMEDA_BASELINE.txt` - Not yet tested
- `ORION_LIGHT_BASELINE.txt` - Not yet tested
- `ORION_DARK_BASELINE.txt` - Not yet tested
- `ARCTURUS_BASELINE.txt` - Not yet tested
- `DRACO_BASELINE.txt` - Not yet tested

## V3 Philosophy

**Maintain quality, enable completion:**
- NO Wikipedia, NO blogs, NO anonymous sources (unchanged)
- Published books with ISBNs required (unchanged)
- Ancient texts need named translators (unchanged)
- BUT: Allow "best effort" citations with manual verification flag
- Result: Comet can complete research, you verify/enhance later
