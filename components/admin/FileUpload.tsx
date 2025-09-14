"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, FileIcon, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

type UploadedFile = {
  id: string
  name: string
  url: string
  type: string
  size: number
}

type FileUploadProps = {
  onUpload?: (files: UploadedFile[]) => void
  maxFiles?: number
  acceptedTypes?: string[]
  maxSize?: number // in bytes
}

export default function FileUpload({
  onUpload,
  maxFiles = 5,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx'],
  maxSize = 10 * 1024 * 1024 // 10MB
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    setUploading(true)
    const newFiles: UploadedFile[] = []

    try {
      for (const file of acceptedFiles) {
        if (file.size > maxSize) {
          toast.error(`File ${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB`)
          continue
        }

        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }

        const result = await response.json()
        newFiles.push({
          id: result.id,
          name: file.name,
          url: result.url,
          type: file.type,
          size: file.size
        })
      }

      const updatedFiles = [...uploadedFiles, ...newFiles]
      setUploadedFiles(updatedFiles)
      onUpload?.(updatedFiles)
      
      if (newFiles.length > 0) {
        toast.success(`Successfully uploaded ${newFiles.length} file(s)`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload files')
    } finally {
      setUploading(false)
    }
  }, [maxSize, uploadedFiles, onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as Record<string, string[]>),
    maxFiles: maxFiles - uploadedFiles.length,
    disabled: uploading || uploadedFiles.length >= maxFiles
  })

  const removeFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/admin/upload/${fileId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        const updatedFiles = uploadedFiles.filter(f => f.id !== fileId)
        setUploadedFiles(updatedFiles)
        onUpload?.(updatedFiles)
        toast.success('File removed successfully')
      } else {
        throw new Error('Failed to delete file')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to remove file')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />
    }
    return <FileIcon className="h-8 w-8 text-gray-500" />
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${uploading || uploadedFiles.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-blue-600">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  Drag & drop files here, or click to select files
                </p>
                <p className="text-sm text-gray-500">
                  Maximum {maxFiles} files, up to {maxSize / 1024 / 1024}MB each
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supported: {acceptedTypes.join(', ')}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Uploaded Files ({uploadedFiles.length})</h3>
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-brand-600 hover:text-brand-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {uploading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Uploading files...</span>
          </div>
        </div>
      )}
    </div>
  )
}