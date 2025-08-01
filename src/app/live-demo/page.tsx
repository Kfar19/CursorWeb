'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LiveDemo() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('demoToken');
    if (!token) {
      router.push('/live-demo/login');
      return;
    }

    try {
      const response = await fetch('/api/demo/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('demoToken');
        router.push('/live-demo/login');
      }
    } catch (error) {
      localStorage.removeItem('demoToken');
      router.push('/live-demo/login');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-black">Loading demo...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Placeholder for your Live Demo code */}
      <div className="p-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-black mb-4">Live Demo</h1>
          <p className="text-gray-600 mb-8">Your demo code will go here</p>
          
          {/* Placeholder content - replace with your actual demo code */}
          <div className="bg-gray-100 rounded-lg p-8 max-w-2xl mx-auto">
            <div className="text-gray-500 text-center">
              <p className="text-lg mb-4">🚀</p>
              <p className="font-medium">Demo Content Placeholder</p>
              <p className="text-sm mt-2">Replace this section with your actual demo code</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 