-- Subcategories хүснэгт үүсгэх
-- Энэ SQL-ийг Supabase SQL Editor дээр ажиллуулна уу

-- 1. Subcategories хүснэгт үүсгэх
CREATE TABLE IF NOT EXISTS subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  clothing_type_id UUID REFERENCES clothing_types(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Products хүснэгтэд subcategory_id нэмэх
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL;

-- 3. Index үүсгэх
CREATE INDEX IF NOT EXISTS idx_subcategories_clothing_type_id ON subcategories(clothing_type_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory_id ON products(subcategory_id);

-- 4. RLS идэвхжүүлэх
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

-- 5. Бүх хэрэглэгч унших эрхтэй
CREATE POLICY "Subcategories are viewable by everyone" ON subcategories
  FOR SELECT USING (true);

-- 6. Admin хэрэглэгч бүх үйлдэл хийх эрхтэй (brands, clothing_types-тэй адил)
CREATE POLICY "Admins can manage subcategories" ON subcategories
  FOR ALL USING (true) WITH CHECK (true);

-- 7. Жишээ дэд ангилалууд нэмэх (clothing_type_id-г өөрийн database-ийн ID-аар солино уу)
-- Эхлээд clothing_types хүснэгтээс ID-уудыг аваад доорх INSERT-д оруулна

-- Дээд хувцас дэд ангилалууд
-- INSERT INTO subcategories (name, slug, clothing_type_id, display_order) VALUES
-- ('Цамц', 't-shirts', 'YOUR_TOPS_ID', 1),
-- ('Блууз', 'blouses', 'YOUR_TOPS_ID', 2),
-- ('Свитер', 'sweaters', 'YOUR_TOPS_ID', 3),
-- ('Хүрэм', 'coats', 'YOUR_TOPS_ID', 4);

-- Доод хувцас дэд ангилалууд  
-- INSERT INTO subcategories (name, slug, clothing_type_id, display_order) VALUES
-- ('Жинс', 'jeans', 'YOUR_BOTTOMS_ID', 1),
-- ('Юбка', 'skirts', 'YOUR_BOTTOMS_ID', 2),
-- ('Шорт', 'shorts', 'YOUR_BOTTOMS_ID', 3),
-- ('Өмд', 'pants', 'YOUR_BOTTOMS_ID', 4);
