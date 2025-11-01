-- Create hotels table
CREATE TABLE IF NOT EXISTS hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT, -- Budget, Mid-range, Luxury
  price_per_night INTEGER, -- in INR
  rating DECIMAL(2, 1),
  amenities TEXT[],
  address TEXT,
  contact TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cuisine_type TEXT[],
  price_range TEXT, -- Budget, Mid-range, Fine-dining
  rating DECIMAL(2, 1),
  specialties TEXT[],
  address TEXT,
  contact TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create attractions table
CREATE TABLE IF NOT EXISTS attractions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT, -- Historical, Religious, Natural, Adventure, Cultural
  entry_fee INTEGER, -- in INR
  time_required TEXT, -- e.g., "2-3 hours"
  rating DECIMAL(2, 1),
  description TEXT,
  best_time_to_visit TEXT,
  address TEXT,
  image_url TEXT,
  youtube_video_id TEXT, -- For embedded videos
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_hotels_destination_id ON hotels(destination_id);
CREATE INDEX idx_restaurants_destination_id ON restaurants(destination_id);
CREATE INDEX idx_attractions_destination_id ON attractions(destination_id);

-- Insert sample data
INSERT INTO hotels (destination_id, name, category, price_per_night, rating, amenities, address) 
SELECT 
  id,
  'Hotel ' || name,
  'Mid-range',
  2500,
  4.2,
  ARRAY['WiFi', 'Breakfast', 'AC', 'Parking'],
  name || ', India'
FROM destinations
LIMIT 5;

INSERT INTO restaurants (destination_id, name, cuisine_type, price_range, rating, specialties, address)
SELECT 
  id,
  name || ' Restaurant',
  ARRAY['Indian', 'Local'],
  'Mid-range',
  4.3,
  ARRAY['Local dishes', 'Vegetarian options'],
  name || ', India'
FROM destinations
LIMIT 5;
