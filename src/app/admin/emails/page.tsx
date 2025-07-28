'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Download, Mail, Calendar, FileText } from 'lucide-react';

interface EmailData {
  email: string;
  fileName: string;
  timestamp: string;
  userAgent: string;
  ip: string;
}

export default function AdminEmailsPage() {
  const [emails, setEmails] = useState<EmailData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmails();
  }, []);

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
      'Email,File Name,Timestamp,IP Address',
      ...emails.map(email => 
        `"${email.email}","${email.fileName}","${email.timestamp}","${email.ip}"`
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
              {emails.length} emails collected from research paper access
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
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
                    {new Set(emails.map(e => e.fileName)).size}
                  </p>
                  <p className="text-gray-400">Papers Accessed</p>
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
                <Calendar className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {emails.length > 0 ? new Date(emails[0].timestamp).toLocaleDateString() : 'N/A'}
                  </p>
                  <p className="text-gray-400">Latest Collection</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Email List */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">Collected Emails</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left p-4 text-gray-300 font-semibold">Email</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Paper</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Date</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {emails.map((email, index) => (
                    <motion.tr 
                      key={index}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="p-4 text-white font-mono text-sm">{email.email}</td>
                      <td className="p-4 text-gray-300">{email.fileName}</td>
                      <td className="p-4 text-gray-300">
                        {new Date(email.timestamp).toLocaleString()}
                      </td>
                      <td className="p-4 text-gray-400 font-mono text-sm">{email.ip}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {emails.length === 0 && (
              <div className="p-12 text-center">
                <Mail className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-xl">No emails collected yet</p>
                <p className="text-gray-500 mt-2">Emails will appear here when users access research papers</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 