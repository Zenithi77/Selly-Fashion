-- Migration: backfill brand & clothing_types slugs that are NULL or empty
-- Reason: generateSlug() previously stripped Cyrillic characters, leaving slug = ''
-- Run in Supabase SQL Editor

-- Helper: Mongolian Cyrillic -> Latin transliteration via translate()
-- Note: PostgreSQL translate() works char-by-char (1:1).
-- For multi-char mappings (kh, ts, ch, sh, yu, ya, yo, ye) we do replace() first.

CREATE OR REPLACE FUNCTION mn_slugify(input TEXT) RETURNS TEXT AS $$
DECLARE
  s TEXT;
BEGIN
  s := lower(coalesce(input, ''));
  -- multi-letter substitutions first
  s := replace(s, 'х', 'kh');
  s := replace(s, 'ц', 'ts');
  s := replace(s, 'ч', 'ch');
  s := replace(s, 'ш', 'sh');
  s := replace(s, 'щ', 'sch');
  s := replace(s, 'ю', 'yu');
  s := replace(s, 'я', 'ya');
  s := replace(s, 'ё', 'yo');
  s := replace(s, 'е', 'ye');
  -- 1:1 char map for remaining cyrillic
  s := translate(s,
    'абвгдёжзийклмнопрстуүфъыьэөАБВГДЕЁЖЗИЙКЛМНОПРСТУҮФХЦЧШЩЪЫЬЭЮЯӨ',
    'abvgdyojziiklmnoprstuufiieo'
  );
  -- spaces -> dashes, drop everything else
  s := regexp_replace(s, '\s+', '-', 'g');
  s := regexp_replace(s, '[^a-z0-9-]', '', 'g');
  s := regexp_replace(s, '-+', '-', 'g');
  s := trim(both '-' from s);
  RETURN s;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Backfill brands
UPDATE brands
SET slug = COALESCE(NULLIF(mn_slugify(name), ''), 'brand-' || substr(id::text, 1, 8))
WHERE slug IS NULL OR trim(slug) = '';

-- Backfill clothing_types
UPDATE clothing_types
SET slug = COALESCE(NULLIF(mn_slugify(name), ''), 'category-' || substr(id::text, 1, 8))
WHERE slug IS NULL OR trim(slug) = '';

-- Backfill subcategories (if exists)
UPDATE subcategories
SET slug = COALESCE(NULLIF(mn_slugify(name), ''), 'subcategory-' || substr(id::text, 1, 8))
WHERE slug IS NULL OR trim(slug) = '';

-- Optional: enforce non-empty slug going forward
ALTER TABLE brands         ADD CONSTRAINT brands_slug_not_empty         CHECK (slug IS NOT NULL AND length(trim(slug)) > 0) NOT VALID;
ALTER TABLE clothing_types ADD CONSTRAINT clothing_types_slug_not_empty CHECK (slug IS NOT NULL AND length(trim(slug)) > 0) NOT VALID;

-- Verify
SELECT id, name, slug FROM brands ORDER BY name;
SELECT id, name, slug FROM clothing_types ORDER BY name;
