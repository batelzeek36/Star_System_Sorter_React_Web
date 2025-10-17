import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/figma/Button';

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

export default function OnboardingScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--s3-canvas-dark)] via-[var(--s3-surface-subtle)] to-[var(--s3-canvas-dark)] flex flex-col relative overflow-hidden">
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <Starfield />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--s3-lavender-600)]/10 rounded-full blur-3xl"></div>
      
      <div className="relative flex-1 flex flex-col max-w-md mx-auto w-full px-6 py-12">
        <div className="h-12"></div>
        
        {/* App Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)] flex items-center justify-center" style={{ boxShadow: 'var(--s3-elevation-2)' }}>
            <Sparkles className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Title and Description */}
        <div className="text-center mb-12">
          <h1 className="text-3xl mb-3 bg-gradient-to-r from-[var(--s3-lavender-200)] to-[var(--s3-lavender-400)] bg-clip-text text-transparent">
            Star System Sorter
          </h1>
          <p className="text-sm text-[var(--s3-text-muted)]">
            Discover your primary star system origin through Human Design
          </p>
        </div>

        {/* 3-Step Explanation */}
        <div className="space-y-4 mb-auto">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[var(--s3-lavender-500)]/20 border border-[var(--s3-lavender-400)]/40 flex items-center justify-center text-sm text-[var(--s3-lavender-300)] flex-shrink-0">
              1
            </div>
            <div>
              <p className="text-sm text-[var(--s3-lavender-200)] mb-1">Input</p>
              <p className="text-xs text-[var(--s3-text-subtle)]">Enter birth data or upload chart</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[var(--s3-lavender-500)]/20 border border-[var(--s3-lavender-400)]/40 flex items-center justify-center text-sm text-[var(--s3-lavender-300)] flex-shrink-0">
              2
            </div>
            <div>
              <p className="text-sm text-[var(--s3-lavender-200)] mb-1">Deterministic Sort</p>
              <p className="text-xs text-[var(--s3-text-subtle)]">Rules engine classifies your chart</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[var(--s3-lavender-500)]/20 border border-[var(--s3-lavender-400)]/40 flex items-center justify-center text-sm text-[var(--s3-lavender-300)] flex-shrink-0">
              3
            </div>
            <div>
              <p className="text-sm text-[var(--s3-lavender-200)] mb-1">Narrative</p>
              <p className="text-xs text-[var(--s3-text-subtle)]">LLM generates your star system story</p>
            </div>
          </div>
        </div>

        {/* Begin Sorting Button */}
        <div className="pt-6">
          <Button 
            variant="primary" 
            className="w-full"
            onClick={() => navigate('/input')}
          >
            Begin Sorting
          </Button>
        </div>

        {/* Legal Disclaimer */}
        <div className="pt-6 text-center">
          <p className="text-xs text-[var(--s3-text-subtle)]">
            For insight & entertainment. Not medical, financial, or legal advice.
          </p>
        </div>

        <div className="h-8"></div>
      </div>
    </div>
  );
}
