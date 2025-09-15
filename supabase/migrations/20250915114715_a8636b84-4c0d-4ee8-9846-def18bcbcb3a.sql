-- Enable RLS on auth_users and email_verification_tokens tables
ALTER TABLE auth_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for auth_users (admin-only access)
CREATE POLICY "Only admins can manage auth_users" 
ON auth_users FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());

-- Create RLS policies for email_verification_tokens (users can manage their own tokens)
CREATE POLICY "Users can manage their own verification tokens" 
ON email_verification_tokens FOR ALL 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());