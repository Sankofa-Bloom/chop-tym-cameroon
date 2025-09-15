-- Create database webhook to send custom signup emails
-- This will trigger when a new user is inserted into auth.users table

CREATE OR REPLACE FUNCTION public.send_signup_email_webhook()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the edge function to send custom signup email
  PERFORM
    net.http_post(
      url := concat(current_setting('app.settings.supabase_url'), '/functions/v1/send-signup-email'),
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', concat('Bearer ', current_setting('app.settings.service_role_key'))
      ),
      body := jsonb_build_object(
        'type', 'INSERT',
        'record', row_to_json(NEW)
      )
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;