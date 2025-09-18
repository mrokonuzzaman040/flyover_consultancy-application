import mongoose from 'mongoose';

// Sample success stories data
const successStoriesData = [
  {
    storyId: 1,
    rating: 5,
    text: "Flyover Education made my dream of studying at Harvard a reality. Their personalized guidance and scholarship assistance were invaluable throughout my journey.",
    author: "Sarah Chen",
    university: "Harvard University",
    program: "Master of Business Administration",
    country: "United States",
    scholarship: "Merit Scholarship - $50,000",
    year: "2024",
    avatar: "SC",
    flag: "🇺🇸",
    color: "from-red-400 to-red-600"
  },
  {
    storyId: 2,
    rating: 5,
    text: "The team at Flyover helped me secure admission to Oxford with a full scholarship. Their expertise in UK applications is unmatched!",
    author: "Ahmed Rahman",
    university: "University of Oxford",
    program: "MSc Computer Science",
    country: "United Kingdom",
    scholarship: "Rhodes Scholarship",
    year: "2024",
    avatar: "AR",
    flag: "🇬🇧",
    color: "from-blue-400 to-blue-600"
  },
  {
    storyId: 3,
    rating: 5,
    text: "From application to visa, Flyover supported me every step of the way. Now I'm pursuing my PhD at MIT with full funding!",
    author: "Maria Rodriguez",
    university: "MIT",
    program: "PhD in Artificial Intelligence",
    country: "United States",
    scholarship: "Research Assistantship",
    year: "2023",
    avatar: "MR",
    flag: "🇺🇸",
    color: "from-purple-400 to-purple-600"
  },
  {
    storyId: 4,
    rating: 5,
    text: "Thanks to Flyover's guidance, I received admission to University of Toronto with a significant scholarship. The process was smooth and stress-free.",
    author: "David Kim",
    university: "University of Toronto",
    program: "Master of Engineering",
    country: "Canada",
    scholarship: "International Student Award - $30,000",
    year: "2023",
    avatar: "DK",
    flag: "🇨🇦",
    color: "from-green-400 to-green-600"
  },
  {
    storyId: 5,
    rating: 5,
    text: "Flyover's visa expertise ensured I had no issues with my student visa application. Their attention to detail is remarkable.",
    author: "Priya Patel",
    university: "University of Melbourne",
    program: "Master of Public Health",
    country: "Australia",
    scholarship: "Australia Awards Scholarship",
    year: "2023",
    avatar: "PP",
    flag: "🇦🇺",
    color: "from-orange-400 to-orange-600"
  },
  {
    storyId: 6,
    rating: 5,
    text: "The scholarship guidance from Flyover helped me secure funding for my studies at ETH Zurich. I couldn't have done it without them!",
    author: "Hans Mueller",
    university: "ETH Zurich",
    program: "MSc Data Science",
    country: "Switzerland",
    scholarship: "Excellence Scholarship - €40,000",
    year: "2022",
    avatar: "HM",
    flag: "🇨🇭",
    color: "from-indigo-400 to-indigo-600"
  },
  {
    storyId: 7,
    rating: 5,
    text: "Flyover's comprehensive support helped me navigate the complex application process for Cambridge. Their expertise is truly world-class.",
    author: "Emily Johnson",
    university: "University of Cambridge",
    program: "MPhil Development Studies",
    country: "United Kingdom",
    scholarship: "Gates Cambridge Scholarship",
    year: "2022",
    avatar: "EJ",
    flag: "🇬🇧",
    color: "from-pink-400 to-pink-600"
  },
  {
    storyId: 8,
    rating: 5,
    text: "From test preparation to final admission, Flyover was with me every step. Now I'm at Stanford pursuing my dream degree!",
    author: "Raj Sharma",
    university: "Stanford University",
    program: "MS Computer Science",
    country: "United States",
    scholarship: "Stanford Fellowship - $60,000",
    year: "2022",
    avatar: "RS",
    flag: "🇺🇸",
    color: "from-teal-400 to-teal-600"
  }
];

// SuccessStory Schema
const SuccessStorySchema = new mongoose.Schema({
  storyId: {
    type: Number,
    required: true,
    unique: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 5
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  author: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  university: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  program: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  country: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  scholarship: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  year: {
    type: String,
    required: true,
    trim: true,
    maxlength: 10
  },
  avatar: {
    type: String,
    required: true,
    trim: true,
    maxlength: 10
  },
  flag: {
    type: String,
    required: true,
    trim: true,
    maxlength: 10
  },
  color: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  }
}, {
  timestamps: true,
  collection: 'successstories'
});

// Indexes
SuccessStorySchema.index({ country: 1 });
SuccessStorySchema.index({ university: 1 });
SuccessStorySchema.index({ author: 'text', university: 'text', program: 'text', text: 'text' });

// Ensure virtual fields are serialized
SuccessStorySchema.set('toJSON', {
  virtuals: true
});

const SuccessStory = mongoose.models.SuccessStory || mongoose.model('SuccessStory', SuccessStorySchema);

async function seedSuccessStories() {
  try {
    console.log('🌟 Starting success stories seeding...');
    
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing success stories
    await SuccessStory.deleteMany({});
    console.log('🗑️ Cleared existing success stories');

    // Insert new success stories
    const result = await SuccessStory.insertMany(successStoriesData);
    console.log(`✅ Successfully seeded ${result.length} success stories`);

    // Display the seeded data by country
    console.log('\n🌟 Seeded success stories by country:');
    
    const countries = [...new Set(successStoriesData.map(s => s.country))];
    for (const country of countries) {
      const countryStories = successStoriesData.filter(s => s.country === country);
      console.log(`\n🌍 ${country} (${countryStories.length} stories):`);
      countryStories.forEach((story, index) => {
        console.log(`  ${index + 1}. ${story.author} - ${story.university} (${story.year})`);
      });
    }

    console.log('\n🎉 Success stories seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding success stories:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

seedSuccessStories();
