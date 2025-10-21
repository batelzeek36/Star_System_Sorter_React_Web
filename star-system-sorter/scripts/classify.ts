#!/usr/bin/env tsx
/**
 * Dev CLI for classification debugging
 * Usage: npm run classify -- --date 1990-01-15 --time 14:30 --tz America/New_York
 */

import { computeScoresWithLore, classify } from '../src/lib/scorer.js';
import { getCanon } from '../src/lib/canon.js';
import type { HDExtract } from '../src/lib/schemas.js';

interface CLIArgs {
  date: string;
  time: string;
  tz: string;
}

function parseArgs(): CLIArgs {
  const args = process.argv.slice(2);
  const parsed: Partial<CLIArgs> = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--date' && args[i + 1]) {
      parsed.date = args[i + 1];
      i++;
    } else if (args[i] === '--time' && args[i + 1]) {
      parsed.time = args[i + 1];
      i++;
    } else if (args[i] === '--tz' && args[i + 1]) {
      parsed.tz = args[i + 1];
      i++;
    }
  }

  if (!parsed.date || !parsed.time || !parsed.tz) {
    console.error('Usage: npm run classify -- --date YYYY-MM-DD --time HH:MM --tz TIMEZONE');
    console.error('Example: npm run classify -- --date 1990-01-15 --time 14:30 --tz America/New_York');
    process.exit(1);
  }

  return parsed as CLIArgs;
}


// Mock HD data generator for testing
// In a real implementation, this would call the BodyGraph API
function generateMockHDData(date: string, time: string, tz: string): HDExtract {
  console.log(`\n📍 Birth Data: ${date} at ${time} (${tz})\n`);
  
  // Generate deterministic mock data based on input
  const seed = `${date}-${time}-${tz}`.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const types = ['Generator', 'Manifestor', 'Projector', 'Reflector', 'Manifesting Generator'];
  const authorities = ['Emotional', 'Sacral', 'Splenic', 'Ego', 'Self-Projected', 'Mental', 'Lunar'];
  const profiles = ['1/3', '1/4', '2/4', '2/5', '3/5', '3/6', '4/6', '4/1', '5/1', '5/2', '6/2', '6/3'];
  
  const allCenters = ['Head', 'Ajna', 'Throat', 'G', 'Heart', 'Spleen', 'Solar Plexus', 'Sacral', 'Root'];
  const numDefinedCenters = (seed % 5) + 3; // 3-7 defined centers
  const definedCenters = allCenters.slice(0, numDefinedCenters);
  
  const allChannels = ['13-33', '1-8', '2-14', '3-60', '4-63', '5-15', '6-59', '7-31', '9-52', '10-20'];
  const numChannels = (seed % 4) + 2; // 2-5 channels
  const channels = allChannels.slice(0, numChannels);
  
  const allGates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 14, 15, 20, 31, 33, 52, 59, 60, 63];
  const numGates = (seed % 10) + 10; // 10-19 gates
  const gates = allGates.slice(0, numGates);
  
  return {
    type: types[seed % types.length],
    authority: authorities[seed % authorities.length],
    profile: profiles[seed % profiles.length],
    definedCenters,
    channels,
    gates,
  };
}

async function main() {
  const args = parseArgs();
  
  try {
    // Generate mock HD data
    const hdData = generateMockHDData(args.date, args.time, args.tz);
    
    console.log('🔮 Human Design Extract:');
    console.log(JSON.stringify(hdData, null, 2));
    
    // Compute classification
    console.log('\n⚙️  Computing classification...\n');
    const canon = getCanon();
    const scores = computeScoresWithLore(hdData);
    const classification = classify(scores, canon, hdData);
    
    // Output results
    console.log('✨ Classification Result:');
    console.log(JSON.stringify(classification, null, 2));
    
    console.log('\n📊 Summary:');
    if (classification.classification === 'hybrid' && classification.hybrid) {
      console.log(`Classification: Hybrid (${classification.hybrid.join(' + ')})`);
      const delta = Math.abs(
        classification.percentages[classification.hybrid[0]] - 
        classification.percentages[classification.hybrid[1]]
      );
      console.log(`Delta: ${delta.toFixed(2)}%`);
    } else if (classification.primary) {
      console.log(`Primary: ${classification.primary}`);
      if (classification.ally) {
        console.log(`Ally: ${classification.ally}`);
      }
    } else {
      console.log(`Classification: Unresolved`);
    }
    console.log(`\nPercentages:`);
    Object.entries(classification.percentages)
      .sort(([, a], [, b]) => b - a)
      .forEach(([system, pct]) => {
        console.log(`  ${system}: ${pct.toFixed(2)}%`);
      });
    
    console.log(`\nLore Version: ${classification.meta.lore_version}`);
    console.log(`Rules Hash: ${classification.meta.rules_hash}`);
    console.log(`Input Hash: ${classification.meta.input_hash}`);
    
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
