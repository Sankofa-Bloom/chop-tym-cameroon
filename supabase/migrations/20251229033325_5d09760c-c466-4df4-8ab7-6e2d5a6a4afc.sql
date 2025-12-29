-- Create enum for order types
CREATE TYPE public.operational_order_type AS ENUM ('food', 'errand', 'parcel', 'custom');

-- Create enum for order sources
CREATE TYPE public.operational_order_source AS ENUM ('whatsapp', 'phone_call', 'walk_in', 'emergency');

-- Create enum for operational order status
CREATE TYPE public.operational_order_status AS ENUM ('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled', 'failed');

-- Create enum for rider status
CREATE TYPE public.rider_status AS ENUM ('available', 'busy', 'offline');

-- Create riders table
CREATE TABLE public.riders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  current_status rider_status NOT NULL DEFAULT 'offline',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create operational_orders table
CREATE TABLE public.operational_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_id TEXT NOT NULL UNIQUE,
  order_type operational_order_type NOT NULL,
  order_source operational_order_source NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  description TEXT,
  estimated_amount INTEGER NOT NULL DEFAULT 0,
  actual_amount INTEGER,
  payment_method TEXT NOT NULL DEFAULT 'cash',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  status operational_order_status NOT NULL DEFAULT 'pending',
  assigned_rider_id UUID REFERENCES public.riders(id),
  created_by UUID NOT NULL,
  town TEXT NOT NULL DEFAULT 'Douala',
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_activity_log table (immutable audit log)
CREATE TABLE public.order_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operational_order_id UUID NOT NULL REFERENCES public.operational_orders(id) ON DELETE RESTRICT,
  action_type TEXT NOT NULL,
  action_by UUID NOT NULL,
  previous_value JSONB,
  new_value JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_notes table
CREATE TABLE public.order_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operational_order_id UUID NOT NULL REFERENCES public.operational_orders(id) ON DELETE RESTRICT,
  note TEXT NOT NULL,
  created_by UUID NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Function to generate operational order reference ID
CREATE OR REPLACE FUNCTION public.generate_operational_order_reference()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prefix TEXT;
  date_str TEXT;
  daily_count INTEGER;
BEGIN
  prefix := 'OP';
  date_str := TO_CHAR(NOW(), 'DDMMYY');
  
  SELECT COALESCE(COUNT(*), 0) + 1
  FROM public.operational_orders 
  WHERE DATE(created_at) = CURRENT_DATE
  INTO daily_count;
  
  RETURN prefix || '-' || date_str || '-' || LPAD(daily_count::TEXT, 4, '0');
END;
$$;

-- Trigger to auto-generate reference_id
CREATE OR REPLACE FUNCTION public.set_operational_order_reference()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.reference_id IS NULL OR NEW.reference_id = '' THEN
    NEW.reference_id := generate_operational_order_reference();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_operational_order_reference_trigger
BEFORE INSERT ON public.operational_orders
FOR EACH ROW
EXECUTE FUNCTION public.set_operational_order_reference();

-- Trigger to log activity on status changes
CREATE OR REPLACE FUNCTION public.log_operational_order_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.order_activity_log (
      operational_order_id,
      action_type,
      action_by,
      previous_value,
      new_value,
      notes
    ) VALUES (
      NEW.id,
      'status_change',
      COALESCE(auth.uid(), NEW.created_by),
      jsonb_build_object('status', OLD.status::text),
      jsonb_build_object('status', NEW.status::text),
      'Status updated from ' || OLD.status::text || ' to ' || NEW.status::text
    );
  END IF;
  
  -- Log rider assignment changes
  IF OLD.assigned_rider_id IS DISTINCT FROM NEW.assigned_rider_id THEN
    INSERT INTO public.order_activity_log (
      operational_order_id,
      action_type,
      action_by,
      previous_value,
      new_value,
      notes
    ) VALUES (
      NEW.id,
      'rider_assignment',
      COALESCE(auth.uid(), NEW.created_by),
      jsonb_build_object('rider_id', OLD.assigned_rider_id::text),
      jsonb_build_object('rider_id', NEW.assigned_rider_id::text),
      'Rider assignment updated'
    );
  END IF;
  
  -- Log payment status changes
  IF OLD.payment_status IS DISTINCT FROM NEW.payment_status THEN
    INSERT INTO public.order_activity_log (
      operational_order_id,
      action_type,
      action_by,
      previous_value,
      new_value,
      notes
    ) VALUES (
      NEW.id,
      'payment_status_change',
      COALESCE(auth.uid(), NEW.created_by),
      jsonb_build_object('payment_status', OLD.payment_status),
      jsonb_build_object('payment_status', NEW.payment_status),
      'Payment status updated from ' || OLD.payment_status || ' to ' || NEW.payment_status
    );
  END IF;
  
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER log_operational_order_activity_trigger
BEFORE UPDATE ON public.operational_orders
FOR EACH ROW
EXECUTE FUNCTION public.log_operational_order_activity();

-- Trigger to log order creation
CREATE OR REPLACE FUNCTION public.log_operational_order_creation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.order_activity_log (
    operational_order_id,
    action_type,
    action_by,
    new_value,
    notes
  ) VALUES (
    NEW.id,
    'order_created',
    NEW.created_by,
    jsonb_build_object(
      'order_type', NEW.order_type::text,
      'order_source', NEW.order_source::text,
      'customer_name', NEW.customer_name,
      'estimated_amount', NEW.estimated_amount
    ),
    'Order created via ' || NEW.order_source::text
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER log_operational_order_creation_trigger
AFTER INSERT ON public.operational_orders
FOR EACH ROW
EXECUTE FUNCTION public.log_operational_order_creation();

-- Update timestamp trigger for riders
CREATE TRIGGER update_riders_updated_at
BEFORE UPDATE ON public.riders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operational_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for riders
CREATE POLICY "Operations admins can view riders"
ON public.riders FOR SELECT
USING (has_operations_access());

CREATE POLICY "Operations admins can insert riders"
ON public.riders FOR INSERT
WITH CHECK (has_operations_access());

CREATE POLICY "Operations admins can update riders"
ON public.riders FOR UPDATE
USING (has_operations_access());

-- RLS Policies for operational_orders
CREATE POLICY "Operations admins can view operational orders"
ON public.operational_orders FOR SELECT
USING (has_operations_access());

CREATE POLICY "Operations admins can insert operational orders"
ON public.operational_orders FOR INSERT
WITH CHECK (has_operations_access());

CREATE POLICY "Operations admins can update operational orders"
ON public.operational_orders FOR UPDATE
USING (has_operations_access());

-- RLS Policies for order_activity_log (read-only for operations, no delete/update)
CREATE POLICY "Operations and insights admins can view activity logs"
ON public.order_activity_log FOR SELECT
USING (has_operations_access() OR has_insights_access());

CREATE POLICY "System can insert activity logs"
ON public.order_activity_log FOR INSERT
WITH CHECK (has_operations_access());

-- RLS Policies for order_notes
CREATE POLICY "Operations admins can view order notes"
ON public.order_notes FOR SELECT
USING (has_operations_access());

CREATE POLICY "Operations admins can insert order notes"
ON public.order_notes FOR INSERT
WITH CHECK (has_operations_access());

CREATE POLICY "Operations admins can update order notes"
ON public.order_notes FOR UPDATE
USING (has_operations_access());