import { v2 as cloudinary } from 'cloudinary'

// Cloudinary тохиргоо
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

// Зургийн URL үүсгэх helper функцууд
export const getCloudinaryUrl = (publicId: string, options?: {
  width?: number
  height?: number
  crop?: 'fill' | 'fit' | 'scale' | 'thumb'
  quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | number
}) => {
  const transformations: string[] = []
  
  if (options?.width) transformations.push(`w_${options.width}`)
  if (options?.height) transformations.push(`h_${options.height}`)
  if (options?.crop) transformations.push(`c_${options.crop}`)
  if (options?.quality) transformations.push(`q_${options.quality}`)
  
  transformations.push('f_auto') // Автомат формат
  
  const transformation = transformations.join(',')
  
  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${transformation}/${publicId}`
}

// Thumbnail үүсгэх
export const getThumbnailUrl = (publicId: string, size: number = 150) => {
  return getCloudinaryUrl(publicId, {
    width: size,
    height: size,
    crop: 'thumb',
    quality: 'auto:good'
  })
}

// Product зурагны URL
export const getProductImageUrl = (publicId: string, width: number = 500) => {
  return getCloudinaryUrl(publicId, {
    width,
    crop: 'fit',
    quality: 'auto:good'
  })
}

// Upload функц (клиент талаас)
export const uploadToCloudinary = async (file: File, folder: string = 'selly-fashion') => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Upload failed')
  }

  return response.json()
}

// Зураг устгах функц (клиент талаас)
export const deleteFromCloudinary = async (publicId: string) => {
  const response = await fetch('/api/upload', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ public_id: publicId }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Delete failed')
  }

  return response.json()
}
