import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/figma/Card';
import { Button } from '@/components/figma/Button';
import { SourceBadge } from './SourceBadge';
import type { EnhancedContributor } from '@/lib/schemas';

interface ContributionCardProps {
  contributor: EnhancedContributor;
  totalWeight: number;
  systemId: string;
}

export function ContributionCard({ 
  contributor, 
  totalWeight,
  systemId 
}: ContributionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle Escape key to close expanded details
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isExpanded]);
  
  // Calculate percentage
  const percentage = totalWeight > 0 ? (contributor.weight / totalWeight) * 100 : 0;
  
  // Render confidence dots (●●○○○)
  const renderConfidenceDots = () => {
    const filled = '●';
    const empty = '○';
    const dots = Array.from({ length: 5 }, (_, i) => 
      i < contributor.confidence ? filled : empty
    ).join('');
    return dots;
  };
  
  return (
    <Card className="space-y-3">
      {/* Header with label and percentage */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-[var(--s3-lavender-100)] truncate">
            {contributor.label}
          </h3>
          <p className="text-xs text-[var(--s3-lavender-300)]/70 mt-0.5">
            {contributor.key}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-lg font-semibold text-[var(--s3-lavender-200)]">
            {percentage.toFixed(1)}%
          </div>
        </div>
      </div>
      
      {/* Percentage bar */}
      <div className="relative h-2 bg-[var(--s3-lavender-900)]/30 rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--s3-lavender-500)] to-[var(--s3-lavender-400)] rounded-full transition-all duration-300"
          style={{ width: `${Math.min(percentage, 100)}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${percentage.toFixed(1)}% contribution`}
        />
      </div>
      
      {/* Rationale */}
      <p className="text-sm text-[var(--s3-lavender-200)]/90 leading-relaxed">
        {contributor.rationale}
      </p>
      
      {/* Confidence level */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--s3-lavender-300)]/70">
          Confidence:
        </span>
        <span 
          className="text-sm text-[var(--s3-lavender-300)] tracking-wider font-mono"
          aria-label={`Confidence level ${contributor.confidence} out of 5`}
        >
          {renderConfidenceDots()}
        </span>
      </div>
      
      {/* Sources */}
      <div className="flex flex-wrap gap-2">
        {contributor.sources.map((sourceId) => (
          <SourceBadge key={sourceId} sourceId={sourceId} showTooltip={true} />
        ))}
      </div>
      
      {/* Collapsible details section */}
      <div className="pt-2 border-t border-[var(--s3-border-muted)]">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between"
          aria-expanded={isExpanded}
          aria-controls={`details-${contributor.ruleId}`}
        >
          <span className="text-xs">
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
        
        {isExpanded && (
          <div 
            id={`details-${contributor.ruleId}`}
            className="mt-3 space-y-2 text-xs text-[var(--s3-lavender-300)]/80"
          >
            <div>
              <span className="font-medium text-[var(--s3-lavender-200)]">Rule ID:</span>{' '}
              <code className="px-1.5 py-0.5 bg-[var(--s3-lavender-900)]/30 rounded text-[var(--s3-lavender-300)] font-mono">
                {contributor.ruleId}
              </code>
            </div>
            <div>
              <span className="font-medium text-[var(--s3-lavender-200)]">Weight:</span>{' '}
              {contributor.weight.toFixed(2)}
            </div>
            <div>
              <span className="font-medium text-[var(--s3-lavender-200)]">System:</span>{' '}
              {systemId}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
