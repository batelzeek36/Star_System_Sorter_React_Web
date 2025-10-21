import { useState } from 'react';
import DossierScreenOld from './DossierScreenOld';
import DossierScreenNew from './DossierScreenNew';
import DossierScreenHybrid from './DossierScreenHybrid';
import { Button } from '@/components/figma/Button';
import { RefreshCw } from 'lucide-react';

/**
 * DossierScreen Wrapper - Toggle between three designs
 * 
 * This wrapper allows live comparison between:
 * - Old: Original design
 * - New: Redesigned version
 * - Hybrid: Best of both (user's preferences)
 */
export default function DossierScreen() {
  const [version, setVersion] = useState<'old' | 'new' | 'hybrid'>('hybrid');

  const cycleVersion = () => {
    setVersion(prev => {
      if (prev === 'hybrid') return 'old';
      if (prev === 'old') return 'new';
      return 'hybrid';
    });
  };

  const versionConfig = {
    hybrid: {
      label: '🎯 Hybrid (Best of Both)',
      gradient: 'linear-gradient(to right, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))',
      borderColor: 'rgba(236, 72, 153, 0.3)',
      color: 'rgb(244, 114, 182)'
    },
    old: {
      label: '📋 Original Design',
      gradient: 'linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(96, 165, 250, 0.2))',
      borderColor: 'rgba(96, 165, 250, 0.3)',
      color: 'rgb(147, 197, 253)'
    },
    new: {
      label: '✨ New Design',
      gradient: 'linear-gradient(to right, rgba(139, 92, 246, 0.2), rgba(167, 139, 250, 0.2))',
      borderColor: 'rgba(167, 139, 250, 0.3)',
      color: 'rgb(196, 181, 253)'
    }
  };

  const currentConfig = versionConfig[version];

  return (
    <div className="relative">
      {/* Version Toggle Button - Fixed position */}
      <div className="fixed top-4 right-4 z-50 print:hidden">
        <Button
          variant="secondary"
          size="sm"
          onClick={cycleVersion}
          className="shadow-lg backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Cycle Version
        </Button>
      </div>

      {/* Version Indicator Badge */}
      <div className="fixed top-4 left-4 z-50 print:hidden">
        <div className="px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm border shadow-lg"
             style={{
               background: currentConfig.gradient,
               borderColor: currentConfig.borderColor,
               color: currentConfig.color
             }}>
          {currentConfig.label}
        </div>
      </div>

      {/* Render selected version */}
      {version === 'hybrid' && <DossierScreenHybrid />}
      {version === 'old' && <DossierScreenOld />}
      {version === 'new' && <DossierScreenNew />}
    </div>
  );
}
