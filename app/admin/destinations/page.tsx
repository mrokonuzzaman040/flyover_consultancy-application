"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Edit, Eye, Plus, Users } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import PageHeader from "@/components/admin/PageHeader"
import DataTable from "@/components/admin/DataTable"
import ListToolbar from "@/components/admin/ListToolbar"
import EmptyState from "@/components/admin/EmptyState"

interface Destination {
  id: string
  country: string
  slug: string
  students?: string
  hero?: string
  overviewMD?: string
  costsMD?: string
  intakesMD?: string
  visaMD?: string
  scholarshipsMD?: string
  popularCourses: string[]
  faqs?: {
    question: string
    answer: string
  }[]
  createdAt: string
}

// Utility function to format student numbers with K
const formatStudentCount = (students?: string) => {
  if (!students) return 'N/A'
  
  // Extract numbers from the string
  const match = students.match(/([0-9,]+)/)
  if (!match) return students
  
  const number = parseInt(match[1].replace(/,/g, ''))
  if (number >= 1000) {
    const kValue = Math.floor(number / 1000)
    return students.replace(match[1], `${kValue}K`)
  }
  return students
}

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    try {
      const response = await fetch('/api/admin/destinations')
      if (response.ok) {
        const data = await response.json()
        setDestinations(data.destinations || [])
      } else {
        toast.error('Failed to fetch destinations')
      }
    } catch (error) {
      console.log(error)
      toast.error('Error fetching destinations')
    } finally {
      setLoading(false)
    }
  }





  const filteredDestinations = destinations.filter(destination =>
    destination.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    destination.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
        title="Destinations Management"
        description="Create and curate study destinations"
        actions={(
          <Link href="/admin/destinations/create">
            <Button className="bg-brand-600 hover:bg-brand-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Destination
            </Button>
          </Link>
        )}
      />

      <ListToolbar search={searchTerm} onSearchChange={setSearchTerm} searchPlaceholder="Search destinations..." />

      {filteredDestinations.length === 0 ? (
        <EmptyState title="No destinations found" />
      ) : (
        <DataTable
          columns={[
            { key: 'country', header: 'Country', render: (d: Destination) => (
              <div>
                <div className="font-medium text-slate-900">{d.country}</div>
                <div className="text-xs text-slate-500">/{d.slug}</div>
              </div>
            ) },
            { key: 'students', header: 'Students', hideOn: 'md', render: (d: Destination) => (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium">{formatStudentCount(d.students)}</span>
              </div>
            ) },
            { key: 'courses', header: 'Popular Courses', hideOn: 'sm', render: (d: Destination) => (
              <div className="flex flex-wrap gap-1">
                {d.popularCourses.slice(0,3).map((c,i) => (<span key={i} className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">{c}</span>))}
                {d.popularCourses.length > 3 && (<span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">+{d.popularCourses.length - 3} more</span>)}
              </div>
            ) },
            { key: 'createdAt', header: 'Created', hideOn: 'lg', render: (d: Destination) => formatDate(d.createdAt) },
            { key: 'actions', header: 'Actions', headerClassName: 'text-right', cellClassName: 'text-right', render: (d: Destination) => (
              <div className="flex justify-end gap-2">
                <Link href={`http://localhost:3000/destinations/${d.slug}`} target="_blank"><Button size="sm" variant="outline"><Eye className="w-4 h-4" /></Button></Link>
                <Link href={`/admin/destinations/edit/${d.id}`}><Button size="sm" variant="outline"><Edit className="w-4 h-4" /></Button></Link>
                <Link href={`/admin/destinations/delete/${d.id}`}><Button size="sm" variant="outline" className="text-brand-600 hover:text-brand-700"><Trash2 className="w-4 h-4" /></Button></Link>
              </div>
            ) },
          ]}
          data={filteredDestinations}
          rowKey={(d) => d.id}
        />
      )}




    </div>
  )
}
