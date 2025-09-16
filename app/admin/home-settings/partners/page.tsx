"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Building2 } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import EmptyState from "@/components/admin/EmptyState";
import Image from "next/image";

interface Partner {
  _id: string;
  id: number;
  name: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    logo: "",
  });

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/admin/partners');
      if (response.ok) {
        const data = await response.json();
        setPartners(data.partners || []);
      }
    } catch (error) {
      console.error('Failed to fetch partners:', error);
      toast.error('Failed to fetch partners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      logo: "",
    });
    setEditingPartner(null);
  };

  const handleCreate = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Partner created successfully');
        await fetchPartners();
        resetForm();
        setIsDialogOpen(false);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create partner');
      }
    } catch (error) {
      console.error('Error creating partner:', error);
      toast.error('Failed to create partner');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      logo: partner.logo,
    });
    setIsDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingPartner) return;
    
    try {
      setSaving(true);
      const response = await fetch(`/api/admin/partners/${editingPartner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Partner updated successfully');
        await fetchPartners();
        resetForm();
        setIsDialogOpen(false);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update partner');
      }
    } catch (error) {
      console.error('Error updating partner:', error);
      toast.error('Failed to update partner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (partner: Partner) => {
    if (!confirm('Are you sure you want to delete this partner?')) return;
    
    setDeleteLoading(partner.id);
    try {
      const response = await fetch(`/api/admin/partners/${partner.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Partner deleted successfully');
        await fetchPartners();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete partner');
      }
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast.error('Failed to delete partner');
    } finally {
      setDeleteLoading(null);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Partner',
      render: (partner: Partner) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-medium">{partner.name}</div>
          </div>
        </div>
      )
    },
    {
      key: 'logo',
      header: 'Logo',
      render: (partner: Partner) => {
        // Check if logo is a URL or just text
        const isUrl = partner.logo && (partner.logo.startsWith('http') || partner.logo.startsWith('/'));
        
        if (isUrl) {
          return (
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
              <Image 
                src={partner.logo} 
                alt={partner.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/logo.png';
                }}
              />
            </div>
          );
        } else {
          // Display text as a badge/placeholder
          return (
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
              {partner.logo || partner.name.substring(0, 2).toUpperCase()}
            </div>
          );
        }
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (partner: Partner) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(partner)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(partner)}
            disabled={deleteLoading === partner.id}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader title="Partners Management" description="Manage partner organizations and institutions" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader title="Partners Management" description="Manage partner organizations and institutions" />
      
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {partners.length} partner{partners.length !== 1 ? 's' : ''} total
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Partner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPartner ? 'Edit Partner' : 'Add New Partner'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Partner organization name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
              </div>
              <div>
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  value={formData.logo}
                  onChange={(e) => setFormData({...formData, logo: e.target.value})}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={editingPartner ? handleUpdate : handleCreate}
                  disabled={saving || !formData.name}
                >
                  {saving ? 'Saving...' : editingPartner ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {partners.length === 0 ? (
        <EmptyState
          title="No partners yet"
          description="Get started by adding your first partner organization."
        />
      ) : (
        <DataTable data={partners} columns={columns} rowKey={(partner) => partner._id} />
      )}
    </div>
  );
}