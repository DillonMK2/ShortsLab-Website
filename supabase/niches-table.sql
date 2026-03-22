-- Niches table for ShortsFlow niche management
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS niches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Entertainment', 'True Crime', 'Finance', 'Military', 'Gaming', 'Tech', 'Sports', 'Lifestyle', 'Education', 'Other')),
  heat TEXT NOT NULL CHECK (heat IN ('exploding', 'rising', 'stable', 'declining')),
  competition TEXT NOT NULL CHECK (competition IN ('low', 'medium', 'high')),
  content_style TEXT,
  description TEXT,
  how_to_start TEXT,
  where_to_find_ideas TEXT,
  example_hooks TEXT[], -- Array of text for multiple hooks
  estimated_views TEXT, -- e.g., "500K-2M"
  posting_frequency TEXT, -- e.g., "3-5 per week"
  publish_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE niches ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published niches (publish_date <= now)
CREATE POLICY "Anyone can read published niches"
  ON niches
  FOR SELECT
  USING (publish_date <= NOW());

-- Policy: Service role can manage all niches (admin operations)
CREATE POLICY "Service role can manage niches"
  ON niches
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create index for faster lookups
CREATE INDEX idx_niches_category ON niches(category);
CREATE INDEX idx_niches_heat ON niches(heat);
CREATE INDEX idx_niches_publish_date ON niches(publish_date);
