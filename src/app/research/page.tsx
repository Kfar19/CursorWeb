'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// ScrollAnimation component for consistent animations
const ScrollAnimation = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation Header */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-md border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Back to Home */}
            <Link href="/" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>
            
            {/* Logo */}
            <div className="text-2xl font-bold text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Birdai
              </span>
            </div>
            
            {/* Contact Button */}
            <Link 
              href="/#contact"
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-full text-sm shadow-lg transition-all duration-300"
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <ScrollAnimation>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Research & Insights
              </h1>
            </ScrollAnimation>
            <ScrollAnimation delay={0.2}>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
                Cutting-edge research at the intersection of AI, blockchain, and venture capital. 
                We analyze market trends, emerging technologies, and investment patterns to identify tomorrow&apos;s unicorns today.
              </p>
            </ScrollAnimation>
          </div>

          {/* Research Areas Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {/* AI-Driven Deal Flow */}
            <ScrollAnimation delay={0.3}>
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 h-full"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-blue-400 mb-4">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">AI-Driven Deal Flow</h3>
                <p className="text-gray-300 mb-4">
                  Our proprietary algorithms analyze millions of data points across startup ecosystems, 
                  social sentiment, and market indicators to identify high-potential investments before they hit mainstream radar.
                </p>
                <div className="text-sm text-blue-400 font-semibold">
                  95% accuracy in predicting Series A success
                </div>
              </motion.div>
            </ScrollAnimation>

            {/* Blockchain Intelligence */}
            <ScrollAnimation delay={0.4}>
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 h-full"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-cyan-400 mb-4">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Blockchain Intelligence</h3>
                <p className="text-gray-300 mb-4">
                  Deep dive analysis into DeFi protocols, NFT markets, and Web3 infrastructure. 
                  We track on-chain metrics, developer activity, and community growth to spot the next breakthrough.
                </p>
                <div className="text-sm text-cyan-400 font-semibold">
                  Tracking 500+ protocols daily
                </div>
              </motion.div>
            </ScrollAnimation>

            {/* Market Intelligence */}
            <ScrollAnimation delay={0.5}>
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 h-full"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-green-400 mb-4">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Market Intelligence</h3>
                <p className="text-gray-300 mb-4">
                  Comprehensive analysis of funding rounds, valuations, and exit patterns. 
                  Our research identifies emerging sectors and investment themes before they become crowded.
                </p>
                <div className="text-sm text-green-400 font-semibold">
                  $2.3T+ in deals analyzed
                </div>
              </motion.div>
            </ScrollAnimation>
          </div>

          {/* Latest Research Publications */}
          <ScrollAnimation delay={0.6}>
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-white mb-12 text-center">Latest Research</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div 
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    <span className="text-gray-400 text-sm">December 2024</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">
                    The AI Infrastructure Investment Thesis: Why Developer Tools Will Define the Next Decade
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    An in-depth analysis of the AI tooling ecosystem and why infrastructure plays will outperform application layers in the coming years.
                  </p>
                  <motion.button 
                    className="text-blue-400 hover:text-blue-300 text-sm font-semibold"
                    whileHover={{ x: 5 }}
                  >
                    Read More →
                  </motion.button>
                </motion.div>

                <motion.div 
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                    <span className="text-gray-400 text-sm">November 2024</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">
                    DeFi 3.0: The Evolution from Speculation to Utility
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    How the next generation of decentralized finance protocols are solving real-world problems and creating sustainable value.
                  </p>
                  <motion.button 
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold"
                    whileHover={{ x: 5 }}
                  >
                    Read More →
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </ScrollAnimation>

          {/* Research Methodology */}
          <ScrollAnimation delay={0.7}>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Our Research Methodology</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Data Collection</h3>
                  <p className="text-gray-300 text-sm">
                    Aggregate data from 500+ sources including social media, news, financial reports, and on-chain analytics
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">AI Analysis</h3>
                  <p className="text-gray-300 text-sm">
                    Apply machine learning models to identify patterns, sentiment, and predictive signals across datasets
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Expert Validation</h3>
                  <p className="text-gray-300 text-sm">
                    Combine AI insights with human expertise to validate findings and generate actionable intelligence
                  </p>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </main>
    </div>
  );
}