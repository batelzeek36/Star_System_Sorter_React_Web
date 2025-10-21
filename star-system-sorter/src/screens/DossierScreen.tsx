import { useState } from 'react';
import DossierScreenOld from './DossierScreenOld';
import DossierScreenNew from './DossierScreenNew';
import { Button } from '@/components/figma/Button';
import { RefreshCw } from 'lucide-react';

/**
 * DossierScreen Wrapper - Toggle between old and new designs
 * 
 * This wrapper allows live comparison between the previous and redesigned versions.
 * Remove this wrapper and rename DossierScreenNew.tsx to DossierScreen.tsx when ready to ship.
 */
export default function DossierScreen() {
  const [useNewDesign, setUseNewDesign] = useState(true);

  return (
    <div className="relative">
      {/* Version Toggle Button - Fixed position */}
      <div className="fixed top-4 right-4 z-50 print:hidden">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setUseNewDesign(!useNewDesign)}
          className="shadow-lg backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {useNewDesign ? 'Switch to Old Design' : 'Switch to New Design'}
        </Button>
      </div>

      {/* Version Indicator Badge */}
      <div className="fixed top-4 left-4 z-50 print:hidden">
        <div className="px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm border shadow-lg"
             style={{
               background: useNewDesign 
                 ? 'linear-gradient(to right, rgba(139, 92, 246, 0.2), rgba(167, 139, 250, 0.2))'
                 : 'linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(96, 165, 250, 0.2))',
               borderColor: useNewDesign ? 'rgba(167, 139, 250, 0.3)' : 'rgba(96, 165, 250, 0.3)',
               color: useNewDesign ? 'rgb(196, 181, 253)' : 'rgb(147, 197, 253)'
             }}>
          {useNewDesign ? '✨ New Design' : '📋 Original Design'}
        </div>
      </div>

      {/* Render selected version */}
      {useNewDesign ? <DossierScreenNew /> : <DossierScreenOld />}
    </div>
  );
}
