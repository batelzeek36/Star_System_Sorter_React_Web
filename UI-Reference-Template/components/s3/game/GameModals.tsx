import { X, Play, Pause as PauseIcon, RotateCcw, Home, Music } from 'lucide-react';
import { Button } from '../Button';
import { Card } from '../Card';

// Pause Modal
interface PauseModalProps {
  onResume: () => void;
  onExit: () => void;
}

export function PauseModal({ onResume, onExit }: PauseModalProps) {
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-6">
      <Card variant="emphasis" className="w-full max-w-sm p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--s3-lavender-400)] to-[var(--s3-lavender-600)] flex items-center justify-center">
            <PauseIcon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl text-[var(--s3-lavender-200)] mb-2">Game Paused</h3>
          <p className="text-sm text-[var(--s3-text-subtle)]">Take a breath, star traveler</p>
        </div>
        
        <div className="space-y-3">
          <Button variant="primary" className="w-full" onClick={onResume}>
            Resume Match
          </Button>
          <Button variant="secondary" className="w-full" onClick={onExit}>
            Exit to Hub
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Confirm Exit Modal
interface ConfirmExitModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmExitModal({ onConfirm, onCancel }: ConfirmExitModalProps) {
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-6">
      <Card variant="warning" className="w-full max-w-sm p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--s3-error)] to-[var(--s3-error)]/80 flex items-center justify-center">
            <Home className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl text-[var(--s3-lavender-200)] mb-2">Exit Match?</h3>
          <p className="text-sm text-[var(--s3-text-subtle)]">You'll lose all progress in this match</p>
        </div>
        
        <div className="space-y-3">
          <Button variant="destructive" className="w-full" onClick={onConfirm}>
            Exit Match
          </Button>
          <Button variant="secondary" className="w-full" onClick={onCancel}>
            Stay in Match
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Music Theme Modal
interface MusicThemeModalProps {
  currentTeam: string;
  selectedTheme: string;
  onClose: () => void;
  onSelect: (theme: string) => void;
  onPreview: (theme: string) => void;
}

export function MusicThemeModal({ currentTeam, selectedTheme, onClose, onSelect, onPreview }: MusicThemeModalProps) {
  const themes = [
    { name: 'Orion', color: 'from-[var(--s3-lavender-500)] to-[var(--s3-lavender-600)]' },
    { name: 'Sirius', color: 'from-[var(--s3-gold-400)] to-[var(--s3-gold-600)]' },
    { name: 'Pleiades', color: 'from-[#a78bfa] to-[#c4b5fd]' },
    { name: 'Andromeda', color: 'from-[#3b82f6] to-[#60a5fa]' },
    { name: 'Lyra', color: 'from-[#ec4899] to-[#f472b6]' },
    { name: 'Arcturus', color: 'from-[#f59e0b] to-[#fbbf24]' },
  ];

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-6">
      <Card variant="emphasis" className="w-full max-w-sm p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg text-[var(--s3-lavender-200)] mb-1">Music Theme</h3>
            <p className="text-xs text-[var(--s3-text-subtle)]">
              Auto-selects theme for your star system. You can change it anytime.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center flex-shrink-0"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="space-y-2 mb-6">
          {themes.map((theme) => (
            <button
              key={theme.name}
              onClick={() => onSelect(theme.name)}
              className={`w-full p-3 rounded-xl border-2 transition-all ${
                selectedTheme === theme.name
                  ? 'border-[var(--s3-lavender-400)] bg-[var(--s3-lavender-500)]/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${theme.color} flex items-center justify-center`}>
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-[var(--s3-lavender-200)]">{theme.name} Theme</p>
                    {theme.name === currentTeam && (
                      <p className="text-xs text-[var(--s3-lavender-400)]">Your star system</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(theme.name);
                  }}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Play className="w-3 h-3 text-white" />
                </button>
              </div>
            </button>
          ))}
        </div>

        <Button variant="primary" className="w-full" onClick={onClose}>
          Save Theme
        </Button>
      </Card>
    </div>
  );
}
