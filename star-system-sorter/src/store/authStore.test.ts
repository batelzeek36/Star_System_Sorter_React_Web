import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './authStore';

describe('authStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.setState({ user: null, isAuthenticated: false });
    localStorage.clear();
  });

  it('initializes with no user and not authenticated', () => {
    const { user, isAuthenticated } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(isAuthenticated).toBe(false);
  });

  it('logs in a user with Google credentials', () => {
    const mockUser = {
      id: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/photo.jpg',
      isGuest: false,
    };

    useAuthStore.getState().login(mockUser);

    const { user, isAuthenticated } = useAuthStore.getState();
    expect(user).toEqual(mockUser);
    expect(isAuthenticated).toBe(true);
  });

  it('logs in as guest', () => {
    useAuthStore.getState().loginAsGuest();

    const { user, isAuthenticated } = useAuthStore.getState();
    expect(user).not.toBeNull();
    expect(user?.isGuest).toBe(true);
    expect(user?.email).toBe('guest@starsystemsorter.com');
    expect(isAuthenticated).toBe(true);
  });

  it('logs out a user', () => {
    const mockUser = {
      id: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
      isGuest: false,
    };

    useAuthStore.getState().login(mockUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    useAuthStore.getState().logout();

    const { user, isAuthenticated } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(isAuthenticated).toBe(false);
  });

  it('persists auth state to localStorage', () => {
    const mockUser = {
      id: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
      isGuest: false,
    };

    useAuthStore.getState().login(mockUser);

    // Check localStorage
    const stored = localStorage.getItem('auth-store');
    expect(stored).toBeTruthy();
    
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed.state.user.email).toBe('test@example.com');
      expect(parsed.state.isAuthenticated).toBe(true);
    }
  });

  it('generates unique guest IDs', () => {
    useAuthStore.getState().loginAsGuest();
    const firstGuestId = useAuthStore.getState().user?.id;

    useAuthStore.getState().logout();

    // Wait a tiny bit to ensure different timestamp
    setTimeout(() => {
      useAuthStore.getState().loginAsGuest();
      const secondGuestId = useAuthStore.getState().user?.id;

      expect(firstGuestId).not.toBe(secondGuestId);
    }, 10);
  });
});
