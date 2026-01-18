/**
 * Unit tests for Insight Prompt Templates
 *
 * Tests verify:
 * - Template includes all comparison data
 * - Template includes relevant lore context
 * - Output prompt is under 20KB (fits in LLM context)
 * - Template instructs LLM to reference specific gates/systems
 * - Template forbids generic/vague language
 */

import { describe, it, expect } from 'vitest';
import type { HDExtract } from '../schemas';
import type { ChartComparison } from '../comparison';
import type { RelevantLore, GateLore } from '../lore-retriever';
import {
  generateSystemPrompt,
  generateUserPrompt,
  generateInsightPrompt,
  generateCombinedPrompt,
  parseInsightResponse,
  safeParseInsightResponse,
  isPromptSizeValid,
  estimatePromptSize,
  willPromptFitInLimit,
  extractGateReferences,
  extractSystemReferences,
  extractChannelReferences,
  validateInsightReferences,
  type Insight,
  type InsightRequest,
  type PromptResult,
  InsightSchema,
  InsightArraySchema,
} from './insight-templates';

// ============================================================================
// Test Fixtures
// ============================================================================

const mockChartA: HDExtract = {
  type: 'Generator',
  authority: 'Sacral',
  profile: '5/1',
  centers: ['Sacral', 'Throat', 'G Center'],
  channels: [1, 8],
  gates: [1, 8, 13, 33, 48],
};

const mockChartB: HDExtract = {
  type: 'Projector',
  authority: 'Splenic',
  profile: '2/4',
  centers: ['Spleen', 'G Center', 'Ajna'],
  channels: [7, 31],
  gates: [7, 13, 31, 33, 54],
};

const mockGateLore: (gate: number, line: number) => GateLore = (gate, line) => ({
  gate,
  line,
  hexagramName: `Hexagram ${gate}`,
  iChingMeaning: `Meaning for gate ${gate} line ${line}`,
  starMappings: [
    { system: 'Andromeda', weight: 2.5, why: 'Test rationale' },
  ],
});

const mockComparison: ChartComparison = {
  sharedGates: [
    { gate: 13, lineA: 3, lineB: 5 },
    { gate: 33, lineA: 1, lineB: 1 },
  ],
  sharedChannels: ['7-31'],
  sharedCenters: {
    bothDefined: ['G Center'],
    bothUndefined: ['Heart', 'Root'],
  },
  typeDynamic: {
    typeA: 'Generator',
    typeB: 'Projector',
    dynamic: 'Guidance dynamic; Projector directs Generator energy when recognized and invited',
  },
  starSystemOverlap: {
    shared: ['Andromeda'],
    divergent: ['Arcturus', 'Pleiades'],
  },
  compatibilityScores: {
    overall: 72,
    communication: 68,
    energy: 75,
  },
};

const mockRelevantLore: RelevantLore = {
  chartAGates: [
    mockGateLore(1, 1),
    mockGateLore(8, 2),
    mockGateLore(13, 3),
    mockGateLore(33, 1),
    mockGateLore(48, 4),
  ],
  chartBGates: [
    mockGateLore(7, 2),
    mockGateLore(13, 5),
    mockGateLore(31, 3),
    mockGateLore(33, 1),
    mockGateLore(54, 6),
  ],
  sharedGates: [
    mockGateLore(13, 3),
    mockGateLore(13, 5),
    mockGateLore(33, 1),
  ],
  totalContextSize: 3000,
};

const mockInsightRequest: InsightRequest = {
  chartA: mockChartA,
  chartB: mockChartB,
  comparison: mockComparison,
  lore: mockRelevantLore,
  nameA: 'Alice',
  nameB: 'Bob',
};

// Valid insight response for parsing tests
const validInsightResponse = JSON.stringify([
  {
    type: 'shared_resonance',
    title: 'Gate 13 Fellowship Connection',
    content: 'Both charts activate Gate 13 (The Listener/Fellowship). This creates a shared capacity for deep listening.',
    references: [
      { type: 'gate', value: '13' },
    ],
  },
  {
    type: 'type_dynamic',
    title: 'Generator-Projector Synergy',
    content: 'The Generator provides sustainable energy while the Projector offers guidance and direction.',
    references: [
      { type: 'system', value: 'Andromeda' },
    ],
  },
  {
    type: 'star_connection',
    title: 'Andromeda Alignment',
    content: 'Both share a connection to the Andromeda system, creating a cosmic resonance in their partnership.',
    references: [
      { type: 'system', value: 'Andromeda' },
    ],
  },
]);

// ============================================================================
// generateSystemPrompt Tests
// ============================================================================

describe('generateSystemPrompt', () => {
  it('should return a non-empty string', () => {
    const prompt = generateSystemPrompt();

    expect(typeof prompt).toBe('string');
    expect(prompt.length).toBeGreaterThan(0);
  });

  it('should include output format instructions', () => {
    const prompt = generateSystemPrompt();

    expect(prompt).toContain('JSON');
    expect(prompt).toContain('array');
  });

  it('should define all insight types', () => {
    const prompt = generateSystemPrompt();

    expect(prompt).toContain('shared_resonance');
    expect(prompt).toContain('type_dynamic');
    expect(prompt).toContain('star_connection');
    expect(prompt).toContain('tension');
    expect(prompt).toContain('advice');
  });

  it('should instruct to reference specific gates/systems', () => {
    const prompt = generateSystemPrompt();

    expect(prompt.toLowerCase()).toContain('specific');
    expect(prompt.toLowerCase()).toContain('reference');
    expect(prompt.toLowerCase()).toContain('gate');
  });

  it('should forbid generic/vague language', () => {
    const prompt = generateSystemPrompt();

    expect(prompt.toLowerCase()).toContain('generic');
    // Should mention avoiding vague statements
    expect(prompt.toLowerCase()).toMatch(/avoid|no|don't|never/);
  });

  it('should include example output format', () => {
    const prompt = generateSystemPrompt();

    expect(prompt).toContain('"type"');
    expect(prompt).toContain('"title"');
    expect(prompt).toContain('"content"');
    expect(prompt).toContain('"references"');
  });

  it('should be under 5KB', () => {
    const prompt = generateSystemPrompt();
    const size = new TextEncoder().encode(prompt).length;

    expect(size).toBeLessThan(5 * 1024);
  });
});

// ============================================================================
// generateUserPrompt Tests
// ============================================================================

describe('generateUserPrompt', () => {
  it('should include chart A data', () => {
    const prompt = generateUserPrompt(mockInsightRequest);

    expect(prompt).toContain(mockChartA.type);
    expect(prompt).toContain(mockChartA.authority);
    expect(prompt).toContain(mockChartA.profile);
  });

  it('should include chart B data', () => {
    const prompt = generateUserPrompt(mockInsightRequest);

    expect(prompt).toContain(mockChartB.type);
    expect(prompt).toContain(mockChartB.authority);
    expect(prompt).toContain(mockChartB.profile);
  });

  it('should include comparison data - shared gates', () => {
    const prompt = generateUserPrompt(mockInsightRequest);

    expect(prompt).toContain('Gate 13');
    expect(prompt).toContain('Gate 33');
  });

  it('should include comparison data - type dynamic', () => {
    const prompt = generateUserPrompt(mockInsightRequest);

    expect(prompt).toContain('Generator');
    expect(prompt).toContain('Projector');
    expect(prompt).toContain('Guidance dynamic');
  });

  it('should include comparison data - star system overlap', () => {
    const prompt = generateUserPrompt(mockInsightRequest);

    expect(prompt).toContain('Andromeda');
  });

  it('should include comparison data - compatibility scores', () => {
    const prompt = generateUserPrompt(mockInsightRequest);

    expect(prompt).toContain('72%');
    expect(prompt).toContain('68%');
    expect(prompt).toContain('75%');
  });

  it('should include lore context for chart A gates', () => {
    const prompt = generateUserPrompt(mockInsightRequest);

    expect(prompt).toContain('Gate 1.1');
    expect(prompt).toContain('Hexagram 1');
    expect(prompt).toContain('Meaning for gate 1');
  });

  it('should include lore context for chart B gates', () => {
    const prompt = generateUserPrompt(mockInsightRequest);

    expect(prompt).toContain('Gate 7.2');
    expect(prompt).toContain('Hexagram 7');
  });

  it('should include star mappings in lore context', () => {
    const prompt = generateUserPrompt(mockInsightRequest);

    expect(prompt).toContain('Star Systems');
    expect(prompt).toContain('Andromeda');
    expect(prompt).toContain('weight');
  });

  it('should use custom names when provided', () => {
    const prompt = generateUserPrompt(mockInsightRequest);

    expect(prompt).toContain('Alice');
    expect(prompt).toContain('Bob');
  });

  it('should use default names when not provided', () => {
    const requestWithoutNames = { ...mockInsightRequest, nameA: undefined, nameB: undefined };
    const prompt = generateUserPrompt(requestWithoutNames);

    expect(prompt).toContain('Person A');
    expect(prompt).toContain('Person B');
  });

  it('should include shared channels', () => {
    const prompt = generateUserPrompt(mockInsightRequest);

    expect(prompt).toContain('7-31');
  });

  it('should include shared centers information', () => {
    const prompt = generateUserPrompt(mockInsightRequest);

    expect(prompt).toContain('G Center');
    expect(prompt).toContain('Both Defined');
    expect(prompt).toContain('Both Undefined');
  });
});

// ============================================================================
// generateInsightPrompt Tests
// ============================================================================

describe('generateInsightPrompt', () => {
  it('should return PromptResult with all required fields', () => {
    const result = generateInsightPrompt(mockInsightRequest);

    expect(result).toHaveProperty('systemPrompt');
    expect(result).toHaveProperty('userPrompt');
    expect(result).toHaveProperty('totalSize');
    expect(result).toHaveProperty('isWithinLimit');
  });

  it('should calculate totalSize correctly', () => {
    const result = generateInsightPrompt(mockInsightRequest);

    const expectedSize = new TextEncoder().encode(result.systemPrompt).length +
                        new TextEncoder().encode(result.userPrompt).length;

    expect(result.totalSize).toBe(expectedSize);
  });

  it('should be under 20KB for typical requests', () => {
    const result = generateInsightPrompt(mockInsightRequest);

    expect(result.totalSize).toBeLessThan(20 * 1024);
    expect(result.isWithinLimit).toBe(true);
  });

  it('should set isWithinLimit correctly', () => {
    const result = generateInsightPrompt(mockInsightRequest);

    expect(result.isWithinLimit).toBe(result.totalSize <= 20 * 1024);
  });
});

// ============================================================================
// generateCombinedPrompt Tests
// ============================================================================

describe('generateCombinedPrompt', () => {
  it('should combine system and user prompts', () => {
    const combined = generateCombinedPrompt(mockInsightRequest);
    const { systemPrompt, userPrompt } = generateInsightPrompt(mockInsightRequest);

    expect(combined).toContain(systemPrompt);
    expect(combined).toContain(userPrompt);
  });

  it('should be a non-empty string', () => {
    const combined = generateCombinedPrompt(mockInsightRequest);

    expect(typeof combined).toBe('string');
    expect(combined.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// parseInsightResponse Tests
// ============================================================================

describe('parseInsightResponse', () => {
  it('should parse valid JSON response', () => {
    const insights = parseInsightResponse(validInsightResponse);

    expect(Array.isArray(insights)).toBe(true);
    expect(insights.length).toBe(3);
  });

  it('should parse response wrapped in markdown code block', () => {
    const wrappedResponse = '```json\n' + validInsightResponse + '\n```';
    const insights = parseInsightResponse(wrappedResponse);

    expect(insights.length).toBe(3);
  });

  it('should parse response wrapped in plain code block', () => {
    const wrappedResponse = '```\n' + validInsightResponse + '\n```';
    const insights = parseInsightResponse(wrappedResponse);

    expect(insights.length).toBe(3);
  });

  it('should throw error for invalid JSON', () => {
    expect(() => parseInsightResponse('not json')).toThrow('Failed to parse');
  });

  it('should throw error for empty array', () => {
    expect(() => parseInsightResponse('[]')).toThrow();
  });

  it('should throw error for array with too few items', () => {
    const tooFewItems = JSON.stringify([
      {
        type: 'shared_resonance',
        title: 'Test',
        content: 'Test content for the insight that is long enough.',
        references: [{ type: 'gate', value: '13' }],
      },
    ]);

    expect(() => parseInsightResponse(tooFewItems)).toThrow();
  });

  it('should throw error for invalid insight type', () => {
    const invalidType = JSON.stringify([
      {
        type: 'invalid_type',
        title: 'Test',
        content: 'Test content for the insight.',
        references: [{ type: 'gate', value: '13' }],
      },
      {
        type: 'shared_resonance',
        title: 'Test 2',
        content: 'Test content for the second insight.',
        references: [{ type: 'gate', value: '13' }],
      },
      {
        type: 'advice',
        title: 'Test 3',
        content: 'Test content for the third insight.',
        references: [{ type: 'gate', value: '13' }],
      },
    ]);

    expect(() => parseInsightResponse(invalidType)).toThrow();
  });

  it('should throw error for missing required fields', () => {
    const missingFields = JSON.stringify([
      {
        type: 'shared_resonance',
        title: 'Test',
        // missing content
        references: [{ type: 'gate', value: '13' }],
      },
    ]);

    expect(() => parseInsightResponse(missingFields)).toThrow();
  });

  it('should throw error for empty references array', () => {
    const emptyRefs = JSON.stringify([
      {
        type: 'shared_resonance',
        title: 'Test',
        content: 'Test content for the insight that is long enough.',
        references: [], // Empty references not allowed
      },
      {
        type: 'advice',
        title: 'Test 2',
        content: 'Test content for the second insight.',
        references: [{ type: 'gate', value: '13' }],
      },
      {
        type: 'tension',
        title: 'Test 3',
        content: 'Test content for the third insight.',
        references: [{ type: 'gate', value: '13' }],
      },
    ]);

    expect(() => parseInsightResponse(emptyRefs)).toThrow();
  });

  it('should correctly extract insight data', () => {
    const insights = parseInsightResponse(validInsightResponse);

    expect(insights[0].type).toBe('shared_resonance');
    expect(insights[0].title).toBe('Gate 13 Fellowship Connection');
    expect(insights[0].references[0].type).toBe('gate');
    expect(insights[0].references[0].value).toBe('13');
  });
});

// ============================================================================
// safeParseInsightResponse Tests
// ============================================================================

describe('safeParseInsightResponse', () => {
  it('should return success true for valid response', () => {
    const result = safeParseInsightResponse(validInsightResponse);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.length).toBe(3);
    }
  });

  it('should return success false for invalid response', () => {
    const result = safeParseInsightResponse('invalid json');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeDefined();
    }
  });

  it('should not throw for invalid input', () => {
    expect(() => safeParseInsightResponse('{')).not.toThrow();
    expect(() => safeParseInsightResponse('')).not.toThrow();
  });
});

// ============================================================================
// isPromptSizeValid Tests
// ============================================================================

describe('isPromptSizeValid', () => {
  it('should return true for small prompts', () => {
    const result: PromptResult = {
      systemPrompt: 'test',
      userPrompt: 'test',
      totalSize: 1000,
      isWithinLimit: true,
    };

    expect(isPromptSizeValid(result)).toBe(true);
  });

  it('should return false for oversized prompts', () => {
    const result: PromptResult = {
      systemPrompt: 'test',
      userPrompt: 'test',
      totalSize: 25 * 1024, // 25KB
      isWithinLimit: false,
    };

    expect(isPromptSizeValid(result)).toBe(false);
  });

  it('should respect custom maxSize parameter', () => {
    const result: PromptResult = {
      systemPrompt: 'test',
      userPrompt: 'test',
      totalSize: 5000,
      isWithinLimit: true,
    };

    expect(isPromptSizeValid(result, 4000)).toBe(false);
    expect(isPromptSizeValid(result, 6000)).toBe(true);
  });
});

// ============================================================================
// estimatePromptSize Tests
// ============================================================================

describe('estimatePromptSize', () => {
  it('should return a positive number', () => {
    const estimate = estimatePromptSize(mockChartA, mockChartB, 3000);

    expect(typeof estimate).toBe('number');
    expect(estimate).toBeGreaterThan(0);
  });

  it('should increase with larger lore context', () => {
    const smallLore = estimatePromptSize(mockChartA, mockChartB, 1000);
    const largeLore = estimatePromptSize(mockChartA, mockChartB, 5000);

    expect(largeLore).toBeGreaterThan(smallLore);
  });

  it('should be reasonably close to actual size', () => {
    const estimate = estimatePromptSize(mockChartA, mockChartB, mockRelevantLore.totalContextSize);
    const actual = generateInsightPrompt(mockInsightRequest).totalSize;

    // Estimate should be within 50% of actual
    expect(estimate).toBeGreaterThan(actual * 0.5);
    expect(estimate).toBeLessThan(actual * 1.5);
  });
});

// ============================================================================
// willPromptFitInLimit Tests
// ============================================================================

describe('willPromptFitInLimit', () => {
  it('should return true for typical charts with small lore', () => {
    const willFit = willPromptFitInLimit(mockChartA, mockChartB, 3000);

    expect(willFit).toBe(true);
  });

  it('should return false for very large lore context', () => {
    const willFit = willPromptFitInLimit(mockChartA, mockChartB, 50000);

    expect(willFit).toBe(false);
  });

  it('should respect custom maxSize parameter', () => {
    const willFitSmall = willPromptFitInLimit(mockChartA, mockChartB, 3000, 5000);
    const willFitLarge = willPromptFitInLimit(mockChartA, mockChartB, 3000, 50000);

    expect(willFitSmall).toBe(false);
    expect(willFitLarge).toBe(true);
  });
});

// ============================================================================
// extractGateReferences Tests
// ============================================================================

describe('extractGateReferences', () => {
  const mockInsights: Insight[] = [
    {
      type: 'shared_resonance',
      title: 'Test',
      content: 'Test content',
      references: [
        { type: 'gate', value: '13' },
        { type: 'gate', value: '33' },
      ],
    },
    {
      type: 'advice',
      title: 'Test 2',
      content: 'Test content',
      references: [
        { type: 'gate', value: '13' },
        { type: 'system', value: 'Andromeda' },
      ],
    },
  ];

  it('should extract unique gate numbers', () => {
    const gates = extractGateReferences(mockInsights);

    expect(gates).toContain(13);
    expect(gates).toContain(33);
    expect(gates.length).toBe(2); // No duplicates
  });

  it('should return sorted array', () => {
    const gates = extractGateReferences(mockInsights);

    expect(gates).toEqual([13, 33]);
  });

  it('should ignore non-gate references', () => {
    const gates = extractGateReferences(mockInsights);

    // Should not include 'Andromeda' or any system
    expect(gates.every(g => typeof g === 'number')).toBe(true);
  });

  it('should return empty array for no gate references', () => {
    const noGateInsights: Insight[] = [
      {
        type: 'star_connection',
        title: 'Test',
        content: 'Test content',
        references: [{ type: 'system', value: 'Andromeda' }],
      },
    ];

    const gates = extractGateReferences(noGateInsights);

    expect(gates).toEqual([]);
  });
});

// ============================================================================
// extractSystemReferences Tests
// ============================================================================

describe('extractSystemReferences', () => {
  const mockInsights: Insight[] = [
    {
      type: 'star_connection',
      title: 'Test',
      content: 'Test content',
      references: [
        { type: 'system', value: 'Andromeda' },
        { type: 'system', value: 'Pleiades' },
      ],
    },
  ];

  it('should extract system names', () => {
    const systems = extractSystemReferences(mockInsights);

    expect(systems).toContain('Andromeda');
    expect(systems).toContain('Pleiades');
  });

  it('should return sorted array', () => {
    const systems = extractSystemReferences(mockInsights);

    expect(systems).toEqual(['Andromeda', 'Pleiades']);
  });
});

// ============================================================================
// extractChannelReferences Tests
// ============================================================================

describe('extractChannelReferences', () => {
  const mockInsights: Insight[] = [
    {
      type: 'shared_resonance',
      title: 'Test',
      content: 'Test content',
      references: [
        { type: 'channel', value: '7-31' },
        { type: 'channel', value: '1-8' },
      ],
    },
  ];

  it('should extract channel names', () => {
    const channels = extractChannelReferences(mockInsights);

    expect(channels).toContain('7-31');
    expect(channels).toContain('1-8');
  });

  it('should return sorted array', () => {
    const channels = extractChannelReferences(mockInsights);

    expect(channels).toEqual(['1-8', '7-31']);
  });
});

// ============================================================================
// validateInsightReferences Tests
// ============================================================================

describe('validateInsightReferences', () => {
  it('should return valid true when all gate references exist in charts', () => {
    const validInsights: Insight[] = [
      {
        type: 'shared_resonance',
        title: 'Test',
        content: 'Test content',
        references: [
          { type: 'gate', value: '13' }, // In both charts
          { type: 'gate', value: '1' }, // In chart A
        ],
      },
    ];

    const result = validateInsightReferences(validInsights, mockChartA, mockChartB);

    expect(result.valid).toBe(true);
    expect(result.invalidReferences).toEqual([]);
  });

  it('should return valid false when gate references do not exist', () => {
    const invalidInsights: Insight[] = [
      {
        type: 'shared_resonance',
        title: 'Test',
        content: 'Test content',
        references: [
          { type: 'gate', value: '99' }, // Not in either chart
        ],
      },
    ];

    const result = validateInsightReferences(invalidInsights, mockChartA, mockChartB);

    expect(result.valid).toBe(false);
    expect(result.invalidReferences.length).toBe(1);
    expect(result.invalidReferences[0].value).toBe('99');
  });

  it('should not check system or channel references', () => {
    const systemInsights: Insight[] = [
      {
        type: 'star_connection',
        title: 'Test',
        content: 'Test content',
        references: [
          { type: 'system', value: 'NonexistentSystem' },
        ],
      },
    ];

    const result = validateInsightReferences(systemInsights, mockChartA, mockChartB);

    expect(result.valid).toBe(true); // Only validates gate references
  });
});

// ============================================================================
// Zod Schema Tests
// ============================================================================

describe('InsightSchema', () => {
  it('should validate correct insight', () => {
    const validInsight = {
      type: 'shared_resonance',
      title: 'Test Title',
      content: 'This is test content that is long enough to pass validation.',
      references: [{ type: 'gate', value: '13' }],
    };

    const result = InsightSchema.safeParse(validInsight);

    expect(result.success).toBe(true);
  });

  it('should reject empty title', () => {
    const invalidInsight = {
      type: 'shared_resonance',
      title: '',
      content: 'Valid content that is long enough.',
      references: [{ type: 'gate', value: '13' }],
    };

    const result = InsightSchema.safeParse(invalidInsight);

    expect(result.success).toBe(false);
  });

  it('should reject content that is too short', () => {
    const invalidInsight = {
      type: 'shared_resonance',
      title: 'Valid Title',
      content: 'Short',
      references: [{ type: 'gate', value: '13' }],
    };

    const result = InsightSchema.safeParse(invalidInsight);

    expect(result.success).toBe(false);
  });

  it('should reject empty references', () => {
    const invalidInsight = {
      type: 'shared_resonance',
      title: 'Valid Title',
      content: 'Valid content that is long enough.',
      references: [],
    };

    const result = InsightSchema.safeParse(invalidInsight);

    expect(result.success).toBe(false);
  });
});

describe('InsightArraySchema', () => {
  it('should require minimum 3 insights', () => {
    const twoInsights = [
      {
        type: 'shared_resonance',
        title: 'Test 1',
        content: 'Content for test one that is long enough.',
        references: [{ type: 'gate', value: '13' }],
      },
      {
        type: 'advice',
        title: 'Test 2',
        content: 'Content for test two that is long enough.',
        references: [{ type: 'gate', value: '33' }],
      },
    ];

    const result = InsightArraySchema.safeParse(twoInsights);

    expect(result.success).toBe(false);
  });

  it('should allow maximum 7 insights', () => {
    const eightInsights = Array(8).fill(null).map((_, i) => ({
      type: 'shared_resonance',
      title: `Test ${i + 1}`,
      content: `Content for test ${i + 1} that is long enough.`,
      references: [{ type: 'gate', value: '13' }],
    }));

    const result = InsightArraySchema.safeParse(eightInsights);

    expect(result.success).toBe(false);
  });

  it('should accept valid array of 3-7 insights', () => {
    const validInsights = Array(5).fill(null).map((_, i) => ({
      type: 'shared_resonance',
      title: `Test ${i + 1}`,
      content: `Content for test ${i + 1} that is long enough.`,
      references: [{ type: 'gate', value: '13' }],
    }));

    const result = InsightArraySchema.safeParse(validInsights);

    expect(result.success).toBe(true);
  });
});

// ============================================================================
// Prompt Content Requirements Tests
// ============================================================================

describe('Prompt Content Requirements', () => {
  it('should include all required comparison data sections', () => {
    const prompt = generateUserPrompt(mockInsightRequest);

    // Check for required sections
    expect(prompt).toContain('Chart A');
    expect(prompt).toContain('Chart B');
    expect(prompt).toContain('Type Dynamic');
    expect(prompt).toContain('Shared Gates');
    expect(prompt).toContain('Shared Centers');
    expect(prompt).toContain('Compatibility Scores');
  });

  it('should include lore context sections', () => {
    const prompt = generateUserPrompt(mockInsightRequest);

    expect(prompt).toContain('I Ching Lore Context');
    expect(prompt).toContain('Gate Meanings');
  });

  it('system prompt should instruct about specificity', () => {
    const prompt = generateSystemPrompt();

    // Should mention being specific
    expect(prompt.toLowerCase()).toMatch(/specific/);

    // Should mention referencing gates/systems
    expect(prompt.toLowerCase()).toMatch(/reference/);
    expect(prompt.toLowerCase()).toMatch(/gate/);
  });

  it('system prompt should instruct about JSON output', () => {
    const prompt = generateSystemPrompt();

    expect(prompt).toContain('JSON');
    expect(prompt).toContain('[');
    expect(prompt).toContain(']');
  });
});

// ============================================================================
// Edge Cases Tests
// ============================================================================

describe('Edge Cases', () => {
  it('should handle empty gates arrays', () => {
    const emptyChartA: HDExtract = { ...mockChartA, gates: [] };
    const emptyChartB: HDExtract = { ...mockChartB, gates: [] };
    const emptyLore: RelevantLore = {
      chartAGates: [],
      chartBGates: [],
      sharedGates: [],
      totalContextSize: 100,
    };

    const request: InsightRequest = {
      chartA: emptyChartA,
      chartB: emptyChartB,
      comparison: { ...mockComparison, sharedGates: [] },
      lore: emptyLore,
    };

    const result = generateInsightPrompt(request);

    expect(result.systemPrompt).toBeDefined();
    expect(result.userPrompt).toBeDefined();
    expect(result.isWithinLimit).toBe(true);
  });

  it('should handle no shared gates or channels', () => {
    const noSharedComparison: ChartComparison = {
      ...mockComparison,
      sharedGates: [],
      sharedChannels: [],
    };

    const request: InsightRequest = {
      ...mockInsightRequest,
      comparison: noSharedComparison,
    };

    const prompt = generateUserPrompt(request);

    expect(prompt).toContain('No shared gates');
  });

  it('should handle no star system overlap', () => {
    const noOverlapComparison: ChartComparison = {
      ...mockComparison,
      starSystemOverlap: { shared: [], divergent: [] },
    };

    const request: InsightRequest = {
      ...mockInsightRequest,
      comparison: noOverlapComparison,
    };

    const prompt = generateUserPrompt(request);

    expect(prompt).toContain('No significant star system');
  });

  it('should handle large lore arrays gracefully', () => {
    // Create a large lore array
    const largeLore: RelevantLore = {
      chartAGates: Array(30).fill(null).map((_, i) => mockGateLore(i % 64 + 1, (i % 6) + 1)),
      chartBGates: Array(30).fill(null).map((_, i) => mockGateLore((i + 10) % 64 + 1, (i % 6) + 1)),
      sharedGates: Array(10).fill(null).map((_, i) => mockGateLore(i % 64 + 1, (i % 6) + 1)),
      totalContextSize: 10000,
    };

    const request: InsightRequest = {
      ...mockInsightRequest,
      lore: largeLore,
    };

    const result = generateInsightPrompt(request);

    // Should still be under limit due to truncation
    expect(result.isWithinLimit).toBe(true);
  });

  it('should handle same line for both charts in shared gates', () => {
    const sameLineComparison: ChartComparison = {
      ...mockComparison,
      sharedGates: [
        { gate: 13, lineA: 3, lineB: 3 }, // Same line
      ],
    };

    const request: InsightRequest = {
      ...mockInsightRequest,
      comparison: sameLineComparison,
    };

    const prompt = generateUserPrompt(request);

    expect(prompt).toContain('same line');
    expect(prompt).toContain('deep resonance');
  });
});

// ============================================================================
// Size Constraint Tests (Critical Acceptance Criteria)
// ============================================================================

describe('Size Constraints', () => {
  it('should produce prompts under 20KB for typical requests', () => {
    const result = generateInsightPrompt(mockInsightRequest);

    expect(result.totalSize).toBeLessThan(20 * 1024);
    expect(result.isWithinLimit).toBe(true);
  });

  it('should produce prompts under 20KB even with maximum lore', () => {
    // Maximum lore scenario
    const maxLore: RelevantLore = {
      chartAGates: Array(26).fill(null).map((_, i) => mockGateLore(i + 1, (i % 6) + 1)),
      chartBGates: Array(26).fill(null).map((_, i) => mockGateLore(i + 32, (i % 6) + 1)),
      sharedGates: Array(10).fill(null).map((_, i) => mockGateLore(i + 1, (i % 6) + 1)),
      totalContextSize: 12000,
    };

    const request: InsightRequest = {
      ...mockInsightRequest,
      lore: maxLore,
    };

    const result = generateInsightPrompt(request);

    expect(result.totalSize).toBeLessThan(20 * 1024);
  });

  it('combined prompt should also be under 20KB', () => {
    const combined = generateCombinedPrompt(mockInsightRequest);
    const size = new TextEncoder().encode(combined).length;

    expect(size).toBeLessThan(20 * 1024);
  });
});
