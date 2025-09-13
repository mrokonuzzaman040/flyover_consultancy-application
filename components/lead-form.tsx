"use client";
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { ChevronDown, X, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const LeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  phone: z.string().min(1, "Phone number is required").refine((val) => /^\+[1-9]\d{1,14}$/.test(val.replace(/[\s-()]/g, '')), {
    message: "Please enter a valid phone number with country code (e.g., +1234567890)"
  }),
  countryInterest: z.array(z.string()).min(1, "Please select at least one country"),
  serviceInterest: z.array(z.string()).optional(),
  message: z.string().max(500, "Message must be less than 500 characters").optional(),
});

type LeadInput = z.infer<typeof LeadSchema>;

const COUNTRIES = [
  "Malaysia",
  "Malta",
  "Lithuania",
  "Poland",
  "Estonia",
  "Latvia",
  "UK",
  "USA",
  "Canada", 
  "Australia",
  "Germany",
  "Spain",
  "France",
  "Denmark",
  "Netherlands",
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

// Import country data from JSON file
const COUNTRY_CODES = [
  { code: "+1", country: "US", flag: "🇺🇸", name: "United States" },
  { code: "+1", country: "CA", flag: "🇨🇦", name: "Canada" },
  { code: "+44", country: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+61", country: "AU", flag: "🇦🇺", name: "Australia" },
  { code: "+64", country: "NZ", flag: "🇳🇿", name: "New Zealand" },
  { code: "+49", country: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "+33", country: "FR", flag: "🇫🇷", name: "France" },
  { code: "+81", country: "JP", flag: "🇯🇵", name: "Japan" },
  { code: "+82", country: "KR", flag: "🇰🇷", name: "South Korea" },
  { code: "+86", country: "CN", flag: "🇨🇳", name: "China" },
  { code: "+91", country: "IN", flag: "🇮🇳", name: "India" },
  { code: "+880", country: "BD", flag: "🇧🇩", name: "Bangladesh" },
  { code: "+92", country: "PK", flag: "🇵🇰", name: "Pakistan" },
  { code: "+94", country: "LK", flag: "🇱🇰", name: "Sri Lanka" },
  { code: "+977", country: "NP", flag: "🇳🇵", name: "Nepal" },
  { code: "+93", country: "AF", flag: "🇦🇫", name: "Afghanistan" },
  { code: "+355", country: "AL", flag: "🇦🇱", name: "Albania" },
  { code: "+213", country: "DZ", flag: "🇩🇿", name: "Algeria" },
  { code: "+376", country: "AD", flag: "🇦🇩", name: "Andorra" },
  { code: "+244", country: "AO", flag: "🇦🇴", name: "Angola" },
  { code: "+54", country: "AR", flag: "🇦🇷", name: "Argentina" },
  { code: "+374", country: "AM", flag: "🇦🇲", name: "Armenia" },
  { code: "+43", country: "AT", flag: "🇦🇹", name: "Austria" },
  { code: "+994", country: "AZ", flag: "🇦🇿", name: "Azerbaijan" },
  { code: "+973", country: "BH", flag: "🇧🇭", name: "Bahrain" },
  { code: "+375", country: "BY", flag: "🇧🇾", name: "Belarus" },
  { code: "+32", country: "BE", flag: "🇧🇪", name: "Belgium" },
  { code: "+501", country: "BZ", flag: "🇧🇿", name: "Belize" },
  { code: "+229", country: "BJ", flag: "🇧🇯", name: "Benin" },
  { code: "+975", country: "BT", flag: "🇧🇹", name: "Bhutan" },
  { code: "+591", country: "BO", flag: "🇧🇴", name: "Bolivia" },
  { code: "+387", country: "BA", flag: "🇧🇦", name: "Bosnia & Herzegovina" },
  { code: "+267", country: "BW", flag: "🇧🇼", name: "Botswana" },
  { code: "+55", country: "BR", flag: "🇧🇷", name: "Brazil" },
  { code: "+673", country: "BN", flag: "🇧🇳", name: "Brunei" },
  { code: "+359", country: "BG", flag: "🇧🇬", name: "Bulgaria" },
  { code: "+226", country: "BF", flag: "🇧🇫", name: "Burkina Faso" },
  { code: "+257", country: "BI", flag: "🇧🇮", name: "Burundi" },
  { code: "+855", country: "KH", flag: "🇰🇭", name: "Cambodia" },
  { code: "+237", country: "CM", flag: "🇨🇲", name: "Cameroon" },
  { code: "+238", country: "CV", flag: "🇨🇻", name: "Cape Verde" },
  { code: "+236", country: "CF", flag: "🇨🇫", name: "Central African Republic" },
  { code: "+235", country: "TD", flag: "🇹🇩", name: "Chad" },
  { code: "+56", country: "CL", flag: "🇨🇱", name: "Chile" },
  { code: "+57", country: "CO", flag: "🇨🇴", name: "Colombia" },
  { code: "+269", country: "KM", flag: "🇰🇲", name: "Comoros" },
  { code: "+242", country: "CG", flag: "🇨🇬", name: "Congo - Brazzaville" },
  { code: "+243", country: "CD", flag: "🇨🇩", name: "Congo - Kinshasa" },
  { code: "+506", country: "CR", flag: "🇨🇷", name: "Costa Rica" },
  { code: "+385", country: "HR", flag: "🇭🇷", name: "Croatia" },
  { code: "+53", country: "CU", flag: "🇨🇺", name: "Cuba" },
  { code: "+357", country: "CY", flag: "🇨🇾", name: "Cyprus" },
  { code: "+420", country: "CZ", flag: "🇨🇿", name: "Czechia" },
  { code: "+45", country: "DK", flag: "🇩🇰", name: "Denmark" },
  { code: "+253", country: "DJ", flag: "🇩🇯", name: "Djibouti" },
  { code: "+1767", country: "DM", flag: "🇩🇲", name: "Dominica" },
  { code: "+1849", country: "DO", flag: "🇩🇴", name: "Dominican Republic" },
  { code: "+593", country: "EC", flag: "🇪🇨", name: "Ecuador" },
  { code: "+20", country: "EG", flag: "🇪🇬", name: "Egypt" },
  { code: "+503", country: "SV", flag: "🇸🇻", name: "El Salvador" },
  { code: "+240", country: "GQ", flag: "🇬🇶", name: "Equatorial Guinea" },
  { code: "+291", country: "ER", flag: "🇪🇷", name: "Eritrea" },
  { code: "+372", country: "EE", flag: "🇪🇪", name: "Estonia" },
  { code: "+251", country: "ET", flag: "🇪🇹", name: "Ethiopia" },
  { code: "+679", country: "FJ", flag: "🇫🇯", name: "Fiji" },
  { code: "+358", country: "FI", flag: "🇫🇮", name: "Finland" },
  { code: "+241", country: "GA", flag: "🇬🇦", name: "Gabon" },
  { code: "+220", country: "GM", flag: "🇬🇲", name: "Gambia" },
  { code: "+995", country: "GE", flag: "🇬🇪", name: "Georgia" },
  { code: "+233", country: "GH", flag: "🇬🇭", name: "Ghana" },
  { code: "+30", country: "GR", flag: "🇬🇷", name: "Greece" },
  { code: "+1473", country: "GD", flag: "🇬🇩", name: "Grenada" },
  { code: "+502", country: "GT", flag: "🇬🇹", name: "Guatemala" },
  { code: "+224", country: "GN", flag: "🇬🇳", name: "Guinea" },
  { code: "+245", country: "GW", flag: "🇬🇼", name: "Guinea-Bissau" },
  { code: "+595", country: "GY", flag: "🇬🇾", name: "Guyana" },
  { code: "+509", country: "HT", flag: "🇭🇹", name: "Haiti" },
  { code: "+504", country: "HN", flag: "🇭🇳", name: "Honduras" },
  { code: "+852", country: "HK", flag: "🇭🇰", name: "Hong Kong SAR China" },
  { code: "+36", country: "HU", flag: "🇭🇺", name: "Hungary" },
  { code: "+354", country: "IS", flag: "🇮🇸", name: "Iceland" },
  { code: "+62", country: "ID", flag: "🇮🇩", name: "Indonesia" },
  { code: "+98", country: "IR", flag: "🇮🇷", name: "Iran" },
  { code: "+964", country: "IQ", flag: "🇮🇶", name: "Iraq" },
  { code: "+353", country: "IE", flag: "🇮🇪", name: "Ireland" },
  { code: "+972", country: "IL", flag: "🇮🇱", name: "Israel" },
  { code: "+39", country: "IT", flag: "🇮🇹", name: "Italy" },
  { code: "+225", country: "CI", flag: "🇨🇮", name: "Côte d'Ivoire" },
  { code: "+1876", country: "JM", flag: "🇯🇲", name: "Jamaica" },
  { code: "+962", country: "JO", flag: "🇯🇴", name: "Jordan" },
  { code: "+77", country: "KZ", flag: "🇰🇿", name: "Kazakhstan" },
  { code: "+254", country: "KE", flag: "🇰🇪", name: "Kenya" },
  { code: "+686", country: "KI", flag: "🇰🇮", name: "Kiribati" },
  { code: "+850", country: "KP", flag: "🇰🇵", name: "North Korea" },
  { code: "+965", country: "KW", flag: "🇰🇼", name: "Kuwait" },
  { code: "+996", country: "KG", flag: "🇰🇬", name: "Kyrgyzstan" },
  { code: "+856", country: "LA", flag: "🇱🇦", name: "Laos" },
  { code: "+371", country: "LV", flag: "🇱🇻", name: "Latvia" },
  { code: "+961", country: "LB", flag: "🇱🇧", name: "Lebanon" },
  { code: "+266", country: "LS", flag: "🇱🇸", name: "Lesotho" },
  { code: "+231", country: "LR", flag: "🇱🇷", name: "Liberia" },
  { code: "+218", country: "LY", flag: "🇱🇾", name: "Libya" },
  { code: "+423", country: "LI", flag: "🇱🇮", name: "Liechtenstein" },
  { code: "+370", country: "LT", flag: "🇱🇹", name: "Lithuania" },
  { code: "+352", country: "LU", flag: "🇱🇺", name: "Luxembourg" },
  { code: "+853", country: "MO", flag: "🇲🇴", name: "Macao SAR China" },
  { code: "+389", country: "MK", flag: "🇲🇰", name: "North Macedonia" },
  { code: "+261", country: "MG", flag: "🇲🇬", name: "Madagascar" },
  { code: "+265", country: "MW", flag: "🇲🇼", name: "Malawi" },
  { code: "+60", country: "MY", flag: "🇲🇾", name: "Malaysia" },
  { code: "+960", country: "MV", flag: "🇲🇻", name: "Maldives" },
  { code: "+223", country: "ML", flag: "🇲🇱", name: "Mali" },
  { code: "+356", country: "MT", flag: "🇲🇹", name: "Malta" },
  { code: "+692", country: "MH", flag: "🇲🇭", name: "Marshall Islands" },
  { code: "+222", country: "MR", flag: "🇲🇷", name: "Mauritania" },
  { code: "+230", country: "MU", flag: "🇲🇺", name: "Mauritius" },
  { code: "+52", country: "MX", flag: "🇲🇽", name: "Mexico" },
  { code: "+691", country: "FM", flag: "🇫🇲", name: "Micronesia" },
  { code: "+373", country: "MD", flag: "🇲🇩", name: "Moldova" },
  { code: "+377", country: "MC", flag: "🇲🇨", name: "Monaco" },
  { code: "+976", country: "MN", flag: "🇲🇳", name: "Mongolia" },
  { code: "+382", country: "ME", flag: "🇲🇪", name: "Montenegro" },
  { code: "+212", country: "MA", flag: "🇲🇦", name: "Morocco" },
  { code: "+258", country: "MZ", flag: "🇲🇿", name: "Mozambique" },
  { code: "+95", country: "MM", flag: "🇲🇲", name: "Myanmar (Burma)" },
  { code: "+264", country: "NA", flag: "🇳🇦", name: "Namibia" },
  { code: "+674", country: "NR", flag: "🇳🇷", name: "Nauru" },
  { code: "+31", country: "NL", flag: "🇳🇱", name: "Netherlands" },
  { code: "+505", country: "NI", flag: "🇳🇮", name: "Nicaragua" },
  { code: "+227", country: "NE", flag: "🇳🇪", name: "Niger" },
  { code: "+234", country: "NG", flag: "🇳🇬", name: "Nigeria" },
  { code: "+47", country: "NO", flag: "🇳🇴", name: "Norway" },
  { code: "+968", country: "OM", flag: "🇴🇲", name: "Oman" },
  { code: "+680", country: "PW", flag: "🇵🇼", name: "Palau" },
  { code: "+507", country: "PA", flag: "🇵🇦", name: "Panama" },
  { code: "+675", country: "PG", flag: "🇵🇬", name: "Papua New Guinea" },
  { code: "+595", country: "PY", flag: "🇵🇾", name: "Paraguay" },
  { code: "+51", country: "PE", flag: "🇵🇪", name: "Peru" },
  { code: "+63", country: "PH", flag: "🇵🇭", name: "Philippines" },
  { code: "+48", country: "PL", flag: "🇵🇱", name: "Poland" },
  { code: "+351", country: "PT", flag: "🇵🇹", name: "Portugal" },
  { code: "+974", country: "QA", flag: "🇶🇦", name: "Qatar" },
  { code: "+40", country: "RO", flag: "🇷🇴", name: "Romania" },
  { code: "+7", country: "RU", flag: "🇷🇺", name: "Russia" },
  { code: "+250", country: "RW", flag: "🇷🇼", name: "Rwanda" },
  { code: "+1869", country: "KN", flag: "🇰🇳", name: "St. Kitts & Nevis" },
  { code: "+1758", country: "LC", flag: "🇱🇨", name: "St. Lucia" },
  { code: "+1784", country: "VC", flag: "🇻🇨", name: "St. Vincent & Grenadines" },
  { code: "+685", country: "WS", flag: "🇼🇸", name: "Samoa" },
  { code: "+378", country: "SM", flag: "🇸🇲", name: "San Marino" },
  { code: "+239", country: "ST", flag: "🇸🇹", name: "São Tomé & Príncipe" },
  { code: "+966", country: "SA", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+221", country: "SN", flag: "🇸🇳", name: "Senegal" },
  { code: "+381", country: "RS", flag: "🇷🇸", name: "Serbia" },
  { code: "+248", country: "SC", flag: "🇸🇨", name: "Seychelles" },
  { code: "+232", country: "SL", flag: "🇸🇱", name: "Sierra Leone" },
  { code: "+65", country: "SG", flag: "🇸🇬", name: "Singapore" },
  { code: "+421", country: "SK", flag: "🇸🇰", name: "Slovakia" },
  { code: "+386", country: "SI", flag: "🇸🇮", name: "Slovenia" },
  { code: "+677", country: "SB", flag: "🇸🇧", name: "Solomon Islands" },
  { code: "+252", country: "SO", flag: "🇸🇴", name: "Somalia" },
  { code: "+27", country: "ZA", flag: "🇿🇦", name: "South Africa" },
  { code: "+211", country: "SS", flag: "🇸🇸", name: "South Sudan" },
  { code: "+34", country: "ES", flag: "🇪🇸", name: "Spain" },
  { code: "+249", country: "SD", flag: "🇸🇩", name: "Sudan" },
  { code: "+597", country: "SR", flag: "🇸🇷", name: "Suriname" },
  { code: "+268", country: "SZ", flag: "🇸🇿", name: "Eswatini" },
  { code: "+46", country: "SE", flag: "🇸🇪", name: "Sweden" },
  { code: "+41", country: "CH", flag: "🇨🇭", name: "Switzerland" },
  { code: "+963", country: "SY", flag: "🇸🇾", name: "Syria" },
  { code: "+886", country: "TW", flag: "🇹🇼", name: "Taiwan" },
  { code: "+992", country: "TJ", flag: "🇹🇯", name: "Tajikistan" },
  { code: "+255", country: "TZ", flag: "🇹🇿", name: "Tanzania" },
  { code: "+66", country: "TH", flag: "🇹🇭", name: "Thailand" },
  { code: "+670", country: "TL", flag: "🇹🇱", name: "Timor-Leste" },
  { code: "+228", country: "TG", flag: "🇹🇬", name: "Togo" },
  { code: "+676", country: "TO", flag: "🇹🇴", name: "Tonga" },
  { code: "+1868", country: "TT", flag: "🇹🇹", name: "Trinidad & Tobago" },
  { code: "+216", country: "TN", flag: "🇹🇳", name: "Tunisia" },
  { code: "+90", country: "TR", flag: "🇹🇷", name: "Turkey" },
  { code: "+993", country: "TM", flag: "🇹🇲", name: "Turkmenistan" },
  { code: "+688", country: "TV", flag: "🇹🇻", name: "Tuvalu" },
  { code: "+256", country: "UG", flag: "🇺🇬", name: "Uganda" },
  { code: "+380", country: "UA", flag: "🇺🇦", name: "Ukraine" },
  { code: "+971", country: "AE", flag: "🇦🇪", name: "United Arab Emirates" },
  { code: "+598", country: "UY", flag: "🇺🇾", name: "Uruguay" },
  { code: "+998", country: "UZ", flag: "🇺🇿", name: "Uzbekistan" },
  { code: "+678", country: "VU", flag: "🇻🇺", name: "Vanuatu" },
  { code: "+379", country: "VA", flag: "🇻🇦", name: "Vatican City" },
  { code: "+58", country: "VE", flag: "🇻🇪", name: "Venezuela" },
  { code: "+84", country: "VN", flag: "🇻🇳", name: "Vietnam" },
  { code: "+967", country: "YE", flag: "🇾🇪", name: "Yemen" },
  { code: "+260", country: "ZM", flag: "🇿🇲", name: "Zambia" },
  { code: "+263", country: "ZW", flag: "🇿🇼", name: "Zimbabwe" },
];

export default function LeadForm({ purpose = "consultation" }: { purpose?: "consultation" | "enquiry" }) {
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [serviceSearchTerm, setServiceSearchTerm] = useState<string>("");
  const [countryInterestSearchTerm, setCountryInterestSearchTerm] = useState<string>("");

  // Filter services based on search term
  const filteredServices = serviceSearchTerm
    ? SERVICES.filter(service => 
        service.toLowerCase().includes(serviceSearchTerm.toLowerCase())
      )
    : SERVICES;

  // Filter countries based on search term
  const filteredCountries = countryInterestSearchTerm
    ? COUNTRIES.filter(country => 
        country.toLowerCase().includes(countryInterestSearchTerm.toLowerCase())
      )
    : COUNTRIES;
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [isCountryCodeDropdownOpen, setIsCountryCodeDropdownOpen] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(COUNTRY_CODES[0]);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitAttempts, setSubmitAttempts] = useState(0);
  
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);
  const countryCodeDropdownRef = useRef<HTMLDivElement>(null);
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
      if (countryCodeDropdownRef.current && !countryCodeDropdownRef.current.contains(event.target as Node)) {
        setIsCountryCodeDropdownOpen(false);
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

    const emailValue = String(formData.get("email") || "").trim().toLowerCase();
    const fullPhoneNumber = phoneNumber ? `${selectedCountryCode.code}${phoneNumber.replace(/^\+/, '')}` : "";
    const payload: LeadInput = {
      name: String(formData.get("name") || "").trim(),
      email: emailValue || undefined,
      phone: fullPhoneNumber,
      countryInterest: selectedCountries,
      serviceInterest: selectedService ? [selectedService] : [],
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
        <div className="rounded-xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
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
             Full name <span className="text-brand-500">*</span>
           </label>
           <input
             id="name"
             name="name"
             required
             maxLength={50}
             onChange={(e) => validateField('name', e.target.value)}
             className={`rounded-xl border ${fieldErrors.name ? 'border-brand-300 bg-brand-50' : 'border-gray-300 bg-white'} px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors`}
             placeholder="Enter your full name"
           />
           {fieldErrors.name && (
             <p className="text-xs text-brand-600 flex items-center gap-1">
               <AlertCircle className="w-3 h-3 text-brand-500" />
               {fieldErrors.name}
             </p>
           )}
         </div>
         <div className="grid gap-1">
           <label className="text-sm font-medium text-gray-700" htmlFor="email">
             Email Address <span className="text-gray-400 text-xs">(optional)</span>
           </label>
           <input
             id="email"
             name="email"
             type="email"
             onChange={(e) => validateField('email', e.target.value)}
             className={`rounded-xl border ${fieldErrors.email ? 'border-brand-300 bg-brand-50' : 'border-gray-300 bg-white'} px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors`}
             placeholder="your.email@example.com (optional)"
             suppressHydrationWarning={true}
           />
           {fieldErrors.email && (
             <p className="text-xs text-brand-600 flex items-center gap-1">
               <AlertCircle className="w-3 h-3 text-brand-500" />
               {fieldErrors.email}
             </p>
           )}
         </div>
         <div className="grid gap-1">
           <label className="text-sm font-medium text-gray-700" htmlFor="phone">
             Phone Number <span className="text-brand-500">*</span>
           </label>
           <div className="flex gap-2">
             {/* Country Code Selector */}
             <div className="relative" ref={countryCodeDropdownRef}>
               <button
                 type="button"
                 onClick={() => setIsCountryCodeDropdownOpen(!isCountryCodeDropdownOpen)}
                 className={`flex items-center gap-2 px-3 py-3 rounded-xl border ${fieldErrors.phone ? 'border-brand-300 bg-brand-50' : 'border-gray-300 bg-white'} text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors min-w-[100px]`}
               >
                 <span className="text-lg">{selectedCountryCode.flag}</span>
                 <span className="text-sm font-medium">{selectedCountryCode.code}</span>
                 <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCountryCodeDropdownOpen ? 'rotate-180' : ''}`} />
               </button>
               {isCountryCodeDropdownOpen && (
                 <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
                   <div className="sticky top-0 bg-white border-b border-gray-200 p-2">
                     <input
                   type="text"
                   placeholder="Search countries..."
                   value={countryInterestSearchTerm}
                   onChange={(e) => setCountryInterestSearchTerm(e.target.value)}
                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                   onClick={(e) => e.stopPropagation()}
                 />
                   </div>
                   {COUNTRY_CODES.filter(country => 
                     country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
                     country.code.toLowerCase().includes(countrySearchTerm.toLowerCase())
                   ).map((country, index) => (
                     <button
                       key={`${country.code}-${country.country}`}
                       type="button"
                       onClick={() => {
                         setSelectedCountryCode(country);
                         setIsCountryCodeDropdownOpen(false);
                         setCountrySearchTerm("");
                       }}
                       className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                     >
                       <span className="text-lg">{country.flag}</span>
                       <div className="flex-1">
                         <div className="text-sm font-medium text-gray-900">{country.name}</div>
                         <div className="text-xs text-gray-500">{country.code}</div>
                       </div>
                     </button>
                   ))}
                 </div>
               )}
             </div>
             {/* Phone Number Input */}
             <input
               id="phone"
               name="phone"
               type="tel"
               required
               value={phoneNumber}
               onChange={(e) => {
                 setPhoneNumber(e.target.value);
                 const fullPhone = e.target.value ? `${selectedCountryCode.code}${e.target.value.replace(/^\+/, '')}` : "";
                 validateField('phone', fullPhone);
               }}
               className={`flex-1 rounded-xl border ${fieldErrors.phone ? 'border-brand-300 bg-brand-50' : 'border-gray-300 bg-white'} px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors`}
               placeholder="Enter phone number"
             />
           </div>
           {fieldErrors.phone && (
             <p className="text-xs text-brand-600 flex items-center gap-1">
               <AlertCircle className="w-3 h-3 text-brand-500" />
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
             Interested Countries <span className="text-brand-500">*</span>
           </label>
        <div className="relative" ref={countryDropdownRef}>
          <button
            type="button"
            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
            className={`w-full rounded-xl border ${fieldErrors.countryInterest ? 'border-brand-300 bg-brand-50' : 'border-gray-300 bg-white'} px-4 py-3 text-left text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 flex items-center justify-between transition-colors`}
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
              <div className="sticky top-0 bg-white border-b border-gray-200 p-2">
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={countrySearchTerm}
                  onChange={(e) => setCountrySearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="max-h-48 overflow-y-auto p-2">
                {filteredCountries.map((country) => (
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
                        setCountryInterestSearchTerm('');
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
                    setCountryInterestSearchTerm('');
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
          <p className="text-xs text-brand-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-brand-500" />
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
              <div className="sticky top-0 bg-white border-b border-gray-200 p-2">
                <input
                  type="text"
                  placeholder="Search services..."
                  value={serviceSearchTerm}
                  onChange={(e) => setServiceSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="max-h-48 overflow-y-auto p-1">
                {filteredServices.map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => {
                      setSelectedService(service);
                      setIsServiceDropdownOpen(false);
                      setServiceSearchTerm("");
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
           className={`rounded-xl border ${fieldErrors.message ? 'border-brand-300 bg-brand-50' : 'border-gray-300 bg-white'} px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none transition-colors`}
           placeholder="Tell us about your study abroad goals, preferred timeline, or any specific questions you have..."
         />
         {fieldErrors.message && (
           <p className="text-xs text-brand-600 flex items-center gap-1">
             <AlertCircle className="w-3 h-3 text-brand-500" />
             {fieldErrors.message}
           </p>
         )}
       </div>
     </div>

     <button
       type="submit"
       disabled={state === "submitting" || isRateLimited}
       className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:from-brand-700 hover:to-brand-800 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
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
