#!/bin/bash

# Quick wrapper to generate prompts for a gate using the archetype lookup
# Usage: ./generate-prompts-for-gate.sh <gate_number>
# Example: ./generate-prompts-for-gate.sh 3

set -e

if [ $# -lt 1 ]; then
    echo "Usage: $0 <gate_number>"
    echo "Example: $0 3"
    echo ""
    echo "This will automatically look up the archetype from GATE_ARCHETYPES.md"
    exit 1
fi

GATE_NUMBER=$1
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ARCHETYPES_FILE="$SCRIPT_DIR/../GATE_ARCHETYPES.md"

# Extract archetype from GATE_ARCHETYPES.md
GATE_ARCHETYPE=$(grep "^| $GATE_NUMBER " "$ARCHETYPES_FILE" | awk -F'|' '{print $4}' | sed 's/^ *//;s/ *$//')

if [ -z "$GATE_ARCHETYPE" ]; then
    echo "❌ Error: Could not find archetype for Gate $GATE_NUMBER in GATE_ARCHETYPES.md"
    exit 1
fi

echo "🔍 Found archetype for Gate $GATE_NUMBER: $GATE_ARCHETYPE"
echo ""

# Call the main script
"$SCRIPT_DIR/generate-gate-prompts.sh" "$GATE_NUMBER" "$GATE_ARCHETYPE"
