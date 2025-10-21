import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, Printer, FileText, AlertCircle } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useBirthDataStore } from '@/store/birthDataStore';
import { loreBundle } from '@/lib/lore.bundle';
import { Button } from '@/components/figma/Button';
import { Card } from '@/components/figma/Card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { EnhancedContributor } from '@/lib/schemas';

// Render confidence stars
const ConfidenceStars = ({ confidence }: { confidence: number }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i < confidence);
  return (
    <span className="inline-flex gap-0.5">
      {stars.map((filled, i) => (
        <span key={i} className={filled ? 'text-violet-400' : 'text-white/20'}>
          ●
        </span>
      ))}
    </span>
  );
};

export default function DossierScreen() {
  const navigate = useNavigate();
  const classification = useBirthDataStore((state) => state.classification);
  const hdData = useBirthDataStore((state) => state.hdData);
  const contentRef = useRef<HTMLDivElement>(null);
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

    const allContributors: EnhancedContributor[] = [];
    Object.values(classification.enhancedContributorsWithWeights).forEach(contributors => {
      allContributors.push(...contributors);
    });

    const channelContributors = allContributors.filter(c => 
      c.key.startsWith('channel_') || c.label.startsWith('Channel:')
    );

    if (channelContributors.length === 0) {
      return '—';
    }

    const sorted = channelContributors.sort((a, b) => {
      if (b.weight !== a.weight) {
        return b.weight - a.weight;
      }

      const getChannelNumber = (key: string): number => {
        const match = key.match(/channel_(\d+)/);
        return match ? parseInt(match[1], 10) : 999;
      };

      const aNumber = getChannelNumber(a.key);
      const bNumber = getChannelNumber(b.key);

      if (aNumber !== bNumber) {
        return aNumber - bNumber;
      }

      return a.key.localeCompare(b.key);
    });

    const labelMatch = sorted[0].label.match(/Channel:\s*(.+)/);
    if (labelMatch) {
      return labelMatch[1];
    }

    const keyMatch = sorted[0].key.match(/channel_(.+)/);
    if (keyMatch) {
      return keyMatch[1].replace('_', '-');
    }

    return '—';
  }, [classification]);

  // Compute "Why Not" data
  const whyNotData = useMemo(() => {
    if (!classification || !classification.percentages || !hdData) {
      return [];
    }

    const sortedSystems = Object.entries(classification.percentages)
      .map(([systemLabel, percentage]) => {
        const system = loreBundle.systems.find(s => s.label === systemLabel);
        return {
          id: system?.id || systemLabel,
          label: systemLabel,
          percentage,
        };
      })
      .sort((a, b) => b.percentage - a.percentage);

    const systemsToSkip = new Set<string>();
    if (classification.classification === 'hybrid' && classification.hybrid) {
      classification.hybrid.forEach(id => {
        const system = loreBundle.systems.find(s => s.id === id);
        if (system) {
          systemsToSkip.add(system.label);
        }
      });
    } else if (classification.primary) {
      systemsToSkip.add(classification.primary);
    }

    const nextSystems = sortedSystems
      .filter(s => !systemsToSkip.has(s.label))
      .slice(0, 2);

    return nextSystems.map(system => {
      const systemRules = loreBundle.rules
        .filter(rule => rule.systems.some(s => s.id === system.id))
        .map(rule => {
          const matched = classification.enhancedContributorsWithWeights?.[system.label]?.some(
            c => c.ruleId === rule.id
          ) || false;

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

      const unmatchedRules = systemRules
        .filter(r => !r.matched)
        .sort((a, b) => {
          if (b.weight !== a.weight) {
            return b.weight - a.weight;
          }
          if (b.confidence !== a.confidence) {
            return b.confidence - a.confidence;
          }
          return a.id.localeCompare(b.id);
        })
        .slice(0, 3);

      return {
        system: system.label,
        systemId: system.id,
        percentage: system.percentage,
        unmatchedRules,
      };
    });
  }, [classification, hdData]);

  // Deduplicate sources
  const sourcesGallery = useMemo(() => {
    if (!classification || !classification.enhancedContributorsWithWeights) {
      return [];
    }

    const sourceIds = new Set<string>();
    Object.values(classification.enhancedContributorsWithWeights).forEach(contributors => {
      contributors.forEach(contributor => {
        contributor.sources.forEach(sourceId => {
          sourceIds.add(sourceId);
        });
      });
    });

    const sources = Array.from(sourceIds)
      .map(sourceId => loreBundle.sources.find(s => s.id === sourceId))
      .filter((source): source is NonNullable<typeof source> => source !== undefined);

    return sources.sort((a, b) => a.title.localeCompare(b.title));
  }, [classification]);

  // Don't render if no data
  if (!classification || !hdData) {
    return null;
  }

  const primarySystem = classification.classification === 'hybrid' && classification.hybrid
    ? classification.primary || classification.hybrid[0]
    : classification.primary || 'Unknown';

  const handleExportPNG = async () => {
    if (!contentRef.current) return;

    setIsExporting(true);
    try {
      const systemName = classification.primary || 'Unknown';
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `dossier-${systemName}-${timestamp}.png`;

      const dataUrl = await toPng(contentRef.current, {
        cacheBust: true,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        width: 1080,
        height: Math.max(contentRef.current.scrollHeight, 1920),
      });

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export PNG:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateNarrative = () => {
    navigate('/narrative');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0118] via-[#1a0f2e] to-[#0a0118] text-white">
      {/* Animated starfield background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none print:hidden" id="starfield">
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

      {/* Cosmic glow effect */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl opacity-50 pointer-events-none print:hidden"
           style={{ animation: 'pulse 4s ease-in-out infinite' }} />

      <div ref={contentRef} className="relative z-10 max-w-[1200px] mx-auto px-4 py-8 animate-fade-in">
        {/* Header */}
        <header className="mb-8 animate-fade-in-down print:mb-4">
          <button 
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 print:hidden"
            onClick={() => navigate('/result')}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-white/90 mb-2">Galactic Dossier</h1>
              <p className="text-violet-300 text-xl">{primarySystem} Classification</p>
            </div>

            <div className="flex gap-2 print:hidden">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportPNG}
                disabled={isExporting}
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export PNG'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePrint}
              >
                <Printer className="w-4 h-4 mr-2" />
                Print/PDF
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleGenerateNarrative}
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Narrative
              </Button>
            </div>
          </div>
        </header>

        {/* Identity Snapshot */}
        <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-white/90 mb-4 uppercase tracking-wider text-sm">Identity Snapshot</h2>
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Type</div>
                <div className="text-white">{hdData.type}</div>
              </div>
              <div>
                <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Authority</div>
                <div className="text-white">{hdData.authority}</div>
              </div>
              <div>
                <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Profile</div>
                <div className="text-white font-mono">{hdData.profile}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-white/60 text-xs uppercase tracking-wider mb-2">Defined Centers</div>
                <div className="flex flex-wrap gap-2">
                  {hdData.centers && hdData.centers.length > 0 ? (
                    hdData.centers.map(center => (
                      <span
                        key={center}
                        className="px-3 py-1 text-xs bg-[var(--s3-lavender-900)]/30 text-[var(--s3-lavender-200)] border border-[var(--s3-lavender-700)] rounded-full"
                      >
                        {center}
                      </span>
                    ))
                  ) : (
                    <span className="text-white/60">None</span>
                  )}
                </div>
              </div>
              {signatureChannel !== '—' && (
                <div>
                  <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Signature Channel</div>
                  <div className="text-white font-mono">{signatureChannel}</div>
                </div>
              )}
            </div>
          </Card>
        </section>

        {/* The Verdict */}
        <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-white/90 mb-4 uppercase tracking-wider text-sm">The Verdict</h2>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-transparent border border-violet-500/30 p-8">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />
            <div className="relative text-center">
              <div className="text-4xl md:text-5xl text-white mb-2">{primarySystem}</div>
              <div className="text-violet-300">Primary Classification</div>
            </div>
          </div>
        </section>

        {/* Evidence Matrix */}
        <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-white/90 uppercase tracking-wider text-sm">Evidence Matrix</h2>
            <div className="text-white/60 text-xs">
              Showing all {allContributors.length} contributors
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white/70">Type</TableHead>
                    <TableHead className="text-white/70">Attribute</TableHead>
                    <TableHead className="text-white/70 text-right">Weight</TableHead>
                    <TableHead className="text-white/70">Confidence</TableHead>
                    <TableHead className="text-white/70">Sources</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allContributors.map((contrib, idx) => {
                    // Determine type from key
                    const type = contrib.key.startsWith('type_') ? 'type' :
                                contrib.key.startsWith('channel_') ? 'channel' :
                                contrib.key.startsWith('authority_') ? 'authority' :
                                contrib.key.startsWith('center_') ? 'center' :
                                contrib.key.startsWith('gate_') ? 'gate' :
                                contrib.key.startsWith('profile_') ? 'profile' : 'other';
                    
                    return (
                      <TableRow key={idx} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-white/60 capitalize text-sm">{type}</TableCell>
                        <TableCell className="text-white text-sm">{contrib.label}</TableCell>
                        <TableCell className="text-violet-400 text-right font-mono text-sm">
                          {contrib.weight.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-sm">
                          <ConfidenceStars confidence={contrib.confidence} />
                        </TableCell>
                        <TableCell className="text-white/60 text-sm">
                          {contrib.sources.map(sourceId => {
                            const source = loreBundle.sources.find(s => s.id === sourceId);
                            return source?.title || sourceId;
                          }).join(', ')}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* Deployment Matrix */}
        <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-white/90 mb-2 uppercase tracking-wider text-sm">Deployment Matrix</h2>
          <p className="text-white/60 text-sm mb-4">All star systems ranked by alignment percentage</p>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white/70">Rank</TableHead>
                    <TableHead className="text-white/70">System</TableHead>
                    <TableHead className="text-white/70 text-right">Alignment</TableHead>
                    <TableHead className="text-white/70">Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(classification.percentages || {})
                    .sort(([, a], [, b]) => b - a)
                    .map(([systemKey, percentage], index) => {
                      const system = loreBundle.systems.find(s => 
                        s.id === systemKey || s.label === systemKey
                      );
                      const rank = index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Tertiary';
                      const displayName = system?.label || systemKey;
                      
                      return (
                        <TableRow 
                          key={systemKey}
                          className={`border-white/10 ${index < 3 ? 'bg-violet-500/10' : 'hover:bg-white/5'}`}
                        >
                          <TableCell className="text-sm">
                            {index < 3 && (
                              <span className="px-2 py-1 rounded-md bg-violet-500/30 text-violet-300 text-xs uppercase tracking-wider">
                                {rank}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className={`text-sm ${index === 0 ? 'text-white' : 'text-white/70'}`}>
                            {displayName}
                          </TableCell>
                          <TableCell className="text-violet-400 text-right font-mono text-sm">
                            {percentage.toFixed(2)}%
                          </TableCell>
                          <TableCell className="text-white/60 text-sm max-w-md">
                            {system?.description || 'Unknown system'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* Why Not? Section */}
        {whyNotData.length > 0 && (
          <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-white/90 mb-2 uppercase tracking-wider text-sm">Why Not…?</h2>
            <p className="text-white/60 text-sm mb-4">
              Other systems that were close contenders. Here's what would have increased their scores:
            </p>

            <div className="space-y-6">
              {whyNotData.map((nearMiss, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h3 className="text-white mb-4">
                    {nearMiss.system} <span className="text-violet-400 font-mono">({nearMiss.percentage.toFixed(2)}%)</span>
                  </h3>
                  
                  {nearMiss.unmatchedRules.length > 0 ? (
                    <div className="space-y-3">
                      {nearMiss.unmatchedRules.map((rule, ruleIdx) => (
                        <div 
                          key={ruleIdx}
                          className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-start justify-between gap-4"
                        >
                          <div className="text-white/70 text-sm flex-1">{rule.rationale}</div>
                          <div className="flex items-center gap-3 text-sm whitespace-nowrap">
                            <span className="text-violet-400 font-mono">+{rule.weight.toFixed(1)}</span>
                            <ConfidenceStars confidence={rule.confidence} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/50 text-sm italic">
                      No additional factors would significantly increase this system's score.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sources & References */}
        <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-white/90 mb-2 uppercase tracking-wider text-sm">Sources & References</h2>
          <p className="text-white/60 text-sm mb-4">All sources cited in your classification</p>
          
          <TooltipProvider>
            <div className="flex flex-wrap gap-2 mb-4">
              {sourcesGallery.map((source, idx) => (
                <Tooltip key={idx}>
                  <TooltipTrigger asChild>
                    <button className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 transition-all text-sm text-white/80 min-h-[44px] flex items-center gap-2">
                      {source.disputed && <span className="text-amber-400">⚑</span>}
                      {source.title}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-900 border-white/20 text-white max-w-xs">
                    <div className="space-y-1">
                      <div className="font-medium">{source.title}</div>
                      {source.author && (
                        <div className="text-xs text-white/70">
                          {source.author} {source.year && `(${source.year})`}
                        </div>
                      )}
                      {source.disputed && (
                        <div className="text-xs text-amber-400 flex items-center gap-1 mt-2">
                          <AlertCircle className="w-3 h-3" />
                          Disputed or controversial lore
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>

          <div className="text-white/50 text-xs flex items-center gap-2">
            <span className="text-amber-400">⚑</span>
            = Disputed or controversial lore
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-white/50">
              For insight & entertainment; not medical, financial, or legal advice.
            </p>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
          animation-fill-mode: both;
        }

        @media print {
          #starfield,
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:mb-4 {
            margin-bottom: 1rem !important;
          }

          body {
            background: white !important;
          }

          .bg-gradient-to-b,
          .bg-gradient-to-br {
            background: white !important;
          }

          .text-white,
          .text-white\\/90,
          .text-white\\/70,
          .text-white\\/60 {
            color: black !important;
          }

          .border-white\\/10,
          .border-white\\/20 {
            border-color: #e5e7eb !important;
          }

          .bg-white\\/5,
          .bg-white\\/10 {
            background-color: #f9fafb !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
