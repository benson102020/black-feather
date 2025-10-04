/*
  # Complete Ride System v2
  
  Creates all necessary tables and functions for complete ride flow
*/

-- Create verification_codes table
CREATE TABLE IF NOT EXISTS verification_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text NOT NULL,
  code text NOT NULL,
  verified boolean DEFAULT false,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  attempts integer DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_verification_codes_phone ON verification_codes(phone_number);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires ON verification_codes(expires_at);

-- Create ride_status_history table
CREATE TABLE IF NOT EXISTS ride_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id uuid REFERENCES rides(id) ON DELETE CASCADE,
  status text NOT NULL,
  changed_by uuid,
  notes text,
  location_lat numeric,
  location_lng numeric,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ride_status_history_ride ON ride_status_history(ride_id);
CREATE INDEX IF NOT EXISTS idx_ride_status_history_created ON ride_status_history(created_at DESC);

-- Add columns to drivers table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drivers' AND column_name = 'is_online') THEN
    ALTER TABLE drivers ADD COLUMN is_online boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drivers' AND column_name = 'current_lat') THEN
    ALTER TABLE drivers ADD COLUMN current_lat numeric;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drivers' AND column_name = 'current_lng') THEN
    ALTER TABLE drivers ADD COLUMN current_lng numeric;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drivers' AND column_name = 'last_seen') THEN
    ALTER TABLE drivers ADD COLUMN last_seen timestamptz DEFAULT now();
  END IF;
END $$;

-- Add columns to rides table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rides' AND column_name = 'payment_completed') THEN
    ALTER TABLE rides ADD COLUMN payment_completed boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rides' AND column_name = 'payment_method') THEN
    ALTER TABLE rides ADD COLUMN payment_method text;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_status_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow anon full access to verification_codes" ON verification_codes;
DROP POLICY IF EXISTS "Allow authenticated full access to verification_codes" ON verification_codes;
DROP POLICY IF EXISTS "Allow anon full access to ride_status_history" ON ride_status_history;
DROP POLICY IF EXISTS "Allow authenticated full access to ride_status_history" ON ride_status_history;

-- Create policies for verification_codes
CREATE POLICY "Allow anon full access to verification_codes"
  ON verification_codes FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to verification_codes"
  ON verification_codes FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create policies for ride_status_history
CREATE POLICY "Allow anon full access to ride_status_history"
  ON ride_status_history FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to ride_status_history"
  ON ride_status_history FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Function to track ride status changes
CREATE OR REPLACE FUNCTION track_ride_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO ride_status_history (ride_id, status, notes)
    VALUES (NEW.id, NEW.status, 'Status changed from ' || COALESCE(OLD.status, 'null') || ' to ' || NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for ride status changes
DROP TRIGGER IF EXISTS ride_status_change_trigger ON rides;
CREATE TRIGGER ride_status_change_trigger
  AFTER UPDATE ON rides
  FOR EACH ROW
  EXECUTE FUNCTION track_ride_status_change();

SELECT 'Complete ride system created successfully' as status;
