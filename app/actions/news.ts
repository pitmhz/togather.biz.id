'use server';

import { createClient } from '@/lib/supabase/server';
import type { NewsPost } from '@/lib/supabase/types';

/**
 * Server Action Response Types
 */
interface ActionResponse<T> {
    data: T | null;
    error: string | null;
}

/**
 * Get Latest News Posts
 * 
 * Fetches the most recent published news posts for the homepage.
 * Posts are sorted by published_at in descending order.
 * 
 * @param limit - Maximum number of posts to return (default: 10)
 * @returns Array of news posts or error
 * 
 * @example
 * ```tsx
 * const { data: posts, error } = await getLatestNews(5);
 * if (error) console.error(error);
 * posts?.map(post => <NewsCard key={post.id} post={post} />);
 * ```
 */
export async function getLatestNews(
    limit: number = 10
): Promise<ActionResponse<NewsPost[]>> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('news_posts')
            .select('*')
            .lte('published_at', new Date().toISOString())
            .order('published_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('[getLatestNews] Supabase error:', error);
            return { data: null, error: error.message };
        }

        return { data: data as NewsPost[], error: null };
    } catch (err) {
        console.error('[getLatestNews] Unexpected error:', err);
        return {
            data: null,
            error: err instanceof Error ? err.message : 'Failed to fetch news posts'
        };
    }
}

/**
 * Get News Post by Slug
 * 
 * Fetches a single news post by its URL slug.
 * Only returns published posts (published_at <= now).
 * 
 * @param slug - The unique URL slug of the post
 * @returns Single news post or null if not found
 * 
 * @example
 * ```tsx
 * const { data: post, error } = await getPostBySlug('welcome-to-togather');
 * if (error) notFound();
 * return <NewsArticle post={post} />;
 * ```
 */
export async function getPostBySlug(
    slug: string
): Promise<ActionResponse<NewsPost>> {
    try {
        if (!slug || typeof slug !== 'string') {
            return { data: null, error: 'Invalid slug provided' };
        }

        const supabase = await createClient();

        const { data, error } = await supabase
            .from('news_posts')
            .select('*')
            .eq('slug', slug)
            .lte('published_at', new Date().toISOString())
            .single();

        if (error) {
            // PGRST116 = Row not found (not an error for this use case)
            if (error.code === 'PGRST116') {
                return { data: null, error: null };
            }
            console.error('[getPostBySlug] Supabase error:', error);
            return { data: null, error: error.message };
        }

        return { data: data as NewsPost, error: null };
    } catch (err) {
        console.error('[getPostBySlug] Unexpected error:', err);
        return {
            data: null,
            error: err instanceof Error ? err.message : 'Failed to fetch post'
        };
    }
}

/**
 * Get News Posts by Category
 * 
 * Fetches published news posts filtered by category.
 * 
 * @param category - The category to filter by (Announcement, Update, Tips)
 * @param limit - Maximum number of posts to return (default: 10)
 * @returns Array of news posts matching the category
 */
export async function getNewsByCategory(
    category: 'Announcement' | 'Update' | 'Tips',
    limit: number = 10
): Promise<ActionResponse<NewsPost[]>> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('news_posts')
            .select('*')
            .eq('category', category)
            .lte('published_at', new Date().toISOString())
            .order('published_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('[getNewsByCategory] Supabase error:', error);
            return { data: null, error: error.message };
        }

        return { data: data as NewsPost[], error: null };
    } catch (err) {
        console.error('[getNewsByCategory] Unexpected error:', err);
        return {
            data: null,
            error: err instanceof Error ? err.message : 'Failed to fetch news by category'
        };
    }
}

/**
 * Search News Posts
 * 
 * Full-text search across news post titles and content.
 * Uses the GIN index for efficient searching.
 * 
 * @param query - Search query string
 * @param limit - Maximum number of results (default: 20)
 * @returns Array of matching news posts
 */
export async function searchNews(
    query: string,
    limit: number = 20
): Promise<ActionResponse<NewsPost[]>> {
    try {
        if (!query || query.trim().length < 2) {
            return { data: [], error: null };
        }

        const supabase = await createClient();

        // Use PostgreSQL full-text search
        const { data, error } = await supabase
            .from('news_posts')
            .select('*')
            .lte('published_at', new Date().toISOString())
            .textSearch('title', query, { type: 'websearch' })
            .order('published_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('[searchNews] Supabase error:', error);
            return { data: null, error: error.message };
        }

        return { data: data as NewsPost[], error: null };
    } catch (err) {
        console.error('[searchNews] Unexpected error:', err);
        return {
            data: null,
            error: err instanceof Error ? err.message : 'Failed to search news'
        };
    }
}

// ============================================
// ADMIN-ONLY ACTIONS
// Protected by validateAdminSession()
// ============================================

import { validateAdminSession, AdminAuthError } from '@/lib/auth/admin';
import type { NewsPostInsert, NewsPostUpdate } from '@/lib/supabase/types';

/**
 * Create News Post (Admin Only)
 * 
 * Creates a new news post. Requires admin authentication.
 * 
 * @param post - News post data
 * @returns Created post or error
 */
export async function createNewsPost(
    post: NewsPostInsert
): Promise<ActionResponse<NewsPost>> {
    try {
        // Validate admin session
        await validateAdminSession();

        const supabase = await createClient();

        // Generate slug from title if not provided
        const slug = post.slug || generateSlug(post.title);

        const { data, error } = await supabase
            .from('news_posts')
            .insert({
                ...post,
                slug,
            })
            .select()
            .single();

        if (error) {
            console.error('[createNewsPost] Supabase error:', error);
            return { data: null, error: error.message };
        }

        console.log('[createNewsPost] Post created:', data.id);
        return { data: data as NewsPost, error: null };
    } catch (err) {
        if (err instanceof AdminAuthError) {
            return { data: null, error: err.message };
        }
        console.error('[createNewsPost] Unexpected error:', err);
        return {
            data: null,
            error: err instanceof Error ? err.message : 'Failed to create post'
        };
    }
}

/**
 * Update News Post (Admin Only)
 * 
 * Updates an existing news post. Requires admin authentication.
 * 
 * @param id - Post ID
 * @param updates - Fields to update
 * @returns Updated post or error
 */
export async function updateNewsPost(
    id: string,
    updates: NewsPostUpdate
): Promise<ActionResponse<NewsPost>> {
    try {
        // Validate admin session
        await validateAdminSession();

        if (!id) {
            return { data: null, error: 'Post ID is required' };
        }

        const supabase = await createClient();

        const { data, error } = await supabase
            .from('news_posts')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('[updateNewsPost] Supabase error:', error);
            return { data: null, error: error.message };
        }

        console.log('[updateNewsPost] Post updated:', id);
        return { data: data as NewsPost, error: null };
    } catch (err) {
        if (err instanceof AdminAuthError) {
            return { data: null, error: err.message };
        }
        console.error('[updateNewsPost] Unexpected error:', err);
        return {
            data: null,
            error: err instanceof Error ? err.message : 'Failed to update post'
        };
    }
}

/**
 * Delete News Post (Admin Only)
 * 
 * Deletes a news post. Requires admin authentication.
 * 
 * @param id - Post ID
 * @returns Success status or error
 */
export async function deleteNewsPost(
    id: string
): Promise<ActionResponse<{ deleted: boolean }>> {
    try {
        // Validate admin session
        await validateAdminSession();

        if (!id) {
            return { data: null, error: 'Post ID is required' };
        }

        const supabase = await createClient();

        const { error } = await supabase
            .from('news_posts')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('[deleteNewsPost] Supabase error:', error);
            return { data: null, error: error.message };
        }

        console.log('[deleteNewsPost] Post deleted:', id);
        return { data: { deleted: true }, error: null };
    } catch (err) {
        if (err instanceof AdminAuthError) {
            return { data: null, error: err.message };
        }
        console.error('[deleteNewsPost] Unexpected error:', err);
        return {
            data: null,
            error: err instanceof Error ? err.message : 'Failed to delete post'
        };
    }
}

/**
 * Get All News Posts (Admin Only)
 * 
 * Fetches all posts including unpublished ones for admin dashboard.
 * 
 * @returns All posts or error
 */
export async function getAllNewsPostsAdmin(): Promise<ActionResponse<NewsPost[]>> {
    try {
        await validateAdminSession();

        const supabase = await createClient();

        const { data, error } = await supabase
            .from('news_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[getAllNewsPostsAdmin] Supabase error:', error);
            return { data: null, error: error.message };
        }

        return { data: data as NewsPost[], error: null };
    } catch (err) {
        if (err instanceof AdminAuthError) {
            return { data: null, error: err.message };
        }
        console.error('[getAllNewsPostsAdmin] Unexpected error:', err);
        return {
            data: null,
            error: err instanceof Error ? err.message : 'Failed to fetch posts'
        };
    }
}

/**
 * Generate URL slug from title
 */
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 100);
}
