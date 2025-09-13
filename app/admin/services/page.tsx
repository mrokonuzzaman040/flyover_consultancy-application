"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Eye, Plus, Search, Settings, FileText, Tag } from "lucide-react"
import { toast } from "sonner"

interface Service {
  id: string
  name: string
  slug: string
  sectionsMD: string[]
  ctaLabel?: string
  createdAt: string
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sectionsMD: [] as string[],
    ctaLabel: ""
  })
  const [sectionInput, setSectionInput] = useState("")

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data.services || [])
      } else {
        toast.error('Failed to fetch services')
      }
    } catch (error) {
      toast.error('Error fetching services')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Service created successfully')
        setShowCreateModal(false)
        resetForm()
        fetchServices()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to create service')
      }
    } catch (error) {
      toast.error('Error creating service')
    }
  }

  const handleUpdate = async () => {
    if (!selectedService) return

    try {
      const response = await fetch(`/api/admin/services/${selectedService.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Service updated successfully')
        setShowEditModal(false)
        resetForm()
        fetchServices()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to update service')
      }
    } catch (error) {
      toast.error('Error updating service')
    }
  }

  const handleDelete = async () => {
    if (!selectedService) return

    try {
      const response = await fetch(`/api/admin/services/${selectedService.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Service deleted successfully')
        setShowDeleteModal(false)
        setSelectedService(null)
        fetchServices()
      } else {
        toast.error('Failed to delete service')
      }
    } catch (error) {
      toast.error('Error deleting service')
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      sectionsMD: [],
      ctaLabel: ""
    })
    setSectionInput("")
    setSelectedService(null)
  }

  const openEditModal = (service: Service) => {
    setSelectedService(service)
    setFormData({
      name: service.name,
      slug: service.slug,
      sectionsMD: service.sectionsMD || [],
      ctaLabel: service.ctaLabel || ""
    })
    setShowEditModal(true)
  }

  const openViewModal = (service: Service) => {
    setSelectedService(service)
    setShowViewModal(true)
  }

  const openDeleteModal = (service: Service) => {
    setSelectedService(service)
    setShowDeleteModal(true)
  }

  const addSection = () => {
    if (sectionInput.trim()) {
      setFormData({
        ...formData,
        sectionsMD: [...formData.sectionsMD, sectionInput.trim()]
      })
      setSectionInput("")
    }
  }

  const removeSection = (index: number) => {
    setFormData({
      ...formData,
      sectionsMD: formData.sectionsMD.filter((_, i) => i !== index)
    })
  }

  const updateSection = (index: number, value: string) => {
    const updatedSections = [...formData.sectionsMD]
    updatedSections[index] = value
    setFormData({
      ...formData,
      sectionsMD: updatedSections
    })
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
        <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
        <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Service
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <p className="text-sm text-gray-600">/{service.slug}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Sections:</span>
                  <Badge variant="secondary">{service.sectionsMD.length}</Badge>
                </div>
                
                {service.ctaLabel && (
                  <div className="flex items-center space-x-2">
                    <Tag className="w-3 h-3 text-gray-500" />
                    <span className="text-sm text-gray-700">{service.ctaLabel}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Created: {formatDate(service.createdAt)}</span>
                  <div className="flex items-center space-x-2">
                    {service.sectionsMD.length > 0 && <FileText className="w-3 h-3" />}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openViewModal(service)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditModal(service)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openDeleteModal(service)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No services found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Create New Service</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Service Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value
                      setFormData({
                        ...formData,
                        name,
                        slug: generateSlug(name)
                      })
                    }}
                    placeholder="e.g., Admission Support"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="e.g., admission-support"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="ctaLabel">CTA Label (Optional)</Label>
                <Input
                  id="ctaLabel"
                  value={formData.ctaLabel}
                  onChange={(e) => setFormData({...formData, ctaLabel: e.target.value})}
                  placeholder="e.g., Get Started, Learn More"
                />
              </div>

              <div>
                <Label>Content Sections (Markdown)</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Textarea
                      value={sectionInput}
                      onChange={(e) => setSectionInput(e.target.value)}
                      placeholder="Add a content section in markdown format..."
                      rows={3}
                      className="flex-1"
                    />
                    <Button type="button" onClick={addSection} variant="outline" className="self-start">
                      Add Section
                    </Button>
                  </div>
                  
                  {formData.sectionsMD.map((section, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <Label className="text-sm font-medium">Section {index + 1}</Label>
                        <Button
                          type="button"
                          onClick={() => removeSection(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                        >
                          ×
                        </Button>
                      </div>
                      <Textarea
                        value={section}
                        onChange={(e) => updateSection(index, e.target.value)}
                        rows={4}
                        className="bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowCreateModal(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                Create Service
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Edit Service</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Service Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Admission Support"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-slug">URL Slug</Label>
                  <Input
                    id="edit-slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="e.g., admission-support"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-ctaLabel">CTA Label (Optional)</Label>
                <Input
                  id="edit-ctaLabel"
                  value={formData.ctaLabel}
                  onChange={(e) => setFormData({...formData, ctaLabel: e.target.value})}
                  placeholder="e.g., Get Started, Learn More"
                />
              </div>

              <div>
                <Label>Content Sections (Markdown)</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Textarea
                      value={sectionInput}
                      onChange={(e) => setSectionInput(e.target.value)}
                      placeholder="Add a content section in markdown format..."
                      rows={3}
                      className="flex-1"
                    />
                    <Button type="button" onClick={addSection} variant="outline" className="self-start">
                      Add Section
                    </Button>
                  </div>
                  
                  {formData.sectionsMD.map((section, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <Label className="text-sm font-medium">Section {index + 1}</Label>
                        <Button
                          type="button"
                          onClick={() => removeSection(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                        >
                          ×
                        </Button>
                      </div>
                      <Textarea
                        value={section}
                        onChange={(e) => updateSection(index, e.target.value)}
                        rows={4}
                        className="bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowEditModal(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-700">
                Update Service
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">View Service</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-medium">
                  <Settings className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">{selectedService.name}</h3>
                  <p className="text-gray-600">/{selectedService.slug}</p>
                  <p className="text-sm text-gray-500">Created: {formatDate(selectedService.createdAt)}</p>
                </div>
              </div>
              
              {selectedService.ctaLabel && (
                <div>
                  <Label className="font-medium text-gray-900">CTA Label</Label>
                  <p className="text-gray-700 mt-1">{selectedService.ctaLabel}</p>
                </div>
              )}

              {selectedService.sectionsMD.length > 0 && (
                <div>
                  <Label className="font-medium text-gray-900">Content Sections ({selectedService.sectionsMD.length})</Label>
                  <div className="space-y-4 mt-3">
                    {selectedService.sectionsMD.map((section, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-medium text-gray-700">Section {index + 1}</Label>
                          <Badge variant="secondary" className="text-xs">
                            {section.length} chars
                          </Badge>
                        </div>
                        <div className="bg-white p-3 rounded border max-h-40 overflow-y-auto">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap">{section}</pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
      {showDeleteModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Delete Service</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete &ldquo;{selectedService.name}&rdquo;? This action cannot be undone.
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