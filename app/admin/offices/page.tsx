"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Eye, Plus, Search, MapPin, Phone, Mail } from "lucide-react"
import { toast } from "sonner"

interface Office {
  id: string
  city: string
  phone: string
  email?: string
  mapEmbedUrl?: string
  createdAt: string
}

export default function AdminOfficesPage() {
  const [offices, setOffices] = useState<Office[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null)
  const [formData, setFormData] = useState({
    city: "",
    phone: "",
    email: "",
    mapEmbedUrl: ""
  })

  useEffect(() => {
    fetchOffices()
  }, [])

  const fetchOffices = async () => {
    try {
      const response = await fetch('/api/admin/offices')
      if (response.ok) {
        const data = await response.json()
        setOffices(data.offices || [])
      } else {
        toast.error('Failed to fetch offices')
      }
    } catch (error) {
      toast.error('Error fetching offices')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/admin/offices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Office created successfully')
        setShowCreateModal(false)
        resetForm()
        fetchOffices()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to create office')
      }
    } catch (error) {
      toast.error('Error creating office')
    }
  }

  const handleUpdate = async () => {
    if (!selectedOffice) return

    try {
      const response = await fetch(`/api/admin/offices/${selectedOffice.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Office updated successfully')
        setShowEditModal(false)
        resetForm()
        fetchOffices()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to update office')
      }
    } catch (error) {
      toast.error('Error updating office')
    }
  }

  const handleDelete = async () => {
    if (!selectedOffice) return

    try {
      const response = await fetch(`/api/admin/offices/${selectedOffice.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Office deleted successfully')
        setShowDeleteModal(false)
        setSelectedOffice(null)
        fetchOffices()
      } else {
        toast.error('Failed to delete office')
      }
    } catch (error) {
      toast.error('Error deleting office')
    }
  }

  const resetForm = () => {
    setFormData({
      city: "",
      phone: "",
      email: "",
      mapEmbedUrl: ""
    })
    setSelectedOffice(null)
  }

  const openEditModal = (office: Office) => {
    setSelectedOffice(office)
    setFormData({
      city: office.city,
      phone: office.phone,
      email: office.email || "",
      mapEmbedUrl: office.mapEmbedUrl || ""
    })
    setShowEditModal(true)
  }

  const openViewModal = (office: Office) => {
    setSelectedOffice(office)
    setShowViewModal(true)
  }

  const openDeleteModal = (office: Office) => {
    setSelectedOffice(office)
    setShowDeleteModal(true)
  }

  const filteredOffices = offices.filter(office =>
    office.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    office.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (office.email && office.email.toLowerCase().includes(searchTerm.toLowerCase()))
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
        <h1 className="text-3xl font-bold text-gray-900">Offices Management</h1>
        <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Office
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search offices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Offices Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredOffices.map((office) => (
          <Card key={office.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{office.city}</CardTitle>
                    <p className="text-sm text-gray-600">Office Location</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{office.phone}</span>
                </div>
                
                {office.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{office.email}</span>
                  </div>
                )}

                {office.mapEmbedUrl && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <Badge variant="secondary" className="text-xs">Map Available</Badge>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                  <span>Created: {formatDate(office.createdAt)}</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openViewModal(office)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditModal(office)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openDeleteModal(office)}
                  className="text-brand-600 hover:text-brand-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOffices.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No offices found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Add New Office</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  placeholder="e.g., Dhaka, Chittagong"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="e.g., +880-000-000000"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="e.g., dhaka@flyover.com"
                />
              </div>
              
              <div>
                <Label htmlFor="mapEmbedUrl">Map Embed URL (Optional)</Label>
                <Textarea
                  id="mapEmbedUrl"
                  value={formData.mapEmbedUrl}
                  onChange={(e) => setFormData({...formData, mapEmbedUrl: e.target.value})}
                  placeholder="Google Maps embed URL or iframe code"
                  rows={3}
                />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowCreateModal(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                Add Office
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedOffice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Edit Office</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label htmlFor="edit-city">City *</Label>
                <Input
                  id="edit-city"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  placeholder="e.g., Dhaka, Chittagong"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-phone">Phone Number *</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="e.g., +880-000-000000"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-email">Email (Optional)</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="e.g., dhaka@flyover.com"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-mapEmbedUrl">Map Embed URL (Optional)</Label>
                <Textarea
                  id="edit-mapEmbedUrl"
                  value={formData.mapEmbedUrl}
                  onChange={(e) => setFormData({...formData, mapEmbedUrl: e.target.value})}
                  placeholder="Google Maps embed URL or iframe code"
                  rows={3}
                />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowEditModal(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-700">
                Update Office
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedOffice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Office Details</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-medium">
                  <MapPin className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">{selectedOffice.city}</h3>
                  <p className="text-gray-600">Office Location</p>
                  <p className="text-sm text-gray-500">Created: {formatDate(selectedOffice.createdAt)}</p>
                </div>
              </div>
              
              <div className="grid gap-4">
                <div>
                  <Label className="font-medium text-gray-900">Phone Number</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-700">{selectedOffice.phone}</p>
                  </div>
                </div>
                
                {selectedOffice.email && (
                  <div>
                    <Label className="font-medium text-gray-900">Email</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <p className="text-gray-700">{selectedOffice.email}</p>
                    </div>
                  </div>
                )}
                
                {selectedOffice.mapEmbedUrl && (
                  <div>
                    <Label className="font-medium text-gray-900">Map</Label>
                    <div className="mt-2 border rounded-lg p-3 bg-gray-50">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Map Embed URL</span>
                      </div>
                      <div className="bg-white p-3 rounded border max-h-32 overflow-y-auto">
                        <code className="text-xs text-gray-600 break-all">{selectedOffice.mapEmbedUrl}</code>
                      </div>
                    </div>
                  </div>
                )}
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
      {showDeleteModal && selectedOffice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Delete Office</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the office in &ldquo;{selectedOffice.city}&rdquo;? This action cannot be undone.
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