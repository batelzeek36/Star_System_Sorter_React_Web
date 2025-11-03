#!/usr/bin/env python3
"""
Stage 1b: Second-pass cleaner for LC normalized text

Removes page headers/footers and applies stronger cleaning rules
to the already-normalized Line Companion text.

Requirements: FR-LC-2, FR-VQ-2
"""

import logging
import re
from pathlib import Path
from typing import List

from config import (
    LINE_COMPANION_DIR,
    LINE_COMPANION_NORMALIZED,
    OCR_FIX_DICT,
)
from utils import (
    setup_logging,
    read_text_file,
    write_text_file,
    ensure_directory,
)


logger = setup_logging(__name__)


# Extended OCR fixes specific to Line Companion
LC_SPECIFIC_OCR_FIXES = {
    "lMe": "We",
    "Vie": "We",
    "V*stern": "Western",
    "i. e.": "i.e.",
    "i .e.": "i.e.",
    "i.e .": "i.e.",
    " i.e. ": " i.e. ",  # Ensure proper spacing around i.e.
}


class SecondPassCleaner:
    """
    Second-pass cleaner for normalized Line Companion text.
    
    Removes page headers/footers and applies stronger mid-sentence joining.
    """
    
    def __init__(self, ocr_fixes: dict = None):
        """
        Initialize cleaner.
        
        Args:
            ocr_fixes: Dictionary of OCR error patterns to fix
        """
        # Merge base OCR fixes with LC-specific fixes
        self.ocr_fixes = {**OCR_FIX_DICT, **LC_SPECIFIC_OCR_FIXES}
        if ocr_fixes:
            self.ocr_fixes.update(ocr_fixes)
        
        # Page header patterns to remove
        self.page_patterns = [
            r"^Page\s+\d+\s*$",           # "Page 1"
            r"^Page\s+\d+/\s*$",          # "Page 1/"
            r"^Page\s+\d+\s+$",           # "Page 1 " (with trailing space)
            r"^Page\s+\d+\s*[A-Z□]\s*$",  # "Page 1 C", "Page 2C", "Page 4 □"
        ]
    
    def clean(self, text: str) -> str:
        """
        Apply all cleaning steps to text.
        
        Args:
            text: Normalized text to clean
        
        Returns:
            Cleaned text
        """
        logger.info("Applying second-pass cleaning...")
        
        # Step 1: Remove page headers/footers
        text = self._remove_page_headers(text)
        logger.info(f"  ✓ Removed page headers/footers")
        
        # Step 2: Apply extended OCR fixes
        text = self._apply_ocr_fixes(text)
        logger.info(f"  ✓ Applied {len(self.ocr_fixes)} OCR fixes (including LC-specific)")
        
        # Step 3: Apply stronger mid-sentence joining
        text = self._join_mid_sentence_stronger(text)
        logger.info("  ✓ Applied stronger mid-sentence joining")
        
        return text
    
    def _remove_page_headers(self, text: str) -> str:
        """
        Remove page headers/footers matching patterns.
        
        Removes lines like:
        - "Page 1"
        - "Page 1/"
        - "Page 1 " (with trailing space)
        """
        lines = text.split("\n")
        cleaned_lines = []
        removed_count = 0
        
        for line in lines:
            # Check if line matches any page pattern
            is_page_header = False
            for pattern in self.page_patterns:
                if re.match(pattern, line):
                    is_page_header = True
                    removed_count += 1
                    break
            
            if not is_page_header:
                cleaned_lines.append(line)
        
        logger.info(f"    Removed {removed_count} page headers")
        return "\n".join(cleaned_lines)
    
    def _apply_ocr_fixes(self, text: str) -> str:
        """Apply OCR error corrections."""
        for error, fix in self.ocr_fixes.items():
            text = text.replace(error, fix)
        return text
    
    def _join_mid_sentence_stronger(self, text: str) -> str:
        """
        Apply stronger mid-sentence joining logic.
        
        Join lines if:
        - Current line ends with lowercase letter, comma, or semicolon
        - Next line starts with lowercase letter
        - Not a special marker line (Gate, Line, HEXAGRAM, etc.)
        """
        lines = text.split("\n")
        result = []
        i = 0
        joined_count = 0
        
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
                
                # Skip if next line is empty
                if not next_line:
                    result.append(line)
                    i += 1
                    continue
                
                # Check if next line is a special marker (don't join these)
                if re.match(r"^(Gate|Line|HEXAGRAM|Exaltation|Detriment|Page)", next_line):
                    result.append(line)
                    i += 1
                    continue
                
                # Join if:
                # - Current line ends with lowercase, comma, or semicolon
                # - Next line starts with lowercase
                current_ends_joinable = re.search(r"[a-z,;]\s*$", line)
                next_starts_lowercase = re.match(r"^[a-z]", next_line)
                
                if current_ends_joinable and next_starts_lowercase:
                    # Join with space
                    line = line + " " + next_line
                    i += 2
                    joined_count += 1
                    result.append(line)
                    continue
            
            result.append(line)
            i += 1
        
        logger.info(f"    Joined {joined_count} mid-sentence breaks")
        return "\n".join(result)


def process_file(input_path: Path, output_path: Path, cleaner: SecondPassCleaner) -> None:
    """
    Process a single file through the cleaner.
    
    Args:
        input_path: Path to input file
        output_path: Path to output file
        cleaner: SecondPassCleaner instance
    """
    logger.info(f"Processing: {input_path.name}")
    
    # Read input
    text = read_text_file(input_path)
    input_lines = text.count("\n")
    logger.info(f"  Input: {len(text):,} chars, {input_lines:,} lines")
    
    # Clean
    cleaned_text = cleaner.clean(text)
    output_lines = cleaned_text.count("\n")
    logger.info(f"  Output: {len(cleaned_text):,} chars, {output_lines:,} lines")
    
    # Write output
    write_text_file(output_path, cleaned_text)
    logger.info(f"  ✓ Written to: {output_path.name}")


def main():
    """Main execution function."""
    logger.info("Starting second-pass cleaning of Line Companion normalized text")
    logger.info("")
    
    # Check if normalized.txt exists
    if not LINE_COMPANION_NORMALIZED.exists():
        logger.error(f"Normalized file not found: {LINE_COMPANION_NORMALIZED}")
        logger.error("Please run 01-normalize-line-companion.py first")
        return 1
    
    # Initialize cleaner
    cleaner = SecondPassCleaner()
    
    # Process main normalized.txt
    logger.info("=" * 60)
    logger.info("PROCESSING MAIN NORMALIZED FILE")
    logger.info("=" * 60)
    
    output_main = LINE_COMPANION_DIR / "normalized.clean.txt"
    process_file(LINE_COMPANION_NORMALIZED, output_main, cleaner)
    
    # Find all normalized-partNN.txt files
    logger.info("")
    logger.info("=" * 60)
    logger.info("PROCESSING CHUNKED FILES")
    logger.info("=" * 60)
    
    part_files = sorted(LINE_COMPANION_DIR.glob("normalized-part*.txt"))
    
    if not part_files:
        logger.info("No chunked files found (normalized-partNN.txt)")
        logger.info("This is OK - chunked files are optional")
    else:
        logger.info(f"Found {len(part_files)} chunked files")
        logger.info("")
        
        for part_file in part_files:
            # Extract part number from filename (e.g., "normalized-part01.txt" -> "01")
            match = re.search(r"normalized-part(\d+)\.txt", part_file.name)
            if match:
                part_num = match.group(1)
                output_part = LINE_COMPANION_DIR / f"normalized.clean-part{part_num}.txt"
                process_file(part_file, output_part, cleaner)
                logger.info("")
    
    # Summary
    logger.info("=" * 60)
    logger.info("SECOND-PASS CLEANING COMPLETE")
    logger.info("=" * 60)
    logger.info(f"Main output: {output_main.name}")
    if part_files:
        logger.info(f"Chunked outputs: {len(part_files)} files (normalized.clean-partNN.txt)")
    logger.info("")
    logger.info("Original normalized files preserved for provenance")
    logger.info("=" * 60)
    
    return 0


if __name__ == "__main__":
    exit(main())
