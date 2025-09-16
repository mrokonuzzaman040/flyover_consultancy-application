"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import DataTable from "@/components/admin/DataTable"
import EmptyState from "@/components/admin/EmptyState"
import PageHeader from "@/components/admin/PageHeader"
import { toast } from "sonner"
import { Search, Filter, Download, CheckCircle, XCircle, Clock, User, Mail, Phone, Calendar, MapPin } from "lucide-react"

interface EventRegistration {
  _id: string
  eventId: string
  eventTitle: string
  fullName: string
  email: string
  phone: string
  company?: string
  jobTitle?: string
  country?: string
  city?: string
  registrationDate: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'attended' | 'no-show'
  paymentStatus?: 'pending' | 'paid' | 'refunded' | 'failed'
  paymentAmount?: number
  checkedInAt?: string
  checkedInBy?: string
  notes?: string
  dietaryRequirements?: string
  accessibilityNeeds?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  howDidYouHear?: string
  expectations?: string
  questions?: string
}

export default function EventRegistrationsPage() {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [eventFilter, setEventFilter] = useState("")
  const [selectedRegistration, setSelectedRegistration] = useState<EventRegistration | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editNotes, setEditNotes] = useState("")
  const [editStatus, setEditStatus] = useState<EventRegistration['status']>('pending')

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/event-registrations')
      if (response.ok) {
        const data = await response.json()
        setRegistrations(data.registrations || [])
      } else {
        toast.error('Failed to fetch registrations')
      }
    } catch (error) {
      console.error('Error fetching registrations:', error)
      toast.error('Error fetching registrations')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (registrationId: string, newStatus: EventRegistration['status']) => {
    try {
      const response = await fetch(`/api/event-registrations/${registrationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success('Registration status updated')
        fetchRegistrations()
      } else {
        toast.error('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Error updating status')
    }
  }

  const handleCheckIn = async (registrationId: string) => {
    try {
      const response = await fetch(`/api/event-registrations/${registrationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'attended',
          checkedInAt: new Date().toISOString(),
          checkedInBy: 'Admin' // In a real app, this would be the current user
        }),
      })

      if (response.ok) {
        toast.success('Registration checked in')
        fetchRegistrations()
      } else {
        toast.error('Failed to check in')
      }
    } catch (error) {
      console.error('Error checking in:', error)
      toast.error('Error checking in')
    }
  }

  const handleEditNotes = async () => {
    if (!selectedRegistration) return

    try {
      const response = await fetch(`/api/event-registrations/${selectedRegistration._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          notes: editNotes,
          status: editStatus
        }),
      })

      if (response.ok) {
        toast.success('Registration updated')
        setIsEditModalOpen(false)
        setSelectedRegistration(null)
        fetchRegistrations()
      } else {
        toast.error('Failed to update registration')
      }
    } catch (error) {
      console.error('Error updating registration:', error)
      toast.error('Error updating registration')
    }
  }

  const getStatusBadge = (status: EventRegistration['status']) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
      attended: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'no-show': { color: 'bg-gray-100 text-gray-800', icon: XCircle }
    }

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (status?: EventRegistration['paymentStatus']) => {
    if (!status) return null

    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800' },
      paid: { color: 'bg-green-100 text-green-800' },
      refunded: { color: 'bg-blue-100 text-blue-800' },
      failed: { color: 'bg-red-100 text-red-800' }
    }

    const config = statusConfig[status]

    return (
      <Badge className={config.color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = 
      reg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.company?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !statusFilter || reg.status === statusFilter
    const matchesEvent = !eventFilter || reg.eventId === eventFilter

    return matchesSearch && matchesStatus && matchesEvent
  })

  const columns = [
    {
      key: 'attendee',
      header: 'Attendee',
      render: (reg: EventRegistration) => (
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{reg.fullName}</div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <Mail className="w-3 h-3" />
            {reg.email}
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <Phone className="w-3 h-3" />
            {reg.phone}
          </div>
        </div>
      )
    },
    {
      key: 'event',
      header: 'Event',
      render: (reg: EventRegistration) => (
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{reg.eventTitle}</div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(reg.registrationDate).toLocaleDateString()}
          </div>
        </div>
      )
    },
    {
      key: 'company',
      header: 'Company',
      render: (reg: EventRegistration) => (
        <div className="space-y-1">
          {reg.company && <div className="font-medium">{reg.company}</div>}
          {reg.jobTitle && <div className="text-sm text-gray-500">{reg.jobTitle}</div>}
          {reg.country && reg.city && (
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {reg.city}, {reg.country}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (reg: EventRegistration) => (
        <div className="space-y-2">
          {getStatusBadge(reg.status)}
          {getPaymentStatusBadge(reg.paymentStatus)}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (reg: EventRegistration) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedRegistration(reg)
              setIsViewModalOpen(true)
            }}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedRegistration(reg)
              setEditNotes(reg.notes || '')
              setEditStatus(reg.status)
              setIsEditModalOpen(true)
            }}
          >
            Edit
          </Button>
          {reg.status === 'confirmed' && (
            <Button
              size="sm"
              onClick={() => handleCheckIn(reg._id)}
              className="bg-green-600 hover:bg-green-700"
            >
              Check In
            </Button>
          )}
        </div>
      )
    }
  ]

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
        title="Event Registrations"
        description="Manage and track event registrations"
      />

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search registrations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="attended">Attended</SelectItem>
                  <SelectItem value="no-show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="event">Event</Label>
              <Select value={eventFilter} onValueChange={setEventFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All events</SelectItem>
                  {Array.from(new Set(registrations.map(r => r.eventId))).map(eventId => {
                    const event = registrations.find(r => r.eventId === eventId)
                    return (
                      <SelectItem key={eventId} value={eventId}>
                        {event?.eventTitle}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("")
                  setEventFilter("")
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registrations Table */}
      {filteredRegistrations.length === 0 ? (
        <EmptyState
          title="No registrations found"
          description="No event registrations match your current filters."
        />
      ) : (
        <DataTable
          data={filteredRegistrations}
          columns={columns}
          rowKey={(reg) => reg._id}
        />
      )}

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {selectedRegistration.fullName}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {selectedRegistration.email}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {selectedRegistration.phone}
                  </div>
                  <div>
                    <span className="font-medium">Country:</span> {selectedRegistration.country || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">City:</span> {selectedRegistration.city || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              {(selectedRegistration.company || selectedRegistration.jobTitle) && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Professional Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selectedRegistration.company && (
                      <div>
                        <span className="font-medium">Company:</span> {selectedRegistration.company}
                      </div>
                    )}
                    {selectedRegistration.jobTitle && (
                      <div>
                        <span className="font-medium">Job Title:</span> {selectedRegistration.jobTitle}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Event Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Event Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Event:</span> {selectedRegistration.eventTitle}
                  </div>
                  <div>
                    <span className="font-medium">Registration Date:</span> {new Date(selectedRegistration.registrationDate).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> {getStatusBadge(selectedRegistration.status)}
                  </div>
                  {selectedRegistration.paymentStatus && (
                    <div>
                      <span className="font-medium">Payment:</span> {getPaymentStatusBadge(selectedRegistration.paymentStatus)}
                    </div>
                  )}
                </div>
              </div>

              {/* Special Requirements */}
              {(selectedRegistration.dietaryRequirements || selectedRegistration.accessibilityNeeds) && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Special Requirements</h4>
                  <div className="space-y-2 text-sm">
                    {selectedRegistration.dietaryRequirements && (
                      <div>
                        <span className="font-medium">Dietary:</span> {selectedRegistration.dietaryRequirements}
                      </div>
                    )}
                    {selectedRegistration.accessibilityNeeds && (
                      <div>
                        <span className="font-medium">Accessibility:</span> {selectedRegistration.accessibilityNeeds}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              {(selectedRegistration.howDidYouHear || selectedRegistration.expectations || selectedRegistration.questions) && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Additional Information</h4>
                  <div className="space-y-2 text-sm">
                    {selectedRegistration.howDidYouHear && (
                      <div>
                        <span className="font-medium">How did you hear:</span> {selectedRegistration.howDidYouHear}
                      </div>
                    )}
                    {selectedRegistration.expectations && (
                      <div>
                        <span className="font-medium">Expectations:</span> {selectedRegistration.expectations}
                      </div>
                    )}
                    {selectedRegistration.questions && (
                      <div>
                        <span className="font-medium">Questions:</span> {selectedRegistration.questions}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Emergency Contact */}
              {selectedRegistration.emergencyContact && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Emergency Contact</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {selectedRegistration.emergencyContact.name}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {selectedRegistration.emergencyContact.phone}
                    </div>
                    <div>
                      <span className="font-medium">Relationship:</span> {selectedRegistration.emergencyContact.relationship}
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedRegistration.notes && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Notes</h4>
                  <p className="text-sm text-gray-600">{selectedRegistration.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Registration</DialogTitle>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={editStatus} onValueChange={(value: EventRegistration['status']) => setEditStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="attended">Attended</SelectItem>
                    <SelectItem value="no-show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add notes about this registration..."
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditNotes} className="bg-brand-600 hover:bg-brand-700">
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
