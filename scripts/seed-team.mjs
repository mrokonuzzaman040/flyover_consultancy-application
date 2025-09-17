import mongoose from 'mongoose';

const teamMembers = [
  {
    name: 'Sarah Johnson',
    role: 'Founder & CEO',
    image: '/team/sarah-johnson.jpg',
    bio: 'With over 15 years of experience in international education, Sarah founded Flyover Education to bridge the gap between ambitious students and world-class universities.',
    expertise: ['Strategic Leadership', 'University Partnerships', 'Student Success'],
    email: 'sarah@flyovereducation.com',
    linkedin: '',
    phone: '+1 (555) 123-4567',
    isActive: true,
    order: 1
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Academic Director',
    image: '/team/michael-chen.jpg',
    bio: 'Former admissions officer at top universities, Dr. Chen brings insider knowledge to help students craft compelling applications.',
    expertise: ['Admissions Strategy', 'Academic Planning', 'Research Programs'],
    email: 'michael@flyovereducation.com',
    linkedin: '',
    phone: '+1 (555) 123-4568',
    isActive: true,
    order: 2
  },
  {
    name: 'Emma Rodriguez',
    role: 'Student Success Manager',
    image: '/team/emma-rodriguez.jpg',
    bio: 'Emma ensures every student receives personalized support throughout their journey, from application to graduation.',
    expertise: ['Student Support', 'Cultural Integration', 'Career Guidance'],
    email: 'emma@flyovereducation.com',
    linkedin: '',
    phone: '+1 (555) 123-4569',
    isActive: true,
    order: 3
  },
  {
    name: 'James Wilson',
    role: 'Visa & Immigration Specialist',
    image: '/team/james-wilson.jpg',
    bio: 'James navigates the complex world of student visas and immigration requirements, ensuring smooth transitions for our students.',
    expertise: ['Visa Processing', 'Immigration Law', 'Documentation'],
    email: 'james@flyovereducation.com',
    linkedin: '',
    phone: '+1 (555) 123-4570',
    isActive: true,
    order: 4
  },
  {
    name: 'Dr. Priya Patel',
    role: 'Scholarship Advisor',
    image: '/team/priya-patel.jpg',
    bio: 'Dr. Patel helps students identify and secure funding opportunities, making international education accessible to all.',
    expertise: ['Scholarship Applications', 'Financial Aid', 'Merit Awards'],
    email: 'priya@flyovereducation.com',
    linkedin: '',
    phone: '+1 (555) 123-4571',
    isActive: true,
    order: 5
  },
  {
    name: 'Alex Thompson',
    role: 'Technology Director',
    image: '/team/alex-thompson.jpg',
    bio: 'Alex leads our digital transformation, creating innovative tools and platforms to enhance the student experience.',
    expertise: ['EdTech Innovation', 'Platform Development', 'Digital Strategy'],
    email: 'alex@flyovereducation.com',
    linkedin: '',
    phone: '+1 (555) 123-4572',
    isActive: true,
    order: 6
  }
];

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: true },
  bio: { type: String, required: true },
  expertise: [{ type: String, required: true }],
  email: { type: String, required: true },
  linkedin: { type: String, default: '' },
  phone: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const Team = mongoose.models.Team || mongoose.model('Team', TeamSchema);

async function seedTeam() {
  try {
    console.log('🌱 Starting team seeding...');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing team members
    await Team.deleteMany({});
    console.log('🗑️ Cleared existing team members');

    // Insert new team members
    const result = await Team.insertMany(teamMembers);
    console.log(`✅ Successfully seeded ${result.length} team members`);

    // Display the seeded data
    console.log('\n📋 Seeded team members:');
    result.forEach((member, index) => {
      console.log(`${index + 1}. ${member.name} - ${member.role}`);
    });

    console.log('\n🎉 Team seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding team:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

seedTeam();
