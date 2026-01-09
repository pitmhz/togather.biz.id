'use server';

/**
 * ============================================
 * TOGATHER ANALYTICS
 * Lightweight Server-Side Event Tracking
 * ============================================
 * 
 * A minimal analytics wrapper that logs events server-side
 * without slowing down the frontend. Can be extended to
 * integrate with analytics providers (Mixpanel, Amplitude, etc.)
 */

/**
 * Analytics Event Types
 */
export type AnalyticsEvent =
    | 'page_view'
    | 'click_launch_app'
    | 'submit_lead'
    | 'view_pricing'
    | 'view_features'
    | 'read_news'
    | 'search_news'
    | 'contact_form'
    | 'error'
    | 'custom';

/**
 * Event Metadata
 */
export interface EventMetadata {
    [key: string]: string | number | boolean | null | undefined;
}

/**
 * Analytics Configuration
 */
const ANALYTICS_CONFIG = {
    // Enable/disable analytics logging
    enabled: process.env.NODE_ENV === 'production',
    // Log to console in development
    debugMode: process.env.NODE_ENV === 'development',
    // Service name for log prefix
    serviceName: 'togather-landing',
} as const;

/**
 * Track Event
 * 
 * Logs analytics events server-side. This runs asynchronously
 * and does not block the main request flow.
 * 
 * @param eventName - Name of the event to track
 * @param metadata - Additional data to include with the event
 * @returns Promise that resolves when tracking is complete
 * 
 * @example
 * ```tsx
 * // Track a button click
 * await trackEvent('click_launch_app', { source: 'hero' });
 * 
 * // Track a lead submission
 * await trackEvent('submit_lead', { 
 *   church_name: 'Grace Community',
 *   estimated_members: 150,
 * });
 * ```
 */
export async function trackEvent(
    eventName: AnalyticsEvent,
    metadata: EventMetadata = {}
): Promise<{ success: boolean }> {
    try {
        const timestamp = new Date().toISOString();

        const eventData = {
            event: eventName,
            timestamp,
            service: ANALYTICS_CONFIG.serviceName,
            ...metadata,
        };

        // Debug logging in development
        if (ANALYTICS_CONFIG.debugMode) {
            console.log(`[Analytics] ${eventName}:`, JSON.stringify(eventData, null, 2));
        }

        // Production logging
        if (ANALYTICS_CONFIG.enabled) {
            // Structured logging for production (works with log aggregators)
            console.log(JSON.stringify({
                level: 'info',
                type: 'analytics',
                ...eventData,
            }));

            // TODO: Integrate with analytics provider
            // Example: await mixpanel.track(eventName, eventData);
            // Example: await amplitude.logEvent(eventName, eventData);
        }

        return { success: true };
    } catch (error) {
        console.error('[Analytics] Failed to track event:', error);
        return { success: false };
    }
}

/**
 * Track Page View
 * 
 * Convenience method for tracking page views
 * 
 * @param path - The page path
 * @param metadata - Additional metadata
 */
export async function trackPageView(
    path: string,
    metadata: EventMetadata = {}
): Promise<{ success: boolean }> {
    return trackEvent('page_view', {
        path,
        ...metadata,
    });
}

/**
 * Track Error
 * 
 * Convenience method for tracking errors
 * 
 * @param errorMessage - Error message
 * @param metadata - Additional context
 */
export async function trackError(
    errorMessage: string,
    metadata: EventMetadata = {}
): Promise<{ success: boolean }> {
    return trackEvent('error', {
        error_message: errorMessage,
        ...metadata,
    });
}

/**
 * Track Conversion
 * 
 * Track key conversion events (leads, signups, etc.)
 * 
 * @param conversionType - Type of conversion
 * @param value - Optional value associated with conversion
 * @param metadata - Additional context
 */
export async function trackConversion(
    conversionType: 'lead' | 'signup' | 'purchase',
    value?: number,
    metadata: EventMetadata = {}
): Promise<{ success: boolean }> {
    return trackEvent('submit_lead', {
        conversion_type: conversionType,
        value,
        ...metadata,
    });
}
