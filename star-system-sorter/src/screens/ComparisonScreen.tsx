/**
 * ComparisonScreen - Second Chart Entry
 *
 * Allows users to enter a second person's birth data for chart comparison.
 * Displays Chart A summary at the top and collects Chart B data.
 * Uses React Hook Form + Zod for form validation.
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Clock, MapPin, ArrowLeft, Users } from 'lucide-react';
import { Field } from '../components/figma/Field';
import { Button } from '../components/figma/Button';
import { Toast } from '../components/figma/Toast';
import { StarSystemCrests, type StarSystemName } from '../components/figma/StarSystemCrests';
import { BirthDataFormSchema, type BirthDataForm } from '../lib/schemas';
import { useHDData } from '../hooks/useHDData';
import { useClassification } from '../hooks/useClassification';
import { useComparisonStore, type ChartData } from '../store/comparisonStore';
import { useBirthDataStore } from '../store/birthDataStore';
import { compareCharts } from '../lib/comparison';
import { getRelevantLoreForCharts } from '../lib/lore-retriever';
import { HDAPIError } from '../api/bodygraph-client';
import { animationStyles } from '@/styles/animations';

// ============================================================================
// Timezone List (Common IANA Timezones)
// ============================================================================

const COMMON_TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Rome',
  'Europe/Madrid',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Hong_Kong',
  'Asia/Singapore',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Pacific/Auckland',
];

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Convert MM/DD/YYYY to YYYY-MM-DD
 */
function convertDateToISO(date: string): string {
  const [month, day, year] = date.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * Convert 12-hour time (HH:MM AM/PM) to 24-hour time (HH:mm)
 */
function convertTo24Hour(time: string): string {
  const match = time.match(/^(\d{2}):(\d{2}) (AM|PM)$/);
  if (!match) throw new Error('Invalid time format');

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3];

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

// ============================================================================
// Starfield Component (memoized to prevent re-renders)
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
// Chart A Summary Component
// ============================================================================

interface ChartSummaryProps {
  chartData: ChartData;
}

function ChartASummary({ chartData }: ChartSummaryProps) {
  const primarySystem =
    chartData.classification?.classification === 'hybrid' && chartData.classification?.hybrid
      ? chartData.classification.hybrid[0]
      : chartData.classification?.primary || 'Unknown';

  const percentage = chartData.classification?.percentages[primarySystem] || 0;
  const CrestComponent = StarSystemCrests[primarySystem as StarSystemName] || StarSystemCrests['Pleiades'];

  return (
    <div className="p-4 bg-[var(--s3-lavender-900)]/20 border border-[var(--s3-border-muted)] rounded-[var(--s3-radius-xl)] animate-fade-in-down">
      <p className="text-xs text-[var(--s3-text-subtle)] mb-2">Chart A - Your Chart</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[var(--s3-lavender-500)]/20 flex items-center justify-center">
          <CrestComponent size={24} className="text-[var(--s3-lavender-400)]" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{chartData.hdData.type}</p>
          <p className="text-xs text-[var(--s3-lavender-300)]">
            {primarySystem} • {percentage.toFixed(1)}%
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--s3-text-subtle)]">{chartData.hdData.profile}</p>
          <p className="text-xs text-[var(--s3-text-subtle)]">{chartData.hdData.authority}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Component
// ============================================================================

export function ComparisonScreen() {
  const navigate = useNavigate();
  const { loading: hdLoading, fetchHDData } = useHDData();
  const { loading: classifyLoading, classify } = useClassification();

  // Birth data store (for reading Chart B's computed data)
  const hdDataFromStore = useBirthDataStore((state) => state.hdData);
  const classificationFromStore = useBirthDataStore((state) => state.classification);

  // Comparison store
  const chartA = useComparisonStore((state) => state.chartA);
  const setChartB = useComparisonStore((state) => state.setChartB);
  const setComparison = useComparisonStore((state) => state.setComparison);
  const setLoading = useComparisonStore((state) => state.setLoading);
  const setError = useComparisonStore((state) => state.setError);

  const [toastError, setToastError] = useState<string | null>(null);
  const [lastSubmittedData, setLastSubmittedData] = useState<BirthDataForm | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize form with React Hook Form + Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BirthDataForm>({
    resolver: zodResolver(BirthDataFormSchema),
    defaultValues: {
      date: '',
      time: '',
      location: '',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  const loading = hdLoading || classifyLoading || isProcessing;

  // Redirect to result if no chartA
  if (!chartA) {
    navigate('/result');
    return null;
  }

  // ============================================================================
  // Form Submission Handler
  // ============================================================================

  const onSubmit = async (data: BirthDataForm) => {
    try {
      setIsProcessing(true);
      setLoading(true);
      setToastError(null);
      setLastSubmittedData(data);

      // Convert to API format
      const dateISO = convertDateToISO(data.date);
      const time24 = convertTo24Hour(data.time);

      // Fetch HD data for Chart B
      await fetchHDData({
        dateISO,
        time: time24,
        timeZone: data.timeZone,
      });

      // Get the fresh HD data from the store
      const hdDataB = useBirthDataStore.getState().hdData;

      if (!hdDataB) {
        throw new Error('Failed to fetch HD data for Chart B');
      }

      // Classify Chart B
      await classify(hdDataB);
      const classificationB = useBirthDataStore.getState().classification;

      // Store Chart B data
      const chartBData: ChartData = {
        hdData: hdDataB,
        classification: classificationB,
        birthDate: data.date,
        birthTime: data.time,
        location: data.location,
      };
      setChartB(chartBData);

      // Run comparison between charts
      if (chartA.classification && classificationB) {
        const comparison = compareCharts(
          chartA.hdData,
          hdDataB,
          chartA.classification,
          classificationB
        );
        setComparison(comparison);

        // Pre-fetch lore for insights (this will be used by InsightsScreen)
        getRelevantLoreForCharts(chartA.hdData, hdDataB);
      }

      // Navigate to insights screen
      navigate('/insights');
    } catch (error) {
      // Handle errors
      if (error instanceof HDAPIError) {
        setToastError(error.message);
        setError(error.message);
      } else if (error instanceof Error) {
        setToastError(error.message);
        setError(error.message);
      } else {
        setToastError('An unexpected error occurred. Please try again.');
        setError('An unexpected error occurred');
      }
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };

  // ============================================================================
  // Retry Handler
  // ============================================================================

  const handleRetry = () => {
    setToastError(null);
    if (lastSubmittedData) {
      onSubmit(lastSubmittedData);
    }
  };

  // ============================================================================
  // Back Handler
  // ============================================================================

  const handleBack = () => {
    navigate('/result');
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="min-h-screen bg-[var(--s3-canvas-dark)] text-white relative overflow-hidden">
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--s3-lavender-600)]/10 rounded-full blur-3xl animate-glow-pulse" />

      {/* Toast Error */}
      {toastError && (
        <Toast
          message={toastError}
          type="error"
          onClose={() => setToastError(null)}
          duration={5000}
          onRetry={lastSubmittedData ? handleRetry : undefined}
        />
      )}

      {/* Content */}
      <div className="relative max-w-md mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-[var(--s3-lavender-300)] hover:text-white transition-colors mb-6 animate-fade-in"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Results
        </button>

        {/* Header */}
        <div className="mb-6 animate-fade-in-down">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-[var(--s3-lavender-400)]" />
            <h1 className="text-2xl bg-gradient-to-r from-[var(--s3-lavender-200)] to-[var(--s3-lavender-400)] bg-clip-text text-transparent">
              Compare Charts
            </h1>
          </div>
          <p className="text-sm text-[var(--s3-text-muted)]">
            Enter the second person's birth details to discover relationship insights
          </p>
        </div>

        {/* Chart A Summary */}
        <div className="mb-6">
          <ChartASummary chartData={chartA} />
        </div>

        {/* Divider with "vs" */}
        <div className="flex items-center gap-4 mb-6 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <div className="flex-1 h-px bg-[var(--s3-border-muted)]" />
          <span className="text-xs text-[var(--s3-text-subtle)] px-2">vs</span>
          <div className="flex-1 h-px bg-[var(--s3-border-muted)]" />
        </div>

        {/* Chart B Form */}
        <div className="mb-4 animate-fade-in-up" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
          <p className="text-xs text-[var(--s3-text-subtle)] mb-3">Chart B - Partner's Details</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 animate-fade-in-up"
          style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
        >
          {/* Date Field */}
          <Field
            label="Date of Birth"
            placeholder="MM/DD/YYYY"
            icon={<Calendar className="w-4 h-4" />}
            error={errors.date?.message}
            {...register('date')}
          />

          {/* Time Field */}
          <Field
            label="Time of Birth"
            placeholder="HH:MM AM/PM"
            icon={<Clock className="w-4 h-4" />}
            error={errors.time?.message}
            helperText="Example: 02:30 PM"
            {...register('time')}
          />

          {/* Location Field */}
          <Field
            label="Location"
            placeholder="City, State/Country"
            icon={<MapPin className="w-4 h-4" />}
            error={errors.location?.message}
            helperText="Example: New York, NY"
            {...register('location')}
          />

          {/* Timezone Select */}
          <div>
            <label htmlFor="timezone-select-b" className="text-sm text-[var(--s3-lavender-300)] mb-2 block">
              Time Zone
            </label>
            <select
              id="timezone-select-b"
              {...register('timeZone')}
              className="
                w-full px-4 py-2 h-[44px]
                bg-[var(--s3-lavender-900)]/20
                border border-[var(--s3-border-muted)]
                rounded-[var(--s3-radius-xl)]
                text-sm text-white
                outline-none
                focus:border-[var(--s3-lavender-400)]
                focus:ring-2 focus:ring-[var(--s3-lavender-400)]/30
                transition-all duration-200
              "
            >
              {COMMON_TIMEZONES.map((tz) => (
                <option key={tz} value={tz} className="bg-[var(--s3-canvas-dark)]">
                  {tz.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            {errors.timeZone && (
              <p className="text-xs text-[var(--s3-error)] mt-1.5">
                {errors.timeZone.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Generate Insights
            </Button>
          </div>
        </form>

        {/* Legal Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[var(--s3-text-subtle)]">
            For insight & entertainment. Not relationship, medical, or legal advice.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ComparisonScreen;
