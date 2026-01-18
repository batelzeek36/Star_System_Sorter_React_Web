#!/usr/bin/env python3
"""
Check which source files are available for the pipeline.
"""

import sys
from pathlib import Path

# Add scripts directory to path
sys.path.insert(0, str(Path(__file__).parent))

from config import (
    LINE_COMPANION_SOURCES,
    I_CHING_SOURCES,
    HEXAGRAMS_DIR,
    RESEARCH_OUTPUTS_DIR,
)
from utils import setup_logging


def main():
    logger = setup_logging(__name__)
    
    # Ensure output directory exists
    RESEARCH_OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)
    
    print("=" * 60)
    print("SOURCE FILE AVAILABILITY CHECK")
    print("=" * 60)
    
    # Check Line Companion sources
    print("\n📚 Line Companion Sources (in priority order):")
    print("-" * 60)
    found_lc = False
    for i, source in enumerate(LINE_COMPANION_SOURCES, 1):
        exists = source.exists()
        status = "✓ FOUND" if exists else "✗ Missing"
        print(f"{i}. {status}: {source.name}")
        if exists and not found_lc:
            print(f"   → Will use this source")
            found_lc = True
            size = source.stat().st_size / (1024 * 1024)  # MB
            print(f"   → Size: {size:.2f} MB")
    
    if not found_lc:
        print("\n⚠️  WARNING: No Line Companion source found!")
    
    # Check I Ching sources
    print("\n📖 I Ching Sources (fallback):")
    print("-" * 60)
    for source in I_CHING_SOURCES:
        exists = source.exists()
        status = "✓ FOUND" if exists else "✗ Missing"
        print(f"   {status}: {source.name}")
        if exists:
            size = source.stat().st_size / (1024 * 1024)  # MB
            print(f"   → Size: {size:.2f} MB")
    
    # Check hexagram files
    print("\n🔯 Hexagram Reference Files:")
    print("-" * 60)
    if HEXAGRAMS_DIR.exists():
        hexagram_files = sorted(HEXAGRAMS_DIR.glob("*.json"))
        hexagram_count = len([f for f in hexagram_files if f.stem.isdigit()])
        print(f"   ✓ Found {hexagram_count}/64 hexagram files")
        if hexagram_count < 64:
            print(f"   ⚠️  WARNING: Missing {64 - hexagram_count} hexagram files")
    else:
        print(f"   ✗ Hexagrams directory not found: {HEXAGRAMS_DIR}")
    
    print("\n" + "=" * 60)
    
    if found_lc:
        print("✅ Ready to run pipeline")
    else:
        print("❌ Cannot run pipeline - missing Line Companion source")
    
    print("=" * 60)


if __name__ == "__main__":
    main()
