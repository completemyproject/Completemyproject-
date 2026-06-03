-- Public quote form: insert + return id without exposing enquiry reads to anon.
-- PostgREST INSERT ... RETURNING needs SELECT; anon only has INSERT policy.

CREATE OR REPLACE FUNCTION public.submit_enquiry(
  p_name text,
  p_email text,
  p_phone text,
  p_postcode text,
  p_project_type text,
  p_description text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO public.enquiries (
    name,
    email,
    phone,
    postcode,
    project_type,
    description
  )
  VALUES (
    trim(p_name),
    trim(p_email),
    trim(p_phone),
    trim(p_postcode),
    trim(p_project_type),
    trim(p_description)
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_enquiry(text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_enquiry(text, text, text, text, text, text) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
