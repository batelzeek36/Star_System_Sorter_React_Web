import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { useBirthDataStore } from '@/store/birthDataStore';
import { loreBundle } from '@/lib/lore.bundle';
import { EvidenceMatrix } from '@/components/lore/EvidenceMatrix';
import { SourceBadge } from '@/components/lore/SourceBadge';
import { Button } from '@/components/figma/Button';
import type { EnhancedContributor } from '@/lib/schemas';

// Starfield component for cosmic background (consistent with other screens)
const Starfield = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(100)].map((_, i) => (
      <div
        key={i}
        className="absolute w-0.5 h-0.5 bg-white rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.5 + 0.1,
          animation: `twinkle ${2 + Math.random() * 3}s infinite ${Math.random() * 2}s`,
        }}
      />
    ))}
  </div>
);

export default function DossierScreen() {
  const navigate = useNavigate();
  const classification = useBirthDataStore((state) => state.classification);
  const hdData = useBirthDataStore((state) => state.hdData);
  const dossierRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Navigation guard: Redirect to /input if no data
  useEffect(() => {
    if (!classification || !hdData) {
      navigate('/input');
    }
  }, [classification, hdData, navigate]);

  // Collect all contributors from all systems for the Evidence Matrix
  const allContributors = useMemo(() => {
    if (!classification || !classification.enhancedContributorsWithWeights) {
      return [];
    }

    const contributors: EnhancedContributor[] = [];
    Object.values(classification.enhancedContributorsWithWeights).forEach(systemContributors => {
      contributors.push(...systemContributors);
    });

    return contributors;
  }, [classification]);

  // Compute signature channel from contributors
  const signatureChannel = useMemo(() => {
    if (!classification || !classification.enhancedContributorsWithWeights) {
      return '—';
    }

    // Get all contributors from all systems
    const allContributors: EnhancedContributor[] = [];
    Object.values(classification.enhancedContributorsWithWeights).forEach(contributors => {
      allContributors.push(...contributors);
    });

    // Filter for channel-based rules only
    const channelContributors = allContributors.filter(c => 
      c.key.startsWith('channel_') || c.label.startsWith('Channel:')
    );

    if (channelContributors.length === 0) {
      return '—';
    }

    // Sort by weight (descending), then by channel number (ascending), then alphabetically
    const sorted = channelContributors.sort((a, b) => {
      // First, sort by weight descending
      if (b.weight !== a.weight) {
        return b.weight - a.weight;
      }

      // Extract channel number for tie-breaking
      const getChannelNumber = (key: string): number => {
        const match = key.match(/channel_(\d+)/);
        return match ? parseInt(match[1], 10) : 999;
      };

      const aNumber = getChannelNumber(a.key);
      const bNumber = getChannelNumber(b.key);

      // If weights are equal, sort by channel number (lower is first)
      if (aNumber !== bNumber) {
        return aNumber - bNumber;
      }

      // If still tied, sort alphabetically
      return a.key.localeCompare(b.key);
    });

    // Extract the channel value from the label (e.g., "Channel: 13-33" -> "13-25")
    const labelMatch = sorted[0].label.match(/Channel:\s*(.+)/);
    if (labelMatch) {
      return labelMatch[1];
    }

    // Fallback: extract from key (e.g., "channel_13_25" -> "13-25" or "channel_13-25" -> "13-25")
    const keyMatch = sorted[0].key.match(/channel_(.+)/);
    if (keyMatch) {
      return keyMatch[1].replace('_', '-');
    }

    return '—';
  }, [classification]);

  // Compute "Why Not" data - next 1-2 systems with top 3 unmatched rules
  const whyNotData = useMemo(() => {
    if (!classification || !classification.percentages || !hdData) {
      return [];
    }

    // Get all systems sorted by percentage (descending)
    const sortedSystems = Object.entries(classification.percentages)
      .map(([systemLabel, percentage]) => {
        // Find system ID from label
        const system = loreBundle.systems.find(s => s.label === systemLabel);
        return {
          id: system?.id || systemLabel,
          label: systemLabel,
          percentage,
        };
      })
      .sort((a, b) => b.percentage - a.percentage);

    // Determine which systems to skip (primary or hybrid pair)
    const systemsToSkip = new Set<string>();
    if (classification.classification === 'hybrid' && classification.hybrid) {
      // Skip both systems in the hybrid pair
      classification.hybrid.forEach(id => {
        const system = loreBundle.systems.find(s => s.id === id);
        if (system) {
          systemsToSkip.add(system.label);
        }
      });
    } else if (classification.primary) {
      // Skip the primary system
      systemsToSkip.add(classification.primary);
    }

    // Get the next 1-2 systems (those not in the skip list)
    const nextSystems = sortedSystems
      .filter(s => !systemsToSkip.has(s.label))
      .slice(0, 2);

    // For each system, find the top 3 unmatched rules
    return nextSystems.map(system => {
      // Get all rules for this system from loreBundle
      const systemRules = loreBundle.rules
        .filter(rule => rule.systems.some(s => s.id === system.id))
        .map(rule => {
          // Check if this rule matched (is it in the contributors?)
          const matched = classification.enhancedContributorsWithWeights?.[system.label]?.some(
            c => c.ruleId === rule.id
          ) || false;

          // Get the weight for this system
          const systemWeight = rule.systems.find(s => s.id === system.id);
          const weight = systemWeight?.w || 0;

          return {
            id: rule.id,
            rationale: rule.rationale,
            weight,
            confidence: rule.confidence,
            matched,
          };
        });

      // Filter to only unmatched rules, then sort by weight desc, confidence desc, id asc
      const unmatchedRules = systemRules
        .filter(r => !r.matched)
        .sort((a, b) => {
          // Sort by weight descending
          if (b.weight !== a.weight) {
            return b.weight - a.weight;
          }
          // Then by confidence descending
          if (b.confidence !== a.confidence) {
            return b.confidence - a.confidence;
          }
          // Then by ID alphabetically
          return a.id.localeCompare(b.id);
        })
        .slice(0, 3); // Take top 3

      return {
        system: system.label,
        systemId: system.id,
        percentage: system.percentage,
        unmatchedRules,
      };
    });
  }, [classification, hdData]);

  // Deduplicate sources from all contributors and sort alphabetically by title
  const sourcesGallery = useMemo(() => {
    if (!classification || !classification.enhancedContributorsWithWeights) {
      return [];
    }

    // Collect all unique source IDs from all contributors
    const sourceIds = new Set<string>();
    Object.values(classification.enhancedContributorsWithWeights).forEach(contributors => {
      contributors.forEach(contributor => {
        contributor.sources.forEach(sourceId => {
          sourceIds.add(sourceId);
        });
      });
    });

    // Map source IDs to source objects from loreBundle
    const sources = Array.from(sourceIds)
      .map(sourceId => loreBundle.sources.find(s => s.id === sourceId))
      .filter((source): source is NonNullable<typeof source> => source !== undefined);

    // Sort alphabetically by title
    return sources.sort((a, b) => a.title.localeCompare(b.title));
  }, [classification]);

  // Don't render anything if no data (will be redirected)
  if (!classification || !hdData) {
    return null;
  }

  // Get primary system for display
  const primarySystem = classification.classification === 'hybrid' && classification.hybrid
    ? classification.primary || classification.hybrid[0]
    : classification.primary || 'Unknown';

  // Export PNG function
  const handleExportPNG = async () => {
    if (!dossierRef.current) return;

    setIsExporting(true);
    try {
      // Get the primary system name for the filename
      const systemName = classification.primary || 'Unknown';
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `dossier-${systemName}-${timestamp}.png`;

      // Generate PNG with html-to-image
      // Target 1080×1920 resolution (or current viewport)
      // Cap pixelRatio at 2 to guard against memory issues on mobile
      const dataUrl = await toPng(dossierRef.current, {
        cacheBust: true,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        width: 1080,
        height: Math.max(dossierRef.current.scrollHeight, 1920),
      });

      // Trigger download via anchor element
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export PNG:', error);
      // Optionally show an error toast here
    } finally {
      setIsExporting(false);
    }
  };

  // Print/PDF function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--s3-canvas-dark)] via-[var(--s3-canvas-dark)] to-[var(--s3-canvas-dark)] relative overflow-hidden print:bg-white">
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* Starfield Background - Hidden in print */}
      <div className="no-print">
        <Starfield />
      </div>
      
      {/* Cosmic Glow Effect - Hidden in print */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--s3-lavender-600)]/20 rounded-full blur-3xl pointer-events-none no-print"></div>

      {/* Main Content */}
      <div className="relative max-w-4xl mx-auto px-6 py-12" ref={dossierRef}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--s3-lavender-200)] to-[var(--s3-lavender-400)] bg-clip-text text-transparent mb-2 print:text-black print:bg-none">
                Galactic Dossier
              </h1>
              <p className="text-sm text-[var(--s3-text-subtle)] print:text-gray-700">
                {primarySystem} Classification
              </p>
            </div>
            
            {/* Export Buttons - Hidden in print */}
            <div className="flex gap-2 no-print">
              <Button
                variant="primary"
                size="md"
                onClick={handleExportPNG}
                disabled={isExporting}
                className="flex-shrink-0"
              >
                {isExporting ? 'Exporting...' : 'Export PNG'}
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={handlePrint}
                className="flex-shrink-0"
              >
                Print/PDF
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => navigate('/narrative')}
                className="flex-shrink-0"
              >
                Generate Narrative
              </Button>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Identity Snapshot Section */}
          <div className="p-6 bg-[var(--s3-surface-default)]/50 border border-[var(--s3-border-default)] rounded-[var(--s3-radius-xl)] print-no-break">
            <h2 className="text-xl text-[var(--s3-text-default)] mb-4 font-semibold print:text-black">Identity Snapshot</h2>
            
            <div className="space-y-4">
              {/* Type, Authority, Profile */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-[var(--s3-text-subtle)] uppercase tracking-wide mb-1">Type</div>
                  <div className="text-sm text-[var(--s3-text-default)] font-medium">{hdData.type}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--s3-text-subtle)] uppercase tracking-wide mb-1">Authority</div>
                  <div className="text-sm text-[var(--s3-text-default)] font-medium">{hdData.authority}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--s3-text-subtle)] uppercase tracking-wide mb-1">Profile</div>
                  <div className="text-sm text-[var(--s3-text-default)] font-medium">{hdData.profile}</div>
                </div>
              </div>

              {/* Defined Centers */}
              <div>
                <div className="text-xs text-[var(--s3-text-subtle)] uppercase tracking-wide mb-2">Defined Centers</div>
                <div className="flex flex-wrap gap-2">
                  {hdData.centers && hdData.centers.length > 0 ? (
                    hdData.centers.map((center) => (
                      <span
                        key={center}
                        className="px-3 py-1 text-xs bg-[var(--s3-lavender-900)]/30 text-[var(--s3-lavender-200)] border border-[var(--s3-lavender-700)] rounded-full"
                      >
                        {center}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-[var(--s3-text-subtle)]">None</span>
                  )}
                </div>
              </div>

              {/* Signature Channel */}
              <div>
                <div className="text-xs text-[var(--s3-text-subtle)] uppercase tracking-wide mb-1">Signature Channel</div>
                <div className="text-sm text-[var(--s3-text-default)] font-medium">{signatureChannel}</div>
              </div>
            </div>
          </div>

          {/* One-Line Verdict Section */}
          <div className="p-6 bg-[var(--s3-surface-emphasis)]/50 border border-[var(--s3-border-emphasis)] rounded-[var(--s3-radius-xl)] print-no-break">
            <h2 className="text-xl text-[var(--s-text-default)] font-semibold mb-4 print:text-black">The Verdict</h2>
            <div className="text-base text-[var(--s3-text-default)] leading-relaxed">
              {classification.classification === 'hybrid' && classification.hybrid ? (
                <>
                  <span className="font-semibold text-[var(--s3-lavender-300)]">
                    Hybrid: {classification.hybrid.map(id => {
                      const system = loreBundle.systems.find(s => s.id === id);
                      return system?.label || id;
                    }).join(' + ')}
                  </span>
                  {' — '}
                  {classification.hybrid.map((id, index) => {
                    const system = loreBundle.systems.find(s => s.id === id);
                    return (
                      <span key={id}>
                        {index > 0 && ' '}
                        {system?.description || 'Unknown system'}
                      </span>
                    );
                  }).reduce((prev, curr, index) => (
                    <>
                      {prev}
                      {index === 1 && <span className="text-[var(--s3-text-subtle)]"> {' + '} </span>}
                      {curr}
                    </>
                  ))}
                </>
              ) : (
                <>
                  <span className="font-semibold text-[var(--s3-lavender-300)]">
                    {classification.primary ? 
                      loreBundle.systems.find(s => s.id === classification.primary)?.label || classification.primary 
                      : 'Unknown'}
                  </span>
                  {' — '}
                  {loreBundle.systems.find(s => s.id === classification.primary)?.description || 'Unknown system'}
                </>
              )}
            </div>
          </div>

          {/* Gate→Faction Grid Section */}
          <div className="print-no-break">
            <h2 className="text-xl text-[var(--s3-text-default)] font-semibold mb-4 print:text-black">Gate→Faction Grid</h2>
            <EvidenceMatrix 
              contributors={allContributors} 
              activeSystemId={primarySystem}
            />
          </div>

          {/* Deployment Matrix Section */}
          <div className="p-6 bg-[var(--s3-surface-default)]/50 border border-[var(--s3-border-default)] rounded-[var(--s3-radius-xl)] print-no-break">
            <h2 className="text-xl text-[var(--s3-text-default)] font-semibold mb-4 print:text-black">Deployment Matrix</h2>
            <p className="text-sm text-[var(--s3-text-subtle)] mb-6">
              All star systems ranked by alignment percentage
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--s3-border-default)]">
                    <th className="text-left py-3 px-2 text-xs font-semibold text-[var(--s3-text-subtle)] uppercase tracking-wide">
                      Rank
                    </th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-[var(--s3-text-subtle)] uppercase tracking-wide">
                      System
                    </th>
                    <th className="text-right py-3 px-2 text-xs font-semibold text-[var(--s3-text-subtle)] uppercase tracking-wide">
                      Alignment
                    </th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-[var(--s3-text-subtle)] uppercase tracking-wide">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(classification.percentages || {})
                    .sort(([, a], [, b]) => b - a)
                    .map(([systemKey, percentage], index) => {
                      // systemKey could be either ID (uppercase like "PLEIADES") or label (like "Pleiades")
                      // Try to find by ID first, then by label
                      const system = loreBundle.systems.find(s => 
                        s.id === systemKey || s.label === systemKey
                      );
                      const rank = index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Tertiary';
                      const displayName = system?.label || systemKey;
                      
                      return (
                        <tr 
                          key={systemKey}
                          className="border-b border-[var(--s3-border-muted)] last:border-0"
                        >
                          <td className="py-3 px-2">
                            <span className={`text-xs font-medium ${
                              index === 0 
                                ? 'text-[var(--s3-lavender-300)]' 
                                : index === 1 
                                ? 'text-[var(--s3-lavender-400)]' 
                                : 'text-[var(--s3-text-subtle)]'
                            }`}>
                              {rank}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <span className={`font-medium ${
                              index === 0 
                                ? 'text-[var(--s3-lavender-300)]' 
                                : 'text-[var(--s3-text-default)]'
                            }`}>
                              {displayName}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span className="font-mono text-[var(--s3-text-default)]">
                              {percentage.toFixed(2)}%
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <span className="text-[var(--s3-text-subtle)] text-sm">
                              {system?.description || 'Unknown system'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Why Not Section */}
          {whyNotData.length > 0 && (
            <div className="p-6 bg-[var(--s3-surface-default)]/50 border border-[var(--s3-border-default)] rounded-[var(--s3-radius-xl)] print-no-break">
              <h2 className="text-xl text-[var(--s3-text-default)] font-semibold mb-4 print:text-black">Why Not...?</h2>
              <p className="text-sm text-[var(--s3-text-subtle)] mb-6">
                Other systems that were close contenders. Here's what would have increased their scores:
              </p>
              
              <div className="space-y-6">
                {whyNotData.map((systemData) => (
                  <div key={systemData.systemId} className="space-y-3">
                    {/* System Header */}
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-lg font-semibold text-[var(--s3-lavender-300)]">
                        {systemData.system}
                      </h3>
                      <span className="text-sm text-[var(--s3-text-subtle)]">
                        {systemData.percentage.toFixed(2)}%
                      </span>
                    </div>

                    {/* Unmatched Rules */}
                    {systemData.unmatchedRules.length > 0 ? (
                      <div className="space-y-2">
                        {systemData.unmatchedRules.map((rule) => (
                          <div
                            key={rule.id}
                            className="p-3 bg-[var(--s3-surface-subtle)]/30 border border-[var(--s3-border-muted)] rounded-[var(--s3-radius-lg)]"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-sm text-[var(--s3-text-default)] flex-1">
                                {rule.rationale}
                              </p>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-xs text-[var(--s3-text-subtle)] font-mono">
                                  +{rule.weight}
                                </span>
                                <span className="text-xs text-[var(--s3-lavender-400)]">
                                  {'★'.repeat(rule.confidence)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[var(--s3-text-subtle)] italic">
                        No additional factors would significantly increase this system's score.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sources Gallery Section */}
          <div className="p-6 bg-[var(--s3-surface-default)]/50 border border-[var(--s3-border-default)] rounded-[var(--s3-radius-xl)] print-no-break">
            <h2 className="text-xl text-[var(--s3-text-default)] font-semibold mb-4 print:text-black">Sources & References</h2>
            <p className="text-sm text-[var(--s3-text-subtle)] mb-6">
              All sources cited in your classification
            </p>
            
            {/* Sources Grid */}
            <div className="flex flex-wrap gap-2 mb-4">
              {sourcesGallery.map(source => (
                <SourceBadge 
                  key={source.id} 
                  sourceId={source.id} 
                  showTooltip={true}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="pt-4 border-t border-[var(--s3-border-muted)]">
              <p className="text-xs text-[var(--s3-text-subtle)]">
                ⚑ = Disputed or controversial lore
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-4 bg-[var(--s3-lavender-900)]/10 border border-[var(--s3-border-muted)] rounded-[var(--s3-radius-xl)]">
            <p className="text-xs text-[var(--s3-text-subtle)] leading-relaxed">
              For insight & entertainment. Not medical, financial, or legal advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
