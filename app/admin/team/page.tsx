"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Eye, Plus, UserCheck, Mail, Phone } from "lucide-react"
import { toast } from "sonner"
import PageHeader from "@/components/admin/PageHeader"
import DataTable from "@/components/admin/DataTable"
import ListToolbar from "@/components/admin/ListToolbar"
import EmptyState from "@/components/admin/EmptyState"

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

export default function AdminTeamPage() {
  const router = useRouter()
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    try {
      const response = await fetch('/api/admin/team')
      if (response.ok) {
        const data = await response.json()
        setTeam(data.team || [])
      } else {
        toast.error('Failed to fetch team members')
      }
    } catch (error) {
      toast.error('Error fetching team members')
    } finally {
      setLoading(false)
    }
  }

  const navigateToCreate = () => {
    router.push('/admin/team/create')
  }

  const navigateToEdit = (member: TeamMember) => {
    router.push(`/admin/team/edit/${member.id}`)
  }

  const navigateToView = (member: TeamMember) => {
    router.push(`/admin/team/view/${member.id}`)
  }

  const navigateToDelete = (member: TeamMember) => {
    router.push(`/admin/team/delete/${member.id}`)
  }

  const filteredTeam = team.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        title="Team Management"
        description="Manage your team members and their information"
        actions={(
          <Button onClick={navigateToCreate} className="bg-brand-600 hover:bg-brand-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Team Member
          </Button>
        )}
      />

      <ListToolbar search={searchTerm} onSearchChange={setSearchTerm} searchPlaceholder="Search team members..." />

      {filteredTeam.length === 0 ? (
        <EmptyState title="No team members found" />
      ) : (
        <DataTable
          columns={[
            { key: 'member', header: 'Member', render: (member: TeamMember) => (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-600 text-white rounded-full flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">{member.name}</div>
                  <div className="text-sm text-slate-500">{member.role}</div>
                </div>
              </div>
            ) },
            { key: 'contact', header: 'Contact', hideOn: 'sm', render: (member: TeamMember) => (
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-slate-600">
                  <Mail className="w-3 h-3" />
                  {member.email}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-600">
                  <Phone className="w-3 h-3" />
                  {member.phone}
                </div>
              </div>
            ) },
            { key: 'expertise', header: 'Expertise', hideOn: 'md', render: (member: TeamMember) => (
              <div className="flex flex-wrap gap-1">
                {member.expertise.slice(0, 2).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {member.expertise.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{member.expertise.length - 2}
                  </Badge>
                )}
              </div>
            ) },
            { key: 'status', header: 'Status', hideOn: 'lg', render: (member: TeamMember) => (
              <Badge variant={member.isActive ? "default" : "secondary"}>
                {member.isActive ? 'Active' : 'Inactive'}
              </Badge>
            ) },
            { key: 'createdAt', header: 'Added', hideOn: 'lg', render: (member: TeamMember) => formatDate(member.createdAt) },
            { key: 'actions', header: 'Actions', headerClassName: 'text-right', cellClassName: 'text-right', render: (member: TeamMember) => (
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => navigateToView(member)}><Eye className="w-4 h-4" /></Button>
                <Button size="sm" variant="outline" onClick={() => navigateToEdit(member)}><Edit className="w-4 h-4" /></Button>
                <Button size="sm" variant="outline" onClick={() => navigateToDelete(member)} className="text-brand-600 hover:text-brand-700"><Trash2 className="w-4 h-4" /></Button>
              </div>
            ) },
          ]}
          data={filteredTeam}
          rowKey={(member) => member.id || member._id || `team-${team.indexOf(member)}`}
        />
      )}
    </div>
  )
}
