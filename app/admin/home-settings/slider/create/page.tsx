"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

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
}

export default function CreateSlidePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<SlideFormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: keyof SlideFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const slideData = {
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
      }

      const response = await fetch('/api/admin/slides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slideData),
      })

      if (!response.ok) {
        throw new Error('Failed to create slide')
      }

      toast.success('Slide created successfully!')
      router.push('/admin/home-settings/slider')
    } catch (error) {
      console.error('Error creating slide:', error)
      toast.error('Failed to create slide')
    } finally {
      setIsLoading(false)
    }
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
        <h1 className="text-3xl font-bold">Create New Slide</h1>
        <p className="text-muted-foreground">Add a new slide to the hero slider</p>
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
                {isLoading ? 'Creating...' : 'Create Slide'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}