import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Lead } from '../models/index.js';

// Load environment variables
dotenv.config();

const cleanEnquiriesFromLeads = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/property-landing-pages');
    console.log('Connected to database');

    // Find all leads with main website sources (these should be enquiries)
    const enquirySources = ['contact-section', 'home-loan', 'general', 'partner-with-us', 'developer-contact', 'developer-cta'];

    const enquiriesToDelete = await Lead.find({ source: { $in: enquirySources } });
    console.log(`Found ${enquiriesToDelete.length} enquiries (main website leads) to delete`);

    if (enquiriesToDelete.length === 0) {
      console.log('No enquiries to delete. Database is already clean.');
      process.exit(0);
    }

    // Show breakdown by source
    const breakdown = {};
    enquiriesToDelete.forEach(lead => {
      breakdown[lead.source] = (breakdown[lead.source] || 0) + 1;
    });
    console.log('\nBreakdown by source:');
    Object.entries(breakdown).forEach(([source, count]) => {
      console.log(`  - ${source}: ${count}`);
    });

    // Show sample of what will be deleted
    console.log('\nSample of enquiries to be deleted:');
    enquiriesToDelete.slice(0, 5).forEach((lead, index) => {
      console.log(`${index + 1}. ${lead.name} - ${lead.phone} - ${lead.source}`);
    });

    // Delete all leads with enquiry sources
    const result = await Lead.deleteMany({ source: { $in: enquirySources } });
    console.log(`\n✅ Successfully deleted ${result.deletedCount} enquiries from Lead collection`);
    console.log('Database is now clean!');

    process.exit(0);
  } catch (error) {
    console.error('Error cleaning database:', error);
    process.exit(1);
  }
};

cleanEnquiriesFromLeads();