'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Globe, ArrowLeft, Edit } from 'lucide-react'
import Link from 'next/link'

interface Destination {
  id: string
  country: string
  slug: string
  flag?: string
  image?: string
  description?: string
  highlights: string[]
  universities?: string
  students?: string
  popularCities: string[]
  averageCost?: string
  workRights?: string
  color?: string
  hero?: string
  overviewMD?: string
  costsMD?: string
  intakesMD?: string
  visaMD?: string
  scholarshipsMD?: string
  popularCourses: string[]
  faqs?: Array<{ question: string; answer: string }>
  createdAt: string
}

export default function ViewDestination() {
  const params = useParams()
  const [destination, setDestination] = useState<Destination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchDestination(params.id as string)
    }
  }, [params.id])

  const fetchDestination = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/destinations/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch destination')
      }
      const data = await response.json()
      setDestination(data)
    } catch (error) {
      console.error('Error fetching destination:', error)
      setError('Failed to load destination')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading destination...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !destination) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-brand-600 mb-4">{error || 'Destination not found'}</p>
            <Link href="/admin/destinations">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Destinations
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/destinations">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">View Destination</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`http://localhost:3000/destinations/${destination.slug}`} target="_blank">
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              <Globe className="w-4 h-4 mr-2" />
              View Public Page
            </Button>
          </Link>
          <Link href={`/admin/destinations/edit/${destination.id}`}>
            <Button className="bg-brand-600 hover:bg-brand-700">
              <Edit className="w-4 h-4 mr-2" />
              Edit Destination
            </Button>
          </Link>
        </div>
      </div>

      {/* Destination Details */}
      <div className="bg-white rounded-lg shadow-sm border p-8">
        {/* Header Section */}
        <div className="flex items-center space-x-6 mb-8 pb-6 border-b">
          <div className="w-20 h-20 bg-brand-600 text-white rounded-full flex items-center justify-center">
            <Globe className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{destination.country}</h2>
            <p className="text-lg text-gray-600">/{destination.slug}</p>
            <p className="text-sm text-gray-500 mt-1">Created: {formatDate(destination.createdAt)}</p>
            <p className="text-xs text-gray-400">ID: {destination.id}</p>
          </div>
        </div>
        
        {/* Hero Text */}
        {destination.hero && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Hero Text</h3>
            <p className="text-gray-700 text-lg leading-relaxed">{destination.hero}</p>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {destination.overviewMD && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Overview</h3>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{destination.overviewMD}</pre>
              </div>
            </div>
          )}
          
          {destination.costsMD && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Costs Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{destination.costsMD}</pre>
              </div>
            </div>
          )}
          
          {destination.intakesMD && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Intakes Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{destination.intakesMD}</pre>
              </div>
            </div>
          )}
          
          {destination.visaMD && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Visa Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{destination.visaMD}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Scholarships */}
        {destination.scholarshipsMD && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Scholarships Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{destination.scholarshipsMD}</pre>
            </div>
          </div>
        )}

        {/* Popular Courses */}
        {destination.popularCourses.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Popular Courses</h3>
            <div className="flex flex-wrap gap-2">
              {destination.popularCourses.map((course, index) => (
                <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                  {course}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* FAQs */}
        {destination.faqs && destination.faqs.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {destination.faqs.map((faq, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
