import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createAdmin() {
  try {
    console.log('🚀 Creating Admin User for Flyover\n');
    
    // Get user input
    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 6 chars): ');
    
    // Validate input
    if (!name || name.length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }
    
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }
    
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/flyover';
    console.log('\n📡 Connecting to MongoDB...');
    
    const client = new MongoClient(mongoUri);
    await client.connect();
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ 
      email: email.toLowerCase() 
    });
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create admin user
    console.log('👤 Creating admin user...');
    const result = await usersCollection.insertOne({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
      emailVerified: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await client.close();
    
    console.log('\n✅ Admin user created successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Name: ${name}`);
    console.log(`🔑 Role: ADMIN`);
    console.log(`🆔 User ID: ${result.insertedId}`);
    console.log('\n🎉 You can now login at http://localhost:3000/login');
    
  } catch (error) {
    console.error('\n❌ Error creating admin user:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
createAdmin();