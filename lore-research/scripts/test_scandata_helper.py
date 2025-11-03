#!/usr/bin/env python3
"""
Test script for scandata helper function.
"""

from pathlib import Path
from utils import read_json_file, get_page_by_leaf_num
from config import LINE_COMPANION_DIR


def test_scandata_helper():
    """Test the get_page_by_leaf_num helper function."""
    scandata_path = LINE_COMPANION_DIR / "scandata.json"
    
    if not scandata_path.exists():
        print(f"❌ Scandata file not found: {scandata_path}")
        print("   Run 02a-ingest-lc-scandata.py first")
        return False
    
    # Load scandata
    scandata = read_json_file(scandata_path)
    
    # Test 1: Get first page (leaf 0)
    page0 = get_page_by_leaf_num(scandata, 0)
    if page0 is None:
        print("❌ Failed to get leaf 0")
        return False
    
    print(f"✓ Leaf 0: {page0['origWidth']}x{page0['origHeight']} @ {page0['cropBox']}")
    
    # Test 2: Get a middle page
    page100 = get_page_by_leaf_num(scandata, 100)
    if page100 is None:
        print("❌ Failed to get leaf 100")
        return False
    
    print(f"✓ Leaf 100: {page100['origWidth']}x{page100['origHeight']}")
    
    # Test 3: Get last page (leaf 406 based on leafCount=407)
    page406 = get_page_by_leaf_num(scandata, 406)
    if page406 is None:
        print("❌ Failed to get leaf 406")
        return False
    
    print(f"✓ Leaf 406: {page406['origWidth']}x{page406['origHeight']}")
    
    # Test 4: Try non-existent page
    page999 = get_page_by_leaf_num(scandata, 999)
    if page999 is not None:
        print("❌ Should return None for non-existent leaf")
        return False
    
    print("✓ Correctly returns None for non-existent leaf")
    
    # Test 5: Verify bookData
    book_data = scandata.get("bookData", {})
    print(f"\n✓ Book metadata:")
    print(f"  DPI: {book_data.get('dpi')}")
    print(f"  Leaf count: {book_data.get('leafCount')}")
    print(f"  Book ID: {book_data.get('bookId')}")
    
    # Test 6: Verify cropBox structure
    if "cropBox" in page0:
        crop = page0["cropBox"]
        if all(k in crop for k in ["x", "y", "w", "h"]):
            print(f"\n✓ CropBox structure valid: x={crop['x']}, y={crop['y']}, w={crop['w']}, h={crop['h']}")
        else:
            print("❌ CropBox missing required keys")
            return False
    
    print("\n✅ All tests passed!")
    return True


if __name__ == "__main__":
    success = test_scandata_helper()
    exit(0 if success else 1)
