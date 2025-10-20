import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import WhyScreen from './WhyScreen';
import { useBirthDataStore } from '@/store/birthDataStore';
import type { ClassificationResult, HDExtract } from '@/lib/schemas';

// Mock the lore bundle
vi.mock('@/lib/lore.bundle', () => ({
  loreBundle: {
    lore_version: '1.0.0',
    tieThreshold: 6,
    systems: [
      { id: 'pleiades', label: 'Pleiades', description: 'Test' },
      { id: 'sirius', label: 'Sirius', description: 'Test' }
    ],
    sources: [
      { id: 'source1', title: 'Test Source', author: 'Test', year: 2020, disputed: false }
    ],
    rules: []
  }
}));

// Mock the lore version check hook
vi.mock('@/hooks/useLoreVersionCheck', () => ({
  useLoreVersionCheck: () => ({
    hasChanged: false,
    currentVersion: '1.0',
    storedVersion: '1.0'
  })
}));

// Mock the classification hook
vi.mock('@/hooks/useClassification', () => ({
  useClassification: () => ({
    recompute: vi.fn(),
    isLoading: false
  })
}));

// Mock the UI store
vi.mock('@/store/uiStore', () => ({
  useUIStore: () => ({
    hideDisputed: false,
    minConfidence: 1
  })
}));

describe('WhyScreen Performance', () => {
  const mockHDData: HDExtract = {
    type: 'Generator',
    authority: 'Sacral',
    profile: '1/3',
    centers: ['Sacral', 'Root'],
    channels: [34, 57],
    gates: [1, 2, 3]
  };

  const mockClassification: ClassificationResult = {
    classification: 'primary',
    primary: 'Pleiades',
    hybrid: undefined,
    allies: [{ system: 'Sirius', percentage: 25 }],
    percentages: {
      'Pleiades': 45,
      'Sirius': 25,
      'Lyra': 15,
      'Andromeda': 10,
      'Orion': 3,
      'Arcturus': 2
    },
    contributorsPerSystem: {},
    contributorsWithWeights: {},
    enhancedContributorsWithWeights: {
      'Pleiades': [
        {
          ruleId: 'test-rule-1',
          key: 'type',
          weight: 10,
          label: 'Generator',
          rationale: 'Test rationale',
          sources: ['source1'],
          confidence: 5
        }
      ]
    },
    meta: {
      lore_version: '1.0',
      rules_hash: 'test-hash',
      input_hash: 'test-input-hash',
      canonVersion: '1.0',
      canonChecksum: 'test-checksum'
    }
  };

  beforeEach(() => {
    // Set up the store with mock data
    useBirthDataStore.setState({
      hdData: mockHDData,
      classification: mockClassification,
      date: '01/01/1990',
      time: '12:00 PM',
      location: 'New York, NY',
      timeZone: 'America/New_York'
    });
  });

  it('should render in under 50ms after classification data is available', () => {
    const startTime = performance.now();
    
    const { container } = render(
      <BrowserRouter>
        <WhyScreen />
      </BrowserRouter>
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Verify the component rendered
    expect(container).toBeTruthy();
    
    // Verify render time is under 50ms
    expect(renderTime).toBeLessThan(50);
    
    console.log(`WhyScreen render time: ${renderTime.toFixed(2)}ms`);
  });

  it('should render efficiently with many contributors', () => {
    // Create a classification with many contributors (75+)
    const manyContributors = Array.from({ length: 100 }, (_, i) => ({
      ruleId: `rule-${i}`,
      key: 'gate',
      weight: Math.random() * 10,
      label: `Gate ${i}`,
      rationale: `Test rationale for gate ${i}`,
      sources: ['source1'],
      confidence: Math.floor(Math.random() * 5) + 1 as 1 | 2 | 3 | 4 | 5
    }));

    const classificationWithManyContributors: ClassificationResult = {
      ...mockClassification,
      enhancedContributorsWithWeights: {
        'Pleiades': manyContributors
      }
    };

    useBirthDataStore.setState({
      classification: classificationWithManyContributors
    });

    const startTime = performance.now();
    
    const { container } = render(
      <BrowserRouter>
        <WhyScreen />
      </BrowserRouter>
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Verify the component rendered
    expect(container).toBeTruthy();
    
    // Even with many contributors, should still be reasonably fast
    // We allow more time for the initial render with many items
    expect(renderTime).toBeLessThan(100);
    
    console.log(`WhyScreen render time with ${manyContributors.length} contributors: ${renderTime.toFixed(2)}ms`);
  });

  it('should efficiently filter contributors', () => {
    // Create a classification with many contributors
    const contributors = Array.from({ length: 50 }, (_, i) => ({
      ruleId: `rule-${i}`,
      key: 'gate',
      weight: Math.random() * 10,
      label: `Gate ${i}`,
      rationale: `Test rationale for gate ${i}`,
      sources: ['source1'],
      confidence: (i % 5 + 1) as 1 | 2 | 3 | 4 | 5
    }));

    const classificationWithContributors: ClassificationResult = {
      ...mockClassification,
      enhancedContributorsWithWeights: {
        'Pleiades': contributors
      }
    };

    useBirthDataStore.setState({
      classification: classificationWithContributors
    });

    const startTime = performance.now();
    
    const { container } = render(
      <BrowserRouter>
        <WhyScreen />
      </BrowserRouter>
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Verify the component rendered
    expect(container).toBeTruthy();
    
    // Filtering should not significantly impact performance
    // Allow slightly more time for this test due to test environment variance
    expect(renderTime).toBeLessThan(75);
    
    console.log(`WhyScreen render time with filtering: ${renderTime.toFixed(2)}ms`);
  });
});
