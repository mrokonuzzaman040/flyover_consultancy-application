"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { ArrowLeft, Trash2, AlertTriangle } from "lucide-react"
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

export default function DeleteTeamMemberPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
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

  const handleDelete = async () => {
    setDeleting(true)
    
    try {
      const response = await fetch(`/api/admin/team/${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Team member deleted successfully')
        router.push('/admin/team')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete team member')
      }
    } catch (error) {
      toast.error('Error deleting team member')
    } finally {
      setDeleting(false)
    }
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
        title="Delete Team Member"
        description="Confirm team member deletion"
        actions={(
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
      />

      {/* Warning Card */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center text-red-800">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Warning: This action cannot be undone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">
            You are about to permanently delete this team member. This will remove all their information 
            from the database and they will no longer appear on the public team page.
          </p>
        </CardContent>
      </Card>

      {/* Team Member Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Team Member to Delete</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              {member.image ? (
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-brand-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
              <p className="text-brand-600 font-medium">{member.role}</p>
              <p className="text-gray-600 text-sm mt-1">{member.email}</p>
              
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={member.isActive ? "default" : "secondary"}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <span className="text-xs text-gray-500">
                  Created {new Date(member.createdAt).toLocaleDateString()}
                </span>
              </div>

              {member.expertise.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Expertise:</p>
                  <div className="flex flex-wrap gap-1">
                    {member.expertise.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {member.expertise.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{member.expertise.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={deleting}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={deleting}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {deleting ? 'Deleting...' : 'Delete Team Member'}
        </Button>
      </div>
    </div>
  )
}
