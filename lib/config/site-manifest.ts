/**
 * ============================================
 * TOGATHER SITE MANIFEST
 * Global Technical Constants & Configuration
 * ============================================
 * 
 * Centralized configuration for the Togather landing page.
 * Import this module for consistent access to URLs, metadata, and contact info.
 */

// ============================================
// APPLICATION URLS
// ============================================

export const APP_URLS = {
    // Landing page (this site)
    landing: 'https://togather.biz.id',

    // Main application
    app: 'https://app.togather.biz.id',

    // Support & documentation
    support: 'https://support.togather.biz.id',
    docs: 'https://docs.togather.biz.id',
    status: 'https://status.togather.biz.id',

    // Legal pages
    terms: 'https://togather.biz.id/terms',
    privacy: 'https://togather.biz.id/privacy',

    // External links
    github: 'https://github.com/togather-id',
    twitter: 'https://twitter.com/togather_id',
    instagram: 'https://instagram.com/togather.id',
} as const;

// ============================================
// SOCIAL METADATA DEFAULTS
// ============================================

export const SOCIAL_METADATA = {
    // Title templates
    titleTemplate: '%s | Togather',
    defaultTitle: 'Togather - Community Gathering Platform',

    // Descriptions
    defaultDescription: 'Organize, collaborate, and manage your community events with Togather - the ultimate gathering platform for churches and communities.',
    shortDescription: 'The ultimate gathering platform for communities.',

    // Open Graph defaults
    og: {
        type: 'website',
        locale: 'en_US',
        siteName: 'Togather',
        defaultImage: '/og-default.png',
        imageWidth: 1200,
        imageHeight: 630,
    },

    // Twitter card defaults
    twitter: {
        card: 'summary_large_image' as const,
        site: '@togather_id',
        creator: '@togather_id',
        defaultImage: '/twitter-default.png',
    },

    // Keywords for SEO
    keywords: [
        'community events',
        'church management',
        'event platform',
        'gathering app',
        'togather',
        'community organizing',
        'church events',
        'group management',
    ],
} as const;

// ============================================
// COMMUNITY CONTACT INFO
// ============================================

export const CONTACT_INFO = {
    // Primary contact
    email: {
        general: 'hello@togather.biz.id',
        support: 'support@togather.biz.id',
        sales: 'sales@togather.biz.id',
        partnerships: 'partners@togather.biz.id',
    },

    // Response times (for user expectations)
    responseTime: {
        general: '24-48 hours',
        support: '4-8 hours',
        urgent: '1-2 hours',
    },

    // Social handles
    social: {
        twitter: '@togather_id',
        instagram: '@togather.id',
        linkedin: 'togather-id',
    },

    // Location (if applicable)
    location: {
        country: 'Indonesia',
        timezone: 'Asia/Jakarta',
    },
} as const;

// ============================================
// BRAND ASSETS
// ============================================

export const BRAND_ASSETS = {
    // Logos
    logo: {
        default: '/logo.svg',
        dark: '/logo-dark.svg',
        icon: '/icon.svg',
        favicon: '/favicon.ico',
    },

    // Default images
    images: {
        ogDefault: '/og-default.png',
        ogNews: '/og-news.png',
        ogFeatures: '/og-features.png',
        placeholder: '/placeholder.png',
    },

    // Brand colors (for external embeds)
    colors: {
        primary: '#6366f1', // Indigo
        secondary: '#8b5cf6', // Violet
        accent: '#f59e0b', // Amber
        background: '#ffffff',
        foreground: '#0f172a',
    },
} as const;

// ============================================
// FEATURE FLAGS
// ============================================

export const FEATURE_FLAGS = {
    // Enable/disable features
    newsSection: true,
    leadCapture: true,
    pricingPage: true,

    // Coming soon features
    blogSection: false,
    communityForum: false,
    liveChat: false,
} as const;

// ============================================
// TACTICAL NAMING CONVENTIONS
// "Industrial" themed naming for the application
// ============================================

export const TACTICAL_NAMES = {
    // Sections
    news: 'Mission Log',
    events: 'Operations',
    members: 'Personnel',
    groups: 'Units',

    // Actions
    submit: 'Deploy',
    create: 'Initialize',
    update: 'Reconfigure',
    delete: 'Decommission',

    // Statuses
    active: 'Operational',
    pending: 'Standby',
    completed: 'Mission Complete',
    cancelled: 'Aborted',
} as const;

// ============================================
// TYPE EXPORTS
// ============================================

export type AppUrl = keyof typeof APP_URLS;
export type FeatureFlag = keyof typeof FEATURE_FLAGS;
export type TacticalName = keyof typeof TACTICAL_NAMES;
