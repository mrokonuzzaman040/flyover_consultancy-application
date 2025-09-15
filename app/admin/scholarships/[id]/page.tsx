"use client"

import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type Scholarship = { id: string; title: string; slug: string; description?: string; eligibilityMD?: string; benefitsMD?: string; deadline?: string; country: string[]; tags: string[]; status: string; createdAt: string };

export default function ViewScholarshipPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [item, setItem] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    try { const res = await fetch(`/api/admin/scholarships/${id}`); if (!res.ok) throw new Error(); const data = await res.json(); setItem(data.scholarship); }
    catch { router.push('/admin/scholarships'); } finally { setLoading(false); }
  })(); }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!item) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">View Scholarship</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{item.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-gray-600">Slug: {item.slug}</div>
          <div className="text-sm text-gray-600">Status: {item.status}</div>
          {item.deadline && <div className="text-sm text-gray-600">Deadline: {new Date(item.deadline).toLocaleDateString()}</div>}
          {item.country?.length ? <div className="text-sm text-gray-600">Countries: {item.country.join(', ')}</div> : null}
          {item.tags?.length ? <div className="text-sm text-gray-600">Tags: {item.tags.join(', ')}</div> : null}
          {item.description && <div className="text-sm">{item.description}</div>}
          {item.eligibilityMD && <div className="border rounded p-3 whitespace-pre-wrap text-sm">{item.eligibilityMD}</div>}
          {item.benefitsMD && <div className="border rounded p-3 whitespace-pre-wrap text-sm">{item.benefitsMD}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
