#!/usr/bin/env ts-node
/**
 * Generate mapping_digest for all star system baseline files
 * 
 * This script:
 * 1. Loads each star system baseline JSON
 * 2. Analyzes characteristics, polarity, and behavioral themes
 * 3. Generates mapping_digest with core_themes, shadow_themes, and quick_rules
 * 4. Injects mapping_digest into the baseline file
 * 5. Preserves all existing fields
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface StarSystemBaseline {
  star_system: string;
  version: string;
  characteristics: Array<{
    trait: string;
    polarity: string;
    consensus_level: string;
    ancient_support: string;
  }>;
  [key: string]: any;
}

interface MappingDigest {
  core_themes: string[];
  shadow_themes: string[];
  quick_rules: string[];
}

const BASELINE_DIR = path.join(__dirname, '../research-outputs/star-systems/v4.2');

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

/**
 * Generate mapping digest for each star system based on characteristics
 */
function generateMappingDigest(system: string, baseline: StarSystemBaseline): MappingDigest {
  const digests: Record<string, MappingDigest> = {
    andromeda: {
      core_themes: [
        "Liberation from captivity and unjust bondage",
        "Intervention to free the bound and restore sovereignty",
        "Anti-domination ethics and non-hierarchical council governance",
        "Cosmic justice alignment and restoration of balance",
        "Extragalactic perspective and separate civilization consciousness"
      ],
      shadow_themes: [
        "Passive victimhood and waiting for rescue",
        "Martyrdom complex and self-sacrifice without agency",
        "Idealistic council structures that avoid direct action"
      ],
      quick_rules: [
        "If the behavior is about freeing someone from unjust captivity, external intervention to restore sovereignty, or challenging hierarchical control systems, that's Andromeda.",
        "If the behavior is predator scanning, loyalty enforcement, or survival through dominance, that's Draco, not Andromeda.",
        "If the behavior is emotional co-regulation, nervous system soothing, or caretaking panic, that's Pleiades, not Andromeda.",
        "If the behavior is spiritual initiation through ordeal or sacred knowledge transmission, that's Sirius or Orion-Light, not Andromeda.",
        "Andromeda is about liberation and anti-domination sovereignty, not about emotional bonding or hierarchical power."
      ]
    },
    arcturus: {
      core_themes: [
        "Frequency calibration and vibrational healing",
        "Energetic recalibration and consciousness uplift",
        "Soul transit gateway and incarnational checkpoint",
        "Light and sound healing modalities",
        "Dimensional ascension assistance and frequency medicine",
        "Emotional and spiritual field clearing"
      ],
      shadow_themes: [
        "Spiritual bypassing through frequency work without integration",
        "Detachment from embodied experience in favor of 'higher vibrations'",
        "Elitism around vibrational purity"
      ],
      quick_rules: [
        "If the behavior is about frequency tuning, vibrational recalibration, energetic healing chambers, or dimensional ascension support, that's Arcturus.",
        "If the behavior is emotional co-regulation, nervous system soothing, or caretaking/feeding others, that's Pleiades, not Arcturus.",
        "If the behavior is predator scanning, loyalty enforcement, or survival through dominance, that's Draco, not Arcturus.",
        "If the behavior is spiritual initiation through ordeal or mystery school transmission, that's Sirius or Orion-Light, not Arcturus.",
        "Arcturus is about healing through frequency and light, not about emotional bonding or power hierarchies."
      ]
    },
    draco: {
      core_themes: [
        "Survival through dominance hierarchy and power consolidation",
        "Predator scanning and threat assessment",
        "Loyalty enforcement and access control",
        "Strategic resource hoarding and territorial defense",
        "Survival continuity and fear of collapse",
        "Hierarchical order and pecking-order maintenance"
      ],
      shadow_themes: [
        "Paranoid control and power hoarding",
        "Ruthless elimination of perceived threats",
        "Greed and apocalyptic entropy (Western dragon archetype)",
        "Coercive obedience enforcement"
      ],
      quick_rules: [
        "If the behavior is predator scanning, hierarchical enforcement, loyalty control, survival through dominance, or strategic resource hoarding, that's Draco.",
        "If the behavior is emotional co-regulation, nervous system soothing, caretaking panic, or feeding/nurturing others, that's Pleiades, not Draco.",
        "If the behavior is spiritual initiation, sacred instruction, or liberation through ordeal, that's Sirius or Orion-Light, not Draco.",
        "If the behavior is frequency healing, vibrational uplift, or energetic recalibration, that's Arcturus, not Draco.",
        "Draco is about survival through power and dominance, not about emotional safety or spiritual teaching."
      ]
    },
    lyra: {
      core_themes: [
        "Musical and artistic enchantment",
        "Creative expression and aesthetic power",
        "Progenitor consciousness and genetic seeding (modern)",
        "Unity through artistic collaboration",
        "Immortalization through beauty and art",
        "Volunteer soul missions and incarnational assistance"
      ],
      shadow_themes: [
        "Artistic elitism and aesthetic superiority",
        "Grief and mourning that becomes identity",
        "Progenitor pride and genetic supremacy narratives"
      ],
      quick_rules: [
        "If the behavior is about musical enchantment, artistic creation, aesthetic power, or creative collaboration, that's Lyra.",
        "If the behavior is predator scanning, loyalty enforcement, or survival through dominance, that's Draco, not Lyra.",
        "If the behavior is emotional caretaking, nervous system soothing, or feeding/nurturing, that's Pleiades, not Lyra.",
        "If the behavior is spiritual initiation through ordeal or mystery school transmission, that's Sirius or Orion-Light, not Lyra.",
        "Lyra is about artistic expression and creative power, not about dominance hierarchies or emotional bonding."
      ]
    },
    'orion-dark': {
      core_themes: [
        "Empire management and coercive control structures",
        "Hierarchical power consolidation through obedience enforcement",
        "Psychological pressure and manipulation at scale",
        "Genetic engineering and DNA control programs",
        "Telepathic influence and thought-form seeding",
        "Service-to-self polarity and power-through-enslavement",
        "Pecking order advancement through domination"
      ],
      shadow_themes: [
        "Spiritual entropy and alliance instability",
        "Loss of coherence through negative polarity",
        "Manipulation through fear and hostile thought-forms",
        "Enslavement of the less powerful as power source"
      ],
      quick_rules: [
        "If the behavior is empire management, coercive control structures, obedience enforcement, psychological pressure at scale, or genetic manipulation for control, that's Orion-Dark.",
        "If the behavior is honorable trial, spiritual/warrior initiation, or ascending through ordeal in service to a higher code, that's Orion-Light, not Orion-Dark.",
        "If the behavior is predator scanning and loyalty enforcement at the tribal/survival level, that's Draco, not Orion-Dark (Orion-Dark operates at imperial/planetary scale).",
        "If the behavior is emotional co-regulation or caretaking panic, that's Pleiades, not Orion-Dark.",
        "Orion-Dark is about empire-scale control and psychological manipulation, not tribal survival or emotional bonding."
      ]
    },
    'orion-light': {
      core_themes: [
        "Honorable trial and spiritual warrior initiation",
        "Ascending through ordeal in service to a higher code",
        "Mystery school preservation and sacred knowledge transmission",
        "Royal resurrection and pharaonic initiation (Osiris-Orion)",
        "Sacred geometry and architectural stellar encoding",
        "Thoth-Hermes lineage as divine scribe and cosmic law transmitter",
        "Record keeping and preservation of primordial knowledge"
      ],
      shadow_themes: [
        "Initiatory elitism and gatekeeping of sacred knowledge",
        "Ordeal fetishization and unnecessary suffering",
        "Spiritual pride in having 'passed the test'"
      ],
      quick_rules: [
        "If the behavior is honorable trial, spiritual/warrior initiation, ascending through ordeal in service to a higher code, mystery school transmission, or sacred knowledge preservation, that's Orion-Light.",
        "If the behavior is empire management, coercive control structures, obedience enforcement, or psychological pressure at scale, that's Orion-Dark, not Orion-Light.",
        "If the behavior is predator scanning and loyalty enforcement, that's Draco, not Orion-Light.",
        "If the behavior is emotional co-regulation or caretaking, that's Pleiades, not Orion-Light.",
        "If the behavior is frequency healing or vibrational uplift, that's Arcturus, not Orion-Light.",
        "Orion-Light is about initiation through ordeal and sacred teaching, not about empire control or emotional bonding."
      ]
    },
    pleiades: {
      core_themes: [
        "Emotional co-regulation and nervous system soothing",
        "Caretaking and feeding/nurturing behavior",
        "Bonding panic and need-sensitivity",
        "Maternal protection and keeping everyone alive",
        "Compassion training and emotional healing",
        "Collective nurturing and sisterhood unity",
        "Agricultural fertility and seasonal care"
      ],
      shadow_themes: [
        "Caretaking panic and anxious attachment",
        "Emotional enmeshment and boundary dissolution",
        "Martyrdom through over-giving",
        "Crisis-for-attachment and emotional escalation as bonding strategy"
      ],
      quick_rules: [
        "If the behavior is emotional co-regulation, nervous system soothing, caretaking panic, feeding/nurturing, or keeping everyone alive through bonding, that's Pleiades.",
        "If the behavior is predator scanning, hierarchical enforcement, loyalty control, or survival through dominance, that's Draco, not Pleiades.",
        "If the behavior is spiritual initiation through ordeal or sacred instruction, that's Sirius or Orion-Light, not Pleiades.",
        "If the behavior is frequency healing or vibrational recalibration, that's Arcturus, not Pleiades.",
        "If the behavior is empire management or coercive control, that's Orion-Dark, not Pleiades.",
        "Pleiades is about emotional safety and nurturing, not about power hierarchies or spiritual ordeals."
      ]
    },
    sirius: {
      core_themes: [
        "Spiritual initiation and liberation current",
        "Sacred knowledge transmission and cosmic law teaching",
        "Royal resurrection and pharaonic renewal (Isis-Sothis-Osiris)",
        "Path to freedom through higher initiation",
        "Love-wisdom transmission and spiritual hierarchy guidance",
        "Calendar marking and agricultural fertility timing",
        "Teachers and bringers of sacred instruction"
      ],
      shadow_themes: [
        "Initiatory elitism and spiritual gatekeeping",
        "Dogmatic adherence to cosmic law without compassion",
        "Spiritual hierarchy as power structure"
      ],
      quick_rules: [
        "If the behavior is spiritual initiation, liberation through higher teaching, sacred instruction, cosmic law transmission, or royal resurrection current, that's Sirius.",
        "If the behavior is honorable trial or warrior initiation through ordeal, that's Orion-Light, not Sirius (Sirius is about liberation and teaching, Orion-Light is about ordeal and mystery schools).",
        "If the behavior is predator scanning or loyalty enforcement, that's Draco, not Sirius.",
        "If the behavior is emotional co-regulation or caretaking, that's Pleiades, not Sirius.",
        "If the behavior is frequency healing or vibrational uplift, that's Arcturus, not Sirius.",
        "Sirius is about liberation through sacred teaching, not about dominance or emotional bonding."
      ]
    }
  };

  return digests[system];
}

/**
 * Main execution
 */
function main() {
  console.log('Generating mapping_digest for all star systems...\n');

  for (const system of STAR_SYSTEMS) {
    const filename = `${system}-baseline-4.2.json`;
    const filepath = path.join(BASELINE_DIR, filename);

    console.log(`Processing ${system}...`);

    // Read baseline file
    const baseline: StarSystemBaseline = JSON.parse(fs.readFileSync(filepath, 'utf-8'));

    // Generate mapping digest
    const mappingDigest = generateMappingDigest(system, baseline);

    // Inject mapping_digest as new top-level key
    const updated = {
      ...baseline,
      mapping_digest: mappingDigest
    };

    // Write back to file with pretty formatting
    fs.writeFileSync(filepath, JSON.stringify(updated, null, 2), 'utf-8');

    console.log(`  ✓ Added mapping_digest to ${filename}`);
    console.log(`    - ${mappingDigest.core_themes.length} core themes`);
    console.log(`    - ${mappingDigest.shadow_themes.length} shadow themes`);
    console.log(`    - ${mappingDigest.quick_rules.length} quick rules\n`);
  }

  console.log('✓ All mapping_digest entries generated successfully!');
}

main();
