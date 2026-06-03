-- Contractor pipeline jobs and document uploads

CREATE TABLE public.contractor_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contractor_profile_id uuid REFERENCES public.contractor_profiles(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  postcode text NOT NULL,
  inspection_date date,
  comments text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Site visit arranged',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT contractor_jobs_status_check CHECK (
    status IN (
      'Site visit arranged',
      'Prepare quotation',
      'Client received quotation',
      'Quote accepted',
      'Invoiced'
    )
  )
);

CREATE INDEX idx_contractor_jobs_user_id ON public.contractor_jobs(user_id);
CREATE INDEX idx_contractor_jobs_created_at ON public.contractor_jobs(created_at DESC);

CREATE TABLE public.contractor_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id uuid REFERENCES public.contractor_jobs(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_contractor_documents_user_id ON public.contractor_documents(user_id);
CREATE INDEX idx_contractor_documents_job_id ON public.contractor_documents(job_id);

CREATE TRIGGER update_contractor_jobs_updated_at
  BEFORE UPDATE ON public.contractor_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.contractor_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractor_documents ENABLE ROW LEVEL SECURITY;

-- Jobs: contractors own their rows
CREATE POLICY "Contractors can view own jobs"
  ON public.contractor_jobs FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Contractors can insert own jobs"
  ON public.contractor_jobs FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Contractors can update own jobs"
  ON public.contractor_jobs FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Contractors can delete own jobs"
  ON public.contractor_jobs FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Admins can view all contractor jobs"
  ON public.contractor_jobs FOR SELECT TO authenticated
  USING (public.has_role((SELECT auth.uid()), 'admin'));

-- Documents: contractors own their rows
CREATE POLICY "Contractors can view own documents"
  ON public.contractor_documents FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Contractors can insert own documents"
  ON public.contractor_documents FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Contractors can delete own documents"
  ON public.contractor_documents FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Admins can view all contractor documents"
  ON public.contractor_documents FOR SELECT TO authenticated
  USING (public.has_role((SELECT auth.uid()), 'admin'));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.contractor_jobs TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.contractor_documents TO authenticated;

-- Storage bucket for invoices and paperwork
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'contractor-documents',
  'contractor-documents',
  false,
  10485760,
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Contractors upload own documents"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'contractor-documents'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

CREATE POLICY "Contractors read own documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'contractor-documents'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

CREATE POLICY "Contractors delete own documents"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'contractor-documents'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

CREATE POLICY "Admins read all contractor documents storage"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'contractor-documents'
    AND public.has_role((SELECT auth.uid()), 'admin')
  );
