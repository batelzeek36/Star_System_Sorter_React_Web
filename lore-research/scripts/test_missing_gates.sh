#!/bin/bash
# Test script for 03b-handle-missing-gates.py
# Simulates missing gates to verify error handling

set -e

echo "=== Testing Missing Gates Handler ==="
echo ""

# Backup original
cp lore-research/research-outputs/line-companion/gates.json lore-research/research-outputs/line-companion/gates.json.test-backup

# Create test scenario with missing gates
python3 << 'EOF'
import json
from pathlib import Path

gates_file = Path('lore-research/research-outputs/line-companion/gates.json')
data = json.load(open(gates_file))

# Remove gate 37
if '37' in data:
    del data['37']
    print("✓ Removed gate 37")

# Make gate 42 empty
if '42' in data:
    data['42']['text'] = ''
    print("✓ Made gate 42 empty")

with open(gates_file, 'w') as f:
    json.dump(data, f, indent=2)

print("✓ Test data prepared")
EOF

echo ""
echo "Running script (should exit 1)..."
echo ""

# Run script - expect exit code 1
if python3 lore-research/scripts/03b-handle-missing-gates.py; then
    echo ""
    echo "❌ FAIL: Script should have exited with code 1"
    exit 1
else
    EXIT_CODE=$?
    if [ $EXIT_CODE -eq 1 ]; then
        echo ""
        echo "✅ PASS: Script exited with code 1 as expected"
    else
        echo ""
        echo "❌ FAIL: Script exited with code $EXIT_CODE (expected 1)"
        exit 1
    fi
fi

# Verify BAD_LINES.md was updated
echo ""
echo "Checking BAD_LINES.md..."
if grep -q "gate: 37" lore-research/research-outputs/BAD_LINES.md && \
   grep -q "gate: 42" lore-research/research-outputs/BAD_LINES.md; then
    echo "✅ PASS: Missing gates logged to BAD_LINES.md"
else
    echo "❌ FAIL: Missing gates not found in BAD_LINES.md"
    exit 1
fi

# Verify _meta was updated
echo ""
echo "Checking _meta.missing_gates..."
python3 << 'EOF'
import json
data = json.load(open('lore-research/research-outputs/line-companion/gates.json'))
missing = data.get('_meta', {}).get('missing_gates', [])
if 37 in missing and 42 in missing:
    print("✅ PASS: _meta.missing_gates contains [37, 42]")
else:
    print(f"❌ FAIL: _meta.missing_gates = {missing} (expected [37, 42])")
    exit(1)
EOF

# Restore original
echo ""
echo "Restoring original gates.json..."
mv lore-research/research-outputs/line-companion/gates.json.test-backup lore-research/research-outputs/line-companion/gates.json

# Clean up BAD_LINES.md test entries
python3 << 'EOF'
from pathlib import Path
bad_lines = Path('lore-research/research-outputs/BAD_LINES.md')
content = bad_lines.read_text()
# Remove test entries
lines = [l for l in content.split('\n') if 'gate: 37' not in l and 'gate: 42' not in l]
bad_lines.write_text('\n'.join(lines))
print("✓ Cleaned up BAD_LINES.md")
EOF

# Run script again to restore clean state
python3 lore-research/scripts/03b-handle-missing-gates.py > /dev/null 2>&1

echo ""
echo "=== All Tests Passed ==="
