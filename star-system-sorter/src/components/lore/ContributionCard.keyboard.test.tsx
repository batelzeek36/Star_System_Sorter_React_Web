import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContributionCard } from './ContributionCard';
import type { EnhancedContributor } from '@/lib/schemas';

describe('ContributionCard Keyboard Accessibility', () => {
  const mockContributor: EnhancedContributor = {
    ruleId: 'test-rule-1',
    key: 'gate_1',
    label: 'Gate 1: The Creative',
    rationale: 'This gate represents creative energy',
    weight: 10,
    confidence: 4,
    sources: ['law-of-one', 'ra-uru-hu'],
  };

  it('closes expanded details when Escape key is pressed', async () => {
    render(
      <ContributionCard
        contributor={mockContributor}
        totalWeight={100}
        systemId="pleiades"
      />
    );

    // Find and click the details button to expand
    const detailsButton = screen.getByRole('button', { name: /show details/i });
    fireEvent.click(detailsButton);

    // Verify details are visible
    const detailsSection = screen.getByText(/Rule ID:/i);
    expect(detailsSection).toBeInTheDocument();

    // Press Escape key
    fireEvent.keyDown(document, { key: 'Escape' });

    // Verify details are hidden
    expect(screen.queryByText(/Rule ID:/i)).not.toBeInTheDocument();
  });

  it('returns focus to details button after closing with Escape', async () => {
    render(
      <ContributionCard
        contributor={mockContributor}
        totalWeight={100}
        systemId="pleiades"
      />
    );

    // Find and click the details button to expand
    const detailsButton = screen.getByRole('button', { name: /show details/i });
    fireEvent.click(detailsButton);

    // Press Escape key
    fireEvent.keyDown(document, { key: 'Escape' });

    // Verify focus returned to button
    expect(detailsButton).toHaveFocus();
  });

  it('does not close when other keys are pressed', async () => {
    render(
      <ContributionCard
        contributor={mockContributor}
        totalWeight={100}
        systemId="pleiades"
      />
    );

    // Expand details
    const detailsButton = screen.getByRole('button', { name: /show details/i });
    fireEvent.click(detailsButton);

    // Verify details are visible
    expect(screen.getByText(/Rule ID:/i)).toBeInTheDocument();

    // Press other keys
    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: 'Space' });
    fireEvent.keyDown(document, { key: 'Tab' });

    // Verify details are still visible
    expect(screen.getByText(/Rule ID:/i)).toBeInTheDocument();
  });

  it('has proper ARIA attributes for expandable section', () => {
    render(
      <ContributionCard
        contributor={mockContributor}
        totalWeight={100}
        systemId="pleiades"
      />
    );

    const detailsButton = screen.getByRole('button', { name: /show details/i });
    
    // Check initial state
    expect(detailsButton).toHaveAttribute('aria-expanded', 'false');
    expect(detailsButton).toHaveAttribute('aria-controls', `details-${mockContributor.ruleId}`);

    // Expand
    fireEvent.click(detailsButton);
    
    // Check expanded state
    expect(detailsButton).toHaveAttribute('aria-expanded', 'true');
  });
});
