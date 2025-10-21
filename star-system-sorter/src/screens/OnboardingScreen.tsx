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
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(167, 139, 250, 0.2); }
          50% { box-shadow: 0 0 40px rgba(167, 139, 250, 0.4); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-scale-in {
          animation: scaleIn 0.7s ease-out forwards;
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.7s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-glow-pulse {
          animation: glowPulse 3s ease-in-out infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <Starfield />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--s3-lavender-600)]/10 rounded-full blur-3xl animate-glow-pulse"></div>
      
      <div className="relative flex-1 flex flex-col max-w-md mx-auto w-full px-6 py-8 sm:px-8 sm:py-16">
        {/* App Icon */}
        <div className="flex justify-center mb-6 sm:mb-10 animate-scale-in">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)] flex items-center justify-center animate-float" style={{ boxShadow: 'var(--s3-elevation-2)' }}>
            <Sparkles className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
          </div>
        </div>

        {/* Title and Description */}
        <div className="text-center mb-10 sm:mb-16 animate-fade-in-down">
          <h1 className="text-2xl sm:text-3xl mb-3 sm:mb-4 bg-gradient-to-r from-[var(--s3-lavender-200)] to-[var(--s3-lavender-400)] bg-clip-text text-transparent font-medium">
            Star System Sorter
          </h1>
          <p className="text-sm text-[var(--s3-text-muted)] leading-relaxed px-2 sm:px-4">
            Discover your primary star system origin<br />through Human Design
          </p>
        </div>

        {/* 3-Step Explanation */}
        <div className="space-y-5 sm:space-y-7 px-1 sm:px-2 mb-auto">
          <div className="flex items-start gap-3 sm:gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[var(--s3-lavender-500)]/20 border border-[var(--s3-lavender-400)]/40 flex items-center justify-center text-sm sm:text-base text-[var(--s3-lavender-300)] flex-shrink-0 transition-all duration-300 hover:scale-110 hover:bg-[var(--s3-lavender-500)]/30">
              1
            </div>
            <div className="pt-0.5 sm:pt-1">
              <p className="text-base text-white font-medium mb-1">Input</p>
              <p className="text-sm text-[var(--s3-text-subtle)]">Enter birth data or upload chart</p>
            </div>
          </div>
          <div className="flex items-start gap-3 sm:gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[var(--s3-lavender-500)]/20 border border-[var(--s3-lavender-400)]/40 flex items-center justify-center text-sm sm:text-base text-[var(--s3-lavender-300)] flex-shrink-0 transition-all duration-300 hover:scale-110 hover:bg-[var(--s3-lavender-500)]/30">
              2
            </div>
            <div className="pt-0.5 sm:pt-1">
              <p className="text-base text-white font-medium mb-1">Deterministic Sort</p>
              <p className="text-sm text-[var(--s3-text-subtle)]">Rules engine classifies your chart</p>
            </div>
          </div>
          <div className="flex items-start gap-3 sm:gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[var(--s3-lavender-500)]/20 border border-[var(--s3-lavender-400)]/40 flex items-center justify-center text-sm sm:text-base text-[var(--s3-lavender-300)] flex-shrink-0 transition-all duration-300 hover:scale-110 hover:bg-[var(--s3-lavender-500)]/30">
              3
            </div>
            <div className="pt-0.5 sm:pt-1">
              <p className="text-base text-white font-medium mb-1">Narrative</p>
              <p className="text-sm text-[var(--s3-text-subtle)]">LLM generates your star system story</p>
            </div>
          </div>
        </div>

        {/* Begin Sorting Button */}
        <div className="pt-8 sm:pt-12 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <Button 
            variant="primary" 
            className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[var(--s3-lavender-500)]/30"
            onClick={() => navigate('/input')}
          >
            Begin Sorting
          </Button>
        </div>
      </div>
    </div>
  );
}
