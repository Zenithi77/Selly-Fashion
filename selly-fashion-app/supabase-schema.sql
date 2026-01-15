-- Supabase Database Schema for Selly Fashion

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Brands table
CREATE TABLE brands (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    logo_text VARCHAR(50),
    tagline VARCHAR(255),
    style VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clothing types/categories table
CREATE TABLE clothing_types (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    image_url TEXT,
    subcategories TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    clothing_type_id UUID REFERENCES clothing_types(id) ON DELETE SET NULL,
    sizes TEXT[],
    colors TEXT[],
    is_featured BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    avatar_url TEXT,
    phone VARCHAR(20),
    address TEXT,
    is_vip BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart items table
CREATE TABLE cart_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    size VARCHAR(20),
    color VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address TEXT,
    payment_method VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    size VARCHAR(20),
    color VARCHAR(50)
);

-- Wishlist table
CREATE TABLE wishlist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Newsletter subscribers
CREATE TABLE newsletter_subscribers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample brands
INSERT INTO brands (name, slug, description, logo_text, tagline, style) VALUES
('Lumina Collective', 'lumina', 'High-end evening wear inspired by starlight and the fluttering grace of butterflies.', 'LUMINA', 'High-End Silhouettes', 'italic'),
('Velvet & Vine', 'velvet', 'Sustainable fashion with a conscience. Crafts timeless pieces using organic materials.', 'VELVET', 'Organic Textiles', 'normal'),
('Aura Studio', 'aura', 'Minimalist streetwear that honors heritage through subtle patriotic detailing.', 'AURA', 'Modern Minimalism', 'underline'),
('Nova Fashion', 'nova', 'A limited edition collaboration featuring hand-painted butterfly motifs on luxury denim.', 'NOVA', 'Patriotic Flutter', 'italic');

-- Insert sample clothing types
INSERT INTO clothing_types (name, slug, description, icon, subcategories) VALUES
('Dresses', 'dresses', 'Elegant dresses for every occasion - from casual sundresses to glamorous evening gowns.', 'styler', ARRAY['Sundresses', 'Maxi Dresses', 'Cocktail Dresses', 'Evening Gowns']),
('Tops & Blouses', 'tops', 'Statement tops and elegant blouses featuring flutter sleeves and premium fabrics.', 'checkroom', ARRAY['Silk Blouses', 'Flutter-Sleeve', 'Basics', 'Statement Tops']),
('Outerwear', 'outerwear', 'Iconic jackets, blazers, and coats crafted with attention to detail.', 'dry_cleaning', ARRAY['Denim Jackets', 'Blazers', 'Coats', 'Cardigans']),
('Accessories', 'accessories', 'Complete your look with our curated selection of scarves, belts, and jewelry.', 'diamond', ARRAY['Scarves', 'Belts', 'Bags', 'Jewelry']),
('Footwear', 'footwear', 'Step out in style with our elegant footwear collection.', 'footprint', ARRAY['Heels', 'Flats', 'Boots', 'Sandals']);

-- Row Level Security (RLS) Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Cart policies
CREATE POLICY "Users can view own cart" ON cart_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into own cart" ON cart_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart" ON cart_items
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from own cart" ON cart_items
    FOR DELETE USING (auth.uid() = user_id);

-- Public read access for products, brands, and categories
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE clothing_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

CREATE POLICY "Brands are viewable by everyone" ON brands
    FOR SELECT USING (true);

CREATE POLICY "Clothing types are viewable by everyone" ON clothing_types
    FOR SELECT USING (true);
