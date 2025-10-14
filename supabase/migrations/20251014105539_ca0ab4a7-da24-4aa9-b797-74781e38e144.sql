-- Update app_settings to include availability hours
UPDATE public.app_settings 
SET value = jsonb_set(
  value,
  '{availability_hours}',
  '{"start": "09:00", "end": "18:00"}'::jsonb
)
WHERE key = 'pricing_mode';

-- Update description
UPDATE public.app_settings
SET description = 'Controls pricing mode (simple/restaurant), flat price, and dish availability hours'
WHERE key = 'pricing_mode';