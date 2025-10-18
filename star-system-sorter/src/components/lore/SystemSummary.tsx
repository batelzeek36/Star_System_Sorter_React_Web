import { Card } from '@/components/figma/Card';
import { Chip } from '@/components/figma/Chip';
import { loreBundle } from '@/lib/lore.bundle';
import type { ClassificationResult } from '@/lib/schemas';

interface SystemSummaryProps {
  classification: ClassificationResult;
}

export function SystemSummary({ classification }: SystemSummaryProps) {
  // Get top 3 systems by percentage
  const sortedSystems = Object.entries(classification.percentages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // Get system labels from lore bundle
  const getSystemLabel = (systemId: string): string => {
    const system = loreBundle.systems.find(s => s.id === systemId);
    return system?.label || systemId;
  };

  // Format hybrid indicator
  const getHybridIndicator = (): string | null => {
    if (classification.classification !== 'hybrid' || !classification.hybrid) {
      return null;
    }

    const [system1, system2] = classification.hybrid;
    const pct1 = classification.percentages[system1] || 0;
    const pct2 = classification.percentages[system2] || 0;
    const delta = Math.abs(pct1 - pct2);

    const label1 = getSystemLabel(system1);
    const label2 = getSystemLabel(system2);

    return `Hybrid: ${label1} + ${label2} (Δ ${delta.toFixed(1)}%)`;
  };

  const hybridIndicator = getHybridIndicator();
  const loreVersion = classification.meta.lore_version || loreBundle.lore_version;

  return (
    <Card variant="emphasis" className="space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--s3-lavender-100)]">
          Star System Classification
        </h2>
        <span className="text-xs text-[var(--s3-lavender-300)]/70">
          Lore v{loreVersion}
        </span>
      </div>

      {/* Hybrid indicator (if applicable) */}
      {hybridIndicator && (
        <div className="px-4 py-2 bg-[var(--s3-lavender-500)]/20 border border-[var(--s3-lavender-400)]/30 rounded-lg">
          <p className="text-sm text-[var(--s3-lavender-200)] font-medium">
            {hybridIndicator}
          </p>
        </div>
      )}

      {/* Top 3 systems with percentages */}
      <div className="flex flex-wrap gap-2">
        {sortedSystems.map(([systemId, percentage], index) => {
          const label = getSystemLabel(systemId);
          const variant = index === 0 ? 'gold' : 'lavender';
          
          return (
            <Chip
              key={systemId}
              starSystem={label}
              percentage={Math.round(percentage)}
              variant={variant}
            />
          );
        })}
      </div>
    </Card>
  );
}
