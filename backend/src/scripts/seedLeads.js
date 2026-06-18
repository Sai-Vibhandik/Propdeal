import mongoose from 'mongoose';
import { Property, Lead } from '../models/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const createTestLeads = async () => {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/property-platform';

    console.log('Connecting to MongoDB...');
    console.log('URI:', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find a property to associate leads with
    let property = await Property.findOne({ status: 'published' });

    if (!property) {
      // If no published property, find any property
      property = await Property.findOne();
    }

    if (!property) {
      console.log('');
      console.log('❌ No properties found in database.');
      console.log('Please create at least one property first.');
      console.log('');
      process.exit(1);
    }

    console.log('');
    console.log(`Using property: ${property.name} (${property._id})`);
    console.log('');

    // Check if test leads already exist
    const existingLeads = await Lead.find({ propertyId: property._id });

    if (existingLeads.length > 0) {
      console.log(`Found ${existingLeads.length} existing leads for this property:`);
      existingLeads.forEach((lead, i) => {
        console.log(`  ${i + 1}. ${lead.name} - ${lead.email} - ${lead.phone} (${lead.status})`);
      });
      console.log('');
      process.exit(0);
    }

    // Create test leads
    const testLeads = [
      {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@email.com',
        phone: '9876543210',
        message: 'I am interested in 3BHK configuration. Please share more details.',
        source: 'property-page',
        status: 'new',
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel@email.com',
        phone: '8765432109',
        message: 'Looking for investment opportunity. What is the expected ROI?',
        source: 'cta-price',
        status: 'contacted',
      },
      {
        name: 'Amit Kumar',
        email: 'amit.kumar@email.com',
        phone: '7654321098',
        message: 'Want to schedule a site visit this weekend.',
        source: 'cta-visit',
        status: 'new',
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha.reddy@email.com',
        phone: '6543210987',
        message: 'Please send me the brochure and floor plans.',
        source: 'cta-brochure',
        status: 'qualified',
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.singh@email.com',
        phone: '5432109876',
        message: 'What is the possession date? Looking for ready-to-move option.',
        source: 'property-page',
        status: 'new',
      },
    ];

    // Add propertyId to each lead
    const leadsToCreate = testLeads.map(lead => ({
      ...lead,
      propertyId: property._id,
    }));

    // Create leads
    const createdLeads = await Lead.insertMany(leadsToCreate);

    console.log('');
    console.log(`✅ Created ${createdLeads.length} test leads!`);
    console.log('');
    console.log('=================================');
    console.log('       TEST LEADS CREATED        ');
    console.log('=================================');
    createdLeads.forEach((lead, i) => {
      console.log(`${i + 1}. ${lead.name} (${lead.status})`);
      console.log(`   Email: ${lead.email}`);
      console.log(`   Phone: ${lead.phone}`);
      console.log('');
    });
    console.log('=================================');
    console.log('');
    console.log('You can now view these leads in the admin panel.');
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

createTestLeads();