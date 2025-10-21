import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DossierScreen from './DossierScreen';
import { useBirthDataStore } from '@/store/birthDataStore';
import type { ClassificationResult, HDExtract } from '@/lib/schemas';

// Mock the lore bundle
vi.mock('@/lib/lore.bundle', () => ({
  loreBundle: {
    lore_version: '1.0.0',
    tieThreshold: 6,
    systems: [
      { id: 'pleiades', label: 'Pleiades', description: 'The Seven Sisters collective' },
      { id: 'sirius', label: 'Sirius', description: 'The Dog Star wisdom keepers' },
      { id: 'lyra', label: 'Lyra', description: 'The Harp constellation' }
    ],
    sources: [
      { id: 'source1', title: 'Test Source', author: 'Test Author', year: 2020, disputed: false },
      { id: 'source2', title: 'Disputed Source', author: 'Test', year: 2021, disputed: true }
    ],
    rules: [
      {
        id: 'test-rule-1',
        systems: [{ id: 'pleiades', w: 10 }],
        if: { channelsAny: ['34-57'] },
        rationale: 'Test channel rule',
        sources: ['source1'],
        confidence: 5
      }
    ]
  }
}));

// Mock the UI store
vi.mock('@/store/uiStore', () => ({
  useUIStore: () => ({
    hideDisputed: false,
    minConfidence: 1
  })
}));

describe('DossierScreen Performance', () => {
  const mockHDData: HDExtract = {
    type: 'Generator',
    authority: 'Sacral',
    profile: '1/3',
    centers: ['Sacral', 'Root', 'Spleen'],
    channels: [34, 57],
    gates: [1, 2, 3, 34, 57]
  };

  const mockClassification: ClassificationResult = {
    classification: 'primary',
    primary: 'Pleiades',
    hybrid: undefined,
    allies: [
      { system: 'Sirius', percentage: 25 },
      { system: 'Lyra', percentage: 15 }
    ],
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
          key: 'channel',
          weight: 10,
          label: '34-57',
          rationale: 'Test channel rule',
          sources: ['source1'],
          confidence: 5
        }
      ],
      'Sirius': [],
      'Lyra': []
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

  it('should render in under 200ms after classification data is available', () => {
    const startTime = performance.now();
    
    const { container } = render(
      <BrowserRouter>
        <DossierScreen />
      </BrowserRouter>
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Verify the component rendered
    expect(container).toBeTruthy();
    
    // Verify render time is under 200ms
    expect(renderTime).toBeLessThan(200);
    
    console.log(`DossierScreen render time: ${renderTime.toFixed(2)}ms`);
  });

  it('should render efficiently with many contributors', () => {
    // Create a classification with many contributors across multiple systems
    const createContributors = (count: number, systemId: string) =>
      Array.from({ length: count }, (_, i) => ({
        ruleId: `${systemId}-rule-${i}`,
        key: 'gate',
        weight: Math.random() * 10,
        label: `Gate ${i}`,
        rationale: `Test rationale for ${systemId} gate ${i}`,
        sources: i % 2 === 0 ? ['source1'] : ['source2'],
        confidence: (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5
      }));

    const classificationWithManyContributors: ClassificationResult = {
      ...mockClassification,
      enhancedContributorsWithWeights: {
        'Pleiades': createContributors(50, 'pleiades'),
        'Sirius': createContributors(30, 'sirius'),
        'Lyra': createContributors(20, 'lyra'),
        'Andromeda': createContributors(15, 'andromeda'),
        'Orion': createContributors(10, 'orion'),
        'Arcturus': createContributors(5, 'arcturus')
      }
    };

    useBirthDataStore.setState({
      classification: classificationWithManyContributors
    });

    const startTime = performance.now();
    
    const { container } = render(
      <BrowserRouter>
        <DossierScreen />
      </BrowserRouter>
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Verify the component rendered
    expect(container).toBeTruthy();
    
    // Even with many contributors, should still be under 200ms
    expect(renderTime).toBeLessThan(200);
    
    console.log(`DossierScreen render time with 130 total contributors: ${renderTime.toFixed(2)}ms`);
  });

  it('should efficiently compute Why Not section', () => {
    // Create a classification with contributors for all systems
    const createContributors = (count: number, systemId: string) =>
      Array.from({ length: count }, (_, i) => ({
        ruleId: `${systemId}-rule-${i}`,
        key: 'gate',
        weight: 10 - i * 0.1, // Descending weights
        label: `Gate ${i}`,
        rationale: `Test rationale for ${systemId} gate ${i}`,
        sources: ['source1'],
        confidence: 5 as const
      }));

    const classificationWithAllSystems: ClassificationResult = {
      ...mockClassification,
      enhancedContributorsWithWeights: {
        'Pleiades': createContributors(20, 'pleiades'),
        'Sirius': createContributors(20, 'sirius'),
        'Lyra': createContributors(20, 'lyra'),
        'Andromeda': createContributors(20, 'andromeda'),
        'Orion': createContributors(20, 'orion'),
        'Arcturus': createContributors(20, 'arcturus')
      }
    };

    useBirthDataStore.setState({
      classification: classificationWithAllSystems
    });

    const startTime = performance.now();
    
    const { container } = render(
      <BrowserRouter>
        <DossierScreen />
      </BrowserRouter>
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Verify the component rendered
    expect(container).toBeTruthy();
    
    // Computing Why Not section should not significantly impact performance
    expect(renderTime).toBeLessThan(200);
    
    console.log(`DossierScreen render time with Why Not computation: ${renderTime.toFixed(2)}ms`);
  });

  it('should efficiently deduplicate sources in Sources Gallery', () => {
    // Create contributors with many duplicate sources
    const contributors = Array.from({ length: 40 }, (_, i) => ({
      ruleId: `rule-${i}`,
      key: 'gate',
      weight: Math.random() * 10,
      label: `Gate ${i}`,
      rationale: `Test rationale ${i}`,
      sources: i % 2 === 0 ? ['source1'] : ['source2'], // Only 2 unique sources
      confidence: 5 as const
    }));

    const classificationWithDuplicateSources: ClassificationResult = {
      ...mockClassification,
      enhancedContributorsWithWeights: {
        'Pleiades': contributors
      }
    };

    useBirthDataStore.setState({
      classification: classificationWithDuplicateSources
    });

    const startTime = performance.now();
    
    const { container } = render(
      <BrowserRouter>
        <DossierScreen />
      </BrowserRouter>
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Verify the component rendered
    expect(container).toBeTruthy();
    
    // Source deduplication should be efficient
    expect(renderTime).toBeLessThan(200);
    
    console.log(`DossierScreen render time with source deduplication: ${renderTime.toFixed(2)}ms`);
  });
});
