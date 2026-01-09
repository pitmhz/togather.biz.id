/**
 * News Post Category Types
 * "Industrial" naming: Mission Log categories for operational updates
 */
export type NewsCategory = 'Announcement' | 'Update' | 'Tips';

/**
 * News Post Status Types
 * Workflow states for content management
 */
export type NewsStatus = 'draft' | 'published' | 'archived';

/**
 * News Post Database Row Type
 */
export interface NewsPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    cover_image: string | null;
    author_id: string | null;
    published_at: string;
    category: NewsCategory;
    status: NewsStatus;
    created_at: string;
    updated_at: string;
}

/**
 * News Post Insert Type (for creating new posts)
 */
export interface NewsPostInsert {
    title: string;
    slug: string;
    content: string;
    cover_image?: string | null;
    author_id?: string | null;
    published_at?: string;
    category: NewsCategory;
    status?: NewsStatus;
}

/**
 * News Post Update Type (for updating existing posts)
 */
export interface NewsPostUpdate {
    title?: string;
    slug?: string;
    content?: string;
    cover_image?: string | null;
    published_at?: string;
    category?: NewsCategory;
    status?: NewsStatus;
    updated_at?: string;
}

/**
 * Database schema type for Supabase client typing
 */
export interface Database {
    public: {
        Tables: {
            news_posts: {
                Row: NewsPost;
                Insert: NewsPostInsert;
                Update: NewsPostUpdate;
            };
        };
    };
}
