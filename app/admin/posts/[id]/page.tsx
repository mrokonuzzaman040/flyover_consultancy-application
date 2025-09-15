"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  contentMD: string
  tags: string[]
  country: string[]
  author: string
  coverUrl?: string
  publishedAt?: string
  status: string
  createdAt: string
}

export default function ViewPostPage() {
  const router = useRouter()
  const params = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchPost()
    }
  }, [params.id])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/admin/posts/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
      } else {
        toast.error('Failed to fetch post')
        router.push('/admin/posts')
      }
    } catch  {
      toast.error('Error fetching post')
      router.push('/admin/posts')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800"
      case "draft": return "bg-yellow-100 text-yellow-800"
      case "archived": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleDelete = async () => {
    if (!post || !confirm(`Are you sure you want to delete "${post.title}"? This action cannot be undone.`)) {
      return
    }

    setDeleteLoading(true)
    try {
      const response = await fetch(`/api/admin/posts/${post.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Post deleted successfully')
        router.push('/admin/posts')
      } else {
        toast.error('Failed to delete post')
      }
    } catch {
      toast.error('Error deleting post')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h2>
          <p className="text-gray-600 mb-4">The post you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/admin/posts')}>Back to Posts</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">View Post</h1>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/admin/posts/${post.id}/edit`)}
            className="bg-brand-600 hover:bg-brand-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleteLoading}
            variant="destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-medium">Title</Label>
              <p className="text-gray-700 mt-1">{post.title}</p>
            </div>
            <div>
              <Label className="font-medium">Slug</Label>
              <p className="text-gray-700 mt-1">{post.slug}</p>
            </div>
          </div>

          {post.excerpt && (
            <div>
              <Label className="font-medium">Excerpt</Label>
              <p className="text-gray-700 mt-1">{post.excerpt}</p>
            </div>
          )}

          <div>
            <Label className="font-medium">Content</Label>
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto mt-1">
              <pre className="whitespace-pre-wrap text-sm">{post.contentMD}</pre>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-medium">Tags</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {post.tags.length > 0 ? (
                  post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No tags</p>
                )}
              </div>
            </div>
            <div>
              <Label className="font-medium">Countries</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {post.country.length > 0 ? (
                  post.country.map((country, index) => (
                    <Badge key={index} variant="outline">{country}</Badge>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No countries</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="font-medium">Author</Label>
              <p className="text-gray-700 mt-1">{post.author}</p>
            </div>
            <div>
              <Label className="font-medium">Status</Label>
              <div className="mt-1">
                <Badge className={getStatusColor(post.status)}>
                  {post.status}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="font-medium">Created</Label>
              <p className="text-gray-700 mt-1">{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {post.publishedAt && (
            <div>
              <Label className="font-medium">Published At</Label>
              <p className="text-gray-700 mt-1">{new Date(post.publishedAt).toLocaleDateString()}</p>
            </div>
          )}

          {post.coverUrl && (
            <div>
              <Label className="font-medium">Cover Image</Label>
              <div className="mt-1">
                <Image 
                  src={post.coverUrl} 
                  alt="Cover" 
                  className="max-w-full h-48 object-cover rounded-lg border" 
                  width={192}
                  height={192}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
