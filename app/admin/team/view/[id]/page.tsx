"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { ArrowLeft, Edit, Mail, Phone, Linkedin, UserCheck } from "lucide-react"
import PageHeader from "@/components/admin/PageHeader"
import Image from "next/image"

interface TeamMember {
  _id?: string
  id: string
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
  createdAt: string
  updatedAt: string
}

export default function ViewTeamMemberPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [member, setMember] = useState<TeamMember | null>(null)

  useEffect(() => {
    fetchTeamMember()
  }, [params.id])

  const fetchTeamMember = async () => {
    try {
      const response = await fetch(`/api/admin/team/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setMember(data.team)
      } else {
        toast.error('Failed to fetch team member')
        router.push('/admin/team')
      }
    } catch (error) {
      toast.error('Error fetching team member')
      router.push('/admin/team')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Team member not found</h2>
          <p className="text-gray-600 mt-2">The requested team member could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Member Details"
        description="View team member information"
        actions={(
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => router.push(`/admin/team/edit/${member.id}`)} className="bg-brand-600 hover:bg-brand-700">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        )}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="relative w-32 h-32 mx-auto">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 bg-brand-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-brand-600 font-medium">{member.role}</p>
              </div>

              <Badge variant={member.isActive ? "default" : "secondary"} className="mx-auto">
                {member.isActive ? 'Active' : 'Inactive'}
              </Badge>

              <div className="space-y-2 pt-4">
                <a 
                  href={`mailto:${member.email}`}
                  className="flex items-center justify-center text-gray-600 hover:text-brand-600 transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {member.email}
                </a>
                <a 
                  href={`tel:${member.phone}`}
                  className="flex items-center justify-center text-gray-600 hover:text-brand-600 transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {member.phone}
                </a>
                {member.linkedin && (
                  <a 
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-gray-600 hover:text-brand-600 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn Profile
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Biography */}
          <Card>
            <CardHeader>
              <CardTitle>Biography</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{member.bio}</p>
            </CardContent>
          </Card>

          {/* Areas of Expertise */}
          <Card>
            <CardHeader>
              <CardTitle>Areas of Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {member.expertise.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Display Order:</span>
                  <p className="text-gray-900">{member.order}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Status:</span>
                  <p className="text-gray-900">{member.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Created:</span>
                  <p className="text-gray-900">{formatDate(member.createdAt)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Last Updated:</span>
                  <p className="text-gray-900">{formatDate(member.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
