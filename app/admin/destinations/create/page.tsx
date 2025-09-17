"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import ImageBBUpload from "@/components/admin/ImageBBUpload"

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
    universities: [] as Array<{
      name: string;
      location: string;
      ranking?: string;
      image?: string;
      courses: string[];
      description?: string;
    }>,
    students: "",
    popularCities: [] as string[],
    averageCost: "",
    workRights: "",
    color: "",
    hero: "",
    overviewText: "",
    costsText: "",
    intakesText: "",
    visaText: "",
    scholarshipsText: "",
    popularCourses: [] as string[],
    faqs: ""
  })
  const [courseInput, setCourseInput] = useState("")
  const [highlightInput, setHighlightInput] = useState("")
  const [cityInput, setCityInput] = useState("")
  const [universityInput, setUniversityInput] = useState({
    name: "",
    location: "",
    ranking: "",
    image: "",
    courses: [] as string[],
    description: ""
  })
  const [universityCourseInput, setUniversityCourseInput] = useState("")

  const handleCreate = async () => {
    setLoading(true)
    try {
      const sanitizedSlug = (formData.slug || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const response = await fetch('/api/admin/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug: sanitizedSlug,
          faqs: formData.faqs ? JSON.parse(formData.faqs) : []
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

  const addUniversityCourse = () => {
    if (universityCourseInput.trim() && !universityInput.courses.includes(universityCourseInput.trim())) {
      setUniversityInput({
        ...universityInput,
        courses: [...universityInput.courses, universityCourseInput.trim()]
      })
      setUniversityCourseInput("")
    }
  }

  const removeUniversityCourse = (index: number) => {
    setUniversityInput({
      ...universityInput,
      courses: universityInput.courses.filter((_, i) => i !== index)
    })
  }

  const addUniversity = () => {
    if (universityInput.name.trim() && universityInput.location.trim()) {
      setFormData({
        ...formData,
        universities: [...formData.universities, { ...universityInput }]
      })
      setUniversityInput({
        name: "",
        location: "",
        ranking: "",
        image: "",
        courses: [],
        description: ""
      })
    }
  }

  const removeUniversity = (index: number) => {
    setFormData({
      ...formData,
      universities: formData.universities.filter((_, i) => i !== index)
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
              <ImageBBUpload
                label="Destination Image"
                currentImage={formData.image}
                onUpload={(image) => setFormData({...formData, image: image.url})}
                onRemove={() => setFormData({...formData, image: ""})}
                maxSize={5 * 1024 * 1024} // 5MB
                required={false}
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
              value={`${formData.universities.length} universities added`}
              readOnly
              className="bg-gray-50 cursor-not-allowed"
              placeholder="Universities will be shown here"
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
              <Label htmlFor="overviewText">Overview Content</Label>
              <Textarea
                id="overviewText"
                value={formData.overviewText}
                onChange={(e) => setFormData({...formData, overviewText: e.target.value})}
                placeholder="Overview content for the destination...&#10;&#10;This will be displayed in a structured format with cards and sections. Focus on key highlights and benefits of studying in this destination."
                rows={6}
              />
              <p className="text-xs text-gray-500 mt-1">This content will be displayed in a modern card-based layout with structured information.</p>
            </div>
            <div>
              <Label htmlFor="costsText">Costs Information</Label>
              <Textarea
                id="costsText"
                value={formData.costsText}
                onChange={(e) => setFormData({...formData, costsText: e.target.value})}
                placeholder="Cost information for the destination...&#10;&#10;Include details about tuition fees, living expenses, accommodation costs, and any additional expenses students should be aware of."
                rows={6}
              />
              <p className="text-xs text-gray-500 mt-1">This will be displayed in organized cost breakdown cards with clear pricing information.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="intakesText">Intakes Information</Label>
              <Textarea
                id="intakesText"
                value={formData.intakesText}
                onChange={(e) => setFormData({...formData, intakesText: e.target.value})}
                placeholder="Intake information for the destination...&#10;&#10;Include details about Fall, Spring, and Summer intakes with their respective application deadlines and important dates."
                rows={6}
              />
              <p className="text-xs text-gray-500 mt-1">This will be displayed in timeline-style cards showing intake periods and deadlines.</p>
            </div>
            <div>
              <Label htmlFor="visaText">Visa Information</Label>
              <Textarea
                id="visaText"
                value={formData.visaText}
                onChange={(e) => setFormData({...formData, visaText: e.target.value})}
                placeholder="Visa information for the destination...&#10;&#10;Include details about visa types, processing times, requirements, work rights, and application procedures."
                rows={6}
              />
              <p className="text-xs text-gray-500 mt-1">This will be displayed in structured information cards with visa details and requirements.</p>
            </div>
          </div>

          <div>
            <Label htmlFor="scholarshipsText">Scholarships Information</Label>
            <Textarea
              id="scholarshipsText"
              value={formData.scholarshipsText}
              onChange={(e) => setFormData({...formData, scholarshipsText: e.target.value})}
              placeholder="Scholarship information for the destination...&#10;&#10;Include details about merit-based scholarships, need-based financial aid, research assistantships, and government scholarships available."
              rows={6}
            />
            <p className="text-xs text-gray-500 mt-1">This will be displayed in organized scholarship cards with funding details and eligibility information.</p>
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

          {/* Universities Section */}
          <div>
            <Label>Universities</Label>
            <div className="space-y-4">
              {/* University Input Form */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-3">Add New University</h4>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <Label htmlFor="university-name">University Name *</Label>
                    <Input
                      id="university-name"
                      value={universityInput.name}
                      onChange={(e) => setUniversityInput({...universityInput, name: e.target.value})}
                      placeholder="e.g., Harvard University"
                    />
                  </div>
                  <div>
                    <Label htmlFor="university-location">Location *</Label>
                    <Input
                      id="university-location"
                      value={universityInput.location}
                      onChange={(e) => setUniversityInput({...universityInput, location: e.target.value})}
                      placeholder="e.g., Cambridge, MA"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <Label htmlFor="university-ranking">Global Ranking</Label>
                    <Input
                      id="university-ranking"
                      value={universityInput.ranking}
                      onChange={(e) => setUniversityInput({...universityInput, ranking: e.target.value})}
                      placeholder="e.g., #3 globally"
                    />
                  </div>
                  <div>
                    <ImageBBUpload
                      label="University Image"
                      currentImage={universityInput.image}
                      onUpload={(image) => setUniversityInput({...universityInput, image: image.url})}
                      onRemove={() => setUniversityInput({...universityInput, image: ""})}
                      maxSize={3 * 1024 * 1024} // 3MB
                      required={false}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <Label htmlFor="university-description">Description</Label>
                  <Textarea
                    id="university-description"
                    value={universityInput.description}
                    onChange={(e) => setUniversityInput({...universityInput, description: e.target.value})}
                    placeholder="Brief description of the university..."
                    rows={2}
                  />
                </div>
                <div className="mb-3">
                  <Label>Popular Courses</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={universityCourseInput}
                      onChange={(e) => setUniversityCourseInput(e.target.value)}
                      placeholder="Add a course"
                      onKeyPress={(e) => e.key === 'Enter' && addUniversityCourse()}
                    />
                    <Button type="button" onClick={addUniversityCourse} variant="outline" size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {universityInput.courses.map((course, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeUniversityCourse(index)}>
                        {course} ×
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button type="button" onClick={addUniversity} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add University
                </Button>
              </div>

              {/* Added Universities List */}
              {formData.universities.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Added Universities ({formData.universities.length})</h4>
                  {formData.universities.map((university, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-semibold text-gray-900">{university.name}</h5>
                          <p className="text-sm text-gray-600">{university.location}</p>
                          {university.ranking && (
                            <p className="text-xs text-brand-600 font-medium">{university.ranking}</p>
                          )}
                        </div>
                        <Button
                          type="button"
                          onClick={() => removeUniversity(index)}
                          variant="ghost"
                          size="sm"
                          className="text-brand-600 hover:text-brand-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {university.description && (
                        <p className="text-sm text-gray-700 mb-2">{university.description}</p>
                      )}
                      {university.courses.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {university.courses.map((course, courseIndex) => (
                            <Badge key={courseIndex} variant="outline" className="text-xs">
                              {course}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
            <Button onClick={handleCreate} disabled={loading} className="bg-brand-600 hover:bg-brand-700">
              {loading ? 'Creating...' : 'Create Destination'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
