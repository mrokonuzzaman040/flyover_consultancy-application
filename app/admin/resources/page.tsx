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
import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import ListToolbar from "@/components/admin/ListToolbar";
import EmptyState from "@/components/admin/EmptyState";

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resources"
        description="Articles and guides for your audience"
        actions={(
          <Button onClick={() => router.push('/admin/resources/create')} className="bg-brand-600 hover:bg-brand-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Resource
          </Button>
        )}
      />

      <ListToolbar search={searchTerm} onSearchChange={setSearchTerm} searchPlaceholder="Search resources...">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
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
      </ListToolbar>

      {filtered.length === 0 ? (
        <EmptyState title="No resources found" />
      ) : (
        <DataTable
          columns={[
            { key: 'title', header: 'Title', render: (r: Resource) => (
              <div className="flex flex-col">
                <span className="font-medium text-slate-900 line-clamp-1">{r.title}</span>
                <span className="text-xs text-slate-500">/{r.slug}</span>
              </div>
            )},
            { key: 'category', header: 'Category', hideOn: 'sm', render: (r: Resource) => r.category || 'General' },
            { key: 'status', header: 'Status', hideOn: 'md', render: (r: Resource) => <Badge className={getStatusColor(r.status)}>{r.status}</Badge> },
            { key: 'createdAt', header: 'Created', hideOn: 'lg', render: (r: Resource) => new Date(r.createdAt).toLocaleDateString() },
            { key: 'actions', header: 'Actions', headerClassName: 'text-right', cellClassName: 'text-right', render: (r: Resource) => (
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => router.push(`/admin/resources/${r.id}`)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => router.push(`/admin/resources/${r.id}/edit`)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(r)} disabled={deleteLoading === r.id} className="text-brand-600 hover:text-brand-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )},
          ]}
          data={filtered}
          rowKey={(r) => r.id}
        />
      )}
    </div>
  );
}
