-- ============================================
-- TOGATHER LANDING: LANDING LEADS SCHEMA
-- Migration: 002_landing_leads
-- Description: Lead capture system for church leader inquiries
-- ============================================

-- Lead Status Enum
CREATE TYPE lead_status AS ENUM ('New', 'Contacted', 'Converted');

-- Table: landing_leads
-- Captures interest from potential church leaders
CREATE TABLE IF NOT EXISTS landing_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_name TEXT NOT NULL,
  leader_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  estimated_members INTEGER,
  status lead_status NOT NULL DEFAULT 'New',
  notes TEXT,
  source TEXT DEFAULT 'landing_page', -- Track where lead came from
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments for documentation
COMMENT ON TABLE landing_leads IS 'Lead Pipeline: Captures church leader interest from landing page';
COMMENT ON COLUMN landing_leads.status IS 'Lead status: New, Contacted, or Converted';
COMMENT ON COLUMN landing_leads.source IS 'Origin of the lead (landing_page, referral, etc)';

-- ============================================
-- INDEXES
-- ============================================

-- Index on email for duplicate checking
CREATE INDEX IF NOT EXISTS idx_landing_leads_email 
  ON landing_leads (email);

-- Index on status for filtering
CREATE INDEX IF NOT EXISTS idx_landing_leads_status 
  ON landing_leads (status);

-- Index on created_at for chronological queries
CREATE INDEX IF NOT EXISTS idx_landing_leads_created_at 
  ON landing_leads (created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE landing_leads ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can submit a lead (INSERT)
CREATE POLICY "landing_leads_public_insert"
  ON landing_leads
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Only admins can view leads
CREATE POLICY "landing_leads_admin_select"
  ON landing_leads
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Policy: Only admins can update leads (change status, add notes)
CREATE POLICY "landing_leads_admin_update"
  ON landing_leads
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Policy: Only admins can delete leads
CREATE POLICY "landing_leads_admin_delete"
  ON landing_leads
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- ============================================
-- TRIGGER: Auto-update updated_at timestamp
-- ============================================

CREATE OR REPLACE FUNCTION update_landing_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_landing_leads_updated_at ON landing_leads;
CREATE TRIGGER trigger_landing_leads_updated_at
  BEFORE UPDATE ON landing_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_landing_leads_updated_at();
