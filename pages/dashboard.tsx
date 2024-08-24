import React from 'react';
import Dashboard from '../components/Dashboard';
import { motion } from 'framer-motion';

const DashboardPage: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-8"
    >
      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
        Tourism Insights Dashboard
      </h1>
      <Dashboard />
    </motion.div>
  );
};

export default DashboardPage;