'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dashboard } from './components/Dashboard';

export default function LiveDemo() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for demo token in localStorage
    const demoToken = localStorage.getItem('demoToken');
    
    if (demoToken) {
      try {
        // Decode the token
        const tokenData = JSON.parse(atob(demoToken));
        const now = Date.now();
        
        // Check if token is expired
        if (tokenData.expires && now < tokenData.expires && tokenData.access === 'demo') {
          setIsAuthenticated(true);
        } else {
          // Token expired or invalid
          localStorage.removeItem('demoToken');
          router.push('/live-demo/login');
        }
      } catch (error) {
        // Invalid token
        localStorage.removeItem('demoToken');
        router.push('/live-demo/login');
      }
    } else {
      // No token found
      router.push('/live-demo/login');
    }
    
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('demoToken');
    router.push('/live-demo/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black">Loading demo...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">Stablecoin Bank Demo (Sui)</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
        <Dashboard />
      </div>
    </div>
  );
} 