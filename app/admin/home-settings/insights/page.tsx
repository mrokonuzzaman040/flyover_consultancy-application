"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import DataTable from "@/components/admin/DataTable"
import ListToolbar from "@/components/admin/ListToolbar"
import PageHeader from "@/components/admin/PageHeader"
import EmptyState from "@/components/admin/EmptyState"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Eye, Star } from "lucide-react"

interface Insight {
  _id: string
  id: number
  category: string
  categoryColor?: string
  author: string
  authorRole?: string
  readTime: string
  publishedAt: string
  title: string
  excerpt: string
  content: string
  image: string
  featured?: boolean
  views?: number
  likes?: number
  tags: string[]
  slug?: string
  createdAt: string
  updatedAt: string
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null)
  
  // Form data
  const [formData, setFormData] = useState({
    category: "",
    categoryColor: "bg-blue-100 text-blue-800",
    author: "",
    authorRole: "",
    readTime: "",
    publishDate: "",
    title: "",
    excerpt: "",
    content: "",
    image: "",
    featured: false,
    views: "0",
    likes: "0",
    tags: [] as string[]
  })

  useEffect(() => {
    fetchInsights()
  }, [])

  const fetchInsights = async () => {
    try {
      const response = await fetch('/api/admin/insights')
      if (response.ok) {
        const data = await response.json()
        setInsights(data.insights)
      } else {
        toast.error('Failed to fetch insights')
      }
    } catch (error) {
      console.error('Error fetching insights:', error)
      toast.error('Failed to fetch insights')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/admin/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        toast.success('Insight created successfully')
        setShowCreateModal(false)
        resetForm()
        fetchInsights()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create insight')
      }
    } catch (error) {
      console.error('Error creating insight:', error)
      toast.error('Failed to create insight')
    }
  }

  const handleUpdate = async () => {
    if (!selectedInsight) return
    
    try {
      const response = await fetch('/api/admin/insights', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedInsight.id, ...formData })
      })
      
      if (response.ok) {
        toast.success('Insight updated successfully')
        setShowEditModal(false)
        resetForm()
        fetchInsights()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update insight')
      }
    } catch (error) {
      console.error('Error updating insight:', error)
      toast.error('Failed to update insight')
    }
  }

  const handleDelete = async () => {
    if (!selectedInsight) return
    
    setDeleteLoading(selectedInsight._id)
    try {
      const response = await fetch(`/api/admin/insights?id=${selectedInsight.id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        toast.success('Insight deleted successfully')
        setShowDeleteModal(false)
        fetchInsights()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete insight')
      }
    } catch (error) {
      console.error('Error deleting insight:', error)
      toast.error('Failed to delete insight')
    } finally {
      setDeleteLoading(null)
    }
  }

  const resetForm = () => {
    setFormData({
      category: "",
      categoryColor: "bg-blue-100 text-blue-800",
      author: "",
      authorRole: "",
      readTime: "",
      publishDate: "",
      title: "",
      excerpt: "",
      content: "",
      image: "",
      featured: false,
      views: "0",
      likes: "0",
      tags: []
    })
    setSelectedInsight(null)
  }

  const openCreateModal = () => {
    resetForm()
    setShowCreateModal(true)
  }

  const openEditModal = (insight: Insight) => {
    setSelectedInsight(insight)
    setFormData({
      category: insight.category,
      categoryColor: insight.categoryColor || "bg-blue-100 text-blue-800",
      author: insight.author,
      authorRole: insight.authorRole || "",
      readTime: insight.readTime,
      publishDate: insight.publishedAt,
      title: insight.title,
      excerpt: insight.excerpt,
      content: insight.content,
      image: insight.image,
      featured: insight.featured || false,
      views: insight.views?.toString() || "0",
      likes: insight.likes?.toString() || "0",
      tags: insight.tags || []
    })
    setShowEditModal(true)
  }

  const openViewModal = (insight: Insight) => {
    setSelectedInsight(insight)
    setShowViewModal(true)
  }

  const openDeleteModal = (insight: Insight) => {
    setSelectedInsight(insight)
    setShowDeleteModal(true)
  }

  // Filter insights
  const filteredInsights = insights.filter(insight => {
    const matchesSearch = insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insight.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insight.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || insight.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const columns = [
    {
      key: "title",
      header: "Title",
      render: (insight: Insight) => (
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{insight.image}</span>
          <div>
            <div className="font-medium">{insight.title}</div>
            <div className="text-sm text-muted-foreground">{insight.author}</div>
          </div>
        </div>
      )
    },
    {
      key: "category",
      header: "Category",
      render: (insight: Insight) => (
        <Badge className={insight.categoryColor}>
          {insight.category}
        </Badge>
      )
    },
    {
      key: "stats",
      header: "Stats",
      render: (insight: Insight) => (
        <div className="text-sm">
          <div>{insight.views || 0} views</div>
          <div>{insight.likes || 0} likes</div>
        </div>
      )
    },
    {
      key: "featured",
      header: "Featured",
      render: (insight: Insight) => (
        insight.featured ? (
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      )
    },
    {
      key: "publishDate",
      header: "Published",
      render: (insight: Insight) => (
        <div className="text-sm">
          <div>{new Date(insight.publishedAt).toLocaleDateString()}</div>
          <div className="text-muted-foreground">{insight.readTime}</div>
        </div>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (insight: Insight) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openViewModal(insight)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEditModal(insight)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openDeleteModal(insight)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  const categoryColorOptions = [
    { value: "bg-blue-100 text-blue-800", label: "Blue" },
    { value: "bg-green-100 text-green-800", label: "Green" },
    { value: "bg-purple-100 text-purple-800", label: "Purple" },
    { value: "bg-orange-100 text-orange-800", label: "Orange" },
    { value: "bg-cyan-100 text-cyan-800", label: "Cyan" },
    { value: "bg-pink-100 text-pink-800", label: "Pink" },
    { value: "bg-red-100 text-red-800", label: "Red" },
    { value: "bg-yellow-100 text-yellow-800", label: "Yellow" }
  ]

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading insights...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Insights Management"
        description="Manage educational insights and content"
        actions={
          <Button onClick={openCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Insight
          </Button>
        }
      />

      <div className="space-y-6">
        <ListToolbar
          search={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search insights..."
        />

        {filteredInsights.length === 0 ? (
          <EmptyState
            title="No insights found"
            description="Get started by creating your first insight."
            action={
              <Button onClick={openCreateModal}>
                <Plus className="mr-2 h-4 w-4" />
                Add Insight
              </Button>
            }
          />
        ) : (
          <DataTable<Insight>
            data={filteredInsights}
            columns={columns}
            rowKey={(insight) => insight._id}
          />
        )}
      </div>

      {/* Create Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Insight</DialogTitle>
            <DialogDescription>
              Add a new educational insight or article.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter insight title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., University Rankings"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="authorRole">Author Role</Label>
                <Input
                  id="authorRole"
                  value={formData.authorRole}
                  onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                  placeholder="e.g., Education Consultant"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="readTime">Read Time</Label>
                <Input
                  id="readTime"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  placeholder="e.g., 5 min read"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publishDate">Publish Date</Label>
                <Input
                  id="publishDate"
                  value={formData.publishDate}
                  onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                  placeholder="e.g., Dec 15, 2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image/Emoji</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="🇨🇦"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief description of the insight"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Full content of the insight"
                rows={6}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoryColor">Category Color</Label>
                <select
                  id="categoryColor"
                  value={formData.categoryColor}
                  onChange={(e) => setFormData({ ...formData, categoryColor: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  {categoryColorOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="views">Views</Label>
                <Input
                  id="views"
                  value={formData.views}
                  onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="likes">Likes</Label>
                <Input
                  id="likes"
                  value={formData.likes}
                  onChange={(e) => setFormData({ ...formData, likes: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
              <Label htmlFor="featured">Featured Insight</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>
              Create Insight
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Insight</DialogTitle>
            <DialogDescription>
              Update the insight information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter insight title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category *</Label>
                <Input
                  id="edit-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., University Rankings"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-author">Author *</Label>
                <Input
                  id="edit-author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-authorRole">Author Role</Label>
                <Input
                  id="edit-authorRole"
                  value={formData.authorRole}
                  onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                  placeholder="e.g., Education Consultant"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-readTime">Read Time</Label>
                <Input
                  id="edit-readTime"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  placeholder="e.g., 5 min read"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-publishDate">Publish Date</Label>
                <Input
                  id="edit-publishDate"
                  value={formData.publishDate}
                  onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                  placeholder="e.g., Dec 15, 2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-image">Image/Emoji</Label>
                <Input
                  id="edit-image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="🇨🇦"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-excerpt">Excerpt *</Label>
              <Textarea
                id="edit-excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief description of the insight"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-content">Content *</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Full content of the insight"
                rows={6}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-categoryColor">Category Color</Label>
                <select
                  id="edit-categoryColor"
                  value={formData.categoryColor}
                  onChange={(e) => setFormData({ ...formData, categoryColor: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  {categoryColorOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-views">Views</Label>
                <Input
                  id="edit-views"
                  value={formData.views}
                  onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-likes">Likes</Label>
                <Input
                  id="edit-likes"
                  value={formData.likes}
                  onChange={(e) => setFormData({ ...formData, likes: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
              <Label htmlFor="edit-featured">Featured Insight</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>
              Update Insight
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>View Insight</DialogTitle>
          </DialogHeader>
          
          {selectedInsight && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{selectedInsight.image}</span>
                <div>
                  <h3 className="text-lg font-semibold">{selectedInsight.title}</h3>
                  <Badge className={selectedInsight.categoryColor}>
                    {selectedInsight.category}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Author:</strong> {selectedInsight.author}
                </div>
                <div>
                  <strong>Role:</strong> {selectedInsight.authorRole}
                </div>
                <div>
                  <strong>Read Time:</strong> {selectedInsight.readTime}
                </div>
                <div>
                  <strong>Published:</strong> {new Date(selectedInsight.publishedAt).toLocaleDateString()}
                </div>
                <div>
                  <strong>Views:</strong> {selectedInsight.views}
                </div>
                <div>
                  <strong>Likes:</strong> {selectedInsight.likes}
                </div>
              </div>
              
              <div>
                <strong>Excerpt:</strong>
                <p className="mt-1 text-muted-foreground">{selectedInsight.excerpt}</p>
              </div>
              
              <div>
                <strong>Content:</strong>
                <p className="mt-1 text-muted-foreground whitespace-pre-wrap">{selectedInsight.content}</p>
              </div>
              
              {selectedInsight.featured && (
                <div className="flex items-center space-x-2 text-yellow-600">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">Featured Insight</span>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the insight
              &ldquo;{selectedInsight?.title}&rdquo;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteLoading === selectedInsight?._id}
            >
              {deleteLoading === selectedInsight?._id ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}