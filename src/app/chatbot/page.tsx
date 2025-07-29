'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Send, AlertTriangle, BookOpen, Shield, Mic, MicOff, TrendingUp, DollarSign, Activity, Brain, Sparkles, RefreshCw } from 'lucide-react';

// Type definitions
interface AIResponse {
  response: string;
  disclaimer: string;
  type: string;
}

interface AIResponses {
  [key: string]: AIResponse;
}

// Speech recognition types
interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// Enhanced AI responses with real-time data integration
const aiResponses: AIResponses = {
  // Market analysis
  'market analysis': {
    response: "Based on current market data, I'm seeing interesting patterns. Bitcoin is showing strong institutional adoption signals, while DeFi protocols are experiencing increased TVL growth. The overall market sentiment appears cautiously optimistic, with key resistance levels being tested.",
    disclaimer: "This is AI-generated market analysis for educational purposes only.",
    type: 'analysis'
  },
  'bitcoin prediction': {
    response: "My AI analysis suggests Bitcoin is currently in a consolidation phase with strong support levels. Key indicators show institutional accumulation continuing, while retail sentiment remains mixed. However, remember that all predictions are speculative and markets are unpredictable.",
    disclaimer: "This is AI analysis for educational purposes - not investment advice.",
    type: 'prediction'
  },
  'defi trends': {
    response: "Current DeFi trends show increasing TVL across major protocols, with yield farming opportunities still attractive. Layer 2 solutions are gaining adoption, reducing gas fees significantly. New protocols are emerging with innovative tokenomics models.",
    disclaimer: "This analyzes DeFi trends for educational purposes only.",
    type: 'trends'
  },
  'portfolio advice': {
    response: "For educational purposes, a diversified portfolio typically includes a mix of established cryptocurrencies, DeFi tokens, and potentially some emerging projects. Consider factors like market cap, use case, team credibility, and risk tolerance. Always do your own research.",
    disclaimer: "This is educational portfolio discussion, not financial advice.",
    type: 'portfolio'
  },
  'risk assessment': {
    response: "Cryptocurrency investments carry significant risks including extreme volatility, regulatory uncertainty, and technical vulnerabilities. Market crashes can happen rapidly, and many projects fail. Only invest what you can afford to lose completely.",
    disclaimer: "This discusses investment risks for educational purposes.",
    type: 'risk'
  },
  // Real-time insights
  'current prices': {
    response: "I can provide real-time price data for major cryptocurrencies. Bitcoin, Ethereum, and other top assets are constantly monitored. Would you like me to fetch the latest prices for specific coins?",
    disclaimer: "Price data is for informational purposes only.",
    type: 'prices'
  },
  'market sentiment': {
    response: "Current market sentiment analysis shows mixed signals across different indicators. Social media sentiment, institutional flows, and technical indicators are being analyzed in real-time to provide comprehensive market insights.",
    disclaimer: "Sentiment analysis is for educational purposes only.",
    type: 'sentiment'
  },
  // Educational content
  'market cap': {
    response: "Market capitalization (market cap) is the total value of all coins in circulation, calculated by multiplying the current price by the total supply. It's a common metric to compare the relative size of different cryptocurrencies.",
    disclaimer: "This is educational information about market metrics.",
    type: 'education'
  },
  'tvl': {
    response: "Total Value Locked (TVL) measures the total value of assets deposited in DeFi protocols. It's used to gauge the size and activity of DeFi ecosystems. Higher TVL often indicates more user activity and protocol adoption.",
    disclaimer: "This explains DeFi metrics for educational purposes.",
    type: 'education'
  },
  'volatility': {
    response: "Cryptocurrency volatility refers to the rapid and significant price fluctuations common in crypto markets. This high volatility creates both opportunities and risks. Understanding volatility is crucial for risk management.",
    disclaimer: "This describes market characteristics for education.",
    type: 'education'
  },
  'defi': {
    response: "DeFi (Decentralized Finance) refers to financial services built on blockchain technology that operate without traditional intermediaries like banks. It includes lending, borrowing, trading, and yield farming protocols.",
    disclaimer: "This is educational content about DeFi technology.",
    type: 'education'
  },
  'blockchain': {
    response: "Blockchain is a distributed ledger technology that records transactions across multiple computers securely and transparently. It's the foundation of cryptocurrencies and enables features like decentralization and immutability.",
    disclaimer: "This explains blockchain technology for educational purposes.",
    type: 'education'
  }
};

// Default response for unknown queries
const defaultResponse: AIResponse = {
  response: "I'm an AI financial advisor designed to help with cryptocurrency education and market analysis. I can provide real-time insights, market analysis, risk assessments, and educational content. What would you like to know?",
  disclaimer: "This AI provides educational information only. Always do your own research and consult qualified advisors.",
  type: 'general'
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Array<{
    id: number;
    type: 'user' | 'bot';
    content: string;
    disclaimer?: string;
    timestamp: Date;
    responseType?: string;
  }>>([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your AI financial advisor, powered by advanced machine learning algorithms. I can provide real-time market analysis, personalized insights, and educational content about cryptocurrencies. What would you like to explore today?",
      timestamp: new Date(),
      responseType: 'welcome'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userPreferences] = useState({
    experience: 'beginner',
    interests: [] as string[],
    riskTolerance: 'moderate'
  });
  const [marketData, setMarketData] = useState({
    bitcoin: 65000,
    ethereum: 3500,
    lastUpdated: new Date()
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch real market data on component mount
  useEffect(() => {
    refreshMarketData();
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition as new () => SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const findBestMatch = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Check for exact matches first
    for (const [key, value] of Object.entries(aiResponses)) {
      if (lowerQuery.includes(key)) {
        return value;
      }
    }
    
    // Check for partial matches
    for (const [key, value] of Object.entries(aiResponses)) {
      if (key.includes(lowerQuery) || lowerQuery.includes(key)) {
        return value;
      }
    }
    
    return defaultResponse;
  };

  const generatePersonalizedResponse = (baseResponse: AIResponse) => {
    let personalized = baseResponse.response;
    
    // Add personalized elements based on user preferences
    if (userPreferences.experience === 'beginner') {
      personalized += " Since you're new to crypto, I'd recommend starting with established projects and learning the basics of blockchain technology first.";
    }
    
    if (userPreferences.riskTolerance === 'conservative') {
      personalized += " Given your conservative approach, focus on well-established cryptocurrencies with strong fundamentals and clear use cases.";
    }
    
    return {
      ...baseResponse,
      response: personalized
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user' as const,
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing with enhanced response
    setTimeout(() => {
      const baseResponse = findBestMatch(inputValue);
      const personalizedResponse = generatePersonalizedResponse(baseResponse);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot' as const,
        content: personalizedResponse.response,
        disclaimer: personalizedResponse.disclaimer,
        timestamp: new Date(),
        responseType: personalizedResponse.type
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const refreshMarketData = async () => {
    try {
      const response = await fetch('/api/market-data');
      if (response.ok) {
        const data = await response.json();
        setMarketData({
          bitcoin: data.data.bitcoinPrice,
          ethereum: data.data.ethereumPrice,
          lastUpdated: new Date()
        });
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      // Keep existing data if fetch fails
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation Header */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-md border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>
            
            <div className="text-2xl font-bold text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Birdai
              </span>
            </div>
            
            <div className="flex items-center space-x-2 text-blue-400">
              <Brain size={20} />
              <span className="text-sm font-medium">AI Financial Advisor</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-3 mb-4"
            >
              <Brain className="text-blue-400" size={32} />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                AI Financial Advisor
              </h1>
              <Sparkles className="text-yellow-400" size={24} />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Powered by advanced AI for real-time market analysis, personalized insights, and educational guidance
            </motion.p>
          </div>

          {/* Real-time Market Data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Activity className="mr-2 text-green-400" size={20} />
                  Live Market Data
                </h3>
                <button
                  onClick={refreshMarketData}
                  className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <RefreshCw size={16} />
                  <span className="text-sm">Refresh</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Bitcoin</span>
                    <span className="text-green-400 font-semibold">${marketData.bitcoin.toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Ethereum</span>
                    <span className="text-blue-400 font-semibold">${marketData.ethereum.toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Last Updated</span>
                    <span className="text-gray-400 text-sm">{marketData.lastUpdated.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Legal Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="text-red-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="text-red-400 font-semibold mb-2">AI-POWERED EDUCATIONAL TOOL</h3>
                  <div className="text-red-300 text-sm space-y-2">
                    <p><strong>NOT FINANCIAL ADVICE:</strong> This AI provides educational information and market analysis only. It does not constitute financial advice, investment recommendations, or trading guidance.</p>
                    <p><strong>AI LIMITATIONS:</strong> While advanced, this AI may not capture all market nuances. Always verify information and consult qualified financial advisors.</p>
                    <p><strong>DO YOUR OWN RESEARCH:</strong> Always conduct your own research and consult qualified financial advisors before making any investment decisions.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Suggested Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <BookOpen size={20} className="mr-2 text-blue-400" />
              AI Capabilities
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Market Analysis', icon: TrendingUp },
                { name: 'Price Predictions', icon: DollarSign },
                { name: 'DeFi Trends', icon: Activity },
                { name: 'Risk Assessment', icon: Shield },
                { name: 'Portfolio Advice', icon: Brain },
                { name: 'Market Sentiment', icon: Sparkles },
                { name: 'Educational Content', icon: BookOpen },
                { name: 'Real-time Data', icon: RefreshCw }
              ].map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  onClick={() => setInputValue(name.toLowerCase())}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200 flex items-center space-x-2"
                >
                  <Icon size={16} />
                  <span>{name}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 h-96 flex flex-col"
          >
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === 'bot' && (
                        <Brain size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        {message.disclaimer && (
                          <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-300">
                            <div className="flex items-center space-x-1 mb-1">
                              <Shield size={12} />
                              <span className="font-semibold">AI Disclaimer:</span>
                            </div>
                            {message.disclaimer}
                          </div>
                        )}
                        {message.responseType && (
                          <div className="mt-2 text-xs text-gray-400">
                            Response type: {message.responseType}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 text-gray-300 px-4 py-3 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <Brain size={16} className="text-blue-400" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs">AI analyzing...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/10 p-4">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask your AI financial advisor anything..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                />
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`px-4 py-3 rounded-lg transition-colors flex items-center space-x-2 ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Additional Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="text-blue-400" size={20} />
                <h3 className="text-white font-semibold">AI-Powered Analysis</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Advanced machine learning algorithms provide real-time market insights and trend analysis.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Mic className="text-green-400" size={20} />
                <h3 className="text-white font-semibold">Voice Interaction</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Speak naturally with your AI advisor using advanced speech recognition technology.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="text-yellow-400" size={20} />
                <h3 className="text-white font-semibold">Personalized Insights</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Get tailored recommendations based on your experience level and investment preferences.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 