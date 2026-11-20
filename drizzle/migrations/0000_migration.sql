CREATE TABLE public.package_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  customer_name text NOT NULL CHECK (char_length(customer_name) BETWEEN 1 AND 100),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 5 AND 30),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  package_name text NOT NULL CHECK (char_length(package_name) BETWEEN 1 AND 60),
  event_type text NOT NULL CHECK (char_length(event_type) BETWEEN 1 AND 80),
  event_date date,
  event_location text CHECK (event_location IS NULL OR char_length(event_location) <= 200),
  requirements text CHECK (requirements IS NULL OR char_length(requirements) <= 2000)
);
GRANT INSERT ON public.package_inquiries TO anon, authenticated;
GRANT ALL ON public.package_inquiries TO service_role;
ALTER TABLE public.package_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a package inquiry" ON public.package_inquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE public.booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 1 AND 100),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 5 AND 30),
  service_type text NOT NULL CHECK (char_length(service_type) BETWEEN 1 AND 80),
  event_date date,
  location text CHECK (location IS NULL OR char_length(location) <= 200),
  message text CHECK (message IS NULL OR char_length(message) <= 2000)
);
GRANT INSERT ON public.booking_requests TO anon, authenticated;
GRANT ALL ON public.booking_requests TO service_role;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a booking request" ON public.booking_requests
  FOR INSERT TO anon, authenticated WITH CHECK (true);