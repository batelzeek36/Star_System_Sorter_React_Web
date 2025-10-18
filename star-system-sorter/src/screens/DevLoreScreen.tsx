import { SourceBadge } from '@/components/lore';
import { loreBundle } from '@/lib/lore.bundle';

export default function DevLoreScreen() {
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
