import { Button } from '../Button';
import { Card } from '../Card';
import { Sparkles, Check, Crown } from 'lucide-react';

interface PaywallScreenProps {
  onClose: () => void;
  onSubscribe: () => void;
}

export function PaywallScreen({ onClose, onSubscribe }: PaywallScreenProps) {
  return (
    <div className="flex-1 flex flex-col px-4 relative">
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

      <div className="relative h-12" />
      
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--s3-gold-400)] to-[var(--s3-gold-600)] flex items-center justify-center shadow-[var(--s3-elevation-3)]">
          <Crown className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl mb-2 bg-gradient-to-r from-[var(--s3-lavender-200)] to-[var(--s3-lavender-400)] bg-clip-text text-transparent">
          Join the Community
        </h2>
        <p className="text-sm text-[var(--s3-text-muted)]">
          Unlock full access to star system features
        </p>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-8">
        <Card>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)] flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-[var(--s3-lavender-200)] mb-1">Full Narrative Access</p>
              <p className="text-xs text-[var(--s3-text-subtle)]">
                Unlimited LLM-generated star system stories
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)] flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-[var(--s3-lavender-200)] mb-1">Community Features</p>
              <p className="text-xs text-[var(--s3-text-subtle)]">
                Connect with others in your star system
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)] flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-[var(--s3-lavender-200)] mb-1">Avatar Generation</p>
              <p className="text-xs text-[var(--s3-text-subtle)]">
                Create custom star system avatars
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--s3-gold-400)] to-[var(--s3-gold-600)] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-[var(--s3-gold-300)] mb-1">Early Access</p>
              <p className="text-xs text-[var(--s3-text-subtle)]">
                Be first to try new star system features
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pricing */}
      <Card variant="emphasis" className="mb-6">
        <div className="text-center">
          <p className="text-xs text-[var(--s3-lavender-200)] mb-2">Monthly Subscription</p>
          <div className="flex items-baseline justify-center gap-1 mb-1">
            <span className="text-3xl bg-gradient-to-r from-[var(--s3-lavender-200)] to-[var(--s3-lavender-400)] bg-clip-text text-transparent">
              $9.99
            </span>
            <span className="text-sm text-[var(--s3-text-muted)]">/month</span>
          </div>
          <p className="text-xs text-[var(--s3-text-subtle)]">Cancel anytime</p>
        </div>
      </Card>

      {/* CTA */}
      <div className="space-y-3 mb-4">
        <Button 
          variant="primary" 
          className="w-full"
          leadingIcon={<Crown className="w-5 h-5" />}
          onClick={onSubscribe}
        >
          Start Subscription
        </Button>
        <Button 
          variant="ghost" 
          className="w-full"
          onClick={onClose}
        >
          Maybe Later
        </Button>
      </div>

      <div className="h-8" />
    </div>
  );
}
