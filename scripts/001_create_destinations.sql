-- Create destinations table for places in India
CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  region TEXT NOT NULL, -- North, South, East, West, Central, Northeast
  description TEXT,
  best_season TEXT, -- Summer, Winter, Monsoon, Year-round
  average_footfall TEXT, -- Low, Medium, High
  best_time_to_visit TEXT, -- Specific months
  average_budget_per_day INTEGER, -- in INR
  popular_activities TEXT[], -- Array of activities
  image_url TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster searches
CREATE INDEX idx_destinations_state ON destinations(state);
CREATE INDEX idx_destinations_region ON destinations(region);
CREATE INDEX idx_destinations_name ON destinations(name);

-- Insert sample destinations
INSERT INTO destinations (name, state, region, description, best_season, average_footfall, best_time_to_visit, average_budget_per_day, popular_activities, image_url) VALUES
('Jaipur', 'Rajasthan', 'North', 'The Pink City, known for its magnificent forts and palaces', 'Winter', 'High', 'October to March', 2500, ARRAY['Fort visits', 'Palace tours', 'Shopping', 'Cultural shows'], '/placeholder.svg?height=400&width=600'),
('Goa', 'Goa', 'West', 'Beach paradise with Portuguese heritage and vibrant nightlife', 'Winter', 'High', 'November to February', 3000, ARRAY['Beach activities', 'Water sports', 'Nightlife', 'Church visits'], '/placeholder.svg?height=400&width=600'),
('Kerala Backwaters', 'Kerala', 'South', 'Serene backwaters with houseboat experiences', 'Winter', 'Medium', 'September to March', 3500, ARRAY['Houseboat stays', 'Ayurveda', 'Wildlife', 'Tea plantations'], '/placeholder.svg?height=400&width=600'),
('Varanasi', 'Uttar Pradesh', 'North', 'Ancient spiritual city on the banks of Ganges', 'Winter', 'High', 'October to March', 1500, ARRAY['Ganga Aarti', 'Temple visits', 'Boat rides', 'Spiritual tours'], '/placeholder.svg?height=400&width=600'),
('Ladakh', 'Ladakh', 'North', 'High-altitude desert with stunning landscapes', 'Summer', 'Medium', 'May to September', 4000, ARRAY['Trekking', 'Monastery visits', 'Bike tours', 'Photography'], '/placeholder.svg?height=400&width=600'),
('Udaipur', 'Rajasthan', 'North', 'City of Lakes with romantic palaces', 'Winter', 'High', 'October to March', 2800, ARRAY['Lake tours', 'Palace visits', 'Cultural shows', 'Shopping'], '/placeholder.svg?height=400&width=600'),
('Rishikesh', 'Uttarakhand', 'North', 'Yoga capital and adventure sports hub', 'Year-round', 'Medium', 'September to November, March to May', 2000, ARRAY['Yoga', 'River rafting', 'Trekking', 'Meditation'], '/placeholder.svg?height=400&width=600'),
('Hampi', 'Karnataka', 'South', 'Ancient ruins and UNESCO World Heritage Site', 'Winter', 'Low', 'October to February', 1800, ARRAY['Historical tours', 'Rock climbing', 'Photography', 'Temple visits'], '/placeholder.svg?height=400&width=600');
