import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Building2, Loader2 } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext.jsx';
import { propertiesAPI, getFileUrl } from '../../services/api.js';

// Components
import HeroCarousel from '../../components/public/HeroCarousel.jsx';
import SearchBar from '../../components/public/SearchBar.jsx';
import PropertyGrid from '../../components/public/PropertyGrid.jsx';
import FeaturedSection from '../../components/public/FeaturedSection.jsx';
import WhyUsSection from '../../components/public/WhyUsSection.jsx';
import TestimonialsSection from '../../components/public/TestimonialsSection.jsx';
import FAQSection from '../../components/public/FAQSection.jsx';
import ContactSection from '../../components/public/ContactSection.jsx';
import AnimatedSection from '../../components/common/AnimatedSection.jsx';

const HomePage = () => {
  const navigate = useNavigate();
  const { content, loading: contentLoading } = useSiteContent();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [latestProperties, setLatestProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setPropertiesLoading(true);

      // Fetch featured properties
      const featuredRes = await propertiesAPI.getFeatured();
      setFeaturedProperties(featuredRes.data.data || []);

      // Fetch all properties (latest)
      const allRes = await propertiesAPI.getAll({ limit: 8, sort: '-createdAt' });
      setLatestProperties(allRes.data.data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setPropertiesLoading(false);
    }
  };

  const handleSearch = (filters) => {
    const params = new URLSearchParams();
    if (filters.city) params.append('city', filters.city);
    if (filters.propertyType) params.append('type', filters.propertyType);
    if (filters.configuration) params.append('config', filters.configuration);
    navigate(`/properties?${params.toString()}`);
  };

  if (contentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-slate-700" />
      </div>
    );
  }

  const cities = content?.cities?.filter(c => c.isActive) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroCarousel slides={content?.heroSlides || []} />

      {/* Search Bar Section */}
      <section className="py-6 md:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <SearchBar onSearch={handleSearch} variant="default" />
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us - Trust Indicators */}
      <WhyUsSection data={content?.whyUs} />

      {/* Featured Properties */}
      <FeaturedSection properties={featuredProperties} />

      {/* Popular Cities */}
      {cities.length > 0 && (
        <section id="cities" className="py-12 md:py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="fadeInUp">
              <div className="mb-10">
                <span className="text-amber-500 font-semibold text-sm uppercase tracking-wider">
                  Explore by Location
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">
                  Popular Cities
                </h2>
                <p className="text-slate-600 mt-3 max-w-xl">
                  Discover properties in the most sought-after cities across India.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cities.map((city, index) => (
                <AnimatedSection key={city._id || city.name} animation="fadeInUp" delay={index * 0.1}>
                  <Link
                    to={`/properties?city=${city.name}`}
                    className="block group"
                  >
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="relative rounded-2xl overflow-hidden bg-white shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-500"
                    >
                      <div className="relative h-40 overflow-hidden">
                        {city.image ? (
                          <img
                            src={getFileUrl(city.image)}
                            alt={city.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                            <MapPin className="w-12 h-12 text-slate-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <h3 className="text-lg font-bold text-white">{city.name}</h3>
                          {city.description && (
                            <p className="text-white/80 text-sm line-clamp-1">{city.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-slate-600 text-sm">{city.description || `Explore properties in ${city.name}`}</p>
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-800 transition-colors flex-shrink-0 ml-2">
                            <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection animation="fadeInUp" delay={0.4}>
              <div className="text-center mt-10">
                <motion.span whileHover={{ x: 4 }} className="inline-block">
                  <Link
                    to="/properties"
                    className="inline-flex items-center gap-2 text-slate-700 font-medium hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    View All Cities
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.span>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Latest Properties Grid */}
      <section id="latest" className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp">
            <div className="mb-10">
              <span className="text-amber-500 font-semibold text-sm uppercase tracking-wider">
                Just Listed
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">
                Latest Properties
              </h2>
              <p className="text-slate-600 mt-3 max-w-xl">
                Fresh listings added daily. Be the first to discover new opportunities.
              </p>
            </div>
          </AnimatedSection>

          {propertiesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-slate-700" />
            </div>
          ) : latestProperties.length > 0 ? (
            <PropertyGrid properties={latestProperties} columns={4} />
          ) : (
            <div className="text-center py-12 text-slate-500">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p>No properties available yet</p>
            </div>
          )}

          <AnimatedSection animation="fadeInUp" delay={0.3}>
            <div className="text-center mt-10">
              <motion.span whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="inline-block">
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-700 text-slate-700 font-semibold rounded-xl hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
                >
                  View All Properties
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials - Social Proof */}
      <TestimonialsSection testimonials={content?.testimonials || []} />

      {/* FAQ - Objection Handling */}
      <FAQSection faqs={content?.faqs || []} />

      {/* Contact Form - Final CTA */}
      <ContactSection contact={content?.contact} />
    </div>
  );
};

export default HomePage;