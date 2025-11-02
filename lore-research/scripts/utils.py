"""
Shared utility functions for quote extraction pipeline.

Provides file I/O, logging, validation helpers, and common operations.
"""

import json
import logging
import re
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from config import (
    LOG_FORMAT,
    LOG_LEVEL,
    BAD_LINES_FILE,
    MAX_QUOTE_WORDS,
    JSON_INDENT,
    JSON_SORT_KEYS,
    JSON_ENSURE_ASCII,
)


def setup_logging(name: str, level: Optional[str] = None) -> logging.Logger:
    """
    Set up logging for a pipeline script.
    
    Args:
        name: Logger name (typically __name__)
        level: Log level override (defaults to config.LOG_LEVEL)
    
    Returns:
        Configured logger instance
    """
    log_level = level or LOG_LEVEL
    logging.basicConfig(
        level=getattr(logging, log_level),
        format=LOG_FORMAT,
    )
    return logging.getLogger(name)


def read_text_file(file_path: Path, encoding: str = "utf-8") -> str:
    """
    Read a text file and return its contents.
    
    Args:
        file_path: Path to the file
        encoding: File encoding (default: utf-8)
    
    Returns:
        File contents as string
    
    Raises:
        FileNotFoundError: If file doesn't exist
        IOError: If file can't be read
    """
    if not file_path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")
    
    with open(file_path, "r", encoding=encoding) as f:
        return f.read()


def write_text_file(file_path: Path, content: str, encoding: str = "utf-8") -> None:
    """
    Write content to a text file.
    
    Args:
        file_path: Path to the file
        content: Content to write
        encoding: File encoding (default: utf-8)
    """
    file_path.parent.mkdir(parents=True, exist_ok=True)
    with open(file_path, "w", encoding=encoding) as f:
        f.write(content)


def read_json_file(file_path: Path) -> Dict[str, Any]:
    """
    Read a JSON file and return parsed data.
    
    Args:
        file_path: Path to the JSON file
    
    Returns:
        Parsed JSON data
    
    Raises:
        FileNotFoundError: If file doesn't exist
        json.JSONDecodeError: If file contains invalid JSON
    """
    if not file_path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")
    
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)


def write_json_file(
    file_path: Path,
    data: Dict[str, Any],
    indent: Optional[int] = None,
    sort_keys: Optional[bool] = None,
) -> None:
    """
    Write data to a JSON file with pretty formatting.
    
    Args:
        file_path: Path to the JSON file
        data: Data to write
        indent: Indentation level (default: from config)
        sort_keys: Whether to sort keys alphabetically (default: from config)
    """
    file_path.parent.mkdir(parents=True, exist_ok=True)
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(
            data,
            f,
            indent=indent if indent is not None else JSON_INDENT,
            sort_keys=sort_keys if sort_keys is not None else JSON_SORT_KEYS,
            ensure_ascii=JSON_ENSURE_ASCII,
        )
        f.write("\n")  # Add trailing newline


def count_words(text: str) -> int:
    """
    Count words in a text string.
    
    Args:
        text: Text to count words in
    
    Returns:
        Number of words
    """
    return len(text.split())


def truncate_to_word_limit(text: str, max_words: int = MAX_QUOTE_WORDS) -> Tuple[str, bool]:
    """
    Truncate text to a maximum word count.
    
    Args:
        text: Text to truncate
        max_words: Maximum number of words (default: from config)
    
    Returns:
        Tuple of (truncated_text, was_truncated)
    """
    words = text.split()
    if len(words) <= max_words:
        return text, False
    
    truncated = " ".join(words[:max_words]) + "..."
    return truncated, True


def extract_first_sentence(text: str, max_words: Optional[int] = None) -> str:
    """
    Extract the first sentence from text, optionally limiting to max_words.
    
    Args:
        text: Text to extract from
        max_words: Optional word limit
    
    Returns:
        First sentence (possibly truncated)
    """
    # Find first sentence ending
    sentence_endings = [". ", "! ", "? ", ".\n", "!\n", "?\n"]
    
    first_end = len(text)
    for ending in sentence_endings:
        pos = text.find(ending)
        if pos != -1 and pos < first_end:
            first_end = pos + 1
    
    sentence = text[:first_end].strip()
    
    if max_words:
        sentence, _ = truncate_to_word_limit(sentence, max_words)
    
    return sentence


def log_bad_line(
    gate: int,
    line: int,
    source_tried: str,
    reason: str,
    suggestion: Optional[str] = None,
) -> None:
    """
    Log a problematic gate.line to BAD_LINES.md.
    
    Args:
        gate: Gate number (1-64)
        line: Line number (1-6)
        source_tried: Source file that was attempted
        reason: Why extraction failed
        suggestion: Optional suggestion for manual review
    """
    BAD_LINES_FILE.parent.mkdir(parents=True, exist_ok=True)
    
    # Create file with header if it doesn't exist
    if not BAD_LINES_FILE.exists():
        with open(BAD_LINES_FILE, "w", encoding="utf-8") as f:
            f.write("# Bad Lines - Manual Review Queue\n\n")
            f.write("Lines that could not be automatically extracted.\n\n")
            f.write("| Gate.Line | Source Tried | Problem | Suggestion |\n")
            f.write("|-----------|--------------|---------|------------|\n")
    
    # Append entry
    with open(BAD_LINES_FILE, "a", encoding="utf-8") as f:
        suggestion_text = suggestion or "check PDF/EPUB manually"
        f.write(f"| {gate}.{line} | {source_tried} | {reason} | {suggestion_text} |\n")


def validate_gate_number(gate: int) -> bool:
    """
    Validate that a gate number is in valid range.
    
    Args:
        gate: Gate number to validate
    
    Returns:
        True if valid (1-64), False otherwise
    """
    return 1 <= gate <= 64


def validate_line_number(line: int) -> bool:
    """
    Validate that a line number is in valid range.
    
    Args:
        line: Line number to validate
    
    Returns:
        True if valid (1-6), False otherwise
    """
    return 1 <= line <= 6


def normalize_whitespace(text: str) -> str:
    """
    Normalize whitespace in text.
    
    Args:
        text: Text to normalize
    
    Returns:
        Text with normalized whitespace
    """
    # Replace multiple spaces with single space
    text = re.sub(r" +", " ", text)
    # Replace tabs with spaces
    text = text.replace("\t", " ")
    return text.strip()


def detect_ocr_errors(text: str, max_line_length: int = 1500) -> List[str]:
    """
    Detect potential OCR errors in text.
    
    Args:
        text: Text to check
        max_line_length: Maximum expected line length
    
    Returns:
        List of detected issues
    """
    issues = []
    
    lines = text.split("\n")
    for i, line in enumerate(lines, 1):
        if len(line) > max_line_length:
            issues.append(f"Line {i}: Excessive length ({len(line)} chars)")
    
    return issues


def find_best_source(source_paths: List[Path], logger: logging.Logger) -> Optional[Path]:
    """
    Find the first existing source file from a priority list.
    
    Args:
        source_paths: List of paths in priority order
        logger: Logger instance
    
    Returns:
        Path to first existing file, or None if none exist
    """
    for path in source_paths:
        if path.exists():
            logger.info(f"Found source: {path}")
            return path
    
    logger.warning("No source files found")
    return None


def ensure_directory(path: Path) -> None:
    """
    Ensure a directory exists, creating it if necessary.
    
    Args:
        path: Directory path
    """
    path.mkdir(parents=True, exist_ok=True)
