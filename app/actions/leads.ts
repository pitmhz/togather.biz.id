'use server';

import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { validateLeadForm, type LandingLead } from '@/lib/schemas/leads';
import { checkRateLimit, getClientIP, RATE_LIMIT_MESSAGES, formatRetryAfter } from '@/lib/security/rate-limit';
import { notifyOwnerOnNewLead } from '@/app/actions/notifications';

/**
 * Server Action Response Types
 */
interface ActionResponse<T> {
    success: boolean;
    data: T | null;
    message: string;
}

/**
 * Tactical Success Messages
 * "Industrial" naming convention for user feedback
 */
const TACTICAL_MESSAGES = {
    success: 'Mission received! Our team will make contact within 24 hours. Stand by for deployment.',
    duplicate: 'Intel already logged. Our team is aware and will reach out soon.',
    error: 'Transmission failed. Please try again or contact base directly.',
    botDetected: 'Submission received.', // Don't reveal bot detection
    rateLimited: RATE_LIMIT_MESSAGES.submitLead,
} as const;

/**
 * Submit Lead
 * 
 * Captures a new lead from the landing page form.
 * Validates input with Zod and checks honeypot for bot prevention.
 * Rate limited to 3 submissions per hour per IP.
 * 
 * @param formData - Form data containing lead information
 * @returns Success message or error
 */
export async function submitLead(
    formData: Record<string, unknown>
): Promise<ActionResponse<{ id: string }>> {
    try {
        // Get client IP for rate limiting
        const headersList = await headers();
        const clientIP = getClientIP(headersList);

        // Check rate limit
        const rateLimit = checkRateLimit('submitLead', clientIP);
        if (!rateLimit.allowed) {
            console.log('[submitLead] Rate limit exceeded for IP:', clientIP);
            return {
                success: false,
                data: null,
                message: `${TACTICAL_MESSAGES.rateLimited} Try again in ${formatRetryAfter(rateLimit.retryAfterMs || 0)}.`,
            };
        }

        // Validate and check honeypot
        const validation = validateLeadForm(formData);

        if (!validation.success) {
            // If bot detected, return success to avoid revealing detection
            if (validation.isBot) {
                console.log('[submitLead] Bot submission silently rejected');
                return {
                    success: true,
                    data: null,
                    message: TACTICAL_MESSAGES.botDetected,
                };
            }

            return {
                success: false,
                data: null,
                message: validation.error || TACTICAL_MESSAGES.error,
            };
        }

        const { church_name, leader_name, email, phone, estimated_members, notes } = validation.data!;

        const supabase = await createClient();

        // Check for duplicate email (optional - can be removed if duplicates are allowed)
        const { data: existing } = await supabase
            .from('landing_leads')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        if (existing) {
            console.log('[submitLead] Duplicate lead detected:', email);
            return {
                success: true,
                data: { id: existing.id },
                message: TACTICAL_MESSAGES.duplicate,
            };
        }

        // Insert new lead
        const { data, error } = await supabase
            .from('landing_leads')
            .insert({
                church_name,
                leader_name,
                email,
                phone: phone || null,
                estimated_members: estimated_members ?? null,
                notes: notes || null,
                status: 'New',
                source: 'landing_page',
            })
            .select('*')
            .single();

        if (error) {
            console.error('[submitLead] Supabase error:', error);
            return {
                success: false,
                data: null,
                message: TACTICAL_MESSAGES.error,
            };
        }

        console.log('[submitLead] New lead captured:', data.id);

        // Send notification to owner (async, don't block response)
        notifyOwnerOnNewLead(data as LandingLead).catch((err) => {
            console.error('[submitLead] Failed to send notification:', err);
        });

        return {
            success: true,
            data: { id: data.id },
            message: TACTICAL_MESSAGES.success,
        };
    } catch (err) {
        console.error('[submitLead] Unexpected error:', err);
        return {
            success: false,
            data: null,
            message: TACTICAL_MESSAGES.error,
        };
    }
}

/**
 * Get All Leads (Admin Only)
 * 
 * Fetches all leads for admin dashboard.
 * Protected by RLS - only admins can access.
 * 
 * @param status - Optional status filter
 * @returns Array of leads
 */
export async function getLeads(
    status?: 'New' | 'Contacted' | 'Converted'
): Promise<ActionResponse<LandingLead[]>> {
    try {
        const supabase = await createClient();

        let query = supabase
            .from('landing_leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) {
            console.error('[getLeads] Supabase error:', error);
            return {
                success: false,
                data: null,
                message: error.message,
            };
        }

        return {
            success: true,
            data: data as LandingLead[],
            message: 'Leads retrieved successfully',
        };
    } catch (err) {
        console.error('[getLeads] Unexpected error:', err);
        return {
            success: false,
            data: null,
            message: 'Failed to fetch leads',
        };
    }
}

/**
 * Update Lead Status (Admin Only)
 * 
 * Updates the status and notes of a lead.
 * Protected by RLS - only admins can access.
 * 
 * @param id - Lead ID
 * @param status - New status
 * @param notes - Optional notes to add
 */
export async function updateLeadStatus(
    id: string,
    status: 'New' | 'Contacted' | 'Converted',
    notes?: string
): Promise<ActionResponse<null>> {
    try {
        const supabase = await createClient();

        const updateData: Record<string, unknown> = { status };
        if (notes !== undefined) {
            updateData.notes = notes;
        }

        const { error } = await supabase
            .from('landing_leads')
            .update(updateData)
            .eq('id', id);

        if (error) {
            console.error('[updateLeadStatus] Supabase error:', error);
            return {
                success: false,
                data: null,
                message: error.message,
            };
        }

        return {
            success: true,
            data: null,
            message: `Lead status updated to ${status}`,
        };
    } catch (err) {
        console.error('[updateLeadStatus] Unexpected error:', err);
        return {
            success: false,
            data: null,
            message: 'Failed to update lead status',
        };
    }
}
