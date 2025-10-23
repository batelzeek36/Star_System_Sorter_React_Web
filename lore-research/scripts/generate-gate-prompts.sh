#!/bin/bash

# Generate COMET prompts for a specific gate from templates
# Usage: ./generate-gate-prompts.sh <gate_number> "<archetype_keywords>"
# Example: ./generate-gate-prompts.sh 3 "innovation through difficulty, mutation, new beginnings from chaos"

set -e

if [ $# -lt 2 ]; then
    echo "Usage: $0 <gate_number> \"<archetype_keywords>\""
    echo "Example: $0 3 \"innovation through difficulty, mutation, new beginnings from chaos\""
    exit 1
fi

GATE_NUMBER=$1
GATE_ARCHETYPE=$2
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROMPTS_DIR="$SCRIPT_DIR/../prompts"
GATE_DIR="$PROMPTS_DIR/gate-$GATE_NUMBER"

# Create gate directory
mkdir -p "$GATE_DIR"

echo "Generating prompts for Gate $GATE_NUMBER..."
echo "Archetype: $GATE_ARCHETYPE"

# Generate Pass A
sed "s/{{GATE_NUMBER}}/$GATE_NUMBER/g; s/{{GATE_ARCHETYPE}}/$GATE_ARCHETYPE/g" \
    "$PROMPTS_DIR/TEMPLATE_PASS_A.txt" > "$GATE_DIR/COMET_PASS_A_GATE_$GATE_NUMBER.txt"
echo "✅ Created COMET_PASS_A_GATE_$GATE_NUMBER.txt"

# Generate Pass B
sed "s/{{GATE_NUMBER}}/$GATE_NUMBER/g; s/{{GATE_ARCHETYPE}}/$GATE_ARCHETYPE/g" \
    "$PROMPTS_DIR/TEMPLATE_PASS_B.txt" > "$GATE_DIR/COMET_PASS_B_GATE_$GATE_NUMBER.txt"
echo "✅ Created COMET_PASS_B_GATE_$GATE_NUMBER.txt"

# Generate Pass C
sed "s/{{GATE_NUMBER}}/$GATE_NUMBER/g; s/{{GATE_ARCHETYPE}}/$GATE_ARCHETYPE/g" \
    "$PROMPTS_DIR/TEMPLATE_PASS_C.txt" > "$GATE_DIR/COMET_PASS_C_GATE_$GATE_NUMBER.txt"
echo "✅ Created COMET_PASS_C_GATE_$GATE_NUMBER.txt"

echo ""
echo "✨ All prompts generated in: $GATE_DIR"
echo ""
echo "Next steps:"
echo "1. Open Perplexity Comet"
echo "2. Paste each prompt and save JSON responses to research-outputs/"
echo "3. Validate responses against CITATION_QUALITY_STANDARDS.md"
