'use server';

import { sendEmail, EMAIL_CONFIG } from '@/lib/email/resend';
import { newLeadNotificationTemplate } from '@/lib/email/templates';
import type { LandingLead } from '@/lib/schemas/leads';

/**
 * Notify Owner on New Lead
 * 
 * Sends an automated email to the Togather core team when a new lead
 * is captured from the landing page.
 * 
 * @param lead - The lead data to include in the notification
 * @returns Success status and any error message
 * 
 * @example
 * ```tsx
 * // After successfully inserting a lead
 * await notifyOwnerOnNewLead(newLead);
 * ```
 */
export async function notifyOwnerOnNewLead(
    lead: LandingLead
): Promise<{ success: boolean; error?: string }> {
    try {
        // Skip if email service is not configured
        if (!process.env.RESEND_API_KEY) {
            console.log('[notifyOwnerOnNewLead] Email service not configured, skipping notification');
            return { success: true }; // Don't fail the lead submission
        }

        // Generate email content from template
        const { subject, html, text } = newLeadNotificationTemplate(lead);

        // Send to all core team members
        const result = await sendEmail({
            to: [...EMAIL_CONFIG.coreTeam],
            subject,
            html,
            text,
        });

        if (!result.success) {
            console.error('[notifyOwnerOnNewLead] Failed to send notification:', result.error);
            return { success: false, error: result.error };
        }

        console.log('[notifyOwnerOnNewLead] Notification sent for lead:', lead.id);
        return { success: true };
    } catch (err) {
        console.error('[notifyOwnerOnNewLead] Unexpected error:', err);
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Failed to send notification',
        };
    }
}
