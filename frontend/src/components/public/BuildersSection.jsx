import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Loader2 } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext.jsx';
import AnimatedSection from '../common/AnimatedSection.jsx';
import { getFileUrl } from '../../services/api.js';

const BuildersSection = () => {
  const { content, loading: contentLoading } = useSiteContent();
  const builders = content?.featuredBuilders || [];

  if (contentLoading) {
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-700" />
          </div>
        </div>
      </section>
    );
  }

  if (builders.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fadeInUp">
          <div className="text-center mb-10">
            <span className="text-amber-500 font-semibold text-sm uppercase tracking-wider">
              Trusted Developers
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">
              Properties by Builders
            </h2>
            <p className="text-slate-600 mt-3 max-w-xl mx-auto">
              Explore properties from renowned builders and developers.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {builders.map((builder, index) => (
            <AnimatedSection key={builder.name} animation="fadeInUp" delay={index * 0.1}>
              <Link
                to={`/properties?builder=${encodeURIComponent(builder.name)}`}
                className="block group cursor-pointer"
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="relative rounded-2xl overflow-hidden bg-white shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-500"
                >
                  {/* Logo or Placeholder */}
                  <div className="relative h-40 overflow-hidden">
                    {builder.logo ? (
                      <img
                        src={getFileUrl(builder.logo)}
                        alt={builder.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <Building2 className="w-12 h-12 text-slate-400" />
                      </div>
                    )}
                  </div>
                  {/* Text */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-slate-800">{builder.name}</h3>
                  </div>
                </motion.div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuildersSection;