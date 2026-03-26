-- Private Voice Users Table
-- Stores users who have access to private/cloned voices via ElevenLabs

CREATE TABLE IF NOT EXISTS private_voice_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast email lookups
CREATE INDEX IF NOT EXISTS idx_private_voice_users_email ON private_voice_users(email);

-- Row Level Security
ALTER TABLE private_voice_users ENABLE ROW LEVEL SECURITY;

-- Only service role can manage this table (admin operations)
CREATE POLICY "Service role can manage private voice users"
  ON private_voice_users
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Allow public read access for checking if a user has private voice access
-- This is needed for the API endpoint that Cloudflare Worker calls
CREATE POLICY "Anyone can check private voice access"
  ON private_voice_users
  FOR SELECT
  USING (true);

-- Insert default user with private voice access
INSERT INTO private_voice_users (email)
VALUES ('dagingaking@gmail.com')
ON CONFLICT (email) DO NOTHING;
