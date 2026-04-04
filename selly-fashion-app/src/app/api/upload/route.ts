import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Cloudinary тохиргоо
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'selly-fashion'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.' }, { status: 400 })
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 })
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    })

    return NextResponse.json({ 
      success: true, 
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

// URL-аас зураг upload хийх
export async function PUT(request: NextRequest) {
  try {
    const { url, folder = 'products' } = await request.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
    }

    // Only allow http/https URLs
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    // Upload directly from URL to Cloudinary
    const result = await cloudinary.uploader.upload(url, {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    })

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height
    })
  } catch (error) {
    console.error('URL upload error:', error)
    return NextResponse.json({ error: 'URL upload failed' }, { status: 500 })
  }
}

// Зураг устгах
export async function DELETE(request: NextRequest) {
  try {
    const { public_id } = await request.json()

    if (!public_id) {
      return NextResponse.json({ error: 'No public_id provided' }, { status: 400 })
    }

    const result = await cloudinary.uploader.destroy(public_id)

    return NextResponse.json({ 
      success: true, 
      result 
    })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
