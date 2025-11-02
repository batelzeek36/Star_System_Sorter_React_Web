#!/usr/bin/env python3
"""
Unit tests for source selector functionality.

Tests the source file selection logic with priority ordering.
"""

import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from config import LINE_COMPANION_SOURCES


def test_source_selector_priority():
    """Test that source selector respects priority order."""
    # Import here to avoid issues if config changes
    from config import (
        LORE_RESEARCH_ROOT,
        S3_DATA_ROOT,
    )
    
    # Expected priority order (from task 2.1 requirements)
    expected_order = [
        "line-companion-normalized.txt",
        "Line Companion_djvu.txt",
        "Line Companion.epub",
        "Line Companion_djvu.xml",
        "Line Companion_scandata.xml",
        "Line Companion_abbyy.gz",
    ]
    
    print("Testing source priority order...")
    print(f"Expected {len(expected_order)} sources in priority order")
    print()
    
    # Check that LINE_COMPANION_SOURCES matches expected order
    assert len(LINE_COMPANION_SOURCES) == len(expected_order), \
        f"Expected {len(expected_order)} sources, got {len(LINE_COMPANION_SOURCES)}"
    
    for i, (source_path, expected_name) in enumerate(zip(LINE_COMPANION_SOURCES, expected_order), 1):
        actual_name = source_path.name
        print(f"Priority {i}: {actual_name}")
        assert actual_name == expected_name, \
            f"Priority {i}: Expected {expected_name}, got {actual_name}"
    
    print()
    print("✓ All sources in correct priority order")
    return True


def test_source_selector_selection():
    """Test that source selector selects first available file."""
    from importlib import reload
    import config
    
    # Reload to get fresh SourceSelector
    sys.path.insert(0, str(Path(__file__).parent))
    
    # Import after path is set
    import importlib.util
    spec = importlib.util.spec_from_file_location(
        "normalize_script",
        Path(__file__).parent / "01-normalize-line-companion.py"
    )
    normalize_script = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(normalize_script)
    
    SourceSelector = normalize_script.SourceSelector
    
    print("\nTesting source selection logic...")
    
    # Test with actual file paths
    selector = SourceSelector(LINE_COMPANION_SOURCES)
    selected = selector.select_source()
    
    if selected:
        print(f"✓ Selected source: {selected.name}")
        print(f"  Reason: {selector.selection_reason}")
        print(f"  Path exists: {selected.exists()}")
        
        metadata = selector.get_source_metadata()
        print(f"\nMetadata:")
        print(f"  source_file: {metadata['source_file']}")
        print(f"  source_offset: {metadata['source_offset']}")
        print(f"  selection_reason: {metadata['selection_reason']}")
        
        assert selected.exists(), f"Selected file does not exist: {selected}"
        assert metadata['source_file'] is not None
        assert metadata['selection_reason'] is not None
        
        return True
    else:
        print("✗ No source selected (no files available)")
        return False


def test_source_metadata_logging():
    """Test that source metadata is properly tracked."""
    print("\nTesting source metadata tracking...")
    
    # Import SourceSelector
    import importlib.util
    spec = importlib.util.spec_from_file_location(
        "normalize_script",
        Path(__file__).parent / "01-normalize-line-companion.py"
    )
    normalize_script = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(normalize_script)
    
    SourceSelector = normalize_script.SourceSelector
    
    # Create selector and select source
    selector = SourceSelector(LINE_COMPANION_SOURCES)
    selected = selector.select_source()
    
    if not selected:
        print("⚠ Skipping test - no sources available")
        return True
    
    # Verify metadata structure
    metadata = selector.get_source_metadata()
    
    required_keys = ['source_file', 'source_path', 'source_offset', 'selection_reason']
    for key in required_keys:
        assert key in metadata, f"Missing required metadata key: {key}"
        print(f"  ✓ {key}: {metadata[key]}")
    
    # Verify source_offset is initialized
    assert metadata['source_offset'] == 0, "source_offset should be initialized to 0"
    
    print("\n✓ Source metadata properly tracked")
    return True


def main():
    """Run all tests."""
    print("=" * 60)
    print("SOURCE SELECTOR UNIT TESTS")
    print("=" * 60)
    print()
    
    tests = [
        ("Priority Order", test_source_selector_priority),
        ("Source Selection", test_source_selector_selection),
        ("Metadata Logging", test_source_metadata_logging),
    ]
    
    passed = 0
    failed = 0
    
    for test_name, test_func in tests:
        try:
            print(f"\n{'=' * 60}")
            print(f"TEST: {test_name}")
            print('=' * 60)
            result = test_func()
            if result:
                passed += 1
                print(f"\n✓ {test_name} PASSED")
            else:
                failed += 1
                print(f"\n✗ {test_name} FAILED")
        except Exception as e:
            failed += 1
            print(f"\n✗ {test_name} FAILED with exception:")
            print(f"  {type(e).__name__}: {e}")
    
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print(f"Passed: {passed}/{len(tests)}")
    print(f"Failed: {failed}/{len(tests)}")
    print("=" * 60)
    
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    exit(main())
