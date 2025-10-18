import { useNavigate } from 'react-router-dom';
import { useBirthDataStore } from '@/store/birthDataStore';
import { Card } from '@/components/figma/Card';
import { Star, Scroll, Activity, Circle, User, Zap } from 'lucide-react';

// Starfield component
const Starfield = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(50)].map((_, i) => (
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
);

// Helper to get icon and color for contributor type
const getContributorIcon = (label: string) => {
  if (label.includes('Channel')) {
    return { Icon: Scroll, color: 'from-[var(--s3-gold-400)] to-[var(--s3-gold-600)]' };
  }
  if (label.includes('Gate')) {
    return { Icon: Zap, color: 'from-[var(--s3-gold-400)] to-[var(--s3-gold-600)]' };
  }
  if (label.includes('Center')) {
    return { Icon: Circle, color: 'from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)]' };
  }
  if (label.includes('Type')) {
    return { Icon: User, color: 'from-[var(--s3-gold-400)] to-[var(--s3-gold-600)]' };
  }
  if (label.includes('Profile')) {
    return { Icon: Star, color: 'from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)]' };
  }
  if (label.includes('Authority')) {
    return { Icon: Activity, color: 'from-[var(--s3-gold-400)] to-[var(--s3-gold-600)]' };
  }
  return { Icon: Star, color: 'from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)]' };
};

// Helper to enhance contributor label with "Defined" for centers
const enhanceLabel = (label: string): string => {
  if (label.startsWith('Center:')) {
    return label.replace('Center:', 'Defined Center:');
  }
  return label;
};

export default function WhyScreen() {
  const navigate = useNavigate();
  const classification = useBirthDataStore((state) => state.classification);
  const hdData = useBirthDataStore((state) => state.hdData);

  // Redirect to input if no classification or HD data
  if (!classification || !hdData) {
    navigate('/input');
    return null;
  }

  // Determine primary system name
  const primarySystem = classification.classification === 'hybrid' && classification.hybrid
    ? classification.hybrid[0]
    : classification.primary || 'Unknown';

  // Get contributors with weights for the primary system
  const contributorsWithWeights = classification.contributorsWithWeights?.[primarySystem] || [];
  const primaryPercentage = classification.percentages[primarySystem] || 0;

  // Helper to get description for contributor
  const getDescription = (label: string): string => {
    if (label.includes('Sacral') && label.includes('Authority')) {
      return 'Response-based decision making aligns with Pleiadian themes';
    }
    if (label.includes('Profile: 1/3')) {
      return 'Investigator/Martyr — learning through experience';
    }
    if (label.includes('Defined Center')) {
      return 'Energy center activation contributes to classification';
    }
    if (label.includes('Channel')) {
      return 'Channel activation reflects archetypal patterns';
    }
    if (label.includes('Gate')) {
      return 'Gate activation adds specific energetic qualities';
    }
    return 'Contributes to your star system alignment';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--s3-canvas-dark)] via-[var(--s3-surface-subtle)] to-[var(--s3-canvas-dark)] flex flex-col relative overflow-hidden">
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <Starfield />
      
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--s3-lavender-600)]/20 rounded-full blur-3xl"></div>
      
      <div className="relative flex-1 flex flex-col max-w-md mx-auto w-full px-6 py-12">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/result')}
            className="mb-4 text-[var(--s3-lavender-400)] hover:text-[var(--s3-lavender-300)] transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-2xl mb-2 bg-gradient-to-r from-[var(--s3-lavender-200)] to-[var(--s3-lavender-400)] bg-clip-text text-transparent">
            Why {primarySystem}?
          </h1>
          <p className="text-xs text-[var(--s3-text-subtle)]">
            Deterministic sort contributors
          </p>
        </div>

        {/* Core HD Attributes Section */}
        <div className="mb-6">
          <p className="text-xs text-[var(--s3-text-subtle)] mb-3">Your Human Design</p>
          <div className="space-y-3">
            <Card variant="default">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)] flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-[var(--s3-lavender-200)]">Type: {hdData.type}</p>
                  </div>
                  <p className="text-xs text-[var(--s3-text-subtle)]">
                    Your energy type and strategy
                  </p>
                </div>
              </div>
            </Card>

            <Card variant="default">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)] flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-[var(--s3-lavender-200)]">Profile: {hdData.profile}</p>
                  </div>
                  <p className="text-xs text-[var(--s3-text-subtle)]">
                    Your life theme and role
                  </p>
                </div>
              </div>
            </Card>

            <Card variant="default">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)] flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-[var(--s3-lavender-200)]">Authority: {hdData.authority}</p>
                  </div>
                  <p className="text-xs text-[var(--s3-text-subtle)]">
                    Your decision-making strategy
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Contributing Attributes */}
        {contributorsWithWeights.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-[var(--s3-text-subtle)] mb-3">
              Deterministic sort contributors
            </p>
            <div className="space-y-3">
              {contributorsWithWeights.slice(0, 6).map((contributor, index) => {
                const { Icon, color } = getContributorIcon(contributor.label);
                const enhancedLabel = enhanceLabel(contributor.label);
                const description = getDescription(contributor.label);
                const weightPercentage = ((contributor.weight / primaryPercentage) * 100).toFixed(0);
                
                return (
                  <Card key={index} variant="default">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm text-[var(--s3-lavender-200)]">
                            {enhancedLabel}
                          </p>
                          <p className={`text-xs ${color.includes('gold') ? 'text-[var(--s3-gold-400)]' : 'text-[var(--s3-lavender-400)]'}`}>
                            +{weightPercentage}%
                          </p>
                        </div>
                        <p className="text-xs text-[var(--s3-text-subtle)]">
                          {description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Total Alignment */}
        <div className="pt-4 mb-6">
          <p className="text-xs text-center text-[var(--s3-text-subtle)]">
            Total alignment: {primaryPercentage.toFixed(1)}% {primarySystem}
          </p>
        </div>

        {/* Legal Disclaimer */}
        <div className="mb-4">
          <div className="p-3 bg-[var(--s3-lavender-900)]/10 border border-[var(--s3-border-muted)] rounded-[var(--s3-radius-xl)]">
            <p className="text-xs text-[var(--s3-text-subtle)] leading-relaxed">
              For insight & entertainment. Not medical, financial, or legal advice.
            </p>
          </div>
        </div>

        <div className="h-8"></div>
      </div>
    </div>
  );
}
