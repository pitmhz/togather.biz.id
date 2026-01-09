-- ============================================
-- TOGATHER LANDING: NEWS STATUS & STORAGE
-- Migration: 003_news_status_storage
-- Description: Adds status workflow and media storage bucket
-- ============================================

-- ============================================
-- TASK 13: STORAGE BUCKET FOR MEDIA
-- ============================================

-- Create the news-assets storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('news-assets', 'news-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Public read access (for landing page display)
CREATE POLICY "news_assets_public_read"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'news-assets');

-- Policy: Authenticated admins can upload
CREATE POLICY "news_assets_admin_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'news-assets' AND
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Policy: Authenticated admins can update
CREATE POLICY "news_assets_admin_update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'news-assets' AND
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    bucket_id = 'news-assets' AND
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Policy: Authenticated admins can delete
CREATE POLICY "news_assets_admin_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'news-assets' AND
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- ============================================
-- TASK 14: NEWS POST STATUS COLUMN
-- ============================================

-- Add status column with default 'draft'
ALTER TABLE news_posts
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft'
CHECK (status IN ('draft', 'published', 'archived'));

-- Update existing posts to 'published' (they were visible before)
UPDATE news_posts
SET status = 'published'
WHERE status = 'draft';

-- Add index for status filtering
CREATE INDEX IF NOT EXISTS idx_news_posts_status
  ON news_posts (status);

-- Update RLS policy for public select to include status check
DROP POLICY IF EXISTS "news_posts_public_select" ON news_posts;

CREATE POLICY "news_posts_public_select" 
  ON news_posts
  FOR SELECT
  TO public
  USING (
    status = 'published' AND
    published_at IS NOT NULL AND 
    published_at <= NOW()
  );

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON COLUMN news_posts.status IS 'Post workflow status: draft, published, or archived';
