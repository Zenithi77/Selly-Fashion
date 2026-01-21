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
    image_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    featured_order INTEGER DEFAULT 0,
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
    is_featured BOOLEAN DEFAULT FALSE,
    featured_order INTEGER DEFAULT 0,
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
INSERT INTO brands (name, slug, description, logo_text, tagline, style, image_url, is_featured, featured_order) VALUES
('Lumina Collective', 'lumina', 'High-end evening wear inspired by starlight and the fluttering grace of butterflies.', 'LUMINA', 'HAUTE COUTURE', 'italic', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80', TRUE, 1),
('Velvet & Vine', 'velvet', 'Sustainable fashion with a conscience. Crafts timeless pieces using organic materials.', 'VELVET', 'SOFT LUXURY', 'normal', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80', TRUE, 2),
('Aura Studio', 'aura', 'Minimalist streetwear that honors heritage through subtle patriotic detailing.', 'AURA', 'MODERN MINIMAL', 'underline', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80', TRUE, 3),
('Nova Fashion', 'nova', 'A limited edition collaboration featuring hand-painted butterfly motifs on luxury denim.', 'NOVA', 'EXCLUSIVE DROP', 'italic', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80', TRUE, 4),
('Eclipse', 'eclipse', 'Bold and avant-garde designs for the fashion-forward individual.', 'ECLIPSE', 'AVANT-GARDE', 'normal', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80', TRUE, 5);

-- Insert sample clothing types
INSERT INTO clothing_types (name, slug, description, icon, image_url, subcategories, is_featured, featured_order) VALUES
('Dresses', 'dresses', 'Elegant dresses for every occasion - from casual sundresses to glamorous evening gowns.', 'styler', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80', ARRAY['Sundresses', 'Maxi Dresses', 'Cocktail Dresses', 'Evening Gowns'], TRUE, 1),
('Tops & Blouses', 'tops', 'Statement tops and elegant blouses featuring flutter sleeves and premium fabrics.', 'checkroom', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80', ARRAY['Silk Blouses', 'Flutter-Sleeve', 'Basics', 'Statement Tops'], TRUE, 2),
('Outerwear', 'outerwear', 'Iconic jackets, blazers, and coats crafted with attention to detail.', 'dry_cleaning', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80', ARRAY['Denim Jackets', 'Blazers', 'Coats', 'Cardigans'], TRUE, 3),
('Accessories', 'accessories', 'Complete your look with our curated selection of scarves, belts, and jewelry.', 'diamond', 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=80', ARRAY['Scarves', 'Belts', 'Bags', 'Jewelry'], TRUE, 4),
('Footwear', 'footwear', 'Step out in style with our elegant footwear collection.', 'footprint', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80', ARRAY['Heels', 'Flats', 'Boots', 'Sandals'], FALSE, 0);

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
