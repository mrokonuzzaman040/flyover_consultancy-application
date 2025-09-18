"use client"

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type Status = "draft" | "published" | "archived";

interface Scholarship {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  country: string[];
  deadline?: string;
  amount?: string;
  eligibility?: string;
  requirements?: string;
  applicationProcess?: string;
  website?: string;
  tags: string[];
  status: Status;
}

export default function EditScholarshipPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    country: "",
    deadline: "",
    amount: "",
    eligibility: "",
    requirements: "",
    applicationProcess: "",
    website: "",
    tags: "",
    status: "draft" as Status,
  });

  useEffect(() => {
    if (params.id) {
      fetchScholarship(params.id as string);
    }
  }, [params.id]);

  const fetchScholarship = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/scholarships/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch scholarship');
      }
      const data = await response.json();
      const scholarship = data.scholarship;
      
      setScholarship(scholarship);
      setFormData({
        title: scholarship.title,
        slug: scholarship.slug,
        description: scholarship.description || "",
        country: scholarship.country.join(', '),
        deadline: scholarship.deadline ? new Date(scholarship.deadline).toISOString().split('T')[0] : "",
        amount: scholarship.amount || "",
        eligibility: scholarship.eligibility || "",
        requirements: scholarship.requirements || "",
        applicationProcess: scholarship.applicationProcess || "",
        website: scholarship.website || "",
        tags: scholarship.tags.join(', '),
        status: scholarship.status,
      });
    } catch (error) {
      console.error('Error fetching scholarship:', error);
      toast.error('Failed to load scholarship');
      router.push('/admin/scholarships');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/scholarships/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          country: formData.country.split(',').map(t => t.trim()).filter(Boolean),
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update scholarship');
      }
      
      toast.success('Scholarship updated successfully');
      router.push('/admin/scholarships');
    } catch (error) {
      console.error('Error updating scholarship:', error);
      toast.error('Failed to update scholarship');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Scholarship not found</p>
        <Button className="mt-4" onClick={() => router.push('/admin/scholarships')}>
          Back to Scholarships
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Scholarship</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Scholarship Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Title *</Label>
                <Input 
                  value={formData.title} 
                  onChange={(e) => handleTitleChange(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <Label>Slug *</Label>
                <Input 
                  value={formData.slug} 
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })} 
                  required 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Deadline</Label>
                <Input 
                  type="date" 
                  value={formData.deadline} 
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} 
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(v: Status) => setFormData({ ...formData, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Countries (comma separated)</Label>
                <Input 
                  value={formData.country} 
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })} 
                  placeholder="e.g., United States, United Kingdom"
                />
              </div>
              <div>
                <Label>Scholarship Amount</Label>
                <Input 
                  value={formData.amount} 
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })} 
                  placeholder="e.g., Full tuition + $25,000 stipend"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Website URL</Label>
                <Input 
                  value={formData.website} 
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })} 
                  placeholder="https://example.com/scholarship"
                />
              </div>
              <div>
                <Label>Tags (comma separated)</Label>
                <Input 
                  value={formData.tags} 
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })} 
                  placeholder="e.g., Full Funding, Graduate, Research"
                />
              </div>
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea 
                rows={4} 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                placeholder="Brief overview of the scholarship program..."
              />
            </div>
            
            <div>
              <Label>Eligibility Criteria</Label>
              <Textarea 
                rows={4} 
                value={formData.eligibility} 
                onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })} 
                placeholder="Who can apply for this scholarship..."
              />
            </div>
            
            <div>
              <Label>Requirements</Label>
              <Textarea 
                rows={4} 
                value={formData.requirements} 
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} 
                placeholder="Documents and qualifications needed..."
              />
            </div>
            
            <div>
              <Label>Application Process</Label>
              <Textarea 
                rows={4} 
                value={formData.applicationProcess} 
                onChange={(e) => setFormData({ ...formData, applicationProcess: e.target.value })} 
                placeholder="Step-by-step application instructions..."
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
