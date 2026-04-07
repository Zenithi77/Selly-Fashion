-- Add country (origin) column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS country TEXT;

-- Create index for country filtering
CREATE INDEX IF NOT EXISTS idx_products_country ON products(country);
