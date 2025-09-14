"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Eye } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface University {
  name: string
  location: string
  ranking?: string
  image?: string
  description?: string
  popularCourses: string[]
}

interface Destination {
  id: string
  country: string
  slug: string
  flag?: string
  image?: string
  description?: string
  highlights: string[]
  universities?: University[]
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
  faqs?: {
    question: string
    answer: string
  }[]
  createdAt: string
}

export default function EditDestinationPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [destination, setDestination] = useState<Destination | null>(null)
  const [formData, setFormData] = useState({
    country: "",
    slug: "",
    flag: "",
    image: "",
    description: "",
    highlights: [] as string[],
    universities: [] as University[],
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
  const [viewMode, setViewMode] = useState(false)
  const [universityInput, setUniversityInput] = useState({
    name: "",
    location: "",
    ranking: "",
    image: "",
    description: "",
    popularCourses: [] as string[]
  })
  const [universityCourseInput, setUniversityCourseInput] = useState("")

  useEffect(() => {
    if (params.id) {
      fetchDestination(params.id as string)
    }
  }, [params.id])

  const fetchDestination = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/destinations/${id}`)
      if (response.ok) {
        const destination = await response.json()
        setDestination(destination)
        setFormData({
          country: destination.country,
          slug: destination.slug,
          flag: destination.flag || "",
          image: destination.image || "",
          description: destination.description || "",
          highlights: destination.highlights || [],
          universities: Array.isArray(destination.universities) ? destination.universities : [],
          students: destination.students || "",
          popularCities: destination.popularCities || [],
          averageCost: destination.averageCost || "",
          workRights: destination.workRights || "",
          color: destination.color || "",
          hero: destination.hero || "",
          overviewMD: destination.overviewMD || "",
          costsMD: destination.costsMD || "",
          intakesMD: destination.intakesMD || "",
          visaMD: destination.visaMD || "",
          scholarshipsMD: destination.scholarshipsMD || "",
          popularCourses: destination.popularCourses || [],
          faqs: destination.faqs ? JSON.stringify(destination.faqs, null, 2) : ""
        })
      } else {
        toast.error('Failed to fetch destination')
        router.push('/admin/destinations')
      }
    } catch (error) {
      toast.error('Error fetching destination')
      router.push('/admin/destinations')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/destinations/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          faqs: formData.faqs ? JSON.parse(formData.faqs) : null
        })
      })

      if (response.ok) {
        toast.success('Destination updated successfully')
        router.push('/admin/destinations')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to update destination')
      }
    } catch (error) {
      toast.error('Error updating destination')
    } finally {
      setSaving(false)
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

  const addUniversityCourse = () => {
    if (universityCourseInput.trim() && !universityInput.popularCourses.includes(universityCourseInput.trim())) {
      setUniversityInput({
        ...universityInput,
        popularCourses: [...universityInput.popularCourses, universityCourseInput.trim()]
      })
      setUniversityCourseInput("")
    }
  }

  const removeUniversityCourse = (index: number) => {
    setUniversityInput({
      ...universityInput,
      popularCourses: universityInput.popularCourses.filter((_, i) => i !== index)
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
        description: "",
        popularCourses: []
      })
    }
  }

  const removeUniversity = (index: number) => {
    setFormData({
      ...formData,
      universities: (formData.universities || []).filter((_, i) => i !== index)
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  if (!destination) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Destination not found</p>
        <Link href="/admin/destinations">
          <Button className="mt-4">Back to Destinations</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/destinations">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Destinations
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {viewMode ? 'View' : 'Edit'} Destination: {destination.country}
          </h1>
        </div>
        <Button
          variant="outline"
          onClick={() => setViewMode(!viewMode)}
          className="flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          {viewMode ? 'Edit Mode' : 'View Mode'}
        </Button>
      </div>

      {destination && (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">
              <p><strong>Created:</strong> {formatDate(destination.createdAt)}</p>
              <p><strong>ID:</strong> {destination.id}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Destination Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country">Country Name</Label>
              {viewMode ? (
                <div className="p-2 bg-gray-50 rounded border">{formData.country}</div>
              ) : (
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  placeholder="e.g., New Zealand"
                />
              )}
            </div>
            <div>
              <Label htmlFor="slug">URL Slug</Label>
              {viewMode ? (
                <div className="p-2 bg-gray-50 rounded border">{formData.slug}</div>
              ) : (
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  placeholder="e.g., new-zealand"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="flag">Flag Emoji</Label>
              {viewMode ? (
                <div className="p-2 bg-gray-50 rounded border">{formData.flag || 'No flag'}</div>
              ) : (
                <Input
                  id="flag"
                  value={formData.flag}
                  onChange={(e) => setFormData({...formData, flag: e.target.value})}
                  placeholder="e.g., 🇳🇿"
                />
              )}
            </div>
            <div>
              <Label htmlFor="image">Image URL</Label>
              {viewMode ? (
                <div className="p-2 bg-gray-50 rounded border">{formData.image || 'No image'}</div>
              ) : (
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://..."
                />
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            {viewMode ? (
              <div className="p-2 bg-gray-50 rounded border">{formData.description || 'No description'}</div>
            ) : (
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description of the destination..."
                rows={2}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="universities">Universities</Label>
              <Input
                id="universities"
                value={`${formData.universities?.length || 0} universities added`}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="students">Students</Label>
              {viewMode ? (
                <div className="p-2 bg-gray-50 rounded border">{formData.students || 'No students info'}</div>
              ) : (
                <Input
                  id="students"
                  value={formData.students}
                  onChange={(e) => setFormData({...formData, students: e.target.value})}
                  placeholder="e.g., 50,000+ International Students"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="averageCost">Average Cost</Label>
              {viewMode ? (
                <div className="p-2 bg-gray-50 rounded border">{formData.averageCost || 'No cost info'}</div>
              ) : (
                <Input
                  id="averageCost"
                  value={formData.averageCost}
                  onChange={(e) => setFormData({...formData, averageCost: e.target.value})}
                  placeholder="e.g., $22,000 - $32,000 NZD"
                />
              )}
            </div>
            <div>
              <Label htmlFor="workRights">Work Rights</Label>
              {viewMode ? (
                <div className="p-2 bg-gray-50 rounded border">{formData.workRights || 'No work rights info'}</div>
              ) : (
                <Input
                  id="workRights"
                  value={formData.workRights}
                  onChange={(e) => setFormData({...formData, workRights: e.target.value})}
                  placeholder="e.g., 20 hrs/week"
                />
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="color">Color Gradient</Label>
            {viewMode ? (
              <div className="p-2 bg-gray-50 rounded border">{formData.color || 'No color'}</div>
            ) : (
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                placeholder="e.g., from-teal-400 to-cyan-500"
              />
            )}
          </div>
          
          <div>
            <Label htmlFor="hero">Hero Text</Label>
            {viewMode ? (
              <div className="p-2 bg-gray-50 rounded border min-h-[40px]">{formData.hero || 'No hero text'}</div>
            ) : (
              <Input
                id="hero"
                value={formData.hero}
                onChange={(e) => setFormData({...formData, hero: e.target.value})}
                placeholder="Brief description for the hero section"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="overviewMD">Overview (Markdown)</Label>
              {viewMode ? (
                <div className="p-2 bg-gray-50 rounded border min-h-[100px] whitespace-pre-wrap">{formData.overviewMD || 'No overview content'}</div>
              ) : (
                <Textarea
                  id="overviewMD"
                  value={formData.overviewMD}
                  onChange={(e) => setFormData({...formData, overviewMD: e.target.value})}
                  placeholder="Overview content in markdown..."
                  rows={4}
                />
              )}
            </div>
            <div>
              <Label htmlFor="costsMD">Costs Information (Markdown)</Label>
              {viewMode ? (
                <div className="p-2 bg-gray-50 rounded border min-h-[100px] whitespace-pre-wrap">{formData.costsMD || 'No costs information'}</div>
              ) : (
                <Textarea
                  id="costsMD"
                  value={formData.costsMD}
                  onChange={(e) => setFormData({...formData, costsMD: e.target.value})}
                  placeholder="Cost information in markdown..."
                  rows={4}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="intakesMD">Intakes Information (Markdown)</Label>
              {viewMode ? (
                <div className="p-2 bg-gray-50 rounded border min-h-[100px] whitespace-pre-wrap">{formData.intakesMD || 'No intakes information'}</div>
              ) : (
                <Textarea
                  id="intakesMD"
                  value={formData.intakesMD}
                  onChange={(e) => setFormData({...formData, intakesMD: e.target.value})}
                  placeholder="Intake information in markdown..."
                  rows={4}
                />
              )}
            </div>
            <div>
              <Label htmlFor="visaMD">Visa Information (Markdown)</Label>
              {viewMode ? (
                <div className="p-2 bg-gray-50 rounded border min-h-[100px] whitespace-pre-wrap">{formData.visaMD || 'No visa information'}</div>
              ) : (
                <Textarea
                  id="visaMD"
                  value={formData.visaMD}
                  onChange={(e) => setFormData({...formData, visaMD: e.target.value})}
                  placeholder="Visa information in markdown..."
                  rows={4}
                />
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="scholarshipsMD">Scholarships Information (Markdown)</Label>
            {viewMode ? (
              <div className="p-2 bg-gray-50 rounded border min-h-[80px] whitespace-pre-wrap">{formData.scholarshipsMD || 'No scholarships information'}</div>
            ) : (
              <Textarea
                id="scholarshipsMD"
                value={formData.scholarshipsMD}
                onChange={(e) => setFormData({...formData, scholarshipsMD: e.target.value})}
                placeholder="Scholarship information in markdown..."
                rows={3}
              />
            )}
          </div>

          <div>
            <Label>Highlights</Label>
            {!viewMode && (
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
            )}
            <div className="flex flex-wrap gap-2">
              {formData.highlights.length > 0 ? (
                formData.highlights.map((highlight, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className={viewMode ? "" : "cursor-pointer"} 
                    onClick={viewMode ? undefined : () => removeHighlight(index)}
                  >
                    {highlight} {!viewMode && '×'}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No highlights added</p>
              )}
            </div>
          </div>

          <div>
            <Label>Universities</Label>
            {!viewMode && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-lg">Add University</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="universityName">University Name</Label>
                      <Input
                        id="universityName"
                        value={universityInput.name}
                        onChange={(e) => setUniversityInput({...universityInput, name: e.target.value})}
                        placeholder="e.g., University of Toronto"
                      />
                    </div>
                    <div>
                      <Label htmlFor="universityLocation">Location</Label>
                      <Input
                        id="universityLocation"
                        value={universityInput.location}
                        onChange={(e) => setUniversityInput({...universityInput, location: e.target.value})}
                        placeholder="e.g., Toronto, Ontario"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="universityRanking">Ranking (Optional)</Label>
                      <Input
                        id="universityRanking"
                        value={universityInput.ranking}
                        onChange={(e) => setUniversityInput({...universityInput, ranking: e.target.value})}
                        placeholder="e.g., #1 in Canada"
                      />
                    </div>
                    <div>
                      <Label htmlFor="universityImage">Image URL (Optional)</Label>
                      <Input
                        id="universityImage"
                        value={universityInput.image}
                        onChange={(e) => setUniversityInput({...universityInput, image: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="universityDescription">Description (Optional)</Label>
                    <Textarea
                      id="universityDescription"
                      value={universityInput.description}
                      onChange={(e) => setUniversityInput({...universityInput, description: e.target.value})}
                      placeholder="Brief description of the university..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Popular Courses</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={universityCourseInput}
                        onChange={(e) => setUniversityCourseInput(e.target.value)}
                        placeholder="Add a popular course"
                        onKeyPress={(e) => e.key === 'Enter' && addUniversityCourse()}
                      />
                      <Button type="button" onClick={addUniversityCourse} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {universityInput.popularCourses.length > 0 ? (
                        universityInput.popularCourses.map((course, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="cursor-pointer" 
                            onClick={() => removeUniversityCourse(index)}
                          >
                            {course} ×
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No courses added</p>
                      )}
                    </div>
                  </div>
                  <Button type="button" onClick={addUniversity} className="w-full">
                    Add University
                  </Button>
                </CardContent>
              </Card>
            )}
            <div className="space-y-2">
              {formData.universities && formData.universities.length > 0 ? (
                formData.universities.map((university, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">{university.name}</h4>
                          <p className="text-sm text-gray-600">{university.location}</p>
                          {university.ranking && (
                            <p className="text-sm text-blue-600">{university.ranking}</p>
                          )}
                          {university.description && (
                            <p className="text-sm text-gray-700 mt-1">{university.description}</p>
                          )}
                          {university.popularCourses.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {university.popularCourses.map((course, courseIndex) => (
                                <Badge key={courseIndex} variant="outline" className="text-xs">
                                  {course}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        {!viewMode && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeUniversity(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No universities added</p>
              )}
            </div>
          </div>

          <div>
            <Label>Popular Cities</Label>
            {!viewMode && (
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
            )}
            <div className="flex flex-wrap gap-2">
              {formData.popularCities.length > 0 ? (
                formData.popularCities.map((city, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className={viewMode ? "" : "cursor-pointer"} 
                    onClick={viewMode ? undefined : () => removeCity(index)}
                  >
                    {city} {!viewMode && '×'}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No popular cities added</p>
              )}
            </div>
          </div>

          <div>
            <Label>Popular Courses</Label>
            {!viewMode && (
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
            )}
            <div className="flex flex-wrap gap-2">
              {formData.popularCourses.length > 0 ? (
                formData.popularCourses.map((course, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className={viewMode ? "" : "cursor-pointer"} 
                    onClick={viewMode ? undefined : () => removeCourse(index)}
                  >
                    {course} {!viewMode && '×'}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No popular courses added</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="faqs">FAQs (JSON Format)</Label>
            {viewMode ? (
              <div className="p-2 bg-gray-50 rounded border min-h-[100px] whitespace-pre-wrap font-mono text-sm">
                {formData.faqs || 'No FAQs'}
              </div>
            ) : (
              <>
                <Textarea
                  id="faqs"
                  value={formData.faqs}
                  onChange={(e) => setFormData({...formData, faqs: e.target.value})}
                  placeholder='[{"question": "What is the cost?", "answer": "The cost varies..."}]'
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">Enter FAQs in JSON format</p>
              </>
            )}
          </div>

          {!viewMode && (
            <div className="flex justify-end gap-3 pt-4">
              <Link href="/admin/destinations">
                <Button variant="outline" disabled={saving}>
                  Cancel
                </Button>
              </Link>
              <Button onClick={handleUpdate} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}