"use client";
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { ChevronDown, X, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const LeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional().refine((val) => !val || /^\+?[1-9]\d{1,14}$/.test(val.replace(/[\s-()]/g, '')), {
    message: "Please enter a valid phone number"
  }),
  countryInterest: z.array(z.string()).min(1, "Please select at least one country"),
  serviceInterest: z.string().optional(),
  message: z.string().max(500, "Message must be less than 500 characters").optional(),
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [submitAttempts, setSubmitAttempts] = useState(0);
  
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

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

  // Rate limiting check
  const isRateLimited = submitAttempts >= 3;

  // Real-time validation
  const validateField = (name: string, value: string | string[]) => {
    try {
      const fieldSchema = LeadSchema.shape[name as keyof typeof LeadSchema.shape];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setFieldErrors(prev => ({ ...prev, [name]: "" }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFieldErrors(prev => ({ ...prev, [name]: error.issues[0]?.message || "Invalid input" }));
      }
    }
  };

  async function onSubmit(formData: FormData) {
    // Security checks
    if (honeypot) {
      console.warn("Bot detected");
      return;
    }

    if (isRateLimited) {
      setError("Too many attempts. Please wait before trying again.");
      return;
    }

    setState("submitting");
    setError(null);
    setFieldErrors({});
    setSubmitAttempts(prev => prev + 1);

    const payload: LeadInput = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim().toLowerCase(),
      phone: String(formData.get("phone") || "").trim(),
      countryInterest: selectedCountries,
      serviceInterest: selectedService,
      message: String(formData.get("message") || "").trim(),
    };

    const parsed = LeadSchema.safeParse(payload);
    if (!parsed.success) {
      setState("error");
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach(issue => {
        const path = issue.path[0] as string;
        errors[path] = issue.message;
      });
      setFieldErrors(errors);
      setError("Please correct the errors below");
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify({ ...parsed.data, purpose, timestamp: Date.now() }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error (${res.status})`);
      }
      
      setState("success");
      // Reset form after successful submission
      if (formRef.current) {
        formRef.current.reset();
      }
      setSelectedCountries([]);
      setSelectedService("");
    } catch (e: unknown) {
      setState("error");
      if (e instanceof Error) {
        if (e.name === 'AbortError') {
          setError("Request timed out. Please try again.");
        } else {
          setError(e.message);
        }
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-green-800 text-xl font-bold mb-2">Thank You!</h3>
        <p className="text-green-700 mb-4">Your message has been sent successfully.</p>
        <p className="text-green-600 text-sm">Our expert consultants will contact you within 24 hours to discuss your study abroad requirements.</p>
        <button
          onClick={() => {
            setState("idle");
            setSubmitAttempts(0);
          }}
          className="mt-6 text-sm text-green-600 hover:text-green-700 font-medium underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} action={onSubmit} className="grid gap-6 text-gray-700">
      {/* Honeypot field for bot detection */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />
      
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {isRateLimited && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Rate Limited</p>
            <p>Please wait before submitting again.</p>
          </div>
        </div>
      )}
      
      {/* Personal Information Section */}
       <div className="space-y-4">
         <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-2">Personal Information</h3>
         <div className="grid gap-1">
           <label className="text-sm font-medium text-gray-700" htmlFor="name">
             Full name <span className="text-red-500">*</span>
           </label>
           <input
             id="name"
             name="name"
             required
             maxLength={50}
             onChange={(e) => validateField('name', e.target.value)}
             className={`rounded-xl border ${fieldErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'} px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors`}
             placeholder="Enter your full name"
           />
           {fieldErrors.name && (
             <p className="text-xs text-red-600 flex items-center gap-1">
               <AlertCircle className="w-3 h-3 text-red-500" />
               {fieldErrors.name}
             </p>
           )}
         </div>
         <div className="grid gap-1">
           <label className="text-sm font-medium text-gray-700" htmlFor="email">
             Email Address <span className="text-red-500">*</span>
           </label>
           <input
             id="email"
             name="email"
             type="email"
             required
             onChange={(e) => validateField('email', e.target.value)}
             className={`rounded-xl border ${fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'} px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors`}
             placeholder="your.email@example.com"
             suppressHydrationWarning={true}
           />
           {fieldErrors.email && (
             <p className="text-xs text-red-600 flex items-center gap-1">
               <AlertCircle className="w-3 h-3 text-red-500" />
               {fieldErrors.email}
             </p>
           )}
         </div>
         <div className="grid gap-1">
           <label className="text-sm font-medium text-gray-700" htmlFor="phone">
             Phone Number
           </label>
           <input
             id="phone"
             name="phone"
             type="tel"
             onChange={(e) => validateField('phone', e.target.value)}
             className={`rounded-xl border ${fieldErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'} px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors`}
             placeholder="+880 1700 000000"
           />
           {fieldErrors.phone && (
             <p className="text-xs text-red-600 flex items-center gap-1">
               <AlertCircle className="w-3 h-3 text-red-500" />
               {fieldErrors.phone}
             </p>
           )}
         </div>
       </div>

      {/* Preferences Section */}
       <div className="space-y-4">
         <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-2">Your Preferences</h3>
         
         {/* Country Interest Dropdown */}
         <div className="grid gap-1">
           <label className="text-sm font-medium text-gray-700">
             Interested Countries <span className="text-red-500">*</span>
           </label>
        <div className="relative" ref={countryDropdownRef}>
          <button
            type="button"
            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
            className={`w-full rounded-xl border ${fieldErrors.countryInterest ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'} px-4 py-3 text-left text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 flex items-center justify-between transition-colors`}
          >
            <span className="text-sm">
              {selectedCountries.length === 0
                ? "Select countries..."
                : `${selectedCountries.length} selected`}
            </span>
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isCountryDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-xl">
              <div className="max-h-48 overflow-y-auto p-2">
                {COUNTRIES.map((country) => (
                  <label key={country} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      name="countryInterest"
                      value={country}
                      checked={selectedCountries.includes(country)}
                      onChange={(e) => {
                        const newCountries = e.target.checked 
                          ? [...selectedCountries, country]
                          : selectedCountries.filter(c => c !== country);
                        setSelectedCountries(newCountries);
                        validateField('countryInterest', newCountries);
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
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedCountries.map((country) => (
              <span key={country} className="inline-flex items-center gap-1 px-3 py-1 bg-brand-100 text-brand-700 text-sm rounded-full">
                {country}
                <button
                  type="button"
                  onClick={() => {
                    const newCountries = selectedCountries.filter(c => c !== country);
                    setSelectedCountries(newCountries);
                    validateField('countryInterest', newCountries);
                  }}
                  className="hover:bg-brand-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3 text-brand-600" />
                </button>
              </span>
            ))}
          </div>
        )}
        {fieldErrors.countryInterest && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-red-500" />
            {fieldErrors.countryInterest}
          </p>
        )}
      </div>

      {/* Service Interest Dropdown */}
       <div className="grid gap-1">
         <label className="text-sm font-medium text-gray-700">Service of Interest</label>
         <div className="relative" ref={serviceDropdownRef}>
          <button
            type="button"
            onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 flex items-center justify-between transition-colors"
          >
            <span className="text-sm">
              {selectedService || "Select a service..."}
            </span>
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isServiceDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isServiceDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-xl">
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
           maxLength={500}
           onChange={(e) => validateField('message', e.target.value)}
           className={`rounded-xl border ${fieldErrors.message ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'} px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none transition-colors`}
           placeholder="Tell us about your study abroad goals, preferred timeline, or any specific questions you have..."
         />
         {fieldErrors.message && (
           <p className="text-xs text-red-600 flex items-center gap-1">
             <AlertCircle className="w-3 h-3 text-red-500" />
             {fieldErrors.message}
           </p>
         )}
       </div>
     </div>

     <button
       type="submit"
       disabled={state === "submitting" || isRateLimited}
       className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:from-red-700 hover:to-red-800 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500/40 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
     >
       {state === "submitting" ? (
         <>
           <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
           Sending Message...
         </>
       ) : (
         <>
           Send Message
           <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
           </svg>
         </>
       )}
     </button>
     
     <p className="text-xs text-gray-500 text-center">
       By submitting this form, you agree to our privacy policy and terms of service.
     </p>
    </form>
  );
}
