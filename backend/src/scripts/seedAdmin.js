import mongoose from 'mongoose';
import { User } from '../models/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const createAdminUser = async () => {
  try {
    // Get credentials from environment or use defaults
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@propdeal.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = 'Admin';

    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/property-platform';

    console.log('Connecting to MongoDB...');
    console.log('URI:', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('');
      console.log('⚠️  Admin user already exists!');
      console.log('');
      console.log('Email:', adminEmail);
      console.log('Role:', existingAdmin.role);
      console.log('');
      console.log('If you forgot your password, you can:');
      console.log('1. Delete the user from the database');
      console.log('2. Run this script again');
      console.log('');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      email: adminEmail,
      password: adminPassword, // Will be hashed by pre-save hook
      name: adminName,
      role: 'superadmin',
      isActive: true,
    });

    console.log('');
    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('=================================');
    console.log('       LOGIN CREDENTIALS        ');
    console.log('=================================');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('=================================');
    console.log('');
    console.log('⚠️  Please change the password after first login!');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ Error:', error.message);
    console.error('');

    if (error.message.includes('ECONNREFUSED')) {
      console.error('MongoDB connection refused. Please ensure MongoDB is running.');
    } else if (error.message.includes('authentication failed')) {
      console.error('MongoDB authentication failed. Check your credentials in .env file.');
    } else if (error.message.includes('MongoNetworkError')) {
      console.error('Network error. Check your MongoDB connection string.');
    }

    process.exit(1);
  }
};

createAdminUser();