'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, X, Eye, Mail, TrendingUp, ExternalLink, Twitter, Linkedin } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

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

// PDF Viewer Component
const PDFViewer = ({ isOpen, onClose, fileName }: { 
  isOpen: boolean; 
  onClose: () => void; 
  fileName: string;
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-black rounded-2xl w-full max-w-6xl h-[90vh] border border-white/20 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">{fileName.replace('.pdf', '')}</h3>
              <p className="text-gray-400 text-sm">Research Paper</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 p-6">
          <iframe
            src={`/research/${fileName}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full rounded-lg border border-white/10"
            title={fileName}
          />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              This research paper is for internal use only. Please do not share or distribute.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Eye size={16} />
                <span>View Only</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">Share:</span>
                <button
                  onClick={() => {
                    const paperSlug = fileName === 'From Rails to Returns_ Payments Circle.pdf' ? 'from-rails-to-returns' : 'from-wires-to-wallets';
                    const text = `Check out this research paper "${fileName.replace('.pdf', '')}" from Birdai - cutting-edge insights at the intersection of AI, blockchain, and venture capital.`;
                    const url = `${window.location.origin}/research/${paperSlug}`;
                    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                    window.open(twitterUrl, '_blank');
                  }}
                  className="text-blue-400 hover:text-blue-300 transition-colors p-2 rounded-lg hover:bg-blue-500/10"
                  title="Share on Twitter"
                >
                  <Twitter size={18} />
                </button>
                <button
                  onClick={() => {
                    const paperSlug = fileName === 'From Rails to Returns_ Payments Circle.pdf' ? 'from-rails-to-returns' : 'from-wires-to-wallets';
                    const text = `Check out this research paper "${fileName.replace('.pdf', '')}" from Birdai - cutting-edge insights at the intersection of AI, blockchain, and venture capital.`;
                    const url = `${window.location.origin}/research/${paperSlug}`;
                    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(fileName.replace('.pdf', ''))}&summary=${encodeURIComponent(text)}`;
                    window.open(linkedinUrl, '_blank');
                  }}
                  className="text-blue-600 hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-blue-600/10"
                  title="Share on LinkedIn"
                >
                  <Linkedin size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Email Capture Modal Component
const EmailCaptureModal = ({ isOpen, onClose, onEmailSubmit, fileName }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onEmailSubmit: (email: string) => void;
  fileName: string;
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onEmailSubmit(email);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 max-w-md w-full border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Access Research Paper</h3>
          <p className="text-gray-300 text-sm">
            Enter your work email to read &ldquo;{fileName}&rdquo;
          </p>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Work Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@company.com"
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || !email}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Eye size={20} />
                <span>Read Research Paper</span>
              </>
            )}
          </button>
        </form>

        {/* Privacy Note */}
        <p className="text-gray-400 text-xs text-center mt-4">
          We respect your privacy. Your email will only be used to send you research updates.
        </p>
      </motion.div>
    </motion.div>
  );
};

// Crypto Treasuries Component
const CryptoTreasuries = () => {
  const [treasuryData, setTreasuryData] = useState<Array<{
    company: string;
    crypto: string;
    ticker: string;
    cryptoOwned: number;
    yahoo: string;
    treasuryValue?: number;
    marketCap?: number;
    operatingCashFlow?: number;
    obligationRate?: number;
    shortPercent?: number;
    shortDays?: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const cryptoTreasuries = useMemo(() => [
    { company: 'Strategy', crypto: 'BTC', ticker: 'MSTR', cryptoOwned: 597325, yahoo: 'https://finance.yahoo.com/quote/MSTR/key-statistics/' },
    { company: 'Marathon Digital', crypto: 'BTC', ticker: 'MARA', cryptoOwned: 14402, yahoo: 'https://finance.yahoo.com/quote/MARA/key-statistics/' },
    { company: 'Riot Platforms', crypto: 'BTC', ticker: 'RIOT', cryptoOwned: 12530, yahoo: 'https://finance.yahoo.com/quote/RIOT/key-statistics/' },
    { company: 'Bitfarms', crypto: 'BTC', ticker: 'BITF', cryptoOwned: 11858, yahoo: 'https://finance.yahoo.com/quote/BITF/key-statistics/' },
    { company: 'Hut8', crypto: 'BTC', ticker: 'HUT', cryptoOwned: 5000, yahoo: 'https://finance.yahoo.com/quote/HUT/key-statistics/' },
    { company: 'ProCap | Columbus Circle', crypto: 'BTC', ticker: 'CCCM', cryptoOwned: 4717, yahoo: 'https://finance.yahoo.com/quote/CCCM/key-statistics/' },
    { company: 'Trump Media', crypto: 'BTC', ticker: 'DJT', cryptoOwned: 21186, yahoo: 'https://finance.yahoo.com/quote/DJT/key-statistics/' },
    { company: 'Twenty - One', crypto: 'BTC', ticker: 'CEP', cryptoOwned: 43500, yahoo: 'https://finance.yahoo.com/quote/CEP/key-statistics/' },
    { company: 'Sharplink Gaming', crypto: 'ETH', ticker: 'SBET', cryptoOwned: 390607, yahoo: 'https://finance.yahoo.com/quote/SBET/key-statistics/' },
    { company: 'Bitminer', crypto: 'ETH', ticker: 'BMNR', cryptoOwned: 566776, yahoo: 'https://finance.yahoo.com/quote/BMNR/key-statistics/' },
    { company: 'Upexi', crypto: 'SOL', ticker: 'UPXI', cryptoOwned: 2631579, yahoo: 'https://finance.yahoo.com/quote/UPXI/key-statistics/' },
    { company: 'Mill City', crypto: 'SUI', ticker: '', cryptoOwned: 0, yahoo: '' },
    { company: 'DeFi Dev Corp', crypto: 'SOL', ticker: 'DFDV', cryptoOwned: 1180000, yahoo: 'https://finance.yahoo.com/quote/DFDV/key-statistics/' },
    { company: 'YZi Labs', crypto: 'BNB', ticker: 'VAPE', cryptoOwned: 635324, yahoo: 'https://finance.yahoo.com/quote/VAPE/key-statistics/' },
    { company: 'ReserveOne', crypto: 'BTC, ETH, SOL', ticker: 'MBAV', cryptoOwned: 8475, yahoo: 'https://finance.yahoo.com/quote/MBAV/key-statistics/' },
    { company: 'Tron Inc', crypto: 'TRX', ticker: 'SRM.O', cryptoOwned: 303030303, yahoo: '' }
  ], []);

  useEffect(() => {
    const fetchTreasuryData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/crypto-treasuries');
        if (!response.ok) {
          throw new Error('Failed to fetch treasury data');
        }
        const data = await response.json();
        setTreasuryData(data);
        setLastUpdated(new Date());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Use static data as fallback
        setTreasuryData(cryptoTreasuries);
        setLastUpdated(new Date());
      } finally {
        setLoading(false);
      }
    };

    fetchTreasuryData();
  }, [cryptoTreasuries]);

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatCrypto = (amount: number, crypto: string) => {
    if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M ${crypto}`;
    if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)}K ${crypto}`;
    return `${amount.toLocaleString()} ${crypto}`;
  };

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Crypto Treasuries</h2>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading treasury data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-lg">
      <div className="flex items-center justify-center mb-8">
        <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
        <h2 className="text-3xl font-bold text-gray-900">Crypto Treasuries</h2>
        <div className="flex items-center ml-4">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
          <span className="text-green-600 text-sm font-medium">LIVE</span>
          {lastUpdated && (
            <span className="text-gray-500 text-xs ml-3">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <p className="text-red-700 text-sm">
              {error} - Showing static data as fallback
            </p>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-gray-700 font-semibold py-4 px-2">Company</th>
              <th className="text-left text-gray-700 font-semibold py-4 px-2">Crypto</th>
              <th className="text-right text-gray-700 font-semibold py-4 px-2">mNAV</th>
              <th className="text-right text-gray-700 font-semibold py-4 px-2">Treasury Value</th>
              <th className="text-right text-gray-700 font-semibold py-4 px-2">Obligation Rate (Est.)</th>
              <th className="text-right text-gray-700 font-semibold py-4 px-2">Short %</th>
              <th className="text-right text-gray-700 font-semibold py-4 px-2">Short Days</th>
              <th className="text-right text-gray-700 font-semibold py-4 px-2">Market Cap</th>
              <th className="text-right text-gray-700 font-semibold py-4 px-2">Holdings</th>
              <th className="text-left text-gray-700 font-semibold py-4 px-2">Ticker</th>
            </tr>
          </thead>
          <tbody>
            {treasuryData.map((company, index) => (
              <motion.tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <td className="py-4 px-2">
                  <div className="text-gray-900 font-medium">{company.company}</div>
                </td>
                <td className="py-4 px-2">
                  <span className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    {company.crypto}
                  </span>
                </td>
                <td className="py-4 px-2 text-right text-purple-600 font-semibold">
                  {company.mNAV ? `${company.mNAV.toFixed(3)}x` : 'N/A'}
                </td>
                <td className="py-4 px-2 text-right text-green-600 font-semibold">
                  {company.treasuryValue ? formatNumber(company.treasuryValue) : 'N/A'}
                </td>
                <td className="py-4 px-2 text-right text-gray-700">
                  {company.obligationRate ? `${(company.obligationRate * 100).toFixed(2)}%` : 'N/A'}
                </td>
                <td className="py-4 px-2 text-right text-red-600">
                  {company.shortPercent ? `${company.shortPercent.toFixed(2)}%` : 'N/A'}
                </td>
                <td className="py-4 px-2 text-right text-gray-700">
                  {company.shortDays ? `${company.shortDays.toFixed(1)}d` : 'N/A'}
                </td>
                <td className="py-4 px-2 text-right text-gray-700">
                  {company.marketCap ? formatNumber(company.marketCap) : 'N/A'}
                </td>
                <td className="py-4 px-2 text-right text-gray-700">
                  {formatCrypto(company.cryptoOwned, company.crypto)}
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600 font-mono">
                      {company.ticker || 'N/A'}
                    </span>
                    {company.yahoo && (
                      <a
                        href={company.yahoo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-500 transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-500 text-sm">
          Data updates every 15 minutes during market hours. Treasury values calculated using real-time crypto prices.
        </p>
      </div>
    </div>
  );
};

export default function ResearchPage() {
  const [emailModal, setEmailModal] = useState<{ isOpen: boolean; fileName: string }>({
    isOpen: false,
    fileName: ''
  });
  const [pdfViewer, setPdfViewer] = useState<{ isOpen: boolean; fileName: string }>({
    isOpen: false,
    fileName: ''
  });
  const [subscribeModal, setSubscribeModal] = useState<{ isOpen: boolean }>({
    isOpen: false
  });
  const [contactModal, setContactModal] = useState<{ isOpen: boolean }>({
    isOpen: false
  });

  const handleReadRequest = (fileName: string) => {
    setEmailModal({ isOpen: true, fileName });
  };

  const handleSubscribeRequest = () => {
    setSubscribeModal({ isOpen: true });
  };

  const handleContactRequest = () => {
    setContactModal({ isOpen: true });
  };

  const handleEmailSubmit = async (email: string) => {
    try {
      const response = await fetch('/api/collect-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          fileName: emailModal.fileName,
          source: 'research_download'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Email collected successfully:', email);
        // Close email modal and open PDF viewer
        setEmailModal({ isOpen: false, fileName: '' });
        setPdfViewer({ isOpen: true, fileName: emailModal.fileName });
      } else {
        alert(data.error || 'Failed to submit email');
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      alert('Failed to submit email. Please try again.');
    }
  };

  const handleSubscribeEmailSubmit = async (email: string) => {
    try {
      const response = await fetch('/api/collect-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'contact_form',
          message: 'Subscribed to research updates'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Subscribe email collected successfully:', email);
        // Close subscribe modal
        setSubscribeModal({ isOpen: false });
        alert('Thank you for subscribing! You\'ll be notified when new research papers are available.');
      } else {
        alert(data.error || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('Failed to subscribe. Please try again.');
    }
  };

  const handleContactEmailSubmit = async (email: string) => {
    try {
      const response = await fetch('/api/collect-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'contact_form',
          message: 'Contact request from research page'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Contact email collected successfully:', email);
        // Close contact modal
        setContactModal({ isOpen: false });
        alert('Thank you for your interest! We\'ll get back to you soon.');
      } else {
        alert(data.error || 'Failed to submit contact request');
      }
    } catch (error) {
      console.error('Error submitting contact request:', error);
      alert('Failed to submit contact request. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Email Capture Modal */}
      <EmailCaptureModal
        isOpen={emailModal.isOpen}
        onClose={() => setEmailModal({ isOpen: false, fileName: '' })}
        onEmailSubmit={handleEmailSubmit}
        fileName={emailModal.fileName}
      />

      {/* Subscribe Modal */}
      <EmailCaptureModal
        isOpen={subscribeModal.isOpen}
        onClose={() => setSubscribeModal({ isOpen: false })}
        onEmailSubmit={handleSubscribeEmailSubmit}
        fileName="Research Updates"
      />

      {/* Contact Modal */}
      <EmailCaptureModal
        isOpen={contactModal.isOpen}
        onClose={() => setContactModal({ isOpen: false })}
        onEmailSubmit={handleContactEmailSubmit}
        fileName="Contact Request"
      />

      {/* PDF Viewer Modal */}
      <PDFViewer
        isOpen={pdfViewer.isOpen}
        onClose={() => setPdfViewer({ isOpen: false, fileName: '' })}
        fileName={pdfViewer.fileName}
      />

      {/* Navigation Header */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Back to Home */}
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>
            
            {/* Logo */}
            <div className="text-2xl font-bold text-gray-900">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Birdai
              </span>
            </div>
            
            {/* Contact Button */}
            <button 
              onClick={handleContactRequest}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-full text-sm shadow-lg transition-all duration-300"
            >
              Contact
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <ScrollAnimation>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Research & Insights
              </h1>
            </ScrollAnimation>
            <ScrollAnimation delay={0.2}>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
                Cutting-edge research at the intersection of AI, blockchain, and venture capital. 
                We analyze market trends, emerging technologies, and investment patterns to identify tomorrow&apos;s unicorns today.
              </p>
            </ScrollAnimation>
          </div>

          {/* Crypto Treasuries Section */}
          <ScrollAnimation delay={0.4}>
            <div className="mb-20">
              <CryptoTreasuries />
            </div>
          </ScrollAnimation>

          {/* Research Publications & Downloads */}
          <ScrollAnimation delay={0.6}>
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Research Publications</h2>
              
              {/* Research Papers */}
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Research Papers</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* From Rails to Returns */}
                  <motion.div 
                    className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-semibold">From Rails to Returns</h4>
                        <p className="text-gray-500 text-xs">Payments Circle Analysis</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Comprehensive analysis of payment infrastructure evolution and investment opportunities in fintech.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">3.9 MB • PDF</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            const text = `Check out "From Rails to Returns" research paper from Birdai - comprehensive analysis of payment infrastructure evolution and investment opportunities in fintech.`;
                            const url = `${window.location.origin}/research/from-rails-to-returns`;
                            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                            window.open(twitterUrl, '_blank');
                          }}
                          className="text-blue-600 hover:text-blue-500 transition-colors p-1 rounded hover:bg-blue-50"
                          title="Share on Twitter"
                        >
                          <Twitter size={16} />
                        </button>
                        <button
                          onClick={() => {
                            const text = `Check out "From Rails to Returns" research paper from Birdai - comprehensive analysis of payment infrastructure evolution and investment opportunities in fintech.`;
                            const url = `${window.location.origin}/research/from-rails-to-returns`;
                            const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=From Rails to Returns&summary=${encodeURIComponent(text)}`;
                            window.open(linkedinUrl, '_blank');
                          }}
                          className="text-blue-700 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50"
                          title="Share on LinkedIn"
                        >
                          <Linkedin size={16} />
                        </button>
                        <motion.button 
                          onClick={() => handleReadRequest('From Rails to Returns_ Payments Circle.pdf')}
                          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Read
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>

                  {/* From Wires to Wallets */}
                  <motion.div 
                    className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-semibold">From Wires to Wallets</h4>
                        <p className="text-gray-500 text-xs">Digital Payment Evolution</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Mental model shift for how we should think about Bitcoin relative to past innovations.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">5.2 MB • PDF</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            const text = `Check out "From Wires to Wallets" research paper from Birdai - mental model shift for how we should think about Bitcoin relative to past innovations.`;
                            const url = `${window.location.origin}/research/from-wires-to-wallets`;
                            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                            window.open(twitterUrl, '_blank');
                          }}
                          className="text-blue-600 hover:text-blue-500 transition-colors p-1 rounded hover:bg-blue-50"
                          title="Share on Twitter"
                        >
                          <Twitter size={16} />
                        </button>
                        <button
                          onClick={() => {
                            const text = `Check out "From Wires to Wallets" research paper from Birdai - mental model shift for how we should think about Bitcoin relative to past innovations.`;
                            const url = `${window.location.origin}/research/from-wires-to-wallets`;
                            const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=From Wires to Wallets&summary=${encodeURIComponent(text)}`;
                            window.open(linkedinUrl, '_blank');
                          }}
                          className="text-blue-700 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50"
                          title="Share on LinkedIn"
                        >
                          <Linkedin size={16} />
                        </button>
                        <motion.button 
                          onClick={() => handleReadRequest('From-Wires-to-Wallets.pdf')}
                          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Read
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Template for new research papers */}
                  <motion.div 
                    className="bg-white rounded-xl p-6 border border-gray-200 border-dashed shadow-sm hover:shadow-md transition-shadow"
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-semibold">Coming Soon</h4>
                        <p className="text-gray-500 text-xs">More Research Papers</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      We&apos;re constantly adding new research papers. Subscribe to get notified when new content is available.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">Stay Updated</span>
                      <motion.button 
                        onClick={handleSubscribeRequest}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Subscribe
                      </motion.button>
                    </div>
                  </motion.div>

                </div>
              </div>
            </div>
          </ScrollAnimation>

          {/* Models Section */}
          <ScrollAnimation delay={0.7}>
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Models</h2>
              
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">AI & Investment Models</h3>
                <p className="text-gray-600 text-center mb-8 max-w-4xl mx-auto">
                  Explore our comprehensive models and datasets that power our research and investment insights. 
                  These interactive tools provide real-time data and analysis across various market sectors.
                </p>
                
                <div className="w-full">
                  <iframe 
                    src="https://docs.google.com/spreadsheets/d/e/2PACX-1vT3bAmligji-xjp06XjYx4z41PFu-ICXp4DLpAGFZtUgdpJEJcCyHmJGycLJP6OWbiDS1AITWSy38VT/pubhtml?gid=0&amp;single=true&amp;widget=true&amp;headers=false"
                    className="w-full h-[600px] rounded-lg border border-gray-200"
                    title="AI & Investment Models"
                    frameBorder="0"
                  />
                </div>
              </div>
            </div>
          </ScrollAnimation>

          {/* Research Methodology */}
          <ScrollAnimation delay={0.8}>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Research Methodology</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Collection</h3>
                  <p className="text-gray-600 text-sm">
                    Aggregate data from sources including social media, news, financial reports, and on-chain analytics
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis</h3>
                  <p className="text-gray-600 text-sm">
                    Apply machine learning models to identify patterns, sentiment, and predictive signals across datasets
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Validation</h3>
                  <p className="text-gray-600 text-sm">
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