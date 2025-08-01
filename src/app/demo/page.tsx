'use client';

import { Dashboard } from '../live-demo/components/Dashboard';

export default function Demo() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">Stablecoin Bank Demo (Sui)</h1>
          <a
            href="/"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Home
          </a>
        </div>
        <Dashboard />
      </div>
    </div>
  );
} 