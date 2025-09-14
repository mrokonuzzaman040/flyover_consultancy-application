"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit, Eye, Plus, Search, Filter, Calendar, MapPin, Users } from "lucide-react"
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

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

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
      console.error('Error fetching events:', error)
      toast.error('Error fetching events')
    } finally {
      setLoading(false)
    }
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
      case "cancelled": return "bg-brand-100 text-brand-800"
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
        <Link href="/admin/events/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </Link>
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
                  <Link href={`/events/${event.slug}`}>
                    <Button
                      size="sm"
                      variant="outline"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/events/edit/${event.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/events/delete/${event.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-brand-600 hover:text-brand-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </Link>
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








    </div>
  )
}