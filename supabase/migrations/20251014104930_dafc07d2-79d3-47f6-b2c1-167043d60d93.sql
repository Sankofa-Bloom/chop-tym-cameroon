-- Create app settings table
CREATE TABLE IF NOT EXISTS public.app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings
CREATE POLICY "Anyone can view app settings"
  ON public.app_settings
  FOR SELECT
  USING (true);

-- Only admins can modify settings
CREATE POLICY "Only admins can insert app settings"
  ON public.app_settings
  FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can update app settings"
  ON public.app_settings
  FOR UPDATE
  USING (is_admin());

CREATE POLICY "Only admins can delete app settings"
  ON public.app_settings
  FOR DELETE
  USING (is_admin());

-- Insert default settings
INSERT INTO public.app_settings (key, value, description)
VALUES 
  ('pricing_mode', '{"mode": "simple", "flat_price": 1000}', 'Controls pricing mode: simple (flat price) or restaurant (individual restaurant prices)'),
  ('simple_mode_currency', '{"currency": "XAF"}', 'Currency for simple mode pricing')
ON CONFLICT (key) DO NOTHING;

-- Add trigger for updated_at
CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();