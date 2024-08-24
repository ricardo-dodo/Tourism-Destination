import React from 'react';

interface RecommendationListProps {
  recommendations: string[];
}

const RecommendationList: React.FC<RecommendationListProps> = ({ recommendations }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Recommended Destinations</h2>
      <ul className="list-disc pl-5">
        {recommendations.map((place, index) => (
          <li key={index} className="mb-2">{place}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendationList;