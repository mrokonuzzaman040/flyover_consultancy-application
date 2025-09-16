"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Event {
  _id?: string
  id: string
  title: string
  slug: string
  description: string
  // Legacy fields
  date?: string
  time?: string
  location?: string
  image?: string
  registrationLink?: string
  type?: string
  attendees?: string
  featured?: boolean
  icon?: string
  color?: string
  // New fields
  startAt?: string
  endAt?: string
  venue?: string
  city?: string
  bannerUrl?: string
  status: string
  capacity: number
  seatsRemaining: number
  // Enhanced fields
  eventType?: string
  category?: string
  targetAudience?: string[]
  organizer?: string
  organizerEmail?: string
  organizerPhone?: string
  price?: number
  currency?: string
  isFree?: boolean
  registrationDeadline?: string
  maxAttendees?: number
  minAttendees?: number
  requirements?: string[]
  agenda?: Array<{ time: string; title: string; description?: string; speaker?: string }>
  speakers?: Array<{ name: string; title: string; company?: string; bio?: string; image?: string; socialLinks?: { linkedin?: string; twitter?: string; website?: string } }>
  tags?: string[]
  priority?: string
  locationDetails?: {
    address?: string
    coordinates?: { lat: number; lng: number }
    parking?: boolean
    accessibility?: boolean
    directions?: string
  }
  onlineDetails?: {
    platform?: string
    meetingLink?: string
    meetingId?: string
    password?: string
    instructions?: string
  }
  materials?: Array<{ title: string; type: string; url: string; description?: string }>
  socialMedia?: {
    facebook?: string
    twitter?: string
    linkedin?: string
    instagram?: string
  }
  createdAt: string
  updatedAt: string
}

type EventStatus = "draft" | "published" | "cancelled" | "completed"

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
    seatsRemaining: 0,
    // Enhanced fields
    eventType: "other" as "workshop" | "seminar" | "conference" | "webinar" | "fair" | "exhibition" | "networking" | "other",
    category: "education" as "education" | "career" | "networking" | "training" | "information" | "other",
    targetAudience: [] as string[],
    organizer: "",
    organizerEmail: "",
    organizerPhone: "",
    price: 0,
    currency: "USD",
    isFree: true,
    registrationDeadline: "",
    maxAttendees: 0,
    minAttendees: 1,
    requirements: [] as string[],
    agenda: [] as Array<{ time: string; title: string; description?: string; speaker?: string }>,
    speakers: [] as Array<{ name: string; title: string; company?: string; bio?: string; image?: string; socialLinks?: { linkedin?: string; twitter?: string; website?: string } }>,
    tags: [] as string[],
    featured: false,
    priority: "medium" as "low" | "medium" | "high",
    locationDetails: {
      address: "",
      coordinates: { lat: 0, lng: 0 },
      parking: false,
      accessibility: false,
      directions: ""
    },
    onlineDetails: {
      platform: "",
      meetingLink: "",
      meetingId: "",
      password: "",
      instructions: ""
    },
    materials: [] as Array<{ title: string; type: "document" | "video" | "link" | "other"; url: string; description?: string }>,
    socialMedia: {
      facebook: "",
      twitter: "",
      linkedin: "",
      instagram: ""
    }
  })

  useEffect(() => {
    fetchEvent()
  }, [id])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/admin/events/${id}`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data.event)
        // Handle both legacy and new data structures
        const event = data.event;
        let startAtValue = "";
        let endAtValue = "";
        
        if (event.startAt) {
          startAtValue = new Date(event.startAt).toISOString().slice(0, 16);
        } else if (event.date && event.time) {
          // Convert legacy date/time to datetime-local format
          try {
            const dateTimeString = `${event.date} ${event.time}`;
            startAtValue = new Date(dateTimeString).toISOString().slice(0, 16);
          } catch (error) {
            console.error('Error parsing legacy date/time:', error);
          }
        }
        
        if (event.endAt) {
          endAtValue = new Date(event.endAt).toISOString().slice(0, 16);
        }

        setFormData({
          title: event.title,
          slug: event.slug || "",
          startAt: startAtValue,
          endAt: endAtValue,
          venue: event.venue || "",
          city: event.city || event.location || "",
          description: event.description,
          bannerUrl: event.bannerUrl || event.image || "",
          status: (event.status || "published") as EventStatus,
          capacity: event.capacity || 0,
          seatsRemaining: event.seatsRemaining || 0,
          // Enhanced fields
          eventType: event.eventType || "other",
          category: event.category || "education",
          targetAudience: event.targetAudience || [],
          organizer: event.organizer || "",
          organizerEmail: event.organizerEmail || "",
          organizerPhone: event.organizerPhone || "",
          price: event.price || 0,
          currency: event.currency || "USD",
          isFree: event.isFree !== undefined ? event.isFree : true,
          registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline).toISOString().slice(0, 16) : "",
          maxAttendees: event.maxAttendees || 0,
          minAttendees: event.minAttendees || 1,
          requirements: event.requirements || [],
          agenda: event.agenda || [],
          speakers: event.speakers || [],
          tags: event.tags || [],
          featured: event.featured || false,
          priority: event.priority || "medium",
          locationDetails: {
            address: event.locationDetails?.address || "",
            coordinates: {
              lat: event.locationDetails?.coordinates?.lat || 0,
              lng: event.locationDetails?.coordinates?.lng || 0
            },
            parking: event.locationDetails?.parking || false,
            accessibility: event.locationDetails?.accessibility || false,
            directions: event.locationDetails?.directions || ""
          },
          onlineDetails: {
            platform: event.onlineDetails?.platform || "",
            meetingLink: event.onlineDetails?.meetingLink || "",
            meetingId: event.onlineDetails?.meetingId || "",
            password: event.onlineDetails?.password || "",
            instructions: event.onlineDetails?.instructions || ""
          },
          materials: event.materials || [],
          socialMedia: {
            facebook: event.socialMedia?.facebook || "",
            twitter: event.socialMedia?.twitter || "",
            linkedin: event.socialMedia?.linkedin || "",
            instagram: event.socialMedia?.instagram || ""
          }
        })
      } else {
        toast.error('Failed to fetch event')
        router.push('/admin/events')
      }
    } catch (error) {
      toast.error('Error fetching event')
      router.push('/admin/events')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Convert datetime-local back to legacy format if needed
      const updateData: any = {
        ...formData,
        capacity: Number(formData.capacity),
        seatsRemaining: Number(formData.seatsRemaining),
        price: Number(formData.price),
        maxAttendees: Number(formData.maxAttendees),
        minAttendees: Number(formData.minAttendees)
      };

      // If we have startAt, also update legacy date/time fields
      if (formData.startAt) {
        const startDate = new Date(formData.startAt);
        updateData.date = startDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        updateData.time = startDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }

      // Clean up empty fields
      if (!updateData.bannerUrl) delete updateData.bannerUrl
      if (!updateData.organizer) delete updateData.organizer
      if (!updateData.organizerEmail) delete updateData.organizerEmail
      if (!updateData.organizerPhone) delete updateData.organizerPhone
      if (!updateData.registrationDeadline) delete updateData.registrationDeadline
      if (updateData.targetAudience.length === 0) delete updateData.targetAudience
      if (updateData.requirements.length === 0) delete updateData.requirements
      if (updateData.agenda.length === 0) delete updateData.agenda
      if (updateData.speakers.length === 0) delete updateData.speakers
      if (updateData.tags.length === 0) delete updateData.tags
      if (updateData.materials.length === 0) delete updateData.materials

      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        toast.success('Event updated successfully')
        router.push('/admin/events')
      } else {
        toast.error('Failed to update event')
      }
    } catch (error) {
      toast.error('Error updating event')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-4">The event you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/admin/events">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/events">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Event title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  placeholder="event-slug"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startAt">Start Date & Time *</Label>
                <Input
                  id="startAt"
                  type="datetime-local"
                  value={formData.startAt}
                  onChange={(e) => setFormData({...formData, startAt: e.target.value})}
                  required
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
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Event description..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="0"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 0})}
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="seatsRemaining">Seats Remaining *</Label>
                <Input
                  id="seatsRemaining"
                  type="number"
                  min="0"
                  value={formData.seatsRemaining}
                  onChange={(e) => setFormData({...formData, seatsRemaining: parseInt(e.target.value) || 0})}
                  placeholder="0"
                  required
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

            <div className="flex justify-end gap-3">
              <Link href="/admin/events">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={saving} className="bg-brand-600 hover:bg-brand-700">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
