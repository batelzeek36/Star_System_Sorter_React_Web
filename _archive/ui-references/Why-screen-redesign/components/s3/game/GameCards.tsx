import { Swords, Zap, Award, Lock } from 'lucide-react';
import { Card } from '../Card';

// Game Mode Card
interface GameModeCardProps {
  mode: 'survivor' | 'runner';
  title: string;
  description: string;
  players: string;
  selected?: boolean;
  onClick?: () => void;
}

export function GameModeCard({ mode, title, description, players, selected = false, onClick }: GameModeCardProps) {
  const icons = {
    survivor: <Swords className="w-8 h-8" />,
    runner: <Zap className="w-8 h-8" />
  };

  return (
    <Card
      variant={selected ? 'emphasis' : 'default'}
      className={`p-4 cursor-pointer transition-all hover:scale-[1.02] ${
        selected ? 'border-[var(--s3-lavender-500)] border-2' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${
          mode === 'survivor' 
            ? 'from-[var(--s3-error)]/20 to-[var(--s3-error)]/10' 
            : 'from-[var(--s3-lavender-500)]/20 to-[var(--s3-lavender-400)]/10'
        } flex items-center justify-center flex-shrink-0`}>
          <div className={mode === 'survivor' ? 'text-[var(--s3-error)]' : 'text-[var(--s3-lavender-400)]'}>
            {icons[mode]}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm text-[var(--s3-lavender-200)]">{title}</h3>
            {selected && (
              <div className="w-2 h-2 bg-[var(--s3-lavender-400)] rounded-full" />
            )}
          </div>
          <p className="text-xs text-[var(--s3-text-subtle)] mb-2">{description}</p>
          <p className="text-xs text-[var(--s3-text-muted)]">{players}</p>
        </div>
      </div>
    </Card>
  );
}

// Quest Card
interface QuestCardProps {
  title: string;
  description: string;
  progress: number;
  max: number;
  reward: number;
  type: 'daily' | 'weekly';
  completed?: boolean;
}

export function QuestCard({ title, description, progress, max, reward, type, completed = false }: QuestCardProps) {
  const percentage = (progress / max) * 100;
  
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
          type === 'daily' 
            ? 'from-[var(--s3-lavender-500)]/20 to-[var(--s3-lavender-600)]/10' 
            : 'from-[var(--s3-gold-400)]/20 to-[var(--s3-gold-600)]/10'
        } flex items-center justify-center flex-shrink-0`}>
          {completed ? (
            <Award className={`w-5 h-5 ${type === 'daily' ? 'text-[var(--s3-lavender-400)]' : 'text-[var(--s3-gold-400)]'}`} />
          ) : (
            <Lock className="w-5 h-5 text-white/30" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm text-[var(--s3-lavender-200)]">{title}</h4>
            <div className="flex items-center gap-1">
              <Award className="w-3 h-3 text-[var(--s3-gold-400)]" />
              <span className="text-xs text-[var(--s3-gold-300)]">{reward}</span>
            </div>
          </div>
          <p className="text-xs text-[var(--s3-text-subtle)] mb-2">{description}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/50">{progress}/{max}</span>
              <span className="text-[var(--s3-lavender-300)]">{Math.round(percentage)}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[var(--s3-lavender-500)] to-[var(--s3-lavender-400)] transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
