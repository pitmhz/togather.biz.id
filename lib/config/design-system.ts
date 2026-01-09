import designLanguage from './design-language.json';

/**
 * ============================================
 * TOGATHER DESIGN SYSTEM
 * Single Source of Truth for Verification
 * ============================================
 */

export const DESIGN_SYSTEM = {
    meta: {
        name: designLanguage.design_language,
        style: 'Visual-Centric Minimalism',
        theme: 'Industrial Modern',
    },

    tokens: {
        // Spacer units (breathing room)
        spacing: {
            xs: '0.5rem',   // 8px
            sm: '1rem',     // 16px
            md: '2rem',     // 32px
            lg: '4rem',     // 64px
            xl: '8rem',     // 128px
            section: '12rem', // 192px (Expansive whitespace)
        },

        // Border radius (Extra rounded)
        radii: {
            sm: '0.25rem',  // 4px (Primary)
            md: '0.5rem',   // 8px
            lg: '1rem',     // 16px
            xl: '1.5rem',   // 24px
            full: '9999px',
        },

        // Colors (Dynamic CSS Variables)
        colors: {
            background: {
                primary: 'var(--background)',
                secondary: 'var(--background-secondary)',
                card: 'var(--card)',
            },
            text: {
                primary: 'var(--foreground)',
                secondary: 'var(--muted-foreground)',
                accent: 'var(--accent)',
            },
            status: {
                success: 'var(--color-status-success)',
                warning: 'var(--color-status-warning)',
                error: 'var(--color-status-error)',
            },
        },

        // Typography (Switzer-like)
        fonts: {
            heading: 'var(--font-heading)',
            body: 'var(--font-body)',
        },
    },

    // Component-specific settings
    components: {
        button: {
            borderRadius: '2rem', // Pill shape
            padding: '0.75rem 2rem',
        },
        card: {
            borderRadius: '0.25rem', // 4px (Tactical)
            padding: '2rem',
        },
        badge: {
            borderRadius: '9999px',
            padding: '0.25rem 1rem',
        },
    },
} as const;

export type DesignSystem = typeof DESIGN_SYSTEM;
