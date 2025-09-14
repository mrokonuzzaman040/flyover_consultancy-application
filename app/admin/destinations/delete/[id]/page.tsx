"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trash2, AlertTriangle, Globe, BookOpen, DollarSign, FileText } from "lucide-react"
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

export default function DeleteDestinationPage({ params }: { params: { id: string } }) {
  const [destination, setDestination] = useState<Destination | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchDestination()
  }, [])

  const fetchDestination = async () => {
    try {
      const response = await fetch(`/api/admin/destinations/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setDestination(data.destination)
      } else {
        toast.error('Failed to fetch destination')
        router.push('/admin/destinations')
      }
    } catch (error) {
      console.error('Error fetching destination:', error)
      toast.error('Error fetching destination')
      router.push('/admin/destinations')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!destination) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/destinations/${destination.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Destination deleted successfully')
        router.push('/admin/destinations')
      } else {
        toast.error('Failed to delete destination')
      }
    } catch (error) {
      console.error('Error deleting destination:', error)
      toast.error('Error deleting destination')
    } finally {
      setDeleting(false)
    }
  }

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!destination) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Destination Not Found</h2>
          <p className="text-gray-600 mb-4">The destination you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/admin/destinations">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Destinations
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/destinations">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Delete Destination</h1>
          <p className="text-gray-600">Permanently remove this destination from the system</p>
        </div>
      </div>

      {/* Warning Alert */}
      <Card className="border-brand-200 bg-brand-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-brand-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-brand-900 mb-1">Warning: This action cannot be undone</h3>
              <p className="text-brand-700 text-sm">
                Deleting this destination will permanently remove all associated data including content, 
                courses, FAQs, and any related information. This action is irreversible.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Destination Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl">{destination.country}</h2>
              <p className="text-sm text-gray-600 font-normal">/{destination.slug}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {destination.hero && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Hero Description</h4>
                <p className="text-gray-700 text-sm">{destination.hero}</p>
              </div>
            )}
            
            {destination.popularCourses.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Popular Courses ({destination.popularCourses.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {destination.popularCourses.map((course, index) => (
                    <Badge key={index} variant="secondary">
                      {course}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">Overview</p>
                <p className="text-sm font-medium">{destination.overviewMD ? 'Available' : 'Not set'}</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">Costs</p>
                <p className="text-sm font-medium">{destination.costsMD ? 'Available' : 'Not set'}</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">Courses</p>
                <p className="text-sm font-medium">{destination.popularCourses.length}</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Globe className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm font-medium">{formatDate(destination.createdAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Confirm Deletion</h3>
              <p className="text-sm text-gray-600">
                The destination you&apos;re about to delete: <strong>{destination.country}</strong>
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/destinations">
                <Button variant="outline" disabled={deleting}>
                  Cancel
                </Button>
              </Link>
              <Button 
                onClick={handleDelete}
                disabled={deleting}
                className="bg-brand-600 hover:bg-brand-700"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Destination
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}