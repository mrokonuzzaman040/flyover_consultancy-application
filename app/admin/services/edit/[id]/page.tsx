"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import ImageBBUpload from "@/components/admin/ImageBBUpload"

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
}

export default function EditServicePage() {
  const router = useRouter()
  const params = useParams()
  const serviceId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [service, setService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    title: "",
    subtitle: "",
    description: "",
    image: "",
    ctaLabel: "",
    ctaText: ""
  })
  const [sectionsMD, setSectionsMD] = useState<string[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [benefits, setBenefits] = useState<string[]>([])
  const [process, setProcess] = useState<ProcessStep[]>([])
  const [sectionInput, setSectionInput] = useState("")
  const [benefitInput, setBenefitInput] = useState("")
  const [featureInput, setFeatureInput] = useState({ icon: "", title: "", description: "" })
  const [processInput, setProcessInput] = useState({ step: "", title: "", description: "" })

  useEffect(() => {
    if (serviceId) {
      fetchService()
    }
  }, [serviceId])

  const fetchService = async () => {
    try {
      const response = await fetch(`/api/admin/services/${serviceId}`)
      if (response.ok) {
        const data = await response.json()
        const serviceData = data.service // Extract service from the response
        setService(serviceData)
        setFormData({
          name: serviceData.name || "",
          slug: serviceData.slug || "",
          title: serviceData.title || "",
          subtitle: serviceData.subtitle || "",
          description: serviceData.description || "",
          image: serviceData.image || "",
          ctaLabel: serviceData.ctaLabel || "",
          ctaText: serviceData.ctaText || ""
        })
        setSectionsMD(serviceData.sectionsMD || [])
        setFeatures(serviceData.features || [])
        setBenefits(serviceData.benefits || [])
        setProcess(serviceData.process || [])
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

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sectionsMD,
          features,
          benefits,
          process
        })
      })

      if (response.ok) {
        toast.success('Service updated successfully')
        router.push('/admin/services')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to update service')
      }
    } catch (error) {
      toast.error('Error updating service')
    } finally {
      setSaving(false)
    }
  }

  const addSection = () => {
    if (sectionInput.trim()) {
      setSectionsMD([...sectionsMD, sectionInput.trim()])
      setSectionInput("")
    }
  }

  const removeSection = (index: number) => {
    setSectionsMD(sectionsMD.filter((_, i) => i !== index))
  }

  const addBenefit = () => {
    if (benefitInput.trim()) {
      setBenefits([...benefits, benefitInput.trim()])
      setBenefitInput("")
    }
  }

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index))
  }

  const addFeature = () => {
    if (featureInput.title.trim() && featureInput.description.trim()) {
      setFeatures([...features, { ...featureInput }])
      setFeatureInput({ icon: "", title: "", description: "" })
    }
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const addProcess = () => {
    if (processInput.step.trim() && processInput.title.trim() && processInput.description.trim()) {
      setProcess([...process, { ...processInput }])
      setProcessInput({ step: "", title: "", description: "" })
    }
  }

  const removeProcess = (index: number) => {
    setProcess(process.filter((_, i) => i !== index))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
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
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Edit Service: {service.name}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setFormData({
                      ...formData,
                      name,
                      slug: generateSlug(name)
                    })
                  }}
                  placeholder="e.g., Application Support"
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  placeholder="e.g., application-support"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Application Support"
              />
            </div>

            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                placeholder="e.g., Complete assistance with university applications"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description of the service..."
                rows={3}
              />
            </div>

            <div>
              <ImageBBUpload
                label="Service Image"
                currentImage={formData.image}
                onUpload={(image) => setFormData({...formData, image: image.url})}
                onRemove={() => setFormData({...formData, image: ""})}
                maxSize={5 * 1024 * 1024} // 5MB
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload a service image (recommended: 400x300px, max 5MB)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Content Sections */}
        <Card>
          <CardHeader>
            <CardTitle>Content Sections (Markdown)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                value={sectionInput}
                onChange={(e) => setSectionInput(e.target.value)}
                placeholder="Add a content section in markdown format..."
                rows={3}
                className="flex-1"
              />
              <Button type="button" onClick={addSection} variant="outline" className="self-start">
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </div>
            
            {sectionsMD.map((section, index) => (
              <div key={index} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <Label className="text-sm font-medium">Section {index + 1}</Label>
                  <Button
                    type="button"
                    onClick={() => removeSection(index)}
                    variant="ghost"
                    size="sm"
                    className="text-brand-600 hover:text-brand-700 h-6 w-6 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Textarea
                  value={section}
                  onChange={(e) => {
                    const updated = [...sectionsMD]
                    updated[index] = e.target.value
                    setSectionsMD(updated)
                  }}
                  rows={4}
                  className="bg-white"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Benefits/Features List</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={benefitInput}
                onChange={(e) => setBenefitInput(e.target.value)}
                placeholder="Add a benefit or feature..."
                className="flex-1"
              />
              <Button type="button" onClick={addBenefit} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
            
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="flex-1">{benefit}</span>
                <Button
                  type="button"
                  onClick={() => removeBenefit(index)}
                  variant="ghost"
                  size="sm"
                  className="text-brand-600 hover:text-brand-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Cards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Input
                value={featureInput.icon}
                onChange={(e) => setFeatureInput({...featureInput, icon: e.target.value})}
                placeholder="Icon name (e.g., Target)"
              />
              <Input
                value={featureInput.title}
                onChange={(e) => setFeatureInput({...featureInput, title: e.target.value})}
                placeholder="Feature title"
              />
              <Input
                value={featureInput.description}
                onChange={(e) => setFeatureInput({...featureInput, description: e.target.value})}
                placeholder="Feature description"
              />
            </div>
            <Button type="button" onClick={addFeature} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Feature
            </Button>
            
            {features.map((feature, index) => (
              <div key={index} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <Label className="text-sm font-medium">Feature {index + 1}</Label>
                  <Button
                    type="button"
                    onClick={() => removeFeature(index)}
                    variant="ghost"
                    size="sm"
                    className="text-brand-600 hover:text-brand-700 h-6 w-6 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    value={feature.icon}
                    onChange={(e) => {
                      const updated = [...features]
                      updated[index].icon = e.target.value
                      setFeatures(updated)
                    }}
                    placeholder="Icon"
                  />
                  <Input
                    value={feature.title}
                    onChange={(e) => {
                      const updated = [...features]
                      updated[index].title = e.target.value
                      setFeatures(updated)
                    }}
                    placeholder="Title"
                  />
                  <Input
                    value={feature.description}
                    onChange={(e) => {
                      const updated = [...features]
                      updated[index].description = e.target.value
                      setFeatures(updated)
                    }}
                    placeholder="Description"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Process Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Process Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              <Input
                value={processInput.step}
                onChange={(e) => setProcessInput({...processInput, step: e.target.value})}
                placeholder="Step number (e.g., 01)"
              />
              <Input
                value={processInput.title}
                onChange={(e) => setProcessInput({...processInput, title: e.target.value})}
                placeholder="Step title"
              />
              <Input
                value={processInput.description}
                onChange={(e) => setProcessInput({...processInput, description: e.target.value})}
                placeholder="Step description"
                className="col-span-2"
              />
            </div>
            <Button type="button" onClick={addProcess} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
            
            {process.map((step, index) => (
              <div key={index} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <Label className="text-sm font-medium">Step {index + 1}</Label>
                  <Button
                    type="button"
                    onClick={() => removeProcess(index)}
                    variant="ghost"
                    size="sm"
                    className="text-brand-600 hover:text-brand-700 h-6 w-6 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <Input
                    value={step.step}
                    onChange={(e) => {
                      const updated = [...process]
                      updated[index].step = e.target.value
                      setProcess(updated)
                    }}
                    placeholder="Step"
                  />
                  <Input
                    value={step.title}
                    onChange={(e) => {
                      const updated = [...process]
                      updated[index].title = e.target.value
                      setProcess(updated)
                    }}
                    placeholder="Title"
                  />
                  <Input
                    value={step.description}
                    onChange={(e) => {
                      const updated = [...process]
                      updated[index].description = e.target.value
                      setProcess(updated)
                    }}
                    placeholder="Description"
                    className="col-span-2"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card>
          <CardHeader>
            <CardTitle>Call to Action</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ctaLabel">CTA Button Label</Label>
                <Input
                  id="ctaLabel"
                  value={formData.ctaLabel}
                  onChange={(e) => setFormData({...formData, ctaLabel: e.target.value})}
                  placeholder="e.g., Get Started"
                />
              </div>
              <div>
                <Label htmlFor="ctaText">CTA Text</Label>
                <Input
                  id="ctaText"
                  value={formData.ctaText}
                  onChange={(e) => setFormData({...formData, ctaText: e.target.value})}
                  placeholder="e.g., Ready to Start Your Journey?"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-brand-600 hover:bg-brand-700"
          >
            {saving ? 'Updating...' : 'Update Service'}
          </Button>
        </div>
      </form>
    </div>
  )
}
