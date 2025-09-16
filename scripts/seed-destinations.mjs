import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import the Destination model
import '../lib/models/Destination.ts';
const Destination = mongoose.model('Destination');

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection string - update this with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flyover';

async function seedDestinations() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Read the test data
    const testDataPath = path.join(__dirname, '../data/destinations-test-data.json');
    const testDataFile = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));
    const testData = testDataFile.destinations; // Extract the destinations array

    // Clear existing destinations
    await Destination.deleteMany({});
    console.log('Cleared existing destinations');

    // Insert new destinations
    const destinations = await Destination.insertMany(testData);
    console.log(`Successfully seeded ${destinations.length} destinations`);

    // Log the seeded destinations
    destinations.forEach(dest => {
      console.log(`- ${dest.country} (${dest.slug})`);
    });

  } catch (error) {
    console.error('Error seeding destinations:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed function
seedDestinations();