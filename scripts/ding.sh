#!/bin/bash
# Ding sound notification for task completion

# Get custom message or use default
MESSAGE="${1:-Task completed successfully! ✨}"

# Play sound in background
afplay /System/Library/Sounds/Glass.aiff &

# Display custom notification in top-right corner with 50% opacity
# Compile and run Swift notification (compiles on first run, cached after)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SWIFT_BIN="$SCRIPT_DIR/.notification_bin"

# Compile if needed
if [ ! -f "$SWIFT_BIN" ]; then
    swiftc "$SCRIPT_DIR/notification.swift" -o "$SWIFT_BIN" 2>/dev/null
fi

# Run notification (non-blocking)
if [ -f "$SWIFT_BIN" ]; then
    "$SWIFT_BIN" "$MESSAGE" &
else
    # Fallback to simple notification if Swift compilation fails
    osascript -e "display notification \"$MESSAGE\" with title \"Kiro Agent\""
fi
