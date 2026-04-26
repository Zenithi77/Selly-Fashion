-- =====================================================================
-- Migration: variants, bulk pricing, deliveries, sales/stock movements
-- =====================================================================
-- Энэ миграци нь дараах өөрчлөлтүүдийг хийнэ:
--   1) products: store_quantity, warehouse_quantity (delguur/aguulah)
--   2) products: bulk_min_quantity, bulk_price (багцын үнэ)
--   3) product_variants хүснэгт (size × color × delguur/aguulah)
--   4) orders: delivery_status, delivery_notes, delivery_courier
--   5) stock_movements хүснэгт (борлуулалт/хасалтын түүх)
-- =====================================================================

-- 1. PRODUCTS: Store / Warehouse split + Bulk pricing -----------------
ALTER TABLE products ADD COLUMN IF NOT EXISTS store_quantity INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS warehouse_quantity INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS bulk_min_quantity INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS bulk_price DECIMAL(10, 2);

-- Хуучин stock_quantity-г store+warehouse болгож шилжүүлнэ (анх удаа л ажиллана)
UPDATE products
SET store_quantity = COALESCE(stock_quantity, 0),
    warehouse_quantity = 0
WHERE store_quantity = 0 AND warehouse_quantity = 0 AND COALESCE(stock_quantity, 0) > 0;

-- 2. PRODUCT_VARIANTS хүснэгт -----------------------------------------
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size VARCHAR(50),
    color VARCHAR(100),
    barcode VARCHAR(100),
    store_quantity INTEGER DEFAULT 0,
    warehouse_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Нэг бүтээгдэхүүн дотор size+color давхцахгүй
    CONSTRAINT product_variants_unique UNIQUE (product_id, size, color)
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_barcode ON product_variants(barcode);

-- RLS: бүгд харах эрхтэй (хямдрал, бараа адил)
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Variants are viewable by everyone" ON product_variants;
CREATE POLICY "Variants are viewable by everyone" ON product_variants
    FOR SELECT USING (true);

-- 3. ORDERS: Хүргэлтийн дэлгэрэнгүй талбарууд ------------------------
-- status талбар нь VARCHAR(50) тул шинэ утгуудыг application талд нэмнэ.
-- Шинэ статусуудын жагсаалт (зөвлөмж):
--   pending, confirmed, processing, ready_for_pickup,
--   assigned_to_courier, picked_up, in_transit, out_for_delivery,
--   delivered, failed_delivery, returned, cancelled
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_status VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_courier VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_updated_at TIMESTAMP WITH TIME ZONE;

-- 4. STOCK_MOVEMENTS хүснэгт (POS борлуулалт / хасалтын түүх) --------
-- payment_method: 'cash' | 'bank' | 'personal_loan' | 'own_use'
-- reason:         'sale' | 'personal_use' | 'damaged' | 'lost' | 'return' | 'adjustment' | 'other'
-- source:         'store' | 'warehouse'
CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    source VARCHAR(20) DEFAULT 'store',
    payment_method VARCHAR(30) NOT NULL,
    reason VARCHAR(30) NOT NULL DEFAULT 'sale',
    unit_price DECIMAL(10, 2),
    total_amount DECIMAL(10, 2),
    note TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created ON stock_movements(created_at DESC);

ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view stock movements" ON stock_movements;
CREATE POLICY "Admins can view stock movements" ON stock_movements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
              AND (user_profiles.is_admin = true OR user_profiles.role = 'admin')
        )
    );
DROP POLICY IF EXISTS "Admins can insert stock movements" ON stock_movements;
CREATE POLICY "Admins can insert stock movements" ON stock_movements
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
              AND (user_profiles.is_admin = true OR user_profiles.role = 'admin')
        )
    );

-- =====================================================================
-- Дуусав. Supabase SQL editor дээр ажиллуулна уу.
-- =====================================================================
