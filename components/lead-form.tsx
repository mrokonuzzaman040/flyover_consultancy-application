"use client";
import { useState } from "react";
import { z } from "zod";

const LeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  countryInterest: z.array(z.string()).min(1, "Select at least one country"),
  serviceInterest: z.array(z.string()).optional(),
  message: z.string().optional(),
});

type LeadInput = z.infer<typeof LeadSchema>;

const COUNTRIES = [
  "Australia",
  "Canada",
  "USA",
  "UK",
  "Europe",
  "New Zealand",
  "Japan",
];

export default function LeadForm({ purpose = "consultation" }: { purpose?: "consultation" | "enquiry" }) {
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setState("submitting");
    setError(null);
    const payload: LeadInput = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      countryInterest: Array.from(formData.getAll("countryInterest"), (v) => String(v)),
      serviceInterest: Array.from(formData.getAll("serviceInterest"), (v) => String(v)),
      message: String(formData.get("message") || ""),
    };

    const parsed = LeadSchema.safeParse(payload);
    if (!parsed.success) {
      setState("error");
      setError(parsed.error.issues[0]?.message || "Invalid data");
      return;
    }

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, purpose }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setState("success");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Network error";
      setError(message);
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        Thank you! We will contact you shortly.
      </div>
    );
  }

  return (
    <form action={onSubmit} className="grid gap-3 text-gray-700">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>
      )}
      <div className="grid gap-1">
        <label className="text-sm font-medium text-gray-700" htmlFor="name">Full name</label>
        <input
          id="name"
          name="name"
          required
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          placeholder="Your name"
        />
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium text-gray-700" htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          placeholder="you@example.com"
          suppressHydrationWarning={true}
        />
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium text-gray-700" htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          placeholder="+880..."
        />
      </div>

      <fieldset className="grid gap-1">
        <legend className="text-sm font-semibold text-gray-800">Interested country</legend>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 text-gray-700">
          {COUNTRIES.map((c) => (
            <label key={c} className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" name="countryInterest" value={c} /> {c}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-1">
        <label className="text-sm font-medium text-gray-700" htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={3}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          placeholder="Tell us about your goals"
        />
      </div>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {state === "submitting" ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
