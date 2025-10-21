import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy load screens for code splitting
const OnboardingScreen = lazy(() => import('./screens/OnboardingScreen'));
const InputScreen = lazy(() => import('./screens/InputScreen'));
const ResultScreen = lazy(() => import('./screens/ResultScreen'));
const WhyScreen = lazy(() => import('./screens/WhyScreen'));
// const WhyScreenV2 = lazy(() => import('./screens/WhyScreenV2'));
// const WhyScreenV3 = lazy(() => import('./screens/WhyScreenV3'));
// const WhyScreenV4 = lazy(() => import('./screens/WhyScreenV4'));
// const WhyScreenV5 = lazy(() => import('./screens/WhyScreenV5'));
const WhyScreenRedesignFigma = lazy(() => import('./screens/WhyScreenRedesign'));
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
          {/* <Route path="/why-v2" element={
            <ProtectedRoute>
              <WhyScreenV2 />
            </ProtectedRoute>
          } />
          <Route path="/why-v3" element={
            <ProtectedRoute>
              <WhyScreenV3 />
            </ProtectedRoute>
          } />
          <Route path="/why-v4" element={
            <ProtectedRoute>
              <WhyScreenV4 />
            </ProtectedRoute>
          } /> */}
          {/* <Route path="/why-v5" element={
            <ProtectedRoute>
              <WhyScreenV5 />
            </ProtectedRoute>
          } /> */}
          <Route path="/why-figma" element={
            <ProtectedRoute>
              <WhyScreenRedesignFigma />
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
