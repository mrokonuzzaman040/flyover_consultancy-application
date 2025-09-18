import mongoose from 'mongoose';

// Sample partners data
const partnersData = [
  {
    id: 1,
    name: 'Harvard University',
    category: 'University',
    country: 'United States',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Harvard_University_coat_of_arms.svg',
    color: '#A41034'
  },
  {
    id: 2,
    name: 'Oxford University',
    category: 'University',
    country: 'United Kingdom',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Oxford-University-Circlet.svg',
    color: '#002147'
  },
  {
    id: 3,
    name: 'MIT',
    category: 'University',
    country: 'United States',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/MIT_logo.svg',
    color: '#8A8B8C'
  },
  {
    id: 4,
    name: 'Cambridge University',
    category: 'University',
    country: 'United Kingdom',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/University_of_Cambridge_coat_of_arms_official.svg/1200px-University_of_Cambridge_coat_of_arms_official.svg.png',
    color: '#A3C1DA'
  },
  {
    id: 5,
    name: 'Stanford University',
    category: 'University',
    country: 'United States',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/1200px-Stanford_Cardinal_logo.svg.png',
    color: '#8C1515'
  },
  {
    id: 6,
    name: 'University of Toronto',
    category: 'University',
    country: 'Canada',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/University_of_Toronto_coat_of_arms.svg/1200px-University_of_Toronto_coat_of_arms.svg.png',
    color: '#003A79'
  },
  {
    id: 7,
    name: 'Australian National University',
    category: 'University',
    country: 'Australia',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Australian_National_University_logo.svg/1200px-Australian_National_University_logo.svg.png',
    color: '#00B5A5'
  },
  {
    id: 8,
    name: 'ETH Zurich',
    category: 'University',
    country: 'Switzerland',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/ETH_Zurich_Logo_black.svg/1200px-ETH_Zurich_Logo_black.svg.png',
    color: '#1F407A'
  },
  {
    id: 9,
    name: 'IELTS',
    category: 'Testing Organization',
    country: 'International',
    logo: 'https://www.ielts.org/-/media/images/ielts/logos/ielts-logo.ashx',
    color: '#E31E24'
  },
  {
    id: 10,
    name: 'TOEFL',
    category: 'Testing Organization',
    country: 'United States',
    logo: 'https://www.ets.org/content/dam/ets-org/pdfs/toefl/toefl-logo.jpg',
    color: '#0066CC'
  },
  {
    id: 11,
    name: 'British Council',
    category: 'Education Agency',
    country: 'United Kingdom',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/British_Council_logo.svg/1200px-British_Council_logo.svg.png',
    color: '#E41E13'
  },
  {
    id: 12,
    name: 'Education USA',
    category: 'Education Agency',
    country: 'United States',
    logo: 'https://educationusa.state.gov/sites/default/files/educationusa_logo_color.png',
    color: '#1F4E79'
  },
  {
    id: 13,
    name: 'Fulbright Commission',
    category: 'Scholarship Provider',
    country: 'United States',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Fulbright_Program_logo.svg/1200px-Fulbright_Program_logo.svg.png',
    color: '#003366'
  },
  {
    id: 14,
    name: 'DAAD',
    category: 'Scholarship Provider',
    country: 'Germany',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/DAAD_Logo.svg/1200px-DAAD_Logo.svg.png',
    color: '#005AA0'
  },
  {
    id: 15,
    name: 'Chevening',
    category: 'Scholarship Provider',
    country: 'United Kingdom',
    logo: 'https://www.chevening.org/wp-content/uploads/2019/11/chevening-logo-blue.png',
    color: '#1E3A8A'
  },
  {
    id: 16,
    name: 'University of Melbourne',
    category: 'University',
    country: 'Australia',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/University_of_Melbourne_logo.svg/1200px-University_of_Melbourne_logo.svg.png',
    color: '#003366'
  },
  {
    id: 17,
    name: 'McGill University',
    category: 'University',
    country: 'Canada',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/McGill_University_CoA.svg/1200px-McGill_University_CoA.svg.png',
    color: '#ED1B2F'
  },
  {
    id: 18,
    name: 'University of British Columbia',
    category: 'University',
    country: 'Canada',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/University_of_British_Columbia_coat_of_arms.svg/1200px-University_of_British_Columbia_coat_of_arms.svg.png',
    color: '#002145'
  },
  {
    id: 19,
    name: 'Kaplan International',
    category: 'Education Provider',
    country: 'International',
    logo: 'https://www.kaplaninternational.com/sites/all/themes/kaplan/logo.png',
    color: '#FF6B35'
  },
  {
    id: 20,
    name: 'EF Education First',
    category: 'Education Provider',
    country: 'International',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/EF_Education_First_logo.svg/1200px-EF_Education_First_logo.svg.png',
    color: '#E31E24'
  }
];

// Partner Schema
const PartnerSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  category: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  country: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  logo: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'partners'
});

// Indexes
PartnerSchema.index({ name: 'text' });
PartnerSchema.index({ name: 1 });

// Ensure virtual fields are serialized
PartnerSchema.set('toJSON', {
  virtuals: true
});

const Partner = mongoose.models.Partner || mongoose.model('Partner', PartnerSchema);

async function seedPartners() {
  try {
    console.log('🌱 Starting partners seeding...');
    
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing partners
    await Partner.deleteMany({});
    console.log('🗑️ Cleared existing partners');

    // Insert new partners
    const result = await Partner.insertMany(partnersData);
    console.log(`✅ Successfully seeded ${result.length} partners`);

    // Display the seeded data by category
    console.log('\n📋 Seeded partners by category:');
    
    const categories = [...new Set(partnersData.map(p => p.category))];
    for (const category of categories) {
      const categoryPartners = partnersData.filter(p => p.category === category);
      console.log(`\n📁 ${category} (${categoryPartners.length}):`);
      categoryPartners.forEach((partner, index) => {
        console.log(`  ${index + 1}. ${partner.name} (${partner.country})`);
      });
    }

    console.log('\n🎉 Partners seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding partners:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

seedPartners();
