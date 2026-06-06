-- ============================================================
-- FIX: QPay төлбөр батлагдахгүй (404 "Захиалга олдсонгүй") асуудал
-- ============================================================
-- Шалтгаан: orders хүснэгтэд payment_status / qpay_invoice_id зэрэг багана
-- дутуу байсан тул /api/payment/qpay/check дэх SELECT алдаа өгч 404 буцааж байв.
--
-- Энэ скриптийг Supabase → SQL Editor дээр БҮХЭЛД нь нэг удаа ажиллуулна.
-- Бүх мөр idempotent (IF NOT EXISTS) тул дахин ажиллуулахад аюулгүй.
-- ============================================================

-- 1) Төлбөрийн ерөнхий багана (add-payment-columns.sql)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'Pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_ref    TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_amount    DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_note   TEXT;

-- 2) QPay-ийн тусгай багана (add-qpay-columns.sql)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS qpay_invoice_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method  TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at         TIMESTAMPTZ;

-- 3) Индексүүд
CREATE INDEX IF NOT EXISTS idx_orders_payment_ref     ON orders(payment_ref);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status  ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_qpay_invoice_id ON orders(qpay_invoice_id);

-- 4) RLS policy: service role-д төлбөрийн статус шинэчлэхийг зөвшөөрнө
--    (PostgreSQL "CREATE POLICY IF NOT EXISTS"-ийг дэмждэггүй тул эхлээд устгана)
DROP POLICY IF EXISTS "Service role can update order payment status" ON orders;
CREATE POLICY "Service role can update order payment status" ON orders
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 5) Callback лог хүснэгт (add-qpay-callbacks-log.sql)
CREATE TABLE IF NOT EXISTS qpay_callbacks (
  id          BIGSERIAL PRIMARY KEY,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  method      TEXT,
  order_id    UUID,
  raw_order   TEXT,
  invoice_id  TEXT,
  query       JSONB,
  headers     JSONB,
  body        JSONB,
  body_raw    TEXT,
  ip          TEXT,
  user_agent  TEXT,
  status      TEXT,
  paid        BOOLEAN,
  total_paid  NUMERIC,
  error       TEXT
);

CREATE INDEX IF NOT EXISTS idx_qpay_callbacks_received_at ON qpay_callbacks(received_at DESC);
CREATE INDEX IF NOT EXISTS idx_qpay_callbacks_order_id    ON qpay_callbacks(order_id);
CREATE INDEX IF NOT EXISTS idx_qpay_callbacks_invoice_id  ON qpay_callbacks(invoice_id);

ALTER TABLE qpay_callbacks ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Шалгах: дараах query алдаагүй ажиллавал багана бүрэн нэмэгдсэн гэсэн үг
--   SELECT id, total_amount, qpay_invoice_id, payment_status, paid_amount, paid_at
--   FROM orders LIMIT 1;
-- ============================================================
