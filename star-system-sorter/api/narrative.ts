/**
 * Vercel Serverless Function: Narrative Generation
 * 
 * POST /api/narrative - Generate personalized star system narrative
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { classification, primary, hybrid, percentages, hdData } = req.body;

    // Validate required fields
    if (!classification || !percentages || !hdData) {
      return res.status(400).json({ 
        error: 'Missing required fields: classification, percentages, hdData' 
      });
    }

    // Check for OpenAI API key
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      console.error('[Narrative] Missing OPENAI_API_KEY');
      return res.status(500).json({ 
        error: 'Server configuration error',
        fallback: generateFallbackNarrative(classification, primary, hybrid)
      });
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a mystical guide writing personalized star system narratives. Write in second person, present tense. Be poetic but grounded. Focus on the person's unique energetic signature.`
          },
          {
            role: 'user',
            content: `Generate a 2-3 paragraph narrative for someone with:
- Classification: ${classification}
- Primary system: ${primary || 'N/A'}
- Hybrid systems: ${hybrid ? hybrid.join(' + ') : 'N/A'}
- Top percentages: ${Object.entries(percentages).slice(0, 3).map(([sys, pct]) => `${sys}: ${pct}%`).join(', ')}
- HD Type: ${hdData.type}
- HD Authority: ${hdData.authority}
- HD Profile: ${hdData.profile}

Write a mystical, personalized narrative about their star system alignment and what it means for their life path.`
          }
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Narrative] OpenAI API error:', error);
      return res.status(500).json({ 
        error: 'Failed to generate narrative',
        fallback: generateFallbackNarrative(classification, primary, hybrid)
      });
    }

    const data = await response.json();
    const narrative = data.choices[0]?.message?.content;

    if (!narrative) {
      return res.status(500).json({ 
        error: 'No narrative generated',
        fallback: generateFallbackNarrative(classification, primary, hybrid)
      });
    }

    return res.status(200).json({ 
      narrative,
      cached: false,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Narrative] Error:', error);
    const { classification, primary, hybrid } = req.body;
    return res.status(500).json({ 
      error: 'Internal server error',
      fallback: generateFallbackNarrative(classification, primary, hybrid)
    });
  }
}

function generateFallbackNarrative(
  classification: string,
  primary?: string,
  hybrid?: [string, string]
): string {
  if (classification === 'primary' && primary) {
    return `Your primary alignment with ${primary} reveals a clear and focused energetic signature. This star system resonates deeply with your core essence, guiding your path with singular purpose and clarity.`;
  }
  
  if (classification === 'hybrid' && hybrid) {
    return `Your hybrid alignment between ${hybrid[0]} and ${hybrid[1]} creates a unique energetic bridge. You carry the gifts of both star systems, weaving their wisdom into a distinctive path that honors both lineages.`;
  }
  
  return `Your star system alignment reveals a complex and multifaceted energetic signature. Multiple influences shape your path, creating a rich tapestry of cosmic wisdom and earthly purpose.`;
}
