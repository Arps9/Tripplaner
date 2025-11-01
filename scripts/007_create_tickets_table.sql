-- Create tickets table for transport and entry tickets
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_type TEXT NOT NULL, -- 'train', 'flight', 'bus', 'entry_pass', 'attraction_pass'
  name TEXT NOT NULL,
  description TEXT,
  source TEXT, -- For transport tickets
  destination TEXT, -- For transport tickets
  travel_date DATE,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  available_quantity INTEGER DEFAULT -1, -- -1 = unlimited
  image_url TEXT,
  provider TEXT, -- 'IRCTC', 'Indigo', 'RedBus', etc.
  booking_url TEXT,
  duration_hours INTEGER, -- For attractions/passes
  validity_days INTEGER, -- For passes
  benefits JSONB, -- Array of included benefits
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user ticket bookings table
CREATE TABLE IF NOT EXISTS user_ticket_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  itinerary_id UUID REFERENCES user_itineraries(id) ON DELETE CASCADE,
  ticket_id UUID REFERENCES tickets(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(12, 2),
  booking_status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled'
  booking_date DATE,
  passenger_details JSONB, -- Array of passenger info
  confirmation_number TEXT,
  booking_reference_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ticket_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tickets (public read)
CREATE POLICY "Anyone can view available tickets"
  ON tickets FOR SELECT
  USING (true);

-- RLS Policies for user_ticket_bookings
CREATE POLICY "Users can view their own bookings"
  ON user_ticket_bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON user_ticket_bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON user_ticket_bookings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookings"
  ON user_ticket_bookings FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_tickets_type ON tickets(ticket_type);
CREATE INDEX idx_tickets_provider ON tickets(provider);
CREATE INDEX idx_user_bookings_user_id ON user_ticket_bookings(user_id);
CREATE INDEX idx_user_bookings_itinerary_id ON user_ticket_bookings(itinerary_id);
