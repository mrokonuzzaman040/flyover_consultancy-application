"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Calendar, MapPin, Users, Clock, DollarSign } from "lucide-react"

interface Event {
  _id: string
  title: string
  description: string
  startAt?: string
  endAt?: string
  date?: string
  time?: string
  location?: string
  venue?: string
  city?: string
  capacity?: number
  seatsRemaining?: number
  price?: number
  currency?: string
  isFree?: boolean
  registrationDeadline?: string
  eventType?: string
  category?: string
  organizer?: string
  requirements?: string[]
  locationDetails?: {
    address?: string
    parking?: boolean
    accessibility?: boolean
  }
  onlineDetails?: {
    platform?: string
    meetingLink?: string
    instructions?: string
  }
}

interface EventRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  event: Event | null
}

interface FormData {
  fullName: string
  email: string
  phone: string
  company: string
  jobTitle: string
  country: string
  city: string
  dietaryRequirements: string
  accessibilityNeeds: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  howDidYouHear: string
  expectations: string
  questions: string
}

export default function EventRegistrationModal({ isOpen, onClose, event }: EventRegistrationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    country: "",
    city: "",
    dietaryRequirements: "",
    accessibilityNeeds: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: ""
    },
    howDidYouHear: "",
    expectations: "",
    questions: ""
  })

  const [showEmergencyContact, setShowEmergencyContact] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEmergencyContactChange = (field: keyof FormData['emergencyContact'], value: string) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!event) {
      toast.error("Event not found")
      return
    }

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      const registrationData = {
        eventId: event._id,
        ...formData,
        emergencyContact: showEmergencyContact ? formData.emergencyContact : undefined
      }

      const response = await fetch('/api/event-registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success("Registration successful! You will receive a confirmation email shortly.")
        onClose()
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          company: "",
          jobTitle: "",
          country: "",
          city: "",
          dietaryRequirements: "",
          accessibilityNeeds: "",
          emergencyContact: {
            name: "",
            phone: "",
            relationship: ""
          },
          howDidYouHear: "",
          expectations: "",
          questions: ""
        })
      } else {
        toast.error(result.error || "Failed to register for event")
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!event) return null

  const formatDate = (dateString?: string) => {
    if (!dateString) return "TBD"
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const formatTime = (dateString?: string) => {
    if (!dateString) return "TBD"
    try {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const isRegistrationOpen = () => {
    if (event.registrationDeadline) {
      return new Date(event.registrationDeadline) > new Date()
    }
    return true
  }

  const hasAvailableSeats = () => {
    if (!event.capacity || !event.seatsRemaining) return true
    return event.seatsRemaining > 0
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Register for Event
          </DialogTitle>
        </DialogHeader>

        {/* Event Information */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{event.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(event.startAt || event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formatTime(event.startAt || event.time)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.venue || event.location || "Online Event"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>
                {event.seatsRemaining && event.capacity 
                  ? `${event.seatsRemaining} of ${event.capacity} seats remaining`
                  : "Unlimited seats"
                }
              </span>
            </div>
            {event.price !== undefined && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>
                  {event.isFree ? "Free" : `${event.currency || 'USD'} ${event.price}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Registration Status */}
        {!isRegistrationOpen() && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">Registration is closed</p>
            <p className="text-red-600 text-sm">The registration deadline has passed.</p>
          </div>
        )}

        {!hasAvailableSeats() && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 font-medium">Event is full</p>
            <p className="text-yellow-600 text-sm">All seats have been taken.</p>
          </div>
        )}

        {/* Registration Form */}
        {isRegistrationOpen() && hasAvailableSeats() && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="Enter your country"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Enter your city"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Professional Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Company/Organization</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Enter your company name"
                  />
                </div>
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    placeholder="Enter your job title"
                  />
                </div>
              </div>
            </div>

            {/* Special Requirements */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Special Requirements</h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="dietaryRequirements">Dietary Requirements</Label>
                  <Input
                    id="dietaryRequirements"
                    value={formData.dietaryRequirements}
                    onChange={(e) => handleInputChange('dietaryRequirements', e.target.value)}
                    placeholder="Any dietary restrictions or preferences"
                  />
                </div>
                <div>
                  <Label htmlFor="accessibilityNeeds">Accessibility Needs</Label>
                  <Input
                    id="accessibilityNeeds"
                    value={formData.accessibilityNeeds}
                    onChange={(e) => handleInputChange('accessibilityNeeds', e.target.value)}
                    placeholder="Any accessibility requirements"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emergencyContact"
                  checked={showEmergencyContact}
                  onCheckedChange={setShowEmergencyContact}
                />
                <Label htmlFor="emergencyContact">Provide emergency contact information</Label>
              </div>
              
              {showEmergencyContact && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor="emergencyName">Contact Name</Label>
                    <Input
                      id="emergencyName"
                      value={formData.emergencyContact.name}
                      onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                      placeholder="Emergency contact name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">Contact Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                      placeholder="Emergency contact phone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyRelationship">Relationship</Label>
                    <Input
                      id="emergencyRelationship"
                      value={formData.emergencyContact.relationship}
                      onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                      placeholder="Relationship to you"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Additional Information</h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="howDidYouHear">How did you hear about this event?</Label>
                  <Select value={formData.howDidYouHear} onValueChange={(value) => handleInputChange('howDidYouHear', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="social-media">Social Media</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="friend">Friend/Colleague</SelectItem>
                      <SelectItem value="search">Search Engine</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="expectations">What are your expectations for this event?</Label>
                  <Textarea
                    id="expectations"
                    value={formData.expectations}
                    onChange={(e) => handleInputChange('expectations', e.target.value)}
                    placeholder="Tell us what you hope to learn or achieve"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="questions">Do you have any questions?</Label>
                  <Textarea
                    id="questions"
                    value={formData.questions}
                    onChange={(e) => handleInputChange('questions', e.target.value)}
                    placeholder="Any questions about the event"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand-600 hover:bg-brand-700"
              >
                {isSubmitting ? 'Registering...' : 'Register for Event'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
