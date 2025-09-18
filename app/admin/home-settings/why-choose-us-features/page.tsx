"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Heart, Hash } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import EmptyState from "@/components/admin/EmptyState";

interface WhyChooseUsFeature {
  id: number;
  title: string;
  description: string;
  icon?: string;
  order?: number;
  color?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function WhyChooseUsFeaturesPage() {
  const [features, setFeatures] = useState<WhyChooseUsFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<WhyChooseUsFeature | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
    order: 0,
    color: "",
    imageUrl: "",
  });

  const fetchFeatures = async () => {
    try {
      const response = await fetch('/api/admin/why-choose-us-features');
      if (response.ok) {
        const data = await response.json();
        setFeatures(data.whyChooseUsFeatures || []);
      }
    } catch (error) {
      console.error('Failed to fetch why choose us features:', error);
      toast.error('Failed to fetch why choose us features');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      icon: "",
      order: 0,
      color: "",
      imageUrl: "",
    });
    setEditingFeature(null);
  };

  const handleCreate = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/why-choose-us-features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Why choose us feature created successfully');
        await fetchFeatures();
        resetForm();
        setIsDialogOpen(false);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create why choose us feature');
      }
    } catch (error) {
      console.error('Error creating why choose us feature:', error);
      toast.error('Failed to create why choose us feature');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (feature: WhyChooseUsFeature) => {
    setEditingFeature(feature);
    setFormData({
      title: feature.title,
      description: feature.description,
      icon: feature.icon || "",
      order: feature.order || 0,
      color: feature.color || "",
      imageUrl: feature.imageUrl || "",
    });
    setIsDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingFeature) return;
    
    try {
      setSaving(true);
      const response = await fetch(`/api/admin/why-choose-us-features/${editingFeature.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Why choose us feature updated successfully');
        await fetchFeatures();
        resetForm();
        setIsDialogOpen(false);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update why choose us feature');
      }
    } catch (error) {
      console.error('Error updating why choose us feature:', error);
      toast.error('Failed to update why choose us feature');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (feature: WhyChooseUsFeature) => {
    if (!confirm('Are you sure you want to delete this feature?')) return;
    
    setDeleteLoading(feature.id);
    try {
      const response = await fetch(`/api/admin/why-choose-us-features/${feature.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Why choose us feature deleted successfully');
        await fetchFeatures();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete why choose us feature');
      }
    } catch (error) {
      console.error('Error deleting why choose us feature:', error);
      toast.error('Failed to delete why choose us feature');
    } finally {
      setDeleteLoading(null);
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Feature',
      render: (feature: WhyChooseUsFeature) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-medium">{feature.title}</div>
            <div className="text-sm text-gray-500 line-clamp-2">{feature.description}</div>
          </div>
        </div>
      )
    },
    {
      key: 'order',
      header: 'Order',
      render: (feature: WhyChooseUsFeature) => (
        <Badge variant="secondary">
          <Hash className="h-3 w-3 mr-1" />
          {feature.order || 0}
        </Badge>
      )
    },
    {
      key: 'color',
      header: 'Color',
      render: (feature: WhyChooseUsFeature) => (
        feature.color ? (
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full border" 
              style={{ backgroundColor: feature.color }}
            />
            <span className="text-sm">{feature.color}</span>
          </div>
        ) : '-'
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (feature: WhyChooseUsFeature) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(feature)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(feature)}
            disabled={deleteLoading === feature.id}
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
        <PageHeader title="Why Choose Us Features" description="Manage features that highlight why students should choose your services" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader title="Why Choose Us Features" description="Manage features that highlight why students should choose your services" />
      
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {features.length} feature{features.length !== 1 ? 's' : ''} total
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingFeature ? 'Edit Why Choose Us Feature' : 'Add New Why Choose Us Feature'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Feature title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Feature description"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                    placeholder="Display order"
                  />
                </div>
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    placeholder="#EC4899"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="icon">Icon</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  placeholder="Icon name or class"
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={editingFeature ? handleUpdate : handleCreate}
                  disabled={saving || !formData.title || !formData.description}
                >
                  {saving ? 'Saving...' : editingFeature ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {features.length === 0 ? (
        <EmptyState
          title="No features yet"
          description="Get started by adding your first why choose us feature."
        />
      ) : (
        <DataTable data={features} columns={columns} rowKey={(feature) => feature.id.toString()} />
      )}
    </div>
  );
}