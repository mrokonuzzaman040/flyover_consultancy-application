"use client";

import { useState, useEffect } from 'react';
import { toast } from "sonner";
import DataTable from '@/components/admin/DataTable';
import EmptyState from '@/components/admin/EmptyState';
import ListToolbar from '@/components/admin/ListToolbar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Phone, Mail, MapPin, Building, Clock } from 'lucide-react';

interface EventRegistration {
  _id: string;
  eventId: string | number;
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  jobTitle?: string;
  location?: string;
  registrationDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  specialRequirements?: string;
  emergencyContact?: string;
  howHear?: string;
  expectations?: string;
  questions?: string;
  event?: {
    title: string;
    slug: string;
    date?: string;
    time?: string;
    location?: string;
  };
}

export default function EventLeadsPage() {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState<EventRegistration | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/event-registrations');
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data.registrations || []);
      } else {
        toast.error('Failed to fetch event registrations');
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('Error loading event registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (registration: EventRegistration) => {
    setSelectedRegistration(registration);
    setIsViewModalOpen(true);
  };

  const handleStatusUpdate = async (id: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      const response = await fetch(`/api/event-registrations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(`Registration ${newStatus} successfully`);
        fetchRegistrations();
        setIsViewModalOpen(false);
      } else {
        toast.error('Failed to update registration status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating registration status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'refunded':
        return <Badge className="bg-gray-100 text-gray-800">Refunded</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = 
      registration.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.phone.includes(searchTerm) ||
      (registration.event?.title && registration.event.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || registration.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (registration: EventRegistration) => (
        <div className="flex items-center">
          <User className="h-4 w-4 text-gray-400 mr-2" />
          <span className="font-medium">{registration.fullName}</span>
        </div>
      ),
    },
    {
      key: 'event',
      header: 'Event',
      render: (registration: EventRegistration) => (
        <div>
          <div className="font-medium">{registration.event?.title || 'Unknown Event'}</div>
          {registration.event?.date && (
            <div className="text-sm text-gray-500">{registration.event.date}</div>
          )}
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (registration: EventRegistration) => (
        <div>
          <div className="flex items-center text-sm">
            <Mail className="h-3 w-3 text-gray-400 mr-1" />
            {registration.email}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Phone className="h-3 w-3 text-gray-400 mr-1" />
            {registration.phone}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (registration: EventRegistration) => getStatusBadge(registration.status),
    },
    {
      key: 'payment',
      header: 'Payment',
      render: (registration: EventRegistration) => getPaymentStatusBadge(registration.paymentStatus),
    },
    {
      key: 'registered',
      header: 'Registered',
      render: (registration: EventRegistration) => (
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-3 w-3 text-gray-400 mr-1" />
          {formatDate(registration.registrationDate)}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (registration: EventRegistration) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleView(registration)}
        >
          View Details
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Event Leads</h1>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Leads</h1>
          <p className="text-gray-600">Manage event registrations and leads</p>
        </div>
      </div>

      <ListToolbar
        search={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search registrations..."
      >
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </ListToolbar>

      {filteredRegistrations.length === 0 ? (
        <EmptyState
          title="No event registrations found"
          description="Event registrations will appear here when users register for events."
        />
      ) : (
        <DataTable
          data={filteredRegistrations}
          columns={columns}
          rowKey={(registration) => registration._id}
        />
      )}

      {/* View Registration Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
          </DialogHeader>
          
          {selectedRegistration && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-sm text-gray-900">{selectedRegistration.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm text-gray-900">{selectedRegistration.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-sm text-gray-900">{selectedRegistration.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p className="text-sm text-gray-900">{selectedRegistration.location || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Company</label>
                    <p className="text-sm text-gray-900">{selectedRegistration.company || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Job Title</label>
                    <p className="text-sm text-gray-900">{selectedRegistration.jobTitle || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Event Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Event Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Event</label>
                    <p className="text-sm text-gray-900">{selectedRegistration.event?.title || 'Unknown Event'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Registration Date</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedRegistration.registrationDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedRegistration.status)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Payment Status</label>
                    <div className="mt-1">{getPaymentStatusBadge(selectedRegistration.paymentStatus)}</div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {(selectedRegistration.howHear || selectedRegistration.expectations || selectedRegistration.specialRequirements || selectedRegistration.emergencyContact || selectedRegistration.questions) && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
                  <div className="space-y-4">
                    {selectedRegistration.howHear && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">How did you hear about this event?</label>
                        <p className="text-sm text-gray-900">{selectedRegistration.howHear}</p>
                      </div>
                    )}
                    {selectedRegistration.expectations && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Expectations</label>
                        <p className="text-sm text-gray-900">{selectedRegistration.expectations}</p>
                      </div>
                    )}
                    {selectedRegistration.specialRequirements && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Special Requirements</label>
                        <p className="text-sm text-gray-900">{selectedRegistration.specialRequirements}</p>
                      </div>
                    )}
                    {selectedRegistration.emergencyContact && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Emergency Contact</label>
                        <p className="text-sm text-gray-900">{selectedRegistration.emergencyContact}</p>
                      </div>
                    )}
                    {selectedRegistration.questions && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Questions/Comments</label>
                        <p className="text-sm text-gray-900">{selectedRegistration.questions}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                {selectedRegistration.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusUpdate(selectedRegistration._id, 'cancelled')}
                    >
                      Cancel Registration
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(selectedRegistration._id, 'confirmed')}
                    >
                      Confirm Registration
                    </Button>
                  </>
                )}
                {selectedRegistration.status === 'confirmed' && (
                  <Button
                    variant="outline"
                    onClick={() => handleStatusUpdate(selectedRegistration._id, 'cancelled')}
                  >
                    Cancel Registration
                  </Button>
                )}
                {selectedRegistration.status === 'cancelled' && (
                  <Button
                    onClick={() => handleStatusUpdate(selectedRegistration._id, 'confirmed')}
                  >
                    Reconfirm Registration
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
