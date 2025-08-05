'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FinanceElement {
  id: number;
  x: number;
  delay: number;
  duration: number;
  rotation: number;
  type: 'coin' | 'building' | 'paper' | 'chart';
}

export default function OldFinanceFall() {
  const [elements, setElements] = useState<FinanceElement[]>([]);

  useEffect(() => {
    // Create initial elements
    const initialElements: FinanceElement[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 6 + Math.random() * 4,
      rotation: Math.random() * 360,
      type: ['coin', 'building', 'paper', 'chart'][Math.floor(Math.random() * 4)] as any,
    }));
    setElements(initialElements);

    // Add new elements periodically
    const interval = setInterval(() => {
      setElements(prev => {
        const newElement: FinanceElement = {
          id: Date.now(),
          x: Math.random() * 100,
          delay: 0,
          duration: 6 + Math.random() * 4,
          rotation: Math.random() * 360,
          type: ['coin', 'building', 'paper', 'chart'][Math.floor(Math.random() * 4)] as any,
        };
        return [...prev.slice(-12), newElement]; // Keep only last 12 elements
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'coin':
        return '🪙';
      case 'building':
        return '🏦';
      case 'paper':
        return '💸';
      case 'chart':
        return '📉';
      default:
        return '💰';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute text-2xl md:text-3xl opacity-60"
          style={{
            left: `${element.x}%`,
            top: '-10%',
          }}
          initial={{ 
            y: -100,
            rotate: element.rotation,
            opacity: 0 
          }}
          animate={{ 
            y: '110vh',
            rotate: element.rotation + 360,
            opacity: [0, 0.6, 0.6, 0]
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            ease: "easeIn",
            opacity: {
              duration: element.duration,
              times: [0, 0.1, 0.9, 1]
            }
          }}
        >
          {getElementIcon(element.type)}
        </motion.div>
      ))}
    </div>
  );
} 