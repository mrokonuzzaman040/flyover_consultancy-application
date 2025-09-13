"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MessageSquare,
  Tag,
  X,
  RefreshCw,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  countryInterest: string[];
  serviceInterest: string[];
  message?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  source?: string;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "CLOSED";
  createdAt: string;
}

const COUNTRIES = [
  "Australia",
  "Canada",
  "United Kingdom",
  "United States",
  "New Zealand",
  "Germany",
  "France",
  "Other",
];

const STATUS_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "CONVERTED", label: "Converted" },
  { value: "CLOSED", label: "Closed" },
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingLead, setDeletingLead] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");

  // Modal states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryInterest: [] as string[],
    serviceInterest: [] as string[],
    message: "",
    status: "NEW" as Lead["status"],
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, statusFilter, countryFilter]);

  const fetchLeads = async () => {
    try {
      setError(null);
      const response = await fetch("/api/admin/leads");
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Failed to fetch leads (${response.status})`;
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error fetching leads";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    if (countryFilter !== "all") {
      filtered = filtered.filter((lead) =>
        lead.countryInterest.includes(countryFilter)
      );
    }

    setFilteredLeads(filtered);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      countryInterest: [],
      serviceInterest: [],
      message: "",
      status: "NEW",
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (lead: Lead) => {
    setSelectedLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
      countryInterest: lead.countryInterest,
      serviceInterest: lead.serviceInterest,
      message: lead.message || "",
      status: lead.status,
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (lead: Lead) => {
    setSelectedLead(lead);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isEditDialogOpen ? `/api/admin/leads/${selectedLead?.id}` : "/api/admin/leads";
      const method = isEditDialogOpen ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          isEditDialogOpen ? "Lead updated successfully" : "Lead created successfully"
        );
        setIsCreateDialogOpen(false);
        setIsEditDialogOpen(false);
        fetchLeads();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Failed to save lead (${response.status})`;
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error saving lead";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedLead) return;

    setDeletingLead(selectedLead.id);
    try {
      const response = await fetch(`/api/admin/leads/${selectedLead.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Lead deleted successfully");
        setIsDeleteDialogOpen(false);
        fetchLeads();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Failed to delete lead (${response.status})`;
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error deleting lead";
      toast.error(errorMessage);
    } finally {
      setDeletingLead(null);
    }
  };

  const getStatusBadge = (status: Lead["status"]) => {
    const variants = {
      NEW: "default",
      CONTACTED: "secondary",
      QUALIFIED: "outline",
      CONVERTED: "default",
      CLOSED: "secondary",
    } as const;

    return (
      <Badge variant={variants[status] || "default"}>
        {status}
      </Badge>
    );
  };

  if (loading && leads.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="bg-white p-4 rounded-lg border space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="flex-1 h-10" />
            <Skeleton className="w-48 h-10" />
            <Skeleton className="w-48 h-10" />
          </div>
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-4 w-64" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600">Manage and track your leads</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => fetchLeads()}
            disabled={loading || saving}
            variant="outline"
            size="sm"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
          <Button onClick={openCreateDialog} disabled={loading || saving}>
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            {error}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setError(null);
                fetchLeads();
              }}
            >
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={loading || saving}
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter} disabled={loading || saving}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={countryFilter} onValueChange={setCountryFilter} disabled={loading || saving}>
            <SelectTrigger className="w-48">
              <MapPin className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {COUNTRIES.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              New Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.filter((lead) => lead.status === "NEW").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Qualified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.filter((lead) => lead.status === "QUALIFIED").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Converted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.filter((lead) => lead.status === "CONVERTED").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card className="bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-600">Name</th>
                  <th className="text-left p-4 font-medium text-gray-600">Contact</th>
                  <th className="text-left p-4 font-medium text-gray-600">Countries</th>
                  <th className="text-left p-4 font-medium text-gray-600">Services</th>
                  <th className="text-left p-4 font-medium text-gray-600">Status</th>
                  <th className="text-left p-4 font-medium text-gray-600">Created</th>
                  <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900">{lead.name}</div>
                        {lead.message && (
                          <div className="text-xs text-gray-500 mt-1 max-w-xs truncate" title={lead.message}>
                            {lead.message}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-900">{lead.email}</span>
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">{lead.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {lead.countryInterest.slice(0, 2).map((country) => (
                          <Badge key={country} variant="outline" className="text-xs">
                            {country}
                          </Badge>
                        ))}
                        {lead.countryInterest.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{lead.countryInterest.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {lead.serviceInterest.slice(0, 2).map((service) => (
                          <Badge key={service} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {lead.serviceInterest.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{lead.serviceInterest.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(lead.status)}
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-600">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </div>
                      {lead.source && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {lead.source}
                        </Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewDialog(lead)}
                          disabled={loading || saving || deletingLead === lead.id}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(lead)}
                          disabled={loading || saving || deletingLead === lead.id}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(lead)}
                          className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                          disabled={loading || saving || deletingLead === lead.id}
                        >
                          {deletingLead === lead.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredLeads.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No leads found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      {(isCreateDialogOpen || isEditDialogOpen) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    {isEditDialogOpen ? "Edit Lead" : "Create New Lead"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {isEditDialogOpen ? "Update lead information" : "Add a new lead to your database"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setIsEditDialogOpen(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value as Lead["status"] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      setIsEditDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : isEditDialogOpen ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewDialogOpen && selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Lead Details</h2>
                  <p className="text-sm text-gray-500">View complete lead information</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Name</Label>
                    <p className="text-sm font-medium">{selectedLead.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-sm">{selectedLead.email}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Phone</Label>
                    {selectedLead.phone ? (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <p className="text-sm">{selectedLead.phone}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">Not provided</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedLead.status)}</div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Countries of Interest</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedLead.countryInterest.map((country) => (
                      <Badge key={country} variant="outline" className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {country}
                      </Badge>
                    ))}
                  </div>
                </div>
                {selectedLead.serviceInterest.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Services of Interest</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedLead.serviceInterest.map((service) => (
                        <Badge key={service} variant="outline" className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedLead.message && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Message</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                        <p className="text-sm">{selectedLead.message}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Source</Label>
                    <p className="text-sm">{selectedLead.source || "Not specified"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Created</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-sm">{new Date(selectedLead.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                {(selectedLead.utmSource || selectedLead.utmMedium || selectedLead.utmCampaign) && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">UTM Parameters</Label>
                    <div className="mt-1 space-y-1">
                      {selectedLead.utmSource && (
                        <p className="text-xs text-gray-600">Source: {selectedLead.utmSource}</p>
                      )}
                      {selectedLead.utmMedium && (
                        <p className="text-xs text-gray-600">Medium: {selectedLead.utmMedium}</p>
                      )}
                      {selectedLead.utmCampaign && (
                        <p className="text-xs text-gray-600">Campaign: {selectedLead.utmCampaign}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteDialogOpen && selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-red-600">Delete Lead</h2>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete the lead for{" "}
                  <span className="font-medium">{selectedLead.name}</span>?
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}