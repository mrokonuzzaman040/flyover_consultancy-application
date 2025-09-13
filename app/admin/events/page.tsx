"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit, Eye, Plus, Search, Filter, Calendar, MapPin, Users } from "lucide-react"
import { toast } from "sonner"

interface Event {
  id: string
  title: string
  slug: string
  startAt: string
  endAt?: string
  venue?: string
  city?: string
  description: string
  bannerUrl?: string
  status: string
  capacity: number
  seatsRemaining: number
  createdAt: string
}

type EventStatus = "draft" | "published" | "cancelled" | "completed"

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    startAt: "",
    endAt: "",
    venue: "",
    city: "",
    description: "",
    bannerUrl: "",
    status: "draft" as EventStatus,
    capacity: 0,
    seatsRemaining: 0
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      } else {
        toast.error('Failed to fetch events')
      }
    } catch (error) {
      toast.error('Error fetching events')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          capacity: Number(formData.capacity),
          seatsRemaining: Number(formData.seatsRemaining)
        })
      })

      if (response.ok) {
        toast.success('Event created successfully')
        setShowCreateModal(false)
        resetForm()
        fetchEvents()
      } else {
        toast.error('Failed to create event')
      }
    } catch (error) {
      toast.error('Error creating event')
    }
  }

  const handleUpdate = async () => {
    if (!selectedEvent) return

    try {
      const response = await fetch(`/api/admin/events/${selectedEvent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          capacity: Number(formData.capacity),
          seatsRemaining: Number(formData.seatsRemaining)
        })
      })

      if (response.ok) {
        toast.success('Event updated successfully')
        setShowEditModal(false)
        resetForm()
        fetchEvents()
      } else {
        toast.error('Failed to update event')
      }
    } catch (error) {
      toast.error('Error updating event')
    }
  }

  const handleDelete = async () => {
    if (!selectedEvent) return

    try {
      const response = await fetch(`/api/admin/events/${selectedEvent.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Event deleted successfully')
        setShowDeleteModal(false)
        setSelectedEvent(null)
        fetchEvents()
      } else {
        toast.error('Failed to delete event')
      }
    } catch (error) {
      toast.error('Error deleting event')
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      startAt: "",
      endAt: "",
      venue: "",
      city: "",
      description: "",
      bannerUrl: "",
      status: "draft",
      capacity: 0,
      seatsRemaining: 0
    })
    setSelectedEvent(null)
  }

  const openEditModal = (event: Event) => {
    setSelectedEvent(event)
    setFormData({
      title: event.title,
      slug: event.slug,
      startAt: new Date(event.startAt).toISOString().slice(0, 16),
      endAt: event.endAt ? new Date(event.endAt).toISOString().slice(0, 16) : "",
      venue: event.venue || "",
      city: event.city || "",
      description: event.description,
      bannerUrl: event.bannerUrl || "",
      status: event.status as EventStatus,
      capacity: event.capacity,
      seatsRemaining: event.seatsRemaining
    })
    setShowEditModal(true)
  }

  const openViewModal = (event: Event) => {
    setSelectedEvent(event)
    setShowViewModal(true)
  }

  const openDeleteModal = (event: Event) => {
    setSelectedEvent(event)
    setShowDeleteModal(true)
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.city && event.city.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || event.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800"
      case "draft": return "bg-yellow-100 text-yellow-800"
      case "cancelled": return "bg-red-100 text-red-800"
      case "completed": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
        <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Event
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
                  placeholder="Search events..."
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
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                <Badge className={getStatusColor(event.status)}>
                  {event.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(event.startAt)}
                </div>
                {event.city && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.city}{event.venue && `, ${event.venue}`}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  {event.seatsRemaining}/{event.capacity} seats available
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">{event.description}</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-gray-500">
                  {new Date(event.createdAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openViewModal(event)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(event)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDeleteModal(event)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No events found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Create New Event</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Event title"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="event-slug"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startAt">Start Date & Time</Label>
                  <Input
                    id="startAt"
                    type="datetime-local"
                    value={formData.startAt}
                    onChange={(e) => setFormData({...formData, startAt: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="endAt">End Date & Time (Optional)</Label>
                  <Input
                    id="endAt"
                    type="datetime-local"
                    value={formData.endAt}
                    onChange={(e) => setFormData({...formData, endAt: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="Event city"
                  />
                </div>
                <div>
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    value={formData.venue}
                    onChange={(e) => setFormData({...formData, venue: e.target.value})}
                    placeholder="Event venue"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Event description..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="0"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="seatsRemaining">Seats Remaining</Label>
                  <Input
                    id="seatsRemaining"
                    type="number"
                    min="0"
                    value={formData.seatsRemaining}
                    onChange={(e) => setFormData({...formData, seatsRemaining: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: EventStatus) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="bannerUrl">Banner Image URL</Label>
                <Input
                  id="bannerUrl"
                  value={formData.bannerUrl}
                  onChange={(e) => setFormData({...formData, bannerUrl: e.target.value})}
                  placeholder="https://example.com/banner.jpg"
                />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowCreateModal(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                Create Event
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Edit Event</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Event title"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-slug">Slug</Label>
                  <Input
                    id="edit-slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="event-slug"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-startAt">Start Date & Time</Label>
                  <Input
                    id="edit-startAt"
                    type="datetime-local"
                    value={formData.startAt}
                    onChange={(e) => setFormData({...formData, startAt: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-endAt">End Date & Time (Optional)</Label>
                  <Input
                    id="edit-endAt"
                    type="datetime-local"
                    value={formData.endAt}
                    onChange={(e) => setFormData({...formData, endAt: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-city">City</Label>
                  <Input
                    id="edit-city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="Event city"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-venue">Venue</Label>
                  <Input
                    id="edit-venue"
                    value={formData.venue}
                    onChange={(e) => setFormData({...formData, venue: e.target.value})}
                    placeholder="Event venue"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Event description..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-capacity">Capacity</Label>
                  <Input
                    id="edit-capacity"
                    type="number"
                    min="0"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-seatsRemaining">Seats Remaining</Label>
                  <Input
                    id="edit-seatsRemaining"
                    type="number"
                    min="0"
                    value={formData.seatsRemaining}
                    onChange={(e) => setFormData({...formData, seatsRemaining: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: EventStatus) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-bannerUrl">Banner Image URL</Label>
                <Input
                  id="edit-bannerUrl"
                  value={formData.bannerUrl}
                  onChange={(e) => setFormData({...formData, bannerUrl: e.target.value})}
                  placeholder="https://example.com/banner.jpg"
                />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowEditModal(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-700">
                Update Event
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">View Event</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Title</Label>
                  <p className="text-gray-700">{selectedEvent.title}</p>
                </div>
                <div>
                  <Label className="font-medium">Slug</Label>
                  <p className="text-gray-700">{selectedEvent.slug}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Start Date & Time</Label>
                  <p className="text-gray-700">{formatDate(selectedEvent.startAt)}</p>
                </div>
                <div>
                  <Label className="font-medium">End Date & Time</Label>
                  <p className="text-gray-700">
                    {selectedEvent.endAt ? formatDate(selectedEvent.endAt) : 'Not specified'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">City</Label>
                  <p className="text-gray-700">{selectedEvent.city || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="font-medium">Venue</Label>
                  <p className="text-gray-700">{selectedEvent.venue || 'Not specified'}</p>
                </div>
              </div>
              <div>
                <Label className="font-medium">Description</Label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedEvent.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label className="font-medium">Capacity</Label>
                  <p className="text-gray-700">{selectedEvent.capacity}</p>
                </div>
                <div>
                  <Label className="font-medium">Seats Remaining</Label>
                  <p className="text-gray-700">{selectedEvent.seatsRemaining}</p>
                </div>
                <div>
                  <Label className="font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedEvent.status)}>
                    {selectedEvent.status}
                  </Badge>
                </div>
                <div>
                  <Label className="font-medium">Created</Label>
                  <p className="text-gray-700">{new Date(selectedEvent.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              {selectedEvent.bannerUrl && (
                <div>
                  <Label className="font-medium">Banner Image</Label>
                  <img src={selectedEvent.bannerUrl} alt="Banner" className="mt-2 max-w-full h-48 object-cover rounded-lg" />
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
      {showDeleteModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Delete Event</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete &ldquo;{selectedEvent.title}&rdquo;? This action cannot be undone.
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