-- Add category field to payment_methods table
ALTER TABLE public.payment_methods 
ADD COLUMN category text NOT NULL DEFAULT 'online';

-- Add payment details field for offline payment methods (like account numbers, phone numbers, etc.)
ALTER TABLE public.payment_methods 
ADD COLUMN payment_details jsonb DEFAULT null;

-- Update existing payment methods with appropriate categories
UPDATE public.payment_methods 
SET category = 'offline'
WHERE code = 'offline';

UPDATE public.payment_methods 
SET category = 'online'
WHERE code IN ('fapshi', 'swychr');

-- Add payment details for offline method
UPDATE public.payment_methods 
SET payment_details = '{
  "methods": [
    {
      "name": "MTN Mobile Money",
      "phone": "670416449",
      "account_name": "Mpah Ngwese",
      "instructions": "Send Mobile Money to this number"
    },
    {
      "name": "Orange Money",  
      "phone": "699123456",
      "account_name": "ChopTym",
      "instructions": "Send Orange Money to this number"
    }
  ]
}'::jsonb
WHERE code = 'offline';