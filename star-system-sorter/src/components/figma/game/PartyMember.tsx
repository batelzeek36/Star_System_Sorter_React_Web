import { Check } from 'lucide-react';
import { TeamBadge } from './GameBadges';

interface PartyMemberProps {
  name: string;
  team: 'Orion' | 'Osirian' | 'Sirius' | 'Pleiades' | 'Andromeda' | 'Lyra' | 'Arcturus';
  ready: boolean;
  isYou?: boolean;
}

export function PartyMember({ name, team, ready, isYou = false }: PartyMemberProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
      <div className="flex items-center gap-3">
        <TeamBadge team={team} size="sm" />
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-[var(--s3-lavender-200)]">{name}</p>
            {isYou && (
              <span className="px-2 py-0.5 bg-[var(--s3-lavender-500)]/20 border border-[var(--s3-lavender-400)]/30 rounded text-[10px] text-[var(--s3-lavender-300)]">
                You
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--s3-text-subtle)]">{team} Star System</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {ready ? (
          <div className="flex items-center gap-1 px-2 py-1 bg-[var(--s3-success)]/20 border border-[var(--s3-success)]/40 rounded-full">
            <Check className="w-3 h-3 text-[var(--s3-success)]" />
            <span className="text-xs text-[var(--s3-success)]">Ready</span>
          </div>
        ) : (
          <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-full">
            <span className="text-xs text-white/50">Not Ready</span>
          </div>
        )}
      </div>
    </div>
  );
}
