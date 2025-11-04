#!/usr/bin/env python3
"""
17-verify-sources-integration.py

Verifies the integrity of the consolidated sources JSON file.
Checks for completeness, consistency, and data quality.
"""

import json
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))
from config import PROJECT_ROOT

def verify_sources():
    """Verify the consolidated sources file."""
    sources_path = PROJECT_ROOT / 'star-system-sorter' / 'public' / 'data' / 'star_system_sources.json'
    
    if not sources_path.exists():
        print(f"❌ Sources file not found: {sources_path}")
        return False
    
    print("🔍 Verifying sources integration...")
    print()
    
    with open(sources_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Check top-level structure
    required_keys = ['version', 'generated', 'description', 'methodology', 'star_systems', 'source_library']
    missing_keys = [k for k in required_keys if k not in data]
    
    if missing_keys:
        print(f"❌ Missing top-level keys: {missing_keys}")
        return False
    
    print(f"✅ Top-level structure valid")
    print(f"   Version: {data['version']}")
    print(f"   Generated: {data['generated']}")
    print()
    
    # Check methodology
    methodology = data['methodology']
    print(f"✅ Methodology:")
    print(f"   Framework: {methodology['framework']}")
    print(f"   Research hours: {methodology['research_hours']}")
    print(f"   Academic foundations: {len(methodology['academic_foundations'])} items")
    print()
    
    # Check star systems
    star_systems = data['star_systems']
    expected_systems = ['andromeda', 'arcturus', 'draco', 'lyra', 'orion-dark', 'orion-light', 'pleiades', 'sirius']
    
    missing_systems = [s for s in expected_systems if s not in star_systems]
    if missing_systems:
        print(f"❌ Missing star systems: {missing_systems}")
        return False
    
    print(f"✅ All {len(expected_systems)} star systems present")
    print()
    
    # Verify each system
    total_sources = 0
    total_core_themes = 0
    
    for system_name, system_data in star_systems.items():
        # Check required fields
        required_fields = ['name', 'version', 'core_themes', 'shadow_themes', 'sources', 'bibliography']
        missing_fields = [f for f in required_fields if f not in system_data]
        
        if missing_fields:
            print(f"❌ {system_name}: Missing fields {missing_fields}")
            return False
        
        # Check sources structure
        sources = system_data['sources']
        required_source_keys = ['core_sources', 'shadow_sources', 'all_sources', 'source_count']
        missing_source_keys = [k for k in required_source_keys if k not in sources]
        
        if missing_source_keys:
            print(f"❌ {system_name}: Missing source keys {missing_source_keys}")
            return False
        
        # Verify source count matches
        actual_count = len(sources['all_sources'])
        declared_count = sources['source_count']
        
        if actual_count != declared_count:
            print(f"❌ {system_name}: Source count mismatch (declared: {declared_count}, actual: {actual_count})")
            return False
        
        # Verify each source has required fields
        for idx, source in enumerate(sources['all_sources']):
            required_source_fields = ['title', 'author', 'year', 'publisher', 'source_type', 'summary', 'astronomical_component', 'used_for']
            missing_source_fields = [f for f in required_source_fields if f not in source]
            
            if missing_source_fields:
                print(f"❌ {system_name}: Source {idx} missing fields {missing_source_fields}")
                return False
            
            # Verify source_type is valid
            valid_types = ['ancient', 'research', 'channeled', 'controversial', 'esoteric', 'unknown']
            if source['source_type'] not in valid_types:
                print(f"❌ {system_name}: Source {idx} has invalid type '{source['source_type']}'")
                return False
            
            # Verify astronomical_component is valid
            valid_components = ['A', 'B', 'G', 'H', 'unspecified']
            if source['astronomical_component'] not in valid_components:
                print(f"❌ {system_name}: Source {idx} has invalid component '{source['astronomical_component']}'")
                return False
        
        total_sources += declared_count
        total_core_themes += len(system_data['core_themes'])
        
        print(f"✅ {system_name.title()}: {declared_count} sources, {len(system_data['core_themes'])} core themes")
    
    print()
    print(f"📊 Summary:")
    print(f"   Total star systems: {len(star_systems)}")
    print(f"   Total sources: {total_sources}")
    print(f"   Total core themes: {total_core_themes}")
    print(f"   Average sources per system: {total_sources / len(star_systems):.1f}")
    print()
    
    # Check source library
    source_library = data['source_library']
    print(f"✅ Source Library:")
    print(f"   Categories: {len(source_library['categories'])}")
    print(f"   Total sources: {source_library['total_sources']}")
    print(f"   Library path: {source_library['library_path']}")
    print()
    
    # File size check
    file_size_kb = sources_path.stat().st_size / 1024
    print(f"📦 File size: {file_size_kb:.1f} KB")
    
    if file_size_kb > 500:
        print(f"⚠️  Warning: File size is large (>{file_size_kb:.1f} KB)")
    else:
        print(f"✅ File size is reasonable")
    
    print()
    print("✅ All verification checks passed!")
    return True

if __name__ == '__main__':
    success = verify_sources()
    sys.exit(0 if success else 1)
