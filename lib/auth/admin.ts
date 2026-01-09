import { createClient } from '@/lib/supabase/server';

/**
 * Admin Session Type
 */
export interface AdminSession {
    userId: string;
    email: string;
    role: 'admin';
}

/**
 * Admin Validation Error
 */
export class AdminAuthError extends Error {
    constructor(
        message: string,
        public code: 'UNAUTHENTICATED' | 'UNAUTHORIZED' | 'SESSION_ERROR'
    ) {
        super(message);
        this.name = 'AdminAuthError';
    }
}

/**
 * Validate Admin Session
 * 
 * Checks if the current user is authenticated and has admin privileges.
 * Use this to protect admin-only server actions.
 * 
 * @returns Admin session with user info
 * @throws AdminAuthError if not authenticated or not admin
 * 
 * @example
 * ```tsx
 * async function adminAction() {
 *   const session = await validateAdminSession();
 *   // Proceed with admin operation...
 * }
 * ```
 */
export async function validateAdminSession(): Promise<AdminSession> {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            console.error('[validateAdminSession] Auth error:', error);
            throw new AdminAuthError(
                'Session validation failed',
                'SESSION_ERROR'
            );
        }

        if (!user) {
            throw new AdminAuthError(
                'Authentication required',
                'UNAUTHENTICATED'
            );
        }

        // Check admin role in user metadata
        const userRole = user.user_metadata?.role;

        // Also check if user is in core team (by email domain or specific IDs)
        const isCoreTeam = isTogatherCoreTeam(user.email);

        if (userRole !== 'admin' && !isCoreTeam) {
            console.warn('[validateAdminSession] Non-admin access attempt:', user.id);
            throw new AdminAuthError(
                'Admin access required',
                'UNAUTHORIZED'
            );
        }

        return {
            userId: user.id,
            email: user.email || '',
            role: 'admin',
        };
    } catch (err) {
        if (err instanceof AdminAuthError) {
            throw err;
        }
        console.error('[validateAdminSession] Unexpected error:', err);
        throw new AdminAuthError(
            'Session validation failed',
            'SESSION_ERROR'
        );
    }
}

/**
 * Check if user is part of Togather core team
 * 
 * @param email - User email
 * @returns True if user is core team member
 */
function isTogatherCoreTeam(email: string | undefined): boolean {
    if (!email) return false;

    // Core team domains
    const coreTeamDomains = [
        '@togather.biz.id',
    ];

    // Specific core team emails (add your email here)
    const coreTeamEmails: string[] = [
        // Add specific admin emails here
    ];

    return (
        coreTeamDomains.some(domain => email.endsWith(domain)) ||
        coreTeamEmails.includes(email.toLowerCase())
    );
}

/**
 * require Admin Wrapper
 * 
 * Higher-order function to wrap server actions with admin validation.
 * 
 * @param action - Server action function
 * @returns Wrapped action that requires admin
 * 
 * @example
 * ```tsx
 * const protectedAction = requireAdmin(async (session, data) => {
 *   // session.userId is available here
 *   return { success: true };
 * });
 * ```
 */
export function requireAdmin<T extends unknown[], R>(
    action: (session: AdminSession, ...args: T) => Promise<R>
): (...args: T) => Promise<R | { success: false; error: string }> {
    return async (...args: T) => {
        try {
            const session = await validateAdminSession();
            return await action(session, ...args);
        } catch (err) {
            if (err instanceof AdminAuthError) {
                return {
                    success: false,
                    error: err.message,
                };
            }
            return {
                success: false,
                error: 'An unexpected error occurred',
            };
        }
    };
}
