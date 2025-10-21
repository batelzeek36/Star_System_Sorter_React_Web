import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBirthDataStore } from '@/store/birthDataStore';
import { useClassification } from '@/hooks/useClassification';
import { Button } from '@/components/figma/Button';
import { Chip } from '@/components/figma/Chip';
import { LoadingOverlay } from '@/components/figma/LoadingOverlay';
import { StarSystemCrests, type StarSystemName } from '@/components/figma/StarSystemCrests';
import { animationStyles } from '@/styles/animations';

// Starfield component from Figma App.tsx (unchanged)
const Starfield = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(50)].map((_, i) => (
      <div
        key={i}
        className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-30"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `twinkle ${2 + Math.random() * 3}s infinite ${Math.random() * 2}s`
        }}
      />
    ))}
  </div>
);

export default function ResultScreen() {
  const navigate = useNavigate();
  const hdData = useBirthDataStore((state) => state.hdData);
  const classification = useBirthDataStore((state) => state.classification);
  const { loading, classify } = useClassification();
  
  // Animated percentage counter
  const [displayPercentage, setDisplayPercentage] = useState(0);

  // Compute classification when HD data is available but classification is not
  useEffect(() => {
    if (hdData && !classification && !loading) {
      classify(hdData);
    }
  }, [hdData, classification, loading, classify]);
  
  // Animate percentage counter
  useEffect(() => {
    if (!classification) return;
    
    const primarySystem = classification.classification === 'hybrid' && classification.hybrid
      ? classification.hybrid[0]
      : classification.primary || 'Unknown';
    const targetPercentage = classification.percentages[primarySystem] || 0;
    
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const increment = targetPercentage / steps;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayPercentage(targetPercentage);
        clearInterval(timer);
      } else {
        setDisplayPercentage(increment * currentStep);
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [classification]);

  // Redirect to input if no HD data
  if (!hdData) {
    navigate('/input');
    return null;
  }

  // Handle loading state
  if (!classification || loading) {
    return <LoadingOverlay message="Computing classification..." />;
  }

  // Determine primary system and percentage
  const primarySystem = classification.classification === 'hybrid' && classification.hybrid
    ? classification.hybrid[0]
    : classification.primary || 'Unknown';
  
  const primaryPercentage = classification.percentages[primarySystem] || 0;

  // Get the appropriate crest component
  const CrestComponent = StarSystemCrests[primarySystem as StarSystemName] || StarSystemCrests['Pleiades'];

  // Calculate radial chart values
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  // Get top 3 allies (excluding primary)
  const allies = classification.allies?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--s3-canvas-dark)] via-[var(--s3-surface-subtle)] to-[var(--s3-canvas-dark)] flex flex-col relative overflow-hidden">
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.5; }
        }
        @keyframes drawCircle {
          from {
            stroke-dashoffset: ${circumference};
          }
          to {
            stroke-dashoffset: ${circumference - (circumference * primaryPercentage / 100)};
          }
        }
        .progress-circle {
          stroke-dasharray: ${circumference};
          stroke-dashoffset: ${circumference};
          animation: drawCircle 1.5s ease-out forwards;
          animation-delay: 0.3s;
        }
        ${animationStyles}
      `}</style>

      <Starfield />
      
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--s3-lavender-600)]/20 rounded-full blur-3xl animate-glow-pulse"></div>
      
      <div className="relative flex-1 flex flex-col max-w-md mx-auto w-full px-6 py-12">
        <div className="h-12"></div>
        
        {/* Header */}
        <div className="mb-6 animate-fade-in-down">
          <p className="text-xs text-[var(--s3-lavender-400)] mb-1">
            {classification.classification === 'hybrid' ? 'Your Hybrid Star System' : 'Your Primary Star System'}
          </p>
          <h2 className="text-2xl bg-gradient-to-r from-[var(--s3-lavender-200)] to-[var(--s3-lavender-400)] bg-clip-text text-transparent">
            {primarySystem}
          </h2>
        </div>

        {/* Radial Percentage Chart with Crest */}
        <div className="flex justify-center mb-6 animate-scale-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <div className="relative w-48 h-48 animate-float">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle 
                cx="96" 
                cy="96" 
                r={radius} 
                stroke="rgba(167, 139, 250, 0.1)" 
                strokeWidth="16" 
                fill="none" 
              />
              {/* Progress circle */}
              <circle
                cx="96" 
                cy="96" 
                r={radius}
                stroke="url(#gradient-result)"
                strokeWidth="16" 
                fill="none"
                strokeLinecap="round"
                className="progress-circle"
              />
              <defs>
                <linearGradient id="gradient-result" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--s3-lavender-500)" />
                  <stop offset="100%" stopColor="var(--s3-lavender-400)" />
                </linearGradient>
              </defs>
            </svg>
            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <CrestComponent size={48} className="text-[var(--s3-lavender-400)] mb-2" />
              <p className="text-3xl mb-1 bg-gradient-to-r from-[var(--s3-lavender-200)] to-[var(--s3-lavender-400)] bg-clip-text text-transparent">
                {displayPercentage.toFixed(1)}%
              </p>
              <p className="text-xs text-[var(--s3-text-subtle)]">Alignment</p>
            </div>
          </div>
        </div>

        {/* Ally Star Systems */}
        {allies.length > 0 && (
          <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <p className="text-xs text-[var(--s3-text-subtle)] mb-3">Ally Star Systems</p>
            <div className="flex flex-wrap gap-2">
              {allies.map((ally, index) => (
                <div 
                  key={ally.system}
                  className="animate-fade-in-up transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${0.4 + index * 0.1}s`, animationFillMode: 'both' }}
                >
                  <Chip 
                    starSystem={ally.system} 
                    percentage={parseFloat(ally.percentage.toFixed(1))} 
                    variant={index === 0 ? 'gold' : 'lavender'} 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View Why Buttons */}
        <div className="mb-4 animate-fade-in-up space-y-2" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
          <Button 
            variant="primary" 
            className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[var(--s3-lavender-500)]/30"
            onClick={() => navigate('/why-figma')}
          >
            View Why (Figma Redesign)
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="flex-1 text-xs"
              onClick={() => navigate('/why-v5')}
            >
              V5
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="flex-1 text-xs"
              onClick={() => navigate('/why-v4')}
            >
              V4
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="flex-1 text-xs"
              onClick={() => navigate('/why')}
            >
              Original
            </Button>
          </div>
        </div>

        {/* Open Dossier Button */}
        <div className="mb-4 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          <Button 
            variant="secondary" 
            className="w-full transition-all duration-300 hover:scale-105"
            onClick={() => navigate('/dossier')}
          >
            Open Dossier
          </Button>
        </div>

        {/* Legal Disclaimer */}
        <div className="mb-4 animate-fade-in" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
          <div className="p-3 bg-[var(--s3-lavender-900)]/10 border border-[var(--s3-border-muted)] rounded-[var(--s3-radius-xl)] transition-all duration-300 hover:border-[var(--s3-border-emphasis)]">
            <p className="text-xs text-[var(--s3-text-subtle)] leading-relaxed">
              For insight & entertainment. Not medical, financial, or legal advice.
            </p>
          </div>
        </div>

        <div className="h-8"></div>
      </div>
    </div>
  );
}
