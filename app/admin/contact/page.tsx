"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Contact = {
  address?: string;
  city?: string;
  country?: string;
  phones?: string[];
  emails?: string[];
  mapEmbedUrl?: string;
};

export default function ContactAdminPage() {
  const [contact, setContact] = useState<Contact>({ phones: [], emails: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchContact(); }, []);

  const fetchContact = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/contact");
      if (!res.ok) throw new Error("Failed to load contact");
      const data = await res.json();
      setContact({
        address: data?.contact?.address || "",
        city: data?.contact?.city || "",
        country: data?.contact?.country || "",
        phones: data?.contact?.phones || [],
        emails: data?.contact?.emails || [],
        mapEmbedUrl: data?.contact?.mapEmbedUrl || "",
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load contact info";
      toast.error(msg);
    } finally { setLoading(false); }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: {
          ...contact,
          phones: (contact.phones || []).filter(Boolean),
          emails: (contact.emails || []).filter(Boolean),
        } }),
      });
      if (!res.ok) throw new Error("Failed to save contact");
      toast.success("Contact info saved");
      fetchContact();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to save contact";
      toast.error(msg);
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Contact Page</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchContact} disabled={loading || saving}>Refresh</Button>
          <Button onClick={handleSave} disabled={loading || saving}>{saving ? "Saving..." : "Save"}</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Address</Label>
            <Textarea value={contact.address || ""} onChange={(e) => setContact({ ...contact, address: e.target.value })} rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>City</Label>
              <Input value={contact.city || ""} onChange={(e) => setContact({ ...contact, city: e.target.value })} />
            </div>
            <div>
              <Label>Country</Label>
              <Input value={contact.country || ""} onChange={(e) => setContact({ ...contact, country: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Phones (comma separated)</Label>
            <Input value={(contact.phones || []).join(", ")} onChange={(e) => setContact({ ...contact, phones: e.target.value.split(",").map(s => s.trim()) })} />
          </div>
          <div>
            <Label>Emails (comma separated)</Label>
            <Input value={(contact.emails || []).join(", ")} onChange={(e) => setContact({ ...contact, emails: e.target.value.split(",").map(s => s.trim()) })} />
          </div>
          <div>
            <Label>Map Embed URL</Label>
            <Input value={contact.mapEmbedUrl || ""} onChange={(e) => setContact({ ...contact, mapEmbedUrl: e.target.value })} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
