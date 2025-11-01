-- Create user-generated itineraries table
CREATE TABLE IF NOT EXISTS user_itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  destination_ids UUID[],
  start_date DATE,
  end_date DATE,
  total_budget INTEGER,
  spent_budget INTEGER DEFAULT 0,
  itinerary_data JSONB, -- Detailed itinerary with hotels, restaurants, activities
  preferences JSONB, -- User preferences used to generate this
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_itineraries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own itineraries"
  ON user_itineraries FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create their own itineraries"
  ON user_itineraries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own itineraries"
  ON user_itineraries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own itineraries"
  ON user_itineraries FOR DELETE
  USING (auth.uid() = user_id);

-- Create index
CREATE INDEX idx_user_itineraries_user_id ON user_itineraries(user_id);
