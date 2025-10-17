/**
 * Design Tokens for React Web
 * 
 * Extracted from Figma design system.
 * Use these tokens throughout your application for consistency.
 */

export const colors = {
  canvas: {
    dark: '#0a0612',
    darker: '#060408',
  },
  surface: {
    subtle: '#1a0f2e',
    muted: '#0f0820',
  },
  lavender: {
    100: '#f3f0ff',
    200: '#e9e3ff',
    300: '#d4c5ff',
    400: '#c4b5fd',
    500: '#a78bfa',
    600: '#8b5cf6',
    700: '#7c3aed',
    800: '#6d28d9',
    900: '#5b21b6',
  },
  gold: {
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  text: {
    primary: '#ffffff',
    secondary: '#e5e7eb',
    muted: '#9ca3af',
    subtle: '#6b7280',
  },
  semantic: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
  borders: {
    subtle: 'rgba(167, 139, 250, 0.1)',
    muted: 'rgba(167, 139, 250, 0.2)',
    emphasis: 'rgba(167, 139, 250, 0.4)',
  },
} as const;

export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  11: '44px', // Minimum touch target size (WCAG 2.1 AA)
  12: '48px',
  16: '64px',
} as const;

export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
} as const;

export const fontSize = {
  xs: '12px',
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '30px',
  '4xl': '36px',
} as const;

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const lineHeight = {
  tight: '1.25',
  normal: '1.5',
  relaxed: '1.75',
} as const;

export const shadows = {
  'elevation-0': 'none',
  'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(139, 92, 246, 0.1)',
  'elevation-2': '0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(139, 92, 246, 0.15)',
  'elevation-3': '0 10px 15px rgba(0, 0, 0, 0.3), 0 4px 6px rgba(139, 92, 246, 0.2)',
  'elevation-4': '0 20px 25px rgba(0, 0, 0, 0.4), 0 8px 10px rgba(139, 92, 246, 0.25)',
  'focus-default': '0 0 0 3px rgba(167, 139, 250, 0.4)',
  'focus-error': '0 0 0 3px rgba(239, 68, 68, 0.4)',
} as const;

export const gradients = {
  'button-primary': 'linear-gradient(90deg, #a78bfa 0%, #c4b5fd 100%)',
  'button-primary-pressed': 'linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)',
  'button-secondary': 'linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
  'button-destructive': 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
  'button-destructive-pressed': 'linear-gradient(90deg, #dc2626 0%, #b91c1c 100%)',
  'card-default': 'linear-gradient(135deg, rgba(91, 33, 182, 0.2) 0%, rgba(109, 40, 217, 0.1) 100%)',
  'card-emphasis': 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(124, 58, 237, 0.2) 100%)',
  'card-warning': 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
  'text-title': 'linear-gradient(90deg, #e9e3ff 0%, #c4b5fd 100%)',
  'text-heading': 'linear-gradient(90deg, #d4c5ff 0%, #a78bfa 100%)',
} as const;

export const transitions = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  timing: {
    'ease-default': 'cubic-bezier(0.4, 0, 0.2, 1)',
    'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
    'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
    'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export const blur = {
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '24px',
} as const;
