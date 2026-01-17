/**
 * InsightsScreen - Display Generated Relationship Insights
 *
 * Shows AI-generated insights from comparing two Human Design charts.
 * Each insight is displayed as a card with type badge and highlighted references.
 * Supports regenerating insights and handles loading/error states.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Sparkles, Heart, Zap, AlertTriangle, Lightbulb, Star } from 'lucide-react';
import { useComparisonStore } from '@/store/comparisonStore';
import { Button } from '@/components/figma/Button';
import { Card } from '@/components/figma/Card';
import { LoadingOverlay } from '@/components/figma/LoadingOverlay';
import { Toast } from '@/components/figma/Toast';
import { StarSystemCrests, type StarSystemName } from '@/components/figma/StarSystemCrests';
import { getRelevantLoreForCharts } from '@/lib/lore-retriever';
import type { Insight, InsightType } from '@/lib/prompts/insight-templates';
import { animationStyles } from '@/styles/animations';

// ============================================================================
// Constants
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ============================================================================
// Insight Type Configuration
// ============================================================================

interface InsightTypeConfig {
  label: string;
  icon: typeof Sparkles;
  bgClass: string;
  textClass: string;
  borderClass: string;
}

const INSIGHT_TYPE_CONFIG: Record<InsightType, InsightTypeConfig> = {
  shared_resonance: {
    label: 'Shared Resonance',
    icon: Heart,
    bgClass: 'bg-pink-500/20',
    textClass: 'text-pink-300',
    borderClass: 'border-pink-500/30',
  },
  type_dynamic: {
    label: 'Type Dynamic',
    icon: Zap,
    bgClass: 'bg-amber-500/20',
    textClass: 'text-amber-300',
    borderClass: 'border-amber-500/30',
  },
  star_connection: {
    label: 'Star Connection',
    icon: Star,
    bgClass: 'bg-[var(--s3-lavender-500)]/20',
    textClass: 'text-[var(--s3-lavender-300)]',
    borderClass: 'border-[var(--s3-lavender-500)]/30',
  },
  tension: {
    label: 'Tension',
    icon: AlertTriangle,
    bgClass: 'bg-orange-500/20',
    textClass: 'text-orange-300',
    borderClass: 'border-orange-500/30',
  },
  advice: {
    label: 'Advice',
    icon: Lightbulb,
    bgClass: 'bg-emerald-500/20',
    textClass: 'text-emerald-300',
    borderClass: 'border-emerald-500/30',
  },
};

// ============================================================================
// Starfield Component (memoized)
// ============================================================================

const Starfield = () => {
  const stars = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 2,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-30"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            animation: `twinkle ${star.duration}s infinite ${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// Insight Type Badge Component
// ============================================================================

interface InsightBadgeProps {
  type: InsightType;
}

function InsightBadge({ type }: InsightBadgeProps) {
  const config = INSIGHT_TYPE_CONFIG[type] || INSIGHT_TYPE_CONFIG.advice;
  const IconComponent = config.icon;

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        ${config.bgClass} ${config.textClass} ${config.borderClass} border
      `}
    >
      <IconComponent className="w-3 h-3" />
      {config.label}
    </div>
  );
}

// ============================================================================
// Reference Chip Component
// ============================================================================

interface ReferenceChipProps {
  type: 'gate' | 'channel' | 'system';
  value: string;
}

function ReferenceChip({ type, value }: ReferenceChipProps) {
  const bgColors: Record<string, string> = {
    gate: 'bg-[var(--s3-lavender-600)]/30 text-[var(--s3-lavender-200)] border-[var(--s3-lavender-500)]/40',
    channel: 'bg-blue-500/20 text-blue-200 border-blue-500/40',
    system: 'bg-[var(--s3-gold-600)]/20 text-[var(--s3-gold-300)] border-[var(--s3-gold-500)]/40',
  };

  const labels: Record<string, string> = {
    gate: `Gate ${value}`,
    channel: `${value}`,
    system: value,
  };

  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-md text-xs border
        ${bgColors[type] || bgColors.gate}
      `}
    >
      {labels[type]}
    </span>
  );
}

// ============================================================================
// Insight Card Component
// ============================================================================

interface InsightCardProps {
  insight: Insight;
  index: number;
}

function InsightCard({ insight, index }: InsightCardProps) {
  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: `${0.1 + index * 0.1}s`, animationFillMode: 'both' }}
    >
      <Card variant="default">
        <div className="space-y-3">
          {/* Type Badge */}
          <div className="flex items-start justify-between gap-2">
            <InsightBadge type={insight.type} />
          </div>

          {/* Title */}
          <h3 className="text-base font-medium text-[var(--s3-lavender-200)]">
            {insight.title}
          </h3>

          {/* Content */}
          <p className="text-sm text-[var(--s3-text-subtle)] leading-relaxed">
            {insight.content}
          </p>

          {/* References */}
          {insight.references.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--s3-border-muted)]">
              {insight.references.map((ref, refIndex) => (
                <ReferenceChip key={`${ref.type}-${ref.value}-${refIndex}`} type={ref.type} value={ref.value} />
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ============================================================================
// Charts Summary Component
// ============================================================================

function ChartsSummary() {
  const chartA = useComparisonStore((state) => state.chartA);
  const chartB = useComparisonStore((state) => state.chartB);
  const comparison = useComparisonStore((state) => state.comparison);

  if (!chartA || !chartB) return null;

  const getStarSystem = (classification: typeof chartA.classification) => {
    if (!classification) return 'Unknown';
    return classification.classification === 'hybrid' && classification.hybrid
      ? classification.hybrid[0]
      : classification.primary || 'Unknown';
  };

  const systemA = getStarSystem(chartA.classification);
  const systemB = getStarSystem(chartB.classification);

  const CrestA = StarSystemCrests[systemA as StarSystemName] || StarSystemCrests['Pleiades'];
  const CrestB = StarSystemCrests[systemB as StarSystemName] || StarSystemCrests['Pleiades'];

  return (
    <div className="p-4 bg-[var(--s3-lavender-900)]/20 border border-[var(--s3-border-muted)] rounded-[var(--s3-radius-xl)] animate-fade-in-down">
      <div className="flex items-center gap-4">
        {/* Chart A */}
        <div className="flex-1 flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[var(--s3-lavender-500)]/20 flex items-center justify-center">
            <CrestA size={20} className="text-[var(--s3-lavender-400)]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[var(--s3-text-subtle)]">{chartA.name || 'You'}</p>
            <p className="text-sm font-medium text-white truncate">{chartA.hdData.type}</p>
            <p className="text-xs text-[var(--s3-lavender-300)]">{systemA}</p>
          </div>
        </div>

        {/* Connection Indicator */}
        <div className="flex flex-col items-center">
          <Sparkles className="w-5 h-5 text-[var(--s3-lavender-400)] mb-1" />
          {comparison && (
            <p className="text-xs text-[var(--s3-text-subtle)]">
              {comparison.compatibilityScores.overall}%
            </p>
          )}
        </div>

        {/* Chart B */}
        <div className="flex-1 flex items-center justify-end gap-2">
          <div className="text-right min-w-0">
            <p className="text-xs text-[var(--s3-text-subtle)]">{chartB.name || 'Partner'}</p>
            <p className="text-sm font-medium text-white truncate">{chartB.hdData.type}</p>
            <p className="text-xs text-[var(--s3-lavender-300)]">{systemB}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[var(--s3-lavender-500)]/20 flex items-center justify-center">
            <CrestB size={20} className="text-[var(--s3-lavender-400)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function InsightsScreen() {
  const navigate = useNavigate();

  // Comparison store state
  const chartA = useComparisonStore((state) => state.chartA);
  const chartB = useComparisonStore((state) => state.chartB);
  const comparison = useComparisonStore((state) => state.comparison);
  const insights = useComparisonStore((state) => state.insights);
  const isLoading = useComparisonStore((state) => state.isLoading);
  const storeError = useComparisonStore((state) => state.error);
  const setInsights = useComparisonStore((state) => state.setInsights);
  const setLoading = useComparisonStore((state) => state.setLoading);
  const setError = useComparisonStore((state) => state.setError);

  const [toastError, setToastError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // ============================================================================
  // Generate Insights
  // ============================================================================

  const generateInsights = useCallback(async () => {
    if (!chartA || !chartB || !comparison) return;

    try {
      setIsGenerating(true);
      setLoading(true);
      setToastError(null);
      setError(null);

      // Get relevant lore for the charts
      const lore = getRelevantLoreForCharts(chartA.hdData, chartB.hdData);

      // Call the insights API
      const response = await fetch(`${API_BASE_URL}/api/insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chartA: chartA.hdData,
          chartB: chartB.hdData,
          comparison,
          lore,
          nameA: chartA.name,
          nameB: chartB.name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to generate insights: ${response.status}`);
      }

      const data = await response.json();

      if (data.insights && Array.isArray(data.insights)) {
        setInsights(data.insights);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate insights';
      setToastError(errorMessage);
      setError(errorMessage);

      // Use fallback insights if API fails
      const fallbackInsights = generateFallbackInsights();
      setInsights(fallbackInsights);
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  }, [chartA, chartB, comparison, setInsights, setLoading, setError]);

  // ============================================================================
  // Fallback Insights (when API is unavailable)
  // ============================================================================

  const generateFallbackInsights = useCallback((): Insight[] => {
    if (!chartA || !chartB || !comparison) return [];

    const fallbackInsights: Insight[] = [];

    // Type Dynamic insight
    fallbackInsights.push({
      type: 'type_dynamic',
      title: `${comparison.typeDynamic.typeA} meets ${comparison.typeDynamic.typeB}`,
      content: comparison.typeDynamic.dynamic,
      references: [
        { type: 'system', value: comparison.typeDynamic.typeA },
        { type: 'system', value: comparison.typeDynamic.typeB },
      ],
    });

    // Shared gates insight
    if (comparison.sharedGates.length > 0) {
      const sharedGateNumbers = comparison.sharedGates.map(g => g.gate).slice(0, 3);
      fallbackInsights.push({
        type: 'shared_resonance',
        title: `Shared Gate${comparison.sharedGates.length > 1 ? 's' : ''} Connection`,
        content: `You share ${comparison.sharedGates.length} gate${comparison.sharedGates.length > 1 ? 's' : ''} with your partner, creating a natural resonance in how you both process and express these energies.`,
        references: sharedGateNumbers.map(g => ({ type: 'gate' as const, value: g.toString() })),
      });
    }

    // Star system insight
    if (comparison.starSystemOverlap.shared.length > 0) {
      fallbackInsights.push({
        type: 'star_connection',
        title: 'Star System Alignment',
        content: `You share alignment with ${comparison.starSystemOverlap.shared.join(' and ')}, suggesting a deep cosmic resonance in your core values and life purpose.`,
        references: comparison.starSystemOverlap.shared.map(s => ({ type: 'system' as const, value: s })),
      });
    } else if (comparison.starSystemOverlap.divergent.length > 0) {
      fallbackInsights.push({
        type: 'star_connection',
        title: 'Complementary Star Systems',
        content: `Your different star system alignments (${comparison.starSystemOverlap.divergent.slice(0, 2).join(' and ')}) bring diverse perspectives that can enrich your connection when embraced.`,
        references: comparison.starSystemOverlap.divergent.slice(0, 2).map(s => ({ type: 'system' as const, value: s })),
      });
    }

    // Centers insight
    if (comparison.sharedCenters.bothDefined.length > 0) {
      fallbackInsights.push({
        type: 'tension',
        title: 'Defined Center Dynamics',
        content: `With both of you having defined ${comparison.sharedCenters.bothDefined.slice(0, 2).join(' and ')} center${comparison.sharedCenters.bothDefined.length > 1 ? 's' : ''}, you may experience moments where your fixed energies need conscious navigation.`,
        references: comparison.sharedCenters.bothDefined.slice(0, 2).map(c => ({ type: 'system' as const, value: c })),
      });
    }

    // Advice insight
    fallbackInsights.push({
      type: 'advice',
      title: 'Relationship Guidance',
      content: `Honor each other's decision-making processes. ${chartA.hdData.type} needs ${chartA.hdData.authority} while ${chartB.hdData.type} follows ${chartB.hdData.authority}. Give each other space to make decisions in your own way.`,
      references: [
        { type: 'system', value: chartA.hdData.authority },
        { type: 'system', value: chartB.hdData.authority },
      ],
    });

    return fallbackInsights;
  }, [chartA, chartB, comparison]);

  // ============================================================================
  // Auto-generate insights on mount if none exist
  // ============================================================================

  useEffect(() => {
    if (chartA && chartB && comparison && insights.length === 0 && !isLoading && !isGenerating) {
      generateInsights();
    }
  }, [chartA, chartB, comparison, insights.length, isLoading, isGenerating, generateInsights]);

  // ============================================================================
  // Redirect if no data
  // ============================================================================

  if (!chartA || !chartB) {
    navigate('/result');
    return null;
  }

  if (!comparison) {
    navigate('/compare');
    return null;
  }

  // ============================================================================
  // Loading State
  // ============================================================================

  if (isLoading && insights.length === 0) {
    return <LoadingOverlay message="Generating relationship insights..." />;
  }

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--s3-canvas-dark)] via-[var(--s3-surface-subtle)] to-[var(--s3-canvas-dark)] relative overflow-hidden">
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.5; }
        }
        ${animationStyles}
      `}</style>

      {/* Starfield Background */}
      <Starfield />

      {/* Gradient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--s3-lavender-600)]/20 rounded-full blur-3xl animate-glow-pulse" />

      {/* Toast Error */}
      {toastError && (
        <Toast
          message={toastError}
          type="error"
          onClose={() => setToastError(null)}
          duration={5000}
          onRetry={generateInsights}
        />
      )}

      {/* Content */}
      <div className="relative max-w-md mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/compare')}
          className="flex items-center gap-2 text-sm text-[var(--s3-lavender-300)] hover:text-white transition-colors mb-6 animate-fade-in min-h-[44px] px-2 -ml-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--s3-lavender-400)]"
          aria-label="Go back to comparison"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Compare
        </button>

        {/* Header */}
        <div className="mb-6 animate-fade-in-down">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-[var(--s3-lavender-400)]" />
            <h1 className="text-2xl bg-gradient-to-r from-[var(--s3-lavender-200)] to-[var(--s3-lavender-400)] bg-clip-text text-transparent">
              Relationship Insights
            </h1>
          </div>
          <p className="text-sm text-[var(--s3-text-muted)]">
            Discover the cosmic connections between your charts
          </p>
        </div>

        {/* Charts Summary */}
        <div className="mb-6">
          <ChartsSummary />
        </div>

        {/* Regenerate Button */}
        <div
          className="mb-6 animate-fade-in-up"
          style={{ animationDelay: '0.05s', animationFillMode: 'both' }}
        >
          <Button
            variant="secondary"
            className="w-full"
            onClick={generateInsights}
            loading={isGenerating}
            disabled={isGenerating}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            Regenerate Insights
          </Button>
        </div>

        {/* Insights List */}
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <InsightCard key={`${insight.type}-${insight.title}-${index}`} insight={insight} index={index} />
          ))}
        </div>

        {/* Empty State */}
        {insights.length === 0 && !isLoading && (
          <div className="text-center py-12 animate-fade-in">
            <Sparkles className="w-12 h-12 text-[var(--s3-lavender-400)] mx-auto mb-4 opacity-50" />
            <p className="text-sm text-[var(--s3-text-subtle)]">
              No insights generated yet.
            </p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={generateInsights}
              loading={isGenerating}
            >
              Generate Insights
            </Button>
          </div>
        )}

        {/* Start New Comparison Button */}
        <div
          className="mt-8 animate-fade-in-up"
          style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
        >
          <Button
            variant="primary"
            className="w-full"
            onClick={() => navigate('/result')}
          >
            Start New Comparison
          </Button>
        </div>

        {/* Compatibility Breakdown */}
        {comparison && (
          <div
            className="mt-6 p-4 bg-[var(--s3-lavender-900)]/10 border border-[var(--s3-border-muted)] rounded-[var(--s3-radius-xl)] animate-fade-in-up"
            style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
          >
            <p className="text-xs text-[var(--s3-text-subtle)] mb-3">Compatibility Breakdown</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-medium text-[var(--s3-lavender-200)]">
                  {comparison.compatibilityScores.overall}%
                </p>
                <p className="text-xs text-[var(--s3-text-subtle)]">Overall</p>
              </div>
              <div>
                <p className="text-lg font-medium text-[var(--s3-lavender-200)]">
                  {comparison.compatibilityScores.communication}%
                </p>
                <p className="text-xs text-[var(--s3-text-subtle)]">Communication</p>
              </div>
              <div>
                <p className="text-lg font-medium text-[var(--s3-lavender-200)]">
                  {comparison.compatibilityScores.energy}%
                </p>
                <p className="text-xs text-[var(--s3-text-subtle)]">Energy</p>
              </div>
            </div>
          </div>
        )}

        {/* Shared Elements Summary */}
        {comparison && (comparison.sharedGates.length > 0 || comparison.sharedChannels.length > 0) && (
          <div
            className="mt-4 p-4 bg-[var(--s3-lavender-900)]/10 border border-[var(--s3-border-muted)] rounded-[var(--s3-radius-xl)] animate-fade-in-up"
            style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
          >
            <p className="text-xs text-[var(--s3-text-subtle)] mb-3">Shared Elements</p>
            <div className="space-y-2">
              {comparison.sharedGates.length > 0 && (
                <div>
                  <p className="text-xs text-[var(--s3-lavender-300)] mb-1">
                    {comparison.sharedGates.length} Shared Gate{comparison.sharedGates.length > 1 ? 's' : ''}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {comparison.sharedGates.slice(0, 8).map((gate) => (
                      <ReferenceChip key={gate.gate} type="gate" value={gate.gate.toString()} />
                    ))}
                    {comparison.sharedGates.length > 8 && (
                      <span className="text-xs text-[var(--s3-text-subtle)] px-2 py-0.5">
                        +{comparison.sharedGates.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              {comparison.sharedChannels.length > 0 && (
                <div className="pt-2 border-t border-[var(--s3-border-muted)]">
                  <p className="text-xs text-[var(--s3-lavender-300)] mb-1">
                    {comparison.sharedChannels.length} Electromagnetic Channel{comparison.sharedChannels.length > 1 ? 's' : ''}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {comparison.sharedChannels.slice(0, 4).map((channel) => (
                      <ReferenceChip key={channel} type="channel" value={channel} />
                    ))}
                    {comparison.sharedChannels.length > 4 && (
                      <span className="text-xs text-[var(--s3-text-subtle)] px-2 py-0.5">
                        +{comparison.sharedChannels.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Legal Disclaimer */}
        <div className="mt-8 mb-4 animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
          <div className="p-3 bg-[var(--s3-lavender-900)]/10 border border-[var(--s3-border-muted)] rounded-[var(--s3-radius-xl)]">
            <p className="text-xs text-[var(--s3-text-subtle)] leading-relaxed">
              For insight & entertainment. Not relationship, medical, or legal advice.
            </p>
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}
