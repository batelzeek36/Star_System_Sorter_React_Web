import { OrionCrest, SiriusCrest, PleiadesCrest, AndromedaCrest, LyraCrest, ArcturusCrest } from '../StarSystemCrests';

interface TeamBadgeProps {
  team: 'Orion' | 'Osirian' | 'Sirius' | 'Pleiades' | 'Andromeda' | 'Lyra' | 'Arcturus';
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

export function TeamBadge({ team, size = 'md', showName = false, className = '' }: TeamBadgeProps) {
  const crests = {
    'Orion': OrionCrest,
    'Osirian': OrionCrest,
    'Sirius': SiriusCrest,
    'Pleiades': PleiadesCrest,
    'Andromeda': AndromedaCrest,
    'Lyra': LyraCrest,
    'Arcturus': ArcturusCrest,
  };

  const colors = {
    'Orion': 'from-[var(--s3-lavender-500)] to-[var(--s3-lavender-600)]',
    'Osirian': 'from-[var(--s3-lavender-500)] to-[var(--s3-lavender-600)]',
    'Sirius': 'from-[var(--s3-gold-400)] to-[var(--s3-gold-600)]',
    'Pleiades': 'from-[#a78bfa] to-[#c4b5fd]',
    'Andromeda': 'from-[#3b82f6] to-[#60a5fa]',
    'Lyra': 'from-[#ec4899] to-[#f472b6]',
    'Arcturus': 'from-[#f59e0b] to-[#fbbf24]',
  };

  const textColors = {
    'Orion': 'text-[var(--s3-lavender-300)]',
    'Osirian': 'text-[var(--s3-lavender-300)]',
    'Sirius': 'text-[var(--s3-gold-300)]',
    'Pleiades': 'text-purple-300',
    'Andromeda': 'text-blue-300',
    'Lyra': 'text-pink-300',
    'Arcturus': 'text-amber-300',
  };

  const sizes = {
    sm: { badge: 'w-8 h-8', icon: 24 as const },
    md: { badge: 'w-12 h-12', icon: 28 as const },
    lg: { badge: 'w-16 h-16', icon: 48 as const }
  };

  const Crest = crests[team];

  if (showName) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`${sizes[size].badge} rounded-full bg-gradient-to-br ${colors[team]} flex items-center justify-center shadow-lg`}>
          <Crest size={sizes[size].icon} className="text-white" />
        </div>
        <span className={`text-sm ${textColors[team]}`}>{team}</span>
      </div>
    );
  }

  return (
    <div className={`${sizes[size].badge} rounded-full bg-gradient-to-br ${colors[team]} flex items-center justify-center shadow-lg ${className}`}>
      <Crest size={sizes[size].icon} className="text-white" />
    </div>
  );
}
