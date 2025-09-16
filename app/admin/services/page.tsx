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
import DataTable from "@/components/admin/DataTable"
import ListToolbar from "@/components/admin/ListToolbar"
import EmptyState from "@/components/admin/EmptyState"

interface Service {
  _id?: string
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

      <ListToolbar search={searchTerm} onSearchChange={setSearchTerm} searchPlaceholder="Search services..." />

      {filteredServices.length === 0 ? (
        <EmptyState title="No services found" />
      ) : (
        <DataTable
          columns={[
            { key: 'name', header: 'Service', render: (s: Service) => (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-brand-600 text-white rounded-full flex items-center justify-center"><Settings className="w-4 h-4" /></div>
                <div>
                  <div className="font-medium text-slate-900">{s.name}</div>
                  <div className="text-xs text-slate-500">/{s.slug}</div>
                </div>
              </div>
            ) },
            { key: 'sections', header: 'Sections', hideOn: 'sm', render: (s: Service) => <Badge variant="secondary">{s.sectionsMD.length}</Badge> },
            { key: 'cta', header: 'CTA', hideOn: 'md', render: (s: Service) => s.ctaLabel ? <span className="text-slate-600 flex items-center gap-1"><Tag className="w-3 h-3" />{s.ctaLabel}</span> : '-' },
            { key: 'createdAt', header: 'Created', hideOn: 'lg', render: (s: Service) => formatDate(s.createdAt) },
            { key: 'actions', header: 'Actions', headerClassName: 'text-right', cellClassName: 'text-right', render: (s: Service) => (
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => navigateToView(s)}><Eye className="w-4 h-4" /></Button>
                <Button size="sm" variant="outline" onClick={() => navigateToEdit(s)}><Edit className="w-4 h-4" /></Button>
                <Button size="sm" variant="outline" onClick={() => navigateToDelete(s)} className="text-brand-600 hover:text-brand-700"><Trash2 className="w-4 h-4" /></Button>
              </div>
            ) },
          ]}
          data={filteredServices}
          rowKey={(s) => s.id || s._id || `service-${services.indexOf(s)}`}
        />
      )}
    </div>
  )
}
