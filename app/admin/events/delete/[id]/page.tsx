"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Trash2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

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

export default function DeleteEventPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchEvent()
  }, [id])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/admin/events/${id}`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data.event)
      } else {
        toast.error('Failed to fetch event')
        router.push('/admin/events')
      }
    } catch (error) {
      console.error('Error fetching event:', error)
      toast.error('Error fetching event')
      router.push('/admin/events')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!event) return
    
    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/events/${event.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Event deleted successfully')
        router.push('/admin/events')
      } else {
        toast.error('Failed to delete event')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error('Error deleting event')
    } finally {
      setDeleting(false)
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
        <h1 className="text-3xl font-bold text-gray-900">Delete Event</h1>
      </div>

      <Card className="border-brand-200">
        <CardHeader className="bg-brand-50">
          <CardTitle className="text-brand-800 flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Confirm Deletion
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 font-medium mb-2">
                ⚠️ Warning: This action cannot be undone
              </p>
              <p className="text-yellow-700 text-sm">
                You are about to permanently delete this event. All associated data will be lost.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-gray-900">Event Details:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Title:</span>
                  <p className="text-gray-900">{event.title}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Slug:</span>
                  <p className="text-gray-900">{event.slug}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Start Date:</span>
                  <p className="text-gray-900">
                    {new Date(event.startAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Status:</span>
                  <p className="text-gray-900 capitalize">{event.status}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Capacity:</span>
                  <p className="text-gray-900">{event.capacity}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Seats Remaining:</span>
                  <p className="text-gray-900">{event.seatsRemaining}</p>
                </div>
              </div>
              {event.venue && (
                <div>
                  <span className="font-medium text-gray-600">Venue:</span>
                  <p className="text-gray-900">{event.venue}</p>
                </div>
              )}
              {event.city && (
                <div>
                  <span className="font-medium text-gray-600">City:</span>
                  <p className="text-gray-900">{event.city}</p>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-600">Description:</span>
                <p className="text-gray-900 mt-1">{event.description}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Link href="/admin/events">
                <Button variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button 
                onClick={handleDelete}
                disabled={deleting}
                className="bg-brand-600 hover:bg-brand-700 text-white"
              >
                {deleting ? 'Deleting...' : 'Delete Event'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
