import { motion } from 'framer-motion';
import { Landmark, Percent, Clock, FileCheck, ArrowRight } from 'lucide-react';
import AnimatedSection from '../../common/AnimatedSection.jsx';
import { useEnquiry } from '../../../context/EnquiryContext.jsx';

const HomeLoanSection = () => {
  const { openModal } = useEnquiry();

  const benefits = [
    {
      icon: Percent,
      title: 'Low Interest Rates',
      description: 'Competitive rates from top banks'
    },
    {
      icon: Clock,
      title: 'Quick Approval',
      description: 'Fast processing with minimal wait'
    },
    {
      icon: FileCheck,
      title: 'Easy Documentation',
      description: 'Hassle-free process with digital verification'
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <AnimatedSection animation="fadeInUp">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-400 font-semibold text-sm mb-6">
                <Landmark className="w-4 h-4" />
                Home Loan Assistance
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Looking for a <span className="text-amber-400">Home Loan</span>?
              </h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                We'll help you find the best home loan deals from leading banks.
                Get assistance with eligibility check and loan approval process.
              </p>
            </div>
          </AnimatedSection>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Benefits */}
          <AnimatedSection animation="fadeInUp">
            <div className="space-y-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
                      <p className="text-slate-400 text-sm">{benefit.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedSection>

          {/* Right - CTA Card */}
          <AnimatedSection animation="fadeInUp" delay={0.2}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Need Home Loan Assistance?</h3>
                <p className="text-slate-400">Our experts will help you get the best deal</p>
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openModal('home-loan')}
                className="w-full py-4 px-6 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 font-bold text-lg rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:from-amber-500 hover:to-amber-700 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                Get Loan Assistance
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <p className="text-center text-slate-400 text-sm mt-4">
                Free consultation • No hidden charges
              </p>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default HomeLoanSection;