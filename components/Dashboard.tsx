import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PieController, ArcElement } from 'chart.js';
import dynamic from 'next/dynamic';
import ClusterList from './ClusterList';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PieController, ArcElement);

const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

function calculateMapBounds(mapData: any[]): { center: [number, number]; zoom: number } {
  if (!mapData || mapData.length === 0) return { center: [0, 0], zoom: 2 };

  const lats = mapData.map(place => place.lat);
  const lngs = mapData.map(place => place.lng);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const center: [number, number] = [(minLat + maxLat) / 2, (minLng + maxLng) / 2];
  const latDiff = maxLat - minLat;
  const lngDiff = maxLng - minLng;
  const maxDiff = Math.max(latDiff, lngDiff);

  let zoom = 2;
  if (maxDiff < 1) zoom = 10;
  else if (maxDiff < 5) zoom = 8;
  else if (maxDiff < 10) zoom = 6;
  else if (maxDiff < 20) zoom = 5;
  else if (maxDiff < 50) zoom = 4;
  else if (maxDiff < 100) zoom = 3;

  return { center, zoom };
}

const Dashboard: React.FC = () => {
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([]);
  const [priceRanges, setPriceRanges] = useState<{ min: number; max: number }[]>([]);
  const [mapData, setMapData] = useState<any>(null);
  const [topRatedPlaces, setTopRatedPlaces] = useState<{ name: string; rating: number }[]>([]);
  const [ageDistribution, setAgeDistribution] = useState<{ [key: string]: number }>({});
  const [mapBounds, setMapBounds] = useState<{ center: [number, number]; zoom: number }>({ center: [0, 0], zoom: 2 });
  const [clusters, setClusters] = useState([]);
  const [activeTab, setActiveTab] = useState<'charts' | 'clusters'>('charts');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardResponse, clustersResponse] = await Promise.all([
          fetch('/api/dashboard-data'),
          fetch('/api/clusters')
        ]);

        if (!dashboardResponse.ok || !clustersResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const dashboardData = await dashboardResponse.json();
        const clustersData = await clustersResponse.json();

        setCategories(dashboardData.categories || []);
        setPriceRanges(dashboardData.priceRanges || []);
        setMapData(dashboardData.mapData || null);
        setTopRatedPlaces(dashboardData.topRatedPlaces || []);
        setAgeDistribution(dashboardData.ageDistribution || {});
        const bounds = calculateMapBounds(dashboardData.mapData || []);
        setMapBounds(bounds);
        setClusters(clustersData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setCategories([]);
        setPriceRanges([]);
        setMapData(null);
        setTopRatedPlaces([]);
        setAgeDistribution({});
        setClusters([]);
      }
    };

    fetchData();
  }, []);

  const categoryData = {
    labels: categories.map(item => item.category),
    datasets: [{
      label: 'Number of Attractions per Category',
      data: categories.map(item => item.count),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  const priceRangeData = {
    labels: priceRanges.map(range => `${range.min} - ${range.max}`),
    datasets: [{
      label: 'Price Ranges',
      data: priceRanges.map(() => 1), // Placeholder data, replace with actual counts if available
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    }],
  };

  const topRatedData = {
    labels: topRatedPlaces.map(place => place.name),
    datasets: [{
      label: 'Rating',
      data: topRatedPlaces.map(place => place.rating),
      backgroundColor: 'rgba(255, 206, 86, 0.6)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: 1,
    }],
  };

  const ageDistributionData = {
    labels: Object.keys(ageDistribution),
    datasets: [{
      data: Object.values(ageDistribution),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-8">
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-lg ${activeTab === 'charts' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('charts')}
        >
          Charts
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${activeTab === 'clusters' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('clusters')}
        >
          Clusters
        </button>
      </div>
      {activeTab === 'charts' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-pink-600">Top 10 Categories</h2>
            <div className="h-80">
              {categories.length > 0 ? (
                <Bar data={categoryData} options={chartOptions} />
              ) : (
                <p>Loading category data...</p>
              )}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Price Range Distribution</h2>
            <div className="h-80">
              {priceRanges.length > 0 ? (
                <Bar data={priceRangeData} options={chartOptions} />
              ) : (
                <p>Loading price range data...</p>
              )}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-green-600">Tourism Destination Map</h2>
            <div className="h-80">
              {mapData ? (
                <MapComponent mapData={mapData} mapBounds={mapBounds} />
              ) : (
                <p>Loading map data...</p>
              )}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-yellow-600">Top 10 Rated Places</h2>
            <div className="h-80">
              {topRatedPlaces.length > 0 ? (
                <Bar data={topRatedData} options={chartOptions} />
              ) : (
                <p>Loading top rated places data...</p>
              )}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-purple-600">Age Distribution of Visitors</h2>
            <div className="h-80">
              {Object.keys(ageDistribution).length > 0 ? (
                <Pie data={ageDistributionData} options={{ responsive: true, maintainAspectRatio: false }} />
              ) : (
                <p>Loading age distribution data...</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <ClusterList clusters={clusters} />
      )}
    </div>
  );
};

export default Dashboard;