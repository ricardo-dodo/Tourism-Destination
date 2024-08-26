import React from 'react';

interface Recommendation {
  Place_Id: number;
  Place_Name: string;
  Category: string;
  Price: number;
  Similarity_Score: number;
}

interface RecommendationListProps {
  recommendations: Recommendation[];
}

const RecommendationList: React.FC<RecommendationListProps> = ({ recommendations }) => {
  const formatPrice = (price: number): string => {
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    return formatter.format(price);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Recommended Destinations</h2>
      {recommendations.length > 0 ? (
        <ul className="space-y-4">
          {recommendations.map((place) => (
            <li key={place.Place_Id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold">{place.Place_Name}</h3>
              <p className="text-gray-600">Category: {place.Category}</p>
              <p className="text-gray-600">Price: {formatPrice(place.Price)}</p>
              <p className="text-gray-600">Similarity Score: {(place.Similarity_Score * 100).toFixed(2)}%</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recommendations available.</p>
      )}
    </div>
  );
};

export default RecommendationList;