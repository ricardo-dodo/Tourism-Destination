import React, { useState, useEffect } from 'react';

interface Recommendation {
  Place_Id: number;
  Place_Name: string;
  Category: string;
  Price: number;
  Similarity_Score: number;
}

interface RecommendationFormProps {
  onRecommendations: (data: Recommendation[]) => void;
}

interface Place {
  Place_Id: string;
  Place_Name: string;
}

const RecommendationForm: React.FC<RecommendationFormProps> = ({ onRecommendations }) => {
  const [placeId, setPlaceId] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    fetch('/api/places')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched places:', data);
        setPlaces(data);
      })
      .catch(error => console.error('Error fetching places:', error));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ place_id: placeId }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch recommendations');
      }
      const data = await res.json();
      onRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      onRecommendations([]);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred. Please try again later.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <label htmlFor="place_id" className="block text-sm font-medium text-gray-700">Select a place:</label>
      <select
        id="place_id"
        value={placeId}
        onChange={(e) => setPlaceId(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      >
        <option value="">Select a place</option>
        {places.map((place) => (
          <option key={place.Place_Id} value={place.Place_Id}>
            {place.Place_Name}
          </option>
        ))}
      </select>
      <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
        Get Recommendations
      </button>
    </form>
  );
};

export default RecommendationForm;