"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type ButtonLink = { label?: string; href?: string };
type Slide = { title?: string; subtitle?: string; imageUrl?: string; primaryButton?: ButtonLink; secondaryButton?: ButtonLink };
type Item = { title?: string; description?: string; imageUrl?: string; href?: string; icon?: string; name?: string; logoUrl?: string };
type ContentSection = { title?: string; contentMD?: string; imageUrl?: string; items?: Item[]; enabled?: boolean };
type HomeSettingsForm = {
  heroSlider: Slide[];
  transformSection: ContentSection;
  whyChooseSection: ContentSection;
  partnersSection: ContentSection;
};

const emptyForm: HomeSettingsForm = {
  heroSlider: [],
  transformSection: { title: "", contentMD: "", imageUrl: "", enabled: true },
  whyChooseSection: { title: "", items: [], enabled: true },
  partnersSection: { title: "", items: [], enabled: true },
};

export default function HomeSettingsPage() {
  const [form, setForm] = useState<HomeSettingsForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/home-settings");
      if (!res.ok) throw new Error("Failed to load home settings");
      const data = await res.json();
      const s = data.settings || {};
      const next: HomeSettingsForm = {
        heroSlider: s.heroSlider || [],
        transformSection: s.transformSection || { title: "", contentMD: "", imageUrl: "", enabled: true },
        whyChooseSection: s.whyChooseSection || { title: "", items: [], enabled: true },
        partnersSection: s.partnersSection || { title: "", items: [], enabled: true },
      };
      setForm(next);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load settings";
      toast.error(msg);
    } finally { setLoading(false); }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/home-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: form }),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      toast.success("Home settings saved");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to save";
      toast.error(msg);
    } finally { setSaving(false); }
  };

  const addSlide = () => setForm((prev) => ({ ...prev, heroSlider: [...prev.heroSlider, { title: "", subtitle: "", imageUrl: "" }] }));
  const removeSlide = (index: number) => setForm((prev) => ({ ...prev, heroSlider: prev.heroSlider.filter((_, i) => i !== index) }));

  const updateSlide = (index: number, patch: Partial<Slide>) => setForm((prev) => {
    const arr = [...prev.heroSlider];
    arr[index] = { ...arr[index], ...patch };
    return { ...prev, heroSlider: arr };
  });

  const addWhyItem = () => setForm((prev) => ({ ...prev, whyChooseSection: { ...prev.whyChooseSection, items: [...(prev.whyChooseSection.items || []), { title: "", description: "", icon: "" }] } }));
  const removeWhyItem = (index: number) => setForm((prev) => ({ ...prev, whyChooseSection: { ...prev.whyChooseSection, items: (prev.whyChooseSection.items || []).filter((_, i) => i !== index) } }));

  const updateWhyItem = (index: number, patch: Partial<Item>) => setForm((prev) => {
    const items = [...(prev.whyChooseSection.items || [])];
    items[index] = { ...items[index], ...patch };
    return { ...prev, whyChooseSection: { ...prev.whyChooseSection, items } };
  });

  const addPartner = () => setForm((prev) => ({ ...prev, partnersSection: { ...prev.partnersSection, items: [...(prev.partnersSection.items || []), { name: "", logoUrl: "", href: "" }] } }));
  const removePartner = (index: number) => setForm((prev) => ({ ...prev, partnersSection: { ...prev.partnersSection, items: (prev.partnersSection.items || []).filter((_, i) => i !== index) } }));
  const updatePartner = (index: number, patch: Partial<Item>) => setForm((prev) => {
    const items = [...(prev.partnersSection.items || [])];
    items[index] = { ...items[index], ...patch };
    return { ...prev, partnersSection: { ...prev.partnersSection, items } };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Home Settings</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchSettings} disabled={loading || saving}>Refresh</Button>
          <Button onClick={handleSave} disabled={loading || saving}>{saving ? "Saving..." : "Save"}</Button>
        </div>
      </div>

      {/* Hero Slider */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Slider</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" onClick={addSlide}>Add Slide</Button>
          </div>
          {(form.heroSlider || []).map((s, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Title</Label>
                  <Input value={s.title || ""} onChange={(e) => updateSlide(i, { title: e.target.value })} />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <Input value={s.subtitle || ""} onChange={(e) => updateSlide(i, { subtitle: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Image URL</Label>
                <Input value={s.imageUrl || ""} onChange={(e) => updateSlide(i, { imageUrl: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Primary Button</Label>
                  <Input placeholder="Label" value={s.primaryButton?.label || ""} onChange={(e) => updateSlide(i, { primaryButton: { ...s.primaryButton, label: e.target.value } })} />
                  <Input placeholder="Href" value={s.primaryButton?.href || ""} onChange={(e) => updateSlide(i, { primaryButton: { ...s.primaryButton, href: e.target.value } })} />
                </div>
                <div className="space-y-2">
                  <Label>Secondary Button</Label>
                  <Input placeholder="Label" value={s.secondaryButton?.label || ""} onChange={(e) => updateSlide(i, { secondaryButton: { ...s.secondaryButton, label: e.target.value } })} />
                  <Input placeholder="Href" value={s.secondaryButton?.href || ""} onChange={(e) => updateSlide(i, { secondaryButton: { ...s.secondaryButton, href: e.target.value } })} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" className="text-red-600" onClick={() => removeSlide(i)}>Remove</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Transform Section */}
      <Card>
        <CardHeader>
          <CardTitle>Transform Your Study Abroad Dreams</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input value={form.transformSection.title || ""} onChange={(e) => setForm({ ...form, transformSection: { ...form.transformSection, title: e.target.value } })} />
          </div>
          <div>
            <Label>Content (Markdown)</Label>
            <Textarea rows={6} value={form.transformSection.contentMD || ""} onChange={(e) => setForm({ ...form, transformSection: { ...form.transformSection, contentMD: e.target.value } })} />
          </div>
          <div>
            <Label>Image URL</Label>
            <Input value={form.transformSection.imageUrl || ""} onChange={(e) => setForm({ ...form, transformSection: { ...form.transformSection, imageUrl: e.target.value } })} />
          </div>
        </CardContent>
      </Card>

      {/* Why Choose Flyover */}
      <Card>
        <CardHeader>
          <CardTitle>Why Choose Flyover Global</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input value={form.whyChooseSection.title || ""} onChange={(e) => setForm({ ...form, whyChooseSection: { ...form.whyChooseSection, title: e.target.value } })} />
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={addWhyItem}>Add Feature</Button>
          </div>
          {(form.whyChooseSection.items || []).map((it, i) => (
            <div key={i} className="border rounded p-3 grid grid-cols-3 gap-2">
              <Input placeholder="Icon name" value={it.icon || ""} onChange={(e) => updateWhyItem(i, { icon: e.target.value })} />
              <Input placeholder="Title" value={it.title || ""} onChange={(e) => updateWhyItem(i, { title: e.target.value })} />
              <Input placeholder="Description" value={it.description || ""} onChange={(e) => updateWhyItem(i, { description: e.target.value })} />
              <div className="col-span-3 flex justify-end">
                <Button variant="outline" className="text-red-600" onClick={() => removeWhyItem(i)}>Remove</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Partners Section */}
      <Card>
        <CardHeader>
          <CardTitle>Our Global University Partners</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input value={form.partnersSection.title || ""} onChange={(e) => setForm({ ...form, partnersSection: { ...form.partnersSection, title: e.target.value } })} />
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={addPartner}>Add Partner</Button>
          </div>
          {(form.partnersSection.items || []).map((p, i) => (
            <div key={i} className="border rounded p-3 grid grid-cols-3 gap-2">
              <Input placeholder="Name" value={p.name || ""} onChange={(e) => updatePartner(i, { name: e.target.value })} />
              <Input placeholder="Logo URL" value={p.logoUrl || ""} onChange={(e) => updatePartner(i, { logoUrl: e.target.value })} />
              <Input placeholder="Website URL" value={p.href || ""} onChange={(e) => updatePartner(i, { href: e.target.value })} />
              <div className="col-span-3 flex justify-end">
                <Button variant="outline" className="text-red-600" onClick={() => removePartner(i)}>Remove</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
