import { useMemo, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Card } from '@/components/figma/Card';
// import { Button } from '@/components/figma/Button';
import { SourceBadge } from './SourceBadge';
// DISABLED: Filter controls have been disabled
// import { useUIStore } from '@/store/uiStore';
// import { loreBundle } from '@/lib/lore.bundle';
import type { EnhancedContributor } from '@/lib/schemas';

interface EvidenceMatrixProps {
  contributors: EnhancedContributor[];
  activeSystemId?: string;
}

/**
 * EvidenceMatrix Component
 * 
 * Displays a filterable table of all contributors across star systems.
 * Features:
 * - Sortable by weight (descending)
 * - Filterable by disputed sources and confidence level
 * - Highlights active star system's contributors
 * - Virtualized for performance when >75 contributors
 */
export function EvidenceMatrix({ contributors, activeSystemId }: EvidenceMatrixProps) {
  // DISABLED: Filter state from UI store (filters are disabled)
  // const { hideDisputed, minConfidence, setHideDisputed, setMinConfidence } = useUIStore();
  const [parentRef, setParentRef] = useState<HTMLDivElement | null>(null);
  
  // Determine attribute type from contributor key
  const getAttributeType = (key: string): string => {
    if (key.startsWith('gate_')) return 'Gate';
    if (key.startsWith('channel_')) return 'Channel';
    if (key.startsWith('center_')) return 'Center';
    if (key.startsWith('profile_')) return 'Profile';
    if (key.startsWith('type_')) return 'Type';
    if (key.startsWith('authority_')) return 'Authority';
    return 'Unknown';
  };
  
  // DISABLED: Filters are disabled to prevent users from removing sources with minimal confidence
  // Show all contributors without filtering
  const filteredContributors = useMemo(() => {
    let filtered = [...contributors];
    
    // Sort by weight descending
    filtered.sort((a, b) => b.weight - a.weight);
    
    return filtered;
  }, [contributors]);
  
  // Determine if we should use virtualization
  const shouldVirtualize = filteredContributors.length > 75;
  
  // Set up virtualizer
  const rowVirtualizer = useVirtualizer({
    count: filteredContributors.length,
    getScrollElement: () => parentRef,
    estimateSize: () => 60,
    enabled: shouldVirtualize,
  });
  
  // Render confidence dots
  const renderConfidenceDots = (confidence: number) => {
    const filled = '●';
    const empty = '○';
    return Array.from({ length: 5 }, (_, i) => 
      i < confidence ? filled : empty
    ).join('');
  };
  
  // Render table row
  const renderRow = (contributor: EnhancedContributor, _index: number) => {
    const isActive = activeSystemId && contributor.key.includes(activeSystemId.toLowerCase());
    const attributeType = getAttributeType(contributor.key);
    
    return (
      <tr
        key={contributor.ruleId}
        className={`
          border-b border-[var(--s3-border-muted)] last:border-b-0
          ${isActive ? 'bg-[var(--s3-lavender-500)]/10' : 'hover:bg-white/5'}
          transition-colors
        `}
      >
        <td className="px-4 py-3 text-xs text-[var(--s3-lavender-300)]">
          {attributeType}
        </td>
        <td className="px-4 py-3 text-sm text-[var(--s3-lavender-200)]">
          {contributor.label}
        </td>
        <td className="px-4 py-3 text-sm text-[var(--s3-lavender-200)] text-right font-mono">
          {contributor.weight.toFixed(2)}
        </td>
        <td className="px-4 py-3 text-sm text-[var(--s3-lavender-300)] font-mono">
          <span aria-label={`Confidence level ${contributor.confidence} out of 5`}>
            {renderConfidenceDots(contributor.confidence)}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1">
            {contributor.sources.map((sourceId) => (
              <SourceBadge key={sourceId} sourceId={sourceId} showTooltip={true} />
            ))}
          </div>
        </td>
      </tr>
    );
  };
  
  return (
    <Card className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--s3-lavender-100)]">
          Evidence Matrix
        </h2>
        <div className="text-sm text-[var(--s3-lavender-300)]/70">
          {filteredContributors.length} of {contributors.length} contributors
        </div>
      </div>
      
      {/* DISABLED: Filters are disabled to prevent users from removing sources with minimal confidence */}
      <div className="flex flex-wrap gap-4 items-center pb-4 border-b border-[var(--s3-border-muted)]">
        <p className="text-sm text-[var(--s3-lavender-200)]">
          Showing all contributors (filters disabled)
        </p>
      </div>
      
      {/* Table */}
      {filteredContributors.length === 0 ? (
        <div className="text-center py-8 text-[var(--s3-lavender-300)]/70">
          No contributors match your filters.
        </div>
      ) : shouldVirtualize ? (
        // Virtualized table for large lists
        <div
          ref={setParentRef}
          className="overflow-auto max-h-[600px]"
          style={{ contain: 'strict' }}
        >
          <table className="w-full">
            <thead className="sticky top-0 bg-[var(--s3-canvas-dark)] z-10 border-b border-[var(--s3-border-emphasis)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--s3-lavender-300)] uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--s3-lavender-300)] uppercase tracking-wider">
                  Attribute
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--s3-lavender-300)] uppercase tracking-wider">
                  Weight
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--s3-lavender-300)] uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--s3-lavender-300)] uppercase tracking-wider">
                  Sources
                </th>
              </tr>
            </thead>
            <tbody
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const contributor = filteredContributors[virtualRow.index];
                return (
                  <tr
                    key={virtualRow.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <td colSpan={5}>
                      <table className="w-full">
                        <tbody>
                          {renderRow(contributor, virtualRow.index)}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        // Regular table for smaller lists
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[var(--s3-border-emphasis)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--s3-lavender-300)] uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--s3-lavender-300)] uppercase tracking-wider">
                  Attribute
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--s3-lavender-300)] uppercase tracking-wider">
                  Weight
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--s3-lavender-300)] uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--s3-lavender-300)] uppercase tracking-wider">
                  Sources
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredContributors.map((contributor, index) => renderRow(contributor, index))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
