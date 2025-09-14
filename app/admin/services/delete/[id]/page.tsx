"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

interface Service {
  id: string
  name: string
  slug: string
  title?: string
  createdAt: string
}

export default function DeleteServicePage() {
  const router = useRouter()
  const params = useParams()
  const serviceId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [service, setService] = useState<Service | null>(null)

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
    setDeleting(true)
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
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Delete Service</h1>
      </div>

      <Card className="border-brand-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <CardTitle className="text-brand-900">Confirm Deletion</CardTitle>
              <p className="text-brand-700 text-sm">This action cannot be undone</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
            <h3 className="font-semibold text-brand-900 mb-2">Service to be deleted:</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-900">Name:</span>
                <span className="ml-2 text-gray-700">{service.name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">Slug:</span>
                <span className="ml-2 text-gray-700">/{service.slug}</span>
              </div>
              {service.title && (
                <div>
                  <span className="font-medium text-gray-900">Title:</span>
                  <span className="ml-2 text-gray-700">{service.title}</span>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-900">Created:</span>
                <span className="ml-2 text-gray-700">{formatDate(service.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">Warning:</h3>
            <ul className="text-yellow-800 text-sm space-y-1">
              <li>• This service will be permanently deleted from the database</li>
              <li>• The service page will no longer be accessible</li>
              <li>• Any links to this service will result in 404 errors</li>
              <li>• This action cannot be undone</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-brand-600 hover:bg-brand-700"
            >
              {deleting ? 'Deleting...' : 'Delete Service'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
