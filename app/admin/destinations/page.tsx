"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Eye, Plus, Search, Globe, BookOpen, DollarSign, FileText } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Destination {
  id: string
  country: string
  slug: string
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Destinations Management</h1>
        <Link href="/admin/destinations/create">
          <Button className="bg-brand-600 hover:bg-brand-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Destination
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Destinations Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDestinations.map((destination) => (
          <Card key={destination.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand-600 text-white rounded-full flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{destination.country}</CardTitle>
                    <p className="text-sm text-gray-600">/{destination.slug}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {destination.hero && (
                  <p className="text-sm text-gray-700 line-clamp-2">{destination.hero}</p>
                )}
                
                <div className="flex flex-wrap gap-1">
                  {destination.popularCourses.slice(0, 3).map((course, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {course}
                    </Badge>
                  ))}
                  {destination.popularCourses.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{destination.popularCourses.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Created: {formatDate(destination.createdAt)}</span>
                  <div className="flex items-center space-x-2">
                    {destination.overviewMD && <FileText className="w-3 h-3" />}
                    {destination.costsMD && <DollarSign className="w-3 h-3" />}
                    {destination.popularCourses.length > 0 && <BookOpen className="w-3 h-3" />}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Link href={`http://localhost:3000/destinations/${destination.slug}`} target="_blank">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href={`/admin/destinations/edit/${destination.id}`}>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href={`/admin/destinations/delete/${destination.id}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-brand-600 hover:text-brand-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDestinations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No destinations found matching your criteria.</p>
          </CardContent>
        </Card>
      )}




    </div>
  )
}