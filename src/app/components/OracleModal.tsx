'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Brain, Clock, TrendingUp, Shield, Zap } from 'lucide-react';

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

const oracleResponses = {
  timeline: {
    '0-6 months': 'Short-term focus requires precision timing. Our AI excels at identifying immediate opportunities while managing volatility.',
    '6-12 months': 'Medium-term positioning balances growth with stability. Perfect for our systematic approach to market cycles.',
    '1-3 years': 'Strategic horizon aligns with our institutional-grade analysis. Time to compound intelligent decisions.',
    '3+ years': 'Long-term vision matches our fundamental approach. Building wealth through structural market shifts.'
  },
  risk: {
    'Conservative': 'Capital preservation is paramount. Our AI prioritizes downside protection while identifying asymmetric opportunities.',
    'Moderate': 'Balanced approach suits our diversified strategy. Risk-adjusted returns through systematic analysis.',
    'Aggressive': 'Growth-focused positioning leverages our AI\'s ability to identify high-conviction opportunities.',
    'Very Aggressive': 'Maximum growth potential through our most dynamic strategies. AI-driven alpha generation.'
  },
  focus: {
    'Bitcoin': 'Digital gold thesis aligns with our macro analysis. Institutional adoption patterns and network effects.',
    'DeFi Protocols': 'Protocol-first approach matches our infrastructure focus. TVL analysis and yield optimization.',
    'AI Infrastructure': 'AI-native capital deployment. We\'re positioned at the intersection of AI and crypto.',
    'Emerging Tech': 'Early-stage opportunity identification. Our AI excels at pattern recognition in nascent markets.'
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
      return {
        title: "Your AI Investment Profile",
        insight: `Based on your ${risk.toLowerCase()} risk approach and ${timeline} timeline, our AI is optimized for ${focus.toLowerCase()} opportunities.`,
        recommendation: oracleResponses.focus[focus as keyof typeof oracleResponses.focus],
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {oracleQuestions[currentStep].question}
                  </h3>
                </div>

                <div className="space-y-3">
                  {oracleQuestions[currentStep].options.map((option, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleAnswer(oracleQuestions[currentStep].id, option)}
                      className="w-full p-4 text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 font-medium">{option}</span>
                        <motion.div
                          className="text-blue-500 opacity-0 group-hover:opacity-100"
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
                  <div className="text-4xl mb-4">🔮</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {insight?.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {insight?.insight}
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-blue-900 text-sm">
                      {insight?.recommendation}
                    </p>
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
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Ask Again
                    </button>
                                         <button
                       onClick={() => {
                         onContactModalOpen();
                         onClose();
                       }}
                       className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-200"
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