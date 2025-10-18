import { useState } from 'react';
import { loreBundle } from '@/lib/lore.bundle';

interface SourceBadgeProps {
  sourceId: string;
  showTooltip?: boolean;
}

export function SourceBadge({ sourceId, showTooltip = true }: SourceBadgeProps) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  
  // Look up source from loreBundle
  const source = loreBundle.sources.find(s => s.id === sourceId);
  
  // Fallback if source not found
  if (!source) {
    return (
      <div className="px-3 py-1.5 border rounded-[var(--s3-radius-full)] text-xs inline-flex items-center gap-2 bg-[var(--s3-lavender-500)]/20 border-[var(--s3-lavender-400)]/30 text-[var(--s3-lavender-300)]">
        {sourceId}
      </div>
    );
  }
  
  const tooltipId = `tooltip-${sourceId}`;
  const displayText = source.disputed ? `⚑ ${source.title}` : source.title;
  
  return (
    <div className="relative inline-block">
      <button
        type="button"
        tabIndex={0}
        aria-describedby={showTooltip ? tooltipId : undefined}
        onMouseEnter={() => showTooltip && setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
        onFocus={() => showTooltip && setIsTooltipVisible(true)}
        onBlur={() => setIsTooltipVisible(false)}
        className="px-3 py-1.5 border rounded-[var(--s3-radius-full)] text-xs inline-flex items-center gap-2 bg-[var(--s3-lavender-500)]/20 border-[var(--s3-lavender-400)]/30 text-[var(--s3-lavender-300)] min-h-[44px] cursor-pointer hover:opacity-80 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--s3-lavender-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--s3-canvas-dark)]"
      >
        {displayText}
      </button>
      
      {showTooltip && isTooltipVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[var(--s3-canvas-dark)] border border-[var(--s3-lavender-400)]/30 rounded-lg text-xs text-[var(--s3-lavender-200)] whitespace-nowrap pointer-events-none"
        >
          <div className="font-medium">{source.title}</div>
          <div className="text-[var(--s3-lavender-300)]/70">
            {source.author} ({source.year})
          </div>
          {source.disputed && (
            <div className="text-[var(--s3-gold-400)] mt-1">
              ⚑ Disputed or controversial lore
            </div>
          )}
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="border-4 border-transparent border-t-[var(--s3-lavender-400)]/30" />
          </div>
        </div>
      )}
    </div>
  );
}
