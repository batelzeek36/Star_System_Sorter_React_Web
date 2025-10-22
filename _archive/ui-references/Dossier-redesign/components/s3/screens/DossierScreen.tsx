import React, { useState, useRef } from 'react';
import { ChevronLeft, Download, Printer, Sparkles, FileText, AlertCircle } from 'lucide-react';
import { Button } from '../Button';
import { Card } from '../Card';
import { Chip } from '../Chip';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';
import { OrionCrest } from '../StarSystemCrests';

// Mock data types
interface HDData {
  type: string;
  authority: string;
  profile: string;
  definedCenters: string[];
  signatureChannel?: string;
}

interface Contribution {
  type: 'type' | 'channel' | 'authority' | 'center' | 'gate' | 'profile';
  attribute: string;
  weight: number;
  confidence: number; // 1-5
  sources: string[];
}

interface SystemRanking {
  rank?: 'Primary' | 'Secondary' | 'Tertiary';
  system: string;
  alignment: number;
  role: string;
}

interface UnmatchedRule {
  rationale: string;
  weight: number;
  confidence: number;
}

interface NearMissSystem {
  system: string;
  alignment: number;
  unmatchedRules: UnmatchedRule[];
}

interface Source {
  title: string;
  author?: string;
  year?: string;
  disputed?: boolean;
}

interface ClassificationResult {
  hdData: HDData;
  classification: string;
  percentages: { [system: string]: number };
  contributions: Contribution[];
  rankings: SystemRanking[];
  nearMissSystems: NearMissSystem[];
  sources: Source[];
}

// Mock data
const mockResult: ClassificationResult = {
  hdData: {
    type: 'Manifesting Generator',
    authority: 'Sacral',
    profile: '1 / 3',
    definedCenters: ['Root', 'G', 'Sacral', 'Throat', 'Spleen'],
    signatureChannel: '13–33'
  },
  classification: 'Orion',
  percentages: {
    'Orion': 32.81,
    'Pleiades': 24.87,
    'Andromeda': 10.55,
    'Lyra': 10.05,
    'Draco': 9.52,
    'Sirius': 6.35,
    'Arcturus': 5.82,
    'Zeta Reticuli': 0.08
  },
  contributions: [
    { type: 'type', attribute: 'Manifesting Generator', weight: 2.08, confidence: 4, sources: ['Bashar Transmissions', 'Prism of Lyra'] },
    { type: 'channel', attribute: 'Channel: 13–33', weight: 1.60, confidence: 3, sources: ['The Law of One (Ra Material, Book I)'] },
    { type: 'authority', attribute: 'Authority: Sacral', weight: 1.60, confidence: 3, sources: ['Bringers of the Dawn'] },
    { type: 'center', attribute: 'Center: Throat', weight: 1.28, confidence: 2, sources: ['The Law of One (Ra Material, Book I)'] },
    { type: 'gate', attribute: 'Gate: 13', weight: 1.18, confidence: 2, sources: ['The Law of One (Ra Material, Book I)'] },
    { type: 'center', attribute: 'Center: G', weight: 1.18, confidence: 2, sources: ['Bringers of the Dawn'] },
    { type: 'gate', attribute: 'Gate: 48', weight: 1.18, confidence: 2, sources: ['The Law of One (Ra Material, Book I)'] },
    { type: 'channel', attribute: 'Channel: 32–54', weight: 1.08, confidence: 2, sources: ['Prism of Lyra', 'Pan-human esoteric/oral syntheses'] },
    { type: 'gate', attribute: 'Gate: 33', weight: 1.08, confidence: 2, sources: ['The Law of One (Ra Material, Book I)'] },
    { type: 'gate', attribute: 'Gate: 2', weight: 1.00, confidence: 2, sources: ['Bringers of the Dawn'] },
    { type: 'type', attribute: 'Manifesting Generator', weight: 1.00, confidence: 2, sources: ['Bashar Transmissions', 'Prism of Lyra'] },
    { type: 'gate', attribute: 'Gate: 10', weight: 1.00, confidence: 2, sources: ['Prism of Lyra'] },
    { type: 'gate', attribute: 'Gate: 54', weight: 0.98, confidence: 2, sources: ['Prism of Lyra', 'Pan-human esoteric/oral syntheses'] },
    { type: 'gate', attribute: 'Gate: 44', weight: 0.98, confidence: 2, sources: ['Prism of Lyra', 'The Law of One (Ra Material, Book I)'] },
    { type: 'channel', attribute: 'Channel: 32–54', weight: 0.98, confidence: 2, sources: ['Pan-human esoteric/oral syntheses'] },
    { type: 'gate', attribute: 'Gate: 54', weight: 0.98, confidence: 2, sources: ['Prism of Lyra', 'Pan-human esoteric/oral syntheses'] },
    { type: 'gate', attribute: 'Gate: 44', weight: 0.68, confidence: 1, sources: ['Prism of Lyra', 'The Law of One (Ra Material, Book I)'] }
  ],
  rankings: [
    { rank: 'Primary', system: 'Orion', alignment: 32.81, role: 'Strategists, historians; polarity integration, memory, trial by conflict.' },
    { rank: 'Secondary', system: 'Pleiades', alignment: 24.87, role: 'Nurturers, artists, empaths; joy, sensuality, community weaving.' },
    { rank: 'Tertiary', system: 'Andromeda', alignment: 10.55, role: 'Explorers, iconoclasts; freedom, innovation, boundary breaking.' },
    { system: 'Lyra', alignment: 10.05, role: 'Primordial builders; instinct, courage, solar wisdom, sovereignty.' },
    { system: 'Draco', alignment: 9.52, role: 'Power, will, hierarchy; alchemy of desire/ambition (highly disputed/charged lore).' },
    { system: 'Sirius', alignment: 6.35, role: 'Teachers, guardians, priestly orders; voice, ritual, stewardship, waters.' },
    { system: 'Arcturus', alignment: 5.82, role: 'Engineers, healers, pattern architects; mind–heart coherence, clean geometry.' },
    { system: 'Zeta Reticuli', alignment: 0.08, role: 'Analysts, experimenters, abstraction; detached observation, adaptation.' }
  ],
  nearMissSystems: [
    {
      system: 'Pleiades',
      alignment: 24.87,
      unmatchedRules: [
        { rationale: 'Generative life force (Sacral) → creative, communal cultivation; primordial craft lineages.', weight: 2.5, confidence: 2 },
        { rationale: 'Bonding/intimacy regulating closeness.', weight: 1.4, confidence: 2 },
        { rationale: 'Fertility/bonding; sensual bridge-builder.', weight: 1.1, confidence: 2 }
      ]
    },
    {
      system: 'Andromeda',
      alignment: 10.55,
      unmatchedRules: [
        { rationale: 'Freedom–pathfinding through voice & direction.', weight: 1.5, confidence: 2 },
        { rationale: 'Trial-and-error explorers.', weight: 1.4, confidence: 2 },
        { rationale: 'Creative direction amplified by contribution.', weight: 1.3, confidence: 2 }
      ]
    }
  ],
  sources: [
    { title: 'Bashar Transmissions', author: 'Darryl Anka', year: '1980s–present' },
    { title: 'Bringers of the Dawn', author: 'Barbara Marciniak', year: '1992' },
    { title: 'Pan-human esoteric/oral syntheses', year: '1990s' },
    { title: 'Prism of Lyra', author: 'Lyssa Royal & Keith Priest', year: '1989' },
    { title: 'The Law of One (Ra Material, Book I)', author: 'Don Elkins, Carla Rueckert, Jim McCarty', year: '1984' },
    { title: 'Disputed or controversial lore', disputed: true }
  ]
};

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
  const [result] = useState<ClassificationResult>(mockResult);
  const [isExporting, setIsExporting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleExportPNG = async () => {
    setIsExporting(true);
    try {
      // In a real implementation, use html-to-image library
      // For now, just simulate the export
      await new Promise(resolve => setTimeout(resolve, 1000));
      const timestamp = new Date().toISOString().slice(0, 10);
      console.log(`Would export: dossier-${result.classification}-${timestamp}.png`);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateNarrative = () => {
    console.log('Navigate to narrative generation');
  };

  // Get all unique sources, sorted alphabetically
  const allSources = result.sources.sort((a, b) => a.title.localeCompare(b.title));

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
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-white/90 mb-2">Galactic Dossier</h1>
              <p className="text-violet-300 text-xl">{result.classification} Classification</p>
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
                <div className="text-white">{result.hdData.type}</div>
              </div>
              <div>
                <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Authority</div>
                <div className="text-white">{result.hdData.authority}</div>
              </div>
              <div>
                <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Profile</div>
                <div className="text-white font-mono">{result.hdData.profile}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-white/60 text-xs uppercase tracking-wider mb-2">Defined Centers</div>
                <div className="flex flex-wrap gap-2">
                  {result.hdData.definedCenters.map(center => (
                    <Chip key={center} variant="secondary" size="sm">
                      {center}
                    </Chip>
                  ))}
                </div>
              </div>
              {result.hdData.signatureChannel && (
                <div>
                  <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Signature Channel</div>
                  <div className="text-white font-mono">{result.hdData.signatureChannel}</div>
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
              <div className="text-4xl md:text-5xl text-white mb-2">{result.classification}</div>
              <div className="text-violet-300">Primary Classification</div>
            </div>
          </div>
        </section>

        {/* Evidence Matrix */}
        <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-white/90 uppercase tracking-wider text-sm">Evidence Matrix</h2>
            <div className="text-white/60 text-xs">
              Showing all {result.contributions.length} contributors (filters disabled)
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
                  {result.contributions.map((contrib, idx) => (
                    <TableRow key={idx} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white/60 capitalize text-sm">{contrib.type}</TableCell>
                      <TableCell className="text-white text-sm">{contrib.attribute}</TableCell>
                      <TableCell className="text-violet-400 text-right font-mono text-sm">
                        {contrib.weight.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm">
                        <ConfidenceStars confidence={contrib.confidence} />
                      </TableCell>
                      <TableCell className="text-white/60 text-sm">
                        {contrib.sources.join(', ')}
                      </TableCell>
                    </TableRow>
                  ))}
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
                  {result.rankings.map((ranking, idx) => (
                    <TableRow 
                      key={idx} 
                      className={`border-white/10 ${ranking.rank ? 'bg-violet-500/10' : 'hover:bg-white/5'}`}
                    >
                      <TableCell className="text-sm">
                        {ranking.rank && (
                          <span className="px-2 py-1 rounded-md bg-violet-500/30 text-violet-300 text-xs uppercase tracking-wider">
                            {ranking.rank}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className={`text-sm ${ranking.rank ? 'text-white' : 'text-white/70'}`}>
                        {ranking.system}
                      </TableCell>
                      <TableCell className="text-violet-400 text-right font-mono text-sm">
                        {ranking.alignment.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-white/60 text-sm max-w-md">
                        {ranking.role}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* Why Not? Section */}
        <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-white/90 mb-2 uppercase tracking-wider text-sm">Why Not…?</h2>
          <p className="text-white/60 text-sm mb-4">
            Other systems that were close contenders. Here's what would have increased their scores:
          </p>

          <div className="space-y-6">
            {result.nearMissSystems.map((nearMiss, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-white mb-4">
                  {nearMiss.system} <span className="text-violet-400 font-mono">({nearMiss.alignment.toFixed(2)}%)</span>
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

        {/* Sources & References */}
        <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-white/90 mb-2 uppercase tracking-wider text-sm">Sources & References</h2>
          <p className="text-white/60 text-sm mb-4">All sources cited in your classification</p>

          <TooltipProvider>
            <div className="flex flex-wrap gap-2 mb-4">
              {allSources.map((source, idx) => (
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
