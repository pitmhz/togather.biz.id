import { z } from 'zod';

/**
 * Lead Status Type
 */
export type LeadStatus = 'New' | 'Contacted' | 'Converted';

/**
 * Lead Form Schema
 * Validates incoming lead submissions from the landing page
 */
export const leadFormSchema = z.object({
    // Required fields
    church_name: z
        .string()
        .min(2, 'Church name must be at least 2 characters')
        .max(200, 'Church name is too long'),

    leader_name: z
        .string()
        .min(2, 'Your name must be at least 2 characters')
        .max(100, 'Name is too long'),

    email: z
        .string()
        .email('Please enter a valid email address')
        .max(255, 'Email is too long'),

    // Optional fields
    phone: z
        .string()
        .regex(/^[+]?[\d\s()-]+$/, 'Please enter a valid phone number')
        .max(20, 'Phone number is too long')
        .optional()
        .or(z.literal('')),

    estimated_members: z
        .number()
        .int()
        .min(1, 'Estimated members must be at least 1')
        .max(100000, 'Please enter a realistic number')
        .optional()
        .nullable(),

    notes: z
        .string()
        .max(1000, 'Notes are too long')
        .optional()
        .or(z.literal('')),

    // Honeypot field - should always be empty
    // If filled, it's likely a bot
    website: z
        .string()
        .max(0, 'This field should be empty')
        .optional()
        .or(z.literal('')),
});

/**
 * Type inferred from the schema
 */
export type LeadFormInput = z.infer<typeof leadFormSchema>;

/**
 * Landing Lead Database Row Type
 */
export interface LandingLead {
    id: string;
    church_name: string;
    leader_name: string;
    email: string;
    phone: string | null;
    estimated_members: number | null;
    status: LeadStatus;
    notes: string | null;
    source: string;
    created_at: string;
    updated_at: string;
}

/**
 * Validate lead form data and check honeypot
 * @param data - Form data to validate
 * @returns Validated data or error
 */
export function validateLeadForm(data: unknown): {
    success: boolean;
    data?: LeadFormInput;
    error?: string;
    errors?: Record<string, string[] | undefined>;
    isBot?: boolean;
} {
    try {
        const result = leadFormSchema.safeParse(data);

        if (!result.success) {
            const flattened = result.error.flatten();
            const firstError = result.error.issues[0];
            return {
                success: false,
                error: firstError?.message || 'Invalid form data',
                errors: flattened.fieldErrors,
            };
        }

        // Check honeypot - if 'website' field has value, it's a bot
        if (result.data.website && result.data.website.length > 0) {
            console.log('[validateLeadForm] Bot detected via honeypot');
            return {
                success: false,
                error: 'Submission rejected',
                isBot: true,
            };
        }

        return {
            success: true,
            data: result.data,
        };
    } catch (err) {
        console.error('[validateLeadForm] Unexpected error:', err);
        return {
            success: false,
            error: 'Failed to validate form data',
        };
    }
}
