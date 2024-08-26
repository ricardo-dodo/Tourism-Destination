import React, { useState } from 'react';
import RecommendationForm from '../components/RecommendationForm';
import RecommendationList from '../components/RecommendationList';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Recommendation {
  Place_Id: number;
  Place_Name: string;
  Category: string;
  Price: number;
  Similarity_Score: number;
}

const GetRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const handleRecommendations = (data: Recommendation[]) => {
    setRecommendations(data);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 space-y-8"
    >
      <header className="text-center">
        <h1 className="text-5xl font-bold mb-4 text-blue-600">Get Your Recommendations</h1>
        <p className="text-xl text-gray-600">Find your perfect destination based on your preferences.</p>
        <Link href="/" className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Back to Home
        </Link>
      </header>
      
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-blue-500">Get Recommendations</h2>
          <RecommendationForm onRecommendations={handleRecommendations} />
        </section>
        <section className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-blue-500">Recommended Destinations</h2>
          <RecommendationList recommendations={recommendations} />
        </section>
      </main>
    </motion.div>
  );
};

export default GetRecommendations;