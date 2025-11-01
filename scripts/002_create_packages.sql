-- Create pre-built travel packages
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL,
  destination_ids UUID[] NOT NULL, -- Array of destination IDs
  total_budget INTEGER NOT NULL, -- in INR
  includes TEXT[], -- What's included
  itinerary JSONB, -- Detailed day-by-day itinerary
  difficulty_level TEXT, -- Easy, Moderate, Challenging
  best_for TEXT[], -- Solo, Couples, Families, Groups
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample packages
INSERT INTO packages (name, description, duration_days, destination_ids, total_budget, includes, difficulty_level, best_for, image_url) VALUES
('Golden Triangle Tour', 'Experience Delhi, Agra, and Jaipur in one amazing journey', 7, ARRAY[]::UUID[], 35000, ARRAY['Hotels', 'Breakfast', 'Transport', 'Guide'], 'Easy', ARRAY['Families', 'Couples', 'First-timers'], '/placeholder.svg?height=400&width=600'),
('Kerala Backwater Escape', 'Relax in the serene backwaters with houseboat experience', 5, ARRAY[]::UUID[], 28000, ARRAY['Houseboat', 'All meals', 'Ayurveda spa', 'Transport'], 'Easy', ARRAY['Couples', 'Families'], '/placeholder.svg?height=400&width=600'),
('Ladakh Adventure', 'High-altitude adventure with stunning landscapes', 10, ARRAY[]::UUID[], 55000, ARRAY['Hotels', 'Meals', 'Bike rental', 'Permits', 'Guide'], 'Challenging', ARRAY['Solo', 'Groups', 'Adventure seekers'], '/placeholder.svg?height=400&width=600'),
('Spiritual India', 'Journey through Varanasi, Rishikesh, and Haridwar', 6, ARRAY[]::UUID[], 22000, ARRAY['Hotels', 'Breakfast', 'Transport', 'Yoga sessions'], 'Easy', ARRAY['Solo', 'Spiritual seekers'], '/placeholder.svg?height=400&width=600');
