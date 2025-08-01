'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Star,
  CheckCircle,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Clock,
  DollarSign
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  features: string[];
  category: string;
  rating: number;
  reviews: number;
  users: number;
  launchDate: string;
}

export default function ProductsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const router = useRouter();

  // Mock product data
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'AI Signal Platform',
      description: 'Advanced AI-powered market signal detection and analysis platform',
      longDescription: 'Our flagship AI Signal Platform leverages cutting-edge machine learning algorithms to detect market signals before they become obvious. Built for institutional traders and hedge funds, this platform provides real-time analysis across multiple asset classes with 99.7% accuracy.',
      price: 2999,
      features: [
        'Real-time market signal detection',
        'Multi-asset class analysis',
        'Advanced ML algorithms',
        'Institutional-grade security',
        '24/7 monitoring',
        'Custom alert system',
        'API integration',
        'White-label solutions'
      ],
      category: 'AI/ML',
      rating: 4.9,
      reviews: 127,
      users: 2347,
      launchDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Blockchain Analytics Suite',
      description: 'Comprehensive blockchain data analysis and visualization tools',
      longDescription: 'The Blockchain Analytics Suite provides deep insights into blockchain networks, DeFi protocols, and cryptocurrency markets. Track whale movements, analyze protocol performance, and identify emerging trends with our comprehensive data platform.',
      price: 1999,
      features: [
        'Multi-chain analytics',
        'Whale tracking',
        'DeFi protocol analysis',
        'Real-time data feeds',
        'Custom dashboards',
        'Historical data access',
        'Risk assessment tools',
        'Portfolio tracking'
      ],
      category: 'Blockchain',
      rating: 4.8,
      reviews: 89,
      users: 1567,
      launchDate: '2024-02-01'
    },
    {
      id: '3',
      name: 'DeFi Risk Assessment',
      description: 'Real-time DeFi protocol risk analysis and scoring system',
      longDescription: 'Stay ahead of DeFi risks with our comprehensive risk assessment platform. Monitor protocol health, liquidity metrics, and smart contract vulnerabilities in real-time. Protect your investments with institutional-grade risk management tools.',
      price: 1499,
      features: [
        'Protocol health monitoring',
        'Liquidity analysis',
        'Smart contract auditing',
        'Risk scoring algorithms',
        'Alert system',
        'Historical risk data',
        'Portfolio risk assessment',
        'Regulatory compliance'
      ],
      category: 'DeFi',
      rating: 4.7,
      reviews: 56,
      users: 892,
      launchDate: '2024-02-10'
    }
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const response = await fetch('/api/admin/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setProducts(mockProducts);
      } else {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      }
    } catch (error) {
      localStorage.removeItem('adminToken');
      router.push('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToAdmin = () => {
    router.push('/admin');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-black">Loading products...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToAdmin}
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Admin</span>
            </button>
          </div>
          <motion.div 
            className="text-2xl font-black text-black"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Birdai Products
          </motion.div>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl font-bold text-black mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Our Products
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Cutting-edge AI and blockchain solutions designed for institutional investors and forward-thinking organizations.
            </motion.p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => setSelectedProduct(product)}
              >
                {/* Product Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-black text-white text-sm rounded-full">
                      {product.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      {renderStars(product.rating)}
                      <span className="text-sm text-gray-600 ml-1">({product.reviews})</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="text-3xl font-bold text-black mb-4">
                    {formatPrice(product.price)}
                    <span className="text-sm font-normal text-gray-500">/month</span>
                  </div>
                </div>

                {/* Product Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{product.users.toLocaleString()} users</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Launched {new Date(product.launchDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Key Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-black mb-3">Key Features:</h4>
                  <div className="space-y-2">
                    {product.features.slice(0, 4).map((feature, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors">
                  Learn More
                </button>
              </motion.div>
            ))}
          </div>

          {/* Why Choose Birdai */}
          <motion.div 
            className="mt-20 bg-gray-50 rounded-2xl p-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">Why Choose Birdai?</h2>
              <p className="text-xl text-gray-600">Built by industry experts for institutional-grade performance</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-black text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">Lightning Fast</h3>
                <p className="text-gray-600">Real-time processing with sub-millisecond latency for critical trading decisions.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-black text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">Enterprise Security</h3>
                <p className="text-gray-600">Bank-grade security with SOC 2 compliance and end-to-end encryption.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-black text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">Proven Results</h3>
                <p className="text-gray-600">Trusted by leading hedge funds and financial institutions worldwide.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-black mb-2">{selectedProduct.name}</h2>
                <p className="text-gray-600">{selectedProduct.description}</p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-black mb-4">Description</h3>
                <p className="text-gray-700 mb-6">{selectedProduct.longDescription}</p>
                
                <h3 className="text-xl font-semibold text-black mb-4">Features</h3>
                <div className="grid grid-cols-1 gap-2">
                  {selectedProduct.features.map((feature, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-4xl font-bold text-black mb-2">
                    {formatPrice(selectedProduct.price)}
                    <span className="text-lg font-normal text-gray-500">/month</span>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center space-x-1">
                        {renderStars(selectedProduct.rating)}
                        <span className="text-sm text-gray-600 ml-1">({selectedProduct.reviews} reviews)</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Active Users:</span>
                      <span className="font-semibold">{selectedProduct.users.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Launch Date:</span>
                      <span className="font-semibold">{new Date(selectedProduct.launchDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 