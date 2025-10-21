import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy load screens for code splitting
const OnboardingScreen = lazy(() => import('./screens/OnboardingScreen'));
const InputScreen = lazy(() => import('./screens/InputScreen'));
const ResultScreen = lazy(() => import('./screens/ResultScreen'));
const WhyScreen = lazy(() => import('./screens/WhyScreen'));
const DossierScreen = lazy(() => import('./screens/DossierScreen'));
const NarrativeScreen = lazy(() => import('./screens/NarrativeScreen'));
const DevLoreScreen = lazy(() => import('./screens/DevLoreScreen'));

// Loading fallback component
function LoadingFallback() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      fontSize: '1.2rem'
    }}>
      Loading...
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<OnboardingScreen />} />
          <Route path="/input" element={<InputScreen />} />
          <Route path="/result" element={<ResultScreen />} />
          <Route path="/why" element={
            <ProtectedRoute>
              <WhyScreen />
            </ProtectedRoute>
          } />
          <Route path="/dossier" element={
            <ProtectedRoute>
              <DossierScreen />
            </ProtectedRoute>
          } />
          <Route path="/narrative" element={<NarrativeScreen />} />
          <Route path="/dev-lore" element={<DevLoreScreen />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
