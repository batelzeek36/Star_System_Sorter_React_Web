import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SourceBadge } from './SourceBadge';

describe('SourceBadge', () => {
  it('renders source title from loreBundle', () => {
    render(<SourceBadge sourceId="s-ra-1984" />);
    expect(screen.getByText(/The Law of One/i)).toBeInTheDocument();
  });

  it('prepends ⚑ flag for disputed sources', () => {
    render(<SourceBadge sourceId="s-marciniak-1992" />);
    expect(screen.getByText(/⚑ Bringers of the Dawn/i)).toBeInTheDocument();
  });

  it('does not prepend ⚑ flag for non-disputed sources', () => {
    render(<SourceBadge sourceId="s-ra-1984" />);
    const text = screen.getByText(/The Law of One/i).textContent;
    expect(text).not.toContain('⚑');
  });

  it('shows tooltip on hover when showTooltip is true', async () => {
    const user = userEvent.setup();
    render(<SourceBadge sourceId="s-ra-1984" showTooltip={true} />);
    
    const badge = screen.getByRole('button');
    await user.hover(badge);
    
    // Tooltip should show author and year
    expect(screen.getByText(/L\/L Research/i)).toBeInTheDocument();
    expect(screen.getByText(/1984/i)).toBeInTheDocument();
  });

  it('shows tooltip on keyboard focus', async () => {
    const user = userEvent.setup();
    render(<SourceBadge sourceId="s-ra-1984" showTooltip={true} />);
    
    const badge = screen.getByRole('button');
    await user.tab(); // Focus the badge
    
    // Tooltip should show
    expect(screen.getByText(/L\/L Research/i)).toBeInTheDocument();
  });

  it('does not show tooltip when showTooltip is false', async () => {
    const user = userEvent.setup();
    render(<SourceBadge sourceId="s-ra-1984" showTooltip={false} />);
    
    const badge = screen.getByRole('button');
    await user.hover(badge);
    
    // Tooltip should not show
    expect(screen.queryByText(/L\/L Research/i)).not.toBeInTheDocument();
  });

  it('shows disputed warning in tooltip for disputed sources', async () => {
    const user = userEvent.setup();
    render(<SourceBadge sourceId="s-marciniak-1992" showTooltip={true} />);
    
    const badge = screen.getByRole('button');
    await user.hover(badge);
    
    expect(screen.getByText(/Disputed or controversial lore/i)).toBeInTheDocument();
  });

  it('is keyboard accessible with tabIndex=0', () => {
    render(<SourceBadge sourceId="s-ra-1984" />);
    const badge = screen.getByRole('button');
    expect(badge).toHaveAttribute('tabIndex', '0');
  });

  it('has aria-describedby when showTooltip is true', () => {
    render(<SourceBadge sourceId="s-ra-1984" showTooltip={true} />);
    const badge = screen.getByRole('button');
    expect(badge).toHaveAttribute('aria-describedby');
  });

  it('does not have aria-describedby when showTooltip is false', () => {
    render(<SourceBadge sourceId="s-ra-1984" showTooltip={false} />);
    const badge = screen.getByRole('button');
    expect(badge).not.toHaveAttribute('aria-describedby');
  });

  it('renders fallback for unknown source ID', () => {
    render(<SourceBadge sourceId="unknown-source" />);
    expect(screen.getByText('unknown-source')).toBeInTheDocument();
  });
});
