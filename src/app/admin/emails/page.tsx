'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Download, Mail, Calendar, FileText } from 'lucide-react';

interface EmailData {
  email: string;
  fileName: string;
  source: string;
  name: string;
  company: string;
  message: string;
  timestamp: string;
  userAgent: string;
  ip: string;
}

export default function AdminEmailsPage() {
  const [emails, setEmails] = useState<EmailData[]>([]);
  const [filteredEmails, setFilteredEmails] = useState<EmailData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'research' | 'contact'>('all');

  useEffect(() => {
    fetchEmails();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredEmails(emails);
    } else if (filter === 'research') {
      setFilteredEmails(emails.filter(email => email.source === 'research_paper'));
    } else if (filter === 'contact') {
      setFilteredEmails(emails.filter(email => email.source === 'contact_form'));
    }
  }, [emails, filter]);

  const fetchEmails = async () => {
    try {
      const response = await fetch('/api/admin/emails');
      if (response.ok) {
        const data = await response.json();
        setEmails(data.emails || []);
      } else {
        setError('Failed to fetch emails');
      }
    } catch (error) {
      setError('Failed to fetch emails');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadEmails = () => {
    const csvContent = [
      'Email,Source,Name,Company,Message,File Name,Timestamp,IP Address',
      ...filteredEmails.map(email => 
        `"${email.email}","${email.source}","${email.name}","${email.company}","${email.message}","${email.fileName}","${email.timestamp}","${email.ip}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-emails-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading emails...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation Header */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-md border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>
            
            <div className="text-2xl font-bold text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Email Collection
              </span>
            </div>
            
            <button
              onClick={downloadEmails}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-full text-sm shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Research Email Collection
            </h1>
            <p className="text-xl text-gray-300">
              {emails.length} total emails collected
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <motion.div 
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <Mail className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{emails.length}</p>
                  <p className="text-gray-400">Total Emails</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {emails.filter(e => e.source === 'research_paper').length}
                  </p>
                  <p className="text-gray-400">Research Papers</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {emails.filter(e => e.source === 'contact_form').length}
                  </p>
                  <p className="text-gray-400">Join the Signal</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center space-x-3">
                <Calendar className="w-8 h-8 text-orange-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {emails.length > 0 ? new Date(emails[0].timestamp).toLocaleDateString() : 'N/A'}
                  </p>
                  <p className="text-gray-400">Latest Collection</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center mb-8 space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                filter === 'all' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              All ({emails.length})
            </button>
            <button
              onClick={() => setFilter('research')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                filter === 'research' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Research Papers ({emails.filter(e => e.source === 'research_paper').length})
            </button>
            <button
              onClick={() => setFilter('contact')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                filter === 'contact' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Join the Signal ({emails.filter(e => e.source === 'contact_form').length})
            </button>
          </div>

          {/* Email List */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">
                {filter === 'all' ? 'All Collected Emails' : 
                 filter === 'research' ? 'Research Paper Emails' : 
                 'Join the Signal Emails'} ({filteredEmails.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left p-4 text-gray-300 font-semibold">Email</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Source</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Name</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Company</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Date</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmails.map((email, index) => (
                    <motion.tr 
                      key={index}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="p-4 text-white font-mono text-sm">{email.email}</td>
                      <td className="p-4 text-gray-300">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          email.source === 'research_paper' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-purple-500/20 text-purple-400'
                        }`}>
                          {email.source === 'research_paper' ? 'Research' : 'Contact'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">{email.name || '-'}</td>
                      <td className="p-4 text-gray-300">{email.company || '-'}</td>
                      <td className="p-4 text-gray-300">
                        {new Date(email.timestamp).toLocaleString()}
                      </td>
                      <td className="p-4 text-gray-400 font-mono text-sm">{email.ip}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredEmails.length === 0 && (
              <div className="p-12 text-center">
                <Mail className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-xl">
                  {filter === 'all' ? 'No emails collected yet' :
                   filter === 'research' ? 'No research paper emails yet' :
                   'No contact form emails yet'}
                </p>
                <p className="text-gray-500 mt-2">
                  {filter === 'all' ? 'Emails will appear here when users interact with your site' :
                   filter === 'research' ? 'Emails will appear here when users access research papers' :
                   'Emails will appear here when users submit the contact form'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 