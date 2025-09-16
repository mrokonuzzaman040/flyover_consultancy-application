"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Star, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import EmptyState from "@/components/admin/EmptyState";

interface SuccessStory {
  id: number;
  name: string;
  university: string;
  country: string;
  course: string;
  testimonial: string;
  imageUrl?: string;
  rating?: number;
  year?: number;
  program?: string;
  createdAt: string;
  updatedAt: string;
}

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    university: "",
    country: "",
    course: "",
    testimonial: "",
    imageUrl: "",
    rating: 5,
    year: new Date().getFullYear(),
    program: "",
  });

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/admin/success-stories');
      if (response.ok) {
        const data = await response.json();
        setStories(data.successStories || []);
      }
    } catch (error) {
      console.error('Failed to fetch success stories:', error);
      toast.error('Failed to fetch success stories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      university: "",
      country: "",
      course: "",
      testimonial: "",
      imageUrl: "",
      rating: 5,
      year: new Date().getFullYear(),
      program: "",
    });
    setEditingStory(null);
  };

  const handleCreate = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/success-stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Success story created successfully');
        await fetchStories();
        resetForm();
        setIsDialogOpen(false);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create success story');
      }
    } catch (error) {
      console.error('Error creating success story:', error);
      toast.error('Failed to create success story');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (story: SuccessStory) => {
    setEditingStory(story);
    setFormData({
      name: story.name,
      university: story.university,
      country: story.country,
      course: story.course,
      testimonial: story.testimonial,
      imageUrl: story.imageUrl || "",
      rating: story.rating || 5,
      year: story.year || new Date().getFullYear(),
      program: story.program || "",
    });
    setIsDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingStory) return;
    
    try {
      setSaving(true);
      const response = await fetch(`/api/admin/success-stories/${editingStory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Success story updated successfully');
        await fetchStories();
        resetForm();
        setIsDialogOpen(false);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update success story');
      }
    } catch (error) {
      console.error('Error updating success story:', error);
      toast.error('Failed to update success story');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (story: SuccessStory) => {
    if (!confirm('Are you sure you want to delete this success story?')) return;
    
    setDeleteLoading(story.id);
    try {
      const response = await fetch(`/api/admin/success-stories/${story.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Success story deleted successfully');
        await fetchStories();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete success story');
      }
    } catch (error) {
      console.error('Error deleting success story:', error);
      toast.error('Failed to delete success story');
    } finally {
      setDeleteLoading(null);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Student',
      render: (story: SuccessStory) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-medium">{story.name}</div>
            <div className="text-sm text-gray-500">{story.university}</div>
          </div>
        </div>
      )
    },
    {
      key: 'course',
      header: 'Course',
      render: (story: SuccessStory) => (
        <div>
          <div className="font-medium">{story.course}</div>
          <div className="text-sm text-gray-500">{story.country}</div>
        </div>
      )
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (story: SuccessStory) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < (story.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">({story.rating || 0})</span>
        </div>
      )
    },
    {
      key: 'year',
      header: 'Year',
      render: (story: SuccessStory) => (
        <Badge variant="secondary">{story.year || 'N/A'}</Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (story: SuccessStory) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(story)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(story)}
            disabled={deleteLoading === story.id}
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
        <PageHeader title="Success Stories" description="Manage student success stories and testimonials" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader title="Success Stories" description="Manage student success stories and testimonials" />
      
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {stories.length} success stor{stories.length !== 1 ? 'ies' : 'y'} total
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Success Story
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {editingStory ? 'Edit Success Story' : 'Add New Success Story'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Student Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Student name"
                  />
                </div>
                <div>
                  <Label htmlFor="university">University *</Label>
                  <Input
                    id="university"
                    value={formData.university}
                    onChange={(e) => setFormData({...formData, university: e.target.value})}
                    placeholder="University name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    placeholder="Country"
                  />
                </div>
                <div>
                  <Label htmlFor="course">Course *</Label>
                  <Input
                    id="course"
                    value={formData.course}
                    onChange={(e) => setFormData({...formData, course: e.target.value})}
                    placeholder="Course name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    min="1900"
                    max={new Date().getFullYear() + 10}
                  />
                </div>
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                    min="1"
                    max="5"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="program">Program</Label>
                <Input
                  id="program"
                  value={formData.program}
                  onChange={(e) => setFormData({...formData, program: e.target.value})}
                  placeholder="Program type (e.g., Bachelor's, Master's)"
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
              <div>
                <Label htmlFor="testimonial">Testimonial *</Label>
                <Textarea
                  id="testimonial"
                  value={formData.testimonial}
                  onChange={(e) => setFormData({...formData, testimonial: e.target.value})}
                  placeholder="Student testimonial"
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={editingStory ? handleUpdate : handleCreate}
                  disabled={saving || !formData.name || !formData.university || !formData.country || !formData.course || !formData.testimonial}
                >
                  {saving ? 'Saving...' : editingStory ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {stories.length === 0 ? (
        <EmptyState
          title="No success stories yet"
          description="Get started by adding your first student success story."
        />
      ) : (
        <DataTable data={stories} columns={columns} rowKey={(story) => story.id.toString()} />
      )}
    </div>
  );
}