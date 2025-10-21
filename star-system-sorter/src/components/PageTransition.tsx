import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * PageTransition - Wraps page content with smooth fade-in animation
 * Respects prefers-reduced-motion for accessibility
 */
export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <div className={`animate-fade-in ${className}`}>
      {children}
    </div>
  );
}
