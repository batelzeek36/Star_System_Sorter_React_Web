import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useBirthDataStore } from '@/store/birthDataStore';
// DISABLED: Filter controls have been disabled
// import { useUIStore } from '@/store/uiStore';
import { useLoreVersionCheck } from '@/hooks/useLoreVersionCheck';
import { useClassification } from '@/hooks/useClassification';
import { Card } from '@/components/figma/Card';
import { Button } from '@/components/figma/Button';
import { SystemSummary } from '@/components/lore/SystemSummary';
import { ContributionCard } from '@/components/lore/ContributionCard';
import { FilterControls } from '@/components/lore/FilterControls';
import { loreBundle } from '@/lib/lore.bundle';
import { Star, AlertCircle, Filter, Info } from 'lucide-react';

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



export default function WhyScreen() {
  const navigate = useNavigate();
  const classification = useBirthDataStore((state) => state.classification);
  const hdData = useBirthDataStore((state) => state.hdData);
  const loreVersionStatus = useLoreVersionCheck();
  const { recompute, isLoading } = useClassification();

  // Redirect to input if no classification or HD data
  if (!classification || !hdData) {
    navigate('/input');
    return null;
  }

  // Handle recompute with new lore
  const handleRecompute = async () => {
    if (!hdData) return;
    await recompute(hdData);
  };

  // Determine primary system name
  const primarySystem = classification.classification === 'hybrid' && classification.hybrid
    ? classification.hybrid[0]
    : classification.primary || 'Unknown';

  // Get all available systems (primary + allies)
  const availableSystems = [
    primarySystem,
    ...classification.allies.map(ally => ally.system)
  ];

  // State for active tab (default to primary system)
  const [activeSystem, setActiveSystem] = useState(primarySystem);

  // Get contributors with weights for the active system
  const enhancedContributors = classification.enhancedContributorsWithWeights?.[activeSystem] || [];
  const activePercentage = classification.percentages[activeSystem] || 0;
  
  // DISABLED: Filter preferences from UI store
  // Filters are disabled to prevent users from removing sources with minimal confidence
  // const hideDisputed = useUIStore((state) => state.hideDisputed);
  // const minConfidence = useUIStore((state) => state.minConfidence);
  
  // Show all contributors without filtering
  const filteredContributors = useMemo(() => {
    return enhancedContributors;
  }, [enhancedContributors]);
  
  // Sort filtered contributors by weight descending
  const sortedContributors = [...filteredContributors].sort((a, b) => b.weight - a.weight);
  
  // Calculate total weight for the active system
  const totalWeight = enhancedContributors.reduce((sum, c) => sum + c.weight, 0);

  // Set up virtualization for large contributor lists (>75 items)
  const parentRef = useRef<HTMLDivElement>(null);
  const shouldVirtualize = sortedContributors.length > 75;
  
  const virtualizer = useVirtualizer({
    count: sortedContributors.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Estimated height of each ContributionCard in pixels
    overscan: 5, // Number of items to render outside visible area
    enabled: shouldVirtualize,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--s3-canvas-dark)] via-[var(--s3-surface-subtle)] to-[var(--s3-canvas-dark)] flex flex-col relative overflow-hidden">
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <Starfield />
      
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--s3-lavender-600)]/20 rounded-full blur-3xl animate-glow-pulse"></div>
      
      <div className="relative flex-1 flex flex-col max-w-md mx-auto w-full px-6 py-12">
        {/* Header */}
        <div className="mb-6 animate-fade-in-down">
          <button 
            onClick={() => navigate('/result')}
            className="mb-4 min-h-[44px] px-3 py-2 text-[var(--s3-lavender-400)] hover:text-[var(--s3-lavender-300)] transition-all duration-300 hover:translate-x-[-4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--s3-lavender-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--s3-canvas-dark)] rounded-lg"
            aria-label="Go back to results"
          >
            ← Back
          </button>
          <h1 className="text-2xl mb-2 bg-gradient-to-r from-[var(--s3-lavender-200)] to-[var(--s3-lavender-400)] bg-clip-text text-transparent">
            Why {primarySystem}?
          </h1>
          <p className="text-xs text-[var(--s3-text-subtle)]">
            Deterministic sort contributors
          </p>
        </div>

        {/* System Summary */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <SystemSummary classification={classification} />
        </div>

        {/* Star System Tabs */}
        {availableSystems.length > 1 && (
          <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <div 
              className="flex gap-2 overflow-x-auto pb-2"
              role="tablist"
              aria-label="Star system tabs"
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                  e.preventDefault();
                  const currentIndex = availableSystems.indexOf(activeSystem);
                  let nextIndex;
                  
                  if (e.key === 'ArrowRight') {
                    nextIndex = (currentIndex + 1) % availableSystems.length;
                  } else {
                    nextIndex = (currentIndex - 1 + availableSystems.length) % availableSystems.length;
                  }
                  
                  setActiveSystem(availableSystems[nextIndex]);
                  
                  // Focus the new tab
                  const tabs = e.currentTarget.querySelectorAll('button[role="tab"]');
                  (tabs[nextIndex] as HTMLButtonElement)?.focus();
                }
              }}
            >
              {availableSystems.map((system) => {
                const isActive = system === activeSystem;
                const percentage = classification.percentages[system] || 0;
                const isPrimary = system === primarySystem;
                
                return (
                  <button
                    key={system}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`tabpanel-${system}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveSystem(system)}
                    className={`
                      flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                      min-h-[44px] min-w-[100px]
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--s3-lavender-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--s3-canvas-dark)]
                      ${isActive 
                        ? 'bg-[var(--s3-lavender-600)] text-white shadow-lg shadow-[var(--s3-lavender-600)]/20 scale-105' 
                        : 'bg-[var(--s-surface-subtle)] text-[var(--s3-text-subtle)] hover:bg-[var(--s3-surface-subtle)]/80 hover:scale-105'
                      }
                    `}
                    aria-label={`View ${system} contributors`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm">{system}</span>
                      <span className={`text-xs ${isActive ? 'text-white/80' : 'text-[var(--s3-text-subtle)]'}`}>
                        {percentage.toFixed(1)}%
                      </span>
                      {isPrimary && (
                        <span className="text-xs text-[var(--s3-gold-400)]">Primary</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Lore Version Mismatch Banner */}
        {loreVersionStatus.hasChanged && (
          <div className="mb-6">
            <Card variant="warning">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[var(--s3-gold-400)] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-[var(--s3-lavender-200)] mb-2">
                    Lore rules have been updated
                  </p>
                  <p className="text-xs text-[var(--s3-text-subtle)] mb-3">
                    Your classification was computed with an older version of the lore rules. 
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

        {/* Core HD Attributes Section */}
        <div className="mb-6">
          <p className="text-xs text-[var(--s3-text-subtle)] mb-3">Your Human Design</p>
          <div className="space-y-3">
            <Card variant="default">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)] flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-[var(--s3-lavender-200)]">Type: {hdData.type}</p>
                  </div>
                  <p className="text-xs text-[var(--s3-text-subtle)]">
                    Your energy type and strategy
                  </p>
                </div>
              </div>
            </Card>

            <Card variant="default">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)] flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-[var(--s3-lavender-200)]">Profile: {hdData.profile}</p>
                  </div>
                  <p className="text-xs text-[var(--s3-text-subtle)]">
                    Your life theme and role
                  </p>
                </div>
              </div>
            </Card>

            <Card variant="default">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)] flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-[var(--s3-lavender-200)]">Authority: {hdData.authority}</p>
                  </div>
                  <p className="text-xs text-[var(--s3-text-subtle)]">
                    Your decision-making strategy
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mb-6">
          <FilterControls />
        </div>

        {/* Contributing Attributes */}
        {sortedContributors.length > 0 ? (
          <div 
            className="mb-6"
            role="tabpanel"
            id={`tabpanel-${activeSystem}`}
            aria-labelledby={`tab-${activeSystem}`}
          >
            <p className="text-xs text-[var(--s3-text-subtle)] mb-3">
              {activeSystem === primarySystem ? 'Deterministic sort contributors' : `Contributors for ${activeSystem}`}
            </p>
            {shouldVirtualize ? (
              <div
                ref={parentRef}
                className="overflow-auto"
                style={{ maxHeight: '600px' }}
              >
                <div
                  style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  {virtualizer.getVirtualItems().map((virtualItem) => (
                    <div
                      key={virtualItem.key}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <div className="pb-3">
                        <ContributionCard
                          contributor={sortedContributors[virtualItem.index]}
                          totalWeight={totalWeight}
                          systemId={activeSystem}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedContributors.map((contributor, index) => (
                  <ContributionCard
                    key={index}
                    contributor={contributor}
                    totalWeight={totalWeight}
                    systemId={activeSystem}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mb-6">
            <Card variant="default">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--s3-lavender-600)]/20 flex items-center justify-center flex-shrink-0">
                  <Filter className="w-5 h-5 text-[var(--s3-lavender-400)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[var(--s3-lavender-200)] mb-2">
                    No contributors found
                  </p>
                  <p className="text-xs text-[var(--s3-text-subtle)] mb-3">
                    There are no contributors for this star system.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-[var(--s3-text-subtle)]">
                    <Info className="w-4 h-4" />
                    <span>All available lore is shown</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Total Alignment */}
        <div className="pt-4 mb-6">
          <p className="text-xs text-center text-[var(--s3-text-subtle)]">
            Total alignment: {activePercentage.toFixed(1)}% {activeSystem}
          </p>
        </div>

        {/* Footer with Lore Version and Disclaimer */}
        <div className="mt-auto pt-6 space-y-4">
          {/* Lore Version */}
          <div className="text-center">
            <p className="text-xs text-[var(--s3-text-subtle)]">
              Lore v{loreBundle.lore_version} • {classification.classification === 'hybrid' && classification.hybrid ? 
                `${classification.hybrid[0]} + ${classification.hybrid[1]} (Δ${Math.abs(classification.percentages[classification.hybrid[0]] - classification.percentages[classification.hybrid[1]]).toFixed(1)}%)` : 
                'Deterministic rules engine'} • For insight & entertainment
            </p>
          </div>

          {/* Legal Disclaimer */}
          <div className="mb-4">
            <div className="p-3 bg-[var(--s3-lavender-900)]/10 border border-[var(--s3-border-muted)] rounded-[var(--s3-radius-xl)]">
              <p className="text-xs text-[var(--s3-text-subtle)] leading-relaxed">
                For insight & entertainment. Not medical, financial, or legal advice.
              </p>
            </div>
          </div>
        </div>

        <div className="h-8"></div>
      </div>
    </div>
  );
}
