-- Step 1: Extend the app_role enum with zone-specific admin roles
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admin_operations';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admin_finance';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admin_insights';