import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useStarSystemSources } from './useStarSystemSources';

// Mock fetch
global.fetch = vi.fn();

describe('useStarSystemSources', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load sources data successfully', async () => {
    const mockData = {
      version: '1.0',
      generated: '2025-11-03',
      methodology: {
        framework: 'Test framework',
        research_hours: '100 hours',
        source_standards: 'Test standards',
        academic_foundations: ['Test foundation']
      },
      star_systems: {
        pleiades: {
          name: 'Pleiades',
          version: '4.2',
          last_updated: '2025-10-27',
          core_themes: ['Theme 1', 'Theme 2'],
          shadow_themes: ['Shadow 1'],
          sources: {
            core_sources: [],
            shadow_sources: [],
            all_sources: [],
            source_count: 0
          },
          bibliography: {}
        }
      },
      source_library: {
        categories: ['Category 1'],
        total_sources: '400+',
        library_path: 'test/path'
      }
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const { result } = renderHook(() => useStarSystemSources());

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });

  it('should handle fetch errors', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useStarSystemSources());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Network error');
  });

  it('should get system sources by name', async () => {
    const mockData = {
      version: '1.0',
      generated: '2025-11-03',
      methodology: {
        framework: 'Test',
        research_hours: '100',
        source_standards: 'Test',
        academic_foundations: []
      },
      star_systems: {
        pleiades: {
          name: 'Pleiades',
          version: '4.2',
          last_updated: '2025-10-27',
          core_themes: ['Theme 1'],
          shadow_themes: [],
          sources: {
            core_sources: [],
            shadow_sources: [],
            all_sources: [],
            source_count: 5
          },
          bibliography: {}
        }
      },
      source_library: {
        categories: [],
        total_sources: '400+',
        library_path: 'test'
      }
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const { result } = renderHook(() => useStarSystemSources());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const pleiadesData = result.current.getSystemSources('Pleiades');
    expect(pleiadesData).toBeDefined();
    expect(pleiadesData?.name).toBe('Pleiades');
    expect(pleiadesData?.sources.source_count).toBe(5);

    // Test case-insensitive lookup
    const pleiadesData2 = result.current.getSystemSources('PLEIADES');
    expect(pleiadesData2).toBeDefined();
    expect(pleiadesData2?.name).toBe('Pleiades');
  });

  it('should return null for unknown system', async () => {
    const mockData = {
      version: '1.0',
      generated: '2025-11-03',
      methodology: {
        framework: 'Test',
        research_hours: '100',
        source_standards: 'Test',
        academic_foundations: []
      },
      star_systems: {},
      source_library: {
        categories: [],
        total_sources: '400+',
        library_path: 'test'
      }
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const { result } = renderHook(() => useStarSystemSources());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const unknownData = result.current.getSystemSources('Unknown System');
    expect(unknownData).toBe(null);
  });
});
