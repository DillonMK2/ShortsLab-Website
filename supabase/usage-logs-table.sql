-- Usage logs table for tracking API usage by feature
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/fchpwgjeapgfzsrxzslr/sql/new

CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature TEXT NOT NULL CHECK (feature IN ('chat', 'rewrite', 'voiceover', 'ideation', 'research')),
  credits_used INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role can read (admin panel uses service role key)
-- No user-facing access - all queries go through admin API routes
CREATE POLICY "Service role can manage usage_logs"
  ON usage_logs
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create indexes for efficient querying
CREATE INDEX idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX idx_usage_logs_feature ON usage_logs(feature);
CREATE INDEX idx_usage_logs_created_at ON usage_logs(created_at DESC);
CREATE INDEX idx_usage_logs_user_created ON usage_logs(user_id, created_at DESC);

-- Composite index for feature + time range queries
CREATE INDEX idx_usage_logs_feature_created ON usage_logs(feature, created_at DESC);
