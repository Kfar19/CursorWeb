'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Activity, Users, GasPump, TrendingUp, Clock, ExternalLink, ArrowUpRight, ArrowDownRight, X, Copy } from 'lucide-react';

interface NetworkActivity {
  timestamp: number;
  networkStats: {
    currentCheckpoint: number;
    totalValidators: number;
    referenceGasPrice: number;
    totalSupply: number;
    activeAddresses: number;
  };
  transactionVolume: {
    totalTransactions: number;
    totalVolume: number;
    averageTransactionSize: number;
    volumeByType: { [key: string]: number };
  };
  gasTrends: {
    currentGasPrice: number;
    averageGasUsed: number;
    gasPriceHistory: number[];
    gasUsageDistribution: { [key: string]: number };
  };
  networkCongestion: {
    level: string;
    score: number;
    gasPrice: number;
    averageGasUsed: number;
    transactionCount: number;
  };
  defiActivity: Array<{
    name: string;
    transactions: number;
    volume: number;
  }>;
  transactionTypes: { [key: string]: number };
}

interface PriceData {
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  timestamp: number;
}

export default function SuiDashboard() {
  const [networkActivity, setNetworkActivity] = useState<NetworkActivity | null>(null);
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [activityRes, priceRes] = await Promise.all([
        fetch('/api/sui/network-activity'),
        fetch('/api/sui/price')
      ]);

      if (activityRes.ok) {
        const activity = await activityRes.json();
        setNetworkActivity(activity);
      }

      if (priceRes.ok) {
        const price = await priceRes.json();
        setPriceData(price);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  const formatAddress = (address: string) => {
    if (!address || address === 'Unknown') return 'Unknown';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getCongestionColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getCongestionBgColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'bg-red-500/20 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 border-green-500/30';
      default: return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <motion.div
          className="text-white text-xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading Sui Dashboard...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-xl mb-4">Error: {error}</div>
          <button 
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-white hover:text-blue-400 transition-colors">
                <ArrowLeft size={24} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Sui Blockchain Dashboard</h1>
                <p className="text-gray-400">Real-time network statistics and transactions • Built on Move</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">
                {priceData ? `$${priceData.price.toFixed(4)}` : 'Loading...'}
              </div>
              {priceData && (
                <div className={`text-sm ${priceData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {priceData.change24h >= 0 ? '+' : ''}{priceData.change24h.toFixed(2)}%
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Network Activity Overview */}
        {networkActivity && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div 
              className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Addresses</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(networkActivity.networkStats.activeAddresses)}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </motion.div>

            <motion.div 
              className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Transactions</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(networkActivity.transactionVolume.totalTransactions)}</p>
                </div>
                <Activity className="w-8 h-8 text-green-400" />
              </div>
            </motion.div>

            <motion.div 
              className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Gas Price</p>
                  <p className="text-2xl font-bold text-white">{networkActivity.gasTrends.currentGasPrice}</p>
                </div>
                <GasPump className="w-8 h-8 text-yellow-400" />
              </div>
            </motion.div>

            <motion.div 
              className={`backdrop-blur-md rounded-xl p-6 border ${getCongestionBgColor(networkActivity.networkCongestion.level)}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Network Congestion</p>
                  <p className={`text-2xl font-bold ${getCongestionColor(networkActivity.networkCongestion.level)}`}>
                    {networkActivity.networkCongestion.level}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </motion.div>
          </div>
        )}

        {/* Transaction Volume Analysis */}
        {networkActivity && (
          <motion.div 
            className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">Transaction Volume Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-gray-400 text-sm">Total Volume</p>
                <p className="text-2xl font-bold text-white">{networkActivity.transactionVolume.totalVolume.toFixed(2)} SUI</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Average Transaction Size</p>
                <p className="text-2xl font-bold text-white">{networkActivity.transactionVolume.averageTransactionSize.toFixed(4)} SUI</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Average Gas Used</p>
                <p className="text-2xl font-bold text-white">{formatNumber(networkActivity.gasTrends.averageGasUsed)} MIST</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Top DeFi Protocols */}
        {networkActivity && networkActivity.defiActivity.length > 0 && (
          <motion.div 
            className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">Top DeFi Protocols</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {networkActivity.defiActivity.map((protocol, index) => (
                <div key={protocol.name} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">{protocol.name}</h3>
                    <span className="text-sm text-gray-400">#{index + 1}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">
                      Transactions: <span className="text-white">{protocol.transactions}</span>
                    </p>
                    <p className="text-sm text-gray-400">
                      Volume: <span className="text-white">{protocol.volume.toFixed(2)} SUI</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Transaction Type Distribution */}
        {networkActivity && (
          <motion.div 
            className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">Transaction Type Distribution</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(networkActivity.transactionTypes).map(([type, count]) => (
                <div key={type} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-sm text-gray-400 mb-1">{type}</p>
                  <p className="text-xl font-bold text-white">{count}</p>
                  <p className="text-xs text-gray-500">
                    {((count / networkActivity.transactionVolume.totalTransactions) * 100).toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Market Data */}
        {priceData && (
          <motion.div 
            className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">Market Data</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-gray-400 text-sm">Market Cap</p>
                <p className="text-lg font-semibold text-white">${formatNumber(priceData.marketCap)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">24h Volume</p>
                <p className="text-lg font-semibold text-white">${formatNumber(priceData.volume24h)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">24h Change</p>
                <p className={`text-lg font-semibold ${priceData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {priceData.change24h >= 0 ? '+' : ''}{priceData.change24h.toFixed(2)}%
                </p>
              </div>
            </div>
          </motion.div>
        )}




       </div>
     </div>
   );
 } 