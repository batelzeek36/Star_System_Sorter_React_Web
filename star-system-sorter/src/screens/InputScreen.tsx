/**
 * InputScreen - Birth Data Collection
 * 
 * Collects user birth information with validation.
 * Uses React Hook Form + Zod for form validation.
 * Converts user-friendly formats to API formats before submission.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Field } from '../components/figma/Field';
import { Button } from '../components/figma/Button';
import { Toast } from '../components/figma/Toast';
import { BirthDataFormSchema, type BirthDataForm } from '../lib/schemas';
import { useHDData } from '../hooks/useHDData';
import { useBirthDataStore } from '../store/birthDataStore';
import { HDAPIError } from '../api/bodygraph-client';

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
// Component
// ============================================================================

export function InputScreen() {
  const navigate = useNavigate();
  const { loading, fetchHDData } = useHDData();
  const setData = useBirthDataStore((state) => state.setData);
  
  const [toastError, setToastError] = useState<string | null>(null);
  const [lastSubmittedData, setLastSubmittedData] = useState<BirthDataForm | null>(null);
  
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
  
  // ============================================================================
  // Form Submission Handler
  // ============================================================================
  
  const onSubmit = async (data: BirthDataForm) => {
    try {
      // Store form data in Zustand
      setData(data);
      setLastSubmittedData(data);
      
      // Convert to API format
      const dateISO = convertDateToISO(data.date);
      const time24 = convertTo24Hour(data.time);
      
      // Call API
      await fetchHDData({
        dateISO,
        time: time24,
        timeZone: data.timeZone,
      });
      
      // Navigate to result screen on success
      navigate('/result');
      
    } catch (error) {
      // Handle errors
      if (error instanceof HDAPIError) {
        setToastError(error.message);
      } else {
        setToastError('An unexpected error occurred. Please try again.');
      }
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
  // Render
  // ============================================================================
  
  return (
    <div className="min-h-screen bg-[var(--s3-canvas-dark)] text-white relative overflow-hidden">
      {/* Starfield Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite ${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      
      {/* Gradient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--s3-lavender-600)]/10 rounded-full blur-3xl" />
      
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
        <div className="mb-8">
          <h1 className="text-3xl mb-2 bg-gradient-to-r from-[var(--s3-lavender-200)] to-[var(--s3-lavender-400)] bg-clip-text text-transparent">
            Chart Input
          </h1>
          <p className="text-sm text-[var(--s3-text-muted)]">
            Enter your birth details for accurate classification
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            <label htmlFor="timezone-select" className="text-sm text-[var(--s3-lavender-300)] mb-2 block">
              Time Zone
            </label>
            <select
              id="timezone-select"
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
              Compute Chart
            </Button>
          </div>
        </form>
        
        {/* Legal Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[var(--s3-text-subtle)]">
            For insight & entertainment. Not medical, financial, or legal advice.
          </p>
        </div>
      </div>
      
      {/* Twinkle Animation */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export default InputScreen;
