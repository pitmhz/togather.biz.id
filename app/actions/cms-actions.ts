'use server';

import { createClient } from '@/lib/supabase/server';
import { validateAdminSession, AdminAuthError } from '@/lib/auth/admin';
import type { NewsPost, NewsPostInsert, NewsPostUpdate } from '@/lib/supabase/types';

/**
 * CMS Action Response Type
 * "Dossier" naming convention for metadata handling
 */
interface DossierResponse<T> {
    success: boolean;
    data: T | null;
    message: string | null;
}

// ============================================
// TASK 15: CONTENT MANAGEMENT ACTIONS
// ============================================

/**
 * Upload News Image
 * 
 * Uploads an image to the news-assets storage bucket.
 * Requires admin authentication.
 * 
 * @param formData - FormData containing the file
 * @returns Public URL of the uploaded image
 */
export async function uploadNewsImage(
    formData: FormData
): Promise<DossierResponse<{ url: string; path: string }>> {
    try {
        await validateAdminSession();

        const file = formData.get('file') as File;
        if (!file) {
            return { success: false, data: null, message: 'No file provided' };
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return { success: false, data: null, message: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' };
        }

        // Max size: 5MB
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return { success: false, data: null, message: 'File too large. Maximum size: 5MB' };
        }

        const supabase = await createClient();

        // Generate unique filename
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `uploads/${timestamp}_${sanitizedName}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
            .from('news-assets')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) {
            console.error('[uploadNewsImage] Upload error:', uploadError);
            return { success: false, data: null, message: uploadError.message };
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('news-assets')
            .getPublicUrl(filePath);

        console.log('[uploadNewsImage] Image uploaded:', filePath);
        return {
            success: true,
            data: { url: urlData.publicUrl, path: filePath },
            message: 'Image uploaded successfully',
        };
    } catch (err) {
        if (err instanceof AdminAuthError) {
            return { success: false, data: null, message: err.message };
        }
        console.error('[uploadNewsImage] Unexpected error:', err);
        return {
            success: false,
            data: null,
            message: err instanceof Error ? err.message : 'Failed to upload image',
        };
    }
}

/**
 * Upsert News Post
 * 
 * Creates a new post or updates an existing one.
 * Requires admin authentication.
 * 
 * @param postData - Post data (include `id` for update)
 * @returns Created/updated post
 */
export async function upsertNewsPost(
    postData: NewsPostInsert & { id?: string }
): Promise<DossierResponse<NewsPost>> {
    try {
        await validateAdminSession();

        const supabase = await createClient();

        // Generate slug from title if not provided
        const slug = postData.slug || generateSlug(postData.title);

        if (postData.id) {
            // UPDATE existing post
            const updatePayload: NewsPostUpdate = {
                title: postData.title,
                slug,
                content: postData.content,
                cover_image: postData.cover_image,
                category: postData.category,
                status: postData.status,
                published_at: postData.published_at,
                updated_at: new Date().toISOString(),
            };

            const { data, error } = await supabase
                .from('news_posts')
                .update(updatePayload)
                .eq('id', postData.id)
                .select()
                .single();

            if (error) {
                console.error('[upsertNewsPost] Update error:', error);
                return { success: false, data: null, message: error.message };
            }

            console.log('[upsertNewsPost] Post updated:', data.id);
            return { success: true, data: data as NewsPost, message: 'Post updated successfully' };
        } else {
            // INSERT new post
            const { data, error } = await supabase
                .from('news_posts')
                .insert({
                    ...postData,
                    slug,
                    status: postData.status || 'draft',
                })
                .select()
                .single();

            if (error) {
                console.error('[upsertNewsPost] Insert error:', error);
                return { success: false, data: null, message: error.message };
            }

            console.log('[upsertNewsPost] Post created:', data.id);
            return { success: true, data: data as NewsPost, message: 'Post created successfully' };
        }
    } catch (err) {
        if (err instanceof AdminAuthError) {
            return { success: false, data: null, message: err.message };
        }
        console.error('[upsertNewsPost] Unexpected error:', err);
        return {
            success: false,
            data: null,
            message: err instanceof Error ? err.message : 'Failed to save post',
        };
    }
}

/**
 * Delete News Post
 * 
 * Deletes a post and its associated cover image from storage.
 * Requires admin authentication.
 * 
 * @param id - Post ID
 * @returns Success status
 */
export async function deleteNewsPost(
    id: string
): Promise<DossierResponse<{ deleted: boolean }>> {
    try {
        await validateAdminSession();

        if (!id) {
            return { success: false, data: null, message: 'Post ID is required' };
        }

        const supabase = await createClient();

        // First, get the post to find its cover image
        const { data: post, error: fetchError } = await supabase
            .from('news_posts')
            .select('cover_image')
            .eq('id', id)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('[deleteNewsPost] Fetch error:', fetchError);
            return { success: false, data: null, message: fetchError.message };
        }

        // Delete the cover image from storage if it exists
        if (post?.cover_image) {
            // Extract path from URL (assuming format: .../news-assets/uploads/...)
            const urlParts = post.cover_image.split('/news-assets/');
            if (urlParts.length > 1) {
                const imagePath = urlParts[1];
                const { error: storageError } = await supabase.storage
                    .from('news-assets')
                    .remove([imagePath]);

                if (storageError) {
                    console.warn('[deleteNewsPost] Failed to delete image:', storageError);
                    // Continue with post deletion even if image deletion fails
                }
            }
        }

        // Delete the post
        const { error: deleteError } = await supabase
            .from('news_posts')
            .delete()
            .eq('id', id);

        if (deleteError) {
            console.error('[deleteNewsPost] Delete error:', deleteError);
            return { success: false, data: null, message: deleteError.message };
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
            message: err instanceof Error ? err.message : 'Failed to delete post',
        };
    }
}

/**
 * Get Admin News (All Statuses)
 * 
 * Fetches all posts including drafts and archived for admin dashboard.
 * Requires admin authentication.
 * 
 * @returns All posts
 */
export async function getAdminNews(): Promise<DossierResponse<NewsPost[]>> {
    try {
        await validateAdminSession();

        const supabase = await createClient();

        const { data, error } = await supabase
            .from('news_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[getAdminNews] Supabase error:', error);
            return { success: false, data: null, message: error.message };
        }

        return { success: true, data: data as NewsPost[], message: null };
    } catch (err) {
        if (err instanceof AdminAuthError) {
            return { success: false, data: null, message: err.message };
        }
        console.error('[getAdminNews] Unexpected error:', err);
        return {
            success: false,
            data: null,
            message: err instanceof Error ? err.message : 'Failed to fetch posts',
        };
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

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
