"""
Simple tests for utility functions.
Run with: python test_utils.py
"""

import sys
from pathlib import Path

# Add scripts directory to path
sys.path.insert(0, str(Path(__file__).parent))

from utils import (
    count_words,
    truncate_to_word_limit,
    extract_first_sentence,
    validate_gate_number,
    validate_line_number,
    normalize_whitespace,
)


def test_count_words():
    assert count_words("hello world") == 2
    assert count_words("one") == 1
    assert count_words("") == 0
    print("✓ count_words")


def test_truncate_to_word_limit():
    text = "This is a test sentence with more than five words in it"
    truncated, was_truncated = truncate_to_word_limit(text, max_words=5)
    assert was_truncated is True
    assert count_words(truncated.replace("...", "")) == 5
    
    short_text = "Short text"
    truncated, was_truncated = truncate_to_word_limit(short_text, max_words=5)
    assert was_truncated is False
    assert truncated == short_text
    print("✓ truncate_to_word_limit")


def test_extract_first_sentence():
    text = "First sentence. Second sentence. Third sentence."
    result = extract_first_sentence(text)
    assert result == "First sentence."
    
    text_with_limit = "This is a very long first sentence with many words. Second sentence."
    result = extract_first_sentence(text_with_limit, max_words=5)
    assert count_words(result.replace("...", "")) <= 5
    print("✓ extract_first_sentence")


def test_validate_gate_number():
    assert validate_gate_number(1) is True
    assert validate_gate_number(64) is True
    assert validate_gate_number(0) is False
    assert validate_gate_number(65) is False
    print("✓ validate_gate_number")


def test_validate_line_number():
    assert validate_line_number(1) is True
    assert validate_line_number(6) is True
    assert validate_line_number(0) is False
    assert validate_line_number(7) is False
    print("✓ validate_line_number")


def test_normalize_whitespace():
    text = "  multiple   spaces   "
    result = normalize_whitespace(text)
    assert result == "multiple spaces"
    
    text_with_tabs = "text\twith\ttabs"
    result = normalize_whitespace(text_with_tabs)
    assert "\t" not in result
    print("✓ normalize_whitespace")


if __name__ == "__main__":
    print("Running utility tests...\n")
    
    test_count_words()
    test_truncate_to_word_limit()
    test_extract_first_sentence()
    test_validate_gate_number()
    test_validate_line_number()
    test_normalize_whitespace()
    
    print("\n✅ All tests passed!")
