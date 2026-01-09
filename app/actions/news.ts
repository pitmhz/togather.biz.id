'use server';

import { createClient } from '@/lib/supabase/server';
import type { NewsPost } from '@/lib/supabase/types';

/**
 * Server Action Response Types
 */
interface ActionResponse<T> {
    success: boolean;
    data: T | null;
    message: string | null;
}

/**
 * Get Latest News Posts
 * 
 * Fetches the most recent published news posts for the homepage.
 * Posts are sorted by published_at in descending order.
 * 
 * @param limit - Maximum number of posts to return (default: 10)
 * @returns Array of news posts or error
 */
export async function getLatestNews(
    limit: number = 10
): Promise<ActionResponse<NewsPost[]>> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('news_posts')
            .select('*')
            .eq('status', 'published')
            .lte('published_at', new Date().toISOString())
            .order('published_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('[getLatestNews] Supabase error:', error);
            return {
                success: false,
                data: null,
                message: error.message
            };
        }

        return {
            success: true,
            data: data as NewsPost[],
            message: 'News fetched successfully'
        };
    } catch (err) {
        console.error('[getLatestNews] Unexpected error:', err);
        return {
            success: false,
            data: null,
            message: err instanceof Error ? err.message : 'Failed to fetch news posts'
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
            return { success: false, data: null, message: 'Invalid slug provided' };
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
                return { success: true, data: null, message: 'Post not found' };
            }
            console.error('[getPostBySlug] Supabase error:', error);
            return { success: false, data: null, message: error.message };
        }

        return { success: true, data: data as NewsPost, message: null };
    } catch (err) {
        console.error('[getPostBySlug] Unexpected error:', err);
        return {
            success: false,
            data: null,
            message: err instanceof Error ? err.message : 'Failed to fetch post'
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
            return { success: false, data: null, message: error.message };
        }

        return { success: true, data: data as NewsPost[], message: null };
    } catch (err) {
        console.error('[getNewsByCategory] Unexpected error:', err);
        return {
            success: false,
            data: null,
            message: err instanceof Error ? err.message : 'Failed to fetch news by category'
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
            return { success: true, data: [], message: null };
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
            return { success: false, data: null, message: error.message };
        }

        return { success: true, data: data as NewsPost[], message: null };
    } catch (err) {
        console.error('[searchNews] Unexpected error:', err);
        return {
            success: false,
            data: null,
            message: err instanceof Error ? err.message : 'Failed to search news'
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
            return { success: false, data: null, message: error.message };
        }

        console.log('[createNewsPost] Post created:', data.id);
        return { success: true, data: data as NewsPost, message: 'Post created successfully' };
    } catch (err) {
        if (err instanceof AdminAuthError) {
            return { success: false, data: null, message: err.message };
        }
        console.error('[createNewsPost] Unexpected error:', err);
        return {
            success: false,
            data: null,
            message: err instanceof Error ? err.message : 'Failed to create post'
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
            return { success: false, data: null, message: 'Post ID is required' };
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
            return { success: false, data: null, message: error.message };
        }

        console.log('[updateNewsPost] Post updated:', id);
        return { success: true, data: data as NewsPost, message: 'Post updated successfully' };
    } catch (err) {
        if (err instanceof AdminAuthError) {
            return { success: false, data: null, message: err.message };
        }
        console.error('[updateNewsPost] Unexpected error:', err);
        return {
            success: false,
            data: null,
            message: err instanceof Error ? err.message : 'Failed to update post'
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
            return { success: false, data: null, message: 'Post ID is required' };
        }

        const supabase = await createClient();

        const { error } = await supabase
            .from('news_posts')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('[deleteNewsPost] Supabase error:', error);
            return { success: false, data: null, message: error.message };
        }

        console.log('[deleteNewsPost] Post deleted:', id);
        return { success: true, data: { deleted: true }, message: 'Post deleted successfully' };
    } catch (err) {
        if (err instanceof AdminAuthError) {
            return { success: false, data: null, message: err.message };
        }
        console.error('[deleteNewsPost] Unexpected error:', err);
        return {
            success: false,
            data: null,
            message: err instanceof Error ? err.message : 'Failed to delete post'
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
            return { success: false, data: null, message: error.message };
        }

        return { success: true, data: data as NewsPost[], message: null };
    } catch (err) {
        if (err instanceof AdminAuthError) {
            return { success: false, data: null, message: err.message };
        }
        console.error('[getAllNewsPostsAdmin] Unexpected error:', err);
        return {
            success: false,
            data: null,
            message: err instanceof Error ? err.message : 'Failed to fetch posts'
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
