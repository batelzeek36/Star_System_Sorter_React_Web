/**
 * BodyGraph API Client
 * 
 * Handles communication with the /api/hd endpoint with:
 * - Request/response validation
 * - Error handling and classification
 * - Client-side caching with localStorage (30-day TTL)
 * - Privacy-preserving cache keys (hashed)
 */

import { HDExtractSchema } from '../lib/schemas';
import type { BirthDataAPIRequest, HDExtract } from '../lib/schemas';

// ============================================================================
// Error Handling
// ============================================================================

type HDAPIErrorCode =
    | 'NETWORK_ERROR'
    | 'VALIDATION_ERROR'
    | 'API_ERROR'
    | 'RATE_LIMIT_ERROR'
    | 'SERVER_ERROR'
    | 'UNKNOWN_ERROR';

export class HDAPIError extends Error {
    code: HDAPIErrorCode;
    details?: unknown;

    constructor(
        code: HDAPIErrorCode,
        message: string,
        details?: unknown
    ) {
        super(message);
        this.name = 'HDAPIError';
        this.code = code;
        this.details = details;
    }
}

// ============================================================================
// Cache Management
// ============================================================================

interface CacheEntry {
    data: HDExtract;
    timestamp: number;
}

const CACHE_KEY_PREFIX = 'hd-cache-';
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

/**
 * Generate a hashed cache key from birth data
 * Uses SHA-256 via SubtleCrypto for privacy
 */
async function generateCacheKey(data: BirthDataAPIRequest): Promise<string> {
    const keyString = `${data.dateISO}|${data.time}|${data.timeZone}`;

    // Use SubtleCrypto for hashing in browser
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(keyString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);

    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return `${CACHE_KEY_PREFIX}${hashHex}`;
}

/**
 * Get cached HD data if available and not expired
 */
async function getCachedData(data: BirthDataAPIRequest): Promise<HDExtract | null> {
    try {
        const cacheKey = await generateCacheKey(data);
        const cached = localStorage.getItem(cacheKey);

        if (!cached) {
            return null;
        }

        const entry: CacheEntry = JSON.parse(cached);
        const now = Date.now();

        // Check if cache is expired
        if (now - entry.timestamp > CACHE_TTL_MS) {
            localStorage.removeItem(cacheKey);
            return null;
        }

        // Validate cached data structure
        const validation = HDExtractSchema.safeParse(entry.data);
        if (!validation.success) {
            localStorage.removeItem(cacheKey);
            return null;
        }

        return entry.data;
    } catch (error) {
        // If cache read fails, just return null
        console.warn('[Cache] Failed to read cache:', error);
        return null;
    }
}

/**
 * Store HD data in cache
 */
async function setCachedData(data: BirthDataAPIRequest, hdData: HDExtract): Promise<void> {
    try {
        const cacheKey = await generateCacheKey(data);
        const entry: CacheEntry = {
            data: hdData,
            timestamp: Date.now(),
        };

        localStorage.setItem(cacheKey, JSON.stringify(entry));
    } catch (error) {
        // If cache write fails, just log and continue
        console.warn('[Cache] Failed to write cache:', error);
    }
}

// ============================================================================
// API Client
// ============================================================================

/**
 * Compute HD Extract by calling /api/hd endpoint
 * Does NOT use cache - call computeHDExtractWithCache() for caching
 */
export async function computeHDExtract(data: BirthDataAPIRequest): Promise<HDExtract> {
    try {
        // Make API request
        const response = await fetch('/api/hd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Handle rate limiting
        if (response.status === 429) {
            throw new HDAPIError(
                'RATE_LIMIT_ERROR',
                'Too many requests. Please try again later.',
                { status: 429 }
            );
        }

        // Handle server errors
        if (response.status >= 500) {
            throw new HDAPIError(
                'SERVER_ERROR',
                'Server error occurred. Please try again.',
                { status: response.status }
            );
        }

        // Handle client errors (validation, etc.)
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            if (response.status === 400) {
                throw new HDAPIError(
                    'VALIDATION_ERROR',
                    'Invalid birth data provided.',
                    errorData
                );
            }

            throw new HDAPIError(
                'API_ERROR',
                errorData.message || 'Failed to retrieve chart data.',
                errorData
            );
        }

        // Parse response
        const responseData = await response.json();

        // Validate response structure
        const validation = HDExtractSchema.safeParse(responseData);
        if (!validation.success) {
            throw new HDAPIError(
                'VALIDATION_ERROR',
                'Invalid response from server.',
                validation.error.issues
            );
        }

        return validation.data;

    } catch (error) {
        // Re-throw HDAPIError as-is
        if (error instanceof HDAPIError) {
            throw error;
        }

        // Handle network errors
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new HDAPIError(
                'NETWORK_ERROR',
                'Network error. Please check your connection.',
                error
            );
        }

        // Handle unknown errors
        throw new HDAPIError(
            'UNKNOWN_ERROR',
            'An unexpected error occurred.',
            error
        );
    }
}

/**
 * Compute HD Extract with client-side caching
 * Checks localStorage cache first, falls back to API call
 */
export async function computeHDExtractWithCache(data: BirthDataAPIRequest): Promise<HDExtract> {
    // Check cache first
    const cached = await getCachedData(data);
    if (cached) {
        console.log('[Cache Hit] Using cached HD data');
        return cached;
    }

    // Cache miss - fetch from API
    console.log('[Cache Miss] Fetching from API');
    const hdData = await computeHDExtract(data);

    // Store in cache
    await setCachedData(data, hdData);

    return hdData;
}
