"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function CreateDestinationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    country: "",
    slug: "",
    flag: "",
    image: "",
    description: "",
    highlights: [] as string[],
    universities: "",
    students: "",
    popularCities: [] as string[],
    averageCost: "",
    workRights: "",
    color: "",
    hero: "",
    overviewMD: "",
    costsMD: "",
    intakesMD: "",
    visaMD: "",
    scholarshipsMD: "",
    popularCourses: [] as string[],
    faqs: ""
  })
  const [courseInput, setCourseInput] = useState("")
  const [highlightInput, setHighlightInput] = useState("")
  const [cityInput, setCityInput] = useState("")

  const handleCreate = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          faqs: formData.faqs ? JSON.parse(formData.faqs) : null
        })
      })

      if (response.ok) {
        toast.success('Destination created successfully')
        router.push('/admin/destinations')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to create destination')
      }
    } catch (error) {
      toast.error('Error creating destination')
    } finally {
      setLoading(false)
    }
  }

  const addCourse = () => {
    if (courseInput.trim() && !formData.popularCourses.includes(courseInput.trim())) {
      setFormData({
        ...formData,
        popularCourses: [...formData.popularCourses, courseInput.trim()]
      })
      setCourseInput("")
    }
  }

  const removeCourse = (index: number) => {
    setFormData({
      ...formData,
      popularCourses: formData.popularCourses.filter((_, i) => i !== index)
    })
  }

  const addHighlight = () => {
    if (highlightInput.trim() && !formData.highlights.includes(highlightInput.trim())) {
      setFormData({
        ...formData,
        highlights: [...formData.highlights, highlightInput.trim()]
      })
      setHighlightInput("")
    }
  }

  const removeHighlight = (index: number) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((_, i) => i !== index)
    })
  }

  const addCity = () => {
    if (cityInput.trim() && !formData.popularCities.includes(cityInput.trim())) {
      setFormData({
        ...formData,
        popularCities: [...formData.popularCities, cityInput.trim()]
      })
      setCityInput("")
    }
  }

  const removeCity = (index: number) => {
    setFormData({
      ...formData,
      popularCities: formData.popularCities.filter((_, i) => i !== index)
    })
  }

  const generateSlug = (country: string) => {
    return country.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/destinations">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Destinations
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create New Destination</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Destination Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country">Country Name</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => {
                  const country = e.target.value
                  setFormData({
                    ...formData,
                    country,
                    slug: generateSlug(country)
                  })
                }}
                placeholder="e.g., New Zealand"
              />
            </div>
            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                placeholder="e.g., new-zealand"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="flag">Flag Emoji</Label>
              <Input
                id="flag"
                value={formData.flag}
                onChange={(e) => setFormData({...formData, flag: e.target.value})}
                placeholder="e.g., 🇳🇿"
              />
            </div>
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Brief description of the destination..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="universities">Universities</Label>
              <Input
                id="universities"
                value={formData.universities}
                onChange={(e) => setFormData({...formData, universities: e.target.value})}
                placeholder="e.g., 43 Universities"
              />
            </div>
            <div>
              <Label htmlFor="students">International Students</Label>
              <Input
                id="students"
                value={formData.students}
                onChange={(e) => setFormData({...formData, students: e.target.value})}
                placeholder="e.g., 700,000+ International Students"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="averageCost">Average Cost</Label>
              <Input
                id="averageCost"
                value={formData.averageCost}
                onChange={(e) => setFormData({...formData, averageCost: e.target.value})}
                placeholder="e.g., $20,000 - $45,000 AUD"
              />
            </div>
            <div>
              <Label htmlFor="workRights">Work Rights</Label>
              <Input
                id="workRights"
                value={formData.workRights}
                onChange={(e) => setFormData({...formData, workRights: e.target.value})}
                placeholder="e.g., 20 hrs/week"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="color">Color Gradient</Label>
            <Input
              id="color"
              value={formData.color}
              onChange={(e) => setFormData({...formData, color: e.target.value})}
              placeholder="e.g., from-green-400 to-blue-500"
            />
          </div>
          
          <div>
            <Label htmlFor="hero">Hero Text</Label>
            <Input
              id="hero"
              value={formData.hero}
              onChange={(e) => setFormData({...formData, hero: e.target.value})}
              placeholder="Brief description for the hero section"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="overviewMD">Overview (Markdown)</Label>
              <Textarea
                id="overviewMD"
                value={formData.overviewMD}
                onChange={(e) => setFormData({...formData, overviewMD: e.target.value})}
                placeholder="Overview content in markdown..."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="costsMD">Costs Information (Markdown)</Label>
              <Textarea
                id="costsMD"
                value={formData.costsMD}
                onChange={(e) => setFormData({...formData, costsMD: e.target.value})}
                placeholder="Cost information in markdown..."
                rows={4}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="intakesMD">Intakes Information (Markdown)</Label>
              <Textarea
                id="intakesMD"
                value={formData.intakesMD}
                onChange={(e) => setFormData({...formData, intakesMD: e.target.value})}
                placeholder="Intake information in markdown..."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="visaMD">Visa Information (Markdown)</Label>
              <Textarea
                id="visaMD"
                value={formData.visaMD}
                onChange={(e) => setFormData({...formData, visaMD: e.target.value})}
                placeholder="Visa information in markdown..."
                rows={4}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="scholarshipsMD">Scholarships Information (Markdown)</Label>
            <Textarea
              id="scholarshipsMD"
              value={formData.scholarshipsMD}
              onChange={(e) => setFormData({...formData, scholarshipsMD: e.target.value})}
              placeholder="Scholarship information in markdown..."
              rows={3}
            />
          </div>

          <div>
            <Label>Highlights</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                placeholder="Add a highlight"
                onKeyPress={(e) => e.key === 'Enter' && addHighlight()}
              />
              <Button type="button" onClick={addHighlight} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.highlights.map((highlight, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeHighlight(index)}>
                  {highlight} ×
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Popular Cities</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="Add a popular city"
                onKeyPress={(e) => e.key === 'Enter' && addCity()}
              />
              <Button type="button" onClick={addCity} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.popularCities.map((city, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeCity(index)}>
                  {city} ×
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Popular Courses</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={courseInput}
                onChange={(e) => setCourseInput(e.target.value)}
                placeholder="Add a popular course"
                onKeyPress={(e) => e.key === 'Enter' && addCourse()}
              />
              <Button type="button" onClick={addCourse} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.popularCourses.map((course, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeCourse(index)}>
                  {course} ×
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="faqs">FAQs (JSON Format)</Label>
            <Textarea
              id="faqs"
              value={formData.faqs}
              onChange={(e) => setFormData({...formData, faqs: e.target.value})}
              placeholder='[{"question": "What is the cost?", "answer": "The cost varies..."}]'
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">Enter FAQs in JSON format</p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Link href="/admin/destinations">
              <Button variant="outline" disabled={loading}>
                Cancel
              </Button>
            </Link>
            <Button onClick={handleCreate} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Creating...' : 'Create Destination'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}