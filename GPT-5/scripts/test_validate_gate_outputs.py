#!/usr/bin/env python3
"""
Test suite for validate_gate_outputs.py

Tests all validation rules with intentional violations to ensure
the validator catches errors correctly.
"""

import json
import tempfile
from pathlib import Path
import sys

# Import validation functions
sys.path.insert(0, str(Path(__file__).parent))
from validate_gate_outputs import (
    validate_top2_constraint,
    validate_pairwise_exclusions,
    validate_legge_gating,
    validate_weight_precision,
    validate_canonical_names,
    validate_key_format,
    validate_sorting,
    validate_sparse_format,
    validate_sum_unorm,
    CANONICAL_SYSTEMS
)


def test_top2_constraint():
    """Test top-2 constraint validation."""
    print("Testing top-2 constraint...")
    
    # Valid: 1 primary
    weights = {
        "_meta": {"gate": "01"},
        "01.1": [
            {"star_system": "Lyra", "weight": 0.75, "role": "primary"}
        ]
    }
    errors = validate_top2_constraint(weights)
    assert len(errors) == 0, f"Expected no errors, got: {errors}"
    
    # Valid: 1 primary + 1 secondary
    weights = {
        "_meta": {"gate": "01"},
        "01.1": [
            {"star_system": "Lyra", "weight": 0.75, "role": "primary"},
            {"star_system": "Sirius", "weight": 0.25, "role": "secondary"}
        ]
    }
    errors = validate_top2_constraint(weights)
    assert len(errors) == 0, f"Expected no errors, got: {errors}"
    
    # Invalid: 3 systems (top-2 violation)
    weights = {
        "_meta": {"gate": "01"},
        "01.1": [
            {"star_system": "Lyra", "weight": 0.75, "role": "primary"},
            {"star_system": "Sirius", "weight": 0.25, "role": "secondary"},
            {"star_system": "Pleiades", "weight": 0.15, "role": "secondary"}
        ]
    }
    errors = validate_top2_constraint(weights)
    assert len(errors) > 0, "Expected top-2 violation error"
    assert "Top-2 violation" in errors[0]
    
    # Invalid: 2 primaries
    weights = {
        "_meta": {"gate": "01"},
        "01.1": [
            {"star_system": "Lyra", "weight": 0.75, "role": "primary"},
            {"star_system": "Sirius", "weight": 0.75, "role": "primary"}
        ]
    }
    errors = validate_top2_constraint(weights)
    assert len(errors) > 0, "Expected multiple primary error"
    assert "exactly 1 primary" in errors[0]
    
    # Invalid: primary weight <= secondary weight
    weights = {
        "_meta": {"gate": "01"},
        "01.1": [
            {"star_system": "Lyra", "weight": 0.25, "role": "primary"},
            {"star_system": "Sirius", "weight": 0.75, "role": "secondary"}
        ]
    }
    errors = validate_top2_constraint(weights)
    assert len(errors) > 0, "Expected weight ordering error"
    assert "Primary weight" in errors[0] and "must be >" in errors[0]
    
    print("  ✓ Top-2 constraint tests passed")


def test_pairwise_exclusions():
    """Test pairwise exclusion rules."""
    print("Testing pairwise exclusions...")
    
    # Valid: Pleiades without Draco
    weights = {
        "_meta": {"gate": "01"},
        "01.1": [
            {"star_system": "Pleiades", "weight": 0.75, "role": "primary"}
        ]
    }
    errors = validate_pairwise_exclusions(weights)
    assert len(errors) == 0, f"Expected no errors, got: {errors}"
    
    # Invalid: Pleiades + Draco
    weights = {
        "_meta": {"gate": "01"},
        "01.1": [
            {"star_system": "Pleiades", "weight": 0.75, "role": "primary"},
            {"star_system": "Draco", "weight": 0.25, "role": "secondary"}
        ]
    }
    errors = validate_pairwise_exclusions(weights)
    assert len(errors) > 0, "Expected Pleiades/Draco exclusion error"
    assert "Pleiades" in errors[0] and "Draco" in errors[0]
    
    # Invalid: Sirius ≥0.60 + Orion Light >0.35
    weights = {
        "_meta": {"gate": "01"},
        "01.1": [
            {"star_system": "Sirius", "weight": 0.65, "role": "primary"},
            {"star_system": "Orion Light", "weight": 0.40, "role": "secondary"}
        ]
    }
    errors = validate_pairwise_exclusions(weights)
    assert len(errors) > 0, "Expected Sirius/Orion Light cap error"
    assert "Sirius" in errors[0] and "Orion Light" in errors[0]
    
    # Valid: Sirius ≥0.60 + Orion Light ≤0.35
    weights = {
        "_meta": {"gate": "01"},
        "01.1": [
            {"star_system": "Sirius", "weight": 0.65, "role": "primary"},
            {"star_system": "Orion Light", "weight": 0.35, "role": "secondary"}
        ]
    }
    errors = validate_pairwise_exclusions(weights)
    assert len(errors) == 0, f"Expected no errors, got: {errors}"
    
    # Invalid: Both Orion factions >0.35
    weights = {
        "_meta": {"gate": "01"},
        "01.1": [
            {"star_system": "Orion Light", "weight": 0.75, "role": "primary"},
            {"star_system": "Orion Dark", "weight": 0.40, "role": "secondary"}
        ]
    }
    errors = validate_pairwise_exclusions(weights)
    assert len(errors) > 0, "Expected Orion faction conflict error"
    assert "Orion faction conflict" in errors[0]
    
    print("  ✓ Pairwise exclusion tests passed")


def test_canonical_names():
    """Test canonical name validation."""
    print("Testing canonical names...")
    
    # Valid: exact canonical name
    weights = {
        "_meta": {"gate": "01"},
        "01.1": [
            {"star_system": "Orion Light", "weight": 0.75, "role": "primary"}
        ]
    }
    errors = validate_canonical_names(weights)
    assert len(errors) == 0, f"Expected no errors, got: {errors}"
    
    # Invalid: wrong case
    weights = {
        "_meta": {"gate": "01"},
        "01.1": [
            {"star_system": "orion light", "weight": 0.75, "role": "primary"}
        ]
    }
    errors = validate_canonical_names(weights)
    assert len(errors) > 0, "Expected case error"
    assert "Non-canonical" in errors[0] or "Invalid" in errors[0]
    
    # Invalid: hyphen instead of space
    weights = {
        "_meta": {"gate": "01"},
        "01.1": [
            {"star_system": "Orion-Light", "weight": 0.75, "role": "primary"}
        ]
    }
    errors = validate_canonical_names(weights)
    assert len(errors) > 0, "Expected spacing error"
    
    # Invalid: completely wrong name
    weights = {
        "_meta": {"gate": "01"},
        "01.1": [
            {"star_system": "Betelgeuse", "weight": 0.75, "role": "primary"}
        ]
    }
    errors = validate_canonical_names(weights)
    assert len(errors) > 0, "Expected invalid name error"
    
    print("  ✓ Canonical name tests passed")


def test_key_format():
    """Test key format validation."""
    print("Testing key format...")
    
    # Valid: NN.L format
    weights = {
        "_meta": {"gate": "01"},
        "01.1": [{"star_system": "Lyra", "weight": 0.75, "role": "primary"}],
        "01.2": [{"star_system": "Sirius", "weight": 0.65, "role": "primary"}]
    }
    errors = validate_key_format(weights)
    assert len(errors) == 0, f"Expected no errors, got: {errors}"
    
    # Invalid: wrong gate number
    weights = {
        "_meta": {"gate": "01"},
        "02.1": [{"star_system": "Lyra", "weight": 0.75, "role": "primary"}]
    }
    errors = validate_key_format(weights)
    assert len(errors) > 0, "Expected gate mismatch error"
    assert "gate mismatch" in errors[0].lower()
    
    # Invalid: line number out of range
    weights = {
        "_meta": {"gate": "01"},
        "01.7": [{"star_system": "Lyra", "weight": 0.75, "role": "primary"}]
    }
    errors = validate_key_format(weights)
    assert len(errors) > 0, "Expected line range error"
    assert "must be 1-6" in errors[0]
    
    # Invalid: wrong format
    weights = {
        "_meta": {"gate": "01"},
        "1.1": [{"star_system": "Lyra", "weight": 0.75, "role": "primary"}]
    }
    errors = validate_key_format(weights)
    assert len(errors) > 0, "Expected format error"
    
    print("  ✓ Key format tests passed")


def test_sparse_format():
    """Test sparse format validation."""
    print("Testing sparse format...")
    
    # Valid: only non-zero weights
    weights = {
        "_meta": {"gate": "01"},
        "01.1": [
            {"star_system": "Lyra", "weight": 0.75, "role": "primary"}
        ]
    }
    errors = validate_sparse_format(weights)
    assert len(errors) == 0, f"Expected no errors, got: {errors}"
    
    # Invalid: zero weight present
    weights = {
        "_meta": {"gate": "01"},
        "01.1": [
            {"star_system": "Lyra", "weight": 0.75, "role": "primary"},
            {"star_system": "Sirius", "weight": 0.0, "role": "secondary"}
        ]
    }
    errors = validate_sparse_format(weights)
    assert len(errors) > 0, "Expected sparse format error"
    assert "Sparse format violation" in errors[0]
    assert "weight 0.0" in errors[0]
    
    print("  ✓ Sparse format tests passed")


def test_sum_unorm():
    """Test sum_unorm validation."""
    print("Testing sum_unorm...")
    
    # Valid: sum matches
    weights = {
        "_meta": {"gate": "01", "sum_unorm": 1.50},
        "01.1": [
            {"star_system": "Lyra", "weight": 0.75, "role": "primary"}
        ],
        "01.2": [
            {"star_system": "Sirius", "weight": 0.75, "role": "primary"}
        ]
    }
    errors = validate_sum_unorm(weights)
    assert len(errors) == 0, f"Expected no errors, got: {errors}"
    
    # Invalid: sum mismatch
    weights = {
        "_meta": {"gate": "01", "sum_unorm": 2.00},
        "01.1": [
            {"star_system": "Lyra", "weight": 0.75, "role": "primary"}
        ],
        "01.2": [
            {"star_system": "Sirius", "weight": 0.75, "role": "primary"}
        ]
    }
    errors = validate_sum_unorm(weights)
    assert len(errors) > 0, "Expected sum mismatch error"
    assert "sum_unorm mismatch" in errors[0]
    
    # Invalid: missing sum_unorm
    weights = {
        "_meta": {"gate": "01"},
        "01.1": [
            {"star_system": "Lyra", "weight": 0.75, "role": "primary"}
        ]
    }
    errors = validate_sum_unorm(weights)
    assert len(errors) > 0, "Expected missing sum_unorm error"
    assert "Missing sum_unorm" in errors[0]
    
    print("  ✓ Sum unorm tests passed")


def test_weight_precision():
    """Test weight precision validation."""
    print("Testing weight precision...")
    
    # Valid: multiples of 0.01
    weights = {
        "_meta": {"gate": "01"},
        "01.1": [
            {"star_system": "Lyra", "weight": 0.75, "role": "primary"}
        ]
    }
    errors = validate_weight_precision(weights)
    assert len(errors) == 0, f"Expected no errors, got: {errors}"
    
    # Invalid: not a multiple of 0.01
    weights = {
        "_meta": {"gate": "01"},
        "01.1": [
            {"star_system": "Lyra", "weight": 0.753, "role": "primary"}
        ]
    }
    errors = validate_weight_precision(weights)
    assert len(errors) > 0, "Expected precision error"
    assert "precision error" in errors[0].lower()
    
    print("  ✓ Weight precision tests passed")


def test_sorting():
    """Test sorting and tie-breaking validation."""
    print("Testing sorting and tie-breaking...")
    
    # Valid: sorted by weight descending
    weights = {
        "_meta": {"gate": "01"},
        "01.1": [
            {"star_system": "Lyra", "weight": 0.75, "role": "primary"},
            {"star_system": "Sirius", "weight": 0.25, "role": "secondary"}
        ]
    }
    errors = validate_sorting(weights)
    assert len(errors) == 0, f"Expected no errors, got: {errors}"
    
    # Invalid: wrong weight order
    weights = {
        "_meta": {"gate": "01"},
        "01.1": [
            {"star_system": "Sirius", "weight": 0.25, "role": "secondary"},
            {"star_system": "Lyra", "weight": 0.75, "role": "primary"}
        ]
    }
    errors = validate_sorting(weights)
    assert len(errors) > 0, "Expected sorting error"
    assert "not sorted by weight" in errors[0].lower()
    
    # Valid: tie-breaking by canonical order (Pleiades before Sirius)
    weights = {
        "_meta": {"gate": "01"},
        "01.1": [
            {"star_system": "Pleiades", "weight": 0.50, "role": "primary"},
            {"star_system": "Sirius", "weight": 0.50, "role": "secondary"}
        ]
    }
    errors = validate_sorting(weights)
    assert len(errors) == 0, f"Expected no errors, got: {errors}"
    
    # Invalid: tie-breaking order wrong (Sirius before Pleiades when equal)
    weights = {
        "_meta": {"gate": "01"},
        "01.1": [
            {"star_system": "Sirius", "weight": 0.50, "role": "primary"},
            {"star_system": "Pleiades", "weight": 0.50, "role": "secondary"}
        ]
    }
    errors = validate_sorting(weights)
    assert len(errors) > 0, "Expected tie-breaking error"
    assert "Tie-breaking order violated" in errors[0]
    
    print("  ✓ Sorting and tie-breaking tests passed")


def main():
    """Run all tests."""
    print("Running validation tests...\n")
    
    try:
        test_top2_constraint()
        test_pairwise_exclusions()
        test_canonical_names()
        test_key_format()
        test_sparse_format()
        test_sum_unorm()
        test_weight_precision()
        test_sorting()
        
        print("\n✓ All validation tests PASSED")
        return 0
    except AssertionError as e:
        print(f"\n✗ Test FAILED: {e}")
        return 1
    except Exception as e:
        print(f"\n✗ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return 2


if __name__ == "__main__":
    sys.exit(main())
