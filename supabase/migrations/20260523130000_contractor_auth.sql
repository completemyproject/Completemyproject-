-- Step 1: add enum value (must be in its own migration before using 'contractor')
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'contractor';
