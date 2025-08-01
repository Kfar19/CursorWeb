'use client';
// Force Vercel rebuild from main branch - deployment fix
// TEST: Animated logo deployment check - 2025

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';
import { loadFull } from "tsparticles";
import { Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
import axios from 'axios';
import { 
  Menu, 
  X, 
  Brain, 
  Twitter,
  Linkedin,
  Github,
  Mail,
  Code
} from 'lucide-react';
import Lottie from 'lottie-react';
import aiDataAnimation from '../../public/ai-data-animation.json';
import brainAnimation from '../../public/brain-animation.json';




export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Test if JavaScript is working
  useEffect(() => {
    console.log('React component loaded');
    // alert('React is working!');
  }, []);

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

  // Real social sentiment state - using placeholder data for reliability
  const [realSocialData, setRealSocialData] = useState({
    twitterMentions: 2847,
    redditMentions: 1243,
    newsMentions: 567,
    sentiment: { bullish: 65, neutral: 25, bearish: 10 },
    trendingTopics: [
      { topic: 'AI Infrastructure', sentiment: 'bullish', mentions: 1247, change: '+23%' },
      { topic: 'DeFi Protocols', sentiment: 'neutral', mentions: 892, change: '+5%' },
      { topic: 'Web3 Gaming', sentiment: 'bullish', mentions: 567, change: '+18%' },
      { topic: 'Layer 2 Scaling', sentiment: 'bullish', mentions: 445, change: '+12%' },
      { topic: 'NFT Market', sentiment: 'bearish', mentions: 234, change: '-8%' }
    ],
    isLoading: false,
    error: null as string | null
  });

  // Social buzz tracking state (keeping for fallback)
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

  // Market opportunity scanner state
  const [marketOpportunities, setMarketOpportunities] = useState([
    {
      id: 1,
      type: 'emerging_trend',
      category: 'AI Infrastructure',
      title: 'AI Compute Demand Surge',
      description: 'GPU shortages driving 40% price increases, creating arbitrage opportunities in cloud compute markets',
      confidence: 92,
      timeframe: '3-6 months',
      potentialReturn: '+150-300%',
      riskLevel: 'medium',
      timestamp: '2 min ago'
    },
    {
      id: 2,
      type: 'undervalued_asset',
      category: 'DeFi Protocol',
      title: 'Uniswap V4 Launch',
      description: 'New concentrated liquidity features undervalued by market, significant TVL migration expected',
      confidence: 87,
      timeframe: '1-2 months',
      potentialReturn: '+80-120%',
      riskLevel: 'low',
      timestamp: '5 min ago'
    },
    {
      id: 3,
      type: 'market_inefficiency',
      category: 'Cross-Chain',
      title: 'Bridge Liquidity Gap',
      description: 'Ethereum-Polygon bridge showing 15% price differential, arbitrage opportunity with low risk',
      confidence: 94,
      timeframe: '1-2 weeks',
      potentialReturn: '+12-18%',
      riskLevel: 'low',
      timestamp: '8 min ago'
    },
    {
      id: 4,
      type: 'timing_signal',
      category: 'Macro',
      title: 'Fed Policy Shift',
      description: 'Rate cut signals creating favorable conditions for growth assets, rotation opportunity emerging',
      confidence: 78,
      timeframe: '2-4 weeks',
      potentialReturn: '+25-40%',
      riskLevel: 'medium',
      timestamp: '12 min ago'
    },

  ]);

  const [scannerStats, setScannerStats] = useState({
    opportunitiesFound: 47,
    successRate: 78,
    activeAlerts: 12
  });

  // Fetch live crypto market cap
  const fetchMarketCap = useCallback(async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/global');
      const totalMarketCap = response.data.data.total_market_cap.usd;
      setMarketCap(totalMarketCap);
      setLastUpdated(new Date());
    } catch {
      console.log('Using fallback market cap data');
      // Fallback to a realistic estimate if API fails
      setMarketCap(3250000000000);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch analytics data from backend (currently unused - keeping for future use)
  const fetchAnalyticsData = useCallback(async () => {
    try {
      // const [insightsRes, marketRes, sentimentRes] = await Promise.all([
      //   fetch('/api/insights'),
      //   fetch('/api/market-data'),
      //   fetch('/api/sentiment')
      // ]);

      // Data fetched but not currently used
      // const insights = await insightsRes.json();
      // const marketData = await marketRes.json();
      // const sentimentData = await sentimentRes.json();

      // console.log('Analytics data fetched:', { insights, marketData, sentimentData });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  }, []);

  // Update placeholder social sentiment data (simulated)
  const updatePlaceholderSocialData = useCallback(() => {
    // Simulate realistic data updates
    const newSentiment = {
      bullish: Math.max(55, Math.min(75, realSocialData.sentiment.bullish + (Math.random() - 0.5) * 10)),
      neutral: Math.max(15, Math.min(35, realSocialData.sentiment.neutral + (Math.random() - 0.5) * 8)),
      bearish: Math.max(5, Math.min(20, realSocialData.sentiment.bearish + (Math.random() - 0.5) * 6))
    };
    
    // Normalize to 100%
    const total = newSentiment.bullish + newSentiment.neutral + newSentiment.bearish;
    newSentiment.bullish = Math.round((newSentiment.bullish / total) * 100);
    newSentiment.neutral = Math.round((newSentiment.neutral / total) * 100);
    newSentiment.bearish = 100 - newSentiment.bullish - newSentiment.neutral;

    // Update trending topics with realistic variations
    const updatedTopics = realSocialData.trendingTopics.map(topic => ({
      ...topic,
      mentions: Math.floor(topic.mentions * (0.95 + Math.random() * 0.1)), // Random variation
      change: `${Math.random() > 0.5 ? '+' : '-'}${Math.floor(Math.random() * 25) + 1}%`
    }));

    setRealSocialData(prev => ({
      ...prev,
      sentiment: newSentiment,
      trendingTopics: updatedTopics,
      twitterMentions: prev.twitterMentions + Math.floor(Math.random() * 50),
      redditMentions: prev.redditMentions + Math.floor(Math.random() * 20),
      newsMentions: prev.newsMentions + Math.floor(Math.random() * 10)
    }));

    // Update display data
    setSocialSentiment(newSentiment);
    setTrendingTopics(updatedTopics);
    setTotalMentions(prev => prev + Math.floor(Math.random() * 100));
  }, [realSocialData.sentiment, realSocialData.trendingTopics]);

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

  // Simulate market opportunity scanner updates
  const updateMarketOpportunities = useCallback(() => {
    const categories = ['AI Infrastructure', 'DeFi Protocol', 'Cross-Chain', 'Macro', 'Layer 2', 'Gaming', 'Social Finance'];
    const types = ['emerging_trend', 'undervalued_asset', 'market_inefficiency', 'timing_signal'];
    const riskLevels = ['low', 'medium', 'high'];
    
    const newOpportunity = {
      id: Date.now(),
      type: types[Math.floor(Math.random() * types.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      title: generateOpportunityTitle(),
      description: generateOpportunityDescription(),
      confidence: Math.floor(Math.random() * 20) + 75, // 75-95%
      timeframe: generateTimeframe(),
      potentialReturn: generatePotentialReturn(),
      riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
      timestamp: 'Just now'
    };

    setMarketOpportunities(prev => [newOpportunity, ...prev.slice(0, 4)]); // Keep only 5 items
    
    // Update scanner stats
    setScannerStats(prev => ({
      opportunitiesFound: prev.opportunitiesFound + Math.floor(Math.random() * 3) + 1,
      successRate: Math.max(70, Math.min(85, prev.successRate + (Math.random() > 0.5 ? 1 : -1))),
      activeAlerts: Math.max(8, Math.min(20, prev.activeAlerts + (Math.random() > 0.5 ? 1 : -1)))
    }));
  }, []);

  // Helper functions for market opportunity scanner
  const generateOpportunityTitle = () => {
    const titles = [
      'AI Compute Demand Surge',
      'Layer 2 Adoption Acceleration',
      'Cross-Chain Bridge Opportunity',
      'DeFi Protocol Innovation',

      'Gaming Token Breakout',
      'Social Finance Revolution',
      'Macro Policy Shift',
      'Institutional Adoption Wave',
      'Regulatory Clarity Impact'
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  };

  const generateOpportunityDescription = () => {
    const descriptions = [
      'Market inefficiency creating arbitrage opportunities with low risk',
      'Emerging trend driving significant capital flows and adoption',
      'Undervalued asset showing strong fundamentals and growth potential',
      'Timing signal indicating favorable entry point for strategic positioning',
      'Regulatory clarity opening new investment frontiers',
      'Technology breakthrough enabling novel financial products',
      'Institutional adoption creating liquidity and stability',
      'Cross-chain interoperability unlocking new use cases',
      'Tokenomics innovation driving sustainable value creation',
      'Market rotation creating sector-specific opportunities'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const generateTimeframe = () => {
    const timeframes = ['1-2 weeks', '2-4 weeks', '1-2 months', '3-6 months', '6-12 months'];
    return timeframes[Math.floor(Math.random() * timeframes.length)];
  };

  const generatePotentialReturn = () => {
    const returns = ['+15-25%', '+25-40%', '+40-60%', '+60-100%', '+100-200%', '+200-400%'];
    return returns[Math.floor(Math.random() * returns.length)];
  };





  // Update Bitcoin holdings timestamp only (no fake data changes)


  // Fetch real Bitcoin treasury data from DeFiLlama API
  const fetchBitcoinTreasuries = useCallback(async () => {
    // Use reliable static data instead of DeFiLlama API
    console.log('Using static Bitcoin treasury data');
    
    const staticHolders = [
      {
        id: 1,
        name: 'MicroStrategy',
        type: 'Public Company',
        holdings: 607770,
        value: '$71.4B',
        change: '+6,220',
        changePercent: '+1.03%',
        lastUpdated: 'Live',
        category: 'public_company',
        description: 'Largest corporate BTC holder'
      },
      {
        id: 2,
        name: 'MARA Holdings, Inc.',
        type: 'Public Company',
        holdings: 49940,
        value: '$5.87B',
        change: '+1,200',
        changePercent: '+2.5%',
        lastUpdated: 'Live',
        category: 'public_company',
        description: 'Leading Bitcoin mining company'
      },
      {
        id: 3,
        name: 'Riot Platforms, Inc.',
        type: 'Public Company',
        holdings: 19273,
        value: '$2.27B',
        change: '+800',
        changePercent: '+4.3%',
        lastUpdated: 'Live',
        category: 'public_company',
        description: 'Major Bitcoin miner'
      },
      {
        id: 4,
        name: 'CleanSpark, Inc.',
        type: 'Public Company',
        holdings: 12608,
        value: '$1.48B',
        change: '+500',
        changePercent: '+4.1%',
        lastUpdated: 'Live',
        category: 'public_company',
        description: 'Bitcoin mining and energy tech'
      },
      {
        id: 5,
        name: 'Hut 8 Corp.',
        type: 'Public Company',
        holdings: 10264,
        value: '$1.21B',
        change: '+300',
        changePercent: '+3.0%',
        lastUpdated: 'Live',
        category: 'public_company',
        description: 'Canadian Bitcoin miner'
      },
      {
        id: 6,
        name: 'Cango Inc.',
        type: 'Public Company',
        holdings: 3879,
        value: '$456M',
        change: '+100',
        changePercent: '+2.6%',
        lastUpdated: 'Live',
        category: 'public_company',
        description: 'Chinese fintech and mining'
      },
      {
        id: 7,
        name: 'BitFuFu, Inc.',
        type: 'Public Company',
        holdings: 1792,
        value: '$211M',
        change: '+50',
        changePercent: '+2.9%',
        lastUpdated: 'Live',
        category: 'public_company',
        description: 'Cloud mining platform'
      },
      {
        id: 8,
        name: 'Bitdeer Technologies Group',
        type: 'Public Company',
        holdings: 1502,
        value: '$177M',
        change: '+40',
        changePercent: '+2.7%',
        lastUpdated: 'Live',
        category: 'public_company',
        description: 'Mining and infrastructure'
      },
      {
        id: 9,
        name: 'Canaan, Inc.',
        type: 'Public Company',
        holdings: 1484,
        value: '$174M',
        change: '+30',
        changePercent: '+2.1%',
        lastUpdated: 'Live',
        category: 'public_company',
        description: 'ASIC manufacturer and miner'
      },
      {
        id: 10,
        name: 'Cipher Mining, Inc.',
        type: 'Public Company',
        holdings: 1063,
        value: '$125M',
        change: '+20',
        changePercent: '+1.9%',
        lastUpdated: 'Live',
        category: 'public_company',
        description: 'US-based Bitcoin miner'
      },
      {
        id: 11,
        name: 'Bitfarms Ltd.',
        type: 'Public Company',
        holdings: 1005,
        value: '$118M',
        change: '+10',
        changePercent: '+1.0%',
        lastUpdated: 'Live',
        category: 'public_company',
        description: 'Global Bitcoin mining company'
      },
      {
        id: 12,
        name: 'Tesla',
        type: 'Public Company',
        holdings: 11500,
        value: '$1.35B',
        change: '0',
        changePercent: '0%',
        lastUpdated: 'Live',
        category: 'public_company',
        description: 'Electric vehicle manufacturer'
      },
      {
        id: 13,
        name: 'Square/Block',
        type: 'Public Company',
        holdings: 8027,
        value: '$943M',
        change: '+27',
        changePercent: '+0.34%',
        lastUpdated: 'Live',
        category: 'public_company',
        description: 'Financial services company'
      },
      {
        id: 14,
        name: 'Grayscale GBTC',
        type: 'Trust',
        holdings: 280000,
        value: '$32.9B',
        change: '-1,200',
        changePercent: '-0.43%',
        lastUpdated: 'Live',
        category: 'trust',
        description: 'Bitcoin investment trust'
      },
      {
        id: 15,
        name: 'BlackRock IBIT',
        type: 'Spot ETF',
        holdings: 285000,
        value: '$33.5B',
        change: '+5,200',
        changePercent: '+1.86%',
        lastUpdated: 'Live',
        category: 'spot_etf',
        description: 'Largest Bitcoin spot ETF by AUM'
      },
      {
        id: 16,
        name: 'Uniswap DAO',
        type: 'DAO',
        holdings: 8500,
        value: '$1.0B',
        change: '+150',
        changePercent: '+1.79%',
        lastUpdated: 'Live',
        category: 'dao',
        description: 'Decentralized exchange governance'
      },
      {
        id: 17,
        name: 'Compound DAO',
        type: 'DAO',
        holdings: 3200,
        value: '$380M',
        change: '+50',
        changePercent: '+1.58%',
        lastUpdated: 'Live',
        category: 'dao',
        description: 'Lending protocol treasury'
      },
      {
        id: 18,
        name: 'Aave Protocol',
        type: 'Protocol',
        holdings: 2800,
        value: '$332M',
        change: '+25',
        changePercent: '+0.90%',
        lastUpdated: 'Live',
        category: 'protocol',
        description: 'DeFi lending protocol'
      },
      {
        id: 19,
        name: 'Curve Protocol',
        type: 'Protocol',
        holdings: 1500,
        value: '$178M',
        change: '+30',
        changePercent: '+2.04%',
        lastUpdated: 'Live',
        category: 'protocol',
        description: 'Stablecoin exchange protocol'
      }
    ];
        

  }, []);

  // Fetch data on component mount and every 60 seconds
  useEffect(() => {
    fetchMarketCap();
    fetchAnalyticsData(); // Fetch backend analytics data
    const marketInterval = setInterval(fetchMarketCap, 60000); // Update every 60 seconds
    const socialInterval = setInterval(updatePlaceholderSocialData, 45000); // Update social data every 45 seconds
    const analyticsInterval = setInterval(fetchAnalyticsData, 120000); // Update analytics every 2 minutes
    return () => {
      clearInterval(marketInterval);
      clearInterval(socialInterval);
      clearInterval(analyticsInterval);
    };
  }, [fetchMarketCap, updatePlaceholderSocialData, fetchAnalyticsData]);

  // Update social buzz every 45 seconds (keeping for fallback)
  useEffect(() => {
    const socialInterval = setInterval(updateSocialBuzz, 45000); // Update every 45 seconds
    return () => clearInterval(socialInterval);
  }, [updateSocialBuzz]);

  // Update market opportunities every 30 seconds
  useEffect(() => {
    const opportunityInterval = setInterval(updateMarketOpportunities, 30000); // Update every 30 seconds
    return () => clearInterval(opportunityInterval);
  }, [updateMarketOpportunities]);







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
        staggerChildren: 0.3
      }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Collect email for "Join the Signal"
      const response = await fetch('/api/collect-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          fileName: 'Join the Signal',
          source: 'contact_form',
          name: formData.name,
          company: formData.company,
          message: formData.message
        }),
      });

      if (response.ok) {
        console.log('Join the Signal email collected:', formData.email);
        alert('Thank you! We\'ll be in touch soon.');
        setIsContactModalOpen(false);
        setFormData({ name: '', email: '', company: '', message: '' });
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
        transition={{ duration: 0.8, delay }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden relative">

      
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
            value: "#d1d5db",
          },
          links: {
            color: "#d1d5db",
            distance: 150,
            enable: true,
            opacity: 0.15,
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
                  value: typeof window !== 'undefined' && window.innerWidth < 768 ? 40 : 80, // Fewer particles on mobile
                },
                opacity: {
                  value: 0.8,
                },
                shape: {
                  type: "circle",
                },
                size: {
                  value: { min: 2, max: 4 },
                },
              },
              detectRetina: true,
            }}
        />
      </div>
      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-premium z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-white/99 backdrop-blur-premium rounded-3xl p-6 sm:p-8 border border-white/20 max-w-md w-full shadow-premium mx-4"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Join the Signal</h3>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  placeholder="your.email@company.com"
                />
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  placeholder="Your company"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors resize-none"
                  placeholder="Tell us about your interest in AI-native capital infrastructure..."
                />
              </div>
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
          </motion.div>
        </div>
      )}

      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/98 backdrop-blur-premium border-b border-gray-200 z-10 shadow-premium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center cursor-pointer">
              <div className="text-3xl font-black text-black">
                Birdai
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <motion.a 
                href="#home" 
                className="text-black hover:text-gray-600 transition-colors relative group font-semibold"
                whileHover={{ scale: 1.05 }}
              >
                <span>Home</span>
                <motion.div 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"
                  whileHover={{ width: "100%" }}
                />
              </motion.a>
              
              <Link
                href="/research" 
                className="text-gray-800 hover:text-gray-900 transition-colors relative group font-semibold"
              >
                <motion.div whileHover={{ scale: 1.05 }}>
                  <span>Research</span>
                  <motion.div 
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300"
                    whileHover={{ width: "100%" }}
                  />
                </motion.div>
              </Link>
              

              
              <motion.a 
                href="#live-data" 
                className="text-gray-800 hover:text-gray-900 transition-colors relative group flex items-center space-x-1 font-semibold"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Data Intelligence</span>
                <motion.div 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:w-full transition-all duration-300"
                  whileHover={{ width: "100%" }}
                />
              </motion.a>
              

              
              
              

              
              
              
              
              <motion.button 
                onClick={() => setIsContactModalOpen(true)}
                className="bg-gradient-accent text-white font-semibold py-2.5 px-6 rounded-full text-sm shadow-premium transition-all duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">Join Signal</span>
              </motion.button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-800 hover:text-gray-900 font-semibold"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white rounded-lg mt-2 border border-gray-200 shadow-lg">
                <motion.a 
                  href="#home" 
                  className="block px-3 py-2 text-gray-800 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-50 font-semibold"
                  whileHover={{ x: 5 }}
                >
                  Home
                </motion.a>
                
                <Link
                  href="/research" 
                  className="block px-3 py-2 text-gray-800 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-50 font-semibold"
                >
                  <motion.div whileHover={{ x: 5 }}>
                    Research
                  </motion.div>
                </Link>
                

                
                <motion.a 
                  href="#live-data" 
                  className="block px-3 py-2 text-gray-800 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-50 flex items-center space-x-2 font-semibold"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Data Intelligence</span>
                </motion.a>
                

                

                

                

                

                
                <motion.button 
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full mt-2 bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md text-sm shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  Join Signal
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        id="home" 
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-20 left-10 w-32 h-32 bg-transparent rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0, 0, 0],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-40 right-20 w-24 h-24 bg-transparent rounded-full blur-2xl"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0, 0, 0],
              x: [0, -40, 0],
              y: [0, 40, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <motion.div 
                            className="absolute bottom-20 left-1/4 w-20 h-20 bg-transparent rounded-full blur-2xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0, 0, 0],
              x: [0, 30, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          />
        </div>

        <motion.div 
          className="max-w-7xl mx-auto text-center relative z-10"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >


          <motion.h1 
            className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 relative text-center"
            variants={fadeInUp}
          >
            <span 
              className="block text-black relative font-bold"
            >
              Built to See What Others Miss.
            </span>
          </motion.h1>



          {/* Enhanced CTA Button */}
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button 
              onClick={() => setIsContactModalOpen(true)}
              className="group relative bg-black text-white font-semibold py-4 px-8 rounded-full text-lg shadow-premium overflow-hidden border border-black"
              variants={fadeInUp}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10 flex items-center space-x-2">
                <span>Join the Signal</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.div>
              </span>
            </motion.button>


          </motion.div>
        </motion.div>
      </motion.section>



      {/* The Operating System for Private Markets Section */}
      <section id="mission" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="absolute inset-0 bg-white z-0"></div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-lg sm:text-xl md:text-2xl text-black mb-8 max-w-3xl mx-auto text-center font-medium relative z-10">
              Birdai explores what's hidden in plain sight. We combine intelligence, capital, and technology to move toward what's next—before it's obvious.
            </p>
            <p className="text-xl text-black max-w-4xl mx-auto mb-8 relative z-10">
              We see patterns others miss. We move when others wait. We build the infrastructure that powers tomorrow's investment decisions.
            </p>
            <ScrollAnimation delay={0.4}>
              <div className="flex justify-center mb-8">
                <motion.div 
                  className="w-64 h-64 md:w-96 md:h-96 relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <Lottie
                    animationData={brainAnimation}
                    loop={true}
                    autoplay={true}
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      filter: 'hue-rotate(200deg) saturate(1.2) brightness(1.1)'
                    }}
                  />
                                  {/* Enhanced glow effect */}
                <motion.div 
                  className="absolute inset-0 bg-transparent rounded-full blur-2xl"
                  animate={{ 
                    opacity: [0, 0, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
                </motion.div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Simplified Live Data Dashboard */}
      <section id="live-data" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="absolute inset-0 bg-white"></div>
        <div className="max-w-7xl mx-auto">
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black mb-6 text-center leading-tight tracking-tight">
              The Data That Moves Money
            </h2>
          <p className="text-2xl sm:text-3xl md:text-4xl text-black max-w-4xl mx-auto mb-12 text-center relative z-10 font-semibold">
            Where data becomes insight, and insight becomes advantage
          </p>
          
          <ScrollAnimation delay={0.3}>
            <div className="flex justify-center mb-12">
              <motion.div 
                className="w-64 h-64 md:w-96 md:h-96 relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                                  <Lottie
                    animationData={aiDataAnimation}
                    loop={true}
                    autoplay={true}
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      filter: 'grayscale(0.8) contrast(1.2) brightness(0.9)'
                    }}
                  />
                {/* Enhanced glow effect */}
                <motion.div 
                  className="absolute inset-0 bg-transparent rounded-full blur-2xl"
                  animate={{ 
                    opacity: [0, 0, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              </motion.div>
            </div>
          </ScrollAnimation>



        </div>
      </section>







      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-12 md:mb-16 text-center">
            This Cycle Is Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1 */}
            <motion.div 
              className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-6"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-black mb-4">Better Tooling</h3>
              <p className="text-black">
                AI + on-chain infrastructure enables unprecedented deal discovery and execution.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-6"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Code className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-black mb-4">Fundamental Execution</h3>
              <p className="text-black">
                Where legacy firms add headcount, we add code. Scalable, intelligent, and aligned from day one.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-6"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-black mb-4">Machine Intelligence</h3>
              <p className="text-black">
                AI-powered signal processing at scale. See patterns others miss.
              </p>
            </motion.div>
          </div>


        </div>
      </section>



      {/* Market Opportunity Scanner Section */}
      <section id="market-opportunities" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollAnimation>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 text-center">
              Market Opportunity Scanner
            </h2>
          </ScrollAnimation>
          <ScrollAnimation delay={0.2}>
            <p className="text-xl text-black max-w-4xl mx-auto mb-4 text-center">
              AI-powered detection of emerging trends, undervalued assets, market inefficiencies, and timing signals
            </p>
            <p className="text-sm text-gray-500 max-w-4xl mx-auto mb-12 text-center">
              * Data shown is for illustration purposes only and does not represent actual investment opportunities or recommendations
            </p>
          </ScrollAnimation>

          {/* Scanner Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <ScrollAnimation delay={0.3}>
              <motion.div 
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-3xl font-bold text-black mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  {scannerStats.opportunitiesFound}
                </motion.div>
                <p className="text-black">Opportunities Found</p>
              </motion.div>
            </ScrollAnimation>



            <ScrollAnimation delay={0.5}>
              <motion.div 
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-3xl font-bold text-black mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                >
                  {scannerStats.successRate}%
                </motion.div>
                <p className="text-black">Success Rate</p>
              </motion.div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.6}>
              <motion.div 
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-3xl font-bold text-black mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 3 }}
                >
                  {scannerStats.activeAlerts}
                </motion.div>
                <p className="text-black">Active Alerts</p>
              </motion.div>
            </ScrollAnimation>
          </div>

          {/* Live Opportunities Feed */}
          <ScrollAnimation delay={0.7}>
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-2xl font-bold text-black mb-6">Live Opportunities Feed</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {marketOpportunities.map((opportunity, index) => (
                  <motion.div 
                    key={opportunity.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, backgroundColor: 'rgb(249, 250, 251)' }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        opportunity.riskLevel === 'low' ? 'bg-green-500' : 
                        opportunity.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-black font-semibold">{opportunity.title}</span>
                          <span className="text-xs text-black bg-gray-100 px-2 py-1 rounded">
                            {opportunity.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-black text-sm">{opportunity.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-black text-sm">{opportunity.category}</span>
                          <span className="text-black text-sm">{opportunity.timeframe}</span>
                          <span className="text-green-600 font-semibold">{opportunity.potentialReturn}</span>
                          <span className="text-black text-xs">{opportunity.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-black">{opportunity.confidence}%</div>
                      <div className="text-xs text-gray-500">Confidence</div>
                      <motion.div 
                        className="w-2 h-2 bg-black rounded-full mt-2"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>







      {/* Team Section */}
      <section id="team" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Meet the Team
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Kevin Farrelly */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-2xl font-bold text-black mb-4">Kevin Farrelly</h3>
              <p className="text-black mb-4">
                Kevin is a repeat founder and investor at the intersection of machine learning, venture, and crypto. 
                He previously founded a machine learning credit fund acquired by Franklin Templeton in 2018, where 
                he subsequently launched and led Blockchain Venture Funds I and II, delivering top-decile DPI returns.
              </p>
              <p className="text-black mb-4">
                With over 15 years of hands-on experience scaling fintech and consumer companies—focusing on CAC 
                optimization, margin expansion, and data science—Kevin specializes in early-stage investing, token 
                economics, and ML infrastructure.
              </p>
              <p className="text-black text-sm mb-4">BSBA from the University of Richmond</p>
              <div className="flex space-x-4 mt-4 relative z-10">
                <button 
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors relative z-20"
                  onClick={() => window.open('https://linkedin.com/in/pies', '_blank')}
                >
                  LinkedIn
                </button>
                <button 
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors relative z-20"
                  onClick={() => window.open('https://twitter.com/KRFsocial', '_blank')}
                >
                  Twitter
                </button>
              </div>
            </div>

            {/* Greg Scanlon */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-2xl font-bold text-black mb-4">Greg Scanlon</h3>
              <p className="text-black mb-4">
                Greg is a seasoned investor and technologist operating at the intersection of blockchain, data science, 
                and institutional capital. He co-founded Franklin Templeton&apos;s Blockchain Venture Funds I and II, and 
                brings over 15 years of experience in investing and risk management from leading firms such as Citadel 
                and Orange Capital.
              </p>
              <p className="text-black mb-4">
                Greg is also an active mentor and advisor across multiple top universities.
              </p>
              <p className="text-black text-sm mb-4">BSBA from the University of Richmond, MS in Data Science from NYU, CFA charterholder</p>
              <div className="flex space-x-4 mt-4 relative z-10">
                <button 
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors relative z-20"
                  onClick={() => window.open('https://www.linkedin.com/in/scatman/', '_blank')}
                >
                  LinkedIn
                </button>
                <button 
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors relative z-20"
                  onClick={() => window.open('https://twitter.com/ggscanlon', '_blank')}
                >
                  Twitter
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <motion.div 
                className="text-2xl font-bold text-black mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <motion.span 
                  className="text-black"
                >
                  Birdai
                </motion.span>
              </motion.div>
              <p className="text-black mb-6 max-w-md">
                Machine-native. Protocol-first. Liquidity-aware. See what others miss.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors">
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors">
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors">
                  <Github className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors">
                  <Mail className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-black font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-black hover:text-gray-600 transition-colors">Signal</a></li>
                <li><a href="#" className="text-black hover:text-gray-600 transition-colors">Score</a></li>
                <li><a href="#" className="text-black hover:text-gray-600 transition-colors">Structure</a></li>
                <li><a href="#" className="text-black hover:text-gray-600 transition-colors">Allocate</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-black font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-black hover:text-gray-600 transition-colors">Team</a></li>
                <li><a href="#" className="text-black hover:text-gray-600 transition-colors">Deals</a></li>
                <li><a href="#" className="text-black hover:text-gray-600 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-300 mt-8 pt-8 text-center">
            <p className="text-black">
              © 2025 Birdai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>


    </div>
  );
}
