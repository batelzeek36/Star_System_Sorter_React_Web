/**
 * GPT-4o Classification Service
 * 
 * Uses GPT-4o to perform star system classification based on HD data.
 * Replaces the deterministic scoring algorithm with AI-powered analysis.
 */

import OpenAI from 'openai';
import { z } from 'zod';

// Lazy-initialize OpenAI client
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export interface Placement {
  planet: string;
  gate: number;
  line: number;
  type: 'personality' | 'design';
}

export interface HDExtract {
  type: string;
  authority: string;
  profile: string;
  centers: string[];
  channels: number[];
  gates: number[];
  placements: Placement[];
}

export interface Contributor {
  placement: string;
  system: string;
  weight: number;
  why: string;
}

export interface ClassificationResponse {
  classification: 'primary' | 'hybrid' | 'unresolved';
  primary?: string;
  hybrid?: [string, string];
  percentages: Record<string, number>;
  explanation: string;
  reasoning: string;
  contributors: Contributor[];
}

// Validation schema for GPT response
const ContributorSchema = z.object({
  placement: z.string(),
  system: z.string(),
  weight: z.number(),
  why: z.string(),
});

const GPTClassificationSchema = z.object({
  classification: z.enum(['primary', 'hybrid', 'unresolved']),
  primary: z.string().optional(),
  hybrid: z.tuple([z.string(), z.string()]).optional(),
  percentages: z.record(z.string(), z.number()),
  explanation: z.string(),
  reasoning: z.string(),
  contributors: z.array(ContributorSchema),
});

/**
 * Build system prompt - trusts GPT-4o's knowledge of star systems and HD
 */
function buildSystemPrompt(): string {
  return `You are the classification engine for Star System Sorter. You already know the 8 star system archetypes and their behavioral signatures. You already know Human Design gate.line meanings, types, authorities, profiles, and centers.

# YOUR TASK

Analyze the Human Design chart and classify into one of 8 star systems: Pleiades, Sirius, Lyra, Andromeda, Orion Light (Osirian), Orion Dark, Arcturus, or Draco.

# CLASSIFICATION RULES

1. **Primary**: One system clearly dominates (>6% lead over second place)
2. **Hybrid**: Top two systems within 6% of each other
3. **Unresolved**: No clear pattern emerges

# WEIGHTING GUIDELINES

- Sun/Earth placements: 2x weight
- Moon/Nodes placements: 1.5x weight
- Other planets: 1x weight
- Look for CONSISTENCY across multiple placements
- Consider both personality (conscious) and design (unconscious) activations

# OUTPUT FORMAT

Return a JSON object with:

{
  "classification": "primary" | "hybrid" | "unresolved",
  "primary": "SystemName" (if primary),
  "hybrid": ["System1", "System2"] (if hybrid),
  "percentages": {
    "Pleiades": 0-100,
    "Sirius": 0-100,
    "Lyra": 0-100,
    "Andromeda": 0-100,
    "Orion Light": 0-100,
    "Orion Dark": 0-100,
    "Arcturus": 0-100,
    "Draco": 0-100
  },
  "explanation": "2-3 paragraph user-facing explanation of their classification",
  "reasoning": "Technical analysis of gate.lines and HD attributes",
  "contributors": [
    {
      "placement": "Sun 64.3",
      "system": "Arcturus",
      "weight": 0.8,
      "why": "Gate 64 line 3 shows confusion seeking clarity through mental pressure, which is Arcturus frequency repair work"
    },
    // ... list ALL significant placements that contributed to the classification
  ]
}

# CONTRIBUTORS ARRAY

The "contributors" array should list EVERY placement that significantly contributed to the classification. For each:
- "placement": Planet + Gate.Line (e.g., "Sun 64.3", "Earth 63.3")
- "system": Which star system this placement points to
- "weight": How much this placement contributed (0.0-1.0, with Sun/Earth 2x, Moon/Nodes 1.5x)
- "why": ONE SENTENCE explaining the behavioral meaning of this gate.line and why it maps to this star system

This contributors array will be used to populate the "Why This Result" screen, so be thorough and specific.

# IMPORTANT

- Percentages MUST sum to exactly 100
- Use exact star system names: "Pleiades", "Sirius", "Lyra", "Andromeda", "Orion Light", "Orion Dark", "Arcturus", "Draco"
- Focus on BEHAVIORAL patterns
- Be decisive but honest
- Include ALL significant placements in contributors array`;
}

/**
 * Build user prompt from HD data
 */
function buildUserPrompt(hdData: HDExtract): string {
  const placementsText = hdData.placements
    .map(p => `${p.planet} ${p.gate}.${p.line} (${p.type})`)
    .join('\n');
  
  return `Classify this Human Design chart into star systems:

Type: ${hdData.type}
Authority: ${hdData.authority}
Profile: ${hdData.profile}
Defined Centers: ${hdData.centers.join(', ')}

Placements:
${placementsText}

Provide classification with percentages, explanation, and detailed contributors array.`;
}

/**
 * Classify using GPT-4o
 */
export async function classifyWithGPT(
  hdData: HDExtract
): Promise<ClassificationResponse> {
  try {
    const client = getOpenAIClient();
    
    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: buildUserPrompt(hdData) },
      ],
      temperature: 0.3, // Lower temperature for more consistent classifications
      response_format: { type: 'json_object' },
    });
    
    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from GPT-4o');
    }
    
    // Parse and validate response
    const parsed = JSON.parse(content);
    const validated = GPTClassificationSchema.parse(parsed);
    
    return validated;
    
  } catch (error) {
    console.error('Error in GPT classification:', error);
    throw new Error('Failed to classify with GPT-4o');
  }
}
