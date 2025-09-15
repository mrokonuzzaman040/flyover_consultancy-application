"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit, Eye, Plus, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Resource = {
  id: string;
  title: string;
  slug: string;
  contentMD: string;
  tags: string[];
  category?: string;
  author?: string;
  coverUrl?: string;
  status: string;
  publishedAt?: string;
  createdAt: string;
};

export default function AdminResourcesPage() {
  const router = useRouter();
  const [items, setItems] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/admin/resources');
      if (!res.ok) throw new Error('Failed to fetch resources');
      const data = await res.json();
      setItems(data.resources || []);
    } catch {
      toast.error('Failed to fetch resources');
    } finally { setLoading(false); }
  };

  const handleDelete = async (r: Resource) => {
    if (!confirm(`Delete resource "${r.title}"?`)) return;
    setDeleteLoading(r.id);
    try {
      const res = await fetch(`/api/admin/resources/${r.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Deleted');
      fetchItems();
    } catch { toast.error('Failed to delete'); }
    finally { setDeleteLoading(null); }
  };

  const filtered = items.filter((it) => {
    const s = searchTerm.toLowerCase();
    const matches = it.title.toLowerCase().includes(s) || (it.author || '').toLowerCase().includes(s) || (it.category || '').toLowerCase().includes(s);
    const st = statusFilter === 'all' || it.status === statusFilter;
    return matches && st;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
        <Button onClick={() => router.push('/admin/resources/create')} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Resource
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search resources..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((r) => (
          <Card key={r.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{r.title}</CardTitle>
                <Badge className={getStatusColor(r.status)}>{r.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{r.category || 'General'}</span>
                  <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => router.push(`/admin/resources/${r.id}`)} className="flex-1">
                    <Eye className="w-4 h-4 mr-1" /> View
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => router.push(`/admin/resources/${r.id}/edit`)} className="flex-1">
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(r)} disabled={deleteLoading === r.id} className="text-brand-600 hover:text-brand-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No resources found.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
