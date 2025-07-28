'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Send, Bot, AlertTriangle, Info, BookOpen, Shield } from 'lucide-react';

// Legal disclaimer component
const LegalDisclaimer = () => (
  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
    <div className="flex items-start space-x-3">
      <AlertTriangle className="text-red-400 mt-1 flex-shrink-0" size={20} />
      <div>
        <h3 className="text-red-400 font-semibold mb-2">IMPORTANT LEGAL DISCLAIMER</h3>
        <div className="text-red-300 text-sm space-y-2">
          <p><strong>NOT FINANCIAL ADVICE:</strong> This chatbot provides educational information only. It does not constitute financial advice, investment recommendations, or trading guidance.</p>
          <p><strong>EDUCATIONAL PURPOSE:</strong> All responses are for educational purposes only. Do not make investment decisions based on this information.</p>
          <p><strong>DO YOUR OWN RESEARCH:</strong> Always conduct your own research and consult qualified financial advisors before making any investment decisions.</p>
          <p><strong>NO LIABILITY:</strong> We assume no responsibility for any losses or damages resulting from the use of this information.</p>
          <p><strong>PAST PERFORMANCE:</strong> Past performance does not guarantee future results. Cryptocurrency markets are highly volatile and risky.</p>
        </div>
      </div>
    </div>
  </div>
);

// Safe educational responses
const educationalResponses = {
  // Market data explanations
  'market cap': {
    response: "Market capitalization (market cap) is the total value of all coins in circulation, calculated by multiplying the current price by the total supply. It's a common metric to compare the relative size of different cryptocurrencies. However, market cap alone doesn't indicate investment potential or future performance.",
    disclaimer: "This is educational information about market metrics, not investment advice."
  },
  'tvl': {
    response: "Total Value Locked (TVL) measures the total value of assets deposited in DeFi protocols. It's used to gauge the size and activity of DeFi ecosystems. Higher TVL often indicates more user activity and protocol adoption, but doesn't guarantee protocol safety or investment returns.",
    disclaimer: "This explains DeFi metrics for educational purposes only."
  },
  'volatility': {
    response: "Cryptocurrency volatility refers to the rapid and significant price fluctuations common in crypto markets. This high volatility creates both opportunities and risks. It's important to understand that crypto prices can change dramatically in short periods, which can lead to significant gains or losses.",
    disclaimer: "This describes market characteristics, not investment recommendations."
  },
  'defi': {
    response: "DeFi (Decentralized Finance) refers to financial services built on blockchain technology that operate without traditional intermediaries like banks. It includes lending, borrowing, trading, and yield farming protocols. While DeFi offers new financial opportunities, it also comes with unique risks including smart contract vulnerabilities and regulatory uncertainty.",
    disclaimer: "This is educational content about DeFi technology and concepts."
  },
  'blockchain': {
    response: "Blockchain is a distributed ledger technology that records transactions across multiple computers securely and transparently. It's the foundation of cryptocurrencies and enables features like decentralization, immutability, and transparency. Understanding blockchain technology helps explain how cryptocurrencies work.",
    disclaimer: "This explains blockchain technology for educational purposes."
  },
  'gas fees': {
    response: "Gas fees are transaction costs on blockchain networks like Ethereum. They compensate network validators for processing transactions and help prevent spam. Gas fees vary based on network congestion and transaction complexity. High gas fees can make small transactions uneconomical.",
    disclaimer: "This explains blockchain transaction costs for educational purposes."
  },
  'yield farming': {
    response: "Yield farming involves lending or staking cryptocurrency to earn rewards, often in the form of additional tokens. While it can generate returns, it also carries risks including impermanent loss, smart contract vulnerabilities, and token price volatility. Always understand the risks before participating.",
    disclaimer: "This explains DeFi concepts for educational purposes only."
  },
  'liquidity pools': {
    response: "Liquidity pools are collections of tokens locked in smart contracts that enable decentralized trading. They provide the liquidity needed for DEX trading and allow users to earn fees by providing liquidity. However, they also carry risks like impermanent loss and smart contract risks.",
    disclaimer: "This explains DeFi mechanics for educational purposes."
  },
  'smart contracts': {
    response: "Smart contracts are self-executing programs on blockchain networks that automatically execute when predetermined conditions are met. They enable DeFi protocols, NFTs, and other blockchain applications. While they can be secure, they're also vulnerable to bugs and exploits.",
    disclaimer: "This explains blockchain technology concepts for educational purposes."
  },
  'nft': {
    response: "NFTs (Non-Fungible Tokens) are unique digital assets that represent ownership of digital or physical items. They're used for digital art, collectibles, gaming items, and more. NFT values are highly speculative and can be extremely volatile.",
    disclaimer: "This explains NFT technology for educational purposes only."
  }
};

// Default response for unknown queries
const defaultResponse = {
  response: "I can help explain cryptocurrency and blockchain concepts for educational purposes. Try asking about topics like market cap, TVL, DeFi, blockchain technology, or other crypto concepts. Remember, this is for educational purposes only - not financial advice.",
  disclaimer: "This chatbot provides educational information only. Always do your own research and consult qualified advisors."
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Array<{
    id: number;
    type: 'user' | 'bot';
    content: string;
    disclaimer?: string;
    timestamp: Date;
  }>>([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm here to help explain cryptocurrency and blockchain concepts for educational purposes. What would you like to learn about? (Remember: This is educational content only, not financial advice.)",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestMatch = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Check for exact matches first
    for (const [key, value] of Object.entries(educationalResponses)) {
      if (lowerQuery.includes(key)) {
        return value;
      }
    }
    
    // Check for partial matches
    for (const [key, value] of Object.entries(educationalResponses)) {
      if (key.includes(lowerQuery) || lowerQuery.includes(key)) {
        return value;
      }
    }
    
    return defaultResponse;
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

    // Simulate typing delay
    setTimeout(() => {
      const response = findBestMatch(inputValue);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot' as const,
        content: response.response,
        disclaimer: response.disclaimer,
        timestamp: new Date()
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
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
            
            {/* Chatbot Icon */}
            <div className="flex items-center space-x-2 text-blue-400">
              <Bot size={20} />
              <span className="text-sm font-medium">Educational Chatbot</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-3 mb-4"
            >
              <Bot className="text-blue-400" size={32} />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Crypto Education Bot
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Learn about cryptocurrency and blockchain concepts for educational purposes
            </motion.p>
          </div>

          {/* Legal Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <LegalDisclaimer />
          </motion.div>

          {/* Suggested Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <BookOpen size={20} className="mr-2 text-blue-400" />
              Suggested Topics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Market Cap', 'TVL', 'DeFi', 'Blockchain', 'Volatility', 'Gas Fees', 'Yield Farming', 'Smart Contracts'].map((topic) => (
                <button
                  key={topic}
                  onClick={() => setInputValue(topic.toLowerCase())}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                  {topic}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
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
                        <Bot size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        {message.disclaimer && (
                          <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-300">
                            <div className="flex items-center space-x-1 mb-1">
                              <Shield size={12} />
                              <span className="font-semibold">Disclaimer:</span>
                            </div>
                            {message.disclaimer}
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
                      <Bot size={16} className="text-blue-400" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
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
                  placeholder="Ask about crypto concepts (educational purposes only)..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                />
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

          {/* Additional Legal Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Info className="text-yellow-400" size={20} />
                <span className="text-yellow-400 font-semibold">Educational Use Only</span>
              </div>
              <p className="text-yellow-300 text-sm">
                This chatbot is designed for educational purposes only. It does not provide financial advice, 
                investment recommendations, or trading guidance. Always consult qualified financial advisors 
                and conduct thorough research before making any investment decisions.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 