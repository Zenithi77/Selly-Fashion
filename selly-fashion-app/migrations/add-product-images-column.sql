-- =====================================================================
-- Fix: products хүснэгтэд олон зураг хадгалах images TEXT[] багана нэмэх
-- =====================================================================
-- Шалтгаан: одоогоор зөвхөн нэг image_url хадгалдаг.
-- Үүнээс хойш images массивт олон зургийн URL хадгална, image_url нь
-- backward-compat-ын тулд эхний зурагтай адил байх болно.
-- =====================================================================

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Backfill: одоогийн image_url-уудыг images массив руу нэмэх
UPDATE public.products
SET images = ARRAY[image_url]
WHERE (images IS NULL OR array_length(images, 1) IS NULL)
  AND image_url IS NOT NULL
  AND image_url <> '';

-- PostgREST schema cache reload
NOTIFY pgrst, 'reload schema';
