-- Create financial_transactions table for audit trail
CREATE TABLE public.financial_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('payment', 'refund', 'payout', 'adjustment')),
  amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'XAF',
  payment_method text,
  payment_reference text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  notes text,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

-- Create helper function to check if user has any admin role
CREATE OR REPLACE FUNCTION public.is_any_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = is_any_admin.user_id
      AND role IN ('admin', 'admin_operations', 'admin_finance', 'admin_insights')
  );
$$;

-- Create helper function to check if user has finance access
CREATE OR REPLACE FUNCTION public.has_finance_access(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = has_finance_access.user_id
      AND role IN ('admin', 'admin_finance')
  );
$$;

-- Create helper function to check if user has operations access
CREATE OR REPLACE FUNCTION public.has_operations_access(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = has_operations_access.user_id
      AND role IN ('admin', 'admin_operations')
  );
$$;

-- Create helper function to check if user has insights access (all admin roles can view)
CREATE OR REPLACE FUNCTION public.has_insights_access(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = has_insights_access.user_id
      AND role IN ('admin', 'admin_operations', 'admin_finance', 'admin_insights')
  );
$$;

-- RLS policies for financial_transactions
CREATE POLICY "Finance admins can view all transactions"
ON public.financial_transactions
FOR SELECT
USING (has_finance_access());

CREATE POLICY "Finance admins can insert transactions"
ON public.financial_transactions
FOR INSERT
WITH CHECK (has_finance_access());

CREATE POLICY "Finance admins can update transactions"
ON public.financial_transactions
FOR UPDATE
USING (has_finance_access());

-- Super admins can delete
CREATE POLICY "Only super admins can delete transactions"
ON public.financial_transactions
FOR DELETE
USING (is_admin());

-- Add trigger for updated_at
CREATE TRIGGER update_financial_transactions_updated_at
BEFORE UPDATE ON public.financial_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for faster queries
CREATE INDEX idx_financial_transactions_order_id ON public.financial_transactions(order_id);
CREATE INDEX idx_financial_transactions_created_at ON public.financial_transactions(created_at);
CREATE INDEX idx_financial_transactions_status ON public.financial_transactions(status);