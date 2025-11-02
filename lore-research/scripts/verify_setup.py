#!/usr/bin/env python3
"""
Verify that the pipeline setup is complete and ready to run.
"""

import sys
from pathlib import Path

# Add scripts directory to path
sys.path.insert(0, str(Path(__file__).parent))

from config import (
    PROJECT_ROOT,
    LORE_RESEARCH_ROOT,
    S3_DATA_ROOT,
    LINE_COMPANION_SOURCES,
    RESEARCH_OUTPUTS_DIR,
    GATES_CANDIDATE_DIR,
    BAD_LINES_FILE,
)
from utils import setup_logging, find_best_source


def check_directories():
    """Check that required directories exist."""
    print("\n📁 Directory Structure:")
    print("-" * 60)
    
    dirs_to_check = [
        ("Project root", PROJECT_ROOT),
        ("Lore research", LORE_RESEARCH_ROOT),
        ("S3 data", S3_DATA_ROOT),
        ("Research outputs", RESEARCH_OUTPUTS_DIR),
        ("Gates candidate", GATES_CANDIDATE_DIR),
    ]
    
    all_exist = True
    for name, path in dirs_to_check:
        exists = path.exists()
        status = "✓" if exists else "✗"
        print(f"   {status} {name}: {path}")
        if not exists:
            all_exist = False
    
    return all_exist


def check_source_files():
    """Check that at least one source file exists."""
    print("\n📚 Source Files:")
    print("-" * 60)
    
    logger = setup_logging(__name__)
    best_source = find_best_source(LINE_COMPANION_SOURCES, logger)
    
    if best_source:
        print(f"   ✓ Primary source: {best_source.name}")
        return True
    else:
        print("   ✗ No Line Companion source found")
        return False


def check_utilities():
    """Check that utility functions work."""
    print("\n🔧 Utility Functions:")
    print("-" * 60)
    
    try:
        from utils import (
            count_words,
            validate_gate_number,
            validate_line_number,
        )
        
        # Quick sanity checks
        assert count_words("hello world") == 2
        assert validate_gate_number(32) is True
        assert validate_line_number(3) is True
        
        print("   ✓ All utility functions working")
        return True
    except Exception as e:
        print(f"   ✗ Utility function error: {e}")
        return False


def check_config():
    """Check that configuration is valid."""
    print("\n⚙️  Configuration:")
    print("-" * 60)
    
    try:
        from config import (
            EXPECTED_GATES,
            LINES_PER_GATE,
            MAX_QUOTE_WORDS,
        )
        
        print(f"   ✓ Expected gates: {EXPECTED_GATES}")
        print(f"   ✓ Lines per gate: {LINES_PER_GATE}")
        print(f"   ✓ Max quote words: {MAX_QUOTE_WORDS}")
        return True
    except Exception as e:
        print(f"   ✗ Configuration error: {e}")
        return False


def ensure_bad_lines_file():
    """Ensure BAD_LINES.md exists with proper header."""
    print("\n📝 Error Tracking:")
    print("-" * 60)
    
    try:
        from config import BAD_LINES_FILE
        
        if not BAD_LINES_FILE.exists():
            BAD_LINES_FILE.parent.mkdir(parents=True, exist_ok=True)
            with open(BAD_LINES_FILE, "w", encoding="utf-8") as f:
                f.write("# Bad Lines - Manual Review Queue\n\n")
                f.write("Lines that could not be automatically extracted.\n\n")
                f.write("| Gate.Line | Source Tried | Problem | Suggestion |\n")
                f.write("|-----------|--------------|---------|------------|\n")
            print(f"   ✓ Created BAD_LINES.md")
        else:
            print(f"   ✓ BAD_LINES.md exists")
        return True
    except Exception as e:
        print(f"   ✗ Error tracking setup failed: {e}")
        return False


def main():
    print("=" * 60)
    print("PIPELINE SETUP VERIFICATION")
    print("=" * 60)
    
    checks = [
        ("Directories", check_directories()),
        ("Source files", check_source_files()),
        ("Utilities", check_utilities()),
        ("Configuration", check_config()),
        ("Error tracking", ensure_bad_lines_file()),
    ]
    
    print("\n" + "=" * 60)
    print("SUMMARY:")
    print("=" * 60)
    
    all_passed = True
    for name, passed in checks:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"   {status}: {name}")
        if not passed:
            all_passed = False
    
    print("=" * 60)
    
    if all_passed:
        print("\n✅ Setup complete! Ready to run pipeline.")
        print("\nNext steps:")
        print("   1. Run: python3 check_sources.py")
        print("   2. Run: python3 01-normalize-line-companion.py")
        return 0
    else:
        print("\n❌ Setup incomplete. Please fix errors above.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
