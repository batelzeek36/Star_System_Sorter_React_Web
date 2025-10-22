import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProfileScreen from './ProfileScreen';
import { useBirthDataStore } from '../store/birthDataStore';

// Mock the store
vi.mock('../store/birthDataStore');

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ProfileScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock store state
    vi.mocked(useBirthDataStore).mockReturnValue({
      hdData: {
        type: 'Manifesting Generator',
        authority: 'Sacral',
        profile: '1/3',
        centers: {
          head: true,
          ajna: true,
          throat: true,
          g: true,
          heart: false,
          spleen: true,
          sacral: true,
          solar: false,
          root: true,
        },
        channels: [],
        gates: [],
      },
      classification: {
        classification: 'primary',
        primary: 'Pleiades',
        percentages: {
          Pleiades: 62,
          Sirius: 18,
          Lyra: 12,
          Andromeda: 5,
          Orion: 2,
          Arcturus: 1,
        },
      },
    } as any);
  });

  it('renders profile screen with user data', () => {
    render(
      <BrowserRouter>
        <ProfileScreen />
      </BrowserRouter>
    );

    expect(screen.getByText('Your Profile')).toBeInTheDocument();
    expect(screen.getByText('Manifesting Generator • 1/3')).toBeInTheDocument();
  });

  it('displays star system profile card', () => {
    render(
      <BrowserRouter>
        <ProfileScreen />
      </BrowserRouter>
    );

    expect(screen.getByText('Star System Profile')).toBeInTheDocument();
    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('Allies')).toBeInTheDocument();
  });

  it('shows generate avatar button', () => {
    render(
      <BrowserRouter>
        <ProfileScreen />
      </BrowserRouter>
    );

    const button = screen.getByRole('button', { name: /generate avatar/i });
    expect(button).toBeInTheDocument();
  });

  it('displays settings button', () => {
    render(
      <BrowserRouter>
        <ProfileScreen />
      </BrowserRouter>
    );

    const settingsButton = screen.getByRole('button', { name: /settings/i });
    expect(settingsButton).toBeInTheDocument();
  });

  it('renders tab bar with profile tab active', () => {
    render(
      <BrowserRouter>
        <ProfileScreen />
      </BrowserRouter>
    );

    const profileTab = screen.getByText('Profile');
    expect(profileTab).toBeInTheDocument();
  });

  it('handles missing classification data gracefully', () => {
    vi.mocked(useBirthDataStore).mockReturnValue({
      hdData: null,
      classification: null,
    } as any);

    render(
      <BrowserRouter>
        <ProfileScreen />
      </BrowserRouter>
    );

    expect(screen.getByText('Your Profile')).toBeInTheDocument();
    expect(screen.getByText('Unknown • Unknown')).toBeInTheDocument();
  });

  it('handles hybrid classification', () => {
    vi.mocked(useBirthDataStore).mockReturnValue({
      hdData: {
        type: 'Generator',
        authority: 'Emotional',
        profile: '2/4',
        centers: {},
        channels: [],
        gates: [],
      },
      classification: {
        classification: 'hybrid',
        hybrid: ['Pleiades', 'Sirius'],
        percentages: {
          Pleiades: 45,
          Sirius: 43,
          Lyra: 8,
          Andromeda: 3,
          Orion: 1,
          Arcturus: 0,
        },
      },
    } as any);

    render(
      <BrowserRouter>
        <ProfileScreen />
      </BrowserRouter>
    );

    expect(screen.getByText('Star System Profile')).toBeInTheDocument();
  });
});
