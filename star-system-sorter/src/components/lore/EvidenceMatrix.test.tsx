import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { EvidenceMatrix } from './EvidenceMatrix';
import type { EnhancedContributor } from '@/lib/schemas';

// Mock lore bundle
vi.mock('@/lib/lore.bundle', () => ({
  loreBundle: {
    sources: [
      { id: 'law-of-one', title: 'The Law of One', author: 'Ra', year: 1981, disputed: false },
      { id: 'prism-of-lyra', title: 'Prism of Lyra', author: 'Lyssa Royal', year: 1992, disputed: true },
    ],
  },
}));

describe('EvidenceMatrix', () => {
  const mockContributors: EnhancedContributor[] = [
    {
      ruleId: 'rule_1',
      key: 'gate_1',
      weight: 10,
      label: 'Gate 1',
      rationale: 'Test rationale 1',
      sources: ['law-of-one'],
      confidence: 5,
    },
    {
      ruleId: 'rule_2',
      key: 'channel_13-33',
      weight: 8,
      label: 'Channel 13-33',
      rationale: 'Test rationale 2',
      sources: ['prism-of-lyra'],
      confidence: 3,
    },
    {
      ruleId: 'rule_3',
      key: 'center_sacral',
      weight: 6,
      label: 'Sacral Center',
      rationale: 'Test rationale 3',
      sources: ['law-of-one'],
      confidence: 4,
    },
  ];

  beforeEach(async () => {
    // Reset UI store to default state
    const { useUIStore } = await import('@/store/uiStore');
    useUIStore.getState().reset();
  });

  it('renders evidence matrix with contributors', () => {
    render(<EvidenceMatrix contributors={mockContributors} />);
    
    expect(screen.getByText('Evidence Matrix')).toBeInTheDocument();
    expect(screen.getByText('Gate 1')).toBeInTheDocument();
    // Channel 13-33 is filtered out by default (disputed source)
    expect(screen.queryByText('Channel 13-33')).not.toBeInTheDocument();
    expect(screen.getByText('Sacral Center')).toBeInTheDocument();
  });

  it('displays correct attribute types', () => {
    render(<EvidenceMatrix contributors={mockContributors} />);
    
    expect(screen.getByText('Gate')).toBeInTheDocument();
    // Channel is filtered out by default (disputed source)
    expect(screen.queryByText('Channel')).not.toBeInTheDocument();
    expect(screen.getByText('Center')).toBeInTheDocument();
  });

  it('sorts contributors by weight descending', () => {
    render(<EvidenceMatrix contributors={mockContributors} />);
    
    const rows = screen.getAllByRole('row');
    // Skip header row
    const dataRows = rows.slice(1);
    
    // With default filters (hideDisputed=true), only 2 rows should be visible
    expect(dataRows).toHaveLength(2);
    // First data row should be Gate 1 (weight 10)
    expect(dataRows[0]).toHaveTextContent('Gate 1');
    // Second should be Sacral Center (weight 6) - Channel 13-33 is filtered out
    expect(dataRows[1]).toHaveTextContent('Sacral Center');
  });

  it('filters out disputed sources when hideDisputed is true', async () => {
    const user = userEvent.setup();
    render(<EvidenceMatrix contributors={mockContributors} />);
    
    // Initially hideDisputed is true by default
    expect(screen.queryByText('Channel 13-33')).not.toBeInTheDocument();
    
    // Uncheck the hide disputed checkbox
    const checkbox = screen.getByRole('checkbox', { name: /hide disputed/i });
    await user.click(checkbox);
    
    // Now disputed contributor should be visible
    expect(screen.getByText('Channel 13-33')).toBeInTheDocument();
  });

  it('filters by minimum confidence level', async () => {
    const user = userEvent.setup();
    render(<EvidenceMatrix contributors={mockContributors} />);
    
    // Set min confidence to 4 using click to change slider value
    const slider = screen.getByRole('slider', { name: /minimum confidence/i });
    
    // Change slider value by setting it directly
    await user.pointer([
      { target: slider },
      { keys: '[MouseLeft>]', target: slider },
      { keys: '[/MouseLeft]' }
    ]);
    
    // Manually trigger change event
    slider.setAttribute('value', '4');
    slider.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Only contributors with confidence >= 4 should be visible
    expect(screen.getByText('Gate 1')).toBeInTheDocument(); // confidence 5
    expect(screen.getByText('Sacral Center')).toBeInTheDocument(); // confidence 4
    expect(screen.queryByText('Channel 13-33')).not.toBeInTheDocument(); // confidence 3
  });

  it('displays contributor count', () => {
    render(<EvidenceMatrix contributors={mockContributors} />);
    
    // With default filters (hideDisputed=true, minConfidence=2)
    // Should show 2 of 3 (Channel 13-33 is disputed)
    expect(screen.getByText(/2 of 3 contributors/i)).toBeInTheDocument();
  });

  it('highlights active system contributors', () => {
    const contributorsWithSystem = [
      {
        ...mockContributors[0],
        key: 'gate_1_pleiades',
      },
    ];
    
    const { container } = render(
      <EvidenceMatrix contributors={contributorsWithSystem} activeSystemId="PLEIADES" />
    );
    
    // Check if the row has the active highlight class (using a more flexible selector)
    const rows = container.querySelectorAll('tr');
    const activeRow = Array.from(rows).find(row => 
      row.className.includes('bg-[var(--s3-lavender-500)]/10')
    );
    expect(activeRow).toBeTruthy();
  });

  it('shows empty state when no contributors match filters', async () => {
    const user = userEvent.setup();
    
    // Create contributors that will all be filtered out
    const lowConfidenceContributors: EnhancedContributor[] = [
      {
        ruleId: 'rule_low',
        key: 'gate_low',
        weight: 5,
        label: 'Low Confidence Gate',
        rationale: 'Test',
        sources: ['prism-of-lyra'], // disputed
        confidence: 1,
      },
    ];
    
    render(<EvidenceMatrix contributors={lowConfidenceContributors} />);
    
    // With hideDisputed=true and minConfidence=2 (default), this should be filtered out
    expect(screen.getByText(/no contributors match your filters/i)).toBeInTheDocument();
  });

  it('renders confidence dots correctly', () => {
    render(<EvidenceMatrix contributors={mockContributors} />);
    
    // Gate 1 has confidence 5 (●●●●●)
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('●●●●●');
  });

  it('displays weight with 2 decimal places', () => {
    render(<EvidenceMatrix contributors={mockContributors} />);
    
    expect(screen.getByText('10.00')).toBeInTheDocument();
    expect(screen.getByText('6.00')).toBeInTheDocument();
  });
});
