/**
 * Insight Generator Service Tests
 *
 * Tests for the insight generation service including:
 * - Prompt generation
 * - Response parsing and validation
 * - OpenAI integration (mocked)
 * - Error handling
 * - Fallback insights
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  generateSystemPrompt,
  generateUserPrompt,
  generateInsightPrompt,
  parseInsightResponse,
  safeParseInsightResponse,
  generateInsights,
  generateFallbackInsights,
  generateInsightsWithFallback,
  setOpenAIClient,
  resetOpenAIClient,
  InsightArraySchema,
  InsightSchema,
  InsightReferenceSchema,
  InsightTypeSchema,
  type InsightRequest,
  type Insight,
  type HDExtract,
  type ChartComparison,
  type RelevantLore,
  type GateLore,
} from './insight-generator.js';

// ============================================================================
// Test Data Fixtures
// ============================================================================

const mockChartA: HDExtract = {
  type: 'Generator',
  authority: 'Sacral',
  profile: '2/4',
  centers: ['Throat', 'Sacral', 'Root'],
  channels: [13, 34],
  gates: [13, 33, 34, 20, 57],
};

const mockChartB: HDExtract = {
  type: 'Projector',
  authority: 'Splenic',
  profile: '1/3',
  centers: ['Throat', 'Ajna', 'Spleen'],
  channels: [16, 48],
  gates: [13, 16, 48, 57, 20],
};

const mockComparison: ChartComparison = {
  sharedGates: [
    { gate: 13, lineA: 2, lineB: 5 },
    { gate: 57, lineA: 1, lineB: 3 },
    { gate: 20, lineA: 4, lineB: 2 },
  ],
  sharedChannels: ['20-57'],
  sharedCenters: {
    bothDefined: ['Throat'],
    bothUndefined: ['Heart', 'G Center'],
  },
  typeDynamic: {
    typeA: 'Generator',
    typeB: 'Projector',
    dynamic: 'Guidance dynamic; Projector directs Generator energy when recognized and invited',
  },
  starSystemOverlap: {
    shared: ['Sirian', 'Pleiadian'],
    divergent: ['Arcturian', 'Andromedan'],
  },
  compatibilityScores: {
    overall: 75,
    communication: 80,
    energy: 70,
  },
};

const mockGateLore: GateLore = {
  gate: 13,
  line: 2,
  hexagramName: 'Fellowship',
  iChingMeaning: 'Listening; shared secrets, collective memory. Line 2: natural; hermitic; projecting potential outward',
  starMappings: [
    { system: 'Sirian', weight: 3, why: 'Gate 13 connects to Sirian wisdom' },
  ],
};

const mockLore: RelevantLore = {
  chartAGates: [
    mockGateLore,
    { gate: 33, line: 4, hexagramName: 'Retreat', iChingMeaning: 'Privacy; retreat, memory', starMappings: [] },
  ],
  chartBGates: [
    { gate: 13, line: 5, hexagramName: 'Fellowship', iChingMeaning: 'Listening; shared secrets', starMappings: [] },
    { gate: 16, line: 1, hexagramName: 'Enthusiasm', iChingMeaning: 'Skills; talent', starMappings: [] },
  ],
  sharedGates: [mockGateLore],
  totalContextSize: 5000,
};

const mockInsightRequest: InsightRequest = {
  chartA: mockChartA,
  chartB: mockChartB,
  comparison: mockComparison,
  lore: mockLore,
  nameA: 'Alice',
  nameB: 'Bob',
};

const validInsightResponse = JSON.stringify([
  {
    type: 'shared_resonance',
    title: 'Gate 13 Fellowship Connection',
    content: 'Both Alice and Bob share Gate 13 (Fellowship/The Listener). This creates a profound capacity for holding space and keeping secrets. Alice with Line 2 brings natural receptivity, while Bob with Line 5 adds universal appeal.',
    references: [{ type: 'gate', value: '13' }],
  },
  {
    type: 'type_dynamic',
    title: 'Generator-Projector Guidance',
    content: 'The Generator-Projector dynamic creates a powerful guidance relationship. Bob as Projector can recognize and direct Alice\'s sustainable Sacral energy when properly recognized and invited.',
    references: [{ type: 'system', value: 'Generator' }, { type: 'system', value: 'Projector' }],
  },
  {
    type: 'star_connection',
    title: 'Sirian Wisdom Alignment',
    content: 'Both individuals share a connection to the Sirian star system through their Gate 13 activations. This suggests aligned cosmic origins in wisdom traditions and collective consciousness.',
    references: [{ type: 'system', value: 'Sirian' }, { type: 'gate', value: '13' }],
  },
]);

// ============================================================================
// Zod Schema Tests
// ============================================================================

describe('Zod Schemas', () => {
  describe('InsightTypeSchema', () => {
    it('should validate valid insight types', () => {
      expect(InsightTypeSchema.safeParse('shared_resonance').success).toBe(true);
      expect(InsightTypeSchema.safeParse('type_dynamic').success).toBe(true);
      expect(InsightTypeSchema.safeParse('star_connection').success).toBe(true);
      expect(InsightTypeSchema.safeParse('tension').success).toBe(true);
      expect(InsightTypeSchema.safeParse('advice').success).toBe(true);
    });

    it('should reject invalid insight types', () => {
      expect(InsightTypeSchema.safeParse('invalid_type').success).toBe(false);
      expect(InsightTypeSchema.safeParse('').success).toBe(false);
      expect(InsightTypeSchema.safeParse(123).success).toBe(false);
    });
  });

  describe('InsightReferenceSchema', () => {
    it('should validate valid references', () => {
      expect(InsightReferenceSchema.safeParse({ type: 'gate', value: '13' }).success).toBe(true);
      expect(InsightReferenceSchema.safeParse({ type: 'channel', value: '20-57' }).success).toBe(true);
      expect(InsightReferenceSchema.safeParse({ type: 'system', value: 'Sirian' }).success).toBe(true);
    });

    it('should reject invalid references', () => {
      expect(InsightReferenceSchema.safeParse({ type: 'invalid', value: '13' }).success).toBe(false);
      expect(InsightReferenceSchema.safeParse({ type: 'gate', value: '' }).success).toBe(false);
      expect(InsightReferenceSchema.safeParse({ type: 'gate' }).success).toBe(false);
    });
  });

  describe('InsightSchema', () => {
    it('should validate a valid insight', () => {
      const insight: Insight = {
        type: 'shared_resonance',
        title: 'Gate 13 Connection',
        content: 'Both charts share Gate 13, creating a deep resonance in listening and holding space for others.',
        references: [{ type: 'gate', value: '13' }],
      };
      expect(InsightSchema.safeParse(insight).success).toBe(true);
    });

    it('should reject insight with missing required fields', () => {
      expect(InsightSchema.safeParse({ type: 'shared_resonance' }).success).toBe(false);
      expect(InsightSchema.safeParse({ type: 'shared_resonance', title: 'Test' }).success).toBe(false);
    });

    it('should reject insight with empty references', () => {
      const insight = {
        type: 'shared_resonance',
        title: 'Test Title',
        content: 'This is a valid content that is long enough to pass validation.',
        references: [],
      };
      expect(InsightSchema.safeParse(insight).success).toBe(false);
    });

    it('should reject insight with title too long', () => {
      const insight = {
        type: 'shared_resonance',
        title: 'A'.repeat(101),
        content: 'Valid content that is long enough to pass the minimum length validation.',
        references: [{ type: 'gate', value: '13' }],
      };
      expect(InsightSchema.safeParse(insight).success).toBe(false);
    });

    it('should reject insight with content too short', () => {
      const insight = {
        type: 'shared_resonance',
        title: 'Valid Title',
        content: 'Short',
        references: [{ type: 'gate', value: '13' }],
      };
      expect(InsightSchema.safeParse(insight).success).toBe(false);
    });
  });

  describe('InsightArraySchema', () => {
    it('should validate array of 3-7 insights', () => {
      const insights: Insight[] = JSON.parse(validInsightResponse);
      expect(InsightArraySchema.safeParse(insights).success).toBe(true);
    });

    it('should reject array with less than 3 insights', () => {
      const insights = [
        {
          type: 'shared_resonance',
          title: 'Test',
          content: 'Valid content that is long enough to pass validation.',
          references: [{ type: 'gate', value: '13' }],
        },
        {
          type: 'type_dynamic',
          title: 'Test 2',
          content: 'Another valid content that is long enough to pass validation.',
          references: [{ type: 'system', value: 'Generator' }],
        },
      ];
      expect(InsightArraySchema.safeParse(insights).success).toBe(false);
    });

    it('should reject array with more than 7 insights', () => {
      const insights = Array(8).fill({
        type: 'shared_resonance',
        title: 'Test',
        content: 'Valid content that is long enough to pass validation.',
        references: [{ type: 'gate', value: '13' }],
      });
      expect(InsightArraySchema.safeParse(insights).success).toBe(false);
    });
  });
});

// ============================================================================
// Prompt Generation Tests
// ============================================================================

describe('Prompt Generation', () => {
  describe('generateSystemPrompt', () => {
    it('should return a non-empty string', () => {
      const prompt = generateSystemPrompt();
      expect(typeof prompt).toBe('string');
      expect(prompt.length).toBeGreaterThan(0);
    });

    it('should include output format instructions', () => {
      const prompt = generateSystemPrompt();
      expect(prompt).toContain('JSON array');
      expect(prompt).toContain('shared_resonance');
      expect(prompt).toContain('type_dynamic');
      expect(prompt).toContain('star_connection');
      expect(prompt).toContain('tension');
      expect(prompt).toContain('advice');
    });

    it('should include critical rules', () => {
      const prompt = generateSystemPrompt();
      expect(prompt).toContain('BE SPECIFIC');
      expect(prompt).toContain('NO GENERIC STATEMENTS');
      expect(prompt).toContain('CITE REFERENCES');
    });
  });

  describe('generateUserPrompt', () => {
    it('should include chart data for both people', () => {
      const prompt = generateUserPrompt(mockInsightRequest);
      expect(prompt).toContain('Alice');
      expect(prompt).toContain('Bob');
      expect(prompt).toContain('Generator');
      expect(prompt).toContain('Projector');
    });

    it('should include comparison results', () => {
      const prompt = generateUserPrompt(mockInsightRequest);
      expect(prompt).toContain('Shared Gates');
      expect(prompt).toContain('Gate 13');
      expect(prompt).toContain('Throat');
    });

    it('should include star system information', () => {
      const prompt = generateUserPrompt(mockInsightRequest);
      expect(prompt).toContain('Sirian');
      expect(prompt).toContain('Pleiadian');
    });

    it('should include lore context', () => {
      const prompt = generateUserPrompt(mockInsightRequest);
      expect(prompt).toContain('Fellowship');
      expect(prompt).toContain('I Ching');
    });

    it('should use default names when not provided', () => {
      const request = { ...mockInsightRequest, nameA: undefined, nameB: undefined };
      const prompt = generateUserPrompt(request);
      expect(prompt).toContain('Person A');
      expect(prompt).toContain('Person B');
    });
  });

  describe('generateInsightPrompt', () => {
    it('should return system and user prompts', () => {
      const result = generateInsightPrompt(mockInsightRequest);
      expect(result.systemPrompt).toBeDefined();
      expect(result.userPrompt).toBeDefined();
      expect(result.totalSize).toBeGreaterThan(0);
    });

    it('should calculate total size correctly', () => {
      const result = generateInsightPrompt(mockInsightRequest);
      const encoder = new TextEncoder();
      const expectedSize = encoder.encode(result.systemPrompt).length + encoder.encode(result.userPrompt).length;
      expect(result.totalSize).toBe(expectedSize);
    });

    it('should be within size limit for typical request', () => {
      const result = generateInsightPrompt(mockInsightRequest);
      expect(result.isWithinLimit).toBe(true);
      expect(result.totalSize).toBeLessThan(20 * 1024);
    });
  });
});

// ============================================================================
// Response Parsing Tests
// ============================================================================

describe('Response Parsing', () => {
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

    it('should throw error for invalid insight format', () => {
      const invalidInsights = JSON.stringify([
        { type: 'invalid_type', title: 'Test', content: 'Content', references: [] },
      ]);
      expect(() => parseInsightResponse(invalidInsights)).toThrow('Invalid insight format');
    });

    it('should throw error for too few insights', () => {
      const tooFewInsights = JSON.stringify([
        {
          type: 'shared_resonance',
          title: 'Test',
          content: 'Valid content that passes validation.',
          references: [{ type: 'gate', value: '13' }],
        },
      ]);
      expect(() => parseInsightResponse(tooFewInsights)).toThrow();
    });
  });

  describe('safeParseInsightResponse', () => {
    it('should return success for valid response', () => {
      const result = safeParseInsightResponse(validInsightResponse);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.length).toBe(3);
      }
    });

    it('should return error for invalid response', () => {
      const result = safeParseInsightResponse('invalid');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });
  });
});

// ============================================================================
// Fallback Insights Tests
// ============================================================================

describe('Fallback Insights', () => {
  describe('generateFallbackInsights', () => {
    it('should return at least 3 insights', () => {
      const insights = generateFallbackInsights(mockInsightRequest);
      expect(insights.length).toBeGreaterThanOrEqual(3);
    });

    it('should always include type_dynamic insight', () => {
      const insights = generateFallbackInsights(mockInsightRequest);
      const typeDynamic = insights.find(i => i.type === 'type_dynamic');
      expect(typeDynamic).toBeDefined();
    });

    it('should include shared_resonance when shared gates exist', () => {
      const insights = generateFallbackInsights(mockInsightRequest);
      const sharedResonance = insights.find(
        i => i.type === 'shared_resonance' && i.title.includes('Gate')
      );
      expect(sharedResonance).toBeDefined();
    });

    it('should include star_connection when star overlap exists', () => {
      const insights = generateFallbackInsights(mockInsightRequest);
      const starConnection = insights.find(i => i.type === 'star_connection');
      expect(starConnection).toBeDefined();
    });

    it('should use provided names', () => {
      const insights = generateFallbackInsights(mockInsightRequest);
      const allContent = insights.map(i => i.content).join(' ');
      expect(allContent).toContain('Alice');
      expect(allContent).toContain('Bob');
    });

    it('should generate valid insights according to schema', () => {
      const insights = generateFallbackInsights(mockInsightRequest);
      insights.forEach(insight => {
        expect(InsightSchema.safeParse(insight).success).toBe(true);
      });
    });

    it('should handle request with no shared gates', () => {
      const request: InsightRequest = {
        ...mockInsightRequest,
        comparison: {
          ...mockComparison,
          sharedGates: [],
          sharedChannels: [],
        },
      };
      const insights = generateFallbackInsights(request);
      expect(insights.length).toBeGreaterThanOrEqual(3);
    });

    it('should handle request with no star overlap', () => {
      const request: InsightRequest = {
        ...mockInsightRequest,
        comparison: {
          ...mockComparison,
          starSystemOverlap: { shared: [], divergent: [] },
        },
      };
      const insights = generateFallbackInsights(request);
      expect(insights.length).toBeGreaterThanOrEqual(3);
    });
  });
});

// ============================================================================
// OpenAI Integration Tests (Mocked)
// ============================================================================

describe('OpenAI Integration', () => {
  beforeEach(() => {
    resetOpenAIClient();
  });

  afterEach(() => {
    resetOpenAIClient();
    vi.restoreAllMocks();
  });

  describe('generateInsights', () => {
    it('should return success with valid insights from OpenAI', async () => {
      const mockClient = {
        chat: {
          completions: {
            create: vi.fn().mockResolvedValue({
              choices: [{ message: { content: validInsightResponse } }],
              usage: {
                prompt_tokens: 1000,
                completion_tokens: 500,
                total_tokens: 1500,
              },
            }),
          },
        },
      };

      setOpenAIClient(mockClient as any);

      const result = await generateInsights(mockInsightRequest);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.insights.length).toBe(3);
        expect(result.tokenUsage).toBeDefined();
        expect(result.tokenUsage?.totalTokens).toBe(1500);
      }
    });

    it('should return PARSE_ERROR for invalid OpenAI response', async () => {
      const mockClient = {
        chat: {
          completions: {
            create: vi.fn().mockResolvedValue({
              choices: [{ message: { content: 'invalid json' } }],
            }),
          },
        },
      };

      setOpenAIClient(mockClient as any);

      const result = await generateInsights(mockInsightRequest);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.code).toBe('PARSE_ERROR');
      }
    });

    it('should return API_ERROR when no response content', async () => {
      const mockClient = {
        chat: {
          completions: {
            create: vi.fn().mockResolvedValue({
              choices: [{ message: { content: null } }],
            }),
          },
        },
      };

      setOpenAIClient(mockClient as any);

      const result = await generateInsights(mockInsightRequest);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.code).toBe('API_ERROR');
      }
    });

    it('should return RATE_LIMIT error for 429 status', async () => {
      // Import OpenAI to create proper API error
      const OpenAI = (await import('openai')).default;

      // Create a proper APIError instance
      const mockError = new OpenAI.APIError(
        429,
        { error: { message: 'Rate limit exceeded' } },
        'Rate limit exceeded',
        new Headers()
      );

      const mockClient = {
        chat: {
          completions: {
            create: vi.fn().mockRejectedValue(mockError),
          },
        },
      };

      setOpenAIClient(mockClient as any);

      const result = await generateInsights(mockInsightRequest);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.code).toBe('RATE_LIMIT');
      }
    });

    it('should use custom model when specified', async () => {
      const mockClient = {
        chat: {
          completions: {
            create: vi.fn().mockResolvedValue({
              choices: [{ message: { content: validInsightResponse } }],
            }),
          },
        },
      };

      setOpenAIClient(mockClient as any);

      await generateInsights(mockInsightRequest, { model: 'gpt-4' });

      expect(mockClient.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({ model: 'gpt-4' })
      );
    });

    it('should respect maxTokens option', async () => {
      const mockClient = {
        chat: {
          completions: {
            create: vi.fn().mockResolvedValue({
              choices: [{ message: { content: validInsightResponse } }],
            }),
          },
        },
      };

      setOpenAIClient(mockClient as any);

      await generateInsights(mockInsightRequest, { maxTokens: 1000 });

      expect(mockClient.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({ max_tokens: 1000 })
      );
    });

    it('should respect temperature option', async () => {
      const mockClient = {
        chat: {
          completions: {
            create: vi.fn().mockResolvedValue({
              choices: [{ message: { content: validInsightResponse } }],
            }),
          },
        },
      };

      setOpenAIClient(mockClient as any);

      await generateInsights(mockInsightRequest, { temperature: 0.5 });

      expect(mockClient.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({ temperature: 0.5 })
      );
    });
  });

  describe('generateInsightsWithFallback', () => {
    it('should return insights from OpenAI when successful', async () => {
      const mockClient = {
        chat: {
          completions: {
            create: vi.fn().mockResolvedValue({
              choices: [{ message: { content: validInsightResponse } }],
            }),
          },
        },
      };

      setOpenAIClient(mockClient as any);

      const result = await generateInsightsWithFallback(mockInsightRequest);

      expect(result.success).toBe(true);
      expect(result.insights.length).toBe(3);
      expect(result.insights[0].type).toBe('shared_resonance');
    });

    it('should return fallback insights when API fails', async () => {
      const mockClient = {
        chat: {
          completions: {
            create: vi.fn().mockRejectedValue(new Error('API error')),
          },
        },
      };

      setOpenAIClient(mockClient as any);

      const result = await generateInsightsWithFallback(mockInsightRequest);

      expect(result.success).toBe(true);
      expect(result.insights.length).toBeGreaterThanOrEqual(3);
      // Fallback always includes type_dynamic first
      expect(result.insights[0].type).toBe('type_dynamic');
    });

    it('should return fallback insights when parse fails', async () => {
      const mockClient = {
        chat: {
          completions: {
            create: vi.fn().mockResolvedValue({
              choices: [{ message: { content: 'invalid' } }],
            }),
          },
        },
      };

      setOpenAIClient(mockClient as any);

      const result = await generateInsightsWithFallback(mockInsightRequest);

      expect(result.success).toBe(true);
      expect(result.insights.length).toBeGreaterThanOrEqual(3);
    });
  });
});

// ============================================================================
// Edge Cases Tests
// ============================================================================

describe('Edge Cases', () => {
  it('should handle empty chart centers', () => {
    const request: InsightRequest = {
      ...mockInsightRequest,
      chartA: { ...mockChartA, centers: [] },
    };
    const prompt = generateUserPrompt(request);
    expect(prompt).toContain('None');
  });

  it('should handle empty lore arrays', () => {
    const request: InsightRequest = {
      ...mockInsightRequest,
      lore: {
        chartAGates: [],
        chartBGates: [],
        sharedGates: [],
        totalContextSize: 0,
      },
    };
    const result = generateInsightPrompt(request);
    expect(result.isWithinLimit).toBe(true);
  });

  it('should truncate large lore arrays', () => {
    const largeLore: GateLore[] = Array(50).fill(mockGateLore);
    const request: InsightRequest = {
      ...mockInsightRequest,
      lore: {
        chartAGates: largeLore,
        chartBGates: largeLore,
        sharedGates: largeLore,
        totalContextSize: 100000,
      },
    };
    const prompt = generateUserPrompt(request);
    // Should not contain all 50 gates, only up to MAX_LORE_ITEMS_PER_CHART (15)
    const gateMatches = prompt.match(/Gate 13\.2/g);
    expect(gateMatches?.length).toBeLessThanOrEqual(45); // 15 * 3 sections max
  });

  it('should handle identical charts (self-reflection)', () => {
    const request: InsightRequest = {
      chartA: mockChartA,
      chartB: mockChartA,
      comparison: {
        ...mockComparison,
        typeDynamic: {
          typeA: 'Generator',
          typeB: 'Generator',
          dynamic: 'Self-reflection: Understanding your own Generator nature',
        },
      },
      lore: mockLore,
      nameA: 'Self',
      nameB: 'Self',
    };
    const insights = generateFallbackInsights(request);
    expect(insights.length).toBeGreaterThanOrEqual(3);
  });

  it('should handle charts with no star system overlap', () => {
    const request: InsightRequest = {
      ...mockInsightRequest,
      comparison: {
        ...mockComparison,
        starSystemOverlap: { shared: [], divergent: ['Sirian', 'Pleiadian'] },
      },
    };
    const prompt = generateUserPrompt(request);
    expect(prompt).toContain('Divergent star systems');
  });

  it('should handle very long content in insights gracefully', () => {
    const longContent = 'A'.repeat(999);
    const insight: Insight = {
      type: 'shared_resonance',
      title: 'Test',
      content: longContent,
      references: [{ type: 'gate', value: '13' }],
    };
    const result = InsightSchema.safeParse(insight);
    expect(result.success).toBe(true);
  });

  it('should reject content exceeding max length', () => {
    const tooLongContent = 'A'.repeat(1001);
    const insight = {
      type: 'shared_resonance',
      title: 'Test',
      content: tooLongContent,
      references: [{ type: 'gate', value: '13' }],
    };
    const result = InsightSchema.safeParse(insight);
    expect(result.success).toBe(false);
  });
});
