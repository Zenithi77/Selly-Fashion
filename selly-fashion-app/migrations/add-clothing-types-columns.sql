-- clothing_types хүснэгтэд дутуу баганууд нэмэх

-- image_url багана нэмэх
ALTER TABLE clothing_types 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- is_featured багана нэмэх (хэрэв байхгүй бол)
ALTER TABLE clothing_types 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- featured_order багана нэмэх (хэрэв байхгүй бол)
ALTER TABLE clothing_types 
ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 0;
