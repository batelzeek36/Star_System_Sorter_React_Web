#!/usr/bin/env python3
"""
Test the quote verification script.
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from verify_quotes import (
    normalize_text,
    count_words,
    parse_legge_locator,
    parse_line_companion_locator,
    find_quote_in_legge,
    find_quote_in_line_companion
)


def test_normalize_text():
    """Test text normalization."""
    # Smart quotes - left/right single quotes (using Unicode escapes)
    assert normalize_text("\u2018hello\u2019") == "'hello'"  # 'hello'
    assert normalize_text("'hello'") == "'hello'"
    
    # Smart quotes - left/right double quotes (using Unicode escapes)
    assert normalize_text("\u201chello\u201d") == '"hello"'  # "hello"
    assert normalize_text('"hello"') == '"hello"'
    
    # Mixed smart quotes
    assert normalize_text("it\u2019s \u201cgreat\u201d") == "it's \"great\""
    
    # Whitespace
    assert normalize_text("  hello   world  ") == "hello world"
    assert normalize_text("hello\n\nworld") == "hello world"
    
    # Em-dash and en-dash (using Unicode escapes)
    assert normalize_text("hello\u2014world") == "hello-world"  # —
    assert normalize_text("hello\u2013world") == "hello-world"  # –
    
    print("✓ normalize_text tests passed")


def test_count_words():
    """Test word counting."""
    assert count_words("hello world") == 2
    assert count_words("self-control") == 1  # Hyphenated
    assert count_words("don't") == 1  # Contraction
    assert count_words("hello—world") == 2  # Em-dash separator
    assert count_words("hello, world!") == 2  # Punctuation
    assert count_words("  hello   world  ") == 2  # Extra whitespace
    assert count_words("...") == 0  # Punctuation only
    
    # 25-word test
    text = "the dragon lying hid in the deep it is not the time for active doing"
    assert count_words(text) == 15
    
    print("✓ count_words tests passed")


def test_parse_locators():
    """Test locator parsing."""
    # Legge
    assert parse_legge_locator("Hex 1, Line 1") == (1, 1)
    assert parse_legge_locator("Hex 01, Line 1") == (1, 1)
    assert parse_legge_locator("Hex 64, Line 6") == (64, 6)
    assert parse_legge_locator("Invalid") is None
    assert parse_legge_locator("Hex 0, Line 1") is None
    assert parse_legge_locator("Hex 1, Line 7") is None
    
    # Line Companion
    assert parse_line_companion_locator("Gate 1, Line 1") == (1, 1)
    assert parse_line_companion_locator("Gate 01, Line 1") == (1, 1)
    assert parse_line_companion_locator("Gate 64, Line 6") == (64, 6)
    assert parse_line_companion_locator("Invalid") is None
    
    print("✓ parse_locators tests passed")


def test_find_quote_in_legge():
    """Test finding quotes in Legge source."""
    legge_data = {
        "lines": [
            {
                "line": 1,
                "legge_line_text": "In the first (or lowest) line, undivided, (we see its subject as) the dragon lying hid (in the deep). It is not the time for active doing."
            },
            {
                "line": 2,
                "legge_line_text": "In the second line, undivided, (we see its subject as) the dragon appearing in the field. It will be advantageous to meet with the great man."
            }
        ]
    }
    
    # Exact substring
    found, line = find_quote_in_legge("the dragon lying hid (in the deep)", legge_data, 1)
    assert found and line == 1
    
    # With normalization
    found, line = find_quote_in_legge("the dragon lying hid (in the deep)", legge_data, 1)
    assert found and line == 1
    
    # Not found
    found, line = find_quote_in_legge("this quote does not exist", legge_data, 1)
    assert not found
    
    # Wrong line
    found, line = find_quote_in_legge("the dragon appearing in the field", legge_data, 1)
    assert found and line == 2  # Found but in wrong line
    
    print("✓ find_quote_in_legge tests passed")


def test_find_quote_in_line_companion():
    """Test finding quotes in Line Companion source."""
    lc_data = {
        "gate": 1,
        "lines": [
            {
                "line": 1,
                "full_text": "The first line always speaks for the nature of the hexagram. Time is everything."
            },
            {
                "line": 2,
                "full_text": "Love is light. What a lovely line."
            }
        ]
    }
    
    # Found in correct line
    found, gate, line = find_quote_in_line_companion("Time is everything", lc_data, 1)
    assert found and gate == 1 and line == 1
    
    # Found in different line (line-agnostic)
    found, gate, line = find_quote_in_line_companion("Love is light", lc_data, 1)
    assert found and gate == 1 and line == 2
    
    # Not found
    found, gate, line = find_quote_in_line_companion("this does not exist", lc_data, 1)
    assert not found
    
    print("✓ find_quote_in_line_companion tests passed")


if __name__ == "__main__":
    test_normalize_text()
    test_count_words()
    test_parse_locators()
    test_find_quote_in_legge()
    test_find_quote_in_line_companion()
    
    print()
    print("✓ All tests passed!")
