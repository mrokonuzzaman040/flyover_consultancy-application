"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Calendar, MapPin, Users } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"

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

export default function ViewEventPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

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
      toast.error('Error fetching event')
      router.push('/admin/events')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-brand-100 text-brand-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/events">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Event Details</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/events/edit/${event.id}`}>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Link href={`/admin/events/delete/${event.id}`}>
            <Button variant="outline" size="sm" className="text-brand-600 hover:text-brand-700">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{event.title}</CardTitle>
                  <p className="text-gray-600 mt-1">Slug: {event.slug}</p>
                </div>
                <Badge className={getStatusColor(event.status)}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {event.bannerUrl && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src={event.bannerUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Event Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium text-gray-600">Start Date & Time:</span>
                <p className="text-gray-900">
                  {new Date(event.startAt).toLocaleString()}
                </p>
              </div>
              {event.endAt && (
                <div>
                  <span className="font-medium text-gray-600">End Date & Time:</span>
                  <p className="text-gray-900">
                    {new Date(event.endAt).toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {(event.venue || event.city) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Capacity & Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium text-gray-600">Total Capacity:</span>
                <p className="text-gray-900">{event.capacity.toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Seats Remaining:</span>
                <p className="text-gray-900">{event.seatsRemaining.toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Seats Sold:</span>
                <p className="text-gray-900">
                  {(event.capacity - event.seatsRemaining).toLocaleString()}
                </p>
              </div>
              <div className="pt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-brand-600 h-2 rounded-full" 
                    style={{ 
                      width: `${((event.capacity - event.seatsRemaining) / event.capacity) * 100}%` 
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {Math.round(((event.capacity - event.seatsRemaining) / event.capacity) * 100)}% sold
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium text-gray-600">Event ID:</span>
                <p className="text-gray-900 font-mono text-sm">{event.id}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Created:</span>
                <p className="text-gray-900">
                  {new Date(event.createdAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
