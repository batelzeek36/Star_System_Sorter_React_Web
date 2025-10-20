import { useMemo, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Card } from '@/components/figma/Card';
// import { Button } from '@/components/figma/Button';
import { SourceBadge } from './SourceBadge';
import { useUIStore } from '@/store/uiStore';
import { loreBundle } from '@/lib/lore.bundle';
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
  const { hideDisputed, minConfidence, setHideDisputed, setMinConfidence } = useUIStore();
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
  
  // Filter and sort contributors
  const filteredContributors = useMemo(() => {
    let filtered = [...contributors];
    
    // Filter by disputed sources
    if (hideDisputed) {
      filtered = filtered.filter(contributor => {
        const hasDisputedSource = contributor.sources.some(sourceId => {
          const source = loreBundle.sources.find(s => s.id === sourceId);
          return source?.disputed === true;
        });
        return !hasDisputedSource;
      });
    }
    
    // Filter by minimum confidence
    filtered = filtered.filter(contributor => contributor.confidence >= minConfidence);
    
    // Sort by weight descending
    filtered.sort((a, b) => b.weight - a.weight);
    
    return filtered;
  }, [contributors, hideDisputed, minConfidence]);
  
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
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center pb-4 border-b border-[var(--s3-border-muted)]">
        {/* Hide disputed toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hideDisputed}
            onChange={(e) => setHideDisputed(e.target.checked)}
            className="w-4 h-4 rounded border-[var(--s3-border-emphasis)] bg-white/5 text-[var(--s3-lavender-500)] focus:ring-2 focus:ring-[var(--s3-lavender-400)] focus:ring-offset-2 focus:ring-offset-[var(--s3-canvas-dark)]"
          />
          <span className="text-sm text-[var(--s3-lavender-200)]">
            Hide disputed sources
          </span>
        </label>
        
        {/* Min confidence slider */}
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <label 
            htmlFor="min-confidence-slider"
            className="text-sm text-[var(--s3-lavender-200)] whitespace-nowrap"
          >
            Min confidence:
          </label>
          <input
            id="min-confidence-slider"
            type="range"
            min="1"
            max="5"
            step="1"
            value={minConfidence}
            onChange={(e) => setMinConfidence(parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5)}
            className="flex-1 h-2 bg-[var(--s3-lavender-900)]/30 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--s3-lavender-400)]
              [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all
              [&::-webkit-slider-thumb]:hover:bg-[var(--s3-lavender-300)]
              [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full 
              [&::-moz-range-thumb]:bg-[var(--s3-lavender-400)] [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:transition-all
              [&::-moz-range-thumb]:hover:bg-[var(--s3-lavender-300)]
              focus:outline-none focus:ring-2 focus:ring-[var(--s3-lavender-400)] focus:ring-offset-2 focus:ring-offset-[var(--s3-canvas-dark)]"
            aria-label="Minimum confidence level filter"
          />
          <span className="text-sm text-[var(--s3-lavender-300)] font-mono w-8 text-right">
            {minConfidence}
          </span>
        </div>
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
