'use client'

import { useState } from 'react'
import { X, Calendar, Clock, User, Phone, Mail, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface ScheduleMeetingModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  fullName: string
  phoneNumber: string
  email: string
  date: string
  time: string
  message: string
  preferredService: string
  urgency: string
}

export default function ScheduleMeetingModal({ isOpen, onClose }: ScheduleMeetingModalProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    email: '',
    date: '',
    time: '',
    message: '',
    preferredService: '',
    urgency: 'LOW'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get tomorrow's date as minimum selectable date
  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Form submitted with data:', formData)
    
    // Validation
    if (!formData.fullName || !formData.phoneNumber || !formData.date || !formData.time) {
      toast.error('Please fill in all required fields')
      return
    }

    // Check if date is not today
    const selectedDate = new Date(formData.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    selectedDate.setHours(0, 0, 0, 0)
    
    if (selectedDate <= today) {
      toast.error('Please select a date from tomorrow onwards')
      return
    }

    setIsSubmitting(true)

    try {
      const requestData = {
        ...formData,
        scheduledDateTime: `${formData.date}T${formData.time}:00.000Z`
      }
      
      console.log('Sending request with data:', requestData)
      console.log('API URL:', '/api/schedule-meeting')
      
      const response = await fetch('/api/schedule-meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      let responseData
      try {
        responseData = await response.json()
        console.log('Response data:', responseData)
      } catch (parseError) {
        console.error('Error parsing response:', parseError)
        toast.error('Invalid response from server')
        return
      }

      if (response.ok) {
        toast.success('Meeting scheduled successfully! We will contact you soon.')
        setFormData({
          fullName: '',
          phoneNumber: '',
          email: '',
          date: '',
          time: '',
          message: '',
          preferredService: '',
          urgency: 'LOW'
        })
        onClose()
      } else {
        console.error('API Error:', responseData)
        toast.error(responseData.message || responseData.error || 'Failed to schedule meeting')
      }
    } catch (error) {
      console.error('Error scheduling meeting:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Schedule a Meeting</h2>
              <p className="text-gray-600 mt-1">Book a consultation with our experts</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName" className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4" />
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phoneNumber" className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4" />
                  Phone Number *
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4" />
                Email (Optional)
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  Preferred Date *
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={getTomorrowDate()}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="time" className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" />
                  Preferred Time *
                </Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preferredService" className="mb-2 block">
                  Preferred Service
                </Label>
                <select
                  id="preferredService"
                  name="preferredService"
                  value={formData.preferredService}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Select a service</option>
                  <option value="study-consultation">Study Consultation</option>
                  <option value="application-support">Application Support</option>
                  <option value="visa-assistance">Visa Assistance</option>
                  <option value="course-selection">Course Selection</option>
                  <option value="general-inquiry">General Inquiry</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="urgency" className="mb-2 block">
                  Urgency Level
                </Label>
                <select
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="message" className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4" />
                Message
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us more about your requirements or any specific questions you have..."
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-brand-600 hover:bg-brand-700"
              >
                {isSubmitting ? 'Scheduling...' : 'Schedule Meeting'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}