import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { SITE_CONFIG } from '@/lib/metadata';

/**
 * Dynamic Sitemap Generator
 * 
 * Generates sitemap.xml with:
 * - Static pages (/, /features, /pricing, /news)
 * - Dynamic news post URLs from Supabase
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = SITE_CONFIG.url;

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/features`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/pricing`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/news`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
    ];

    // Dynamic news posts
    let newsPosts: MetadataRoute.Sitemap = [];

    try {
        const supabase = await createClient();

        const { data: posts } = await supabase
            .from('news_posts')
            .select('slug, updated_at, published_at')
            .lte('published_at', new Date().toISOString())
            .order('published_at', { ascending: false });

        if (posts) {
            newsPosts = posts.map((post) => ({
                url: `${baseUrl}/news/${post.slug}`,
                lastModified: new Date(post.updated_at || post.published_at),
                changeFrequency: 'weekly' as const,
                priority: 0.6,
            }));
        }
    } catch (error) {
        console.error('[sitemap] Error fetching news posts:', error);
        // Continue with static pages only
    }

    return [...staticPages, ...newsPosts];
}
