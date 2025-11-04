import { useState, useEffect } from 'react';

interface Source {
  title: string;
  author: string;
  year: number;
  publisher: string;
  source_type: string;
  isbn?: string;
  url?: string;
  summary: string;
  astronomical_component: string;
  used_for: string;
}

interface SourcesData {
  core_sources: Source[];
  shadow_sources: Source[];
  all_sources: Source[];
  source_count: number;
}

interface StarSystemData {
  name: string;
  version: string;
  last_updated: string;
  core_themes: string[];
  shadow_themes: string[];
  sources: SourcesData;
  bibliography: {
    ancient_texts?: string[];
    modern_research?: string[];
    channeled_sources?: string[];
    academic_foundations?: string[];
  };
}

interface SourcesResponse {
  version: string;
  generated: string;
  description: string;
  methodology: {
    framework: string;
    research_hours: string;
    source_standards: string;
    academic_foundations: string[];
  };
  star_systems: Record<string, StarSystemData>;
  source_library: {
    categories: string[];
    total_sources: string;
    library_path: string;
  };
}

export function useStarSystemSources() {
  const [data, setData] = useState<SourcesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadSources() {
      try {
        const response = await fetch('/data/star_system_sources.json');
        if (!response.ok) {
          throw new Error('Failed to load sources data');
        }
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    loadSources();
  }, []);

  const getSystemSources = (system: string): StarSystemData | null => {
    if (!data) return null;
    
    // Normalize system name (e.g., "Pleiades" -> "pleiades")
    const normalizedSystem = system.toLowerCase().replace(/\s+/g, '-');
    return data.star_systems[normalizedSystem] || null;
  };

  return {
    data,
    loading,
    error,
    getSystemSources,
    methodology: data?.methodology,
    sourceLibrary: data?.source_library
  };
}
