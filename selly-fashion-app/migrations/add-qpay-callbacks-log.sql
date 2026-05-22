-- QPay-аас ирсэн callback бүрийг лог болгон хадгалах хүснэгт
-- Зорилго: "callback ирсэн эсэхийг" дараа нь шалгах боломжтой болгох.

CREATE TABLE IF NOT EXISTS qpay_callbacks (
  id          BIGSERIAL PRIMARY KEY,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  method      TEXT,                -- GET / POST
  order_id    UUID,                -- query string-ийн order_id (UUID хэлбэртэй бол)
  raw_order   TEXT,                -- хэрвээ order_id UUID биш бол raw string
  invoice_id  TEXT,                -- orders.qpay_invoice_id
  query       JSONB,               -- бүх query params
  headers     JSONB,               -- request headers (ip, user-agent гэх мэт)
  body        JSONB,               -- POST body (хэрэв json бол)
  body_raw    TEXT,                -- json parse fail болсон үед raw text
  ip          TEXT,                -- x-forwarded-for-аас
  user_agent  TEXT,
  status      TEXT,                -- 'ok' | 'error' | 'not_found' | 'rls_fail' гм
  paid        BOOLEAN,             -- QPay check-ийн дараа төлөгдсөн эсэх
  total_paid  NUMERIC,
  error       TEXT
);

CREATE INDEX IF NOT EXISTS idx_qpay_callbacks_received_at ON qpay_callbacks(received_at DESC);
CREATE INDEX IF NOT EXISTS idx_qpay_callbacks_order_id    ON qpay_callbacks(order_id);
CREATE INDEX IF NOT EXISTS idx_qpay_callbacks_invoice_id  ON qpay_callbacks(invoice_id);

-- RLS: service role л бичих/унших ёстой
ALTER TABLE qpay_callbacks ENABLE ROW LEVEL SECURITY;

-- (Хүсвэл админд харуулах policy энд нэмж болно. Default-аар service role bypass хийдэг.)
