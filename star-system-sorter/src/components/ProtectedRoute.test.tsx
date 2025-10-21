/**
 * ProtectedRoute Tests
 * 
 * Tests route guard functionality for protected routes.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useBirthDataStore } from '../store/birthDataStore';

// Mock child component
function ProtectedContent() {
  return <div>Protected Content</div>;
}

function InputPage() {
  return <div>Input Page</div>;
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    // Clear store before each test
    useBirthDataStore.getState().clear();
  });

  it('redirects to /input when classification is missing', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/input" element={<InputPage />} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <ProtectedContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Should redirect to input page
    expect(screen.getByText('Input Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when classification exists', () => {
    // Set classification in store
    useBirthDataStore.getState().setClassification({
      primary: 'Pleiades',
      classification: 'primary',
      percentages: {
        Pleiades: 45.5,
        Sirius: 25.3,
        Lyra: 15.2,
        Andromeda: 8.0,
        Orion: 4.0,
        Arcturus: 2.0,
      },
      contributorsWithWeights: {},
      meta: {
        canonVersion: '1.0.0',
        canonChecksum: 'test-checksum',
        lore_version: '1.0.0',
        rules_hash: 'test-hash',
        input_hash: 'test-input',
      },
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/input" element={<InputPage />} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <ProtectedContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Should render protected content
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Input Page')).not.toBeInTheDocument();
  });
});
