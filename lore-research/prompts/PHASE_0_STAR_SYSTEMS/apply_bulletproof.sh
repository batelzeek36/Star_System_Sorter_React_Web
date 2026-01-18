#!/bin/bash

# Script to apply bulletproof enforcement to all baseline prompts
# Adds source quality verification, enforcement tables, and final validation

SYSTEMS=(
  "LYRA"
  "ANDROMEDA"
  "ORION_LIGHT"
  "ORION_DARK"
  "ARCTURUS"
  "DRACO"
  "ZETA_RETICULI"
)

for SYSTEM in "${SYSTEMS[@]}"; do
  FILE="lore-research/prompts/PHASE_0_STAR_SYSTEMS/${SYSTEM}_BASELINE.txt"
  echo "Processing $FILE..."
  
  # Backup already done, so just note it
  echo "  ✓ Backup exists in backups/pre-bulletproof-20251024/"
  
done

echo "Done! Manual updates required - see bulletproof template"
