"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import FileUpload from "@/components/admin/FileUpload"
import { Search, Download, Trash2, Eye, FileIcon, ImageIcon, AlertCircle, RefreshCw, Upload, Loader2, AlertTriangle } from "lucide-react"
import { AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import PageHeader from "@/components/admin/PageHeader"

type Upload = {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  createdAt: string
  user: {
    name: string | null
    email: string
  }
}

type PaginationInfo = {
  page: number
  limit: number
  total: number
  pages: number
}

export default function UploadsPage() {
  const [uploads, setUploads] = useState<Upload[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [deletingFile, setDeletingFile] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })
  const [showUploadForm, setShowUploadForm] = useState(false)

  const fetchUploads = async (page = 1, search = "") => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString()
      })
      
      if (search) {
        params.append('search', search)
      }

      const response = await fetch(`/api/admin/upload?${params}`)
      if (response.ok) {
        const data = await response.json()
        setUploads(data.uploads)
        setPagination(data.pagination)
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch uploads' }))
        setError(errorData.message || 'Failed to fetch uploads')
        toast.error(errorData.message || "Failed to fetch uploads")
      }
    } catch (error) {
      console.error("Fetch uploads error:", error)
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUploads()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUploads(1, searchTerm)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) {
      return
    }

    setDeletingFile(id)
    try {
      const response = await fetch(`/api/admin/upload/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success("File deleted successfully")
        fetchUploads(pagination.page, searchTerm)
      } else {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || 'Failed to delete file'
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error("Delete error:", error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete file'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setDeletingFile(null)
    }
  }

  const handleUploadComplete = () => {
    setShowUploadForm(false)
    fetchUploads(pagination.page, searchTerm)
    toast.success("Files uploaded successfully")
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />
    }
    return <FileIcon className="h-5 w-5 text-gray-500" />
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="File Uploads"
        description="Manage uploaded files and media assets"
        actions={(
          <Button onClick={() => setShowUploadForm(!showUploadForm)} className="bg-brand-600 hover:bg-brand-700">
            {showUploadForm ? "Cancel" : "Upload Files"}
          </Button>
        )}
      />

      {showUploadForm && (
        <Card>
          <CardHeader>
            <CardTitle>Upload New Files</CardTitle>
            <CardDescription>
              Upload images, documents, and other media files
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="flex items-center justify-between">
                  {error}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setError(null);
                      fetchUploads(pagination.page, searchTerm);
                    }}
                  >
                    Try again
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            <FileUpload onUpload={handleUploadComplete} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Uploads ({pagination.total})</CardTitle>
              <CardDescription>
                Browse and manage all uploaded files
              </CardDescription>
            </div>
            <Button
              onClick={() => fetchUploads(1, searchTerm)}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
              <Button type="submit">Search</Button>
            </div>
          </form>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : uploads.length === 0 ? (
            <div className="text-center py-12">
              <FileIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
              <p className="text-gray-500 mb-4">Upload some files to get started</p>
              <Button onClick={() => setShowUploadForm(true)}>Upload Files</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {uploads.map((upload) => (
                <div
                  key={upload.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    {getFileIcon(upload.mimeType)}
                    <div>
                      <h3 className="font-medium text-gray-900">{upload.filename}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{formatFileSize(upload.size)}</span>
                        <span>•</span>
                        <span>{upload.mimeType}</span>
                        <span>•</span>
                        <span>Uploaded by {upload.user.name || upload.user.email}</span>
                        <span>•</span>
                        <span>{formatDate(upload.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(upload.url, '_blank')}
                      disabled={deletingFile === upload.id}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement('a')
                        link.href = upload.url
                        link.download = upload.filename
                        link.click()
                      }}
                      disabled={deletingFile === upload.id}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(upload.id)}
                      className="text-brand-600 hover:text-brand-700"
                      disabled={deletingFile === upload.id}
                    >
                      {deletingFile === upload.id ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-1" />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} files
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchUploads(pagination.page - 1, searchTerm)}
                  disabled={pagination.page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchUploads(pagination.page + 1, searchTerm)}
                  disabled={pagination.page >= pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
