'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Brain, Clock, TrendingUp, Shield, Zap } from 'lucide-react';
import Lottie from 'lottie-react';
import oracleAnimation from '../../oracle-animation.json';

interface OracleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContactModalOpen: () => void;
}

interface OracleQuestion {
  id: string;
  question: string;
  options: string[];
  icon: React.ReactNode;
}

const oracleQuestions: OracleQuestion[] = [
  {
    id: 'timeline',
    question: 'What is your investment timeline?',
    options: ['0-6 months', '6-12 months', '1-3 years', '3+ years'],
    icon: <Clock className="w-6 h-6" />
  },
  {
    id: 'risk',
    question: 'How do you approach risk?',
    options: ['Conservative', 'Moderate', 'Aggressive', 'Very Aggressive'],
    icon: <Shield className="w-6 h-6" />
  },
  {
    id: 'focus',
    question: 'What interests you most?',
    options: ['Bitcoin', 'DeFi Protocols', 'AI Infrastructure', 'Emerging Tech'],
    icon: <Brain className="w-6 h-6" />
  }
];

const questionSubtitles = {
  timeline: 'Your timeline determines our AI\'s analysis frequency and strategy approach.',
  risk: 'Risk tolerance shapes portfolio construction and opportunity selection.',
  focus: 'Your focus area helps our AI prioritize the most relevant market signals.'
};

const oracleResponses = {
  timeline: {
    '0-6 months': {
      insight: 'Short-term focus requires precision timing. Our AI excels at identifying immediate opportunities while managing volatility.',
      strategy: 'High-frequency pattern recognition with real-time risk management. Perfect for capturing short-term market inefficiencies.',
      marketContext: 'Current market conditions show increased volatility, creating more short-term opportunities for disciplined traders.',
      aiCapability: 'Our AI processes 10,000+ data points per second to identify micro-trends before they become mainstream.'
    },
    '6-12 months': {
      insight: 'Medium-term positioning balances growth with stability. Perfect for our systematic approach to market cycles.',
      strategy: 'Cycle-aware positioning with momentum and mean reversion signals. Captures medium-term trends while managing drawdowns.',
      marketContext: 'We\'re in a transitional market phase where medium-term strategies can capture both growth and stability.',
      aiCapability: 'AI analyzes 50+ market cycles to predict optimal entry and exit points for 6-12 month horizons.'
    },
    '1-3 years': {
      insight: 'Strategic horizon aligns with our institutional-grade analysis. Time to compound intelligent decisions.',
      strategy: 'Fundamental analysis combined with macro trends. Position for structural shifts in the crypto ecosystem.',
      marketContext: 'Long-term crypto adoption is accelerating. Our AI identifies the protocols and companies that will dominate.',
      aiCapability: 'Machine learning models trained on 10+ years of crypto data to identify long-term winners.'
    },
    '3+ years': {
      insight: 'Long-term vision matches our fundamental approach. Building wealth through structural market shifts.',
      strategy: 'Generational wealth building through early identification of paradigm-shifting technologies.',
      marketContext: 'We\'re witnessing the birth of a new financial system. Position for the future, not the present.',
      aiCapability: 'AI predicts which technologies will reshape finance over the next decade.'
    }
  },
  risk: {
    'Conservative': {
      insight: 'Capital preservation is paramount. Our AI prioritizes downside protection while identifying asymmetric opportunities.',
      strategy: 'Portfolio construction with 70% stable assets, 30% growth opportunities. Maximum 15% drawdown tolerance.',
      marketContext: 'Conservative strategies are outperforming in current market conditions. Safety first, growth second.',
      aiCapability: 'AI continuously monitors 100+ risk metrics to protect capital while capturing upside.'
    },
    'Moderate': {
      insight: 'Balanced approach suits our diversified strategy. Risk-adjusted returns through systematic analysis.',
      strategy: '50/50 split between established assets and emerging opportunities. Balanced risk-reward profile.',
      marketContext: 'Moderate risk strategies are ideal for current market conditions. Growth with measured risk.',
      aiCapability: 'AI optimizes portfolio allocation for maximum risk-adjusted returns across market cycles.'
    },
    'Aggressive': {
      insight: 'Growth-focused positioning leverages our AI\'s ability to identify high-conviction opportunities.',
      strategy: '70% growth assets, 30% stability. Higher volatility tolerance for maximum upside potential.',
      marketContext: 'Aggressive strategies can capture significant upside in emerging markets and new protocols.',
      aiCapability: 'AI identifies high-conviction opportunities with 3-5x potential while managing downside risk.'
    },
    'Very Aggressive': {
      insight: 'Maximum growth potential through our most dynamic strategies. AI-driven alpha generation.',
      strategy: '90% growth assets, 10% stability. Maximum volatility tolerance for maximum returns.',
      marketContext: 'Very aggressive strategies can capture 10x+ opportunities in nascent markets and protocols.',
      aiCapability: 'AI hunts for asymmetric opportunities with 10x+ potential in emerging technologies.'
    }
  },
  focus: {
    'Bitcoin': {
      insight: 'Digital gold thesis aligns with our macro analysis. Institutional adoption patterns and network effects.',
      strategy: 'Bitcoin-first portfolio with allocation to Bitcoin infrastructure and related protocols.',
      marketContext: 'Bitcoin is becoming the digital reserve asset. Institutional adoption is accelerating rapidly.',
      aiCapability: 'AI analyzes institutional flows, on-chain metrics, and macro trends to optimize Bitcoin positioning.',
      currentTrend: 'Bitcoin dominance is increasing as institutions allocate more capital to digital gold.'
    },
    'DeFi Protocols': {
      insight: 'Protocol-first approach matches our infrastructure focus. TVL analysis and yield optimization.',
      strategy: 'Diversified DeFi portfolio across lending, DEXs, and yield farming protocols.',
      marketContext: 'DeFi TVL is growing rapidly. New protocols are emerging with innovative tokenomics.',
      aiCapability: 'AI monitors 500+ DeFi protocols to identify the best yield opportunities and emerging trends.',
      currentTrend: 'DeFi 2.0 protocols are gaining traction with improved tokenomics and sustainability.'
    },
    'AI Infrastructure': {
      insight: 'AI-native capital deployment. We\'re positioned at the intersection of AI and crypto.',
      strategy: 'Focus on AI infrastructure tokens, compute networks, and data protocols.',
      marketContext: 'AI infrastructure is the fastest-growing sector in crypto. Compute and data are the new oil.',
      aiCapability: 'Our AI identifies the most promising AI infrastructure projects before they become mainstream.',
      currentTrend: 'AI infrastructure tokens are outperforming as demand for compute and data grows exponentially.'
    },
    'Emerging Tech': {
      insight: 'Early-stage opportunity identification. Our AI excels at pattern recognition in nascent markets.',
      strategy: 'Early-stage investment in emerging protocols, Layer 2s, and experimental technologies.',
      marketContext: 'Emerging technologies are creating new paradigms. Early identification is key to outsized returns.',
      aiCapability: 'AI scans 1000+ emerging projects to identify the next big thing before the crowd.',
      currentTrend: 'Layer 2 scaling solutions and cross-chain bridges are the hottest emerging technologies.'
    }
  }
};

export default function OracleModal({ isOpen, onClose, onContactModalOpen }: OracleModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setAnswers({});
      setShowResult(false);
    }
  }, [isOpen]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    if (currentStep < oracleQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const getOracleInsight = () => {
    const timeline = answers.timeline;
    const risk = answers.risk;
    const focus = answers.focus;

    if (timeline && risk && focus) {
      const timelineData = oracleResponses.timeline[timeline as keyof typeof oracleResponses.timeline];
      const riskData = oracleResponses.risk[risk as keyof typeof oracleResponses.risk];
      const focusData = oracleResponses.focus[focus as keyof typeof oracleResponses.focus];

      return {
        title: "Your AI Investment Profile",
        insight: `Based on your ${risk.toLowerCase()} risk approach and ${timeline} timeline, our AI is optimized for ${focus.toLowerCase()} opportunities.`,
        timeline: timelineData,
        risk: riskData,
        focus: focusData,
        nextStep: "Ready to see what our AI sees?"
      };
    }
    return null;
  };

  const insight = getOracleInsight();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">𓂀</div>
                <h2 className="text-2xl font-bold text-gray-900">The Oracle</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            {!showResult ? (
              <div>
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    {oracleQuestions[currentStep].icon}
                    <span className="text-sm text-gray-500">
                      {currentStep + 1} of {oracleQuestions.length}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {oracleQuestions[currentStep].question}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    {questionSubtitles[oracleQuestions[currentStep].id as keyof typeof questionSubtitles]}
                  </p>
                </div>

                <div className="space-y-3">
                  {oracleQuestions[currentStep].options.map((option, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleAnswer(oracleQuestions[currentStep].id, option)}
                      className="w-full p-4 text-left bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200 group relative overflow-hidden shadow-sm"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-gray-100/50 to-gray-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center space-x-3">
                          <motion.div
                            className="w-2 h-2 bg-gray-400 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                          />
                          <span className="text-gray-900 font-medium">{option}</span>
                        </div>
                        <motion.div
                          className="text-gray-600 opacity-0 group-hover:opacity-100"
                          initial={{ x: -10 }}
                          animate={{ x: 0 }}
                        >
                          <Eye size={20} />
                        </motion.div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="w-24 h-24 mx-auto mb-4">
                    <Lottie
                      animationData={oracleAnimation}
                      loop={true}
                      autoplay={true}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {insight?.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {insight?.insight}
                  </p>
                  <div className="space-y-4 mb-6">
                    {/* Timeline Strategy */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-blue-600" />
                        Timeline Strategy
                      </h4>
                      <p className="text-gray-700 text-sm mb-2">{insight?.timeline.strategy}</p>
                      <p className="text-gray-500 text-xs">{insight?.timeline.marketContext}</p>
                    </div>

                    {/* Risk Profile */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-purple-600" />
                        Risk Profile
                      </h4>
                      <p className="text-gray-700 text-sm mb-2">{insight?.risk.strategy}</p>
                      <p className="text-gray-500 text-xs">{insight?.risk.marketContext}</p>
                    </div>

                    {/* Focus Area */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Brain className="w-4 h-4 mr-2 text-green-600" />
                        Focus Area
                      </h4>
                      <p className="text-gray-700 text-sm mb-2">{insight?.focus.strategy}</p>
                      <p className="text-gray-500 text-xs">{insight?.focus.currentTrend}</p>
                    </div>

                    {/* AI Capabilities */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Zap className="w-4 h-4 mr-2 text-orange-600" />
                        AI Capabilities
                      </h4>
                      <p className="text-gray-700 text-sm">{insight?.focus.aiCapability}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 font-medium mb-6">
                    {insight?.nextStep}
                  </p>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setCurrentStep(0);
                        setAnswers({});
                        setShowResult(false);
                      }}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
                    >
                      Ask Again
                    </button>
                    <button
                      onClick={() => {
                        onContactModalOpen();
                        onClose();
                      }}
                      className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors border border-gray-900"
                    >
                      Join Signal
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 