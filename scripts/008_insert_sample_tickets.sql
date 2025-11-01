-- Insert sample tickets for various transport options
INSERT INTO tickets (ticket_type, name, description, source, destination, price, provider, image_url, benefits)
VALUES
  ('train', 'Delhi to Jaipur Express', 'Fast train service', 'Delhi', 'Jaipur', 500, 'IRCTC', '/placeholder.svg?height=400&width=600', '["AC Comfort", "Meals Included", "WiFi"]'::jsonb),
  ('train', 'Jaipur to Delhi Shatabdi', 'Premium express train', 'Jaipur', 'Delhi', 800, 'IRCTC', '/placeholder.svg?height=400&width=600', '["First Class", "Meals", "WiFi", "Priority Seating"]'::jsonb),
  ('flight', 'Delhi to Mumbai Flight', 'Direct flight service', 'Delhi', 'Mumbai', 3500, 'Indigo', '/placeholder.svg?height=400&width=600', '["Baggage", "Meals", "Seat Selection"]'::jsonb),
  ('bus', 'Delhi to Jaipur Bus', 'Premium bus service', 'Delhi', 'Jaipur', 400, 'RedBus', '/placeholder.svg?height=400&width=600', '["AC Coach", "WiFi", "USB Charging"]'::jsonb),
  ('entry_pass', 'Taj Mahal Entry Ticket', 'Single entry to Taj Mahal', null, 'Agra', 250, 'ASI', '/placeholder.svg?height=400&width=600', '["Same Day Entry", "English Guide Available"]'::jsonb),
  ('entry_pass', 'Red Fort Entry Ticket', 'Single entry to Red Fort', null, 'Delhi', 300, 'ASI', '/placeholder.svg?height=400&width=600', '["Same Day Entry", "Audio Guide"]'::jsonb),
  ('attraction_pass', 'Jaipur Combo Pass', '5-day pass for major attractions', null, 'Jaipur', 1500, 'Jaipur Tourism', '/placeholder.svg?height=400&width=600', '["Amber Fort", "City Palace", "Hawa Mahal", "Jantar Mantar", "Free Transport"]'::jsonb),
  ('entry_pass', 'Hawa Mahal Entry', 'Single entry to Hawa Mahal', null, 'Jaipur', 200, 'Jaipur Tourism', '/placeholder.svg?height=400&width=600', '["Rooftop Access", "Photography Allowed"]'::jsonb);
