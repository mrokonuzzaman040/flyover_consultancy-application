"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type ButtonLink = { label?: string; href?: string };
type Slide = { title?: string; subtitle?: string; headline?: string; sub?: string; imageUrl?: string; image?: string; primaryButton?: ButtonLink & { isModal?: boolean }; secondaryButton?: ButtonLink };
type Item = {
  title?: string;
  description?: string;
  imageUrl?: string;
  href?: string;
  icon?: string;
  name?: string;
  logoUrl?: string;
  stat?: string;
  statLabel?: string;
  number?: string;
  step?: string;
  year?: string;
  organization?: string;
  color?: string;
  city?: string;
  category?: string;
  country?: string;
  universityLogoUrl?: string;
};
type ContentSection = { title?: string; contentMD?: string; imageUrl?: string; items?: Item[]; enabled?: boolean };
type HomeSettingsForm = {
  heroSlider: Slide[];
  transformSection: ContentSection;
  servicesSection: ContentSection;
  destinationsSection: ContentSection;
  whyChooseSection: ContentSection;
  partnersSection: ContentSection;
  fiveStepsSection: ContentSection;
  awardsSection: ContentSection;
  upcomingEventsSection: ContentSection;
  successStoriesSection: ContentSection;
  insightsSection: ContentSection;
};

const emptyForm: HomeSettingsForm = {
  heroSlider: [],
  transformSection: { title: "", contentMD: "", imageUrl: "", enabled: true },
  servicesSection: { title: "", contentMD: "", enabled: true },
  destinationsSection: { title: "", items: [], enabled: true },
  whyChooseSection: { title: "", items: [], enabled: true },
  partnersSection: { title: "", items: [], enabled: true },
  fiveStepsSection: { title: "", items: [], enabled: true },
  awardsSection: { title: "", items: [], enabled: true },
  upcomingEventsSection: { title: "", contentMD: "", enabled: true },
  successStoriesSection: { title: "", contentMD: "", enabled: true },
  insightsSection: { title: "", contentMD: "", enabled: true },
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
        servicesSection: s.servicesSection || { title: "", contentMD: "", enabled: true },
        destinationsSection: s.destinationsSection || { title: "", items: [], enabled: true },
        whyChooseSection: s.whyChooseSection || { title: "", items: [], enabled: true },
        partnersSection: s.partnersSection || { title: "", items: [], enabled: true },
        fiveStepsSection: s.fiveStepsSection || { title: "", items: [], enabled: true },
        awardsSection: s.awardsSection || { title: "", items: [], enabled: true },
        upcomingEventsSection: s.upcomingEventsSection || { title: "", contentMD: "", enabled: true },
        successStoriesSection: s.successStoriesSection || { title: "", contentMD: "", enabled: true },
        insightsSection: s.insightsSection || { title: "", contentMD: "", enabled: true },
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

  const addWhyItem = () => setForm((prev) => ({ ...prev, whyChooseSection: { ...prev.whyChooseSection, items: [...(prev.whyChooseSection.items || []), { title: "", description: "", icon: "", stat: "", statLabel: "" }] } }));
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

      {/* Services Section (header only) */}
      <Card>
        <CardHeader>
          <CardTitle>Services Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input value={form.servicesSection.title || ""} onChange={(e) => setForm({ ...form, servicesSection: { ...form.servicesSection, title: e.target.value } })} />
          </div>
          <div>
            <Label>Subtitle / Description</Label>
            <Textarea rows={4} value={form.servicesSection.contentMD || ""} onChange={(e) => setForm({ ...form, servicesSection: { ...form.servicesSection, contentMD: e.target.value } })} />
          </div>
        </CardContent>
      </Card>

      {/* Destinations Section */}
      <Card>
        <CardHeader>
          <CardTitle>Top Institutions / Destinations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input value={form.destinationsSection.title || ""} onChange={(e) => setForm({ ...form, destinationsSection: { ...form.destinationsSection, title: e.target.value } })} />
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setForm((p)=>({...p, destinationsSection:{...p.destinationsSection, items:[...(p.destinationsSection.items||[]), { name:"", city:"", imageUrl:"", universityLogoUrl:"", description:""}]}}))}>Add Destination</Button>
          </div>
          {(form.destinationsSection.items || []).map((d, i) => (
            <div key={i} className="border rounded p-3 grid grid-cols-2 gap-2">
              <Input placeholder="Name" value={d.name || ""} onChange={(e)=>{
                const items=[...(form.destinationsSection.items||[])]; items[i]={...items[i], name:e.target.value}; setForm({...form, destinationsSection:{...form.destinationsSection, items}});
              }} />
              <Input placeholder="City" value={d.city || ""} onChange={(e)=>{
                const items=[...(form.destinationsSection.items||[])]; items[i]={...items[i], city:e.target.value}; setForm({...form, destinationsSection:{...form.destinationsSection, items}});
              }} />
              <Input placeholder="Image URL" value={d.imageUrl || ""} onChange={(e)=>{
                const items=[...(form.destinationsSection.items||[])]; items[i]={...items[i], imageUrl:e.target.value}; setForm({...form, destinationsSection:{...form.destinationsSection, items}});
              }} />
              <Input placeholder="University Logo URL" value={d.universityLogoUrl || ""} onChange={(e)=>{
                const items=[...(form.destinationsSection.items||[])]; items[i]={...items[i], universityLogoUrl:e.target.value}; setForm({...form, destinationsSection:{...form.destinationsSection, items}});
              }} />
              <div className="col-span-2">
                <Textarea placeholder="Short description" value={d.description || ""} onChange={(e)=>{
                  const items=[...(form.destinationsSection.items||[])]; items[i]={...items[i], description:e.target.value}; setForm({...form, destinationsSection:{...form.destinationsSection, items}});
                }} />
              </div>
              <div className="col-span-2 flex justify-end">
                <Button variant="outline" className="text-red-600" onClick={()=>{
                  setForm((p)=>({...p, destinationsSection:{...p.destinationsSection, items:(p.destinationsSection.items||[]).filter((_,idx)=>idx!==i)}}))
                }}>Remove</Button>
              </div>
            </div>
          ))}
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
              <Input placeholder="Stat (e.g., 22K+)" value={it.stat || ""} onChange={(e) => updateWhyItem(i, { stat: e.target.value })} />
              <Input placeholder="Stat Label (e.g., Success Stories)" value={it.statLabel || ""} onChange={(e) => updateWhyItem(i, { statLabel: e.target.value })} />
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
              <Input placeholder="Category" value={p.category || ""} onChange={(e) => updatePartner(i, { category: e.target.value })} />
              <Input placeholder="Country" value={p.country || ""} onChange={(e) => updatePartner(i, { country: e.target.value })} />
              <div className="col-span-3 flex justify-end">
                <Button variant="outline" className="text-red-600" onClick={() => removePartner(i)}>Remove</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Study Steps, Awards, Upcoming Events, Success Stories, Insights are appended below */}

      {/* Study Abroad in 5 Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Study Abroad in 5 Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input value={form.fiveStepsSection.title || ""} onChange={(e) => setForm({ ...form, fiveStepsSection: { ...form.fiveStepsSection, title: e.target.value } })} />
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={()=>setForm((p)=>({...p, fiveStepsSection:{...p.fiveStepsSection, items:[...(p.fiveStepsSection.items||[]), { step:"01", title:"", description:""}]}}))}>Add Step</Button>
          </div>
          {(form.fiveStepsSection.items || []).map((st, i) => (
            <div key={i} className="border rounded p-3 grid grid-cols-3 gap-2">
              <Input placeholder="Step number (e.g., 01)" value={st.step || ""} onChange={(e)=>{
                const items=[...(form.fiveStepsSection.items||[])]; items[i]={...items[i], step:e.target.value}; setForm({...form, fiveStepsSection:{...form.fiveStepsSection, items}});
              }} />
              <Input placeholder="Title" value={st.title || ""} onChange={(e)=>{
                const items=[...(form.fiveStepsSection.items||[])]; items[i]={...items[i], title:e.target.value}; setForm({...form, fiveStepsSection:{...form.fiveStepsSection, items}});
              }} />
              <Input placeholder="Description" value={st.description || ""} onChange={(e)=>{
                const items=[...(form.fiveStepsSection.items||[])]; items[i]={...items[i], description:e.target.value}; setForm({...form, fiveStepsSection:{...form.fiveStepsSection, items}});
              }} />
              <div className="col-span-3 flex justify-end">
                <Button variant="outline" className="text-red-600" onClick={()=>setForm((p)=>({...p, fiveStepsSection:{...p.fiveStepsSection, items:(p.fiveStepsSection.items||[]).filter((_,idx)=>idx!==i)}}))}>Remove</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Awards & Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Awards & Achievements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input value={form.awardsSection.title || ""} onChange={(e)=>setForm({...form, awardsSection:{...form.awardsSection, title:e.target.value}})} />
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={()=>setForm((p)=>({...p, awardsSection:{...p.awardsSection, items:[...(p.awardsSection.items||[]), { title:"", description:"", year:"", organization:"", color:"" }]}}))}>Add Award</Button>
          </div>
          {(form.awardsSection.items||[]).map((aw, i)=>(
            <div key={i} className="border rounded p-3 grid grid-cols-3 gap-2">
              <Input placeholder="Title" value={aw.title||""} onChange={(e)=>{ const items=[...(form.awardsSection.items||[])]; items[i]={...items[i], title:e.target.value}; setForm({...form, awardsSection:{...form.awardsSection, items}}); }} />
              <Input placeholder="Year" value={aw.year||""} onChange={(e)=>{ const items=[...(form.awardsSection.items||[])]; items[i]={...items[i], year:e.target.value}; setForm({...form, awardsSection:{...form.awardsSection, items}}); }} />
              <Input placeholder="Organization" value={aw.organization||""} onChange={(e)=>{ const items=[...(form.awardsSection.items||[])]; items[i]={...items[i], organization:e.target.value}; setForm({...form, awardsSection:{...form.awardsSection, items}}); }} />
              <div className="col-span-3">
                <Textarea placeholder="Description" value={aw.description||""} onChange={(e)=>{ const items=[...(form.awardsSection.items||[])]; items[i]={...items[i], description:e.target.value}; setForm({...form, awardsSection:{...form.awardsSection, items}}); }} />
              </div>
              <Input placeholder="Color gradient (e.g., from-yellow-400 to-orange-500)" value={aw.color||""} onChange={(e)=>{ const items=[...(form.awardsSection.items||[])]; items[i]={...items[i], color:e.target.value}; setForm({...form, awardsSection:{...form.awardsSection, items}}); }} />
              <div className="col-span-3 flex justify-end">
                <Button variant="outline" className="text-red-600" onClick={()=> setForm((p)=>({...p, awardsSection:{...p.awardsSection, items:(p.awardsSection.items||[]).filter((_,idx)=>idx!==i)}}))}>Remove</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Events (header) */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input value={form.upcomingEventsSection.title||""} onChange={(e)=>setForm({...form, upcomingEventsSection:{...form.upcomingEventsSection, title:e.target.value}})} />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Textarea rows={3} value={form.upcomingEventsSection.contentMD||""} onChange={(e)=>setForm({...form, upcomingEventsSection:{...form.upcomingEventsSection, contentMD:e.target.value}})} />
          </div>
        </CardContent>
      </Card>

      {/* Success Stories (header) */}
      <Card>
        <CardHeader>
          <CardTitle>Success Stories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input value={form.successStoriesSection.title||""} onChange={(e)=>setForm({...form, successStoriesSection:{...form.successStoriesSection, title:e.target.value}})} />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Textarea rows={3} value={form.successStoriesSection.contentMD||""} onChange={(e)=>setForm({...form, successStoriesSection:{...form.successStoriesSection, contentMD:e.target.value}})} />
          </div>
        </CardContent>
      </Card>

      {/* Insights (header) */}
      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input value={form.insightsSection.title||""} onChange={(e)=>setForm({...form, insightsSection:{...form.insightsSection, title:e.target.value}})} />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Textarea rows={3} value={form.insightsSection.contentMD||""} onChange={(e)=>setForm({...form, insightsSection:{...form.insightsSection, contentMD:e.target.value}})} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
