#!/usr/bin/env python3
"""
Unit tests for fuzz_invariants.py

Tests the invariant testing logic with synthetic data.
"""

import json
import sys
from pathlib import Path
from fuzz_invariants import InvariantTester


def test_pleiades_draco_exclusion():
    """Test Pleiades/Draco mutual exclusion."""
    tester = InvariantTester()
    
    # Valid: Pleiades present, Draco absent
    sys_weights = {"Pleiades": 0.75, "Sirius": 0.25}
    passed, msg = tester.test_pairwise_exclusion(
        "01", "01.1", sys_weights, "Pleiades", "Draco", 0.0, None
    )
    assert passed, "Should pass when Pleiades present and Draco absent"
    
    # Invalid: Both present
    sys_weights = {"Pleiades": 0.75, "Draco": 0.25}
    passed, msg = tester.test_pairwise_exclusion(
        "01", "01.1", sys_weights, "Pleiades", "Draco", 0.0, None
    )
    assert not passed, "Should fail when both Pleiades and Draco present"
    assert "Pleiades > 0.0 requires Draco = 0" in msg
    
    print("✓ Pleiades/Draco exclusion tests passed")


def test_sirius_orion_light_cap():
    """Test Sirius/Orion Light threshold cap."""
    tester = InvariantTester()
    
    # Valid: Sirius high, Orion Light low
    sys_weights = {"Sirius": 0.75, "Orion Light": 0.25}
    passed, msg = tester.test_pairwise_exclusion(
        "01", "01.2", sys_weights, "Sirius", "Orion Light", 0.60, 0.35
    )
    assert passed, "Should pass when Sirius ≥ 0.60 and Orion Light ≤ 0.35"
    
    # Invalid: Sirius high, Orion Light too high
    sys_weights = {"Sirius": 0.75, "Orion Light": 0.45}
    passed, msg = tester.test_pairwise_exclusion(
        "01", "01.2", sys_weights, "Sirius", "Orion Light", 0.60, 0.35
    )
    assert not passed, "Should fail when Sirius ≥ 0.60 and Orion Light > 0.35"
    assert "Sirius ≥ 0.6 requires Orion Light ≤ 0.35" in msg
    
    # Valid: Sirius below threshold
    sys_weights = {"Sirius": 0.55, "Orion Light": 0.45}
    passed, msg = tester.test_pairwise_exclusion(
        "01", "01.2", sys_weights, "Sirius", "Orion Light", 0.60, 0.35
    )
    assert passed, "Should pass when Sirius < 0.60 (rule doesn't apply)"
    
    print("✓ Sirius/Orion Light cap tests passed")


def test_orion_faction_conflict():
    """Test Orion Light/Dark faction conflict."""
    tester = InvariantTester()
    
    # Valid: Only one faction present
    sys_weights = {"Orion Light": 0.75, "Sirius": 0.25}
    passed, msg = tester.test_orion_faction_conflict("01", "01.3", sys_weights)
    assert passed, "Should pass when only Orion Light present"
    
    # Valid: Both present but one ≤ 0.35
    sys_weights = {"Orion Light": 0.75, "Orion Dark": 0.25}
    passed, msg = tester.test_orion_faction_conflict("01", "01.3", sys_weights)
    assert passed, "Should pass when one faction ≤ 0.35"
    
    # Invalid: Both > 0.35
    sys_weights = {"Orion Light": 0.75, "Orion Dark": 0.45}
    passed, msg = tester.test_orion_faction_conflict("01", "01.3", sys_weights)
    assert not passed, "Should fail when both factions > 0.35"
    assert "Orion faction conflict" in msg
    
    print("✓ Orion faction conflict tests passed")


def test_andromeda_orion_dark_exclusion():
    """Test Andromeda/Orion Dark exclusion."""
    tester = InvariantTester()
    
    # Valid: Andromeda high, Orion Dark absent
    sys_weights = {"Andromeda": 0.75, "Sirius": 0.25}
    passed, msg = tester.test_pairwise_exclusion(
        "01", "01.4", sys_weights, "Andromeda", "Orion Dark", 0.60, 0.0
    )
    assert passed, "Should pass when Andromeda ≥ 0.60 and Orion Dark = 0"
    
    # Invalid: Andromeda high, Orion Dark present
    sys_weights = {"Andromeda": 0.75, "Orion Dark": 0.25}
    passed, msg = tester.test_pairwise_exclusion(
        "01", "01.4", sys_weights, "Andromeda", "Orion Dark", 0.60, 0.0
    )
    assert not passed, "Should fail when Andromeda ≥ 0.60 and Orion Dark > 0"
    assert "Andromeda ≥ 0.6 requires Orion Dark ≤ 0.0" in msg
    
    # Valid: Andromeda below threshold
    sys_weights = {"Andromeda": 0.55, "Orion Dark": 0.45}
    passed, msg = tester.test_pairwise_exclusion(
        "01", "01.4", sys_weights, "Andromeda", "Orion Dark", 0.60, 0.0
    )
    assert passed, "Should pass when Andromeda < 0.60 (rule doesn't apply)"
    
    print("✓ Andromeda/Orion Dark exclusion tests passed")


def test_arcturus_pleiades_exclusion():
    """Test Arcturus/Pleiades mutual exclusion."""
    tester = InvariantTester()
    
    # Valid: Arcturus present, Pleiades absent
    sys_weights = {"Arcturus": 0.75, "Sirius": 0.25}
    passed, msg = tester.test_pairwise_exclusion(
        "01", "01.5", sys_weights, "Arcturus", "Pleiades", 0.0, 0.0
    )
    assert passed, "Should pass when Arcturus present and Pleiades absent"
    
    # Invalid: Both present
    sys_weights = {"Arcturus": 0.75, "Pleiades": 0.25}
    passed, msg = tester.test_pairwise_exclusion(
        "01", "01.5", sys_weights, "Arcturus", "Pleiades", 0.0, 0.0
    )
    assert not passed, "Should fail when both Arcturus and Pleiades present"
    assert "Arcturus > 0.0 requires Pleiades ≤ 0.0" in msg
    
    print("✓ Arcturus/Pleiades exclusion tests passed")


def test_lyra_draco_exclusion():
    """Test Lyra/Draco mutual exclusion."""
    tester = InvariantTester()
    
    # Valid: Lyra present, Draco absent
    sys_weights = {"Lyra": 0.75, "Sirius": 0.25}
    passed, msg = tester.test_pairwise_exclusion(
        "01", "01.6", sys_weights, "Lyra", "Draco", 0.0, None
    )
    assert passed, "Should pass when Lyra present and Draco absent"
    
    # Invalid: Both present
    sys_weights = {"Lyra": 0.75, "Draco": 0.25}
    passed, msg = tester.test_pairwise_exclusion(
        "01", "01.6", sys_weights, "Lyra", "Draco", 0.0, None
    )
    assert not passed, "Should fail when both Lyra and Draco present"
    assert "Lyra > 0.0 requires Draco = 0" in msg
    
    print("✓ Lyra/Draco exclusion tests passed")


def main():
    """Run all tests."""
    print("Running invariant fuzz tester unit tests...")
    print()
    
    try:
        test_pleiades_draco_exclusion()
        test_sirius_orion_light_cap()
        test_orion_faction_conflict()
        test_andromeda_orion_dark_exclusion()
        test_arcturus_pleiades_exclusion()
        test_lyra_draco_exclusion()
        
        print()
        print("=" * 80)
        print("✓ ALL TESTS PASSED")
        print("=" * 80)
        return 0
        
    except AssertionError as e:
        print()
        print("=" * 80)
        print(f"✗ TEST FAILED: {e}")
        print("=" * 80)
        return 1
    except Exception as e:
        print()
        print("=" * 80)
        print(f"✗ ERROR: {e}")
        print("=" * 80)
        return 1


if __name__ == "__main__":
    sys.exit(main())
