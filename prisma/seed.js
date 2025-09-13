import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const countries = [
  {
    slug: "australia",
    country: "Australia",
    flag: "🇦🇺",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80",
    description: "World-class universities with post-study work opportunities and vibrant student life.",
    highlights: ["Post-study work visa", "High quality of life", "Research opportunities"],
    universities: "43 Universities",
    students: "700,000+ International Students",
    popularCities: ["Sydney", "Melbourne", "Brisbane"],
    averageCost: "$20,000 - $45,000 AUD",
    workRights: "20 hrs/week",
    color: "from-green-400 to-blue-500"
  },
  {
    slug: "canada",
    country: "Canada",
    flag: "🇨🇦",
    image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80",
    description: "High-quality education with welcoming immigration pathways and multicultural environment.",
    highlights: ["Immigration pathways", "Affordable tuition", "Safe environment"],
    universities: "98 Universities",
    students: "640,000+ International Students",
    popularCities: ["Toronto", "Vancouver", "Montreal"],
    averageCost: "$13,000 - $35,000 CAD",
    workRights: "20 hrs/week",
    color: "from-red-400 to-red-600"
  },
  {
    slug: "usa",
    country: "United States",
    flag: "🇺🇸",
    image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80",
    description: "Top-ranked universities with extensive research opportunities and diverse academic programs.",
    highlights: ["World's top universities", "Research funding", "Diverse programs"],
    universities: "4,000+ Universities",
    students: "1.1M+ International Students",
    popularCities: ["New York", "Los Angeles", "Boston"],
    averageCost: "$25,000 - $55,000 USD",
    workRights: "On-campus only",
    color: "from-blue-400 to-blue-600"
  },
  {
    slug: "uk",
    country: "United Kingdom",
    flag: "🇬🇧",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80",
    description: "Historic institutions offering 1-year master's programs with rich academic heritage.",
    highlights: ["1-year master's", "Historic universities", "Cultural diversity"],
    universities: "130+ Universities",
    students: "485,000+ International Students",
    popularCities: ["London", "Manchester", "Edinburgh"],
    averageCost: "£15,000 - £35,000 GBP",
    workRights: "20 hrs/week",
    color: "from-purple-400 to-indigo-600"
  },
  {
    slug: "europe",
    country: "Europe",
    flag: "🇪🇺",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80",
    description: "Schengen access with varied tuition options and rich cultural experiences across multiple countries.",
    highlights: ["Schengen mobility", "Low tuition fees", "Cultural diversity"],
    universities: "4,000+ Universities",
    students: "2M+ International Students",
    popularCities: ["Berlin", "Amsterdam", "Paris"],
    averageCost: "€5,000 - €20,000 EUR",
    workRights: "Varies by country",
    color: "from-yellow-400 to-orange-500"
  },
  {
    slug: "new-zealand",
    country: "New Zealand",
    flag: "🇳🇿",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80",
    description: "Safe, beautiful country with innovation-focused education and excellent quality of life.",
    highlights: ["Safe environment", "Innovation focus", "Natural beauty"],
    universities: "8 Universities",
    students: "50,000+ International Students",
    popularCities: ["Auckland", "Wellington", "Christchurch"],
    averageCost: "$22,000 - $32,000 NZD",
    workRights: "20 hrs/week",
    color: "from-teal-400 to-cyan-500"
  },
  {
    slug: "japan",
    country: "Japan",
    flag: "🇯🇵",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80",
    description: "Technology-forward education with unique culture, excellent scholarships, and innovation opportunities.",
    highlights: ["Technology focus", "MEXT scholarships", "Cultural experience"],
    universities: "780+ Universities",
    students: "280,000+ International Students",
    popularCities: ["Tokyo", "Osaka", "Kyoto"],
    averageCost: "¥500,000 - ¥1,500,000 JPY",
    workRights: "28 hrs/week",
    color: "from-pink-400 to-rose-500"
  }
];

async function main() {
  console.log('Start seeding destinations...');
  
  for (const country of countries) {
    const destination = await prisma.destination.upsert({
      where: { slug: country.slug },
      update: country,
      create: country,
    });
    console.log(`Created/Updated destination: ${destination.country}`);
  }
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });