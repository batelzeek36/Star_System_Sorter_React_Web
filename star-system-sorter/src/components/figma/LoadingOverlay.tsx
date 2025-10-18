/**
 * LoadingOverlay Component
 * 
 * Screen-level loading overlay with spinner and optional message.
 * Used for full-screen loading states during API calls or computations.
 */

import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-[var(--s3-canvas-dark)]/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-[var(--s3-lavender-500)] animate-spin mx-auto mb-4" />
        <p className="text-sm text-[var(--s3-text-muted)]">{message}</p>
      </div>
    </div>
  );
}
