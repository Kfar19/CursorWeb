'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dashboard } from './components/Dashboard';

export default function LiveDemo() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState('');
  const router = useRouter();

  useEffect(() => {
    console.log('LiveDemo: useEffect triggered');
    
    // Check for demo token in localStorage
    const demoToken = localStorage.getItem('demoToken');
    console.log('LiveDemo: demoToken from localStorage:', demoToken);
    
    if (demoToken) {
      try {
        // Decode the token
        const tokenData = JSON.parse(atob(demoToken));
        console.log('LiveDemo: decoded tokenData:', tokenData);
        
        const now = Date.now();
        console.log('LiveDemo: current time:', now);
        console.log('LiveDemo: token expires:', tokenData.expires);
        console.log('LiveDemo: token access:', tokenData.access);
        
        // Check if token is expired
        if (tokenData.expires && now < tokenData.expires && tokenData.access === 'demo') {
          console.log('LiveDemo: Token is valid, setting authenticated');
          setIsAuthenticated(true);
          setDebugInfo('Token validated successfully');
        } else {
          console.log('LiveDemo: Token expired or invalid');
          console.log('LiveDemo: expires check:', tokenData.expires && now < tokenData.expires);
          console.log('LiveDemo: access check:', tokenData.access === 'demo');
          localStorage.removeItem('demoToken');
          setDebugInfo('Token expired or invalid, redirecting to login');
          router.push('/live-demo/login');
        }
      } catch (error) {
        console.error('LiveDemo: Error parsing token:', error);
        localStorage.removeItem('demoToken');
        setDebugInfo('Error parsing token: ' + error);
        router.push('/live-demo/login');
      }
    } else {
      console.log('LiveDemo: No token found');
      setDebugInfo('No token found, redirecting to login');
      router.push('/live-demo/login');
    }
    
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    console.log('LiveDemo: Logout clicked');
    localStorage.removeItem('demoToken');
    router.push('/live-demo/login');
  };

  // Debug info display
  if (debugInfo) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-yellow-800 mb-4">Debug Info</h2>
          <p className="text-yellow-700 mb-4">{debugInfo}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

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
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-black">Not authenticated, redirecting...</p>
        </div>
      </div>
    );
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