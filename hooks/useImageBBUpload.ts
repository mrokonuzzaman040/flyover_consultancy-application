import { useState } from 'react'
import { toast } from 'sonner'

type UploadedImage = {
  url: string
  name: string
  size: number
}

type UseImageBBUploadReturn = {
  uploading: boolean
  uploadImage: (file: File) => Promise<UploadedImage | null>
}

export function useImageBBUpload(): UseImageBBUploadReturn {
  const [uploading, setUploading] = useState(false)

  const uploadImage = async (file: File): Promise<UploadedImage | null> => {
    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_BB_API_KEY}`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload image to ImageBB')
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error?.message || 'Upload failed')
      }

      const uploadedImage: UploadedImage = {
        url: result.data.url,
        name: file.name,
        size: file.size
      }

      toast.success('Image uploaded successfully')
      return uploadedImage
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
      return null
    } finally {
      setUploading(false)
    }
  }

  return {
    uploading,
    uploadImage
  }
}