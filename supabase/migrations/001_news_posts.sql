-- ============================================
-- TOGATHER LANDING: NEWS POSTS SCHEMA
-- Migration: 001_news_posts
-- Description: Creates the news_posts table for Mission Log/News Feed CMS
-- ============================================

-- Table: news_posts
-- Stores news articles, announcements, updates, and tips for the landing page
CREATE TABLE IF NOT EXISTS news_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL, -- Supports rich text/markdown
  cover_image TEXT, -- URL to cover image
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  category TEXT NOT NULL CHECK (category IN ('Announcement', 'Update', 'Tips')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comment on table for documentation
COMMENT ON TABLE news_posts IS 'Mission Log: News feed for Togather landing page';
COMMENT ON COLUMN news_posts.category IS 'Post category: Announcement, Update, or Tips';
COMMENT ON COLUMN news_posts.content IS 'Rich text/markdown content for the post';

-- ============================================
-- INDEXES
-- ============================================

-- GIN Index for full-text search on title and content
-- Enables efficient search queries using to_tsvector
CREATE INDEX IF NOT EXISTS idx_news_posts_search 
  ON news_posts 
  USING GIN (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '')));

-- Index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_news_posts_slug 
  ON news_posts (slug);

-- Index on published_at for chronological queries
CREATE INDEX IF NOT EXISTS idx_news_posts_published_at 
  ON news_posts (published_at DESC);

-- Index on category for filtering
CREATE INDEX IF NOT EXISTS idx_news_posts_category 
  ON news_posts (category);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on the table
ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Public (Everyone) can read published posts
-- Posts are visible once published_at is in the past
CREATE POLICY "news_posts_public_select" 
  ON news_posts
  FOR SELECT
  TO public
  USING (published_at IS NOT NULL AND published_at <= NOW());

-- Policy: Authenticated admins can insert new posts
-- Admin check: user metadata has role = 'admin'
CREATE POLICY "news_posts_admin_insert"
  ON news_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Policy: Authenticated admins can update posts
CREATE POLICY "news_posts_admin_update"
  ON news_posts
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Policy: Authenticated admins can delete posts
CREATE POLICY "news_posts_admin_delete"
  ON news_posts
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- ============================================
-- TRIGGER: Auto-update updated_at timestamp
-- ============================================

-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_news_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at on row update
DROP TRIGGER IF EXISTS trigger_news_posts_updated_at ON news_posts;
CREATE TRIGGER trigger_news_posts_updated_at
  BEFORE UPDATE ON news_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_news_posts_updated_at();
