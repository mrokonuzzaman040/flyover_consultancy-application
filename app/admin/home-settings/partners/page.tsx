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
import ImageBBUpload from "@/components/admin/ImageBBUpload";

interface Partner {
  _id: string;
  id: number;
  name: string;
  category: string;
  country: string;
  logo: string;
  color: string;
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
    category: "",
    country: "",
    logo: "",
    color: "#1F4E79",
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
      category: "",
      country: "",
      logo: "",
      color: "#1F4E79",
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
      category: partner.category,
      country: partner.country,
      logo: partner.logo,
      color: partner.color,
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
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: partner.color || '#1F4E79' }}
          >
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-medium">{partner.name}</div>
            <div className="text-sm text-gray-500">{partner.category}</div>
          </div>
        </div>
      )
    },
    {
      key: 'country',
      header: 'Country',
      render: (partner: Partner) => (
        <span className="text-sm text-gray-600">{partner.country}</span>
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
              {partner.logo && partner.logo.trim() !== '' ? (
                <Image 
                  src={partner.logo} 
                  alt={partner.name || 'Partner logo'}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/logo.png';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  No Logo
                </div>
              )}
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
      <PageHeader 
        title="Partners Management" 
        description="Manage partner organizations and institutions"
        actions={(
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-brand-600 hover:bg-brand-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Partner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4 border-b">
              <DialogTitle className="text-xl font-semibold">
                {editingPartner ? 'Edit Partner' : 'Add New Partner'}
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                {editingPartner ? 'Update partner information' : 'Add a new partner organization'}
              </p>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Partner Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Harvard University"
                      className="h-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      placeholder="University, Testing Organization, etc."
                      className="h-10"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-medium">
                      Country <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      placeholder="United States"
                      className="h-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="color" className="text-sm font-medium">
                      Brand Color <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="color"
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={formData.color}
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                        placeholder="#1F4E79"
                        className="h-10 flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Logo</h3>
                
                <div className="space-y-2">
                  <ImageBBUpload
                    label="Partner Logo"
                    currentImage={formData.logo}
                    onUpload={(image) => setFormData({...formData, logo: image.url})}
                    onRemove={() => setFormData({...formData, logo: ""})}
                    maxSize={2 * 1024 * 1024} // 2MB
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Upload a high-quality logo image (recommended: square format, max 2MB)
                  </p>
                </div>
                
                {formData.logo && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-3">Preview:</p>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border">
                        <Image
                          src={formData.logo}
                          alt="Partner logo preview"
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/logo.png';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: formData.color }}
                          >
                            <Building2 className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">{formData.name || 'Partner Name'}</div>
                            <div className="text-sm text-gray-500">{formData.category || 'Category'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={saving}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                onClick={editingPartner ? handleUpdate : handleCreate}
                disabled={saving || !formData.name || !formData.category || !formData.country || !formData.logo || !formData.color}
                className="px-6"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingPartner ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editingPartner ? 'Update Partner' : 'Create Partner'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        )}
      />
      
      <div className="mb-6">
        <div className="text-sm text-gray-500">
          {partners.length} partner{partners.length !== 1 ? 's' : ''} total
        </div>
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