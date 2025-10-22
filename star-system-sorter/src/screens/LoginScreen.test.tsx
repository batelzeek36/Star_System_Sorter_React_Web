import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginScreen from './LoginScreen';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Google OAuth
vi.mock('@react-oauth/google', () => ({
  GoogleLogin: ({ onSuccess, onError }: any) => (
    <div data-testid="google-login-mock">
      <button onClick={() => onSuccess({ credential: 'mock-credential' })}>
        Mock Google Login
      </button>
      <button onClick={onError}>Mock Google Error</button>
    </div>
  ),
}));

// Mock jwt-decode
vi.mock('jwt-decode', () => ({
  jwtDecode: () => ({
    sub: 'google-123',
    email: 'test@example.com',
    name: 'Test User',
    picture: 'https://example.com/photo.jpg',
  }),
}));

// Mock auth store
const mockLogin = vi.fn();
const mockLoginAsGuest = vi.fn();
let mockIsAuthenticated = false;
vi.mock('../store/authStore', () => ({
  useAuthStore: () => ({
    login: mockLogin,
    loginAsGuest: mockLoginAsGuest,
    isAuthenticated: mockIsAuthenticated,
  }),
}));

// Mock birth data store
let mockClassification: any = null;
vi.mock('../store/birthDataStore', () => ({
  useBirthDataStore: (selector: any) => {
    const state = {
      classification: mockClassification,
    };
    return selector ? selector(state) : state;
  },
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLogin.mockClear();
    mockLoginAsGuest.mockClear();
    mockIsAuthenticated = false;
    mockClassification = null;
  });

  it('renders login screen with title and tagline', () => {
    render(
      <BrowserRouter>
        <LoginScreen />
      </BrowserRouter>
    );

    expect(screen.getByText('Star System Sorter')).toBeInTheDocument();
    expect(screen.getByText('S³')).toBeInTheDocument();
    expect(screen.getByText(/Discover your cosmic origins/i)).toBeInTheDocument();
  });

  it('renders Google login component', () => {
    render(
      <BrowserRouter>
        <LoginScreen />
      </BrowserRouter>
    );

    const googleLogin = screen.getByTestId('google-login-mock');
    expect(googleLogin).toBeInTheDocument();
  });

  it('renders guest continue button', () => {
    render(
      <BrowserRouter>
        <LoginScreen />
      </BrowserRouter>
    );

    const guestButton = screen.getByRole('button', { name: /Continue as Guest/i });
    expect(guestButton).toBeInTheDocument();
  });

  it('handles Google login success and navigates to onboarding', () => {
    render(
      <BrowserRouter>
        <LoginScreen />
      </BrowserRouter>
    );

    const mockGoogleButton = screen.getByRole('button', { name: /Mock Google Login/i });
    fireEvent.click(mockGoogleButton);

    expect(mockLogin).toHaveBeenCalledWith({
      id: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/photo.jpg',
      isGuest: false,
    });
    expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
  });

  it('handles guest login and navigates to onboarding', () => {
    render(
      <BrowserRouter>
        <LoginScreen />
      </BrowserRouter>
    );

    const guestButton = screen.getByRole('button', { name: /Continue as Guest/i });
    fireEvent.click(guestButton);

    expect(mockLoginAsGuest).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
  });

  it('displays legal disclaimer', () => {
    render(
      <BrowserRouter>
        <LoginScreen />
      </BrowserRouter>
    );

    expect(screen.getByText(/For insight & entertainment/i)).toBeInTheDocument();
  });

  it('displays feature highlights', () => {
    render(
      <BrowserRouter>
        <LoginScreen />
      </BrowserRouter>
    );

    expect(screen.getByText(/Deterministic star system classification/i)).toBeInTheDocument();
    expect(screen.getByText(/Personalized cosmic insights/i)).toBeInTheDocument();
    expect(screen.getByText(/Join a community of seekers/i)).toBeInTheDocument();
  });

  it('has accessible guest button with minimum touch target', () => {
    render(
      <BrowserRouter>
        <LoginScreen />
      </BrowserRouter>
    );

    const guestButton = screen.getByRole('button', { name: /Continue as Guest/i });

    // Guest button should have min-h-[44px] class for accessibility
    expect(guestButton.className).toContain('min-h-[44px]');
  });

  it('redirects to results if already authenticated with classification', () => {
    mockIsAuthenticated = true;
    mockClassification = {
      classification: 'primary',
      primary: 'Pleiades',
      allies: [],
      percentages: { Pleiades: 25.8 },
      contributorsPerSystem: {},
      contributorsWithWeights: {},
      meta: { canonVersion: '1.0.0', canonChecksum: 'abc123' },
    };

    render(
      <BrowserRouter>
        <LoginScreen />
      </BrowserRouter>
    );

    // Should redirect to results page
    expect(mockNavigate).toHaveBeenCalledWith('/result');
  });

  it('navigates to results after Google login if classification exists', () => {
    mockClassification = {
      classification: 'primary',
      primary: 'Pleiades',
      allies: [],
      percentages: { Pleiades: 25.8 },
      contributorsPerSystem: {},
      contributorsWithWeights: {},
      meta: { canonVersion: '1.0.0', canonChecksum: 'abc123' },
    };

    render(
      <BrowserRouter>
        <LoginScreen />
      </BrowserRouter>
    );

    const mockGoogleButton = screen.getByRole('button', { name: /Mock Google Login/i });
    fireEvent.click(mockGoogleButton);

    expect(mockLogin).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/result');
  });

  it('navigates to results after guest login if classification exists', () => {
    mockClassification = {
      classification: 'primary',
      primary: 'Pleiades',
      allies: [],
      percentages: { Pleiades: 25.8 },
      contributorsPerSystem: {},
      contributorsWithWeights: {},
      meta: { canonVersion: '1.0.0', canonChecksum: 'abc123' },
    };

    render(
      <BrowserRouter>
        <LoginScreen />
      </BrowserRouter>
    );

    const guestButton = screen.getByRole('button', { name: /Continue as Guest/i });
    fireEvent.click(guestButton);

    expect(mockLoginAsGuest).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/result');
  });
});
