"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, BookOpen, Hash } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import EmptyState from "@/components/admin/EmptyState";

interface StudyAbroadStep {
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

export default function StudyAbroadStepsPage() {
  const [steps, setSteps] = useState<StudyAbroadStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<StudyAbroadStep | null>(null);
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

  const fetchSteps = async () => {
    try {
      const response = await fetch('/api/admin/study-abroad-steps');
      if (response.ok) {
        const data = await response.json();
        setSteps(data.studyAbroadSteps || []);
      }
    } catch (error) {
      console.error('Failed to fetch study abroad steps:', error);
      toast.error('Failed to fetch study abroad steps');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSteps();
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
    setEditingStep(null);
  };

  const handleCreate = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/study-abroad-steps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Study abroad step created successfully');
        await fetchSteps();
        resetForm();
        setIsDialogOpen(false);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create study abroad step');
      }
    } catch (error) {
      console.error('Error creating study abroad step:', error);
      toast.error('Failed to create study abroad step');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (step: StudyAbroadStep) => {
    setEditingStep(step);
    setFormData({
      title: step.title,
      description: step.description,
      icon: step.icon || "",
      order: step.order || 0,
      color: step.color || "",
      imageUrl: step.imageUrl || "",
    });
    setIsDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingStep) return;
    
    try {
      setSaving(true);
      const response = await fetch(`/api/admin/study-abroad-steps/${editingStep.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Study abroad step updated successfully');
        await fetchSteps();
        resetForm();
        setIsDialogOpen(false);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update study abroad step');
      }
    } catch (error) {
      console.error('Error updating study abroad step:', error);
      toast.error('Failed to update study abroad step');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (step: StudyAbroadStep) => {
    if (!confirm('Are you sure you want to delete this step?')) return;
    
    setDeleteLoading(step.id);
    try {
      const response = await fetch(`/api/admin/study-abroad-steps/${step.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Study abroad step deleted successfully');
        await fetchSteps();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete study abroad step');
      }
    } catch (error) {
      console.error('Error deleting study abroad step:', error);
      toast.error('Failed to delete study abroad step');
    } finally {
      setDeleteLoading(null);
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Step',
      render: (step: StudyAbroadStep) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-medium">{step.title}</div>
            <div className="text-sm text-gray-500 line-clamp-2">{step.description}</div>
          </div>
        </div>
      )
    },
    {
      key: 'order',
      header: 'Order',
      render: (step: StudyAbroadStep) => (
        <Badge variant="secondary">
          <Hash className="h-3 w-3 mr-1" />
          {step.order || 0}
        </Badge>
      )
    },
    {
      key: 'color',
      header: 'Color',
      render: (step: StudyAbroadStep) => (
        step.color ? (
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full border" 
              style={{ backgroundColor: step.color }}
            />
            <span className="text-sm">{step.color}</span>
          </div>
        ) : '-'
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (step: StudyAbroadStep) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(step)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(step)}
            disabled={deleteLoading === step.id}
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
        <PageHeader title="Study Abroad Steps" description="Manage the step-by-step process for studying abroad" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader title="Study Abroad Steps" description="Manage the step-by-step process for studying abroad" />
      
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {steps.length} step{steps.length !== 1 ? 's' : ''} total
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingStep ? 'Edit Study Abroad Step' : 'Add New Study Abroad Step'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Step title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Step description"
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
                    placeholder="#8B5CF6"
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
                  onClick={editingStep ? handleUpdate : handleCreate}
                  disabled={saving || !formData.title || !formData.description}
                >
                  {saving ? 'Saving...' : editingStep ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {steps.length === 0 ? (
        <EmptyState
          title="No steps yet"
          description="Get started by adding your first study abroad step."
        />
      ) : (
        <DataTable data={steps} columns={columns} rowKey={(step) => step.id.toString()} />
      )}
    </div>
  );
}