"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { X, ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import Image from "next/image"
import { useImageBBUpload } from "@/hooks/useImageBBUpload"

type UploadedImage = {
  url: string
  name: string
  size: number
}

type ImageBBUploadProps = {
  onUpload?: (image: UploadedImage) => void
  onRemove?: () => void
  currentImage?: string
  maxSize?: number // in bytes
  className?: string
  label?: string
  required?: boolean
}

export default function ImageBBUpload({
  onUpload,
  onRemove,
  currentImage,
  maxSize = 5 * 1024 * 1024, // 5MB
  className = "",
  label = "Image",
  required = false
}: ImageBBUploadProps) {
  const { uploading, uploadImage } = useImageBBUpload()
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    
    if (file.size > maxSize) {
      toast.error(`Image is too large. Maximum size is ${maxSize / 1024 / 1024}MB`)
      return
    }
    
    const result = await uploadImage(file)
    if (result) {
      setPreviewUrl(result.url)
      onUpload?.(result)
    }
  }, [maxSize, onUpload, uploadImage])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: uploading
  })

  const handleRemove = () => {
    setPreviewUrl(null)
    onRemove?.()
    toast.success('Image removed')
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {previewUrl ? (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={previewUrl}
                  alt="Uploaded image"
                  fill
                  className="object-cover"
                  onError={() => {
                    setPreviewUrl(null)
                    toast.error('Failed to load image')
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Image uploaded successfully
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Click to upload a different image
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} />
              {uploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="mx-auto h-8 w-8 text-blue-600 animate-spin mb-3" />
                  <p className="text-blue-600 font-medium">Uploading image...</p>
                  <p className="text-xs text-gray-500 mt-1">Please wait</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                  {isDragActive ? (
                    <p className="text-blue-600 font-medium">Drop the image here...</p>
                  ) : (
                    <div>
                      <p className="text-gray-600 font-medium mb-1">
                        Drag & drop an image here, or click to select
                      </p>
                      <p className="text-xs text-gray-500">
                        Maximum {maxSize / 1024 / 1024}MB • JPG, PNG, GIF, WebP
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}