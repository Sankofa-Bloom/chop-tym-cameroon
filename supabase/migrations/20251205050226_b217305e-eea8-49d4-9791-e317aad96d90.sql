-- Insert payment mode setting
INSERT INTO app_settings (key, value, description)
VALUES (
  'payment_mode',
  '{"mode": "delivery", "online_payments_enabled": false}',
  'Controls payment flow - delivery (pay on delivery) or online (online payments required)'
)
ON CONFLICT (key) DO NOTHING;