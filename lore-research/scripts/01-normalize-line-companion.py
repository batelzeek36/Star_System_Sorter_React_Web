#!/usr/bin/env python3
"""
Stage 1: Text Normalization

Selects the best available Line Companion source and normalizes OCR text.

Requirements: FR-LC-1, FR-LC-2
"""

import gzip
import json
import logging
import os
from pathlib import Path
from typing import Optional, List, Dict, Any

from config import (
    LINE_COMPANION_SOURCES,
    LINE_COMPANION_NORMALIZED,
    MAX_LINE_LENGTH,
    OCR_FIX_DICT,
    MAX_BLANK_LINES,
    RESEARCH_OUTPUTS_DIR,
)
from utils import (
    setup_logging,
    read_text_file,
    write_text_file,
    detect_ocr_errors,
    ensure_directory,
    write_json_file,
)


logger = setup_logging(__name__)


class SourceSelector:
    """
    Selects the best available Line Companion source with detailed logging.
    
    Implements priority order: normalized.txt → djvu.txt → epub → 
    djvu.xml → scandata.xml → abbyy.gz
    """
    
    def __init__(self, source_paths: list[Path]):
        """
        Initialize source selector.
        
        Args:
            source_paths: List of source paths in priority order
        """
        self.source_paths = source_paths
        self.selected_source: Optional[Path] = None
        self.source_offset: Optional[int] = None
        self.selection_reason: Optional[str] = None
    
    def select_source(self) -> Optional[Path]:
        """
        Select the best available source file.
        
        Returns:
            Path to selected source, or None if no sources available
        """
        logger.info("=" * 60)
        logger.info("SOURCE FILE SELECTION")
        logger.info("=" * 60)
        
        # Check each source in priority order
        for priority, source_path in enumerate(self.source_paths, 1):
            logger.info(f"Priority {priority}: Checking {source_path.name}")
            
            if not source_path.exists():
                logger.info(f"  ✗ File not found: {source_path}")
                continue
            
            # Check file size
            file_size = source_path.stat().st_size
            if file_size == 0:
                logger.warning(f"  ✗ File is empty: {source_path}")
                continue
            
            # File exists and has content
            logger.info(f"  ✓ File found: {source_path}")
            logger.info(f"    Size: {file_size:,} bytes ({file_size / 1024:.1f} KB)")
            
            # Determine selection reason based on priority
            if priority == 1:
                reason = "normalized file already exists (preferred source)"
            elif priority == 2:
                reason = "djvu.txt selected (OCR text format)"
            elif priority == 3:
                reason = "epub selected (structured format)"
            elif priority == 4:
                reason = "djvu.xml selected (XML format)"
            elif priority == 5:
                reason = "scandata.xml selected (metadata fallback)"
            else:
                reason = "abbyy.gz selected (compressed OCR, last resort)"
            
            self.selected_source = source_path
            self.selection_reason = reason
            self.source_offset = 0  # Will be updated during processing if needed
            
            logger.info("")
            logger.info("SELECTION RESULT:")
            logger.info(f"  Selected: {source_path.name}")
            logger.info(f"  Reason: {reason}")
            logger.info(f"  Full path: {source_path}")
            logger.info("=" * 60)
            
            return source_path
        
        # No sources found
        logger.error("=" * 60)
        logger.error("NO SOURCE FILES AVAILABLE")
        logger.error("Checked all priority sources:")
        for i, path in enumerate(self.source_paths, 1):
            logger.error(f"  {i}. {path}")
        logger.error("=" * 60)
        
        return None
    
    def get_source_metadata(self) -> dict:
        """
        Get metadata about the selected source.
        
        Returns:
            Dictionary with source_file, source_offset, and selection_reason
        """
        return {
            "source_file": str(self.selected_source.name) if self.selected_source else None,
            "source_path": str(self.selected_source) if self.selected_source else None,
            "source_offset": self.source_offset,
            "selection_reason": self.selection_reason,
        }


class TextNormalizer:
    """
    Normalizes OCR text from Line Companion sources.
    """
    
    def __init__(self, ocr_fix_dict: dict = None):
        """
        Initialize text normalizer.
        
        Args:
            ocr_fix_dict: Dictionary of OCR error patterns to fix
        """
        self.ocr_fix_dict = ocr_fix_dict or OCR_FIX_DICT
    
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
                    and not re.match(r"^(Gate|Line|HEXAGRAM|Exaltation|Detriment)", next_line)
                ):
                    # Join with space
                    line = line + " " + next_line
                    i += 2
                    result.append(line)
                    continue
            
            result.append(line)
            i += 1
        
        return "\n".join(result)


def load_source_text(source_path: Path) -> str:
    """
    Load text from source file, handling different formats.
    
    Args:
        source_path: Path to source file
    
    Returns:
        Text content
    
    Raises:
        ValueError: If file format is not supported
    """
    suffix = source_path.suffix.lower()
    
    if suffix == ".txt":
        return read_text_file(source_path)
    
    elif suffix == ".gz":
        # Handle gzipped files (like abbyy.gz)
        with gzip.open(source_path, "rt", encoding="utf-8") as f:
            return f.read()
    
    elif suffix == ".epub":
        # For MVP, we'll treat epub as unsupported and require manual extraction
        # In Phase 2, could use ebooklib
        raise ValueError(
            f"EPUB format requires manual extraction. "
            f"Please extract text from {source_path.name} and save as .txt"
        )
    
    elif suffix == ".xml":
        # For MVP, we'll read XML as text
        # In Phase 2, could parse XML structure
        return read_text_file(source_path)
    
    else:
        raise ValueError(f"Unsupported file format: {suffix}")


def write_index_file(normalized_text: str, source_metadata: Dict[str, Any]) -> None:
    """
    Write companion index file with metadata for LLM-assisted review.
    
    Args:
        normalized_text: The normalized text content
        source_metadata: Metadata about the source file
    """
    lines = normalized_text.split("\n")
    total_lines = len(lines)
    
    # Generate sample offsets (every 100 lines for review)
    sample_offsets = []
    for i in range(0, total_lines, 100):
        if i < total_lines:
            sample_offsets.append({
                "line_number": i + 1,
                "preview": lines[i][:80] + "..." if len(lines[i]) > 80 else lines[i]
            })
    
    index_data = {
        "source_file": source_metadata["source_file"],
        "source_path": source_metadata["source_path"],
        "selection_reason": source_metadata["selection_reason"],
        "total_lines": total_lines,
        "total_characters": len(normalized_text),
        "sample_offsets": sample_offsets[:20],  # Limit to first 20 samples
        "note": "Sample offsets provided for LLM-assisted review"
    }
    
    index_path = LINE_COMPANION_NORMALIZED.parent / "line-companion-normalized.index.json"
    write_json_file(index_path, index_data)
    logger.info(f"  ✓ Written index file: {index_path.name}")


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
    
    for chunk_idx in range(chunk_count):
        start_line = chunk_idx * chunk_size
        end_line = min(start_line + chunk_size, total_lines)
        chunk_lines = lines[start_line:end_line]
        chunk_text = "\n".join(chunk_lines)
        
        # Format chunk number with leading zeros (e.g., normalized-part01.txt)
        chunk_filename = f"normalized-part{chunk_idx + 1:02d}.txt"
        chunk_path = LINE_COMPANION_NORMALIZED.parent / chunk_filename
        
        write_text_file(chunk_path, chunk_text)
        logger.info(f"    ✓ {chunk_filename} (lines {start_line + 1}-{end_line})")


def write_ocr_issues_log(issues: List[str], source_metadata: Dict[str, Any]) -> None:
    """
    Write OCR issues to a markdown log file.
    
    Args:
        issues: List of detected OCR issues
        source_metadata: Metadata about the source file
    """
    ocr_issues_path = RESEARCH_OUTPUTS_DIR / "OCR_ISSUES.md"
    
    with open(ocr_issues_path, "w", encoding="utf-8") as f:
        f.write("# OCR Issues Log\n\n")
        f.write(f"**Source:** {source_metadata['source_file']}\n")
        f.write(f"**Reason:** {source_metadata['selection_reason']}\n\n")
        f.write(f"**Total Issues Detected:** {len(issues)}\n\n")
        f.write("---\n\n")
        
        if issues:
            f.write("## Detected Issues\n\n")
            for issue in issues:
                f.write(f"- {issue}\n")
        else:
            f.write("No OCR issues detected.\n")
    
    logger.info(f"  ✓ Written OCR issues log: {ocr_issues_path.name}")


def main():
    """Main execution function."""
    logger.info("Starting Line Companion normalization (Stage 1)")
    logger.info("")
    
    # Step 1: Select source
    selector = SourceSelector(LINE_COMPANION_SOURCES)
    source_path = selector.select_source()
    
    if not source_path:
        logger.error("Cannot proceed without source file")
        return 1
    
    # Get source metadata for logging
    source_metadata = selector.get_source_metadata()
    
    # Step 2: Check if we're using already-normalized file
    if source_path == LINE_COMPANION_NORMALIZED:
        logger.info("")
        logger.info("=" * 60)
        logger.info("NORMALIZED FILE ALREADY EXISTS")
        logger.info("Skipping normalization (idempotent operation)")
        logger.info(f"Using: {LINE_COMPANION_NORMALIZED}")
        logger.info("=" * 60)
        return 0
    
    # Step 3: Load source text
    logger.info("")
    logger.info("Loading source text...")
    try:
        raw_text = load_source_text(source_path)
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
    ensure_directory(LINE_COMPANION_NORMALIZED.parent)
    
    # Main normalized file
    write_text_file(LINE_COMPANION_NORMALIZED, normalized_text)
    output_size = LINE_COMPANION_NORMALIZED.stat().st_size
    logger.info(f"  ✓ Written to: {LINE_COMPANION_NORMALIZED}")
    logger.info(f"    Size: {output_size:,} bytes ({output_size / 1024:.1f} KB)")
    
    # Index file
    write_index_file(normalized_text, source_metadata)
    
    # OCR issues log
    write_ocr_issues_log(ocr_issues, source_metadata)
    
    # Chunked outputs (if requested via env var)
    chunk_normalized = os.environ.get("CHUNK_NORMALIZED", "0")
    if chunk_normalized == "1":
        logger.info("")
        logger.info("CHUNK_NORMALIZED=1 detected, creating chunked outputs...")
        write_chunked_outputs(normalized_text, chunk_size=500)
    
    # Step 7: Log summary
    logger.info("")
    logger.info("=" * 60)
    logger.info("NORMALIZATION COMPLETE")
    logger.info("=" * 60)
    logger.info(f"Source: {source_metadata['source_file']}")
    logger.info(f"Reason: {source_metadata['selection_reason']}")
    logger.info(f"Output: {LINE_COMPANION_NORMALIZED.name}")
    logger.info(f"Characters: {len(normalized_text):,}")
    logger.info(f"Lines: {normalized_text.count(chr(10)):,}")
    if ocr_issues:
        logger.info(f"OCR Issues: {len(ocr_issues)} detected (see OCR_ISSUES.md)")
    logger.info("=" * 60)
    
    return 0


if __name__ == "__main__":
    exit(main())
