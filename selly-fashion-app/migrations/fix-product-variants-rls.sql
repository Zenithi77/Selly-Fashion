-- ============================================================
-- product_variants хүснэгтэд INSERT / UPDATE / DELETE policy нэмэх
-- ============================================================
-- Шалтгаан: одоогоор зөвхөн SELECT policy байгаа тул anon key-ээр
-- (жишээ нь Vercel дээр SUPABASE_SERVICE_ROLE_KEY тохируулаагүй үед)
-- variant insert хийгдэхгүй байсан.
--
-- Хэрэв SUPABASE_SERVICE_ROLE_KEY-г Vercel-д тохируулсан бол
-- service role нь RLS-ийг шууд bypass хийдэг тул энэ migration
-- хатуу шаардлагагүй ч, аюулгүйн үүднээс ажиллуулсан нь дээр.
-- ============================================================

-- Эх хүснэгт RLS-тэй гэдгийг баталгаажуулна
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Бүгд харах эрхтэй (давтан үүсгэхэд алдаа гарахгүй)
DROP POLICY IF EXISTS "Variants are viewable by everyone" ON public.product_variants;
CREATE POLICY "Variants are viewable by everyone"
  ON public.product_variants
  FOR SELECT USING (true);

-- INSERT: нэвтэрсэн хэрэглэгч (admin app), service role хоёулаа боломжтой.
-- (Production-д үнэхээр хатуу шалгах бол admin-only check нэмж болно.)
DROP POLICY IF EXISTS "Variants insert allowed" ON public.product_variants;
CREATE POLICY "Variants insert allowed"
  ON public.product_variants
  FOR INSERT
  WITH CHECK (true);

-- UPDATE
DROP POLICY IF EXISTS "Variants update allowed" ON public.product_variants;
CREATE POLICY "Variants update allowed"
  ON public.product_variants
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- DELETE
DROP POLICY IF EXISTS "Variants delete allowed" ON public.product_variants;
CREATE POLICY "Variants delete allowed"
  ON public.product_variants
  FOR DELETE
  USING (true);

-- Шалгалт:
-- SELECT polname, polcmd FROM pg_policy
--   WHERE polrelid = 'public.product_variants'::regclass;
