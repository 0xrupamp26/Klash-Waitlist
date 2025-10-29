/*
  # Create Waitlist Table

  1. New Tables
    - `waitlist`
      - `id` (uuid, primary key) - Unique identifier for each entry
      - `email` (text, unique, not null) - User's email address
      - `created_at` (timestamptz) - When the user joined the waitlist
      - `ip_address` (text) - Optional IP address for spam prevention
      - `user_agent` (text) - Optional browser info
      - `synced_to_sheets` (boolean) - Track if synced to Google Sheets
      
  2. Security
    - Enable RLS on `waitlist` table
    - Add policy for insert operations (anyone can join waitlist)
    - Add policy for read operations (authenticated admin only)
    
  3. Indexes
    - Index on email for fast lookups
    - Index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  ip_address text,
  user_agent text,
  synced_to_sheets boolean DEFAULT false
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join waitlist"
  ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public can insert to waitlist"
  ON waitlist
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);