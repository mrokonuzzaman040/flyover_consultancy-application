"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface Slide {
  id?: string
  image: string
  headline: string
  sub: string
  primary: {
    label: string
    isModal?: boolean
    href?: string
  }
  secondary: {
    label: string
    href?: string
    isModal?: boolean
  }
  order?: number
  active?: boolean
}

interface SlideFormData {
  image: string
  headline: string
  sub: string
  primaryLabel: string
  primaryIsModal: boolean
  primaryHref: string
  secondaryLabel: string
  secondaryHref: string
  secondaryIsModal: boolean
  order: number
  active: boolean
}

const initialFormData: SlideFormData = {
  image: "",
  headline: "",
  sub: "",
  primaryLabel: "",
  primaryIsModal: false,
  primaryHref: "",
  secondaryLabel: "",
  secondaryHref: "",
  secondaryIsModal: false,
  order: 0,
  active: true,
}

export default function EditSlidePage() {
  const router = useRouter()
  const params = useParams()
  const slideId = params.id as string
  
  const [formData, setFormData] = useState<SlideFormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    const fetchSlide = async () => {
      try {
        const response = await fetch(`/api/admin/slides/${slideId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch slide')
        }
        
        const data = await response.json()
        const slide: Slide = data.slide
        
        if (!slide) {
          toast.error('Slide not found')
          router.push('/admin/home-settings/slider')
          return
        }

        setFormData({
          image: slide.image,
          headline: slide.headline,
          sub: slide.sub,
          primaryLabel: slide.primary.label,
          primaryIsModal: slide.primary.isModal || false,
          primaryHref: slide.primary.href || '',
          secondaryLabel: slide.secondary.label,
          secondaryHref: slide.secondary.href || '',
          secondaryIsModal: slide.secondary.isModal || false,
          order: slide.order || 0,
          active: slide.active !== undefined ? slide.active : true,
        })
      } catch (error) {
        console.error('Error fetching slide:', error)
        toast.error('Failed to load slide data')
        router.push('/admin/home-settings/slider')
      } finally {
        setIsLoadingData(false)
      }
    }

    if (slideId) {
      fetchSlide()
    }
  }, [slideId, router])

  const handleInputChange = (field: keyof SlideFormData, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const slideData = {
        id: slideId,
        image: formData.image,
        headline: formData.headline,
        sub: formData.sub,
        primary: {
          label: formData.primaryLabel,
          isModal: formData.primaryIsModal,
          href: formData.primaryHref,
        },
        secondary: {
          label: formData.secondaryLabel,
          href: formData.secondaryHref,
          isModal: formData.secondaryIsModal,
        },
        order: formData.order,
        active: formData.active,
      }

      const response = await fetch(`/api/admin/slides/${slideId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slideData),
      })

      if (!response.ok) {
        throw new Error('Failed to update slide')
      }

      toast.success('Slide updated successfully!')
      router.push('/admin/home-settings/slider')
    } catch (error) {
      console.error('Error updating slide:', error)
      toast.error('Failed to update slide')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading slide data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Slider Management
        </Button>
        <h1 className="text-3xl font-bold">Edit Slide</h1>
        <p className="text-muted-foreground">Update slide information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Slide Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="headline">Headline</Label>
                  <Input
                    id="headline"
                    value={formData.headline}
                    onChange={(e) => handleInputChange('headline', e.target.value)}
                    placeholder="Enter slide headline"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="sub">Subtitle</Label>
                  <Textarea
                    id="sub"
                    value={formData.sub}
                    onChange={(e) => handleInputChange('sub', e.target.value)}
                    placeholder="Enter slide subtitle"
                    rows={3}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Primary Button</h3>
                  <div>
                    <Label htmlFor="primaryLabel">Button Label</Label>
                    <Input
                      id="primaryLabel"
                      value={formData.primaryLabel}
                      onChange={(e) => handleInputChange('primaryLabel', e.target.value)}
                      placeholder="Get Started"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="primaryHref">Button Link</Label>
                    <Input
                      id="primaryHref"
                      value={formData.primaryHref}
                      onChange={(e) => handleInputChange('primaryHref', e.target.value)}
                      placeholder="/contact"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="primaryIsModal"
                      checked={formData.primaryIsModal}
                      onCheckedChange={(checked: boolean) => handleInputChange('primaryIsModal', checked)}
                    />
                    <Label htmlFor="primaryIsModal">Open as Modal</Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Secondary Button</h3>
                  <div>
                    <Label htmlFor="secondaryLabel">Button Label</Label>
                    <Input
                      id="secondaryLabel"
                      value={formData.secondaryLabel}
                      onChange={(e) => handleInputChange('secondaryLabel', e.target.value)}
                      placeholder="Learn More"
                    />
                  </div>
                  <div>
                    <Label htmlFor="secondaryHref">Button Link</Label>
                    <Input
                      id="secondaryHref"
                      value={formData.secondaryHref}
                      onChange={(e) => handleInputChange('secondaryHref', e.target.value)}
                      placeholder="/about"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="secondaryIsModal"
                      checked={formData.secondaryIsModal}
                      onCheckedChange={(checked: boolean) => handleInputChange('secondaryIsModal', checked)}
                    />
                    <Label htmlFor="secondaryIsModal">Open as Modal</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked: boolean) => handleInputChange('active', checked)}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>
            </div>

            {formData.image && (
              <div>
                <Label>Preview</Label>
                <div className="mt-2 border rounded-lg p-4">
                  <Image
                    src={formData.image}
                    alt="Slide preview"
                    className="object-cover rounded"
                    width={400}
                    height={200}
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-image.jpg'
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Slide'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}