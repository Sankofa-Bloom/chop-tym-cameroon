-- Fix failing trigger: remove invalid call to supabase.functions.invoke inside DB function
CREATE OR REPLACE FUNCTION public.send_order_confirmation_on_payment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only act when payment status changes to 'paid'
  IF NEW.payment_status = 'paid' AND OLD.payment_status != 'paid' THEN
    -- Email dispatch is now handled by edge functions (e.g., mark-offline-paid or webhooks).
    -- Intentionally left blank to prevent DB errors blocking updates.
  END IF;

  RETURN NEW;
END;
$function$;