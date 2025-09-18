"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, UserPlus, Edit, Trash2, Shield, User, AlertCircle, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import PageHeader from "@/components/admin/PageHeader"
import DataTable from "@/components/admin/DataTable"
import ListToolbar from "@/components/admin/ListToolbar"
import EmptyState from "@/components/admin/EmptyState"

type User = {
  id: string
  name: string | null
  email: string
  role: string
  emailVerified: Date | null
  createdAt: string
  _count: {
    uploads: number
  }
}

type PaginationInfo = {
  page: number
  limit: number
  total: number
  pages: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [updatingRole, setUpdatingRole] = useState<string | null>(null)
  const [deletingUser, setDeletingUser] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })

  const fetchUsers = async (page = 1, search = "", role = "all") => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString()
      })
      
      if (search) {
        params.append('search', search)
      }
      
      if (role !== "all") {
        params.append('role', role)
      }

      const response = await fetch(`/api/admin/users?${params}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setPagination(data.pagination)
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch users' }))
        setError(errorData.message || 'Failed to fetch users')
        toast.error(errorData.message || "Failed to fetch users")
      }
    } catch (error) {
      console.error("Fetch users error:", error)
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers(1, searchTerm, roleFilter)
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setUpdatingRole(userId)
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      })

      if (response.ok) {
        toast.success("User role updated successfully")
        fetchUsers(pagination.page, searchTerm, roleFilter)
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update user role' }))
        toast.error(errorData.message || "Failed to update user role")
      }
    } catch (error) {
      console.error("Update role error:", error)
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred'
      toast.error(errorMessage)
    } finally {
      setUpdatingRole(null)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }

    try {
      setDeletingUser(userId)
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success("User deleted successfully")
        fetchUsers(pagination.page, searchTerm, roleFilter)
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete user' }))
        toast.error(errorData.message || "Failed to delete user")
      }
    } catch (error) {
      console.error("Delete user error:", error)
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred'
      toast.error(errorMessage)
    } finally {
      setDeletingUser(null)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive'
      case 'SUPPORT':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="h-4 w-4" />
      case 'SUPPORT':
        return <Shield className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage user accounts, roles, and permissions"
        actions={(
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        )}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users ({pagination.total})</CardTitle>
              <CardDescription>Browse and manage all user accounts</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchUsers(pagination.page, searchTerm, roleFilter)}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ListToolbar
            search={searchTerm}
            onSearchChange={(v) => setSearchTerm(v)}
            searchPlaceholder="Search users..."
            actions={(
              <Button type="button" onClick={() => fetchUsers(1, searchTerm, roleFilter)} disabled={loading}>
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>
            )}
          >
            <Select value={roleFilter} onValueChange={setRoleFilter} disabled={loading}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="SUPPORT">Support</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </ListToolbar>

          {error && (
            <Alert className="mb-6 border-brand-200 bg-brand-50">
              <AlertCircle className="h-4 w-4 text-brand-600" />
              <AlertDescription className="text-brand-800">
                {error}
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => fetchUsers(pagination.page, searchTerm, roleFilter)}
                  className="ml-2 h-auto p-0 text-brand-600 underline"
                >
                  Try again
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-64" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <EmptyState title="No users found" description="Try adjusting filters or search" />
          ) : (
            <DataTable
              columns={[
                {
                  key: "user",
                  header: "User",
                  render: (u: User) => (
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 bg-slate-100 rounded-full flex items-center justify-center">
                        {getRoleIcon(u.role)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">{u.name || "Unnamed User"}</span>
                          <Badge variant={getRoleBadgeVariant(u.role)}>{u.role}</Badge>
                          {u.emailVerified && <Badge variant="outline" className="text-green-600">Verified</Badge>}
                        </div>
                        <div className="text-xs text-slate-500">{u.email}</div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: "uploads",
                  header: "Uploads",
                  hideOn: "sm",
                  render: (u: User) => <span className="text-slate-600">{u._count.uploads}</span>,
                },
                {
                  key: "created",
                  header: "Joined",
                  hideOn: "md",
                  render: (u: User) => <span className="text-slate-600">{formatDate(u.createdAt)}</span>,
                },
                {
                  key: "actions",
                  header: "Actions",
                  headerClassName: "text-right",
                  cellClassName: "text-right",
                  render: (u: User) => (
                    <div className="flex items-center gap-2 justify-end">
                      <Select
                        value={u.role}
                        onValueChange={(value: string) => handleRoleChange(u.id, value)}
                        disabled={updatingRole === u.id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="SUPPORT">Support</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" disabled={updatingRole === u.id || deletingUser === u.id}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={updatingRole === u.id || deletingUser === u.id}
                        className="text-brand-600 hover:text-brand-700 disabled:text-gray-400"
                      >
                        {deletingUser === u.id ? (
                          <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-1" />
                        )}
                        Delete
                      </Button>
                    </div>
                  ),
                },
              ]}
              data={users}
              rowKey={(u) => u.id}
            />
          )}

          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} users
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchUsers(pagination.page - 1, searchTerm, roleFilter)}
                  disabled={pagination.page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchUsers(pagination.page + 1, searchTerm, roleFilter)}
                  disabled={pagination.page >= pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
