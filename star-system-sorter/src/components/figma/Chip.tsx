import type { HTMLAttributes } from 'react';
import { X } from 'lucide-react';

interface ChipProps extends HTMLAttributes<HTMLDivElement> {
  starSystem: string;
  percentage?: number;
  variant?: 'gold' | 'lavender' | 'warning';
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function Chip({ 
  starSystem, 
  percentage, 
  variant = 'lavender',
  selectable = false,
  selected = false,
  onSelect,
  dismissible = false,
  onDismiss,
  className = '',
  ...props
}: ChipProps) {
  const variantClasses = {
    gold: selected 
      ? "bg-gradient-to-r from-[var(--s3-gold-500)] to-[var(--s3-gold-400)] border-[var(--s3-gold-400)] text-white"
      : "bg-gradient-to-r from-[var(--s3-gold-500)]/20 to-[var(--s3-gold-400)]/20 border-[var(--s3-gold-400)]/40 text-[var(--s3-gold-300)]",
    lavender: selected
      ? "bg-gradient-to-r from-[var(--s3-lavender-500)] to-[var(--s3-lavender-400)] border-[var(--s3-lavender-400)] text-white"
      : "bg-[var(--s3-lavender-500)]/20 border-[var(--s3-lavender-400)]/30 text-[var(--s3-lavender-300)]",
    warning: selected
      ? "bg-gradient-to-r from-amber-500 to-amber-400 border-amber-400 text-white"
      : "bg-amber-500/20 border-amber-400/30 text-amber-300"
  };

  const baseClasses = `
    px-3 py-1.5 
    border 
    rounded-[var(--s3-radius-full)]
    text-xs
    inline-flex items-center gap-2
    ${variantClasses[variant]}
    ${selectable ? 'min-h-[44px] cursor-pointer hover:opacity-80 active:scale-95 transition-all focus-visible:shadow-[var(--s3-focus-ring)] outline-none' : ''}
    ${className}
  `;
  
  if (selectable) {
    return (
      <button
        className={baseClasses}
        onClick={onSelect}
        {...(props as any)}
      >
        <span>
          {starSystem} {percentage !== undefined && `${percentage}%`}
        </span>
        {dismissible && onDismiss && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            className="w-4 h-4 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </button>
    );
  }
  
  return (
    <div
      className={baseClasses}
      {...props}
    >
      <span>
        {starSystem} {percentage !== undefined && `${percentage}%`}
      </span>
      {dismissible && onDismiss && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="w-4 h-4 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
