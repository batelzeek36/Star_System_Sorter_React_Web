import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DossierScreen from './DossierScreen';
import { useBirthDataStore } from '@/store/birthDataStore';

// Mock the store
vi.mock('@/store/birthDataStore');

// Mock the lore bundle
vi.mock('@/lib/lore.bundle', () => ({
  loreBundle: {
    lore_version: '1.0.0',
    tieThreshold: 6,
    systems: [
      { id: 'pleiades', label: 'Pleiades', description: 'Test description' },
      { id: 'sirius', label: 'Sirius', description: 'Test description 2' },
    ],
    sources: [
      { id: 'source1', title: 'Test Source', author: 'Test Author', year: 2020, disputed: false },
    ],
    rules: [
      {
        id: 'test-rule',
        systems: [{ id: 'pleiades', w: 10 }],
        if: { typeAny: ['Generator'] },
        rationale: 'Test rationale',
        sources: ['source1'],
        confidence: 5,
      },
    ],
  },
}));

// Mock child components to avoid rendering complexity
vi.mock('@/components/lore/EvidenceMatrix', () => ({
  EvidenceMatrix: () => <div data-testid="evidence-matrix">Evidence Matrix</div>,
}));

vi.mock('@/components/lore/SourceBadge', () => ({
  SourceBadge: ({ sourceId }: { sourceId: string }) => (
    <div data-testid={`source-badge-${sourceId}`}>Source Badge</div>
  ),
}));

describe('DossierScreen - Network Call Verification', () => {
  const mockClassification = {
    classification: 'primary' as const,
    primary: 'Pleiades',
    percentages: {
      'Pleiades': 45.5,
      'Sirius': 30.2,
    },
    enhancedContributorsWithWeights: {
      'Pleiades': [
        {
          ruleId: 'test-rule',
          key: 'type',
          weight: 10,
          label: 'Type: Generator',
          rationale: 'Test rationale',
          sources: ['source1'],
          confidence: 5,
        },
      ],
    },
    meta: {
      lore_version: '1.0.0',
      rules_hash: 'test-hash',
      input_hash: 'test-input-hash',
    },
  };

  const mockHdData = {
    type: 'Generator',
    authority: 'Sacral',
    profile: '1/3',
    centers: ['Sacral', 'Root'],
    channels: [1, 2],
    gates: [1, 2, 3],
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Mock the store to return test data
    vi.mocked(useBirthDataStore).mockReturnValue(mockClassification as any);
    
    // Spy on global fetch to ensure it's never called
    vi.spyOn(global, 'fetch');
  });

  it('should not make any network calls during render', () => {
    // Mock the store to return both classification and hdData
    vi.mocked(useBirthDataStore).mockImplementation((selector: any) => {
      const state = {
        classification: mockClassification,
        hdData: mockHdData,
      };
      return selector(state);
    });

    render(
      <BrowserRouter>
        <DossierScreen />
      </BrowserRouter>
    );

    // Verify that fetch was never called
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should throw error if fetch is called', () => {
    // Mock fetch to throw an error if called
    const mockFetch = vi.fn(() => {
      throw new Error('Network call detected! DossierScreen should not make network requests.');
    });
    global.fetch = mockFetch as any;

    // Mock the store to return test data
    vi.mocked(useBirthDataStore).mockImplementation((selector: any) => {
      const state = {
        classification: mockClassification,
        hdData: mockHdData,
      };
      return selector(state);
    });

    // This should not throw because no network calls should be made
    expect(() => {
      render(
        <BrowserRouter>
          <DossierScreen />
        </BrowserRouter>
      );
    }).not.toThrow();

    // Verify fetch was never called
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should render all sections using only store and lore bundle data', () => {
    // Mock the store to return test data
    vi.mocked(useBirthDataStore).mockImplementation((selector: any) => {
      const state = {
        classification: mockClassification,
        hdData: mockHdData,
      };
      return selector(state);
    });

    render(
      <BrowserRouter>
        <DossierScreen />
      </BrowserRouter>
    );

    // Verify that key sections are rendered (proving data came from store/bundle)
    expect(screen.getByText('Galactic Dossier')).toBeInTheDocument();
    expect(screen.getByText('Identity Snapshot')).toBeInTheDocument();
    expect(screen.getByText('The Verdict')).toBeInTheDocument();
    expect(screen.getByText('Deployment Matrix')).toBeInTheDocument();
    expect(screen.getByText('Sources & References')).toBeInTheDocument();
    
    // Verify no network calls were made
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should have Print/PDF button that triggers window.print', () => {
    // Mock window.print
    const printMock = vi.fn();
    window.print = printMock;

    render(
      <BrowserRouter>
        <DossierScreen />
      </BrowserRouter>
    );

    // Find the Print/PDF button
    const printButton = screen.getByRole('button', { name: /print\/pdf/i });
    expect(printButton).toBeInTheDocument();
    
    // Click the button
    printButton.click();
    
    // Verify window.print was called
    expect(printMock).toHaveBeenCalledTimes(1);
  });
});
