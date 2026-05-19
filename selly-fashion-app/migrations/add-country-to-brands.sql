`-- Add country (origin) column to brands table so we can filter brands by country
ALTER TABLE brands ADD COLUMN IF NOT EXISTS country TEXT;

-- Optional index for filtering by country
CREATE INDEX IF NOT EXISTS idx_brands_country ON brands(country);
`