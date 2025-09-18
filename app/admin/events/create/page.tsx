"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, MapPin, Users, Calendar, Clock } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import ImageBBUpload from "@/components/admin/ImageBBUpload"

type EventStatus = "draft" | "published" | "cancelled" | "completed"

export default function CreateEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleImageUpload = (image: { url: string; name: string; size: number }) => {
    setFormData(prev => ({
      ...prev,
      bannerUrl: image.url
    }));
    toast.success('Image uploaded successfully!');
  };

  const handleImageRemove = () => {
    setFormData(prev => ({
      ...prev,
      bannerUrl: ''
    }));
    toast.success('Image removed successfully!');
  };
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const sanitizedSlug = (formData.slug || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const payload: Record<string, unknown> = {
        ...formData,
        slug: sanitizedSlug,
        capacity: Number(formData.capacity),
        seatsRemaining: Number(formData.seatsRemaining),
        price: Number(formData.price),
        maxAttendees: Number(formData.maxAttendees),
        minAttendees: Number(formData.minAttendees)
      }
      
      // Clean up empty fields
      if (!payload.bannerUrl) delete payload.bannerUrl
      if (!payload.organizer) delete payload.organizer
      if (!payload.organizerEmail) delete payload.organizerEmail
      if (!payload.organizerPhone) delete payload.organizerPhone
      if (!payload.registrationDeadline) delete payload.registrationDeadline
      if (Array.isArray(payload.targetAudience) && payload.targetAudience.length === 0) delete payload.targetAudience
      if (Array.isArray(payload.requirements) && payload.requirements.length === 0) delete payload.requirements
      if (Array.isArray(payload.agenda) && payload.agenda.length === 0) delete payload.agenda
      if (Array.isArray(payload.speakers) && payload.speakers.length === 0) delete payload.speakers
      if (Array.isArray(payload.tags) && payload.tags.length === 0) delete payload.tags
      if (Array.isArray(payload.materials) && payload.materials.length === 0) delete payload.materials
      
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast.success('Event created successfully')
        router.push('/admin/events')
      } else {
        toast.error('Failed to create event')
      }
    } catch {
      toast.error('Error creating event')
    } finally {
      setLoading(false)
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="eventType">Event Type</Label>
                <Select value={formData.eventType} onValueChange={(value) => setFormData({...formData, eventType: value as typeof formData.eventType})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="exhibition">Exhibition</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value as typeof formData.category})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="career">Career</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="information">Information</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value as typeof formData.priority})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
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

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({...formData, featured: !!checked})}
              />
              <Label htmlFor="featured">Featured Event</Label>
            </div>
          </CardContent>
        </Card>

        {/* Date & Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Date & Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                <Label htmlFor="endAt">End Date & Time</Label>
                <Input
                  id="endAt"
                  type="datetime-local"
                  value={formData.endAt}
                  onChange={(e) => setFormData({...formData, endAt: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="registrationDeadline">Registration Deadline</Label>
              <Input
                id="registrationDeadline"
                type="datetime-local"
                value={formData.registrationDeadline}
                onChange={(e) => setFormData({...formData, registrationDeadline: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.locationDetails.address}
                onChange={(e) => setFormData({
                  ...formData, 
                  locationDetails: {...formData.locationDetails, address: e.target.value}
                })}
                placeholder="Full address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  value={formData.locationDetails.coordinates.lat}
                  onChange={(e) => setFormData({
                    ...formData, 
                    locationDetails: {
                      ...formData.locationDetails, 
                      coordinates: {...formData.locationDetails.coordinates, lat: parseFloat(e.target.value) || 0}
                    }
                  })}
                  placeholder="0.000000"
                />
              </div>
              <div>
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  type="number"
                  step="any"
                  value={formData.locationDetails.coordinates.lng}
                  onChange={(e) => setFormData({
                    ...formData, 
                    locationDetails: {
                      ...formData.locationDetails, 
                      coordinates: {...formData.locationDetails.coordinates, lng: parseFloat(e.target.value) || 0}
                    }
                  })}
                  placeholder="0.000000"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="parking"
                  checked={formData.locationDetails.parking}
                  onCheckedChange={(checked) => setFormData({
                    ...formData, 
                    locationDetails: {...formData.locationDetails, parking: !!checked}
                  })}
                />
                <Label htmlFor="parking">Parking Available</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="accessibility"
                  checked={formData.locationDetails.accessibility}
                  onCheckedChange={(checked) => setFormData({
                    ...formData, 
                    locationDetails: {...formData.locationDetails, accessibility: !!checked}
                  })}
                />
                <Label htmlFor="accessibility">Accessible</Label>
              </div>
            </div>
            <div>
              <Label htmlFor="directions">Directions</Label>
              <Textarea
                id="directions"
                value={formData.locationDetails.directions}
                onChange={(e) => setFormData({
                  ...formData, 
                  locationDetails: {...formData.locationDetails, directions: e.target.value}
                })}
                placeholder="Directions to the venue..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Online Details */}
        <Card>
          <CardHeader>
            <CardTitle>Online Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Input
                  id="platform"
                  value={formData.onlineDetails.platform}
                  onChange={(e) => setFormData({
                    ...formData, 
                    onlineDetails: {...formData.onlineDetails, platform: e.target.value}
                  })}
                  placeholder="Zoom, Teams, etc."
                />
              </div>
              <div>
                <Label htmlFor="meetingLink">Meeting Link</Label>
                <Input
                  id="meetingLink"
                  value={formData.onlineDetails.meetingLink}
                  onChange={(e) => setFormData({
                    ...formData, 
                    onlineDetails: {...formData.onlineDetails, meetingLink: e.target.value}
                  })}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="meetingId">Meeting ID</Label>
                <Input
                  id="meetingId"
                  value={formData.onlineDetails.meetingId}
                  onChange={(e) => setFormData({
                    ...formData, 
                    onlineDetails: {...formData.onlineDetails, meetingId: e.target.value}
                  })}
                  placeholder="Meeting ID"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  value={formData.onlineDetails.password}
                  onChange={(e) => setFormData({
                    ...formData, 
                    onlineDetails: {...formData.onlineDetails, password: e.target.value}
                  })}
                  placeholder="Meeting password"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                value={formData.onlineDetails.instructions}
                onChange={(e) => setFormData({
                  ...formData, 
                  onlineDetails: {...formData.onlineDetails, instructions: e.target.value}
                })}
                placeholder="Instructions for joining the online event..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Capacity & Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Capacity & Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                <Label htmlFor="maxAttendees">Max Attendees</Label>
                <Input
                  id="maxAttendees"
                  type="number"
                  min="1"
                  value={formData.maxAttendees}
                  onChange={(e) => setFormData({...formData, maxAttendees: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="minAttendees">Min Attendees</Label>
                <Input
                  id="minAttendees"
                  type="number"
                  min="1"
                  value={formData.minAttendees}
                  onChange={(e) => setFormData({...formData, minAttendees: parseInt(e.target.value) || 1})}
                  placeholder="1"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
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
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData({...formData, currency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="BDT">BDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFree"
                checked={formData.isFree}
                onCheckedChange={(checked) => setFormData({...formData, isFree: !!checked})}
              />
              <Label htmlFor="isFree">Free Event</Label>
            </div>
          </CardContent>
        </Card>

        {/* Organizer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Organizer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="organizer">Organizer Name</Label>
                <Input
                  id="organizer"
                  value={formData.organizer}
                  onChange={(e) => setFormData({...formData, organizer: e.target.value})}
                  placeholder="Organizer name"
                />
              </div>
              <div>
                <Label htmlFor="organizerEmail">Organizer Email</Label>
                <Input
                  id="organizerEmail"
                  type="email"
                  value={formData.organizerEmail}
                  onChange={(e) => setFormData({...formData, organizerEmail: e.target.value})}
                  placeholder="organizer@example.com"
                />
              </div>
              <div>
                <Label htmlFor="organizerPhone">Organizer Phone</Label>
                <Input
                  id="organizerPhone"
                  value={formData.organizerPhone}
                  onChange={(e) => setFormData({...formData, organizerPhone: e.target.value})}
                  placeholder="+1234567890"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media & Social */}
        <Card>
          <CardHeader>
            <CardTitle>Media & Social</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Banner Image</Label>
              <ImageBBUpload
                onUpload={handleImageUpload}
                onRemove={handleImageRemove}
                currentImage={formData.bannerUrl}
                label="Upload Event Banner"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={formData.socialMedia.facebook}
                  onChange={(e) => setFormData({
                    ...formData, 
                    socialMedia: {...formData.socialMedia, facebook: e.target.value}
                  })}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={formData.socialMedia.twitter}
                  onChange={(e) => setFormData({
                    ...formData, 
                    socialMedia: {...formData.socialMedia, twitter: e.target.value}
                  })}
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={formData.socialMedia.linkedin}
                  onChange={(e) => setFormData({
                    ...formData, 
                    socialMedia: {...formData.socialMedia, linkedin: e.target.value}
                  })}
                  placeholder="https://linkedin.com/..."
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.socialMedia.instagram}
                  onChange={(e) => setFormData({
                    ...formData, 
                    socialMedia: {...formData.socialMedia, instagram: e.target.value}
                  })}
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="status">Event Status</Label>
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
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3">
          <Link href="/admin/events">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading} className="bg-brand-600 hover:bg-brand-700">
            {loading ? 'Creating...' : 'Create Event'}
          </Button>
        </div>
      </form>
    </div>
  )
}
