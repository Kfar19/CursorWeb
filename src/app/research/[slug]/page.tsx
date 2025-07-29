'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Research paper metadata
const researchPapers = {
  'from-rails-to-returns': {
    title: 'From Rails to Returns: Payments Circle',
    description: 'Comprehensive analysis of payment infrastructure evolution and investment opportunities in fintech',
    fileName: 'From Rails to Returns_ Payments Circle.pdf',
    image: '/api/og?title=From%20Rails%20to%20Returns&subtitle=Payments%20Circle'
  },
  'from-wires-to-wallets': {
    title: 'From Wires to Wallets',
    description: 'Mental model shift for how we should think about Bitcoin relative to past innovations',
    fileName: 'From-Wires-to-Wallets.pdf',
    image: '/api/og?title=From%20Wires%20to%20Wallets&subtitle=Bitcoin%20Mental%20Model'
  }
};

export default function ResearchPaperPage({ params }: { params: Promise<{ slug: string }> }) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [slug, setSlug] = useState<string>('');

  const researchPapers = {
    'from-rails-to-returns': {
      title: 'From Rails to Returns: Payments Circle',
      description: 'Comprehensive analysis of payment infrastructure evolution and investment opportunities in fintech',
      fileName: 'From Rails to Returns_ Payments Circle.pdf',
      image: '/api/og?title=From%20Rails%20to%20Returns&subtitle=Payments%20Circle'
    },
    'from-wires-to-wallets': {
      title: 'From Wires to Wallets',
      description: 'Mental model shift for how we should think about Bitcoin relative to past innovations',
      fileName: 'From-Wires-to-Wallets.pdf',
      image: '/api/og?title=From%20Wires%20to%20Wallets&subtitle=Bitcoin%20Mental%20Model'
    }
  };

  // Get the slug from params
  useEffect(() => {
    params.then(({ slug }) => setSlug(slug));
  }, [params]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/collect-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'research_download',
          fileName: paper?.fileName || 'research-paper'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        console.log('Email collected successfully:', email);
      } else {
        setError(data.error || 'Failed to submit email');
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      setError('Failed to submit email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (paper) {
      const link = document.createElement('a');
      link.href = `/research/${paper.fileName}`;
      link.download = paper.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Get the paper data
  const paper = researchPapers[slug as keyof typeof researchPapers];
  
  if (!paper) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Research Paper Not Found</h1>
          <Link href="/research" className="text-blue-400 hover:text-blue-300">
            Back to Research
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation Header */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-md border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/research" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <ArrowLeft size={20} />
              <span>Back to Research</span>
            </Link>
            
            <div className="text-2xl font-bold text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Birdai
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h1 className="text-3xl font-bold text-white mb-4">{paper.title}</h1>
            <p className="text-gray-300 mb-6">{paper.description}</p>
            
            {!isSubmitted ? (
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Get Your Research Paper</h3>
                  <p className="text-gray-300">Enter your email to download this exclusive research paper</p>
                </div>
                
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}
                  
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? 'Submitting...' : 'Get Research Paper'}
                  </motion.button>
                </form>
                
                <p className="text-gray-400 text-xs text-center mt-4">
                  By downloading, you agree to receive updates from Birdai
                </p>
              </div>
            ) : (
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Ready to Download!</h3>
                  <p className="text-gray-300">Your research paper is ready. Click below to download.</p>
                </div>
                
                <motion.button
                  onClick={handleDownload}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download size={20} />
                  <span>Download PDF</span>
                </motion.button>
                
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-gray-400 text-sm">
                    Research paper by Birdai - See What Others Miss
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 text-sm">Share:</span>
                    <button
                      onClick={() => {
                        const text = `Check out "${paper.title}" from Birdai - ${paper.description}`;
                        const url = window.location.href;
                        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                        window.open(twitterUrl, '_blank');
                      }}
                      className="text-blue-400 hover:text-blue-300 transition-colors p-2 rounded-lg hover:bg-blue-500/10"
                      title="Share on Twitter"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        const text = `Check out "${paper.title}" from Birdai - ${paper.description}`;
                        const url = window.location.href;
                        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(paper.title)}&summary=${encodeURIComponent(text)}`;
                        window.open(linkedinUrl, '_blank');
                      }}
                      className="text-blue-600 hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-blue-600/10"
                      title="Share on LinkedIn"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 