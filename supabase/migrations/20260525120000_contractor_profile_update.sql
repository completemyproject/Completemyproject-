-- Allow contractors to update their own business profile (status/email guarded by trigger)
CREATE POLICY "Contractors can update own profile"
  ON public.contractor_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.guard_contractor_profile_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.status := OLD.status;
    NEW.email := OLD.email;
    NEW.user_id := OLD.user_id;
    NEW.contractor_id := OLD.contractor_id;
    NEW.business_type := OLD.business_type;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_contractor_profile_update ON public.contractor_profiles;
CREATE TRIGGER guard_contractor_profile_update
  BEFORE UPDATE ON public.contractor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_contractor_profile_update();
