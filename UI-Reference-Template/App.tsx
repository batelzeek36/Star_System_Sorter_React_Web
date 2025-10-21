import { useState } from 'react';
import { Sparkles, Calendar, Clock, MapPin, Star, Award } from 'lucide-react';
import { Button } from './components/s3/Button';
import { Chip } from './components/s3/Chip';
import { Field } from './components/s3/Field';
import { Card } from './components/s3/Card';
import { Toast } from './components/s3/Toast';
import { PleiadesCrest, SiriusCrest, LyraCrest } from './components/s3/StarSystemCrests';

type Screen = 'onboarding' | 'input' | 'result';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [showToast, setShowToast] = useState(false);

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

  return (
    <div className="min-h-screen bg-[var(--s3-canvas-dark)] text-white overflow-auto">
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {showToast && (
        <Toast 
          message="Chart computed successfully" 
          type="success" 
          onClose={() => setShowToast(false)} 
        />
      )}

      <div className="max-w-[1400px] mx-auto p-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl mb-2">Star System Sorter (S³)</h1>
          <p className="text-[var(--s3-text-muted)]">Essential UI patterns for screen generation</p>
        </div>

        {/* Core Screens Grid */}
        <section className="mb-12">
          <h2 className="text-2xl mb-6 text-[var(--s3-lavender-300)]">Core Screen Patterns</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 1. ONBOARDING SCREEN */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[var(--s3-lavender-300)]">01. Onboarding</p>
                {currentScreen === 'onboarding' && (
                  <div className="px-2 py-1 bg-[var(--s3-lavender-600)]/30 border border-[var(--s3-lavender-400)]/40 rounded text-xs">
                    Active
                  </div>
                )}
              </div>
              <div 
                className={`w-full aspect-[393/852] bg-gradient-to-b from-[var(--s3-canvas-dark)] via-[var(--s3-surface-subtle)] to-[var(--s3-canvas-dark)] rounded-[3rem] border-4 ${
                  currentScreen === 'onboarding' ? 'border-[var(--s3-lavender-500)]' : 'border-gray-800'
                } p-6 flex flex-col relative overflow-hidden transition-all cursor-pointer hover:border-[var(--s3-lavender-700)]`}
                onClick={() => setCurrentScreen('onboarding')}
              >
                <Starfield />
                
                {/* Header */}
                <div className="relative z-10 text-center mb-8">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <Sparkles className="w-8 h-8 text-[var(--s3-lavender-400)]" />
                    <h1 className="text-2xl">Star System Sorter</h1>
                  </div>
                  <p className="text-sm text-[var(--s3-text-muted)]">
                    Discover your cosmic classification
                  </p>
                </div>

                {/* Steps */}
                <div className="relative z-10 flex-1 space-y-4 mb-8">
                  <Card variant="emphasis">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--s3-lavender-600)] flex items-center justify-center text-sm">1</div>
                      <div>
                        <p className="font-medium mb-1">Enter Birth Data</p>
                        <p className="text-xs text-[var(--s3-text-muted)]">Date, time, and location</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--s3-surface-muted)] flex items-center justify-center text-sm">2</div>
                      <div>
                        <p className="font-medium mb-1">Compute Chart</p>
                        <p className="text-xs text-[var(--s3-text-muted)]">Retrieve Human Design data</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--s3-surface-muted)] flex items-center justify-center text-sm">3</div>
                      <div>
                        <p className="font-medium mb-1">View Results</p>
                        <p className="text-xs text-[var(--s3-text-muted)]">Your star system classification</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* CTA */}
                <div className="relative z-10">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    fullWidth
                    onClick={() => setCurrentScreen('input')}
                  >
                    Begin Sorting
                  </Button>
                  <p className="text-xs text-center text-[var(--s3-text-muted)] mt-3">
                    For insight & entertainment only
                  </p>
                </div>
              </div>
            </div>

            {/* 2. INPUT SCREEN */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[var(--s3-lavender-300)]">02. Input Form</p>
                {currentScreen === 'input' && (
                  <div className="px-2 py-1 bg-[var(--s3-lavender-600)]/30 border border-[var(--s3-lavender-400)]/40 rounded text-xs">
                    Active
                  </div>
                )}
              </div>
              <div 
                className={`w-full aspect-[393/852] bg-gradient-to-b from-[var(--s3-canvas-dark)] via-[var(--s3-surface-subtle)] to-[var(--s3-canvas-dark)] rounded-[3rem] border-4 ${
                  currentScreen === 'input' ? 'border-[var(--s3-lavender-500)]' : 'border-gray-800'
                } p-6 flex flex-col relative overflow-hidden transition-all cursor-pointer hover:border-[var(--s3-lavender-700)]`}
                onClick={() => setCurrentScreen('input')}
              >
                <Starfield />
                
                {/* Header */}
                <div className="relative z-10 mb-6">
                  <h2 className="text-xl mb-1">Birth Information</h2>
                  <p className="text-sm text-[var(--s3-text-muted)]">
                    Enter your details to compute your chart
                  </p>
                </div>

                {/* Form */}
                <div className="relative z-10 flex-1 space-y-4">
                  <Field
                    label="Birth Date"
                    placeholder="MM/DD/YYYY"
                    icon={<Calendar className="w-4 h-4" />}
                    helperText="Format: 01/15/1990"
                  />
                  
                  <Field
                    label="Birth Time"
                    placeholder="HH:MM AM/PM"
                    icon={<Clock className="w-4 h-4" />}
                    helperText="Format: 02:30 PM"
                  />
                  
                  <Field
                    label="Birth Location"
                    placeholder="City, State/Country"
                    icon={<MapPin className="w-4 h-4" />}
                    helperText="e.g., New York, NY"
                  />

                  <Card variant="emphasis">
                    <p className="text-xs text-[var(--s3-text-muted)]">
                      <strong className="text-[var(--s3-lavender-300)]">Privacy:</strong> Your data is used only for chart computation and never stored or shared.
                    </p>
                  </Card>
                </div>

                {/* Submit */}
                <div className="relative z-10 mt-6">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    fullWidth
                    onClick={() => {
                      setShowToast(true);
                      setTimeout(() => setCurrentScreen('result'), 500);
                    }}
                  >
                    Compute Chart
                  </Button>
                </div>
              </div>
            </div>

            {/* 3. RESULT SCREEN */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[var(--s3-lavender-300)]">03. Result Display</p>
                {currentScreen === 'result' && (
                  <div className="px-2 py-1 bg-[var(--s3-lavender-600)]/30 border border-[var(--s3-lavender-400)]/40 rounded text-xs">
                    Active
                  </div>
                )}
              </div>
              <div 
                className={`w-full aspect-[393/852] bg-gradient-to-b from-[var(--s3-canvas-dark)] via-[var(--s3-surface-subtle)] to-[var(--s3-canvas-dark)] rounded-[3rem] border-4 ${
                  currentScreen === 'result' ? 'border-[var(--s3-lavender-500)]' : 'border-gray-800'
                } p-6 flex flex-col relative overflow-hidden transition-all cursor-pointer hover:border-[var(--s3-lavender-700)]`}
                onClick={() => setCurrentScreen('result')}
              >
                <Starfield />
                
                {/* Header */}
                <div className="relative z-10 text-center mb-6">
                  <h2 className="text-xl mb-1">Your Star System</h2>
                  <p className="text-sm text-[var(--s3-text-muted)]">Primary Classification</p>
                </div>

                {/* Crest */}
                <div className="relative z-10 flex justify-center mb-6">
                  <div className="w-32 h-32">
                    <PleiadesCrest />
                  </div>
                </div>

                {/* System Name */}
                <div className="relative z-10 text-center mb-6">
                  <h3 className="text-2xl text-[var(--s3-lavender-300)] mb-2">Pleiades</h3>
                  <p className="text-sm text-[var(--s3-text-muted)]">
                    The Healers & Nurturers
                  </p>
                </div>

                {/* Percentages */}
                <Card variant="emphasis" className="relative z-10 mb-4">
                  <p className="text-xs text-[var(--s3-text-muted)] mb-3">System Alignment</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pleiades</span>
                      <span className="text-sm text-[var(--s3-lavender-300)]">34%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--s3-text-muted)]">Sirius</span>
                      <span className="text-sm text-[var(--s3-text-muted)]">22%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--s3-text-muted)]">Lyra</span>
                      <span className="text-sm text-[var(--s3-text-muted)]">18%</span>
                    </div>
                  </div>
                </Card>

                {/* Allies */}
                <div className="relative z-10 mb-6">
                  <p className="text-xs text-[var(--s3-text-muted)] mb-2">Allied Systems</p>
                  <div className="flex gap-2">
                    <Chip icon={<Star className="w-3 h-3" />}>Sirius</Chip>
                    <Chip icon={<Star className="w-3 h-3" />}>Lyra</Chip>
                  </div>
                </div>

                {/* Actions */}
                <div className="relative z-10 mt-auto space-y-2">
                  <Button variant="secondary" size="md" fullWidth>
                    <Award className="w-4 h-4" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Component Examples */}
        <section className="mb-12">
          <h2 className="text-2xl mb-6 text-[var(--s3-lavender-300)]">Component Library</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Buttons */}
            <Card>
              <p className="text-sm text-[var(--s3-text-muted)] mb-4">Buttons</p>
              <div className="space-y-3">
                <Button variant="primary" size="lg" fullWidth>Primary Large</Button>
                <Button variant="secondary" size="md" fullWidth>Secondary Medium</Button>
                <Button variant="ghost" size="sm" fullWidth>Ghost Small</Button>
              </div>
            </Card>

            {/* Cards */}
            <Card>
              <p className="text-sm text-[var(--s3-text-muted)] mb-4">Cards</p>
              <div className="space-y-3">
                <Card variant="default">Default Card</Card>
                <Card variant="emphasis">Emphasis Card</Card>
                <Card variant="warning">Warning Card</Card>
              </div>
            </Card>

            {/* Chips */}
            <Card>
              <p className="text-sm text-[var(--s3-text-muted)] mb-4">Chips</p>
              <div className="flex flex-wrap gap-2">
                <Chip>Default</Chip>
                <Chip icon={<Star className="w-3 h-3" />}>With Icon</Chip>
                <Chip>Another Tag</Chip>
              </div>
            </Card>

            {/* Crests */}
            <Card>
              <p className="text-sm text-[var(--s3-text-muted)] mb-4">Star System Crests</p>
              <div className="flex gap-4">
                <div className="w-16 h-16"><PleiadesCrest /></div>
                <div className="w-16 h-16"><SiriusCrest /></div>
                <div className="w-16 h-16"><LyraCrest /></div>
              </div>
            </Card>

          </div>
        </section>

      </div>
    </div>
  );
}
