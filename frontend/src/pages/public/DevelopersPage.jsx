import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Building2, LayoutTemplate, Sparkles, Users, BarChart3, Palette,
  Search, Smartphone, Zap, Shield, CheckCircle, ArrowRight,
  Clock, Headphones, BookOpen,
  MessageCircle, Phone, Mail, Star, ChevronDown,
  Home, Handshake, Megaphone, MapPin, TrendingUp
} from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext.jsx';
import { useEnquiry } from '../../context/EnquiryContext.jsx';
import AnimatedSection from '../../components/common/AnimatedSection.jsx';

// Animated counter component
const AnimatedCounter = ({ value, suffix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  // Extract numeric value
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
  const prefix = value.match(/^[^0-9]*/)[0] || '';

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const stepValue = numericValue / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += stepValue;
        if (current >= numericValue) {
          setDisplayValue(numericValue);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, numericValue]);

  return <span ref={ref}>{prefix}{displayValue.toLocaleString()}{suffix}</span>;
};

// Animated progress bar
const AnimatedProgress = ({ width, delay = 0, color = 'bg-amber-500' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
      <motion.div
        className={`h-2 rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={isInView ? { width } : { width: 0 }}
        transition={{ duration: 1, delay, ease: 'easeOut' }}
      />
    </div>
  );
};

const DevelopersPage = () => {
  const { content } = useSiteContent();
  const { openModal } = useEnquiry();
  const [openFaq, setOpenFaq] = useState(null);
  const branding = content?.branding || {};
  const siteName = content?.seo?.siteName || 'PropDeal';

  const benefits = [
    'Unlimited property landing pages',
    'AI-enhanced property content',
    'Real-time lead notifications',
    'Lead distribution to your team',
    'Detailed performance reports',
    'Brand visibility & marketing support',
    'WhatsApp integration & support',
    'Regional partnership opportunities',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, -30, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="fadeInUp">
              <div>
                <motion.span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-400 font-semibold text-sm mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <TrendingUp className="w-4 h-4" />
                  Your Real Estate Growth Partner
                </motion.span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Advertise. Partner. <span className="text-amber-400">Grow.</span>
                </h1>
                <p className="text-lg text-slate-300 mb-8 max-w-xl">
                  We help real estate developers, channel partners, and agents showcase their properties through dedicated landing pages, lead management, and partnership-driven marketing support.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    onClick={() => openModal('advertise-project')}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 hover:scale-105 active:scale-100 active:shadow-md transition-all duration-300 cursor-pointer relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-amber-300 to-amber-500"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      style={{ opacity: 0.3 }}
                    />
                    <Megaphone className="w-5 h-5 relative" />
                    <span className="relative">Advertise Your Project</span>
                  </motion.button>
                  <motion.button
                    onClick={() => openModal('partner-with-us')}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 hover:scale-105 active:scale-100 active:bg-white/30 transition-all duration-300 border border-white/20 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Handshake className="w-5 h-5" />
                    Partner With Us
                  </motion.button>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeInUp" delay={0.2}>
              <div className="relative">
                <motion.div
                  className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <div className="bg-slate-800 rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs text-slate-400 ml-2">Performance Snapshot</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div
                        className="bg-slate-700/50 rounded-xl p-3"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="text-2xl font-bold text-amber-400">
                          <AnimatedCounter value="10" suffix="K+" />
                        </div>
                        <div className="text-xs text-slate-400">Leads Captured</div>
                      </motion.div>
                      <motion.div
                        className="bg-slate-700/50 rounded-xl p-3"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="text-2xl font-bold text-green-400">High</div>
                        <div className="text-xs text-slate-400">Conversion</div>
                      </motion.div>
                      <motion.div
                        className="bg-slate-700/50 rounded-xl p-3"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="text-2xl font-bold text-blue-400">
                          <AnimatedCounter value="2" suffix=" hrs" />
                        </div>
                        <div className="text-xs text-slate-400">Response Time</div>
                      </motion.div>
                      <motion.div
                        className="bg-slate-700/50 rounded-xl p-3"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="text-2xl font-bold text-purple-400">
                          <AnimatedCounter value="23" suffix="%" />
                        </div>
                        <div className="text-xs text-slate-400">Conversion Rate</div>
                      </motion.div>
                    </div>
                  </div>
                  {/* Lead Funnel Progress */}
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-slate-400">Lead Funnel</span>
                      <span className="text-xs text-green-400 font-medium">60% Conversion</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-300 w-16">New</span>
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-blue-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.5, delay: 0.2 }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 w-8">100</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-300 w-16">Contacted</span>
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-amber-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: '75%' }}
                            transition={{ duration: 1.5, delay: 0.4 }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 w-8">75</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-300 w-16">Visited</span>
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-purple-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: '45%' }}
                            transition={{ duration: 1.5, delay: 0.6 }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 w-8">45</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-300 w-16">Closed</span>
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-green-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: '60%' }}
                            transition={{ duration: 1.5, delay: 0.8 }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 w-8">60</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Who Are You Section */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Who Are You?
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Choose your journey to get started
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Buyer Card */}
            <AnimatedSection animation="fadeInUp" delay={0.1}>
              <Link to="/discover" className="block h-full">
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 h-full hover:shadow-xl hover:border-amber-200 transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Home className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-amber-600 transition-colors">
                    Buyer
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Browse verified properties and connect with developers to find your dream home.
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 font-semibold">
                    <span>Explore Properties</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              </Link>
            </AnimatedSection>

            {/* Developer Card */}
            <AnimatedSection animation="fadeInUp" delay={0.2}>
              <motion.button
                onClick={() => openModal('advertise-project')}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 h-full hover:shadow-xl hover:border-amber-200 transition-all duration-300 group cursor-pointer w-full text-left"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-amber-600 transition-colors">
                  Developer
                </h3>
                <p className="text-slate-600 mb-6">
                  Advertise your projects and connect with interested buyers through our marketing solutions.
                </p>
                <div className="flex items-center gap-2 text-amber-600 font-semibold">
                  <span>Advertise Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            </AnimatedSection>

            {/* Partner Card */}
            <AnimatedSection animation="fadeInUp" delay={0.3}>
              <motion.button
                onClick={() => openModal('partner-with-us')}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 h-full hover:shadow-xl hover:border-amber-200 transition-all duration-300 group cursor-pointer w-full text-left"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Handshake className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-amber-600 transition-colors">
                  Channel Partner / Agent
                </h3>
                <p className="text-slate-600 mb-6">
                  Partner with us to expand your reach and grow your real estate business.
                </p>
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <span>Partner With Us</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500', suffix: '+', label: 'Properties Marketed' },
              { value: '50', suffix: 'K+', label: 'Leads Generated' },
              { value: '100', suffix: '+', label: 'Partner Network' },
              { value: '98', suffix: '%', label: 'Client Satisfaction' },
            ].map((stat, index) => (
              <AnimatedSection key={index} animation="fadeInUp" delay={index * 0.1}>
                <motion.div
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-slate-500">{stat.label}</div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp">
            <div className="text-center mb-16">
              <span className="text-amber-500 font-semibold text-sm uppercase tracking-wider">
                What We Offer
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2 mb-4">
                Comprehensive Solutions for Real Estate Growth
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Whether you're a developer promoting projects or a channel partner looking to expand your business, PropDeal provides dedicated solutions to help you succeed.
              </p>
            </div>
          </AnimatedSection>

          {/* Advertise With Us */}
          <div className="mb-16">
            <AnimatedSection animation="fadeInUp">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                  <Megaphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">Advertise Your Projects</h3>
                  <p className="text-slate-500">For Developers</p>
                </div>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: LayoutTemplate,
                  title: 'Professional Landing Pages',
                  description: 'We create stunning property landing pages that showcase every detail and are optimized for conversions.',
                },
                {
                  icon: Sparkles,
                  title: 'AI-Enhanced Content',
                  description: 'Our team creates compelling property descriptions, highlights, and investment insights that resonate with buyers.',
                },
                {
                  icon: Users,
                  title: 'Lead Capture & Management',
                  description: 'We capture, organize, and manage buyer enquiries with a system designed for real estate sales workflows.',
                },
                {
                  icon: BarChart3,
                  title: 'Property Performance Reports',
                  description: 'Receive detailed reports on page views, buyer engagement, and enquiry metrics for your properties.',
                },
                {
                  icon: Palette,
                  title: 'Your Brand, Your Property, Your Identity',
                  description: 'We incorporate your logo, colors, and branding to maintain a consistent professional presence.',
                },
                {
                  icon: Smartphone,
                  title: 'Seamless Mobile Experience',
                  description: 'All our landing pages are optimized for every device, ensuring your properties look great everywhere.',
                },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <AnimatedSection key={index} animation="fadeInUp" delay={index * 0.1}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 h-full hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-200 transition-all duration-300 group"
                    >
                      <motion.div
                        className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center mb-4"
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-amber-600 transition-colors">{feature.title}</h3>
                      <p className="text-slate-600">{feature.description}</p>
                    </motion.div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>

          {/* Partner With Us */}
          <div>
            <AnimatedSection animation="fadeInUp">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                  <Handshake className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">Become a Business Partner</h3>
                  <p className="text-slate-500">For Channel Partners & Agents</p>
                </div>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: MapPin,
                  title: 'Regional Partnership',
                  description: 'Exclusive opportunities to represent PropDeal in your city or region.',
                },
                {
                  icon: Users,
                  title: 'Lead Sharing',
                  description: 'Access quality leads through our established network and distribution system.',
                },
                {
                  icon: TrendingUp,
                  title: 'Growth Resources',
                  description: 'Marketing tools, training, and resources to help you succeed.',
                },
                {
                  icon: Shield,
                  title: 'Dedicated Onboarding',
                  description: 'Personalized setup and ongoing support for all our partners.',
                },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <AnimatedSection key={index} animation="fadeInUp" delay={index * 0.1}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 h-full hover:shadow-xl hover:shadow-green-500/10 hover:border-green-200 transition-all duration-300 group"
                    >
                      <motion.div
                        className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mb-4"
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-green-600 transition-colors">{feature.title}</h3>
                      <p className="text-slate-600">{feature.description}</p>
                    </motion.div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Regional Partnership Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 relative overflow-hidden">
              <motion.div
                className="absolute inset-0"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                style={{
                  backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)',
                }}
              />
              <div className="relative grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-400 font-semibold text-sm mb-6">
                    <MapPin className="w-4 h-4" />
                    Regional Partnership
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Become Our Regional Partner
                  </h2>
                  <p className="text-slate-300 mb-6">
                    Expand your real estate business by representing PropDeal in your city. Get exclusive rights, marketing support, and dedicated training.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      'Exclusive regional opportunities',
                      'Marketing & branding support',
                      'Lead sharing & distribution',
                      'Dedicated onboarding & training',
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 text-white"
                      >
                        <CheckCircle className="w-5 h-5 text-amber-400" />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                  <motion.button
                    onClick={() => openModal('regional-partnership')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 hover:scale-105 active:scale-100 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Apply for Regional Partnership
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { city: 'Nashik', status: 'Available' },
                    { city: 'Pune', status: 'Available' },
                    { city: 'Mumbai', status: 'Limited' },
                    { city: 'Nagpur', status: 'Available' },
                    { city: 'Aurangabad', status: 'Available' },
                    { city: 'More Cities', status: 'Contact Us' },
                  ].map((location, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 hover:border-amber-400/50 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-white">{location.city}</span>
                      </div>
                      <span className={`text-sm ${location.status === 'Available' ? 'text-green-400' : location.status === 'Limited' ? 'text-amber-400' : 'text-slate-400'}`}>
                        {location.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 right-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="fadeInUp">
              <div>
                <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">
                  Why Partner With Us
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-6">
                  Built for Real Estate Success
                </h2>
                <p className="text-slate-300 mb-8">
                  We've created a dedicated real estate marketing service designed for developers, channel partners, and property professionals to showcase properties, manage enquiries, and grow their business.
                </p>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                      </motion.div>
                      <span className="text-white">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeInUp" delay={0.2}>
              <motion.div
                className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 relative overflow-hidden"
                whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                <h3 className="text-2xl font-bold text-white mb-6 relative">The Advantage</h3>
                <div className="space-y-4 relative">
                  {[
                    { label: 'Time to Market', value: 'Hours vs Weeks' },
                    { label: 'Marketing Cost', value: 'Significantly Reduced' },
                    { label: 'Lead Management', value: 'Integrated System' },
                    { label: 'Performance Insights', value: 'Detailed Reports' },
                    { label: 'Content Creation', value: 'AI-Assisted' },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-white/10 last:border-0 gap-1 sm:gap-0"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="text-slate-300 text-sm sm:text-base">{item.label}</span>
                      <span className="text-amber-400 font-semibold text-sm sm:text-base">{item.value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section id="analytics" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="fadeInUp">
              <div className="bg-slate-100 rounded-3xl p-8">
                <motion.div
                  className="bg-white rounded-2xl shadow-xl p-6"
                  whileHover={{ shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <BarChart3 className="w-5 h-5 text-amber-600" />
                    </motion.div>
                    <div>
                      <h4 className="font-bold text-slate-800">Performance Reports</h4>
                      <p className="text-sm text-slate-500">Detailed insights</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Page Views</span>
                      <motion.span className="font-bold text-slate-800">
                        <AnimatedCounter value="12847" />
                      </motion.span>
                    </div>
                    <AnimatedProgress width="75%" delay={0.2} color="bg-amber-500" />
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Lead Conversions</span>
                      <span className="font-bold text-green-600">34%</span>
                    </div>
                    <AnimatedProgress width="34%" delay={0.4} color="bg-green-500" />
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">CTA Click Rate</span>
                      <span className="font-bold text-blue-600">28%</span>
                    </div>
                    <AnimatedProgress width="28%" delay={0.6} color="bg-blue-500" />
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeInUp" delay={0.2}>
              <div>
                <span className="text-amber-500 font-semibold text-sm uppercase tracking-wider">
                  Data-Driven Insights
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2 mb-4">
                  Track Your Property Performance
                </h2>
                <p className="text-slate-600 mb-6">
                  We provide detailed performance reports so you can make informed decisions. Track engagement, monitor enquiry sources, and measure results across all your properties.
                </p>
                <ul className="space-y-4">
                  {[
                    { icon: Search, text: 'Detailed source attribution' },
                    { icon: Zap, text: 'Instant lead notifications' },
                    { icon: Shield, text: 'Secure data management' },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <motion.div
                          className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Icon className="w-4 h-4 text-amber-600" />
                        </motion.div>
                        <span className="text-slate-700">{item.text}</span>
                      </motion.div>
                    );
                  })}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-amber-600 relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fadeInUp">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Grow Your Real Estate Business?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Join developers, channel partners, and real estate professionals who trust us to market their properties and grow their business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => openModal('advertise-project')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-amber-600 font-bold rounded-xl hover:bg-slate-100 hover:scale-105 active:scale-100 active:bg-slate-200 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Megaphone className="w-5 h-5" />
                Advertise Your Project
              </motion.button>
              <motion.button
                onClick={() => openModal('partner-with-us')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 hover:scale-105 active:scale-100 active:bg-white/40 transition-all duration-300 border border-white/30 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Handshake className="w-5 h-5" />
                Partner With Us
              </motion.button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp">
            <div className="text-center mb-12">
              <span className="text-amber-500 font-semibold text-sm uppercase tracking-wider">
                FAQ
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">
                Frequently Asked Questions
              </h2>
            </div>
          </AnimatedSection>

          {/* For Developers */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-500" />
              For Developers
            </h3>
            <div className="space-y-4">
              {[
                {
                  q: 'How can I advertise my project?',
                  a: 'Simply click "Advertise Your Project" and fill out the enquiry form. Our team will contact you to understand your project and create a professional landing page.',
                },
                {
                  q: 'What is included in the landing page?',
                  a: 'We create stunning property landing pages with AI-enhanced content, professional images, lead capture forms, and complete branding customization.',
                },
                {
                  q: 'How do I receive leads?',
                  a: 'Leads are captured through your property landing pages and can be distributed to your sales team in real-time. You also get access to our dashboard to track and manage all leads.',
                },
                {
                  q: 'Can I advertise multiple projects?',
                  a: 'Yes! There is no limit. You can advertise your entire property portfolio, and we will create dedicated landing pages for each project.',
                },
              ].map((faq, index) => (
                <AnimatedSection key={index} animation="fadeInUp" delay={index * 0.1}>
                  <motion.div
                    className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
                    whileHover={{ shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === `dev-${index}` ? null : `dev-${index}`)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <h3 className="font-bold text-slate-800 pr-4">{faq.q}</h3>
                      <motion.div
                        animate={{ rotate: openFaq === `dev-${index}` ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                      </motion.div>
                    </button>
                    {openFaq === `dev-${index}` && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-slate-600">{faq.a}</p>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {/* For Partners */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Handshake className="w-5 h-5 text-green-500" />
              For Partners (Channel Partners & Agents)
            </h3>
            <div className="space-y-4">
              {[
                {
                  q: 'How can I become a channel partner?',
                  a: 'Click "Partner With Us" and share your details. Our team will reach out to discuss partnership opportunities and onboarding process.',
                },
                {
                  q: 'How does the partnership model work?',
                  a: 'We offer different partnership models including lead sharing, regional representation, and referral programs. Each is designed to help you grow your real estate business.',
                },
                {
                  q: 'How are leads shared with partners?',
                  a: 'Leads are distributed based on your partnership level and region. You get access to quality leads through our established network and distribution system.',
                },
                {
                  q: 'Can I partner for multiple regions?',
                  a: 'Yes, depending on availability and your partnership level. Contact us to discuss regional partnership opportunities in your areas of interest.',
                },
              ].map((faq, index) => (
                <AnimatedSection key={index} animation="fadeInUp" delay={index * 0.1}>
                  <motion.div
                    className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
                    whileHover={{ shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === `partner-${index}` ? null : `partner-${index}`)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <h3 className="font-bold text-slate-800 pr-4">{faq.q}</h3>
                      <motion.div
                        animate={{ rotate: openFaq === `partner-${index}` ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                      </motion.div>
                    </button>
                    {openFaq === `partner-${index}` && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-slate-600">{faq.a}</p>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {/* For Buyers */}
          <div>
            <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-500" />
              For Buyers
            </h3>
            <div className="space-y-4">
              {[
                {
                  q: 'How do I explore properties?',
                  a: 'Click "Explore Properties" to browse our verified property listings. You can filter by location, budget, and property type.',
                },
                {
                  q: 'Are the properties verified?',
                  a: 'Yes, all properties on our platform are listed by verified developers and partners. We ensure quality and authenticity.',
                },
              ].map((faq, index) => (
                <AnimatedSection key={index} animation="fadeInUp" delay={index * 0.1}>
                  <motion.div
                    className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
                    whileHover={{ shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === `buyer-${index}` ? null : `buyer-${index}`)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <h3 className="font-bold text-slate-800 pr-4">{faq.q}</h3>
                      <motion.div
                        animate={{ rotate: openFaq === `buyer-${index}` ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                      </motion.div>
                    </button>
                    {openFaq === `buyer-${index}` && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-slate-600">{faq.a}</p>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp">
            <div className="text-center mb-16">
              <span className="text-amber-500 font-semibold text-sm uppercase tracking-wider">
                Testimonials
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2 mb-4">
                Trusted by Real Estate Professionals
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                See what developers, channel partners, and agents are saying about working with us.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Rajesh Kumar',
                role: 'Developer, Kumar Builders',
                content: 'Working with them transformed how we market our properties. The quality of leads improved significantly, and our conversion rates are up 40%.',
                rating: 5,
              },
              {
                name: 'Priya Sharma',
                role: 'Channel Partner, Sharma Properties',
                content: 'Partnering with PropDeal has expanded my reach significantly. The lead sharing system is excellent and the support team is always responsive.',
                rating: 5,
              },
              {
                name: 'Amit Patel',
                role: 'Real Estate Agent, Patel Associates',
                content: 'A professional team that understands real estate. The regional partnership program helped me grow my business in new markets.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <AnimatedSection key={index} animation="fadeInUp" delay={index * 0.1}>
                <motion.div
                  className="bg-slate-50 rounded-2xl p-6 h-full hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-slate-600 mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                    >
                      <span className="text-slate-600 font-bold text-lg">
                        {testimonial.name.charAt(0)}
                      </span>
                    </motion.div>
                    <div>
                      <p className="font-bold text-slate-800">{testimonial.name}</p>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp">
            <div className="text-center mb-16">
              <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">
                Support
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
                Dedicated Support for Your Success
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                We're committed to helping you succeed with dedicated support, training, and resources.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Headphones,
                title: 'Dedicated Support',
                description: 'Our team is always available to assist you with any questions or guidance you need.',
              },
              {
                icon: BookOpen,
                title: 'Guidance & Resources',
                description: 'We provide detailed guides and best practices to help you maximize your results.',
              },
              {
                icon: Clock,
                title: 'Quick Onboarding',
                description: 'Get started quickly with our guided setup and personalized training for your team.',
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <AnimatedSection key={index} animation="fadeInUp" delay={index * 0.1}>
                  <motion.div
                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 group"
                    whileHover={{ y: -5 }}
                  >
                    <motion.div
                      className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className="w-7 h-7 text-amber-400" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">{item.title}</h3>
                    <p className="text-slate-400">{item.description}</p>
                  </motion.div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section id="contact" className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fadeInUp">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Let's Discuss Your Real Estate Goals
            </h2>
            <p className="text-slate-600 mb-8">
              Whether you want to advertise your project or explore partnership opportunities, our team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => openModal('developer-contact')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl hover:bg-slate-100 hover:scale-105 active:scale-100 active:bg-slate-200 transition-all duration-300 border border-slate-200 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Phone className="w-5 h-5" />
                Contact Us
              </motion.button>
              <motion.a
                href="mailto:hello@propdeal.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl hover:bg-slate-100 hover:scale-105 active:scale-100 active:bg-slate-200 transition-all duration-300 border border-slate-200 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Mail className="w-5 h-5" />
                hello@propdeal.com
              </motion.a>
              <motion.a
                href="https://wa.me/919175745760"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 hover:scale-105 active:scale-100 active:bg-green-700 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us
              </motion.a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Custom Footer for Developers Page */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src="/propdeal_logo.png"
                  alt="PropDeal"
                  className="h-14 object-contain rounded-xl"
                />
              </Link>
              <p className="text-sm text-slate-400">
                Helping developers, channel partners, and real estate professionals market properties, manage enquiries, and grow their business.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['Features', 'Benefits', 'Analytics', 'Testimonials', 'FAQ'].map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer relative group"
                    >
                      <span>{link}</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* For You */}
            <div>
              <h4 className="text-white font-semibold mb-4">For You</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/discover" className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer relative group">
                    <span>Buy Properties</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
                <li>
                  <motion.button
                    onClick={() => openModal('advertise-project')}
                    className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer relative group"
                  >
                    <span>Advertise Project</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    onClick={() => openModal('partner-with-us')}
                    className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer relative group"
                  >
                    <span>Partner With Us</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                  </motion.button>
                </li>
                <li>
                  <a href="#support" className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer relative group">
                    <span>Support</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <motion.div whileHover={{ rotate: 15 }}>
                    <Phone className="w-5 h-5 text-amber-500" />
                  </motion.div>
                  <a href="tel:+919876543210" className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer">
                    +91 98765 43210
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <motion.div whileHover={{ rotate: 15 }}>
                    <Mail className="w-5 h-5 text-amber-500" />
                  </motion.div>
                  <a href="mailto:hello@propdeal.com" className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer">
                    hello@propdeal.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
              <p className="text-sm text-slate-500">
                © {new Date().getFullYear()} {siteName}. All rights reserved.
              </p>
              <div className="flex space-x-4 text-sm">
                <Link to="/privacy-policy" className="text-slate-500 hover:text-white transition-colors relative group">
                  <span>Privacy Policy</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link to="/terms-of-service" className="text-slate-500 hover:text-white transition-colors relative group">
                  <span>Terms of Service</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DevelopersPage;
