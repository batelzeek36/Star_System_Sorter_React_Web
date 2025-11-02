#!/usr/bin/env python3
"""
Test script to verify pipeline setup and utilities.

This script tests that:
1. Configuration is loaded correctly
2. Utility functions work as expected
3. Directory structure is in place
4. Source files can be located
"""

import sys
from pathlib import Path

# Add scripts directory to path
sys.path.insert(0, str(Path(__file__).parent))

from pipeline_config import (
    LINE_COMPANION_SOURCES,
    RESEARCH_OUTPUTS,
    GATE_CANDIDATE_DIR,
    MAX_QUOTE_WORDS,
    EXPECTED_GATES,
)
from pipeline_utils import (
    setup_logging,
    select_best_source,
    count_words,
    is_valid_quote_length,
    truncate_to_word_limit,
    validate_gate_number,
    validate_line_number,
    normalize_line_endings,
    collapse_blank_lines,
)


def test_configuration():
    """Test that configuration is loaded correctly."""
    logger = setup_logging(__name__)
    logger.info("Testing configuration...")
    
    assert len(LINE_COMPANION_SOURCES) > 0, "No source files configured"
    assert RESEARCH_OUTPUTS.exists(), f"Research outputs directory doesn't exist: {RESEARCH_OUTPUTS}"
    assert MAX_QUOTE_WORDS == 25, "Max quote words should be 25"
    assert EXPECTED_GATES == 64, "Expected gates should be 64"
    
    logger.info("✓ Configuration loaded successfully")
    return True


def test_source_selection():
    """Test source file selection."""
    logger = setup_logging(__name__)
    logger.info("Testing source selection...")
    
    source = select_best_source(logger)
    if source:
        logger.info(f"✓ Found source: {source}")
        return True
    else:
        logger.warning("⚠ No source files found (this is OK if files haven't been added yet)")
        return True


def test_validation_functions():
    """Test validation utility functions."""
    logger = setup_logging(__name__)
    logger.info("Testing validation functions...")
    
    # Test word counting
    assert count_words("This is a test") == 4
    assert count_words("One") == 1
    assert count_words("") == 0
    
    # Test quote length validation
    short_text = "This is a short quote"
    long_text = " ".join(["word"] * 30)
    assert is_valid_quote_length(short_text)
    assert not is_valid_quote_length(long_text)
    
    # Test truncation
    truncated = truncate_to_word_limit(long_text, 25)
    assert count_words(truncated) == 25
    assert truncated.endswith("...")
    
    # Test gate validation
    assert validate_gate_number(1)
    assert validate_gate_number(64)
    assert not validate_gate_number(0)
    assert not validate_gate_number(65)
    assert not validate_gate_number("invalid")
    
    # Test line validation
    assert validate_line_number(1)
    assert validate_line_number(6)
    assert not validate_line_number(0)
    assert not validate_line_number(7)
    
    logger.info("✓ All validation functions working correctly")
    return True


def test_text_processing():
    """Test text processing functions."""
    logger = setup_logging(__name__)
    logger.info("Testing text processing functions...")
    
    # Test line ending normalization
    mixed_endings = "Line 1\r\nLine 2\rLine 3\nLine 4"
    normalized = normalize_line_endings(mixed_endings)
    assert "\r" not in normalized
    assert normalized.count("\n") == 3
    
    # Test blank line collapsing
    excessive_blanks = "Line 1\n\n\n\n\nLine 2"
    collapsed = collapse_blank_lines(excessive_blanks, max_blank=1)
    assert collapsed.count("\n\n") <= 1
    
    logger.info("✓ Text processing functions working correctly")
    return True


def test_directory_structure():
    """Test that required directories exist or can be created."""
    logger = setup_logging(__name__)
    logger.info("Testing directory structure...")
    
    # Check research outputs
    assert RESEARCH_OUTPUTS.exists(), f"Research outputs directory missing: {RESEARCH_OUTPUTS}"
    
    # Check candidate directory
    GATE_CANDIDATE_DIR.mkdir(parents=True, exist_ok=True)
    assert GATE_CANDIDATE_DIR.exists(), f"Candidate directory missing: {GATE_CANDIDATE_DIR}"
    
    logger.info("✓ Directory structure is correct")
    return True


def main():
    """Run all tests."""
    logger = setup_logging(__name__)
    logger.info("=" * 80)
    logger.info("Pipeline Setup Verification")
    logger.info("=" * 80)
    
    tests = [
        ("Configuration", test_configuration),
        ("Source Selection", test_source_selection),
        ("Validation Functions", test_validation_functions),
        ("Text Processing", test_text_processing),
        ("Directory Structure", test_directory_structure),
    ]
    
    passed = 0
    failed = 0
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
            else:
                failed += 1
                logger.error(f"✗ {test_name} failed")
        except Exception as e:
            failed += 1
            logger.error(f"✗ {test_name} failed with exception: {e}")
    
    logger.info("=" * 80)
    logger.info(f"Tests passed: {passed}/{len(tests)}")
    if failed > 0:
        logger.error(f"Tests failed: {failed}/{len(tests)}")
        return 1
    else:
        logger.info("✓ All tests passed!")
        return 0


if __name__ == "__main__":
    sys.exit(main())
