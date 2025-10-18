import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContributionCard } from './ContributionCard';
import type { EnhancedContributor } from '@/lib/schemas';

describe('ContributionCard', () => {
  const mockContributor: EnhancedContributor = {
    ruleId: 'type_generator_pleiades',
    key: 'type:Generator',
    weight: 2.5,
    label: 'Generator Type',
    rationale: 'Generative life force (Sacral) → creative, communal cultivation; primordial craft lineages.',
    sources: ['s-marciniak-1992', 's-royal-1992'],
    confidence: 2,
  };

  it('renders contributor label and key', () => {
    render(<ContributionCard contributor={mockContributor} totalWeight={10} systemId="PLEIADES" />);
    expect(screen.getByText('Generator Type')).toBeInTheDocument();
    expect(screen.getByText('type:Generator')).toBeInTheDocument();
  });

  it('displays correct percentage based on weight and totalWeight', () => {
    render(<ContributionCard contributor={mockContributor} totalWeight={10} systemId="PLEIADES" />);
    // 2.5 / 10 * 100 = 25.0%
    expect(screen.getByText('25.0%')).toBeInTheDocument();
  });

  it('renders rationale text', () => {
    render(<ContributionCard contributor={mockContributor} totalWeight={10} systemId="PLEIADES" />);
    expect(screen.getByText(/Generative life force/i)).toBeInTheDocument();
  });

  it('displays confidence level as dots', () => {
    render(<ContributionCard contributor={mockContributor} totalWeight={10} systemId="PLEIADES" />);
    // Confidence 2 should show ●●○○○
    const confidenceDots = screen.getByText('●●○○○');
    expect(confidenceDots).toBeInTheDocument();
  });

  it('renders all source badges', () => {
    render(<ContributionCard contributor={mockContributor} totalWeight={10} systemId="PLEIADES" />);
    expect(screen.getByText(/Bringers of the Dawn/i)).toBeInTheDocument();
    expect(screen.getByText(/Prism of Lyra/i)).toBeInTheDocument();
  });

  it('has collapsible details section that starts collapsed', () => {
    render(<ContributionCard contributor={mockContributor} totalWeight={10} systemId="PLEIADES" />);
    const toggleButton = screen.getByRole('button', { name: /Show Details/i });
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('expands details section when toggle button is clicked', async () => {
    const user = userEvent.setup();
    render(<ContributionCard contributor={mockContributor} totalWeight={10} systemId="PLEIADES" />);
    
    const toggleButton = screen.getByRole('button', { name: /Show Details/i });
    await user.click(toggleButton);
    
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/Hide Details/i)).toBeInTheDocument();
    expect(screen.getByText('type_generator_pleiades')).toBeInTheDocument();
    expect(screen.getByText('2.50')).toBeInTheDocument();
  });

  it('collapses details section when toggle button is clicked again', async () => {
    const user = userEvent.setup();
    render(<ContributionCard contributor={mockContributor} totalWeight={10} systemId="PLEIADES" />);
    
    const toggleButton = screen.getByRole('button', { name: /Show Details/i });
    await user.click(toggleButton);
    await user.click(toggleButton);
    
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('type_generator_pleiades')).not.toBeInTheDocument();
  });

  it('renders percentage bar with correct width', () => {
    render(<ContributionCard contributor={mockContributor} totalWeight={10} systemId="PLEIADES" />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '25');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('handles zero totalWeight gracefully', () => {
    render(<ContributionCard contributor={mockContributor} totalWeight={0} systemId="PLEIADES" />);
    expect(screen.getByText('0.0%')).toBeInTheDocument();
  });

  it('displays confidence level 5 correctly', () => {
    const highConfidenceContributor: EnhancedContributor = {
      ...mockContributor,
      confidence: 5,
    };
    render(<ContributionCard contributor={highConfidenceContributor} totalWeight={10} systemId="PLEIADES" />);
    expect(screen.getByText('●●●●●')).toBeInTheDocument();
  });

  it('displays confidence level 1 correctly', () => {
    const lowConfidenceContributor: EnhancedContributor = {
      ...mockContributor,
      confidence: 1,
    };
    render(<ContributionCard contributor={lowConfidenceContributor} totalWeight={10} systemId="PLEIADES" />);
    expect(screen.getByText('●○○○○')).toBeInTheDocument();
  });
});
