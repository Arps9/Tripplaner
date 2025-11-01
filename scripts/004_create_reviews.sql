-- Create reviews table for aggregated social media reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  source TEXT NOT NULL, -- Twitter, Instagram, etc.
  sentiment TEXT, -- Positive, Negative, Neutral
  content TEXT,
  author TEXT,
  posted_at TIMESTAMPTZ,
  aggregated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_reviews_destination_id ON reviews(destination_id);
CREATE INDEX idx_reviews_sentiment ON reviews(sentiment);

-- Insert sample reviews
INSERT INTO reviews (destination_id, source, sentiment, content, author, posted_at) 
SELECT 
  d.id,
  'Twitter',
  'Positive',
  'Amazing experience in ' || d.name || '! The culture and hospitality are incredible.',
  '@traveler' || floor(random() * 1000)::text,
  NOW() - (floor(random() * 30) || ' days')::interval
FROM destinations d
LIMIT 20;
