#!/usr/bin/env python3
"""
02a-ingest-lc-scandata.py

Ingest Line Companion scan metadata from scandata.xml and convert to JSON.

Reads:
  - s3-data/Line Companion_scandata.xml

Writes:
  - lore-research/research-outputs/line-companion/scandata.json

Provides helper to map leafNum → image dimensions and crop box.
"""

import json
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Dict, Any, Optional

from utils import setup_logging, write_json_file
from config import PROJECT_ROOT, S3_DATA_ROOT, LINE_COMPANION_DIR


logger = setup_logging(__name__)


def parse_scandata_xml(xml_path: Path) -> Dict[str, Any]:
    """
    Parse Line Companion scandata.xml file.
    
    Args:
        xml_path: Path to scandata.xml
    
    Returns:
        Dictionary with parsed metadata
    """
    logger.info(f"Parsing scandata XML: {xml_path}")
    
    tree = ET.parse(xml_path)
    root = tree.getroot()
    
    # Parse bookData
    book_data_elem = root.find("bookData")
    if book_data_elem is None:
        raise ValueError("Missing <bookData> element in scandata.xml")
    
    dpi_elem = book_data_elem.find("dpi")
    leaf_count_elem = book_data_elem.find("leafCount")
    book_id_elem = book_data_elem.find("bookId")
    
    book_data = {
        "dpi": int(dpi_elem.text) if dpi_elem is not None else None,
        "leafCount": int(leaf_count_elem.text) if leaf_count_elem is not None else None,
        "bookId": book_id_elem.text if book_id_elem is not None else None,
    }
    
    logger.info(f"Book metadata: DPI={book_data['dpi']}, leafCount={book_data['leafCount']}")
    
    # Parse pageData
    page_data_elem = root.find("pageData")
    if page_data_elem is None:
        raise ValueError("Missing <pageData> element in scandata.xml")
    
    pages = {}
    for page_elem in page_data_elem.findall("page"):
        leaf_num_attr = page_elem.get("leafNum")
        if leaf_num_attr is None:
            continue
        
        leaf_num = int(leaf_num_attr)
        
        # Parse page metadata
        page_type_elem = page_elem.find("pageType")
        orig_width_elem = page_elem.find("origWidth")
        orig_height_elem = page_elem.find("origHeight")
        
        page_info = {
            "leafNum": leaf_num,
            "pageType": page_type_elem.text if page_type_elem is not None else None,
            "origWidth": int(orig_width_elem.text) if orig_width_elem is not None else None,
            "origHeight": int(orig_height_elem.text) if orig_height_elem is not None else None,
        }
        
        # Parse cropBox if present
        crop_box_elem = page_elem.find("cropBox")
        if crop_box_elem is not None:
            x_elem = crop_box_elem.find("x")
            y_elem = crop_box_elem.find("y")
            w_elem = crop_box_elem.find("w")
            h_elem = crop_box_elem.find("h")
            
            page_info["cropBox"] = {
                "x": int(x_elem.text) if x_elem is not None else 0,
                "y": int(y_elem.text) if y_elem is not None else 0,
                "w": int(w_elem.text) if w_elem is not None else page_info["origWidth"],
                "h": int(h_elem.text) if h_elem is not None else page_info["origHeight"],
            }
        
        # Check for bookStart marker
        book_start_elem = page_elem.find("bookStart")
        if book_start_elem is not None:
            page_info["bookStart"] = book_start_elem.text.lower() == "true"
        
        pages[str(leaf_num)] = page_info
    
    logger.info(f"Parsed {len(pages)} pages")
    
    return {
        "bookData": book_data,
        "pages": pages,
        "_meta": {
            "source": "s3-data/Line Companion_scandata.xml",
            "total_pages": len(pages),
        }
    }


def get_page_by_leaf_num(scandata: Dict[str, Any], leaf_num: int) -> Optional[Dict[str, Any]]:
    """
    Helper function to retrieve page metadata by leaf number.
    
    Args:
        scandata: Parsed scandata dictionary
        leaf_num: Leaf number to look up
    
    Returns:
        Page metadata dictionary or None if not found
    """
    return scandata.get("pages", {}).get(str(leaf_num))


def main():
    """Main execution function."""
    # Input path
    scandata_xml_path = S3_DATA_ROOT / "Line Companion_scandata.xml"
    
    if not scandata_xml_path.exists():
        logger.error(f"Scandata XML not found: {scandata_xml_path}")
        return 1
    
    # Output path
    LINE_COMPANION_DIR.mkdir(parents=True, exist_ok=True)
    output_path = LINE_COMPANION_DIR / "scandata.json"
    
    try:
        # Parse XML
        scandata = parse_scandata_xml(scandata_xml_path)
        
        # Write JSON
        write_json_file(output_path, scandata)
        logger.info(f"✓ Wrote scandata to: {output_path}")
        
        # Log summary
        book_data = scandata["bookData"]
        logger.info(f"Summary:")
        logger.info(f"  DPI: {book_data['dpi']}")
        logger.info(f"  Total leaves: {book_data['leafCount']}")
        logger.info(f"  Pages parsed: {len(scandata['pages'])}")
        
        return 0
        
    except Exception as e:
        logger.error(f"Failed to process scandata: {e}", exc_info=True)
        return 1


if __name__ == "__main__":
    exit(main())
