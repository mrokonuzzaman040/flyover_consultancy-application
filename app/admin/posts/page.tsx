"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit, Eye, Plus, Search, Filter } from "lucide-react"
import { toast } from "sonner"
import PageHeader from "@/components/admin/PageHeader"
import DataTable from "@/components/admin/DataTable"
import ListToolbar from "@/components/admin/ListToolbar"
import EmptyState from "@/components/admin/EmptyState"

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

export default function AdminPostsPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || data)
      } else {
        toast.error('Failed to fetch posts')
      }
    } catch {
      toast.error('Error fetching posts')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (post: Post) => {
    if (!confirm(`Are you sure you want to delete "${post.title}"? This action cannot be undone.`)) {
      return
    }

    setDeleteLoading(post.id)
    try {
      const response = await fetch(`/api/admin/posts/${post.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Post deleted successfully')
        fetchPosts() // Refresh the list
      } else {
        toast.error('Failed to delete post')
      }
    } catch {
      toast.error('Error deleting post')
    } finally {
      setDeleteLoading(null)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || post.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800"
      case "draft": return "bg-yellow-100 text-yellow-800"
      case "archived": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Posts Management"
        description="Write and publish blog posts"
        actions={(
          <Button 
            onClick={() => router.push('/admin/posts/create')}
            className="bg-brand-600 hover:bg-brand-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        )}
      />

      {/* Filters */}
      <ListToolbar
        search={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search posts..."
      >
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </ListToolbar>

      {filteredPosts.length === 0 ? (
        <EmptyState
          title="No posts found"
          description={searchTerm || statusFilter !== "all" ? "Try adjusting your search or filters." : "Get started by creating your first post."}
          action={
            !searchTerm && statusFilter === "all" ? (
              <Button onClick={() => router.push('/admin/posts/create')} className="bg-brand-600 hover:bg-brand-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            ) : null
          }
        />
      ) : (
        <DataTable
          columns={[
            { key: 'title', header: 'Title', render: (p: Post) => (
              <div>
                <div className="font-medium text-slate-900 line-clamp-1">{p.title}</div>
                {p.excerpt && <div className="text-xs text-slate-500 line-clamp-1">{p.excerpt}</div>}
              </div>
            ) },
            { key: 'author', header: 'Author', hideOn: 'sm', render: (p: Post) => <span className="text-slate-600">{p.author}</span> },
            { key: 'status', header: 'Status', hideOn: 'md', render: (p: Post) => <Badge className={getStatusColor(p.status)}>{p.status}</Badge> },
            { key: 'createdAt', header: 'Created', hideOn: 'lg', render: (p: Post) => new Date(p.createdAt).toLocaleDateString() },
            { key: 'actions', header: 'Actions', headerClassName: 'text-right', cellClassName: 'text-right', render: (p: Post) => (
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => router.push(`/admin/posts/${p.id}`)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => router.push(`/admin/posts/${p.id}/edit`)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(p)} disabled={deleteLoading === p.id} className="text-brand-600 hover:text-brand-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ) },
          ]}
          data={filteredPosts}
          rowKey={(p) => p.id}
        />
      )}
    </div>
  )
}
