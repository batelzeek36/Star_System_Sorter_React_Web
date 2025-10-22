import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TabBar } from '../components/figma/TabBar';
import { Card } from '../components/figma/Card';

type Tab = 'home' | 'community' | 'profile';

export default function CommunityScreen() {
  const navigate = useNavigate();

  const handleTabChange = (tab: Tab) => {
    if (tab === 'home') navigate('/result');
    else if (tab === 'community') navigate('/community');
    else if (tab === 'profile') navigate('/profile');
  };

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

      <div className="relative flex-1 flex flex-col max-w-md mx-auto w-full">
        {/* Header */}
        <div className="px-4 pt-12 pb-6">
          <h1 className="text-2xl text-purple-200 mb-2">Community</h1>
          <p className="text-sm text-gray-400">Connect with your star system</p>
        </div>

        {/* Content */}
        <div className="flex-1 px-4 pb-4">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Users className="w-8 h-8 text-purple-300" />
            </div>
            <h2 className="text-lg text-purple-200 mb-2">Coming Soon</h2>
            <p className="text-sm text-gray-400">
              Community features are currently in development. Check back soon to connect with others from your star system!
            </p>
          </Card>
        </div>

        {/* Tab Bar */}
        <div className="mt-auto">
          <TabBar activeTab="community" onTabChange={handleTabChange} />
        </div>
      </div>
    </div>
  );
}
