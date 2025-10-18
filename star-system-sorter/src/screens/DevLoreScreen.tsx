import { SourceBadge, ContributionCard, SystemSummary, EvidenceMatrix } from '@/components/lore';
import { loreBundle } from '@/lib/lore.bundle';
import type { ClassificationResult } from '@/lib/schemas';

export default function DevLoreScreen() {
  // Mock classification data for testing
  const mockPrimaryClassification: ClassificationResult = {
    classification: 'primary',
    primary: 'PLEIADES',
    allies: [
      { system: 'SIRIUS', percentage: 25 },
      { system: 'LYRA', percentage: 15 },
    ],
    percentages: {
      PLEIADES: 45,
      SIRIUS: 25,
      LYRA: 15,
      ANDROMEDA: 10,
      ORION: 5,
    },
    contributorsPerSystem: {},
    contributorsWithWeights: {},
    meta: {
      canonVersion: '1.0.0',
      canonChecksum: 'abc123',
      lore_version: '2025.10.18',
      rules_hash: 'test123',
      input_hash: 'input123',
    },
  };

  const mockHybridClassification: ClassificationResult = {
    classification: 'hybrid',
    hybrid: ['PLEIADES', 'SIRIUS'],
    allies: [{ system: 'LYRA', percentage: 15 }],
    percentages: {
      PLEIADES: 38,
      SIRIUS: 35,
      LYRA: 15,
      ANDROMEDA: 10,
      ORION: 2,
    },
    contributorsPerSystem: {},
    contributorsWithWeights: {},
    meta: {
      canonVersion: '1.0.0',
      canonChecksum: 'abc123',
      lore_version: '2025.10.18',
      rules_hash: 'test123',
      input_hash: 'input123',
    },
  };

  return (
    <div className="min-h-screen bg-[var(--s3-canvas-dark)] text-[var(--s3-lavender-100)] p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <header>
          <h1 className="text-3xl font-bold text-[var(--s3-lavender-200)] mb-2">
            Lore Components Dev Harness
          </h1>
          <p className="text-[var(--s3-lavender-300)]/70">
            Visual testing for lore components with live data from loreBundle
          </p>
        </header>

        {/* SystemSummary Tests */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--s3-lavender-200)] border-b border-[var(--s3-lavender-400)]/30 pb-2">
            SystemSummary Component
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-[var(--s3-lavender-300)] mb-3">
                Primary Classification (Clear Winner)
              </h3>
              <SystemSummary classification={mockPrimaryClassification} />
              <p className="text-xs text-[var(--s3-lavender-300)]/50 mt-2">
                Expected: Top 3 systems (Pleiades 45%, Sirius 25%, Lyra 15%), no hybrid indicator
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-[var(--s3-lavender-300)] mb-3">
                Hybrid Classification (Close Race)
              </h3>
              <SystemSummary classification={mockHybridClassification} />
              <p className="text-xs text-[var(--s3-lavender-300)]/50 mt-2">
                Expected: Hybrid indicator showing "Hybrid: Pleiades + Sirius (Δ 3.0%)", top 3 systems
              </p>
            </div>
          </div>
        </section>

        {/* SourceBadge Tests */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--s3-lavender-200)] border-b border-[var(--s3-lavender-400)]/30 pb-2">
            SourceBadge Component
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-[var(--s3-lavender-300)] mb-3">
                Non-Disputed Source (should NOT have ⚑ flag)
              </h3>
              <div className="flex flex-wrap gap-3">
                <SourceBadge sourceId="s-ra-1984" />
              </div>
              <p className="text-xs text-[var(--s3-lavender-300)]/50 mt-2">
                Expected: "The Law of One (Ra Material), Book I" without ⚑
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-[var(--s3-lavender-300)] mb-3">
                Disputed Sources (should have ⚑ flag)
              </h3>
              <div className="flex flex-wrap gap-3">
                <SourceBadge sourceId="s-marciniak-1992" />
                <SourceBadge sourceId="s-anka-1990" />
                <SourceBadge sourceId="s-collier-1994" />
                <SourceBadge sourceId="s-royal-1992" />
              </div>
              <p className="text-xs text-[var(--s3-lavender-300)]/50 mt-2">
                Expected: All should have ⚑ prefix
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-[var(--s3-lavender-300)] mb-3">
                All Sources from loreBundle
              </h3>
              <div className="flex flex-wrap gap-3">
                {loreBundle.sources.map((source) => (
                  <SourceBadge key={source.id} sourceId={source.id} />
                ))}
              </div>
              <p className="text-xs text-[var(--s3-lavender-300)]/50 mt-2">
                Total sources: {loreBundle.sources.length}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-[var(--s3-lavender-300)] mb-3">
                Tooltip Disabled (showTooltip=false)
              </h3>
              <div className="flex flex-wrap gap-3">
                <SourceBadge sourceId="s-ra-1984" showTooltip={false} />
                <SourceBadge sourceId="s-marciniak-1992" showTooltip={false} />
              </div>
              <p className="text-xs text-[var(--s3-lavender-300)]/50 mt-2">
                Expected: No tooltip on hover or focus
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-[var(--s3-lavender-300)] mb-3">
                Unknown Source (fallback)
              </h3>
              <div className="flex flex-wrap gap-3">
                <SourceBadge sourceId="unknown-source-id" />
              </div>
              <p className="text-xs text-[var(--s3-lavender-300)]/50 mt-2">
                Expected: Shows "unknown-source-id" as plain text
              </p>
            </div>
          </div>
        </section>

        {/* Keyboard Accessibility Test */}
        <section className="space-y-4 bg-[var(--s3-lavender-500)]/10 p-6 rounded-lg border border-[var(--s3-lavender-400)]/20">
          <h2 className="text-xl font-semibold text-[var(--s3-lavender-200)]">
            ⌨️ Keyboard Accessibility Test
          </h2>
          <div className="space-y-3">
            <p className="text-sm text-[var(--s3-lavender-300)]">
              Press <kbd className="px-2 py-1 bg-[var(--s3-lavender-500)]/20 border border-[var(--s3-lavender-400)]/30 rounded text-xs">Tab</kbd> to focus badges below:
            </p>
            <div className="flex flex-wrap gap-3">
              <SourceBadge sourceId="s-ra-1984" />
              <SourceBadge sourceId="s-marciniak-1992" />
              <SourceBadge sourceId="s-anka-1990" />
            </div>
            <ul className="text-xs text-[var(--s3-lavender-300)]/70 space-y-1 list-disc list-inside">
              <li>Each badge should be focusable with Tab key</li>
              <li>Focus ring should be visible (2px lavender ring)</li>
              <li>Tooltip should appear on focus</li>
              <li>Tooltip should disappear on blur</li>
            </ul>
          </div>
        </section>

        {/* Tooltip Content Test */}
        <section className="space-y-4 bg-[var(--s3-gold-500)]/10 p-6 rounded-lg border border-[var(--s3-gold-400)]/20">
          <h2 className="text-xl font-semibold text-[var(--s3-lavender-200)]">
            💬 Tooltip Content Test
          </h2>
          <div className="space-y-3">
            <p className="text-sm text-[var(--s3-lavender-300)]">
              Hover or focus on badges to see tooltips:
            </p>
            <div className="flex flex-wrap gap-3">
              <SourceBadge sourceId="s-ra-1984" />
              <SourceBadge sourceId="s-marciniak-1992" />
            </div>
            <div className="text-xs text-[var(--s3-lavender-300)]/70 space-y-2">
              <p><strong>Non-disputed (s-ra-1984):</strong></p>
              <ul className="list-disc list-inside ml-4">
                <li>Should show: "The Law of One (Ra Material), Book I"</li>
                <li>Should show: "L/L Research (1984)"</li>
                <li>Should NOT show disputed warning</li>
              </ul>
              <p><strong>Disputed (s-marciniak-1992):</strong></p>
              <ul className="list-disc list-inside ml-4">
                <li>Should show: "Bringers of the Dawn"</li>
                <li>Should show: "Barbara Marciniak (1992)"</li>
                <li>Should show: "⚑ Disputed or controversial lore" in gold</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ContributionCard Tests */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--s3-lavender-200)] border-b border-[var(--s3-lavender-400)]/30 pb-2">
            ContributionCard Component
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-[var(--s3-lavender-300)] mb-3">
                High Weight Contributor (25% of total)
              </h3>
              <ContributionCard
                contributor={{
                  ruleId: 'type_generator_pleiades',
                  key: 'type:Generator',
                  weight: 2.5,
                  label: 'Generator Type',
                  rationale: 'Generative life force (Sacral) → creative, communal cultivation; primordial craft lineages.',
                  sources: ['s-marciniak-1992', 's-royal-1992'],
                  confidence: 2,
                }}
                totalWeight={10}
                systemId="PLEIADES"
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-[var(--s3-lavender-300)] mb-3">
                Medium Weight Contributor (14% of total)
              </h3>
              <ContributionCard
                contributor={{
                  ruleId: 'ch_7_31_sirius_steward',
                  key: 'channel:7-31',
                  weight: 1.4,
                  label: 'Channel 7-31 (Alpha)',
                  rationale: 'From will of the self to voice of the people; council leadership.',
                  sources: ['s-ra-1984'],
                  confidence: 3,
                }}
                totalWeight={10}
                systemId="SIRIUS"
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-[var(--s3-lavender-300)] mb-3">
                Low Weight Contributor (8% of total)
              </h3>
              <ContributionCard
                contributor={{
                  ruleId: 'gate_55_spirit_pleiades_sirius',
                  key: 'gate:55',
                  weight: 0.8,
                  label: 'Gate 55 (Spirit)',
                  rationale: 'Romance with life, mood alchemy, devotional ecstasy.',
                  sources: ['s-handclow-1995'],
                  confidence: 2,
                }}
                totalWeight={10}
                systemId="PLEIADES"
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-[var(--s3-lavender-300)] mb-3">
                Low Confidence Contributor (Confidence 1)
              </h3>
              <ContributionCard
                contributor={{
                  ruleId: 'auth_ego_draco',
                  key: 'authority:Ego',
                  weight: 1.8,
                  label: 'Ego Authority',
                  rationale: 'Will/contract energy; hierarchy & oath (useful or coercive).',
                  sources: ['s-royal-1992'],
                  confidence: 1,
                }}
                totalWeight={10}
                systemId="DRACO"
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-[var(--s3-lavender-300)] mb-3">
                High Confidence Contributor (Confidence 5)
              </h3>
              <ContributionCard
                contributor={{
                  ruleId: 'test_high_confidence',
                  key: 'test:high',
                  weight: 1.5,
                  label: 'High Confidence Test',
                  rationale: 'This is a test contributor with maximum confidence level.',
                  sources: ['s-ra-1984'],
                  confidence: 5,
                }}
                totalWeight={10}
                systemId="ARCTURUS"
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-[var(--s3-lavender-300)] mb-3">
                Multiple Sources (4 sources)
              </h3>
              <ContributionCard
                contributor={{
                  ruleId: 'test_multi_source',
                  key: 'test:multi',
                  weight: 1.2,
                  label: 'Multi-Source Contributor',
                  rationale: 'This contributor has multiple source citations to test badge wrapping.',
                  sources: ['s-ra-1984', 's-marciniak-1992', 's-royal-1992', 's-handclow-1995'],
                  confidence: 3,
                }}
                totalWeight={10}
                systemId="PLEIADES"
              />
            </div>
          </div>
        </section>

        {/* EvidenceMatrix Tests */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--s3-lavender-200)] border-b border-[var(--s3-lavender-400)]/30 pb-2">
            EvidenceMatrix Component
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-[var(--s3-lavender-300)] mb-3">
                Small List (10 contributors)
              </h3>
              <EvidenceMatrix
                contributors={[
                  {
                    ruleId: 'type_generator_pleiades',
                    key: 'type_generator',
                    weight: 2.5,
                    label: 'Generator Type',
                    rationale: 'Generative life force → creative cultivation',
                    sources: ['s-marciniak-1992', 's-royal-1992'],
                    confidence: 2,
                  },
                  {
                    ruleId: 'ch_7_31_sirius',
                    key: 'channel_7_31',
                    weight: 1.4,
                    label: 'Channel 7-31',
                    rationale: 'Council leadership voice',
                    sources: ['s-ra-1984'],
                    confidence: 3,
                  },
                  {
                    ruleId: 'gate_55_spirit',
                    key: 'gate_55',
                    weight: 0.8,
                    label: 'Gate 55',
                    rationale: 'Spirit and mood alchemy',
                    sources: ['s-handclow-1995'],
                    confidence: 2,
                  },
                  {
                    ruleId: 'center_sacral',
                    key: 'center_sacral',
                    weight: 1.2,
                    label: 'Sacral Center',
                    rationale: 'Life force energy',
                    sources: ['s-ra-1984'],
                    confidence: 4,
                  },
                  {
                    ruleId: 'profile_3_5',
                    key: 'profile_3_5',
                    weight: 0.9,
                    label: 'Profile 3/5',
                    rationale: 'Martyr-Heretic',
                    sources: ['s-marciniak-1992'],
                    confidence: 1,
                  },
                  {
                    ruleId: 'authority_sacral',
                    key: 'authority_sacral',
                    weight: 1.8,
                    label: 'Sacral Authority',
                    rationale: 'Gut response',
                    sources: ['s-ra-1984'],
                    confidence: 5,
                  },
                  {
                    ruleId: 'gate_13',
                    key: 'gate_13',
                    weight: 0.6,
                    label: 'Gate 13',
                    rationale: 'Listener',
                    sources: ['s-royal-1992'],
                    confidence: 2,
                  },
                  {
                    ruleId: 'gate_33',
                    key: 'gate_33',
                    weight: 0.7,
                    label: 'Gate 33',
                    rationale: 'Privacy',
                    sources: ['s-marciniak-1992'],
                    confidence: 3,
                  },
                  {
                    ruleId: 'channel_13_33',
                    key: 'channel_13_33',
                    weight: 1.1,
                    label: 'Channel 13-33',
                    rationale: 'Prodigal',
                    sources: ['s-ra-1984'],
                    confidence: 4,
                  },
                  {
                    ruleId: 'center_throat',
                    key: 'center_throat',
                    weight: 1.0,
                    label: 'Throat Center',
                    rationale: 'Communication',
                    sources: ['s-handclow-1995'],
                    confidence: 3,
                  },
                ]}
                activeSystemId="PLEIADES"
              />
              <p className="text-xs text-[var(--s3-lavender-300)]/50 mt-2">
                Expected: Regular table (not virtualized), sorted by weight descending, filters work
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-[var(--s3-lavender-300)] mb-3">
                Large List (80 contributors - virtualized)
              </h3>
              <EvidenceMatrix
                contributors={Array.from({ length: 80 }, (_, i) => ({
                  ruleId: `rule_${i}`,
                  key: `gate_${i}`,
                  weight: Math.random() * 3,
                  label: `Gate ${i}`,
                  rationale: `Test rationale for gate ${i}`,
                  sources: i % 3 === 0 ? ['s-marciniak-1992'] : ['s-ra-1984'],
                  confidence: ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5,
                }))}
              />
              <p className="text-xs text-[var(--s3-lavender-300)]/50 mt-2">
                Expected: Virtualized table (&gt;75 contributors), smooth scrolling, filters work
              </p>
            </div>
          </div>
        </section>

        {/* Lore Bundle Info */}
        <section className="space-y-4 bg-[var(--s3-lavender-500)]/5 p-6 rounded-lg border border-[var(--s3-lavender-400)]/10">
          <h2 className="text-xl font-semibold text-[var(--s3-lavender-200)]">
            📚 Lore Bundle Info
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[var(--s3-lavender-300)]/70">Version:</span>
              <span className="ml-2 text-[var(--s3-lavender-200)]">{loreBundle.lore_version}</span>
            </div>
            <div>
              <span className="text-[var(--s3-lavender-300)]/70">Sources:</span>
              <span className="ml-2 text-[var(--s3-lavender-200)]">{loreBundle.sources.length}</span>
            </div>
            <div>
              <span className="text-[var(--s3-lavender-300)]/70">Systems:</span>
              <span className="ml-2 text-[var(--s3-lavender-200)]">{loreBundle.systems.length}</span>
            </div>
            <div>
              <span className="text-[var(--s3-lavender-300)]/70">Rules:</span>
              <span className="ml-2 text-[var(--s3-lavender-200)]">{loreBundle.rules.length}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
