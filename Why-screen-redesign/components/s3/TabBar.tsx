import { Home, Users, UserCircle } from 'lucide-react';

type Tab = 'home' | 'community' | 'profile';

interface TabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="h-20 bg-gradient-to-t from-[#0a0612] via-[#0f0820] to-transparent border-t border-purple-900/30 px-8">
      <div className="flex items-center justify-around h-full">
        <button
          onClick={() => onTabChange('home')}
          className="flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] justify-center"
        >
          <Home className={`w-6 h-6 ${activeTab === 'home' ? 'text-purple-300' : 'text-gray-500'}`} />
          <span className={`text-xs ${activeTab === 'home' ? 'text-purple-300' : 'text-gray-500'}`}>
            Home
          </span>
        </button>
        
        <button
          onClick={() => onTabChange('community')}
          className="flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] justify-center"
        >
          <Users className={`w-6 h-6 ${activeTab === 'community' ? 'text-purple-300' : 'text-gray-500'}`} />
          <span className={`text-xs ${activeTab === 'community' ? 'text-purple-300' : 'text-gray-500'}`}>
            Community
          </span>
        </button>
        
        <button
          onClick={() => onTabChange('profile')}
          className="flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] justify-center"
        >
          <UserCircle className={`w-6 h-6 ${activeTab === 'profile' ? 'text-purple-300' : 'text-gray-500'}`} />
          <span className={`text-xs ${activeTab === 'profile' ? 'text-purple-300' : 'text-gray-500'}`}>
            Profile
          </span>
        </button>
      </div>
    </div>
  );
}
