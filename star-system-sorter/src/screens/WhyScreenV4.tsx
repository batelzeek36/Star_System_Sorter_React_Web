import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBirthDataStore } from '@/store/birthDataStore';
import { ChevronDown, ChevronUp, Star, Zap, Activity, Shield } from 'lucide-react';
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
  const size = 140;
  const strokeWidth = 10;
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
        <span className="text-4xl font-bold text-[var(--s3-lavender-200)]">
          {percentage.toFixed(0)}%
        </span>
        <span className="text-xs text-[var(--s3-text-subtle)] mt-1">alignment</span>
      </div>
    </div>
  );
};

export default function WhyScreenV4() {
  const navigate = useNavigate();
  const classification = useBirthDataStore((state) => state.classification);
  const hdData = useBirthDataStore((state) => state.hdData);
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    gates: false,
    channels: false,
    centers: false,
    type: false,
    authority: false,
    profile: false,
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

  // Get contributors
  const contributors = classification.enhancedContributorsWithWeights?.[primarySystem] 
    || classification.contributorsWithWeights?.[primarySystem] 
    || [];

  // Group contributors by type and sort by weight
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

  const getSectionIcon = (type: string) => {
    const icons: Record<string, any> = {
      gate: Zap,
      channel: Activity,
      center: Shield,
      type: Star,
      authority: Star,
      profile: Star,
    };
    const Icon = icons[type] || Star;
    return <Icon className="w-5 h-5" />;
  };

  const getSectionColor = (type: string) => {
    const colors: Record<string, string> = {
      gate: 'from-purple-500 to-purple-600',
      channel: 'from-blue-500 to-blue-600',
      center: 'from-green-500 to-green-600',
      type: 'from-yellow-500 to-yellow-600',
      authority: 'from-red-500 to-red-600',
      profile: 'from-pink-500 to-pink-600',
    };
    return colors[type] || 'from-gray-500 to-gray-600';
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
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--s3-canvas-dark)]" />
        
        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 z-20 p-6">
          <button 
            onClick={() => navigate('/result')}
            className="text-[var(--s3-lavender-300)] hover:text-[var(--s3-lavender-200)] transition-all duration-300 hover:translate-x-[-4px] text-sm min-h-[44px] px-3 py-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--s3-lavender-400)]"
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
        {/* Core Attributes - Always Visible */}
        <div className="mb-6">
          <h2 className="text-sm text-[var(--s3-lavender-300)] mb-3 uppercase tracking-wide">Your Foundation</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-4 bg-[var(--s3-surface-subtle)]/30 rounded-lg border border-[var(--s3-border-muted)]">
              <p className="text-xs text-[var(--s3-text-subtle)] mb-1">Type</p>
              <p className="text-sm font-medium text-[var(--s3-lavender-200)]">{hdData.type}</p>
            </div>
            <div className="text-center p-4 bg-[var(--s3-surface-subtle)]/30 rounded-lg border border-[var(--s3-border-muted)]">
              <p className="text-xs text-[var(--s3-text-subtle)] mb-1">Profile</p>
              <p className="text-sm font-medium text-[var(--s3-lavender-200)]">{hdData.profile}</p>
            </div>
            <div className="text-center p-4 bg-[var(--s3-surface-subtle)]/30 rounded-lg border border-[var(--s3-border-muted)]">
              <p className="text-xs text-[var(--s3-text-subtle)] mb-1">Authority</p>
              <p className="text-sm font-medium text-[var(--s3-lavender-200)]">{hdData.authority}</p>
            </div>
          </div>
        </div>

        {/* Contributors Organized by Type */}
        <div className="mb-6">
          <h2 className="text-sm text-[var(--s3-lavender-300)] mb-3 uppercase tracking-wide">Contributing Factors</h2>
          <div className="space-y-3">
            {/* Gates Section */}
            {contributorsByType.gate && contributorsByType.gate.length > 0 && (
              <div className="bg-[var(--s3-surface-subtle)]/20 rounded-xl border border-[var(--s3-border-muted)] overflow-hidden">
                <button
                  onClick={() => toggleSection('gates')}
                  className="w-full p-4 flex items-center justify-between hover:bg-[var(--s3-surface-subtle)]/30 transition-colors min-h-[60px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--s3-lavender-400)]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getSectionColor('gate')} flex items-center justify-center shadow-lg`}>
                      {getSectionIcon('gate')}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-[var(--s3-lavender-200)]">Gates</p>
                      <p className="text-xs text-[var(--s3-text-subtle)]">{contributorsByType.gate.length} active gates</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[var(--s3-lavender-300)]">
                      +{contributorsByType.gate.reduce((sum, c) => sum + c.weight, 0)} pts
                    </span>
                    {expandedSections.gates ? (
                      <ChevronUp className="w-5 h-5 text-[var(--s3-lavender-400)]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[var(--s3-lavender-400)]" />
                    )}
                  </div>
                </button>
                
                {expandedSections.gates && (
                  <div className="px-4 pb-4 space-y-2 max-h-96 overflow-y-auto">
                    {contributorsByType.gate.map((contributor, index) => (
                      <div key={index} className="flex items-start justify-between p-3 bg-[var(--s3-canvas-dark)]/30 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--s3-lavender-200)]">{contributor.label}</p>
                          {(contributor as any).rationale && (
                            <p className="text-xs text-[var(--s3-text-subtle)] mt-1">{(contributor as any).rationale}</p>
                          )}
                        </div>
                        <span className="text-sm font-medium text-[var(--s3-lavender-300)] ml-3">+{contributor.weight}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Channels Section */}
            {contributorsByType.channel && contributorsByType.channel.length > 0 && (
              <div className="bg-[var(--s3-surface-subtle)]/20 rounded-xl border border-[var(--s3-border-muted)] overflow-hidden">
                <button
                  onClick={() => toggleSection('channels')}
                  className="w-full p-4 flex items-center justify-between hover:bg-[var(--s3-surface-subtle)]/30 transition-colors min-h-[60px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--s3-lavender-400)]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getSectionColor('channel')} flex items-center justify-center shadow-lg`}>
                      {getSectionIcon('channel')}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-[var(--s3-lavender-200)]">Channels</p>
                      <p className="text-xs text-[var(--s3-text-subtle)]">{contributorsByType.channel.length} defined channels</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[var(--s3-lavender-300)]">
                      +{contributorsByType.channel.reduce((sum, c) => sum + c.weight, 0)} pts
                    </span>
                    {expandedSections.channels ? (
                      <ChevronUp className="w-5 h-5 text-[var(--s3-lavender-400)]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[var(--s3-lavender-400)]" />
                    )}
                  </div>
                </button>
                
                {expandedSections.channels && (
                  <div className="px-4 pb-4 space-y-2 max-h-96 overflow-y-auto">
                    {contributorsByType.channel.map((contributor, index) => (
                      <div key={index} className="flex items-start justify-between p-3 bg-[var(--s3-canvas-dark)]/30 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--s3-lavender-200)]">{contributor.label}</p>
                          {(contributor as any).rationale && (
                            <p className="text-xs text-[var(--s3-text-subtle)] mt-1">{(contributor as any).rationale}</p>
                          )}
                        </div>
                        <span className="text-sm font-medium text-[var(--s3-lavender-300)] ml-3">+{contributor.weight}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Centers Section */}
            {contributorsByType.center && contributorsByType.center.length > 0 && (
              <div className="bg-[var(--s3-surface-subtle)]/20 rounded-xl border border-[var(--s3-border-muted)] overflow-hidden">
                <button
                  onClick={() => toggleSection('centers')}
                  className="w-full p-4 flex items-center justify-between hover:bg-[var(--s3-surface-subtle)]/30 transition-colors min-h-[60px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--s3-lavender-400)]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getSectionColor('center')} flex items-center justify-center shadow-lg`}>
                      {getSectionIcon('center')}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-[var(--s3-lavender-200)]">Centers</p>
                      <p className="text-xs text-[var(--s3-text-subtle)]">{contributorsByType.center.length} defined centers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[var(--s3-lavender-300)]">
                      +{contributorsByType.center.reduce((sum, c) => sum + c.weight, 0)} pts
                    </span>
                    {expandedSections.centers ? (
                      <ChevronUp className="w-5 h-5 text-[var(--s3-lavender-400)]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[var(--s3-lavender-400)]" />
                    )}
                  </div>
                </button>
                
                {expandedSections.centers && (
                  <div className="px-4 pb-4 space-y-2">
                    {contributorsByType.center.map((contributor, index) => (
                      <div key={index} className="flex items-start justify-between p-3 bg-[var(--s3-canvas-dark)]/30 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--s3-lavender-200)]">{contributor.label}</p>
                          {(contributor as any).rationale && (
                            <p className="text-xs text-[var(--s3-text-subtle)] mt-1">{(contributor as any).rationale}</p>
                          )}
                        </div>
                        <span className="text-sm font-medium text-[var(--s3-lavender-300)] ml-3">+{contributor.weight}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
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
