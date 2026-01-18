"""
Configuration file for the Line Companion quote extraction pipeline.

This file defines all source paths, output paths, and processing thresholds
used throughout the pipeline stages.
"""

import os
from pathlib import Path

# Base directories
PROJECT_ROOT = Path(__file__).parent.parent.parent
LORE_RESEARCH = PROJECT_ROOT / "lore-research"
S3_DATA = PROJECT_ROOT / "s3-data"

# Source file paths (in priority order)
LINE_COMPANION_SOURCES = [
    LORE_RESEARCH / "research-outputs" / "line-companion-normalized.txt",
    S3_DATA / "Line Companion_djvu.txt",
    S3_DATA / "Line Companion.epub",
    S3_DATA / "Line Companion_abbyy.gz",
    S3_DATA / "Line Companion_djvu.xml",
    S3_DATA / "Line Companion_scandata.xml",
]

# I Ching fallback source
I_CHING_SOURCE = S3_DATA / "236066-The I Ching_djvu.txt"

# Output directories
RESEARCH_OUTPUTS = LORE_RESEARCH / "research-outputs"
GATE_CANDIDATE_DIR = S3_DATA / "gates" / "_candidate"

# Intermediate output files
NORMALIZED_OUTPUT = RESEARCH_OUTPUTS / "line-companion-normalized.txt"
GATES_OUTPUT = RESEARCH_OUTPUTS / "line-companion-gates.json"
GATE_LINES_OUTPUT = RESEARCH_OUTPUTS / "line-companion-gate-lines.json"
GATE_LINES_XCHECKED_OUTPUT = RESEARCH_OUTPUTS / "line-companion-gate-lines-xchecked.json"
QUOTES_OUTPUT = RESEARCH_OUTPUTS / "line-companion-quotes.json"
BAD_LINES_OUTPUT = RESEARCH_OUTPUTS / "BAD_LINES.md"
VALIDATION_REPORT_OUTPUT = RESEARCH_OUTPUTS / "VALIDATION_REPORT.v1.json"

# Hexagram files directory
HEXAGRAMS_DIR = S3_DATA / "hexagrams"

# Gate files directory
GATES_DIR = S3_DATA / "gates"

# Processing thresholds
MAX_LINE_LENGTH = 1500  # Lines longer than this are flagged as potential OCR errors
MIN_GATES_REQUIRED = 60  # Minimum number of gates that must be detected
EXPECTED_GATES = 64  # Expected number of gates
LINES_PER_GATE = 6  # Expected number of lines per gate
MAX_QUOTE_WORDS = 25  # Maximum words allowed in quotes

# OCR normalization settings
MAX_BLANK_LINES = 1  # Collapse 3+ blank lines to this many
OCR_FIX_DICT = {
    # Common OCR errors - can be expanded as needed
    "Iine": "line",
    "Iines": "lines",
    "Gate l": "Gate 1",
    "Gate I": "Gate 1",
    "—": "–",  # Normalize dashes
    """: '"',  # Normalize quotes
    """: '"',
    "'": "'",
    "'": "'",
}

# Citation metadata
CITATION_AUTHOR = "Ra Uru Hu"
CITATION_WORK = "Line Companion"
CITATION_USAGE = "research/education"
CITATION_NOTE = "quote limited to <=25 words for fair-use alignment"

# Validation settings
MIN_COVERAGE_PERCENT = 95  # Minimum percentage of lines that should have valid quotes

# Logging settings
LOG_LEVEL = "INFO"  # DEBUG, INFO, WARNING, ERROR
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
