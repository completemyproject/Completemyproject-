
-- 1. App role enum + user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 2. Security definer function to check roles (avoids recursive RLS)
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

-- 3. user_roles policies — users can read their own roles; only admins manage
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Drop overly permissive policies on contractors
DROP POLICY IF EXISTS "Authenticated users can insert contractors" ON public.contractors;
DROP POLICY IF EXISTS "Authenticated users can update contractors" ON public.contractors;
DROP POLICY IF EXISTS "Authenticated users can view contractors" ON public.contractors;

CREATE POLICY "Admins can view contractors"
  ON public.contractors FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert contractors"
  ON public.contractors FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contractors"
  ON public.contractors FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. Lock down enquiries — keep public INSERT (homepage form) but restrict reads/updates to admins
DROP POLICY IF EXISTS "Authenticated users can update enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Authenticated users can view enquiries" ON public.enquiries;

CREATE POLICY "Admins can view enquiries"
  ON public.enquiries FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update enquiries"
  ON public.enquiries FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. Lock down enquiry_contractors
DROP POLICY IF EXISTS "Authenticated users can insert enquiry_contractors" ON public.enquiry_contractors;
DROP POLICY IF EXISTS "Authenticated users can update enquiry_contractors" ON public.enquiry_contractors;
DROP POLICY IF EXISTS "Authenticated users can view enquiry_contractors" ON public.enquiry_contractors;

CREATE POLICY "Admins can view enquiry_contractors"
  ON public.enquiry_contractors FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert enquiry_contractors"
  ON public.enquiry_contractors FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update enquiry_contractors"
  ON public.enquiry_contractors FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 7. Server-side length validation trigger on enquiries (prevents oversized payloads)
CREATE OR REPLACE FUNCTION public.validate_enquiry_lengths()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
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

CREATE TRIGGER trg_validate_enquiry_lengths
  BEFORE INSERT OR UPDATE ON public.enquiries
  FOR EACH ROW EXECUTE FUNCTION public.validate_enquiry_lengths();

-- 8. updated_at trigger for user_roles consistency (uses existing helper)
-- (no updated_at column on user_roles, skipping)

-- 9. Add contact_messages table for the Contact form
CREATE TABLE public.contact_messages (
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

CREATE POLICY "Anyone can submit a contact message"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 1 AND 100
    AND length(email) BETWEEN 3 AND 255
    AND (phone IS NULL OR length(phone) <= 30)
    AND length(topic) BETWEEN 1 AND 100
    AND length(message) BETWEEN 1 AND 2000
  );

CREATE POLICY "Admins can view contact messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contact messages"
  ON public.contact_messages FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
