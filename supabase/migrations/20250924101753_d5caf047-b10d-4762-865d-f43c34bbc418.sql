-- Update payment status trigger for orders to send confirmation email only when marked as paid
CREATE OR REPLACE FUNCTION public.send_order_confirmation_on_payment()
RETURNS TRIGGER AS $$
BEGIN
  -- Only send confirmation email when payment status changes to 'paid'
  IF NEW.payment_status = 'paid' AND OLD.payment_status != 'paid' THEN
    -- For offline payments, send confirmation email when admin marks as paid
    -- For online payments, this is handled by webhook after payment
    IF NEW.payment_method = 'offline' THEN
      PERFORM supabase.functions.invoke('send-order-confirmation', 
        json_build_object('order_id', NEW.id, 'customer_email', null)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS order_payment_confirmation_trigger ON public.orders;
CREATE TRIGGER order_payment_confirmation_trigger
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.send_order_confirmation_on_payment();