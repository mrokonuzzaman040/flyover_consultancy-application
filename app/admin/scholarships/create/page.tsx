"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type Status = "draft" | "published" | "archived";

export default function CreateScholarshipPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    eligibilityMD: "",
    benefitsMD: "",
    deadline: "",
    country: "",
    tags: "",
    status: "draft" as Status,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch('/api/admin/scholarships', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          country: formData.country.split(',').map(t => t.trim()).filter(Boolean),
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
        })
      });
      if (!res.ok) throw new Error('Failed to create scholarship');
      toast.success('Scholarship created'); router.push('/admin/scholarships');
    } catch { toast.error('Failed to create scholarship'); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Create Scholarship</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Title *</Label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div>
                <Label>Slug *</Label>
                <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Deadline</Label>
                <Input type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v: Status) => setFormData({ ...formData, status: v })}>
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
                <Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
              </div>
              <div>
                <Label>Tags (comma separated)</Label>
                <Input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div>
              <Label>Eligibility (Markdown)</Label>
              <Textarea rows={6} value={formData.eligibilityMD} onChange={(e) => setFormData({ ...formData, eligibilityMD: e.target.value })} />
            </div>
            <div>
              <Label>Benefits (Markdown)</Label>
              <Textarea rows={6} value={formData.benefitsMD} onChange={(e) => setFormData({ ...formData, benefitsMD: e.target.value })} />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

