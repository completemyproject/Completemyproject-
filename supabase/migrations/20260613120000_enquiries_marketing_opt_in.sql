-- Track whether a customer opted in to marketing emails when requesting a quote

ALTER TABLE public.enquiries ADD COLUMN marketing_opt_in BOOLEAN NOT NULL DEFAULT false;

DROP FUNCTION IF EXISTS public.submit_enquiry(text, text, text, text, text, text);

CREATE FUNCTION public.submit_enquiry(
  p_name text,
  p_email text,
  p_phone text,
  p_postcode text,
  p_project_type text,
  p_description text,
  p_marketing_opt_in boolean DEFAULT false
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
    description,
    marketing_opt_in
  )
  VALUES (
    trim(p_name),
    trim(p_email),
    trim(p_phone),
    trim(p_postcode),
    trim(p_project_type),
    trim(p_description),
    p_marketing_opt_in
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_enquiry(text, text, text, text, text, text, boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_enquiry(text, text, text, text, text, text, boolean) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
