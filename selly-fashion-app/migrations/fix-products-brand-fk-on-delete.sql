-- Fix products_brand_id_fkey to set NULL on brand deletion instead of restricting.
-- Run this in the Supabase SQL editor (or psql) once.

ALTER TABLE products
    DROP CONSTRAINT IF EXISTS products_brand_id_fkey;

ALTER TABLE products
    ADD CONSTRAINT products_brand_id_fkey
    FOREIGN KEY (brand_id)
    REFERENCES brands(id)
    ON DELETE SET NULL;
