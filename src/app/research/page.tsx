'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, X, Eye, Mail, TrendingUp, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

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
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Eye size={16} />
              <span>View Only</span>
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
  const [treasuryData, setTreasuryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cryptoTreasuries = [
    { company: 'Strategy', crypto: 'BTC', ticker: 'MSTR', cryptoOwned: 597325, yahoo: 'https://finance.yahoo.com/quote/MSTR/key-statistics/' },
    { company: 'Marathon Digital', crypto: 'BTC', ticker: 'MARA', cryptoOwned: 14402, yahoo: 'https://finance.yahoo.com/quote/MARA/key-statistics/' },
    { company: 'Riot Platforms', crypto: 'BTC', ticker: 'RIOT', cryptoOwned: 12530, yahoo: 'https://finance.yahoo.com/quote/RIOT/key-statistics/' },
    { company: 'Bitfarms', crypto: 'BTC', ticker: 'BITF', cryptoOwned: 11858, yahoo: 'https://finance.yahoo.com/quote/BITF/key-statistics/' },
    { company: 'Hut8', crypto: 'BTC', ticker: 'HUT', cryptoOwned: 5000, yahoo: 'https://finance.yahoo.com/quote/HUT/key-statistics/' },
    { company: 'ProCap | Columbus Circle', crypto: 'BTC', ticker: 'CCCM', cryptoOwned: 4716.981132, yahoo: 'https://finance.yahoo.com/quote/CCCM/key-statistics/' },
    { company: 'Trump Media', crypto: 'BTC', ticker: 'DJT', cryptoOwned: 21186.44068, yahoo: 'https://finance.yahoo.com/quote/DJT/key-statistics/' },
    { company: 'Twenty - One', crypto: 'BTC', ticker: '', cryptoOwned: 4812, yahoo: '' },
    { company: 'Sharplink Gaming', crypto: 'ETH', ticker: 'SBET', cryptoOwned: 390607, yahoo: 'https://finance.yahoo.com/quote/SBET/key-statistics/' },
    { company: 'Bitminer', crypto: 'ETH', ticker: 'BMNR', cryptoOwned: 566776, yahoo: 'https://finance.yahoo.com/quote/BMNR/key-statistics/' },
    { company: 'Upexi', crypto: 'SOL', ticker: 'UPXI', cryptoOwned: 2631578.947, yahoo: 'https://finance.yahoo.com/quote/UPXI/key-statistics/' },
    { company: 'Mill City', crypto: 'SUI', ticker: '', cryptoOwned: 0, yahoo: '' }
  ];

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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Use static data as fallback
        setTreasuryData(cryptoTreasuries);
      } finally {
        setLoading(false);
      }
    };

    fetchTreasuryData();
  }, []);

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
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Crypto Treasuries</h2>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-300">Loading treasury data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
      <div className="flex items-center justify-center mb-8">
        <TrendingUp className="w-8 h-8 text-blue-400 mr-3" />
        <h2 className="text-3xl font-bold text-white">Crypto Treasuries</h2>
      </div>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-300 text-sm">
            {error} - Showing static data as fallback
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-gray-300 font-semibold py-4 px-2">Company</th>
              <th className="text-left text-gray-300 font-semibold py-4 px-2">Crypto</th>
              <th className="text-left text-gray-300 font-semibold py-4 px-2">Ticker</th>
              <th className="text-right text-gray-300 font-semibold py-4 px-2">Holdings</th>
              <th className="text-right text-gray-300 font-semibold py-4 px-2">Treasury Value</th>
              <th className="text-right text-gray-300 font-semibold py-4 px-2">Market Cap</th>
              <th className="text-right text-gray-300 font-semibold py-4 px-2">OCF (TTM)</th>
              <th className="text-right text-gray-300 font-semibold py-4 px-2">Obligation Rate</th>
              <th className="text-right text-gray-300 font-semibold py-4 px-2">Short %</th>
              <th className="text-right text-gray-300 font-semibold py-4 px-2">Short Days</th>
              <th className="text-center text-gray-300 font-semibold py-4 px-2">Yahoo</th>
            </tr>
          </thead>
          <tbody>
            {treasuryData.map((company, index) => (
              <motion.tr
                key={index}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <td className="py-4 px-2">
                  <div className="text-white font-medium">{company.company}</div>
                </td>
                <td className="py-4 px-2">
                  <span className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    {company.crypto}
                  </span>
                </td>
                <td className="py-4 px-2">
                  <span className="text-blue-400 font-mono">
                    {company.ticker || 'N/A'}
                  </span>
                </td>
                <td className="py-4 px-2 text-right text-gray-300">
                  {formatCrypto(company.cryptoOwned, company.crypto)}
                </td>
                <td className="py-4 px-2 text-right text-green-400 font-semibold">
                  {company.treasuryValue ? formatNumber(company.treasuryValue) : 'N/A'}
                </td>
                <td className="py-4 px-2 text-right text-gray-300">
                  {company.marketCap ? formatNumber(company.marketCap) : 'N/A'}
                </td>
                <td className="py-4 px-2 text-right text-gray-300">
                  {company.operatingCashFlow ? formatNumber(company.operatingCashFlow) : 'N/A'}
                </td>
                <td className="py-4 px-2 text-right text-gray-300">
                  {company.obligationRate ? `${(company.obligationRate * 100).toFixed(2)}%` : 'N/A'}
                </td>
                <td className="py-4 px-2 text-right text-red-400">
                  {company.shortPercent ? `${company.shortPercent.toFixed(2)}%` : 'N/A'}
                </td>
                <td className="py-4 px-2 text-right text-gray-300">
                  {company.shortDays ? `${company.shortDays.toFixed(1)}d` : 'N/A'}
                </td>
                <td className="py-4 px-2 text-center">
                  {company.yahoo && (
                    <a
                      href={company.yahoo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
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
            <button 
              onClick={handleContactRequest}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-full text-sm shadow-lg transition-all duration-300"
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

          {/* Crypto Treasuries Section */}
          <ScrollAnimation delay={0.4}>
            <div className="mb-20">
              <CryptoTreasuries />
            </div>
          </ScrollAnimation>

          {/* Research Publications & Downloads */}
          <ScrollAnimation delay={0.6}>
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-white mb-12 text-center">Research Publications</h2>
              
              {/* Research Papers */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-8 text-center">Research Papers</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* From Rails to Returns */}
                  <motion.div 
                    className="bg-white/10 rounded-xl p-6 border border-white/20"
                    whileHover={{ scale: 1.05, y: -3 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">From Rails to Returns</h4>
                        <p className="text-gray-400 text-xs">Payments Circle Analysis</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">
                      Comprehensive analysis of payment infrastructure evolution and investment opportunities in fintech.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">3.9 MB • PDF</span>
                      <motion.button 
                        onClick={() => handleReadRequest('From Rails to Returns_ Payments Circle.pdf')}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Read
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Template for new research papers */}
                  <motion.div 
                    className="bg-white/10 rounded-xl p-6 border border-white/20 border-dashed"
                    whileHover={{ scale: 1.05, y: -3 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Coming Soon</h4>
                        <p className="text-gray-400 text-xs">More Research Papers</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">
                      We&apos;re constantly adding new research papers. Subscribe to get notified when new content is available.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">Stay Updated</span>
                      <motion.button 
                        onClick={handleSubscribeRequest}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
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
                    Aggregate data from sources including social media, news, financial reports, and on-chain analytics
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