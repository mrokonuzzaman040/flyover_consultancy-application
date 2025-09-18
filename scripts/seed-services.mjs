import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import the Service model
import { Service } from '../lib/models/Service.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

async function seedServices() {
  try {
    // Read the test data
    const dataPath = path.join(__dirname, '../data/services-test-data.json');
    const testData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');
    
    // Insert test data
    const services = testData.services.map(service => ({
      ...service,
      createdAt: new Date(service.createdAt),
      updatedAt: new Date(service.updatedAt)
    }));
    
    await Service.insertMany(services);
    console.log(`Seeded ${services.length} services successfully`);
    
    // Display seeded services
    services.forEach(service => {
      console.log(`- ${service.name} (${service.slug})`);
    });
    
  } catch (error) {
    console.error('Error seeding services:', error);
  }
}

async function main() {
  await connectDB();
  await seedServices();
  await mongoose.connection.close();
  console.log('Database connection closed');
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { seedServices };