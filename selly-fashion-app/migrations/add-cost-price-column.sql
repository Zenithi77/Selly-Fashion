-- Add cost_price column to products table
-- This stores the wholesale/base price (urtug une) that the product was purchased for
-- This should only be visible to admin, not to customers
ALTER TABLE products ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10, 2);
