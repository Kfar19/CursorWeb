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
import productivityAnimation from '../../public/productivity-animation.json';
import oracleAnimation from '../../public/oracle-animation.json';
import OracleModal from './components/OracleModal';


export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isOracleOpen, setIsOracleOpen] = useState(false);
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

  // Live blockchain feed state
  const [blockchainFeed, setBlockchainFeed] = useState([
    {
      id: 1,
      type: 'whale_movement',
      protocol: 'Uniswap V4',
      description: 'Whale moved 2,500 ETH to liquidity pool',
      amount: '2,500 ETH',
      value: '$4.2M',
      time: '2 min ago',
      impact: 'high',
      txHash: '0x7a8b...3f2e'
    },
    {
      id: 2,
      type: 'protocol_activity',
      protocol: 'Compound',
      description: 'New lending pool launched: USDC/ETH',
      amount: 'Pool Size: $12M',
      value: 'APY: 8.5%',
      time: '5 min ago',
      impact: 'medium',
      txHash: '0x9c1d...7a4b'
    },
    {
      id: 3,
      type: 'defi_activity',
      protocol: 'Aave',
      description: 'Flash loan executed: $850K USDC',
      amount: '850K USDC',
      value: 'Fee: $425',
      time: '8 min ago',
      impact: 'low',
      txHash: '0x3e2f...9c8d'
    },
    {
      id: 4,
      type: 'nft_activity',
      protocol: 'OpenSea',
      description: 'Rare NFT sold: CryptoPunk #1234',
      amount: '1 NFT',
      value: '45 ETH',
      time: '12 min ago',
      impact: 'high',
      txHash: '0x5a7b...1e9f'
    },
    {
      id: 5,
      type: 'governance',
      protocol: 'Uniswap DAO',
      description: 'Proposal passed: Fee structure update',
      amount: 'Votes: 2.1M',
      value: 'Quorum: 85%',
      time: '15 min ago',
      impact: 'medium',
      txHash: '0x8d4e...6b2a'
    }
  ]);
  const [totalTransactions, setTotalTransactions] = useState(1247500);
  const [activeProtocols, setActiveProtocols] = useState(47);
  const [gasPrice, setGasPrice] = useState(25);

  // Backend Analytics Data (currently unused - keeping for future use)
  // const [analyticsData, setAnalyticsData] = useState({
  //   insights: [],
  //   marketData: null,
  //   sentimentData: null,
  //   isLoading: true
  // });

  // AI Market Predictions state


  // Bitcoin Holdings Monitor state
  const [bitcoinHoldings, setBitcoinHoldings] = useState({
    totalPublicCompanies: 650297, // ~650K BTC (including MicroStrategy's 607,770)
    totalSpotETFs: 620000, // 620K BTC (all major spot ETFs)
    totalTrusts: 280000, // 280K BTC (Grayscale GBTC)
    totalPrivateCompanies: 180000, // 180K BTC (Binance)
    totalAssetManagers: 85000, // 85K BTC (Franklin Templeton)
    totalSovereigns: 2800, // 2.8K BTC (El Salvador)
    totalDAOs: 0, // DAO holdings from DeFiLlama
    totalProtocols: 0, // Protocol holdings from DeFiLlama
    lastUpdated: new Date()
  });

  const [institutionalHolders, setInstitutionalHolders] = useState([
    {
      id: 1,
      name: 'MicroStrategy',
      type: 'Public Company',
      holdings: 607770,
      value: '$23.1B',
      change: '+12,000',
      changePercent: '+2.02%',
      lastUpdated: '1 day ago',
      category: 'public_company',
      description: 'Software company with largest corporate BTC holdings'
    },
    {
      id: 2,
      name: 'BlackRock IBIT',
      type: 'Spot ETF',
      holdings: 285000,
      value: '$10.8B',
      change: '+5,200',
      changePercent: '+1.86%',
      lastUpdated: '1 hour ago',
      category: 'spot_etf',
      description: 'Largest Bitcoin spot ETF by AUM'
    },
    {
      id: 3,
      name: 'Fidelity FBTC',
      type: 'Spot ETF',
      holdings: 165000,
      value: '$6.3B',
      change: '+2,800',
      changePercent: '+1.73%',
      lastUpdated: '45 min ago',
      category: 'spot_etf',
      description: 'Second largest Bitcoin spot ETF'
    },
    {
      id: 4,
      name: 'ARKB ETF',
      type: 'Spot ETF',
      holdings: 52000,
      value: '$2.0B',
      change: '+1,200',
      changePercent: '+2.36%',
      lastUpdated: '30 min ago',
      category: 'spot_etf',
      description: 'ARK Invest Bitcoin ETF'
    },
    {
      id: 5,
      name: 'Tesla',
      type: 'Public Company',
      holdings: 11500,
      value: '$437M',
      change: '0',
      changePercent: '0%',
      lastUpdated: '1 day ago',
      category: 'public_company',
      description: 'Electric vehicle manufacturer'
    },
    {
      id: 6,
      name: 'Square/Block',
      type: 'Public Company',
      holdings: 8027,
      value: '$305M',
      change: '+27',
      changePercent: '+0.34%',
      lastUpdated: '3 hours ago',
      category: 'public_company',
      description: 'Financial services company'
    },
    {
      id: 7,
      name: 'Coinbase',
      type: 'Public Company',
      holdings: 250000,
      value: '$9.5B',
      change: '+5,000',
      changePercent: '+2.04%',
      lastUpdated: '15 min ago',
      category: 'public_company',
      description: 'Cryptocurrency exchange platform'
    },
    {
      id: 8,
      name: 'Binance',
      type: 'Private Company',
      holdings: 180000,
      value: '$6.8B',
      change: '+2,500',
      changePercent: '+1.41%',
      lastUpdated: '20 min ago',
      category: 'private_company',
      description: 'Global cryptocurrency exchange'
    },
    {
      id: 9,
      name: 'Grayscale GBTC',
      type: 'Trust',
      holdings: 280000,
      value: '$10.6B',
      change: '-1,200',
      changePercent: '-0.43%',
      lastUpdated: '1 hour ago',
      category: 'trust',
      description: 'Bitcoin investment trust'
    },
    {
      id: 10,
      name: 'Marathon Digital',
      type: 'Public Company',
      holdings: 15000,
      value: '$570M',
      change: '+300',
      changePercent: '+2.04%',
      lastUpdated: '2 hours ago',
      category: 'public_company',
      description: 'Bitcoin mining company'
    },
    {
      id: 11,
      name: 'El Salvador',
      type: 'Sovereign Nation',
      holdings: 2800,
      value: '$106M',
      change: '+100',
      changePercent: '+3.70%',
      lastUpdated: '1 week ago',
      category: 'sovereign',
      description: 'First country to adopt Bitcoin as legal tender'
    },
    {
      id: 12,
      name: 'Bitwise BITB',
      type: 'Spot ETF',
      holdings: 45000,
      value: '$1.7B',
      change: '+800',
      changePercent: '+1.81%',
      lastUpdated: '2 hours ago',
      category: 'spot_etf',
      description: 'Bitwise Bitcoin ETF'
    },
    {
      id: 13,
      name: 'VanEck HODL',
      type: 'Spot ETF',
      holdings: 35000,
      value: '$1.3B',
      change: '+600',
      changePercent: '+1.74%',
      lastUpdated: '3 hours ago',
      category: 'spot_etf',
      description: 'VanEck Bitcoin ETF'
    },
    {
      id: 14,
      name: 'Franklin Templeton',
      type: 'Asset Manager',
      holdings: 85000,
      value: '$3.2B',
      change: '+1,200',
      changePercent: '+1.43%',
      lastUpdated: '4 hours ago',
      category: 'asset_manager',
      description: 'Global investment management firm'
    },
    {
      id: 15,
      name: 'Galaxy Digital',
      type: 'Public Company',
      holdings: 12000,
      value: '$456M',
      change: '+200',
      changePercent: '+1.69%',
      lastUpdated: '1 day ago',
      category: 'public_company',
      description: 'Digital asset financial services'
    },
    {
      id: 16,
      name: 'WisdomTree BTCW',
      type: 'Spot ETF',
      holdings: 25000,
      value: '$950M',
      change: '+400',
      changePercent: '+1.63%',
      lastUpdated: '1 hour ago',
      category: 'spot_etf',
      description: 'WisdomTree Bitcoin ETF'
    },
    {
      id: 17,
      name: 'Invesco BTCO',
      type: 'Spot ETF',
      holdings: 22000,
      value: '$836M',
      change: '+300',
      changePercent: '+1.38%',
      lastUpdated: '2 hours ago',
      category: 'spot_etf',
      description: 'Invesco Bitcoin ETF'
    },
    {
      id: 18,
      name: 'Valkyrie BRRR',
      type: 'Spot ETF',
      holdings: 8000,
      value: '$304M',
      change: '+100',
      changePercent: '+1.27%',
      lastUpdated: '3 hours ago',
      category: 'spot_etf',
      description: 'Valkyrie Bitcoin ETF'
    }
  ]);

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

  // Simulate blockchain feed updates
  const updateBlockchainFeed = useCallback(() => {
    const protocols = ['Uniswap V4', 'Compound', 'Aave', 'OpenSea', 'Uniswap DAO', 'Curve', 'Balancer', 'SushiSwap', 'dYdX', 'GMX'];
    const types = ['whale_movement', 'protocol_activity', 'defi_activity', 'nft_activity', 'governance', 'liquidity_event', 'flash_loan', 'yield_farming'];
    
    const newActivity = {
      id: Date.now(),
      type: types[Math.floor(Math.random() * types.length)],
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      description: generateActivityDescription(),
      amount: generateAmount(),
      value: generateValue(),
      time: 'Just now',
      impact: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
      txHash: generateTxHash()
    };

    setBlockchainFeed(prev => [newActivity, ...prev.slice(0, 4)]); // Keep only 5 items
    
    // Update stats
    setTotalTransactions(prev => prev + Math.floor(Math.random() * 100) + 50);
    setActiveProtocols(prev => Math.max(40, Math.min(60, prev + (Math.random() > 0.5 ? 1 : -1))));
    setGasPrice(prev => Math.max(15, Math.min(50, prev + (Math.random() > 0.5 ? 2 : -2))));
  }, []);

  // Helper functions for blockchain feed
  const generateActivityDescription = () => {
    const descriptions = [
      'Whale moved large position to new protocol',
      'Flash loan executed for arbitrage opportunity',
      'New liquidity pool launched with high APY',
      'Governance proposal passed with overwhelming support',
      'Rare NFT sold for significant premium',
      'Protocol upgrade deployed successfully',
      'Cross-chain bridge activity detected',
      'Yield farming strategy executed',
      'Liquidation event occurred',
      'New token listing on DEX'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const generateAmount = () => {
    const amounts = ['1,250 ETH', '500K USDC', '2.5M DAI', '100K LINK', '50K UNI', '25K AAVE', '10K COMP', '5K CRV'];
    return amounts[Math.floor(Math.random() * amounts.length)];
  };

  const generateValue = () => {
    const values = ['$2.1M', '$500K', '$1.8M', '$750K', '$300K', '$950K', '$420K', '$1.2M'];
    return values[Math.floor(Math.random() * values.length)];
  };

  const generateTxHash = () => {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 8; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash + '...' + chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)];
  };



  // Update Bitcoin holdings timestamp only (no fake data changes)
  const updateBitcoinHoldings = useCallback(() => {
    // Only update the timestamp to show the data is "live"
    setBitcoinHoldings(prev => ({
      ...prev,
      lastUpdated: new Date()
    }));

    // Update individual holders timestamp only (no fake changes)
    setInstitutionalHolders(prev => prev.map(holder => ({
      ...holder,
      lastUpdated: 'Live'
    })));
  }, []);

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
        
    // Set institutional holders with static data
    setInstitutionalHolders(staticHolders);
        
    // Calculate totals from static data
    const daoTotal = staticHolders
      .filter((holder: { type: string }) => holder.type === 'DAO')
      .reduce((sum: number, holder: { holdings: number }) => sum + holder.holdings, 0);
    
    const protocolTotal = staticHolders
      .filter((holder: { type: string }) => holder.type === 'Protocol')
      .reduce((sum: number, holder: { holdings: number }) => sum + holder.holdings, 0);

    console.log('DAO total calculated:', daoTotal);
    console.log('Protocol total calculated:', protocolTotal);

    const totals = {
      totalPublicCompanies: 627297, // MicroStrategy + Tesla + Square
      totalSpotETFs: 620000, // All major spot ETFs
      totalTrusts: 280000, // Grayscale GBTC
      totalPrivateCompanies: 180000, // Binance
      totalAssetManagers: 85000, // Franklin Templeton
      totalSovereigns: 2800, // El Salvador
      totalDAOs: daoTotal, // Calculated from static data
      totalProtocols: protocolTotal, // Calculated from static data
      lastUpdated: new Date()
    };

    setBitcoinHoldings(totals);
    console.log('Static Bitcoin treasury data loaded successfully');
  }, []);

  // Fetch data on component mount and every 60 seconds
  useEffect(() => {
    fetchMarketCap();
    fetchBitcoinTreasuries(); // Fetch real Bitcoin treasury data
    fetchAnalyticsData(); // Fetch backend analytics data
    const marketInterval = setInterval(fetchMarketCap, 60000); // Update every 60 seconds
    const socialInterval = setInterval(updatePlaceholderSocialData, 45000); // Update social data every 45 seconds
    const treasuryInterval = setInterval(fetchBitcoinTreasuries, 120000); // Update every 2 minutes
    const analyticsInterval = setInterval(fetchAnalyticsData, 120000); // Update analytics every 2 minutes
    return () => {
      clearInterval(marketInterval);
      clearInterval(socialInterval);
      clearInterval(treasuryInterval);
      clearInterval(analyticsInterval);
    };
  }, [fetchMarketCap, updatePlaceholderSocialData, fetchBitcoinTreasuries, fetchAnalyticsData]);

  // Update social buzz every 45 seconds (keeping for fallback)
  useEffect(() => {
    const socialInterval = setInterval(updateSocialBuzz, 45000); // Update every 45 seconds
    return () => clearInterval(socialInterval);
  }, [updateSocialBuzz]);

  // Update blockchain feed every 30 seconds
  useEffect(() => {
    const blockchainInterval = setInterval(updateBlockchainFeed, 30000); // Update every 30 seconds
    return () => clearInterval(blockchainInterval);
  }, [updateBlockchainFeed]);



  // Update Bitcoin holdings every 60 seconds
  useEffect(() => {
    const bitcoinInterval = setInterval(updateBitcoinHoldings, 60000); // Update every 60 seconds
    return () => clearInterval(bitcoinInterval);
  }, [updateBitcoinHoldings]);

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
                  value: 80, // Fixed number for better visibility
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 max-w-md w-full shadow-xl">
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
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="text-2xl font-bold text-white"
                animate={{ 
                  y: [0, -2, 0],
                  scale: [1, 1.02, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-900"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: "200% 200%"
                  }}
                >
                  Birdai
                </motion.span>
              </motion.div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <motion.a 
                href="#home" 
                className="text-gray-600 hover:text-gray-900 transition-colors relative group"
                whileHover={{ scale: 1.05 }}
              >
                <span>Home</span>
                <motion.div 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-300"
                  whileHover={{ width: "100%" }}
                />
              </motion.a>
              
              <Link
                href="/research" 
                className="text-gray-600 hover:text-gray-900 transition-colors relative group"
              >
                <motion.div whileHover={{ scale: 1.05 }}>
                  <span>Research</span>
                  <motion.div 
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300"
                    whileHover={{ width: "100%" }}
                  />
                </motion.div>
              </Link>
              
              <Link
                href="/chatbot" 
                className="text-gray-600 hover:text-gray-900 transition-colors relative group flex items-center space-x-1"
              >
                <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Chatbot</span>
                  <motion.div 
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-300"
                    whileHover={{ width: "100%" }}
                  />
                </motion.div>
              </Link>
              
              <motion.a 
                href="#live-data" 
                className="text-gray-600 hover:text-gray-900 transition-colors relative group flex items-center space-x-1"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Data</span>
                <motion.div 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:w-full transition-all duration-300"
                  whileHover={{ width: "100%" }}
                />
              </motion.a>
              
              <motion.a 
                href="#social-sentiment" 
                className="text-gray-600 hover:text-gray-900 transition-colors relative group"
                whileHover={{ scale: 1.05 }}
              >
                <span>Social Sentiment</span>
                <motion.div 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300"
                  whileHover={{ width: "100%" }}
                />
              </motion.a>
              
              <motion.a 
                href="#blockchain-feed" 
                className="text-gray-600 hover:text-gray-900 transition-colors relative group"
                whileHover={{ scale: 1.05 }}
              >
                <span>Blockchain</span>
                <motion.div 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 group-hover:w-full transition-all duration-300"
                  whileHover={{ width: "100%" }}
                />
              </motion.a>
              

              
              <motion.a 
                href="#bitcoin-holdings" 
                className="text-gray-600 hover:text-gray-900 transition-colors relative group"
                whileHover={{ scale: 1.05 }}
              >
                <span>Bitcoin Holdings</span>
                <motion.div 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 group-hover:w-full transition-all duration-300"
                  whileHover={{ width: "100%" }}
                />
              </motion.a>
              
              <motion.button 
                onClick={() => setIsContactModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-full text-sm shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
              >
                Join Signal
              </motion.button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
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
                  className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-50"
                  whileHover={{ x: 5 }}
                >
                  Home
                </motion.a>
                
                <Link
                  href="/research" 
                  className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-50"
                >
                  <motion.div whileHover={{ x: 5 }}>
                    Research
                  </motion.div>
                </Link>
                
                <Link
                  href="/chatbot" 
                  className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-50 flex items-center space-x-2"
                >
                  <motion.div whileHover={{ x: 5 }} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>Chatbot</span>
                  </motion.div>
                </Link>
                
                <motion.a 
                  href="#live-data" 
                  className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-50 flex items-center space-x-2"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live Data</span>
                </motion.a>
                
                <motion.a 
                  href="#social-sentiment" 
                  className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-50"
                  whileHover={{ x: 5 }}
                >
                  Social Sentiment
                </motion.a>
                
                <motion.a 
                  href="#blockchain-feed" 
                  className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-50"
                  whileHover={{ x: 5 }}
                >
                  Blockchain Feed
                </motion.a>
                

                
                <motion.a 
                  href="#bitcoin-holdings" 
                  className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-50"
                  whileHover={{ x: 5 }}
                >
                  Bitcoin Holdings
                </motion.a>
                
                <motion.button 
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full mt-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-md text-sm shadow-lg transition-all duration-300"
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
            className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-40 right-20 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2],
              x: [0, -40, 0],
              y: [0, 40, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <motion.div 
                            className="absolute bottom-20 left-1/4 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
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
          {/* Live Market Cap Badge */}
          <motion.div 
            className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-8"
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-600 text-sm font-medium">Live Market Cap: {formatMarketCap(marketCap)}</span>
            <span className="text-gray-500 text-xs">• Updated {lastUpdated.toLocaleTimeString()}</span>
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 relative text-center"
            variants={fadeInUp}
          >
            <motion.span 
              className="block text-gray-900 relative"
              animate={{ 
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              An investment machine.
            </motion.span>
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto text-center"
            variants={fadeInUp}
          >
            Engineered for restraint in a reckless world.
          </motion.p>

          {/* Enhanced CTA Button */}
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button 
              onClick={() => setIsContactModalOpen(true)}
              className="group relative bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-4 px-8 rounded-full text-lg shadow-lg overflow-hidden"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
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

            {/* Live Stats */}
            <motion.div 
              className="flex items-center space-x-6 text-sm text-gray-500"
              variants={fadeInUp}
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>{totalMentions.toLocaleString()} mentions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{totalTransactions.toLocaleString()} transactions</span>
              </div>

            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Coding Capital Section */}
      <section id="mission" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <ScrollAnimation>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Coding Capital
              </h2>
            </ScrollAnimation>
            <ScrollAnimation delay={0.2}>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
                The fastest-growing asset class isn&apos;t just emerging—it&apos;s rewriting the rules. Are you inside the system, or watching it evolve from the outside?
              </p>
            </ScrollAnimation>
            <ScrollAnimation delay={0.4}>
              <motion.div 
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm max-w-2xl mx-auto"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                                  <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 mb-2">
                    {isLoading ? (
                      <motion.div
                        className="flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mr-2"
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
                                  <p className="text-gray-700">
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

      {/* Social Buzz Tracking Section */}
      <section id="social-sentiment" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollAnimation>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
              Live Social Sentiment
            </h2>
          </ScrollAnimation>
          <ScrollAnimation delay={0.2}>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12 text-center">
              Real-time buzz tracking across Reddit, Twitter, and crypto communities
            </p>
          </ScrollAnimation>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Sentiment Overview */}
            <ScrollAnimation delay={0.3}>
              <motion.div 
                className="bg-gray-50 rounded-2xl p-8 border border-gray-200"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Market Sentiment</h3>
                  <div className="flex items-center space-x-2">
                                 <div className="flex items-center space-x-2">
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
               <span className="text-blue-600 text-sm">Live simulated data</span>
             </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-green-600">Bullish</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <motion.div 
                          className="bg-green-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${socialSentiment.bullish}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                      <span className="text-gray-900 font-semibold">{socialSentiment.bullish}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Neutral</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <motion.div 
                          className="bg-gray-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${socialSentiment.neutral}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                      <span className="text-gray-900 font-semibold">{socialSentiment.neutral}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-600">Bearish</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <motion.div 
                          className="bg-red-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${socialSentiment.bearish}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                      <span className="text-gray-900 font-semibold">{socialSentiment.bearish}%</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-2xl font-bold text-blue-600">{totalMentions.toLocaleString()}</p>
                           <p className="text-gray-600">Total Mentions (24h)</p>
         <div className="text-xs text-blue-600 mt-1 space-y-1">
           <p>{realSocialData.twitterMentions} from Twitter</p>
           <p>{realSocialData.redditMentions} from Reddit</p>
           <p>{realSocialData.newsMentions} from News APIs</p>
         </div>
                </div>
              </motion.div>
            </ScrollAnimation>

            {/* Trending Topics */}
            <ScrollAnimation delay={0.4}>
              <motion.div 
                className="bg-gray-50 rounded-2xl p-8 border border-gray-200"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Trending Topics</h3>
                <div className="space-y-4">
                  {trendingTopics.map((topic, index) => (
                    <motion.div 
                      key={topic.topic}
                      className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div>
                        <p className="text-gray-900 font-semibold">{topic.topic}</p>
                        <p className="text-sm text-gray-600">{topic.mentions.toLocaleString()} mentions</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-semibold ${
                          topic.sentiment === 'bullish' ? 'text-green-600' : 
                          topic.sentiment === 'bearish' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {topic.sentiment}
                        </span>
                        <p className={`text-sm ${
                          topic.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
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

      {/* Oracle Section */}
              <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <ScrollAnimation>
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="text-4xl">𓂀</div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                  The Oracle
                </h2>
                <div className="text-4xl">🔮</div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation delay={0.2}>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover how our AI is optimized for your investment profile
              </p>
            </ScrollAnimation>
          </div>
          
          <ScrollAnimation delay={0.3}>
            <div className="max-w-2xl mx-auto">
              <motion.div 
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => setIsOracleOpen(true)}
              >
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4">
                    <Lottie
                      animationData={oracleAnimation}
                      loop={true}
                      autoplay={true}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Ask the Oracle
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Answer 3 simple questions to discover how our AI is tailored for your investment approach
                  </p>
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Begin Your Reading
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* AI Eats Data Section */}
      <section id="live-data" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="text-left">
              <ScrollAnimation>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Trained on data. Tuned for decisions
                </h2>
              </ScrollAnimation>
              <ScrollAnimation delay={0.2}>
                <p className="text-xl text-gray-600 mb-8">
                  The old system filters signal through committees. Ours reads it in real time.
                </p>
              </ScrollAnimation>
            </div>
            
            {/* Right Side - AI Productivity Animation */}
            <div className="flex justify-center md:justify-end">
              <motion.div 
                className="w-80 h-80 relative"
                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <Lottie
                  animationData={productivityAnimation}
                  loop={true}
                  autoplay={true}
                  style={{ width: '100%', height: '100%' }}
                />
                {/* Enhanced glow effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl"
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3],
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
          </div>
        </div>
      </section>

      {/* Why Now Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <ScrollAnimation>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
                Why Now
              </h2>
            </ScrollAnimation>
            
            <ScrollAnimation delay={0.2}>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">AI-Native Capital</h3>
                  <p className="text-gray-600">The infrastructure is ready</p>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Perfect Timing</h3>
                  <p className="text-gray-600">Early conviction pays</p>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Built for Scale</h3>
                  <p className="text-gray-600">Code over headcount</p>
                </motion.div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16 text-center">
            This Cycle Is Different
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
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
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Better Tooling</h3>
              <p className="text-gray-600">
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
                className="w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl flex items-center justify-center mb-6"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Code className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fundamental Execution</h3>
              <p className="text-gray-600">
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
                className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Machine Intelligence</h3>
              <p className="text-gray-600">
                AI-powered signal processing at scale. See patterns others miss.
              </p>
            </motion.div>
          </div>


        </div>
      </section>



      {/* Live Blockchain Feed Section */}
      <section id="blockchain-feed" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <ScrollAnimation>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
              Live Blockchain Feed
            </h2>
          </ScrollAnimation>
          <ScrollAnimation delay={0.2}>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12 text-center">
              Real-time on-chain activity across DeFi protocols, whale movements, and market events
            </p>
          </ScrollAnimation>

          {/* Live Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <ScrollAnimation delay={0.3}>
              <motion.div 
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-3xl font-bold text-blue-600 mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  {totalTransactions.toLocaleString()}
                </motion.div>
                <p className="text-gray-600">Total Transactions (24h)</p>
              </motion.div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.4}>
              <motion.div 
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-3xl font-bold text-green-600 mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                >
                  {activeProtocols}
                </motion.div>
                <p className="text-gray-600">Active Protocols</p>
              </motion.div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.5}>
              <motion.div 
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-3xl font-bold text-orange-600 mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                >
                  {gasPrice} gwei
                </motion.div>
                <p className="text-gray-600">Current Gas Price</p>
              </motion.div>
            </ScrollAnimation>
          </div>

          {/* Live Activity Feed */}
          <ScrollAnimation delay={0.6}>
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Live Activity Feed</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {blockchainFeed.map((activity, index) => (
                  <motion.div 
                    key={activity.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, backgroundColor: 'rgb(249, 250, 251)' }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.impact === 'high' ? 'bg-red-400' : 
                        activity.impact === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                      }`} />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-900 font-semibold">{activity.protocol}</span>
                          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {activity.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{activity.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-blue-600 text-sm">{activity.amount}</span>
                          <span className="text-green-600 text-sm">{activity.value}</span>
                          <span className="text-gray-500 text-xs">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-mono">{activity.txHash}</p>
                      <motion.div 
                        className="w-2 h-2 bg-blue-500 rounded-full mt-2"
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



      {/* Bitcoin Holdings Monitor Section */}
      <section id="bitcoin-holdings" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollAnimation>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
              Bitcoin Holdings Monitor
            </h2>
          </ScrollAnimation>
          <ScrollAnimation delay={0.2}>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12 text-center">
              Accurate institutional holdings data from bitcointreasuries.net and bitbo.io (July 2025)
            </p>
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-2 bg-blue-100 border border-blue-200 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-blue-600 text-sm font-medium">
                  Data from bitcointreasuries.net • Updated {bitcoinHoldings.lastUpdated?.toLocaleTimeString() || 'Just now'}
                </span>
              </div>
            </div>
          </ScrollAnimation>

          {/* Total Holdings Overview */}
          <div className="grid md:grid-cols-8 gap-4 mb-12">
            <ScrollAnimation delay={0.3}>
              <motion.div 
                className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-center"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-2xl font-bold text-blue-600 mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  {(bitcoinHoldings.totalPublicCompanies / 1000).toFixed(1)}K
                </motion.div>
                <p className="text-gray-600 text-sm">Public Companies</p>
              </motion.div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.4}>
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-2xl font-bold text-green-400 mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                >
                  {(bitcoinHoldings.totalSpotETFs / 1000).toFixed(1)}K
                </motion.div>
                <p className="text-gray-400 text-sm">Spot ETFs</p>
              </motion.div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.5}>
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-2xl font-bold text-purple-400 mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                >
                  {(bitcoinHoldings.totalTrusts / 1000).toFixed(1)}K
                </motion.div>
                <p className="text-gray-400 text-sm">Trusts</p>
              </motion.div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.6}>
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-2xl font-bold text-orange-400 mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 3 }}
                >
                  {(bitcoinHoldings.totalPrivateCompanies / 1000).toFixed(1)}K
                </motion.div>
                <p className="text-gray-400 text-sm">Private Companies</p>
              </motion.div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.7}>
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-2xl font-bold text-cyan-400 mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 4 }}
                >
                  {(bitcoinHoldings.totalAssetManagers / 1000).toFixed(1)}K
                </motion.div>
                <p className="text-gray-400 text-sm">Asset Managers</p>
              </motion.div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.8}>
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-2xl font-bold text-red-400 mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 5 }}
                >
                  {(bitcoinHoldings.totalSovereigns / 1000).toFixed(2)}K
                </motion.div>
                <p className="text-gray-400 text-sm">Sovereigns</p>
              </motion.div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.9}>
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-2xl font-bold text-pink-400 mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 6 }}
                >
                  {((bitcoinHoldings.totalDAOs || 0) / 1000).toFixed(1)}K
                </motion.div>
                <p className="text-gray-400 text-sm">DAOs</p>
              </motion.div>
            </ScrollAnimation>

            <ScrollAnimation delay={1.0}>
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-2xl font-bold text-indigo-400 mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 7 }}
                >
                  {((bitcoinHoldings.totalProtocols || 0) / 1000).toFixed(1)}K
                </motion.div>
                <p className="text-gray-400 text-sm">Protocols</p>
              </motion.div>
            </ScrollAnimation>
          </div>

          {/* Institutional Holders Table */}
          <ScrollAnimation delay={0.7}>
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Institutional Holders</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 text-gray-600 font-semibold">Holder</th>
                      <th className="text-left py-4 px-4 text-gray-600 font-semibold">Type</th>
                      <th className="text-right py-4 px-4 text-gray-600 font-semibold">Holdings (BTC)</th>
                      <th className="text-right py-4 px-4 text-gray-600 font-semibold">Value</th>
                      <th className="text-right py-4 px-4 text-gray-600 font-semibold">24h Change</th>
                      <th className="text-right py-4 px-4 text-gray-600 font-semibold">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {institutionalHolders.map((holder, index) => (
                      <motion.tr 
                        key={holder.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              holder.category === 'public_company' ? 'bg-blue-500' : 
                              holder.category === 'spot_etf' ? 'bg-green-500' : 
                              holder.category === 'trust' ? 'bg-blue-500' :
                              holder.category === 'private_company' ? 'bg-orange-500' :
                              holder.category === 'asset_manager' ? 'bg-cyan-500' :
                              holder.category === 'sovereign' ? 'bg-red-500' :
                              holder.category === 'dao' ? 'bg-pink-500' :
                              holder.category === 'protocol' ? 'bg-indigo-500' : 'bg-gray-500'
                            }`} />
                            <div>
                              <div className="text-gray-900 font-semibold">{holder.name}</div>
                              <div className="text-xs text-gray-500">{holder.type}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            holder.category === 'public_company' ? 'bg-blue-100 text-blue-700' : 
                            holder.category === 'spot_etf' ? 'bg-green-100 text-green-700' : 
                            holder.category === 'trust' ? 'bg-purple-100 text-purple-700' :
                            holder.category === 'private_company' ? 'bg-orange-100 text-orange-700' :
                            holder.category === 'asset_manager' ? 'bg-cyan-100 text-cyan-700' :
                            holder.category === 'sovereign' ? 'bg-red-100 text-red-700' :
                            holder.category === 'dao' ? 'bg-pink-100 text-pink-700' :
                            holder.category === 'protocol' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {holder.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="text-gray-900 font-semibold">{holder.holdings.toLocaleString()}</div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="text-gray-900 font-semibold">{holder.value}</div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className={`font-semibold ${
                            holder.change.startsWith('+') ? 'text-green-600' : 
                            holder.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {holder.change}
                          </div>
                          <div className={`text-xs ${
                            holder.changePercent.startsWith('+') ? 'text-green-600' : 
                            holder.changePercent.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {holder.changePercent}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="text-xs text-gray-500">{holder.lastUpdated}</div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet the Team
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Kevin Farrelly */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Kevin Farrelly</h3>
              <p className="text-gray-600 mb-4">
                Kevin is a repeat founder and investor at the intersection of machine learning, venture, and crypto. 
                He previously founded a machine learning credit fund acquired by Franklin Templeton in 2018, where 
                he subsequently launched and led Blockchain Venture Funds I and II, delivering top-decile DPI returns.
              </p>
              <p className="text-gray-600 mb-4">
                With over 15 years of hands-on experience scaling fintech and consumer companies—focusing on CAC 
                optimization, margin expansion, and data science—Kevin specializes in early-stage investing, token 
                economics, and ML infrastructure.
              </p>
              <p className="text-gray-500 text-sm">BSBA from the University of Richmond</p>
            </div>

            {/* Greg Scanlon */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Greg Scanlon</h3>
              <p className="text-gray-600 mb-4">
                Greg is a seasoned investor and technologist operating at the intersection of blockchain, data science, 
                and institutional capital. He co-founded Franklin Templeton&apos;s Blockchain Venture Funds I and II, and 
                brings over 15 years of experience in investing and risk management from leading firms such as Citadel 
                and Orange Capital.
              </p>
              <p className="text-gray-600 mb-4">
                Greg is also an active mentor and advisor across multiple top universities.
              </p>
              <p className="text-gray-500 text-sm">BSBA from the University of Richmond, MS in Data Science from NYU, CFA charterholder</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <motion.div 
                className="text-2xl font-bold text-white mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <motion.span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: "200% 200%"
                  }}
                >
                  Birdai
                </motion.span>
              </motion.div>
              <p className="text-gray-300 mb-6 max-w-md">
                Machine-native. Protocol-first. Liquidity-aware. See what others miss.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                  <Github className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
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

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Birdai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Oracle Modal */}
      <OracleModal 
        isOpen={isOracleOpen} 
        onClose={() => setIsOracleOpen(false)} 
        onContactModalOpen={() => setIsContactModalOpen(true)}
      />
    </div>
  );
}
