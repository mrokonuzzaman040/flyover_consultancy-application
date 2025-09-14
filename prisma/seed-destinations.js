import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const destinations = [
  {
    country: "Australia",
    slug: "australia",
    flag: "🇦🇺",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80",
    description: "World-class universities with post-study work opportunities and vibrant student life.",
    highlights: ["Post-study work visa", "High quality of life", "Research opportunities"],
    universities: [
      {
        name: "University of Melbourne",
        location: "Melbourne, VIC",
        ranking: "#33 globally",
        image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
        courses: ["Business", "Medicine", "Engineering", "Arts"],
        description: "Australia's leading research university with a strong international reputation."
      },
      {
        name: "University of Sydney",
        location: "Sydney, NSW",
        ranking: "#38 globally",
        image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
        courses: ["Medicine", "Law", "Business", "Engineering"],
        description: "One of Australia's oldest and most prestigious universities."
      },
      {
        name: "Australian National University",
        location: "Canberra, ACT",
        ranking: "#30 globally",
        image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
        courses: ["Public Policy", "International Relations", "Science", "Arts"],
        description: "Australia's national university with a focus on research and public policy."
      }
    ],
    students: "700,000+ International Students",
    popularCities: ["Sydney", "Melbourne", "Brisbane"],
    averageCost: "$20,000 - $45,000 AUD",
    workRights: "20 hrs/week",
    color: "from-green-400 to-blue-500",
    hero: "/hero/slide2.svg",
    overviewMD: "Australia offers world-class education with excellent post-study work opportunities. The country is known for its high quality of life, multicultural environment, and strong research programs. With 43 universities and over 700,000 international students, Australia provides a diverse and welcoming environment for students from around the world.",
    costsMD: "**Tuition Fees:** $20,000 - $45,000 AUD per year  \n**Living Costs:** $20,000 - $27,000 AUD per year  \n**Accommodation:** $15,000 - $25,000 AUD per year  \n**Total Estimate:** $55,000 - $97,000 AUD per year\n\n*Costs may vary depending on the university, program, and location.*",
    intakesMD: "**Semester 1 (Main Intake):** February - March  \n*Application Deadline:* October - December (previous year)\n\n**Semester 2:** July - August  \n*Application Deadline:* March - May\n\n**Trimester 3:** November  \n*Application Deadline:* August - September",
    visaMD: "**Visa Type:** Student Visa (Subclass 500)  \n**Processing Time:** 4-6 weeks  \n**Cost:** $650 AUD  \n**Work Rights:** 20 hours per week during studies, unlimited during breaks  \n**Post-Study Work:** 2-4 years depending on qualification\n\n**Requirements:**\n- Genuine Temporary Entrant (GTE) statement\n- English proficiency test (IELTS/TOEFL)\n- Financial capacity proof\n- Health insurance (OSHC)\n- Medical examination (if required)",
    scholarshipsMD: "**Australia Awards:** Full tuition + living allowance (Developing countries)  \n**Endeavour Scholarships:** Up to $272,500 (All international students)  \n**University-specific scholarships:** 25-100% tuition (Merit-based)  \n**Research Training Program:** Full PhD funding (Research students)\n\n*Contact us for detailed scholarship information and application assistance.*",
    popularCourses: ["Business", "Engineering", "Medicine", "Computer Science"],
    faqs: [
      {
        question: "What is the cost of studying in Australia?",
        answer: "Tuition fees range from $20,000 to $45,000 AUD per year, with living costs of $20,000 to $27,000 AUD per year."
      },
      {
        question: "Can I work while studying?",
        answer: "Yes, you can work 20 hours per week during studies and unlimited hours during breaks."
      }
    ]
  },
  {
    country: "United States",
    slug: "usa",
    flag: "🇺🇸",
    image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80",
    description: "Top-ranked universities with extensive research opportunities and diverse academic programs.",
    highlights: ["World's top universities", "Research funding", "Diverse programs"],
    universities: [
      {
        name: "Harvard University",
        location: "Cambridge, MA",
        ranking: "#3 globally",
        image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
        courses: ["Medicine", "Law", "Business", "Engineering"],
        description: "America's oldest institution of higher learning and one of the world's most prestigious universities."
      },
      {
        name: "Stanford University",
        location: "Stanford, CA",
        ranking: "#2 globally",
        image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
        courses: ["Computer Science", "Engineering", "Business", "Medicine"],
        description: "Leading research university known for its entrepreneurial spirit and innovation."
      },
      {
        name: "Massachusetts Institute of Technology",
        location: "Cambridge, MA",
        ranking: "#1 globally",
        image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
        courses: ["Engineering", "Computer Science", "Physics", "Mathematics"],
        description: "World-renowned for science and technology education and research."
      }
    ],
    students: "1.1M+ International Students",
    popularCities: ["New York", "Los Angeles", "Boston"],
    averageCost: "$25,000 - $55,000 USD",
    workRights: "On-campus only",
    color: "from-blue-400 to-blue-600",
    hero: "/hero/slide1.svg",
    overviewMD: "The United States is home to many of the world's top universities with extensive research opportunities and diverse academic programs. With over 4,000 universities and 1.1 million international students, the USA offers unparalleled educational opportunities and innovation ecosystem.",
    costsMD: "**Tuition Fees:** $25,000 - $55,000 USD per year  \n**Living Costs:** $15,000 - $25,000 USD per year  \n**Accommodation:** $10,000 - $20,000 USD per year  \n**Total Estimate:** $50,000 - $100,000 USD per year\n\n*Costs vary significantly by university, program, and location.*",
    intakesMD: "**Fall Intake (Main):** August - September  \n*Application Deadline:* December - February\n\n**Spring Intake:** January  \n*Application Deadline:* September - October (previous year)\n\n**Summer Intake:** May - June  \n*Application Deadline:* February - March",
    visaMD: "**Visa Type:** F-1 Student Visa  \n**Processing Time:** 2-8 weeks  \n**Cost:** $350 USD  \n**Work Rights:** On-campus employment only (20 hrs/week)  \n**Post-Study Work:** 12 months OPT (36 months for STEM)\n\n**Requirements:**\n- I-20 form from university\n- SEVIS fee payment\n- Financial documentation\n- Visa interview\n- English proficiency test",
    scholarshipsMD: "**Fulbright Foreign Student Program:** Full funding (Graduate students from 160+ countries)  \n**University merit scholarships:** $5,000 - $50,000 (Academic excellence)  \n**Athletic scholarships:** Partial to full tuition (Student athletes)  \n**Need-based financial aid:** Varies (Demonstrated financial need)\n\n*Contact us for personalized scholarship guidance.*",
    popularCourses: ["Business", "Engineering", "Computer Science", "Medicine"],
    faqs: [
      {
        question: "What are the top universities in the USA?",
        answer: "The USA has many top-ranked universities including Harvard, MIT, Stanford, and many others."
      },
      {
        question: "Can I work while studying in the USA?",
        answer: "F-1 visa holders can work on-campus for up to 20 hours per week during studies."
      }
    ]
  }
];

async function main() {
  console.log('Seeding destinations...');
  
  for (const destination of destinations) {
    await prisma.destination.upsert({
      where: { slug: destination.slug },
      update: destination,
      create: destination,
    });
    console.log(`Seeded destination: ${destination.country}`);
  }
  
  console.log('Destinations seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
