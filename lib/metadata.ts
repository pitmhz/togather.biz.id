import type { Metadata } from 'next';
import type { NewsPost } from './supabase/types';

/**
 * Site Configuration
 * Core metadata values for the Togather landing page
 */
export const SITE_CONFIG = {
    name: 'Togather',
    description: 'Organize, collaborate, and manage your community events with Togather - the ultimate gathering platform.',
    url: 'https://togather.biz.id',
    locale: 'en_US',
    twitterHandle: '@togather_id',
} as const;

/**
 * Default OpenGraph Image Configuration
 */
export const DEFAULT_OG_IMAGE = {
    url: '/og-image.png',
    width: 1200,
    height: 630,
    alt: 'Togather - Community Event Platform',
};

/**
 * Base Metadata
 * Used as defaults for all pages via layout.tsx
 */
export const baseMetadata: Metadata = {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
        default: SITE_CONFIG.name,
        template: `%s | ${SITE_CONFIG.name}`,
    },
    description: SITE_CONFIG.description,
    keywords: [
        'community events',
        'event management',
        'gathering platform',
        'togather',
        'organize events',
        'community management',
    ],
    authors: [{ name: 'Togather Team' }],
    creator: 'Togather',
    publisher: 'Togather',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: SITE_CONFIG.locale,
        url: SITE_CONFIG.url,
        siteName: SITE_CONFIG.name,
        title: SITE_CONFIG.name,
        description: SITE_CONFIG.description,
        images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
        card: 'summary_large_image',
        title: SITE_CONFIG.name,
        description: SITE_CONFIG.description,
        site: SITE_CONFIG.twitterHandle,
        creator: SITE_CONFIG.twitterHandle,
        images: [DEFAULT_OG_IMAGE.url],
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
};

/**
 * Static Page Metadata Generator
 * Creates consistent metadata for static pages like Home, Features, Pricing
 */
export function generateStaticMetadata(
    page: 'home' | 'features' | 'pricing' | 'about' | 'contact',
    overrides?: Partial<Metadata>
): Metadata {
    const pageConfigs = {
        home: {
            title: 'Home',
            description: SITE_CONFIG.description,
            path: '/',
        },
        features: {
            title: 'Features',
            description: 'Explore powerful features for organizing and managing community events',
            path: '/features',
        },
        pricing: {
            title: 'Pricing',
            description: 'Simple, transparent pricing for teams of all sizes',
            path: '/pricing',
        },
        about: {
            title: 'About Us',
            description: 'Learn about the team behind Togather and our mission',
            path: '/about',
        },
        contact: {
            title: 'Contact',
            description: 'Get in touch with the Togather team',
            path: '/contact',
        },
    };

    const config = pageConfigs[page];
    const pageUrl = `${SITE_CONFIG.url}${config.path}`;

    return {
        title: config.title,
        description: config.description,
        openGraph: {
            title: `${config.title} | ${SITE_CONFIG.name}`,
            description: config.description,
            url: pageUrl,
            type: 'website',
        },
        twitter: {
            title: `${config.title} | ${SITE_CONFIG.name}`,
            description: config.description,
        },
        alternates: {
            canonical: pageUrl,
        },
        ...overrides,
    };
}

/**
 * News Post Metadata Generator
 * Creates dynamic metadata for individual news articles
 */
export function generateNewsMetadata(post: NewsPost): Metadata {
    const postUrl = `${SITE_CONFIG.url}/news/${post.slug}`;
    const publishedTime = new Date(post.published_at).toISOString();

    return {
        title: post.title,
        description: post.content.substring(0, 160).replace(/[#*`]/g, '').trim() + '...',
        openGraph: {
            type: 'article',
            title: post.title,
            description: post.content.substring(0, 160).replace(/[#*`]/g, '').trim() + '...',
            url: postUrl,
            publishedTime,
            authors: ['Togather Team'],
            section: post.category,
            tags: [post.category, 'news', 'togather'],
            images: post.cover_image
                ? [
                    {
                        url: post.cover_image,
                        width: 1200,
                        height: 630,
                        alt: post.title,
                    },
                ]
                : [DEFAULT_OG_IMAGE],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.content.substring(0, 160).replace(/[#*`]/g, '').trim() + '...',
            images: post.cover_image ? [post.cover_image] : [DEFAULT_OG_IMAGE.url],
        },
        alternates: {
            canonical: postUrl,
        },
    };
}

/**
 * JSON-LD Schema Generator for News Articles
 * Provides structured data for search engines
 */
export function generateNewsJsonLd(post: NewsPost) {
    return {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: post.title,
        description: post.content.substring(0, 160).replace(/[#*`]/g, '').trim(),
        image: post.cover_image || `${SITE_CONFIG.url}${DEFAULT_OG_IMAGE.url}`,
        datePublished: post.published_at,
        dateModified: post.updated_at,
        author: {
            '@type': 'Organization',
            name: 'Togather',
            url: SITE_CONFIG.url,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Togather',
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_CONFIG.url}/logo.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${SITE_CONFIG.url}/news/${post.slug}`,
        },
    };
}
