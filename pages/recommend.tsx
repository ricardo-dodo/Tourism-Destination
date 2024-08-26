import React, { useState } from 'react';
import RecommendationForm from '../components/RecommendationForm';
import RecommendationList from '../components/RecommendationList';
import { motion } from 'framer-motion';

interface Recommendation {
  Place_Id: number;
  Place_Name: string;
  Category: string;
  Price: number;
  Similarity_Score: number;
}

const Recommend: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const handleRecommendations = (data: Recommendation[]) => {
    setRecommendations(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-8"
    >
      <h1 className="text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
        Get Your Recommendations
      </h1>
      <div className="max-w-2xl mx-auto">
        <RecommendationForm onRecommendations={handleRecommendations} />
        {recommendations.length > 0 && <RecommendationList recommendations={recommendations} />}
      </div>
    </motion.div>
  );
};

export default Recommend;