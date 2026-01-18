#!/usr/bin/env python3
"""
Write and manage run manifest files for manual gate scoring sessions.

This script creates and updates YAML manifest files that track progress during
manual gate scoring. Each session gets its own manifest file with baseline beacon,
completion status, and validation status.

Usage:
    # Initialize a new session
    python write_run_manifest.py --init
    
    # Add completed gates
    python write_run_manifest.py --add-completed 1 2 3
    
    # Add validated gates
    python write_run_manifest.py --add-validated 1 2 3
    
    # Add session notes
    python write_run_manifest.py --notes "Completed batch 1"
    
    # View status
    python write_run_manifest.py --status
    
    # Generate report
    python write_run_manifest.py --report
    
    # Verify baseline beacon
    python write_run_manifest.py --verify-beacon
"""

import argparse
import hashlib
import json
import subprocess
import sys
import yaml
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional


# Import compute_beacon from sibling script
sys.path.insert(0, str(Path(__file__).parent))
from compute_beacon import compute_beacon


def get_git_info() -> tuple[str, bool]:
    """
    Get current git commit hash and dirty status.
    
    Returns:
        Tuple of (commit_hash, is_dirty)
    """
    try:
        # Get commit hash
        result = subprocess.run(
            ['git', 'rev-parse', 'HEAD'],
            capture_output=True,
            text=True,
            check=True
        )
        commit = result.stdout.strip()
        
        # Check if working directory is dirty
        result = subprocess.run(
            ['git', 'status', '--porcelain'],
            capture_output=True,
            text=True,
            check=True
        )
        is_dirty = bool(result.stdout.strip())
        
        return commit, is_dirty
    except subprocess.CalledProcessError:
        return "unknown", False
    except FileNotFoundError:
        return "unknown", False


def get_baseline_info(baseline_path: Path) -> Dict[str, str]:
    """
    Compute baseline beacon and full SHA256 hash.
    
    Args:
        baseline_path: Path to combined-baselines-4.2.json
        
    Returns:
        Dict with 'beacon' and 'sha256' keys
    """
    # Compute beacon (first 8 chars of SHA256)
    beacon = compute_beacon(baseline_path)
    
    # Compute full SHA256
    with open(baseline_path, 'r', encoding='utf-8') as f:
        baseline_data = json.load(f)
    canonical_json = json.dumps(baseline_data, sort_keys=True, separators=(',', ':'))
    full_sha256 = hashlib.sha256(canonical_json.encode('utf-8')).hexdigest()
    
    return {
        'beacon': beacon,
        'sha256': full_sha256
    }


def create_manifest(
    analyst: str,
    session_date: str,
    baseline_path: Path,
    notes: str = ""
) -> Dict:
    """
    Create a new manifest structure.
    
    Args:
        analyst: Name or identifier of analyst
        session_date: ISO 8601 date string
        baseline_path: Path to baseline file
        notes: Optional session notes
        
    Returns:
        Manifest dict
    """
    baseline_info = get_baseline_info(baseline_path)
    git_commit, git_dirty = get_git_info()
    
    manifest = {
        'schema_version': '1.0',
        'analyst': analyst,
        'session_date': session_date,
        'baseline_beacon': {
            'value': baseline_info['beacon'],
            'method': 'sha256_canonical_json',
            'source_path': 'GPT-5/combined-baselines-4.2.json',
            'source_sha256': baseline_info['sha256']
        },
        'gates_completed': [],
        'gates_validated': [],
        'timestamp_utc': datetime.now(timezone.utc).isoformat(),
        'git_commit': git_commit,
        'git_dirty': git_dirty,
        'notes': notes
    }
    
    return manifest


def load_manifest(manifest_path: Path) -> Dict:
    """Load manifest from YAML file."""
    with open(manifest_path, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)


def save_manifest(manifest: Dict, manifest_path: Path):
    """Save manifest to YAML file."""
    # Update timestamp
    manifest['timestamp_utc'] = datetime.now(timezone.utc).isoformat()
    
    # Update git info
    git_commit, git_dirty = get_git_info()
    manifest['git_commit'] = git_commit
    manifest['git_dirty'] = git_dirty
    
    # Ensure parent directory exists
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Write YAML with nice formatting
    with open(manifest_path, 'w', encoding='utf-8') as f:
        yaml.dump(manifest, f, default_flow_style=False, sort_keys=False, allow_unicode=True)


def get_manifest_path(session_date: Optional[str] = None) -> Path:
    """
    Get path to manifest file for a session.
    
    Args:
        session_date: ISO 8601 date string, or None for today
        
    Returns:
        Path to manifest file
    """
    if session_date is None:
        session_date = datetime.now().strftime('%Y-%m-%d')
    
    script_dir = Path(__file__).parent
    runs_dir = script_dir.parent / 'runs' / session_date
    return runs_dir / 'run-manifest.yaml'


def find_latest_manifest() -> Optional[Path]:
    """
    Find the most recent manifest file.
    
    Returns:
        Path to latest manifest, or None if no manifests exist
    """
    script_dir = Path(__file__).parent
    runs_dir = script_dir.parent / 'runs'
    
    if not runs_dir.exists():
        return None
    
    # Find all manifest files
    manifests = list(runs_dir.glob('*/run-manifest.yaml'))
    if not manifests:
        return None
    
    # Sort by modification time
    manifests.sort(key=lambda p: p.stat().st_mtime, reverse=True)
    return manifests[0]


def cmd_init(args):
    """Initialize a new session."""
    manifest_path = get_manifest_path(args.session_date)
    
    if manifest_path.exists() and not args.force:
        print(f"ERROR: Manifest already exists: {manifest_path}")
        print("Use --force to overwrite")
        return 1
    
    # Get analyst name
    analyst = args.analyst or input("Analyst name: ").strip()
    if not analyst:
        print("ERROR: Analyst name is required")
        return 1
    
    # Get baseline path
    script_dir = Path(__file__).parent
    baseline_path = script_dir.parent / "combined-baselines-4.2.json"
    
    if not baseline_path.exists():
        print(f"ERROR: Baseline file not found: {baseline_path}")
        return 1
    
    # Create manifest
    session_date = args.session_date or datetime.now().strftime('%Y-%m-%d')
    manifest = create_manifest(analyst, session_date, baseline_path, args.notes or "")
    
    # Save manifest
    save_manifest(manifest, manifest_path)
    
    print(f"✓ Created manifest: {manifest_path}")
    print(f"  Analyst: {analyst}")
    print(f"  Session: {session_date}")
    print(f"  Baseline beacon: {manifest['baseline_beacon']['value']}")
    print(f"  Git: {manifest['git_commit'][:8]} {'(dirty)' if manifest['git_dirty'] else '(clean)'}")
    
    return 0


def cmd_add_completed(args):
    """Add gates to completed list."""
    manifest_path = get_manifest_path(args.session_date)
    
    if not manifest_path.exists():
        print(f"ERROR: Manifest not found: {manifest_path}")
        print("Run with --init first")
        return 1
    
    manifest = load_manifest(manifest_path)
    
    # Add gates (avoid duplicates)
    gates_completed = set(manifest['gates_completed'])
    gates_completed.update(args.gates)
    manifest['gates_completed'] = sorted(gates_completed)
    
    save_manifest(manifest, manifest_path)
    
    print(f"✓ Added {len(args.gates)} gates to completed list")
    print(f"  Total completed: {len(manifest['gates_completed'])}/64")
    
    return 0


def cmd_add_validated(args):
    """Add gates to validated list."""
    manifest_path = get_manifest_path(args.session_date)
    
    if not manifest_path.exists():
        print(f"ERROR: Manifest not found: {manifest_path}")
        print("Run with --init first")
        return 1
    
    manifest = load_manifest(manifest_path)
    
    # Check that gates are in completed list
    gates_completed = set(manifest['gates_completed'])
    for gate in args.gates:
        if gate not in gates_completed:
            print(f"WARNING: Gate {gate} not in completed list")
    
    # Add gates (avoid duplicates)
    gates_validated = set(manifest['gates_validated'])
    gates_validated.update(args.gates)
    manifest['gates_validated'] = sorted(gates_validated)
    
    save_manifest(manifest, manifest_path)
    
    print(f"✓ Added {len(args.gates)} gates to validated list")
    print(f"  Total validated: {len(manifest['gates_validated'])}/64")
    
    return 0


def cmd_notes(args):
    """Add or update session notes."""
    manifest_path = get_manifest_path(args.session_date)
    
    if not manifest_path.exists():
        print(f"ERROR: Manifest not found: {manifest_path}")
        print("Run with --init first")
        return 1
    
    manifest = load_manifest(manifest_path)
    
    # Update notes
    if args.append:
        existing = manifest.get('notes', '')
        manifest['notes'] = f"{existing}\n{args.notes}".strip()
    else:
        manifest['notes'] = args.notes
    
    save_manifest(manifest, manifest_path)
    
    print(f"✓ Updated session notes")
    
    return 0


def cmd_status(args):
    """Display current session status."""
    manifest_path = get_manifest_path(args.session_date)
    
    if not manifest_path.exists():
        if args.session_date:
            print(f"ERROR: Manifest not found: {manifest_path}")
            return 1
        else:
            # Try to find latest manifest
            manifest_path = find_latest_manifest()
            if not manifest_path:
                print("No manifests found. Run with --init to create one.")
                return 1
    
    manifest = load_manifest(manifest_path)
    
    print(f"Session: {manifest['session_date']}")
    print(f"Analyst: {manifest['analyst']}")
    print(f"Baseline beacon: {manifest['baseline_beacon']['value']}")
    print()
    print(f"Gates completed: {len(manifest['gates_completed'])}/64 ({len(manifest['gates_completed'])/64*100:.1f}%)")
    print(f"Gates validated: {len(manifest['gates_validated'])}/64 ({len(manifest['gates_validated'])/64*100:.1f}%)")
    print()
    
    if manifest['gates_completed']:
        print(f"Completed: {manifest['gates_completed']}")
    if manifest['gates_validated']:
        print(f"Validated: {manifest['gates_validated']}")
    
    # Show next gates to score
    all_gates = set(range(1, 65))
    completed = set(manifest['gates_completed'])
    remaining = sorted(all_gates - completed)
    if remaining:
        next_batch = remaining[:8]
        print()
        print(f"Next to score: {next_batch}")
    
    print()
    print(f"Git: {manifest['git_commit'][:8]} {'(dirty)' if manifest['git_dirty'] else '(clean)'}")
    print(f"Last updated: {manifest['timestamp_utc']}")
    
    if manifest.get('notes'):
        print()
        print("Notes:")
        print(manifest['notes'])
    
    return 0


def cmd_report(args):
    """Generate progress report."""
    manifest_path = get_manifest_path(args.session_date)
    
    if not manifest_path.exists():
        if args.session_date:
            print(f"ERROR: Manifest not found: {manifest_path}")
            return 1
        else:
            manifest_path = find_latest_manifest()
            if not manifest_path:
                print("No manifests found.")
                return 1
    
    manifest = load_manifest(manifest_path)
    
    print("Manual Scoring Progress Report")
    print("=" * 50)
    print()
    print(f"Session: {manifest['session_date']}")
    print(f"Analyst: {manifest['analyst']}")
    print(f"Baseline: {manifest['baseline_beacon']['value']}")
    print()
    print(f"Gates Completed: {len(manifest['gates_completed'])}/64 ({len(manifest['gates_completed'])/64*100:.1f}%)")
    print(f"Gates Validated: {len(manifest['gates_validated'])}/64 ({len(manifest['gates_validated'])/64*100:.1f}%)")
    print()
    
    if manifest['gates_completed']:
        print(f"Completed: {manifest['gates_completed']}")
    if manifest['gates_validated']:
        print(f"Validated: {manifest['gates_validated']}")
    
    # Show next gates
    all_gates = set(range(1, 65))
    completed = set(manifest['gates_completed'])
    remaining = sorted(all_gates - completed)
    if remaining:
        next_batch = remaining[:8]
        print()
        print(f"Next to score: {next_batch}")
    
    print()
    print(f"Git: {manifest['git_commit'][:8]} {'(dirty)' if manifest['git_dirty'] else '(clean)'}")
    print(f"Last updated: {manifest['timestamp_utc']}")
    
    return 0


def cmd_verify_beacon(args):
    """Verify baseline beacon matches current baseline."""
    manifest_path = get_manifest_path(args.session_date)
    
    if not manifest_path.exists():
        print(f"ERROR: Manifest not found: {manifest_path}")
        return 1
    
    manifest = load_manifest(manifest_path)
    
    # Get current baseline info
    script_dir = Path(__file__).parent
    baseline_path = script_dir.parent / "combined-baselines-4.2.json"
    
    if not baseline_path.exists():
        print(f"ERROR: Baseline file not found: {baseline_path}")
        return 1
    
    current_info = get_baseline_info(baseline_path)
    manifest_beacon = manifest['baseline_beacon']['value']
    
    if current_info['beacon'] == manifest_beacon:
        print(f"✓ Baseline beacon matches: {manifest_beacon}")
        return 0
    else:
        print(f"ERROR: Baseline beacon mismatch!")
        print(f"  Manifest: {manifest_beacon}")
        print(f"  Current:  {current_info['beacon']}")
        print()
        print("The baseline file has changed since this session started.")
        print("Either revert the baseline or start a new session.")
        return 1


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Manage run manifest files for manual gate scoring sessions"
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Command to execute')
    
    # Init command
    init_parser = subparsers.add_parser('init', help='Initialize a new session')
    init_parser.add_argument('--analyst', help='Analyst name')
    init_parser.add_argument('--session-date', help='Session date (YYYY-MM-DD), defaults to today')
    init_parser.add_argument('--notes', help='Initial session notes')
    init_parser.add_argument('--force', action='store_true', help='Overwrite existing manifest')
    
    # Add completed command
    completed_parser = subparsers.add_parser('add-completed', help='Add gates to completed list')
    completed_parser.add_argument('gates', type=int, nargs='+', help='Gate numbers to add')
    completed_parser.add_argument('--session-date', help='Session date (YYYY-MM-DD), defaults to today')
    
    # Add validated command
    validated_parser = subparsers.add_parser('add-validated', help='Add gates to validated list')
    validated_parser.add_argument('gates', type=int, nargs='+', help='Gate numbers to add')
    validated_parser.add_argument('--session-date', help='Session date (YYYY-MM-DD), defaults to today')
    
    # Notes command
    notes_parser = subparsers.add_parser('notes', help='Add or update session notes')
    notes_parser.add_argument('notes', help='Session notes text')
    notes_parser.add_argument('--append', action='store_true', help='Append to existing notes')
    notes_parser.add_argument('--session-date', help='Session date (YYYY-MM-DD), defaults to today')
    
    # Status command
    status_parser = subparsers.add_parser('status', help='Display current session status')
    status_parser.add_argument('--session-date', help='Session date (YYYY-MM-DD), defaults to latest')
    
    # Report command
    report_parser = subparsers.add_parser('report', help='Generate progress report')
    report_parser.add_argument('--session-date', help='Session date (YYYY-MM-DD), defaults to latest')
    
    # Verify beacon command
    verify_parser = subparsers.add_parser('verify-beacon', help='Verify baseline beacon')
    verify_parser.add_argument('--session-date', help='Session date (YYYY-MM-DD), defaults to today')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return 1
    
    # Dispatch to command handler
    commands = {
        'init': cmd_init,
        'add-completed': cmd_add_completed,
        'add-validated': cmd_add_validated,
        'notes': cmd_notes,
        'status': cmd_status,
        'report': cmd_report,
        'verify-beacon': cmd_verify_beacon
    }
    
    try:
        return commands[args.command](args)
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return 2


if __name__ == "__main__":
    sys.exit(main())
