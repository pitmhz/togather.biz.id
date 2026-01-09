/**
 * ============================================
 * TOGATHER RATE LIMITER
 * Memory-Based Request Throttling
 * ============================================
 * 
 * Simple in-memory rate limiter for protecting server actions.
 * For production with multiple instances, consider Upstash Redis.
 */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

/**
 * In-memory store for rate limit tracking
 * Key format: `${action}:${identifier}`
 */
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Rate Limit Configuration
 */
export const RATE_LIMITS = {
    // Lead submission: 3 attempts per hour per IP
    submitLead: {
        maxRequests: 3,
        windowMs: 60 * 60 * 1000, // 1 hour
    },
    // News feed: 60 requests per minute per IP (light limit)
    getLatestNews: {
        maxRequests: 60,
        windowMs: 60 * 1000, // 1 minute
    },
    // Default fallback
    default: {
        maxRequests: 100,
        windowMs: 60 * 1000, // 1 minute
    },
} as const;

export type RateLimitAction = keyof typeof RATE_LIMITS;

/**
 * Rate Limit Result
 */
export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: number;
    retryAfterMs?: number;
}

/**
 * Check Rate Limit
 * 
 * Checks if a request should be allowed based on rate limiting rules.
 * Uses in-memory storage (resets on server restart).
 * 
 * @param action - The action being rate limited
 * @param identifier - Unique identifier (usually IP address)
 * @returns Rate limit result with remaining quota
 * 
 * @example
 * ```tsx
 * const result = checkRateLimit('submitLead', clientIP);
 * if (!result.allowed) {
 *   return { error: 'Too many requests' };
 * }
 * ```
 */
export function checkRateLimit(
    action: RateLimitAction,
    identifier: string
): RateLimitResult {
    const config = RATE_LIMITS[action] || RATE_LIMITS.default;
    const key = `${action}:${identifier}`;
    const now = Date.now();

    // Clean up expired entries periodically
    cleanupExpiredEntries(now);

    // Get or create entry
    let entry = rateLimitStore.get(key);

    if (!entry || now >= entry.resetAt) {
        // Create new entry or reset expired one
        entry = {
            count: 1,
            resetAt: now + config.windowMs,
        };
        rateLimitStore.set(key, entry);

        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetAt: entry.resetAt,
        };
    }

    // Increment count
    entry.count += 1;
    rateLimitStore.set(key, entry);

    const allowed = entry.count <= config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - entry.count);

    if (!allowed) {
        return {
            allowed: false,
            remaining: 0,
            resetAt: entry.resetAt,
            retryAfterMs: entry.resetAt - now,
        };
    }

    return {
        allowed: true,
        remaining,
        resetAt: entry.resetAt,
    };
}

/**
 * Get Client IP from Headers
 * 
 * Extracts the client IP address from request headers.
 * Handles various proxy configurations.
 * 
 * @param headers - Request headers object
 * @returns Client IP or 'unknown'
 */
export function getClientIP(headers: Headers): string {
    // Try common headers in order of reliability
    const forwardedFor = headers.get('x-forwarded-for');
    if (forwardedFor) {
        // Take the first IP (original client)
        return forwardedFor.split(',')[0].trim();
    }

    const realIP = headers.get('x-real-ip');
    if (realIP) {
        return realIP.trim();
    }

    const cfConnectingIP = headers.get('cf-connecting-ip');
    if (cfConnectingIP) {
        return cfConnectingIP.trim();
    }

    return 'unknown';
}

/**
 * Clean up expired rate limit entries
 * Called periodically to prevent memory leaks
 */
function cleanupExpiredEntries(now: number): void {
    // Only clean up every 100 requests to avoid overhead
    if (Math.random() > 0.01) return;

    for (const [key, entry] of rateLimitStore.entries()) {
        if (now >= entry.resetAt) {
            rateLimitStore.delete(key);
        }
    }
}

/**
 * Rate Limit Error Messages
 * Tactical naming convention
 */
export const RATE_LIMIT_MESSAGES = {
    submitLead: 'Transmission frequency exceeded. Please wait before submitting again.',
    getLatestNews: 'Data retrieval limit reached. Please slow down.',
    default: 'Request limit exceeded. Please try again later.',
} as const;

/**
 * Format retry time for user display
 */
export function formatRetryAfter(ms: number): string {
    const seconds = Math.ceil(ms / 1000);
    if (seconds < 60) {
        return `${seconds} seconds`;
    }
    const minutes = Math.ceil(seconds / 60);
    if (minutes < 60) {
        return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    const hours = Math.ceil(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''}`;
}
