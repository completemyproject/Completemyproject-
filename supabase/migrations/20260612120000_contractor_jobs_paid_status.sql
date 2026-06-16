-- Add "Paid" as a job status after "Invoiced"

ALTER TABLE public.contractor_jobs DROP CONSTRAINT contractor_jobs_status_check;

ALTER TABLE public.contractor_jobs ADD CONSTRAINT contractor_jobs_status_check CHECK (
  status IN (
    'Site visit arranged',
    'Prepare quotation',
    'Client received quotation',
    'Quote accepted',
    'Invoiced',
    'Paid'
  )
);
