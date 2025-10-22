import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'emphasis' | 'warning';
}

export function Card({ children, variant = 'default', className = '', ...props }: CardProps) {
  const variantClasses = {
    default: `
      bg-gradient-to-br from-[var(--s3-lavender-900)]/20 to-[var(--s3-lavender-800)]/10 
      border-[var(--s3-border-muted)]
    `,
    emphasis: `
      bg-gradient-to-br from-[var(--s3-lavender-600)]/30 to-[var(--s3-lavender-700)]/20
      border-[var(--s3-lavender-400)]/40
      shadow-[var(--s3-elevation-2)]
    `,
    warning: `
      bg-gradient-to-br from-[var(--s3-warning-muted)] to-[var(--s3-gold-600)]/10
      border-[var(--s3-gold-400)]/40
    `
  };
  
  return (
    <div 
      className={`
        p-4 
        border 
        rounded-[var(--s3-radius-xl)]
        backdrop-blur-sm
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
