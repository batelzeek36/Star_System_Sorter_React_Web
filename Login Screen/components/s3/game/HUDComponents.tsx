import { Heart, Pause, Trophy, Coins, Star as StarIcon } from 'lucide-react';

// HUD Joystick (Virtual Stick)
interface JoystickProps {
  handed?: 'left' | 'right';
  className?: string;
}

export function Joystick({ handed = 'left', className = '' }: JoystickProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="w-[72px] h-[72px] rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)] shadow-lg" />
      </div>
      <div className="absolute -top-1 -right-1 text-[10px] text-white/50">{handed === 'left' ? 'L' : 'R'}</div>
    </div>
  );
}

// HUD Action Buttons
interface HUDButtonProps {
  type: 'A' | 'B' | 'Jump' | 'Slide';
  state?: 'default' | 'pressed';
  className?: string;
}

export function HUDButton({ type, state = 'default', className = '' }: HUDButtonProps) {
  const isPressed = state === 'pressed';
  
  const styles = {
    A: 'from-[var(--s3-lavender-500)] to-[var(--s3-lavender-600)]',
    B: 'from-[var(--s3-gold-400)] to-[var(--s3-gold-600)]',
    Jump: 'from-[var(--s3-lavender-500)] to-[var(--s3-lavender-600)]',
    Slide: 'from-[var(--s3-gold-400)] to-[var(--s3-gold-600)]'
  };

  return (
    <div 
      className={`w-[56px] h-[56px] rounded-full bg-gradient-to-br ${styles[type]} flex items-center justify-center shadow-lg border-2 border-white/20 transition-transform ${
        isPressed ? 'scale-90' : 'scale-100'
      } ${className}`}
    >
      <span className="text-white font-bold">{type}</span>
    </div>
  );
}

// HP Hearts Bar
interface HPHeartsProps {
  current: number;
  max: number;
  className?: string;
}

export function HPHearts({ current, max, className = '' }: HPHeartsProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[...Array(max)].map((_, i) => (
        <Heart
          key={i}
          className={`w-5 h-5 ${
            i < current 
              ? 'fill-[var(--s3-error)] text-[var(--s3-error)]' 
              : 'fill-white/10 text-white/20'
          }`}
        />
      ))}
    </div>
  );
}

// XP Progress Bar
interface XPBarProps {
  current: number;
  max: number;
  level?: number;
  className?: string;
}

export function XPBar({ current, max, level, className = '' }: XPBarProps) {
  const percentage = (current / max) * 100;
  
  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-white/70">XP</span>
        {level && <span className="text-[10px] text-[var(--s3-lavender-300)]">LV {level}</span>}
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
        <div 
          className="h-full bg-gradient-to-r from-[var(--s3-lavender-500)] to-[var(--s3-lavender-400)] transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Distance Meter (for runner)
interface DistanceMeterProps {
  distance: number;
  unit?: 'm' | 'km';
  className?: string;
}

export function DistanceMeter({ distance, unit = 'm', className = '' }: DistanceMeterProps) {
  return (
    <div className={`flex items-baseline gap-1 ${className}`}>
      <span className="text-2xl font-bold bg-gradient-to-r from-[var(--s3-lavender-200)] to-[var(--s3-lavender-400)] bg-clip-text text-transparent">
        {distance}
      </span>
      <span className="text-xs text-white/50">{unit}</span>
    </div>
  );
}

// Timer
interface TimerProps {
  seconds: number;
  className?: string;
}

export function Timer({ seconds, className = '' }: TimerProps) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  return (
    <div className={`flex items-center gap-1 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full border border-white/10 ${className}`}>
      <div className="w-1.5 h-1.5 bg-[var(--s3-error)] rounded-full animate-pulse" />
      <span className="text-sm tabular-nums text-white">
        {minutes.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
      </span>
    </div>
  );
}

// Counter (Kills/Coins/Stars)
interface CounterProps {
  type: 'kills' | 'coins' | 'stars';
  value: number;
  className?: string;
}

export function Counter({ type, value, className = '' }: CounterProps) {
  const icons = {
    kills: <Trophy className="w-4 h-4" />,
    coins: <Coins className="w-4 h-4" />,
    stars: <StarIcon className="w-4 h-4" />
  };

  const colors = {
    kills: 'text-[var(--s3-error)]',
    coins: 'text-[var(--s3-gold-400)]',
    stars: 'text-[var(--s3-lavender-400)]'
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full border border-white/10 ${className}`}>
      <div className={colors[type]}>{icons[type]}</div>
      <span className="text-sm tabular-nums text-white">{value}</span>
    </div>
  );
}

// Pause Button
interface PauseButtonProps {
  onClick?: () => void;
  className?: string;
}

export function PauseButton({ onClick, className = '' }: PauseButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-11 h-11 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/80 transition-colors ${className}`}
    >
      <Pause className="w-5 h-5 text-white" />
    </button>
  );
}
