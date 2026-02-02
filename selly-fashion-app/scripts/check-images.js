const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://bcixbjkyfmtsmjtvctza.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjaXhiamt5Zm10c21qdHZjdHphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3OTczMzYsImV4cCI6MjA4NDM3MzMzNn0.OcMpNIePsyIh46O1spqdLt4cHnGwyypgV6qRVR-rjGM'
);

async function checkImages() {
  console.log('🔍 Зургийн URL-уудыг шалгаж байна...\n');
  
  // Brands
  const { data: brands } = await supabase.from('brands').select('name, image_url');
  console.log('=== BRANDS ===');
  let supabaseCount = 0;
  let cloudinaryCount = 0;
  
  brands?.forEach(b => {
    const source = b.image_url?.includes('cloudinary') ? '☁️ CLOUDINARY' : 
                   b.image_url?.includes('supabase') ? '⚠️ SUPABASE' : 
                   b.image_url ? '🔗 OTHER' : '❌ NONE';
    console.log(`  ${b.name}: ${source}`);
    if (b.image_url?.includes('supabase')) supabaseCount++;
    if (b.image_url?.includes('cloudinary')) cloudinaryCount++;
  });
  
  // Products
  const { data: products } = await supabase.from('products').select('name, image_url');
  console.log('\n=== PRODUCTS ===');
  
  products?.forEach(p => {
    const source = p.image_url?.includes('cloudinary') ? '☁️ CLOUDINARY' : 
                   p.image_url?.includes('supabase') ? '⚠️ SUPABASE' : 
                   p.image_url ? '🔗 OTHER' : '❌ NONE';
    console.log(`  ${p.name}: ${source}`);
    if (p.image_url?.includes('supabase')) supabaseCount++;
    if (p.image_url?.includes('cloudinary')) cloudinaryCount++;
  });
  
  console.log('\n=== ДҮН ===');
  console.log(`☁️ Cloudinary: ${cloudinaryCount}`);
  console.log(`⚠️ Supabase Storage: ${supabaseCount}`);
  
  if (supabaseCount === 0) {
    console.log('\n✅ Бүх зураг Cloudinary руу шилжсэн!');
  } else {
    console.log('\n⚠️ Supabase Storage дээр зураг үлдсэн байна!');
  }
}

checkImages();
