-- Set up a cron job to check for long-pending orders every 5 minutes
-- First, enable the pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable the pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create the cron job to check for pending orders every 5 minutes
SELECT cron.schedule(
  'check-pending-orders-job',
  '*/5 * * * *', -- Every 5 minutes
  $$
  SELECT
    net.http_post(
        url:='https://qiupqrmtxwtgipbwcvoo.supabase.co/functions/v1/check-pending-orders',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpdXBxcm10eHd0Z2lwYndjdm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MDkzNzYsImV4cCI6MjA3Mjk4NTM3Nn0.8tU8HKF2hW4uXxoUIbnDeG0LVVJHU7Z1ESxvWgSY5N0"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);