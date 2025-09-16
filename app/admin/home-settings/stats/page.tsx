"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import EmptyState from "@/components/admin/EmptyState";

interface Stat {
  _id: string;
  id: number;
  label: string;
  number: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    label: "",
    number: "",
    description: "",
  });

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || []);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const resetForm = () => {
    setFormData({
      label: "",
      number: "",
      description: "",
    });
    setEditingStat(null);
  };

  const handleCreate = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Stat created successfully');
        await fetchStats();
        resetForm();
        setIsDialogOpen(false);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create stat');
      }
    } catch (error) {
      console.error('Error creating stat:', error);
      toast.error('Failed to create stat');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (stat: Stat) => {
    setEditingStat(stat);
    setFormData({
      label: stat.label,
      number: stat.number,
      description: stat.description,
    });
    setIsDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingStat) return;
    
    try {
      setSaving(true);
      const response = await fetch(`/api/admin/stats/${editingStat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Stat updated successfully');
        await fetchStats();
        resetForm();
        setIsDialogOpen(false);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update stat');
      }
    } catch (error) {
      console.error('Error updating stat:', error);
      toast.error('Failed to update stat');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (stat: Stat) => {
    if (!confirm('Are you sure you want to delete this stat?')) return;
    
    setDeleteLoading(stat.id);
    try {
      const response = await fetch(`/api/admin/stats/${stat.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Stat deleted successfully');
        await fetchStats();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete stat');
      }
    } catch (error) {
      console.error('Error deleting stat:', error);
      toast.error('Failed to delete stat');
    } finally {
      setDeleteLoading(null);
    }
  };

  const columns = [
    {
      key: 'label',
      header: 'Statistic',
      render: (stat: Stat) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-medium">{stat.label}</div>
            <div className="text-sm text-gray-500">{stat.description}</div>
          </div>
        </div>
      )
    },
    {
      key: 'number',
      header: 'Value',
      render: (stat: Stat) => (
        <div className="text-2xl font-bold text-green-600">{stat.number}</div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (stat: Stat) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(stat)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(stat)}
            disabled={deleteLoading === stat.id}
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
        <PageHeader title="Statistics Management" description="Manage company statistics and achievements" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader title="Statistics Management" description="Manage company statistics and achievements" />
      
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {stats.length} statistic{stats.length !== 1 ? 's' : ''} total
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Statistic
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingStat ? 'Edit Statistic' : 'Add New Statistic'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="label">Label *</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData({...formData, label: e.target.value})}
                    placeholder="e.g., Students Placed"
                  />
                </div>
                <div>
                  <Label htmlFor="number">Number *</Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) => setFormData({...formData, number: e.target.value})}
                    placeholder="e.g., 22,000+"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Statistic description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={editingStat ? handleUpdate : handleCreate}
                  disabled={saving || !formData.label || !formData.number || !formData.description}
                >
                  {saving ? 'Saving...' : editingStat ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {stats.length === 0 ? (
        <EmptyState
          title="No statistics yet"
          description="Get started by adding your first company statistic."
        />
      ) : (
        <DataTable data={stats} columns={columns} rowKey={(stat) => stat._id} />
      )}
    </div>
  );
}