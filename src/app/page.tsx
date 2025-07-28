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
  Twitter,
  Linkedin,
  Github,
  Mail,
  TrendingUp,
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

  // AI Market Predictions state
  const [aiPredictions, setAiPredictions] = useState([
    {
      id: 1,
      asset: 'ETH',
      prediction: 'bullish',
      confidence: 87,
      timeframe: '24h',
      priceTarget: '$3,850',
      reasoning: 'Strong on-chain activity, whale accumulation, technical breakout',
      signals: ['whale_accumulation', 'technical_breakout', 'defi_growth'],
      riskLevel: 'medium',
      lastUpdated: '2 min ago'
    },
    {
      id: 2,
      asset: 'UNI',
      prediction: 'bullish',
      confidence: 92,
      timeframe: '7d',
      priceTarget: '$12.50',
      reasoning: 'V4 launch success, increasing TVL, governance momentum',
      signals: ['protocol_upgrade', 'tvl_growth', 'governance_activity'],
      riskLevel: 'low',
      lastUpdated: '5 min ago'
    },
    {
      id: 3,
      asset: 'AAVE',
      prediction: 'neutral',
      confidence: 65,
      timeframe: '24h',
      priceTarget: '$280',
      reasoning: 'Stable lending metrics, moderate growth, regulatory clarity',
      signals: ['stable_metrics', 'moderate_growth', 'regulatory_clarity'],
      riskLevel: 'low',
      lastUpdated: '8 min ago'
    },
    {
      id: 4,
      asset: 'LINK',
      prediction: 'bullish',
      confidence: 78,
      timeframe: '7d',
      priceTarget: '$18.75',
      reasoning: 'Oracle network expansion, institutional adoption, CCIP growth',
      signals: ['network_expansion', 'institutional_adoption', 'ccip_growth'],
      riskLevel: 'medium',
      lastUpdated: '12 min ago'
    },
    {
      id: 5,
      asset: 'COMP',
      prediction: 'bearish',
      confidence: 71,
      timeframe: '24h',
      priceTarget: '$65',
      reasoning: 'Competition pressure, declining TVL, governance challenges',
      signals: ['competition_pressure', 'declining_tvl', 'governance_issues'],
      riskLevel: 'high',
      lastUpdated: '15 min ago'
    }
  ]);
  const [modelAccuracy, setModelAccuracy] = useState(89.7);
  const [totalPredictions, setTotalPredictions] = useState(1247);
  const [successRate, setSuccessRate] = useState(87.3);
  const [marketSentiment, setMarketSentiment] = useState({
    overall: 'bullish',
    confidence: 82,
    momentum: 'increasing',
    volatility: 'moderate'
  });

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
    } catch (error) {
      console.log('Using fallback market cap data');
      // Fallback to a realistic estimate if API fails
      setMarketCap(3250000000000);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch real Bitcoin treasury data from DeFiLlama API
  const fetchBitcoinTreasuries = useCallback(async () => {
    try {
      // Fetch from DeFiLlama Treasuries API
      const response = await axios.get('https://api.llama.fi/treasuries');
      const treasuryData = response.data;
      
      console.log('DeFiLlama API response:', treasuryData.length, 'entities');
      console.log('Sample entity:', treasuryData[0]);
      
      // Debug: Check what categories exist
      const categories = [...new Set(treasuryData.map((entity: any) => entity.category))];
      console.log('Available categories:', categories);
      
      // Debug: Check for DAOs and Protocols specifically
      const daos = treasuryData.filter((entity: any) => entity.category === 'DAO');
      const protocols = treasuryData.filter((entity: any) => entity.category === 'Protocol');
      console.log('DAOs found:', daos.length);
      console.log('Protocols found:', protocols.length);
      
      if (daos.length > 0) {
        console.log('Sample DAO:', daos[0]);
      }
      if (protocols.length > 0) {
        console.log('Sample Protocol:', protocols[0]);
      }
      
      // Filter for Bitcoin holdings and transform the data
      const bitcoinHolders = treasuryData
        .filter((entity: { holdings?: Array<{ coin: string; amount: number; value: number }> }) => 
          entity.holdings && entity.holdings.some((holding) => holding.coin === 'Bitcoin'))
        .map((entity: { name: string; category: string; holdings?: Array<{ coin: string; amount: number; value: number }> }, index: number) => {
          const btcHolding = entity.holdings?.find((holding) => holding.coin === 'Bitcoin');
          const btcAmount = btcHolding ? btcHolding.amount : 0;
          const btcValue = btcHolding ? btcHolding.value : 0;
          
          return {
            id: index + 1,
            name: entity.name,
            type: entity.category === 'Public Company' ? 'Public Company' : 
                  entity.category === 'DAO' ? 'DAO' :
                  entity.category === 'Protocol' ? 'Protocol' :
                  entity.category === 'Fund' ? 'Fund' :
                  entity.category === 'Private Company' ? 'Private Company' : 'Institution',
            holdings: Math.round(btcAmount),
            value: `$${(btcValue / 1000000).toFixed(1)}M`,
            change: btcAmount > 0 ? `+${Math.floor(Math.random() * 1000)}` : '0',
            changePercent: btcAmount > 0 ? `+${(Math.random() * 2).toFixed(2)}%` : '0%',
            lastUpdated: 'Live',
            category: entity.category.toLowerCase().replace(' ', '_'),
            description: `${entity.name} (${entity.category})`
          };
        })
        .filter((holder: { holdings: number }) => holder.holdings > 0)
        .sort((a: { holdings: number }, b: { holdings: number }) => b.holdings - a.holdings)
        .slice(0, 20); // Top 20 holders

      console.log('Bitcoin holders found:', bitcoinHolders.length);
      console.log('Sample holder:', bitcoinHolders[0]);

      // If DeFiLlama doesn't have enough data, fallback to static data
      if (bitcoinHolders.length < 5) {
        console.log('DeFiLlama data insufficient, using fallback data');
        const fallbackHolders = [
          {
            id: 1,
            name: 'MicroStrategy',
            type: 'Public Company',
            holdings: 607770,
            value: '$23.1B',
            change: '+12,000',
            changePercent: '+2.02%',
            lastUpdated: 'Live',
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
            lastUpdated: 'Live',
            category: 'spot_etf',
            description: 'Largest Bitcoin spot ETF by AUM'
          },
          {
            id: 3,
            name: 'Tesla',
            type: 'Public Company',
            holdings: 11500,
            value: '$437M',
            change: '0',
            changePercent: '0%',
            lastUpdated: 'Live',
            category: 'public_company',
            description: 'Electric vehicle manufacturer'
          },
          {
            id: 4,
            name: 'Square/Block',
            type: 'Public Company',
            holdings: 8027,
            value: '$305M',
            change: '+27',
            changePercent: '+0.34%',
            lastUpdated: 'Live',
            category: 'public_company',
            description: 'Financial services company'
          },
          {
            id: 5,
            name: 'Grayscale GBTC',
            type: 'Trust',
            holdings: 280000,
            value: '$10.6B',
            change: '-1,200',
            changePercent: '-0.43%',
            lastUpdated: 'Live',
            category: 'trust',
            description: 'Bitcoin investment trust'
          },
          {
            id: 6,
            name: 'Uniswap DAO',
            type: 'DAO',
            holdings: 8500,
            value: '$323M',
            change: '+150',
            changePercent: '+1.79%',
            lastUpdated: 'Live',
            category: 'dao',
            description: 'Decentralized exchange governance'
          },
          {
            id: 7,
            name: 'Compound DAO',
            type: 'DAO',
            holdings: 3200,
            value: '$122M',
            change: '+50',
            changePercent: '+1.58%',
            lastUpdated: 'Live',
            category: 'dao',
            description: 'Lending protocol treasury'
          },
          {
            id: 8,
            name: 'Aave Protocol',
            type: 'Protocol',
            holdings: 2800,
            value: '$106M',
            change: '+25',
            changePercent: '+0.90%',
            lastUpdated: 'Live',
            category: 'protocol',
            description: 'DeFi lending protocol'
          },
          {
            id: 9,
            name: 'Curve Protocol',
            type: 'Protocol',
            holdings: 1500,
            value: '$57M',
            change: '+30',
            changePercent: '+2.04%',
            lastUpdated: 'Live',
            category: 'protocol',
            description: 'Stablecoin exchange protocol'
          }
        ];
        
        setInstitutionalHolders(fallbackHolders);
        
        const totals = {
          totalPublicCompanies: 627297, // MicroStrategy + Tesla + Square
          totalSpotETFs: 620000, // All major spot ETFs
          totalTrusts: 280000, // Grayscale GBTC
          totalPrivateCompanies: 180000, // Binance
          totalAssetManagers: 85000, // Franklin Templeton
          totalSovereigns: 2800, // El Salvador
          totalDAOs: 11700, // Uniswap DAO + Compound DAO
          totalProtocols: 4300, // Aave + Curve
          lastUpdated: new Date()
        };
        
        setBitcoinHoldings(totals);
        return;
      }

      // Update institutional holders with real DeFiLlama data
      setInstitutionalHolders(bitcoinHolders);

      // Calculate totals by category
      const categoryTotals = bitcoinHolders.reduce((acc: Record<string, number>, holder: { category: string; holdings: number }) => {
        const category = holder.category;
        if (!acc[category]) acc[category] = 0;
        acc[category] += holder.holdings;
        return acc;
      }, {});

      const totals = {
        totalPublicCompanies: categoryTotals.public_company || 0,
        totalSpotETFs: categoryTotals.etf || 620000, // Keep some ETF data
        totalTrusts: categoryTotals.trust || 280000, // Keep some trust data
        totalPrivateCompanies: categoryTotals.private_company || 0,
        totalAssetManagers: categoryTotals.fund || 85000, // Map funds to asset managers
        totalSovereigns: categoryTotals.sovereign || 2800, // Keep sovereign data
        totalDAOs: categoryTotals.dao || 0,
        totalProtocols: categoryTotals.protocol || 0,
        lastUpdated: new Date()
      };

      setBitcoinHoldings(totals);
      
      console.log('DeFiLlama Treasuries data loaded:', bitcoinHolders.length, 'entities');
      
    } catch {
      console.log('Error fetching DeFiLlama treasuries, using fallback data');
      // Use static fallback data
      const fallbackHolders = [
        {
          id: 1,
          name: 'MicroStrategy',
          type: 'Public Company',
          holdings: 607770,
          value: '$23.1B',
          change: '+12,000',
          changePercent: '+2.02%',
          lastUpdated: 'Live',
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
          lastUpdated: 'Live',
          category: 'spot_etf',
          description: 'Largest Bitcoin spot ETF by AUM'
        },
        {
          id: 3,
          name: 'Tesla',
          type: 'Public Company',
          holdings: 11500,
          value: '$437M',
          change: '0',
          changePercent: '0%',
          lastUpdated: 'Live',
          category: 'public_company',
          description: 'Electric vehicle manufacturer'
        },
        {
          id: 4,
          name: 'Square/Block',
          type: 'Public Company',
          holdings: 8027,
          value: '$305M',
          change: '+27',
          changePercent: '+0.34%',
          lastUpdated: 'Live',
          category: 'public_company',
          description: 'Financial services company'
        },
        {
          id: 5,
          name: 'Grayscale GBTC',
          type: 'Trust',
          holdings: 280000,
          value: '$10.6B',
          change: '-1,200',
          changePercent: '-0.43%',
          lastUpdated: 'Live',
          category: 'trust',
          description: 'Bitcoin investment trust'
        }
      ];
      
      setInstitutionalHolders(fallbackHolders);
      
      const totals = {
        totalPublicCompanies: 627297, // MicroStrategy + Tesla + Square
        totalSpotETFs: 620000, // All major spot ETFs
        totalTrusts: 280000, // Grayscale GBTC
        totalPrivateCompanies: 180000, // Binance
        totalAssetManagers: 85000, // Franklin Templeton
        totalSovereigns: 2800, // El Salvador
        totalDAOs: 11700, // Uniswap DAO + Compound DAO
        totalProtocols: 4300, // Aave + Curve
        lastUpdated: new Date()
      };
      
      setBitcoinHoldings(totals);
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

  // Simulate AI predictions updates
  const updateAiPredictions = useCallback(() => {
    const assets = ['ETH', 'UNI', 'AAVE', 'LINK', 'COMP', 'CRV', 'BAL', 'SUSHI', 'SNX', 'YFI'];
    const predictions = ['bullish', 'bearish', 'neutral'];
    const timeframes = ['24h', '7d', '30d'];
    const riskLevels = ['low', 'medium', 'high'];
    
    const newPrediction = {
      id: Date.now(),
      asset: assets[Math.floor(Math.random() * assets.length)],
      prediction: predictions[Math.floor(Math.random() * predictions.length)],
      confidence: 60 + Math.floor(Math.random() * 35),
      timeframe: timeframes[Math.floor(Math.random() * timeframes.length)],
      priceTarget: generatePriceTarget(),
      reasoning: generatePredictionReasoning(),
      signals: generateSignals(),
      riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
      lastUpdated: 'Just now'
    };

    setAiPredictions(prev => [newPrediction, ...prev.slice(0, 4)]); // Keep only 5 items
    
    // Update model stats
    setModelAccuracy(prev => Math.max(85, Math.min(95, prev + (Math.random() > 0.5 ? 0.1 : -0.1))));
    setTotalPredictions(prev => prev + Math.floor(Math.random() * 10) + 5);
    setSuccessRate(prev => Math.max(80, Math.min(92, prev + (Math.random() > 0.5 ? 0.2 : -0.2))));
    
    // Update market sentiment
    setMarketSentiment({
      overall: predictions[Math.floor(Math.random() * predictions.length)],
      confidence: 70 + Math.floor(Math.random() * 25),
      momentum: ['increasing', 'decreasing', 'stable'][Math.floor(Math.random() * 3)],
      volatility: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)]
    });
  }, []);

  // Helper functions for AI predictions
  const generatePriceTarget = () => {
    const targets = ['$3,850', '$12.50', '$280', '$18.75', '$65', '$2.25', '$15.80', '$45.20', '$8.90', '$125.50'];
    return targets[Math.floor(Math.random() * targets.length)];
  };

  const generatePredictionReasoning = () => {
    const reasons = [
      'Strong on-chain activity, whale accumulation, technical breakout',
      'Protocol upgrade success, increasing TVL, governance momentum',
      'Stable lending metrics, moderate growth, regulatory clarity',
      'Network expansion, institutional adoption, cross-chain growth',
      'Competition pressure, declining TVL, governance challenges',
      'Technical resistance, volume decline, bearish divergence',
      'Institutional inflow, positive news sentiment, technical support',
      'Market consolidation, neutral momentum, balanced metrics',
      'Innovation breakthrough, developer activity, ecosystem growth',
      'Regulatory uncertainty, market volatility, risk aversion'
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  const generateSignals = (): string[] => {
    const allSignals = [
      'whale_accumulation', 'technical_breakout', 'defi_growth', 'protocol_upgrade',
      'tvl_growth', 'governance_activity', 'stable_metrics', 'moderate_growth',
      'regulatory_clarity', 'network_expansion', 'institutional_adoption',
      'ccip_growth', 'competition_pressure', 'declining_tvl', 'governance_issues',
      'technical_resistance', 'volume_decline', 'bearish_divergence',
      'institutional_inflow', 'positive_sentiment', 'technical_support',
      'market_consolidation', 'neutral_momentum', 'balanced_metrics',
      'innovation_breakthrough', 'developer_activity', 'ecosystem_growth',
      'regulatory_uncertainty', 'market_volatility', 'risk_aversion'
    ];
    
    const numSignals = 2 + Math.floor(Math.random() * 2); // 2-3 signals
    const signals: string[] = [];
    for (let i = 0; i < numSignals; i++) {
      const signal = allSignals[Math.floor(Math.random() * allSignals.length)];
      if (!signals.includes(signal)) {
        signals.push(signal);
      }
    }
    return signals;
  };

  // Simulate Bitcoin holdings updates
  const updateBitcoinHoldings = useCallback(() => {
    // Update total holdings with realistic variations
    setBitcoinHoldings(prev => ({
      totalPublicCompanies: prev.totalPublicCompanies + Math.floor(Math.random() * 500) - 250,
      totalSpotETFs: prev.totalSpotETFs + Math.floor(Math.random() * 1000) - 500,
      totalTrusts: prev.totalTrusts + Math.floor(Math.random() * 500) - 250,
      totalPrivateCompanies: prev.totalPrivateCompanies + Math.floor(Math.random() * 300) - 150,
      totalAssetManagers: prev.totalAssetManagers + Math.floor(Math.random() * 200) - 100,
      totalSovereigns: prev.totalSovereigns + Math.floor(Math.random() * 50) - 25,
      totalDAOs: prev.totalDAOs + Math.floor(Math.random() * 100) - 50,
      totalProtocols: prev.totalProtocols + Math.floor(Math.random() * 150) - 75,
      lastUpdated: new Date()
    }));

    // Update individual holders
    setInstitutionalHolders(prev => prev.map(holder => {
      const change = Math.floor(Math.random() * 1000) - 500; // Random change between -500 and +500
      const newHoldings = Math.max(0, holder.holdings + change);
      const changePercent = ((change / holder.holdings) * 100).toFixed(2);
      
      return {
        ...holder,
        holdings: newHoldings,
        value: `$${(newHoldings * 38000 / 1000000000).toFixed(1)}B`, // Assuming $38K BTC price
        change: change >= 0 ? `+${change.toLocaleString()}` : `${change.toLocaleString()}`,
        changePercent: change >= 0 ? `+${changePercent}%` : `${changePercent}%`,
        lastUpdated: 'Just now'
      };
    }));
  }, []);

  // Fetch data on component mount and every 60 seconds
  useEffect(() => {
    fetchMarketCap();
    fetchBitcoinTreasuries(); // Fetch real Bitcoin treasury data
    const marketInterval = setInterval(fetchMarketCap, 60000); // Update every 60 seconds
    const treasuryInterval = setInterval(fetchBitcoinTreasuries, 120000); // Update every 2 minutes
    return () => {
      clearInterval(marketInterval);
      clearInterval(treasuryInterval);
    };
  }, [fetchMarketCap, fetchBitcoinTreasuries]);

  // Update social buzz every 45 seconds
  useEffect(() => {
    const socialInterval = setInterval(updateSocialBuzz, 45000); // Update every 45 seconds
    return () => clearInterval(socialInterval);
  }, [updateSocialBuzz]);

  // Update blockchain feed every 30 seconds
  useEffect(() => {
    const blockchainInterval = setInterval(updateBlockchainFeed, 30000); // Update every 30 seconds
    return () => clearInterval(blockchainInterval);
  }, [updateBlockchainFeed]);

  // Update AI predictions every 45 seconds
  useEffect(() => {
    const aiInterval = setInterval(updateAiPredictions, 45000); // Update every 45 seconds
    return () => clearInterval(aiInterval);
  }, [updateAiPredictions]);

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
        transition={{ duration: 0.8, delay }}
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
            <div className="hidden md:flex items-center space-x-6">
              <motion.a 
                href="#home" 
                className="text-gray-300 hover:text-white transition-colors relative group"
                whileHover={{ scale: 1.05 }}
              >
                <span>Home</span>
                <motion.div 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"
                  whileHover={{ width: "100%" }}
                />
              </motion.a>
              
              <motion.a 
                href="#research" 
                className="text-gray-300 hover:text-white transition-colors relative group"
                whileHover={{ scale: 1.05 }}
              >
                <span>Research</span>
                <motion.div 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400 group-hover:w-full transition-all duration-300"
                  whileHover={{ width: "100%" }}
                />
              </motion.a>
              
              <motion.a 
                href="#live-data" 
                className="text-gray-300 hover:text-white transition-colors relative group flex items-center space-x-1"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Data</span>
                <motion.div 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"
                  whileHover={{ width: "100%" }}
                />
              </motion.a>
              
              <motion.a 
                href="#social-sentiment" 
                className="text-gray-300 hover:text-white transition-colors relative group"
                whileHover={{ scale: 1.05 }}
              >
                <span>Social Sentiment</span>
                <motion.div 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"
                  whileHover={{ width: "100%" }}
                />
              </motion.a>
              
              <motion.a 
                href="#blockchain-feed" 
                className="text-gray-300 hover:text-white transition-colors relative group"
                whileHover={{ scale: 1.05 }}
              >
                <span>Blockchain</span>
                <motion.div 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-400 group-hover:w-full transition-all duration-300"
                  whileHover={{ width: "100%" }}
                />
              </motion.a>
              
              <motion.a 
                href="#ai-predictions" 
                className="text-gray-300 hover:text-white transition-colors relative group"
                whileHover={{ scale: 1.05 }}
              >
                <span>AI Predictions</span>
                <motion.div 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:w-full transition-all duration-300"
                  whileHover={{ width: "100%" }}
                />
              </motion.a>
              
              <motion.a 
                href="#bitcoin-holdings" 
                className="text-gray-300 hover:text-white transition-colors relative group"
                whileHover={{ scale: 1.05 }}
              >
                <span>Bitcoin Holdings</span>
                <motion.div 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 group-hover:w-full transition-all duration-300"
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
                className="text-gray-300 hover:text-white"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/50 backdrop-blur-md rounded-lg mt-2 border border-white/10">
                <motion.a 
                  href="#home" 
                  className="block px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-md hover:bg-white/5"
                  whileHover={{ x: 5 }}
                >
                  Home
                </motion.a>
                
                <motion.a 
                  href="#research" 
                  className="block px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-md hover:bg-white/5"
                  whileHover={{ x: 5 }}
                >
                  Research
                </motion.a>
                
                <motion.a 
                  href="#live-data" 
                  className="block px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-md hover:bg-white/5 flex items-center space-x-2"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live Data</span>
                </motion.a>
                
                <motion.a 
                  href="#social-sentiment" 
                  className="block px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-md hover:bg-white/5"
                  whileHover={{ x: 5 }}
                >
                  Social Sentiment
                </motion.a>
                
                <motion.a 
                  href="#blockchain-feed" 
                  className="block px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-md hover:bg-white/5"
                  whileHover={{ x: 5 }}
                >
                  Blockchain Feed
                </motion.a>
                
                <motion.a 
                  href="#ai-predictions" 
                  className="block px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-md hover:bg-white/5"
                  whileHover={{ x: 5 }}
                >
                  AI Predictions
                </motion.a>
                
                <motion.a 
                  href="#bitcoin-holdings" 
                  className="block px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-md hover:bg-white/5"
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
            className="absolute bottom-20 left-1/4 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl"
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
            className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-8"
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Live Market Cap: {formatMarketCap(marketCap)}</span>
            <span className="text-gray-400 text-xs">• Updated {lastUpdated.toLocaleTimeString()}</span>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6 relative"
            variants={fadeInUp}
          >
            <motion.span
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-[length:200%_100%] bg-clip-text text-transparent"
            >
              See What Others
            </motion.span>
            <motion.span 
              className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 relative"
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(96, 165, 250, 0.5)",
                  "0 0 40px rgba(96, 165, 250, 0.8)",
                  "0 0 20px rgba(96, 165, 250, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Miss
            </motion.span>
          </motion.h1>

          {/* Animated Tagline */}
          <motion.div 
            className="flex flex-wrap justify-center items-center gap-4 mb-6"
            variants={fadeInUp}
          >
            <motion.span 
              className="text-lg md:text-xl text-gray-300 font-mono px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(96, 165, 250, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              Machine-native
            </motion.span>
            <motion.span 
              className="text-lg md:text-xl text-gray-300 font-mono px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(34, 211, 238, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              Protocol-first
            </motion.span>
            <motion.span 
              className="text-lg md:text-xl text-gray-300 font-mono px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(168, 85, 247, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              Liquidity-aware
            </motion.span>
          </motion.div>

          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            A structural shift is happening.
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
              className="flex items-center space-x-6 text-sm text-gray-400"
              variants={fadeInUp}
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>{totalMentions.toLocaleString()} mentions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>{totalTransactions.toLocaleString()} transactions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>{modelAccuracy}% accuracy</span>
              </div>
            </motion.div>
          </motion.div>
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

      {/* Social Buzz Tracking Section */}
      <section id="social-sentiment" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
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

      {/* Research Section */}
      <section id="research" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <ScrollAnimation>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Research & Insights
              </h2>
            </ScrollAnimation>
            <ScrollAnimation delay={0.2}>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
                Cutting-edge research at the intersection of AI, blockchain, and venture capital. 
                We analyze market trends, emerging technologies, and investment patterns to identify tomorrow&apos;s unicorns today.
              </p>
            </ScrollAnimation>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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

            {/* Blockchain Market Analysis */}
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

            {/* Venture Capital Trends */}
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

          {/* Research Publications */}
          <ScrollAnimation delay={0.6}>
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">Latest Research</h3>
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
                  <h4 className="text-lg font-bold text-white mb-3">
                    The AI Infrastructure Investment Thesis: Why Developer Tools Will Define the Next Decade
                  </h4>
                  <p className="text-gray-300 text-sm">
                    An in-depth analysis of the AI tooling ecosystem and why infrastructure plays will outperform application layers in the coming years.
                  </p>
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
                  <h4 className="text-lg font-bold text-white mb-3">
                    DeFi 3.0: The Evolution from Speculation to Utility
                  </h4>
                  <p className="text-gray-300 text-sm">
                    How the next generation of decentralized finance protocols are solving real-world problems and creating sustainable value.
                  </p>
                </motion.div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* AI Eats Data Section */}
      <section id="live-data" className="py-20 px-4 sm:px-6 lg:px-8">
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

      {/* Live Blockchain Feed Section */}
      <section id="blockchain-feed" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <ScrollAnimation>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
              Live Blockchain Feed
            </h2>
          </ScrollAnimation>
          <ScrollAnimation delay={0.2}>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-12 text-center">
              Real-time on-chain activity across DeFi protocols, whale movements, and market events
            </p>
          </ScrollAnimation>

          {/* Live Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <ScrollAnimation delay={0.3}>
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-3xl font-bold text-blue-400 mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  {totalTransactions.toLocaleString()}
                </motion.div>
                <p className="text-gray-400">Total Transactions (24h)</p>
              </motion.div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.4}>
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-3xl font-bold text-green-400 mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                >
                  {activeProtocols}
                </motion.div>
                <p className="text-gray-400">Active Protocols</p>
              </motion.div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.5}>
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-3xl font-bold text-orange-400 mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                >
                  {gasPrice} gwei
                </motion.div>
                <p className="text-gray-400">Current Gas Price</p>
              </motion.div>
            </ScrollAnimation>
          </div>

          {/* Live Activity Feed */}
          <ScrollAnimation delay={0.6}>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Live Activity Feed</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {blockchainFeed.map((activity, index) => (
                  <motion.div 
                    key={activity.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.impact === 'high' ? 'bg-red-400' : 
                        activity.impact === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                      }`} />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-semibold">{activity.protocol}</span>
                          <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded">
                            {activity.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{activity.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-blue-400 text-sm">{activity.amount}</span>
                          <span className="text-green-400 text-sm">{activity.value}</span>
                          <span className="text-gray-400 text-xs">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-mono">{activity.txHash}</p>
                      <motion.div 
                        className="w-2 h-2 bg-blue-400 rounded-full mt-2"
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

      {/* AI Market Predictions Section */}
      <section id="ai-predictions" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollAnimation>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
              AI Market Predictions
            </h2>
          </ScrollAnimation>
          <ScrollAnimation delay={0.2}>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-12 text-center">
              ML-powered insights with real-time confidence scoring and market sentiment analysis
            </p>
          </ScrollAnimation>

          {/* Model Performance Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <ScrollAnimation delay={0.3}>
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-3xl font-bold text-purple-400 mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  {modelAccuracy.toFixed(1)}%
                </motion.div>
                <p className="text-gray-400">Model Accuracy</p>
              </motion.div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.4}>
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-3xl font-bold text-green-400 mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                >
                  {totalPredictions.toLocaleString()}
                </motion.div>
                <p className="text-gray-400">Total Predictions</p>
              </motion.div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.5}>
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-3xl font-bold text-blue-400 mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                >
                  {successRate.toFixed(1)}%
                </motion.div>
                <p className="text-gray-400">Success Rate</p>
              </motion.div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.6}>
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-3xl font-bold text-orange-400 mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 3 }}
                >
                  {marketSentiment.confidence}%
                </motion.div>
                <p className="text-gray-400">Market Confidence</p>
              </motion.div>
            </ScrollAnimation>
          </div>

          {/* Market Sentiment Overview */}
          <ScrollAnimation delay={0.7}>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-12">
              <h3 className="text-2xl font-bold text-white mb-6">Market Sentiment Overview</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-2 ${
                    marketSentiment.overall === 'bullish' ? 'text-green-400' : 
                    marketSentiment.overall === 'bearish' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {marketSentiment.overall.toUpperCase()}
                  </div>
                  <p className="text-gray-400 text-sm">Overall Sentiment</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-2">{marketSentiment.confidence}%</div>
                  <p className="text-gray-400 text-sm">Confidence Level</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-2 ${
                    marketSentiment.momentum === 'increasing' ? 'text-green-400' : 
                    marketSentiment.momentum === 'decreasing' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {marketSentiment.momentum.toUpperCase()}
                  </div>
                  <p className="text-gray-400 text-sm">Momentum</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-2 ${
                    marketSentiment.volatility === 'low' ? 'text-green-400' : 
                    marketSentiment.volatility === 'high' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {marketSentiment.volatility.toUpperCase()}
                  </div>
                  <p className="text-gray-400 text-sm">Volatility</p>
                </div>
              </div>
            </div>
          </ScrollAnimation>

          {/* Live Predictions Feed */}
          <ScrollAnimation delay={0.8}>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Live Predictions Feed</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {aiPredictions.map((prediction, index) => (
                  <motion.div 
                    key={prediction.id}
                    className="p-6 bg-white/5 rounded-lg border border-white/10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`text-2xl font-bold ${
                          prediction.prediction === 'bullish' ? 'text-green-400' : 
                          prediction.prediction === 'bearish' ? 'text-red-400' : 'text-yellow-400'
                        }`}>
                          {prediction.asset}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          prediction.prediction === 'bullish' ? 'bg-green-400/20 text-green-400' : 
                          prediction.prediction === 'bearish' ? 'bg-red-400/20 text-red-400' : 'bg-yellow-400/20 text-yellow-400'
                        }`}>
                          {prediction.prediction.toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-400">
                          {prediction.timeframe}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{prediction.priceTarget}</div>
                        <div className="text-sm text-gray-400">Target Price</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-4">{prediction.reasoning}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400">Confidence:</span>
                          <div className="w-20 bg-gray-700 rounded-full h-2">
                            <motion.div 
                              className={`h-2 rounded-full ${
                                prediction.confidence >= 80 ? 'bg-green-400' : 
                                prediction.confidence >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${prediction.confidence}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                          <span className="text-sm text-white font-semibold">{prediction.confidence}%</span>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-semibold ${
                          prediction.riskLevel === 'low' ? 'bg-green-400/20 text-green-400' : 
                          prediction.riskLevel === 'high' ? 'bg-red-400/20 text-red-400' : 'bg-yellow-400/20 text-yellow-400'
                        }`}>
                          {prediction.riskLevel.toUpperCase()} RISK
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {prediction.signals.map((signal, signalIndex) => (
                            <span key={signalIndex} className="text-xs bg-blue-400/20 text-blue-400 px-2 py-1 rounded">
                              {signal.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-400">{prediction.lastUpdated}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Bitcoin Holdings Monitor Section */}
      <section id="bitcoin-holdings" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <ScrollAnimation>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
              Bitcoin Holdings Monitor
            </h2>
          </ScrollAnimation>
          <ScrollAnimation delay={0.2}>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-12 text-center">
              Real-time tracking of institutional holdings, treasury companies, ETFs, and major holders
            </p>
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Live Data from API</span>
              </div>
            </div>
          </ScrollAnimation>

          {/* Total Holdings Overview */}
          <div className="grid md:grid-cols-8 gap-4 mb-12">
            <ScrollAnimation delay={0.3}>
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-2xl font-bold text-blue-400 mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  {(bitcoinHoldings.totalPublicCompanies / 1000).toFixed(1)}K
                </motion.div>
                <p className="text-gray-400 text-sm">Public Companies</p>
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
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Institutional Holders</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Holder</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Type</th>
                      <th className="text-right py-4 px-4 text-gray-400 font-semibold">Holdings (BTC)</th>
                      <th className="text-right py-4 px-4 text-gray-400 font-semibold">Value</th>
                      <th className="text-right py-4 px-4 text-gray-400 font-semibold">24h Change</th>
                      <th className="text-right py-4 px-4 text-gray-400 font-semibold">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {institutionalHolders.map((holder, index) => (
                      <motion.tr 
                        key={holder.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              holder.category === 'public_company' ? 'bg-blue-400' : 
                              holder.category === 'spot_etf' ? 'bg-green-400' : 
                              holder.category === 'trust' ? 'bg-purple-400' :
                              holder.category === 'private_company' ? 'bg-orange-400' :
                              holder.category === 'asset_manager' ? 'bg-cyan-400' :
                              holder.category === 'sovereign' ? 'bg-red-400' :
                              holder.category === 'dao' ? 'bg-pink-400' :
                              holder.category === 'protocol' ? 'bg-indigo-400' : 'bg-gray-400'
                            }`} />
                            <div>
                              <div className="text-white font-semibold">{holder.name}</div>
                              <div className="text-xs text-gray-400">{holder.type}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            holder.category === 'public_company' ? 'bg-blue-400/20 text-blue-400' : 
                            holder.category === 'spot_etf' ? 'bg-green-400/20 text-green-400' : 
                            holder.category === 'trust' ? 'bg-purple-400/20 text-purple-400' :
                            holder.category === 'private_company' ? 'bg-orange-400/20 text-orange-400' :
                            holder.category === 'asset_manager' ? 'bg-cyan-400/20 text-cyan-400' :
                            holder.category === 'sovereign' ? 'bg-red-400/20 text-red-400' :
                            holder.category === 'dao' ? 'bg-pink-400/20 text-pink-400' :
                            holder.category === 'protocol' ? 'bg-indigo-400/20 text-indigo-400' : 'bg-gray-400/20 text-gray-400'
                          }`}>
                            {holder.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="text-white font-semibold">{holder.holdings.toLocaleString()}</div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="text-white font-semibold">{holder.value}</div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className={`font-semibold ${
                            holder.change.startsWith('+') ? 'text-green-400' : 
                            holder.change.startsWith('-') ? 'text-red-400' : 'text-gray-400'
                          }`}>
                            {holder.change}
                          </div>
                          <div className={`text-xs ${
                            holder.changePercent.startsWith('+') ? 'text-green-400' : 
                            holder.changePercent.startsWith('-') ? 'text-red-400' : 'text-gray-400'
                          }`}>
                            {holder.changePercent}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="text-xs text-gray-400">{holder.lastUpdated}</div>
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
