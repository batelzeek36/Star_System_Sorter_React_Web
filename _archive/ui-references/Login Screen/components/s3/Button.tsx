import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  leadingIcon?: ReactNode;
  loading?: boolean;
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  leadingIcon,
  loading,
  children, 
  className = '', 
  disabled,
  ...props 
}: ButtonProps) {
  const sizeClasses = {
    sm: 'min-h-[44px] px-4 py-2 text-sm',
    md: 'min-h-[44px] px-6 py-3 text-base',
    lg: 'min-h-[48px] px-8 py-4 text-lg'
  };
  
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-[var(--s3-lavender-500)] to-[var(--s3-lavender-400)] 
      text-white shadow-[var(--s3-elevation-2)]
      hover:shadow-[var(--s3-elevation-3)] hover:from-[var(--s3-lavender-600)] hover:to-[var(--s3-lavender-500)]
      active:shadow-[var(--s3-elevation-1)] active:scale-[0.98]
      focus-visible:shadow-[var(--s3-focus-ring)]
      disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-[var(--s3-elevation-2)]
    `,
    secondary: `
      bg-white/5 border border-[var(--s3-border-emphasis)] text-white
      hover:bg-white/10 hover:border-[var(--s3-lavender-400)]
      active:bg-white/15 active:scale-[0.98]
      focus-visible:shadow-[var(--s3-focus-ring)]
      disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/5
    `,
    ghost: `
      text-[var(--s3-lavender-300)] bg-transparent
      hover:bg-white/5
      active:bg-white/10 active:scale-[0.98]
      focus-visible:shadow-[var(--s3-focus-ring)]
      disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent
    `,
    destructive: `
      bg-gradient-to-r from-[var(--s3-error)] to-red-600
      text-white shadow-[var(--s3-elevation-2)]
      hover:shadow-[var(--s3-elevation-3)] hover:from-red-600 hover:to-red-700
      active:shadow-[var(--s3-elevation-1)] active:scale-[0.98]
      focus-visible:shadow-[var(--s3-focus-ring-error)]
      disabled:opacity-40 disabled:cursor-not-allowed
    `
  };
  
  return (
    <button 
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-[var(--s3-radius-full)]
        flex items-center justify-center gap-2
        transition-all duration-200
        outline-none
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : leadingIcon ? (
        <span className="flex-shrink-0">{leadingIcon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
}
