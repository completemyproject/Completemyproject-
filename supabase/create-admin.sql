-- =============================================================================
-- Create admin user (run in Supabase SQL Editor AFTER creating auth user)
-- =============================================================================
--
-- STEP 1 — Dashboard → Authentication → Users → Add user
--   Email: admin@yourcompany.co.uk
--   Password: (strong password)
--   Copy the user's UUID from the users list
--
-- STEP 2 — Replace YOUR-USER-UUID below and run this SQL:

INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR-USER-UUID', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- STEP 3 — Login at http://localhost:8080/admin/login
