
-- ========== Roles ==========
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

CREATE TABLE public.admin_allowlist (
  email text PRIMARY KEY CHECK (email = lower(email)),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.admin_allowlist TO authenticated;
GRANT ALL ON public.admin_allowlist TO service_role;
ALTER TABLE public.admin_allowlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage allowlist" ON public.admin_allowlist FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
INSERT INTO public.admin_allowlist (email) VALUES ('mujahidameen8@gmail.com');

CREATE OR REPLACE FUNCTION public.grant_admin_from_allowlist()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL
     AND EXISTS (SELECT 1 FROM public.admin_allowlist WHERE email = lower(NEW.email)) THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_admin_grant
AFTER INSERT OR UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_admin_from_allowlist();

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin' FROM auth.users u
WHERE u.email_confirmed_at IS NOT NULL AND lower(u.email) IN (SELECT email FROM public.admin_allowlist)
ON CONFLICT DO NOTHING;

-- ========== Helpers ==========
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- ========== Website settings ==========
CREATE TABLE public.site_settings (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  logo_path text,
  hero_heading text NOT NULL DEFAULT 'MA Studio' CHECK (char_length(hero_heading) BETWEEN 1 AND 80),
  hero_tagline text NOT NULL DEFAULT '' CHECK (char_length(hero_tagline) <= 200),
  hero_description text NOT NULL DEFAULT '' CHECK (char_length(hero_description) <= 400),
  hero_image_path text,
  about_heading text NOT NULL DEFAULT '' CHECK (char_length(about_heading) <= 160),
  about_intro text NOT NULL DEFAULT '' CHECK (char_length(about_intro) <= 2000),
  phone_display text NOT NULL DEFAULT '' CHECK (char_length(phone_display) <= 30),
  whatsapp_number text NOT NULL DEFAULT '' CHECK (whatsapp_number ~ '^[0-9]{0,15}$'),
  email text NOT NULL DEFAULT '' CHECK (char_length(email) <= 255),
  location text NOT NULL DEFAULT '' CHECK (char_length(location) <= 200),
  footer_text text NOT NULL DEFAULT '' CHECK (char_length(footer_text) <= 600),
  footer_signature text NOT NULL DEFAULT '' CHECK (char_length(footer_signature) <= 120),
  socials jsonb NOT NULL DEFAULT '{}'::jsonb,
  gallery_categories text[] NOT NULL DEFAULT '{}',
  invoice_payment_terms text NOT NULL DEFAULT '' CHECK (char_length(invoice_payment_terms) <= 600),
  invoice_footer_note text NOT NULL DEFAULT '' CHECK (char_length(invoice_footer_note) <= 600),
  default_tax_rate numeric(5,2) NOT NULL DEFAULT 0 CHECK (default_tax_rate >= 0 AND default_tax_rate <= 100),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins insert settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins update settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_settings (id, hero_heading, hero_tagline, hero_description, about_heading, about_intro,
  phone_display, whatsapp_number, email, location, footer_text, footer_signature, socials, gallery_categories,
  invoice_payment_terms, invoice_footer_note)
VALUES (1, 'MA Studio',
  'Capturing Moments. Creating Timeless Stories.',
  'Professional Photography & Cinematography for Your Most Precious Moments.',
  'More Than Just Photos. We Create Memories.',
  'MA Studio is a creative photography and cinematography studio from Faisalabad, dedicated to capturing life''s most beautiful moments with passion, precision and a commitment to quality.',
  '0307 6998873', '923076998873', 'mujahidameen8@gmail.com', 'Faisalabad, Pakistan',
  'Professional Photography & Cinematography for Your Most Precious Moments.',
  'Capture Today, Cherish Forever',
  '{"instagram":{"url":"","enabled":true},"facebook":{"url":"","enabled":true},"youtube":{"url":"","enabled":true},"tiktok":{"url":"","enabled":false},"linkedin":{"url":"","enabled":false}}'::jsonb,
  ARRAY['Wedding','Portrait','Events','Fashion','Commercial','Product','Nature','Cinematography'],
  'Payment by cash, bank transfer, Easypaisa or JazzCash.',
  'Thank you for choosing MA Studio.');

-- ========== Packages ==========
CREATE TABLE public.packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]{1,60}$'),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 60),
  tier text NOT NULL DEFAULT '' CHECK (char_length(tier) <= 40),
  description text NOT NULL DEFAULT '' CHECK (char_length(description) <= 400),
  price numeric(12,2) CHECK (price IS NULL OR price >= 0),
  price_note text NOT NULL DEFAULT '' CHECK (char_length(price_note) <= 120),
  features text[] NOT NULL DEFAULT '{}',
  active boolean NOT NULL DEFAULT true,
  popular boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.packages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.packages TO authenticated;
GRANT ALL ON public.packages TO service_role;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads active packages" ON public.packages FOR SELECT TO anon, authenticated USING (active);
CREATE POLICY "Admins read packages" ON public.packages FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins insert packages" ON public.packages FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins update packages" ON public.packages FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins delete packages" ON public.packages FOR DELETE TO authenticated USING (public.is_admin());
CREATE TRIGGER packages_updated BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.packages_single_popular()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  UPDATE public.packages SET popular = false WHERE id <> NEW.id AND popular;
  RETURN NEW;
END $$;
CREATE TRIGGER packages_single_popular AFTER INSERT OR UPDATE OF popular ON public.packages
FOR EACH ROW WHEN (NEW.popular) EXECUTE FUNCTION public.packages_single_popular();

INSERT INTO public.packages (slug, name, tier, description, price, features, popular, sort_order) VALUES
('basic', 'Basic Package', 'Essential', 'A focused package for intimate moments.', 20000,
  ARRAY['1 Cameraman','3 Days Coverage','Digital Soft Copy Pictures'], false, 1),
('premium', 'Premium Package', 'Signature', 'Photography and film together, with an edited video.', 50000,
  ARRAY['1 Photographer','1 Videographer','Edited Video','Digital Soft Copy Pictures'], true, 2),
('luxury', 'Luxury Package', 'Couture', 'Multi-day coverage in stills and cinema, finished with a printed album.', 80000,
  ARRAY['3 Days Coverage','1 Cameraman','1 Videographer','1 Printed Photo Album'], false, 3);

-- ========== Gallery ==========
CREATE TABLE public.gallery_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  description text NOT NULL DEFAULT '' CHECK (char_length(description) <= 1000),
  category text NOT NULL CHECK (char_length(category) BETWEEN 1 AND 60),
  image_path text NOT NULL,
  shape text NOT NULL DEFAULT 'tall' CHECK (shape IN ('tall','wide','square')),
  published boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_photos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_photos TO authenticated;
GRANT ALL ON public.gallery_photos TO service_role;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads published photos" ON public.gallery_photos FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY "Admins read photos" ON public.gallery_photos FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins insert photos" ON public.gallery_photos FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins update photos" ON public.gallery_photos FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins delete photos" ON public.gallery_photos FOR DELETE TO authenticated USING (public.is_admin());
CREATE TRIGGER gallery_photos_updated BEFORE UPDATE ON public.gallery_photos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX gallery_photos_public_idx ON public.gallery_photos (published, sort_order);

INSERT INTO public.gallery_photos (title, description, category, image_path, shape, published, featured, sort_order) VALUES
('Garden of Lights', 'Bride and groom under warm fairy lights at night', 'Wedding', 'sample:wedding', 'tall', true, true, 1),
('The Grand Gala', 'Guests in a ballroom lit by crystal chandeliers', 'Events', 'sample:events', 'wide', true, true, 2),
('Quiet Strength', 'Low-key portrait of a woman in an embroidered black dupatta', 'Portrait', 'sample:portrait', 'tall', true, true, 3),
('Midnight Drive', 'Red sports car on a wet city street at night', 'Commercial', 'sample:commercial', 'wide', true, true, 4),
('Black Gold Couture', 'Model in a sculptural black and gold couture gown', 'Fashion', 'sample:fashion', 'tall', true, true, 5),
('Amber Sky', 'Amber perfume bottle with a gold cap in golden smoke', 'Product', 'sample:product', 'square', true, true, 6),
('Karakoram Gold', 'Snow-capped mountain peaks glowing at golden hour', 'Nature', 'sample:nature', 'wide', true, true, 7),
('Sunset Vows', 'Silhouette of a bride and groom against a sunset window', 'Wedding', 'sample:couple', 'tall', true, true, 8),
('On Set', 'Cinematographer operating a cinema camera on a smoky set', 'Cinematography', 'sample:cinematography', 'wide', true, false, 9),
('Mehndi Night', 'Women in marigold outfits dancing at a mehndi celebration', 'Events', 'sample:mehndi', 'wide', true, false, 10),
('The Groom', 'Groom in a cream sherwani standing in a Mughal archway', 'Portrait', 'sample:groom', 'tall', true, false, 11),
('Tools of Light', 'Camera bodies, lenses and a drone on a black surface', 'Product', 'sample:equipment', 'wide', true, false, 12),
('The Studio', 'Dark photography studio with an octabox and a single chair', 'Cinematography', 'sample:studio', 'tall', true, false, 13);

-- ========== Portfolio ==========
CREATE TABLE public.portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]{1,80}$'),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  category text NOT NULL CHECK (char_length(category) BETWEEN 1 AND 60),
  location text NOT NULL DEFAULT '' CHECK (char_length(location) <= 120),
  summary text NOT NULL DEFAULT '' CHECK (char_length(summary) <= 400),
  story text NOT NULL DEFAULT '' CHECK (char_length(story) <= 8000),
  deliverables text[] NOT NULL DEFAULT '{}',
  cover_path text,
  project_date date,
  published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.portfolio_projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_projects TO authenticated;
GRANT ALL ON public.portfolio_projects TO service_role;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads published projects" ON public.portfolio_projects FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY "Admins read projects" ON public.portfolio_projects FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins insert projects" ON public.portfolio_projects FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins update projects" ON public.portfolio_projects FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins delete projects" ON public.portfolio_projects FOR DELETE TO authenticated USING (public.is_admin());
CREATE TRIGGER portfolio_projects_updated BEFORE UPDATE ON public.portfolio_projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.portfolio_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
  image_path text NOT NULL,
  alt text NOT NULL DEFAULT '' CHECK (char_length(alt) <= 200),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX portfolio_images_project_idx ON public.portfolio_images (project_id, sort_order);
GRANT SELECT ON public.portfolio_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_images TO authenticated;
GRANT ALL ON public.portfolio_images TO service_role;
ALTER TABLE public.portfolio_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads images of published projects" ON public.portfolio_images FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolio_projects p WHERE p.id = project_id AND p.published));
CREATE POLICY "Admins read project images" ON public.portfolio_images FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins insert project images" ON public.portfolio_images FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins update project images" ON public.portfolio_images FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins delete project images" ON public.portfolio_images FOR DELETE TO authenticated USING (public.is_admin());

WITH p AS (
  INSERT INTO public.portfolio_projects (slug, title, category, location, summary, story, deliverables, cover_path, published, sort_order) VALUES
  ('golden-hour-vows', 'Golden Hour Vows', 'Wedding', 'Faisalabad',
    'A candle-lit garden wedding told through warm light, quiet glances and grand portraits.',
    E'The couple wanted their wedding to feel like a film — intimate, warm and unhurried. We planned the day around the light, saving the golden hour for portraits beneath the garden canopy.\n\nAs night fell, fairy lights and lanterns became our key light. The result is a gallery that moves from soft daylight elegance to rich, cinematic evening frames.',
    ARRAY['Full-day photography','Couple portrait session','Cinematic highlight film'], 'sample:wedding', true, 1),
  ('noor-a-mehndi-story', 'Noor — A Mehndi Story', 'Events', 'Punjab',
    'Marigolds, henna and candlelight — a celebration captured in motion and colour.',
    E'Mehndi nights are pure energy. We moved with the dancers, keeping shutter speeds fast and colours true to the marigold and gold palette of the evening.\n\nBetween the dances we found the quiet details — henna patterns, laughter, and the glow of a hundred candles.',
    ARRAY['Event coverage','Candid storytelling set','Social media reels'], 'sample:mehndi', true, 2),
  ('black-gold-couture', 'Black Gold Couture', 'Fashion', 'MA Studio',
    'A high-contrast fashion editorial sculpted with a single hard light.',
    E'Built around one sculptural gown, this editorial uses deep shadow and a single golden rim light to let the silhouette speak.\n\nEvery frame was lit and graded to echo the studio''s signature black-and-gold language.',
    ARRAY['Editorial lookbook','Campaign hero images','Retouched selects'], 'sample:fashion', true, 3),
  ('amber-sky-campaign', 'Amber Sky Campaign', 'Product', 'MA Studio',
    'Luxury fragrance still life with smoke, reflection and liquid gold light.',
    E'The brief: make a fragrance feel like a sunset. We layered backlight, haze and a mirrored base to give the bottle depth and glow.\n\nAlongside the hero shot we produced clean e-commerce frames and detail crops for the brand''s launch.',
    ARRAY['Hero campaign image','E-commerce set','Detail crops'], 'sample:product', true, 4),
  ('karakoram-light', 'Karakoram Light', 'Nature', 'Northern Pakistan',
    'A landscape series chasing the first and last light across the northern peaks.',
    E'Shot over several mornings and evenings, this series waits for the moment the sun turns the ridges to gold.\n\nLarge-format prints from this series are available on request.',
    ARRAY['Fine-art landscape series','Print-ready files'], 'sample:nature', true, 5),
  ('behind-the-frame', 'Behind the Frame', 'Cinematography', 'MA Studio',
    'A short brand film and stills shot on a moody, practical-lit set.',
    E'We built a candle-lit set inside the studio and shot both film and stills in one session, keeping the look consistent across formats.\n\nThe final cut pairs slow camera movement with natural haze for a warm, cinematic feel.',
    ARRAY['Brand film','Behind-the-scenes stills','Vertical reels'], 'sample:cinematography', true, 6)
  RETURNING id, slug
)
INSERT INTO public.portfolio_images (project_id, image_path, alt, sort_order)
SELECT p.id, v.path, v.alt, v.ord FROM p JOIN (VALUES
  ('golden-hour-vows', 'sample:wedding', 'Bride and groom beneath garden fairy lights', 1),
  ('golden-hour-vows', 'sample:couple', 'Couple silhouetted against a sunset window', 2),
  ('golden-hour-vows', 'sample:groom', 'Groom in a cream sherwani in a stone archway', 3),
  ('noor-a-mehndi-story', 'sample:mehndi', 'Bride dancing at her mehndi surrounded by friends', 1),
  ('noor-a-mehndi-story', 'sample:events', 'Guests in a chandelier-lit ballroom', 2),
  ('black-gold-couture', 'sample:fashion', 'Model in black and gold couture', 1),
  ('black-gold-couture', 'sample:portrait', 'Low-key portrait in an embroidered dupatta', 2),
  ('amber-sky-campaign', 'sample:product', 'Amber perfume bottle in golden smoke', 1),
  ('amber-sky-campaign', 'sample:equipment', 'Camera equipment flat lay', 2),
  ('karakoram-light', 'sample:nature', 'Snow-capped peaks at golden hour', 1),
  ('behind-the-frame', 'sample:cinematography', 'Cinematographer filming on a smoky set', 1),
  ('behind-the-frame', 'sample:studio', 'MA Studio interior with an octabox', 2)
) AS v(slug, path, alt, ord) ON v.slug = p.slug;

-- ========== Customers ==========
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 1 AND 120),
  phone text NOT NULL DEFAULT '' CHECK (char_length(phone) <= 30),
  whatsapp text NOT NULL DEFAULT '' CHECK (char_length(whatsapp) <= 30),
  email text NOT NULL DEFAULT '' CHECK (char_length(email) <= 255),
  notes text NOT NULL DEFAULT '' CHECK (char_length(notes) <= 4000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX customers_email_idx ON public.customers (lower(email));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage customers" ON public.customers FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER customers_updated BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ========== Inquiries: admin workflow columns ==========
ALTER TABLE public.package_inquiries
  ADD COLUMN status text NOT NULL DEFAULT 'New' CHECK (status IN ('New','Contacted','Confirmed','Completed','Cancelled')),
  ADD COLUMN internal_notes text NOT NULL DEFAULT '' CHECK (char_length(internal_notes) <= 4000),
  ADD COLUMN whatsapp text,
  ADD COLUMN customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.booking_requests
  ADD COLUMN status text NOT NULL DEFAULT 'New' CHECK (status IN ('New','Contacted','Confirmed','Completed','Cancelled')),
  ADD COLUMN internal_notes text NOT NULL DEFAULT '' CHECK (char_length(internal_notes) <= 4000),
  ADD COLUMN whatsapp text,
  ADD COLUMN customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();

GRANT SELECT, UPDATE, DELETE ON public.package_inquiries TO authenticated;
GRANT SELECT, UPDATE, DELETE ON public.booking_requests TO authenticated;
GRANT ALL ON public.package_inquiries TO service_role;
GRANT ALL ON public.booking_requests TO service_role;
CREATE POLICY "Admins read package inquiries" ON public.package_inquiries FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins update package inquiries" ON public.package_inquiries FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins delete package inquiries" ON public.package_inquiries FOR DELETE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins read booking requests" ON public.booking_requests FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins update booking requests" ON public.booking_requests FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins delete booking requests" ON public.booking_requests FOR DELETE TO authenticated USING (public.is_admin());
CREATE TRIGGER package_inquiries_updated BEFORE UPDATE ON public.package_inquiries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER booking_requests_updated BEFORE UPDATE ON public.booking_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.find_or_create_customer(_name text, _phone text, _email text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE cid uuid;
BEGIN
  SELECT id INTO cid FROM public.customers
   WHERE (coalesce(_email,'') <> '' AND lower(email) = lower(_email))
      OR (coalesce(_phone,'') <> '' AND regexp_replace(phone, '\D', '', 'g') = regexp_replace(_phone, '\D', '', 'g'))
   ORDER BY created_at LIMIT 1;
  IF cid IS NULL THEN
    INSERT INTO public.customers (full_name, phone, whatsapp, email)
    VALUES (left(coalesce(nullif(trim(_name),''),'Customer'),120), left(coalesce(_phone,''),30), left(coalesce(_phone,''),30), left(coalesce(_email,''),255))
    RETURNING id INTO cid;
  END IF;
  RETURN cid;
END $$;
REVOKE EXECUTE ON FUNCTION public.find_or_create_customer(text, text, text) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.package_inquiry_before_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  NEW.status := 'New';
  NEW.internal_notes := '';
  NEW.whatsapp := NEW.phone;
  NEW.customer_id := public.find_or_create_customer(NEW.customer_name, NEW.phone, NEW.email);
  RETURN NEW;
END $$;
CREATE TRIGGER package_inquiry_before_insert BEFORE INSERT ON public.package_inquiries
FOR EACH ROW EXECUTE FUNCTION public.package_inquiry_before_insert();

CREATE OR REPLACE FUNCTION public.booking_request_before_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  NEW.status := 'New';
  NEW.internal_notes := '';
  NEW.whatsapp := NEW.phone;
  NEW.customer_id := public.find_or_create_customer(NEW.full_name, NEW.phone, NEW.email);
  RETURN NEW;
END $$;
CREATE TRIGGER booking_request_before_insert BEFORE INSERT ON public.booking_requests
FOR EACH ROW EXECUTE FUNCTION public.booking_request_before_insert();

-- link any existing inquiries to customers
UPDATE public.package_inquiries SET customer_id = public.find_or_create_customer(customer_name, phone, email), whatsapp = phone WHERE customer_id IS NULL;
UPDATE public.booking_requests SET customer_id = public.find_or_create_customer(full_name, phone, email), whatsapp = phone WHERE customer_id IS NULL;

-- ========== Bookings ==========
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  source text NOT NULL DEFAULT 'manual' CHECK (source IN ('package_inquiry','booking_request','manual')),
  source_id uuid,
  customer_name text NOT NULL CHECK (char_length(customer_name) BETWEEN 1 AND 120),
  phone text NOT NULL DEFAULT '' CHECK (char_length(phone) <= 30),
  email text NOT NULL DEFAULT '' CHECK (char_length(email) <= 255),
  event_type text NOT NULL DEFAULT '' CHECK (char_length(event_type) <= 80),
  event_date date,
  event_location text NOT NULL DEFAULT '' CHECK (char_length(event_location) <= 200),
  package_name text NOT NULL DEFAULT '' CHECK (char_length(package_name) <= 80),
  package_price numeric(12,2) CHECK (package_price IS NULL OR package_price >= 0),
  status text NOT NULL DEFAULT 'Confirmed' CHECK (status IN ('Confirmed','Completed','Cancelled')),
  notes text NOT NULL DEFAULT '' CHECK (char_length(notes) <= 4000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX bookings_source_unique ON public.bookings (source, source_id) WHERE source_id IS NOT NULL;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage bookings" ON public.bookings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER bookings_updated BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.convert_inquiry_to_booking(_kind text, _id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE bid uuid; pi public.package_inquiries; br public.booking_requests; price numeric;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501'; END IF;
  SELECT id INTO bid FROM public.bookings WHERE source = _kind AND source_id = _id;
  IF bid IS NOT NULL THEN RETURN bid; END IF;

  IF _kind = 'package_inquiry' THEN
    SELECT * INTO pi FROM public.package_inquiries WHERE id = _id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Inquiry not found'; END IF;
    SELECT p.price INTO price FROM public.packages p WHERE lower(p.name) = lower(pi.package_name) LIMIT 1;
    INSERT INTO public.bookings (customer_id, source, source_id, customer_name, phone, email, event_type, event_date, event_location, package_name, package_price, notes)
    VALUES (coalesce(pi.customer_id, public.find_or_create_customer(pi.customer_name, pi.phone, pi.email)), _kind, _id, pi.customer_name, pi.phone, pi.email, pi.event_type, pi.event_date, coalesce(pi.event_location,''), pi.package_name, price, coalesce(pi.requirements,''))
    RETURNING id INTO bid;
    UPDATE public.package_inquiries SET status = 'Confirmed' WHERE id = _id;
  ELSIF _kind = 'booking_request' THEN
    SELECT * INTO br FROM public.booking_requests WHERE id = _id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Inquiry not found'; END IF;
    INSERT INTO public.bookings (customer_id, source, source_id, customer_name, phone, email, event_type, event_date, event_location, notes)
    VALUES (coalesce(br.customer_id, public.find_or_create_customer(br.full_name, br.phone, br.email)), _kind, _id, br.full_name, br.phone, br.email, br.service_type, br.event_date, coalesce(br.location,''), coalesce(br.message,''))
    RETURNING id INTO bid;
    UPDATE public.booking_requests SET status = 'Confirmed' WHERE id = _id;
  ELSE
    RAISE EXCEPTION 'Unknown inquiry type';
  END IF;
  RETURN bid;
END $$;
REVOKE EXECUTE ON FUNCTION public.convert_inquiry_to_booking(text, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.convert_inquiry_to_booking(text, uuid) TO authenticated;

-- ========== Invoices ==========
CREATE SEQUENCE public.invoice_number_seq START 1;

CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text NOT NULL UNIQUE DEFAULT '',
  invoice_date date NOT NULL DEFAULT current_date,
  due_date date,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  customer_name text NOT NULL CHECK (char_length(customer_name) BETWEEN 1 AND 120),
  customer_phone text NOT NULL DEFAULT '' CHECK (char_length(customer_phone) <= 30),
  customer_email text NOT NULL DEFAULT '' CHECK (char_length(customer_email) <= 255),
  event_type text NOT NULL DEFAULT '' CHECK (char_length(event_type) <= 80),
  event_date date,
  event_location text NOT NULL DEFAULT '' CHECK (char_length(event_location) <= 200),
  package_name text NOT NULL DEFAULT '' CHECK (char_length(package_name) <= 80),
  package_price numeric(12,2) NOT NULL DEFAULT 0 CHECK (package_price >= 0),
  discount numeric(12,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  tax_rate numeric(5,2) NOT NULL DEFAULT 0 CHECK (tax_rate >= 0 AND tax_rate <= 100),
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  tax_amount numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  amount_paid numeric(12,2) NOT NULL DEFAULT 0,
  balance numeric(12,2) NOT NULL DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'Unpaid' CHECK (payment_status IN ('Paid','Partially Paid','Unpaid')),
  payment_method text CHECK (payment_method IS NULL OR payment_method IN ('Cash','Bank Transfer','Easypaisa','JazzCash','Other')),
  notes text NOT NULL DEFAULT '' CHECK (char_length(notes) <= 4000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX invoices_date_idx ON public.invoices (invoice_date DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
GRANT USAGE ON SEQUENCE public.invoice_number_seq TO authenticated, service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage invoices" ON public.invoices FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'service' CHECK (kind IN ('service','charge')),
  description text NOT NULL CHECK (char_length(description) BETWEEN 1 AND 200),
  quantity numeric(10,2) NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price numeric(12,2) NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
  sort_order integer NOT NULL DEFAULT 0
);
CREATE INDEX invoice_items_invoice_idx ON public.invoice_items (invoice_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoice_items TO authenticated;
GRANT ALL ON public.invoice_items TO service_role;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage invoice items" ON public.invoice_items FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.invoice_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  paid_on date NOT NULL DEFAULT current_date,
  method text NOT NULL DEFAULT 'Cash' CHECK (method IN ('Cash','Bank Transfer','Easypaisa','JazzCash','Other')),
  is_advance boolean NOT NULL DEFAULT false,
  note text NOT NULL DEFAULT '' CHECK (char_length(note) <= 500),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX invoice_payments_invoice_idx ON public.invoice_payments (invoice_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoice_payments TO authenticated;
GRANT ALL ON public.invoice_payments TO service_role;
ALTER TABLE public.invoice_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage invoice payments" ON public.invoice_payments FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE OR REPLACE FUNCTION public.invoices_compute()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE items_total numeric; paid numeric; taxable numeric;
BEGIN
  IF TG_OP = 'INSERT' AND coalesce(NEW.invoice_number, '') = '' THEN
    NEW.invoice_number := 'MA-' || to_char(NEW.invoice_date, 'YYYY') || '-' || lpad(nextval('public.invoice_number_seq')::text, 4, '0');
  END IF;
  SELECT coalesce(sum(quantity * unit_price), 0) INTO items_total FROM public.invoice_items WHERE invoice_id = NEW.id;
  SELECT coalesce(sum(amount), 0) INTO paid FROM public.invoice_payments WHERE invoice_id = NEW.id;
  NEW.subtotal := round(NEW.package_price + items_total, 2);
  IF NEW.discount > NEW.subtotal THEN
    RAISE EXCEPTION 'Discount cannot be more than the subtotal';
  END IF;
  taxable := NEW.subtotal - NEW.discount;
  NEW.tax_amount := round(taxable * NEW.tax_rate / 100, 2);
  NEW.total := taxable + NEW.tax_amount;
  NEW.amount_paid := round(paid, 2);
  NEW.balance := greatest(NEW.total - NEW.amount_paid, 0);
  NEW.payment_status := CASE
    WHEN NEW.total > 0 AND NEW.amount_paid >= NEW.total THEN 'Paid'
    WHEN NEW.amount_paid > 0 THEN 'Partially Paid'
    ELSE 'Unpaid' END;
  NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER invoices_compute BEFORE INSERT OR UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.invoices_compute();

CREATE OR REPLACE FUNCTION public.invoice_children_touch()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP IN ('UPDATE','DELETE') THEN
    UPDATE public.invoices SET updated_at = now() WHERE id = OLD.invoice_id;
  END IF;
  IF TG_OP IN ('INSERT','UPDATE') THEN
    UPDATE public.invoices SET updated_at = now() WHERE id = NEW.invoice_id;
  END IF;
  RETURN NULL;
END $$;
CREATE TRIGGER invoice_items_touch AFTER INSERT OR UPDATE OR DELETE ON public.invoice_items FOR EACH ROW EXECUTE FUNCTION public.invoice_children_touch();
CREATE TRIGGER invoice_payments_touch AFTER INSERT OR UPDATE OR DELETE ON public.invoice_payments FOR EACH ROW EXECUTE FUNCTION public.invoice_children_touch();

-- ========== Expenses ==========
CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  category text NOT NULL CHECK (char_length(category) BETWEEN 1 AND 60),
  expense_date date NOT NULL DEFAULT current_date,
  notes text NOT NULL DEFAULT '' CHECK (char_length(notes) <= 2000),
  receipt_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX expenses_date_idx ON public.expenses (expense_date DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO authenticated;
GRANT ALL ON public.expenses TO service_role;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage expenses" ON public.expenses FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER expenses_updated BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ========== Storage policies ==========
CREATE OR REPLACE FUNCTION public.is_public_media(_path text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.gallery_photos WHERE image_path = _path AND published)
      OR EXISTS (SELECT 1 FROM public.portfolio_projects WHERE cover_path = _path AND published)
      OR EXISTS (SELECT 1 FROM public.portfolio_images i JOIN public.portfolio_projects p ON p.id = i.project_id WHERE i.image_path = _path AND p.published)
      OR EXISTS (SELECT 1 FROM public.site_settings WHERE hero_image_path = _path OR logo_path = _path)
$$;

CREATE POLICY "Public reads published media" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'media' AND public.is_public_media(name));
CREATE POLICY "Admins read media" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "Admins upload media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "Admins update media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.is_admin()) WITH CHECK (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "Admins delete media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.is_admin());

CREATE POLICY "Admins read receipts" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'receipts' AND public.is_admin());
CREATE POLICY "Admins upload receipts" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'receipts' AND public.is_admin());
CREATE POLICY "Admins update receipts" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'receipts' AND public.is_admin()) WITH CHECK (bucket_id = 'receipts' AND public.is_admin());
CREATE POLICY "Admins delete receipts" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'receipts' AND public.is_admin());
