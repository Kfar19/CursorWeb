'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Bill {
  id: number;
  x: number;
  delay: number;
  duration: number;
  rotation: number;
}

export default function MoneyRain() {
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    // Create initial bills
    const initialBills: Bill[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // Random horizontal position
      delay: Math.random() * 5, // Random start delay
      duration: 8 + Math.random() * 4, // Random fall duration
      rotation: Math.random() * 360, // Random rotation
    }));
    setBills(initialBills);

    // Add new bills periodically
    const interval = setInterval(() => {
      setBills(prev => {
        const newBill: Bill = {
          id: Date.now(),
          x: Math.random() * 100,
          delay: 0,
          duration: 8 + Math.random() * 4,
          rotation: Math.random() * 360,
        };
        return [...prev.slice(-15), newBill]; // Keep only last 15 bills
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {bills.map((bill) => (
        <motion.div
          key={bill.id}
          className="absolute text-4xl md:text-6xl"
          style={{
            left: `${bill.x}%`,
            top: '-10%',
          }}
          initial={{ 
            y: -100,
            rotate: bill.rotation,
            opacity: 0 
          }}
          animate={{ 
            y: '110vh',
            rotate: bill.rotation + 360,
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: bill.duration,
            delay: bill.delay,
            ease: "linear",
            opacity: {
              duration: bill.duration,
              times: [0, 0.1, 0.9, 1]
            }
          }}
        >
          💵
        </motion.div>
      ))}
    </div>
  );
} 