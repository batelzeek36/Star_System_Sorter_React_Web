#!/usr/bin/env tsx

/**
 * Task 3: Generate per-batch mapping files
 * 
 * This script generates 56 mapping files (8 star systems × 7 gate-line batches)
 * that score each gate.line against each star system's behavioral themes.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Star systems to process
const STAR_SYSTEMS = [
  'andromeda',
  'arcturus',
  'draco',
  'lyra',
  'orion-dark',
  'orion-light',
  'pleiades',
  'sirius'
];

// Gate-line batches (1-7)
const BATCHES = [1, 2, 3, 4, 5, 6, 7];

// Paths
const STAR_SYSTEMS_DIR = path.join(__dirname, '../research-outputs/star-systems/v4.2');
const GATE_LINE_DIR = path.join(__dirname, '../research-outputs/gate-line-API-call');
const OUTPUT_DIR = path.join(__dirname, '../research-outputs/star-mapping-drafts');

interface GateLineData {
  keywords: string[];
  behavioral_axis: string;
  shadow_axis: string;
}

interface MappingDigest {
  core_themes: string[];
  shadow_themes: string[];
  quick_rules: string[];
  notes_for_alignment?: string[];
}

interface StarSystemBaseline {
  star_system: string;
  mapping_digest: MappingDigest;
}

interface MappingResult {
  weight: number;
  alignment_type: 'core' | 'shadow' | 'none';
  why: string;
}

/**
 * Load star system baseline and extract mapping_digest
 */
function loadMappingDigest(systemName: string): MappingDigest {
  const filename = `${systemName}-baseline-4.2.json`;
  const filepath = path.join(STAR_SYSTEMS_DIR, filename);
  
  const content = fs.readFileSync(filepath, 'utf-8');
  const baseline: StarSystemBaseline = JSON.parse(content);
  
  if (!baseline.mapping_digest) {
    throw new Error(`No mapping_digest found in ${filename}`);
  }
  
  return baseline.mapping_digest;
}

/**
 * Load gate-line batch file
 */
function loadGateLineBatch(batchNum: number): Record<string, GateLineData> {
  const filename = `gate-line-${batchNum}.json`;
  const filepath = path.join(GATE_LINE_DIR, filename);
  
  const content = fs.readFileSync(filepath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Calculate semantic overlap between gate data and themes
 * Returns a score between 0 and 1
 * 
 * This is STRICT - we only match when the behavioral pattern truly aligns
 */
function calculateSemanticOverlap(
  text: string,
  keywords: string[],
  themes: string[]
): number {
  const combinedText = `${text} ${keywords.join(' ')}`.toLowerCase();
  let matchCount = 0;
  
  // Define STRICT behavioral signature patterns for each star system
  // Use specific keywords but require multiple matches to avoid false positives
  const behavioralSignatures: Record<string, string[]> = {
    // Pleiades: emotional safety, bonding, feeding, soothing
    'pleiades': [
      'emotional', 'bond', 'bonding', 'intimacy', 'close', 'proximity',
      'feed', 'feeding', 'nourish', 'sustain',
      'soothe', 'soothing', 'calm', 'safe', 'safety',
      'caretaking', 'nurture', 'nurturing', 'contain',
      'abandon', 'abandonment', 'need', 'needs'
    ],
    
    // Draco: predator scanning, loyalty enforcement, survival dominance
    'draco': [
      'predator', 'threat', 'scan', 'scanning', 'radar',
      'loyalty', 'loyal', 'allegiance', 'betray', 'betrayal',
      'enforce', 'enforcement', 'access control',
      'survival', 'survive', 'endure', 'continuity', 'collapse',
      'dominance', 'dominant', 'hierarchy', 'pecking',
      'hoard', 'hoarding', 'territorial'
    ],
    
    // Andromeda: liberation, breaking chains, anti-domination
    // NOTE: Avoid ambiguous words like "free" or "control" that appear in other contexts
    'andromeda': [
      'liberate', 'liberation',
      'sovereign', 'sovereignty',
      'captive', 'captivity', 'bondage', 'chained',
      'rescue', 'intervene', 'intervention',
      'domination', 'dominated', 'oppression', 'oppressed',
      'unjust', 'injustice', 'abuse', 'exploit',
      'reclaim', 'overthrow', 'restore'
    ],
    
    // Arcturus: frequency healing, calibration, energetic repair
    'arcturus': [
      'frequency', 'frequencies', 'vibration', 'vibrational',
      'calibrate', 'calibration', 'attune', 'attunement',
      'heal', 'healing', 'repair', 'restore', 'fix',
      'energetic', 'energy', 'field', 'distortion',
      'trauma', 'wound', 'wounded', 'stabilize', 'balance'
    ],
    
    // Lyra: artistic expression, beauty, creative enchantment
    'lyra': [
      'creative', 'creativity', 'create', 'creation',
      'artistic', 'art', 'artist', 'aesthetic', 'beauty', 'beautiful',
      'expression', 'express', 'style', 'taste', 'elegance',
      'enchant', 'enchantment', 'charisma', 'mystique',
      'original', 'originality', 'authentic', 'authenticity',
      'immortal', 'legacy', 'lineage', 'refined', 'refinement'
    ],
    
    // Orion-Light: honorable trial, warrior initiation, sacred ordeal
    'orion-light': [
      'trial', 'ordeal', 'test', 'challenge', 'prove',
      'warrior', 'courage', 'brave', 'honor', 'honorable',
      'initiation', 'initiate', 'rite', 'passage',
      'discipline', 'training', 'mastery', 'earn', 'rank',
      'code', 'principle', 'sacred', 'spiritual', 'higher'
    ],
    
    // Orion-Dark: empire control, obedience systems, coercion at scale
    'orion-dark': [
      'empire', 'imperial', 'planetary', 'galactic', 'civilization',
      'obedience', 'obey', 'comply', 'compliance', 'submit',
      'coerce', 'coercion', 'force', 'pressure', 'manipulate',
      'system', 'systems', 'structure', 'infrastructure', 'scale',
      'control', 'dominate', 'subjugate', 'colonize', 'rule'
    ],
    
    // Sirius: sacred law, liberation through initiation, cosmic justice
    'sirius': [
      'sacred', 'holy', 'divine', 'cosmic', 'universal',
      'law', 'justice', 'principle', 'truth', 'teaching',
      'liberation', 'liberate', 'free', 'freedom',
      'initiation', 'initiate', 'crisis', 'ordeal',
      'guide', 'guidance', 'instruction', 'wisdom'
    ]
  };
  
  // Determine which star system this scoring is for based on which signatures are in the themes
  let targetSystem = '';
  for (const [system, patterns] of Object.entries(behavioralSignatures)) {
    for (const theme of themes) {
      const themeLower = theme.toLowerCase();
      for (const pattern of patterns) {
        if (themeLower.includes(pattern)) {
          targetSystem = system;
          break;
        }
      }
      if (targetSystem) break;
    }
    if (targetSystem) break;
  }
  
  if (!targetSystem) {
    return 0; // Can't identify the system
  }
  
  const targetPatterns = behavioralSignatures[targetSystem];
  
  // Define ambiguous words that appear in multiple systems and need context
  const ambiguousWords = ['control', 'free', 'bond', 'power', 'safe'];
  
  // For each theme, check if the gate text contains the SAME system's patterns
  for (const theme of themes) {
    const themeLower = theme.toLowerCase();
    
    // Count how many of this system's patterns appear in BOTH theme and gate text
    let matchedPatterns = 0;
    let themeHasPattern = false;
    const matchedWords: string[] = [];
    
    for (const pattern of targetPatterns) {
      const inTheme = themeLower.includes(pattern);
      const inText = combinedText.includes(pattern);
      
      if (inTheme) {
        themeHasPattern = true;
      }
      
      if (inTheme && inText) {
        matchedPatterns++;
        matchedWords.push(pattern);
      }
    }
    
    // Check if all matches are ambiguous words (which would be a false positive)
    const allAmbiguous = matchedWords.length > 0 && matchedWords.every(w => ambiguousWords.includes(w));
    
    // Only score if:
    // 1. The theme contains this system's patterns
    // 2. The gate text ALSO contains those same patterns
    // 3. We have at least 2 pattern matches (to avoid false positives from single words)
    // 4. Not all matches are ambiguous words
    if (themeHasPattern && matchedPatterns >= 2 && !allAmbiguous) {
      matchCount += Math.min(matchedPatterns * 0.3, 0.5);
    } else if (themeHasPattern && matchedPatterns >= 3) {
      // If we have 3+ matches, even if some are ambiguous, it's probably real
      matchCount += 0.4;
    } else if (themeHasPattern && matchedPatterns === 1 && !ambiguousWords.includes(matchedWords[0])) {
      // Single unambiguous match gets lower score
      matchCount += 0.15;
    }
  }
  
  // Clamp to 1.0
  return Math.min(matchCount, 1.0);
}

/**
 * Check if gate data violates quick_rules for this system
 */
function violatesQuickRules(
  gateData: GateLineData,
  quickRules: string[],
  systemName: string,
  gateId?: string
): boolean {
  const combinedText = `${gateData.behavioral_axis} ${gateData.shadow_axis} ${gateData.keywords.join(' ')}`.toLowerCase();
  
  for (const rule of quickRules) {
    const ruleLower = rule.toLowerCase();
    
    // Skip positive affirmation rules (e.g., "If X, that's Draco")
    if (ruleLower.includes(`that's ${systemName}`) || ruleLower.includes(`that is ${systemName}`)) {
      continue; // This rule affirms the match, doesn't violate it
    }
    
    // Look for negative patterns like "not X" or "that's Y, not Z"
    if (ruleLower.includes('not ' + systemName) || ruleLower.includes(`, not ${systemName}`)) {
      
      // Extract what it IS (the other system mentioned before "not")
      const otherSystemPatterns = [
        'pleiades', 'pleiadian',
        'draco', 'draconian',
        'sirius', 'sirian',
        'arcturus', 'arcturian',
        'andromeda', 'andromedan',
        'lyra', 'lyran',
        'orion-light', 'orion light', 'osirian',
        'orion-dark', 'orion dark'
      ];
      
      for (const pattern of otherSystemPatterns) {
        if (pattern === systemName || pattern === systemName.replace('-', ' ')) {
          continue;
        }
        
        if (ruleLower.includes(pattern)) {
          // Check if the gate data matches the "other" system's pattern
          const keyPhrases = extractKeyPhrases(ruleLower);
          
          for (const phrase of keyPhrases) {
            if (combinedText.includes(phrase)) {
              return true; // Violates rule - this belongs to the other system
            }
          }
        }
      }
    }
  }
  
  return false;
}

/**
 * Extract key behavioral phrases from a rule
 * Returns multi-word phrases that are more specific
 */
function extractKeyPhrases(rule: string): string[] {
  const phrases: string[] = [];
  
  // Multi-word patterns that are more specific (check these first)
  const multiWordPatterns = [
    'emotional co-regulation',
    'nervous system soothing',
    'caretaking panic',
    'feeding/nurturing',
    'empire management',
    'coercive control structures',
    'obedience infrastructure',
    'predator scanning',
    'loyalty enforcement',
    'hierarchical enforcement',
    'frequency healing',
    'vibrational uplift',
    'breaking chains',
    'freeing captives',
    'overthrowing domination',
    'aesthetic superiority',
    'artistic mystique',
    'honorable trial',
    'warrior initiation',
    'sacred instruction',
    'cosmic law'
  ];
  
  for (const pattern of multiWordPatterns) {
    if (rule.includes(pattern)) {
      phrases.push(pattern);
    }
  }
  
  // Only add single-word patterns if no multi-word patterns matched
  if (phrases.length === 0) {
    const singleWordPatterns = [
      'caretaking', 'nurturing', 'feeding', 'soothing',
      'liberation', 'freedom', 'sovereignty', 'rescue',
      'healing', 'repair', 'calibration',
      'creative', 'artistic', 'beauty', 'expression',
      'initiation', 'ordeal', 'trial'
    ];
    
    for (const pattern of singleWordPatterns) {
      if (rule.includes(pattern)) {
        phrases.push(pattern);
      }
    }
  }
  
  return phrases;
}

/**
 * Build the "why" explanation
 * Must be behaviorally specific and explain the actual pattern match
 */
function buildWhy(
  gateData: GateLineData,
  systemName: string,
  alignmentType: 'core' | 'shadow' | 'none',
  digest: MappingDigest
): string {
  const behavior = alignmentType === 'core' ? gateData.behavioral_axis : gateData.shadow_axis;
  const combinedText = `${gateData.behavioral_axis} ${gateData.shadow_axis} ${gateData.keywords.join(' ')}`.toLowerCase();
  
  if (alignmentType === 'none') {
    // Explain what this ISN'T and hint at what it actually IS (for debugging)
    // Check for patterns from OTHER systems to give helpful hints
    
    // System-specific helpful hints based on what patterns ARE present
    if (systemName === 'andromeda') {
      // Check for Pleiades patterns
      if (combinedText.includes('emotional') && (combinedText.includes('bond') || combinedText.includes('intimacy') || combinedText.includes('safe'))) {
        return 'This is emotional bonding and relational safety (Pleiades), not liberation from captivity (Andromeda)';
      }
      if (combinedText.includes('feed') || combinedText.includes('nourish') || combinedText.includes('soothe')) {
        return 'This is caretaking and nervous system soothing (Pleiades), not freeing captives (Andromeda)';
      }
      
      // Check for Draco patterns
      if (combinedText.includes('loyalty') || combinedText.includes('threat') || combinedText.includes('predator')) {
        return 'This is loyalty enforcement and threat scanning (Draco), not liberation work (Andromeda)';
      }
      
      // Check for Orion patterns
      if (combinedText.includes('leader') || combinedText.includes('recognition') || combinedText.includes('direction')) {
        return 'This is leadership and direction-setting (Orion-coded), not breaking chains or restoring sovereignty (Andromeda)';
      }
      
      // Check for Lyra patterns
      if (combinedText.includes('creative') || combinedText.includes('aesthetic') || combinedText.includes('style')) {
        return 'This is creative expression and aesthetic identity (Lyra), not liberation from domination (Andromeda)';
      }
    }
    
    // Generic fallback for each system
    const explanations: Record<string, string> = {
      'pleiades': 'This is not about emotional bonding, feeding, or nervous system soothing (Pleiades core patterns)',
      'draco': 'This is not about predator scanning, loyalty enforcement, or survival-through-dominance (Draco core patterns)',
      'andromeda': 'This is not about freeing captives, breaking chains, or challenging domination (Andromeda core patterns)',
      'arcturus': 'This is not about frequency healing, energetic calibration, or trauma field repair (Arcturus core patterns)',
      'lyra': 'This is not about artistic expression, creative enchantment, or aesthetic refinement (Lyra core patterns)',
      'orion-light': 'This is not about honorable trial, warrior initiation, or spiritual ordeal (Orion-Light core patterns)',
      'orion-dark': 'This is not about empire-scale control, obedience systems, or coercive hierarchy (Orion-Dark core patterns)',
      'sirius': 'This is not about sacred law, liberation through crisis, or cosmic justice teaching (Sirius core patterns)'
    };
    
    return explanations[systemName] || `No behavioral match to ${systemName} patterns`;
  }
  
  // For core/shadow, explain the SPECIFIC behavioral match
  // Check what patterns are actually present
  const patterns: Record<string, string[]> = {
    'pleiades': ['emotional', 'bond', 'feed', 'soothe', 'care', 'nurture', 'safe', 'need', 'abandon', 'intimacy'],
    'draco': ['predator', 'threat', 'scan', 'loyalty', 'enforce', 'survival', 'dominance', 'hierarchy', 'hoard', 'territorial'],
    'andromeda': ['free', 'liberate', 'sovereign', 'captive', 'chain', 'rescue', 'domination', 'unjust', 'break', 'restore'],
    'arcturus': ['frequency', 'vibration', 'calibrate', 'heal', 'repair', 'energetic', 'trauma', 'stabilize', 'field'],
    'lyra': ['creative', 'artistic', 'beauty', 'aesthetic', 'expression', 'enchant', 'original', 'authentic', 'legacy'],
    'orion-light': ['trial', 'ordeal', 'warrior', 'honor', 'initiation', 'discipline', 'prove', 'code', 'sacred'],
    'orion-dark': ['empire', 'obedience', 'coerce', 'system', 'control', 'planetary', 'subjugate', 'manipulate'],
    'sirius': ['sacred', 'law', 'justice', 'cosmic', 'liberation', 'initiation', 'crisis', 'teaching', 'guide']
  };
  
  const systemPatterns = patterns[systemName] || [];
  const matchedPatterns: string[] = [];
  
  for (const pattern of systemPatterns) {
    if (combinedText.includes(pattern)) {
      matchedPatterns.push(pattern);
    }
  }
  
  // Build a specific explanation based on what actually matched
  if (matchedPatterns.length === 0) {
    // Shouldn't happen if scoring is correct, but fallback
    return `${behavior} (weak thematic resonance with ${systemName})`;
  }
  
  // Create system-specific explanations
  const coreExplanations: Record<string, (b: string, p: string[]) => string> = {
    'pleiades': (b, p) => {
      if (p.includes('feed') || p.includes('nurture')) return `Focuses on feeding/nurturing to maintain bonds - core Pleiadian caretaking`;
      if (p.includes('emotional') || p.includes('bond')) return `Centers emotional bonding and relational safety - core Pleiadian pattern`;
      if (p.includes('soothe') || p.includes('calm')) return `Soothes nervous systems to prevent abandonment - core Pleiadian behavior`;
      if (p.includes('need') || p.includes('abandon')) return `Hyper-attuned to needs and abandonment fears - core Pleiadian sensitivity`;
      return `Maintains emotional safety and bonding - Pleiadian caretaking pattern`;
    },
    'draco': (b, p) => {
      if (p.includes('predator') || p.includes('threat') || p.includes('scan')) return `Scans for threats and predators to protect the group - core Draco survival pattern`;
      if (p.includes('loyalty') || p.includes('enforce')) return `Enforces loyalty and tests allegiance - core Draco tribal control`;
      if (p.includes('survival') || p.includes('endure')) return `Focuses on survival continuity and avoiding collapse - core Draco pattern`;
      if (p.includes('dominance') || p.includes('hierarchy')) return `Maintains dominance hierarchy for group survival - core Draco structure`;
      return `Tribal survival through dominance and loyalty enforcement - Draco pattern`;
    },
    'andromeda': (b, p) => {
      if (p.includes('free') || p.includes('liberate') || p.includes('chain')) return `Breaks chains and frees the captive - core Andromedan liberation`;
      if (p.includes('sovereign') || p.includes('restore')) return `Restores sovereignty and personal freedom - core Andromedan mission`;
      if (p.includes('domination') || p.includes('unjust')) return `Challenges domination and unjust control - core Andromedan ethics`;
      if (p.includes('rescue') || p.includes('intervene')) return `Intervenes to rescue those under oppression - core Andromedan action`;
      return `Liberation from captivity and restoration of sovereignty - Andromedan pattern`;
    },
    'arcturus': (b, p) => {
      if (p.includes('frequency') || p.includes('calibrate')) return `Calibrates frequencies and repairs distortion - core Arcturian healing`;
      if (p.includes('heal') || p.includes('repair')) return `Heals and repairs energetic damage - core Arcturian function`;
      if (p.includes('trauma') || p.includes('stabilize')) return `Stabilizes trauma fields and restores balance - core Arcturian work`;
      return `Frequency healing and energetic calibration - Arcturian pattern`;
    },
    'lyra': (b, p) => {
      if (p.includes('creative') || p.includes('artistic')) return `Creative expression and artistic enchantment - core Lyran gift`;
      if (p.includes('beauty') || p.includes('aesthetic')) return `Aesthetic refinement and beauty as power - core Lyran pattern`;
      if (p.includes('original') || p.includes('authentic')) return `Original authentic expression - core Lyran signature`;
      return `Artistic expression and creative enchantment - Lyran pattern`;
    },
    'orion-light': (b, p) => {
      if (p.includes('trial') || p.includes('ordeal')) return `Advances through honorable trial and ordeal - core Orion-Light initiation`;
      if (p.includes('warrior') || p.includes('honor')) return `Warrior path with honor and discipline - core Orion-Light code`;
      if (p.includes('prove') || p.includes('earn')) return `Earns rank through proving courage - core Orion-Light pattern`;
      return `Honorable initiation through spiritual ordeal - Orion-Light pattern`;
    },
    'orion-dark': (b, p) => {
      if (p.includes('empire') || p.includes('planetary')) return `Empire-scale control and planetary subjugation - core Orion-Dark pattern`;
      if (p.includes('obedience') || p.includes('coerce')) return `Coercive obedience systems - core Orion-Dark structure`;
      if (p.includes('system') || p.includes('infrastructure')) return `Control infrastructure at civilization scale - core Orion-Dark method`;
      return `Empire management and obedience enforcement - Orion-Dark pattern`;
    },
    'sirius': (b, p) => {
      if (p.includes('sacred') || p.includes('law')) return `Sacred law and cosmic justice - core Sirian teaching`;
      if (p.includes('liberation') || p.includes('crisis')) return `Liberation through crisis initiation - core Sirian pattern`;
      if (p.includes('teaching') || p.includes('guide')) return `Guides through sacred instruction - core Sirian role`;
      return `Sacred law and liberation through initiation - Sirian pattern`;
    }
  };
  
  const shadowExplanations: Record<string, (b: string, p: string[]) => string> = {
    'pleiades': (b, p) => `Caretaking panic and codependent fusion to avoid abandonment - Pleiadian shadow`,
    'draco': (b, p) => `Paranoid control and ruthless threat elimination - Draconian shadow`,
    'andromeda': (b, p) => `Passive victimhood waiting for rescue instead of reclaiming sovereignty - Andromedan shadow`,
    'arcturus': (b, p) => `Spiritual bypass through 'high vibration' detachment - Arcturian shadow`,
    'lyra': (b, p) => `Aesthetic elitism and beauty-as-superiority - Lyran shadow`,
    'orion-light': (b, p) => `Self-righteous crusader with no compassion - Orion-Light shadow`,
    'orion-dark': (b, p) => `Coercive empire control and psychological manipulation - Orion-Dark shadow (which is also its core)`,
    'sirius': (b, p) => `Judgmental moral absolutism under liberation language - Sirian shadow`
  };
  
  const explainer = alignmentType === 'core' ? coreExplanations[systemName] : shadowExplanations[systemName];
  
  if (explainer) {
    return explainer(behavior, matchedPatterns);
  }
  
  return `${behavior} - ${alignmentType} ${systemName} pattern`;
}

/**
 * Score a single gate.line against a single star system
 */
function scoreGateLine(
  gateData: GateLineData,
  systemName: string,
  digest: MappingDigest,
  gateId?: string
): MappingResult {
  // Calculate core and shadow scores
  const coreScore = calculateSemanticOverlap(
    gateData.behavioral_axis,
    gateData.keywords,
    digest.core_themes
  );
  
  const shadowScore = calculateSemanticOverlap(
    gateData.shadow_axis,
    gateData.keywords,
    digest.shadow_themes
  );
  
  // Determine candidate alignment
  let candidateWeight = 0;
  let candidateType: 'core' | 'shadow' | 'none' = 'none';
  
  if (coreScore >= shadowScore && coreScore > 0) {
    candidateWeight = coreScore;
    candidateType = 'core';
  } else if (shadowScore > coreScore) {
    candidateWeight = shadowScore;
    candidateType = 'shadow';
  }
  
  // Apply quick_rules kill-switch
  if (violatesQuickRules(gateData, digest.quick_rules, systemName, gateId)) {
    candidateWeight = 0;
    candidateType = 'none';
  }
  
  // Round weight to 2 decimal places
  candidateWeight = Math.round(candidateWeight * 100) / 100;
  
  // Build why explanation
  const why = buildWhy(gateData, systemName, candidateType, digest);
  
  return {
    weight: candidateWeight,
    alignment_type: candidateType,
    why
  };
}

/**
 * Generate mapping file for one system and one batch
 */
function generateBatchMapping(systemName: string, batchNum: number): void {
  console.log(`Processing ${systemName} batch ${batchNum}...`);
  
  // Load data
  const digest = loadMappingDigest(systemName);
  const gateLines = loadGateLineBatch(batchNum);
  
  // Score each gate.line
  const results: Record<string, MappingResult> = {};
  
  for (const [gateId, gateData] of Object.entries(gateLines)) {
    results[gateId] = scoreGateLine(gateData, systemName, digest, gateId);
  }
  
  // Write output file
  const outputFilename = `${systemName}-batch${batchNum}.json`;
  const outputPath = path.join(OUTPUT_DIR, outputFilename);
  
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`  ✓ Wrote ${outputFilename}`);
}

/**
 * Main execution
 */
function main() {
  console.log('Task 3: Generate per-batch mapping files\n');
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created directory: ${OUTPUT_DIR}\n`);
  }
  
  // Generate all 56 mapping files (8 systems × 7 batches)
  let fileCount = 0;
  
  for (const system of STAR_SYSTEMS) {
    for (const batch of BATCHES) {
      generateBatchMapping(system, batch);
      fileCount++;
    }
  }
  
  console.log(`\n✓ Generated ${fileCount} mapping files`);
  console.log(`Output directory: ${OUTPUT_DIR}`);
}

// Run the script
main();
