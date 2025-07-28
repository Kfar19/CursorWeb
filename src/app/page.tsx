'use client';

import { useState } from 'react';
import { 
  Menu, 
  X, 
  Brain, 
  Zap, 
  Twitter,
  Linkedin,
  Github,
  Mail,
  TrendingUp,
  Shield,
  Network,
  Code
} from 'lucide-react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-md border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-white">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Birdai
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
              <a href="#mission" className="text-gray-300 hover:text-white transition-colors">Mission</a>
              <a href="#team" className="text-gray-300 hover:text-white transition-colors">Team</a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/50 backdrop-blur-md rounded-lg mt-2">
                <a href="#home" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">Home</a>
                <a href="#mission" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">Mission</a>
                <a href="#team" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">Team</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            See What Others
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Miss
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-4 font-mono">
            Machine-native. Protocol-first. Liquidity-aware.
          </p>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            A structural shift is happening.
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Don&apos;t miss this cycle.
            </span>
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
            Join the Signal
          </button>
        </div>
      </section>

      {/* Coding Capital Section */}
      <section id="mission" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Coding Capital
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              The fastest-growing asset class isn&apos;t just emerging—it&apos;s rewriting the rules. Are you inside the system, or watching it evolve from the outside?
            </p>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 max-w-2xl mx-auto">
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">
                $3.25T
              </p>
              <p className="text-gray-300">
                Private markets growth from negligible size in 2013 to over $3.25 trillion in 2025
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Eats Data Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              AI Eats Data, Spews Decisions
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Legacy VCs are scrambling to adapt. Traditional firms can&apos;t scale signal — we can.
            </p>
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 max-w-2xl mx-auto">
              <p className="text-2xl font-bold text-red-400 mb-2">13%</p>
              <p className="text-gray-300">of VC funds return more than 2x DPI after 10 years</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Now Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Now: Birdai Is Built for This Moment
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="text-left">
                <p className="text-xl text-gray-300 mb-4">
                  Capital is becoming code. Balance sheets are turning into networks.
                </p>
                <p className="text-xl text-gray-300">
                  Signal is no longer human-limited. AI scales it, compounds it, and deploys it.
                </p>
              </div>
              <div className="text-left">
                <p className="text-xl text-gray-300 mb-4">
                  The last cycle rewarded early conviction in emerging infrastructure. Few were positioned to capture it.
                </p>
                <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 font-semibold">
                  This time it&apos;s bigger: AI-native capital infrastructure is here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 text-center">
            This Cycle Is Different
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Better Tooling</h3>
              <p className="text-gray-300">
                AI + on-chain infrastructure enables unprecedented deal discovery and execution.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Proven Exits</h3>
              <p className="text-gray-300">
                Real founder demand with demonstrated liquidity events and regulatory momentum.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Fundamental Execution</h3>
              <p className="text-gray-300">
                Where legacy firms add headcount, we add code. Scalable, intelligent, and aligned from day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              A software-powered venture platform that turns sourcing, diligence, and capital deployment into a repeatable, data-driven process.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-white">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full p-3">
                <Network className="w-6 h-6" />
              </div>
              <span className="ml-3 text-lg font-semibold">Signal</span>
            </div>
            <div className="text-gray-400">→</div>
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-full p-3">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="ml-3 text-lg font-semibold">Score</span>
            </div>
            <div className="text-gray-400">→</div>
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full p-3">
                <Shield className="w-6 h-6" />
              </div>
              <span className="ml-3 text-lg font-semibold">Structure</span>
            </div>
            <div className="text-gray-400">→</div>
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full p-3">
                <Zap className="w-6 h-6" />
              </div>
              <span className="ml-3 text-lg font-semibold">Allocate</span>
            </div>
            <div className="text-gray-400">→</div>
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full p-3">
                <Brain className="w-6 h-6" />
              </div>
              <span className="ml-3 text-lg font-semibold">Monitor</span>
            </div>
          </div>
          
          <div className="text-center mt-8">
            {/* Removed: 52% of Fund I deals were AI-sourced */}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Meet the Team
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Kevin Farrelly */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">Kevin Farrelly</h3>
              <p className="text-gray-300 mb-4">
                Kevin is a repeat founder and investor at the intersection of machine learning, venture, and crypto. 
                He previously founded a machine learning credit fund acquired by Franklin Templeton in 2018, where 
                he subsequently launched and led Blockchain Venture Funds I and II, delivering top-decile DPI returns.
              </p>
              <p className="text-gray-300 mb-4">
                With over 15 years of hands-on experience scaling fintech and consumer companies—focusing on CAC 
                optimization, margin expansion, and data science—Kevin specializes in early-stage investing, token 
                economics, and ML infrastructure.
              </p>
              <p className="text-gray-400 text-sm">BSBA from the University of Richmond</p>
            </div>

            {/* Greg Scanlon */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">Greg Scanlon</h3>
              <p className="text-gray-300 mb-4">
                Greg is a seasoned investor and technologist operating at the intersection of blockchain, data science, 
                and institutional capital. He co-founded Franklin Templeton&apos;s Blockchain Venture Funds I and II, and 
                brings over 15 years of experience in investing and risk management from leading firms such as Citadel 
                and Orange Capital.
              </p>
              <p className="text-gray-300 mb-4">
                Greg is also an active mentor and advisor across multiple top universities.
              </p>
              <p className="text-gray-400 text-sm">BSBA from the University of Richmond, MS in Data Science from NYU, CFA charterholder</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="text-2xl font-bold text-white mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Birdai
                </span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Machine-native. Protocol-first. Liquidity-aware. See what others miss.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <Github className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <Mail className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Signal</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Score</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Structure</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Allocate</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Team</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Deals</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Birdai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
