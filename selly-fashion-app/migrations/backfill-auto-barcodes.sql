-- Авто-баркодоор одоо байгаа барааг буцаан бөглөх (backfill)
-- Формат: YYMMNNNNN  (он 2 + сар 2 + тухайн сарын дараалал 5 орон)
-- Жишээ: 2026 оны 4 сарын 1 дэх бараа => 260400001

WITH numbered AS (
  SELECT
    id,
    to_char(created_at, 'YYMM')
      || lpad(
           (row_number() OVER (
             PARTITION BY date_trunc('month', created_at)
             ORDER BY created_at, id
           ))::text,
           5,
           '0'
         ) AS new_barcode
  FROM products
  WHERE barcode IS NULL OR btrim(barcode) = ''
)
UPDATE products p
SET barcode = n.new_barcode
FROM numbered n
WHERE p.id = n.id;

-- Хайлт хурдан байх индекс (хэрэв байхгүй бол)
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
