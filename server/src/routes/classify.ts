/**
 * GPT-4o Classification Route
 * 
 * POST /api/classify - Classify HD data using GPT-4o
 */

import express from 'express';
import { z } from 'zod';
import { classifyWithGPT, type HDExtract } from '../services/gpt-classification.js';

const router = express.Router();

// Validation schema for placement
const PlacementSchema = z.object({
  planet: z.string(),
  gate: z.number(),
  line: z.number(),
  type: z.enum(['personality', 'design']),
});

// Validation schema for HD data
const HDExtractSchema = z.object({
  type: z.string(),
  authority: z.string(),
  profile: z.string(),
  centers: z.array(z.string()),
  channels: z.array(z.number()),
  gates: z.array(z.number()),
  placements: z.array(PlacementSchema),
});

/**
 * POST /api/classify
 * Classify HD data using GPT-4o
 */
router.post('/classify', async (req, res) => {
  try {
    // Validate request
    const validationResult = HDExtractSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Invalid HD data',
        details: validationResult.error.issues,
      });
    }
    
    const hdData = validationResult.data as HDExtract;
    
    // Classify using GPT-4o
    const result = await classifyWithGPT(hdData);
    
    return res.json(result);
    
  } catch (error) {
    console.error('Error in classify endpoint:', error);
    return res.status(500).json({
      error: 'Failed to classify',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
