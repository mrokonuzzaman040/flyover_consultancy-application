import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Reveal from "@/components/ui/reveal";
import PageHeader from "@/components/page-header";
import { MapPin, Users, GraduationCap, Globe, ArrowRight, Calendar, DollarSign, FileText, Award, Heart} from "lucide-react";
import { UniversityImage } from "@/components/ui/lazy-image";

const COUNTRIES = {
  australia: {
    name: "Australia",
    flag: "🇦🇺",
    description: "World-class universities with post-study work opportunities and vibrant student life in a multicultural environment.",
    color: "from-green-400 to-blue-500",
    hero: "/hero/slide2.svg",
    overview: {
      capital: "Canberra",
      language: "English",
      currency: "Australian Dollar (AUD)",
      timezone: "UTC+8 to UTC+11",
      population: "25.7 million",
      climate: "Varied - tropical to temperate"
    },
    education: {
      universities: 43,
      worldRanking: "8 universities in top 100",
      academicYear: "February - November",
      degreeRecognition: "Globally recognized",
      researchFunding: "$12 billion annually"
    },
    topUniversities: [
      { name: "University of Melbourne", ranking: "#14 globally", location: "Melbourne", programs: ["Medicine", "Engineering", "Business"], image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Australia's leading research university with world-class facilities and innovative programs." },
      { name: "Australian National University", ranking: "#27 globally", location: "Canberra", programs: ["Politics", "International Relations", "Economics"], image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Premier research university known for excellence in social sciences and public policy." },
      { name: "University of Sydney", ranking: "#19 globally", location: "Sydney", programs: ["Medicine", "Law", "Architecture"], image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Historic sandstone campus offering comprehensive programs in a vibrant city setting." },
      { name: "University of Queensland", ranking: "#43 globally", location: "Brisbane", programs: ["Mining Engineering", "Sports Science", "Veterinary Science"], image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Leading research institution with strong industry connections and beautiful campus." },
      { name: "Monash University", ranking: "#42 globally", location: "Melbourne", programs: ["Pharmacy", "Engineering", "Medicine"], image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Innovative university with global campuses and cutting-edge research facilities." },
      { name: "University of Western Australia", ranking: "#72 globally", location: "Perth", programs: ["Mining Engineering", "Marine Science", "Medicine"], image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Prestigious university with stunning campus and strong focus on research excellence." }
    ],
    costs: {
      tuitionRange: "$20,000 - $45,000 AUD per year",
      livingCosts: "$20,000 - $27,000 AUD per year",
      accommodation: "$15,000 - $25,000 AUD per year",
      totalEstimate: "$55,000 - $97,000 AUD per year"
    },
    scholarships: [
      { name: "Australia Awards", amount: "Full tuition + living allowance", eligibility: "Developing countries" },
      { name: "Endeavour Scholarships", amount: "Up to $272,500", eligibility: "All international students" },
      { name: "University-specific scholarships", amount: "25-100% tuition", eligibility: "Merit-based" },
      { name: "Research Training Program", amount: "Full PhD funding", eligibility: "Research students" }
    ],
    visa: {
      type: "Student Visa (Subclass 500)",
      processingTime: "4-6 weeks",
      cost: "$650 AUD",
      workRights: "20 hours per week during studies, unlimited during breaks",
      postStudyWork: "2-4 years depending on qualification",
      requirements: ["Genuine Temporary Entrant (GTE)", "English proficiency", "Financial capacity", "Health insurance (OSHC)"]
    },
    intakes: [
      { season: "Semester 1", months: "February - March", deadline: "October - December (previous year)" },
      { season: "Semester 2", months: "July - August", deadline: "March - May" },
      { season: "Trimester 3", months: "November", deadline: "August - September" }
    ],
    lifestyle: {
      qualityOfLife: "Ranked 4th globally",
      safety: "Very safe - low crime rates",
      culture: "Multicultural, outdoor lifestyle",
      weather: "Sunny climate, beach culture",
      cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"]
    }
  },
  canada: {
    name: "Canada",
    flag: "🇨🇦",
    description: "High-quality education with welcoming immigration pathways and multicultural environment in one of the world's most liveable countries.",
    color: "from-red-400 to-red-600",
    hero: "/hero/slide3.svg",
    overview: {
      capital: "Ottawa",
      language: "English & French",
      currency: "Canadian Dollar (CAD)",
      timezone: "UTC-3.5 to UTC-8",
      population: "38.2 million",
      climate: "Continental - cold winters, warm summers"
    },
    education: {
      universities: 98,
      worldRanking: "3 universities in top 50",
      academicYear: "September - April",
      degreeRecognition: "Globally recognized",
      researchFunding: "$15 billion annually"
    },
    topUniversities: [
      { name: "University of Toronto", ranking: "#21 globally", location: "Toronto", programs: ["Medicine", "Engineering", "Business"], image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Canada's top university with world-renowned research programs and diverse academic offerings." },
      { name: "McGill University", ranking: "#30 globally", location: "Montreal", programs: ["Medicine", "Law", "Arts"], image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Historic university known for academic excellence and vibrant campus life in Montreal." },
      { name: "University of British Columbia", ranking: "#40 globally", location: "Vancouver", programs: ["Forestry", "Mining", "Medicine"], image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Beautiful campus with stunning mountain and ocean views, leading in sustainability research." },
      { name: "University of Alberta", ranking: "#110 globally", location: "Edmonton", programs: ["Engineering", "Medicine", "Business"], image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Comprehensive research university with strong programs in health sciences and engineering." },
      { name: "McMaster University", ranking: "#152 globally", location: "Hamilton", programs: ["Health Sciences", "Engineering", "Business"], image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Innovation-focused university with pioneering problem-based learning approaches." },
      { name: "University of Waterloo", ranking: "#166 globally", location: "Waterloo", programs: ["Computer Science", "Engineering", "Mathematics"], image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Leading technology university with the world's largest co-operative education program." }
    ],
    costs: {
      tuitionRange: "$13,000 - $35,000 CAD per year",
      livingCosts: "$12,000 - $18,000 CAD per year",
      accommodation: "$8,000 - $15,000 CAD per year",
      totalEstimate: "$33,000 - $68,000 CAD per year"
    },
    scholarships: [
      { name: "Vanier Canada Graduate Scholarships", amount: "$50,000 per year", eligibility: "PhD students" },
      { name: "Ontario Graduate Scholarship", amount: "$15,000 per year", eligibility: "Graduate students in Ontario" },
      { name: "University-specific scholarships", amount: "$1,000 - $30,000", eligibility: "Merit and need-based" },
      { name: "Trudeau Foundation Scholarships", amount: "$60,000 per year", eligibility: "PhD in humanities and social sciences" }
    ],
    visa: {
      type: "Study Permit",
      processingTime: "4-12 weeks",
      cost: "$150 CAD",
      workRights: "20 hours per week during studies, full-time during breaks",
      postStudyWork: "Up to 3 years Post-Graduation Work Permit",
      requirements: ["Letter of acceptance", "Proof of funds", "No criminal record", "Medical exam (if required)"]
    },
    intakes: [
      { season: "Fall", months: "September", deadline: "January - March" },
      { season: "Winter", months: "January", deadline: "September - October (previous year)" },
      { season: "Summer", months: "May", deadline: "January - February" }
    ],
    lifestyle: {
      qualityOfLife: "Ranked 1st globally",
      safety: "Very safe - one of the safest countries",
      culture: "Multicultural, bilingual, friendly",
      weather: "Four distinct seasons",
      cities: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"]
    }
  },
  usa: {
    name: "United States",
    flag: "🇺🇸",
    description: "Home to world's top universities with extensive research opportunities, diverse academic programs, and innovation ecosystem.",
    color: "from-blue-400 to-blue-600",
    hero: "/hero/slide1.svg",
    overview: {
      capital: "Washington, D.C.",
      language: "English",
      currency: "US Dollar (USD)",
      timezone: "UTC-5 to UTC-10",
      population: "331 million",
      climate: "Varied - from tropical to arctic"
    },
    education: {
      universities: 4000,
      worldRanking: "15+ universities in top 50",
      academicYear: "August/September - May",
      degreeRecognition: "Globally recognized",
      researchFunding: "$80+ billion annually"
    },
    topUniversities: [
      { name: "Harvard University", ranking: "#3 globally", location: "Cambridge, MA", programs: ["Medicine", "Law", "Business"], image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "World's most prestigious university with unparalleled academic excellence and research opportunities." },
      { name: "Stanford University", ranking: "#5 globally", location: "Stanford, CA", programs: ["Computer Science", "Engineering", "Business"], image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Leading innovation hub in Silicon Valley with cutting-edge technology and entrepreneurship programs." },
      { name: "MIT", ranking: "#1 globally", location: "Cambridge, MA", programs: ["Engineering", "Computer Science", "Physics"], image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Premier institute of technology driving breakthrough research and scientific innovation." },
      { name: "University of California, Berkeley", ranking: "#10 globally", location: "Berkeley, CA", programs: ["Engineering", "Computer Science", "Economics"], image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Top public research university known for academic excellence and social activism." },
      { name: "Princeton University", ranking: "#16 globally", location: "Princeton, NJ", programs: ["Economics", "Politics", "Physics"], image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Elite Ivy League institution with beautiful Gothic architecture and rigorous academics." },
      { name: "Yale University", ranking: "#18 globally", location: "New Haven, CT", programs: ["Law", "Medicine", "Drama"], image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Historic Ivy League university renowned for liberal arts education and alumni network." }
    ],
    costs: {
      tuitionRange: "$25,000 - $55,000 USD per year",
      livingCosts: "$15,000 - $25,000 USD per year",
      accommodation: "$10,000 - $20,000 USD per year",
      totalEstimate: "$50,000 - $100,000 USD per year"
    },
    scholarships: [
      { name: "Fulbright Foreign Student Program", amount: "Full funding", eligibility: "Graduate students from 160+ countries" },
      { name: "University merit scholarships", amount: "$5,000 - $50,000", eligibility: "Academic excellence" },
      { name: "Athletic scholarships", amount: "Partial to full tuition", eligibility: "Student athletes" },
      { name: "Need-based financial aid", amount: "Varies", eligibility: "Demonstrated financial need" }
    ],
    visa: {
      type: "F-1 Student Visa",
      processingTime: "2-8 weeks",
      cost: "$350 USD",
      workRights: "On-campus employment only (20 hrs/week)",
      postStudyWork: "12 months OPT (36 months for STEM)",
      requirements: ["I-20 form", "SEVIS fee payment", "Financial documentation", "Visa interview"]
    },
    intakes: [
      { season: "Fall", months: "August - September", deadline: "December - February" },
      { season: "Spring", months: "January", deadline: "September - October (previous year)" },
      { season: "Summer", months: "May - June", deadline: "February - March" }
    ],
    lifestyle: {
      qualityOfLife: "High standard of living",
      safety: "Generally safe, varies by location",
      culture: "Diverse, individualistic, innovative",
      weather: "Extremely varied by region",
      cities: ["New York", "Los Angeles", "Chicago", "Boston", "San Francisco"]
    }
  },
  uk: {
    name: "United Kingdom",
    flag: "🇬🇧",
    description: "Historic institutions offering shorter degree programs with rich academic heritage and cultural diversity in the heart of Europe. High graduate employment rates (87%) with excellent post-study work opportunities.",
    color: "from-purple-400 to-indigo-600",
    hero: "/hero/slide2.svg",
    overview: {
      capital: "London",
      language: "English (native)",
      currency: "British Pound (GBP) - £1 ≈ $1.25 USD",
      timezone: "UTC+0 (GMT), UTC+1 (BST) in summer",
      population: "67 million",
      climate: "Temperate oceanic (15-25°C summer, 2-7°C winter)"
    },
    education: {
      universities: 130,
      worldRanking: "4 universities in top 10",
      academicYear: "September/October - June",
      degreeRecognition: "Globally recognized with QAA standards",
      researchFunding: "£8 billion annually"
    },
    topUniversities: [
      { name: "University of Oxford", ranking: "#2 globally", location: "Oxford", programs: ["PPE", "Medicine", "Law", "Natural Sciences"], image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "World's oldest English-speaking university with centuries of academic excellence and tradition." },
      { name: "University of Cambridge", ranking: "#4 globally", location: "Cambridge", programs: ["Natural Sciences", "Mathematics", "Engineering", "Economics"], image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Historic collegiate university renowned for groundbreaking research and Nobel laureates." },
      { name: "Imperial College London", ranking: "#6 globally", location: "London", programs: ["Engineering", "Medicine", "Science", "Computing"], image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Leading STEM-focused university with world-class research facilities in South Kensington." },
      { name: "UCL", ranking: "#8 globally", location: "London", programs: ["Architecture", "Medicine", "Psychology", "Law"], image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Progressive university known for being first to admit students regardless of background." },
      { name: "London School of Economics", ranking: "#37 globally", location: "London", programs: ["Economics", "Politics", "Sociology", "Finance"], image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "World-leading social science university in the heart of London's financial district." },
      { name: "King's College London", ranking: "#40 globally", location: "London", programs: ["Medicine", "Law", "International Relations", "Psychology"], image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Historic university with beautiful riverside campus and strong healthcare programs." }
    ],
    costs: {
      tuitionRange: "£15,000 - £45,000 GBP per year (MBA: £30,000 - £87,000)",
      livingCosts: "£12,000 - £18,000 GBP per year (£15,000+ in London)",
      accommodation: "£8,000 - £15,000 GBP per year",
      totalEstimate: "£35,000 - £78,000 GBP per year"
    },
    scholarships: [
      { name: "Chevening Scholarships", amount: "Full tuition + £18,000 living allowance", eligibility: "Future leaders, 2+ years work experience" },
      { name: "Commonwealth Scholarships", amount: "Full funding up to £12,000", eligibility: "Commonwealth countries, academic excellence" },
      { name: "Gates Cambridge Scholarships", amount: "£17,500+ annually", eligibility: "Outstanding academic achievement, leadership potential" },
      { name: "GREAT Scholarships", amount: "£10,000 minimum", eligibility: "Students from specific countries" },
      { name: "University scholarships", amount: "£2,000 - £25,000", eligibility: "Merit and need-based" }
    ],
    visa: {
      type: "Student Visa (formerly Tier 4)",
      processingTime: "3-8 weeks (priority: 5 working days)",
      cost: "£348 GBP",
      workRights: "20 hours per week during studies, full-time during holidays",
      postStudyWork: "2 years Graduate Route visa (3 years for PhD)",
      requirements: ["CAS from licensed sponsor", "Financial requirements (£1,334/month)", "English proficiency (IELTS 6.0+ overall)", "Tuberculosis test (if required)", "ATAS certificate (if required)"]
    },
    intakes: [
      { season: "Autumn (Main)", months: "September - October", deadline: "January 15th (UCAS), March-June (Postgraduate)" },
      { season: "Spring", months: "January - February", deadline: "September - November (previous year)" },
      { season: "Summer", months: "May - June", deadline: "February - March" }
    ],
    lifestyle: {
      qualityOfLife: "High quality of life with free NHS healthcare",
      safety: "Generally very safe - low crime rates",
      culture: "Rich history, multicultural (300+ languages), pub culture",
      weather: "Mild, rainy climate with four distinct seasons",
      cities: ["London", "Edinburgh", "Manchester", "Birmingham", "Glasgow"]
    }
  },
  europe: {
    name: "Europe",
    flag: "🇪🇺",
    description: "Diverse educational opportunities across multiple countries with Schengen mobility, varied tuition options, and rich cultural experiences.",
    color: "from-yellow-400 to-orange-500",
    hero: "/hero/slide3.svg",
    overview: {
      capital: "Multiple capitals",
      language: "24 official languages",
      currency: "Euro (EUR) and others",
      timezone: "UTC+0 to UTC+3",
      population: "750 million",
      climate: "Varied - Mediterranean to Continental"
    },
    education: {
      universities: 4000,
      worldRanking: "100+ universities in top 500",
      academicYear: "September/October - June/July",
      degreeRecognition: "Bologna Process - EU recognition",
      researchFunding: "€100+ billion annually"
    },
    topUniversities: [
      { name: "ETH Zurich", ranking: "#7 globally", location: "Switzerland", programs: ["Engineering", "Computer Science", "Natural Sciences"], image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Switzerland's premier technical university known for cutting-edge research and innovation." },
      { name: "Sorbonne University", ranking: "#44 globally", location: "France", programs: ["Medicine", "Literature", "Science"], image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Prestigious French university with rich academic heritage in the Latin Quarter of Paris." },
      { name: "Technical University of Munich", ranking: "#50 globally", location: "Germany", programs: ["Engineering", "Technology", "Medicine"], image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Germany's top technical university with world-class engineering and research programs." },
      { name: "University of Amsterdam", ranking: "#53 globally", location: "Netherlands", programs: ["Social Sciences", "Economics", "Psychology"], image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Historic Dutch university with a vibrant international community in Amsterdam's heart." },
      { name: "KU Leuven", ranking: "#70 globally", location: "Belgium", programs: ["Medicine", "Engineering", "Theology"], image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Belgium's oldest university with strong research tradition and European connections." },
      { name: "University of Copenhagen", ranking: "#84 globally", location: "Denmark", programs: ["Medicine", "Social Sciences", "Natural Sciences"], image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Denmark's leading university known for research excellence and sustainable innovation." }
    ],
    costs: {
      tuitionRange: "€0 - €20,000 EUR per year",
      livingCosts: "€8,000 - €15,000 EUR per year",
      accommodation: "€4,000 - €12,000 EUR per year",
      totalEstimate: "€12,000 - €47,000 EUR per year"
    },
    scholarships: [
      { name: "Erasmus Mundus", amount: "€25,000 per year", eligibility: "Joint master's programs" },
      { name: "DAAD Scholarships", amount: "€850 - €1,200 per month", eligibility: "Study in Germany" },
      { name: "Eiffel Excellence Scholarship", amount: "€1,181 per month", eligibility: "Study in France" },
      { name: "Holland Scholarship", amount: "€5,000", eligibility: "Study in Netherlands" }
    ],
    visa: {
      type: "National/Schengen Visa",
      processingTime: "2-8 weeks",
      cost: "€50 - €100 EUR",
      workRights: "Varies by country (10-20 hrs/week)",
      postStudyWork: "6 months to 2 years (varies by country)",
      requirements: ["University acceptance", "Financial proof", "Health insurance", "Language proficiency"]
    },
    intakes: [
      { season: "Autumn", months: "September - October", deadline: "February - May" },
      { season: "Spring", months: "February - March", deadline: "October - November (previous year)" },
      { season: "Summer", months: "June", deadline: "March - April" }
    ],
    lifestyle: {
      qualityOfLife: "Very high across most countries",
      safety: "Generally very safe",
      culture: "Extremely diverse, rich history",
      weather: "Varied by region",
      cities: ["Berlin", "Amsterdam", "Paris", "Barcelona", "Vienna"]
    }
  },
  "new-zealand": {
    name: "New Zealand",
    flag: "🇳🇿",
    description: "Safe, beautiful country with innovation-focused education, excellent quality of life, and stunning natural landscapes.",
    color: "from-teal-400 to-cyan-500",
    hero: "/hero/slide1.svg",
    overview: {
      capital: "Wellington",
      language: "English & Māori",
      currency: "New Zealand Dollar (NZD)",
      timezone: "UTC+12/+13",
      population: "5.1 million",
      climate: "Temperate oceanic"
    },
    education: {
      universities: 8,
      worldRanking: "All 8 universities in top 500",
      academicYear: "February - November",
      degreeRecognition: "Globally recognized",
      researchFunding: "$1.8 billion annually"
    },
    topUniversities: [
      { name: "University of Auckland", ranking: "#68 globally", location: "Auckland", programs: ["Engineering", "Medicine", "Business"], image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "New Zealand's largest university with world-class research facilities and diverse programs." },
      { name: "University of Otago", ranking: "#217 globally", location: "Dunedin", programs: ["Medicine", "Dentistry", "Pharmacy"], image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "New Zealand's oldest university with stunning campus and strong health science programs." },
      { name: "Victoria University of Wellington", ranking: "#236 globally", location: "Wellington", programs: ["Law", "Public Policy", "Creative Arts"], image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Capital city university known for law, government studies, and creative industries." },
      { name: "University of Canterbury", ranking: "#256 globally", location: "Christchurch", programs: ["Engineering", "Forestry", "Fine Arts"], image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Leading research university with strong engineering and science programs in the South Island." },
      { name: "Massey University", ranking: "#292 globally", location: "Palmerston North", programs: ["Agriculture", "Veterinary Science", "Aviation"], image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Innovative university specializing in agriculture, veterinary science, and creative arts." },
      { name: "University of Waikato", ranking: "#331 globally", location: "Hamilton", programs: ["Computer Science", "Management", "Education"], image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Modern university with strong technology programs and beautiful lakeside campus." }
    ],
    costs: {
      tuitionRange: "$22,000 - $32,000 NZD per year",
      livingCosts: "$15,000 - $20,000 NZD per year",
      accommodation: "$8,000 - $15,000 NZD per year",
      totalEstimate: "$45,000 - $67,000 NZD per year"
    },
    scholarships: [
      { name: "New Zealand Excellence Awards", amount: "Full tuition + allowance", eligibility: "High achieving students" },
      { name: "University scholarships", amount: "$5,000 - $20,000", eligibility: "Merit-based" },
      { name: "Doctoral scholarships", amount: "Full funding", eligibility: "PhD students" },
      { name: "Pacific scholarships", amount: "Full funding", eligibility: "Pacific Island students" }
    ],
    visa: {
      type: "Student Visa",
      processingTime: "4-6 weeks",
      cost: "$375 NZD",
      workRights: "20 hours per week during studies",
      postStudyWork: "1-3 years depending on qualification",
      requirements: ["Offer of place", "Financial evidence", "Health and character requirements", "English proficiency"]
    },
    intakes: [
      { season: "Semester 1", months: "February - March", deadline: "October - December (previous year)" },
      { season: "Semester 2", months: "July", deadline: "April - May" },
      { season: "Summer School", months: "November - February", deadline: "September - October" }
    ],
    lifestyle: {
      qualityOfLife: "Ranked in top 10 globally",
      safety: "One of the safest countries",
      culture: "Friendly, outdoor lifestyle, Māori heritage",
      weather: "Mild, maritime climate",
      cities: ["Auckland", "Wellington", "Christchurch", "Hamilton", "Dunedin"]
    }
  },
  japan: {
    name: "Japan",
    flag: "🇯🇵",
    description: "Technology-forward education with unique culture, excellent scholarships, innovation opportunities, and rich traditional heritage.",
    color: "from-pink-400 to-rose-500",
    hero: "/hero/slide2.svg",
    overview: {
      capital: "Tokyo",
      language: "Japanese",
      currency: "Japanese Yen (JPY)",
      timezone: "UTC+9",
      population: "125 million",
      climate: "Humid subtropical to humid continental"
    },
    education: {
      universities: 780,
      worldRanking: "5 universities in top 100",
      academicYear: "April - March",
      degreeRecognition: "Globally recognized",
      researchFunding: "$170 billion annually"
    },
    topUniversities: [
      { name: "University of Tokyo", ranking: "#23 globally", location: "Tokyo", programs: ["Engineering", "Medicine", "Natural Sciences"], image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Japan's most prestigious university with world-leading research and academic excellence." },
      { name: "Kyoto University", ranking: "#33 globally", location: "Kyoto", programs: ["Medicine", "Engineering", "Science"], image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Historic imperial university known for Nobel laureates and cutting-edge research." },
      { name: "Osaka University", ranking: "#68 globally", location: "Osaka", programs: ["Medicine", "Engineering", "Science"], image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Leading research university with strong medical and engineering programs in western Japan." },
      { name: "Tokyo Institute of Technology", ranking: "#91 globally", location: "Tokyo", programs: ["Engineering", "Science", "Technology"], image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Premier technical university specializing in science, technology, and engineering innovation." },
      { name: "Tohoku University", ranking: "#79 globally", location: "Sendai", programs: ["Materials Science", "Physics", "Engineering"], image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Research-intensive university with beautiful campus and strong international programs." },
      { name: "Nagoya University", ranking: "#112 globally", location: "Nagoya", programs: ["Physics", "Chemistry", "Engineering"], image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", description: "Renowned for Nobel Prize winners and excellence in natural sciences and engineering." }
    ],
    costs: {
      tuitionRange: "¥500,000 - ¥1,500,000 JPY per year",
      livingCosts: "¥800,000 - ¥1,200,000 JPY per year",
      accommodation: "¥400,000 - ¥800,000 JPY per year",
      totalEstimate: "¥1,700,000 - ¥3,500,000 JPY per year"
    },
    scholarships: [
      { name: "MEXT Scholarships", amount: "¥143,000 - ¥145,000 per month", eligibility: "Government-sponsored students" },
      { name: "JASSO Scholarships", amount: "¥48,000 - ¥80,000 per month", eligibility: "International students" },
      { name: "University scholarships", amount: "Tuition reduction 30-100%", eligibility: "Merit and need-based" },
      { name: "Private foundation scholarships", amount: "¥50,000 - ¥200,000 per month", eligibility: "Various criteria" }
    ],
    visa: {
      type: "Student Visa (Ryugaku)",
      processingTime: "1-3 months",
      cost: "¥3,000 JPY",
      workRights: "28 hours per week with permission",
      postStudyWork: "Job hunting visa up to 1 year",
      requirements: ["Certificate of Eligibility", "University acceptance", "Financial proof", "Health certificate"]
    },
    intakes: [
      { season: "Spring", months: "April", deadline: "October - December (previous year)" },
      { season: "Fall", months: "September - October", deadline: "March - May" },
      { season: "Winter", months: "January", deadline: "August - September (previous year)" }
    ],
    lifestyle: {
      qualityOfLife: "High standard of living",
      safety: "Extremely safe - very low crime rates",
      culture: "Rich traditional culture, modern technology",
      weather: "Four distinct seasons",
      cities: ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Nagoya"]
    }
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const country = COUNTRIES[slug as keyof typeof COUNTRIES];
  
  if (!country) {
    return {
      title: "Country Not Found | Flyover Consultancy",
      description: "The requested study destination was not found."
    };
  }

  return {
    title: `Study in ${country.name} | Flyover Consultancy`,
    description: `Complete guide to studying in ${country.name}. Universities, costs, visas, scholarships, and more. ${country.description}`
  };
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const country = COUNTRIES[slug as keyof typeof COUNTRIES];

  if (!country) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title={`Study in ${country.name}`}
        subtitle={country.description}
        image={country.hero}
      />

      {/* Quick Overview */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">{country.flag}</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Overview</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Object.entries(country.overview).map(([key, value], index) => (
              <Reveal key={key} delay={index * 0.1}>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="font-semibold text-gray-900 text-sm">{value}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Education System */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Education System</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover the academic excellence and research opportunities available in {country.name}.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {Object.entries(country.education).map(([key, value], index) => (
              <Reveal key={key} delay={index * 0.1}>
                <div className="bg-white rounded-lg p-6 shadow-lg text-center">
                  <div className="text-2xl font-bold text-brand-600 mb-2">{value}</div>
                  <div className="text-sm text-gray-600">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Top Universities */}
      <section className="py-16 bg-gradient-to-r from-brand-50 to-brand-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Universities</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore world-renowned institutions offering excellent academic programs and research opportunities.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {country.topUniversities.map((university, index) => (
              <Reveal key={university.name} delay={index * 0.1}>
                <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  {/* University Image/Logo */}
                  <div className="relative h-48 overflow-hidden">
                    <UniversityImage
                      src={university.image || 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80'} 
                      alt={`${university.name} campus`}
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                    {/* Ranking Badge */}
                    <div className="absolute top-4 right-4 z-20">
                      <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-brand-600 shadow-lg">
                        {university.ranking}
                      </div>
                    </div>
                    {/* University Logo Overlay */}
                    <div className="absolute bottom-4 left-4 z-20">
                      <div className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                        <GraduationCap className="w-6 h-6 text-brand-600" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
                        {university.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{university.location}</span>
                      </div>
                    </div>
                    
                    {/* Programs */}
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-medium">
                        Popular Programs
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {university.programs.slice(0, 3).map((program) => (
                          <span key={program} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200">
                            {program}
                          </span>
                        ))}
                        {university.programs.length > 3 && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            +{university.programs.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Learn More Button */}
                    <div className="pt-4 border-t border-gray-100">
                      <button className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors group">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Costs & Scholarships */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Costs */}
            <Reveal>
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <DollarSign className="w-8 h-8 text-brand-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">Study Costs</h3>
                </div>
                <div className="space-y-4">
                  {Object.entries(country.costs).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                      <span className="font-semibold text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Scholarships */}
            <Reveal delay={0.2}>
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <Award className="w-8 h-8 text-brand-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">Scholarships</h3>
                </div>
                <div className="space-y-4">
                  {country.scholarships.map((scholarship, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="font-semibold text-gray-900 mb-1">{scholarship.name}</div>
                      <div className="text-sm text-brand-600 font-medium mb-2">{scholarship.amount}</div>
                      <div className="text-xs text-gray-500">{scholarship.eligibility}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Visa Information */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Visa Information</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to know about student visa requirements and work rights.
              </p>
            </div>
          </Reveal>
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <div className="flex items-center mb-4">
                  <FileText className="w-6 h-6 text-brand-600 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900">Visa Details</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Visa Type:</span>
                    <span className="font-medium text-gray-900">{country.visa.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Time:</span>
                    <span className="font-medium text-gray-900">{country.visa.processingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost:</span>
                    <span className="font-medium text-gray-900">{country.visa.cost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Work Rights:</span>
                    <span className="font-medium text-gray-900">{country.visa.workRights}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Post-Study Work:</span>
                    <span className="font-medium text-gray-900">{country.visa.postStudyWork}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <FileText className="w-6 h-6 text-brand-600 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900">Requirements</h3>
                </div>
                <ul className="space-y-2">
                  {country.visa.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-brand-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intakes */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Academic Intakes</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Plan your application timeline with available intake periods and deadlines.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {country.intakes.map((intake, index) => (
              <Reveal key={intake.season} delay={index * 0.1}>
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <Calendar className="w-12 h-12 text-brand-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{intake.season}</h3>
                  <div className="text-brand-600 font-medium mb-2">{intake.months}</div>
                  <div className="text-sm text-gray-600">
                    <strong>Application Deadline:</strong><br />
                    {intake.deadline}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lifestyle */}
      <section className="py-16 bg-gradient-to-r from-brand-50 to-brand-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Student Life & Culture</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience the unique lifestyle and cultural opportunities that await you in {country.name}.
              </p>
            </div>
          </Reveal>
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <Heart className="w-12 h-12 text-brand-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Quality of Life</h3>
                <p className="text-sm text-gray-600">{country.lifestyle.qualityOfLife}</p>
              </div>
              <div className="text-center">
                <Globe className="w-12 h-12 text-brand-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Safety</h3>
                <p className="text-sm text-gray-600">{country.lifestyle.safety}</p>
              </div>
              <div className="text-center">
                <Users className="w-12 h-12 text-brand-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Culture</h3>
                <p className="text-sm text-gray-600">{country.lifestyle.culture}</p>
              </div>
              <div className="text-center">
                <MapPin className="w-12 h-12 text-brand-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Popular Cities</h3>
                <p className="text-sm text-gray-600">{country.lifestyle.cities.join(", ")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={`py-16 bg-gradient-to-r ${country.color}`}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <div className="text-6xl mb-6">{country.flag}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Study in {country.name}?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Get personalized guidance for your {country.name} education journey. Our experts are here to help you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/book-consultation" 
                className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-flex items-center justify-center"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Free Consultation
              </a>
              <a 
                href="/contact" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors duration-200 inline-flex items-center justify-center"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Get Expert Guidance
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
