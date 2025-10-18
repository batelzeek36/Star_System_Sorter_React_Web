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
  id,
  ...props 
}: FieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  // Generate a unique ID if not provided
  const inputId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
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
      ring-2 ring-[var(--s3-lavender-400)]/30
    `,
    error: `
      bg-[var(--s3-error-muted)] 
      border-[var(--s3-error)]
      ring-2 ring-[var(--s3-error)]/30
    `
  };
  
  return (
    <div className={className}>
      <label htmlFor={inputId} className="text-sm text-[var(--s3-lavender-300)] mb-2 block">
        {label}
      </label>
      <div 
        className={`
          px-4 py-2 
          h-[44px] 
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
          id={inputId}
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
