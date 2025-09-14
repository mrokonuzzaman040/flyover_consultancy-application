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
import { toast } from "sonner";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Clock,
  RefreshCw,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface MeetingSchedule {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  preferredDate: string;
  preferredTime: string;
  scheduledDateTime: string;
  message?: string;
  preferredService?: string;
  urgency: "LOW" | "MEDIUM" | "HIGH";
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "CONFIRMED", label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  { value: "COMPLETED", label: "Completed", color: "bg-green-100 text-green-800" },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

const URGENCY_OPTIONS = [
  { value: "LOW", label: "Low", color: "bg-gray-100 text-gray-800" },
  { value: "MEDIUM", label: "Medium", color: "bg-orange-100 text-orange-800" },
  { value: "HIGH", label: "High", color: "bg-red-100 text-red-800" },
];

export default function AdminMeetingSchedulesPage() {
  const [meetings, setMeetings] = useState<MeetingSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingSchedule | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(urgencyFilter !== "all" && { urgency: urgencyFilter }),
      });

      const response = await fetch(`/api/meeting-schedules?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch meetings: ${response.statusText}`);
      }

      const data = await response.json();
      setMeetings(data.meetings || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err) {
      console.error("Error fetching meetings:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch meetings");
      toast.error("Failed to fetch meetings");
    } finally {
      setLoading(false);
    }
  };

  const updateMeetingStatus = async (meetingId: string, newStatus: string) => {
    try {
      setUpdatingStatus(meetingId);
      
      const response = await fetch(`/api/meeting-schedules/${meetingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update meeting status");
      }

      await fetchMeetings();
      toast.success("Meeting status updated successfully");
    } catch (err) {
      console.error("Error updating meeting status:", err);
      toast.error("Failed to update meeting status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const deleteMeeting = async (meetingId: string) => {
    if (!confirm("Are you sure you want to delete this meeting schedule?")) {
      return;
    }

    try {
      const response = await fetch(`/api/meeting-schedules/${meetingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete meeting");
      }

      await fetchMeetings();
      toast.success("Meeting deleted successfully");
      setShowDetails(false);
    } catch (err) {
      console.error("Error deleting meeting:", err);
      toast.error("Failed to delete meeting");
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [currentPage, searchTerm, statusFilter, urgencyFilter]);

  const getStatusBadge = (status: string) => {
    const statusOption = STATUS_OPTIONS.find(opt => opt.value === status);
    return (
      <Badge className={statusOption?.color || "bg-gray-100 text-gray-800"}>
        {statusOption?.label || status}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    const urgencyOption = URGENCY_OPTIONS.find(opt => opt.value === urgency);
    return (
      <Badge className={urgencyOption?.color || "bg-gray-100 text-gray-800"}>
        {urgencyOption?.label || urgency}
      </Badge>
    );
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString();
  };

  if (loading && meetings.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meeting Schedules</h1>
          <p className="text-muted-foreground">
            Manage and track meeting schedule requests from your website
          </p>
        </div>
        <Button onClick={fetchMeetings} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
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
            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgencies</SelectItem>
                {URGENCY_OPTIONS.map((urgency) => (
                  <SelectItem key={urgency.value} value={urgency.value}>
                    {urgency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Meetings List */}
      <div className="grid gap-4">
        {meetings.length === 0 && !loading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No meeting schedules found
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                {searchTerm || statusFilter !== "all" || urgencyFilter !== "all"
                  ? "No meetings match your current filters. Try adjusting your search criteria."
                  : "No meeting schedule requests have been submitted yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          meetings.map((meeting) => (
            <Card key={meeting.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{meeting.fullName}</h3>
                      {getStatusBadge(meeting.status)}
                      {getUrgencyBadge(meeting.urgency)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {meeting.phoneNumber}
                      </div>
                      {meeting.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {meeting.email}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDateTime(meeting.scheduledDateTime)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Created: {formatDateTime(meeting.createdAt)}
                      </div>
                    </div>
                    {meeting.preferredService && (
                      <div className="mt-2">
                        <Badge variant="outline">{meeting.preferredService}</Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedMeeting(meeting);
                        setShowDetails(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Select
                      value={meeting.status}
                      onValueChange={(value) => updateMeetingStatus(meeting.id, value)}
                      disabled={updatingStatus === meeting.id}
                    >
                      <SelectTrigger className="w-32">
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMeeting(meeting.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {meeting.message && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                      <p className="text-sm text-gray-700">{meeting.message}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 py-2 text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </Button>
        </div>
      )}

      {/* Meeting Details Modal */}
      {showDetails && selectedMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Meeting Details</CardTitle>
                  <CardDescription>Full information for this meeting request</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-sm">{selectedMeeting.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone Number</label>
                  <p className="text-sm">{selectedMeeting.phoneNumber}</p>
                </div>
                {selectedMeeting.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm">{selectedMeeting.email}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Preferred Service</label>
                  <p className="text-sm">{selectedMeeting.preferredService || "Not specified"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Scheduled Date & Time</label>
                  <p className="text-sm">{formatDateTime(selectedMeeting.scheduledDateTime)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Urgency</label>
                  <div>{getUrgencyBadge(selectedMeeting.urgency)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div>{getStatusBadge(selectedMeeting.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created At</label>
                  <p className="text-sm">{formatDateTime(selectedMeeting.createdAt)}</p>
                </div>
              </div>
              {selectedMeeting.message && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Message</label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">{selectedMeeting.message}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}