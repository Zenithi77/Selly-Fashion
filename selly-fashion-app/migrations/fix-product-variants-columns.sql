-- =====================================================================
-- Fix: product_variants хүснэгтэд дутуу баганууд нэмэх
-- =====================================================================
-- Алдаа: "Could not find the 'store_quantity' column of 'product_variants'"
-- Шалтгаан: Хуучин хувилбарын product_variants хүснэгт байсан тул
-- CREATE TABLE IF NOT EXISTS шинэ багана нэмээгүй.
-- =====================================================================

ALTER TABLE public.product_variants
  ADD COLUMN IF NOT EXISTS size VARCHAR(50);

ALTER TABLE public.product_variants
  ADD COLUMN IF NOT EXISTS color VARCHAR(100);

ALTER TABLE public.product_variants
  ADD COLUMN IF NOT EXISTS barcode VARCHAR(100);

ALTER TABLE public.product_variants
  ADD COLUMN IF NOT EXISTS store_quantity INTEGER DEFAULT 0;

ALTER TABLE public.product_variants
  ADD COLUMN IF NOT EXISTS warehouse_quantity INTEGER DEFAULT 0;

ALTER TABLE public.product_variants
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE public.product_variants
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- UNIQUE constraint (product_id, size, color) — байхгүй бол үүсгэнэ
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'product_variants_unique'
  ) THEN
    ALTER TABLE public.product_variants
      ADD CONSTRAINT product_variants_unique UNIQUE (product_id, size, color);
  END IF;
END $$;

-- Index-үүд
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_barcode ON public.product_variants(barcode);

-- PostgREST schema cache-ыг шинэчлэх (Supabase автоматаар хийдэг ч баталгаажуулахын тулд)
NOTIFY pgrst, 'reload schema';

-- Шалгалт: дараах query-г ажиллуулж бүх багана байгаа эсэхийг шалга
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'product_variants'
-- ORDER BY ordinal_position;
