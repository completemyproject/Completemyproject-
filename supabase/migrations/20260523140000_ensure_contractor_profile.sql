-- Repair contractor rows when auth user exists but profile/role were never created
CREATE OR REPLACE FUNCTION public.ensure_contractor_profile()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  meta jsonb;
  user_email text;
  directors int;
BEGIN
  IF uid IS NULL THEN
    RETURN false;
  END IF;

  IF EXISTS (SELECT 1 FROM public.contractor_profiles WHERE user_id = uid) THEN
    RETURN true;
  END IF;

  SELECT raw_user_meta_data, email INTO meta, user_email
  FROM auth.users
  WHERE id = uid;

  IF meta IS NULL OR coalesce(meta->>'account_type', '') <> 'contractor' THEN
    RETURN false;
  END IF;

  directors := NULL;
  IF coalesce(meta->>'number_of_directors', '') ~ '^\d+$' THEN
    directors := (meta->>'number_of_directors')::int;
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
    uid,
    coalesce(meta->>'business_name', 'Unknown'),
    NULLIF(meta->>'company_number', ''),
    coalesce(meta->>'business_type', 'sole_trader'),
    directors,
    coalesce(meta->>'contact_name', 'Unknown'),
    NULLIF(meta->>'contact_phone', ''),
    coalesce(user_email, ''),
    'pending'
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.ensure_contractor_profile() TO authenticated;

-- One-time backfill for existing contractor auth users
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
