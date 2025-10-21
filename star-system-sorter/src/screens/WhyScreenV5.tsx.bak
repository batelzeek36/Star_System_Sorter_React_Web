import React, { useState, useMemo } from 'react';
import { ChevronLeft, Star, Zap, GitBranch, Cpu, User, Brain, Target, Info, TrendingUp, Layers } from 'lucide-react';

// Mock data types
interface Contribution {
  source: 'gate' | 'channel' | 'center' | 'type' | 'authority' | 'profile';
  identifier: string;
  system: string;
  points: number;
  percentage: number;
  weight: number;
  description?: string;
  confidence?: 'high' | 'medium' | 'low';
}

interface HDData {
  type: string;
  profile: string;
  authority: string;
  definedCenters?: string[];
  undefinedCenters?: string[];
  channels?: string[];
  gates?: number[];
}

interface ClassificationResult {
  classification: 'primary' | 'hybrid' | 'unresolved';
  primary: string;
  secondary?: string;
  hybrid?: [string, string];
  percentages: { [system: string]: number };
  contributions: Contribution[];
  allies: Array<{ system: string; percentage: number }>;
  enhancedContributorsWithWeights?: { [system: string]: Contribution[] };
}

// Mock data
const mockHDData: HDData = {
  type: 'Projector',
  profile: '1/3',
  authority: 'Emotional',
  definedCenters: ['Head', 'Ajna', 'Throat'],
  undefinedCenters: ['Sacral', 'Solar Plexus', 'Ego', 'G Center', 'Spleen', 'Root'],
  channels: ['10-34', '25-51'],
  gates: [13, 18, 52, 64]
};

const mockContributions: Contribution[] = [
  { source: 'channel', identifier: 'Channel 10-34', system: 'Orion', points: 15, percentage: 20.0, weight: 0.195, description: 'The Channel of Exploration • Behavior / Power', confidence: 'high' },
  { source: 'channel', identifier: 'Channel 25-51', system: 'Orion', points: 14, percentage: 18.1, weight: 0.182, description: 'The Channel of Initiation • Universal Love / Shock', confidence: 'high' },
  { source: 'gate', identifier: 'Gate 13', system: 'Orion', points: 3, percentage: 3.7, weight: 0.039, description: 'The Listener • Direction / Fellowship of Man', confidence: 'medium' },
  { source: 'gate', identifier: 'Gate 18', system: 'Orion', points: 8, percentage: 10.1, weight: 0.104, description: 'Correction • Correction of Patterns', confidence: 'high' },
  { source: 'gate', identifier: 'Gate 52', system: 'Orion', points: 8, percentage: 10.0, weight: 0.104, description: 'Inaction / Stillness • The Gate of Keeping Still Mountain', confidence: 'high' },
  { source: 'gate', identifier: 'Gate 64', system: 'Orion', points: 5, percentage: 5.7, weight: 0.065, description: 'Confusion • Before Completion', confidence: 'medium' },
  { source: 'center', identifier: 'Undefined Sacral', system: 'Orion', points: 6, percentage: 7.5, weight: 0.078, description: 'Open to external life force energy', confidence: 'medium' },
  { source: 'center', identifier: 'Undefined Solar Plexus', system: 'Orion', points: 6, percentage: 7.5, weight: 0.078, description: 'Amplifies and samples emotional waves', confidence: 'medium' },
  { source: 'type', identifier: 'Projector', system: 'Orion', points: 10, percentage: 12.5, weight: 0.130, description: 'Non-energy type designed to guide others', confidence: 'high' },
  { source: 'authority', identifier: 'Emotional', system: 'Sirius', points: 8, percentage: 10.0, weight: 0.104, description: 'Wait for emotional clarity over time', confidence: 'high' },
  { source: 'profile', identifier: '1/3', system: 'Pleiades', points: 7, percentage: 8.8, weight: 0.091, description: 'Investigator/Martyr - Learning through experience', confidence: 'medium' },
];

const mockResult: ClassificationResult = {
  classification: 'primary',
  primary: 'Orion',
  percentages: {
    'Orion': 28.8,
    'Sirius': 22.3,
    'Pleiades': 18.5,
    'Andromeda': 14.2,
    'Lyra': 10.1,
    'Arcturus': 6.1
  },
  contributions: mockContributions,
  allies: [
    { system: 'Sirius', percentage: 22.3 },
    { system: 'Pleiades', percentage: 18.5 }
  ],
  enhancedContributorsWithWeights: {
    'Orion': mockContributions.filter(c => c.system === 'Orion'),
    'Sirius': mockContributions.filter(c => c.system === 'Sirius'),
    'Pleiades': mockContributions.filter(c => c.system === 'Pleiades')
  }
};

const STAR_SYSTEMS = ['Orion', 'Sirius', 'Pleiades', 'Andromeda', 'Lyra', 'Arcturus'];

const SYSTEM_COLORS: { [key: string]: string } = {
  'Orion': '#a78bfa',
  'Sirius': '#60a5fa',
  'Pleiades': '#f472b6',
  'Andromeda': '#34d399',
  'Lyra': '#fbbf24',
  'Arcturus': '#fb923c'
};

const SOURCE_CONFIG = {
  gate: { icon: Target, label: 'Gate', color: '#a78bfa' },
  channel: { icon: GitBranch, label: 'Channel', color: '#60a5fa' },
  center: { icon: Cpu, label: 'Energy Center', color: '#f472b6' },
  type: { icon: User, label: 'Type', color: '#34d399' },
  authority: { icon: Zap, label: 'Authority', color: '#fbbf24' },
  profile: { icon: Brain, label: 'Profile', color: '#fb923c' }
};

const CONFIDENCE_COLORS = {
  high: '#34d399',
  medium: '#fbbf24',
  low: '#f87171'
};

export default function WhyScreenV3() {
  const [result] = useState<ClassificationResult>(mockResult);
  const [hdData] = useState<HDData>(mockHDData);
  const [activeSystem, setActiveSystem] = useState<string>(result.primary);
  const [viewMode, setViewMode] = useState<'category' | 'strength'>('category');

  // Get available systems (primary + allies)
  const availableSystems = [
    result.primary,
    ...result.allies.map(ally => ally.system)
  ];

  // Get contributors for active system
  const activeContributors = useMemo(() => {
    const contributors = result.enhancedContributorsWithWeights?.[activeSystem] || [];
    return contributors.sort((a, b) => b.weight - a.weight);
  }, [activeSystem, result]);

  // Group by category
  const groupedByCategory = useMemo(() => {
    return activeContributors.reduce((acc, contribution) => {
      if (!acc[contribution.source]) {
        acc[contribution.source] = [];
      }
      acc[contribution.source].push(contribution);
      return acc;
    }, {} as { [key: string]: Contribution[] });
  }, [activeContributors]);

  // Group by strength tier
  const groupedByStrength = useMemo(() => {
    const high = activeContributors.filter(c => c.weight >= 0.15);
    const medium = activeContributors.filter(c => c.weight >= 0.08 && c.weight < 0.15);
    const low = activeContributors.filter(c => c.weight < 0.08);
    return { high, medium, low };
  }, [activeContributors]);

  const totalWeight = activeContributors.reduce((sum, c) => sum + c.weight, 0);
  const activePercentage = result.percentages[activeSystem] || 0;

  // Strength meter component
  const StrengthMeter = ({ weight, maxWeight }: { weight: number; maxWeight: number }) => {
    const percentage = (weight / maxWeight) * 100;
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs text-white/60 w-12 text-right">
          {(weight * 100).toFixed(1)}%
        </span>
      </div>
    );
  };

  // Simple card component
  const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl ${className}`}>
      {children}
    </div>
  );

  // Simple badge component
  const Badge = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${className}`}>
      {children}
    </span>
  );

  // Progress bar component
  const ProgressBar = ({ value }: { value: number }) => (
    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
      <div 
        className="h-full bg-violet-500 rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0118] via-[#1a0f2e] to-[#0a0118] text-white">
      {/* Animated starfield */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(2px 2px at 20% 30%, white, transparent),
                           radial-gradient(2px 2px at 60% 70%, white, transparent),
                           radial-gradient(1px 1px at 50% 50%, white, transparent),
                           radial-gradient(1px 1px at 80% 10%, white, transparent),
                           radial-gradient(2px 2px at 90% 60%, white, transparent),
                           radial-gradient(1px 1px at 33% 80%, white, transparent)`,
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat'
        }} />
      </div>

      {/* Glow effect */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 max-w-md mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-6">
          <button 
            className="mb-4 text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-2"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl mb-2 bg-gradient-to-r from-violet-200 to-violet-400 bg-clip-text text-transparent">
            Why {result.primary}?
          </h1>
          <p className="text-xs text-white/60">
            Deterministic sort contributors
          </p>
        </div>

        {/* System Comparison Card */}
        <Card className="mb-6">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-white/90">System Alignment</span>
            </div>
            <div className="space-y-3">
              {STAR_SYSTEMS.map(system => {
                const percentage = result.percentages[system] || 0;
                const isPrimary = system === result.primary;
                return (
                  <div key={system} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ 
                            backgroundColor: SYSTEM_COLORS[system],
                            boxShadow: `0 0 8px ${SYSTEM_COLORS[system]}80`
                          }}
                        />
                        <span className={isPrimary ? 'text-white' : 'text-white/70'}>
                          {system}
                        </span>
                        {isPrimary && (
                          <Badge className="bg-violet-500/30 text-violet-300 border border-violet-500/30">
                            Primary
                          </Badge>
                        )}
                      </div>
                      <span className="text-white/60">{percentage.toFixed(1)}%</span>
                    </div>
                    <ProgressBar value={percentage} />
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Core HD Attributes */}
        <div className="mb-6">
          <p className="text-xs text-white/60 mb-3">Your Human Design</p>
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-gradient-to-br from-violet-500/20 to-violet-600/10 border-violet-500/30">
              <div className="p-3 text-center">
                <User className="w-5 h-5 text-violet-400 mx-auto mb-2" />
                <div className="text-xs text-white/90 mb-1">{hdData.type}</div>
                <div className="text-[10px] text-white/50">Type</div>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-violet-500/20 to-violet-600/10 border-violet-500/30">
              <div className="p-3 text-center">
                <Brain className="w-5 h-5 text-violet-400 mx-auto mb-2" />
                <div className="text-xs text-white/90 mb-1">{hdData.profile}</div>
                <div className="text-[10px] text-white/50">Profile</div>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-violet-500/20 to-violet-600/10 border-violet-500/30">
              <div className="p-3 text-center">
                <Zap className="w-5 h-5 text-violet-400 mx-auto mb-2" />
                <div className="text-xs text-white/90 mb-1">{hdData.authority}</div>
                <div className="text-[10px] text-white/50">Authority</div>
              </div>
            </Card>
          </div>
        </div>

        {/* System Tabs */}
        {availableSystems.length > 1 && (
          <div className="mb-6">
            <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl mb-6">
              {availableSystems.map(system => {
                const percentage = result.percentages[system] || 0;
                const isPrimary = system === result.primary;
                const isActive = system === activeSystem;
                return (
                  <button
                    key={system}
                    onClick={() => setActiveSystem(system)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs transition-all ${
                      isActive
                        ? 'bg-violet-500 text-white'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <div className="text-center">
                      <div>{system}</div>
                      <div className="text-[10px] text-white/60">{percentage.toFixed(1)}%</div>
                      {isPrimary && (
                        <div className="text-[9px] text-violet-300">Primary</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setViewMode('category')}
                className={`flex-1 px-3 py-2 rounded-lg text-xs transition-all ${
                  viewMode === 'category'
                    ? 'bg-violet-500 text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                By Category
              </button>
              <button
                onClick={() => setViewMode('strength')}
                className={`flex-1 px-3 py-2 rounded-lg text-xs transition-all ${
                  viewMode === 'strength'
                    ? 'bg-violet-500 text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                By Strength
              </button>
            </div>

            {/* Category View */}
            {viewMode === 'category' && (
              <div className="space-y-4">
                {Object.entries(groupedByCategory).map(([category, contributions]) => {
                  const config = SOURCE_CONFIG[category as keyof typeof SOURCE_CONFIG];
                  const Icon = config.icon;
                  const categoryWeight = contributions.reduce((sum, c) => sum + c.weight, 0);
                  
                  return (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${config.color}20` }}
                        >
                          <Icon className="w-4 h-4" style={{ color: config.color }} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-white/90">{config.label}</div>
                          <div className="text-xs text-white/50">
                            {contributions.length} factor{contributions.length !== 1 ? 's' : ''} • {(categoryWeight * 100).toFixed(1)}% weight
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 pl-10">
                        {contributions.map((contribution, idx) => (
                          <Card 
                            key={idx}
                            className="hover:bg-white/10 transition-all"
                          >
                            <div className="p-3">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm text-white/90">
                                      {contribution.identifier}
                                    </span>
                                    {contribution.confidence && (
                                      <div 
                                        className="w-2 h-2 rounded-full"
                                        style={{ 
                                          backgroundColor: CONFIDENCE_COLORS[contribution.confidence]
                                        }}
                                        title={`Confidence: ${contribution.confidence}`}
                                      />
                                    )}
                                  </div>
                                  {contribution.description && (
                                    <p className="text-xs text-white/60">
                                      {contribution.description}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right ml-3">
                                  <div className="text-sm text-violet-400">
                                    +{contribution.points}
                                  </div>
                                  <div className="text-xs text-white/50">
                                    {contribution.percentage.toFixed(1)}%
                                  </div>
                                </div>
                              </div>
                              <StrengthMeter 
                                weight={contribution.weight} 
                                maxWeight={Math.max(...activeContributors.map(c => c.weight))}
                              />
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Strength View */}
            {viewMode === 'strength' && (
              <div className="space-y-6">
                {/* High Strength */}
                {groupedByStrength.high.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-white/90">High Impact</span>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        ≥15% weight
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {groupedByStrength.high.map((contribution, idx) => {
                        const config = SOURCE_CONFIG[contribution.source];
                        const Icon = config.icon;
                        return (
                          <Card 
                            key={idx}
                            className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500/30"
                          >
                            <div className="p-3">
                              <div className="flex items-start gap-3 mb-2">
                                <Icon className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <div className="text-sm text-white/90 mb-1">
                                    {contribution.identifier}
                                  </div>
                                  {contribution.description && (
                                    <p className="text-xs text-white/60">
                                      {contribution.description}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-emerald-400">+{contribution.points}</div>
                                  <div className="text-xs text-white/50">{contribution.percentage.toFixed(1)}%</div>
                                </div>
                              </div>
                              <StrengthMeter 
                                weight={contribution.weight} 
                                maxWeight={Math.max(...activeContributors.map(c => c.weight))}
                              />
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Medium Strength */}
                {groupedByStrength.medium.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-white/90">Medium Impact</span>
                      <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        8-15% weight
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {groupedByStrength.medium.map((contribution, idx) => {
                        const config = SOURCE_CONFIG[contribution.source];
                        const Icon = config.icon;
                        return (
                          <Card 
                            key={idx}
                            className="hover:bg-white/10 transition-all"
                          >
                            <div className="p-3">
                              <div className="flex items-start gap-3 mb-2">
                                <Icon className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <div className="text-sm text-white/90 mb-1">
                                    {contribution.identifier}
                                  </div>
                                  {contribution.description && (
                                    <p className="text-xs text-white/60">
                                      {contribution.description}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-amber-400">+{contribution.points}</div>
                                  <div className="text-xs text-white/50">{contribution.percentage.toFixed(1)}%</div>
                                </div>
                              </div>
                              <StrengthMeter 
                                weight={contribution.weight} 
                                maxWeight={Math.max(...activeContributors.map(c => c.weight))}
                              />
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Low Strength */}
                {groupedByStrength.low.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-white/40" />
                      <span className="text-sm text-white/90">Supporting Factors</span>
                      <Badge className="bg-white/10 text-white/50 border border-white/10">
                        <8% weight
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {groupedByStrength.low.map((contribution, idx) => {
                        const config = SOURCE_CONFIG[contribution.source];
                        const Icon = config.icon;
                        return (
                          <Card 
                            key={idx}
                            className="hover:bg-white/10 transition-all"
                          >
                            <div className="p-3">
                              <div className="flex items-start gap-3 mb-2">
                                <Icon className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <div className="text-sm text-white/70 mb-1">
                                    {contribution.identifier}
                                  </div>
                                  {contribution.description && (
                                    <p className="text-xs text-white/50">
                                      {contribution.description}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-white/50">+{contribution.points}</div>
                                  <div className="text-xs text-white/40">{contribution.percentage.toFixed(1)}%</div>
                                </div>
                              </div>
                              <StrengthMeter 
                                weight={contribution.weight} 
                                maxWeight={Math.max(...activeContributors.map(c => c.weight))}
                              />
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Total Alignment */}
        <div className="mb-6">
          <Card className="bg-gradient-to-br from-violet-500/20 to-violet-600/10 border-violet-500/30">
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 text-violet-400" />
                <span className="text-sm text-white/90">Total Alignment</span>
              </div>
              <div className="text-3xl text-violet-400 mb-1">
                {activePercentage.toFixed(1)}%
              </div>
              <div className="text-xs text-white/60">
                {activeSystem} • Based on {activeContributors.length} factors
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="space-y-4">
          <div className="h-px bg-white/10" />
          
          <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
            <Info className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-white/60">
              <p className="mb-1">
                {result.classification === 'hybrid' && result.hybrid
                  ? `${result.hybrid[0]} + ${result.hybrid[1]} (Δ${Math.abs(
                      result.percentages[result.hybrid[0]] - result.percentages[result.hybrid[1]]
                    ).toFixed(1)}%)`
                  : 'Deterministic rules engine'}
              </p>
              <p>For insight & entertainment. Not medical, financial, or legal advice.</p>
            </div>
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}
