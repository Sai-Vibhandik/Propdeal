import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SiteContent from '../models/SiteContent.js';

// Load environment variables
dotenv.config();

const defaultContent = {
  // Hero Carousel Slides
  heroSlides: [
    {
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop',
      title: 'Find Your Perfect Home',
      subtitle: 'Premium Properties in Prime Locations',
      location: 'Bangalore',
      properties: '234+ Properties',
      primaryCta: {
        text: 'Browse Properties',
        link: '/properties',
      },
      secondaryCta: {
        text: 'Call Us',
        type: 'phone',
        value: '+919876543210',
      },
      order: 0,
      isActive: true,
    },
    {
      image: 'https://images.unsplash.com/photo-1600585154340-be9168c6a96a?w=1920&h=1080&fit=crop',
      title: 'Luxury Living Redefined',
      subtitle: 'Exclusive Villas & Apartments',
      location: 'Mumbai',
      properties: '150+ Properties',
      primaryCta: {
        text: 'Browse Properties',
        link: '/properties',
      },
      secondaryCta: {
        text: 'Call Us',
        type: 'phone',
        value: '+919876543210',
      },
      order: 1,
      isActive: true,
    },
    {
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=1080&fit=crop',
      title: 'Smart Investment Choices',
      subtitle: 'High Returns, Premium Locations',
      location: 'Gurgaon',
      properties: '180+ Properties',
      primaryCta: {
        text: 'Browse Properties',
        link: '/properties',
      },
      secondaryCta: {
        text: 'Call Us',
        type: 'phone',
        value: '+919876543210',
      },
      order: 2,
      isActive: true,
    },
  ],

  // Why Choose Us Section
  whyUs: {
    sectionTitle: 'Your Trusted Property Partner',
    sectionSubtitle: 'We combine technology with expertise to deliver exceptional property solutions tailored to your needs.',
    features: [
      {
        icon: 'CheckCircle',
        title: 'RERA Verified',
        description: 'All properties are RERA registered with verified documentation for your peace of mind.',
        order: 0,
      },
      {
        icon: 'Shield',
        title: 'Real Photos Only',
        description: 'What you see is what you get. No stock images or misleading photos on our platform.',
        order: 1,
      },
      {
        icon: 'Award',
        title: 'Direct Builder Price',
        description: 'No middlemen or brokers. Get the best prices directly from developers.',
        order: 2,
      },
      {
        icon: 'Clock',
        title: 'Transparent Pricing',
        description: 'All costs clearly mentioned upfront. No hidden charges or surprise fees.',
        order: 3,
      },
    ],
    stats: [
      { value: '98%', label: 'Customer Satisfaction', order: 0 },
      { value: '500+', label: 'Properties Sold', order: 1 },
      { value: '50+', label: 'Cities Covered', order: 2 },
      { value: '4.8', label: 'Average Rating', order: 3 },
    ],
  },

  // Popular Cities
  cities: [
    {
      name: 'Bangalore',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
      description: 'Silicon Valley of India',
      order: 0,
      isActive: true,
    },
    {
      name: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1600585154340-be9168c6a96a?w=400&h=300&fit=crop',
      description: 'Financial Capital of India',
      order: 1,
      isActive: true,
    },
    {
      name: 'Gurgaon',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
      description: 'Corporate Hub of NCR',
      order: 2,
      isActive: true,
    },
    {
      name: 'Pune',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop',
      description: 'Oxford of the East',
      order: 3,
      isActive: true,
    },
  ],

  // Testimonials
  testimonials: [
    {
      name: 'Rahul Sharma',
      location: 'Bangalore',
      rating: 5,
      property: 'Prestige Lakeside Habitat',
      text: 'Found my dream home through PropertyHub. The team was incredibly helpful and guided me through every step. The property details were accurate and the photos matched exactly what I saw during the visit.',
      order: 0,
      isActive: true,
    },
    {
      name: 'Priya Patel',
      location: 'Mumbai',
      rating: 5,
      property: 'Lodha World Towers',
      text: 'I was skeptical about online property search, but PropertyHub made it so easy. The RERA verification gave me confidence, and the pricing was transparent with no hidden charges. Highly recommend!',
      order: 1,
      isActive: true,
    },
    {
      name: 'Amit Kumar',
      location: 'Gurgaon',
      rating: 5,
      property: 'DLF The Camellias',
      text: 'The team helped me find the perfect 4BHK for my family. They understood my requirements and showed me only relevant properties. Saved me weeks of searching. Thank you PropertyHub!',
      order: 2,
      isActive: true,
    },
    {
      name: 'Sneha Reddy',
      location: 'Hyderabad',
      rating: 5,
      property: 'My Home Avatar',
      text: 'Professional service from start to finish. The property details were comprehensive, and the team was always available to answer my questions. The entire process was smooth and stress-free.',
      order: 3,
      isActive: true,
    },
    {
      name: 'Vikram Singh',
      location: 'Pune',
      rating: 5,
      property: 'Kolte Patil Life Republic',
      text: 'Best property platform I have used. The interface is clean, filters work perfectly, and the support team is very responsive. Found my apartment within a week of searching.',
      order: 4,
      isActive: true,
    },
  ],

  // FAQs
  faqs: [
    {
      question: 'How do I schedule a property visit?',
      answer: 'You can schedule a property visit by clicking the "Schedule Visit" button on any property page. Fill in your preferred date and time, and our team will coordinate with the builder to arrange the visit. You will receive a confirmation call within 24 hours.',
      order: 0,
      isActive: true,
    },
    {
      question: 'Are all properties RERA registered?',
      answer: 'Yes, all properties listed on PropertyHub are RERA registered. We verify the RERA registration number for every property before listing. You can view the RERA details on each property page, including the registration number and project status.',
      order: 1,
      isActive: true,
    },
    {
      question: 'What documents do I need to buy a property?',
      answer: 'The basic documents required include identity proof (Aadhaar/PAN), address proof, income proof (salary slips/ITR), and bank statements for the last 6 months. For home loans, additional documents may be required. Our team will guide you through the complete documentation process.',
      order: 2,
      isActive: true,
    },
    {
      question: 'Are the property prices negotiable?',
      answer: 'Property prices on PropertyHub are direct builder prices. While some flexibility exists depending on the builder and market conditions, we ensure you get the best possible price without any hidden charges. We negotiate on your behalf to get you the best deal.',
      order: 3,
      isActive: true,
    },
    {
      question: 'How long does the property buying process take?',
      answer: 'The typical property buying process takes 30-60 days from booking to registration, depending on the property type and payment mode. Ready-to-move properties can be faster, while under-construction properties may vary. We assist you at every step to ensure a smooth process.',
      order: 4,
      isActive: true,
    },
    {
      question: 'Do you provide home loan assistance?',
      answer: 'Yes, we have partnerships with leading banks and financial institutions. We can help you compare home loan interest rates, process your loan application, and get the best deals. Our loan assistance is completely free of charge.',
      order: 5,
      isActive: true,
    },
    {
      question: 'What is the difference between ready-to-move and under-construction?',
      answer: 'Ready-to-move properties are completed and available for immediate possession. Under-construction properties are still being built and will be delivered in the future. Under-construction properties often offer better pricing but come with construction timeline risks.',
      order: 6,
      isActive: true,
    },
    {
      question: 'How do I verify the property title and legal clearances?',
      answer: 'We conduct thorough verification of property titles and legal clearances before listing. All properties come with verified title documents, encumbrance certificates, and legal clearances. You can also request additional verification reports for your peace of mind.',
      order: 7,
      isActive: true,
    },
  ],

  // Contact Information
  contact: {
    phone: '+91 98765 43210',
    email: 'info@propertyhub.com',
    address: '123 Real Estate Tower, MG Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    workingHours: 'Mon - Sat, 9:00 AM - 7:00 PM',
  },

  // Social Links
  social: {
    facebook: 'https://facebook.com/propertyhub',
    twitter: 'https://twitter.com/propertyhub',
    instagram: 'https://instagram.com/propertyhub',
    linkedin: 'https://linkedin.com/company/propertyhub',
    youtube: 'https://youtube.com/propertyhub',
  },

  // SEO Settings
  seo: {
    siteName: 'PropertyHub',
    siteTagline: 'Find Your Perfect Home',
    metaDescription: 'Find your dream property with verified listings, real photos, and transparent pricing. Explore premium apartments, villas, and plots in top cities.',
    metaKeywords: ['property', 'real estate', 'apartments', 'villas', 'flats', 'buy property', 'property search', 'property hub'],
    ogImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=630&fit=crop',
  },

  // Footer Settings
  footer: {
    description: 'Discover your dream property with our platform. We help you find the perfect home with detailed insights and virtual tours.',
    copyrightText: '© 2024 PropertyHub. All rights reserved.',
    showNewsletter: true,
  },

  // Footer Quick Links
  footerLinks: [
    { label: 'Home', url: '/', order: 0, isActive: true },
    { label: 'Properties', url: '/properties', order: 1, isActive: true },
    { label: 'About Us', url: '/about', order: 2, isActive: true },
    { label: 'Contact', url: '/contact', order: 3, isActive: true },
  ],

  // Footer Social Links
  footerSocialLinks: [],

  // Legal Pages
  privacyPolicy: `<h2>Privacy Policy</h2>
<p>Last updated: January 2024</p>

<h3>1. Information We Collect</h3>
<p>We collect information you provide directly to us, such as when you fill out a contact form, subscribe to our newsletter, or communicate with us about properties. This may include:</p>
<ul>
<li>Name and contact information (email, phone number)</li>
<li>Property preferences and requirements</li>
<li>Communication history</li>
</ul>

<h3>2. How We Use Your Information</h3>
<p>We use the information we collect to:</p>
<ul>
<li>Respond to your inquiries and provide customer support</li>
<li>Send you information about properties that match your preferences</li>
<li>Improve our services and website functionality</li>
<li>Send promotional communications (with your consent)</li>
</ul>

<h3>3. Information Sharing</h3>
<p>We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>
<ul>
<li>Property developers and builders for inquiry processing</li>
<li>Service providers who assist in our operations</li>
<li>Legal authorities when required by law</li>
</ul>

<h3>4. Data Security</h3>
<p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>

<h3>5. Your Rights</h3>
<p>You have the right to:</p>
<ul>
<li>Access and update your personal information</li>
<li>Opt-out of marketing communications</li>
<li>Request deletion of your data</li>
</ul>

<h3>6. Contact Us</h3>
<p>If you have any questions about this Privacy Policy, please contact us through our website or at the contact information provided.</p>`,

  termsOfService: `<h2>Terms of Service</h2>
<p>Last updated: January 2024</p>

<h3>1. Acceptance of Terms</h3>
<p>By accessing and using this website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.</p>

<h3>2. Use of Website</h3>
<p>You agree to use this website only for lawful purposes. You may not:</p>
<ul>
<li>Violate any applicable laws or regulations</li>
<li>Infringe on intellectual property rights</li>
<li>Transmit harmful code or viruses</li>
<li>Attempt unauthorized access to our systems</li>
</ul>

<h3>3. Property Information</h3>
<p>Property listings and information displayed on this website are provided by third parties. While we strive for accuracy, we cannot guarantee the completeness or accuracy of all property information. We recommend verifying all details before making any decisions.</p>

<h3>4. User Accounts</h3>
<p>If you create an account, you are responsible for maintaining its security and for all activities under your account. You must provide accurate and complete information when registering.</p>

<h3>5. Limitation of Liability</h3>
<p>We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of this website or any services provided through it.</p>

<h3>6. Intellectual Property</h3>
<p>All content on this website, including text, graphics, logos, and images, is the property of the website owner and protected by intellectual property laws.</p>

<h3>7. Third-Party Links</h3>
<p>This website may contain links to third-party websites. We are not responsible for the content or practices of these external sites.</p>

<h3>8. Changes to Terms</h3>
<p>We reserve the right to modify these terms at any time. Your continued use of the website constitutes acceptance of any changes.</p>

<h3>9. Governing Law</h3>
<p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in the applicable jurisdiction.</p>`,

};

async function seedSiteContent() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/property-platform';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Check if content already exists
    const existing = await SiteContent.findOne();

    if (existing) {
      console.log('Site content already exists. Updating with default values...');
      // Update existing content
      Object.assign(existing, defaultContent);
      await existing.save();
      console.log('Site content updated successfully!');
    } else {
      // Create new content
      const content = await SiteContent.create(defaultContent);
      console.log('Site content seeded successfully!');
      console.log('Created document ID:', content._id);
    }

    // Display summary
    console.log('\n=== Seed Summary ===');
    console.log('Hero Slides:', defaultContent.heroSlides.length);
    console.log('Why Us Features:', defaultContent.whyUs.features.length);
    console.log('Why Us Stats:', defaultContent.whyUs.stats.length);
    console.log('Cities:', defaultContent.cities.length);
    console.log('Testimonials:', defaultContent.testimonials.length);
    console.log('FAQs:', defaultContent.faqs.length);
    console.log('====================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding site content:', error);
    process.exit(1);
  }
}

seedSiteContent();