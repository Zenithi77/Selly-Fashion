// Supabase Storage-аас Cloudinary руу зураг шилжүүлэх скрипт
// Ажиллуулах: npx ts-node --skip-project scripts/migrate-to-cloudinary.ts

import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'

// Тохиргоо
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || ''
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || ''
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || ''

// Cloudinary тохиргоо
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
})

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

interface MigrationResult {
  oldUrl: string
  newUrl: string
  publicId: string
  table: string
  id: string
}

// Supabase storage URL-ийг шалгах
const isSupabaseStorageUrl = (url: string): boolean => {
  if (!url) return false
  return url.includes('supabase.co/storage') || url.includes(SUPABASE_URL)
}

// Cloudinary руу upload хийх
const uploadToCloudinary = async (url: string, folder: string): Promise<{ url: string; publicId: string } | null> => {
  try {
    const result = await cloudinary.uploader.upload(url, {
      folder: `selly-fashion/${folder}`,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    })
    return {
      url: result.secure_url,
      publicId: result.public_id
    }
  } catch (error) {
    console.error(`Upload error for ${url}:`, error)
    return null
  }
}

// Brands хүснэгтийн зургуудыг шилжүүлэх
const migrateBrandImages = async (): Promise<MigrationResult[]> => {
  console.log('\n📦 Brands зургуудыг шилжүүлж байна...')
  const results: MigrationResult[] = []

  const { data: brands, error } = await supabase
    .from('brands')
    .select('id, name, image_url')

  if (error) {
    console.error('Brands fetch error:', error)
    return results
  }

  for (const brand of brands || []) {
    if (isSupabaseStorageUrl(brand.image_url)) {
      console.log(`  → ${brand.name} зургийг шилжүүлж байна...`)
      const uploaded = await uploadToCloudinary(brand.image_url, 'brands')
      
      if (uploaded) {
        // Database-д шинэ URL-ийг хадгалах
        const { error: updateError } = await supabase
          .from('brands')
          .update({ image_url: uploaded.url })
          .eq('id', brand.id)

        if (!updateError) {
          results.push({
            oldUrl: brand.image_url,
            newUrl: uploaded.url,
            publicId: uploaded.publicId,
            table: 'brands',
            id: brand.id
          })
          console.log(`    ✅ ${brand.name} амжилттай шилжүүллээ`)
        } else {
          console.log(`    ❌ ${brand.name} шинэчлэх алдаа:`, updateError)
        }
      }
    }
  }

  return results
}

// Clothing types хүснэгтийн зургуудыг шилжүүлэх
const migrateClothingTypeImages = async (): Promise<MigrationResult[]> => {
  console.log('\n👗 Clothing Types зургуудыг шилжүүлж байна...')
  const results: MigrationResult[] = []

  const { data: types, error } = await supabase
    .from('clothing_types')
    .select('id, name, image_url')

  if (error) {
    console.error('Clothing types fetch error:', error)
    return results
  }

  for (const type of types || []) {
    if (isSupabaseStorageUrl(type.image_url)) {
      console.log(`  → ${type.name} зургийг шилжүүлж байна...`)
      const uploaded = await uploadToCloudinary(type.image_url, 'categories')
      
      if (uploaded) {
        const { error: updateError } = await supabase
          .from('clothing_types')
          .update({ image_url: uploaded.url })
          .eq('id', type.id)

        if (!updateError) {
          results.push({
            oldUrl: type.image_url,
            newUrl: uploaded.url,
            publicId: uploaded.publicId,
            table: 'clothing_types',
            id: type.id
          })
          console.log(`    ✅ ${type.name} амжилттай шилжүүллээ`)
        } else {
          console.log(`    ❌ ${type.name} шинэчлэх алдаа:`, updateError)
        }
      }
    }
  }

  return results
}

// Products хүснэгтийн зургуудыг шилжүүлэх
const migrateProductImages = async (): Promise<MigrationResult[]> => {
  console.log('\n🛍️ Products зургуудыг шилжүүлж байна...')
  const results: MigrationResult[] = []

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, image_url')

  if (error) {
    console.error('Products fetch error:', error)
    return results
  }

  for (const product of products || []) {
    if (isSupabaseStorageUrl(product.image_url)) {
      console.log(`  → ${product.name} зургийг шилжүүлж байна...`)
      const uploaded = await uploadToCloudinary(product.image_url, 'products')
      
      if (uploaded) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ image_url: uploaded.url })
          .eq('id', product.id)

        if (!updateError) {
          results.push({
            oldUrl: product.image_url,
            newUrl: uploaded.url,
            publicId: uploaded.publicId,
            table: 'products',
            id: product.id
          })
          console.log(`    ✅ ${product.name} амжилттай шилжүүллээ`)
        } else {
          console.log(`    ❌ ${product.name} шинэчлэх алдаа:`, updateError)
        }
      }
    }
  }

  return results
}

// User profiles-ийн avatar зургуудыг шилжүүлэх
const migrateUserAvatars = async (): Promise<MigrationResult[]> => {
  console.log('\n👤 User avatars зургуудыг шилжүүлж байна...')
  const results: MigrationResult[] = []

  const { data: users, error } = await supabase
    .from('user_profiles')
    .select('id, full_name, avatar_url')

  if (error) {
    console.error('User profiles fetch error:', error)
    return results
  }

  for (const user of users || []) {
    if (isSupabaseStorageUrl(user.avatar_url)) {
      console.log(`  → ${user.full_name || user.id} avatar шилжүүлж байна...`)
      const uploaded = await uploadToCloudinary(user.avatar_url, 'avatars')
      
      if (uploaded) {
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ avatar_url: uploaded.url })
          .eq('id', user.id)

        if (!updateError) {
          results.push({
            oldUrl: user.avatar_url,
            newUrl: uploaded.url,
            publicId: uploaded.publicId,
            table: 'user_profiles',
            id: user.id
          })
          console.log(`    ✅ ${user.full_name || user.id} амжилттай шилжүүллээ`)
        } else {
          console.log(`    ❌ ${user.full_name || user.id} шинэчлэх алдаа:`, updateError)
        }
      }
    }
  }

  return results
}

// Үндсэн функц
const main = async () => {
  console.log('🚀 Supabase Storage → Cloudinary шилжүүлэлт эхэллээ...')
  console.log('=' .repeat(50))

  const allResults: MigrationResult[] = []

  // Бүх хүснэгтүүдийн зургуудыг шилжүүлэх
  const brandResults = await migrateBrandImages()
  allResults.push(...brandResults)

  const typeResults = await migrateClothingTypeImages()
  allResults.push(...typeResults)

  const productResults = await migrateProductImages()
  allResults.push(...productResults)

  const userResults = await migrateUserAvatars()
  allResults.push(...userResults)

  // Үр дүнг хэвлэх
  console.log('\n' + '=' .repeat(50))
  console.log('📊 ШИЛЖҮҮЛЭЛТИЙН ҮР ДҮН:')
  console.log('=' .repeat(50))
  console.log(`✅ Нийт шилжүүлсэн: ${allResults.length} зураг`)
  console.log(`   - Brands: ${brandResults.length}`)
  console.log(`   - Clothing Types: ${typeResults.length}`)
  console.log(`   - Products: ${productResults.length}`)
  console.log(`   - User Avatars: ${userResults.length}`)

  if (allResults.length > 0) {
    console.log('\n📝 Дэлгэрэнгүй:')
    allResults.forEach((r, i) => {
      console.log(`${i + 1}. [${r.table}] ${r.id}`)
      console.log(`   Old: ${r.oldUrl}`)
      console.log(`   New: ${r.newUrl}`)
    })
  }

  console.log('\n✨ Шилжүүлэлт дууслаа!')
}

main().catch(console.error)
