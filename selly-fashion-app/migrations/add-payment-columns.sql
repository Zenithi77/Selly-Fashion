-- Add payment columns to orders table
-- Run this migration in Supabase SQL Editor

ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'Pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_ref TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_amount DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_note TEXT;

-- Add index for faster payment reference lookup
CREATE INDEX IF NOT EXISTS idx_orders_payment_ref ON orders(payment_ref);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- Update RLS policies to allow payment status updates
-- (assuming you have RLS enabled)

-- Allow service role to update payment status
CREATE POLICY IF NOT EXISTS "Service role can update order payment status" ON orders
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

COMMENT ON COLUMN orders.payment_status IS 'Payment status: Pending, Paid, Failed, Refunded';
COMMENT ON COLUMN orders.payment_ref IS 'Unique payment reference for bank transfer matching (e.g., TK-12345)';
COMMENT ON COLUMN orders.paid_amount IS 'Actual amount received from payment';
COMMENT ON COLUMN orders.payment_note IS 'Payment notes from SMS or manual input';
