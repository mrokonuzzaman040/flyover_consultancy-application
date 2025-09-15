"use client"

import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type Resource = { id: string; title: string; slug: string; contentMD: string; tags: string[]; category?: string; author?: string; coverUrl?: string; status: string; createdAt: string };

export default function ViewResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [item, setItem] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    try { const res = await fetch(`/api/admin/resources/${id}`); if (!res.ok) throw new Error(); const data = await res.json(); setItem(data.resource); }
    catch { router.push('/admin/resources'); } finally { setLoading(false); }
  })(); }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
    </div>
  );

  if (!item) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">View Resource</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{item.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-gray-600">Slug: {item.slug}</div>
          <div className="text-sm text-gray-600">Status: {item.status}</div>
          {item.category && <div className="text-sm text-gray-600">Category: {item.category}</div>}
          {item.author && <div className="text-sm text-gray-600">Author: {item.author}</div>}
          {item.coverUrl && <div className="text-sm text-brand-600 break-all">Cover: {item.coverUrl}</div>}
          <div className="border rounded p-3 whitespace-pre-wrap text-sm">{item.contentMD}</div>
        </CardContent>
      </Card>
    </div>
  );
}
