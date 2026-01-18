#!/usr/bin/env python3
"""
Validate gate.line weight and evidence files with mechanical invariants.

This script enforces all structural and business rules for v4.2 scoring:
- Top-2 constraint (exactly 1 primary, optional 1 secondary per line)
- Pairwise exclusions (Pleiades/Draco, Sirius/Orion-Light, etc.)
- Legge-gating (weight >0.50 requires same-line Legge quote)
- Role/polarity separation
- Canonical ordering and formatting

Usage:
    python validate_gate_outputs.py GATE_NUMBER
    python validate_gate_outputs.py 01
"""

import argparse
import json
import sys
from pathlib import Path
from typing import Dict, List, Tuple, Set

try:
    import jsonschema
    from jsonschema import validate, ValidationError
except ImportError:
    print("ERROR: jsonschema package not installed", file=sys.stderr)
    print("Install with: pip install jsonschema", file=sys.stderr)
    sys.exit(1)


CANONICAL_SYSTEMS = [
    "Pleiades", "Sirius", "Lyra", "Andromeda",
    "Orion Light", "Orion Dark", "Arcturus", "Draco"
]

PAIRWISE_EXCLUSIONS = [
    ("Pleiades", "Draco", 0.0, None),  # If Pleiades > 0 → Draco = 0
    ("Sirius", "Orion Light", 0.60, 0.35),  # If Sirius ≥ 0.60 → Orion Light ≤ 0.35
    ("Andromeda", "Orion Dark", 0.60, 0.0),  # If Andromeda ≥ 0.60 → Orion Dark = 0
    ("Arcturus", "Pleiades", 0.0, 0.0),  # If Arcturus > 0 → Pleiades = 0
    ("Lyra", "Draco", 0.0, None),  # If Lyra > 0 → Draco = 0
]


class ValidationError(Exception):
    """Custom validation error."""
    pass


def load_json(path: Path) -> Dict:
    """Load JSON file."""
    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def validate_schema(data: Dict, schema: Dict, file_type: str) -> List[str]:
    """Validate against JSON schema."""
    errors = []
    try:
        jsonschema.validate(instance=data, schema=schema)
    except jsonschema.ValidationError as e:
        errors.append(f"{file_type} schema validation failed: {e.message}")
        if e.path:
            errors.append(f"  Path: {' -> '.join(str(p) for p in e.path)}")
    return errors


def validate_top2_constraint(weights: Dict) -> List[str]:
    """Enforce top-2 constraint: exactly 1 primary, optional 1 secondary per line."""
    errors = []
    
    for line_key in sorted([k for k in weights.keys() if k != "_meta"]):
        systems = weights[line_key]
        
        if not isinstance(systems, list):
            errors.append(f"{line_key}: Expected array, got {type(systems).__name__}")
            continue
        
        if len(systems) > 2:
            errors.append(f"{line_key}: Top-2 violation - found {len(systems)} systems (max 2)")
            continue
        
        # Count roles
        primary_count = sum(1 for s in systems if s.get("role") == "primary")
        secondary_count = sum(1 for s in systems if s.get("role") == "secondary")
        
        if primary_count != 1:
            errors.append(f"{line_key}: Must have exactly 1 primary, found {primary_count}")
        
        if secondary_count > 1:
            errors.append(f"{line_key}: Must have ≤1 secondary, found {secondary_count}")
        
        # Verify primary has highest weight
        if len(systems) == 2:
            primary_sys = next((s for s in systems if s.get("role") == "primary"), None)
            secondary_sys = next((s for s in systems if s.get("role") == "secondary"), None)
            
            if primary_sys and secondary_sys:
                if primary_sys["weight"] <= secondary_sys["weight"]:
                    errors.append(
                        f"{line_key}: Primary weight ({primary_sys['weight']}) must be > "
                        f"secondary weight ({secondary_sys['weight']})"
                    )
    
    return errors


def validate_pairwise_exclusions(weights: Dict) -> List[str]:
    """Enforce pairwise exclusion rules."""
    errors = []
    
    for line_key in sorted([k for k in weights.keys() if k != "_meta"]):
        systems = weights[line_key]
        
        if not isinstance(systems, list):
            continue
        
        # Build system weight map
        sys_weights = {s["star_system"]: s["weight"] for s in systems}
        
        # Check each exclusion rule
        for sys_a, sys_b, threshold_a, max_b in PAIRWISE_EXCLUSIONS:
            weight_a = sys_weights.get(sys_a, 0.0)
            weight_b = sys_weights.get(sys_b, 0.0)
            
            if threshold_a is None:
                threshold_a = 0.0
            
            # Use > for zero thresholds, >= for non-zero thresholds
            threshold_met = weight_a >= threshold_a if threshold_a > 0 else weight_a > threshold_a
            
            if threshold_met:
                if max_b is None:
                    # Must be 0
                    if weight_b > 0.0:
                        op = "≥" if threshold_a > 0 else ">"
                        errors.append(
                            f"{line_key}: Pairwise exclusion violated - "
                            f"{sys_a} {op} {threshold_a} requires {sys_b} = 0, "
                            f"but {sys_b} = {weight_b}"
                        )
                else:
                    # Must be ≤ max_b
                    if weight_b > max_b:
                        op = "≥" if threshold_a > 0 else ">"
                        errors.append(
                            f"{line_key}: Pairwise exclusion violated - "
                            f"{sys_a} {op} {threshold_a} requires {sys_b} ≤ {max_b}, "
                            f"but {sys_b} = {weight_b}"
                        )
        
        # Check Orion faction conflict
        orion_light_weight = sys_weights.get("Orion Light", 0.0)
        orion_dark_weight = sys_weights.get("Orion Dark", 0.0)
        
        if orion_light_weight > 0 and orion_dark_weight > 0:
            # Both present - one should be ≤ 0.35 or 0
            if orion_light_weight > 0.35 and orion_dark_weight > 0.35:
                errors.append(
                    f"{line_key}: Orion faction conflict - both Light ({orion_light_weight}) "
                    f"and Dark ({orion_dark_weight}) > 0.35; one should be down-ranked"
                )
    
    return errors


def validate_legge_gating(weights: Dict, evidence: Dict) -> List[str]:
    """Enforce Legge-gating: weight >0.50 requires same-line Legge quote."""
    errors = []
    
    for line_key in sorted([k for k in weights.keys() if k != "_meta"]):
        systems = weights[line_key]
        
        if not isinstance(systems, list):
            continue
        
        for sys in systems:
            weight = sys.get("weight", 0.0)
            star_system = sys.get("star_system")
            
            if weight > 0.50:
                # Must have Legge quote in evidence for this line
                evidence_entries = evidence.get(line_key, [])
                
                # Find evidence for this system
                sys_evidence = next(
                    (e for e in evidence_entries if e.get("star_system") == star_system),
                    None
                )
                
                if not sys_evidence:
                    errors.append(
                        f"{line_key}: Legge-gating violated - {star_system} weight {weight} > 0.50 "
                        f"but no evidence entry found"
                    )
                    continue
                
                legge_quote = sys_evidence.get("sources", {}).get("legge1899", {}).get("quote", "")
                
                if not legge_quote or len(legge_quote.strip()) == 0:
                    errors.append(
                        f"{line_key}: Legge-gating violated - {star_system} weight {weight} > 0.50 "
                        f"but Legge quote is empty"
                    )
    
    return errors


def validate_weight_precision(weights: Dict) -> List[str]:
    """Ensure all weights are multiples of 0.01."""
    errors = []
    
    for line_key in sorted([k for k in weights.keys() if k != "_meta"]):
        systems = weights[line_key]
        
        if not isinstance(systems, list):
            continue
        
        for sys in systems:
            weight = sys.get("weight", 0.0)
            
            # Check if weight is multiple of 0.01 (allowing for float precision)
            rounded = round(weight * 100) / 100
            if abs(weight - rounded) > 0.001:
                errors.append(
                    f"{line_key}: Weight precision error - {sys.get('star_system')} "
                    f"weight {weight} is not a multiple of 0.01"
                )
    
    return errors


def validate_polarity_presence(weights: Dict) -> List[str]:
    """Require polarity when weight ≥ 0.40."""
    errors = []
    
    for line_key in sorted([k for k in weights.keys() if k != "_meta"]):
        systems = weights[line_key]
        
        if not isinstance(systems, list):
            continue
        
        for sys in systems:
            weight = sys.get("weight", 0.0)
            polarity = sys.get("polarity")
            
            if weight >= 0.40 and not polarity:
                errors.append(
                    f"{line_key}: {sys.get('star_system')} weight {weight} ≥ 0.40 "
                    f"requires polarity field"
                )
    
    return errors


def validate_canonical_names(weights: Dict) -> List[str]:
    """Validate all star system names use exact canonical format."""
    errors = []
    
    for line_key in sorted([k for k in weights.keys() if k != "_meta"]):
        systems = weights[line_key]
        
        if not isinstance(systems, list):
            continue
        
        for sys in systems:
            star_system = sys.get("star_system", "")
            
            if star_system not in CANONICAL_SYSTEMS:
                # Find closest match for helpful error message
                closest = None
                star_lower = star_system.lower()
                for canonical in CANONICAL_SYSTEMS:
                    if canonical.lower() == star_lower:
                        closest = canonical
                        break
                
                if closest:
                    errors.append(
                        f"{line_key}: Non-canonical system name '{star_system}' "
                        f"(should be '{closest}' with exact case and spacing)"
                    )
                else:
                    errors.append(
                        f"{line_key}: Invalid system name '{star_system}' "
                        f"(must be one of: {', '.join(CANONICAL_SYSTEMS)})"
                    )
    
    return errors


def validate_key_format(weights: Dict) -> List[str]:
    """Validate line keys follow NN.L format (zero-padded gate, dot, line 1-6)."""
    errors = []
    
    gate_num = weights.get("_meta", {}).get("gate", "")
    
    for line_key in [k for k in weights.keys() if k != "_meta"]:
        # Check format: NN.L where NN is zero-padded gate, L is 1-6
        if not line_key or len(line_key) != 4:
            errors.append(f"Invalid key format '{line_key}' (expected 'NN.L' format)")
            continue
        
        parts = line_key.split(".")
        if len(parts) != 2:
            errors.append(f"Invalid key format '{line_key}' (expected 'NN.L' with dot separator)")
            continue
        
        gate_part, line_part = parts
        
        # Validate gate part matches metadata
        if gate_part != gate_num:
            errors.append(
                f"Key gate mismatch '{line_key}' (gate part '{gate_part}' "
                f"doesn't match metadata gate '{gate_num}')"
            )
        
        # Validate line part is 1-6
        if not line_part.isdigit() or int(line_part) < 1 or int(line_part) > 6:
            errors.append(
                f"Invalid line number in '{line_key}' (must be 1-6, got '{line_part}')"
            )
    
    return errors


def validate_sorting(weights: Dict) -> List[str]:
    """Validate line keys are sorted and systems within lines are sorted."""
    errors = []
    
    # Check line keys are sorted
    line_keys = [k for k in weights.keys() if k != "_meta"]
    sorted_keys = sorted(line_keys)
    
    if line_keys != sorted_keys:
        errors.append(f"Line keys not sorted: {line_keys} should be {sorted_keys}")
    
    # Check systems within each line are sorted by weight desc, then canonical order
    for line_key in line_keys:
        systems = weights[line_key]
        
        if not isinstance(systems, list) or len(systems) <= 1:
            continue
        
        # Check weight descending
        weights_list = [s.get("weight", 0.0) for s in systems]
        if weights_list != sorted(weights_list, reverse=True):
            errors.append(
                f"{line_key}: Systems not sorted by weight descending: {weights_list}"
            )
        
        # Check tie-breaking: if weights are equal, use canonical order
        for i in range(len(systems) - 1):
            curr_sys = systems[i]
            next_sys = systems[i + 1]
            curr_weight = curr_sys.get("weight", 0.0)
            next_weight = next_sys.get("weight", 0.0)
            
            if abs(curr_weight - next_weight) < 0.001:  # Equal weights (within float precision)
                curr_name = curr_sys.get("star_system", "")
                next_name = next_sys.get("star_system", "")
                
                try:
                    curr_idx = CANONICAL_SYSTEMS.index(curr_name)
                    next_idx = CANONICAL_SYSTEMS.index(next_name)
                    
                    if curr_idx > next_idx:
                        errors.append(
                            f"{line_key}: Tie-breaking order violated - "
                            f"{curr_name} (weight {curr_weight}) should come after "
                            f"{next_name} (weight {next_weight}) in canonical order"
                        )
                except ValueError:
                    # Invalid system name, will be caught by canonical name validation
                    pass
    
    return errors


def validate_sparse_format(weights: Dict) -> List[str]:
    """Verify sparse format: only non-zero weights present."""
    errors = []
    
    for line_key in sorted([k for k in weights.keys() if k != "_meta"]):
        systems = weights[line_key]
        
        if not isinstance(systems, list):
            continue
        
        for sys in systems:
            weight = sys.get("weight", 0.0)
            star_system = sys.get("star_system", "")
            
            if weight == 0.0:
                errors.append(
                    f"{line_key}: Sparse format violation - {star_system} has weight 0.0 "
                    f"(should be omitted from output)"
                )
    
    return errors


def validate_sum_unorm(weights: Dict) -> List[str]:
    """Verify sum_unorm equals sum of all non-zero weights across all 6 lines."""
    errors = []
    
    declared_sum = weights.get("_meta", {}).get("sum_unorm")
    
    if declared_sum is None:
        errors.append("Missing sum_unorm in _meta block")
        return errors
    
    # Compute actual sum
    actual_sum = 0.0
    for line_key in [k for k in weights.keys() if k != "_meta"]:
        systems = weights[line_key]
        
        if not isinstance(systems, list):
            continue
        
        for sys in systems:
            weight = sys.get("weight", 0.0)
            actual_sum += weight
    
    # Round to 2 decimal places for comparison (accounting for float precision)
    actual_sum = round(actual_sum, 2)
    declared_sum = round(declared_sum, 2)
    
    if abs(actual_sum - declared_sum) > 0.01:
        errors.append(
            f"sum_unorm mismatch: declared {declared_sum}, "
            f"but sum of all weights = {actual_sum}"
        )
    
    return errors


def validate_beacon_match(weights: Dict, evidence: Dict, expected_beacon: str) -> List[str]:
    """Validate baseline_beacon matches expected value."""
    errors = []
    
    weights_beacon = weights.get("_meta", {}).get("baseline_beacon")
    evidence_beacon = evidence.get("_meta", {}).get("baseline_beacon")
    
    if weights_beacon != expected_beacon:
        errors.append(
            f"Weights beacon mismatch: expected {expected_beacon}, got {weights_beacon}"
        )
    
    if evidence_beacon != expected_beacon:
        errors.append(
            f"Evidence beacon mismatch: expected {expected_beacon}, got {evidence_beacon}"
        )
    
    return errors


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Validate gate.line outputs with mechanical invariants"
    )
    parser.add_argument(
        "gate",
        type=str,
        help="Gate number (01-64, zero-padded)"
    )
    parser.add_argument(
        "--beacon",
        type=str,
        default="59bfc617",
        help="Expected baseline beacon (default: 59bfc617)"
    )
    
    args = parser.parse_args()
    
    # Validate gate format
    if not args.gate.isdigit() or len(args.gate) != 2:
        print(f"ERROR: Gate must be zero-padded 2-digit number (01-64), got: {args.gate}", file=sys.stderr)
        return 1
    
    gate_num = int(args.gate)
    if gate_num < 1 or gate_num > 64:
        print(f"ERROR: Gate must be 01-64, got: {args.gate}", file=sys.stderr)
        return 1
    
    # Determine file paths
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    weights_path = project_root / "star-maps" / f"gateLine_star_map_Gate{args.gate}.json"
    evidence_path = project_root / "evidence" / f"gateLine_evidence_Gate{args.gate}.json"
    weights_schema_path = project_root / "schemas" / "weights.schema.json"
    evidence_schema_path = project_root / "schemas" / "evidence.schema.json"
    
    # Load files
    try:
        weights = load_json(weights_path)
        evidence = load_json(evidence_path)
        weights_schema = load_json(weights_schema_path)
        evidence_schema = load_json(evidence_schema_path)
    except Exception as e:
        print(f"ERROR loading files: {e}", file=sys.stderr)
        return 1
    
    # Run all validations
    all_errors = []
    
    print(f"Validating Gate {args.gate}...")
    print()
    
    # Schema validation
    print("1. Schema validation...")
    errors = validate_schema(weights, weights_schema, "Weights")
    if errors:
        all_errors.extend(errors)
        for err in errors:
            print(f"  ✗ {err}")
    else:
        print("  ✓ Weights schema valid")
    
    errors = validate_schema(evidence, evidence_schema, "Evidence")
    if errors:
        all_errors.extend(errors)
        for err in errors:
            print(f"  ✗ {err}")
    else:
        print("  ✓ Evidence schema valid")
    print()
    
    # Top-2 constraint
    print("2. Top-2 constraint...")
    errors = validate_top2_constraint(weights)
    if errors:
        all_errors.extend(errors)
        for err in errors:
            print(f"  ✗ {err}")
    else:
        print("  ✓ Top-2 constraint satisfied")
    print()
    
    # Pairwise exclusions
    print("3. Pairwise exclusions...")
    errors = validate_pairwise_exclusions(weights)
    if errors:
        all_errors.extend(errors)
        for err in errors:
            print(f"  ✗ {err}")
    else:
        print("  ✓ Pairwise exclusions satisfied")
    print()
    
    # Legge-gating
    print("4. Legge-gating...")
    errors = validate_legge_gating(weights, evidence)
    if errors:
        all_errors.extend(errors)
        for err in errors:
            print(f"  ✗ {err}")
    else:
        print("  ✓ Legge-gating satisfied")
    print()
    
    # Weight precision
    print("5. Weight precision...")
    errors = validate_weight_precision(weights)
    if errors:
        all_errors.extend(errors)
        for err in errors:
            print(f"  ✗ {err}")
    else:
        print("  ✓ Weight precision valid")
    print()
    
    # Polarity presence
    print("6. Polarity presence...")
    errors = validate_polarity_presence(weights)
    if errors:
        all_errors.extend(errors)
        for err in errors:
            print(f"  ✗ {err}")
    else:
        print("  ✓ Polarity presence valid")
    print()
    
    # Canonical names
    print("7. Canonical names...")
    errors = validate_canonical_names(weights)
    if errors:
        all_errors.extend(errors)
        for err in errors:
            print(f"  ✗ {err}")
    else:
        print("  ✓ Canonical names valid")
    print()
    
    # Key format
    print("8. Key format...")
    errors = validate_key_format(weights)
    if errors:
        all_errors.extend(errors)
        for err in errors:
            print(f"  ✗ {err}")
    else:
        print("  ✓ Key format valid")
    print()
    
    # Sorting
    print("9. Sorting and tie-breaking...")
    errors = validate_sorting(weights)
    if errors:
        all_errors.extend(errors)
        for err in errors:
            print(f"  ✗ {err}")
    else:
        print("  ✓ Sorting and tie-breaking valid")
    print()
    
    # Sparse format
    print("10. Sparse format...")
    errors = validate_sparse_format(weights)
    if errors:
        all_errors.extend(errors)
        for err in errors:
            print(f"  ✗ {err}")
    else:
        print("  ✓ Sparse format valid")
    print()
    
    # Sum unorm
    print("11. Sum unorm...")
    errors = validate_sum_unorm(weights)
    if errors:
        all_errors.extend(errors)
        for err in errors:
            print(f"  ✗ {err}")
    else:
        print("  ✓ Sum unorm valid")
    print()
    
    # Beacon match
    print("12. Beacon match...")
    errors = validate_beacon_match(weights, evidence, args.beacon)
    if errors:
        all_errors.extend(errors)
        for err in errors:
            print(f"  ✗ {err}")
    else:
        print("  ✓ Beacon matches")
    print()
    
    # Summary
    if all_errors:
        print(f"✗ Validation FAILED with {len(all_errors)} error(s)")
        return 1
    else:
        print("✓ All validations PASSED")
        return 0


if __name__ == "__main__":
    sys.exit(main())
