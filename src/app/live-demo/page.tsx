'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Dashboard } from './components/Dashboard';

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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-xl">
        <h1 className="text-2xl font-bold mb-4">Stablecoin Bank Demo (Sui)</h1>
        <Dashboard />
      </div>
    </div>
  );
} 