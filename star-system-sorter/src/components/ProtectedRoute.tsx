/**
 * ProtectedRoute - Route Guard Component
 * 
 * Protects routes that require classification data.
 * Redirects to /input with a toast message if classification is missing.
 */

import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useBirthDataStore } from '../store/birthDataStore';
import { Toast } from './figma/Toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const classification = useBirthDataStore((state) => state.classification);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!classification) {
      setShowToast(true);
    }
  }, [classification]);

  if (!classification) {
    return (
      <>
        {showToast && (
          <Toast
            message="Add birth details first."
            type="info"
            onClose={() => setShowToast(false)}
            duration={3000}
          />
        )}
        <Navigate to="/input" replace />
      </>
    );
  }

  return <>{children}</>;
}
