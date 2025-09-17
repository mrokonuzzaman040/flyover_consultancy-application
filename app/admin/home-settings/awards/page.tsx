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
      <PageHeader title="Awards Management" description="Manage company awards and recognitions" />
      
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {awards.length} award{awards.length !== 1 ? 's' : ''} total
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Award
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingAward ? 'Edit Award' : 'Add New Award'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Award title"
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL *</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                  min="1900"
                  max={new Date().getFullYear() + 10}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={editingAward ? handleUpdate : handleCreate}
                  disabled={saving || !formData.title || !formData.image}
                >
                  {saving ? 'Saving...' : editingAward ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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