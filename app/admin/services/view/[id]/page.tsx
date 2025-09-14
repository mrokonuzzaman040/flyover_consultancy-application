"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface Feature {
  icon: string
  title: string
  description: string
}

interface ProcessStep {
  step: string
  title: string
  description: string
}

interface Service {
  id: string
  name: string
  slug: string
  title?: string
  subtitle?: string
  description?: string
  image?: string
  sectionsMD: string[]
  features?: Feature[]
  benefits?: string[]
  process?: ProcessStep[]
  ctaLabel?: string
  ctaText?: string
  createdAt: string
  updatedAt: string
}

export default function ViewServicePage() {
  const router = useRouter()
  const params = useParams()
  const serviceId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [service, setService] = useState<Service | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    if (serviceId) {
      fetchService()
    }
  }, [serviceId])

  const fetchService = async () => {
    try {
      const response = await fetch(`/api/admin/services/${serviceId}`)
      if (response.ok) {
        const serviceData = await response.json()
        setService(serviceData)
      } else {
        toast.error('Failed to fetch service')
        router.push('/admin/services')
      }
    } catch (error) {
      toast.error('Error fetching service')
      router.push('/admin/services')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Service deleted successfully')
        router.push('/admin/services')
      } else {
        toast.error('Failed to delete service')
      }
    } catch (error) {
      toast.error('Error deleting service')
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service not found</h1>
          <Button onClick={() => router.push('/admin/services')}>
            Back to Services
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Service Details</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/services/edit/${service.id}`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowDeleteModal(true)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Service Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{service.name}</CardTitle>
            <Badge variant="secondary">/{service.slug}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {service.title && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Page Title</h3>
              <p className="text-gray-700">{service.title}</p>
            </div>
          )}
          
          {service.subtitle && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Subtitle</h3>
              <p className="text-gray-700">{service.subtitle}</p>
            </div>
          )}
          
          {service.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Description</h3>
              <p className="text-gray-700">{service.description}</p>
            </div>
          )}
          
          {service.image && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Hero Image</h3>
              <p className="text-gray-700">{service.image}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Created</h3>
              <p className="text-sm text-gray-600">{formatDate(service.createdAt)}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Last Updated</h3>
              <p className="text-sm text-gray-600">{formatDate(service.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Sections */}
      {service.sectionsMD.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Content Sections ({service.sectionsMD.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {service.sectionsMD.map((section, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">Section {index + 1}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {section.length} characters
                  </Badge>
                </div>
                <div className="bg-white p-3 rounded border max-h-40 overflow-y-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">{section}</pre>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Benefits */}
      {service.benefits && service.benefits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Benefits ({service.benefits.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {service.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      {service.features && service.features.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Features ({service.features.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {service.features.map((feature, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {feature.icon && (
                      <Badge variant="outline" className="text-xs">
                        {feature.icon}
                      </Badge>
                    )}
                    <h3 className="font-medium text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Process Steps */}
      {service.process && service.process.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Process Steps ({service.process.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {service.process.map((step, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* CTA Section */}
      {(service.ctaLabel || service.ctaText) && (
        <Card>
          <CardHeader>
            <CardTitle>Call to Action</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {service.ctaLabel && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Button Label</h3>
                <Badge variant="default">{service.ctaLabel}</Badge>
              </div>
            )}
            {service.ctaText && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">CTA Text</h3>
                <p className="text-gray-700">{service.ctaText}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Preview Link */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() => window.open(`/services/${service.slug}`, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Live Page
          </Button>
        </CardContent>
      </Card>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Delete Service</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete &ldquo;{service.name}&rdquo;? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
