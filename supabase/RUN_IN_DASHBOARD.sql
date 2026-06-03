-- =============================================================================
-- RUN THIS ENTIRE FILE in Supabase Dashboard → SQL Editor → Run
-- Project: svshnisjaopddcanueft
-- Fixes: has_role, contractor_profiles, enquiries, user_roles, etc.
-- =============================================================================

-- ----- Migration 1: core tables -----
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  postcode TEXT NOT NULL,
  project_type TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contractors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  trades TEXT[] NOT NULL DEFAULT '{}',
  service_areas TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.enquiry_contractors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enquiry_id UUID NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
  contractor_id UUID NOT NULL REFERENCES public.contractors(id) ON DELETE CASCADE,
  notified_at TIMESTAMPTZ DEFAULT now(),
  response_status TEXT NOT NULL DEFAULT 'pending' CHECK (response_status IN ('pending', 'accepted', 'declined', 'no_response')),
  response_notes TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_enquiries_updated_at ON public.enquiries;
CREATE TRIGGER update_enquiries_updated_at
  BEFORE UPDATE ON public.enquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_contractors_updated_at ON public.contractors;
CREATE TRIGGER update_contractors_updated_at
  BEFORE UPDATE ON public.contractors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ----- Migration 2: roles + RLS -----
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'contractor';

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit an enquiry" ON public.enquiries;
CREATE POLICY "Anyone can submit an enquiry" ON public.enquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can view enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Authenticated users can update enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Admins can view enquiries" ON public.enquiries;
CREATE POLICY "Admins can view enquiries" ON public.enquiries FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can update enquiries" ON public.enquiries;
CREATE POLICY "Admins can update enquiries" ON public.enquiries FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Authenticated users can view contractors" ON public.contractors;
DROP POLICY IF EXISTS "Authenticated users can insert contractors" ON public.contractors;
DROP POLICY IF EXISTS "Authenticated users can update contractors" ON public.contractors;
DROP POLICY IF EXISTS "Admins can view contractors" ON public.contractors;
CREATE POLICY "Admins can view contractors" ON public.contractors FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can insert contractors" ON public.contractors;
CREATE POLICY "Admins can insert contractors" ON public.contractors FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can update contractors" ON public.contractors;
CREATE POLICY "Admins can update contractors" ON public.contractors FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Authenticated users can view enquiry_contractors" ON public.enquiry_contractors;
DROP POLICY IF EXISTS "Authenticated users can insert enquiry_contractors" ON public.enquiry_contractors;
DROP POLICY IF EXISTS "Authenticated users can update enquiry_contractors" ON public.enquiry_contractors;
DROP POLICY IF EXISTS "Admins can view enquiry_contractors" ON public.enquiry_contractors;
CREATE POLICY "Admins can view enquiry_contractors" ON public.enquiry_contractors FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can insert enquiry_contractors" ON public.enquiry_contractors;
CREATE POLICY "Admins can insert enquiry_contractors" ON public.enquiry_contractors FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can update enquiry_contractors" ON public.enquiry_contractors;
CREATE POLICY "Admins can update enquiry_contractors" ON public.enquiry_contractors FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Contractors can view own contractor role" ON public.user_roles;
CREATE POLICY "Contractors can view own contractor role" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id AND role = 'contractor');

CREATE OR REPLACE FUNCTION public.validate_enquiry_lengths()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF length(NEW.name) > 100 THEN RAISE EXCEPTION 'name too long'; END IF;
  IF length(NEW.email) > 255 THEN RAISE EXCEPTION 'email too long'; END IF;
  IF length(NEW.phone) > 20 THEN RAISE EXCEPTION 'phone too long'; END IF;
  IF length(NEW.postcode) > 10 THEN RAISE EXCEPTION 'postcode too long'; END IF;
  IF length(NEW.project_type) > 100 THEN RAISE EXCEPTION 'project_type too long'; END IF;
  IF length(NEW.description) > 2000 THEN RAISE EXCEPTION 'description too long'; END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_enquiry_lengths ON public.enquiries;
CREATE TRIGGER trg_validate_enquiry_lengths
  BEFORE INSERT OR UPDATE ON public.enquiries
  FOR EACH ROW EXECUTE FUNCTION public.validate_enquiry_lengths();

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  topic text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit a contact message" ON public.contact_messages;
CREATE POLICY "Anyone can submit a contact message" ON public.contact_messages FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 1 AND 100 AND length(email) BETWEEN 3 AND 255
    AND (phone IS NULL OR length(phone) <= 30) AND length(topic) BETWEEN 1 AND 100
    AND length(message) BETWEEN 1 AND 2000
  );
DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view contact messages" ON public.contact_messages FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can update contact messages" ON public.contact_messages;
CREATE POLICY "Admins can update contact messages" ON public.contact_messages FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ----- Migration 3: contractor auth -----
CREATE TABLE IF NOT EXISTS public.contractor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  business_name text NOT NULL,
  company_number text,
  business_type text NOT NULL CHECK (business_type IN ('ltd', 'sole_trader')),
  number_of_directors integer,
  contact_name text NOT NULL,
  contact_phone text,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  contractor_id uuid REFERENCES public.contractors(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contractor_profiles ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_contractor_profiles_user_id ON public.contractor_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_contractor_profiles_status ON public.contractor_profiles(status);

DROP TRIGGER IF EXISTS update_contractor_profiles_updated_at ON public.contractor_profiles;
CREATE TRIGGER update_contractor_profiles_updated_at
  BEFORE UPDATE ON public.contractor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_contractor_profile()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.user_id, 'contractor')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_contractor_profile_created ON public.contractor_profiles;
CREATE TRIGGER on_contractor_profile_created
  AFTER INSERT ON public.contractor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_contractor_profile();

CREATE OR REPLACE FUNCTION public.handle_contractor_signup()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE directors int;
BEGIN
  IF coalesce(NEW.raw_user_meta_data->>'account_type', '') <> 'contractor' THEN
    RETURN NEW;
  END IF;
  directors := NULL;
  IF coalesce(NEW.raw_user_meta_data->>'number_of_directors', '') ~ '^\d+$' THEN
    directors := (NEW.raw_user_meta_data->>'number_of_directors')::int;
  END IF;
  INSERT INTO public.contractor_profiles (
    user_id, business_name, company_number, business_type, number_of_directors,
    contact_name, contact_phone, email, status
  ) VALUES (
    NEW.id,
    coalesce(NEW.raw_user_meta_data->>'business_name', 'Unknown'),
    NULLIF(NEW.raw_user_meta_data->>'company_number', ''),
    coalesce(NEW.raw_user_meta_data->>'business_type', 'sole_trader'),
    directors,
    coalesce(NEW.raw_user_meta_data->>'contact_name', 'Unknown'),
    NULLIF(NEW.raw_user_meta_data->>'contact_phone', ''),
    coalesce(NEW.email, ''),
    'pending'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_contractor ON auth.users;
CREATE TRIGGER on_auth_user_created_contractor
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_contractor_signup();

DROP POLICY IF EXISTS "Contractors can view own profile" ON public.contractor_profiles;
CREATE POLICY "Contractors can view own profile" ON public.contractor_profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can view all contractor profiles" ON public.contractor_profiles;
CREATE POLICY "Admins can view all contractor profiles" ON public.contractor_profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can update contractor profiles" ON public.contractor_profiles;
CREATE POLICY "Admins can update contractor profiles" ON public.contractor_profiles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Contractors can update own profile" ON public.contractor_profiles;
CREATE POLICY "Contractors can update own profile" ON public.contractor_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Backfill: users who signed up before migration (optional — run if login fails after SQL)
INSERT INTO public.contractor_profiles (
  user_id, business_name, company_number, business_type, number_of_directors,
  contact_name, contact_phone, email, status
)
SELECT
  u.id,
  coalesce(u.raw_user_meta_data->>'business_name', 'Unknown'),
  NULLIF(u.raw_user_meta_data->>'company_number', ''),
  coalesce(u.raw_user_meta_data->>'business_type', 'sole_trader'),
  NULLIF(coalesce(u.raw_user_meta_data->>'number_of_directors', ''), '')::int,
  coalesce(u.raw_user_meta_data->>'contact_name', 'Unknown'),
  NULLIF(u.raw_user_meta_data->>'contact_phone', ''),
  coalesce(u.email, ''),
  'pending'
FROM auth.users u
WHERE coalesce(u.raw_user_meta_data->>'account_type', '') = 'contractor'
  AND NOT EXISTS (SELECT 1 FROM public.contractor_profiles p WHERE p.user_id = u.id)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'contractor'::public.app_role
FROM auth.users u
WHERE coalesce(u.raw_user_meta_data->>'account_type', '') = 'contractor'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles r WHERE r.user_id = u.id AND r.role = 'contractor'
  )
ON CONFLICT (user_id, role) DO NOTHING;

NOTIFY pgrst, 'reload schema';
