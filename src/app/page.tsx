'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { loadFull } from "tsparticles";
import { Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
import axios from 'axios';
import { 
  Menu, 
  X, 
  Brain, 
  Zap, 
  Twitter,
  Linkedin,
  Github,
  Mail,
  TrendingUp,
  Shield,
  Network,
  Code
} from 'lucide-react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  // Live market data state
  const [marketCap, setMarketCap] = useState(3250000000000); // $3.25T default
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Social buzz tracking state
  const [trendingTopics, setTrendingTopics] = useState([
    { topic: 'AI Infrastructure', sentiment: 'bullish', mentions: 1247, change: '+23%' },
    { topic: 'DeFi Protocols', sentiment: 'neutral', mentions: 892, change: '+5%' },
    { topic: 'Web3 Gaming', sentiment: 'bullish', mentions: 567, change: '+18%' },
    { topic: 'Layer 2 Scaling', sentiment: 'bullish', mentions: 445, change: '+12%' },
    { topic: 'NFT Market', sentiment: 'bearish', mentions: 234, change: '-8%' }
  ]);
  const [socialSentiment, setSocialSentiment] = useState({
    bullish: 65,
    neutral: 25,
    bearish: 10
  });
  const [totalMentions, setTotalMentions] = useState(3385);

  // Fetch live crypto market cap
  const fetchMarketCap = useCallback(async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/global');
      const totalMarketCap = response.data.data.total_market_cap.usd;
      setMarketCap(totalMarketCap);
      setLastUpdated(new Date());
    } catch (error) {
      console.log('Using fallback market cap data');
      // Fallback to a realistic estimate if API fails
      setMarketCap(3250000000000);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Simulate social buzz updates
  const updateSocialBuzz = useCallback(() => {
    const newTopics = trendingTopics.map(topic => ({
      ...topic,
      mentions: Math.floor(topic.mentions * (0.95 + Math.random() * 0.1)), // Random variation
      change: `${Math.random() > 0.5 ? '+' : '-'}${Math.floor(Math.random() * 30)}%`
    }));
    setTrendingTopics(newTopics);
    
    // Update total mentions
    const newTotal = newTopics.reduce((sum, topic) => sum + topic.mentions, 0);
    setTotalMentions(newTotal);
    
    // Update sentiment distribution
    setSocialSentiment({
      bullish: 60 + Math.floor(Math.random() * 20),
      neutral: 20 + Math.floor(Math.random() * 15),
      bearish: 10 + Math.floor(Math.random() * 10)
    });
  }, [trendingTopics]);

  // Fetch data on component mount and every 30 seconds
  useEffect(() => {
    fetchMarketCap();
    const marketInterval = setInterval(fetchMarketCap, 30000); // Update every 30 seconds
    return () => clearInterval(marketInterval);
  }, [fetchMarketCap]);

  // Update social buzz every 15 seconds
  useEffect(() => {
    const socialInterval = setInterval(updateSocialBuzz, 15000); // Update every 15 seconds
    return () => clearInterval(socialInterval);
  }, [updateSocialBuzz]);

  // Format market cap for display
  const formatMarketCap = (value: number) => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`;
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    }
    return `$${value.toLocaleString()}`;
  };

  // Parallax scroll effect
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardHover = {
    hover: { 
      y: -10, 
      scale: 1.02,
      transition: { duration: 0.3 }
    }
  };

  const buttonHover = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  // Particles initialization
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async () => {
    // console.log("Particles loaded");
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      alert('Thank you! Your message has been logged.');
      setIsContactModalOpen(false);
      setFormData({ name: '', email: '', company: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  // Scroll Animation Component
  const ScrollAnimation = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ duration: 0.6, delay }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-x-hidden relative">
      {/* Particle Background */}
      <div className="fixed inset-0 z-0">
                <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={{
              background: {
                color: {
                  value: "transparent",
                },
              },
              fpsLimit: 120,
              interactivity: {
                events: {
                  onClick: {
                    enable: true,
                    mode: "push",
                  },
                  onHover: {
                    enable: true,
                    mode: "repulse",
                  },
                },
                modes: {
                  push: {
                    quantity: 4,
                  },
                  repulse: {
                    distance: 200,
                    duration: 0.4,
                  },
                },
              },
              particles: {
                color: {
                  value: "#60a5fa",
                },
                links: {
                  color: "#60a5fa",
                  distance: 150,
                  enable: true,
                  opacity: 0.3,
                  width: 1,
                },
                move: {
                  direction: "none",
                  enable: true,
                  outModes: {
                    default: "bounce",
                  },
                  random: false,
                  speed: 1,
                  straight: false,
                },
                number: {
                  density: {
                    enable: true,
                  },
                  value: Math.min(Math.max(Math.floor(marketCap / 50000000000), 20), 200), // 1 particle per $50B, min 20, max 200
                },
                opacity: {
                  value: 0.5,
                },
                shape: {
                  type: "circle",
                },
                size: {
                  value: { min: 1, max: 3 },
                },
              },
              detectRetina: true,
            }}
        />
      </div>
      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Join the Signal</h3>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="your.email@company.com"
                />
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="Your company"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                  placeholder="Tell us about your interest in AI-native capital infrastructure..."
                />
              </div>
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <motion.div
                    className="flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Sending...
                  </motion.div>
                ) : (
                  "Send Message"
                )}
              </motion.button>
            </form>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-md border-b border-white/10 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-white">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Birdai
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
              <a href="#mission" className="text-gray-300 hover:text-white transition-colors">Mission</a>
              <a href="#team" className="text-gray-300 hover:text-white transition-colors">Team</a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/50 backdrop-blur-md rounded-lg mt-2">
                <a href="#home" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">Home</a>
                <a href="#mission" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">Mission</a>
                <a href="#team" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">Team</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        id="home" 
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <motion.div 
          className="max-w-7xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            variants={fadeInUp}
          >
            See What Others
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Miss
            </span>
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-gray-300 mb-4 font-mono"
            variants={fadeInUp}
          >
            Machine-native. Protocol-first. Liquidity-aware.
          </motion.p>
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            A structural shift is happening.
          </motion.p>
          <motion.button 
            onClick={() => setIsContactModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-4 px-8 rounded-full text-lg shadow-lg"
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
          >
            Join the Signal
          </motion.button>
        </motion.div>
      </motion.section>

      {/* Coding Capital Section */}
      <section id="mission" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <ScrollAnimation>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Coding Capital
              </h2>
            </ScrollAnimation>
            <ScrollAnimation delay={0.2}>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
                The fastest-growing asset class isn&apos;t just emerging—it&apos;s rewriting the rules. Are you inside the system, or watching it evolve from the outside?
              </p>
            </ScrollAnimation>
            <ScrollAnimation delay={0.4}>
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 max-w-2xl mx-auto"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                                  <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">
                    {isLoading ? (
                      <motion.div
                        className="flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Loading...
                      </motion.div>
                    ) : (
                      <motion.span
                        key={marketCap}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {formatMarketCap(marketCap)}
                      </motion.span>
                    )}
                  </p>
                                  <p className="text-gray-300">
                    Private markets growth from negligible size in 2013 to over {isLoading ? '...' : formatMarketCap(marketCap)} in 2025
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Live data • Updated {lastUpdated.toLocaleTimeString()}
                  </p>
              </motion.div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* AI Eats Data Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trained on data. Tuned for decisions
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              The old system filters signal through committees. Ours reads it in real time.
            </p>
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 max-w-2xl mx-auto">
              <p className="text-2xl font-bold text-red-400 mb-2">13%</p>
              <p className="text-gray-300">of VC funds return more than 2x DPI after 10 years</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Now Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Now: Birdai Is Built for This Moment
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="text-left">
                <p className="text-xl text-gray-300 mb-4">
                  Capital is becoming code. Balance sheets are turning into networks.
                </p>
                <p className="text-xl text-gray-300">
                  Signal is no longer human-limited. AI scales it, compounds it, and deploys it.
                </p>
              </div>
              <div className="text-left">
                <p className="text-xl text-gray-300 mb-4">
                  The last cycle rewarded early conviction in emerging infrastructure. Few were positioned to capture it.
                </p>
                <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 font-semibold">
                  This time it&apos;s bigger: AI-native capital infrastructure is here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 text-center">
            This Cycle Is Different
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Better Tooling</h3>
              <p className="text-gray-300">
                AI + on-chain infrastructure enables unprecedented deal discovery and execution.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl flex items-center justify-center mb-6"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <TrendingUp className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Proven Exits</h3>
              <p className="text-gray-300">
                Real founder demand with demonstrated liquidity events and regulatory momentum.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mb-6"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Code className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Fundamental Execution</h3>
              <p className="text-gray-300">
                Where legacy firms add headcount, we add code. Scalable, intelligent, and aligned from day one.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Buzz Tracking Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <ScrollAnimation>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
              Live Social Sentiment
            </h2>
          </ScrollAnimation>
          <ScrollAnimation delay={0.2}>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-12 text-center">
              Real-time buzz tracking across Reddit, Twitter, and crypto communities
            </p>
          </ScrollAnimation>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Sentiment Overview */}
            <ScrollAnimation delay={0.3}>
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-white mb-6">Market Sentiment</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-green-400">Bullish</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                        <motion.div 
                          className="bg-green-400 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${socialSentiment.bullish}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                      <span className="text-white font-semibold">{socialSentiment.bullish}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Neutral</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                        <motion.div 
                          className="bg-gray-400 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${socialSentiment.neutral}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                      <span className="text-white font-semibold">{socialSentiment.neutral}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-400">Bearish</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                        <motion.div 
                          className="bg-red-400 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${socialSentiment.bearish}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                      <span className="text-white font-semibold">{socialSentiment.bearish}%</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-2xl font-bold text-blue-400">{totalMentions.toLocaleString()}</p>
                  <p className="text-gray-400">Total Mentions (24h)</p>
                </div>
              </motion.div>
            </ScrollAnimation>

            {/* Trending Topics */}
            <ScrollAnimation delay={0.4}>
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-white mb-6">Trending Topics</h3>
                <div className="space-y-4">
                  {trendingTopics.map((topic, index) => (
                    <motion.div 
                      key={topic.topic}
                      className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div>
                        <p className="text-white font-semibold">{topic.topic}</p>
                        <p className="text-sm text-gray-400">{topic.mentions.toLocaleString()} mentions</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-semibold ${
                          topic.sentiment === 'bullish' ? 'text-green-400' : 
                          topic.sentiment === 'bearish' ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {topic.sentiment}
                        </span>
                        <p className={`text-sm ${
                          topic.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {topic.change}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Infrastructure for a Machine-Readable Market Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Infrastructure for a Machine-Readable Market
            </h2>

          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Meet the Team
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Kevin Farrelly */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">Kevin Farrelly</h3>
              <p className="text-gray-300 mb-4">
                Kevin is a repeat founder and investor at the intersection of machine learning, venture, and crypto. 
                He previously founded a machine learning credit fund acquired by Franklin Templeton in 2018, where 
                he subsequently launched and led Blockchain Venture Funds I and II, delivering top-decile DPI returns.
              </p>
              <p className="text-gray-300 mb-4">
                With over 15 years of hands-on experience scaling fintech and consumer companies—focusing on CAC 
                optimization, margin expansion, and data science—Kevin specializes in early-stage investing, token 
                economics, and ML infrastructure.
              </p>
              <p className="text-gray-400 text-sm">BSBA from the University of Richmond</p>
            </div>

            {/* Greg Scanlon */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">Greg Scanlon</h3>
              <p className="text-gray-300 mb-4">
                Greg is a seasoned investor and technologist operating at the intersection of blockchain, data science, 
                and institutional capital. He co-founded Franklin Templeton&apos;s Blockchain Venture Funds I and II, and 
                brings over 15 years of experience in investing and risk management from leading firms such as Citadel 
                and Orange Capital.
              </p>
              <p className="text-gray-300 mb-4">
                Greg is also an active mentor and advisor across multiple top universities.
              </p>
              <p className="text-gray-400 text-sm">BSBA from the University of Richmond, MS in Data Science from NYU, CFA charterholder</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="text-2xl font-bold text-white mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Birdai
                </span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Machine-native. Protocol-first. Liquidity-aware. See what others miss.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <Github className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <Mail className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Signal</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Score</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Structure</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Allocate</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Team</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Deals</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Birdai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
