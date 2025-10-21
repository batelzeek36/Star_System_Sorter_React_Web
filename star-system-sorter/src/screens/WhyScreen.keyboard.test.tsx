import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import WhyScreen from './WhyScreen';
import { useBirthDataStore } from '@/store/birthDataStore';
import type { ClassificationResult, HDExtract } from '@/lib/schemas';

// Mock the lore version check hook
vi.mock('@/hooks/useLoreVersionCheck', () => ({
  useLoreVersionCheck: () => ({
    hasChanged: false,
    currentVersion: '1.0.0',
    classificationVersion: '1.0.0',
  }),
}));

// Mock the classification hook
vi.mock('@/hooks/useClassification', () => ({
  useClassification: () => ({
    recompute: vi.fn(),
    isLoading: false,
  }),
}));

describe('WhyScreen Keyboard Accessibility', () => {
  const mockHDData: HDExtract = {
    type: 'Manifestor',
    authority: 'Emotional',
    profile: '1/3',
    centers: ['Throat', 'Solar Plexus'],
    channels: [13, 33],
    gates: [1, 13, 33],
  };

  const mockClassification: ClassificationResult = {
    classification: 'primary',
    primary: 'Pleiades',
    allies: [
      { system: 'Sirius', percentage: 15.5 },
      { system: 'Lyra', percentage: 12.3 },
    ],
    percentages: {
      Pleiades: 45.2,
      Sirius: 15.5,
      Lyra: 12.3,
      Andromeda: 10.1,
      Orion: 8.9,
      Arcturus: 8.0,
    },
    contributorsPerSystem: {},
    contributorsWithWeights: {},
    meta: {
      canonVersion: '1.0.0',
      canonChecksum: 'test-checksum',
      lore_version: '1.0.0',
    },
    enhancedContributorsWithWeights: {
      Pleiades: [
        {
          ruleId: 'rule-1',
          key: 'gate_1',
          label: 'Gate 1',
          rationale: 'Test rationale',
          weight: 10,
          confidence: 4,
          sources: ['law-of-one'],
        },
      ],
      Sirius: [
        {
          ruleId: 'rule-2',
          key: 'gate_2',
          label: 'Gate 2',
          rationale: 'Test rationale 2',
          weight: 5,
          confidence: 3,
          sources: ['law-of-one'],
        },
      ],
      Lyra: [
        {
          ruleId: 'rule-3',
          key: 'gate_3',
          label: 'Gate 3',
          rationale: 'Test rationale 3',
          weight: 3,
          confidence: 3,
          sources: ['law-of-one'],
        },
      ],
    },
  };

  beforeEach(() => {
    // Set up the store with mock data
    useBirthDataStore.setState({
      hdData: mockHDData,
      classification: mockClassification,
    });
  });

  it('navigates tabs with ArrowRight key', () => {
    render(
      <BrowserRouter>
        <WhyScreen />
      </BrowserRouter>
    );

    // Find the first tab (Pleiades)
    const pleiadesTab = screen.getByRole('tab', { name: /pleiades/i });
    pleiadesTab.focus();

    // Verify Pleiades is selected
    expect(pleiadesTab).toHaveAttribute('aria-selected', 'true');

    // Press ArrowRight
    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });

    // Verify Sirius is now selected
    const siriusTab = screen.getByRole('tab', { name: /sirius/i });
    expect(siriusTab).toHaveAttribute('aria-selected', 'true');
  });

  it('navigates tabs with ArrowLeft key', () => {
    render(
      <BrowserRouter>
        <WhyScreen />
      </BrowserRouter>
    );

    // Find and focus the first tab
    const pleiadesTab = screen.getByRole('tab', { name: /pleiades/i });
    pleiadesTab.focus();

    // Press ArrowLeft (should wrap to last tab)
    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'ArrowLeft' });

    // Verify Lyra (last tab) is now selected
    const lyraTab = screen.getByRole('tab', { name: /lyra/i });
    expect(lyraTab).toHaveAttribute('aria-selected', 'true');
  });

  it('wraps around when navigating past the last tab', () => {
    render(
      <BrowserRouter>
        <WhyScreen />
      </BrowserRouter>
    );

    // Find the last tab (Lyra)
    const lyraTab = screen.getByRole('tab', { name: /lyra/i });
    
    // Click to select it first
    fireEvent.click(lyraTab);
    lyraTab.focus();

    // Press ArrowRight (should wrap to first tab)
    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });

    // Verify Pleiades is now selected
    const pleiadesTab = screen.getByRole('tab', { name: /pleiades/i });
    expect(pleiadesTab).toHaveAttribute('aria-selected', 'true');
  });

  it('has proper ARIA attributes for tabs', () => {
    render(
      <BrowserRouter>
        <WhyScreen />
      </BrowserRouter>
    );

    // Check tablist
    const tablist = screen.getByRole('tablist');
    expect(tablist).toHaveAttribute('aria-label', 'Star system tabs');

    // Check tabs
    const pleiadesTab = screen.getByRole('tab', { name: /pleiades/i });
    expect(pleiadesTab).toHaveAttribute('aria-selected');
    expect(pleiadesTab).toHaveAttribute('aria-controls');
    expect(pleiadesTab).toHaveAttribute('tabIndex');

    // Check tabpanel
    const tabpanel = screen.getByRole('tabpanel');
    expect(tabpanel).toHaveAttribute('id');
    expect(tabpanel).toHaveAttribute('aria-labelledby');
  });

  it('only active tab is in tab order', () => {
    render(
      <BrowserRouter>
        <WhyScreen />
      </BrowserRouter>
    );

    const pleiadesTab = screen.getByRole('tab', { name: /pleiades/i });
    const siriusTab = screen.getByRole('tab', { name: /sirius/i });
    const lyraTab = screen.getByRole('tab', { name: /lyra/i });

    // Active tab should have tabIndex 0
    expect(pleiadesTab).toHaveAttribute('tabIndex', '0');
    
    // Inactive tabs should have tabIndex -1
    expect(siriusTab).toHaveAttribute('tabIndex', '-1');
    expect(lyraTab).toHaveAttribute('tabIndex', '-1');
  });
});
