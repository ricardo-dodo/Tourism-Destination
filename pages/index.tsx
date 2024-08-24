import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-8 space-y-12"
    >
      <header className="text-center">
        <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          Tourism Destination Recommendation System
        </h1>
        <p className="text-2xl text-gray-600 mb-8">Discover your next adventure with our AI-powered recommendation engine.</p>
        <div className="space-x-4">
          <Link href="/recommend" className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">
            Get Recommendations
          </Link>
          <Link href="/dashboard" className="inline-block bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-green-600 hover:to-teal-700 transition-all transform hover:scale-105">
            View Dashboard
          </Link>
        </div>
      </header>
    </motion.div>
  );
};

export default Home;