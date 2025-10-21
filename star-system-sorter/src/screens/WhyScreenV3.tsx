import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBirthDataStore } from '@/store/birthDataStore';
import { Card } from '@/components/figma/Card';
import { ChevronDown, ChevronUp, Star, Sparkles } from 'lucide-react';
import { animationStyles } from '@/styles/animations';

// Starfield component
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

// Progress ring component
const ProgressRing = ({ percentage }: { percentage: number }) => {
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(147, 112, 219, 0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progress-gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--s3-lavender-400)" />
            <stop offset="100%" stopColor="var(--s3-lavender-200)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-3xl font-bold text-[var(--s3-lavender-200)]">
          {percentage.toFixed(0)}%
        </span>
        <span className="text-xs text-[var(--s3-text-subtle)] mt-1">alignment</span>
      </div>
    </div>
  );
};

export default function WhyScreenV3() {
  const navigate = useNavigate();
  const classification = useBirthDataStore((state) => state.classification);
  const hdData = useBirthDataStore((state) => state.hdData);
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    gates: false,
    channels: false,
    centers: false,
  });

  // Redirect if no data
  if (!classification || !hdData) {
    navigate('/input');
    return null;
  }

  const primarySystem = classification.classification === 'hybrid' && classification.hybrid
    ? classification.hybrid[0]
    : classification.primary || 'Unknown';

  const primaryPercentage = classification.percentages[primarySystem] || 0;

  // Get contributors - use enhanced if available, otherwise use basic
  const contributors = classification.enhancedContributorsWithWeights?.[primarySystem] 
    || classification.contributorsWithWeights?.[primarySystem] 
    || [];

  // Group contributors by type
  const contributorsByType = contributors.reduce((acc, contributor) => {
    const key = contributor.key || '';
    const type = key.split(':')[0] || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(contributor);
    return acc;
  }, {} as Record<string, any[]>);

  // Get top 5 contributors overall
  const topContributors = [...contributors]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--s3-canvas-dark)] via-[#1a0f2e] to-[var(--s3-canvas-dark)] flex flex-col relative overflow-hidden">
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.5; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        ${animationStyles}
      `}</style>

      <Starfield />
      
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--s3-canvas-dark)]" />
        
        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 z-20 p-6">
          <button 
            onClick={() => navigate('/result')}
            className="text-[var(--s3-lavender-300)] hover:text-[var(--s3-lavender-200)] transition-all duration-300 hover:translate-x-[-4px] text-sm"
            aria-label="Back to results"
          >
            ← Back to Results
          </button>
        </div>
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="animate-fade-in-up" style={{ animation: 'float 6s ease-in-out infinite' }}>
            <ProgressRing percentage={primaryPercentage} />
          </div>
          
          <h1 className="text-4xl font-bold mt-6 mb-2 bg-gradient-to-r from-[var(--s3-lavender-200)] to-[var(--s3-lavender-400)] bg-clip-text text-transparent animate-fade-in-up">
            {primarySystem}
          </h1>
          
          <p className="text-[var(--s3-text-subtle)] text-sm animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Your cosmic blueprint decoded
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative flex-1 max-w-2xl mx-auto w-full px-6 py-8">
        {/* Core Attributes */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-[var(--s3-lavender-200)] mb-4 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Your Foundation
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <div className="p-4 bg-gradient-to-r from-[var(--s3-lavender-900)]/10 to-[var(--s3-lavender-800)]/10 rounded-xl border border-[var(--s3-lavender-600)]/20 backdrop-blur">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--s3-lavender-500)] to-[var(--s3-lavender-600)] flex items-center justify-center shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--s3-lavender-200)]">{hdData.type}</p>
                  <p className="text-xs text-[var(--s3-text-subtle)]">Energy Type</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-[var(--s3-lavender-900)]/10 to-[var(--s3-lavender-800)]/10 rounded-xl border border-[var(--s3-lavender-600)]/20 backdrop-blur">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--s3-lavender-500)] to-[var(--s3-lavender-600)] flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--s3-lavender-200)]">{hdData.authority}</p>
                  <p className="text-xs text-[var(--s3-text-subtle)]">Decision Authority</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-[var(--s3-lavender-900)]/10 to-[var(--s3-lavender-800)]/10 rounded-xl border border-[var(--s3-lavender-600)]/20 backdrop-blur">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--s3-lavender-500)] to-[var(--s3-lavender-600)] flex items-center justify-center shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--s3-lavender-200)]">{hdData.profile}</p>
                  <p className="text-xs text-[var(--s3-text-subtle)]">Life Profile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Top Contributors */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-[var(--s3-lavender-200)] mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Strongest Alignments
          </h2>
          <div className="space-y-3">
            {topContributors.map((contributor, index) => (
              <Card key={index} variant="default">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--s3-lavender-200)] truncate">
                      {contributor.label}
                    </p>
                    <p className="text-xs text-[var(--s3-text-subtle)] truncate">
                      {(contributor as any).rationale || 'Contributing to your alignment'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-[var(--s3-lavender-300)]">
                      +{contributor.weight}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Expandable Sections */}
        <div className="space-y-3 mb-8">
          {/* Gates Section */}
          {contributorsByType.gate && contributorsByType.gate.length > 0 && (
            <Card variant="default">
              <button
                onClick={() => toggleSection('gates')}
                className="w-full flex items-center justify-between min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--s3-lavender-400)] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--s3-lavender-600)]/20 flex items-center justify-center">
                    <span className="text-sm text-[var(--s3-lavender-300)]">{contributorsByType.gate.length}</span>
                  </div>
                  <span className="text-sm text-[var(--s3-lavender-200)]">Gates</span>
                </div>
                {expandedSections.gates ? (
                  <ChevronUp className="w-5 h-5 text-[var(--s3-lavender-400)]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[var(--s3-lavender-400)]" />
                )}
              </button>
              
              {expandedSections.gates && (
                <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                  {contributorsByType.gate.map((contributor, index) => (
                    <div key={index} className="flex items-start justify-between p-2 bg-[var(--s3-canvas-dark)]/30 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--s3-lavender-200)]">{contributor.label}</p>
                        <p className="text-xs text-[var(--s3-text-subtle)] truncate">{(contributor as any).rationale || ''}</p>
                      </div>
                      <span className="text-sm text-[var(--s3-lavender-300)] ml-2">+{contributor.weight}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Channels Section */}
          {contributorsByType.channel && contributorsByType.channel.length > 0 && (
            <Card variant="default">
              <button
                onClick={() => toggleSection('channels')}
                className="w-full flex items-center justify-between min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--s3-lavender-400)] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--s3-lavender-600)]/20 flex items-center justify-center">
                    <span className="text-sm text-[var(--s3-lavender-300)]">{contributorsByType.channel.length}</span>
                  </div>
                  <span className="text-sm text-[var(--s3-lavender-200)]">Channels</span>
                </div>
                {expandedSections.channels ? (
                  <ChevronUp className="w-5 h-5 text-[var(--s3-lavender-400)]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[var(--s3-lavender-400)]" />
                )}
              </button>
              
              {expandedSections.channels && (
                <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                  {contributorsByType.channel.map((contributor, index) => (
                    <div key={index} className="flex items-start justify-between p-2 bg-[var(--s3-canvas-dark)]/30 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--s3-lavender-200)]">{contributor.label}</p>
                        <p className="text-xs text-[var(--s3-text-subtle)] truncate">{(contributor as any).rationale || ''}</p>
                      </div>
                      <span className="text-sm text-[var(--s3-lavender-300)] ml-2">+{contributor.weight}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Centers Section */}
          {contributorsByType.center && contributorsByType.center.length > 0 && (
            <Card variant="default">
              <button
                onClick={() => toggleSection('centers')}
                className="w-full flex items-center justify-between min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--s3-lavender-400)] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--s3-lavender-600)]/20 flex items-center justify-center">
                    <span className="text-sm text-[var(--s3-lavender-300)]">{contributorsByType.center.length}</span>
                  </div>
                  <span className="text-sm text-[var(--s3-lavender-200)]">Centers</span>
                </div>
                {expandedSections.centers ? (
                  <ChevronUp className="w-5 h-5 text-[var(--s3-lavender-400)]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[var(--s3-lavender-400)]" />
                )}
              </button>
              
              {expandedSections.centers && (
                <div className="mt-4 space-y-2">
                  {contributorsByType.center.map((contributor, index) => (
                    <div key={index} className="flex items-start justify-between p-2 bg-[var(--s3-canvas-dark)]/30 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--s3-lavender-200)]">{contributor.label}</p>
                        <p className="text-xs text-[var(--s3-text-subtle)] truncate">{(contributor as any).rationale || ''}</p>
                      </div>
                      <span className="text-sm text-[var(--s3-lavender-300)] ml-2">+{contributor.weight}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-[var(--s3-border-muted)]">
          <div className="p-3 bg-[var(--s3-lavender-900)]/10 border border-[var(--s3-border-muted)] rounded-lg">
            <p className="text-xs text-[var(--s3-text-subtle)] leading-relaxed text-center">
              For insight & entertainment. Not medical, financial, or legal advice.
            </p>
          </div>
        </div>

        <div className="h-8"></div>
      </div>
    </div>
  );
}
