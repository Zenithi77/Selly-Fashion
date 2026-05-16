-- QPay invoice_id-г захиалга дээр хадгалах багана нэмнэ
ALTER TABLE orders ADD COLUMN IF NOT EXISTS qpay_invoice_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_orders_qpay_invoice_id ON orders(qpay_invoice_id);
