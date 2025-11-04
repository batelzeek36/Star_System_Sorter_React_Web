/**
 * Narrative Summary Component
 * 
 * Displays AI-generated personalized narrative about user's star system classification
 * with magical golden glow effects and cinematic styling
 */

import { useState, useEffect } from 'react';
import { useNarrative } from '../hooks/useNarrative';
import type { ClassificationResult } from '../lib/scorer';
import type { HDExtract } from '../lib/schemas';

interface NarrativeSummaryProps {
  classification: ClassificationResult;
  hdData: HDExtract;
}

// Sparkle component for magical effect
function Sparkle({ delay = 0, left, top }: { delay?: number; left: string; top: string }) {
  return (
    <div
      className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-sparkle-twinkle pointer-events-none"
      style={{
        left,
        top,
        animationDelay: `${delay}s`,
        boxShadow: '0 0 4px 2px rgba(253, 224, 71, 0.6)',
      }}
    />
  );
}

// Animated letter component with magical float-up effect
function AnimatedLetter({ char, index }: { char: string; index: number }) {
  // Preserve spaces and newlines without animation
  if (char === ' ' || char === '\n') {
    return <span style={{ display: 'inline' }}>{char}</span>;
  }
  
  return (
    <span
      className="animate-letter-float-in"
      style={{
        display: 'inline',
        animationDelay: `${index * 0.04}s`, // Slower stagger for visible wave
        animationFillMode: 'backwards',
      }}
    >
      {char}
    </span>
  );
}

export function NarrativeSummary({ classification, hdData }: NarrativeSummaryProps) {
  const [regenerateCount, setRegenerateCount] = useState(0);
  const [forceRefresh, setForceRefresh] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [letters, setLetters] = useState<string[]>([]);
  const { narrative, loading, error, cached } = useNarrative(classification, hdData, forceRefresh);
  
  const MAX_REGENERATIONS = 3;
  const canRegenerate = regenerateCount < MAX_REGENERATIONS;
  
  // Split narrative into letters for animation
  useEffect(() => {
    if (narrative && !loading) {
      setShowContent(false);
      setLetters([]);
      const timer = setTimeout(() => {
        setShowContent(true);
        // Split into individual characters
        const letterArray = narrative.split('');
        setLetters(letterArray);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [narrative, loading]);
  
  const handleRegenerate = () => {
    if (canRegenerate) {
      setRegenerateCount(prev => prev + 1);
      setForceRefresh(prev => prev + 1);
    }
  };
  
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg p-6 border border-purple-500/30">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-yellow-400 border-t-transparent" />
          <p className="text-purple-200 text-sm">
            {regenerateCount > 0 ? 'Regenerating your summary...' : 'Generating your personalized summary...'}
          </p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-900/20 rounded-lg p-6 border border-red-500/30">
        <p className="text-red-200 text-sm">
          Unable to generate narrative summary. {error}
        </p>
      </div>
    );
  }
  
  if (!narrative) {
    return null;
  }
  
  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg p-6 border border-purple-500/30 relative overflow-hidden">
      {/* Magical sparkles scattered around */}
      <Sparkle delay={0} left="10%" top="15%" />
      <Sparkle delay={0.5} left="85%" top="20%" />
      <Sparkle delay={1} left="15%" top="75%" />
      <Sparkle delay={1.5} left="90%" top="80%" />
      <Sparkle delay={0.8} left="50%" top="10%" />
      <Sparkle delay={1.2} left="70%" top="90%" />
      
      {/* Cosmic decoration */}
      <div className="absolute top-4 right-4 text-2xl animate-float">🌌</div>
      
      {/* Title */}
      <h3 className="text-xl font-semibold text-purple-100 mb-4">
        Your Star System Signature
      </h3>
      
      {/* Narrative content with magical golden glow */}
      <div className="prose prose-invert prose-purple max-w-none relative">
        {showContent && letters.length > 0 && (
          <div className="magical-text-container">
            <p 
              key={narrative}
              className="magical-text text-lg leading-relaxed"
              style={{
                fontFamily: "'Cormorant Garamond', 'EB Garamond', 'Libre Baskerville', 'Georgia', serif",
                textShadow: `
                  0 0 10px rgba(251, 191, 36, 0.3),
                  0 0 20px rgba(251, 191, 36, 0.2),
                  0 0 30px rgba(251, 191, 36, 0.1),
                  0 2px 4px rgba(0, 0, 0, 0.3)
                `,
                color: '#fef3c7',
                letterSpacing: '0.01em',
              }}
            >
              {letters.map((char, index) => (
                <AnimatedLetter key={`${char}-${index}`} char={char} index={index} />
              ))}
            </p>
          </div>
        )}
      </div>
      
      {/* Regenerate button */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          onClick={handleRegenerate}
          disabled={!canRegenerate || loading}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
            transition-all duration-300
            ${canRegenerate && !loading
              ? 'bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30'
              : 'bg-purple-900/20 text-purple-400/50 cursor-not-allowed'
            }
          `}
        >
          <span className="text-base">🔮</span>
          <span>Regenerate Summary</span>
          <span className="text-xs opacity-70">
            ({regenerateCount}/{MAX_REGENERATIONS})
          </span>
        </button>
        
        {!canRegenerate && (
          <span className="text-xs text-purple-300/50 italic">
            Premium feature • Limit reached
          </span>
        )}
      </div>
      
      {/* Footer note */}
      <div className="mt-4 pt-4 border-t border-purple-500/20">
        <p className="text-xs text-purple-300/70">
          Based on Human Design and the I Ching • Star system classification
          {cached && ' • Cached result'}
        </p>
      </div>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&family=Libre+Baskerville:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap');
        
        @keyframes sparkle-twinkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-sparkle-twinkle {
          animation: sparkle-twinkle 2s ease-in-out infinite;
        }
        
        .magical-text {
          animation: magical-glow 3s ease-in-out infinite;
        }
        
        @keyframes magical-glow {
          0%, 100% {
            filter: brightness(1) drop-shadow(0 0 8px rgba(251, 191, 36, 0.4));
          }
          50% {
            filter: brightness(1.1) drop-shadow(0 0 12px rgba(251, 191, 36, 0.6));
          }
        }
        
        /* Magical letter-by-letter float-in animation with blur */
        @keyframes letter-float-in {
          0% {
            opacity: 0;
            filter: blur(8px);
            transform: translateY(30px) translateX(-4px);
          }
          50% {
            opacity: 0.7;
            filter: blur(2px);
            transform: translateY(-3px) translateX(0);
          }
          75% {
            opacity: 1;
            filter: blur(0px);
            transform: translateY(0.5px) translateX(0);
          }
          100% {
            opacity: 1;
            filter: blur(0px);
            transform: translateY(0) translateX(0);
          }
        }
        
        /* Subtle continuous floating after letter settles */
        @keyframes letter-hover {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-2px);
          }
        }
        
        .animate-letter-float-in {
          animation: 
            letter-float-in 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards,
            letter-hover 4s ease-in-out 1.4s infinite;
        }
      `}</style>
    </div>
  );
}
