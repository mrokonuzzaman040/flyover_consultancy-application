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

export default function CreateResourcePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    contentMD: "",
    tags: "",
    category: "",
    author: "",
    coverUrl: "",
    status: "draft" as Status,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch('/api/admin/resources', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        })
      });
      if (!res.ok) throw new Error('Failed to create resource');
      toast.success('Resource created'); router.push('/admin/resources');
    } catch { toast.error('Failed to create resource'); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Create Resource</h1>
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
            <div>
              <Label>Content (Markdown) *</Label>
              <Textarea rows={10} value={formData.contentMD} onChange={(e) => setFormData({ ...formData, contentMD: e.target.value })} required />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Tags (comma separated)</Label>
                <Input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
              </div>
              <div>
                <Label>Category</Label>
                <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
              </div>
              <div>
                <Label>Author</Label>
                <Input value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Cover URL</Label>
                <Input value={formData.coverUrl} onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })} />
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

