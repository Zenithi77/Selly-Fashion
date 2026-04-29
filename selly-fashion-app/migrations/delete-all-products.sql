-- ⚠️ АНХААР: Энэ скрипт БҮХ бүтээгдэхүүн ба тэдгээртэй холбоотой өгөгдлийг устгана.
-- Supabase SQL Editor дээр ажиллуулна уу.

BEGIN;

-- 1) Хямдралд орсон бүтээгдэхүүний бүртгэлийг устгах (хэрэв ийм хүснэгт байгаа бол)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'sale_items'
  ) THEN
    EXECUTE 'DELETE FROM public.sale_items';
  END IF;
END $$;

-- 2) Захиалгын мөрүүдийг (order_items) устгах — бүтээгдэхүүний reference
DELETE FROM public.order_items;

-- 3) POS / нөөцийн хөдөлгөөн
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'stock_movements'
  ) THEN
    EXECUTE 'DELETE FROM public.stock_movements';
  END IF;
END $$;

-- 4) Wishlist / favorites (хэрэв байвал)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'wishlist'
  ) THEN
    EXECUTE 'DELETE FROM public.wishlist';
  END IF;
END $$;

-- 5) Bulk delivery items (хэрэв байвал)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'bulk_delivery_items'
  ) THEN
    EXECUTE 'DELETE FROM public.bulk_delivery_items';
  END IF;
END $$;

-- 6) Variants (CASCADE-аар автоматаар устгагдах ёстой ч ил тод устгая)
DELETE FROM public.product_variants;

-- 7) Бүтээгдэхүүн өөрөө
DELETE FROM public.products;

COMMIT;

-- Шалгалт:
-- SELECT COUNT(*) FROM public.products;
-- SELECT COUNT(*) FROM public.product_variants;
