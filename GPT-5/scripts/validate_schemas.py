#!/usr/bin/env python3
"""
Validate weight and evidence files against JSON schemas.

This script validates gate.line weight and evidence files against their respective
JSON schemas to ensure structural correctness and compliance with requirements.

Usage:
    python validate_schemas.py [--weights WEIGHT_FILE] [--evidence EVIDENCE_FILE]

If no files specified, validates example files from requirements:
    - GPT-5/star-maps/gateLine_star_map_Gate01.json
    - GPT-5/evidence/gateLine_evidence_Gate01.json
"""

import argparse
import json
import sys
from pathlib import Path
from typing import Dict, List, Tuple

try:
    import jsonschema
    from jsonschema import validate, ValidationError
except ImportError:
    print("ERROR: jsonschema package not installed", file=sys.stderr)
    print("Install with: pip install jsonschema", file=sys.stderr)
    sys.exit(1)


def load_schema(schema_path: Path) -> Dict:
    """Load JSON schema from file."""
    if not schema_path.exists():
        raise FileNotFoundError(f"Schema file not found: {schema_path}")
    
    with open(schema_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def load_data_file(data_path: Path) -> Dict:
    """Load data file to validate."""
    if not data_path.exists():
        raise FileNotFoundError(f"Data file not found: {data_path}")
    
    with open(data_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def validate_file(data: Dict, schema: Dict, file_type: str) -> Tuple[bool, List[str]]:
    """
    Validate data against schema.
    
    Returns:
        Tuple of (is_valid, error_messages)
    """
    errors = []
    
    try:
        validate(instance=data, schema=schema)
        return True, []
    except ValidationError as e:
        errors.append(f"{file_type} validation error: {e.message}")
        if e.path:
            errors.append(f"  Path: {' -> '.join(str(p) for p in e.path)}")
        return False, errors


def validate_weights_file(weights_path: Path, schema_path: Path) -> Tuple[bool, List[str]]:
    """Validate a weights file against the weights schema."""
    try:
        schema = load_schema(schema_path)
        data = load_data_file(weights_path)
        return validate_file(data, schema, "Weights")
    except Exception as e:
        return False, [f"Error loading weights file: {e}"]


def validate_evidence_file(evidence_path: Path, schema_path: Path) -> Tuple[bool, List[str]]:
    """Validate an evidence file against the evidence schema."""
    try:
        schema = load_schema(schema_path)
        data = load_data_file(evidence_path)
        return validate_file(data, schema, "Evidence")
    except Exception as e:
        return False, [f"Error loading evidence file: {e}"]


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Validate weight and evidence files against JSON schemas"
    )
    parser.add_argument(
        "--weights",
        type=Path,
        help="Path to weights file to validate"
    )
    parser.add_argument(
        "--evidence",
        type=Path,
        help="Path to evidence file to validate"
    )
    
    args = parser.parse_args()
    
    # Determine file paths
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    weights_schema_path = project_root / "schemas" / "weights.schema.json"
    evidence_schema_path = project_root / "schemas" / "evidence.schema.json"
    
    # Use example files if not specified
    if args.weights:
        weights_path = args.weights
    else:
        weights_path = project_root / "star-maps" / "gateLine_star_map_Gate01.json"
    
    if args.evidence:
        evidence_path = args.evidence
    else:
        evidence_path = project_root / "evidence" / "gateLine_evidence_Gate01.json"
    
    # Validate weights file
    print(f"Validating weights file: {weights_path}")
    weights_valid, weights_errors = validate_weights_file(weights_path, weights_schema_path)
    
    if weights_valid:
        print("✓ Weights file is valid")
    else:
        print("✗ Weights file validation FAILED:")
        for error in weights_errors:
            print(f"  {error}")
    
    print()
    
    # Validate evidence file
    print(f"Validating evidence file: {evidence_path}")
    evidence_valid, evidence_errors = validate_evidence_file(evidence_path, evidence_schema_path)
    
    if evidence_valid:
        print("✓ Evidence file is valid")
    else:
        print("✗ Evidence file validation FAILED:")
        for error in evidence_errors:
            print(f"  {error}")
    
    # Return exit code
    if weights_valid and evidence_valid:
        print("\n✓ All validations passed")
        return 0
    else:
        print("\n✗ Validation failures detected")
        return 1


if __name__ == "__main__":
    sys.exit(main())
