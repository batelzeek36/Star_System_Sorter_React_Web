"""
Configuration file for quote extraction pipeline.

Defines source paths, thresholds, and pipeline settings.
"""

from pathlib import Path

# Base paths
PROJECT_ROOT = Path(__file__).parent.parent.parent
LORE_RESEARCH_ROOT = PROJECT_ROOT / "lore-research"
S3_DATA_ROOT = PROJECT_ROOT / "s3-data"

# Source file paths (in priority order)
# Priority: normalized.txt → djvu.txt → epub → djvu.xml → scandata.xml → abbyy.gz
LINE_COMPANION_SOURCES = [
    LORE_RESEARCH_ROOT / "research-outputs" / "line-companion" / "normalized.txt",
    S3_DATA_ROOT / "Line Companion_djvu.txt",
    S3_DATA_ROOT / "Line Companion.epub",
    S3_DATA_ROOT / "Line Companion_djvu.xml",
    S3_DATA_ROOT / "Line Companion_scandata.xml",
    S3_DATA_ROOT / "Line Companion_abbyy.gz",
]

# I Ching fallback sources
I_CHING_SOURCES = [
    S3_DATA_ROOT / "236066-The I Ching_djvu.txt",
    S3_DATA_ROOT / "236066-The I Ching_page_numbers.json",
]

# Hexagram reference files
HEXAGRAMS_DIR = S3_DATA_ROOT / "hexagrams"

# Other S³ data collections
CHANNELS_DIR = S3_DATA_ROOT / "channels"
CENTERS_DIR = S3_DATA_ROOT / "centers"
CIRCUITS_DIR = S3_DATA_ROOT / "circuits"
LINE_ARCHETYPES_DIR = S3_DATA_ROOT / "line_archetypes"

# Output paths
RESEARCH_OUTPUTS_DIR = LORE_RESEARCH_ROOT / "research-outputs"
GATES_DIR = S3_DATA_ROOT / "gates"
GATES_CANDIDATE_DIR = GATES_DIR / "_candidate"

# Phase 2: Star system correlation paths
STAR_SYSTEM_BASELINES_DIR = LORE_RESEARCH_ROOT / "research-outputs" / "star-systems" / "v4.2"
ASSOCIATIONS_FILE = S3_DATA_ROOT / "associations" / "gate-line-to-star.v2.json"
PIPELINE_RULES_FILE = S3_DATA_ROOT / "pipeline_rules" / "derivation.v1.json"
SOURCES_REGISTRY_FILE = S3_DATA_ROOT / "sources" / "registry.json"

# Line Companion processing outputs
LINE_COMPANION_DIR = RESEARCH_OUTPUTS_DIR / "line-companion"
LINE_COMPANION_NORMALIZED = LINE_COMPANION_DIR / "normalized.txt"
LINE_COMPANION_GATES = LINE_COMPANION_DIR / "gates.json"
LINE_COMPANION_GATES_DIR = LINE_COMPANION_DIR / "gates"  # Individual gate files
LINE_COMPANION_GATE_LINES = LINE_COMPANION_DIR / "gate-lines.json"
LINE_COMPANION_GATE_LINES_XCHECKED = LINE_COMPANION_DIR / "gate-lines-xchecked.json"
LINE_COMPANION_QUOTES = LINE_COMPANION_DIR / "quotes.json"

# Validation and error tracking
BAD_LINES_FILE = RESEARCH_OUTPUTS_DIR / "BAD_LINES.md"
VALIDATION_REPORT = RESEARCH_OUTPUTS_DIR / "VALIDATION_REPORT.v1.json"
HEXAGRAM_VERIFICATION = RESEARCH_OUTPUTS_DIR / "HEXAGRAM_VERIFICATION.json"

# LLM-assisted star mapping outputs
EVIDENCE_DIR = RESEARCH_OUTPUTS_DIR / "evidence"
STAR_MAPS_LLM_DIR = RESEARCH_OUTPUTS_DIR / "star-maps-llm"
STAR_MAPS_CALIBRATED_DIR = RESEARCH_OUTPUTS_DIR / "star-maps-calibrated"
STAR_MAPS_REPORTS_DIR = RESEARCH_OUTPUTS_DIR / "star-maps-reports"

# Pipeline thresholds
MIN_GATES_REQUIRED = 60  # Fail if fewer than 60 gates detected
EXPECTED_GATES = 64
LINES_PER_GATE = 6
MAX_QUOTE_WORDS = 25
MAX_LINE_LENGTH = 1500  # Lines longer than this are likely OCR errors

# OCR normalization settings
MAX_BLANK_LINES = 1  # Collapse 3+ blank lines to this many
OCR_FIX_DICT = {
    # Common OCR errors - can be expanded
    "l ine": "line",
    "G ate": "Gate",
    "HEX AGRAM": "HEXAGRAM",
    "exal tation": "exaltation",
    "detri ment": "detriment",
}

# Gate/Line detection patterns
GATE_HEADING_PATTERNS = [
    r"^(?:Gate|HEXAGRAM)\s+(\d{1,2})",
    r"^Gate\s+(\d{1,2})\s*[-–—]",
    r"^HEXAGRAM\s+(\d{1,2})",
]

LINE_HEADING_PATTERNS = [
    r"Line\s+(\d)",
    r"(\d)(?:st|nd|rd|th)\s+line",
    r"Line\s+(\d)\s*[-–—:]",
    r"The\s+(\d)(?:st|nd|rd|th)\s+line",
]

# Citation metadata
CITATION_AUTHOR_RA = "Ra Uru Hu"
CITATION_WORK_LC = "Line Companion"
CITATION_AUTHOR_LEGGE = "James Legge"
CITATION_WORK_I_CHING = "The I Ching"
CITATION_YEAR_LEGGE = "1899"
FAIR_USE_NOTE = "quote limited to ≤25 words for fair-use alignment"

# JSON formatting
JSON_INDENT = 2
JSON_SORT_KEYS = True
JSON_ENSURE_ASCII = False

# Logging
LOG_LEVEL = "INFO"  # DEBUG, INFO, WARNING, ERROR
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

# ============================================================================
# LEGGE MODE CONFIGURATION (Paraphrase vs Verified)
# ============================================================================
# Controls how Legge I Ching text is handled throughout the pipeline.
# 
# LEGGE_MODE options:
#   "paraphrase" - Use paraphrased Legge from s3-data/hexagrams/*.json (BETA)
#                  Relaxed validation, no strict match/conflict checks
#   "verified"   - Use OCR'd/verified Legge from legge-hx.json
#                  Strict validation, enforce page/leaf locators
#   "repaired"   - Use LLM-repaired Legge from legge-hx.repaired.json
#                  Strict validation with repair metadata
#
# Current mode: "paraphrase" (ship quickly, verify later)
# ============================================================================

LEGGE_MODE = "paraphrase"  # "verified" | "paraphrase" | "repaired"

# Directory containing paraphrased Legge hexagram files (01.json ... 64.json)
LEGGE_PARAPHRASE_DIR = S3_DATA_ROOT / "hexagrams"

# Whether to extract BOTH LC and Legge as parallel sources
# True = extract both sources for every line (recommended for paraphrase mode)
# False = extract only LC (not recommended - loses comparative value)
EXTRACT_BOTH_SOURCES = True

# Whether to require page/leaf locators for Legge citations
# In "paraphrase" mode, this should be False (locators often unavailable)
# In "verified" or "repaired" mode, this should be True
REQUIRE_PAGE_LOCATOR_FOR_LEGGE = False

# Legge source file paths (for verified/repaired modes)
LEGGE_NORMALIZED = S3_DATA_ROOT / "hexagrams" / "legge-normalized.txt"
LEGGE_HX_INDEX = S3_DATA_ROOT / "hexagrams" / "legge-hx.json"
LEGGE_HX_REPAIRED = S3_DATA_ROOT / "hexagrams" / "legge-hx.repaired.json"
LEGGE_PAGE_MAP = S3_DATA_ROOT / "236066-The I Ching_page_numbers.json"

# Get the active Legge index based on mode
def get_legge_index_path():
    """Return the appropriate Legge index file based on LEGGE_MODE."""
    if LEGGE_MODE == "repaired":
        return LEGGE_HX_REPAIRED
    elif LEGGE_MODE == "verified":
        return LEGGE_HX_INDEX
    else:  # paraphrase
        return LEGGE_PARAPHRASE_DIR  # Directory, not single file
