"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import PageHeader from "@/components/admin/PageHeader"
import ImageBBUpload from "@/components/admin/ImageBBUpload"

interface TeamMemberForm {
  name: string
  role: string
  image: string
  bio: string
  expertise: string[]
  email: string
  linkedin: string
  phone: string
  isActive: boolean
  order: number
}

export default function EditTeamMemberPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [form, setForm] = useState<TeamMemberForm>({
    name: '',
    role: '',
    image: '',
    bio: '',
    expertise: [''],
    email: '',
    linkedin: '',
    phone: '',
    isActive: true,
    order: 0
  })

  useEffect(() => {
    fetchTeamMember()
  }, [params.id])

  const fetchTeamMember = async () => {
    try {
      const response = await fetch(`/api/admin/team/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setForm({
          name: data.team.name || '',
          role: data.team.role || '',
          image: data.team.image || '',
          bio: data.team.bio || '',
          expertise: data.team.expertise && data.team.expertise.length > 0 ? data.team.expertise : [''],
          email: data.team.email || '',
          linkedin: data.team.linkedin || '',
          phone: data.team.phone || '',
          isActive: data.team.isActive !== undefined ? data.team.isActive : true,
          order: data.team.order || 0
        })
      } else {
        toast.error('Failed to fetch team member')
        router.push('/admin/team')
      }
    } catch (error) {
      toast.error('Error fetching team member')
      router.push('/admin/team')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Filter out empty expertise entries
      const filteredExpertise = form.expertise.filter(skill => skill.trim() !== '')
      
      if (filteredExpertise.length === 0) {
        toast.error('Please add at least one area of expertise')
        setLoading(false)
        return
      }

      const response = await fetch(`/api/admin/team/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          expertise: filteredExpertise
        }),
      })

      if (response.ok) {
        toast.success('Team member updated successfully')
        router.push('/admin/team')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update team member')
      }
    } catch (error) {
      toast.error('Error updating team member')
    } finally {
      setLoading(false)
    }
  }

  const addExpertise = () => {
    setForm(prev => ({
      ...prev,
      expertise: [...prev.expertise, '']
    }))
  }

  const removeExpertise = (index: number) => {
    setForm(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index)
    }))
  }

  const updateExpertise = (index: number, value: string) => {
    setForm(prev => ({
      ...prev,
      expertise: prev.expertise.map((skill, i) => i === index ? value : skill)
    }))
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Team Member"
        description="Update team member information"
        actions={(
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="role">Role/Position *</Label>
                <Input
                  id="role"
                  value={form.role}
                  onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g., Founder & CEO"
                  required
                />
              </div>

              <div>
                <Label htmlFor="bio">Biography *</Label>
                <Textarea
                  id="bio"
                  value={form.bio}
                  onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Enter a brief biography"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={form.isActive}
                  onCheckedChange={(checked) => setForm(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Active Status</Label>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@flyovereducation.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>

              <div>
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <Input
                  id="linkedin"
                  value={form.linkedin}
                  onChange={(e) => setForm(prev => ({ ...prev, linkedin: e.target.value }))}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Image */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Image</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageBBUpload
              value={form.image}
              onChange={(url) => setForm(prev => ({ ...prev, image: url }))}
              label="Upload Profile Image"
            />
          </CardContent>
        </Card>

        {/* Areas of Expertise */}
        <Card>
          <CardHeader>
            <CardTitle>Areas of Expertise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.expertise.map((skill, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={skill}
                  onChange={(e) => updateExpertise(index, e.target.value)}
                  placeholder="e.g., Strategic Leadership"
                  className="flex-1"
                />
                {form.expertise.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeExpertise(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addExpertise}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Expertise Area
            </Button>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-brand-600 hover:bg-brand-700"
          >
            {loading ? 'Updating...' : 'Update Team Member'}
          </Button>
        </div>
      </form>
    </div>
  )
}
