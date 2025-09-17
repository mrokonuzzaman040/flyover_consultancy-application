"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit, Eye, Plus, Search, Filter, Quote } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import ImageBBUpload from "@/components/admin/ImageBBUpload"
import PageHeader from "@/components/admin/PageHeader"
import DataTable from "@/components/admin/DataTable"
import ListToolbar from "@/components/admin/ListToolbar"
import EmptyState from "@/components/admin/EmptyState"

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials Management"
        description="Collect and manage testimonials"
        actions={(
          <Button onClick={() => setShowCreateModal(true)} className="bg-brand-600 hover:bg-brand-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Testimonial
          </Button>
        )}
      />

      <ListToolbar search={searchTerm} onSearchChange={setSearchTerm} searchPlaceholder="Search testimonials...">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </ListToolbar>

      {filteredTestimonials.length === 0 ? (
        <EmptyState title="No testimonials found" />
      ) : (
        <DataTable
          columns={[
            { key: 'author', header: 'Author', render: (t: Testimonial) => (
              <div className="flex items-center gap-3">
                {t.avatarUrl ? (
                  <Image src={t.avatarUrl} alt={t.author} height={40} width={40} className="rounded-full object-cover w-10 h-10" />
                ) : (
                  <div className="w-10 h-10 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-medium">{getInitials(t.author)}</div>
                )}
                <div>
                  <div className="font-medium text-slate-900">{t.author}</div>
                  {t.source && <div className="text-xs text-slate-500">{t.source}</div>}
                </div>
              </div>
            ) },
            { key: 'quote', header: 'Quote', hideOn: 'md', render: (t: Testimonial) => (
              <div className="text-slate-600 line-clamp-1 flex items-center gap-2"><Quote className="w-4 h-4" />{t.quote}</div>
            ) },
            { key: 'status', header: 'Status', hideOn: 'sm', render: (t: Testimonial) => getStatusBadge(t) },
            { key: 'createdAt', header: 'Created', hideOn: 'lg', render: (t: Testimonial) => formatDate(t.createdAt) },
            { key: 'actions', header: 'Actions', headerClassName: 'text-right', cellClassName: 'text-right', render: (t: Testimonial) => (
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => openViewModal(t)}><Eye className="w-4 h-4" /></Button>
                <Button size="sm" variant="outline" onClick={() => openEditModal(t)}><Edit className="w-4 h-4" /></Button>
                <Button size="sm" variant="outline" onClick={() => openDeleteModal(t)} className="text-brand-600 hover:text-brand-700"><Trash2 className="w-4 h-4" /></Button>
              </div>
            ) },
          ]}
          data={filteredTestimonials}
          rowKey={(t) => t.id}
        />
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
                <ImageBBUpload
                  label="Avatar Image (Optional)"
                  currentImage={formData.avatarUrl}
                  onUpload={(image) => setFormData({...formData, avatarUrl: image.url})}
                  onRemove={() => setFormData({...formData, avatarUrl: ""})}
                  maxSize={1 * 1024 * 1024} // 1MB for avatars
                  required={false}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload an avatar image (recommended: square format, max 1MB)
                </p>
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
              <Button onClick={handleCreate} className="bg-brand-600 hover:bg-brand-700">
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
                <ImageBBUpload
                  label="Avatar Image (Optional)"
                  currentImage={formData.avatarUrl}
                  onUpload={(image) => setFormData({...formData, avatarUrl: image.url})}
                  onRemove={() => setFormData({...formData, avatarUrl: ""})}
                  maxSize={1 * 1024 * 1024} // 1MB for avatars
                  required={false}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload an avatar image (recommended: square format, max 1MB)
                </p>
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
              <Button onClick={handleUpdate} className="bg-brand-600 hover:bg-brand-700">
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
                  <Image 
                    src={selectedTestimonial.avatarUrl} 
                    alt={selectedTestimonial.author}
                    className="w-16 h-16 rounded-full object-cover"
                    height={16}
                    width={16}
                  />
                ) : (
                  <div className="w-16 h-16 bg-brand-600 text-white rounded-full flex items-center justify-center text-lg font-medium">
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
                  <Quote className="w-6 h-6 text-brand-600 mb-2" />
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
                <Button onClick={handleDelete} className="bg-brand-600 hover:bg-brand-700">
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
