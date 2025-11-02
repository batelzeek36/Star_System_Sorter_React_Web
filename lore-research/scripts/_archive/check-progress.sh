#!/bin/bash

# Check research progress across all gates
# Shows which gates have complete research (all 3 JSON files)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUTS_DIR="$SCRIPT_DIR/../research-outputs"

echo "🔍 Checking research progress..."
echo ""

# Count total gates
TOTAL_GATES=64
COMPLETED_GATES=0
PARTIAL_GATES=0

# Check each gate
for i in {1..64}; do
    PASS_A="$OUTPUTS_DIR/gate-$i-pass-a.json"
    PASS_B="$OUTPUTS_DIR/gate-$i-pass-b.json"
    PASS_C="$OUTPUTS_DIR/gate-$i-pass-c.json"
    
    if [ -f "$PASS_A" ] && [ -f "$PASS_B" ] && [ -f "$PASS_C" ]; then
        echo "✅ Gate $i - COMPLETE (all 3 passes)"
        ((COMPLETED_GATES++))
    elif [ -f "$PASS_A" ] || [ -f "$PASS_B" ] || [ -f "$PASS_C" ]; then
        echo "⚠️  Gate $i - PARTIAL ("
        [ -f "$PASS_A" ] && echo -n "A " || echo -n "- "
        [ -f "$PASS_B" ] && echo -n "B " || echo -n "- "
        [ -f "$PASS_C" ] && echo -n "C" || echo -n "-"
        echo ")"
        ((PARTIAL_GATES++))
    fi
done

echo ""
echo "📊 Progress Summary:"
echo "   Complete: $COMPLETED_GATES / $TOTAL_GATES gates"
echo "   Partial:  $PARTIAL_GATES gates"
echo "   Pending:  $((TOTAL_GATES - COMPLETED_GATES - PARTIAL_GATES)) gates"
echo ""

PERCENT=$((COMPLETED_GATES * 100 / TOTAL_GATES))
echo "   Overall: $PERCENT% complete"
