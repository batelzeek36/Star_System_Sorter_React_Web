#!/usr/bin/env python3
"""
Fuzz test pairwise exclusion rules across sample gate data.

This script tests all pairwise exclusion invariants against existing gate outputs
to verify rule compliance and generate a comprehensive invariants report.

Usage:
    python fuzz_invariants.py [--gates GATE_LIST]
    python fuzz_invariants.py --gates 01,03,07,10
    python fuzz_invariants.py  # Tests all available gates
"""

import argparse
import json
import sys
from pathlib import Path
from typing import Dict, List, Tuple, Set
from collections import defaultdict


# Pairwise exclusion rules (system_a, system_b, threshold_a, max_b)
PAIRWISE_EXCLUSIONS = [
    ("Pleiades", "Draco", 0.0, None),  # If Pleiades > 0 → Draco = 0
    ("Sirius", "Orion Light", 0.60, 0.35),  # If Sirius ≥ 0.60 → Orion Light ≤ 0.35
    ("Andromeda", "Orion Dark", 0.60, 0.0),  # If Andromeda ≥ 0.60 → Orion Dark = 0
    ("Arcturus", "Pleiades", 0.0, 0.0),  # If Arcturus > 0 → Pleiades = 0
    ("Lyra", "Draco", 0.0, None),  # If Lyra > 0 → Draco = 0
]

# Orion faction conflict rule
ORION_FACTION_RULE = ("Orion Light", "Orion Dark", 0.35)


class InvariantTester:
    """Test pairwise exclusion invariants across gate data."""
    
    def __init__(self):
        self.violations = []
        self.passes = []
        self.stats = defaultdict(lambda: {"tested": 0, "violations": 0, "passes": 0})
        
    def load_gate_weights(self, gate_num: str) -> Dict:
        """Load weight file for a gate."""
        script_dir = Path(__file__).parent
        project_root = script_dir.parent
        weights_path = project_root / "star-maps" / f"gateLine_star_map_Gate{gate_num}.json"
        
        if not weights_path.exists():
            return None
        
        try:
            with open(weights_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except json.JSONDecodeError as e:
            print(f"WARNING: Gate {gate_num} has invalid JSON: {e}", file=sys.stderr)
            return None
        except Exception as e:
            print(f"WARNING: Gate {gate_num} failed to load: {e}", file=sys.stderr)
            return None
    
    def test_pairwise_exclusion(
        self,
        gate_num: str,
        line_key: str,
        sys_weights: Dict[str, float],
        sys_a: str,
        sys_b: str,
        threshold_a: float,
        max_b: float
    ) -> Tuple[bool, str]:
        """
        Test a single pairwise exclusion rule.
        
        Returns:
            (passed, message) tuple
        """
        weight_a = sys_weights.get(sys_a, 0.0)
        weight_b = sys_weights.get(sys_b, 0.0)
        
        if threshold_a is None:
            threshold_a = 0.0
        
        # Use > for zero thresholds, >= for non-zero thresholds
        threshold_met = weight_a >= threshold_a if threshold_a > 0 else weight_a > threshold_a
        
        if not threshold_met:
            # Rule doesn't apply
            return True, None
        
        # Rule applies - check constraint
        if max_b is None:
            # Must be 0
            if weight_b > 0.0:
                op = "≥" if threshold_a > 0 else ">"
                msg = (
                    f"Gate {gate_num}, {line_key}: {sys_a} {op} {threshold_a} "
                    f"requires {sys_b} = 0, but {sys_b} = {weight_b}"
                )
                return False, msg
        else:
            # Must be ≤ max_b
            if weight_b > max_b:
                op = "≥" if threshold_a > 0 else ">"
                msg = (
                    f"Gate {gate_num}, {line_key}: {sys_a} {op} {threshold_a} "
                    f"requires {sys_b} ≤ {max_b}, but {sys_b} = {weight_b}"
                )
                return False, msg
        
        return True, None
    
    def test_orion_faction_conflict(
        self,
        gate_num: str,
        line_key: str,
        sys_weights: Dict[str, float]
    ) -> Tuple[bool, str]:
        """Test Orion faction conflict rule."""
        orion_light_weight = sys_weights.get("Orion Light", 0.0)
        orion_dark_weight = sys_weights.get("Orion Dark", 0.0)
        
        if orion_light_weight > 0 and orion_dark_weight > 0:
            # Both present - one should be ≤ 0.35 or 0
            if orion_light_weight > 0.35 and orion_dark_weight > 0.35:
                msg = (
                    f"Gate {gate_num}, {line_key}: Orion faction conflict - "
                    f"both Light ({orion_light_weight}) and Dark ({orion_dark_weight}) > 0.35; "
                    f"one should be down-ranked"
                )
                return False, msg
        
        return True, None
    
    def test_gate(self, gate_num: str) -> Dict:
        """Test all invariants for a single gate."""
        weights = self.load_gate_weights(gate_num)
        
        if weights is None:
            return {"status": "skipped", "reason": "file not found"}
        
        gate_violations = []
        gate_passes = []
        
        # Test each line
        for line_key in sorted([k for k in weights.keys() if k != "_meta"]):
            systems = weights[line_key]
            
            if not isinstance(systems, list):
                continue
            
            # Build system weight map
            sys_weights = {s["star_system"]: s["weight"] for s in systems}
            
            # Test each pairwise exclusion rule
            for sys_a, sys_b, threshold_a, max_b in PAIRWISE_EXCLUSIONS:
                rule_name = f"{sys_a}/{sys_b}"
                self.stats[rule_name]["tested"] += 1
                
                passed, msg = self.test_pairwise_exclusion(
                    gate_num, line_key, sys_weights, sys_a, sys_b, threshold_a, max_b
                )
                
                if passed:
                    self.stats[rule_name]["passes"] += 1
                    if msg is None:
                        # Rule didn't apply
                        gate_passes.append({
                            "line": line_key,
                            "rule": rule_name,
                            "status": "not_applicable"
                        })
                    else:
                        gate_passes.append({
                            "line": line_key,
                            "rule": rule_name,
                            "status": "passed"
                        })
                else:
                    self.stats[rule_name]["violations"] += 1
                    gate_violations.append({
                        "line": line_key,
                        "rule": rule_name,
                        "message": msg
                    })
                    self.violations.append(msg)
            
            # Test Orion faction conflict
            rule_name = "Orion Light/Orion Dark"
            self.stats[rule_name]["tested"] += 1
            
            passed, msg = self.test_orion_faction_conflict(gate_num, line_key, sys_weights)
            
            if passed:
                self.stats[rule_name]["passes"] += 1
                gate_passes.append({
                    "line": line_key,
                    "rule": rule_name,
                    "status": "passed" if msg is None else "not_applicable"
                })
            else:
                self.stats[rule_name]["violations"] += 1
                gate_violations.append({
                    "line": line_key,
                    "rule": rule_name,
                    "message": msg
                })
                self.violations.append(msg)
        
        return {
            "status": "tested",
            "violations": gate_violations,
            "passes": gate_passes,
            "violation_count": len(gate_violations),
            "pass_count": len(gate_passes)
        }
    
    def generate_report(self, tested_gates: List[str]) -> str:
        """Generate comprehensive invariants report."""
        report = []
        report.append("=" * 80)
        report.append("PAIRWISE EXCLUSION INVARIANTS FUZZ TEST REPORT")
        report.append("=" * 80)
        report.append("")
        
        # Summary
        report.append("SUMMARY")
        report.append("-" * 80)
        report.append(f"Gates tested: {len(tested_gates)}")
        report.append(f"Total violations: {len(self.violations)}")
        report.append(f"Total passes: {len(self.passes)}")
        report.append("")
        
        # Rule-by-rule statistics
        report.append("RULE STATISTICS")
        report.append("-" * 80)
        
        for rule_name in sorted(self.stats.keys()):
            stats = self.stats[rule_name]
            tested = stats["tested"]
            violations = stats["violations"]
            passes = stats["passes"]
            
            if tested > 0:
                pass_rate = (passes / tested) * 100
                report.append(f"{rule_name}:")
                report.append(f"  Tested: {tested}")
                report.append(f"  Violations: {violations}")
                report.append(f"  Passes: {passes}")
                report.append(f"  Pass rate: {pass_rate:.1f}%")
                report.append("")
        
        # Violations detail
        if self.violations:
            report.append("VIOLATIONS DETAIL")
            report.append("-" * 80)
            for i, violation in enumerate(self.violations, 1):
                report.append(f"{i}. {violation}")
            report.append("")
        else:
            report.append("✓ NO VIOLATIONS FOUND")
            report.append("")
        
        # Rule definitions
        report.append("RULE DEFINITIONS")
        report.append("-" * 80)
        report.append("")
        
        for sys_a, sys_b, threshold_a, max_b in PAIRWISE_EXCLUSIONS:
            if threshold_a is None:
                threshold_a = 0.0
            
            op = "≥" if threshold_a > 0 else ">"
            
            if max_b is None:
                constraint = f"{sys_b} = 0"
            else:
                constraint = f"{sys_b} ≤ {max_b}"
            
            report.append(f"• {sys_a} {op} {threshold_a} → {constraint}")
        
        report.append(f"• Orion Light > 0 AND Orion Dark > 0 → one must be ≤ 0.35")
        report.append("")
        
        # Tested gates
        report.append("TESTED GATES")
        report.append("-" * 80)
        report.append(", ".join(tested_gates))
        report.append("")
        
        report.append("=" * 80)
        
        return "\n".join(report)


def find_available_gates() -> List[str]:
    """Find all available gate weight files."""
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    star_maps_dir = project_root / "star-maps"
    
    if not star_maps_dir.exists():
        return []
    
    gates = []
    for path in sorted(star_maps_dir.glob("gateLine_star_map_Gate*.json")):
        # Extract gate number from filename
        filename = path.stem
        gate_num = filename.replace("gateLine_star_map_Gate", "")
        gates.append(gate_num)
    
    return gates


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Fuzz test pairwise exclusion invariants across gate data"
    )
    parser.add_argument(
        "--gates",
        type=str,
        help="Comma-separated list of gate numbers (e.g., '01,03,07,10'). If omitted, tests all available gates."
    )
    parser.add_argument(
        "--output",
        type=str,
        help="Output file for report (default: print to stdout)"
    )
    
    args = parser.parse_args()
    
    # Determine which gates to test
    if args.gates:
        gates_to_test = [g.strip().zfill(2) for g in args.gates.split(",")]
    else:
        gates_to_test = find_available_gates()
    
    if not gates_to_test:
        print("ERROR: No gates to test", file=sys.stderr)
        return 1
    
    print(f"Testing {len(gates_to_test)} gate(s)...")
    print()
    
    # Run tests
    tester = InvariantTester()
    tested_gates = []
    skipped_gates = []
    
    for gate_num in gates_to_test:
        result = tester.test_gate(gate_num)
        
        if result["status"] == "skipped":
            skipped_gates.append(gate_num)
            print(f"Gate {gate_num}: SKIPPED ({result['reason']})")
        else:
            tested_gates.append(gate_num)
            if result["violation_count"] > 0:
                print(f"Gate {gate_num}: {result['violation_count']} violation(s), {result['pass_count']} pass(es)")
            else:
                print(f"Gate {gate_num}: ✓ All tests passed ({result['pass_count']} checks)")
    
    print()
    
    if skipped_gates:
        print(f"Skipped {len(skipped_gates)} gate(s): {', '.join(skipped_gates)}")
        print()
    
    # Generate report
    report = tester.generate_report(tested_gates)
    
    if args.output:
        output_path = Path(args.output)
        output_path.write_text(report, encoding='utf-8')
        print(f"Report written to: {output_path}")
    else:
        print(report)
    
    # Exit with error code if violations found
    if tester.violations:
        return 1
    else:
        return 0


if __name__ == "__main__":
    sys.exit(main())
