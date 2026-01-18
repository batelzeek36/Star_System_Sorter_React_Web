#!/usr/bin/env python3
"""
Stage 2.3: Normalize Legge I Ching

Normalizes the Legge I Ching DJVU text export using the same normalization
rules as Line Companion.

Requirements: FR-HX-1, FR-CU-4
"""

import json
import logging
import os
from pathlib import Path
from typing import List, Dict, Any

from config import (
    S3_DATA_ROOT,
    HEXAGRAMS_DIR,
    MAX_LINE_LENGTH,
    OCR_FIX_DICT,
    MAX_BLANK_LINES,
)
from utils import (
    setup_logging,
    read_text_file,
    write_text_file,
    detect_ocr_errors,
    ensure_directory,
)


logger = setup_logging(__name__)

# Legge-specific paths
LEGGE_SOURCE = S3_DATA_ROOT / "236066-The I Ching_djvu.txt"
LEGGE_NORMALIZED = HEXAGRAMS_DIR / "legge-normalized.txt"
LEGGE_CHUNKS_DIR = HEXAGRAMS_DIR / "chunks"
LEGGE_OCR_ISSUES = HEXAGRAMS_DIR / "OCR_ISSUES.md"


class TextNormalizer:
    """
    Normalizes OCR text from Legge I Ching source.
    Reuses same logic as Line Companion normalizer.
    """
    
    def __init__(self, ocr_fix_dict: dict = None):
        """
        Initialize text normalizer.
        
        Args:
            ocr_fix_dict: Dictionary of OCR error patterns to fix
        """
        self.ocr_fix_dict = ocr_fix_dict or OCR_FIX_DICT.copy()
        # Add Legge-specific OCR fixes if needed
        self.ocr_fix_dict.update({
            # Add any Legge-specific patterns here
        })
    
    def normalize(self, text: str) -> str:
        """
        Apply all normalization steps to text.
        
        Args:
            text: Raw text to normalize
        
        Returns:
            Normalized text
        """
        logger.info("Applying normalization steps...")
        
        # Step 1: Normalize line endings (CRLF → LF)
        text = self._normalize_line_endings(text)
        logger.info("  ✓ Normalized line endings")
        
        # Step 2: Apply OCR fixes
        text = self._apply_ocr_fixes(text)
        logger.info(f"  ✓ Applied {len(self.ocr_fix_dict)} OCR fixes")
        
        # Step 3: Collapse excessive blank lines
        text = self._collapse_blank_lines(text)
        logger.info("  ✓ Collapsed excessive blank lines")
        
        # Step 4: Join mid-sentence newlines
        text = self._join_mid_sentence_newlines(text)
        logger.info("  ✓ Joined mid-sentence newlines")
        
        return text
    
    def _normalize_line_endings(self, text: str) -> str:
        """Convert CRLF to LF."""
        return text.replace("\r\n", "\n").replace("\r", "\n")
    
    def _apply_ocr_fixes(self, text: str) -> str:
        """Apply OCR error corrections."""
        for error, fix in self.ocr_fix_dict.items():
            text = text.replace(error, fix)
        return text
    
    def _collapse_blank_lines(self, text: str, max_blank: int = MAX_BLANK_LINES) -> str:
        """Collapse 3+ blank lines to max_blank."""
        import re
        # Replace 3 or more consecutive newlines with max_blank+1 newlines
        pattern = r"\n{3,}"
        replacement = "\n" * (max_blank + 1)
        return re.sub(pattern, replacement, text)
    
    def _join_mid_sentence_newlines(self, text: str) -> str:
        """
        Join lines that were split mid-sentence.
        
        Heuristic: If a line doesn't end with sentence-ending punctuation
        and the next line doesn't start with a capital letter or number,
        join them.
        """
        import re
        lines = text.split("\n")
        result = []
        i = 0
        
        while i < len(lines):
            line = lines[i].strip()
            
            # Empty line - keep as is
            if not line:
                result.append("")
                i += 1
                continue
            
            # Check if this line should be joined with next
            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                
                # Join if:
                # - Current line doesn't end with sentence-ending punctuation
                # - Next line exists and doesn't start with capital/number/special marker
                if (
                    next_line
                    and not re.search(r"[.!?:]\s*$", line)
                    and not re.match(r"^[A-Z0-9]", next_line)
                    and not re.match(r"^(HEXAGRAM|Line|The|Exaltation|Detriment)", next_line)
                ):
                    # Join with space
                    line = line + " " + next_line
                    i += 2
                    result.append(line)
                    continue
            
            result.append(line)
            i += 1
        
        return "\n".join(result)


def write_chunked_outputs(normalized_text: str, chunk_size: int = 500) -> None:
    """
    Write chunked outputs for interactive review.
    
    Args:
        normalized_text: The normalized text content
        chunk_size: Number of lines per chunk (default: 500)
    """
    lines = normalized_text.split("\n")
    total_lines = len(lines)
    chunk_count = (total_lines + chunk_size - 1) // chunk_size  # Ceiling division
    
    logger.info(f"  Creating {chunk_count} chunks ({chunk_size} lines each)...")
    
    ensure_directory(LEGGE_CHUNKS_DIR)
    
    for chunk_idx in range(chunk_count):
        start_line = chunk_idx * chunk_size
        end_line = min(start_line + chunk_size, total_lines)
        chunk_lines = lines[start_line:end_line]
        chunk_text = "\n".join(chunk_lines)
        
        # Format chunk number with leading zeros (e.g., legge-part01.txt)
        chunk_filename = f"legge-part{chunk_idx + 1:02d}.txt"
        chunk_path = LEGGE_CHUNKS_DIR / chunk_filename
        
        write_text_file(chunk_path, chunk_text)
        logger.debug(f"    ✓ {chunk_filename} (lines {start_line + 1}-{end_line})")
    
    logger.info(f"  ✓ Written {chunk_count} chunk files to {LEGGE_CHUNKS_DIR.name}/")


def write_ocr_issues_log(issues: List[str]) -> None:
    """
    Write OCR issues to a markdown log file.
    
    Args:
        issues: List of detected OCR issues
    """
    with open(LEGGE_OCR_ISSUES, "w", encoding="utf-8") as f:
        f.write("# Legge I Ching OCR Issues Log\n\n")
        f.write(f"**Source:** {LEGGE_SOURCE.name}\n")
        f.write(f"**Total Issues Detected:** {len(issues)}\n\n")
        f.write("---\n\n")
        
        if issues:
            f.write("## Detected Issues\n\n")
            for issue in issues:
                f.write(f"- {issue}\n")
        else:
            f.write("No OCR issues detected.\n")
    
    logger.info(f"  ✓ Written OCR issues log: {LEGGE_OCR_ISSUES.name}")


def main():
    """Main execution function."""
    logger.info("=" * 60)
    logger.info("Stage 2.3: Normalize Legge I Ching")
    logger.info("=" * 60)
    logger.info("")
    
    # Step 1: Check if source exists
    if not LEGGE_SOURCE.exists():
        logger.error(f"Source file not found: {LEGGE_SOURCE}")
        logger.error("Cannot proceed without Legge I Ching source")
        return 1
    
    file_size = LEGGE_SOURCE.stat().st_size
    logger.info(f"Source: {LEGGE_SOURCE.name}")
    logger.info(f"Size: {file_size:,} bytes ({file_size / 1024:.1f} KB)")
    logger.info("")
    
    # Step 2: Check if already normalized (idempotent)
    if LEGGE_NORMALIZED.exists():
        logger.info("=" * 60)
        logger.info("NORMALIZED FILE ALREADY EXISTS")
        logger.info("Skipping normalization (idempotent operation)")
        logger.info(f"Using: {LEGGE_NORMALIZED}")
        logger.info("=" * 60)
        return 0
    
    # Step 3: Load source text
    logger.info("Loading source text...")
    try:
        raw_text = read_text_file(LEGGE_SOURCE)
        logger.info(f"  Loaded {len(raw_text):,} characters")
        logger.info(f"  Lines: {raw_text.count(chr(10)):,}")
    except Exception as e:
        logger.error(f"Failed to load source: {e}")
        return 1
    
    # Step 4: Normalize text
    logger.info("")
    normalizer = TextNormalizer()
    normalized_text = normalizer.normalize(raw_text)
    
    # Step 5: Detect OCR errors for logging
    logger.info("")
    logger.info("Detecting OCR errors...")
    ocr_issues = detect_ocr_errors(normalized_text, MAX_LINE_LENGTH)
    if ocr_issues:
        logger.warning(f"  ⚠ Detected {len(ocr_issues)} potential OCR errors")
    else:
        logger.info("  ✓ No OCR errors detected")
    
    # Step 6: Write output files
    logger.info("")
    logger.info("Writing output files...")
    ensure_directory(LEGGE_NORMALIZED.parent)
    
    # Main normalized file
    write_text_file(LEGGE_NORMALIZED, normalized_text)
    output_size = LEGGE_NORMALIZED.stat().st_size
    logger.info(f"  ✓ Written to: {LEGGE_NORMALIZED}")
    logger.info(f"    Size: {output_size:,} bytes ({output_size / 1024:.1f} KB)")
    
    # OCR issues log
    write_ocr_issues_log(ocr_issues)
    
    # Chunked outputs (always create for Legge)
    logger.info("")
    logger.info("Creating chunked outputs...")
    write_chunked_outputs(normalized_text, chunk_size=500)
    
    # Step 7: Log summary
    logger.info("")
    logger.info("=" * 60)
    logger.info("NORMALIZATION COMPLETE")
    logger.info("=" * 60)
    logger.info(f"Source: {LEGGE_SOURCE.name}")
    logger.info(f"Output: {LEGGE_NORMALIZED.name}")
    logger.info(f"Chunks: {LEGGE_CHUNKS_DIR.name}/")
    logger.info(f"Characters: {len(normalized_text):,}")
    logger.info(f"Lines: {normalized_text.count(chr(10)):,}")
    if ocr_issues:
        logger.info(f"OCR Issues: {len(ocr_issues)} detected (see {LEGGE_OCR_ISSUES.name})")
    logger.info("=" * 60)
    
    return 0


if __name__ == "__main__":
    exit(main())
