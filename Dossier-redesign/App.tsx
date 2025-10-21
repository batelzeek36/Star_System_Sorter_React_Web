import { useState } from 'react';
import { Sparkles, Settings as SettingsIcon, HelpCircle, FileText } from 'lucide-react';
import { Button } from './components/s3/Button';
import { PaywallScreen } from './components/s3/screens/PaywallScreen';
import { SettingsScreen } from './components/s3/screens/SettingsScreen';
import { EmptyStatesScreen } from './components/s3/screens/EmptyStatesScreen';
import WhyScreenRedesign from './components/s3/screens/WhyScreenRedesign';
import DossierScreen from './components/s3/screens/DossierScreen';

type Screen = 'why' | 'paywall' | 'settings' | 'empty' | 'dossier';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('why');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'why':
        return <WhyScreenRedesign />;
      case 'paywall':
        return <PaywallScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'empty':
        return <EmptyStatesScreen />;
      case 'dossier':
        return <DossierScreen />;
      default:
        return <WhyScreenRedesign />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-center gap-2 p-4">
          <Button
            variant={currentScreen === 'why' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setCurrentScreen('why')}
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Why Screen
          </Button>
          <Button
            variant={currentScreen === 'paywall' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setCurrentScreen('paywall')}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Paywall
          </Button>
          <Button
            variant={currentScreen === 'settings' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setCurrentScreen('settings')}
          >
            <SettingsIcon className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button
            variant={currentScreen === 'empty' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setCurrentScreen('empty')}
          >
            Empty States
          </Button>
          <Button
            variant={currentScreen === 'dossier' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setCurrentScreen('dossier')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Dossier
          </Button>
        </div>
      </div>

      {/* Phone Frame */}
      <div className="flex items-center justify-center min-h-screen p-8 pt-24">
        <div className="relative">
          {/* Phone bezel */}
          <div className="bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-8 border-slate-800">
            {/* Screen */}
            <div className="w-[393px] h-[852px] bg-black rounded-[2.5rem] overflow-hidden relative">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-900 rounded-b-3xl z-50" />
              
              {/* Content */}
              <div className="absolute inset-0 overflow-y-auto">
                {renderScreen()}
              </div>
            </div>
          </div>
          
          {/* Phone label */}
          <div className="text-center mt-4">
            <div className="text-white/60 text-sm">
              {currentScreen === 'why' && 'Why Screen - Mobile View'}
              {currentScreen === 'paywall' && 'Paywall Screen - Mobile View'}
              {currentScreen === 'settings' && 'Settings Screen - Mobile View'}
              {currentScreen === 'empty' && 'Empty States - Mobile View'}
              {currentScreen === 'dossier' && 'Dossier Screen - Mobile View'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
