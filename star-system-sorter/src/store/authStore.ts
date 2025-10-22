import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  isGuest: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  loginAsGuest: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: (user: User) => {
        set({ user, isAuthenticated: true });
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
        // Clear other stores if needed
        localStorage.removeItem('birth-data-store');
      },
      
      loginAsGuest: () => {
        const guestUser: User = {
          id: `guest-${Date.now()}`,
          email: 'guest@starsystemsorter.com',
          name: 'Guest User',
          isGuest: true,
        };
        set({ user: guestUser, isAuthenticated: true });
      },
    }),
    {
      name: 'auth-store',
    }
  )
);
