import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBirthDataStore } from '@/store/birthDataStore';
import { Card } from '@/components/figma/Card';
import { Button } from '@/components/figma/Button';
import { Star, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
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

export default function WhyScreenV2() {
  const navigate = useNavigate();
  const classification = useBirthDataStore((state) => state.classification);
  const hdData = useBirthDataStore((state) => state.hdData);
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
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

  // Group contributors by type (extract from key like "gate:34", "channel:1-8", "type:generator")
  const contributorsByType = contributors.reduce((acc, contributor) => {
    const key = contributor.key || '';
    const type = key.split(':')[0] || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(contributor);
    return acc;
  }, {} as Record<string, any[]>);

  // Sort each group by weight
  Object.keys(contributorsByType).forEach(type => {
    contributorsByType[type].sort((a, b) => b.weight - a.weight);
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Get top 3 contributors overall
  const topContributors = [...contributors]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--s3-canvas-dark)] via-[var(--s3-surface-subtle)] to-[var(--s3-canvas-dark)] flex flex-col relative overflow-hidden">
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.5; }
        }
        ${animationStyles}
      `}</style>

      <Starfield />
      
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--s3-lavender-600)]/20 rounded-full blur-3xl animate-glow-pulse"></div>
      
      <div className="relative flex-1 flex flex-col max-w-md mx-auto w-full px-6 py-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in-down">
          <button 
            onClick={() => navigate('/result')}
            className="mb-4 min-h-[44px] px-3 py-2 text-[var(--s3-lavender-400)] hover:text-[var(--s3-lavender-300)] transition-all duration-300 hover:translate-x-[-4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--s3-lavender-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--s3-canvas-dark)] rounded-lg"
            aria-label="Go back to results"
          >
            ← Back
          </button>
          <h1 className="text-3xl mb-2 bg-gradient-to-r from-[var(--s3-lavender-200)] to-[var(--s3-lavender-400)] bg-clip-text text-transparent">
            Why {primarySystem}?
          </h1>
          <p className="text-sm text-[var(--s3-text-subtle)]">
            Your chart reveals {primaryPercentage.toFixed(0)}% alignment
          </p>
        </div>

        {/* Hero Summary Card */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <Card variant="emphasis">
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)] flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl text-[var(--s3-lavender-200)] mb-2">
                {primaryPercentage.toFixed(1)}% {primarySystem}
              </h2>
              <p className="text-sm text-[var(--s3-text-subtle)] mb-4">
                Based on your Human Design chart
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-[var(--s3-canvas-dark)]/50 rounded-lg p-3">
                  <p className="text-2xl text-[var(--s3-lavender-300)] mb-1">
                    {contributorsByType.gate?.length || 0}
                  </p>
                  <p className="text-xs text-[var(--s3-text-subtle)]">Gates</p>
                </div>
                <div className="bg-[var(--s3-canvas-dark)]/50 rounded-lg p-3">
                  <p className="text-2xl text-[var(--s3-lavender-300)] mb-1">
                    {contributorsByType.channel?.length || 0}
                  </p>
                  <p className="text-xs text-[var(--s3-text-subtle)]">Channels</p>
                </div>
                <div className="bg-[var(--s3-canvas-dark)]/50 rounded-lg p-3">
                  <p className="text-2xl text-[var(--s3-lavender-300)] mb-1">
                    {contributorsByType.center?.length || 0}
                  </p>
                  <p className="text-xs text-[var(--s3-text-subtle)]">Centers</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Top Contributors */}
        <div className="mb-8">
          <h3 className="text-sm text-[var(--s3-lavender-300)] mb-3 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Top Contributors
          </h3>
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
                    <p className="text-sm font-medium text-[var(--s3-lavender-300)]">
                      +{contributor.weight}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Core Attributes */}
        <div className="mb-8">
          <h3 className="text-sm text-[var(--s3-lavender-300)] mb-3">Your Foundation</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-[var(--s3-surface-subtle)] rounded-lg">
              <span className="text-sm text-[var(--s3-text-subtle)]">Type</span>
              <span className="text-sm text-[var(--s3-lavender-200)]">{hdData.type}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--s3-surface-subtle)] rounded-lg">
              <span className="text-sm text-[var(--s3-text-subtle)]">Profile</span>
              <span className="text-sm text-[var(--s3-lavender-200)]">{hdData.profile}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--s3-surface-subtle)] rounded-lg">
              <span className="text-sm text-[var(--s3-text-subtle)]">Authority</span>
              <span className="text-sm text-[var(--s3-lavender-200)]">{hdData.authority}</span>
            </div>
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
        <div className="mt-auto pt-6 space-y-4">
          <div className="p-3 bg-[var(--s3-lavender-900)]/10 border border-[var(--s3-border-muted)] rounded-[var(--s3-radius-xl)]">
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
