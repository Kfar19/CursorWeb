'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Activity, Users, GasPump, TrendingUp, Clock, ExternalLink, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface NetworkStats {
  tps: number;
  totalValidators: number;
  activeValidators: number;
  referenceGasPrice: number;
  totalSupply: number;
  circulatingSupply: number;
  currentEpoch: number;
  currentCheckpoint: number;
  timestamp: number;
}

interface Transaction {
  digest: string;
  timestamp: number;
  status: string;
  gasUsed: number;
  gasPrice: number;
  sender: string;
  type: string;
  amount: number;
  recipient: string;
}

interface PriceData {
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  timestamp: number;
}

export default function SuiDashboard() {
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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
      const [statsRes, txRes, priceRes] = await Promise.all([
        fetch('/api/sui/network-stats'),
        fetch('/api/sui/recent-transactions'),
        fetch('/api/sui/price')
      ]);

      if (statsRes.ok) {
        const stats = await statsRes.json();
        setNetworkStats(stats);
      }

      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData.transactions);
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

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    if (minutes > 0) return `${minutes}m ${seconds}s ago`;
    return `${seconds}s ago`;
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
                <p className="text-gray-400">Real-time network statistics and transactions</p>
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
        {/* Network Stats Grid */}
        {networkStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div 
              className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Transactions/sec</p>
                  <p className="text-2xl font-bold text-white">{networkStats.tps}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-400" />
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
                  <p className="text-gray-400 text-sm">Active Validators</p>
                  <p className="text-2xl font-bold text-white">{networkStats.activeValidators}</p>
                </div>
                <Users className="w-8 h-8 text-green-400" />
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
                  <p className="text-2xl font-bold text-white">{networkStats.referenceGasPrice}</p>
                </div>
                <GasPump className="w-8 h-8 text-yellow-400" />
              </div>
            </motion.div>

            <motion.div 
              className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Current Epoch</p>
                  <p className="text-2xl font-bold text-white">{networkStats.currentEpoch}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </motion.div>
          </div>
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

        {/* Recent Transactions */}
        <motion.div 
          className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {transactions.map((tx, index) => (
                  <motion.tr 
                    key={tx.digest}
                    className="hover:bg-white/5 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.type === 'Transfer' ? 'bg-blue-100 text-blue-800' :
                        tx.type === 'NFT' ? 'bg-purple-100 text-purple-800' :
                        tx.type === 'Smart Contract' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {tx.amount > 0 ? `${tx.amount.toFixed(4)} SUI` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {formatAddress(tx.sender)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {formatAddress(tx.recipient)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {tx.gasUsed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {formatTime(tx.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
                 </motion.div>
       </div>
     </div>
   );
 } 