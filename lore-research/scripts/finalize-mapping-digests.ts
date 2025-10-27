#!/usr/bin/env ts-node
/**
 * Finalize mapping_digest for all star system baseline files
 * 
 * This script:
 * 1. Reads each baseline file
 * 2. Updates mapping_digest with notes_for_alignment
 * 3. Strengthens quick_rules with explicit disambiguation
 * 4. Preserves all existing fields
 * 5. Validates JSON structure
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface MappingDigest {
  core_themes: string[];
  shadow_themes: string[];
  quick_rules: string[];
  notes_for_alignment: string;
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
 * Generate complete mapping digest with notes_for_alignment
 */
function generateCompleteMappingDigest(system: string): MappingDigest {
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
        "If the behavior is empire management, coercive control structures, or obedience enforcement, that's Orion-Dark, not Andromeda.",
        "If the behavior is spiritual initiation through ordeal or sacred knowledge transmission, that's Sirius or Orion-Light, not Andromeda.",
        "Andromeda is about liberation and anti-domination sovereignty, not about emotional bonding, power hierarchies, or spiritual ordeals."
      ],
      notes_for_alignment: "Score Andromeda high (0.7–1.0) when the gate.line is about liberating the captive, intervening to free the exploited, challenging unjust hierarchy, or restoring sovereignty to those who've been bound or sacrificed. Score Andromeda shadow (0.4–0.6) when it's passive victimhood, waiting for rescue without taking agency, or idealistic anti-domination talk that avoids direct action. Give Andromeda ~0 when the behavior is tribal loyalty enforcement or predator scanning (that's Draco), empire-scale coercive control (that's Orion-Dark), emotional caretaking or bonding panic (that's Pleiades), or spiritual initiation through ordeal (that's Sirius/Orion-Light)."
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
        "If the behavior is about frequency tuning, vibrational recalibration, energetic healing chambers, dimensional ascension support, or clinical repair of distortion, that's Arcturus.",
        "If the behavior is emotional co-regulation, nervous system soothing, or caretaking/feeding others, that's Pleiades, not Arcturus.",
        "If the behavior is predator scanning, loyalty enforcement, or survival through dominance, that's Draco, not Arcturus.",
        "If the behavior is spiritual initiation through ordeal or mystery school transmission, that's Sirius or Orion-Light, not Arcturus.",
        "If the behavior is liberation from captivity or anti-domination intervention, that's Andromeda, not Arcturus.",
        "Arcturus is about healing through frequency and energetic alignment, not about emotional bonding, power hierarchies, or liberation struggles."
      ],
      notes_for_alignment: "Score Arcturus high (0.7–1.0) when the gate.line is about frequency calibration, vibrational repair, energetic recalibration, clearing distortion, or clinical/technical healing modalities (light, sound, dimensional tuning). Score Arcturus shadow (0.4–0.6) when it's spiritual bypassing, detachment from embodied reality, or elitism around vibrational purity. Give Arcturus ~0 when the behavior is emotional mothering or nervous-system soothing (that's Pleiades), predator scanning or loyalty control (that's Draco), spiritual initiation through ordeal (that's Sirius/Orion-Light), or liberation from captivity (that's Andromeda)."
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
        "If the behavior is predator scanning, hierarchical enforcement, loyalty control, survival through dominance, strategic resource hoarding, or tribal fear-based access control, that's Draco.",
        "If the behavior is emotional co-regulation, nervous system soothing, caretaking panic, or feeding/nurturing others, that's Pleiades, not Draco.",
        "If the behavior is empire management, coercive control structures at scale, or obedience infrastructure across systems, that's Orion-Dark, not Draco (Draco is tribal/immediate survival, Orion-Dark is empire-scale).",
        "If the behavior is spiritual initiation, sacred instruction, or liberation through ordeal, that's Sirius or Orion-Light, not Draco.",
        "If the behavior is frequency healing or vibrational uplift, that's Arcturus, not Draco.",
        "Draco is about survival through power and dominance at the tribal/immediate level, not about emotional safety, empire management, or spiritual teaching."
      ],
      notes_for_alignment: "Score Draco high (0.7–1.0) when the gate.line is about predator scanning, threat assessment, loyalty enforcement, survival through dominance hierarchy, resource hoarding, or fear-based access control at the tribal/immediate level. Score Draco shadow (0.4–0.6) when it's paranoid control, ruthless elimination of threats, greed, or coercive obedience enforcement. Give Draco ~0 when the behavior is emotional caretaking or bonding panic (that's Pleiades), empire-scale coercive control or obedience infrastructure (that's Orion-Dark—Draco is tribal, not imperial), spiritual initiation or sacred teaching (that's Sirius/Orion-Light), or frequency healing (that's Arcturus)."
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
        "If the behavior is about musical enchantment, artistic creation, aesthetic power, creative collaboration, or immortalization through beauty, that's Lyra.",
        "If the behavior is predator scanning, loyalty enforcement, or survival through dominance, that's Draco, not Lyra.",
        "If the behavior is emotional caretaking, nervous system soothing, or feeding/nurturing, that's Pleiades, not Lyra.",
        "If the behavior is spiritual initiation through ordeal or mystery school transmission, that's Sirius or Orion-Light, not Lyra.",
        "If the behavior is frequency calibration or vibrational healing, that's Arcturus, not Lyra.",
        "If the behavior is liberation from captivity or anti-domination intervention, that's Andromeda, not Lyra.",
        "Lyra is about artistic expression and creative power, not about dominance hierarchies, emotional bonding, spiritual ordeals, or liberation struggles."
      ],
      notes_for_alignment: "Score Lyra high (0.7–1.0) when the gate.line is about musical enchantment, artistic creation, aesthetic power, creative collaboration, or immortalization through beauty and art. Score Lyra shadow (0.4–0.6) when it's artistic elitism, aesthetic superiority, grief that becomes identity, or progenitor pride. Give Lyra ~0 when the behavior is predator scanning or loyalty control (that's Draco), emotional mothering or caretaking (that's Pleiades), spiritual initiation through ordeal (that's Sirius/Orion-Light), frequency healing (that's Arcturus), or liberation from captivity (that's Andromeda)."
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
        "If the behavior is empire management, coercive control structures at scale, obedience enforcement across systems, psychological pressure infrastructure, or genetic manipulation for control, that's Orion-Dark.",
        "If the behavior is honorable trial, spiritual/warrior initiation, or ascending through ordeal in service to a higher code, that's Orion-Light, not Orion-Dark.",
        "If the behavior is predator scanning and loyalty enforcement at the tribal/survival level, that's Draco, not Orion-Dark (Orion-Dark operates at imperial/planetary scale, Draco is tribal/immediate).",
        "If the behavior is emotional co-regulation or caretaking panic, that's Pleiades, not Orion-Dark.",
        "If the behavior is spiritual initiation or sacred teaching for liberation, that's Sirius, not Orion-Dark.",
        "Orion-Dark is about empire-scale control and psychological manipulation, not tribal survival, emotional bonding, or honorable initiation."
      ],
      notes_for_alignment: "Score Orion-Dark high (0.7–1.0) when the gate.line is about empire management, coercive control structures at scale, obedience enforcement infrastructure, psychological pressure across systems, genetic manipulation for control, or service-to-self power consolidation. Score Orion-Dark shadow (0.4–0.6) when it's spiritual entropy, alliance instability, manipulation through fear, or enslavement as power source. Give Orion-Dark ~0 when the behavior is honorable trial or spiritual warrior initiation (that's Orion-Light), tribal predator scanning or loyalty enforcement (that's Draco—Orion-Dark is imperial, not tribal), emotional caretaking (that's Pleiades), or liberation teaching (that's Sirius)."
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
        "If the behavior is honorable trial, spiritual/warrior initiation, ascending through ordeal in service to a higher code, mystery school transmission, sacred knowledge preservation, or earning rank through courage and integrity, that's Orion-Light.",
        "If the behavior is empire management, coercive control structures, obedience enforcement, or psychological pressure at scale, that's Orion-Dark, not Orion-Light.",
        "If the behavior is predator scanning and loyalty enforcement at the tribal level, that's Draco, not Orion-Light.",
        "If the behavior is emotional co-regulation or caretaking, that's Pleiades, not Orion-Light.",
        "If the behavior is frequency healing or vibrational uplift, that's Arcturus, not Orion-Light.",
        "If the behavior is liberation teaching or spiritual instruction for freedom, that's Sirius, not Orion-Light (Sirius is about liberation, Orion-Light is about ordeal and mystery schools).",
        "Orion-Light is about initiation through ordeal and sacred teaching, not about empire control, emotional bonding, or liberation struggles."
      ],
      notes_for_alignment: "Score Orion-Light high (0.7–1.0) when the gate.line is about honorable trial, spiritual warrior initiation, ascending through ordeal in service to a higher code, mystery school preservation, sacred knowledge transmission, or earning rank through courage and integrity. Score Orion-Light shadow (0.4–0.6) when it's initiatory elitism, gatekeeping of sacred knowledge, ordeal fetishization, or spiritual pride in having 'passed the test'. Give Orion-Light ~0 when the behavior is empire management or coercive control (that's Orion-Dark), tribal predator scanning (that's Draco), emotional caretaking (that's Pleiades), frequency healing (that's Arcturus), or liberation teaching (that's Sirius—Sirius liberates, Orion-Light initiates through ordeal)."
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
        "If the behavior is liberation from captivity or anti-domination intervention, that's Andromeda, not Pleiades.",
        "Pleiades is about emotional safety and nurturing, not about power hierarchies, spiritual ordeals, frequency work, or liberation struggles."
      ],
      notes_for_alignment: "Score Pleiades high (0.7–1.0) when the gate.line is about keeping others emotionally safe, feeding/protecting the group, tending to need, calming nervous systems, or maternal bonding to ensure survival. Score Pleiades shadow (0.4–0.6) when it's anxious caretaking, guilt-binding love, emotional enmeshment, or escalating emotional crisis to hold closeness. Give Pleiades ~0 when the behavior is enforcement, loyalty testing, rank control, or domination through fear (that's Draco/Orion-Dark), hierarchical initiation or sacred trial (that's Sirius/Orion-Light), frequency calibration (that's Arcturus), or liberation from captivity (that's Andromeda)."
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
        "If the behavior is spiritual initiation, liberation through higher teaching, sacred instruction, cosmic law transmission, royal resurrection current, or path to freedom through advanced knowledge, that's Sirius.",
        "If the behavior is honorable trial or warrior initiation through ordeal, that's Orion-Light, not Sirius (Sirius is about liberation and teaching, Orion-Light is about ordeal and mystery schools).",
        "If the behavior is predator scanning or loyalty enforcement, that's Draco, not Sirius.",
        "If the behavior is emotional co-regulation or caretaking, that's Pleiades, not Sirius.",
        "If the behavior is frequency healing or vibrational uplift, that's Arcturus, not Sirius.",
        "If the behavior is empire management or coercive control, that's Orion-Dark, not Sirius.",
        "Sirius is about liberation through sacred teaching and spiritual initiation, not about dominance, emotional bonding, frequency work, or empire control."
      ],
      notes_for_alignment: "Score Sirius high (0.7–1.0) when the gate.line is about spiritual initiation, liberation through higher teaching, sacred instruction, cosmic law transmission, royal resurrection current, or path to freedom through advanced knowledge. Score Sirius shadow (0.4–0.6) when it's initiatory elitism, spiritual gatekeeping, dogmatic adherence to cosmic law without compassion, or spiritual hierarchy as power structure. Give Sirius ~0 when the behavior is honorable trial through ordeal (that's Orion-Light—Sirius liberates, Orion-Light tests), predator scanning or loyalty control (that's Draco), emotional caretaking (that's Pleiades), frequency healing (that's Arcturus), or empire management (that's Orion-Dark)."
    }
  };

  return digests[system];
}

/**
 * Main execution
 */
function main() {
  console.log('Finalizing mapping_digest for all star systems...\n');

  for (const system of STAR_SYSTEMS) {
    const filename = `${system}-baseline-4.2.json`;
    const filepath = path.join(BASELINE_DIR, filename);

    console.log(`Processing ${system}...`);

    // Read baseline file
    const baseline = JSON.parse(fs.readFileSync(filepath, 'utf-8'));

    // Generate complete mapping digest
    const mappingDigest = generateCompleteMappingDigest(system);

    // Update mapping_digest (replace existing one)
    baseline.mapping_digest = mappingDigest;

    // Write back to file with pretty formatting
    fs.writeFileSync(filepath, JSON.stringify(baseline, null, 2), 'utf-8');

    console.log(`  ✓ Updated mapping_digest in ${filename}`);
    console.log(`    - ${mappingDigest.core_themes.length} core themes`);
    console.log(`    - ${mappingDigest.shadow_themes.length} shadow themes`);
    console.log(`    - ${mappingDigest.quick_rules.length} quick rules`);
    console.log(`    - notes_for_alignment: ${mappingDigest.notes_for_alignment.substring(0, 60)}...\n`);
  }

  console.log('✓ All mapping_digest entries finalized successfully!');
}

main();
