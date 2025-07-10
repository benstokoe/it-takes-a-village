-- Seed data for It Takes a Village application
-- This file contains mock data for testing and development

-- IMPORTANT: 
-- Before running this seed script, you must first create auth users using the create-auth-users.js script
-- The handle_new_user() trigger will automatically create profiles when auth users are created

-- Clear existing data in reverse dependency order
DELETE FROM public.request_messages;
DELETE FROM public.request_recipients;
DELETE FROM public.availability_responses;
DELETE FROM public.availability_requests;
DELETE FROM public.group_members;
DELETE FROM public.groups;

-- Update user profiles with additional information (users should already exist from auth creation)
-- We'll use email to identify users since UUIDs are generated during auth signup
UPDATE public.profiles 
SET 
  phone_number = '+1-555-0101',
  timezone = 'America/New_York',
  notification_preferences = '{"sms": true, "push": true, "email": true}'
WHERE email = 'sarah.johnson@email.com';

UPDATE public.profiles 
SET 
  phone_number = '+1-555-0102',
  timezone = 'America/New_York',
  notification_preferences = '{"sms": false, "push": true, "email": true}'
WHERE email = 'mike.chen@email.com';

UPDATE public.profiles 
SET 
  phone_number = '+1-555-0103',
  timezone = 'America/New_York',
  notification_preferences = '{"sms": true, "push": true, "email": false}'
WHERE email = 'emily.davis@email.com';

UPDATE public.profiles 
SET 
  phone_number = '+1-555-0104',
  timezone = 'America/Chicago',
  notification_preferences = '{"sms": true, "push": true, "email": true}'
WHERE email = 'james.wilson@email.com';

UPDATE public.profiles 
SET 
  phone_number = '+1-555-0105',
  timezone = 'America/Los_Angeles',
  notification_preferences = '{"sms": false, "push": true, "email": true}'
WHERE email = 'lisa.garcia@email.com';

UPDATE public.profiles 
SET 
  phone_number = '+1-555-0106',
  timezone = 'America/New_York',
  notification_preferences = '{"sms": true, "push": false, "email": true}'
WHERE email = 'david.brown@email.com';

UPDATE public.profiles 
SET 
  phone_number = '+1-555-0107',
  timezone = 'America/New_York',
  notification_preferences = '{"sms": true, "push": true, "email": true}'
WHERE email = 'anna.taylor@email.com';

UPDATE public.profiles 
SET 
  phone_number = '+1-555-0108',
  timezone = 'America/Denver',
  notification_preferences = '{"sms": false, "push": true, "email": false}'
WHERE email = 'robert.martinez@email.com';

UPDATE public.profiles 
SET 
  phone_number = '+1-555-0109',
  timezone = 'America/New_York',
  notification_preferences = '{"sms": true, "push": true, "email": true}'
WHERE email = 'jennifer.lee@email.com';

UPDATE public.profiles 
SET 
  phone_number = '+1-555-0110',
  timezone = 'America/New_York',
  notification_preferences = '{"sms": true, "push": true, "email": true}'
WHERE email = 'thomas.anderson@email.com';

-- Insert groups using actual user IDs from profiles
INSERT INTO public.groups (name, description, created_by, invite_code) VALUES
  ('Maple Street Families', 'A close-knit group of families living on Maple Street who help each other with childcare, errands, and emergency support.', (SELECT id FROM profiles WHERE email = 'sarah.johnson@email.com'), 'MAPLE1'),
  ('Downtown Parents Network', 'Urban parents supporting each other through the challenges of city parenting.', (SELECT id FROM profiles WHERE email = 'mike.chen@email.com'), 'DOWNTOWN'),
  ('Sunset Elementary Circle', 'Parents and guardians of children at Sunset Elementary School.', (SELECT id FROM profiles WHERE email = 'emily.davis@email.com'), 'SUNSET1'),
  ('New Parent Support Group', 'First-time parents helping each other navigate early parenthood.', (SELECT id FROM profiles WHERE email = 'james.wilson@email.com'), 'NEWBABY');

-- Insert group members using actual user IDs and group IDs
INSERT INTO public.group_members (group_id, user_id, relationship_label, role) VALUES
  -- Maple Street Families
  ((SELECT id FROM groups WHERE name = 'Maple Street Families'), (SELECT id FROM profiles WHERE email = 'sarah.johnson@email.com'), 'Neighbor & Mom of 2', 'admin'),
  ((SELECT id FROM groups WHERE name = 'Maple Street Families'), (SELECT id FROM profiles WHERE email = 'mike.chen@email.com'), 'Neighbor & Dad of 1', 'member'),
  ((SELECT id FROM groups WHERE name = 'Maple Street Families'), (SELECT id FROM profiles WHERE email = 'emily.davis@email.com'), 'Neighbor & Mom of 3', 'member'),
  ((SELECT id FROM groups WHERE name = 'Maple Street Families'), (SELECT id FROM profiles WHERE email = 'james.wilson@email.com'), 'Neighbor & Dad of 2', 'member'),
  ((SELECT id FROM groups WHERE name = 'Maple Street Families'), (SELECT id FROM profiles WHERE email = 'lisa.garcia@email.com'), 'Neighbor & Mom of 1', 'member'),
  
  -- Downtown Parents Network
  ((SELECT id FROM groups WHERE name = 'Downtown Parents Network'), (SELECT id FROM profiles WHERE email = 'mike.chen@email.com'), 'Founding Member & Dad', 'admin'),
  ((SELECT id FROM groups WHERE name = 'Downtown Parents Network'), (SELECT id FROM profiles WHERE email = 'david.brown@email.com'), 'Working Dad', 'member'),
  ((SELECT id FROM groups WHERE name = 'Downtown Parents Network'), (SELECT id FROM profiles WHERE email = 'anna.taylor@email.com'), 'Single Mom', 'member'),
  ((SELECT id FROM groups WHERE name = 'Downtown Parents Network'), (SELECT id FROM profiles WHERE email = 'robert.martinez@email.com'), 'Stay-at-home Dad', 'member'),
  
  -- Sunset Elementary Circle
  ((SELECT id FROM groups WHERE name = 'Sunset Elementary Circle'), (SELECT id FROM profiles WHERE email = 'emily.davis@email.com'), 'Room Parent & Mom', 'admin'),
  ((SELECT id FROM groups WHERE name = 'Sunset Elementary Circle'), (SELECT id FROM profiles WHERE email = 'james.wilson@email.com'), 'PTA Member & Dad', 'member'),
  ((SELECT id FROM groups WHERE name = 'Sunset Elementary Circle'), (SELECT id FROM profiles WHERE email = 'jennifer.lee@email.com'), 'Volunteer & Mom', 'member'),
  ((SELECT id FROM groups WHERE name = 'Sunset Elementary Circle'), (SELECT id FROM profiles WHERE email = 'thomas.anderson@email.com'), 'Coach & Dad', 'member'),
  
  -- New Parent Support Group
  ((SELECT id FROM groups WHERE name = 'New Parent Support Group'), (SELECT id FROM profiles WHERE email = 'james.wilson@email.com'), 'New Dad & Group Leader', 'admin'),
  ((SELECT id FROM groups WHERE name = 'New Parent Support Group'), (SELECT id FROM profiles WHERE email = 'lisa.garcia@email.com'), 'First-time Mom', 'member'),
  ((SELECT id FROM groups WHERE name = 'New Parent Support Group'), (SELECT id FROM profiles WHERE email = 'robert.martinez@email.com'), 'New Dad', 'member');

-- Insert availability requests using actual user IDs and group IDs
INSERT INTO public.availability_requests (group_id, created_by, title, description, request_type, requested_date, start_time, end_time, location, is_urgent, is_recurring, status) VALUES
  ((SELECT id FROM groups WHERE name = 'Maple Street Families'), (SELECT id FROM profiles WHERE email = 'sarah.johnson@email.com'), 'Emergency Childcare - Doctor Appointment', 'My youngest has a fever and I need to take him to urgent care. Can someone watch my 8-year-old for a few hours?', 'emergency', CURRENT_DATE, '14:00', '17:00', 'My house - 123 Maple Street', true, false, 'active'),
  
  ((SELECT id FROM groups WHERE name = 'Maple Street Families'), (SELECT id FROM profiles WHERE email = 'mike.chen@email.com'), 'Date Night Babysitting', 'Looking for someone to watch our 5-year-old for our anniversary dinner. Happy to reciprocate!', 'childcare', CURRENT_DATE + INTERVAL '3 days', '18:00', '23:00', '456 Maple Street', false, false, 'active'),
  
  ((SELECT id FROM groups WHERE name = 'Downtown Parents Network'), (SELECT id FROM profiles WHERE email = 'anna.taylor@email.com'), 'Airport Drop-off Help', 'Early morning flight and need someone to drive me to the airport. Will pay for gas!', 'transportation', CURRENT_DATE + INTERVAL '1 week', '05:30', '07:00', 'Downtown area', false, false, 'active'),
  
  ((SELECT id FROM groups WHERE name = 'Sunset Elementary Circle'), (SELECT id FROM profiles WHERE email = 'emily.davis@email.com'), 'School Pickup - Running Late', 'Stuck in a work meeting that''s running long. Can someone pick up Emma from school?', 'emergency', CURRENT_DATE, '15:15', '15:45', 'Sunset Elementary School', true, false, 'completed'),
  
  ((SELECT id FROM groups WHERE name = 'Maple Street Families'), (SELECT id FROM profiles WHERE email = 'emily.davis@email.com'), 'Weekly Grocery Run', 'Starting a weekly grocery run to Costco. Anyone want to join or need me to pick up items?', 'general_support', CURRENT_DATE + INTERVAL '2 days', '10:00', '12:00', 'Costco on Route 9', false, true, 'active'),
  
  ((SELECT id FROM groups WHERE name = 'New Parent Support Group'), (SELECT id FROM profiles WHERE email = 'lisa.garcia@email.com'), 'New Mom Coffee Meetup', 'Would love to meet other new moms for coffee and support. Baby-friendly location!', 'social_visit', CURRENT_DATE + INTERVAL '5 days', '10:00', '12:00', 'Starbucks on Main Street', false, false, 'active'),
  
  ((SELECT id FROM groups WHERE name = 'Downtown Parents Network'), (SELECT id FROM profiles WHERE email = 'robert.martinez@email.com'), 'Playground Cleanup Event', 'Organizing a community cleanup at Riverside Park. Bring gloves and trash bags!', 'event_help', CURRENT_DATE + INTERVAL '10 days', '09:00', '12:00', 'Riverside Park', false, false, 'active');

-- Insert request recipients using dynamic lookups
INSERT INTO public.request_recipients (request_id, recipient_id) VALUES
  -- Emergency childcare request sent to all Maple Street members (excluding sender)
  ((SELECT id FROM availability_requests WHERE title = 'Emergency Childcare - Doctor Appointment'), (SELECT id FROM profiles WHERE email = 'mike.chen@email.com')),
  ((SELECT id FROM availability_requests WHERE title = 'Emergency Childcare - Doctor Appointment'), (SELECT id FROM profiles WHERE email = 'emily.davis@email.com')),
  ((SELECT id FROM availability_requests WHERE title = 'Emergency Childcare - Doctor Appointment'), (SELECT id FROM profiles WHERE email = 'james.wilson@email.com')),
  ((SELECT id FROM availability_requests WHERE title = 'Emergency Childcare - Doctor Appointment'), (SELECT id FROM profiles WHERE email = 'lisa.garcia@email.com')),
  
  -- Date night request sent to trusted neighbors
  ((SELECT id FROM availability_requests WHERE title = 'Date Night Babysitting'), (SELECT id FROM profiles WHERE email = 'sarah.johnson@email.com')),
  ((SELECT id FROM availability_requests WHERE title = 'Date Night Babysitting'), (SELECT id FROM profiles WHERE email = 'emily.davis@email.com')),
  
  -- Airport ride request
  ((SELECT id FROM availability_requests WHERE title = 'Airport Drop-off Help'), (SELECT id FROM profiles WHERE email = 'mike.chen@email.com')),
  ((SELECT id FROM availability_requests WHERE title = 'Airport Drop-off Help'), (SELECT id FROM profiles WHERE email = 'david.brown@email.com')),
  ((SELECT id FROM availability_requests WHERE title = 'Airport Drop-off Help'), (SELECT id FROM profiles WHERE email = 'robert.martinez@email.com')),
  
  -- School pickup emergency
  ((SELECT id FROM availability_requests WHERE title = 'School Pickup - Running Late'), (SELECT id FROM profiles WHERE email = 'james.wilson@email.com')),
  ((SELECT id FROM availability_requests WHERE title = 'School Pickup - Running Late'), (SELECT id FROM profiles WHERE email = 'jennifer.lee@email.com')),
  ((SELECT id FROM availability_requests WHERE title = 'School Pickup - Running Late'), (SELECT id FROM profiles WHERE email = 'thomas.anderson@email.com')),
  
  -- Grocery run invitation
  ((SELECT id FROM availability_requests WHERE title = 'Weekly Grocery Run'), (SELECT id FROM profiles WHERE email = 'sarah.johnson@email.com')),
  ((SELECT id FROM availability_requests WHERE title = 'Weekly Grocery Run'), (SELECT id FROM profiles WHERE email = 'mike.chen@email.com')),
  ((SELECT id FROM availability_requests WHERE title = 'Weekly Grocery Run'), (SELECT id FROM profiles WHERE email = 'james.wilson@email.com')),
  ((SELECT id FROM availability_requests WHERE title = 'Weekly Grocery Run'), (SELECT id FROM profiles WHERE email = 'lisa.garcia@email.com')),
  
  -- New mom coffee meetup
  ((SELECT id FROM availability_requests WHERE title = 'New Mom Coffee Meetup'), (SELECT id FROM profiles WHERE email = 'james.wilson@email.com')),
  ((SELECT id FROM availability_requests WHERE title = 'New Mom Coffee Meetup'), (SELECT id FROM profiles WHERE email = 'robert.martinez@email.com')),
  
  -- Playground cleanup
  ((SELECT id FROM availability_requests WHERE title = 'Playground Cleanup Event'), (SELECT id FROM profiles WHERE email = 'mike.chen@email.com')),
  ((SELECT id FROM availability_requests WHERE title = 'Playground Cleanup Event'), (SELECT id FROM profiles WHERE email = 'david.brown@email.com')),
  ((SELECT id FROM availability_requests WHERE title = 'Playground Cleanup Event'), (SELECT id FROM profiles WHERE email = 'anna.taylor@email.com'));

-- Insert availability responses using dynamic lookups
INSERT INTO public.availability_responses (request_id, responder_id, response, notes, available_from, available_until) VALUES
  -- Responses to emergency childcare
  ((SELECT id FROM availability_requests WHERE title = 'Emergency Childcare - Doctor Appointment'), (SELECT id FROM profiles WHERE email = 'emily.davis@email.com'), 'yes', 'I can watch him at my place. My kids would love to play with him!', '14:00', '18:00'),
  ((SELECT id FROM availability_requests WHERE title = 'Emergency Childcare - Doctor Appointment'), (SELECT id FROM profiles WHERE email = 'mike.chen@email.com'), 'maybe', 'I might be able to help if Emily can''t. Let me know!', '14:30', '17:00'),
  ((SELECT id FROM availability_requests WHERE title = 'Emergency Childcare - Doctor Appointment'), (SELECT id FROM profiles WHERE email = 'james.wilson@email.com'), 'no', 'Sorry, I''m at work until 6pm today. Hope everything is okay!', NULL, NULL),
  
  -- Responses to date night babysitting
  ((SELECT id FROM availability_requests WHERE title = 'Date Night Babysitting'), (SELECT id FROM profiles WHERE email = 'sarah.johnson@email.com'), 'yes', 'Happy to help! Our kids play well together. Have a wonderful anniversary!', '17:30', '23:30'),
  ((SELECT id FROM availability_requests WHERE title = 'Date Night Babysitting'), (SELECT id FROM profiles WHERE email = 'emily.davis@email.com'), 'maybe', 'Could be backup if Sarah can''t make it. Let me check my schedule.', '18:00', '23:00'),
  
  -- Responses to airport ride
  ((SELECT id FROM availability_requests WHERE title = 'Airport Drop-off Help'), (SELECT id FROM profiles WHERE email = 'david.brown@email.com'), 'yes', 'I''m an early riser anyway! Happy to help with the drive.', '05:00', '07:30'),
  ((SELECT id FROM availability_requests WHERE title = 'Airport Drop-off Help'), (SELECT id FROM profiles WHERE email = 'mike.chen@email.com'), 'no', 'Too early for me, sorry! But David seems like he''s got you covered.', NULL, NULL),
  
  -- Responses to school pickup (completed request)
  ((SELECT id FROM availability_requests WHERE title = 'School Pickup - Running Late'), (SELECT id FROM profiles WHERE email = 'jennifer.lee@email.com'), 'yes', 'Got her! She''s at my house doing homework with my daughter.', '15:15', '17:00'),
  
  -- Responses to grocery run
  ((SELECT id FROM availability_requests WHERE title = 'Weekly Grocery Run'), (SELECT id FROM profiles WHERE email = 'sarah.johnson@email.com'), 'yes', 'Great idea! I need to stock up too. Can you grab some of their rotisserie chickens?', '10:00', '12:00'),
  ((SELECT id FROM availability_requests WHERE title = 'Weekly Grocery Run'), (SELECT id FROM profiles WHERE email = 'mike.chen@email.com'), 'maybe', 'Might join if I finish my morning work. Will text you!', '10:30', '12:00'),
  
  -- Responses to coffee meetup
  ((SELECT id FROM availability_requests WHERE title = 'New Mom Coffee Meetup'), (SELECT id FROM profiles WHERE email = 'robert.martinez@email.com'), 'yes', 'Would love to meet other new parents! My little one is 3 months old.', '10:00', '12:00'),
  
  -- Responses to playground cleanup
  ((SELECT id FROM availability_requests WHERE title = 'Playground Cleanup Event'), (SELECT id FROM profiles WHERE email = 'david.brown@email.com'), 'yes', 'Count me in! It''s where my kids play every day.', '09:00', '12:00'),
  ((SELECT id FROM availability_requests WHERE title = 'Playground Cleanup Event'), (SELECT id FROM profiles WHERE email = 'anna.taylor@email.com'), 'yes', 'Absolutely! Community spaces need our care.', '09:00', '11:00');

-- Insert request messages using dynamic lookups
INSERT INTO public.request_messages (request_id, sender_id, message_text) VALUES
  -- Emergency childcare conversation
  ((SELECT id FROM availability_requests WHERE title = 'Emergency Childcare - Doctor Appointment'), (SELECT id FROM profiles WHERE email = 'sarah.johnson@email.com'), 'Thank you so much Emily! Heading over now with his favorite snacks and tablet.'),
  ((SELECT id FROM availability_requests WHERE title = 'Emergency Childcare - Doctor Appointment'), (SELECT id FROM profiles WHERE email = 'emily.davis@email.com'), 'No problem at all! Hope the little one feels better soon. We''ll take good care of big brother.'),
  ((SELECT id FROM availability_requests WHERE title = 'Emergency Childcare - Doctor Appointment'), (SELECT id FROM profiles WHERE email = 'sarah.johnson@email.com'), 'Just got back from urgent care - he''s going to be fine! Thank you again for watching Tommy.'),
  
  -- Date night planning
  ((SELECT id FROM availability_requests WHERE title = 'Date Night Babysitting'), (SELECT id FROM profiles WHERE email = 'mike.chen@email.com'), 'Sarah, you''re amazing! What time works best for you?'),
  ((SELECT id FROM availability_requests WHERE title = 'Date Night Babysitting'), (SELECT id FROM profiles WHERE email = 'sarah.johnson@email.com'), '5:30 drop-off would be perfect! Does Sophie have any food allergies I should know about?'),
  ((SELECT id FROM availability_requests WHERE title = 'Date Night Babysitting'), (SELECT id FROM profiles WHERE email = 'mike.chen@email.com'), 'No allergies, but she loves mac and cheese if you''re making dinner. We''ll definitely return the favor soon!'),
  
  -- Airport ride coordination
  ((SELECT id FROM availability_requests WHERE title = 'Airport Drop-off Help'), (SELECT id FROM profiles WHERE email = 'anna.taylor@email.com'), 'David, you''re a lifesaver! Flight is at 7:30am so pickup at 5:30 should work perfectly.'),
  ((SELECT id FROM availability_requests WHERE title = 'Airport Drop-off Help'), (SELECT id FROM profiles WHERE email = 'david.brown@email.com'), 'No problem! I''ll text you when I''m outside. Travel safe!'),
  
  -- Grocery run coordination
  ((SELECT id FROM availability_requests WHERE title = 'Weekly Grocery Run'), (SELECT id FROM profiles WHERE email = 'emily.davis@email.com'), 'Starting a shared shopping list! What does everyone need?'),
  ((SELECT id FROM availability_requests WHERE title = 'Weekly Grocery Run'), (SELECT id FROM profiles WHERE email = 'sarah.johnson@email.com'), 'Could you grab 2 rotisserie chickens and a case of their sparkling water? I''ll Venmo you!'),
  ((SELECT id FROM availability_requests WHERE title = 'Weekly Grocery Run'), (SELECT id FROM profiles WHERE email = 'mike.chen@email.com'), 'If you''re going to the pharmacy section, I need children''s Tylenol. Thanks!'),
  
  -- New mom support
  ((SELECT id FROM availability_requests WHERE title = 'New Mom Coffee Meetup'), (SELECT id FROM profiles WHERE email = 'lisa.garcia@email.com'), 'So excited to meet other new moms! This whole thing is both amazing and overwhelming.'),
  ((SELECT id FROM availability_requests WHERE title = 'New Mom Coffee Meetup'), (SELECT id FROM profiles WHERE email = 'robert.martinez@email.com'), 'Tell me about it! First few months are intense. Looking forward to sharing experiences.'),
  
  -- Cleanup event planning
  ((SELECT id FROM availability_requests WHERE title = 'Playground Cleanup Event'), (SELECT id FROM profiles WHERE email = 'robert.martinez@email.com'), 'Should we coordinate tools? I have extra trash grabbers and can bring a few.'),
  ((SELECT id FROM availability_requests WHERE title = 'Playground Cleanup Event'), (SELECT id FROM profiles WHERE email = 'david.brown@email.com'), 'Great idea! I''ll bring a leaf blower for the basketball courts.'),
  ((SELECT id FROM availability_requests WHERE title = 'Playground Cleanup Event'), (SELECT id FROM profiles WHERE email = 'anna.taylor@email.com'), 'Perfect! I''ll coordinate with the city to pick up the bags afterward.');

-- Update timestamps to be more realistic (some in the past, some recent)
UPDATE public.availability_requests 
SET created_at = CURRENT_TIMESTAMP - INTERVAL '2 hours'
WHERE title = 'Emergency Childcare - Doctor Appointment';

UPDATE public.availability_requests 
SET created_at = CURRENT_TIMESTAMP - INTERVAL '1 day'
WHERE title = 'Date Night Babysitting';

UPDATE public.availability_requests 
SET created_at = CURRENT_TIMESTAMP - INTERVAL '3 days'
WHERE title = 'Airport Drop-off Help';

UPDATE public.availability_requests 
SET created_at = CURRENT_TIMESTAMP - INTERVAL '1 week',
     updated_at = CURRENT_TIMESTAMP - INTERVAL '1 week' + INTERVAL '30 minutes'
WHERE title = 'School Pickup - Running Late';

UPDATE public.availability_requests 
SET created_at = CURRENT_TIMESTAMP - INTERVAL '5 days'
WHERE title = 'Weekly Grocery Run';

UPDATE public.availability_requests 
SET created_at = CURRENT_TIMESTAMP - INTERVAL '2 days'
WHERE title = 'New Mom Coffee Meetup';

UPDATE public.availability_requests 
SET created_at = CURRENT_TIMESTAMP - INTERVAL '1 day'
WHERE title = 'Playground Cleanup Event';

-- Update some response timestamps
UPDATE public.availability_responses 
SET responded_at = CURRENT_TIMESTAMP - INTERVAL '1 hour 45 minutes'
WHERE request_id = (SELECT id FROM availability_requests WHERE title = 'Emergency Childcare - Doctor Appointment');

UPDATE public.availability_responses 
SET responded_at = CURRENT_TIMESTAMP - INTERVAL '20 hours'
WHERE request_id = (SELECT id FROM availability_requests WHERE title = 'Date Night Babysitting');

-- Update message timestamps to be sequential
UPDATE public.request_messages 
SET created_at = CURRENT_TIMESTAMP - INTERVAL '1 hour 30 minutes'
WHERE request_id = (SELECT id FROM availability_requests WHERE title = 'Emergency Childcare - Doctor Appointment') 
AND sender_id = (SELECT id FROM profiles WHERE email = 'sarah.johnson@email.com')
AND message_text LIKE 'Thank you so much Emily%';

UPDATE public.request_messages 
SET created_at = CURRENT_TIMESTAMP - INTERVAL '1 hour 25 minutes'
WHERE request_id = (SELECT id FROM availability_requests WHERE title = 'Emergency Childcare - Doctor Appointment') 
AND sender_id = (SELECT id FROM profiles WHERE email = 'emily.davis@email.com');

UPDATE public.request_messages 
SET created_at = CURRENT_TIMESTAMP - INTERVAL '30 minutes'
WHERE request_id = (SELECT id FROM availability_requests WHERE title = 'Emergency Childcare - Doctor Appointment') 
AND sender_id = (SELECT id FROM profiles WHERE email = 'sarah.johnson@email.com')
AND message_text LIKE 'Just got back%'; 