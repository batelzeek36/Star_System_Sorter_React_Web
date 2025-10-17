import { useNavigate } from 'react-router-dom';
import { useBirthDataStore } from '@/store/birthDataStore';
import { Button } from '@/components/figma/Button';
import { Card } from '@/components/figma/Card';

export default function WhyScreen() {
  const navigate = useNavigate();
  const classification = useBirthDataStore((state) => state.classification);

  // Redirect to input if no classification
  if (!classification) {
    navigate('/input');
    return null;
  }

  // Determine primary system name
  const primarySystem = classification.classification === 'hybrid' && classification.hybrid
    ? classification.hybrid[0]
    : classification.primary || 'Unknown';

  // Get contributors for the primary system
  const contributors = classification.contributorsPerSystem[primarySystem] || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--s3-canvas-dark)] via-[var(--s3-surface-subtle)] to-[var(--s3-canvas-dark)] flex flex-col">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-6 py-12">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl mb-2 bg-gradient-to-r from-[var(--s3-lavender-200)] to-[var(--s3-lavender-400)] bg-clip-text text-transparent">
            Why {primarySystem}?
          </h1>
          <p className="text-sm text-[var(--s3-text-muted)]">
            Your classification is based on the following Human Design attributes:
          </p>
        </div>

        {/* Contributors List */}
        <div className="flex-1 space-y-3 mb-6">
          {contributors.length > 0 ? (
            contributors.map((contributor, index) => (
              <Card key={index} variant="default">
                <p className="text-sm text-[var(--s3-text-primary)]">
                  {contributor}
                </p>
              </Card>
            ))
          ) : (
            <Card variant="default">
              <p className="text-sm text-[var(--s3-text-muted)]">
                No contributor data available.
              </p>
            </Card>
          )}
        </div>

        {/* Explanation */}
        <div className="mb-6">
          <Card variant="emphasis">
            <p className="text-xs text-[var(--s3-text-muted)] leading-relaxed">
              Each attribute from your Human Design chart contributes to your star system classification. 
              The system with the highest total alignment becomes your primary star system.
            </p>
          </Card>
        </div>

        {/* Back Button */}
        <div className="mb-4">
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={() => navigate('/result')}
          >
            Back to Results
          </Button>
        </div>

        {/* Legal Disclaimer */}
        <div className="mb-4">
          <div className="p-3 bg-[var(--s3-lavender-900)]/10 border border-[var(--s3-border-muted)] rounded-[var(--s3-radius-xl)]">
            <p className="text-xs text-[var(--s3-text-subtle)] leading-relaxed">
              For insight & entertainment. Not medical, financial, or legal advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
