import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/metadata';

/**
 * Robots.txt Configuration
 * 
 * Standard crawler rules for togather.biz.id
 * Points to the dynamic sitemap
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
    const baseUrl = SITE_CONFIG.url;

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/api/',
                    '/_next/',
                    '/private/',
                ],
            },
            // Specific rules for search engines
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/admin/', '/api/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
