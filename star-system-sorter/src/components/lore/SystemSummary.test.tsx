import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SystemSummary } from './SystemSummary';
import type { ClassificationResult } from '@/lib/schemas';

describe('SystemSummary', () => {
  const mockPrimaryClassification: ClassificationResult = {
    classification: 'primary',
    primary: 'PLEIADES',
    allies: [
      { system: 'SIRIUS', percentage: 25 },
      { system: 'LYRA', percentage: 15 },
    ],
    percentages: {
      PLEIADES: 45,
      SIRIUS: 25,
      LYRA: 15,
      ANDROMEDA: 10,
      ORION: 5,
    },
    contributorsPerSystem: {},
    contributorsWithWeights: {},
    meta: {
      canonVersion: '1.0.0',
      canonChecksum: 'abc123',
      lore_version: '2025.10.18',
      rules_hash: 'test123',
      input_hash: 'input123',
    },
  };

  const mockHybridClassification: ClassificationResult = {
    classification: 'hybrid',
    hybrid: ['PLEIADES', 'SIRIUS'],
    allies: [{ system: 'LYRA', percentage: 15 }],
    percentages: {
      PLEIADES: 38,
      SIRIUS: 35,
      LYRA: 15,
      ANDROMEDA: 10,
      ORION: 2,
    },
    contributorsPerSystem: {},
    contributorsWithWeights: {},
    meta: {
      canonVersion: '1.0.0',
      canonChecksum: 'abc123',
      lore_version: '2025.10.18',
      rules_hash: 'test123',
      input_hash: 'input123',
    },
  };

  it('renders classification title and lore version', () => {
    render(<SystemSummary classification={mockPrimaryClassification} />);
    
    expect(screen.getByText('Star System Classification')).toBeInTheDocument();
    expect(screen.getByText(/Lore v2025\.10\.18/)).toBeInTheDocument();
  });

  it('displays top 3 systems with percentages', () => {
    render(<SystemSummary classification={mockPrimaryClassification} />);
    
    // Top 3 systems should be visible
    expect(screen.getByText(/Pleiades/)).toBeInTheDocument();
    expect(screen.getByText(/Sirius/)).toBeInTheDocument();
    expect(screen.getByText(/Lyra/)).toBeInTheDocument();
    
    // Percentages should be rounded
    expect(screen.getByText(/45%/)).toBeInTheDocument();
    expect(screen.getByText(/25%/)).toBeInTheDocument();
    expect(screen.getByText(/15%/)).toBeInTheDocument();
  });

  it('shows hybrid indicator for hybrid classification', () => {
    render(<SystemSummary classification={mockHybridClassification} />);
    
    const hybridText = screen.getByText(/Hybrid: Pleiades \+ Sirius \(Δ 3\.0%\)/);
    expect(hybridText).toBeInTheDocument();
  });

  it('does not show hybrid indicator for primary classification', () => {
    render(<SystemSummary classification={mockPrimaryClassification} />);
    
    const hybridText = screen.queryByText(/Hybrid:/);
    expect(hybridText).not.toBeInTheDocument();
  });

  it('uses gold variant for top system and lavender for others', () => {
    const { container } = render(<SystemSummary classification={mockPrimaryClassification} />);
    
    // Check that chips are rendered (implementation detail: gold has different gradient)
    const chips = container.querySelectorAll('[class*="gradient"]');
    expect(chips.length).toBeGreaterThan(0);
  });

  it('handles missing lore_version gracefully', () => {
    const classificationWithoutLoreVersion: ClassificationResult = {
      ...mockPrimaryClassification,
      meta: {
        canonVersion: '1.0.0',
        canonChecksum: 'abc123',
      },
    };
    
    render(<SystemSummary classification={classificationWithoutLoreVersion} />);
    
    // Should fall back to loreBundle.lore_version
    expect(screen.getByText(/Lore v/)).toBeInTheDocument();
  });

  it('calculates delta correctly for hybrid classification', () => {
    const hybridWith5PercentDelta: ClassificationResult = {
      ...mockHybridClassification,
      percentages: {
        PLEIADES: 40,
        SIRIUS: 35,
        LYRA: 15,
        ANDROMEDA: 10,
      },
    };
    
    render(<SystemSummary classification={hybridWith5PercentDelta} />);
    
    expect(screen.getByText(/Δ 5\.0%/)).toBeInTheDocument();
  });
});
