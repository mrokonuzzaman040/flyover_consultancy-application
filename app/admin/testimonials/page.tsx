"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit, Eye, Plus, Search, Filter, Quote, User, Calendar } from "lucide-react"
import { toast } from "sonner"

interface Testimonial {
  id: string
  author: string
  quote: string
  source?: string
  avatarUrl?: string
  publishedAt?: string
  createdAt: string
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState({
    author: "",
    quote: "",
    source: "",
    avatarUrl: "",
    publishedAt: ""
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/admin/testimonials')
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data.testimonials || [])
      } else {
        toast.error('Failed to fetch testimonials')
      }
    } catch (error) {
      toast.error('Error fetching testimonials')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : null
        })
      })

      if (response.ok) {
        toast.success('Testimonial created successfully')
        setShowCreateModal(false)
        resetForm()
        fetchTestimonials()
      } else {
        toast.error('Failed to create testimonial')
      }
    } catch (error) {
      toast.error('Error creating testimonial')
    }
  }

  const handleUpdate = async () => {
    if (!selectedTestimonial) return

    try {
      const response = await fetch(`/api/admin/testimonials/${selectedTestimonial.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : null
        })
      })

      if (response.ok) {
        toast.success('Testimonial updated successfully')
        setShowEditModal(false)
        resetForm()
        fetchTestimonials()
      } else {
        toast.error('Failed to update testimonial')
      }
    } catch (error) {
      toast.error('Error updating testimonial')
    }
  }

  const handleDelete = async () => {
    if (!selectedTestimonial) return

    try {
      const response = await fetch(`/api/admin/testimonials/${selectedTestimonial.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Testimonial deleted successfully')
        setShowDeleteModal(false)
        setSelectedTestimonial(null)
        fetchTestimonials()
      } else {
        toast.error('Failed to delete testimonial')
      }
    } catch (error) {
      toast.error('Error deleting testimonial')
    }
  }

  const resetForm = () => {
    setFormData({
      author: "",
      quote: "",
      source: "",
      avatarUrl: "",
      publishedAt: ""
    })
    setSelectedTestimonial(null)
  }

  const openEditModal = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial)
    setFormData({
      author: testimonial.author,
      quote: testimonial.quote,
      source: testimonial.source || "",
      avatarUrl: testimonial.avatarUrl || "",
      publishedAt: testimonial.publishedAt ? new Date(testimonial.publishedAt).toISOString().slice(0, 16) : ""
    })
    setShowEditModal(true)
  }

  const openViewModal = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial)
    setShowViewModal(true)
  }

  const openDeleteModal = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial)
    setShowDeleteModal(true)
  }

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.quote.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (testimonial.source && testimonial.source.toLowerCase().includes(searchTerm.toLowerCase()))
    
    let matchesStatus = true
    if (statusFilter === "published") {
      matchesStatus = !!testimonial.publishedAt
    } else if (statusFilter === "draft") {
      matchesStatus = !testimonial.publishedAt
    }
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (testimonial: Testimonial) => {
    if (testimonial.publishedAt) {
      return <Badge className="bg-green-100 text-green-800">Published</Badge>
    }
    return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Testimonials Management</h1>
        <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Testimonial
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search testimonials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTestimonials.map((testimonial) => (
          <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  {testimonial.avatarUrl ? (
                    <img 
                      src={testimonial.avatarUrl} 
                      alt={testimonial.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {getInitials(testimonial.author)}
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg">{testimonial.author}</CardTitle>
                    {testimonial.source && (
                      <p className="text-sm text-gray-600">{testimonial.source}</p>
                    )}
                  </div>
                </div>
                {getStatusBadge(testimonial)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Quote className="w-4 h-4 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-700 line-clamp-4">{testimonial.quote}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Created: {formatDate(testimonial.createdAt)}</span>
                  {testimonial.publishedAt && (
                    <span>Published: {formatDate(testimonial.publishedAt)}</span>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openViewModal(testimonial)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditModal(testimonial)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openDeleteModal(testimonial)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTestimonials.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No testimonials found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Create New Testimonial</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="author">Author Name</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    placeholder="Author name"
                  />
                </div>
                <div>
                  <Label htmlFor="source">Source/Position (Optional)</Label>
                  <Input
                    id="source"
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    placeholder="e.g., Student at XYZ University"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="quote">Quote/Testimonial</Label>
                <Textarea
                  id="quote"
                  value={formData.quote}
                  onChange={(e) => setFormData({...formData, quote: e.target.value})}
                  placeholder="Enter the testimonial text..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="avatarUrl">Avatar Image URL (Optional)</Label>
                <Input
                  id="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({...formData, avatarUrl: e.target.value})}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div>
                <Label htmlFor="publishedAt">Publish Date (Optional)</Label>
                <Input
                  id="publishedAt"
                  type="datetime-local"
                  value={formData.publishedAt}
                  onChange={(e) => setFormData({...formData, publishedAt: e.target.value})}
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to save as draft</p>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowCreateModal(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                Create Testimonial
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedTestimonial && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Edit Testimonial</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-author">Author Name</Label>
                  <Input
                    id="edit-author"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    placeholder="Author name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-source">Source/Position (Optional)</Label>
                  <Input
                    id="edit-source"
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    placeholder="e.g., Student at XYZ University"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-quote">Quote/Testimonial</Label>
                <Textarea
                  id="edit-quote"
                  value={formData.quote}
                  onChange={(e) => setFormData({...formData, quote: e.target.value})}
                  placeholder="Enter the testimonial text..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="edit-avatarUrl">Avatar Image URL (Optional)</Label>
                <Input
                  id="edit-avatarUrl"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({...formData, avatarUrl: e.target.value})}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div>
                <Label htmlFor="edit-publishedAt">Publish Date (Optional)</Label>
                <Input
                  id="edit-publishedAt"
                  type="datetime-local"
                  value={formData.publishedAt}
                  onChange={(e) => setFormData({...formData, publishedAt: e.target.value})}
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to save as draft</p>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowEditModal(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-700">
                Update Testimonial
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedTestimonial && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">View Testimonial</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                {selectedTestimonial.avatarUrl ? (
                  <img 
                    src={selectedTestimonial.avatarUrl} 
                    alt={selectedTestimonial.author}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-medium">
                    {getInitials(selectedTestimonial.author)}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedTestimonial.author}</h3>
                  {selectedTestimonial.source && (
                    <p className="text-gray-600">{selectedTestimonial.source}</p>
                  )}
                  {getStatusBadge(selectedTestimonial)}
                </div>
              </div>
              
              <div>
                <Label className="font-medium text-gray-900">Testimonial</Label>
                <div className="bg-gray-50 p-4 rounded-lg mt-2">
                  <Quote className="w-6 h-6 text-blue-600 mb-2" />
                  <p className="text-gray-700 leading-relaxed italic">&ldquo;{selectedTestimonial.quote}&rdquo;</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium text-gray-900">Created Date</Label>
                  <p className="text-gray-700">{formatDate(selectedTestimonial.createdAt)}</p>
                </div>
                <div>
                  <Label className="font-medium text-gray-900">Published Date</Label>
                  <p className="text-gray-700">
                    {selectedTestimonial.publishedAt ? formatDate(selectedTestimonial.publishedAt) : 'Not published'}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end">
              <Button variant="outline" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedTestimonial && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Delete Testimonial</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the testimonial by &ldquo;{selectedTestimonial.author}&rdquo;? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}