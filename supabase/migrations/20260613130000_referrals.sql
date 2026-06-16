-- Refer a Friend: customers submit a referral (their details + a client's details)
-- Admin reviews submissions, accepts/rejects, and the referrer is emailed on status change.

CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_name text NOT NULL,
  referrer_email text NOT NULL,
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a referral"
  ON public.referrals FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(referrer_name) BETWEEN 1 AND 100
    AND length(referrer_email) BETWEEN 3 AND 255
    AND length(client_name) BETWEEN 1 AND 100
    AND length(client_email) BETWEEN 3 AND 255
    AND length(client_phone) BETWEEN 1 AND 30
  );

CREATE POLICY "Admins can view referrals"
  ON public.referrals FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update referrals"
  ON public.referrals FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
