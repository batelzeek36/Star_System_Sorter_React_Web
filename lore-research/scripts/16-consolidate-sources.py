#!/usr/bin/env python3
"""
16-consolidate-sources.py

Consolidates star system research sources from v4.2 baseline files
and the esoteric source library into a single JSON file for the React app.

Output: star-system-sorter/public/data/star_system_sources.json
"""

import json
import sys
from pathlib import Path
from typing import Dict, List, Any

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))
from config import PROJECT_ROOT, STAR_SYSTEM_BASELINES_DIR

def load_baseline(system_name: str) -> Dict[str, Any]:
    """Load a star system baseline file."""
    baseline_path = STAR_SYSTEM_BASELINES_DIR / f"{system_name}-baseline-4.2.json"
    
    if not baseline_path.exists():
        print(f"⚠️  Baseline not found: {baseline_path}")
        return {}
    
    with open(baseline_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def extract_sources_from_baseline(baseline: Dict[str, Any]) -> Dict[str, Any]:
    """Extract and deduplicate sources from a baseline file."""
    if not baseline:
        return {
            "core_sources": [],
            "shadow_sources": [],
            "all_sources": [],
            "source_count": 0
        }
    
    all_sources = []
    core_sources = []
    shadow_sources = []
    seen_titles = set()
    
    # Extract from characteristics
    for char in baseline.get('characteristics', []):
        polarity = char.get('polarity', 'neutral')
        
        for source in char.get('sources', []):
            title = source.get('title', '')
            if title and title not in seen_titles:
                seen_titles.add(title)
                
                source_entry = {
                    "title": title,
                    "author": source.get('author', ''),
                    "year": source.get('year'),
                    "publisher": source.get('publisher', ''),
                    "source_type": source.get('source_type', 'unknown'),
                    "isbn": source.get('isbn'),
                    "url": source.get('url'),
                    "summary": source.get('summary', ''),
                    "astronomical_component": source.get('astronomical_component', 'unspecified'),
                    "used_for": char.get('trait', '')
                }
                
                all_sources.append(source_entry)
                
                if polarity == 'light':
                    core_sources.append(source_entry)
                elif polarity == 'dark':
                    shadow_sources.append(source_entry)
    
    # Extract from disputed_points
    for dispute in baseline.get('disputed_points', []):
        for source in dispute.get('supporting_sources', []) + dispute.get('counter_evidence', []):
            title = source.get('title', '')
            if title and title not in seen_titles:
                seen_titles.add(title)
                
                source_entry = {
                    "title": title,
                    "author": source.get('author', ''),
                    "year": source.get('year'),
                    "publisher": source.get('publisher', ''),
                    "source_type": source.get('source_type', 'unknown'),
                    "isbn": source.get('isbn'),
                    "url": source.get('url'),
                    "summary": source.get('summary', ''),
                    "astronomical_component": source.get('astronomical_component', 'unspecified'),
                    "used_for": f"Disputed: {dispute.get('claim', '')[:100]}"
                }
                
                all_sources.append(source_entry)
    
    return {
        "core_sources": core_sources,
        "shadow_sources": shadow_sources,
        "all_sources": all_sources,
        "source_count": len(all_sources)
    }

def load_source_library() -> Dict[str, Any]:
    """Load the esoteric source library markdown file."""
    library_path = PROJECT_ROOT / 'lore-research' / 'source-mining' / '!ESOTERIC_SOURCE_LIBRARY.md'
    
    if not library_path.exists():
        print(f"⚠️  Source library not found: {library_path}")
        return {"categories": [], "total_sources": 0}
    
    with open(library_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract major categories from markdown headers
    categories = []
    current_category = None
    
    for line in content.split('\n'):
        if line.startswith('## '):
            category_name = line.replace('## ', '').strip()
            if category_name and not category_name.startswith('📚'):
                current_category = {
                    "name": category_name,
                    "description": ""
                }
                categories.append(current_category)
    
    return {
        "categories": [cat["name"] for cat in categories],
        "total_sources": "400+",
        "library_path": "lore-research/source-mining/!ESOTERIC_SOURCE_LIBRARY.md"
    }

def main():
    print("🔬 Consolidating star system research sources...")
    print()
    
    star_systems = [
        'andromeda',
        'arcturus',
        'draco',
        'lyra',
        'orion-dark',
        'orion-light',
        'pleiades',
        'sirius'
    ]
    
    consolidated = {
        "version": "1.0",
        "generated": "2025-11-03",
        "description": "Consolidated research sources for all star systems from v4.2 baselines",
        "methodology": {
            "framework": "Comparative mythology + I Ching-based Human Design system",
            "research_hours": "862-1,656 hours (5-10 months full-time)",
            "source_standards": "Publisher-backed sources with ISBN or known imprint; university press; peer-reviewed journals; ancient texts with named translators",
            "academic_foundations": [
                "I Ching (64 hexagrams → 64 Human Design gates)",
                "64 DNA codons - Nobel Prize research (Nirenberg, Khorana 1968)",
                "Kabbalah - Academic study (Scholem, Idel)",
                "Chakra system - Religious Studies (Feuerstein)",
                "Western Astrology - Cultural history (Tarnas)"
            ]
        },
        "star_systems": {},
        "source_library": load_source_library()
    }
    
    total_sources = 0
    
    for system in star_systems:
        print(f"📖 Processing {system}...")
        baseline = load_baseline(system)
        
        if not baseline:
            continue
        
        sources_data = extract_sources_from_baseline(baseline)
        total_sources += sources_data['source_count']
        
        consolidated['star_systems'][system] = {
            "name": baseline.get('star_system', system.title()),
            "version": baseline.get('version', '4.2'),
            "last_updated": baseline.get('last_updated', ''),
            "core_themes": baseline.get('mapping_digest', {}).get('core_themes', []),
            "shadow_themes": baseline.get('mapping_digest', {}).get('shadow_themes', []),
            "sources": sources_data,
            "bibliography": baseline.get('bibliography', {})
        }
        
        print(f"   ✓ {sources_data['source_count']} sources extracted")
    
    # Write output
    output_path = PROJECT_ROOT / 'star-system-sorter' / 'public' / 'data' / 'star_system_sources.json'
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(consolidated, f, indent=2, ensure_ascii=False)
    
    print()
    print(f"✅ Consolidation complete!")
    print(f"   📊 {len(star_systems)} star systems processed")
    print(f"   📚 {total_sources} total sources extracted")
    print(f"   💾 Output: {output_path}")
    print()
    print("Next steps:")
    print("1. Review the generated JSON file")
    print("2. Integrate into React app (ResultScreen component)")
    print("3. Create UI components for source display")

if __name__ == '__main__':
    main()