import { AppBar } from '../AppBar';
import { Button } from '../Button';
import { Card } from '../Card';
import { InlineAlert } from '../Toast';
import { Sparkles, AlertTriangle, WifiOff, FileQuestion } from 'lucide-react';

interface EmptyStatesScreenProps {
  onBack: () => void;
}

export function EmptyStatesScreen({ onBack }: EmptyStatesScreenProps) {
  const EmptyState = ({ 
    icon, 
    title, 
    description, 
    actionLabel, 
    onAction,
    variant = 'default'
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    variant?: 'default' | 'error';
  }) => (
    <Card variant={variant === 'error' ? 'warning' : 'default'} className="mb-4">
      <div className="text-center py-8">
        <div className={`
          w-16 h-16 mx-auto mb-4 rounded-full 
          flex items-center justify-center
          ${variant === 'error' 
            ? 'bg-[var(--s3-error-muted)] text-[var(--s3-error)]'
            : 'bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)] text-white'
          }
        `}>
          {icon}
        </div>
        <h3 className={`text-lg mb-2 ${variant === 'error' ? 'text-[var(--s3-gold-300)]' : 'text-[var(--s3-lavender-200)]'}`}>
          {title}
        </h3>
        <p className="text-sm text-[var(--s3-text-muted)] mb-4 px-4">
          {description}
        </p>
        {actionLabel && onAction && (
          <Button 
            variant={variant === 'error' ? 'secondary' : 'primary'}
            size="sm"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );

  return (
    <div className="flex-1 flex flex-col relative">
      {/* Starfield background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite ${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <AppBar title="Empty States & Errors" showBack onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-4 relative">
        <p className="text-xs text-[var(--s3-text-subtle)] mb-4 px-1">
          Examples of empty states and error handling
        </p>

        {/* No Chart Computed Yet */}
        <EmptyState
          icon={<Sparkles className="w-8 h-8" />}
          title="No Chart Yet"
          description="Enter your birth data to compute your star system alignment and discover your cosmic origins."
          actionLabel="Begin Sorting"
          onAction={() => console.log('Navigate to input')}
        />

        {/* Network Error */}
        <EmptyState
          icon={<WifiOff className="w-8 h-8" />}
          title="Connection Lost"
          description="Unable to sync with cloud. Your data is safe and stored locally. Try again when connection is restored."
          actionLabel="Retry"
          onAction={() => console.log('Retry connection')}
          variant="error"
        />

        {/* Invalid Chart Data */}
        <EmptyState
          icon={<AlertTriangle className="w-8 h-8" />}
          title="Invalid Chart Data"
          description="We couldn't process your chart. Please check your birth date, time, and location are correct."
          actionLabel="Edit Details"
          onAction={() => console.log('Edit chart data')}
          variant="error"
        />

        {/* No Community Posts */}
        <EmptyState
          icon={<FileQuestion className="w-8 h-8" />}
          title="No Posts Yet"
          description="Your star system community is just getting started. Be the first to share your journey!"
          actionLabel="Create Post"
          onAction={() => console.log('Create post')}
        />

        {/* Inline Error Alerts */}
        <div className="mb-4">
          <p className="text-xs text-[var(--s3-text-subtle)] mb-3 px-1 tracking-wider uppercase">
            Inline Alerts
          </p>
          <div className="space-y-3">
            <InlineAlert
              type="error"
              message="Failed to generate narrative. LLM service is temporarily unavailable."
            />
            <InlineAlert
              type="warning"
              message="Your subscription expires in 3 days. Renew to keep community access."
            />
            <InlineAlert
              type="info"
              message="New quest available in your star system community!"
            />
            <InlineAlert
              type="success"
              message="Chart successfully computed. Your primary star system is Pleiades."
            />
          </div>
        </div>

        {/* Disclaimer Example */}
        <div className="mb-8">
          <p className="text-xs text-[var(--s3-text-subtle)] mb-3 px-1 tracking-wider uppercase">
            Disclaimer Example
          </p>
          <div className="p-3 bg-[var(--s3-lavender-900)]/10 border border-[var(--s3-border-muted)] rounded-[var(--s3-radius-xl)]">
            <p className="text-xs text-[var(--s3-text-subtle)] leading-relaxed">
              For insight & entertainment. Not medical, financial, or legal advice.
            </p>
          </div>
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}
