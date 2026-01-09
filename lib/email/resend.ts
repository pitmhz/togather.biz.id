import { Resend } from 'resend';

/**
 * Resend Email Client
 * 
 * Requires RESEND_API_KEY environment variable
 */
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Email Configuration
 */
export const EMAIL_CONFIG = {
    from: 'Togather Command <notifications@togather.biz.id>',
    replyTo: 'support@togather.biz.id',

    // Core team recipients for notifications
    coreTeam: [
        'admin@togather.biz.id', // Replace with your actual email
    ],
} as const;

/**
 * Send Email via Resend
 * 
 * @param options - Email options
 * @returns Send result or error
 */
export async function sendEmail(options: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.warn('[sendEmail] RESEND_API_KEY not configured, skipping email');
            return { success: false, error: 'Email service not configured' };
        }

        const { data, error } = await resend.emails.send({
            from: EMAIL_CONFIG.from,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
        });

        if (error) {
            console.error('[sendEmail] Resend error:', error);
            return { success: false, error: error.message };
        }

        console.log('[sendEmail] Email sent:', data?.id);
        return { success: true, id: data?.id };
    } catch (err) {
        console.error('[sendEmail] Unexpected error:', err);
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Failed to send email',
        };
    }
}

export { resend };
