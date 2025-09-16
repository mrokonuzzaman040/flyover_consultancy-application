import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES6 module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load sections data
const sectionsDataPath = path.join(__dirname, '../data/sections-data.json');
const sectionsData = JSON.parse(fs.readFileSync(sectionsDataPath, 'utf8'));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flyover';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Helper function to generate slug
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Define schemas directly in the script
const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  sectionsMD: [String],
  features: [{
    icon: String,
    title: String,
    description: String
  }],
  benefits: [String],
  process: [{
    step: String,
    title: String,
    description: String
  }],
  ctaLabel: { type: String, required: true },
  ctaText: { type: String, required: true },
  popular: { type: Boolean, default: false }
}, { timestamps: true, collection: 'services' });

const statSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  value: { type: String, required: true },
  label: { type: String, required: true }
}, { timestamps: true, collection: 'stats' });

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  flag: { type: String, required: true },
  universities: [{
    name: String,
    logo: String,
    ranking: String,
    location: String
  }],
  faqs: [{
    question: String,
    answer: String
  }],
  popular: { type: Boolean, default: false }
}, { timestamps: true, collection: 'destinations' });

const studyAbroadStepSchema = new mongoose.Schema({
  stepId: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  color: { type: String, required: true },
  bgColor: { type: String, required: true },
  textColor: { type: String, required: true }
}, { timestamps: true, collection: 'studyabroadsteps' });

const whyChooseUsFeatureSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true, collection: 'whychooseusfeatures' });

const awardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  year: { type: String, required: true },
  organization: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true }
}, { timestamps: true, collection: 'awards' });

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  attendees: { type: String, required: true },
  featured: { type: Boolean, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true }
}, { timestamps: true, collection: 'events' });

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, required: true },
  website: { type: String },
  category: { type: String, required: true }
}, { timestamps: true, collection: 'partners' });

const successStorySchema = new mongoose.Schema({
  storyId: { type: Number, required: true },
  rating: { type: Number, required: true },
  text: { type: String, required: true },
  author: { type: String, required: true },
  university: { type: String, required: true },
  program: { type: String, required: true },
  country: { type: String, required: true },
  scholarship: { type: String, required: true },
  year: { type: String, required: true },
  avatar: { type: String, required: true },
  flag: { type: String, required: true },
  color: { type: String, required: true }
}, { timestamps: true, collection: 'successstories' });

const insightCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  color: { type: String, default: '#3B82F6' }
}, { timestamps: true, collection: 'insightcategories' });

const insightSchema = new mongoose.Schema({
  insightId: { type: Number, required: true },
  category: { type: String, required: true },
  categoryColor: { type: String, required: true },
  author: { type: String, required: true },
  authorRole: { type: String, required: true },
  readTime: { type: String, required: true },
  publishDate: { type: String, required: true },
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  image: { type: String, required: true },
  featured: { type: Boolean, required: true },
  views: { type: String, required: true },
  likes: { type: String, required: true }
}, { timestamps: true, collection: 'insights' });

const slideSchema = new mongoose.Schema({
  image: { type: String, required: true },
  headline: { type: String, required: true },
  sub: { type: String, required: true },
  primary: {
    label: { type: String, required: true },
    href: { type: String },
    isModal: { type: Boolean }
  },
  secondary: {
    label: { type: String, required: true },
    href: { type: String }
  }
}, { timestamps: true, collection: 'slides' });

// Create models
const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
const Stat = mongoose.models.Stat || mongoose.model('Stat', statSchema);
const Destination = mongoose.models.Destination || mongoose.model('Destination', destinationSchema);
const StudyAbroadStep = mongoose.models.StudyAbroadStep || mongoose.model('StudyAbroadStep', studyAbroadStepSchema);
const WhyChooseUsFeature = mongoose.models.WhyChooseUsFeature || mongoose.model('WhyChooseUsFeature', whyChooseUsFeatureSchema);
const Award = mongoose.models.Award || mongoose.model('Award', awardSchema);
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
const Partner = mongoose.models.Partner || mongoose.model('Partner', partnerSchema);
const SuccessStory = mongoose.models.SuccessStory || mongoose.model('SuccessStory', successStorySchema);
const InsightCategory = mongoose.models.InsightCategory || mongoose.model('InsightCategory', insightCategorySchema);
const Insight = mongoose.models.Insight || mongoose.model('Insight', insightSchema);
const Slide = mongoose.models.Slide || mongoose.model('Slide', slideSchema);

// Seeding functions
async function seedServices() {
  console.log('Seeding services...');
  await Service.deleteMany({});
  
  const services = sectionsData.services.map((service, index) => ({
    name: service.title,
    slug: generateSlug(service.title),
    title: service.title,
    subtitle: service.description,
    description: service.description,
    image: `/services/service-${index + 1}.svg`,
    sectionsMD: [],
    features: service.features.map(feature => ({
      icon: service.icon,
      title: feature,
      description: `${feature} - comprehensive support`
    })),
    benefits: service.features,
    process: [
      { step: '1', title: 'Consultation', description: 'Initial assessment and planning' },
      { step: '2', title: 'Implementation', description: 'Execute the planned strategy' },
      { step: '3', title: 'Follow-up', description: 'Ongoing support and guidance' }
    ],
    ctaLabel: 'Get Started',
    ctaText: `Start your ${service.title.toLowerCase()} journey today`,
    popular: service.popular
  }));
  
  await Service.insertMany(services);
  console.log(`✓ Seeded ${services.length} services`);
}

async function seedStats() {
  console.log('Seeding stats...');
  await Stat.deleteMany({});
  
  const stats = sectionsData.stats.map(stat => ({
    icon: stat.icon,
    value: stat.value,
    label: stat.label
  }));
  
  await Stat.insertMany(stats);
  console.log(`✓ Seeded ${stats.length} stats`);
}

async function seedDestinations() {
  console.log('Seeding destinations...');
  await Destination.deleteMany({});
  
  const destinations = sectionsData.destinations.map((dest) => ({
    name: dest.name,
    slug: generateSlug(dest.name),
    title: dest.name,
    subtitle: dest.description,
    description: dest.description,
    image: dest.image,
    flag: dest.flag || '🌍',
    universities: dest.universities || [],
    faqs: dest.faqs || [],
    popular: dest.popular || false
  }));
  
  await Destination.insertMany(destinations);
  console.log(`✓ Seeded ${destinations.length} destinations`);
}

async function seedStudyAbroadSteps() {
  console.log('Seeding study abroad steps...');
  await StudyAbroadStep.deleteMany({});
  
  const steps = sectionsData.studyabroadsteps.map(step => ({
    stepId: step.id,
    title: step.title,
    description: step.description,
    color: step.color,
    bgColor: step.bgColor,
    textColor: step.textColor
  }));
  
  await StudyAbroadStep.insertMany(steps);
  console.log(`✓ Seeded ${steps.length} study abroad steps`);
}

async function seedWhyChooseUsFeatures() {
  console.log('Seeding why choose us features...');
  await WhyChooseUsFeature.deleteMany({});
  await WhyChooseUsFeature.insertMany(sectionsData.whychooseusfeatures);
  console.log(`✓ Seeded ${sectionsData.whychooseusfeatures.length} why choose us features`);
}

async function seedAwards() {
  console.log('Seeding awards...');
  await Award.deleteMany({});
  
  const awards = sectionsData.awards.map(award => ({
    title: award.title,
    description: award.description,
    year: award.year,
    organization: award.organization,
    icon: award.icon,
    color: award.color
  }));
  
  await Award.insertMany(awards);
  console.log(`✓ Seeded ${awards.length} awards`);
}

async function seedEvents() {
  console.log('Seeding events...');
  await Event.deleteMany({});
  
  const events = sectionsData.upcomingEvents.map(event => ({
    title: event.title,
    slug: generateSlug(event.title),
    description: event.description,
    date: event.date,
    time: event.time,
    location: event.location,
    type: event.type,
    attendees: event.attendees,
    featured: event.featured,
    icon: event.icon,
    color: event.color
  }));
  
  await Event.insertMany(events);
  console.log(`✓ Seeded ${events.length} events`);
}

async function seedPartners() {
  console.log('Seeding partners...');
  await Partner.deleteMany({});
  await Partner.insertMany(sectionsData.partners);
  console.log(`✓ Seeded ${sectionsData.partners.length} partners`);
}

async function seedSuccessStories() {
  console.log('Seeding success stories...');
  await SuccessStory.deleteMany({});
  
  const stories = sectionsData.successStories.map(story => ({
    storyId: story.id,
    rating: story.rating,
    text: story.text,
    author: story.author,
    university: story.university,
    program: story.program,
    country: story.country,
    scholarship: story.scholarship,
    year: story.year,
    avatar: story.avatar,
    flag: story.flag,
    color: story.color
  }));
  
  await SuccessStory.insertMany(stories);
  console.log(`✓ Seeded ${stories.length} success stories`);
}

async function seedInsightCategories() {
  console.log('Seeding insight categories...');
  await InsightCategory.deleteMany({});
  
  const categories = sectionsData.insightCategories.map(cat => ({
    ...cat,
    slug: generateSlug(cat.name)
  }));
  
  await InsightCategory.insertMany(categories);
  console.log(`✓ Seeded ${categories.length} insight categories`);
  return categories;
}

async function seedInsights(categories) {
  console.log('Seeding insights...');
  await Insight.deleteMany({});
  
  const insights = sectionsData.insights.map(insight => {
    return {
      insightId: insight.id,
      category: insight.category,
      categoryColor: insight.categoryColor,
      author: insight.author,
      authorRole: insight.authorRole,
      readTime: insight.readTime,
      publishDate: insight.publishDate,
      title: insight.title,
      excerpt: insight.excerpt,
      image: insight.image,
      featured: insight.featured,
      views: insight.views,
      likes: insight.likes
    };
  });
  
  await Insight.insertMany(insights);
  console.log(`✓ Seeded ${insights.length} insights`);
}

async function seedSlides() {
  console.log('Seeding slides...');
  await Slide.deleteMany({});
  
  const slides = sectionsData.slides.map(slide => ({
    image: slide.image,
    headline: slide.headline,
    sub: slide.sub,
    primary: slide.primary,
    secondary: slide.secondary
  }));
  
  await Slide.insertMany(slides);
  console.log(`✓ Seeded ${slides.length} slides`);
}

async function seedSectionsData() {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    console.log('⚠️  This will delete all existing data in the collections!');
    
    // Drop existing collections to remove old indexes
    const collections = ['services', 'stats', 'destinations', 'studyabroadsteps', 'whychooseusfeatures', 'awards', 'events', 'partners', 'successstories', 'insightcategories', 'insights', 'slides'];
    for (const collectionName of collections) {
      try {
        if (mongoose.connection.db) {
          await mongoose.connection.db.collection(collectionName).drop();
          console.log(`✓ Dropped collection: ${collectionName}`);
        }
      } catch (error) {
        // Collection might not exist, which is fine
        if (error.code !== 26) {
          console.log(`Note: Collection ${collectionName} doesn't exist or couldn't be dropped`);
        }
      }
    }
    
    await seedServices();
     await seedStats();
     await seedDestinations();
     await seedStudyAbroadSteps();
     await seedWhyChooseUsFeatures();
     await seedAwards();
     await seedEvents();
     await seedPartners();
     await seedSuccessStories();
     
     // Seed categories first, then insights (due to relationship)
     const categories = await seedInsightCategories();
     await seedInsights(categories);
     
     await seedSlides();
     
     console.log('\n🎉 Database seeding completed successfully!');
     console.log('All sections data has been imported from sections-data.json');
     
   } catch (error) {
     console.error('❌ Error seeding database:', error);
     process.exit(1);
   } finally {
     await mongoose.connection.close();
     console.log('Database connection closed.');
   }
 }

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedSectionsData().catch(console.error);
}

export { seedSectionsData };