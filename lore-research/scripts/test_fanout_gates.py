#!/usr/bin/env python3
"""
Test script for 03-fanout-gates.py

Verifies that gate fanout produces correct output structure.
"""

import json
from pathlib import Path

from config import LINE_COMPANION_GATES_DIR, EXPECTED_GATES


def test_fanout_gates():
    """Test that all gate files were created with correct structure."""
    
    print("Testing gate fanout output...")
    
    # Check that output directory exists
    assert LINE_COMPANION_GATES_DIR.exists(), f"Output directory not found: {LINE_COMPANION_GATES_DIR}"
    print(f"✓ Output directory exists: {LINE_COMPANION_GATES_DIR}")
    
    # Check that all 64 gate files exist
    gate_files = list(LINE_COMPANION_GATES_DIR.glob("gate-*.json"))
    assert len(gate_files) == EXPECTED_GATES, f"Expected {EXPECTED_GATES} gate files, found {len(gate_files)}"
    print(f"✓ All {EXPECTED_GATES} gate files exist")
    
    # Check structure of each gate file
    required_keys = {"gate", "title", "raw_text", "lines", "_meta"}
    required_meta_keys = {"source", "extracted_from", "created_at"}
    
    for gate_num in range(1, EXPECTED_GATES + 1):
        gate_file = LINE_COMPANION_GATES_DIR / f"gate-{gate_num:02d}.json"
        
        # Read gate file
        with open(gate_file, "r") as f:
            gate_data = json.load(f)
        
        # Check required keys
        assert set(gate_data.keys()) >= required_keys, \
            f"Gate {gate_num} missing required keys: {required_keys - set(gate_data.keys())}"
        
        # Check gate number matches
        assert gate_data["gate"] == gate_num, \
            f"Gate {gate_num} has incorrect gate number: {gate_data['gate']}"
        
        # Check _meta structure
        assert set(gate_data["_meta"].keys()) >= required_meta_keys, \
            f"Gate {gate_num} _meta missing required keys: {required_meta_keys - set(gate_data['_meta'].keys())}"
        
        # Check that lines is an empty dict (will be populated by next stage)
        assert gate_data["lines"] == {}, \
            f"Gate {gate_num} lines should be empty dict, got: {gate_data['lines']}"
        
        # Check that raw_text exists and is non-empty
        assert isinstance(gate_data["raw_text"], str), \
            f"Gate {gate_num} raw_text should be string"
        assert len(gate_data["raw_text"]) > 0, \
            f"Gate {gate_num} has empty raw_text"
    
    print(f"✓ All {EXPECTED_GATES} gate files have correct structure")
    
    # Check a few specific gates for page_hint
    gates_with_page_hint = 0
    for gate_num in [1, 10, 27, 64]:
        gate_file = LINE_COMPANION_GATES_DIR / f"gate-{gate_num:02d}.json"
        with open(gate_file, "r") as f:
            gate_data = json.load(f)
        
        if "page_hint" in gate_data["_meta"]:
            gates_with_page_hint += 1
            page_hint = gate_data["_meta"]["page_hint"]
            assert "leaf_start" in page_hint, f"Gate {gate_num} page_hint missing leaf_start"
            assert "leaf_end" in page_hint, f"Gate {gate_num} page_hint missing leaf_end"
            assert "dpi" in page_hint, f"Gate {gate_num} page_hint missing dpi"
    
    print(f"✓ {gates_with_page_hint}/4 sampled gates have page_hint metadata")
    
    print("\n✅ All tests passed!")


if __name__ == "__main__":
    test_fanout_gates()
