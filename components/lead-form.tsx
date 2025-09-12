"use client";
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { ChevronDown, X } from "lucide-react";

const LeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  countryInterest: z.array(z.string()).min(1, "Select at least one country"),
  serviceInterest: z.string().optional(),
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

const SERVICES = [
  "Student Visa Consultation",
  "University Application",
  "Scholarship Guidance",
  "IELTS/TOEFL Preparation",
  "Career Counseling",
  "Immigration Services",
  "Document Preparation",
  "Other",
];

export default function LeadForm({ purpose = "consultation" }: { purpose?: "consultation" | "enquiry" }) {
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target as Node)) {
        setIsServiceDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function onSubmit(formData: FormData) {
    setState("submitting");
    setError(null);
    const payload: LeadInput = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      countryInterest: Array.from(formData.getAll("countryInterest"), (v) => String(v)),
      serviceInterest: String(formData.get("serviceInterest") || ""),
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
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <div className="text-green-600 text-lg font-semibold mb-2">✓ Thank you!</div>
        <p className="text-green-700 text-sm">We will contact you shortly to discuss your requirements.</p>
      </div>
    );
  }

  return (
    <form action={onSubmit} className="grid gap-6 text-gray-700">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 flex items-center gap-2">
          <span className="text-red-500">⚠</span>
          {error}
        </div>
      )}
      
      {/* Personal Information Section */}
       <div className="space-y-4">
         <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-2">Personal Information</h3>
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
             placeholder="you@flyover.com"
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
       </div>

      {/* Preferences Section */}
       <div className="space-y-4">
         <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-2">Your Preferences</h3>
         
         {/* Country Interest Dropdown */}
         <div className="grid gap-1">
           <label className="text-sm font-medium text-gray-700">Interested Countries</label>
        <div className="relative" ref={countryDropdownRef}>
          <button
            type="button"
            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-gray-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 flex items-center justify-between"
          >
            <span className="text-sm">
              {selectedCountries.length === 0
                ? "Select countries..."
                : `${selectedCountries.length} selected`}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isCountryDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
              <div className="max-h-48 overflow-y-auto p-2">
                {COUNTRIES.map((country) => (
                  <label key={country} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      name="countryInterest"
                      value={country}
                      checked={selectedCountries.includes(country)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCountries([...selectedCountries, country]);
                        } else {
                          setSelectedCountries(selectedCountries.filter(c => c !== country));
                        }
                      }}
                      className="rounded border-gray-300 text-brand focus:ring-brand"
                    />
                    <span className="text-sm text-gray-700">{country}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        {selectedCountries.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedCountries.map((country) => (
              <span key={country} className="inline-flex items-center gap-1 px-2 py-1 bg-brand/10 text-brand text-xs rounded-full">
                {country}
                <button
                  type="button"
                  onClick={() => setSelectedCountries(selectedCountries.filter(c => c !== country))}
                  className="hover:bg-brand/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Service Interest Dropdown */}
       <div className="grid gap-1">
         <label className="text-sm font-medium text-gray-700">Service of Interest</label>
         <div className="relative" ref={serviceDropdownRef}>
          <button
            type="button"
            onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-gray-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 flex items-center justify-between"
          >
            <span className="text-sm">
              {selectedService || "Select a service..."}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isServiceDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isServiceDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
              <div className="max-h-48 overflow-y-auto p-1">
                {SERVICES.map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => {
                      setSelectedService(service);
                      setIsServiceDropdownOpen(false);
                    }}
                    className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm text-gray-700"
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>
          )}
          <input type="hidden" name="serviceInterest" value={selectedService} />
         </div>
       </div>
     </div>

     {/* Message Section */}
     <div className="space-y-4">
       <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-2">Additional Information</h3>
       <div className="grid gap-1">
         <label className="text-sm font-medium text-gray-700" htmlFor="message">Message</label>
         <textarea
           id="message"
           name="message"
           rows={4}
           className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 resize-none"
           placeholder="Tell us about your goals, timeline, or any specific questions you have..."
         />
       </div>
     </div>

     <button
       type="submit"
       disabled={state === "submitting"}
       className="inline-flex items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:opacity-60 disabled:cursor-not-allowed"
     >
       {state === "submitting" ? (
         <>
           <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
             <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
           Submitting...
         </>
       ) : (
         "Submit Enquiry"
       )}
     </button>
    </form>
  );
}
