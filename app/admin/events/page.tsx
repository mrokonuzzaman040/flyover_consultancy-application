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
import PageHeader from "@/components/admin/PageHeader"
import DataTable from "@/components/admin/DataTable"
import ListToolbar from "@/components/admin/ListToolbar"
import EmptyState from "@/components/admin/EmptyState"

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
  createdAt: string
  updatedAt: string
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

  const formatDate = (event: Event) => {
    // Use startAt if available, otherwise use legacy date/time
    if (event.startAt) {
      return new Date(event.startAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } else if (event.date) {
      return event.date + (event.time ? ` ${event.time}` : '')
    }
    return 'No date set'
  }

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
        title="Events Management"
        description="Publish and manage your events"
        actions={(
          <Link href="/admin/events/create">
            <Button className="bg-brand-600 hover:bg-brand-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </Link>
        )}
      />

      {/* Filters */}
      <ListToolbar search={searchTerm} onSearchChange={setSearchTerm} searchPlaceholder="Search events...">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
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
      </ListToolbar>

      {filteredEvents.length === 0 ? (
        <EmptyState title="No events found" description="Try adjusting your search or filters" />
      ) : (
        <DataTable
          columns={[
            { key: 'title', header: 'Title', render: (e: Event) => (
              <div className="flex flex-col">
                <span className="font-medium text-slate-900 line-clamp-1">{e.title}</span>
                <span className="text-xs text-slate-500 line-clamp-1">{e.description}</span>
              </div>
            )},
            { key: 'when', header: 'When', hideOn: 'sm', render: (e: Event) => (
              <div className="text-slate-600 flex items-center gap-2"><Calendar className="w-4 h-4" />{formatDate(e)}</div>
            )},
            { key: 'where', header: 'Where', hideOn: 'md', render: (e: Event) => (
              <div className="text-slate-600 flex items-center gap-2"><MapPin className="w-4 h-4" />{e.location || e.city || '-'}{e.venue ? `, ${e.venue}` : ''}</div>
            )},
            { key: 'status', header: 'Status', hideOn: 'lg', render: (e: Event) => <Badge className={getStatusColor(e.status)}>{e.status}</Badge> },
            { key: 'capacity', header: 'Seats', hideOn: 'lg', render: (e: Event) => (
              <div className="text-slate-600 flex items-center gap-2"><Users className="w-4 h-4" />{e.seatsRemaining}/{e.capacity}</div>
            ) },
            { key: 'actions', header: 'Actions', headerClassName: 'text-right', cellClassName: 'text-right', render: (e: Event) => (
              <div className="flex justify-end gap-2">
                <Link href={`/events/${e.slug}`}>
                  <Button size="sm" variant="outline"><Eye className="w-4 h-4" /></Button>
                </Link>
                <Link href={`/admin/events/edit/${e.id}`}>
                  <Button size="sm" variant="outline"><Edit className="w-4 h-4" /></Button>
                </Link>
                <Link href={`/admin/events/delete/${e.id}`}>
                  <Button size="sm" variant="outline" className="text-brand-600 hover:text-brand-700"><Trash2 className="w-4 h-4" /></Button>
                </Link>
              </div>
            )},
          ]}
          data={filteredEvents}
          rowKey={(e) => e.id || e._id || `event-${events.indexOf(e)}`}
        />
      )}








    </div>
  )
}
