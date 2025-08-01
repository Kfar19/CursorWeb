'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function DemoLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('Demo login attempt with password:', password);
    console.log('Password length:', password.length);
    console.log('Expected password: demo2025');
    console.log('Password match:', password === 'demo2025');

    // Client-side password validation
    const DEMO_PASSWORD = 'demo2025';
    
    if (password === DEMO_PASSWORD) {
      console.log('Password correct, setting demo token');
      
      try {
        // Create a simple demo token (client-side only)
        const tokenData = {
          access: 'demo',
          timestamp: Date.now(),
          expires: Date.now() + (2 * 60 * 60 * 1000) // 2 hours
        };
        
        const demoToken = btoa(JSON.stringify(tokenData));
        console.log('Token data:', tokenData);
        console.log('Encoded token:', demoToken);
        
        // Store in localStorage
        localStorage.setItem('demoToken', demoToken);
        console.log('Demo token stored in localStorage');
        
        // Test localStorage
        const storedToken = localStorage.getItem('demoToken');
        console.log('Retrieved token from localStorage:', storedToken);
        
        console.log('About to redirect to /live-demo');
        router.push('/live-demo');
        console.log('Redirect called');
      } catch (error) {
        console.error('Error during login process:', error);
        setError('Login error: ' + error);
      }
    } else {
      console.log('Password incorrect');
      setError('Invalid demo password');
    }
    
    setIsLoading(false);
  };

  const testLogin = () => {
    console.log('Test login button clicked');
    const testToken = btoa(JSON.stringify({
      access: 'demo',
      timestamp: Date.now(),
      expires: Date.now() + (2 * 60 * 60 * 1000)
    }));
    localStorage.setItem('demoToken', testToken);
    console.log('Test token set, redirecting...');
    router.push('/live-demo');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">Live Demo Access</h1>
            <p className="text-gray-600">Enter the demo password to access the Stablecoin Bank Demo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Demo Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                  placeholder="Enter demo password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Accessing Demo...' : 'Access Live Demo'}
            </button>
          </form>

          {/* Test button for debugging */}
          <div className="mt-4">
            <button
              onClick={testLogin}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              🧪 Test Login (Skip Password)
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              <strong>Demo Password:</strong> demo2025
            </p>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-gray-500 hover:text-black transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 