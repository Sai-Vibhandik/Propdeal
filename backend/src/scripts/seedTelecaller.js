import mongoose from 'mongoose';
import { User } from '../models/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const createTelecallerUser = async () => {
  try {
    // Telecaller credentials
    const telecallerEmail = 'telecaller@propertyhub.com';
    const telecallerPassword = 'tele123';
    const telecallerName = 'Test Telecaller';
    const telecallerPhone = '9876543210';

    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/property-platform';

    console.log('Connecting to MongoDB...');
    console.log('URI:', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if telecaller already exists
    const existingTelecaller = await User.findOne({ email: telecallerEmail });

    if (existingTelecaller) {
      console.log('');
      console.log('⚠️  Telecaller user already exists!');
      console.log('');
      console.log('Email:', telecallerEmail);
      console.log('Role:', existingTelecaller.role);
      console.log('isActive:', existingTelecaller.isActive);
      console.log('');

      // Reset password
      console.log('Resetting password...');
      existingTelecaller.password = telecallerPassword;
      await existingTelecaller.save();

      console.log('✅ Password reset successfully!');
      console.log('');
      console.log('=================================');
      console.log('       LOGIN CREDENTIALS        ');
      console.log('=================================');
      console.log('Email:', telecallerEmail);
      console.log('Password:', telecallerPassword);
      console.log('=================================');
      console.log('');

      process.exit(0);
    }

    // Create telecaller user
    const telecaller = await User.create({
      email: telecallerEmail,
      password: telecallerPassword, // Will be hashed by pre-save hook
      name: telecallerName,
      role: 'telecaller',
      phone: telecallerPhone,
      isActive: true,
    });

    console.log('');
    console.log('✅ Telecaller user created successfully!');
    console.log('');
    console.log('=================================');
    console.log('       LOGIN CREDENTIALS        ');
    console.log('=================================');
    console.log('Email:', telecallerEmail);
    console.log('Password:', telecallerPassword);
    console.log('=================================');
    console.log('');
    console.log('⚠️  Use these credentials to login as a telecaller');
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

createTelecallerUser();