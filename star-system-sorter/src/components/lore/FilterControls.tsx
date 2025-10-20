import { useUIStore } from '@/store/uiStore';

/**
 * FilterControls Component
 * 
 * Provides UI controls for filtering contributors by:
 * - Disputed sources (checkbox)
 * - Minimum confidence level (slider 1-5)
 * 
 * Connected to UI store for global filter state.
 */
export function FilterControls() {
  const { hideDisputed, minConfidence, setHideDisputed, setMinConfidence } = useUIStore();

  return (
    <div className="flex flex-wrap gap-4 items-center p-4 bg-[var(--s3-surface-subtle)] rounded-lg border border-[var(--s3-border-muted)]">
      {/* Hide disputed toggle */}
      <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
        <input
          type="checkbox"
          checked={hideDisputed}
          onChange={(e) => setHideDisputed(e.target.checked)}
          className="w-4 h-4 rounded border-[var(--s3-border-emphasis)] bg-white/5 text-[var(--s3-lavender-500)] focus:ring-2 focus:ring-[var(--s3-lavender-400)] focus:ring-offset-2 focus:ring-offset-[var(--s3-canvas-dark)] cursor-pointer"
          aria-label="Hide disputed sources"
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
  );
}
