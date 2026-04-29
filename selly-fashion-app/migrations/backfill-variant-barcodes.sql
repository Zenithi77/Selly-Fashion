-- =====================================================================
-- Backfill: байгаа variant-ууд барайгүй бол үүсгэж өгнө
-- =====================================================================
-- Format: {productBarcode}{2-digit index} (жишээ: 26040000601, 26040000602...)
-- Зөвхөн NULL/хоосон барайтай variant-уудад үйлчилнэ.
-- Бараа барайгүй бол алгасна.
-- =====================================================================

WITH numbered AS (
  SELECT
    pv.id,
    p.barcode AS product_barcode,
    ROW_NUMBER() OVER (
      PARTITION BY pv.product_id
      ORDER BY pv.created_at NULLS LAST, pv.size NULLS LAST, pv.color NULLS LAST, pv.id
    ) AS idx
  FROM public.product_variants pv
  JOIN public.products p ON p.id = pv.product_id
  WHERE (pv.barcode IS NULL OR pv.barcode = '')
    AND p.barcode IS NOT NULL
    AND p.barcode <> ''
)
UPDATE public.product_variants pv
SET barcode = n.product_barcode || LPAD(n.idx::text, 2, '0')
FROM numbered n
WHERE pv.id = n.id;

-- Шалгалт
-- SELECT p.name, p.barcode AS product_bc, pv.size, pv.color, pv.barcode AS variant_bc
-- FROM public.product_variants pv
-- JOIN public.products p ON p.id = pv.product_id
-- ORDER BY p.name, pv.size, pv.color;

NOTIFY pgrst, 'reload schema';
