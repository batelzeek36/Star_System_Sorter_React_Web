import { AppBar } from '../AppBar';
import { Card } from '../Card';
import { InlineAlert } from '../Toast';
import { ChevronRight, Shield, Bell, Eye, Trash2, LogOut } from 'lucide-react';
import { useState } from 'react';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [showPrivacyAlert, setShowPrivacyAlert] = useState(true);

  const SettingsItem = ({ 
    icon, 
    label, 
    description, 
    onClick,
    variant = 'default' 
  }: { 
    icon: React.ReactNode; 
    label: string; 
    description?: string;
    onClick?: () => void;
    variant?: 'default' | 'destructive';
  }) => (
    <button
      onClick={onClick}
      className={`
        w-full p-4 
        flex items-center gap-3
        rounded-[var(--s3-radius-lg)]
        transition-all
        ${variant === 'destructive' 
          ? 'hover:bg-[var(--s3-error-muted)] active:scale-[0.98]' 
          : 'hover:bg-white/5 active:scale-[0.98]'
        }
      `}
    >
      <div className={`
        w-10 h-10 rounded-full 
        flex items-center justify-center flex-shrink-0
        ${variant === 'destructive'
          ? 'bg-[var(--s3-error-muted)] text-[var(--s3-error)]'
          : 'bg-[var(--s3-lavender-500)]/20 text-[var(--s3-lavender-400)]'
        }
      `}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className={`text-sm ${variant === 'destructive' ? 'text-[var(--s3-error)]' : 'text-white'}`}>
          {label}
        </p>
        {description && (
          <p className="text-xs text-[var(--s3-text-subtle)] mt-0.5">
            {description}
          </p>
        )}
      </div>
      <ChevronRight className={`w-5 h-5 flex-shrink-0 ${variant === 'destructive' ? 'text-[var(--s3-error)]' : 'text-[var(--s3-text-subtle)]'}`} />
    </button>
  );

  return (
    <div className="flex-1 flex flex-col relative">
      {/* Starfield background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
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

      <AppBar title="Settings & Privacy" showBack onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-4 relative">
        {/* Privacy Notice */}
        {showPrivacyAlert && (
          <div className="mb-6">
            <InlineAlert
              type="info"
              message="S³ does not collect PII or sensitive data. All chart data stays on your device unless you opt-in to cloud sync."
              onDismiss={() => setShowPrivacyAlert(false)}
            />
          </div>
        )}

        {/* Privacy Section */}
        <div className="mb-6">
          <p className="text-xs text-[var(--s3-text-subtle)] mb-3 px-1 tracking-wider uppercase">
            Privacy & Security
          </p>
          <Card>
            <SettingsItem
              icon={<Shield className="w-5 h-5" />}
              label="Data & Privacy"
              description="Manage what data is stored and shared"
              onClick={() => console.log('Privacy settings')}
            />
          </Card>
        </div>

        {/* Notifications Section */}
        <div className="mb-6">
          <p className="text-xs text-[var(--s3-text-subtle)] mb-3 px-1 tracking-wider uppercase">
            Notifications
          </p>
          <Card>
            <SettingsItem
              icon={<Bell className="w-5 h-5" />}
              label="Notification Preferences"
              description="Community updates and quest alerts"
              onClick={() => console.log('Notification settings')}
            />
          </Card>
        </div>

        {/* Display Section */}
        <div className="mb-6">
          <p className="text-xs text-[var(--s3-text-subtle)] mb-3 px-1 tracking-wider uppercase">
            Display
          </p>
          <Card>
            <SettingsItem
              icon={<Eye className="w-5 h-5" />}
              label="Display Preferences"
              description="Starfield intensity and animations"
              onClick={() => console.log('Display settings')}
            />
          </Card>
        </div>

        {/* Account Section */}
        <div className="mb-6">
          <p className="text-xs text-[var(--s3-text-subtle)] mb-3 px-1 tracking-wider uppercase">
            Account
          </p>
          <div className="space-y-2">
            <Card>
              <SettingsItem
                icon={<LogOut className="w-5 h-5" />}
                label="Sign Out"
                description="Sign out of your account"
                onClick={() => console.log('Sign out')}
              />
            </Card>
            <Card variant="warning">
              <SettingsItem
                icon={<Trash2 className="w-5 h-5" />}
                label="Delete Account"
                description="Permanently remove all data"
                onClick={() => console.log('Delete account')}
                variant="destructive"
              />
            </Card>
          </div>
        </div>

        {/* Legal */}
        <div className="mb-8">
          <p className="text-xs text-center text-[var(--s3-text-subtle)] mb-2">
            Version 1.0.0
          </p>
          <div className="flex gap-4 justify-center text-xs">
            <button className="text-[var(--s3-lavender-300)] hover:underline">
              Terms of Service
            </button>
            <button className="text-[var(--s3-lavender-300)] hover:underline">
              Privacy Policy
            </button>
          </div>
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}
