import mongoose from 'mongoose';

// Sample awards data
const awardsData = [
  {
    id: 1,
    title: 'Best Education Consultancy 2024',
    image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&h=400&fit=crop&crop=center',
    year: 2024
  },
  {
    id: 2,
    title: 'Excellence in Student Services Award',
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=400&fit=crop&crop=center',
    year: 2023
  },
  {
    id: 3,
    title: 'Top International Education Provider',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=400&fit=crop&crop=center',
    year: 2023
  },
  {
    id: 4,
    title: 'Innovation in Education Technology',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=400&fit=crop&crop=center',
    year: 2022
  },
  {
    id: 5,
    title: 'Customer Excellence Award',
    image: 'https://images.unsplash.com/photo-1594736797933-d0d3e0b8e8a8?w=400&h=400&fit=crop&crop=center',
    year: 2022
  },
  {
    id: 6,
    title: 'Outstanding Contribution to International Education',
    image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=400&fit=crop&crop=center',
    year: 2021
  },
  {
    id: 7,
    title: 'Best Visa Success Rate Award',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center',
    year: 2021
  },
  {
    id: 8,
    title: 'Trusted Education Partner',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop&crop=center',
    year: 2020
  }
];

// Award Schema
const AwardSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 10
  }
}, {
  timestamps: true,
  collection: 'awards'
});

// Indexes
AwardSchema.index({ year: -1 });
AwardSchema.index({ title: 'text' });

// Virtual for award age
AwardSchema.virtual('awardAge').get(function() {
  return new Date().getFullYear() - this.year;
});

// Ensure virtual fields are serialized
AwardSchema.set('toJSON', {
  virtuals: true
});

const Award = mongoose.models.Award || mongoose.model('Award', AwardSchema);

async function seedAwards() {
  try {
    console.log('🏆 Starting awards seeding...');
    
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing awards
    await Award.deleteMany({});
    console.log('🗑️ Cleared existing awards');

    // Insert new awards
    const result = await Award.insertMany(awardsData);
    console.log(`✅ Successfully seeded ${result.length} awards`);

    // Display the seeded data by year
    console.log('\n🏆 Seeded awards by year:');
    
    const years = [...new Set(awardsData.map(a => a.year))].sort((a, b) => b - a);
    for (const year of years) {
      const yearAwards = awardsData.filter(a => a.year === year);
      console.log(`\n📅 ${year} (${yearAwards.length} awards):`);
      yearAwards.forEach((award, index) => {
        console.log(`  ${index + 1}. ${award.title}`);
      });
    }

    console.log('\n🎉 Awards seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding awards:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

seedAwards();
