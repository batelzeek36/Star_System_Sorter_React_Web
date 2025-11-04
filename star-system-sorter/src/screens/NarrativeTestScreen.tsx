/**
 * Test screen for narrative summary magical effects
 */

import { NarrativeSummary } from '../components/NarrativeSummary';
import type { ClassificationResult } from '../lib/scorer';
import type { HDExtract } from '../lib/schemas';

// Mock data for testing
const mockClassification: ClassificationResult = {
  classification: 'primary',
  primary: 'Pleiades',
  percentages: {
    'Pleiades': 42.5,
    'Andromeda': 18.3,
    'Arcturus': 15.2,
    'Sirius': 12.1,
    'Lyra': 8.4,
    'Orion Light': 2.1,
    'Orion Dark': 1.2,
    'Draco': 0.2,
  },
  corePercentages: {
    'Pleiades': 35.0,
    'Andromeda': 15.0,
    'Arcturus': 12.0,
  },
  shadowPercentages: {
    'Pleiades': 7.5,
    'Andromeda': 3.3,
    'Arcturus': 3.2,
  },
  allies: [
    { system: 'Andromeda', percentage: 18.3 },
    { system: 'Arcturus', percentage: 15.2 },
  ],
  shadowWork: [
    { system: 'Pleiades', percentage: 7.5 },
  ],
  contributorsPerSystem: {
    'Pleiades': ['Sacral Center', 'Generator Type', 'Gate 20'],
    'Andromeda': ['Gate 34', 'Throat Center'],
  },
  contributorsWithWeights: {
    'Pleiades': [
      { key: 'sacral', weight: 15.0, label: 'Sacral Center' },
      { key: 'generator', weight: 12.0, label: 'Generator Type' },
    ],
  },
  meta: {
    canonVersion: '4.3',
    canonChecksum: 'test123',
    lore_version: '1.0',
    rules_hash: 'abc123',
    input_hash: 'def456',
  },
};

const mockHDData: HDExtract = {
  type: 'Generator',
  authority: 'Sacral',
  profile: '3/5',
  centers: ['Sacral', 'Throat', 'Spleen'],
  channels: [20, 34],
  gates: [20, 34, 10, 57, 18, 58],
  placements: [
    { planet: 'Sun', gate: 20, line: 3, type: 'personality' as const },
    { planet: 'Earth', gate: 34, line: 3, type: 'personality' as const },
  ],
};

function NarrativeTestScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-purple-100">
            ✨ Narrative Summary Test ✨
          </h1>
          <p className="text-purple-300">
            Testing magical golden glow effects and cinematic typography
          </p>
        </div>
        
        {/* Dark background for contrast */}
        <div className="bg-slate-900/50 rounded-xl p-8 backdrop-blur-sm">
          <NarrativeSummary 
            classification={mockClassification}
            hdData={mockHDData}
          />
        </div>
        
        {/* Instructions */}
        <div className="bg-purple-900/20 rounded-lg p-6 border border-purple-500/30">
          <h2 className="text-lg font-semibold text-purple-100 mb-3">
            What to look for:
          </h2>
          <ul className="space-y-2 text-purple-200 text-sm">
            <li>✨ Golden sparkles twinkling around the text</li>
            <li>🌟 Soft golden glow on the narrative text</li>
            <li>📖 Cinematic serif font (Cinzel)</li>
            <li>🎭 Smooth fade-in transition when content loads</li>
            <li>💫 Gentle pulsing glow effect</li>
            <li>🌌 Floating cosmic emoji</li>
          </ul>
        </div>
        
        {/* Color reference */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-yellow-300/20 rounded-lg p-4 border border-yellow-400/30">
            <div className="text-yellow-300 text-sm font-mono">Golden Sparkles</div>
            <div className="text-xs text-yellow-200/70 mt-1">#fef3c7</div>
          </div>
          <div className="bg-amber-400/20 rounded-lg p-4 border border-amber-500/30">
            <div className="text-amber-300 text-sm font-mono">Text Glow</div>
            <div className="text-xs text-amber-200/70 mt-1">rgba(251, 191, 36)</div>
          </div>
          <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-500/30">
            <div className="text-purple-300 text-sm font-mono">Background</div>
            <div className="text-xs text-purple-200/70 mt-1">Purple gradient</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NarrativeTestScreen;
