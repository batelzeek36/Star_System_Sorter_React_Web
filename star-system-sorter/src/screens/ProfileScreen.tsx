import React from 'react';
import { Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBirthDataStore } from '../store/birthDataStore';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/figma/Button';
import { Card } from '../components/figma/Card';
import { Chip } from '../components/figma/Chip';
import { TabBar } from '../components/figma/TabBar';

type Tab = 'home' | 'community' | 'profile';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { hdData, classification } = useBirthDataStore();
  const { user, logout } = useAuthStore();
  const [imageError, setImageError] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleTabChange = (tab: Tab) => {
    if (tab === 'home') navigate('/result');
    else if (tab === 'community') navigate('/community');
    else if (tab === 'profile') navigate('/profile');
  };

  // Get HD type and profile from store
  const hdType = hdData?.type || 'Unknown';
  const profile = hdData?.profile || 'Unknown';

  // Get classification data
  const primarySystem = classification?.classification === 'primary' 
    ? classification.primary 
    : classification?.classification === 'hybrid' && classification.hybrid
    ? classification.hybrid[0]
    : 'Unknown';

  const primaryPercentage = classification?.classification === 'primary' && classification.primary
    ? classification.percentages[classification.primary]
    : classification?.classification === 'hybrid' && classification.hybrid
    ? classification.percentages[classification.hybrid[0]]
    : 0;

  // Get ally systems (top 2 after primary)
  const allySystems = classification?.percentages 
    ? Object.entries(classification.percentages)
        .filter(([system]) => system !== primarySystem)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 2)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0612] via-[#0f0820] to-[#0a0612] text-white flex flex-col relative overflow-hidden">
      {/* Starfield background */}
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

      {/* Gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* Scrollable content with bottom padding for TabBar */}
      <div className="relative max-w-md mx-auto w-full pb-20">
        {/* Header with Settings */}
        <div className="h-12 flex justify-end px-4 pt-4">
          <button 
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
            onClick={() => navigate('/settings')}
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-purple-300" />
          </button>
        </div>
        
        {/* Profile Avatar & Info */}
        <div className="mb-8 px-4 text-center">
          {user?.picture && !imageError ? (
            <img 
              src={user.picture} 
              alt={user.name}
              className="w-24 h-24 mx-auto mb-4 rounded-full shadow-lg shadow-purple-500/20"
              onError={() => setImageError(true)}
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-4xl font-bold text-white">
                {user?.name?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
          )}
          <h2 className="text-xl text-purple-200 mb-1">{user?.name || 'Your Profile'}</h2>
          <p className="text-xs text-gray-400">{hdType} • {profile}</p>
          
          {/* Signed in as */}
          {user && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-500 mb-1">Signed in as</p>
              <p className="text-sm text-purple-300">{user.email}</p>
              {user.isGuest && (
                <p className="text-xs text-gray-400 mt-1">(Guest Account)</p>
              )}
            </div>
          )}
        </div>

        {/* Star System Profile Card */}
        <div className="space-y-4 mb-auto px-4">
          <Card>
            <p className="text-sm text-purple-200 mb-3">Star System Profile</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Primary</span>
                <Chip 
                  starSystem={primarySystem as any} 
                  percentage={Math.round(primaryPercentage)} 
                  variant="lavender" 
                />
              </div>
              {allySystems.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Allies</span>
                  <div className="flex gap-1">
                    {allySystems.map(([system, percentage]) => (
                      <Chip 
                        key={system}
                        starSystem={system as any} 
                        percentage={Math.round(percentage)} 
                        variant="gold" 
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Generate Avatar CTA */}
          <div className="pt-4">
            <Button 
              variant="primary" 
              className="w-full"
              onClick={() => {
                // TODO: Implement avatar generation
                console.log('Generate Avatar clicked');
              }}
            >
              Generate Avatar
            </Button>
            <p className="text-xs text-center text-gray-400 mt-3">
              Create a visual representation of your star system alignment
            </p>
          </div>

          {/* Logout Button */}
          <div className="pt-4">
            <Button 
              variant="secondary" 
              className="w-full"
              leadingIcon={<LogOut className="w-4 h-4" />}
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Fixed Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-md mx-auto">
          <TabBar activeTab="profile" onTabChange={handleTabChange} />
        </div>
      </div>
    </div>
  );
}
