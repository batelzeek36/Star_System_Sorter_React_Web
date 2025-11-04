import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import hdRouter from './routes/hd.js';
import narrativeRouter from './routes/narrative.js';
import classifyRouter from './routes/classify.js';
import { initializeRedis } from './lib/redis-startup.js';

// Load environment variables - override system env vars
dotenv.config({ override: true });

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - allow requests from Vite dev server
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Rate limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all routes
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Debug endpoint to check env vars (remove in production!)
app.get('/debug/env', (req, res) => {
  res.json({
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    keyPrefix: process.env.OPENAI_API_KEY?.substring(0, 20) || 'not set',
    keySuffix: process.env.OPENAI_API_KEY?.substring(process.env.OPENAI_API_KEY.length - 4) || 'not set',
  });
});

// Mount routes
app.use('/api', hdRouter);
app.use('/api', narrativeRouter);
app.use('/api', classifyRouter);

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  
  // Initialize Redis connection and validate configuration
  try {
    await initializeRedis();
  } catch (error) {
    console.error('Failed to initialize Redis:', error);
    console.log('Server will continue without Redis caching');
  }
});
