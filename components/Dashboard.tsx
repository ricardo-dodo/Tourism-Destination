import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PieController, ArcElement } from 'chart.js';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PieController, ArcElement);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard-data');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setCategories(data.categories || []);
        setPriceRanges(data.priceRanges || []);
        setMapData(data.mapData || null);
        setTopRatedPlaces(data.topRatedPlaces || []);
        setAgeDistribution(data.ageDistribution || {});
        const bounds = calculateMapBounds(data.mapData || []);
        setMapBounds(bounds);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setCategories([]);
        setPriceRanges([]);
        setMapData(null);
        setTopRatedPlaces([]);
        setAgeDistribution({});
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Fix Leaflet icon issue
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
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
            <MapContainer center={mapBounds.center} zoom={mapBounds.zoom} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {mapData.map((place: any) => (
                <Marker 
                  key={place.id} 
                  position={[place.lat, place.lng]}
                  icon={new L.Icon({
                    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                  })}
                >
                  <Popup>
                    <div>
                      <h3 className="font-bold">{place.name}</h3>
                      <p>Category: {place.category}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
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
  );
};

export default Dashboard;