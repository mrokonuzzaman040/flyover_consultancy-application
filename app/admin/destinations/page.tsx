"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Eye, Plus, Search, Globe, BookOpen, DollarSign, FileText } from "lucide-react"
import { toast } from "sonner"

interface Destination {
  id: string
  country: string
  slug: string
  hero?: string
  overviewMD?: string
  costsMD?: string
  intakesMD?: string
  visaMD?: string
  scholarshipsMD?: string
  popularCourses: string[]
  faqs?: {
    question: string
    answer: string
  }[]
  createdAt: string
}

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
  const [formData, setFormData] = useState({
    country: "",
    slug: "",
    hero: "",
    overviewMD: "",
    costsMD: "",
    intakesMD: "",
    visaMD: "",
    scholarshipsMD: "",
    popularCourses: [] as string[],
    faqs: ""
  })
  const [courseInput, setCourseInput] = useState("")

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    try {
      const response = await fetch('/api/admin/destinations')
      if (response.ok) {
        const data = await response.json()
        setDestinations(data.destinations || [])
      } else {
        toast.error('Failed to fetch destinations')
      }
    } catch (error) {
      toast.error('Error fetching destinations')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/admin/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          faqs: formData.faqs ? JSON.parse(formData.faqs) : null
        })
      })

      if (response.ok) {
        toast.success('Destination created successfully')
        setShowCreateModal(false)
        resetForm()
        fetchDestinations()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to create destination')
      }
    } catch (error) {
      toast.error('Error creating destination')
    }
  }

  const handleUpdate = async () => {
    if (!selectedDestination) return

    try {
      const response = await fetch(`/api/admin/destinations/${selectedDestination.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          faqs: formData.faqs ? JSON.parse(formData.faqs) : null
        })
      })

      if (response.ok) {
        toast.success('Destination updated successfully')
        setShowEditModal(false)
        resetForm()
        fetchDestinations()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to update destination')
      }
    } catch (error) {
      toast.error('Error updating destination')
    }
  }

  const handleDelete = async () => {
    if (!selectedDestination) return

    try {
      const response = await fetch(`/api/admin/destinations/${selectedDestination.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Destination deleted successfully')
        setShowDeleteModal(false)
        setSelectedDestination(null)
        fetchDestinations()
      } else {
        toast.error('Failed to delete destination')
      }
    } catch (error) {
      toast.error('Error deleting destination')
    }
  }

  const resetForm = () => {
    setFormData({
      country: "",
      slug: "",
      hero: "",
      overviewMD: "",
      costsMD: "",
      intakesMD: "",
      visaMD: "",
      scholarshipsMD: "",
      popularCourses: [],
      faqs: ""
    })
    setCourseInput("")
    setSelectedDestination(null)
  }

  const openEditModal = (destination: Destination) => {
    setSelectedDestination(destination)
    setFormData({
      country: destination.country,
      slug: destination.slug,
      hero: destination.hero || "",
      overviewMD: destination.overviewMD || "",
      costsMD: destination.costsMD || "",
      intakesMD: destination.intakesMD || "",
      visaMD: destination.visaMD || "",
      scholarshipsMD: destination.scholarshipsMD || "",
      popularCourses: destination.popularCourses || [],
      faqs: destination.faqs ? JSON.stringify(destination.faqs, null, 2) : ""
    })
    setShowEditModal(true)
  }

  const openViewModal = (destination: Destination) => {
    setSelectedDestination(destination)
    setShowViewModal(true)
  }

  const openDeleteModal = (destination: Destination) => {
    setSelectedDestination(destination)
    setShowDeleteModal(true)
  }

  const addCourse = () => {
    if (courseInput.trim() && !formData.popularCourses.includes(courseInput.trim())) {
      setFormData({
        ...formData,
        popularCourses: [...formData.popularCourses, courseInput.trim()]
      })
      setCourseInput("")
    }
  }

  const removeCourse = (index: number) => {
    setFormData({
      ...formData,
      popularCourses: formData.popularCourses.filter((_, i) => i !== index)
    })
  }

  const generateSlug = (country: string) => {
    return country.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const filteredDestinations = destinations.filter(destination =>
    destination.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    destination.slug.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-3xl font-bold text-gray-900">Destinations Management</h1>
        <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Destination
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Destinations Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDestinations.map((destination) => (
          <Card key={destination.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{destination.country}</CardTitle>
                    <p className="text-sm text-gray-600">/{destination.slug}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {destination.hero && (
                  <p className="text-sm text-gray-700 line-clamp-2">{destination.hero}</p>
                )}
                
                <div className="flex flex-wrap gap-1">
                  {destination.popularCourses.slice(0, 3).map((course, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {course}
                    </Badge>
                  ))}
                  {destination.popularCourses.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{destination.popularCourses.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Created: {formatDate(destination.createdAt)}</span>
                  <div className="flex items-center space-x-2">
                    {destination.overviewMD && <FileText className="w-3 h-3" />}
                    {destination.costsMD && <DollarSign className="w-3 h-3" />}
                    {destination.popularCourses.length > 0 && <BookOpen className="w-3 h-3" />}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openViewModal(destination)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditModal(destination)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openDeleteModal(destination)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDestinations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No destinations found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Create New Destination</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country Name</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => {
                      const country = e.target.value
                      setFormData({
                        ...formData,
                        country,
                        slug: generateSlug(country)
                      })
                    }}
                    placeholder="e.g., New Zealand"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="e.g., new-zealand"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="hero">Hero Text</Label>
                <Input
                  id="hero"
                  value={formData.hero}
                  onChange={(e) => setFormData({...formData, hero: e.target.value})}
                  placeholder="Brief description for the hero section"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="overviewMD">Overview (Markdown)</Label>
                  <Textarea
                    id="overviewMD"
                    value={formData.overviewMD}
                    onChange={(e) => setFormData({...formData, overviewMD: e.target.value})}
                    placeholder="Overview content in markdown..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="costsMD">Costs Information (Markdown)</Label>
                  <Textarea
                    id="costsMD"
                    value={formData.costsMD}
                    onChange={(e) => setFormData({...formData, costsMD: e.target.value})}
                    placeholder="Cost information in markdown..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="intakesMD">Intakes Information (Markdown)</Label>
                  <Textarea
                    id="intakesMD"
                    value={formData.intakesMD}
                    onChange={(e) => setFormData({...formData, intakesMD: e.target.value})}
                    placeholder="Intake information in markdown..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="visaMD">Visa Information (Markdown)</Label>
                  <Textarea
                    id="visaMD"
                    value={formData.visaMD}
                    onChange={(e) => setFormData({...formData, visaMD: e.target.value})}
                    placeholder="Visa information in markdown..."
                    rows={4}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="scholarshipsMD">Scholarships Information (Markdown)</Label>
                <Textarea
                  id="scholarshipsMD"
                  value={formData.scholarshipsMD}
                  onChange={(e) => setFormData({...formData, scholarshipsMD: e.target.value})}
                  placeholder="Scholarship information in markdown..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Popular Courses</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={courseInput}
                    onChange={(e) => setCourseInput(e.target.value)}
                    placeholder="Add a popular course"
                    onKeyPress={(e) => e.key === 'Enter' && addCourse()}
                  />
                  <Button type="button" onClick={addCourse} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.popularCourses.map((course, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeCourse(index)}>
                      {course} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="faqs">FAQs (JSON Format)</Label>
                <Textarea
                  id="faqs"
                  value={formData.faqs}
                  onChange={(e) => setFormData({...formData, faqs: e.target.value})}
                  placeholder='[{"question": "What is the cost?", "answer": "The cost varies..."}]'
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">Enter FAQs in JSON format</p>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowCreateModal(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                Create Destination
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedDestination && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Edit Destination</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-country">Country Name</Label>
                  <Input
                    id="edit-country"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    placeholder="e.g., New Zealand"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-slug">URL Slug</Label>
                  <Input
                    id="edit-slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="e.g., new-zealand"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-hero">Hero Text</Label>
                <Input
                  id="edit-hero"
                  value={formData.hero}
                  onChange={(e) => setFormData({...formData, hero: e.target.value})}
                  placeholder="Brief description for the hero section"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-overviewMD">Overview (Markdown)</Label>
                  <Textarea
                    id="edit-overviewMD"
                    value={formData.overviewMD}
                    onChange={(e) => setFormData({...formData, overviewMD: e.target.value})}
                    placeholder="Overview content in markdown..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-costsMD">Costs Information (Markdown)</Label>
                  <Textarea
                    id="edit-costsMD"
                    value={formData.costsMD}
                    onChange={(e) => setFormData({...formData, costsMD: e.target.value})}
                    placeholder="Cost information in markdown..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-intakesMD">Intakes Information (Markdown)</Label>
                  <Textarea
                    id="edit-intakesMD"
                    value={formData.intakesMD}
                    onChange={(e) => setFormData({...formData, intakesMD: e.target.value})}
                    placeholder="Intake information in markdown..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-visaMD">Visa Information (Markdown)</Label>
                  <Textarea
                    id="edit-visaMD"
                    value={formData.visaMD}
                    onChange={(e) => setFormData({...formData, visaMD: e.target.value})}
                    placeholder="Visa information in markdown..."
                    rows={4}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-scholarshipsMD">Scholarships Information (Markdown)</Label>
                <Textarea
                  id="edit-scholarshipsMD"
                  value={formData.scholarshipsMD}
                  onChange={(e) => setFormData({...formData, scholarshipsMD: e.target.value})}
                  placeholder="Scholarship information in markdown..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Popular Courses</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={courseInput}
                    onChange={(e) => setCourseInput(e.target.value)}
                    placeholder="Add a popular course"
                    onKeyPress={(e) => e.key === 'Enter' && addCourse()}
                  />
                  <Button type="button" onClick={addCourse} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.popularCourses.map((course, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeCourse(index)}>
                      {course} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="edit-faqs">FAQs (JSON Format)</Label>
                <Textarea
                  id="edit-faqs"
                  value={formData.faqs}
                  onChange={(e) => setFormData({...formData, faqs: e.target.value})}
                  placeholder='[{"question": "What is the cost?", "answer": "The cost varies..."}]'
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">Enter FAQs in JSON format</p>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowEditModal(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-700">
                Update Destination
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedDestination && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">View Destination</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-medium">
                  <Globe className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">{selectedDestination.country}</h3>
                  <p className="text-gray-600">/{selectedDestination.slug}</p>
                  <p className="text-sm text-gray-500">Created: {formatDate(selectedDestination.createdAt)}</p>
                </div>
              </div>
              
              {selectedDestination.hero && (
                <div>
                  <Label className="font-medium text-gray-900">Hero Text</Label>
                  <p className="text-gray-700 mt-1">{selectedDestination.hero}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                {selectedDestination.overviewMD && (
                  <div>
                    <Label className="font-medium text-gray-900">Overview</Label>
                    <div className="bg-gray-50 p-3 rounded-lg mt-2 max-h-32 overflow-y-auto">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">{selectedDestination.overviewMD}</pre>
                    </div>
                  </div>
                )}
                {selectedDestination.costsMD && (
                  <div>
                    <Label className="font-medium text-gray-900">Costs Information</Label>
                    <div className="bg-gray-50 p-3 rounded-lg mt-2 max-h-32 overflow-y-auto">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">{selectedDestination.costsMD}</pre>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                {selectedDestination.intakesMD && (
                  <div>
                    <Label className="font-medium text-gray-900">Intakes Information</Label>
                    <div className="bg-gray-50 p-3 rounded-lg mt-2 max-h-32 overflow-y-auto">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">{selectedDestination.intakesMD}</pre>
                    </div>
                  </div>
                )}
                {selectedDestination.visaMD && (
                  <div>
                    <Label className="font-medium text-gray-900">Visa Information</Label>
                    <div className="bg-gray-50 p-3 rounded-lg mt-2 max-h-32 overflow-y-auto">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">{selectedDestination.visaMD}</pre>
                    </div>
                  </div>
                )}
              </div>

              {selectedDestination.scholarshipsMD && (
                <div>
                  <Label className="font-medium text-gray-900">Scholarships Information</Label>
                  <div className="bg-gray-50 p-3 rounded-lg mt-2 max-h-32 overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">{selectedDestination.scholarshipsMD}</pre>
                  </div>
                </div>
              )}

              {selectedDestination.popularCourses.length > 0 && (
                <div>
                  <Label className="font-medium text-gray-900">Popular Courses</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedDestination.popularCourses.map((course, index) => (
                      <Badge key={index} variant="secondary">{course}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedDestination.faqs && (
                <div>
                  <Label className="font-medium text-gray-900">FAQs</Label>
                  <div className="bg-gray-50 p-3 rounded-lg mt-2 max-h-40 overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">{JSON.stringify(selectedDestination.faqs, null, 2)}</pre>
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
      {showDeleteModal && selectedDestination && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Delete Destination</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete &ldquo;{selectedDestination.country}&rdquo;? This action cannot be undone.
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