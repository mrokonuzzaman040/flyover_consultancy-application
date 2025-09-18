"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Award } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import EmptyState from "@/components/admin/EmptyState";
import Image from "next/image";
import ImageBBUpload from "@/components/admin/ImageBBUpload";

interface Award {
  id: number;
  title: string;
  image: string;
  year: number;
  createdAt: string;
  updatedAt: string;
}

export default function AwardsPage() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<Award | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const handleImageUpload = (image: { url: string; name: string; size: number }) => {
    setFormData(prev => ({
      ...prev,
      image: image.url
    }));
    toast.success('Image uploaded successfully!');
  };

  const handleImageRemove = () => {
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
    toast.success('Image removed successfully!');
  };

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    year: new Date().getFullYear(),
  });

  const fetchAwards = async () => {
    try {
      const response = await fetch('/api/admin/awards');
      if (response.ok) {
        const data = await response.json();
        setAwards(data.awards || []);
      }
    } catch (error) {
      console.error('Failed to fetch awards:', error);
      toast.error('Failed to fetch awards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      image: "",
      year: new Date().getFullYear(),
    });
    setEditingAward(null);
  };

  const handleCreate = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/awards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Award created successfully');
        await fetchAwards();
        resetForm();
        setIsDialogOpen(false);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create award');
      }
    } catch (error) {
      console.error('Error creating award:', error);
      toast.error('Failed to create award');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (award: Award) => {
    setEditingAward(award);
    setFormData({
      title: award.title,
      image: award.image,
      year: award.year,
    });
    setIsDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingAward) return;
    
    try {
      setSaving(true);
      const response = await fetch(`/api/admin/awards/${editingAward.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Award updated successfully');
        await fetchAwards();
        resetForm();
        setIsDialogOpen(false);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update award');
      }
    } catch (error) {
      console.error('Error updating award:', error);
      toast.error('Failed to update award');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (award: Award) => {
    if (!confirm('Are you sure you want to delete this award?')) return;
    
    setDeleteLoading(award.id);
    try {
      const response = await fetch(`/api/admin/awards/${award.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Award deleted successfully');
        await fetchAwards();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete award');
      }
    } catch (error) {
      console.error('Error deleting award:', error);
      toast.error('Failed to delete award');
    } finally {
      setDeleteLoading(null);
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (award: Award) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
            <Award className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-medium">{award.title}</div>
            <div className="text-sm text-gray-500">{award.year}</div>
          </div>
        </div>
      )
    },
    {
      key: 'image',
      header: 'Image',
      render: (award: Award) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
          {award.image && award.image.trim() !== '' ? (
            <Image 
              src={award.image} 
              alt={award.title || 'Award image'}
              className="w-full h-full object-cover"
              width={48}
              height={48}
              onError={(e) => {
                e.currentTarget.src = '/logo.png';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (award: Award) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(award)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(award)}
            disabled={deleteLoading === award.id}
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
        <PageHeader title="Awards Management" description="Manage company awards and recognitions" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Awards Management" 
        description="Manage company awards and recognitions"
        actions={(
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-brand-600 hover:bg-brand-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Award
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader className="pb-4 border-b">
                <DialogTitle className="text-xl font-semibold">
                  {editingAward ? 'Edit Award' : 'Add New Award'}
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {editingAward ? 'Update award information' : 'Add a new company award or recognition'}
                </p>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Award Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium">
                        Award Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Best Education Consultancy 2024"
                        className="h-10"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="year" className="text-sm font-medium">
                        Year <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="year"
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: parseInt(e.target.value) || new Date().getFullYear()})}
                        min="1900"
                        max={new Date().getFullYear() + 10}
                        className="h-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Award Image</h3>
                  
                  <div className="space-y-2">
                    <ImageBBUpload
                      label="Award Image"
                      currentImage={formData.image}
                      onUpload={handleImageUpload}
                      onRemove={handleImageRemove}
                      maxSize={2 * 1024 * 1024} // 2MB
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Upload an award certificate, trophy image, or recognition badge (max 2MB)
                    </p>
                  </div>
                  
                  {formData.image && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-3">Preview:</p>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-white border">
                          <Image
                            src={formData.image}
                            alt="Award preview"
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/logo.png';
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                              <Award className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="font-medium">{formData.title || 'Award Title'}</div>
                              <div className="text-sm text-gray-500">{formData.year}</div>
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
                  onClick={editingAward ? handleUpdate : handleCreate}
                  disabled={saving || !formData.title || !formData.image}
                  className="px-6"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {editingAward ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingAward ? 'Update Award' : 'Create Award'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      />
      
      <div className="mb-6">
        <div className="text-sm text-gray-500">
          {awards.length} award{awards.length !== 1 ? 's' : ''} total
        </div>
      </div>

      {awards.length === 0 ? (
        <EmptyState
          title="No awards yet"
          description="Get started by adding your first award or recognition."
        />
      ) : (
        <DataTable data={awards} columns={columns} rowKey={(award) => award.id.toString()} />
      )}
    </div>
  );
}