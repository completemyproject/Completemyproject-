-- Step 2: contractor tables, triggers, RLS (runs after enum value exists)

CREATE TABLE public.contractor_profiles (
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

CREATE INDEX idx_contractor_profiles_user_id ON public.contractor_profiles(user_id);
CREATE INDEX idx_contractor_profiles_status ON public.contractor_profiles(status);

CREATE TRIGGER update_contractor_profiles_updated_at
  BEFORE UPDATE ON public.contractor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_contractor_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.user_id, 'contractor')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_contractor_profile_created
  AFTER INSERT ON public.contractor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_contractor_profile();

CREATE OR REPLACE FUNCTION public.handle_contractor_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  directors int;
BEGIN
  IF coalesce(NEW.raw_user_meta_data->>'account_type', '') <> 'contractor' THEN
    RETURN NEW;
  END IF;

  directors := NULL;
  IF coalesce(NEW.raw_user_meta_data->>'number_of_directors', '') ~ '^\d+$' THEN
    directors := (NEW.raw_user_meta_data->>'number_of_directors')::int;
  END IF;

  INSERT INTO public.contractor_profiles (
    user_id,
    business_name,
    company_number,
    business_type,
    number_of_directors,
    contact_name,
    contact_phone,
    email,
    status
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

CREATE TRIGGER on_auth_user_created_contractor
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_contractor_signup();

CREATE POLICY "Contractors can view own profile"
  ON public.contractor_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all contractor profiles"
  ON public.contractor_profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contractor profiles"
  ON public.contractor_profiles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Contractors can view own contractor role"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id AND role = 'contractor');
