"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Slide = { title?: string; subtitle?: string; imageUrl?: string };
type HomeSettings = {
  heroSlider?: Slide[];
  [key: string]: unknown;
};

export default function HomeSettingsPage() {
  const [settings, setSettings] = useState<HomeSettings | null>(null);
  const [jsonText, setJsonText] = useState("{}");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/home-settings");
      if (!res.ok) throw new Error("Failed to load home settings");
      const data = await res.json();
      setSettings(data.settings || {});
      setJsonText(JSON.stringify(data.settings || {}, null, 2));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load settings";
      toast.error(msg);
    } finally { setLoading(false); }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      let parsed: unknown = {};
      try { parsed = JSON.parse(jsonText); } catch { toast.error("Invalid JSON"); setSaving(false); return; }
      const res = await fetch("/api/admin/home-settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ settings: parsed }) });
      if (!res.ok) throw new Error("Failed to save settings");
      toast.success("Home settings saved");
      fetchSettings();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to save";
      toast.error(msg);
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Home Settings</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchSettings} disabled={loading || saving}>Refresh</Button>
          <Button onClick={handleSave} disabled={loading || saving}>{saving ? "Saving..." : "Save"}</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Editor (Advanced)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">Edit structured JSON for sections like heroSlider, transformSection, topInstitutionsSection, fiveStepsSection, whyChooseSection, awardsSection, partnersSection.</p>
          <Textarea value={jsonText} onChange={(e) => setJsonText(e.target.value)} rows={22} className="font-mono" />
        </CardContent>
      </Card>

      {settings?.heroSlider?.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Preview: Hero Slides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {settings.heroSlider.map((s: Slide, i: number) => (
                <div key={i} className="border rounded p-3">
                  <div className="text-sm font-semibold">{s.title}</div>
                  <div className="text-xs text-gray-600">{s.subtitle}</div>
                  {s.imageUrl && <Input readOnly value={s.imageUrl} className="mt-2" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
