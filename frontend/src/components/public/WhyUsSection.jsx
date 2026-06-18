import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, CheckCircle, Award, Clock, Users, Building2, Home, MapPin, Phone, Mail, Star, TrendingUp } from 'lucide-react';

const iconMap = {
  CheckCircle,
  Shield,
  Award,
  Clock,
  Users,
  Building2,
  Home,
  MapPin,
  Phone,
  Mail,
  Star,
  TrendingUp,
};

// Animated Counter Component
const AnimatedCounter = ({ value, inView, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  // Parse the value to extract number and suffix
  const parseValue = (val) => {
    const match = val.match(/^([\d.]+)([%+]?)$/);
    if (match) {
      return {
        number: parseFloat(match[1]),
        suffix: match[2] || '',
        hasDecimal: val.includes('.')
      };
    }
    return { number: 0, suffix: '', hasDecimal: false };
  };

  const { number, suffix, hasDecimal } = parseValue(value);

  useEffect(() => {
    if (!inView) {
      setCount(0);
      return;
    }

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease out function for smoother animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = number * easeOut;

      setCount(hasDecimal ? currentCount.toFixed(1) : Math.floor(currentCount));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [inView, number, duration, hasDecimal]);

  return (
    <span>
      {hasDecimal ? count : count}{suffix}
    </span>
  );
};

const defaultFeatures = [
  {
    icon: 'CheckCircle',
    title: 'RERA Verified',
    description: 'All properties are RERA registered with verified documentation for your peace of mind.',
  },
  {
    icon: 'Shield',
    title: 'Real Photos Only',
    description: 'What you see is what you get. No stock images or misleading photos on our platform.',
  },
  {
    icon: 'Award',
    title: 'Direct Builder Price',
    description: 'No middlemen or brokers. Get the best prices directly from developers.',
  },
  {
    icon: 'Clock',
    title: 'Transparent Pricing',
    description: 'All costs clearly mentioned upfront. No hidden charges or surprise fees.',
  },
];

const defaultStats = [
  { value: '98%', label: 'Customer Satisfaction' },
  { value: '500+', label: 'Properties Sold' },
  { value: '50+', label: 'Cities Covered' },
  { value: '4.8', label: 'Average Rating' },
];

const WhyUsSection = ({ data }) => {
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: '-100px' });

  const sectionTitle = data?.sectionTitle || 'Your Trusted Property Partner';
  const sectionSubtitle = data?.sectionSubtitle || 'We combine technology with expertise to deliver exceptional property solutions tailored to your needs.';
  const features = data?.features?.length > 0 ? data.features : defaultFeatures;
  const stats = data?.stats?.length > 0 ? data.stats : defaultStats;

  return (
    <section id="why-us" className="py-12 md:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-amber-500 font-semibold text-sm uppercase tracking-wider">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">
            {sectionTitle}
          </h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            {sectionSubtitle}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || CheckCircle;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-2xl shadow-md shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300 cursor-default"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                  className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-4"
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 pt-10 border-t border-slate-200"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold text-slate-800">
                  <AnimatedCounter value={stat.value} inView={isStatsInView} />
                </p>
                <p className="text-slate-500 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyUsSection;