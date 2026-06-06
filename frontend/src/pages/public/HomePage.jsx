import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, MapPin, Shield, TrendingUp, Users, Star } from 'lucide-react';

// Components
import HeroCarousel from '../../components/public/HeroCarousel.jsx';
import SearchBar from '../../components/public/SearchBar.jsx';
import PropertyGrid from '../../components/public/PropertyGrid.jsx';
import FeaturedSection from '../../components/public/FeaturedSection.jsx';
import AnimatedSection from '../../components/common/AnimatedSection.jsx';

const HomePage = () => {
  const navigate = useNavigate();

  // Placeholder data - will be replaced with API data
  const featuredProperties = [];
  const latestProperties = [
    {
      _id: '1',
      name: 'Prestige Lakeside Habitat',
      slug: 'prestige-lakeside',
      builder: 'Prestige Group',
      propertyType: 'apartment',
      category: 'ready-to-move',
      address: { locality: 'Whitefield', city: 'Bangalore', fullAddress: 'Whitefield, Bangalore' },
      priceRange: { min: 8500000, max: 15000000 },
      priceUnit: 'lac',
      configurations: ['2BHK', '3BHK', '4BHK'],
      featured: true,
      heroImage: 'https://www.homznspace.com/wp-content/uploads/2013/10/Prestige-Lakeside-Habitat-1.jpg',
    },
    {
      _id: '2',
      name: 'DLF The Camellias',
      slug: 'dlf-camellias',
      builder: 'DLF Group',
      propertyType: 'apartment',
      category: 'ready-to-move',
      address: { locality: 'Sector 42', city: 'Gurgaon' },
      priceRange: { min: 5, max: 12 },
      priceUnit: 'cr',
      configurations: ['3BHK', '4BHK', '5BHK'],
      featured: true,
      heroImage: 'https://placehold.co/800x600/0f172a/white?text=DLF+Camellias',
    },
    {
      _id: '3',
      name: 'Lodha World Towers',
      slug: 'lodha-world-towers',
      builder: 'Lodha Group',
      propertyType: 'apartment',
      category: 'under-construction',
      address: { locality: 'Worli', city: 'Mumbai' },
      priceRange: { min: 8, max: 25 },
      priceUnit: 'cr',
      configurations: ['3BHK', '4BHK', 'Penthouse'],
      featured: true,
      heroImage: 'https://placehold.co/800x600/1e40af/white?text=Lodha+World',
    },
    {
      _id: '4',
      name: 'Brigade Gateway',
      slug: 'brigade-gateway',
      builder: 'Brigade Group',
      propertyType: 'apartment',
      category: 'ready-to-move',
      address: { locality: 'Rajajinagar', city: 'Bangalore' },
      priceRange: { min: 12000000, max: 28000000 },
      priceUnit: 'lac',
      configurations: ['2BHK', '3BHK'],
      featured: false,
      heroImage: 'https://placehold.co/800x600/1e3a8a/white?text=Brigade+Gateway',
    },
    {
      _id: '5',
      name: 'Godrej Eden Estate',
      slug: 'godrej-eden',
      builder: 'Godrej Properties',
      propertyType: 'villa',
      category: 'new-launch',
      address: { locality: 'Kanakapura Road', city: 'Bangalore' },
      priceRange: { min: 2, max: 5 },
      priceUnit: 'cr',
      configurations: ['3BHK', '4BHK'],
      featured: false,
      heroImage: 'https://placehold.co/800x600/0f172a/white?text=Godrej+Eden',
    },
    {
      _id: '6',
      name: 'Sobha Dream Acres',
      slug: 'sobha-dream-acres',
      builder: 'Sobha Limited',
      propertyType: 'apartment',
      category: 'under-construction',
      address: { locality: 'Panathur', city: 'Bangalore' },
      priceRange: { min: 6500000, max: 12000000 },
      priceUnit: 'lac',
      configurations: ['1BHK', '2BHK', '3BHK'],
      featured: false,
      heroImage: 'https://placehold.co/800x600/1e40af/white?text=Sobha+Dream',
    },
  ];

  const handleSearch = (filters) => {
    setSearchFilters(filters);
    const params = new URLSearchParams();
    if (filters.city) params.append('city', filters.city);
    if (filters.propertyType) params.append('type', filters.propertyType);
    if (filters.configuration) params.append('config', filters.configuration);
    navigate(`/properties?${params.toString()}`);
  };

  const stats = [
    { icon: Building2, value: '500+', label: 'Properties' },
    { icon: MapPin, value: '50+', label: 'Cities' },
    { icon: Users, value: '10,000+', label: 'Happy Customers' },
    { icon: Star, value: '4.8', label: 'Average Rating' },
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: 'Verified Properties',
      description: 'All our properties are thoroughly verified for legal compliance and quality standards.',
    },
    {
      icon: TrendingUp,
      title: 'Best Investment',
      description: 'Expert guidance to help you make informed decisions for maximum returns on investment.',
    },
    {
      icon: Users,
      title: 'Dedicated Support',
      description: 'Our team of experts is available 24/7 to assist you throughout your property journey.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroCarousel />

      {/* Search Bar Overlay */}
      <div className="relative z-20 px-4 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <SearchBar onSearch={handleSearch} variant="hero" />
        </motion.div>
      </div>

      {/* Featured Properties */}
      <section className="py-12 md:py-2 bg-gray-50">
        <FeaturedSection properties={featuredProperties} />
      </section>

      {/* Latest Properties Grid */}
      <section className="py-16 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp">
            <div className="text-center mb-12">
              <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">
                Explore
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                Latest Properties
              </h2>
              <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                Discover the newest additions to our portfolio, handpicked for their exceptional value and prime locations.
              </p>
            </div>
          </AnimatedSection>

          <PropertyGrid properties={latestProperties} columns={3} />

          <AnimatedSection animation="fadeInUp" delay={0.3}>
            <div className="text-center mt-10">
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-blue-800 text-blue-800 font-semibold rounded-xl hover:bg-blue-800 hover:text-white transition-all"
              >
                View All Properties
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-800 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <AnimatedSection key={stat.label} animation="fadeInUp" delay={index * 0.1}>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-amber-400" />
                    </div>
                    <p className="text-4xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-blue-200">{stat.label}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp">
            <div className="text-center mb-12">
              <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">
                Why Choose Us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                Your Trusted Property Partner
              </h2>
              <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                We combine technology with expertise to deliver exceptional property solutions tailored to your needs.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <AnimatedSection key={item.title} animation="fadeInUp" delay={index * 0.15}>
                  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-blue-800" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-amber-500" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection animation="fadeInUp">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Find Your Dream Home?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Let our experts help you navigate the property market. Get personalized recommendations and exclusive deals.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-all shadow-lg"
                >
                  Explore Properties
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default HomePage;