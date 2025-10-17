import { useState } from 'react';
import type { ReactNode, InputHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'focus' | 'error';
}

export function Field({ 
  label, 
  icon, 
  error, 
  helperText,
  variant = 'default',
  className = '',
  ...props 
}: FieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  const hasError = !!error;
  const currentVariant = hasError ? 'error' : isFocused ? 'focus' : variant;
  
  const variantClasses = {
    default: `
      bg-[var(--s3-lavender-900)]/20 
      border-[var(--s3-border-muted)]
    `,
    focus: `
      bg-[var(--s3-lavender-900)]/30 
      border-[var(--s3-lavender-400)]
      shadow-[var(--s3-focus-ring)]
    `,
    error: `
      bg-[var(--s3-error-muted)] 
      border-[var(--s3-error)]
      shadow-[var(--s3-focus-ring-error)]
    `
  };
  
  return (
    <div className={className}>
      <label className="text-sm text-[var(--s3-lavender-300)] mb-2 block">
        {label}
      </label>
      <div 
        className={`
          px-4 py-3 
          min-h-[44px] 
          border 
          rounded-[var(--s3-radius-xl)]
          flex items-center gap-3
          transition-all duration-200
          ${variantClasses[currentVariant]}
        `}
      >
        {icon && (
          <div className={`flex-shrink-0 ${hasError ? 'text-[var(--s3-error)]' : 'text-[var(--s3-lavender-400)]'}`}>
            {icon}
          </div>
        )}
        <input 
          className={`
            bg-transparent 
            outline-none 
            flex-1 
            text-sm 
            text-white 
            placeholder:text-[var(--s3-text-subtle)]
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {hasError && (
          <AlertCircle className="w-4 h-4 text-[var(--s3-error)] flex-shrink-0" />
        )}
      </div>
      {(helperText || error) && (
        <p className={`
          text-xs 
          mt-1.5 
          ${hasError ? 'text-[var(--s3-error)]' : 'text-[var(--s3-text-subtle)]'}
        `}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}
