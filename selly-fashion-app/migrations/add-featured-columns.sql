-- Migration: Add featured columns to brands and clothing_types tables
-- Run this SQL in your Supabase SQL Editor

-- Add new columns to brands table
ALTER TABLE brands ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 0;

-- Add new columns to clothing_types table
ALTER TABLE clothing_types ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE clothing_types ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 0;

-- Update existing brands with featured settings and images
UPDATE brands SET 
    image_url = 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
    is_featured = TRUE,
    featured_order = 1,
    tagline = 'HAUTE COUTURE'
WHERE slug = 'lumina';

UPDATE brands SET 
    image_url = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    is_featured = TRUE,
    featured_order = 2,
    tagline = 'SOFT LUXURY'
WHERE slug = 'velvet';

UPDATE brands SET 
    image_url = 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80',
    is_featured = TRUE,
    featured_order = 3,
    tagline = 'MODERN MINIMAL'
WHERE slug = 'aura';

UPDATE brands SET 
    image_url = 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80',
    is_featured = TRUE,
    featured_order = 4,
    tagline = 'EXCLUSIVE DROP'
WHERE slug = 'nova';

-- Insert a 5th brand if it doesn't exist
INSERT INTO brands (name, slug, description, logo_text, tagline, style, image_url, is_featured, featured_order)
SELECT 'Eclipse', 'eclipse', 'Bold and avant-garde designs for the fashion-forward individual.', 'ECLIPSE', 'AVANT-GARDE', 'normal', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80', TRUE, 5
WHERE NOT EXISTS (SELECT 1 FROM brands WHERE slug = 'eclipse');

-- Update existing categories with featured settings and images
UPDATE clothing_types SET 
    image_url = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
    is_featured = TRUE,
    featured_order = 1
WHERE slug = 'dresses';

UPDATE clothing_types SET 
    image_url = 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
    is_featured = TRUE,
    featured_order = 2
WHERE slug = 'tops';

UPDATE clothing_types SET 
    image_url = 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
    is_featured = TRUE,
    featured_order = 3
WHERE slug = 'outerwear';

UPDATE clothing_types SET 
    image_url = 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=80',
    is_featured = TRUE,
    featured_order = 4
WHERE slug = 'accessories';

-- Grant insert/update/delete permissions for authenticated users (for admin operations)
CREATE POLICY "Admins can manage brands" ON brands
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admins can manage categories" ON clothing_types
    FOR ALL USING (true) WITH CHECK (true);
