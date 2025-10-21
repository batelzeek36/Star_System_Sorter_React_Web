/**
 * FilterControls Component
 * 
 * DISABLED: Filter controls have been disabled to prevent users from removing
 * sources with minimal confidence. All contributors are now shown without filtering.
 */
export function FilterControls() {

  return (
    <div className="flex flex-wrap gap-4 items-center p-4 bg-[var(--s3-surface-subtle)] rounded-lg border border-[var(--s3-border-muted)]">
      {/* DISABLED: Hide disputed toggle and Min confidence slider */}
      {/* These filters are disabled to prevent users from removing sources with minimal confidence */}
      <p className="text-sm text-[var(--s3-lavender-200)]">
        Showing all contributors (filters disabled)
      </p>
    </div>
  );
}
