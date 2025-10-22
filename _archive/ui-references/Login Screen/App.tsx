import { useState } from 'react';
import { Sparkles, Calendar, Clock, MapPin, Star, Award, Scroll, Settings, Gamepad2, Users, Trophy, Music, ListChecks, Swords, Zap } from 'lucide-react';
import { AppBar } from './components/s3/AppBar';
import { TabBar } from './components/s3/TabBar';
import { Button } from './components/s3/Button';
import { Chip } from './components/s3/Chip';
import { Field } from './components/s3/Field';
import { Card } from './components/s3/Card';
import { Toast, InlineAlert } from './components/s3/Toast';
import { PleiadesCrest, SiriusCrest, LyraCrest, AndromedaCrest, OrionCrest, ArcturusCrest } from './components/s3/StarSystemCrests';
import { PaywallScreen } from './components/s3/screens/PaywallScreen';
import { SettingsScreen } from './components/s3/screens/SettingsScreen';
import { EmptyStatesScreen } from './components/s3/screens/EmptyStatesScreen';
import WhyScreenRedesign from './components/s3/screens/WhyScreenRedesign';
import LoginScreen from './components/s3/screens/LoginScreen';

// Game components
import { Joystick, HUDButton, HPHearts, XPBar, DistanceMeter, Timer, Counter, PauseButton } from './components/s3/game/HUDComponents';
import { GameModeCard, QuestCard } from './components/s3/game/GameCards';
import { TeamBadge } from './components/s3/game/GameBadges';
import { PartyMember } from './components/s3/game/PartyMember';
import { PauseModal, MusicThemeModal } from './components/s3/game/GameModals';

type Screen = 'login' | 'onboarding' | 'input' | 'result' | 'why' | 'whyRedesign' | 'community' | 'profile' | 'paywall' | 'settings' | 'emptyStates' | 'gameHub' | 'teamSelect' | 'modeSelect' | 'lobby' | 'hudSurvivor' | 'hudRunner' | 'matchResult' | 'leaderboard' | 'musicTheme' | 'questsPass';
type Tab = 'home' | 'community' | 'profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showToast, setShowToast] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<'Orion' | 'Sirius' | 'Pleiades' | 'Andromeda' | 'Lyra' | 'Arcturus'>('Pleiades');
  const [selectedMode, setSelectedMode] = useState<'survivor' | 'runner'>('survivor');

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'home') setCurrentScreen('result');
    else if (tab === 'community') setCurrentScreen('community');
    else if (tab === 'profile') setCurrentScreen('profile');
  };

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

      <div className="max-w-[1800px] mx-auto p-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl">Star System Sorter (S³)</h1>
            <div className="px-3 py-1 bg-gradient-to-r from-[var(--s3-lavender-600)]/30 to-[var(--s3-lavender-500)]/30 border border-[var(--s3-lavender-400)]/40 rounded-full text-sm text-[var(--s3-lavender-300)]">
              v1.0 + Game Layer
            </div>
          </div>
          <p className="text-[var(--s3-text-muted)]">Complete design system + lightweight game layer (19 screens total)</p>
        </div>

        {/* Design Tokens Overview */}
        <section className="mb-12">
          <h2 className="text-2xl mb-6 text-[var(--s3-lavender-300)]">Design Tokens</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <p className="text-sm text-[var(--s3-text-muted)] mb-4">Color System</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-[var(--s3-canvas-dark)] border border-[var(--s3-border-muted)]" />
                  <span className="text-xs">Canvas Dark</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-[var(--s3-lavender-500)]" />
                  <span className="text-xs">Lavender 500</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-[var(--s3-gold-400)]" />
                  <span className="text-xs">Gold 400</span>
                </div>
              </div>
            </Card>

            <Card>
              <p className="text-sm text-[var(--s3-text-muted)] mb-4">Elevation</p>
              <div className="space-y-3">
                {[0, 1, 2, 3, 4].map(level => (
                  <div 
                    key={level}
                    className="p-2 bg-[var(--s3-surface-subtle)] rounded text-xs"
                    style={{ boxShadow: `var(--s3-elevation-${level})` }}
                  >
                    Level {level}
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <p className="text-sm text-[var(--s3-text-muted)] mb-4">Touch Targets</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-[44px] h-[44px] bg-[var(--s3-lavender-500)]/20 border border-[var(--s3-lavender-400)]/40 rounded flex items-center justify-center text-xs">
                    44px
                  </div>
                  <span className="text-xs text-[var(--s3-text-muted)]">Minimum (WCAG AA)</span>
                </div>
                <p className="text-xs text-[var(--s3-text-subtle)]">
                  All interactive elements meet 44×44px minimum
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Component Library */}
        <section className="mb-12">
          <h2 className="text-2xl mb-6 text-[var(--s3-lavender-300)]">Component Library</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Buttons */}
            <Card>
              <p className="text-sm text-[var(--s3-text-muted)] mb-4">Button Variants & States</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[var(--s3-text-subtle)] mb-2">Sizes</p>
                  <div className="space-y-2">
                    <Button variant="primary" size="sm">Small Button</Button>
                    <Button variant="primary" size="md">Medium Button</Button>
                    <Button variant="primary" size="lg">Large Button</Button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[var(--s3-text-subtle)] mb-2">Variants</p>
                  <div className="space-y-2">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[var(--s3-text-subtle)] mb-2">With Icons & States</p>
                  <div className="space-y-2">
                    <Button variant="primary" leadingIcon={<Sparkles className="w-4 h-4" />}>
                      With Icon
                    </Button>
                    <Button variant="primary" loading>Loading...</Button>
                    <Button variant="primary" disabled>Disabled</Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Chips */}
            <Card>
              <p className="text-sm text-[var(--s3-text-muted)] mb-4">Chip Variants</p>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[var(--s3-text-subtle)] mb-2">Default</p>
                  <div className="flex flex-wrap gap-2">
                    <Chip starSystem="Pleiades" percentage={62} variant="lavender" />
                    <Chip starSystem="Sirius" percentage={18} variant="gold" />
                    <Chip starSystem="Lyra" percentage={12} variant="gold" />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[var(--s3-text-subtle)] mb-2">Selectable</p>
                  <div className="flex flex-wrap gap-2">
                    <Chip starSystem="Pleiades" selectable selected variant="lavender" />
                    <Chip starSystem="Sirius" selectable variant="gold" />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[var(--s3-text-subtle)] mb-2">Dismissible</p>
                  <Chip starSystem="Andromeda" percentage={8} dismissible onDismiss={() => {}} variant="lavender" />
                </div>
              </div>
            </Card>

            {/* Fields */}
            <Card>
              <p className="text-sm text-[var(--s3-text-muted)] mb-4">Form Fields & States</p>
              <div className="space-y-3">
                <Field 
                  label="Default State" 
                  placeholder="Enter text..."
                  icon={<Calendar className="w-4 h-4" />}
                />
                <Field 
                  label="With Helper Text" 
                  placeholder="MM/DD/YYYY"
                  icon={<Calendar className="w-4 h-4" />}
                  helperText="Format: Month/Day/Year"
                />
                <Field 
                  label="Error State" 
                  placeholder="Invalid input"
                  icon={<Clock className="w-4 h-4" />}
                  error="Time is required for accurate chart calculation"
                />
              </div>
            </Card>

            {/* Cards & Alerts */}
            <Card>
              <p className="text-sm text-[var(--s3-text-muted)] mb-4">Cards & Alerts</p>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Card variant="default" className="p-3">
                    <p className="text-xs">Default Card</p>
                  </Card>
                  <Card variant="emphasis" className="p-3">
                    <p className="text-xs">Emphasis Card</p>
                  </Card>
                  <Card variant="warning" className="p-3">
                    <p className="text-xs">Warning Card</p>
                  </Card>
                </div>
                <div className="space-y-2">
                  <InlineAlert type="info" message="Informational message" />
                  <InlineAlert type="success" message="Success message" />
                  <InlineAlert type="error" message="Error message" />
                </div>
              </div>
            </Card>

            {/* Star System Crests */}
            <Card>
              <p className="text-sm text-[var(--s3-text-muted)] mb-4">Star System Crests</p>
              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col items-center gap-2">
                  <PleiadesCrest size={48} className="text-[var(--s3-lavender-400)]" />
                  <p className="text-xs text-center">Pleiades</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <SiriusCrest size={48} className="text-[var(--s3-gold-400)]" />
                  <p className="text-xs text-center">Sirius</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <LyraCrest size={48} className="text-[var(--s3-lavender-400)]" />
                  <p className="text-xs text-center">Lyra</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <AndromedaCrest size={48} className="text-[var(--s3-gold-400)]" />
                  <p className="text-xs text-center">Andromeda</p>
                </div>
              </div>
              <p className="text-xs text-[var(--s3-text-subtle)] mt-3">
                Export sizes: 24px, 28px, 48px (SVG)
              </p>
            </Card>
          </div>
        </section>

        {/* Game Components */}
        <section className="mb-12">
          <h2 className="text-2xl mb-6 text-[var(--s3-lavender-300)]">🕹 Game Components</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* HUD Controls */}
            <Card>
              <p className="text-sm text-[var(--s3-text-muted)] mb-4">HUD Controls</p>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[var(--s3-text-subtle)] mb-2">Joystick (Left/Right)</p>
                  <div className="flex gap-4">
                    <Joystick handed="left" />
                    <Joystick handed="right" />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[var(--s3-text-subtle)] mb-2">Action Buttons</p>
                  <div className="flex gap-3">
                    <HUDButton type="A" state="default" />
                    <HUDButton type="B" state="default" />
                    <HUDButton type="Jump" state="pressed" />
                    <HUDButton type="Slide" state="default" />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[var(--s3-text-subtle)] mb-2">Pause Button</p>
                  <PauseButton />
                </div>
              </div>
            </Card>

            {/* HUD Bars & Counters */}
            <Card>
              <p className="text-sm text-[var(--s3-text-muted)] mb-4">HUD Bars & Counters</p>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[var(--s3-text-subtle)] mb-2">HP Hearts</p>
                  <HPHearts current={3} max={5} />
                </div>
                <div>
                  <p className="text-xs text-[var(--s3-text-subtle)] mb-2">XP Bar</p>
                  <XPBar current={450} max={1000} level={12} />
                </div>
                <div>
                  <p className="text-xs text-[var(--s3-text-subtle)] mb-2">Distance Meter</p>
                  <DistanceMeter distance={1247} unit="m" />
                </div>
                <div>
                  <p className="text-xs text-[var(--s3-text-subtle)] mb-2">Timer & Counters</p>
                  <div className="flex flex-wrap gap-2">
                    <Timer seconds={125} />
                    <Counter type="kills" value={12} />
                    <Counter type="coins" value={847} />
                    <Counter type="stars" value={3} />
                  </div>
                </div>
              </div>
            </Card>

            {/* Game Cards */}
            <Card>
              <p className="text-sm text-[var(--s3-text-muted)] mb-4">Game Mode Cards</p>
              <div className="space-y-3">
                <GameModeCard
                  mode="survivor"
                  title="Survivor Arena"
                  description="Top-down battle royale"
                  players="30 players per match"
                  selected
                />
                <GameModeCard
                  mode="runner"
                  title="Side Runner"
                  description="Endless obstacle course"
                  players="Solo or async leaderboard"
                />
              </div>
            </Card>

            {/* Quest Cards */}
            <Card>
              <p className="text-sm text-[var(--s3-text-muted)] mb-4">Quest Cards</p>
              <div className="space-y-3">
                <QuestCard
                  type="daily"
                  title="Star Collector"
                  description="Collect 50 stars in any mode"
                  progress={32}
                  max={50}
                  reward={100}
                />
                <QuestCard
                  type="weekly"
                  title="Team Victory"
                  description="Win 5 matches with your star system"
                  progress={5}
                  max={5}
                  reward={500}
                  completed
                />
              </div>
            </Card>

            {/* Team Badges */}
            <Card>
              <p className="text-sm text-[var(--s3-text-muted)] mb-4">Team Badges</p>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[var(--s3-text-subtle)] mb-2">Badge Sizes</p>
                  <div className="flex items-end gap-3">
                    <TeamBadge team="Pleiades" size="sm" />
                    <TeamBadge team="Sirius" size="md" />
                    <TeamBadge team="Lyra" size="lg" />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[var(--s3-text-subtle)] mb-2">With Names</p>
                  <div className="space-y-2">
                    <TeamBadge team="Pleiades" size="md" showName />
                    <TeamBadge team="Andromeda" size="md" showName />
                    <TeamBadge team="Arcturus" size="md" showName />
                  </div>
                </div>
              </div>
            </Card>

            {/* Party Member List Item */}
            <Card>
              <p className="text-sm text-[var(--s3-text-muted)] mb-4">Party Member List Item</p>
              <div className="space-y-2">
                <PartyMember name="You" team="Pleiades" ready isYou />
                <PartyMember name="StarGazer42" team="Sirius" ready />
                <PartyMember name="CosmicDreamer" team="Lyra" ready={false} />
              </div>
            </Card>
          </div>
        </section>

        {/* Mobile Frames */}
        <section>
          <h2 className="text-2xl mb-6 text-[var(--s3-lavender-300)]">Interactive Prototype Flows (20 Screens)</h2>
          <p className="text-sm text-[var(--s3-text-muted)] mb-8">
            ✨ Click screens to navigate • Login + Core sorter (1-9) + Game layer (10-19) • All touch targets ≥44px
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Screen 0: Login */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[var(--s3-lavender-300)]">00. Login</p>
                {currentScreen === 'login' && (
                  <div className="px-2 py-1 bg-[var(--s3-lavender-600)]/30 border border-[var(--s3-lavender-400)]/40 rounded text-xs text-[var(--s3-lavender-200)]">
                    Active
                  </div>
                )}
              </div>
              <div 
                className={`w-full aspect-[393/852] rounded-[3rem] border-4 ${
                  currentScreen === 'login' ? 'border-[var(--s3-lavender-500)]' : 'border-gray-800'
                } overflow-hidden transition-all cursor-pointer hover:border-[var(--s3-lavender-700)]`}
                onClick={() => setCurrentScreen('login')}
              >
                <div className="w-full h-full scale-[0.98]">
                  <LoginScreen />
                </div>
              </div>
            </div>

            {/* Screen 1: Onboarding */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[var(--s3-lavender-300)]">01. Onboarding</p>
                {currentScreen === 'onboarding' && (
                  <div className="px-2 py-1 bg-[var(--s3-lavender-600)]/30 border border-[var(--s3-lavender-400)]/40 rounded text-xs text-[var(--s3-lavender-200)]">
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
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--s3-lavender-600)]/10 rounded-full blur-3xl"></div>
                
                <div className="relative flex-1 flex flex-col">
                  <div className="h-12"></div>
                  
                  <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)] flex items-center justify-center" style={{ boxShadow: 'var(--s3-elevation-2)' }}>
                      <Sparkles className="w-12 h-12 text-white" />
                    </div>
                  </div>

                  <div className="text-center mb-12">
                    <h1 className="text-3xl mb-3 bg-gradient-to-r from-[var(--s3-lavender-200)] to-[var(--s3-lavender-400)] bg-clip-text text-transparent">
                      Star System Sorter
                    </h1>
                    <p className="text-sm text-[var(--s3-text-muted)] px-6">
                      Discover your primary star system origin through Human Design
                    </p>
                  </div>

                  <div className="space-y-4 mb-auto px-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[var(--s3-lavender-500)]/20 border border-[var(--s3-lavender-400)]/40 flex items-center justify-center text-sm text-[var(--s3-lavender-300)] flex-shrink-0">
                        1
                      </div>
                      <div>
                        <p className="text-sm text-[var(--s3-lavender-200)] mb-1">Input</p>
                        <p className="text-xs text-[var(--s3-text-subtle)]">Enter birth data or upload chart</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[var(--s3-lavender-500)]/20 border border-[var(--s3-lavender-400)]/40 flex items-center justify-center text-sm text-[var(--s3-lavender-300)] flex-shrink-0">
                        2
                      </div>
                      <div>
                        <p className="text-sm text-[var(--s3-lavender-200)] mb-1">Deterministic Sort</p>
                        <p className="text-xs text-[var(--s3-text-subtle)]">Rules engine classifies your chart</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[var(--s3-lavender-500)]/20 border border-[var(--s3-lavender-400)]/40 flex items-center justify-center text-sm text-[var(--s3-lavender-300)] flex-shrink-0">
                        3
                      </div>
                      <div>
                        <p className="text-sm text-[var(--s3-lavender-200)] mb-1">Narrative</p>
                        <p className="text-xs text-[var(--s3-text-subtle)]">LLM generates your star system story</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button 
                      variant="primary" 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentScreen('input');
                      }}
                    >
                      Begin Sorting
                    </Button>
                  </div>

                  <div className="h-8"></div>
                </div>
              </div>
            </div>

            {/* Screen 2: Input Birth Data */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[var(--s3-lavender-300)]">02. Input Birth Data</p>
                {currentScreen === 'input' && (
                  <div className="px-2 py-1 bg-[var(--s3-lavender-600)]/30 border border-[var(--s3-lavender-400)]/40 rounded text-xs text-[var(--s3-lavender-200)]">
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
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--s3-lavender-600)]/10 rounded-full blur-3xl"></div>
                
                <div className="relative flex-1 flex flex-col">
                  <AppBar title="Chart Input" showBack onBack={() => setCurrentScreen('onboarding')} />
                  
                  <div className="mb-6 px-4">
                    <p className="text-xs text-[var(--s3-text-subtle)]">Enter details or upload PDF</p>
                  </div>

                  <div className="flex gap-2 mb-6 px-4">
                    <button className="flex-1 px-4 py-2.5 min-h-[44px] bg-gradient-to-r from-[var(--s3-lavender-500)] to-[var(--s3-lavender-400)] rounded-[var(--s3-radius-full)] text-sm">
                      Birth Data
                    </button>
                    <button className="flex-1 px-4 py-2.5 min-h-[44px] bg-white/5 border border-[var(--s3-lavender-400)]/20 rounded-[var(--s3-radius-full)] text-sm text-[var(--s3-text-muted)]">
                      Upload PDF
                    </button>
                  </div>

                  <div className="space-y-4 mb-auto px-4">
                    <Field 
                      label="Date of Birth" 
                      placeholder="MM/DD/YYYY"
                      icon={<Calendar className="w-4 h-4" />}
                    />
                    <Field 
                      label="Time of Birth" 
                      placeholder="HH:MM AM/PM"
                      icon={<Clock className="w-4 h-4" />}
                    />
                    <Field 
                      label="Location" 
                      placeholder="City, Country"
                      icon={<MapPin className="w-4 h-4" />}
                    />
                  </div>

                  <div className="pt-6 px-4">
                    <Button 
                      variant="primary" 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowToast(true);
                        setTimeout(() => {
                          setCurrentScreen('result');
                          setActiveTab('home');
                        }, 1000);
                      }}
                    >
                      Compute Chart
                    </Button>
                  </div>

                  <div className="h-8"></div>
                </div>
              </div>
            </div>

            {/* Screen 3: Sort Result */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[var(--s3-lavender-300)]">03. Sort Result (Home)</p>
                {currentScreen === 'result' && (
                  <div className="px-2 py-1 bg-[var(--s3-lavender-600)]/30 border border-[var(--s3-lavender-400)]/40 rounded text-xs text-[var(--s3-lavender-200)]">
                    Active
                  </div>
                )}
              </div>
              <div 
                className={`w-full aspect-[393/852] bg-gradient-to-b from-[var(--s3-canvas-dark)] via-[var(--s3-surface-subtle)] to-[var(--s3-canvas-dark)] rounded-[3rem] border-4 ${
                  currentScreen === 'result' ? 'border-[var(--s3-lavender-500)]' : 'border-gray-800'
                } p-6 flex flex-col relative overflow-hidden transition-all cursor-pointer hover:border-[var(--s3-lavender-700)]`}
                onClick={() => {
                  setCurrentScreen('result');
                  setActiveTab('home');
                }}
              >
                <Starfield />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--s3-lavender-600)]/20 rounded-full blur-3xl"></div>
                
                <div className="relative flex-1 flex flex-col">
                  <div className="h-12"></div>
                  
                  <div className="mb-6 px-4">
                    <p className="text-xs text-[var(--s3-lavender-400)] mb-1">Your Primary Star System</p>
                    <h2 className="text-2xl bg-gradient-to-r from-[var(--s3-lavender-200)] to-[var(--s3-lavender-400)] bg-clip-text text-transparent">
                      Pleiades
                    </h2>
                  </div>

                  <div className="flex justify-center mb-6">
                    <div className="relative w-48 h-48">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="80" stroke="rgba(167, 139, 250, 0.1)" strokeWidth="16" fill="none" />
                        <circle
                          cx="96" cy="96" r="80"
                          stroke="url(#gradient-result)"
                          strokeWidth="16" fill="none"
                          strokeDasharray={`${2 * Math.PI * 80 * 0.62} ${2 * Math.PI * 80}`}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="gradient-result" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--s3-lavender-500)" />
                            <stop offset="100%" stopColor="var(--s3-lavender-400)" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <p className="text-4xl mb-1 bg-gradient-to-r from-[var(--s3-lavender-200)] to-[var(--s3-lavender-400)] bg-clip-text text-transparent">
                          62%
                        </p>
                        <p className="text-xs text-[var(--s3-text-subtle)]">Alignment</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 px-4">
                    <p className="text-xs text-[var(--s3-text-subtle)] mb-3">Ally Star Systems</p>
                    <div className="flex flex-wrap gap-2">
                      <Chip starSystem="Sirius" percentage={18} variant="gold" />
                      <Chip starSystem="Lyra" percentage={12} variant="gold" />
                      <Chip starSystem="Andromeda" percentage={8} variant="lavender" />
                    </div>
                  </div>

                  <div className="space-y-3 mb-4 px-4">
                    <Button 
                      variant="primary" 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentScreen('whyRedesign');
                      }}
                    >
                      View Why (Redesign) ✨
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentScreen('why');
                      }}
                    >
                      View Why (Old)
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentScreen('paywall');
                      }}
                    >
                      Generate Narrative
                    </Button>
                  </div>

                  <div className="px-4 mb-4">
                    <div className="p-3 bg-[var(--s3-lavender-900)]/10 border border-[var(--s3-border-muted)] rounded-[var(--s3-radius-xl)]">
                      <p className="text-xs text-[var(--s3-text-subtle)] leading-relaxed">
                        For insight & entertainment. Not medical, financial, or legal advice.
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
                  </div>
                </div>
              </div>
            </div>

            {/* Screen 4: Why This Result */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[var(--s3-lavender-300)]">04. Why This Result</p>
                {currentScreen === 'why' && (
                  <div className="px-2 py-1 bg-[var(--s3-lavender-600)]/30 border border-[var(--s3-lavender-400)]/40 rounded text-xs text-[var(--s3-lavender-200)]">
                    Active
                  </div>
                )}
              </div>
              <div 
                className={`w-full aspect-[393/852] bg-gradient-to-b from-[var(--s3-canvas-dark)] via-[var(--s3-surface-subtle)] to-[var(--s3-canvas-dark)] rounded-[3rem] border-4 ${
                  currentScreen === 'why' ? 'border-[var(--s3-lavender-500)]' : 'border-gray-800'
                } p-6 flex flex-col relative overflow-hidden transition-all cursor-pointer hover:border-[var(--s3-lavender-700)]`}
                onClick={() => setCurrentScreen('why')}
              >
                <Starfield />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--s3-lavender-600)]/10 rounded-full blur-3xl"></div>
                
                <div className="relative flex-1 flex flex-col">
                  <AppBar 
                    title="Why Pleiades" 
                    showBack 
                    onBack={() => setCurrentScreen('result')} 
                  />
                  
                  <div className="mb-6 px-4">
                    <p className="text-xs text-[var(--s3-text-subtle)]">Deterministic sort contributors</p>
                  </div>

                  <div className="space-y-3 mb-auto px-4 overflow-y-auto">
                    <Card>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)] flex items-center justify-center flex-shrink-0">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm text-[var(--s3-lavender-200)]">Sacral Authority</p>
                            <p className="text-xs text-[var(--s3-lavender-400)]">+22%</p>
                          </div>
                          <p className="text-xs text-[var(--s3-text-subtle)]">
                            Response-based decision making aligns with Pleiadian themes
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--s3-gold-400)] to-[var(--s3-gold-600)] flex items-center justify-center flex-shrink-0">
                          <Scroll className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm text-[var(--s3-lavender-200)]">Channel 13-33</p>
                            <p className="text-xs text-[var(--s3-gold-400)]">+18%</p>
                          </div>
                          <p className="text-xs text-[var(--s3-text-subtle)]">
                            The Prodigal — reflects Pleiades wisdom archetype
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)] flex items-center justify-center flex-shrink-0">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm text-[var(--s3-lavender-200)]">Profile 1/3</p>
                            <p className="text-xs text-[var(--s3-lavender-400)]">+12%</p>
                          </div>
                          <p className="text-xs text-[var(--s3-text-subtle)]">
                            Investigator/Martyr — learning through experience
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="pt-4 px-4">
                    <p className="text-xs text-center text-[var(--s3-text-subtle)] mb-2">
                      Rules engine total: 62% Pleiades alignment
                    </p>
                  </div>

                  <div className="h-8"></div>
                </div>
              </div>
            </div>

            {/* Screen 4B: Why This Result (REDESIGN) */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[var(--s3-lavender-300)]">04B. Why (Redesign) ✨</p>
                {currentScreen === 'whyRedesign' && (
                  <div className="px-2 py-1 bg-[var(--s3-lavender-600)]/30 border border-[var(--s3-lavender-400)]/40 rounded text-xs text-[var(--s3-lavender-200)]">
                    Active
                  </div>
                )}
              </div>
              <div 
                className={`w-full aspect-[393/852] bg-gradient-to-b from-[var(--s3-canvas-dark)] via-[var(--s3-surface-subtle)] to-[var(--s3-canvas-dark)] rounded-[3rem] border-4 ${
                  currentScreen === 'whyRedesign' ? 'border-[var(--s3-lavender-500)]' : 'border-gray-800'
                } overflow-hidden transition-all cursor-pointer hover:border-[var(--s3-lavender-700)]`}
                onClick={() => setCurrentScreen('whyRedesign')}
              >
                {currentScreen === 'whyRedesign' ? (
                  <div className="w-full h-full overflow-y-auto">
                    <WhyScreenRedesign />
                  </div>
                ) : (
                  <div className="w-full h-full p-6 flex items-center justify-center">
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 text-[var(--s3-lavender-400)] mx-auto mb-3" />
                      <p className="text-sm text-[var(--s3-lavender-200)] mb-1">Redesigned Why Screen</p>
                      <p className="text-xs text-[var(--s3-text-subtle)]">Click to preview</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Screen 5: Community */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[var(--s3-lavender-300)]">05. Community Star System</p>
                {currentScreen === 'community' && (
                  <div className="px-2 py-1 bg-[var(--s3-lavender-600)]/30 border border-[var(--s3-lavender-400)]/40 rounded text-xs text-[var(--s3-lavender-200)]">
                    Active
                  </div>
                )}
              </div>
              <div 
                className={`w-full aspect-[393/852] bg-gradient-to-b from-[var(--s3-canvas-dark)] via-[var(--s3-surface-subtle)] to-[var(--s3-canvas-dark)] rounded-[3rem] border-4 ${
                  currentScreen === 'community' ? 'border-[var(--s3-lavender-500)]' : 'border-gray-800'
                } p-6 flex flex-col relative overflow-hidden transition-all cursor-pointer hover:border-[var(--s3-lavender-700)]`}
                onClick={() => {
                  setCurrentScreen('community');
                  setActiveTab('community');
                }}
              >
                <Starfield />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--s3-lavender-600)]/10 rounded-full blur-3xl"></div>
                
                <div className="relative flex-1 flex flex-col">
                  <div className="h-12"></div>
                  
                  <div className="mb-6 px-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)] flex items-center justify-center" style={{ boxShadow: 'var(--s3-elevation-2)' }}>
                        <Star className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl text-[var(--s3-lavender-200)]">Pleiades</h2>
                        <p className="text-xs text-[var(--s3-text-subtle)]">Star System Community</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="px-4 py-2 min-h-[44px] bg-gradient-to-r from-[var(--s3-lavender-500)] to-[var(--s3-lavender-400)] rounded-[var(--s3-radius-full)] text-sm">
                        Feed
                      </button>
                      <button className="px-4 py-2 min-h-[44px] bg-white/5 border border-[var(--s3-lavender-400)]/20 rounded-[var(--s3-radius-full)] text-sm text-[var(--s3-text-muted)]">
                        Quests
                      </button>
                      <button className="px-4 py-2 min-h-[44px] bg-white/5 border border-[var(--s3-lavender-400)]/20 rounded-[var(--s3-radius-full)] text-sm text-[var(--s3-text-muted)]">
                        Members
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-auto px-4 overflow-y-auto">
                    <Card>
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)]"></div>
                        <div className="flex-1">
                          <p className="text-sm text-[var(--s3-lavender-200)] mb-1">Sarah M.</p>
                          <p className="text-xs text-[var(--s3-text-subtle)]">2 hours ago</p>
                        </div>
                      </div>
                      <p className="text-sm text-[var(--s3-text-secondary)] mb-2">
                        Just discovered my Pleiadian alignment! The wisdom theme really resonates with my life path.
                      </p>
                      <div className="flex gap-4 text-xs text-[var(--s3-text-subtle)]">
                        <button className="hover:text-[var(--s3-lavender-300)]">Like</button>
                        <button className="hover:text-[var(--s3-lavender-300)]">Reply</button>
                      </div>
                    </Card>

                    <Card>
                      <div className="flex items-center gap-3">
                        <Award className="w-8 h-8 text-[var(--s3-gold-400)]" />
                        <div>
                          <p className="text-sm text-[var(--s3-lavender-200)]">New Quest Available</p>
                          <p className="text-xs text-[var(--s3-text-subtle)]">Explore Pleiadian wisdom teachings</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="mt-auto">
                    <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
                  </div>
                </div>
              </div>
            </div>

            {/* Screen 6: Profile & Avatar */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[var(--s3-lavender-300)]">06. Profile & Avatar</p>
                {currentScreen === 'profile' && (
                  <div className="px-2 py-1 bg-[var(--s3-lavender-600)]/30 border border-[var(--s3-lavender-400)]/40 rounded text-xs text-[var(--s3-lavender-200)]">
                    Active
                  </div>
                )}
              </div>
              <div 
                className={`w-full aspect-[393/852] bg-gradient-to-b from-[var(--s3-canvas-dark)] via-[var(--s3-surface-subtle)] to-[var(--s3-canvas-dark)] rounded-[3rem] border-4 ${
                  currentScreen === 'profile' ? 'border-[var(--s3-lavender-500)]' : 'border-gray-800'
                } p-6 flex flex-col relative overflow-hidden transition-all cursor-pointer hover:border-[var(--s3-lavender-700)]`}
                onClick={() => {
                  setCurrentScreen('profile');
                  setActiveTab('profile');
                }}
              >
                <Starfield />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--s3-lavender-600)]/10 rounded-full blur-3xl"></div>
                
                <div className="relative flex-1 flex flex-col">
                  <div className="h-12 flex justify-end px-4">
                    <button 
                      className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentScreen('settings');
                      }}
                    >
                      <Settings className="w-5 h-5 text-[var(--s3-lavender-300)]" />
                    </button>
                  </div>
                  
                  <div className="mb-8 px-4 text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)] flex items-center justify-center" style={{ boxShadow: 'var(--s3-elevation-2)' }}>
                      <p className="text-3xl">✨</p>
                    </div>
                    <h2 className="text-xl text-[var(--s3-lavender-200)] mb-1">Your Profile</h2>
                    <p className="text-xs text-[var(--s3-text-subtle)]">Manifesting Generator • 1/3</p>
                  </div>

                  <div className="space-y-4 mb-auto px-4">
                    <Card>
                      <p className="text-sm text-[var(--s3-lavender-200)] mb-3">Star System Profile</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[var(--s3-text-muted)]">Primary</span>
                          <Chip starSystem="Pleiades" percentage={62} variant="lavender" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[var(--s3-text-muted)]">Allies</span>
                          <div className="flex gap-1">
                            <Chip starSystem="Sirius" percentage={18} variant="gold" />
                          </div>
                        </div>
                      </div>
                    </Card>

                    <div className="pt-4">
                      <Button variant="primary" className="w-full">
                        Generate Avatar
                      </Button>
                      <p className="text-xs text-center text-[var(--s3-text-subtle)] mt-3">
                        Create a visual representation of your star system alignment
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
                  </div>
                </div>
              </div>
            </div>

            {/* Screen 7: Subscription Paywall */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[var(--s3-lavender-300)]">07. Subscription Paywall</p>
                {currentScreen === 'paywall' && (
                  <div className="px-2 py-1 bg-[var(--s3-lavender-600)]/30 border border-[var(--s3-lavender-400)]/40 rounded text-xs text-[var(--s3-lavender-200)]">
                    Active
                  </div>
                )}
              </div>
              <div 
                className={`w-full aspect-[393/852] bg-gradient-to-b from-[var(--s3-canvas-dark)] via-[var(--s3-surface-subtle)] to-[var(--s3-canvas-dark)] rounded-[3rem] border-4 ${
                  currentScreen === 'paywall' ? 'border-[var(--s3-lavender-500)]' : 'border-gray-800'
                } p-6 flex flex-col relative overflow-hidden transition-all cursor-pointer hover:border-[var(--s3-lavender-700)]`}
                onClick={() => setCurrentScreen('paywall')}
              >
                <Starfield />
                <PaywallScreen 
                  onClose={() => setCurrentScreen('result')}
                  onSubscribe={() => {
                    setShowToast(true);
                    setTimeout(() => setCurrentScreen('result'), 500);
                  }}
                />
              </div>
            </div>

            {/* Screen 8: Settings & Privacy */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[var(--s3-lavender-300)]">08. Settings & Privacy</p>
                {currentScreen === 'settings' && (
                  <div className="px-2 py-1 bg-[var(--s3-lavender-600)]/30 border border-[var(--s3-lavender-400)]/40 rounded text-xs text-[var(--s3-lavender-200)]">
                    Active
                  </div>
                )}
              </div>
              <div 
                className={`w-full aspect-[393/852] bg-gradient-to-b from-[var(--s3-canvas-dark)] via-[var(--s3-surface-subtle)] to-[var(--s3-canvas-dark)] rounded-[3rem] border-4 ${
                  currentScreen === 'settings' ? 'border-[var(--s3-lavender-500)]' : 'border-gray-800'
                } p-6 flex flex-col relative overflow-hidden transition-all cursor-pointer hover:border-[var(--s3-lavender-700)]`}
                onClick={() => setCurrentScreen('settings')}
              >
                <Starfield />
                <SettingsScreen onBack={() => setCurrentScreen('profile')} />
              </div>
            </div>

            {/* Screen 9: Empty States & Errors */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[var(--s3-lavender-300)]">09. Empty States & Errors</p>
                {currentScreen === 'emptyStates' && (
                  <div className="px-2 py-1 bg-[var(--s3-lavender-600)]/30 border border-[var(--s3-lavender-400)]/40 rounded text-xs text-[var(--s3-lavender-200)]">
                    Active
                  </div>
                )}
              </div>
              <div 
                className={`w-full aspect-[393/852] bg-gradient-to-b from-[var(--s3-canvas-dark)] via-[var(--s3-surface-subtle)] to-[var(--s3-canvas-dark)] rounded-[3rem] border-4 ${
                  currentScreen === 'emptyStates' ? 'border-[var(--s3-lavender-500)]' : 'border-gray-800'
                } p-6 flex flex-col relative overflow-hidden transition-all cursor-pointer hover:border-[var(--s3-lavender-700)]`}
                onClick={() => setCurrentScreen('emptyStates')}
              >
                <Starfield />
                <EmptyStatesScreen onBack={() => setCurrentScreen('result')} />
              </div>
            </div>

          </div>
        </section>

        {/* Implementation Checklist */}
        <section className="mt-16 mb-8">
          <h2 className="text-2xl mb-6 text-[var(--s3-lavender-300)]">Implementation Checklist</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card variant="emphasis">
              <h3 className="text-lg mb-4 text-[var(--s3-lavender-200)]">✅ Completed</h3>
              <ul className="space-y-2 text-sm text-[var(--s3-text-secondary)]">
                <li>✓ Design tokens converted to CSS variables (colors, spacing, elevation, focus rings)</li>
                <li>✓ Typography contrast meets WCAG AA (≥4.5:1)</li>
                <li>✓ Button variants: Primary/Secondary/Ghost/Destructive × sm/md/lg × states + leadingIcon</li>
                <li>✓ Chip variants: selectable + filter states + dismissible</li>
                <li>✓ Field variants: default/focus/error states + helper text slot</li>
                <li>✓ Card variants: Default/Emphasis/Warning</li>
                <li>✓ Toast & InlineAlert: success/info/warning/error</li>
                <li>✓ AppBar + TabBar components with Auto Layout</li>
                <li>✓ All touch targets ≥44px (WCAG 2.1 AA)</li>
                <li>✓ Hover, press, focus states on interactive elements</li>
              </ul>
            </Card>

            <Card variant="emphasis">
              <h3 className="text-lg mb-4 text-[var(--s3-lavender-200)]">✅ Core Flows (1-9)</h3>
              <ul className="space-y-2 text-sm text-[var(--s3-text-secondary)]">
                <li>✓ 00_Login (Google OAuth + Email/Password)</li>
                <li>✓ 01_Onboarding (Begin Sorting CTA)</li>
                <li>✓ 02_Input_BirthData (tabs: Birth Data | Upload PDF)</li>
                <li>✓ 03_Sort_Result (radial % + disclaimer + TabBar)</li>
                <li>✓ 04_Why_This_Result (deterministic contributors list)</li>
                <li>✓ 05_Community_StarSystem (Feed/Quests/Members tabs)</li>
                <li>✓ 06_Profile & Avatar (Generate Avatar CTA)</li>
                <li>✓ 07_Subscription_Paywall (Join Community)</li>
                <li>✓ 08_Settings_Privacy (data policy + privacy notice)</li>
                <li>✓ 09_EmptyStates & Errors (inline alerts + empty states)</li>
              </ul>
            </Card>

            <Card variant="emphasis">
              <h3 className="text-lg mb-4 text-[var(--s3-lavender-200)]">✅ Prototypes Wired</h3>
              <ul className="space-y-2 text-sm text-[var(--s3-text-secondary)]">
                <li>✓ Core: Login → Onboarding → Input → Result → Why</li>
                <li>✓ Core: Result → Paywall (Generate Narrative)</li>
                <li>✓ Core: TabBar navigation: Home ↔ Community ↔ Profile</li>
                <li>✓ Core: Profile → Settings via gear icon</li>
              </ul>
            </Card>

            <Card variant="emphasis">
              <h3 className="text-lg mb-4 text-[var(--s3-lavender-200)]">✅ Exports Ready</h3>
              <ul className="space-y-2 text-sm text-[var(--s3-text-secondary)]">
                <li>✓ Star system crests: Orion, Sirius, Pleiades, Andromeda, Lyra, Arcturus (SVG)</li>
                <li>✓ All icon export sizes: 24px, 28px, 48px</li>
                <li>✓ design-tokens.json (core system tokens)</li>
                <li>✓ Components use slash naming</li>
                <li>✓ Auto Layout applied to all components</li>
              </ul>
            </Card>
          </div>

          <Card variant="warning" className="mt-6">
            <h3 className="text-lg mb-3 text-[var(--s3-gold-300)]">⚠️ Notes & Recommendations</h3>
            <ul className="space-y-2 text-sm text-[var(--s3-text-secondary)]">
              <li>• All components use CSS variables from /styles/globals.css for easy theming</li>
              <li>• Focus rings meet accessibility standards (3px at 40% opacity)</li>
              <li>• LLM usage clearly indicated: ONLY for narrative generation (not sorting logic)</li>
              <li>• Disclaimers on Result screens</li>
              <li>• Star system terminology enforced everywhere (never "house")</li>
            </ul>
          </Card>
        </section>

        {/* Footer */}
        <div className="text-center py-8 border-t border-[var(--s3-border-subtle)]">
          <p className="text-sm text-[var(--s3-text-subtle)] mb-2">
            Star System Sorter (S³) • Design System v1.0
          </p>
          <p className="text-xs text-[var(--s3-text-subtle)]">
            Rapid concept exploration • Not production-ready • For insight & entertainment only
          </p>
        </div>
      </div>
    </div>
  );
}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[var(--s3-lavender-300)]">13. Lobby Matchmaking</p>
                {currentScreen === 'lobby' && (
                  <div className="px-2 py-1 bg-[var(--s3-lavender-600)]/30 border border-[var(--s3-lavender-400)]/40 rounded text-xs text-[var(--s3-lavender-200)]">
                    Active
                  </div>
                )}
              </div>
              <div 
                className={`w-full aspect-[393/852] bg-gradient-to-b from-[var(--s3-canvas-dark)] via-[var(--s3-surface-subtle)] to-[var(--s3-canvas-dark)] rounded-[3rem] border-4 ${
                  currentScreen === 'lobby' ? 'border-[var(--s3-lavender-500)]' : 'border-gray-800'
                } p-6 flex flex-col relative overflow-hidden transition-all cursor-pointer hover:border-[var(--s3-lavender-700)]`}
                onClick={() => setCurrentScreen('lobby')}
              >
                <Starfield />
                <div className="relative flex-1 flex flex-col">
                  <AppBar title="Lobby" showBack onBack={() => setCurrentScreen('modeSelect')} />
                  
                  <div className="mb-6 px-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[var(--s3-lavender-200)]">Survivor Arena</p>
                        <p className="text-xs text-[var(--s3-text-subtle)]">Waiting for players...</p>
                      </div>
                      <div className="px-3 py-1 bg-[var(--s3-lavender-500)]/20 border border-[var(--s3-lavender-400)]/30 rounded-full">
                        <p className="text-xs text-[var(--s3-lavender-300)]">3/30</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 px-4">
                    <p className="text-xs text-[var(--s3-text-subtle)] mb-3">Your Party</p>
                    <div className="space-y-2">
                      <PartyMember name="You" team={selectedTeam} ready isYou />
                      <PartyMember name="StarGazer42" team="Sirius" ready />
                      <PartyMember name="CosmicDreamer" team="Lyra" ready={false} />
                    </div>
                  </div>

                  <div className="space-y-3 mt-auto px-4">
                    <Button 
                      variant="primary" 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentScreen(selectedMode === 'survivor' ? 'hudSurvivor' : 'hudRunner');
                      }}
                    >
                      Start Matchmaking
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentScreen(selectedMode === 'survivor' ? 'hudSurvivor' : 'hudRunner');
                      }}
                    >
                      Start Solo
                    </Button>
                  </div>

                  <div className="h-8" />
                </div>
              </div>
            </div>

                  <div className="h-8" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Checklist */}
        <section className="mt-16 mb-8">
          <h2 className="text-2xl mb-6 text-[var(--s3-lavender-300)]">Implementation Checklist</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card variant="emphasis">
              <h3 className="text-lg mb-4 text-[var(--s3-lavender-200)]">✅ Completed</h3>
              <ul className="space-y-2 text-sm text-[var(--s3-text-secondary)]">
                <li>✓ Design tokens converted to CSS variables (colors, spacing, elevation, focus rings)</li>
                <li>✓ Typography contrast meets WCAG AA (≥4.5:1)</li>
                <li>✓ Button variants: Primary/Secondary/Ghost/Destructive × sm/md/lg × states + leadingIcon</li>
                <li>✓ Chip variants: selectable + filter states + dismissible</li>
                <li>✓ Field variants: default/focus/error states + helper text slot</li>
                <li>✓ Card variants: Default/Emphasis/Warning</li>
                <li>✓ Toast & InlineAlert: success/info/warning/error</li>
                <li>✓ AppBar + TabBar components with Auto Layout</li>
                <li>✓ All touch targets ≥44px (WCAG 2.1 AA)</li>
                <li>✓ Hover, press, focus states on interactive elements</li>
              </ul>
            </Card>

            <Card variant="emphasis">
              <h3 className="text-lg mb-4 text-[var(--s3-lavender-200)]">✅ Core Flows (1-9)</h3>
              <ul className="space-y-2 text-sm text-[var(--s3-text-secondary)]">
                <li>✓ 01_Onboarding (Begin Sorting CTA)</li>
                <li>✓ 02_Input_BirthData (tabs: Birth Data | Upload PDF)</li>
                <li>✓ 03_Sort_Result (radial % + disclaimer + TabBar)</li>
                <li>✓ 04_Why_This_Result (deterministic contributors list)</li>
                <li>✓ 05_Community_StarSystem (Feed/Quests/Members tabs)</li>
                <li>✓ 06_Profile & Avatar (Generate Avatar CTA)</li>
                <li>✓ 07_Subscription_Paywall (Join Community)</li>
                <li>✓ 08_Settings_Privacy (data policy + privacy notice)</li>
                <li>✓ 09_EmptyStates & Errors (inline alerts + empty states)</li>
              </ul>
            </Card>

            <Card variant="emphasis">
              <h3 className="text-lg mb-4 text-[var(--s3-gold-300)]">✨ Game Layer (10-19)</h3>
              <ul className="space-y-2 text-sm text-[var(--s3-text-secondary)]">
                <li>✓ 10_Game_Hub (Enter CTA + team status + disclaimers)</li>
                <li>✓ 11_Team_Select (6 star system chips with crests)</li>
                <li>✓ 12_Mode_Select (Survivor Arena | Side Runner cards)</li>
                <li>✓ 13_Lobby_Matchmaking (party list, ready states, Start Solo/Matchmaking)</li>
                <li>✓ 14_HUD_Survivor (joystick, A/B buttons, HP, XP, timer, counters, pause)</li>
                <li>✓ 15_HUD_Runner (jump/slide buttons, distance, timer, counters, pause)</li>
                <li>✓ 16_Match_Result (scoreboard, XP gained, team points, rematch/exit)</li>
                <li>✓ 17_Leaderboard_Season (tabs: Global | My Team | Friends)</li>
                <li>✓ 18_Music_Theme (auto by star system + manual override + preview)</li>
                <li>✓ 19_Quests_Pass (daily/weekly quests, season pass placeholder)</li>
              </ul>
            </Card>

            <Card variant="emphasis">
              <h3 className="text-lg mb-4 text-[var(--s3-lavender-200)]">✅ Prototypes Wired</h3>
              <ul className="space-y-2 text-sm text-[var(--s3-text-secondary)]">
                <li>✓ Core: Onboarding → Input → Result → Why</li>
                <li>✓ Core: Result → Paywall (Generate Narrative)</li>
                <li>✓ Core: TabBar navigation: Home ↔ Community ↔ Profile</li>
                <li>✓ Core: Profile → Settings via gear icon</li>
                <li>✓ Game: Hub → Team Select → Mode Select → Lobby → (Start) → HUD</li>
                <li>✓ Game: HUD Survivor/Runner → Pause → Exit → Match Result → Hub</li>
                <li>✓ Game: Hub → Leaderboard | Music Theme (modal) | Quests</li>
                <li>✓ Interactive modals: Pause, Music Theme with preview</li>
              </ul>
            </Card>

            <Card variant="emphasis">
              <h3 className="text-lg mb-4 text-[var(--s3-lavender-200)]">✅ Exports Ready</h3>
              <ul className="space-y-2 text-sm text-[var(--s3-text-secondary)]">
                <li>✓ Star system crests: Orion, Sirius, Pleiades, Andromeda, Lyra, Arcturus (SVG)</li>
                <li>✓ HUD icons: joystick, buttons (A/B/Jump/Slide), heart, coins, stars (SVG)</li>
                <li>✓ All icon export sizes: 24px, 28px, 48px</li>
                <li>✓ design-tokens.json (core system tokens)</li>
                <li>✓ game-tokens.json (HUD controls 44/56/72, bar heights, opacity, team colors)</li>
                <li>✓ Components use slash naming (HUD/Joystick, Card/GameMode, Modal/Pause)</li>
                <li>✓ Auto Layout applied to all components</li>
              </ul>
            </Card>
          </div>

          <Card variant="warning" className="mt-6">
            <h3 className="text-lg mb-3 text-[var(--s3-gold-300)]">⚠️ Notes & Recommendations</h3>
            <ul className="space-y-2 text-sm text-[var(--s3-text-secondary)]">
              <li>• All components use CSS variables from /styles/globals.css for easy theming</li>
              <li>• Focus rings meet accessibility standards (3px at 40% opacity)</li>
              <li>• LLM usage clearly indicated: ONLY for narrative generation (not sorting logic)</li>
              <li>• Disclaimers on Result, Game Hub, and Match Result screens</li>
              <li>• Star system terminology enforced everywhere (never "house")</li>
              <li>• Music: "Auto-selects theme for your star system. You can change it anytime."</li>
              <li>• Game layer: Visual mockups only (no actual game code)</li>
              <li>• HUD opacity: 0.9 for elements, 0.4 for backgrounds (from game-tokens.json)</li>
              <li>• Team colors per star system defined in game-tokens.json</li>
              <li>• All game controls meet 44px minimum (joystick 72px, action buttons 56px)</li>
            </ul>
          </Card>
        </section>

        {/* Footer */}
        <div className="text-center py-8 border-t border-[var(--s3-border-subtle)]">
          <p className="text-sm text-[var(--s3-text-subtle)] mb-2">
            Star System Sorter (S³) • Design System v1.0
          </p>
          <p className="text-xs text-[var(--s3-text-subtle)]">
            Rapid concept exploration • Not production-ready • For insight & entertainment only
          </p>
        </div>
      </div>
    </div>
  );
}
