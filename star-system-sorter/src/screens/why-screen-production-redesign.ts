import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBirthDataStore } from '@/store/birthDataStore';
import { useLoreVersionCheck } from '@/hooks/useLoreVersionCheck';
import { useClassification } from '@/hooks/useClassification';
import { Card } from '@/components/figma/Card';
import { Button } from '@/components/figma/Button';
import { loreBundle } from '@/lib/lore.bundle';
import { 
  ChevronLeft, ChevronDown, ChevronUp, Star, AlertCircle, 
  Info, Sparkles, Zap, Shield, Compass, Eye, Sun, Moon, 
  Activity, Layers, TrendingUp 
} from 'lucide-react';
import { animationStyles } from '@/styles/animations';

// Enhanced Starfield with constellation lines
const ConstellationBackground = ({ primarySystem, topContributors = [] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = 400;
    };
    
    resizeCanvas();
    
    const drawConstellation = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create star positions based on contributors
      const stars = topContributors.slice(0, 5).map((_, i) => ({
        x: canvas.width * (0.2 + (i * 0.15) + Math.random() * 0.05),
        y: 100 + Math.sin(i * 0.5) * 50 + Math.random() * 50,
        size: 3 + Math.random() * 2
      }));
      
      // Draw constellation lines
      ctx.strokeStyle = 'rgba(147, 112, 219, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      stars.forEach((star, i) => {
        if (i === 0) ctx.moveTo(star.x, star.y);
        else ctx.lineTo(star.x, star.y);
      });
      ctx.stroke();
      
      // Draw stars with glow
      stars.forEach(star => {
        // Glow effect
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 4);
        gradient.addColorStop(0, 'rgba(147, 112, 219, 0.6)');
        gradient.addColorStop(0.5, 'rgba(147, 112, 219, 0.2)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Core star
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw additional small stars
      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.3})`;
        ctx.beginPath();
        ctx.arc(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 1.5,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    };
    
    drawConstellation();
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [topContributors]);
  
  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-60"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

// Progress ring component
const ProgressRing = ({ percentage, size = 80, strokeWidth = 6 }) => {
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
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-[var(--s3-lavender-200)]">
          {percentage.toFixed(0)}%
        </span>
      </div>
    </div>
  );
};

// Source icon component
const SourceIcon = ({ source }: { source: string }) => {
  const icons = {
    gate: <Zap className="w-4 h-4" />,
    channel: <Activity className="w-4 h-4" />,
    center: <Shield className="w-4 h-4" />,
    type: <Star className="w-4 h-4" />,
    authority: <Compass className="w-4 h-4" />,
    profile: <Eye className="w-4 h-4" />
  };
  return icons[source] || <Sparkles className="w-4 h-4" />;
};

// Enhanced contribution card
const ContributorCard = ({ contributor, index, isExpanded, onToggle }) => {
  const getSourceColor = (source: string) => {
    const colors = {
      gate: 'from-purple-500 to-purple-600',
      channel: 'from-blue-500 to-blue-600',
      center: 'from-green-500 to-green-600',
      type: 'from-yellow-500 to-yellow-600',
      authority: 'from-red-500 to-red-600',
      profile: 'from-pink-500 to-pink-600'
    };
    return colors[source] || 'from-gray-500 to-gray-600';
  };
  
  return (
    <div
      className={`relative group cursor-pointer transition-all duration-300 ${
        isExpanded ? 'scale-[1.02]' : 'hover:scale-[1.01]'
      }`}
      onClick={onToggle}
    >
      {/* Rank indicator for top 3 */}
      {index < 3 && (
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-[var(--s3-gold-400)] to-[var(--s3-gold-600)] flex items-center justify-center shadow-lg z-10">
          <span className="text-xs font-bold text-white">#{index + 1}</span>
        </div>
      )}
      
      <Card variant={isExpanded ? 'primary' : 'default'} className="ml-4">
        <div className="flex items-start gap-3">
          {/* Icon with gradient background */}
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getSourceColor(contributor.source)} flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <SourceIcon source={contributor.source} />
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-1">
              <div>
                <p className="text-sm font-medium text-[var(--s3-lavender-200)]">
                  {contributor.identifier}
                </p>
                <span className="text-xs text-[var(--s3-text-subtle)] capitalize">
                  {contributor.source}
                </span>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold bg-gradient-to-r from-[var(--s3-lavender-400)] to-[var(--s3-lavender-200)] bg-clip-text text-transparent">
                  +{contributor.weight}
                </p>
                <p className="text-xs text-[var(--s3-text-subtle)]">points</p>
              </div>
            </div>
            
            {contributor.description && (
              <p className="text-xs text-[var(--s3-text-subtle)] leading-relaxed mt-2">
                {contributor.description}
              </p>
            )}
            
            {/* Confidence indicator */}
            {contributor.confidence !== undefined && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-[var(--s3-text-subtle)]">Confidence:</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-3 rounded-full transition-all ${
                        i < Math.ceil(contributor.confidence * 5)
                          ? 'bg-[var(--s3-lavender-400)]'
                          : 'bg-[var(--s3-surface-subtle)]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Expanded details */}
            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-[var(--s3-border-muted)]">
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-[var(--s3-text-subtle)]">Impact: </span>
                    <span className="text-[var(--s3-lavender-300)]">
                      {((contributor.weight / 100) * 100).toFixed(1)}% of total
                    </span>
                  </div>
                  {contributor.disputed && (
                    <span className="px-2 py-0.5 bg-[var(--s3-gold-400)]/20 text-[var(--s3-gold-400)] rounded-full">
                      Disputed
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default function WhyScreen() {
  const navigate = useNavigate();
  const classification = useBirthDataStore((state) => state.classification);
  const hdData = useBirthDataStore((state) => state.hdData);
  const loreVersionStatus = useLoreVersionCheck();
  const { recompute, isLoading } = useClassification();
  
  // State management
  const [activeSystem, setActiveSystem] = useState<string>('');
  const [expandedContributor, setExpandedContributor] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    journey: false,
    details: false,
    allSystems: false
  });
  
  // Redirect if no classification
  useEffect(() => {
    if (!classification || !hdData) {
      navigate('/input');
      return;
    }
    
    const primary = classification.classification === 'hybrid' && classification.hybrid
      ? classification.hybrid[0]
      : classification.primary || 'Unknown';
    setActiveSystem(primary);
  }, [classification, hdData, navigate]);
  
  if (!classification || !hdData) return null;
  
  // Determine primary system
  const primarySystem = classification.classification === 'hybrid' && classification.hybrid
    ? classification.hybrid[0]
    : classification.primary || 'Unknown';
  
  // Get available systems
  const availableSystems = [
    primarySystem,
    ...classification.allies.map(ally => ally.system)
  ];
  
  // Get contributors for active system
  const enhancedContributors = classification.enhancedContributorsWithWeights?.[activeSystem] || [];
  const sortedContributors = [...enhancedContributors].sort((a, b) => b.weight - a.weight);
  const topContributors = sortedContributors.slice(0, 5);
  const remainingContributors = sortedContributors.slice(5);
  
  // Group remaining contributors by source
  const groupedContributors = useMemo(() => {
    const groups = {
      gate: [],
      channel: [],
      center: [],
      type: [],
      authority: [],
      profile: []
    };
    
    remainingContributors.forEach(c => {
      if (groups[c.source]) {
        groups[c.source].push(c);
      }
    });
    
    return groups;
  }, [remainingContributors]);
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const handleRecompute = async () => {
    if (!hdData) return;
    await recompute(hdData);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--s3-canvas-dark)] via-[#1a0f2e] to-[var(--s3-canvas-dark)] flex flex-col relative overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        ${animationStyles}
      `}</style>
      
      {/* Hero Section with Constellation */}
      <div className="relative h-96 overflow-hidden">
        <ConstellationBackground 
          primarySystem={primarySystem}
          topContributors={topContributors}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--s3-canvas-dark)]" />
        
        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 z-20 p-6">
          <button 
            onClick={() => navigate('/result')}
            className="flex items-center gap-2 text-[var(--s3-lavender-300)] hover:text-[var(--s3-lavender-200)] transition-all duration-300 hover:translate-x-[-4px]"
            aria-label="Back to results"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Results</span>
          </button>
        </div>
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="animate-fade-in-up" style={{ animation: 'float 6s ease-in-out infinite' }}>
            <ProgressRing percentage={classification.percentages[activeSystem]} />
          </div>
          
          <h1 className="text-4xl font-bold mt-6 mb-2 bg-gradient-to-r from-[var(--s3-lavender-200)] to-[var(--s3-lavender-400)] bg-clip-text text-transparent animate-fade-in-up">
            {activeSystem}
          </h1>
          
          <p className="text-[var(--s3-text-subtle)] text-sm animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Your cosmic blueprint decoded
          </p>
          
          {/* System tabs for hybrid/multiple systems */}
          {availableSystems.length > 1 && (
            <div className="flex gap-2 mt-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {availableSystems.map(system => (
                <button
                  key={system}
                  onClick={() => setActiveSystem(system)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    system === activeSystem
                      ? 'bg-[var(--s3-lavender-600)] text-white shadow-lg'
                      : 'bg-[var(--s3-surface-subtle)]/50 text-[var(--s3-text-subtle)] hover:bg-[var(--s3-surface-subtle)]'
                  }`}
                >
                  {system} • {classification.percentages[system]?.toFixed(1)}%
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative flex-1 max-w-2xl mx-auto w-full px-6 py-8">
        {/* Lore Version Alert */}
        {loreVersionStatus.hasChanged && (
          <div className="mb-6 animate-fade-in-up">
            <Card variant="warning">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[var(--s3-gold-400)] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-[var(--s3-lavender-200)] mb-2">
                    Lore rules have been updated
                  </p>
                  <p className="text-xs text-[var(--s3-text-subtle)] mb-3">
                    Recompute to see results with the latest lore (v{loreVersionStatus.currentVersion}).
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleRecompute}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Recomputing...' : 'Recompute with new lore'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
        
        {/* Journey Overview - Collapsible */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('journey')}
            className="w-full p-4 bg-[var(--s3-surface-subtle)]/30 backdrop-blur rounded-xl border border-[var(--s3-border-muted)] hover:border-[var(--s3-lavender-600)]/30 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-[var(--s3-lavender-400)]" />
                <span className="text-[var(--s3-lavender-200)] font-medium">How This Works</span>
              </div>
              {expandedSections.journey ? (
                <ChevronUp className="w-5 h-5 text-[var(--s3-lavender-400)] group-hover:text-[var(--s3-lavender-300)]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[var(--s3-lavender-400)] group-hover:text-[var(--s3-lavender-300)]" />
              )}
            </div>
          </button>
          
          {expandedSections.journey && (
            <div className="mt-4 grid grid-cols-3 gap-4 animate-fade-in-down">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-[var(--s3-lavender-500)]/20 to-[var(--s3-lavender-600)]/20 flex items-center justify-center">
                  <Moon className="w-8 h-8 text-[var(--s3-lavender-300)]" />
                </div>
                <p className="text-xs text-[var(--s3-lavender-200)] font-medium mb-1">Your Chart</p>
                <p className="text-xs text-[var(--s3-text-subtle)]">Birth data analyzed</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-[var(--s3-lavender-500)]/20 to-[var(--s3-lavender-600)]/20 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-[var(--s3-lavender-300)]" />
                </div>
                <p className="text-xs text-[var(--s3-lavender-200)] font-medium mb-1">Algorithm</p>
                <p className="text-xs text-[var(--s3-text-subtle)]">Pattern matching</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-[var(--s3-lavender-500)]/20 to-[var(--s3-lavender-600)]/20 flex items-center justify-center">
                  <Star className="w-8 h-8 text-[var(--s3-lavender-300)]" />
                </div>
                <p className="text-xs text-[var(--s3-lavender-200)] font-medium mb-1">Star System</p>
                <p className="text-xs text-[var(--s3-text-subtle)]">Your classification</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Core Attributes */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-[var(--s3-lavender-200)] mb-4 flex items-center gap-2">
            <Sun className="w-5 h-5" />
            Your Core Design
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
                  <Compass className="w-6 h-6 text-white" />
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
                  <Eye className="w-6 h-6 text-white" />
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
            <TrendingUp className="w-5 h-5" />
            Strongest Alignments
          </h2>
          <div className="space-y-3">
            {topContributors.map((contributor, index) => (
              <ContributorCard
                key={index}
                contributor={contributor}
                index={index}
                isExpanded={expandedContributor === index}
                onToggle={() => setExpandedContributor(expandedContributor === index ? null : index)}
              />
            ))}
          </div>
        </div>
        
        {/* Detailed Contributors - Collapsible */}
        {remainingContributors.length > 0 && (
          <div className="mb-8">
            <button
              onClick={() => toggleSection('details')}
              className="w-full p-4 bg-[var(--s3-surface-subtle)]/30 backdrop-blur rounded-xl border border-[var(--s3-border-muted)] hover:border-[var(--s3-lavender-600)]/30 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[var(--s3-lavender-400)]" />
                  <span className="text-[var(--s3-lavender-200)] font-medium">All Contributors</span>
                  <span className="text-xs text-[var(--s3-text-subtle)]">
                    ({remainingContributors.length} more)
                  </span>
                </div>
                {expandedSections.details ? (
                  <ChevronUp className="w-5 h-5 text-[var(--s3-lavender-400)] group-hover:text-[var(--s3-lavender-300)]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[var(--s3-lavender-400)] group-hover:text-[var(--s3-lavender-300)]" />
                )}
              </div>
            </button>
            
            {expandedSections.details && (
              <div className="mt-4 space-y-4 animate-fade-in-down">
                {Object.entries(groupedContributors).map(([source, contributors]) => {
                  if (contributors.length === 0) return null;
                  
                  return (
                    <div key={source}>
                      <div className="flex items-center gap-2 mb-2 px-2">
                        <SourceIcon source={source} />
                        <span className="text-sm text-[var(--s3-lavender-300)] capitalize">
                          {source}s
                        </span>
                        <span className="text-xs text-[var(--s3-text-subtle)]">
                          ({contributors.length})
                        </span>
                      </div>
                      <div className="space-y-2">
                        {contributors.map((contributor, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-[var(--s3-surface-subtle)]/20 rounded-lg border border-[var(--s3-border-muted)]"
                          >
                            <span className="text-sm text-[var(--s3-text)]">
                              {contributor.identifier}
                            </span>
                            <div className="flex items-center gap-3">
                              {contributor.confidence !== undefined && (
                                <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-1 h-2.5 rounded-full ${
                                        i < Math.ceil(contributor.confidence * 5)
                                          ? 'bg-[var(--s3-lavender-400)]'
                                          : 'bg-[var(--s3-surface-subtle)]'
                                      }`}
                                    />
                                  ))}
                                </div>
                              )}
                              <span className="text-xs text-[var(--s3-lavender-400)]">
                                +{contributor.weight}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        
        {/* System Comparison */}
        <div className="mb-8">
          <button
            onClick={() => toggleSection('allSystems')}
            className="w-full p-4 bg-[var(--s3-surface-subtle)]/30 backdrop-blur rounded-xl border border-[var(--s3-border-muted)] hover:border-[var(--s3-lavender-600)]/30 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-[var(--s3-lavender-400)]" />
                <span className="text-[var(--s3-lavender-200)] font-medium">All Star Systems</span>
              </div>
              {expandedSections.allSystems ? (
                <ChevronUp className="w-5 h-5 text-[var(--s3-lavender-400)] group-hover:text-[var(--s3-lavender-300)]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[var(--s3-lavender-400)] group-hover:text-[var(--s3-lavender-300)]" />
              )}
            </div>
          </button>
          
          {expandedSections.allSystems && (
            <div className="mt-4 space-y-3 animate-fade-in-down">
              {Object.entries(classification.percentages)
                .sort(([,a], [,b]) => b - a)
                .map(([system, percentage]) => (
                  <div key={system} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-[var(--s3-lavender-300)]">{system}</div>
                    <div className="flex-1 bg-[var(--s3-surface-subtle)]/30 rounded-full h-6 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-700 flex items-center justify-end pr-2 ${
                          system === primarySystem
                            ? 'bg-gradient-to-r from-[var(--s3-lavender-500)] to-[var(--s3-lavender-600)]'
                            : 'bg-[var(--s3-surface-subtle)]'
                        }`}
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="text-xs text-white font-medium">{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-[var(--s3-border-muted)]">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Info className="w-3 h-3 text-[var(--s3-text-subtle)]" />
              <p className="text-xs text-[var(--s3-text-subtle)]">
                Lore v{loreBundle.lore_version} • Deterministic Algorithm
              </p>
            </div>
            <div className="p-3 bg-[var(--s3-lavender-900)]/10 border border-[var(--s3-border-muted)] rounded-lg">
              <p className="text-xs text-[var(--s3-text-subtle)] leading-relaxed">
                For insight & entertainment. Not medical, financial, or legal advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}