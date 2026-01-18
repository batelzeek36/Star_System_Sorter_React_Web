"""
Shared utility functions for the Line Companion quote extraction pipeline.

This module provides common functionality for file I/O, logging, validation,
and data processing used across all pipeline stages.
"""

import json
import logging
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Union
from datetime import datetime

from pipeline_config import (
    LOG_LEVEL,
    LOG_FORMAT,
    LINE_COMPANION_SOURCES,
    MAX_QUOTE_WORDS,
)


# ============================================================================
# Logging Setup
# ============================================================================

def setup_logging(name: str, level: str = LOG_LEVEL) -> logging.Logger:
    """
    Set up a logger with consistent formatting.
    
    Args:
        name: Name of the logger (typically __name__)
        level: Logging level (DEBUG, INFO, WARNING, ERROR)
    
    Returns:
        Configured logger instance
    """
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, level))
    
    # Remove existing handlers to avoid duplicates
    logger.handlers.clear()
    
    # Console handler
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(getattr(logging, level))
    formatter = logging.Formatter(LOG_FORMAT)
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    
    return logger


# ============================================================================
# File I/O Functions
# ============================================================================

def read_text_file(file_path: Union[str, Path], encoding: str = "utf-8") -> str:
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
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")
    
    try:
        with open(path, "r", encoding=encoding) as f:
            return f.read()
    except Exception as e:
        raise IOError(f"Error reading file {path}: {e}")


def write_text_file(
    file_path: Union[str, Path],
    content: str,
    encoding: str = "utf-8",
    create_dirs: bool = True
) -> None:
    """
    Write content to a text file.
    
    Args:
        file_path: Path to the file
        content: Content to write
        encoding: File encoding (default: utf-8)
        create_dirs: Create parent directories if they don't exist
    """
    path = Path(file_path)
    
    if create_dirs:
        path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(path, "w", encoding=encoding) as f:
        f.write(content)


def read_json_file(file_path: Union[str, Path]) -> Dict[str, Any]:
    """
    Read a JSON file and return its contents.
    
    Args:
        file_path: Path to the JSON file
    
    Returns:
        Parsed JSON data as dictionary
    
    Raises:
        FileNotFoundError: If file doesn't exist
        json.JSONDecodeError: If file contains invalid JSON
    """
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"JSON file not found: {path}")
    
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def write_json_file(
    file_path: Union[str, Path],
    data: Dict[str, Any],
    create_dirs: bool = True,
    indent: int = 2
) -> None:
    """
    Write data to a JSON file with pretty formatting.
    
    Args:
        file_path: Path to the JSON file
        data: Data to write
        create_dirs: Create parent directories if they don't exist
        indent: JSON indentation level
    """
    path = Path(file_path)
    
    if create_dirs:
        path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=indent, ensure_ascii=False)


def select_best_source(logger: Optional[logging.Logger] = None) -> Optional[Path]:
    """
    Select the best available Line Companion source file based on priority order.
    
    Args:
        logger: Optional logger for recording selection
    
    Returns:
        Path to the selected source file, or None if no sources found
    """
    for source_path in LINE_COMPANION_SOURCES:
        if source_path.exists():
            if logger:
                logger.info(f"Selected source: {source_path.name}")
                logger.info(f"Source priority: {LINE_COMPANION_SOURCES.index(source_path) + 1}/{len(LINE_COMPANION_SOURCES)}")
            return source_path
    
    if logger:
        logger.error("No Line Companion source files found!")
    return None


# ============================================================================
# Validation Functions
# ============================================================================

def count_words(text: str) -> int:
    """
    Count the number of words in a text string.
    
    Args:
        text: Text to count words in
    
    Returns:
        Number of words
    """
    return len(text.split())


def is_valid_quote_length(text: str, max_words: int = MAX_QUOTE_WORDS) -> bool:
    """
    Check if a quote is within the maximum word limit.
    
    Args:
        text: Quote text
        max_words: Maximum allowed words
    
    Returns:
        True if quote is valid length, False otherwise
    """
    return count_words(text) <= max_words


def truncate_to_word_limit(text: str, max_words: int = MAX_QUOTE_WORDS) -> str:
    """
    Truncate text to a maximum number of words, adding ellipsis if needed.
    
    Args:
        text: Text to truncate
        max_words: Maximum number of words
    
    Returns:
        Truncated text with ellipsis if needed
    """
    words = text.split()
    if len(words) <= max_words:
        return text
    
    return " ".join(words[:max_words]) + "..."


def validate_gate_number(gate: Union[int, str]) -> bool:
    """
    Validate that a gate number is in the valid range (1-64).
    
    Args:
        gate: Gate number to validate
    
    Returns:
        True if valid, False otherwise
    """
    try:
        gate_num = int(gate)
        return 1 <= gate_num <= 64
    except (ValueError, TypeError):
        return False


def validate_line_number(line: Union[int, str]) -> bool:
    """
    Validate that a line number is in the valid range (1-6).
    
    Args:
        line: Line number to validate
    
    Returns:
        True if valid, False otherwise
    """
    try:
        line_num = int(line)
        return 1 <= line_num <= 6
    except (ValueError, TypeError):
        return False


# ============================================================================
# Data Processing Functions
# ============================================================================

def normalize_line_endings(text: str) -> str:
    """
    Normalize line endings to Unix style (LF).
    
    Args:
        text: Text with potentially mixed line endings
    
    Returns:
        Text with normalized line endings
    """
    return text.replace("\r\n", "\n").replace("\r", "\n")


def collapse_blank_lines(text: str, max_blank: int = 1) -> str:
    """
    Collapse multiple consecutive blank lines to a maximum number.
    
    Args:
        text: Text with potentially excessive blank lines
        max_blank: Maximum number of consecutive blank lines to keep
    
    Returns:
        Text with collapsed blank lines
    """
    lines = text.split("\n")
    result = []
    blank_count = 0
    
    for line in lines:
        if line.strip() == "":
            blank_count += 1
            if blank_count <= max_blank:
                result.append(line)
        else:
            blank_count = 0
            result.append(line)
    
    return "\n".join(result)


def create_citation_metadata(
    source_file: str,
    gate: int,
    line: int,
    extraction_method: str = "normalized",
    page_or_locator: Optional[str] = None
) -> Dict[str, Any]:
    """
    Create standardized citation metadata for a quote.
    
    Args:
        source_file: Name of the source file used
        gate: Gate number
        line: Line number
        extraction_method: Method used to extract (ocr, normalized, djvu-xml, etc.)
        page_or_locator: Optional page number or locator string
    
    Returns:
        Citation metadata dictionary
    """
    from pipeline_config import (
        CITATION_AUTHOR,
        CITATION_WORK,
        CITATION_USAGE,
        CITATION_NOTE
    )
    
    locator = page_or_locator or f"gate {gate}, line {line}"
    
    return {
        "author": CITATION_AUTHOR,
        "work": CITATION_WORK,
        "source_file": source_file,
        "page_or_locator": locator,
        "extraction_method": extraction_method,
        "usage": CITATION_USAGE,
        "note": CITATION_NOTE
    }


def append_to_bad_lines(
    file_path: Union[str, Path],
    gate: Union[int, str],
    line: Optional[Union[int, str]] = None,
    reason: str = "",
    source_file: Optional[str] = None,
    recommended_source: Optional[str] = None
) -> None:
    """
    Append an entry to the BAD_LINES.md file for manual review.
    
    Args:
        file_path: Path to BAD_LINES.md
        gate: Gate number
        line: Line number (optional)
        reason: Reason for failure
        source_file: Source file that was used
        recommended_source: Recommended source to check manually
    """
    path = Path(file_path)
    
    # Create file with header if it doesn't exist
    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            f.write("# BAD LINES - Manual Review Queue\n\n")
            f.write("Lines that could not be automatically extracted and require manual review.\n\n")
            f.write("| Gate | Line | Reason | Source Used | Recommended Source |\n")
            f.write("|------|------|--------|-------------|--------------------|\n")
    
    # Append entry
    with open(path, "a", encoding="utf-8") as f:
        line_str = str(line) if line is not None else "N/A"
        source_str = source_file or "N/A"
        recommended_str = recommended_source or "PDF/EPUB"
        f.write(f"| {gate} | {line_str} | {reason} | {source_str} | {recommended_str} |\n")


def get_timestamp() -> str:
    """
    Get current timestamp in ISO format.
    
    Returns:
        ISO formatted timestamp string
    """
    return datetime.now().isoformat()


# ============================================================================
# Progress Tracking
# ============================================================================

def log_stage_start(logger: logging.Logger, stage_name: str) -> None:
    """
    Log the start of a pipeline stage.
    
    Args:
        logger: Logger instance
        stage_name: Name of the stage
    """
    logger.info("=" * 80)
    logger.info(f"Starting stage: {stage_name}")
    logger.info("=" * 80)


def log_stage_complete(
    logger: logging.Logger,
    stage_name: str,
    stats: Optional[Dict[str, Any]] = None
) -> None:
    """
    Log the completion of a pipeline stage with optional statistics.
    
    Args:
        logger: Logger instance
        stage_name: Name of the stage
        stats: Optional statistics dictionary
    """
    logger.info("-" * 80)
    logger.info(f"Completed stage: {stage_name}")
    if stats:
        for key, value in stats.items():
            logger.info(f"  {key}: {value}")
    logger.info("-" * 80)
