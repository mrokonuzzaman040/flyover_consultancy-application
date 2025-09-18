import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flyover';

const scholarships = [
  {
    title: "Gates Cambridge Scholarship",
    slug: "gates-cambridge-scholarship",
    description: "The Gates Cambridge Scholarship is one of the most prestigious international scholarships in the world. It provides full funding for outstanding postgraduate students to study at the University of Cambridge.",
    country: ["United Kingdom"],
    deadline: new Date("2024-12-15"),
    amount: "Full tuition, maintenance allowance, and additional funding",
    eligibility: "Outstanding intellectual ability, leadership potential, and commitment to improving the lives of others. Open to citizens of any country outside the UK.",
    requirements: "Completed undergraduate degree, research proposal, academic references, and demonstration of leadership and commitment to service.",
    applicationProcess: "Apply through the University of Cambridge graduate application system. Submit academic transcripts, research proposal, personal statement, and references.",
    website: "https://www.gatescambridge.org/",
    tags: ["Full Funding", "Postgraduate", "Research", "Leadership"],
    status: "published"
  },
  {
    title: "Rhodes Scholarship",
    slug: "rhodes-scholarship",
    description: "The Rhodes Scholarship is the oldest and most celebrated international fellowship award in the world. It provides full financial support for selected students to pursue a degree at the University of Oxford.",
    country: ["United Kingdom"],
    deadline: new Date("2024-10-01"),
    amount: "Full tuition, living stipend, and travel expenses",
    eligibility: "Outstanding intellectual achievement, integrity of character, spirit of unselfishness, respect for others, potential for leadership, and physical vigor.",
    requirements: "Bachelor's degree, academic excellence, demonstrated leadership, and commitment to service. Age limit of 24 years.",
    applicationProcess: "Apply through your country's Rhodes selection committee. Submit academic transcripts, personal statement, and letters of recommendation.",
    website: "https://www.rhodeshouse.ox.ac.uk/",
    tags: ["Full Funding", "Oxford", "Leadership", "Service"],
    status: "published"
  },
  {
    title: "Fulbright Foreign Student Program",
    slug: "fulbright-foreign-student-program",
    description: "The Fulbright Program provides grants for international educational exchange for students, scholars, teachers, professionals, scientists and artists.",
    country: ["United States"],
    deadline: new Date("2024-05-15"),
    amount: "Tuition, airfare, living stipend, and health insurance",
    eligibility: "Open to graduate students, young professionals and artists from abroad to study and conduct research in the United States.",
    requirements: "Bachelor's degree, English proficiency, leadership potential, and strong academic record.",
    applicationProcess: "Apply through the Fulbright Commission or U.S. Embassy in your home country. Submit application form, academic records, and recommendations.",
    website: "https://foreign.fulbrightonline.org/",
    tags: ["USA", "Graduate", "Research", "Cultural Exchange"],
    status: "published"
  },
  {
    title: "Australia Awards Scholarships",
    slug: "australia-awards-scholarships",
    description: "Australia Awards Scholarships are long-term development awards offered to emerging leaders from developing countries to undertake study at Australian universities.",
    country: ["Australia"],
    deadline: new Date("2024-04-30"),
    amount: "Full tuition, return air travel, living allowance, and health cover",
    eligibility: "Citizens of eligible developing countries with leadership qualities and academic merit.",
    requirements: "Minimum academic qualifications, English language proficiency, and commitment to contribute to development in home country.",
    applicationProcess: "Apply online through the Australia Awards website. Submit academic transcripts, English test results, and development impact statement.",
    website: "https://www.australiaawards.gov.au/",
    tags: ["Full Funding", "Development", "Leadership", "Emerging Countries"],
    status: "published"
  },
  {
    title: "Chevening Scholarships",
    slug: "chevening-scholarships",
    description: "Chevening Scholarships are the UK government's global scholarship programme, funded by the Foreign and Commonwealth Office and partner organisations.",
    country: ["United Kingdom"],
    deadline: new Date("2024-11-07"),
    amount: "University tuition fees, monthly stipend, and return flights",
    eligibility: "Outstanding professionals with leadership potential from Chevening-eligible countries and territories.",
    requirements: "Bachelor's degree, two years of work experience, English language requirement, and leadership and networking skills.",
    applicationProcess: "Apply online through the Chevening website. Submit academic transcripts, work experience details, and personal statements.",
    website: "https://www.chevening.org/",
    tags: ["UK Government", "Leadership", "Professional", "Networking"],
    status: "published"
  },
  {
    title: "DAAD Scholarships",
    slug: "daad-scholarships",
    description: "The German Academic Exchange Service (DAAD) offers scholarships to international students and researchers for study and research in Germany.",
    country: ["Germany"],
    deadline: new Date("2024-11-15"),
    amount: "Monthly stipend, tuition fee coverage, and additional allowances",
    eligibility: "International students and graduates with above-average academic performance.",
    requirements: "Relevant academic degree, language proficiency (German or English), and motivation letter.",
    applicationProcess: "Apply through the DAAD portal. Submit academic records, language certificates, and research proposal.",
    website: "https://www.daad.de/en/",
    tags: ["Germany", "Research", "Academic Exchange", "Multiple Programs"],
    status: "published"
  },
  {
    title: "Erasmus Mundus Joint Master Degrees",
    slug: "erasmus-mundus-joint-master-degrees",
    description: "Erasmus Mundus provides scholarships for international students to pursue joint master's degrees at top European universities.",
    country: ["European Union", "Multiple Countries"],
    deadline: new Date("2024-01-15"),
    amount: "€1,400 monthly allowance, participation costs, and travel allowance",
    eligibility: "Students from around the world with a bachelor's degree relevant to the chosen program.",
    requirements: "Bachelor's degree, English proficiency, and specific program requirements.",
    applicationProcess: "Apply directly to the consortium offering the joint degree. Each program has specific application procedures.",
    website: "https://ec.europa.eu/programmes/erasmus-plus/opportunities/individuals/students/erasmus-mundus-joint-master-degrees_en",
    tags: ["European Union", "Joint Degree", "Multiple Universities", "Master's"],
    status: "published"
  },
  {
    title: "Swiss Excellence Scholarships",
    slug: "swiss-excellence-scholarships",
    description: "The Swiss Government Excellence Scholarships promote international exchange and research cooperation between Switzerland and over 180 other countries.",
    country: ["Switzerland"],
    deadline: new Date("2024-12-01"),
    amount: "Monthly stipend, tuition fee waiver, and health insurance",
    eligibility: "Foreign researchers and artists who have graduated from university and hold a master's degree or equivalent.",
    requirements: "Master's degree, research proposal, and academic excellence.",
    applicationProcess: "Apply through the Swiss embassy or consulate in your home country. Submit application form and supporting documents.",
    website: "https://www.sbfi.admin.ch/sbfi/en/home/education/scholarships-and-grants/swiss-government-excellence-scholarships.html",
    tags: ["Switzerland", "Research", "Excellence", "Government"],
    status: "published"
  }
];

async function seedScholarships() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const collection = db.collection('scholarships');
    
    // Clear existing scholarships
    await collection.deleteMany({});
    console.log('Cleared existing scholarships');
    
    // Insert new scholarships
    const result = await collection.insertMany(scholarships.map(scholarship => ({
      ...scholarship,
      createdAt: new Date(),
      updatedAt: new Date()
    })));
    
    console.log(`Successfully seeded ${result.insertedCount} scholarships`);
    
    // Log the created scholarships
    scholarships.forEach(scholarship => {
      console.log(`- ${scholarship.title} (${scholarship.slug})`);
    });
    
  } catch (error) {
    console.error('Error seeding scholarships:', error);
  } finally {
    await client.close();
  }
}

seedScholarships();
