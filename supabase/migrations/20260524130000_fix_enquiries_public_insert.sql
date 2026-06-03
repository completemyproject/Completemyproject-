-- Allow public Get Quotes form (anon) to insert enquiries

GRANT INSERT ON public.enquiries TO anon, authenticated;
GRANT SELECT, UPDATE ON public.enquiries TO authenticated;

DROP POLICY IF EXISTS "Anyone can submit an enquiry" ON public.enquiries;

CREATE POLICY "Anyone can submit an enquiry"
  ON public.enquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 1 AND 100
    AND length(email) BETWEEN 3 AND 255
    AND length(phone) BETWEEN 1 AND 20
    AND length(postcode) BETWEEN 1 AND 10
    AND length(project_type) BETWEEN 1 AND 100
    AND length(description) BETWEEN 1 AND 2000
  );
