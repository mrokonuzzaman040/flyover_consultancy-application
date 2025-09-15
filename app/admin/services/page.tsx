"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Eye, Plus, Search, Settings, FileText, Tag } from "lucide-react"
import { toast } from "sonner"
import PageHeader from "@/components/admin/PageHeader"

interface Service {
  id: string
  name: string
  slug: string
  title?: string
  subtitle?: string
  description?: string
  image?: string
  sectionsMD: string[]
  features?: Array<{
    icon: string
    title: string
    description: string
  }>
  benefits?: string[]
  process?: Array<{
    step: string
    title: string
    description: string
  }>
  ctaLabel?: string
  ctaText?: string
  createdAt: string
  updatedAt: string
}

export default function AdminServicesPage() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data.services || [])
      } else {
        toast.error('Failed to fetch services')
      }
    } catch (error) {
      toast.error('Error fetching services')
    } finally {
      setLoading(false)
    }
  }

  const navigateToCreate = () => {
    router.push('/admin/services/create')
  }

  const navigateToEdit = (service: Service) => {
    router.push(`/admin/services/edit/${service.id}`)
  }

  const navigateToView = (service: Service) => {
    router.push(`/admin/services/view/${service.id}`)
  }

  const navigateToDelete = (service: Service) => {
    router.push(`/admin/services/delete/${service.id}`)
  }

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.slug.toLowerCase().includes(searchTerm.toLowerCase())
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
        title="Services Management"
        description="Create, edit, and organize your services"
        actions={(
          <Button onClick={navigateToCreate} className="bg-brand-600 hover:bg-brand-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Service
          </Button>
        )}
      />

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand-600 text-white rounded-full flex items-center justify-center">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <p className="text-sm text-gray-600">/{service.slug}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Sections:</span>
                  <Badge variant="secondary">{service.sectionsMD.length}</Badge>
                </div>
                
                {service.ctaLabel && (
                  <div className="flex items-center space-x-2">
                    <Tag className="w-3 h-3 text-gray-500" />
                    <span className="text-sm text-gray-700">{service.ctaLabel}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Created: {formatDate(service.createdAt)}</span>
                  <div className="flex items-center space-x-2">
                    {service.sectionsMD.length > 0 && <FileText className="w-3 h-3" />}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigateToView(service)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigateToEdit(service)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigateToDelete(service)}
                  className="text-brand-600 hover:text-brand-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No services found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
